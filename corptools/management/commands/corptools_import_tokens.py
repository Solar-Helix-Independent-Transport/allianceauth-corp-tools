from django.core.management.base import BaseCommand, CommandError
import pprint
from corptools.tasks import update_character
from corptools.models import CharacterAudit
from corptools import app_settings
from esi.models import Token
from allianceauth.eveonline.models import EveCharacter

from tqdm import tqdm


class Command(BaseCommand):
    help = 'Pull any valid token into CorpTools and setup Characters and Corporations'

    def handle(self, *args, **options):
        self.stdout.write("Reading Settings!")

        self.stdout.write("Looking for Character Tokens Matching:")
        char_scopes = app_settings.get_character_scopes()
        char_scopes.sort()
        pp = pprint.PrettyPrinter(indent=4)
        pp.pprint(char_scopes)
        chars_known = set(list(CharacterAudit.objects.all().values_list(
            'character__character_id', flat=True)))
        tokens = Token.objects.all() \
            .require_scopes(char_scopes) \
            .exclude(character_id__in=list(chars_known)) \
            .values_list('character_id', flat=True)
        tokens = set(list(tokens))
        total = len(tokens)
        self.stdout.write(f"Found {total}")
        if total > 0:
            with tqdm(total=total) as t:
                for token in tokens:
                    try:
                        CharacterAudit.objects.update_or_create(
                            character=EveCharacter.objects.get_character_by_id(token))
                        update_character.apply_async(args=[token], priority=6)
                    except:
                        pass
                    t.update(1)
