from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets

#  user registration view
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# user profile view 
class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)
    
# google login view
class GoogleLoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")
        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request())
            email = idinfo["email"]
            name = idinfo.get("name", email.split("@")[0])
            picture= idinfo.get ("picture", "")
            # Find or create user
            user, created = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": name})

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user":{
                    "id": user.id,
                    "first_name":user.first_name,
                    "last_name":user.last_name,
                    "username":user.username,
                    "email":user.email,
                    "picture":picture,
                }
            })

        except Exception as e:
            print("Google Login Error:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
