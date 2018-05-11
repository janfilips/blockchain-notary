# -*- coding: utf-8 -*-

import os
import unicodedata
import datetime

import string
from random import choice

from django.shortcuts import render
from django.http import HttpResponseRedirect

from django.contrib.auth.models import User

from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.middleware import csrf

from django.conf import settings


def _remove_accents(data):
    return ''.join(x for x in unicodedata.normalize('NFKD', data) if x in string.ascii_letters).lower()


def user_logout(request):

    logout(request)

    return HttpResponseRedirect("/")


def register(request):

    err = None

    if request.POST:

        email = request.POST[u'email']
        username = email
        password1 = request.POST[u'password1']
        password2 = request.POST[u'password2']

        if not password1 or not password2:
            err = "empty_password"

        if(password1 != password2):
            err = "password_mismatch"


        if not err:

            try:
                User.objects.create_user(username, email, password1, last_login=datetime.datetime.now())
            except: 
                err = "duplicate_username"

            if not err:

                user = authenticate(username=username, password=password1)
                if(user):
                    login(request, user)
                    return HttpResponseRedirect("/")


    return render(
        request=request,
        template_name='register.html',
        context={},
    )


def auth(request):

    err = False

    if(request.method == 'POST'):

        post = request.POST

        try:
            email = request.POST['username']
            password = request.POST['password']
        except: err = 'failed login code: 1'

        try:
            user = User.objects.get(email=email)
        except:
            user = None
            err = 'failed login code: 2'

        if(user):
            try:
                user = authenticate(username=user.username, password=password)
                login(request, user)
            except: err = 'failed login code: 3'
        
        if(not err):
            return HttpResponseRedirect("/")


    return render(request,template_name='login.html',context={'err':err},)
