from rest_framework import serializers
from .models import Product 

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()    


def get_image(self,obj):
    request=self.context.get('request')
    image_url=obj.image.url
    return request.build_absolute_uri(image_url)



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields="__all__"