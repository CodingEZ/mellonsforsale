from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError

from mellonsforsale.models import Profile, Item, Label

import re


class LoginForm(forms.Form):
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=200, widget=forms.PasswordInput())

    # Customizes form validation for properties that apply to more
    # than one field.  Overrides the forms.Form.clean function.
    def clean(self):
        # Calls our parent (forms.Form) .clean function, gets a dictionary
        # of cleaned data as a result
        cleaned_data = super().clean()

        # Confirms that the two password fields match
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise forms.ValidationError("Invalid username/password")

        # We must return the cleaned data we got from our parent.
        return cleaned_data


class RegistrationForm(forms.Form):
    first_name = forms.CharField(max_length=40)
    last_name = forms.CharField(max_length=40)
    email = forms.CharField(max_length=50,
                            widget=forms.EmailInput())
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=100,
                               label='Password',
                               widget=forms.PasswordInput())
    confirm_password = forms.CharField(max_length=100,
                                       label='Confirm password',
                                       widget=forms.PasswordInput())
    phone = forms.CharField(max_length=20,
                            label='Phone number')

    # Customizes form validation for properties that apply to more
    # than one field.  Overrides the forms.Form.clean function.
    def clean(self):
        # Calls our parent (forms.Form) .clean function, gets a dictionary
        # of cleaned data as a result
        cleaned_data = super().clean()

        # We must return the cleaned data we got from our parent.
        return cleaned_data

    def clean_password(self):
        # Confirms that the two password fields match
        password1 = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('confirm_password')
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords did not match.")
        return password1

    # Customizes form validation for the username field.
    def clean_username(self):
        # Confirms that the username is not already present in the
        # User model database.
        username = self.cleaned_data.get('username')
        if User.objects.filter(username__exact=username):
            raise ValidationError("Username is already taken.")
        return username

    def clean_email(self):
        # Confirms a CMU email address
        email = self.cleaned_data.get('email')
        email_ending = email.split("@")[1]
        if email_ending != 'andrew.cmu.edu' and email_ending != "cmu.edu":
            raise ValidationError("Email is not a CMU email.")

        # Confirms that the email is not already present in the
        # User model database.
        if User.objects.filter(email__exact=email):
            raise ValidationError("Email is already taken.")
        return email

    def clean_phone(self):
        # Confirms a phone number of valid form
        phone = self.cleaned_data.get('phone')
        pattern = re.compile("^\d{10}|\d{11}|((\d)?\d{3}[- ]\d{3}[- ]\d{4})$")
        if phone is not None and phone != "" and not pattern.fullmatch(phone):
            raise ValidationError("Phone has invalid form. Try to avoid using non-numeric characters.")
        if phone is not None:
            return re.sub('[^0-9]', '', phone)
        return phone


class CreateProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = (
            'bio',
            'picture',
        )
        widgets = {
            "bio": forms.Textarea(attrs={'id': 'id_bio_input_text'}),
            'picture': forms.FileInput(attrs={'id': 'id_profile_picture'}),
        }


class EditProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = (
            'bio',
            'phone',
            'picture',
        )
        widgets = {
            "bio": forms.Textarea(),
            "phone": forms.TextInput(),
            'picture': forms.FileInput(),
        }


class CreateItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = (
            'name',
            'description',
            'labels'
        )
        widgets = {
            'name': forms.Textarea(attrs={'rows': 4, 'cols': 25}),
            'description': forms.Textarea(attrs={'rows': 4, 'cols': 25}),
            'labels': forms.CheckboxSelectMultiple()
        }


class EditItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = (
            'name',
            'description',
            'labels'
        )
        widgets = {
            'name': forms.Textarea(attrs={'rows': 4, 'cols': 25}),
            'description': forms.Textarea(attrs={'rows': 4, 'cols': 25}),
            'labels': forms.CheckboxSelectMultiple()
        }
