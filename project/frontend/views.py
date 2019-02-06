import os
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

logo_url = os.environ['TENDZIN_LOGO_URL']

@ensure_csrf_cookie
def index(request):
    return render(request, 'frontend/index.html', {'logo_url': logo_url})
