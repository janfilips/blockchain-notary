# -*- coding: utf-8 -*-

import os
import time
import socket
import logging
import datetime
import base64

from django.shortcuts import render_to_response
from django.template import RequestContext

from django.http import HttpResponseForbidden
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.conf import settings

def about(request):

    print('--  about:')

    ip = request.META['REMOTE_ADDR']
    print('ip',ip)

    return render(
        request=request,
        template_name='about.html',
        context={},
    )


def home(request):

    print('--  web:')
 
    if request.user.is_anonymous:

        return render(
            request=request,
            template_name='index.html',
            context={},
        )


    user = request.user
    user.last_login = datetime.datetime.now()
    user.save()

    ip = request.META['REMOTE_ADDR']
    print('ip',ip)

    return render(
        request=request,
        template_name='dashboard.html',
        context={'user':request.user,},
    )
