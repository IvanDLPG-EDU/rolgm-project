from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from rest_framework.authtoken.models import Token
from .models import User
from django.db.models import Q


class UserSerializerBase(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username','public_name', 'bio', 'profile_picture')

class UserSerializerToken(UserSerializerBase):
    token = serializers.SerializerMethodField()

    class Meta(UserSerializerBase.Meta):
        fields = UserSerializerBase.Meta.fields + ('token',)

    def get_token(self, obj):
        token, _ = Token.objects.get_or_create(user=obj)
        return token.key

class UserSerializerFull(UserSerializerBase):
    class Meta(UserSerializerBase.Meta):
        fields = UserSerializerBase.Meta.fields + ('email',)

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
            raise serializers.ValidationError({'errors': {'username': ['Required field']}})
        if not data.get('password'):
            raise serializers.ValidationError({'errors': {'username': ['Required field']}})
        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(
                Q(email=data['username']) | Q(username=data['username']))
            if not user.is_verified:
                raise serializers.ValidationError(
                    {'errors': {'username': ['email is not verified yet'],}})
        except UserModel.DoesNotExist:
            print("NelPastel3")
            raise serializers.ValidationError(
                {'errors': {'username': ['invalid credentials'], 'password': ['invalid credentials']}})

        data['username'] = user.username

        return data


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'errors': {"password2": ["Password must concide"]}})
        try:
            password_validation.validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'errors': {"password": e.messages}})
        
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
