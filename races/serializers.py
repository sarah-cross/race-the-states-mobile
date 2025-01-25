from rest_framework import serializers
from .models import State, Race, RaceImage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'  # Include all fields in the model

class RaceSerializer(serializers.ModelSerializer):
    state = StateSerializer() 

    class Meta:
        model = Race
        fields = '__all__'  # Include all fields in the model

class RaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaceImage
        fields = ['id', 'image', 'uploaded_at']
    
# In order to get name on login and send to dashboard 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name

        return token

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    races = RaceSerializer(many=True, source='race_set')  # Use the reverse relationship

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'races']
