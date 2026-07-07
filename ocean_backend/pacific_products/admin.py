from django.contrib import admin
from .models import Product, OceanCart, Wishlist, ProductReview

admin.site.register(Product)
admin.site.register(OceanCart)
admin.site.register(Wishlist)
admin.site.register(ProductReview)
