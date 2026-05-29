# Django
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("corptools", "0003_migrate_timestamp_data"),
    ]

    operations = [
        # CharacterAudit — 17 individual timestamp columns
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_assets"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_clones"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_contacts"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_contracts"),
        migrations.RemoveField(
            model_name="characteraudit", name="last_update_indy"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_location"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_loyaltypoints"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_mails"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_mining"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_notif"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_orders"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_pub_data"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_roles"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_skill_que"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_skills"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_titles"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_wallet"),
        migrations.RemoveField(model_name="characteraudit",
                               name="last_update_login"),
        # CorporationAudit — 9 last_update_* + 8 last_change_* columns
        migrations.RemoveField(
            model_name="corporationaudit", name="last_change_assets"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_change_contracts"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_change_industry_jobs"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_change_moons"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_change_observers"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_change_pub_data"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_change_structures"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_change_wallet"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_update_assets"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_update_contracts"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_update_industry_jobs"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_update_known_login"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_update_moons"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_update_observers"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_update_pub_data"),
        migrations.RemoveField(model_name="corporationaudit",
                               name="last_update_structures"),
        migrations.RemoveField(
            model_name="corporationaudit", name="last_update_wallet"),
    ]
