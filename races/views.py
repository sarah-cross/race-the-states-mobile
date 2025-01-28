from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes

from .models import State, Race, RaceImage
from .serializers import (
    StateSerializer,
    RaceSerializer,
    RaceImageSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
)

import logging

logger = logging.getLogger(__name__)

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

# REGISTER
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


# LOGIN
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


# GET USER PROFILE
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
            message=f"Hello,\n\nPlease use the link below to reset your password:\n\n{deep_link}\n\nIf you did not request this, please ignore this email.",
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
