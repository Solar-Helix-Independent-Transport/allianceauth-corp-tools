from django.urls import include, re_path

from corptools.audit_views.character import (assets, assets_lists, clones,
                                             contacts, market, notifications,
                                             pub_data, roles, skills, status,
                                             wallet)
from corptools.audit_views.corporation import corp_list

from . import app_settings, views
from .api import api

app_name = 'corptools'

_character_ulrs = [
    re_path(r'^pub/$', pub_data, name='public_data'),
    re_path(r'^overview/$', status, name='overview'),
]

if app_settings.CT_CHAR_ASSETS_MODULE:
    _character_ulrs += [
        re_path(r'^assets/$', assets, name='assets'),
        re_path(r'^assets_lists/(?P<location_id>(\d)*)/$',
                assets_lists, name='assets_lists'),
    ]

if app_settings.CT_CHAR_WALLET_MODULE:
    _character_ulrs += [
        re_path(r'^market/$', market, name='market'),
        re_path(r'^wallet/$', wallet, name='wallet'),
    ]

if app_settings.CT_CHAR_ROLES_MODULE:
    _character_ulrs += [
        re_path(r'^roles/$', roles, name='roles'),
    ]

if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
    _character_ulrs += [
        re_path(r'^notes/$', notifications, name='notifications'),
    ]

if app_settings.CT_CHAR_CLONES_MODULE:
    _character_ulrs += [
        re_path(r'^clones/$', clones, name='clones'),
    ]

if app_settings.CT_CHAR_SKILLS_MODULE:
    _character_ulrs += [
        re_path(r'^skills/$', skills, name='skills'),
    ]

if app_settings.CT_CHAR_CONTACTS_MODULE:
    _character_ulrs += [
        re_path(r'^contacts/$', contacts, name='contacts'),
    ]

urlpatterns = [
    re_path(r'^$', views.corptools_menu, name='view'),
    re_path(r'^api/', api.urls),
    re_path(r'^r/$', views.react_menu, name='react'),
    re_path(r'^r/(?P<character_id>(\d)*)/',
            views.react_main, name='reactmain'),
    re_path(r'^check_account/(?P<character_id>(\d)*)/$',
            views.update_account, name='update_account'),
    re_path(r'^admin/$', views.admin, name='admin'),
    re_path(r'^admin_add_pyfa_xml/$', views.admin_add_pyfa_xml,
            name='admin_add_pyfa_xml'),
    re_path(r'^admin_create_tasks/$', views.admin_create_tasks,
            name='admin_create_tasks'),
    re_path(r'^run_tasks/$', views.admin_run_tasks, name='run_tasks'),
    re_path(r'^char/add/$', views.add_char, name='add_char'),
    re_path(r'^char/(?P<character_id>(\d)*)/', include(_character_ulrs)),
    re_path(r'^corp/', include([
        re_path(r'^menu/', corp_list, name='corp_menu'),
        re_path(r'^r/$', views.react_corp, name='corp_react'),
        re_path(r'^add/$', views.add_corp, name='add_corp'),
        re_path(r'^add_options/$', views.add_corp_section,
                name='add_corp_options'),
    ])),
]
