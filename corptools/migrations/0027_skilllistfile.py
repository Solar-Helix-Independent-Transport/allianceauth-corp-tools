# Generated by Django 2.2.12 on 2020-08-14 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0026_auto_20200811_0846'),
    ]

    operations = [
        migrations.CreateModel(
            name='SkillListFile',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, max_length=255)),
                ('skilllist', models.FileField(upload_to='skill_lists/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
