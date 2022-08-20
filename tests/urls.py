import allianceauth.urls
from django.urls import re_path

from . import views

urlpatterns = allianceauth.urls.urlpatterns

urlpatterns += [
    # Navhelper test urls
    re_path(r'^main-page/$', views.page, name='p1'),
    re_path(r'^main-page/sub-section/$', views.page, name='p1-s1'),
    re_path(r'^second-page/$', views.page, name='p1'),
]
