from django.shortcuts import render
from django.http import JsonResponse


class accepted_request_type(object):
    def __init__(self, types):
        self.types = types

    def __call__(self, f):
        def wrapped_f(request, *args, **kwargs):
            if request.method not in self.types:
                return render(request, 'mellonsforsale/request_not_accepted.html', {})
            return f(request, *args, **kwargs)
        return wrapped_f


class object_missing(object):
    def __init__(self, model):
        self.model = model

    def __call__(self, f):
        def wrapped_f(request, id, *args, **kwargs):
            objs = self.model.objects.filter(pk=id)
            if len(objs) == 0:
                return render(request, 'mellonsforsale/object_missing', {})
            return f(request, id, *args, **kwargs)
        return wrapped_f
