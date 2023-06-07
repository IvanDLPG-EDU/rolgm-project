from django.urls import path, re_path
from .views import RegistrationView, AuthenticationView, VerifyEmail

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', AuthenticationView.as_view(), name='login'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
]
