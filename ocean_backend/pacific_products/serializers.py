from rest_framework import serializers
from .models import Product, OceanCart, Wishlist, ProductReview


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image",
            "category",
            "stock",
            "created_at",
            "average_rating",
            "review_count",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        from django.db.models import Avg

        result = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(float(result), 1) if result else None

    def get_review_count(self, obj):
        return obj.reviews.count()


class OceanCartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    quantity = serializers.IntegerField(default=1, min_value=1)
    created_at = serializers.DateTimeField(source="added_on", read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )

    class Meta:
        model = OceanCart
        fields = ["id", "product", "product_id", "quantity", "total_price", "created_at"]

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_id", "added_on"]


class ProductReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ProductReview
        fields = ["id", "product", "user", "username", "rating", "comment", "created_at"]
        read_only_fields = ["user", "product"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
