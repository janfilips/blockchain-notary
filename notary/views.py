# -*- coding: utf-8 -*-

import datetime

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone

from notary.models import Submissions

def about(request):

    return render(
        request=request,
        template_name='about.html',
        context={},
    )


def ajax_list_transaction_history(request):

    try:
        ongoing_submissions = []
        # BUG this is completely hiding away transactions which is not the intended behavior
        #date_from=timezone.now() - datetime.timedelta(minutes=getattr(settings, "REMOVE_FROM_OUTGOING_TIME", 1))
        # What we really want to do here is to identify these transactions and set them manually to has_proof=True
        _ongoing_submissions = Submissions.objects.filter(has_proof=False).order_by("-transaction_created_at")

        # 1st we need to get a list of those ongoing transactions that are older than say 10 hours
        # 2nd we neet to itterate through this list and set these transactions to has_proof=True

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
        _certifications = Submissions.objects.filter(has_proof=True).order_by("-transaction_created_at")[:28]

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
            'result': 'true',
            'ongoing_submissions': ongoing_submissions,
            'certifications': certifications,
        }

        return JsonResponse(response)
    except:
        return JsonResponse({'result': 'false'})

def ajax_set_ongoing_submissions(request):
    if(request.POST):
        try:
            Submissions.objects.create(
                file_name=request.POST.get("file_name", None),
                file_mime_type=request.POST.get("file_mime_type", None),
                file_size=request.POST.get("file_size", None),
                file_last_modified=request.POST.get("file_last_modified", None),
                file_hash=request.POST.get("file_hash", None),
                has_proof=request.POST.get("has_proof", None),
                transaction_hash=request.POST.get("transaction_hash", None)
                )
            return JsonResponse({'result': 'true'})
        except:
            return JsonResponse({'result': 'false'})
    else:
        return JsonResponse({'result': 'false'})

def ajax_get_document_data(request):
    if(request.POST):
        try:
            document = Submissions.objects.filter(file_hash=request.POST.get("file_hash"))
            date=document[0].transaction_created_at
            transaction_hash=document[0].transaction_hash
            return JsonResponse({
                "result": "true",
                "date": date,
                "transaction_hash": transaction_hash 
            })
        except Exception as exception:
            print("Exception: "+exception)
            return JsonResponse({"result": "false"})
    else:
        return JsonResponse({'result': 'false'})

def ajax_send_mail(request):
    if(request.POST):
        try:
            send_mail(getattr(settings, "SITE_NAME"), "", getattr(settings, "EMAIL_HOST_USER"), [request.POST.get("mail_to")], html_message=request.POST.get("mail_body"))
            return JsonResponse({"result": "true"})
        except Exception as exception:
            print("Exception: "+exception)
            return JsonResponse({"result": "false"})
    else:
        return JsonResponse({'result': 'false'})

def ajax_set_proof(request):
    if(request.POST):
        try:
            proof=Submissions.objects.filter(transaction_hash=request.POST.get("transaction_hash")).update(has_proof=True)
            return JsonResponse({'result': 'true'})
        except:
            return JsonResponse({'result': 'false'})
    else:
        return JsonResponse({'result': 'false'})

def home(request):
 
    if request.user.is_anonymous:
        return render(
            request=request,
            template_name='index.html',
            context={
                "settings_bytecode_notarise": getattr(settings, "BYTECODE_NOTARISE"),
                "settings_bytecode_storage": getattr(settings, "BYTECODE_STORAGE"),
                "settings_contract_address_notarise": getattr(settings, "CONTRACT_ADDRESS_NOTARISE"),
                "settings_contract_address_storage": getattr(settings, "CONTRACT_ADDRESS_STORAGE"),
                "settings_email_notarised_html": getattr(settings, "EMAIL_NOTARISED_HTML"),
                "settings_gas": getattr(settings, "GAS"),
                "settings_ether_value": getattr(settings, "ETHER_VALUE")
            },
        )


    user = request.user
    user.last_login = datetime.datetime.now()
    user.save()

    ip = request.META['REMOTE_ADDR']
    print(ip)

    return render(
        request=request,
        template_name='dashboard.html',
        context={'user':request.user,},
    )
