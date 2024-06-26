# Generated by Django 3.1.1 on 2021-01-12 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0037_mapsystemmoon_mapsystemplanet'),
    ]

    operations = [
        migrations.CreateModel(
            name='FullyLoadedFilter',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('description', models.CharField(max_length=500)),
            ],
            options={
                'verbose_name': 'Smart Filter: Audit Fully Loaded',
                'verbose_name_plural': 'Smart Filter: Audit Fully Loaded',
            },
        ),
        migrations.AlterField(
            model_name='characterasset',
            name='blueprint_copy',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='charactermarketorder',
            name='is_buy_order',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='corpasset',
            name='blueprint_copy',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='corporationhistory',
            name='is_deleted',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='corporationmarketorder',
            name='is_buy_order',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='is_read',
            field=models.BooleanField(default=None, null=True),
        ),
        migrations.CreateModel(
            name='Skillfilter',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('description', models.CharField(max_length=500)),
                ('required_skill_lists', models.ManyToManyField(
                    to='corptools.SkillList')),
                ('single_req_skill_lists', models.ManyToManyField(
                    blank=True, related_name='single_req', to='corptools.SkillList')),
            ],
            options={
                'verbose_name': 'Smart Filter: Skill list checks',
                'verbose_name_plural': 'Smart Filter: Skill list checks',
            },
        ),
        migrations.CreateModel(
            name='AssetsFilter',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('description', models.CharField(max_length=500)),
                ('eve_types', models.ManyToManyField(to='corptools.EveItemType')),
                ('systems', models.ManyToManyField(
                    blank=True, to='corptools.MapSystem')),
            ],
            options={
                'verbose_name': 'Smart Filter: Assets and Locations',
                'verbose_name_plural': 'Smart Filter: Assets and Locations',
            },
        ),
    ]
