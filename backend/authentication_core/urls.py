from django.urls import path, re_path
from .views import registration_view, AuthenticationView

urlpatterns = [
    path('register/', registration_view, name='register'),
    path('login/', AuthenticationView.as_view(), name='login'),
]