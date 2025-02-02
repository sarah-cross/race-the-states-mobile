from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import permission_classes, api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.db.models import Count, Avg, Min
from django.http import JsonResponse


import jwt  # Required for Facebook authentication token decoding
import requests  # Used for API calls (Google, Facebook)
import os
import logging
import hashlib
import hmac

from google.oauth2 import id_token
from google.auth.transport.requests import Request  

from rest_framework_simplejwt.views import TokenObtainPairView

from .models import State, Race, RaceImage
from .serializers import (
    StateSerializer,
    RaceSerializer,
    RaceImageSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
)


# Set up logging
logger = logging.getLogger(__name__)

# Load user
User = get_user_model()

# Load Google Client ID
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    print("❌ GOOGLE_CLIENT_ID is NOT LOADED in views.py")
else:
    print("✅ GOOGLE_CLIENT_ID Loaded in views.py:", GOOGLE_CLIENT_ID)



# ---------------------------- #
# STATE, RACE, IMAGE ENDPOINTS #
# ---------------------------- #

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer


class RaceViewSet(viewsets.ModelViewSet):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer


class RaceImageViewSet(viewsets.ModelViewSet):
    queryset = RaceImage.objects.all()
    serializer_class = RaceImageSerializer

# ---------------------------- #
# AUTHENTICATION VIEWS         #
# ---------------------------- #

# REGISTER WITH EMAIL
@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        password = request.data.get("password")

        if not all([first_name, last_name, email, password]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(
            username=email, password=password, email=email, first_name=first_name, last_name=last_name
        )
        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)


# LOGIN WITH EMAIL
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")  # Change to email since username is stored as email
        password = request.data.get("password")

        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=status.HTTP_200_OK,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# USER PROFILE
##### CHANGING THIS SO WE CAN CALCULATE ALL DASHBOARD DATA ON THE BACKEND INSTEAD OF FRONT
##### PROBABLY WON'T NEED THIS ONE AFTER
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_serializer = UserProfileSerializer(user)
        races = Race.objects.filter(user=user)
        races_serializer = RaceSerializer(races, many=True)

        user_data = user_serializer.data
        user_data["races"] = races_serializer.data

        return Response(user_data)


# DASHBOARD
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    print("🛠️ Request User:", request.user)

    # Ensure user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is not authenticated"}, status=401)

    # Get all races completed by the user
    races = (
        Race.objects.filter(user=request.user)
        .select_related('state')
        .order_by('date')
        .values('state__name', 'state__region', 'name', 'date')
    )

    races_list = [
        {
            "state": race["state__name"],
            "region": race["state__region"],
            "race_name": race["name"],
            "date": race["date"],
        }
        for race in races
    ]

    # Get all completed states
    completed_states = State.objects.filter(race__user=request.user).distinct().values("name", "region")
    completed_states_list = list(completed_states)  # Convert QuerySet to a list

    # Get all states with names and regions
    all_states = list(State.objects.values("name", "region"))

    # Progress by Region
    regions = ['West', 'Midwest', 'South', 'Northeast']
    region_completion = {
        region: State.objects.filter(race__user=request.user, region=region).distinct().count()
        for region in regions
    }

    # Average Race Times
    avg_times = (
        Race.objects.filter(user=request.user)
        .values('state__region')
        .annotate(avg_time=Avg('time'))
    )
    average_race_times = {entry['state__region']: entry['avg_time'] for entry in avg_times}

    # Construct JSON response with completed states
    data = {
        "total_states_completed": len(completed_states_list),  # Send actual length
        "completed_states": completed_states_list, 
        "all_states": all_states,
        "progress_by_region": region_completion,
        "average_race_times": average_race_times,
        "timeline": races_list,
    }

    print("✅ Completed States:", completed_states_list)  # Debugging log

    return JsonResponse(data)


# ---------------------------- #
# PASSWORD RESET FUNCTIONALITY #
# ---------------------------- #

# PASSWORD RESET - SEND EMAIL
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Generate token & UID
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Construct deep link
        deep_link = f"racethestates://reset-password/{uid}/{token}"

        # Send email
        send_mail(
            subject="Password Reset Request",
            message=f"Hi there!\n\nPlease use the link below to reset your password:\n\n{deep_link}\n\nIf you did not request this, please ignore this email.",
            from_email="racethestatesapp@gmail.com",
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent!"}, status=status.HTTP_200_OK)


# PASSWORD RESET - VALIDATE TOKEN
class PasswordResetValidateTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = str(urlsafe_base64_decode(uidb64), "utf-8")
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Token is valid", "user_id": user.id}, status=status.HTTP_200_OK)


# PASSWORD RESET - UPDATE PASSWORD
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        new_password = request.data.get("password")

        if not new_password:
            return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = str(urlsafe_base64_decode(uidb64), "utf-8")
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Update password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)



# ---------------------------- #
# GOOGLE AUTH                  #
# ---------------------------- #

class GoogleAuthAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_adapter = Request()
            idinfo = id_token.verify_oauth2_token(token, request_adapter, GOOGLE_CLIENT_ID)

            email = idinfo.get("email")
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")

            # Check if user exists
            user, created = User.objects.get_or_create(email=email, defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
            })

            # Generate token for user
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)




# ---------------------------- #
# FACEBOOK AUTH                #
# ---------------------------- #

@method_decorator(csrf_exempt, name='dispatch')
class FacebookAuthAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info("🔹 Facebook login request received")
        token = request.data.get("token")

        if not token:
            logger.error("❌ Missing authentication token")
            return Response({"error": "Token is required"}, status=400)

        try:
            # Decode the Facebook authentication token locally
            decoded_token = jwt.decode(token, options={"verify_signature": False})  # Limited Login tokens are JWTs
            logger.info("🔹 Decoded Facebook Token:", decoded_token)

            facebook_id = decoded_token.get("sub")  # "sub" contains the user ID
            email = decoded_token.get("email", f"{facebook_id}@facebook.com")
            first_name = decoded_token.get("given_name", "")  # Try fetching first name
            last_name = decoded_token.get("family_name", "")  # Try fetching last name

            # If first/last name are empty, use fallback values
            if not first_name:
                first_name = decoded_token.get("name", "").split(" ")[0] if "name" in decoded_token else "Facebook"
            if not last_name:
                last_name = decoded_token.get("name", "").split(" ")[1] if "name" in decoded_token and " " in decoded_token["name"] else "User"

            logger.info(f"✅ Extracted User Info: {first_name} {last_name} ({email})")

            if not facebook_id:
                logger.error("❌ Failed to extract user_id from token")
                return Response({"error": "Invalid Facebook token"}, status=400)

            # Check if user exists
            user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.create(
                    email=email, username=email, first_name=first_name, last_name=last_name
                )

            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            logger.info("✅ Generated Authentication Token:", refresh.access_token)  # Debugging

            return Response({
                "access": str(refresh.access_token),
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
            }, status=200)

        except Exception as e:
            logger.error("❌ Error in Facebook authentication:", str(e))
            return Response({"error": str(e)}, status=500)
