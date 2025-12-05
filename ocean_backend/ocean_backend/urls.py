from django.contrib import admin
from pacific_auth.views import RegisterView, ProfileView
from django.urls import path,include,re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from pacific_auth.views import GoogleLoginView
from rest_framework import routers 
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import re 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/google-login/', GoogleLoginView.as_view(), name='google_login'),
    path("api/",include('pacific_products.urls')),
    path('api/products/', include('pacific_products.urls')),
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