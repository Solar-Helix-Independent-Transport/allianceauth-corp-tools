# Generated by Django 2.2.12 on 2020-08-04 08:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0018_corporationwalletdivision_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='JumpClone',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('jump_clone_id', models.IntegerField(default=None, null=True)),
                ('location_id', models.BigIntegerField()),
                ('location_type', models.CharField(choices=[
                 ('station', 'station'), ('structure', 'structure')], max_length=9)),
                ('name', models.CharField(default=None, max_length=255, null=True)),
                ('character', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='corptools.CharacterAudit')),
                ('location_name', models.ForeignKey(default=None, null=True,
                                                    on_delete=django.db.models.deletion.SET_NULL, to='corptools.EveLocation')),
            ],
        ),
        migrations.CreateModel(
            name='Implant',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('clone', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='corptools.JumpClone')),
                ('type_name', models.ForeignKey(default=None, null=True,
                                                on_delete=django.db.models.deletion.SET_NULL, to='corptools.EveItemType')),
            ],
        ),
    ]
