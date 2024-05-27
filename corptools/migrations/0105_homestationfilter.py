# Generated by Django 4.2.13 on 2024-05-27 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0104_remove_currentshipfilter_categories_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomeStationFilter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('description', models.CharField(max_length=500)),
                ('constellations', models.ManyToManyField(blank=True, help_text='Limit filter to specific Constellations', to='corptools.mapconstellation')),
                ('regions', models.ManyToManyField(blank=True, help_text='Limit filter to specific Regions', to='corptools.mapregion')),
                ('structures', models.ManyToManyField(blank=True, help_text='Limit filter to specific Structures', to='corptools.evelocation')),
                ('systems', models.ManyToManyField(blank=True, help_text='Limit filter to specific Systems', to='corptools.mapsystem')),
            ],
            options={
                'verbose_name': 'Smart Filter: Home Station (Death Clone)',
                'verbose_name_plural': 'Smart Filter: Home Station (Death Clone)',
            },
        ),
    ]
