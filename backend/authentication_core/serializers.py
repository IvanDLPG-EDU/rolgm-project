from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def to_json(self):
        json_data = {
            'errors': self.errors,
            'data': None,
            'status': 'error' if self.errors else 'success'
        }
        return json_data

    def validate(self, data):
        if not data.get('username'):
            raise serializers.ValidationError({'username': ['Este campo es requerido']})
        if not data.get('password'):
            raise serializers.ValidationError({'password': ['Este campo es requerido']})
        return data


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Las contraseñas deben coincidir"})
        try:
            password_validation.validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        return data

    def to_json(self):
        return {
            'errors': self.errors,
            'data': None,
            'status': 'error' if self.errors else 'success'
        }

    def save(self, request):
        user = get_user_model().objects.create_user(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            password=self.validated_data['password'],
        )
        return user
