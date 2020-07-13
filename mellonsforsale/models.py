from django.db import models, transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

import re


class Profile(models.Model):
    following = models.ManyToManyField(User)
    bio = models.TextField(blank=True)
    phone = models.TextField(blank=True)
    contact_info = models.TextField(blank=True)
    picture = models.FileField(blank=True, default='farn.jpg')

    is_activated = models.BooleanField(default=False)
    user = models.OneToOneField(
        User, on_delete=models.PROTECT, related_name="user")

    def clean(self):
        phone = self.phone
        pattern = re.compile("^\d{10}|\d{11}|((\d)?\d{3}[- ]\d{3}[- ]\d{4})$")
        if phone is not None and phone != "" and not pattern.fullmatch(phone):
            raise ValidationError("Passwords did not match.")

    @staticmethod
    @transaction.atomic
    def serialize_one(profile, user):
        result = dict()
        result['id'] = profile.id
        result['phone'] = profile.phone
        result['contact_info'] = profile.contact_info
        if profile.user != user:
            result['is_following'] = user in profile.following
        else:
            result['followers'] = [ {
                'first_name': user.first_name,
                'last_name': user.last_name
            } for user in profile.following]
            result['followers'].sort()
        return result

    @staticmethod
    @transaction.atomic
    def serialize_many(profiles, user):
        results = []
        for profile in profiles:
            result = Item.serialize_one(profile, user)
            results.append(result)
        return results


class Item(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True)

    street = models.TextField()
    city = models.TextField()
    state = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    zip_code = models.TextField(blank=True)

    seller = models.ForeignKey(
        Profile, on_delete=models.PROTECT, related_name="seller")
    labels = models.ManyToManyField('Label')
    interested = models.ManyToManyField(Profile)

    class Meta:
        ordering = ('name',)

    @staticmethod
    @transaction.atomic
    def serialize_one(item, user):
        result = dict()
        result['id'] = item.id
        result['name'] = item.name
        result['description'] = item.description

        result['street'] = item.street
        result['state'] = item.state
        result['city'] = item.city
        result['zipcode'] = item.zip_code
        result['latitude'] = item.latitude
        result['longitude'] = item.longitude
        
        result['seller'] = {
            'id': item.seller.user.id,
            "first_name" : item.seller.user.first_name,
            "last_name" : item.seller.user.last_name
        }
        result['price'] = Price.latest(item)

        interested_profiles = item.interested.all()
        result['interested_users'] = [
            {
                'id': profile.user.id,
                'first_name': profile.user.first_name,
                'last_name': profile.user.last_name
            } for profile in interested_profiles
        ]

        current_profile = Profile.objects.get(user=user)
        result['is_interested'] = current_profile in interested_profiles
        result['is_deletable'] = (item.seller.user == user)
        return result

    @staticmethod
    @transaction.atomic
    def serialize_many(items, user):
        results = []
        for item in items:
            result = Item.serialize_one(item, user)
            results.append(result)
        return results


class Price(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    price = models.FloatField()
    item = models.ForeignKey(
        Item, on_delete=models.PROTECT, related_name="item")

    @staticmethod
    @transaction.atomic
    def latest(item):
        return Price.objects.filter(item=item).order_by('-start_date')[0].price


class Category(models.Model):
    name = models.TextField()
    description = models.TextField()


class Label(models.Model):
    def __str__(self):
        return 'Category: {}, {}'.format(self.category.name, self.name)
    name = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="category")
    description = models.TextField(blank=True)

    @staticmethod
    def get_choices():
        options = []
        for label in Label.objects.all():
            options.append((label, label))
        return options
