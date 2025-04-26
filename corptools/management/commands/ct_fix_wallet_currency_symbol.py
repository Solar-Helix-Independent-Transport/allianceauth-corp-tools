from django.core.management.base import BaseCommand

from corptools.models import CharacterWalletJournalEntry


class Command(BaseCommand):
    help = 'Update or Populate EVE Item prices for cat_id 4'

    def handle(self, *args, **options):
        self.stdout.write(
            "Finding all the instances, This may take a while if you have LOTS of data in your database please wait.")
        messages = CharacterWalletJournalEntry.objects.filter(
            reason__contains="@ $"
        )
        total = messages.count()
        self.stdout.write(f"Found {total} wallet entries to update")
        _count = 0
        count = 0
        step = 10000
        for m in messages:
            # update the reason
            reason = m.reason
            reason = reason.replace(" @ $", " @ ")
            reason = reason + " ISK"
            m.reason = reason
            m.save()
            # lets not spam the shit out of the console
            _count += 1
            if _count >= step:
                _count = 0
                count += 1
                self.stdout.write(f"Completed {count*step}/{total}")
        self.stdout.write(f"Completed")
