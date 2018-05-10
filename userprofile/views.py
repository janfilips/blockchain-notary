# -*- coding: utf-8 -*-

import os
import time
import logging
import unicodedata
import datetime

import string, pickle
from random import choice

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.translation import ugettext_lazy as _

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render

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
            print(err)

        if(password1 != password2):
            err = "password_mismatch"
            print(err)


        if not err:

            passwd = password1

            try:
                User.objects.create_user(username, email, passwd, last_login=datetime.datetime.now())
            except:
                err = "duplicate_username"
                print(err)

            if not err:

                user = authenticate(username=username, password=passwd)

                if(user):

                    login(request, user)

                    return HttpResponseRedirect("/")

    return HttpResponseRedirect("/")


def auth(request):

    err = False

    if(request.method == 'POST'):

        post = request.POST

        try:
            email = request.POST['username']
            passwprd = request.POST['password']
        except:
            err = 'failed login code:1'
            #return HttpResponseRedirect("/error")


        try:
            user = User.objects.get(email=email)
        except:
            err = 'failed login code:2'
            #return HttpResponseRedirect("/error")

        try:
            user = authenticate(username=user.username, password=passwprd)
            login(request, user)
        except:
            err = 'failed login code:3'
            #return HttpResponseRedirect("/register")

        if(not err):
            print('user logged in', user)
            return HttpResponseRedirect("/")

    return render(request,template_name='err.html',context={'err':err},)
