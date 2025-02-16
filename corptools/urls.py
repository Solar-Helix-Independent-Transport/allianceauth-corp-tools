from django.urls import include, path, re_path

from corptools.audit_views.character import (
    assets, assets_lists, clones, contacts, market, notifications, pub_data,
    roles, skills, status, wallet,
)
from corptools.audit_views.corporation import corp_list

from . import app_settings, views
from .api import api

app_name = 'corptools'

_character_ulrs = [
    path('pub/', pub_data, name='public_data'),
    path('overview/', status, name='overview'),
]

if app_settings.CT_CHAR_ASSETS_MODULE:
    _character_ulrs += [
        path('assets/', assets, name='assets'),
        re_path(r'^assets_lists/(?P<location_id>(\d)*)/$',
                assets_lists, name='assets_lists'),
    ]

if app_settings.CT_CHAR_WALLET_MODULE:
    _character_ulrs += [
        path('market/', market, name='market'),
        path('wallet/', wallet, name='wallet'),
    ]

if app_settings.CT_CHAR_ROLES_MODULE:
    _character_ulrs += [
        path('roles/', roles, name='roles'),
    ]

if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
    _character_ulrs += [
        path('notes/', notifications, name='notifications'),
    ]

if app_settings.CT_CHAR_CLONES_MODULE:
    _character_ulrs += [
        path('clones/', clones, name='clones'),
    ]

if app_settings.CT_CHAR_SKILLS_MODULE:
    _character_ulrs += [
        path('skills/', skills, name='skills'),
    ]

if app_settings.CT_CHAR_CONTACTS_MODULE:
    _character_ulrs += [
        path('contacts/', contacts, name='contacts'),
    ]

urlpatterns = [
    path('', views.corptools_menu, name='view'),
    re_path(r'^api/', api.urls),
    path(
        'r/',
        views.react_menu_v4,
        name='react'
    ),
    re_path(
        r'^r/(?P<character_id>(\d)*)/',
        views.react_main,
        name='reactmain'
    ),
    re_path(
        'r_beta/corp',
        views.react_corp_beta,
        name='corp_beta_react'
    ),
    path(
        'r_legacy/',
        views.react_menu,
        name='reactlegacy'
    ),
    re_path(
        r'^r_legacy/(?P<character_id>(\d)*)/',
        views.v3_ui_render,
        name='reactlegacymain'
    ),
    re_path(r'^check_account/(?P<character_id>(\d)*)/$',
            views.update_account, name='update_account'),
    path('admin/', views.admin, name='admin'),
    path('admin_add_pyfa_xml/', views.admin_add_pyfa_xml,
         name='admin_add_pyfa_xml'),
    path('admin_create_tasks/', views.admin_create_tasks,
         name='admin_create_tasks'),
    path('run_tasks/', views.admin_run_tasks, name='run_tasks'),
    path('char/add/', views.add_char, name='add_char'),
    re_path(r'^char/(?P<character_id>(\d)*)/', include(_character_ulrs)),
    path('corp/', include([
        re_path(r'^menu/', corp_list, name='corp_menu'),
        path('r/', views.react_corp, name='corp_react'),
        path('add/', views.add_corp, name='add_corp'),
        path('add_options/', views.add_corp_section,
             name='add_corp_options'),
        re_path(r'^dashboard/fuel', views.fuel_levels, name='fuel_dashboard'),
        re_path(r'^dashboard/metenox', views.metenox_levels,
                name='drill_dashboard'),
    ])),
]
