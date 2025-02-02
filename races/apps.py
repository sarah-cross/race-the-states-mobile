from django.apps import AppConfig


class RacesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'races'

    def ready(self):
        import races.signals  # Import the signals module to activate it
