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
    name = models.CharField(max_length=100)  # e.g., "California"
    abbreviation = models.CharField(max_length=2)  # e.g., "CA"
    region = models.CharField(max_length=100)  # e.g., "West"
    subregion = models.CharField(max_length=100, blank=True, null=True)  # e.g., "Pacific Coast"
    svg_file = models.FileField(upload_to='svgs/', blank=True, null=True)  # Path for SVG files

    def __str__(self):
        return self.name


class DistanceChoices(models.TextChoices):
    FIVE_K = '5k', '5k'
    TEN_K = '10k', '10k'
    HALF_MARATHON = 'half marathon', 'Half Marathon'
    MARATHON = 'marathon', 'Marathon'

class Race(models.Model):
    name = models.CharField(max_length=255)  # Required
    date = models.DateField()
    time = models.DurationField()  # Required
    state = models.ForeignKey('State', on_delete=models.CASCADE)  # Required
    city = models.CharField(max_length=100, blank=True, null=True)  # Optional
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)  # Link to User
    distance = models.CharField(
        max_length=20,
        choices=DistanceChoices.choices,
        blank=True,
        null=True,
        default=DistanceChoices.HALF_MARATHON,
    )
    notes = models.TextField(blank=True, null=True)  # Optional

    def __str__(self):
        return f"{self.name} - {self.state.abbreviation}"

    
class RaceImage(models.Model):
    race = models.ForeignKey('Race', on_delete=models.CASCADE, related_name='images')
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

