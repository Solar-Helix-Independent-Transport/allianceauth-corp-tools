from celery import app

from django.conf.urls import url
from django.urls import path, include

from . import views
from corptools.audit_views.character import assets, wallet, pub_data, contacts, skills, clones, assets_lists, roles, market, status, notifications
from corptools.audit_views.corporation import corp_list
from . import app_settings

from .api import api

app_name = 'corptools'

_character_ulrs = [
    url(r'^pub/$', pub_data, name='public_data'),
    url(r'^overview/$', status, name='overview'),
]

if app_settings.CT_CHAR_ASSETS_MODULE:
    _character_ulrs += [
        url(r'^assets/$', assets, name='assets'),
        url(r'^assets_lists/(?P<location_id>(\d)*)/$',
            assets_lists, name='assets_lists'),
    ]

if app_settings.CT_CHAR_WALLET_MODULE:
    _character_ulrs += [
        url(r'^market/$', market, name='market'),
        url(r'^wallet/$', wallet, name='wallet'),
    ]

if app_settings.CT_CHAR_ROLES_MODULE:
    _character_ulrs += [
        url(r'^roles/$', roles, name='roles'),
    ]

if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
    _character_ulrs += [
        url(r'^notes/$', notifications, name='notifications'),
    ]

if app_settings.CT_CHAR_CLONES_MODULE:
    _character_ulrs += [
        url(r'^clones/$', clones, name='clones'),
    ]

if app_settings.CT_CHAR_SKILLS_MODULE:
    _character_ulrs += [
        url(r'^skills/$', skills, name='skills'),
    ]

if app_settings.CT_CHAR_CONTACTS_MODULE:
    _character_ulrs += [
        url(r'^contacts/$', contacts, name='contacts'),
    ]

urlpatterns = [
    url(r'^$', views.corptools_menu, name='view'),
    url(r'^api/', api.urls),
    url(r'^r/$', views.react_menu, name='react'),
    url(r'^r/(?P<character_id>(\d)*)/', views.react_main, name='reactmain'),
    url(r'^check_account/(?P<character_id>(\d)*)/$',
        views.update_account, name='update_account'),
    url(r'^admin/$', views.admin, name='admin'),
    url(r'^admin_add_pyfa_xml/$', views.admin_add_pyfa_xml,
        name='admin_add_pyfa_xml'),
    url(r'^admin_create_tasks/$', views.admin_create_tasks,
        name='admin_create_tasks'),
    url(r'^run_tasks/$', views.admin_run_tasks, name='run_tasks'),
    url(r'^char/add/$', views.add_char, name='add_char'),
    url(r'^char/(?P<character_id>(\d)*)/', include(_character_ulrs)),
    url(r'^corp/', include([
        url(r'^menu/', corp_list, name='corp_menu'),
        url(r'^add/$', views.add_corp, name='add_corp'),
    ])),
]
