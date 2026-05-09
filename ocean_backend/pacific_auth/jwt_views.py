from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .jwt_cookies import clear_jwt_cookies, set_access_cookie, set_jwt_cookies
from .serializers import ProfileSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
    """Login: HttpOnly JWT cookies + user profile in one response (no extra /profile/ round trip)."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data["access"]
        refresh = serializer.validated_data["refresh"]
        user = serializer.user

        body = {
            "detail": "Login successful.",
            "user": ProfileSerializer(user).data,
        }
        response = Response(body)
        set_jwt_cookies(response, access, refresh)
        return response


class CookieTokenRefreshView(APIView):
    """Rotate access token using refresh from HttpOnly cookie."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        from django.conf import settings as dj_settings

        refresh_token = request.COOKIES.get(
            getattr(dj_settings, "JWT_REFRESH_COOKIE_NAME", "ocean_refresh")
        )
        if not refresh_token:
            return Response(
                {"detail": "No refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data["access"]
        new_refresh = serializer.validated_data.get("refresh")

        resp = Response({"detail": "Token refreshed."})
        if new_refresh:
            set_jwt_cookies(resp, access, new_refresh)
        else:
            set_access_cookie(resp, access)

        return resp


class LogoutView(APIView):
    """Clear JWT cookies (call from SPA on logout)."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        resp = Response(status=status.HTTP_204_NO_CONTENT)
        clear_jwt_cookies(resp)
        return resp
