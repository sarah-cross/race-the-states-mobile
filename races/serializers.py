from rest_framework import serializers
from .models import State, Race, RaceImage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'  # Include all fields in the model



class RaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaceImage
        fields = ['id', 'image', 'uploaded_at']


class RaceSerializer(serializers.ModelSerializer):
    state = serializers.PrimaryKeyRelatedField(
        queryset=State.objects.all(),
        write_only=True
    )
    state_details = StateSerializer(source='state', read_only=True)
    race_images = RaceImageSerializer(many=True, read_only=True)
    image_uploads = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True, required=False
    )

    class Meta:
        model = Race
        fields = ['id', 'name', 'date', 'time', 'state', 'state_details', 'city', 'distance', 'notes', 'race_images', 'image_uploads']

    def create(self, validated_data):
        """Handle image uploads along with race creation."""
        images_data = validated_data.pop('image_uploads', [])  # Extract images if provided
        
        try:
            # ✅ First, create the race object in DB
            race = Race.objects.create(**validated_data)
            logger.info(f"✅ Race created successfully: {race}")

            # ✅ Then, handle images
            for image_data in images_data:
                RaceImage.objects.create(race=race, image=image_data)
                logger.info(f"✅ Image saved for race: {race}")

            return race
        except Exception as e:
            logger.error(f"❌ Error saving race: {str(e)}")
            raise serializers.ValidationError({"error": "Race could not be saved"})






    
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
