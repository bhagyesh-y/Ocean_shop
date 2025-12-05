import os
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def create_initial_superuser(sender, **kwargs):
    # Only run this code if the app sending the signal is the one 
    # that defines the User model (or a central app).
    if sender.label == 'pacific_auth': # Use your actual app name here
        User = get_user_model()

        # Use environment variables for credentials
        superuser_username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        superuser_email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        superuser_password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        # CRITICAL CHECK: Only attempt to create if credentials are set 
        # and a user with that username does not already exist.
        if superuser_username and superuser_password and not User.objects.filter(username=superuser_username).exists():
            print(f"--- Creating initial superuser: {superuser_username} ---")
            User.objects.create_superuser(
                username=superuser_username,
                email=superuser_email,
                password=superuser_password
            )
            print("--- Superuser created successfully! ---")