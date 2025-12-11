from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Product, OceanCart
from .serializers import ProductSerializer, OceanCartSerializer
from .models import OceanCart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# 🌊 Products
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        return {"request":self.request}


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        return {"request":self.request}


# 🌊 Cart Views (isolated per user)
class OceanCartListCreateView(generics.ListCreateAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Each user only sees their own cart items
        return OceanCart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data.get("product")
        quantity = serializer.validated_data.get("quantity", 1)

    # Check if item is already in cart
        existing_item = OceanCart.objects.filter(user=user, product=product).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
        else:
            serializer.save(user=user)

         
    def get_serializer_context(self):
        return {"request":self.request}
    


class OceanCartDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Restrict access to user's own cart only
        return OceanCart.objects.filter(user=self.request.user)
    def get_serializer_context(self):
        return {"request":self.request}


@api_view(['Delete'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    """ clear all itmes for thelogged in user """
    OceanCart.objects.filter(user=request.user).delete()
    return Response([{"message": "Cart cleared successfully."}])