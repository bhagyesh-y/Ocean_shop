from django.shortcuts import render
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.permissions import IsAuthenticated

class ProductListCreateView(generics.ListCreateAPIView):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer
    permission_classes=[IsAuthenticated]
    
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):    
    queryset=Product.objects.all()
    serializer_class=ProductSerializer

# Create your views here.
