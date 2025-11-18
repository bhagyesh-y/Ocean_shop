from django.urls import path
from .views import ProductListCreateView, ProductDetailView , OceanCartListCreateView,OceanCartDetailView
from.views import clear_cart
from .import views 

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('cart/', OceanCartListCreateView.as_view(),name='ocean-cart-lists-create'),
    path('cart/,<int:pk>/', OceanCartDetailView.as_view(),name='ocean-cart-detail'),
    path('cart/clear/',views.clear_cart,name='clear-cart'),
   
]