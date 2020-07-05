from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage


class UserTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp)


def send_email(request, new_user, token_generator):
    current_site = get_current_site(request)
    mail_subject = 'Activate your account.'
    message = render_to_string('acc_active_email.html', {
        'user': new_user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(new_user.pk)),
        'token': token_generator.make_token(new_user),
    })

    email = EmailMessage(mail_subject, message, to=[new_user.email])
    email.send()

def user_from_uid(uidb64):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    return user
