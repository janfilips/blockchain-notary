from django.conf.urls import include, url
from django.conf import settings

from notary.views import home
from userprofile.views import auth, register, user_logout


urlpatterns = [
    # common views..
    url(r'^$', home, name='home'),
    #url(r'^about/$', 'notary.views.about', name='about'),
    # userprofile stuff..
    url(r'^login/$', auth, name='login'),
    url(r'^register/$', register, name='login'),
    url(r'^logout/$', user_logout, name='logout'),
    #url(r'^account/settings/$', 'userprofile.views.account_settings', name='account_settings'),
    #url(r'^account/password/$', 'userprofile.views.change_password', name='change_password'),
]

#urlpatterns += patterns('',
#    # static and media files
#    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
#        'document_root': settings.STATIC_ROOT,
#    }),
#    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
#        'document_root': settings.MEDIA_ROOT, 'show_indexes': False,
#    }),
#)
