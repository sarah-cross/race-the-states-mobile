from allauth.account.signals import user_signed_up
from django.dispatch import receiver

@receiver(user_signed_up)
def populate_user_details(request, user, **kwargs):
    extra_data = user.socialaccount_set.first().extra_data
    print("Extra Data:", extra_data)  # Debugging
    user.first_name = extra_data.get("given_name", "")
    user.last_name = extra_data.get("family_name", "")
    user.save()

