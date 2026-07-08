# Django
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("corptools", "0007_corptoolsconfiguration_notification_retention_days_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="characterasset",
            name="material_efficiency",
            field=models.SmallIntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="characterasset",
            name="time_efficiency",
            field=models.SmallIntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="characterasset",
            name="runs",
            field=models.IntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="corpasset",
            name="material_efficiency",
            field=models.SmallIntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="corpasset",
            name="time_efficiency",
            field=models.SmallIntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="corpasset",
            name="runs",
            field=models.IntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="corptoolsconfiguration",
            name="disable_update_blueprints",
            field=models.BooleanField(
                blank=True,
                default=False,
                help_text="Temporarily disable the ESI pulls for Blueprint ME/TE/Runs Data",
            ),
        ),
    ]
