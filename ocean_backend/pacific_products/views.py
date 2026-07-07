from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db.models import Avg

from .models import Product, OceanCart, Wishlist, ProductReview
from .serializers import (
    ProductSerializer,
    OceanCartSerializer,
    WishlistSerializer,
    ProductReviewSerializer,
)


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search)
        return qs

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_context(self):
        return {"request": self.request}


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_context(self):
        return {"request": self.request}


@api_view(["GET"])
@permission_classes([AllowAny])
def product_categories(request):
    categories = (
        Product.objects.exclude(category="")
        .values_list("category", flat=True)
        .distinct()
        .order_by("category")
    )
    return Response(list(categories))


class OceanCartListCreateView(generics.ListCreateAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OceanCart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data.get("product")
        quantity = serializer.validated_data.get("quantity", 1)

        if product.stock < 1:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"product_id": "This product is out of stock."})

        existing_item = OceanCart.objects.filter(user=user, product=product).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
            serializer.instance = existing_item
        else:
            serializer.save(user=user)

    def get_serializer_context(self):
        return {"request": self.request}


class OceanCartDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OceanCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OceanCart.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    OceanCart.objects.filter(user=request.user).delete()
    return Response({"message": "Cart cleared successfully."})


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("product")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}


class WishlistDetailView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def wishlist_remove_by_product(request, product_id):
    deleted, _ = Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
    if deleted:
        return Response({"detail": "Removed from wishlist."})
    return Response({"detail": "Not in wishlist."}, status=404)


@api_view(["GET"])
@permission_classes([AllowAny])
def product_reviews(request, product_id):
    reviews = ProductReview.objects.filter(product_id=product_id).select_related("user")
    serializer = ProductReviewSerializer(reviews, many=True)
    avg = reviews.aggregate(avg=Avg("rating"))["avg"]
    return Response(
        {
            "reviews": serializer.data,
            "average_rating": round(float(avg), 1) if avg else None,
            "count": reviews.count(),
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product_review(request, product_id):
    if not Product.objects.filter(pk=product_id).exists():
        return Response({"detail": "Product not found."}, status=404)

    if ProductReview.objects.filter(user=request.user, product_id=product_id).exists():
        return Response({"detail": "You already reviewed this product."}, status=400)

    serializer = ProductReviewSerializer(data={**request.data, "product": product_id})
    serializer.is_valid(raise_exception=True)
    review = ProductReview.objects.create(
        user=request.user,
        product_id=product_id,
        rating=serializer.validated_data["rating"],
        comment=serializer.validated_data.get("comment", ""),
    )
    return Response(ProductReviewSerializer(review).data, status=201)
