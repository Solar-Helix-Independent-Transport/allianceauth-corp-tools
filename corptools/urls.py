from django.urls import include, path, re_path

from . import views
from .api import api

app_name = 'corptools'

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
        'r/corp',
        views.react_corp_beta,
        name='corp_react'
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
    path('corp/', include([
        path('r_legacy/', views.react_corp, name='corp_legacy_react'),
        path('add/', views.add_corp, name='add_corp'),
        path('add_options/', views.add_corp_section,
             name='add_corp_options'),
        re_path(r'^dashboard/fuel', views.fuel_levels, name='fuel_dashboard'),
        re_path(r'^dashboard/metenox', views.metenox_levels,
                name='drill_dashboard'),
    ])),
]
