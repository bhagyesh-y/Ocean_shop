from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Product, OceanCart
from .serializers import ProductSerializer, OceanCartSerializer

# 🌊 Products
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]


# 🌊 Cart Views (isolated per user)
class OceanCartListCreateView(generics.ListCreateAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Each user only sees their own cart items
        return OceanCart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign user when adding item
        serializer.save(user=self.request.user)


class OceanCartDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Restrict access to user's own cart only
        return OceanCart.objects.filter(user=self.request.user)
