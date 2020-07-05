from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

import re


class Profile(models.Model):
    following = models.ManyToManyField(User)
    bio = models.TextField(blank=True)
    phone = models.TextField(blank=True)
    contact_info = models.TextField(blank=True)
    picture = models.FileField(blank=True, default='farn.jpg')
    user = models.OneToOneField(
        User, on_delete=models.PROTECT, related_name="user")
    
    def clean(self):
        phone = self.phone
        pattern = re.compile("^\d{10}|\d{11}|((\d)?\d{3}[- ]\d{3}[- ]\d{4})$")
        if phone is not None and phone != "" and not pattern.fullmatch(phone):
            raise ValidationError("Passwords did not match.")


class Location(models.Model):
    street = models.TextField()
    city = models.TextField()
    state = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    zip_code = models.TextField(blank=True)


class Item(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True)
    location = models.ForeignKey(
        Location, on_delete=models.PROTECT, related_name="location")
    seller = models.ForeignKey(
        Profile, on_delete=models.PROTECT, related_name="seller")
    labels = models.ManyToManyField('Label')
    interested = models.ManyToManyField(Profile)

    class Meta:
        ordering = ('name',)


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
