from django.contrib import admin
from django.urls import path, include
from apitide import views
from .views import *

urlpatterns = [
    path('', views.home, name='home')
]
