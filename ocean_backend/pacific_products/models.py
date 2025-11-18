from django.db import models
from django.contrib.auth.models import User # Importing User model 

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class OceanCart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='ocean_cart')    
    product =models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"


    @property
    def subtotal(self):
        return self.product.price * self.quantity
# Create your models here.