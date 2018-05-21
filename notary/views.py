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
from django.http import JsonResponse
from django.shortcuts import redirect, render

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.conf import settings

from notary.models import History

def about(request):

    print('--  about:')

    ip = request.META['REMOTE_ADDR']
    print('ip',ip)

    return render(
        request=request,
        template_name='about.html',
        context={},
    )

# Save transaction as pending into db (return true or false as result)
#def ongoing_submissions_ajax(request):

    # ongoing_submission=History.objects.create(
    #     file_name=request.POST.get("file_name", None),
    #     file_mime_type=request.POST.get("file_mime_type", None),
    #     file_size=request.POST.get("file_size", None),
    #     file_last_modified=request.POST.get("file_last_modified", None),
    #     file_hash=request.POST.get("file_hash", None),
    #     has_proof=request.POST.get("has_proof", None)
    #     )
    # return JsonResponse({"result": "true"})

# Set has_proof in db to true only (return true or false as result)
#def set_proof_ajax(request):
    #return JsonResponse({"result": "true"})

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
