from django.shortcuts import render, redirect, get_object_or_404, reverse
from django.http import HttpResponse, Http404
from django.urls import reverse
from django.core import serializers

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control
from django.contrib.auth.models import User
from mellonsforsale.models import Profile, Item, Price, Category, Label
from django.contrib.sites.shortcuts import get_current_site

from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from django.template.defaulttags import register
from django.utils import timezone
from django.db import transaction

from mellonsforsale.forms import LoginForm, RegistrationForm, CreateProfileForm, EditProfileForm, CreateItemForm

import json
import re
import math
from datetime import datetime

from django.contrib.auth.tokens import PasswordResetTokenGenerator

from mellonsforsale.controllers.registration_helpers import UserTokenGenerator, send_email, user_from_uid
from mellonsforsale.controllers.application_controller import *


account_activation_token = UserTokenGenerator()


@accepted_request_type(['GET', 'POST'])
def login_action(request):
    context = {}

    # Just display the registration form if this is a GET request.
    if request.method == 'GET':
        context['form'] = LoginForm()
        return render(request, 'login.html', context)

    # Creates a bound form from the request POST parameters and makes the
    # form available in the request context dictionary.
    form = LoginForm(request.POST)
    context['form'] = form

    # Validates the form.
    if not form.is_valid():
        return render(request, 'login.html', context)

    new_user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])
    login(request, new_user)
    return redirect(reverse('storefront'))


def logout_action(request):
    logout(request)
    return redirect(reverse('login'))


@accepted_request_type(['GET', 'POST'])
@transaction.atomic
def register_action(request):
    context = {}
    if request.method == 'GET':
        context['form'] = RegistrationForm()
        return render(request, 'register.html', context)

    # Creates a bound form from the request POST parameters and makes the
    # form available in the request context dictionary.
    form = RegistrationForm(request.POST)
    context['form'] = form

    # Validates the form.
    if not form.is_valid():
        return render(request, 'register.html', context)

    # At this point, the form data is valid.  Register and login the user.
    new_user = User.objects.create_user(username=form.cleaned_data['username'],
                                        password=form.cleaned_data['password'],
                                        email=form.cleaned_data['email'],
                                        first_name=form.cleaned_data['first_name'],
                                        last_name=form.cleaned_data['last_name'])
    new_user.save()

    prof = Profile.objects.create(user=new_user)
    prof.phone = form.cleaned_data['phone']
    prof.is_activated = False
    prof.save()

    send_email(request, new_user, account_activation_token)
    return HttpResponse('Please confirm your email address to complete the registration')


def activate(request, uidb64, token):
    user = user_from_uid(uidb64)
    if user is not None and account_activation_token.check_token(user, token):
        profile = Profile.objects.get(user=user)
        profile.is_activated = True
        profile.save()
        login(request, user)
        return redirect('storefront')
    return render(request, 'invalid_activation.html', {})


def get_photo(request, id):
    profile = get_object_or_404(Profile, id=id)
    print('Picture #{} fetched from db: {} (type={})'.format(
        id, profile.picture, type(profile.picture)))

    # Maybe we don't need this check as form validation requires a picture be uploaded.
    # But someone could have delete the picture leaving the DB with a bad references.
    if not profile.picture:
        return HttpResponse('/static/mellonsforsale/farn.jpg', content_type="image")

    return HttpResponse(profile.picture, content_type="image")


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@accepted_request_type(['GET'])
@login_required
def storefront_action(request):
    return render(request, 'storefront.html', {})
