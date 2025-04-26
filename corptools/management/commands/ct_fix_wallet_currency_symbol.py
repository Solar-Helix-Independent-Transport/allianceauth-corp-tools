from django.core.management.base import BaseCommand

from corptools.models import CharacterWalletJournalEntry
from corptools.tasks import update_wallet_currency


class Command(BaseCommand):
    help = 'Update or Populate EVE Item prices for cat_id 4'

    def handle(self, *args, **options):
        self.stdout.write((
            "Finding all the instances, "
            "This may take a while if you have LOTS of data in your database please wait. "
            "These will then be sent to celery for processing."
        ))
        messages = CharacterWalletJournalEntry.objects.filter(
            reason__contains="@ $"
        )
        total = messages.count()
        self.stdout.write(f"Found {total:,} wallet entries to update")
        if total == 0:
            self.stdout.write(f"Nothing to do... Have a good day!")
            return

        user_input = input("Are you sure you want to proceed? (yes/no) ")
        if user_input == "yes":
            _count = 0
            count = 0
            step = 1000
            for m in messages.values_list("pk", flat=True):
                # update the reason
                update_wallet_currency.apply_async(args=[m], priority=8)
                # lets not spam the shit out of the console
                _count += 1
                if _count >= step:
                    _count = 0
                    count += 1
                    self.stdout.write(f"Sent {count*step:,}/{total:,} Tasks")
            self.stdout.write(f"Completed sending {total:,} tasks!")
        else:
            self.stdout.write("Aborted!")
