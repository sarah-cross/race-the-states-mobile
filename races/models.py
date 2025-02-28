from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    reset_token = models.CharField(max_length=32, null=True, blank=True)

    def __str__(self):
        return self.user.username


class State(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=2)
    region = models.CharField(max_length=100)
    region_color = models.CharField(max_length=7, blank=True, null=True)
    subregion = models.CharField(max_length=100, blank=True, null=True)
    svg_path = models.TextField(blank=True, null=True)  # ✅ Store SVG path directly

    def __str__(self):
        return self.name



class DistanceChoices(models.TextChoices):
    FIVE_K = '5k', '5k'
    TEN_K = '10k', '10k'
    HALF_MARATHON = 'half marathon', 'Half Marathon'
    MARATHON = 'marathon', 'Marathon'

DISTANCE_TO_MILES = {
    DistanceChoices.FIVE_K: 3.1,
    DistanceChoices.TEN_K: 6.2,
    DistanceChoices.HALF_MARATHON: 13.1,
    DistanceChoices.MARATHON: 26.2,
}

class Race(models.Model):
    name = models.CharField(max_length=255)  # Required
    date = models.DateField(db_index=True)
    time = models.DurationField()  # Required
    state = models.ForeignKey('State', on_delete=models.CASCADE, db_index=True, related_name='races')  # Required
    city = models.CharField(max_length=100, blank=True, null=True)  # Optional
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, db_index=True, related_name='races')  # Link to User
    distance = models.CharField(
        max_length=20,
        choices=DistanceChoices.choices,
        blank=True,
        null=True,
        default=DistanceChoices.HALF_MARATHON,
    )
    notes = models.TextField(blank=True, null=True)  # Optional

    def get_miles(self):
        """Returns the miles equivalent of the race distance."""
        return DISTANCE_TO_MILES.get(self.distance, 0) or None # Defaults to 0 if distance is not set

    def __str__(self):
        return f"{self.name} - {self.state.abbreviation}"

    
class RaceImage(models.Model):
    race = models.ForeignKey('Race', on_delete=models.CASCADE, related_name='race_images')
    image = models.ImageField(upload_to='race_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.race.name}"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)  # Create a Profile for new Users
    else:
        # Explicitly update Profile fields if needed
        profile = instance.profile
        profile.save()  # Save any updates to the Profile

