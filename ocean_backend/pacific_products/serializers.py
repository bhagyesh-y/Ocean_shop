from rest_framework import serializers
from .models import Product, OceanCart


        
#  Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


#  Cart Serializer
class OceanCartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    quantity=serializers.IntegerField(default=1)
    created_at = serializers.DateTimeField(source='added_on',read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OceanCart
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'created_at']

    def get_product(self, obj):
        """Return nested product info"""
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "price": obj.product.price,
            "image": obj.product.image.url if obj.product.image else None
        }

    def get_total_price(self, obj):
        """ Must be defined like this"""
        return obj.product.price * obj.quantity

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    


        