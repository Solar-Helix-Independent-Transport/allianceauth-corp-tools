# Django
from django.db import migrations

_CHAR_FIELD_MAP = {
    "pub_data": "last_update_pub_data",
    "skills": "last_update_skills",
    "skill_que": "last_update_skill_que",
    "clones": "last_update_clones",
    "contacts": "last_update_contacts",
    "contracts": "last_update_contracts",
    "assets": "last_update_assets",
    "wallet": "last_update_wallet",
    "orders": "last_update_orders",
    "notif": "last_update_notif",
    "roles": "last_update_roles",
    "titles": "last_update_titles",
    "mails": "last_update_mails",
    "location": "last_update_location",
    "loyaltypoints": "last_update_loyaltypoints",
    "mining": "last_update_mining",
    "indy": "last_update_indy",
    "login": "last_update_login",
}

_CORP_UPDATE_FIELD_MAP = {
    "pub_data": "last_update_pub_data",
    "assets": "last_update_assets",
    "structures": "last_update_structures",
    "moons": "last_update_moons",
    "observers": "last_update_observers",
    "wallet": "last_update_wallet",
    "contracts": "last_update_contracts",
    "industry_jobs": "last_update_industry_jobs",
    "known_login": "last_update_known_login",
}

_CORP_CHANGE_FIELD_MAP = {
    "pub_data": "last_change_pub_data",
    "assets": "last_change_assets",
    "structures": "last_change_structures",
    "moons": "last_change_moons",
    "observers": "last_change_observers",
    "wallet": "last_change_wallet",
    "contracts": "last_change_contracts",
    "industry_jobs": "last_change_industry_jobs",
}

_BATCH_SIZE = 500


def _copy_char_timestamps(apps, schema_editor):
    CharacterAudit = apps.get_model("corptools", "CharacterAudit")
    batch = []
    for audit in CharacterAudit.objects.all().iterator(chunk_size=_BATCH_SIZE):
        for key, old_field in _CHAR_FIELD_MAP.items():
            val = getattr(audit, old_field)
            if val is not None:
                audit.update_timestamps[key] = val.isoformat()
        batch.append(audit)
        if len(batch) >= _BATCH_SIZE:
            CharacterAudit.objects.bulk_update(batch, ["update_timestamps"])
            batch.clear()
    if batch:
        CharacterAudit.objects.bulk_update(batch, ["update_timestamps"])


def _restore_char_timestamps(apps, schema_editor):
    CharacterAudit = apps.get_model("corptools", "CharacterAudit")
    # Standard Library
    import datetime
    batch = []
    for audit in CharacterAudit.objects.all().iterator(chunk_size=_BATCH_SIZE):
        for key, old_field in _CHAR_FIELD_MAP.items():
            val = audit.update_timestamps.get(key)
            if val is not None:
                setattr(audit, old_field, datetime.datetime.fromisoformat(val))
        batch.append(audit)
        if len(batch) >= _BATCH_SIZE:
            CharacterAudit.objects.bulk_update(
                batch, list(_CHAR_FIELD_MAP.values()))
            batch.clear()
    if batch:
        CharacterAudit.objects.bulk_update(
            batch, list(_CHAR_FIELD_MAP.values()))


def _copy_corp_timestamps(apps, schema_editor):
    CorporationAudit = apps.get_model("corptools", "CorporationAudit")
    batch = []
    for audit in CorporationAudit.objects.all().iterator(chunk_size=_BATCH_SIZE):
        for key, old_field in _CORP_UPDATE_FIELD_MAP.items():
            val = getattr(audit, old_field)
            if val is not None:
                audit.update_timestamps[key] = val.isoformat()
        for key, old_field in _CORP_CHANGE_FIELD_MAP.items():
            val = getattr(audit, old_field)
            if val is not None:
                audit.change_timestamps[key] = val.isoformat()
        batch.append(audit)
        if len(batch) >= _BATCH_SIZE:
            CorporationAudit.objects.bulk_update(
                batch, ["update_timestamps", "change_timestamps"])
            batch.clear()
    if batch:
        CorporationAudit.objects.bulk_update(
            batch, ["update_timestamps", "change_timestamps"])


def _restore_corp_timestamps(apps, schema_editor):
    CorporationAudit = apps.get_model("corptools", "CorporationAudit")
    # Standard Library
    import datetime
    batch = []
    for audit in CorporationAudit.objects.all().iterator(chunk_size=_BATCH_SIZE):
        for key, old_field in _CORP_UPDATE_FIELD_MAP.items():
            val = audit.update_timestamps.get(key)
            if val is not None:
                setattr(audit, old_field, datetime.datetime.fromisoformat(val))
        for key, old_field in _CORP_CHANGE_FIELD_MAP.items():
            val = audit.change_timestamps.get(key)
            if val is not None:
                setattr(audit, old_field, datetime.datetime.fromisoformat(val))
        batch.append(audit)
        if len(batch) >= _BATCH_SIZE:
            all_fields = list(_CORP_UPDATE_FIELD_MAP.values()) + \
                list(_CORP_CHANGE_FIELD_MAP.values())
            CorporationAudit.objects.bulk_update(batch, all_fields)
            batch.clear()
    if batch:
        all_fields = list(_CORP_UPDATE_FIELD_MAP.values()) + \
            list(_CORP_CHANGE_FIELD_MAP.values())
        CorporationAudit.objects.bulk_update(batch, all_fields)


class Migration(migrations.Migration):
    dependencies = [
        ("corptools", "0002_add_timestamp_jsonfields"),
    ]

    operations = [
        migrations.RunPython(_copy_char_timestamps,
                             reverse_code=_restore_char_timestamps),
        migrations.RunPython(_copy_corp_timestamps,
                             reverse_code=_restore_corp_timestamps),
    ]
