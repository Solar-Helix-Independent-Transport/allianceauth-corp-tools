# Standard Library
import json
from datetime import datetime, timedelta
from pathlib import Path

# Django
from django.conf import settings
from django.core import serializers
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

from ..models.audits import CorptoolsConfiguration
from .housekeeping_tasks import WALLET_NPC_TYPES

logger = get_extension_logger(__name__)


def _export_root() -> Path:
    path = Path(settings.MEDIA_ROOT) / "wallet_exports"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _fixture_entity_dir(entity_type: str, entity_id: int, entity_name: str) -> Path:
    safe_name = "".join(
        c if c.isalnum() or c in "-_" else "_" for c in entity_name)
    d = _export_root() / "fixtures" / entity_type / f"{entity_id}_{safe_name}"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _read_fixture_watermark(entity_dir: Path):
    wm = entity_dir / "watermark.json"
    if not wm.exists():
        return None
    try:
        with open(wm) as f:
            return datetime.fromisoformat(json.load(f)["last_exported"])
    except Exception:
        return None


def _write_fixture_watermark(entity_dir: Path, last_date):
    with open(entity_dir / "watermark.json", "w") as f:
        json.dump({"last_exported": last_date.isoformat()}, f)


def export_character_wallet_fixtures(character_id: int) -> str:
    from ..models import CharacterAudit, CharacterWalletJournalEntry

    config = CorptoolsConfiguration.get_solo()
    cutoff = timezone.now() - timedelta(days=config.wallet_journal_retention_days)

    try:
        audit = CharacterAudit.objects.get(
            character__character_id=character_id)
    except CharacterAudit.DoesNotExist:
        return f"No audit for character {character_id}"

    entity_dir = _fixture_entity_dir(
        "characters", character_id, audit.character.character_name)
    since = _read_fixture_watermark(entity_dir)

    date_filter = {"date__lt": cutoff}
    if since is not None:
        date_filter["date__gt"] = since

    entries = CharacterWalletJournalEntry.objects.filter(
        character=audit,
        ref_type__in=WALLET_NPC_TYPES,
        **date_filter,
    ).order_by("date")

    count = entries.count()
    if count == 0:
        return f"No new archivable wallet data for {audit.character.character_name}"

    safe_name = "".join(
        c if c.isalnum() or c in "-_" else "_" for c in audit.character.character_name)
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    filepath = entity_dir / f"{safe_name}_{timestamp}.json"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(serializers.serialize("json", entries))

    last_date = entries.values_list("date", flat=True).last()
    _write_fixture_watermark(entity_dir, last_date)

    logger.info(
        f"Fixture export: {audit.character.character_name} — {count} rows → {filepath}")
    return f"{audit.character.character_name}: fixture exported {count} rows"


def export_corporation_wallet_fixtures(corporation_id: int) -> str:
    from ..models import CorporationAudit, CorporationWalletJournalEntry

    config = CorptoolsConfiguration.get_solo()
    cutoff = timezone.now() - timedelta(days=config.wallet_journal_retention_days)

    try:
        audit = CorporationAudit.objects.get(
            corporation__corporation_id=corporation_id)
    except CorporationAudit.DoesNotExist:
        return f"No audit for corporation {corporation_id}"

    entity_dir = _fixture_entity_dir(
        "corporations", corporation_id, audit.corporation.corporation_name)
    since = _read_fixture_watermark(entity_dir)

    date_filter = {"date__lt": cutoff}
    if since is not None:
        date_filter["date__gt"] = since

    entries = CorporationWalletJournalEntry.objects.filter(
        division__corporation=audit,
        ref_type__in=WALLET_NPC_TYPES,
        **date_filter,
    ).order_by("date")

    count = entries.count()
    if count == 0:
        return f"No new archivable wallet data for {audit.corporation.corporation_name}"

    safe_name = "".join(
        c if c.isalnum() or c in "-_" else "_" for c in audit.corporation.corporation_name)
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    filepath = entity_dir / f"{safe_name}_{timestamp}.json"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(serializers.serialize("json", entries))

    last_date = entries.values_list("date", flat=True).last()
    _write_fixture_watermark(entity_dir, last_date)

    logger.info(
        f"Fixture export: {audit.corporation.corporation_name} — {count} rows → {filepath}")
    return f"{audit.corporation.corporation_name}: fixture exported {count} rows"
