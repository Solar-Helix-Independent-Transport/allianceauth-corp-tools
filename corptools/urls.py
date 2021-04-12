from django.conf.urls import url, include

from . import views
from corptools.audit_views.character import assets, wallet, pub_data, skills, clones, assets_lists
from corptools.audit_views.corporation import corp_list
app_name = 'corptools'

urlpatterns = [
    url(r'^$', views.corptools_menu, name='view'),
    url(r'^add_char/$', views.add_char, name='add_char'),
    url(r'^check_account/(?P<character_id>(\d)*)/$', views.update_account, name='update_account'),
    url(r'^add_corp/$', views.add_corp, name='add_corp'),
    url(r'^admin/$', views.admin, name='admin'),
    url(r'^admin_add_pyfa_xml/$', views.admin_add_pyfa_xml, name='admin_add_pyfa_xml'),
    url(r'^admin_create_tasks/$', views.admin_create_tasks, name='admin_create_tasks'),
    url(r'^run_tasks/$', views.admin_run_tasks, name='run_tasks'),
    url(r'^assets/$', assets, name='assets'),
    url(r'^assets/(?P<character_id>(\d)*)/$', assets, name='assets'),
    url(r'^assets_lists/(?P<character_id>(\d)*)/(?P<location_id>(\d)*)/$', assets_lists, name='assets_lists'),
    url(r'^wallet/$', wallet, name='wallet'),
    url(r'^wallet/(?P<character_id>(\d)*)/$', wallet, name='wallet'),
    url(r'^overview/$', pub_data, name='overview'),
    url(r'^overview/(?P<character_id>(\d)*)/$', pub_data, name='overview'),
    url(r'^skills/$', skills, name='skills'),
    url(r'^skills/(?P<character_id>(\d)*)/$', skills, name='skills'),
    url(r'^clones/$', clones, name='clones'),
    url(r'^clones/(?P<character_id>(\d)*)/$', clones, name='clones'),
    url(r'^corp/', include([
         url(r'^menu/', corp_list, name='corp_menu'),

    ])),
    ]
