# Generated by Django 4.2.4 on 2023-08-20 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0090_rename_cache_expire_assets_corporationaudit_last_change_assets_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='assetsfilter',
            name='count_message_only',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='fullyloadedfilter',
            name='count_message_only',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='skillfilter',
            name='count_message_only',
            field=models.BooleanField(default=False),
        ),
    ]
