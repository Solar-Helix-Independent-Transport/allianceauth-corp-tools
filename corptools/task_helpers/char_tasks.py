import time
from datetime import timedelta

from celery import shared_task

from django.core.paginator import Paginator
from django.db.models import F
from django.db.models.functions import Power, Sqrt
from django.utils import timezone
from django.utils.html import strip_tags

from allianceauth.services.hooks import get_extension_logger
from esi.models import Token

from corptools.task_helpers.update_tasks import (
    fetch_location_name, load_system,
)

from .. import providers
from ..models import (
    AssetCoordiante, CharacterAsset, CharacterAudit, CharacterContact,
    CharacterContactLabel, CharacterIndustryJob, CharacterLocation,
    CharacterMarketOrder, CharacterMiningLedger, CharacterRoles,
    CharacterTitle, CharacterWalletJournalEntry, CharAssetCoordiante, Clone,
    Contract, ContractItem, CorporationHistory, CorptoolsConfiguration,
    EveItemType, EveLocation, EveName, Implant, JumpClone, LoyaltyPoint,
    MailLabel, MailMessage, MailRecipient, MapSystemPlanet, Notification,
    NotificationText, Skill, SkillQueue, SkillTotalHistory, SkillTotals,
)
from . import sanitize_location_flag, sanitize_notification_type
from .etag_helpers import NotModifiedError, etag_results

logger = get_extension_logger(__name__)


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def get_token(character_id: int, scopes: list) -> "Token":
    """Helper method to get a valid token for a specific character with specific scopes.

    Args:
        character_id: Character to filter on.
        scopes: array of ESI scope strings to search for.

    Returns:
        Matching token or `False` when token is not found

    TODO: Push upstream to django-esi
    """
    token = (
        Token.objects
        .filter(character_id=character_id)
        .require_scopes(scopes)
        .require_valid()
        .first()
    )
    if token:
        return token
    else:
        return False


def update_character_location(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("updating location for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-location.read_ship_type.v1',
                  'esi-location.read_location.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        location_op = providers.esi.client.Location.get_characters_character_id_location(
            character_id=character_id)

        loc_data = etag_results(
            location_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        loc_id = None

        if loc_data['structure_id']:
            loc_id = loc_data['structure_id']
        elif loc_data['station_id']:
            loc_id = loc_data['station_id']
        else:
            loc_id = loc_data['solar_system_id']

        _loc = fetch_location_name(loc_id, "solar_system", character_id)

        if _loc:
            _loc.save()

        CharacterLocation.objects.update_or_create(
            character=audit_char,
            defaults={
                "current_location": _loc if _loc else None
            }
        )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_location_location {character_id}")

    except NotModifiedError:
        logger.info("CT: No New Location data for: {}".format(
            audit_char.character.character_name))
        pass

    try:
        ship_op = providers.esi.client.Location.get_characters_character_id_ship(
            character_id=character_id)

        ship_data = etag_results(
            ship_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        ship, _ = EveItemType.objects.get_or_create_from_esi(
            ship_data["ship_type_id"])

        CharacterLocation.objects.update_or_create(
            character=audit_char,
            defaults={
                "current_ship": ship,
                "current_ship_name": ship_data["ship_name"],
            }
        )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_location_ship {character_id}")

    except NotModifiedError:
        logger.info("CT: No New current ship data for: {}".format(
            audit_char.character.character_name))
        pass

    try:
        req_scopes = ['esi-location.read_online.v1']

        token = get_token(character_id, req_scopes)

        if token:
            online_op = providers.esi.client.Location.get_characters_character_id_online(
                character_id=character_id)

            ship_data = etag_results(
                online_op, token, force_refresh=force_refresh)
            _st = time.perf_counter()

            if ship_data.get("last_login"):
                audit_char.last_known_login = ship_data.get("last_login")

            if ship_data.get("last_logout"):
                audit_char.last_known_logoff = ship_data.get("last_logout")

            if ship_data.get("logins"):
                audit_char.total_logins = ship_data.get("logins")

            logger.debug(
                f"CT_TIME: {time.perf_counter() - _st} update_character_location_last_online {character_id}")

    except NotModifiedError:
        logger.info("CT: No New online data for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_location = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished location/ship/online for: {audit_char.character.character_name}"


def update_corp_history(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("updating corp history for: {}".format(
        audit_char.character.character_name))
    try:
        corp_history_op = providers.esi.client.Character.get_characters_character_id_corporationhistory(
            character_id=character_id)

        corp_history = etag_results(
            corp_history_op, None, force_refresh=force_refresh)
        _st = time.perf_counter()
        for corp in corp_history:
            corp_name, created = EveName.objects.get_or_create_from_esi(
                corp.get('corporation_id'))
            try:
                history_item, created = CorporationHistory.objects.update_or_create(
                    character=audit_char,
                    record_id=corp.get('record_id'),
                    defaults={
                        'corporation_id': corp.get('corporation_id'),
                        'corporation_name': corp_name,
                        'is_deleted': corp.get('is_deleted', False),
                        'start_date': corp.get('start_date')
                    }
                )
            except CorporationHistory.MultipleObjectsReturned:
                logger.error(
                    (
                        F"CT Corp History Duplicate - {audit_char.character.character_name} -"
                        f" Bad Data: {corp}"
                    )
                )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_corp_history {character_id}")
    except NotModifiedError:
        logger.info("CT: No New pub data for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_pub_data = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished pub data for: {audit_char.character.character_name}"


def update_character_skill_list(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Skills for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-skills.read_skills.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        skills_op = providers.esi.client.Skills.get_characters_character_id_skills(
            character_id=character_id)

        skills = etag_results(skills_op, token, force_refresh=force_refresh)

        # Delete current SkillList
        _st = time.perf_counter()
        Skill.objects.filter(character=audit_char).delete()

        SkillTotals.objects.update_or_create(character=audit_char,
                                             defaults={
                                                 'total_sp': skills.get('total_sp', 0),
                                                 'unallocated_sp': skills.get('unallocated_sp', 0)
                                             })

        SkillTotalHistory.objects.create(character=audit_char,
                                         total_sp=skills.get('total_sp', 0),
                                         unallocated_sp=skills.get(
                                             'unallocated_sp', 0)
                                         )

        _check_skills = []
        _create_skills = []
        for skill in skills.get('skills', []):
            _check_skills.append(skill.get('skill_id'))
            _skill = Skill(character=audit_char,
                           skill_id=skill.get('skill_id'),
                           skill_name_id=skill.get('skill_id'),
                           active_skill_level=skill.get('active_skill_level'),
                           skillpoints_in_skill=skill.get(
                               'skillpoints_in_skill'),
                           trained_skill_level=skill.get('trained_skill_level'))

            _create_skills.append(_skill)

        EveItemType.objects.create_bulk_from_esi(_check_skills)
        Skill.objects.bulk_create(_create_skills)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_skill_list {character_id}")

    except NotModifiedError:
        logger.info("CT: No New skills for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_skills = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished skills for: {audit_char.character.character_name}"


def update_character_skill_queue(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Skill Queue for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-skills.read_skillqueue.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        queue_op = providers.esi.client.Skills.get_characters_character_id_skillqueue(
            character_id=character_id)

        queue = etag_results(queue_op, token, force_refresh=force_refresh)

        _st = time.perf_counter()
        # Delete current SkillList
        SkillQueue.objects.filter(
            character=audit_char
        ).delete()

        items = []
        _check_skills = []
        for item in queue:
            _check_skills.append(item.get('skill_id'))
            queue_item = SkillQueue(character=audit_char,
                                    finish_level=item.get('finished_level'),
                                    queue_position=item.get('queue_position'),
                                    skill_id=item.get('skill_id'),
                                    skill_name_id=item.get('skill_id'),
                                    finish_date=item.get('finish_date', None),
                                    level_end_sp=item.get(
                                        'level_end_sp', None),
                                    level_start_sp=item.get(
                                        'level_start_sp', None),
                                    start_date=item.get('start_date', None),
                                    training_start_sp=item.get('training_start_sp', None))
            items.append(queue_item)

        EveItemType.objects.create_bulk_from_esi(_check_skills)
        SkillQueue.objects.bulk_create(items)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_skill_queue {character_id}")

    except NotModifiedError:
        logger.info(
            "CT: No New skill queue for: {}".format(
                audit_char.character.character_name
            )
        )
        pass

    audit_char.last_update_skill_que = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished skill queue for: {audit_char.character.character_name}"


def update_character_assets(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Assets for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-assets.read_assets.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        assets_op = providers.esi.client.Assets.get_characters_character_id_assets(
            character_id=character_id)

        assets = etag_results(
            assets_op,
            token,
            force_refresh=force_refresh,
            disable_verification=CorptoolsConfiguration.skip_verify_assets()
        )

        _st = time.perf_counter()
        location_names = list(
            EveLocation.objects.all().values_list('location_id', flat=True))
        _current_type_ids = []
        item_ids = []
        items = []
        for item in assets:
            if item.get('type_id') not in _current_type_ids:
                _current_type_ids.append(item.get('type_id'))
            item_ids.append(item.get('item_id'))
            asset_item = CharacterAsset(character=audit_char,
                                        blueprint_copy=item.get(
                                            'is_blueprint_copy'),
                                        singleton=item.get('is_singleton'),
                                        item_id=item.get('item_id'),
                                        location_flag=sanitize_location_flag(
                                            item.get('location_flag')
                                        ),
                                        location_id=item.get('location_id'),
                                        location_type=item.get(
                                            'location_type'),
                                        quantity=item.get('quantity'),
                                        type_id=item.get('type_id'),
                                        type_name_id=item.get('type_id')
                                        )
            if item.get('location_id') in location_names:
                asset_item.location_name_id = item.get('location_id')
            items.append(asset_item)

        # current ship doesn't show if in space sometimes
        ship = get_current_ship_location(character_id)
        if ship:
            if ship.get('item_id') not in item_ids:
                if ship.get('type_id') not in _current_type_ids:
                    _current_type_ids.append(ship.get('type_id'))

                asset_item = CharacterAsset(character=audit_char,
                                            singleton=True,
                                            item_id=ship.get('item_id'),
                                            location_flag=ship.get(
                                                'location_flag'),
                                            location_id=ship.get(
                                                'location_id'),
                                            location_type=ship.get(
                                                'location_type'),
                                            quantity=1,
                                            type_id=ship.get('type_id'),
                                            type_name_id=ship.get('type_id')
                                            )
                if ship.get('location_id') in location_names:
                    asset_item.location_name_id = ship.get('location_id')
                items.append(asset_item)

        EveItemType.objects.create_bulk_from_esi(_current_type_ids)

        delete_query = CharacterAsset.objects.filter(
            character=audit_char)  # Flush Assets
        if delete_query.exists():
            # We now have some FKeys so slow it down...
            delete_query.delete()

        CharacterAsset.objects.bulk_create(items)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_assets {character_id}")

    except NotModifiedError:
        logger.info("CT: No New assets for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_assets = timezone.now()
    audit_char.save()
    audit_char.is_active()

    # Locaite assets in space!
    update_asset_locations(character_id, force_refresh=force_refresh)
    try:
        # Get Asset Names!
        update_character_assets_names(character_id)
    except Exception as e:
        logger.error(e)
    try:
        # Get den plannets!
        update_den_locations(character_id)
    except Exception as e:
        logger.error(e)

    return f"CT: Finished assets for: {audit_char.character.character_name}"


def chunks(qst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, qst.count(), n):
        yield qst[i:i + n]


def update_character_assets_names(character_id):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Asset names for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-assets.read_assets.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    expandable_cats = [2, 6]

    asset_list = CharacterAsset.objects.filter(
        character=audit_char,
        type_name__group__category_id__in=expandable_cats,
        singleton=True
    ).order_by("pk")

    for subset in chunks(asset_list, 100):
        assets_names = providers.esi.client.Assets.post_characters_character_id_assets_names(
            character_id=character_id,
            item_ids=[i.item_id for i in subset],
            token=token.valid_access_token()
        ).results()

        id_list = {i.get("item_id"): i.get("name") for i in assets_names}

        for asset in subset:
            if asset.item_id in id_list:
                asset.name = id_list.get(asset.item_id)
                asset.save()


def update_den_locations(character_id, force_refresh=False):
    max_location_id = 35000000
    min_location_id = 30000000

    parents = CharacterAsset.objects.filter(
        character__character__character_id=character_id,
        singleton=True,
        type_name__group_id=4810,
        location_id__gte=min_location_id,
        location_id__lte=max_location_id
    )
    for parent in parents:
        load_system(parent.location_name.system.system_id)
        distance = MapSystemPlanet.objects.filter(
            system=parent.location_name.system
        ).annotate(
            distance=Sqrt(
                Power(
                    parent.coordinate.x - F("x"),
                    2
                ) + Power(
                    parent.coordinate.y - F("y"),
                    2
                ) + Power(
                    parent.coordinate.z - F("z"),
                    2
                )
            )
        ).order_by("distance").first()
        parent.name = distance.name
        parent.save()


def update_asset_locations(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Asset locations for: {}".format(
        audit_char.character.character_name))
    catagories = [
        23,  # Starbases
        65,  # Structures
        40,  # Sov
        22,  # Deployables
    ]
# These must be in space
    max_location_id = 35000000
    min_location_id = 30000000

    assets = CharacterAsset.objects.filter(
        character=audit_char,
        type_name__group__category_id__in=catagories,
        location_id__gte=min_location_id,
        location_id__lte=max_location_id
    )

    req_scopes = ['esi-assets.read_assets.v1']

    _token = get_token(character_id, req_scopes)

    if not _token or not assets.count():
        logger.info(
            f"CT: COORDS No Tokens or Assets for {audit_char.character}")
        return f"CT: COORDS No Tokens or Assets for {audit_char.character}"

    locations = []

    for ids in chunks(list(assets.values_list("item_id", flat=True)), 900):
        locations += providers.esi.client.Assets.post_characters_character_id_assets_locations(
            character_id=audit_char.character.character_id,
            item_ids=ids,
            token=_token.valid_access_token()
        ).result()

    # logger.info(locations)

    new_coords = {}
    for loc in locations:
        new_coords[loc['item_id']] = loc["position"]

    new_models = []
    for a in assets:
        if a.item_id in new_coords:
            new_models.append(
                CharAssetCoordiante(
                    item=a,
                    x=new_coords[a.item_id]['x'],
                    y=new_coords[a.item_id]['y'],
                    z=new_coords[a.item_id]['z']
                )
            )
            logger.info(
                f"CT: COORD - {a.type_name.name} {new_coords[a.item_id]}")

    CharAssetCoordiante.objects.bulk_create(new_models, ignore_conflicts=True)

    return f"CT: Finished asset locations for: {audit_char.character.character_name}"


def update_character_mining(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Mining for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-industry.read_character_mining.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        mining_op = providers.esi.client.Industry.get_characters_character_id_mining(
            character_id=character_id)

        ledger = etag_results(mining_op, token, force_refresh=force_refresh)

        _st = time.perf_counter()
        existings_pks = set(CharacterMiningLedger.objects.filter(
            character=audit_char, date__gte=timezone.now() - timedelta(days=30)
        ).values_list("id", flat=True))
        type_ids = set()
        new_events = []
        old_events = []
        for event in ledger:

            type_ids.add(event.get('type_id'))
            pk = CharacterMiningLedger.create_primary_key(character_id, event)
            _e = CharacterMiningLedger(
                character=audit_char,
                id=pk,
                date=event.get('date'),
                type_name_id=event.get('type_id'),
                system_id=event.get('solar_system_id'),
                quantity=event.get('quantity')
            )
            if pk in existings_pks:
                old_events.append(_e)
            else:
                new_events.append(_e)

        EveItemType.objects.create_bulk_from_esi(list(type_ids))

        if len(new_events):
            CharacterMiningLedger.objects.bulk_create(
                new_events, ignore_conflicts=True)

        if len(old_events):
            CharacterMiningLedger.objects.bulk_update(
                old_events, fields=['quantity'])

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_mining {character_id}")

    except NotModifiedError:
        logger.info("CT: No New Mining for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_mining = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Mining for: {audit_char.character.character_name}"


def update_character_industry_jobs(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Industry Jobs for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-industry.read_character_jobs.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        indy_op = providers.esi.client.Industry.get_characters_character_id_industry_jobs(
            character_id=character_id, include_completed=True)

        jobs = etag_results(indy_op, token, force_refresh=force_refresh)

        _st = time.perf_counter()
        existing_pks = set(CharacterIndustryJob.objects.filter(
            character=audit_char
        ).values_list("job_id", flat=True))
        type_ids = set()
        new_events = []
        # old_events = []
        for event in jobs:
            type_ids.add(event.get('blueprint_type_id'))
            if event.get('product_type_id'):
                type_ids.add(event.get('product_type_id'))

            if event.get('job_id') in existing_pks:
                _m = CharacterIndustryJob.objects.get(
                    character=audit_char, job_id=event.get("job_id"))
                _m.completed_character_id = event.get("completed_character_id")
                _m.completed_date = event.get("completed_date")
                _m.end_date = event.get("end_date")
                _m.pause_date = event.get("pause_date")
                _m.status = event.get("status")
                _m.successful_runs = event.get("successful_runs")
                _m.save()
                continue

            _e = CharacterIndustryJob(
                character=audit_char,
                activity_id=event.get("activity_id"),
                blueprint_id=event.get("blueprint_id"),
                blueprint_location_id=event.get("blueprint_location_id"),
                blueprint_type_id=event.get("blueprint_type_id"),
                blueprint_type_name_id=event.get("blueprint_type_id"),
                completed_character_id=event.get("completed_character_id"),
                completed_date=event.get("completed_date"),
                cost=event.get("cost"),
                duration=event.get("duration"),
                end_date=event.get("end_date"),
                facility_id=event.get("facility_id"),
                installer_id=event.get("installer_id"),
                job_id=event.get("job_id"),
                licensed_runs=event.get("licensed_runs"),
                output_location_id=event.get("output_location_id"),
                pause_date=event.get("pause_date"),
                probability=event.get("probability"),
                product_type_id=event.get("product_type_id"),
                product_type_name_id=event.get("product_type_id"),
                runs=event.get("runs"),
                start_date=event.get("start_date"),
                station_id=event.get("station_id"),
                status=event.get("status"),
                successful_runs=event.get("successful_runs")
            )
            new_events.append(_e)

        EveItemType.objects.create_bulk_from_esi(list(type_ids))

        if len(new_events):
            CharacterIndustryJob.objects.bulk_create(
                new_events, ignore_conflicts=True)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_industry_jobs {character_id}")

    except NotModifiedError:
        logger.info("CT: No New Industry for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_indy = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Industry Jobs for: {audit_char.character.character_name}"


def get_current_ship_location(character_id, force_refresh=False):
    CharacterAudit.objects.get(
        character__character_id=character_id)
    req_scopes = ['esi-location.read_location.v1',
                  'esi-location.read_ship_type.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    ship = providers.esi.client.Location.get_characters_character_id_ship(character_id=character_id,
                                                                          token=token.valid_access_token()).result()
    location = providers.esi.client.Location.get_characters_character_id_location(character_id=character_id,
                                                                                  token=token.valid_access_token()).result()
    location_id = location.get('solar_system_id')
    location_flag = "solar_system"
    location_type = "unlocked"
    if location.get('structure_id') is not None:
        location_id = location.get('structure_id')
        location_flag = "item"
        location_type = "hangar"
    elif location.get('station_id') is not None:
        location_id = location.get('station_id')
        location_flag = "station"
        location_type = "hangar"
    current_ship = {
        "item_id": ship.get('ship_item_id'),
        "type_id": ship.get('ship_type_id'),
        "name": ship.get('ship_name'),
        "system_id": location.get('solar_system_id'),
        "location_id": location_id,
        "location_flag": location_flag,
        "location_type": location_type,
    }
    return current_ship


def update_character_wallet(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating wallet transactions for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-wallet.read_character_wallet.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        journal_items_ob = providers.esi.client.Wallet.get_characters_character_id_wallet_journal(
            character_id=character_id)

        journal_items = etag_results(
            journal_items_ob, token, force_refresh=force_refresh)

        _st = time.perf_counter()
        _current_journal = CharacterWalletJournalEntry.objects.filter(
            # TODO add time filter
            character=audit_char).values_list('entry_id', flat=True)
        _current_eve_ids = list(
            EveName.objects.all().values_list('eve_id', flat=True))

        _new_names = []

        items = []
        for item in journal_items:
            if item.get('id') not in _current_journal:
                if item.get('second_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('second_party_id'))
                    _current_eve_ids.append(item.get('second_party_id'))
                if item.get('first_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('first_party_id'))
                    _current_eve_ids.append(item.get('first_party_id'))

                asset_item = CharacterWalletJournalEntry(character=audit_char,
                                                         amount=item.get(
                                                             'amount'),
                                                         balance=item.get(
                                                             'balance'),
                                                         context_id=item.get(
                                                             'context_id'),
                                                         context_id_type=item.get(
                                                             'context_id_type'),
                                                         date=item.get('date'),
                                                         description=item.get(
                                                             'description'),
                                                         first_party_id=item.get(
                                                             'first_party_id'),
                                                         first_party_name_id=item.get(
                                                             'first_party_id'),
                                                         entry_id=item.get(
                                                             'id'),
                                                         reason=item.get(
                                                             'reason'),
                                                         ref_type=item.get(
                                                             'ref_type'),
                                                         second_party_id=item.get(
                                                             'second_party_id'),
                                                         second_party_name_id=item.get(
                                                             'second_party_id'),
                                                         tax=item.get('tax'),
                                                         tax_receiver_id=item.get(
                                                             'tax_receiver_id'),
                                                         )
                items.append(asset_item)

        created_names = EveName.objects.create_bulk_from_esi(_new_names)

        wallet_ballance = providers.esi.client.Wallet.get_characters_character_id_wallet(character_id=character_id,
                                                                                         token=token.valid_access_token()).result()

        audit_char.balance = wallet_ballance
        audit_char.save()

        if created_names:
            CharacterWalletJournalEntry.objects.bulk_create(items)
        else:
            raise Exception("ESI Fail")
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_wallet {character_id}")
    except NotModifiedError:
        logger.info("CT: No New wallet data for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_wallet = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished wallet transactions for: {audit_char.character.character_name}"


def update_character_transactions(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating wallet transactions for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-wallet.read_character_wallet.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        journal_items_ob = providers.esi.client.Wallet.get_characters_character_id_wallet_transactions(
            character_id=character_id)

        journal_items = etag_results(
            journal_items_ob, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        _current_journal = CharacterWalletJournalEntry.objects.filter(
            character=audit_char,
            context_id_type="market_transaction_id",
            # Max items from ESI
            reason__exact="").values_list('context_id', flat=True)[:2500]

        # _new_names = []

        # items = []
        for item in journal_items:
            if item.get('transaction_id') in _current_journal:
                type_name, _ = EveItemType.objects.get_or_create_from_esi(
                    item.get('type_id'))
                message = f"{item.get('quantity')}x {type_name.name} @ {item.get('unit_price'):,.2f} ISK"
                CharacterWalletJournalEntry.objects.filter(
                    character=audit_char,
                    context_id_type="market_transaction_id",
                    reason__exact="",
                    context_id=item.get('transaction_id')
                ).update(
                    reason=message
                )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_transactions {character_id}")

    except NotModifiedError:
        logger.info("CT: No New wallet data for: {}".format(
            audit_char.character.character_name))
        pass

    return f"CT: Finished market transactions for: {audit_char.character.character_name}"


def update_character_clones(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Clones and Implants for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-clones.read_clones.v1', 'esi-clones.read_implants.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    jump_clones = providers.esi.client.Clones.get_characters_character_id_clones(character_id=character_id,
                                                                                 token=token.valid_access_token()).result()

    active_clone = providers.esi.client.Clones.get_characters_character_id_implants(character_id=character_id,
                                                                                    token=token.valid_access_token()).result()

    all_locations = list(EveLocation.objects.all(
    ).values_list('location_id', flat=True))
    clones = {}
    clones[0] = active_clone

    home_loc = None  # Setting this to  none will force a lookup later on.
    try:
        home_loc = EveLocation.objects.get(
            location_id=jump_clones.get('home_location').get('location_id'))
    except EveLocation.DoesNotExist:
        pass

    char_clone, created = Clone.objects.update_or_create(character=audit_char,
                                                         defaults={
                                                             'last_clone_jump_date': jump_clones.get('last_clone_jump_date'),
                                                             'last_station_change_date': jump_clones.get('last_station_change_date'),
                                                             'location_id': jump_clones.get('home_location').get('location_id'),
                                                             'location_type': jump_clones.get('home_location').get('location_type'),
                                                             'location_name': home_loc
                                                         })

    JumpClone.objects.filter(character=audit_char).delete()  # remove all
    implants = []
    type_ids = []

    for clone in jump_clones.get('jump_clones'):
        _jumpclone = JumpClone(character=audit_char,
                               jump_clone_id=clone.get('jump_clone_id'),
                               location_id=clone.get('location_id'),
                               location_type=clone.get('location_type'),
                               name=clone.get('name'))
        if clone.get('location_id') in all_locations:
            _jumpclone.location_name_id = clone.get('location_id')

        _jumpclone.save()

        for implant in clone.get('implants'):
            if implant not in type_ids:
                type_ids.append(implant)
            implants.append(Implant(clone=_jumpclone,
                                    type_name_id=implant
                                    )
                            )

    _jumpclone = JumpClone.objects.create(character=audit_char,
                                          jump_clone_id=0,
                                          name="Active Clone")

    for implant in active_clone:
        if implant not in type_ids:
            type_ids.append(implant)
        implants.append(Implant(clone=_jumpclone,
                                type_name_id=implant,
                                )
                        )

    EveItemType.objects.create_bulk_from_esi(type_ids)
    Implant.objects.bulk_create(implants)

    audit_char.last_update_clones = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished clones for: {audit_char.character.character_name}"


def update_character_loyaltypoints(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Loyalty Points for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-characters.read_loyalty.v1', ]

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    existing_lp_corps = LoyaltyPoint.objects.filter(
        character=audit_char).values_list("corporation_id", flat=True)

    try:
        loyaltypoints_op = providers.esi.client.Loyalty.get_characters_character_id_loyalty_points(
            character_id=character_id)

        loyaltypoints = etag_results(
            loyaltypoints_op, token, force_refresh=force_refresh)

        _bulkcreate = []
        _bulkupdate = []

        for lp in loyaltypoints:
            lp_corp, _ = EveName.objects.get_or_create_from_esi(
                lp.get('corporation_id'))

            if lp.get('corporation_id') in existing_lp_corps:
                existing = LoyaltyPoint.objects.get(
                    character=audit_char, corporation=lp_corp)
                existing.amount = lp.get('loyalty_points')
                _bulkupdate.append(existing)
            else:
                _bulkcreate.append(
                    LoyaltyPoint(
                        character=audit_char,
                        corporation=lp_corp,
                        amount=lp.get('loyalty_points')))

        LoyaltyPoint.objects.bulk_create(
            _bulkcreate, ignore_conflicts=True, batch_size=500)
        LoyaltyPoint.objects.bulk_update(
            _bulkupdate, batch_size=500, fields=['amount'])

    except NotModifiedError:
        logger.info("CT: No New LP data for: {}".format(
            audit_char.character.character_name))

    audit_char.last_update_loyaltypoints = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Loyalty Points for: {audit_char.character.character_name}"


def update_character_orders(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Market Orders for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-markets.read_character_orders.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    open_orders_op = providers.esi.client.Market.get_characters_character_id_orders(
        character_id=character_id)
    try:
        open_orders = etag_results(
            open_orders_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        open_ids = list(CharacterMarketOrder.objects.filter(
            character=audit_char, state='active').values_list("order_id", flat=True))
        all_locations = list(EveLocation.objects.all(
        ).values_list('location_id', flat=True))

        updates = []
        creates = []
        type_ids = []

        tracked_ids = []

        for order in open_orders:
            tracked_ids.append(order.get('order_id'))

            if order.get('type_id') not in type_ids:
                type_ids.append(order.get('type_id'))

            _order = CharacterMarketOrder(
                character=audit_char,
                order_id=order.get('order_id'),
                duration=order.get('duration'),
                escrow=order.get('escrow'),
                is_buy_order=order.get('is_buy_order'),
                issued=order.get('issued'),
                location_id=order.get('location_id'),
                min_volume=order.get('min_volume'),
                price=order.get('price'),
                order_range=order.get('range'),
                region_id=order.get('region_id'),
                region_name_id=order.get('region_id'),
                type_id=order.get('type_id'),
                type_name_id=order.get('type_id'),
                volume_remain=order.get('volume_remain'),
                volume_total=order.get('volume_total'),
                is_corporation=order.get('is_corporation'),
                state='active'
            )

            if order.get('location_id') in all_locations:
                _order.location_name_id = order.get('location_id')

            if order.get('order_id') in open_ids:
                updates.append(_order)
            else:
                creates.append(_order)

        EveItemType.objects.create_bulk_from_esi(type_ids)

        if len(updates) > 0:
            CharacterMarketOrder.objects.bulk_update(updates, fields=['duration', 'escrow',
                                                                      'min_volume',
                                                                      'price',
                                                                      'order_range',
                                                                      'volume_remain',
                                                                      'volume_total',
                                                                      'state'])

        if len(creates) > 0:
            CharacterMarketOrder.objects.bulk_create(creates)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_orders {character_id}")

    except NotModifiedError:
        logger.info("CT: No New orders data for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_orders = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Orders for: {audit_char.character.character_name}"


def update_character_order_history(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Market Order History for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-markets.read_character_orders.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    order_history_op = providers.esi.client.Market.get_characters_character_id_orders_history(
        character_id=character_id)

    try:
        order_history = etag_results(
            order_history_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        closed_ids = list(CharacterMarketOrder.objects.filter(
            character=audit_char).values_list("order_id", flat=True))
        all_locations = list(EveLocation.objects.all(
        ).values_list('location_id', flat=True))

        updates = []
        creates = []
        type_ids = []

        tracked_ids = []

        for order in order_history:
            tracked_ids.append(order.get('order_id'))

            if order.get('type_id') not in type_ids:
                type_ids.append(order.get('type_id'))

            _order = CharacterMarketOrder(
                character=audit_char,
                order_id=order.get('order_id'),
                duration=order.get('duration'),
                escrow=order.get('escrow'),
                is_buy_order=order.get('is_buy_order'),
                issued=order.get('issued'),
                location_id=order.get('location_id'),
                min_volume=order.get('min_volume'),
                price=order.get('price'),
                order_range=order.get('range'),
                region_id=order.get('region_id'),
                region_name_id=order.get('region_id'),
                type_id=order.get('type_id'),
                type_name_id=order.get('type_id'),
                volume_remain=order.get('volume_remain'),
                volume_total=order.get('volume_total'),
                is_corporation=order.get('is_corporation'),
                state=order.get('state')
            )

            if order.get('location_id') in all_locations:
                _order.location_name_id = order.get('location_id')

            if order.get('order_id') in closed_ids:
                updates.append(_order)
            else:
                creates.append(_order)

        EveItemType.objects.create_bulk_from_esi(type_ids)

        if len(updates) > 0:
            CharacterMarketOrder.objects.bulk_update(updates, fields=['duration',
                                                                      'escrow',
                                                                      'min_volume',
                                                                      'price',
                                                                      'order_range',
                                                                      'volume_remain',
                                                                      'volume_total',
                                                                      'state'], batch_size=1000)

        if len(creates) > 0:
            CharacterMarketOrder.objects.bulk_create(creates, batch_size=1000)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_order_history {character_id}")

    except NotModifiedError:
        logger.info("CT: No New old orders data for: {}".format(
            audit_char.character.character_name))
        pass

    return f"CT: Finished Order History for: {audit_char.character.character_name}"


@shared_task
def update_character_notifications(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug("Updating Notifications for: {}".format(
        audit_char.character.character_name))

    req_scopes = ['esi-characters.read_notifications.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        notifications_op = providers.esi.client.Character.get_characters_character_id_notifications(
            character_id=character_id)

        notifications = etag_results(
            notifications_op,
            token,
            force_refresh=force_refresh,
            disable_verification=CorptoolsConfiguration.skip_verify_notifications()
        )

        _st = time.perf_counter()

        last_five_hundred = list(
            Notification.objects.filter(character=audit_char)
            .order_by('-timestamp')[:500]
            .values_list('notification_id', flat=True))

        _creates = []
        _create_notifs = []
        for note in notifications:
            if not note.get('notification_id') in last_five_hundred:
                _creates.append(
                    Notification(
                        character=audit_char,
                        notification_id=note.get('notification_id'),
                        sender_id=note.get('sender_id'),
                        sender_type=note.get('sender_type'),
                        notification_text_id=note.get('notification_id'),
                        timestamp=note.get('timestamp'),
                        notification_type=sanitize_notification_type(
                            note.get('type')
                        ),
                        is_read=note.get('is_read')
                    )

                )
                _create_notifs.append(NotificationText(
                    notification_id=note.get('notification_id'),
                    notification_text=note.get('text')
                )
                )
        NotificationText.objects.bulk_create(
            _create_notifs, ignore_conflicts=True, batch_size=500)
        Notification.objects.bulk_create(_creates, batch_size=500)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_notifications {character_id}")

    except NotModifiedError:
        logger.info("CT: No New notifications for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_notif = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished notifications for: {audit_char.character.character_name}"


def update_character_roles(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    req_scopes = ['esi-characters.read_corporation_roles.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False
    try:
        roles_op = providers.esi.client.Character.get_characters_character_id_roles(
            character_id=character_id)

        roles = etag_results(roles_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        director = False
        accountant = False
        station_manager = False
        personnel_manager = False

        if "Director" in roles.get('roles', []):
            director = True

        if "Accountant" in roles.get('roles', []):
            accountant = True

        if "Station_Manager" in roles.get('roles', []):
            station_manager = True

        if "Personnel_Manager" in roles.get('roles', []):
            personnel_manager = True

        role_model, create = CharacterRoles.objects.update_or_create(character=audit_char,
                                                                     defaults={
                                                                         "director": director,
                                                                         "accountant": accountant,
                                                                         "station_manager": station_manager,
                                                                         "personnel_manager": personnel_manager
                                                                     }
                                                                     )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_roles {character_id}")

    except NotModifiedError:
        logger.info("CT: No New roles for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_roles = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished roles for: {audit_char.character.character_name}"


def update_character_mail_body(character_id, mail_message, force_refresh=False):
    CharacterAudit.objects.get(character__character_id=character_id)

    req_scopes = ['esi-mail.read_mail.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    details = providers.esi.client.Mail.get_characters_character_id_mail_mail_id(character_id=character_id, mail_id=mail_message.mail_id,
                                                                                 token=token.valid_access_token()).result()

    mail_message.body = details.get('body')

    return mail_message


def update_character_mail_headers(character_id, force_refresh=False):
    # This function will deal with ALL mail related updates
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    req_scopes = ['esi-mail.read_mail.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    _current_eve_ids = list(
        EveName.objects.all().values_list('eve_id', flat=True))
    _current_mail_rec = list(
        MailRecipient.objects.all().values_list('recipient_id', flat=True))

    # Mail Labels
    labels = providers.esi.client.Mail.get_characters_character_id_mail_labels(character_id=character_id,
                                                                               token=token.valid_access_token()).result()

    for label in labels.get('labels'):
        MailLabel.objects.update_or_create(character=audit_char,
                                           label_id=label.get('label_id'),
                                           defaults={
                                               'label_name': label.get('name', None),
                                               'label_color': label.get('color', None),
                                               'unread_count': label.get('unread_count', None)
                                           })

    # Get all mail ids
    mail_ids = MailMessage.objects.filter(
        character=audit_char).values_list("mail_id", flat=True)
    last_id = None
    while True:
        if last_id is None:
            mail = providers.esi.client.Mail.get_characters_character_id_mail(character_id=character_id,
                                                                              token=token.valid_access_token()).result()
        else:
            mail = providers.esi.client.Mail.get_characters_character_id_mail(character_id=character_id,
                                                                              last_mail_id=last_id,
                                                                              token=token.valid_access_token()).result()
        if len(mail) == 0:
            # If there are 0 and this is not the first page, then we have reached the
            # end of retrievable mail.
            break

        messages = []
        m_l_map = {}
        m_r_map = {}
        failed_ids = set()
        stop = False
        for msg in mail:
            if msg.get('mail_id') == mail_ids:
                if not force_refresh:
                    break
                continue

            id_k = int(str(audit_char.character.character_id) +
                       str(msg.get('mail_id')))
            if msg.get('from', 0) not in _current_eve_ids:
                if msg.get('from', 0) not in failed_ids:
                    try:
                        EveName.objects.get_or_create_from_esi(msg.get('from'))
                        _current_eve_ids.append(msg.get('from', 0))
                    except Exception:
                        failed_ids.add(msg.get('from'))
                        pass
            msg_obj = MailMessage(character=audit_char, id_key=id_k, mail_id=msg.get('mail_id'), from_id=msg.get('from', None),
                                  is_read=msg.get('read', None), timestamp=msg.get('timestamp'),
                                  subject=msg.get('subject', None), body=msg.get('body', None))

            from_name_id = msg.get('from', None)
            if from_name_id in _current_eve_ids:
                msg_obj.from_name_id = msg.get('from', None)

            messages.append(msg_obj)

            if msg.get('labels'):
                labels = msg.get('labels')
                m_l_map[msg.get('mail_id')] = labels

            m_r_map[msg.get('mail_id')] = [(r.get('recipient_id'), r.get('recipient_type'))
                                           for r in msg.get('recipients')]
            last_id = msg.get('mail_id')

        msgs = MailMessage.objects.bulk_create(
            messages, batch_size=1000, ignore_conflicts=True)

        LabelThroughModel = MailMessage.labels.through
        lms = []
        for _msg in msgs:
            if _msg.mail_id in m_l_map:
                for label in m_l_map[_msg.mail_id]:
                    lm = LabelThroughModel(mailmessage_id=_msg.id_key,
                                           maillabel_id=MailLabel.objects.get(character=audit_char, label_id=label).pk)
                    lms.append(lm)

        LabelThroughModel.objects.bulk_create(lms, ignore_conflicts=True)

        RecipThroughModel = MailMessage.recipients.through
        rms = []
        for _msg in msgs:
            if _msg.mail_id in m_r_map:
                for recip, r_type in m_r_map[_msg.mail_id]:
                    recip_name = None
                    if r_type != "mailing_list":
                        if recip not in _current_eve_ids:
                            EveName.objects.get_or_create_from_esi(recip)
                            _current_eve_ids.append(recip)
                        recip_name = recip
                    if recip not in _current_mail_rec or force_refresh:
                        MailRecipient.objects.update_or_create(recipient_id=recip,
                                                               defaults={
                                                                   "recipient_name_id": recip_name,
                                                                   "recipient_type": r_type})
                        if not force_refresh:
                            _current_mail_rec.append(recip)

                    rm = RecipThroughModel(
                        mailmessage_id=_msg.id_key, mailrecipient_id=recip)
                    rms.append(rm)

        RecipThroughModel.objects.bulk_create(rms, ignore_conflicts=True)

        if stop is True:
            # Break the while loop if we reach the last mail message that is in the db.
            break

    audit_char.last_update_mails = timezone.now()
    audit_char.save()
    audit_char.is_active()

    if len(mail_ids) == 0:
        logger.debug(f"No new mails for {character_id}")
        return

    return mail_ids


def update_character_contacts(character_id, force_refresh=False):
    logger.debug("updating contacts for: %s" % str(character_id))

    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    req_scopes = ['esi-characters.read_contacts.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    _current_eve_ids = list(
        EveName.objects.all().values_list('eve_id', flat=True))

    try:
        labels_op = providers.esi.client.Contacts.get_characters_character_id_contacts_labels(
            character_id=character_id)

        labels = etag_results(labels_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        labels_to_create = []

        for label in labels:  # update labels
            _label_item = CharacterContactLabel(
                character=audit_char,
                label_id=label.get('label_id'),
                label_name=label.get('label_name'),
            )
            _label_item.build_id()
            labels_to_create.append(_label_item)

        CharacterContactLabel.objects.filter(character=audit_char).delete()
        CharacterContactLabel.objects.bulk_create(labels_to_create)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} CharacterContactLabel {character_id}")

    except NotModifiedError:
        logger.info("CT: No New labels for: {}".format(
            audit_char.character.character_name))
        pass

    try:
        contacts_op = providers.esi.client.Contacts.get_characters_character_id_contacts(
            character_id=character_id)

        contacts = etag_results(
            contacts_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        ContactLabelThrough = CharacterContact.labels.through
        _contacts_to_create = []
        _through_to_create = []
        for contact in contacts:  # update contacts
            if contact.get('contact_id') not in _current_eve_ids:
                EveName.objects.get_or_create_from_esi(
                    contact.get('contact_id'))
                _current_eve_ids.append(contact.get('contact_id'))
            blocked = False if contact.get(
                'is_blocked', False) is None else contact.get('is_blocked')
            watched = False if contact.get(
                'is_watched', False) is None else contact.get('is_watched')
            _contact_item = CharacterContact(character=audit_char,
                                             contact_id=contact.get(
                                                 'contact_id'),
                                             contact_type=contact.get(
                                                 'contact_type'),
                                             contact_name_id=contact.get(
                                                 'contact_id'),
                                             standing=contact.get('standing'),
                                             blocked=blocked,
                                             watched=watched)

            _id = _contact_item.build_id()
            _contacts_to_create.append(_contact_item)

            if contact.get('label_ids', False):  # add labels
                for _label in contact.get('label_ids'):
                    _label_id = int(str(audit_char.id) + str(_label))
                    _lbl = ContactLabelThrough(
                        charactercontact_id=_id,
                        charactercontactlabel_id=_label_id
                    )
                    _through_to_create.append(_lbl)

        CharacterContact.objects.filter(character=audit_char).delete()

        CharacterContact.objects.bulk_create(_contacts_to_create)
        ContactLabelThrough.objects.bulk_create(_through_to_create)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contacts {character_id}")

    except NotModifiedError:
        logger.info("CT: No New contacts for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_contacts = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed contacts for: %s" % str(character_id)


def update_character_titles(character_id, force_refresh=False):
    logger.debug("updating titles for: %s" % str(character_id))

    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    req_scopes = ['esi-characters.read_titles.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False
    try:
        titles_op = providers.esi.client.Character.get_characters_character_id_titles(
            character_id=character_id)

        titles = etag_results(titles_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        title_models = []
        for t in titles:  # update labels
            _title_item, created = CharacterTitle.objects.update_or_create(
                corporation_id=audit_char.character.corporation_id,
                corporation_name=audit_char.character.corporation_name,
                title_id=t.get('title_id'),
                defaults={
                    "title": strip_tags(t.get('name'))
                }
            )

            title_models.append(_title_item.pk)
            audit_char.characterroles.titles.add(_title_item)

        if len(title_models) > 0:
            rem_tits = audit_char.characterroles.titles.all().exclude(pk__in=title_models)
            audit_char.characterroles.titles.remove(*rem_tits)
        else:
            audit_char.characterroles.titles.clear()
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_titles {character_id}")

    except NotModifiedError:
        logger.info("CT: No New titles for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_titles = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed titles for: %s" % str(character_id)


def update_character_contracts(character_id, force_refresh=False):
    logger.debug("updating contracts for: %s" % str(character_id))

    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    req_scopes = ['esi-contracts.read_character_contracts.v1']

    token = get_token(character_id, req_scopes)

    new_contract_ids = []

    if not token:
        return False, []
    try:
        contracts_op = providers.esi.client.Contracts.get_characters_character_id_contracts(
            character_id=character_id)

        contracts = etag_results(
            contracts_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        contract_models_new = []
        contract_models_old = []
        eve_names = set()
        contract_ids = list(Contract.objects.filter(
            character=audit_char).values_list("contract_id", flat=True))
        for c in contracts:  # update labels
            _contract_item = Contract(
                id=Contract.build_pk(audit_char.id, c.get('contract_id')),
                character=audit_char,
                assignee_id=c.get('assignee_id'),
                assignee_name_id=c.get('assignee_id'),
                acceptor_id=c.get('acceptor_id'),
                acceptor_name_id=c.get('acceptor_id'),
                contract_id=c.get('contract_id'),
                availability=c.get('availability'),
                buyout=c.get('buyout'),
                collateral=c.get('collateral'),
                date_accepted=c.get('date_accepted'),
                date_completed=c.get('date_completed'),
                date_expired=c.get('date_expired'),
                date_issued=c.get('date_issued'),
                days_to_complete=c.get('days_to_complete'),
                end_location_id=c.get('end_location_id'),
                for_corporation=c.get('for_corporation'),
                issuer_corporation_name_id=c.get('issuer_corporation_id'),
                issuer_name_id=c.get('issuer_id'),
                price=c.get('price'),
                reward=c.get('reward'),
                start_location_id=c.get('start_location_id'),
                status=c.get('status'),
                title=c.get('title'),
                contract_type=c.get('type'),
                volume=c.get('volume')
            )

            eve_names.add(c.get('assignee_id'))
            eve_names.add(c.get('issuer_corporation_id'))
            eve_names.add(c.get('issuer_id'))
            eve_names.add(c.get('acceptor_id'))

            if c.get('contract_id') in contract_ids:
                contract_models_old.append(_contract_item)
            else:
                contract_models_new.append(_contract_item)

        EveName.objects.create_bulk_from_esi(list(eve_names))

        if len(contract_models_new) > 0:
            Contract.objects.bulk_create(
                contract_models_new, batch_size=1000, ignore_conflicts=True)

        if len(contract_models_old) > 0:
            Contract.objects.bulk_update(contract_models_old, batch_size=1000,
                                         fields=['date_accepted', 'date_completed', 'acceptor_id', 'date_expired', 'status',
                                                 'assignee_name', 'acceptor_name', 'issuer_corporation_name', 'issuer_name'])

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contracts {character_id}")

        new_contract_ids = [c.contract_id for c in contract_models_new]
        if force_refresh:
            new_contract_ids += [c.contract_id for c in contract_models_old]

    except NotModifiedError:
        logger.info("CT: No New Contracts for: {}".format(
            audit_char.character.character_name))
        pass

    audit_char.last_update_contracts = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed Contracts for: %s" % str(character_id), new_contract_ids


def update_character_contract_items(character_id, contract_id, force_refresh=False):
    logger.debug("updating contract items for: %s (%s)" %
                 (str(character_id), str(contract_id)))

    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    contract = Contract.objects.get(
        character=audit_char,
        contract_id=contract_id)

    req_scopes = ['esi-contracts.read_character_contracts.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False
    try:
        contracts_op = providers.esi.client.Contracts.get_characters_character_id_contracts_contract_id_items(
            character_id=character_id,
            contract_id=contract_id)

        contracts = etag_results(
            contracts_op, token, force_refresh=force_refresh)
        _st = time.perf_counter()

        contract_models_new = []
        _types = set()
        for c in contracts:  # update labels
            _contract_item = ContractItem(
                contract=contract,
                is_included=c.get('is_included'),
                is_singleton=c.get('is_singleton'),
                quantity=c.get('quantity'),
                raw_quantity=c.get('raw_quantity'),
                record_id=c.get('record_id'),
                type_name_id=c.get('type_id'),
            )
            _types.add(c.get('type_id'))
            contract_models_new.append(_contract_item)
        EveItemType.objects.create_bulk_from_esi(list(_types))
        ContractItem.objects.bulk_create(
            contract_models_new, batch_size=1000, ignore_conflicts=True)
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contract_items {character_id}")
    except NotModifiedError:
        logger.info("CT: No New Contract items for: {}".format(
            audit_char.character.character_name))
        pass

    return f"CT: Completed Contract items {str(contract_id)} for: {str(character_id)}"
