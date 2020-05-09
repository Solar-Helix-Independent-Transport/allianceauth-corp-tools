from django.conf.urls import url

from . import views

app_name = 'corptools'

urlpatterns = [
    url(r'^$', views.corptools_menu, name='view'),
    ]
