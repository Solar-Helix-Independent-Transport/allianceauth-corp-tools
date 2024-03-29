# Generated by Django 4.0.2 on 2022-04-12 08:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0071_alter_corptoolsconfiguration_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='corporationaudit',
            options={'permissions': (('own_corp_manager', "Can access own corporations's data."), ('alliance_corp_manager', "Can access other corporations's data for own alliance."), (
                'state_corp_manager', "Can access other corporations's data for own state."), ('global_corp_manager', "Can access all corporations's data."))},
        ),
    ]
