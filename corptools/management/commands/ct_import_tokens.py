import pprint

from tqdm import tqdm

from django.core.management.base import BaseCommand

from allianceauth.eveonline.models import EveCharacter
from esi.models import Token

from corptools import app_settings
from corptools.models import CharacterAudit
from corptools.tasks import update_character


class Command(BaseCommand):
    help = 'Pull any valid token into CorpTools and setup Characters and Corporations'

    def add_arguments(self, parser):
        parser.add_argument('--minimal-scopes', action='store_true',
                            help="Grab Tokens with Bare minimum scopes. Users may have to register to get full coverage")

    def handle(self, *args, **options):
        self.stdout.write("Reading Settings!")

        self.stdout.write("Looking for Character Tokens Matching:")
        if options.get('minimal_scopes', False):
            char_scopes = ['esi-assets.read_assets.v1',
                           'esi-calendar.read_calendar_events.v1',
                           'esi-characters.read_contacts.v1',
                           'esi-characters.read_notifications.v1',
                           'esi-characters.read_titles.v1',
                           'esi-clones.read_clones.v1',
                           'esi-clones.read_implants.v1',
                           'esi-location.read_location.v1',
                           'esi-location.read_online.v1',
                           'esi-location.read_ship_type.v1',
                           'esi-markets.read_character_orders.v1',
                           'esi-search.search_structures.v1',
                           'esi-universe.read_structures.v1',
                           'esi-skills.read_skillqueue.v1',
                           'esi-skills.read_skills.v1',
                           ]
        else:
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
                    except Exception:
                        pass
                    t.update(1)
