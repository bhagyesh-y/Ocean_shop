"""HttpOnly cookie helpers for SimpleJWT (cross-origin SPA + API)."""
from datetime import timedelta

from django.conf import settings


def _cookie_flags():
    secure = getattr(settings, "JWT_COOKIE_SECURE", not settings.DEBUG)
    samesite = getattr(settings, "JWT_COOKIE_SAMESITE", "None" if secure else "Lax")
    return secure, samesite


def _jwt_lifetimes():
    sj = getattr(settings, "SIMPLE_JWT", {})
    access_td = sj.get("ACCESS_TOKEN_LIFETIME") or timedelta(minutes=60)
    refresh_td = sj.get("REFRESH_TOKEN_LIFETIME") or timedelta(days=7)
    return int(access_td.total_seconds()), int(refresh_td.total_seconds())


def set_jwt_cookies(response, access: str, refresh: str) -> None:
    access_name = getattr(settings, "JWT_ACCESS_COOKIE_NAME", "ocean_access")
    refresh_name = getattr(settings, "JWT_REFRESH_COOKIE_NAME", "ocean_refresh")
    secure, samesite = _cookie_flags()

    access_max, refresh_max = _jwt_lifetimes()

    response.set_cookie(
        access_name,
        access,
        max_age=access_max,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )
    response.set_cookie(
        refresh_name,
        refresh,
        max_age=refresh_max,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )


def set_access_cookie(response, access: str) -> None:
    access_name = getattr(settings, "JWT_ACCESS_COOKIE_NAME", "ocean_access")
    secure, samesite = _cookie_flags()
    access_max, _ = _jwt_lifetimes()
    response.set_cookie(
        access_name,
        access,
        max_age=access_max,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )


def clear_jwt_cookies(response) -> None:
    access_name = getattr(settings, "JWT_ACCESS_COOKIE_NAME", "ocean_access")
    refresh_name = getattr(settings, "JWT_REFRESH_COOKIE_NAME", "ocean_refresh")
    secure, samesite = _cookie_flags()
    for name in (access_name, refresh_name):
        response.delete_cookie(name, path="/", samesite=samesite, secure=secure)
