# Django
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("corptools", "0001_eve_sde_initial"),
        ("eveonline", "0020_alter_eveallianceinfo_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="characteraudit",
            name="update_timestamps",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="corporationaudit",
            name="update_timestamps",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="corporationaudit",
            name="change_timestamps",
            field=models.JSONField(default=dict),
        ),
        migrations.AddIndex(
            model_name="characteraudit",
            index=models.Index(fields=["active"],
                               name="corptools_c_active_14f202_idx"),
        ),
    ]
