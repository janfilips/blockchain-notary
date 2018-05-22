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

import json
from django.core.serializers.json import DjangoJSONEncoder

from notary.models import Submissions

def about(request):

    ip = request.META['REMOTE_ADDR']
    print('ip',ip)

    return render(
        request=request,
        template_name='about.html',
        context={},
    )


def ajax_list_ongoing_submissions(request):

    ongoing_submissions = []
    _ongoing_submissions = Submissions.objects.filter(has_proof=False)

    for _submission in _ongoing_submissions:

        submission = {
            'file_name': _submission.file_name,
            'file_mime_type': _submission.file_mime_type,
            'file_size': _submission.file_size,
            'file_last_modified': _submission.file_last_modified,
            'file_hash': _submission.file_hash,
            'has_proof': _submission.has_proof,
            'transaction_hash': _submission.transaction_hash,
            'transaction_created_at': _submission.transaction_created_at,
        }
        ongoing_submissions.append(submission)


    certifications = []
    _certifications = Submissions.objects.filter(has_proof=False)

    for _certificate in _certifications:
        _certificate = {
            'file_name': _certificate.file_name,
            'file_mime_type': _certificate.file_mime_type,
            'file_size': _certificate.file_size,
            'file_last_modified': _certificate.file_last_modified,
            'file_hash': _certificate.file_hash,
            'has_proof': _certificate.has_proof,
            'transaction_hash': _certificate.transaction_hash,
            'transaction_created_at': _certificate.transaction_created_at,
        }
        certifications.append(_certificate)
        

    response = {
        'ongoing_submissions': ongoing_submissions,
        'certifications': certifications,
    }

    return JsonResponse(response)

def ajax_set_ongoing_submissions(request):

    if(request.POST):

        ongoing_submission=Submissions.objects.create(
            file_name=request.POST.get("file_name", None),
            file_mime_type=request.POST.get("file_mime_type", None),
            file_size=request.POST.get("file_size", None),
            file_last_modified=request.POST.get("file_last_modified", None),
            file_hash=request.POST.get("file_hash", None),
            has_proof=request.POST.get("has_proof", None),
            transaction_hash=request.POST.get("transaction_hash", None)
            )
        return JsonResponse({"result": "true"})

    return HttpResponse("huh?")


def home(request):
 
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

    return render(
        request=request,
        template_name='dashboard.html',
        context={'user':request.user,},
    )
