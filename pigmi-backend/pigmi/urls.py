# pigmi/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Pigmi API!")

urlpatterns = [
    path('', home),  # Add this line for the root URL
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
]
