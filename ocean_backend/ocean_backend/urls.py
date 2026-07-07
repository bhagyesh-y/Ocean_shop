from django.contrib import admin
from django.urls import path, include, re_path
from pacific_auth.views import (
    RegisterView,
    ProfileView,
    GoogleLoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)
from pacific_auth.jwt_views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
)
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import re

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/google-login/', GoogleLoginView.as_view(), name='google_login'),
    path("api/", include("pacific_products.urls")),
    path('api/payments/', include('pacific_payments.urls')),
]

if not settings.DEBUG:
    # This manually creates the URL pattern for /media/ to be handled 
    # by Django's serve view, allowing CorsMiddleware to run.
    urlpatterns += [
        re_path(
            r'^%s(?P<path>.*)$' % re.escape(settings.MEDIA_URL.lstrip('/')),
            serve,
            kwargs={'document_root': settings.MEDIA_ROOT}
        )
    ]
else:
    # Use the static helper for local development only
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)