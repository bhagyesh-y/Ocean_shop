from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class ProfileUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password2 = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "current_password", "new_password", "new_password2")

    def validate_email(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate(self, data):
        new_pw = data.get("new_password")
        new_pw2 = data.get("new_password2")
        current = data.get("current_password")
        if new_pw or new_pw2:
            if not current:
                raise serializers.ValidationError({"current_password": "Required to change password."})
            if new_pw != new_pw2:
                raise serializers.ValidationError({"new_password": "Passwords do not match."})
            validate_password(new_pw, self.context["request"].user)
        return data

    def update(self, instance, validated_data):
        from rest_framework.exceptions import ValidationError

        current = validated_data.pop("current_password", "")
        new_pw = validated_data.pop("new_password", "")
        validated_data.pop("new_password2", "")
        if new_pw:
            if not instance.check_password(current):
                raise ValidationError({"current_password": "Current password is incorrect."})
            instance.set_password(new_pw)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["new_password2"]:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        validate_password(data["new_password"])
        return data
