from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StateViewSet, RaceViewSet, RaceImageViewSet, RegisterView, LoginView, UserProfileView, PasswordResetView, PasswordResetConfirmView

# Set up the router for ViewSets
router = DefaultRouter()
router.register(r'states', StateViewSet)
router.register(r'races', RaceViewSet)
router.register(r'race-images', RaceImageViewSet)

# Define urlpatterns
urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
