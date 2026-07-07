from rest_framework import generics, permissions, status
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(ProfileSerializer(user).data)


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
            reset_link = f"{frontend.rstrip('/')}/reset-password?uid={uid}&token={token}"
            send_mail(
                subject="Ocean Shop — Reset your password",
                message=f"Click to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email.",
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@oceanshop.com"),
                recipient_list=[email],
                fail_silently=True,
            )
        return Response(
            {"detail": "If that email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data["token"]
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired reset link."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated. You can log in now."})


from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken

from .jwt_cookies import set_jwt_cookies


class GoogleLoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Token not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            email = idinfo.get("email")
            name = idinfo.get("name", email.split("@")[0])
            picture = idinfo.get("picture", "")

            user, _ = User.objects.get_or_create(
                username=email,
                defaults={"email": email, "first_name": name},
            )

            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            refresh_s = str(refresh)

            profile = ProfileSerializer(user).data
            profile["picture"] = picture

            response = Response({"user": profile})
            set_jwt_cookies(response, access, refresh_s)
            return response

        except ValueError:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print("Google Login Error:", e)
            return Response(
                {"error": "Google login failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
