# Standard Library
from datetime import timedelta

# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# AA Example App
from corptools.models import CharacterWalletJournalEntry, CorporationWalletJournalEntry
from corptools.models.audits import CorptoolsConfiguration
from corptools.task_helpers.housekeeping_tasks import WALLET_NPC_TYPES


class Command(BaseCommand):
    help = 'Print total and purge-eligible wallet journal entry counts'

    def handle(self, *args, **options):
        config = CorptoolsConfiguration.get_solo()
        cutoff = timezone.now() - timedelta(days=config.wallet_journal_retention_days)

        char_total_count = CharacterWalletJournalEntry.objects.count()
        corp_total_count = CorporationWalletJournalEntry.objects.count()
        char_purge_count = CharacterWalletJournalEntry.objects.filter(
            ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff).count()
        corp_purge_count = CorporationWalletJournalEntry.objects.filter(
            ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff).count()

        self.stdout.write(f"Character wallet entries: {char_total_count:,}")
        self.stdout.write(f"Corporation wallet entries: {corp_total_count:,}")
        self.stdout.write(
            f"Total wallet entries: {char_total_count + corp_total_count:,}")
        self.stdout.write("")
        self.stdout.write(
            f"Character entries eligible for purge (>{config.wallet_journal_retention_days}d): {char_purge_count:,}")
        self.stdout.write(
            f"Corporation entries eligible for purge (>{config.wallet_journal_retention_days}d): {corp_purge_count:,}")
        self.stdout.write(
            f"Total entries eligible for purge: {char_purge_count + corp_purge_count:,}")
