from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse, Http404
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control
from django.contrib.auth.models import User
from mellonsforsale.models import Profile, Item, Price, Category, Label

from django.utils import timezone
from django.db import transaction

from mellonsforsale.forms import LoginForm, RegistrationForm, \
    CreateProfileForm, EditProfileForm, CreateItemForm, EditItemForm
from .application_controller import *
from .geolocation_helpers import get_coordinates, item_haversine

import json
import math
from datetime import datetime


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@transaction.atomic
@accepted_request_type(['GET'])
@login_required
def item_show_action(request, id):
    context = {}
    items = Item.objects.filter(pk=id)
    if len(items) == 0:
        return render(request, 'items/item_404.html', context)
    
    item = items[0]
    context['item'] = Item.serialize_one(item, request.user)
    return render(request, 'items/item_show.html', context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@transaction.atomic
@accepted_request_type(['GET', 'POST'])
@login_required
def item_create_action(request):
    context = {}

    if request.method == 'GET':
        form = CreateItemForm()
        #form.fields["labels"].queryset = Label.objects.all().values_list('name', flat=True)
        context['form'] = form
        return render(request, 'items/item_create.html', context)

    # Creates a bound form from the request POST parameters and makes the
    # form available in the request context dictionary.
    form = CreateItemForm(request.POST)
    context['form'] = form

    # Validates the form.
    if not form.is_valid():
        return render(request, 'items/item_create.html', context)

    latitude, longitude = get_coordinates(request)
    new_item = Item.objects.create(name=form.cleaned_data['name'],
                                   description=form.cleaned_data['description'],
                                   street=request.POST['street'],
                                   city=request.POST['city'],
                                   state=request.POST['state'],
                                   latitude=latitude,
                                   longitude=longitude,
                                   zip_code=request.POST['zip'],
                                   seller=Profile.objects.get(user=request.user))
    new_item.labels.set(form.cleaned_data['labels'])
    new_item.save()

    new_price = Price.objects.create(start_date=datetime.now(),
                                     end_date=None,
                                     price=float(request.POST['price']),
                                     item=new_item)
    new_price.save()

    return redirect(reverse('profile_items', kwargs={'id': request.user.id}))


@transaction.atomic
@accepted_request_type(['GET', 'POST'])
@object_missing(Item)
@login_required
def item_update_action(request, id):
    if request.method == 'GET':
        context = {}
        context['form'] = EditItemForm()
        return render(request, 'items/item_update.html', context)

    item = Item.objects.get(pk=id)
    if item.seller.user != request.user:
        result = {"message": "Cannot edit someone else's item."}
        return JsonResponse(result)

    name = request.POST.get('name')
    description = request.POST.get('description')
    price = request.POST.get('price')
    street = request.POST.get('street')
    city = request.POST.get('city')
    state = request.POST.get('state')
    zipcode = request.POST.get('zip')

    if name is None or description is None or price is None or street is None \
            or city is None or state is None or zipcode is None:
        result = {"message": "Missing parameters."}
        return JsonResponse(result)

    latitude, longitude = get_coordinates(request)

    item.name = name
    item.description = description
    item.street = street
    item.city = city
    item.state = state
    item.latitude = latitude
    item.longitude = longitude
    item.zip_code = zipcode
    item.save()

    new_price = Price.objects.create(start_date=datetime.now(timezone.utc),
                                     end_date=None,
                                     price=float(price),
                                     item=item)
    new_price.save()
    return JsonResponse(Item.serialize_one(item, request.user))


@transaction.atomic
@accepted_request_type(['POST'])
@object_missing(Item)
@login_required
def item_delete_action(request, id):
    item = Item.objects.get(pk=id)
    if item.seller.user != request.user:
        result = {"message": "Cannot delete someone else's item."}
        return JsonResponse(result)

    prices = Price.objects.filter(item=item)
    prices.delete()
    item.delete()
    return JsonResponse({})


@transaction.atomic
@accepted_request_type(['POST'])
@object_missing(Item)
@login_required
def item_interest_action(request, item_id):
    item = Item.objects.get(pk=item_id)
    profile = Profile.objects.get(user=request.user)
    if item.seller == profile:
        result = {"message": "Cannot express interest in your own item."}
        return JsonResponse(result)

    if (profile not in item.interested.all()):
        item.interested.add(profile)
    else:
        item.interested.remove(profile)
    item.save()

    # return the updated item information
    item_ser = Item.serialize_one(item, request.user)
    return JsonResponse({"item": item_ser})


@transaction.atomic
@accepted_request_type(['GET'])
@login_required
def get_storefront_listing(request):
    profile = Profile.objects.get(user=request.user)
    items = Item.objects.exclude(seller=profile)
    item_list = Item.serialize_many(items, request.user)
    return JsonResponse({"items": item_list})


@transaction.atomic
@accepted_request_type(['GET'])
@login_required
def get_personal_listing(request):
    profile = Profile.objects.get(user=request.user)
    items = Item.objects.filter(seller=profile)
    item_list = Item.serialize_many(items, request.user)
    return JsonResponse({"items": item_list})


@transaction.atomic
@accepted_request_type(['GET'])
@login_required
def get_interest_listing(request):
    profile = Profile.objects.get(user=request.user)
    items = Item.objects.filter(interested__in=[profile])
    item_list = Item.serialize_many(items, request.user)
    return JsonResponse({"items": item_list})


@transaction.atomic
@accepted_request_type(['GET'])
@login_required
def item_index_action(request):
    profile = Profile.objects.get(user=request.user)
    items_owned = Item.objects.filter(seller=profile)
    items_interest = Item.objects.filter(interested__in=[profile])
    return JsonResponse({
        'items_owned': items_owned,
        'items_interest': items_interest
    })


def validate_query_labels(query_labels):
    distance = None
    values = []
    for item in query_labels:
        label, value, *_ = item
        if label == 'key':
            if len(str(value)) > 1000:
                print("Query value more than 1000 characters. Attempted overflow.")
                return None
            if not Label.objects.get(pk=value):
                print(f"Query value {value} does not exist in database.")
                return None
            values.append(value)
        elif label == 'distance':
            try:
                value = float(value)
            except:
                print("Query value not a number.")
                return None

            if value > 10000:
                print("Query value too large. Attempted overflow.")
                return None
            elif value <= 0:
                print("Query value must be positive.")
                return None
            distance = value
        else:
            print(f"Invalid query label.")
            return None
    return (distance, values)


@transaction.atomic
@login_required
def filter_item_listing_action(request):
    def default_response(profile):
        items = Item.objects.exclude(seller=profile)
        item_list = Item.serialize_many(items, request.user)
        return JsonResponse(item_list)

    own_profile = Profile.objects.get(user=request.user)

    if request.method != 'GET':
        print("Only processing get requests.")
        return default_response(own_profile)

    query_json = request.GET.get('query_labels')
    if query_json is None:
        print("No query labels were given.")
        return default_response(own_profile)

    lat = request.GET.get('user_lat')
    lng = request.GET.get('user_lng')
    if lat is None or lng is None:
        print("No location given.")
        return default_response(own_profile)

    try:
        lat = float(lat)
        lng = float(lng)
    except:
        print("Query location not numbers.")
        return default_response(own_profile)

    # check if any labels are invalid
    query_labels = json.loads(query_json)
    tmp = validate_query_labels(query_labels)
    if tmp is None:
        return default_response(own_profile)
    (distance, values) = tmp

    # no labels selected, need to select all items first
    items = Item.objects.exclude(seller=own_profile)
    if len(values) > 0:
        for value in values:
            items = items.filter(labels__in=[value])

    # calculate items that are within the distance
    if not (distance is None) and not (lat is None) and not (lng is None):
        items = [item for item in items if item_haversine(item, lat, lng)]

    item_list = Item.serialize_many(items, request.user)
    return JsonResponse(item_list)


@transaction.atomic
@login_required
def get_filter_listing_action(request):
    # Prepare data into a format friendly for the UI. Returns JSON data.
    category_lists = []
    categories = list(Category.objects.all())
    for category in categories:
        labels = list(Label.objects.filter(category=category))
        category_lists.append(
            {
                'id': category.id,
                'category': category.name,
                'description': category.description,
                'labels': [
                    {
                        'id': label.id,
                        'name': label.name
                    } for label in labels
                ]
            }
        )
    return JsonResponse({'categories': category_lists})
