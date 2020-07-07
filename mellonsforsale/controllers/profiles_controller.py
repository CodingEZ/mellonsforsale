from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import redirect, render, reverse
from django.template.defaulttags import register
from django.views.decorators.cache import cache_control

from django.contrib.auth.models import User
from mellonsforsale.models import Profile, Item

from mellonsforsale.forms import EditProfileForm

import re

from .application_controller import *


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@accepted_request_type(['GET'])
@object_missing(User)
@transaction.atomic
@login_required
def profile_index_action(request, id):
    profiles = Profile.objects.all()
    context = {
        'profiles': profiles
    }
    return render(request, 'profiles/profile_index.html', context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@accepted_request_type(['GET'])
@object_missing(User)
@transaction.atomic
@login_required
def profile_show_action(request, id):
    entry = User.objects.get(id=id)
    profile = Profile.objects.get(user=entry)
    items = Item.objects.filter(seller=profile)

    context = {}
    context['entry'] = entry
    context['profile'] = Profile.objects.get(user=entry)

    # case on current user
    return render(request, 'profiles/profile_show.html', context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@accepted_request_type(['GET', 'POST'])
@object_missing(User)
@login_required
def profile_update_action(request, id):
    if request.user.id != id:
        return HttpResponse("Cannot edit someone else's profile.")

    # user editing own profile, user query not necessary
    profile = Profile.objects.get(user=request.user)
    context = {}
    context['profile'] = profile
    if request.method == "GET":
        context['form'] = EditProfileForm(instance=profile)
        return render(request, 'profiles/profile_update.html', context)

    form = EditProfileForm(request.POST, request.FILES)
    context['form'] = form
    if not form.is_valid():
        return render(request, 'profiles/profile_update.html', context)

    if 'bio' in request.POST:
        profile.bio = form.cleaned_data['bio'].strip()
    if 'phone' in request.POST:
        profile.phone = re.sub('[^0-9]', '', form.cleaned_data['phone'])
    if 'picture' in request.FILES:
        profile.picture = request.FILES['picture']
    profile.save()
    return redirect(reverse('profile_show', kwargs={'id': id}))


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@transaction.atomic
@accepted_request_type(['GET'])
@object_missing(User)
@login_required
def profile_items_action(request, id):
    entry = User.objects.get(id=id)
    context = {}
    context['entry'] = entry
    context['profile'] = Profile.objects.get(user=entry)

    # case on current user
    if (id == request.user.id):
        return render(request, 'profiles/profile_my_items.html', context)
    return render(request, 'profiles/profile_other_items.html', context)
