from django.conf.urls import url

from notary.views import home, about
from notary.views import ajax_set_ongoing_submissions, ajax_list_transaction_history, ajax_set_proof, ajax_send_mail
from profile.views import auth, register, user_logout

urlpatterns = [
    # common views..
    url(r'^$', home, name='home'),
    url(r'^about/$', about, name='about'),
    # ajax
    url(r'^ajax/ongoing_submissions/$', ajax_set_ongoing_submissions, name='ajax_set_ongoing_submissions'),
    url(r'^ajax/proof/$', ajax_set_proof, name='ajax_set_proof'),
    url(r'^ajax/history/list/$', ajax_list_transaction_history, name='ajax_list_transaction_history'),
    url(r'^ajax/send-mail/$', ajax_send_mail, name='ajax_send_mail'),
    # userprofile stuff..
    url(r'^login/$', auth, name='login'),
    url(r'^register/$', register, name='login'),
    url(r'^logout/$', user_logout, name='logout'),
]
