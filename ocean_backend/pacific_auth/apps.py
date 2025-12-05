from django.apps import AppConfig


class PacificAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pacific_auth'
    
    def ready(self):
        import pacific_auth.signals 
        # Django will now execute the create_initial_superuser function 
        # after running migrations.
