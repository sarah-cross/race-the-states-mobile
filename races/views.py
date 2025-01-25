from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import State, Race, RaceImage
from .serializers import StateSerializer, RaceSerializer, RaceImageSerializer, UserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
import logging

logger = logging.getLogger(__name__)

# States
class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer

# Races
class RaceViewSet(viewsets.ModelViewSet):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer

# Race Images
class RaceImageViewSet(viewsets.ModelViewSet):
    queryset = RaceImage.objects.all()
    serializer_class = RaceImageSerializer

# Register
@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')
        logger.info(f"Request data: {request.data}") 

        if not first_name or not last_name or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a user
        user = User.objects.create_user(
            username=email,  # Use email as the username
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)


# Login
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')  # This will be their email
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "first_name": user.first_name,  # Add first name
            "last_name": user.last_name,    # Add last name
        }, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Get a user's profile 
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Serialize user data
        user_serializer = UserProfileSerializer(user)

        # Serialize races
        races = Race.objects.filter(user=user)
        races_serializer = RaceSerializer(races, many=True)

        # Add serialized races to the user profile data
        user_data = user_serializer.data
        user_data['races'] = races_serializer.data

        return Response(user_data)

# Forgot password
class PasswordResetView(APIView):
    permission_classes = [AllowAny]  # No authentication required to reset password

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the user exists
            user = User.objects.get(email=email)

            # Generate a random reset token
            reset_token = get_random_string(length=32)

            # Save the token in the Profile model
            user.profile.reset_token = reset_token
            user.profile.save()

            # Generate the reset link (replace with your app's deep link or frontend URL)
            reset_link = f'racethestates://reset-password/{reset_token}'

            # Send the email
            send_mail(
                'Password Reset Request',
                f'Hi {user.username},\n\nYou requested to reset your password. Click the link below to reset it:\n\n{reset_link}\n\nIf you didn’t request this, please ignore this email.',
                'racethestatesapp@gmail.com',  # Replace with your sender email
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error sending email:", e)
            return Response({'error': 'Failed to send email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Confirm Password Reset
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')

        if not token or not new_password:
            return Response({'error': 'Token and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Find the user by token
            profile = Profile.objects.get(reset_token=token)
            user = profile.user

            # Update the user's password
            user.set_password(new_password)
            user.save()

            # Clear the reset token
            profile.reset_token = None
            profile.save()

            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)