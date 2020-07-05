"""webapps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('socialnetwork/', include('socialnetwork.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import  re_path
from mellonsforsale import views
from mellonsforsale.controllers import items_controller, profiles_controller


urlpatterns = [
    path('', views.login_action, name='home'),
    path('accounts/login/', views.login_action, name='account_login'),
    path('login', views.login_action, name='login'),
    path('logout', views.logout_action, name='logout'),
    path('register', views.register_action, name='register'),
    re_path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.activate, name='activate'),
    
    path('photo/<int:id>', views.get_photo, name='photo'),

    path('profiles', profiles_controller.profile_index_action, name='profile_index'),
    path('profiles/index', profiles_controller.profile_index_action),
    path('profiles/<int:id>', profiles_controller.profile_show_action, name='profile_show'),
    path('profiles/<int:id>/edit', profiles_controller.profile_update_action, name='profile_update'),
    path('profiles/<int:id>/items', profiles_controller.profile_items_action, name='profile_items'),
    
    path('storefront', views.storefront_action, name='storefront'),

    # for AJAX requests
    path('get-item-listing', items_controller.get_item_listing_action),
    path('filter-item-listing', items_controller.filter_item_listing_action),
    path('get-filter-listing', items_controller.get_filter_listing_action),

    path('items', items_controller.item_index_action, name='item_index'),
    path('items/index', items_controller.item_index_action),
    path('items/create', items_controller.item_create_action, name='item_create'),
    path('items/<int:id>/update', items_controller.item_update_action, name='item_edit'),
    path('items/<int:id>/delete', items_controller.item_delete_action, name='item_delete'),
    path('items/<int:id>/interest', items_controller.item_interest_action, name='item_interest'),
    # path('get-all-items', views.get_all_items_action, name='get-all-items'),
]
