# Generated by Django 2.2.12 on 2020-05-20 09:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0012_skilltotals'),
    ]

    operations = [
        migrations.CreateModel(
            name='EveItemDogmaAttribute',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('attribute_id', models.BigIntegerField(default=None, null=True)),
                ('value', models.FloatField(default=None, null=True)),
                ('eve_type', models.ForeignKey(default=None, null=True,
                                               on_delete=django.db.models.deletion.SET_NULL, to='corptools.EveItemType')),
            ],
        ),
    ]
