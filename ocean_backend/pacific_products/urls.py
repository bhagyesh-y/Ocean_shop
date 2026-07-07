from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    OceanCartListCreateView,
    OceanCartDetailView,
    clear_cart,
    product_categories,
    WishlistListCreateView,
    WishlistDetailView,
    wishlist_remove_by_product,
    product_reviews,
    create_product_review,
)

urlpatterns = [
    path("products/", ProductListCreateView.as_view(), name="product-list"),
    path("products/categories/", product_categories, name="product-categories"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("products/<int:product_id>/reviews/", product_reviews, name="product-reviews"),
    path("products/<int:product_id>/reviews/create/", create_product_review, name="create-product-review"),
    path("cart/", OceanCartListCreateView.as_view(), name="ocean-cart-lists-create"),
    path("cart/<int:pk>/", OceanCartDetailView.as_view(), name="ocean-cart-detail"),
    path("cart/clear/", clear_cart, name="clear-cart"),
    path("wishlist/", WishlistListCreateView.as_view(), name="wishlist-list"),
    path("wishlist/<int:pk>/", WishlistDetailView.as_view(), name="wishlist-detail"),
    path("wishlist/product/<int:product_id>/", wishlist_remove_by_product, name="wishlist-remove-product"),
]
