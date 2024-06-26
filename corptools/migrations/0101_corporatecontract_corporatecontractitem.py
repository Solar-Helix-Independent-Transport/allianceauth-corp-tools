# Generated by Django 4.2.9 on 2024-02-12 10:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0100_mapjumpbridge_manually_input'),
    ]

    operations = [
        migrations.CreateModel(
            name='CorporateContract',
            fields=[
                ('id', models.CharField(max_length=50,
                 primary_key=True, serialize=False)),
                ('contract_id', models.BigIntegerField()),
                ('acceptor_id', models.IntegerField()),
                ('assignee_id', models.IntegerField()),
                ('issuer_id', models.IntegerField()),
                ('issuer_corporation_id', models.IntegerField()),
                ('collateral', models.DecimalField(blank=True,
                 decimal_places=2, max_digits=20, null=True)),
                ('buyout', models.DecimalField(blank=True,
                 decimal_places=2, max_digits=20, null=True)),
                ('price', models.DecimalField(blank=True,
                 decimal_places=2, max_digits=20, null=True)),
                ('reward', models.DecimalField(blank=True,
                 decimal_places=2, max_digits=20, null=True)),
                ('volume', models.DecimalField(blank=True,
                 decimal_places=2, max_digits=20, null=True)),
                ('days_to_complete', models.IntegerField(blank=True, null=True)),
                ('start_location_id', models.BigIntegerField(blank=True, null=True)),
                ('end_location_id', models.BigIntegerField(blank=True, null=True)),
                ('for_corporation', models.BooleanField()),
                ('date_accepted', models.DateTimeField(blank=True, null=True)),
                ('date_completed', models.DateTimeField(blank=True, null=True)),
                ('date_expired', models.DateTimeField()),
                ('date_issued', models.DateTimeField()),
                ('status', models.CharField(max_length=25)),
                ('contract_type', models.CharField(max_length=20)),
                ('availability', models.CharField(max_length=15)),
                ('title', models.CharField(max_length=256)),
                ('acceptor_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='corporationcontractacceptor', to='corptools.evename')),
                ('assignee_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='corporationcontractassignee', to='corptools.evename')),
                ('corporation', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='corptools.corporationaudit')),
                ('end_location_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL,
                 related_name='corporationcontractto', to='corptools.evelocation')),
                ('issuer_corporation_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='corporationcontractissuercorporation', to='corptools.evename')),
                ('issuer_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='corporationcontractissuer', to='corptools.evename')),
                ('start_location_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL,
                 related_name='corporationcontractfrom', to='corptools.evelocation')),
            ],
            options={
                'unique_together': {('corporation', 'contract_id')},
            },
        ),
        migrations.CreateModel(
            name='CorporateContractItem',
            fields=[
                ('id', models.AutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('is_included', models.BooleanField()),
                ('is_singleton', models.BooleanField()),
                ('quantity', models.IntegerField()),
                ('raw_quantity', models.IntegerField(blank=True, null=True)),
                ('record_id', models.BigIntegerField()),
                ('contract', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='corptools.corporatecontract')),
                ('type_name', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='corptools.eveitemtype')),
            ],
            options={
                'unique_together': {('record_id', 'contract')},
            },
        ),
    ]
