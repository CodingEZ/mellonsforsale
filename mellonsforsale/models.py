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
        result_item = dict()
        result_item['id'] = item.id
        result_item['name'] = item.name
        result_item['description'] = item.description

        result_item['street'] = item.street
        result_item['state'] = item.state
        result_item['city'] = item.city
        result_item['zipcode'] = item.zip_code
        result_item['latitude'] = item.latitude
        result_item['longitude'] = item.longitude
        
        result_item['seller'] = {
            'id': item.seller.user.id,
            "first_name" : item.seller.user.first_name,
            "last_name" : item.seller.user.last_name
        }
        result_item['price'] = str(Price.objects.filter(
            item=item).order_by('-start_date')[0].price)

        interested_profiles = item.interested.all()
        result_item['interested_users'] = [
            {
                'id': profile.user.id,
                'first_name': profile.user.first_name,
                'last_name': profile.user.last_name
            } for profile in interested_profiles
        ]

        current_profile = Profile.objects.get(user=user)
        result_item['is_interested'] = current_profile in interested_profiles
        result_item['is_deletable'] = (item.seller.user == user)
        return result_item

    @staticmethod
    @transaction.atomic
    def serialize_many(items, user):
        result_items = []
        for item in items:
            result_item = Item.serialize_one(item, user)
            result_items.append(result_item)
        return result_items


class Price(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    price = models.FloatField()
    item = models.ForeignKey(
        Item, on_delete=models.PROTECT, related_name="item")


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
