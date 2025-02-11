from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StateViewSet,
    RaceViewSet,
    RaceImageViewSet,
    RegisterView,
    LoginView,
    #UserProfileView,
    dashboard_view,
    PasswordResetRequestView,
    PasswordResetValidateTokenView,
    PasswordResetConfirmView,
    GoogleAuthAPIView,
    FacebookAuthAPIView,
)
from django.contrib.auth import views as auth_views

# Set up the router for ViewSets
router = DefaultRouter()
router.register(r'states', StateViewSet)
router.register(r'races', RaceViewSet)
router.register(r'race-images', RaceImageViewSet)

# Define urlpatterns
urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    #path('users/profile/', UserProfileView.as_view(), name='user-profile'),

    # Password reset views
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/validate/<str:uidb64>/<str:token>/', PasswordResetValidateTokenView.as_view(), name='password_reset_validate'),
    path('password-reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # Google login
    path('google-login/', GoogleAuthAPIView.as_view(), name='google-login'),

    # Facebook login
    path('facebook-login/', FacebookAuthAPIView.as_view(), name='facebook-login'),

]
