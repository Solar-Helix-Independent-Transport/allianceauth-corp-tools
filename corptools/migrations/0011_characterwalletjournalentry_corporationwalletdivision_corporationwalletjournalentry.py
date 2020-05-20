# Generated by Django 2.2.9 on 2020-05-11 10:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0010_auto_20200511_0853'),
    ]

    operations = [
        migrations.CreateModel(
            name='CorporationWalletDivision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=2, max_digits=20)),
                ('division', models.IntegerField()),
                ('corporation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='corporation_division', to='corptools.CorporationAudit')),
            ],
        ),
        migrations.CreateModel(
            name='CorporationWalletJournalEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('balance', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('context_id', models.BigIntegerField(default=None, null=True)),
                ('context_id_type', models.CharField(choices=[('structure_id', 'structure_id'), ('station_id', 'station_id'), ('market_transaction_id', 'market_transaction_id'), ('character_id', 'character_id'), ('corporation_id', 'corporation_id'), ('alliance_id', 'alliance_id'), ('eve_system', 'eve_system'), ('industry_job_id', 'industry_job_id'), ('contract_id', 'contract_id'), ('planet_id', 'planet_id'), ('system_id', 'system_id'), ('type_id', 'type_id')], default=None, max_length=30, null=True)),
                ('date', models.DateTimeField()),
                ('description', models.CharField(max_length=500)),
                ('first_party_id', models.IntegerField(default=None, null=True)),
                ('entry_id', models.BigIntegerField()),
                ('reason', models.CharField(default=None, max_length=500, null=True)),
                ('ref_type', models.CharField(max_length=72)),
                ('second_party_id', models.IntegerField(default=None, null=True)),
                ('tax', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('tax_receiver_id', models.IntegerField(default=None, null=True)),
                ('division', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='corptools.CorporationWalletDivision')),
                ('first_party_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='corp_first_party', to='corptools.EveName')),
                ('second_party_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='corp_second_party', to='corptools.EveName')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CharacterWalletJournalEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('balance', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('context_id', models.BigIntegerField(default=None, null=True)),
                ('context_id_type', models.CharField(choices=[('structure_id', 'structure_id'), ('station_id', 'station_id'), ('market_transaction_id', 'market_transaction_id'), ('character_id', 'character_id'), ('corporation_id', 'corporation_id'), ('alliance_id', 'alliance_id'), ('eve_system', 'eve_system'), ('industry_job_id', 'industry_job_id'), ('contract_id', 'contract_id'), ('planet_id', 'planet_id'), ('system_id', 'system_id'), ('type_id', 'type_id')], default=None, max_length=30, null=True)),
                ('date', models.DateTimeField()),
                ('description', models.CharField(max_length=500)),
                ('first_party_id', models.IntegerField(default=None, null=True)),
                ('entry_id', models.BigIntegerField()),
                ('reason', models.CharField(default=None, max_length=500, null=True)),
                ('ref_type', models.CharField(max_length=72)),
                ('second_party_id', models.IntegerField(default=None, null=True)),
                ('tax', models.DecimalField(decimal_places=2, default=None, max_digits=20, null=True)),
                ('tax_receiver_id', models.IntegerField(default=None, null=True)),
                ('character', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='corptools.CharacterAudit')),
                ('first_party_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='char_first_party', to='corptools.EveName')),
                ('second_party_name', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='char_second_party', to='corptools.EveName')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
