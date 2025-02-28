from rest_framework import serializers
from .models import State, Race, RaceImage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'  # Include all fields in the model


class RaceSerializer(serializers.ModelSerializer):
    state = serializers.PrimaryKeyRelatedField(
        queryset=State.objects.all(),
        write_only=True  # Only used when creating a new race (POST)
    )
    state_details = StateSerializer(source='state', read_only=True)  # Used when retrieving race details (GET)

    class Meta:
        model = Race
        fields = ['id', 'name', 'date', 'time', 'state', 'state_details', 'city', 'distance', 'notes']




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
