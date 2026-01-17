import sys
import time
from datetime import timedelta

from celery import shared_task

from django.db.models import F
from django.db.models.functions import Power, Sqrt
from django.utils import timezone
from django.utils.html import strip_tags

from allianceauth.services.hooks import get_extension_logger
from esi.exceptions import HTTPNotModified
from esi.models import Token

from corptools.task_helpers.update_tasks import (
    fetch_location_name, load_system,
)

from .. import providers
from ..models import (
    CharacterAsset, CharacterAudit, CharacterContact, CharacterContactLabel,
    CharacterIndustryJob, CharacterLocation, CharacterMarketOrder,
    CharacterMiningLedger, CharacterRoles, CharacterTitle,
    CharacterWalletJournalEntry, CharAssetCoordiante, Clone, Contract,
    ContractItem, CorporationHistory, EveItemType, EveLocation, EveName,
    Implant, JumpClone, LoyaltyPoint, MailLabel, MailMessage, MailRecipient,
    MapSystemPlanet, Notification, NotificationText, Skill, SkillQueue,
    SkillTotalHistory, SkillTotals,
)

logger = get_extension_logger(__name__)


# def chunks(lst, n):
#     """Yield successive n-sized chunks from lst."""
#     for i in range(0, len(lst), n):
#         yield lst[i:i + n]


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
        location = providers.esi_openapi.char_location(
            character_id,
            token
        )
        _st = time.perf_counter()

        loc_id = None

        if location.structure_id:
            loc_id = location.structure_id
        elif location.station_id:
            loc_id = location.station_id
        else:
            loc_id = location.solar_system_id

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
            f"CT_TIME: {time.perf_counter() - _st} update_character_location_location {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New Location data for: {audit_char.character.character_name}"
        )
        pass

    try:
        ship_data = providers.esi_openapi.client.Location.GetCharactersCharacterIdShip(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
        )
        _st = time.perf_counter()

        ship, _ = EveItemType.objects.get_or_create_from_esi(
            ship_data.ship_type_id)

        CharacterLocation.objects.update_or_create(
            character=audit_char,
            defaults={
                "current_ship": ship,
                "current_ship_name": ship_data.ship_name,
            }
        )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_location_ship {character_id}"
        )

    except HTTPNotModified:
        logger.info("CT: No New current ship data for: {}".format(
            audit_char.character.character_name))
        pass

    try:
        req_scopes = ['esi-location.read_online.v1']

        token = get_token(character_id, req_scopes)

        if token:
            online_data = providers.esi_openapi.client.Location.GetCharactersCharacterIdOnline(
                character_id=character_id,
                token=token
            ).result(
                force_refresh=force_refresh,
            )
            _st = time.perf_counter()

            if online_data.last_login:
                audit_char.last_known_login = online_data.last_login

            if online_data.last_logout:
                audit_char.last_known_logoff = online_data.last_logout

            if online_data.logins:
                audit_char.total_logins = online_data.logins

            logger.debug(
                f"CT_TIME: {time.perf_counter() - _st} update_character_location_last_online {character_id}"
            )

    except HTTPNotModified:
        logger.info(
            f"CT: No New online data for: {audit_char.character.character_name}"
        )

    audit_char.last_update_location = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished location/ship/online for: {audit_char.character.character_name}"


def update_corp_history(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)
    logger.debug(
        f"updating corp history for: {audit_char.character.character_name}"
    )
    try:
        corp_history = providers.esi_openapi.client.Character.GetCharactersCharacterIdCorporationhistory(
            character_id=character_id,
        ).result(
            force_refresh=force_refresh,
        )
        _st = time.perf_counter()
        for corp in corp_history:
            corp_name, _ = EveName.objects.get_or_create_from_esi(
                corp.corporation_id
            )
            try:
                _, _ = CorporationHistory.objects.update_or_create(
                    character=audit_char,
                    record_id=corp.record_id,
                    defaults={
                        'corporation_id': corp.corporation_id,
                        'corporation_name': corp_name,
                        'is_deleted': corp.is_deleted if corp.is_deleted else False,
                        'start_date': corp.start_date
                    }
                )
            except CorporationHistory.MultipleObjectsReturned:
                logger.error(
                    (
                        f"CT Corp History Duplicate - {audit_char.character.character_name} -"
                        f" Bad Data: {corp.model_dump_json(indent=2)}"
                    )
                )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_corp_history {character_id}"
        )
    except HTTPNotModified:
        logger.info(
            f"CT: No New pub data for: {audit_char.character.character_name}"
        )

    audit_char.last_update_pub_data = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished pub data for: {audit_char.character.character_name}"


def update_character_skill_list(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Skills for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-skills.read_skills.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        skills = providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkills(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh
        )

        # Delete current SkillList
        _st = time.perf_counter()
        Skill.objects.filter(character=audit_char).delete()

        SkillTotals.objects.update_or_create(
            character=audit_char,
            defaults={
                'total_sp': skills.total_sp,
                'unallocated_sp': skills.unallocated_sp if skills.unallocated_sp else 0
            }
        )

        SkillTotalHistory.objects.create(
            character=audit_char,
            total_sp=skills.total_sp,
            unallocated_sp=skills.unallocated_sp if skills.unallocated_sp else 0
        )

        _check_skills = []
        _create_skills = []
        for skill in skills.skills:
            _check_skills.append(skill.skill_id)
            _skill = Skill(
                character=audit_char,
                skill_id=skill.skill_id,
                skill_name_id=skill.skill_id,
                active_skill_level=skill.active_skill_level,
                skillpoints_in_skill=skill.skillpoints_in_skill,
                trained_skill_level=skill.trained_skill_level
            )
            _create_skills.append(_skill)

        EveItemType.objects.create_bulk_from_esi(_check_skills)
        Skill.objects.bulk_create(_create_skills)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_skill_list {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New skills for: {audit_char.character.character_name}"
        )

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
        queue = providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkillqueue(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
        )

        _st = time.perf_counter()
        # Delete current SkillList
        SkillQueue.objects.filter(
            character=audit_char
        ).delete()

        items = []
        _check_skills = []
        for item in queue:
            _check_skills.append(item.skill_id)
            queue_item = SkillQueue(
                character=audit_char,
                finish_level=item.finished_level,
                queue_position=item.queue_position,
                skill_id=item.skill_id,
                skill_name_id=item.skill_id,
                finish_date=item.finish_date,
                level_end_sp=item.level_end_sp,
                level_start_sp=item.level_start_sp,
                start_date=item.start_date,
                training_start_sp=item.training_start_sp
            )
            items.append(queue_item)

        EveItemType.objects.create_bulk_from_esi(_check_skills)
        SkillQueue.objects.bulk_create(items)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_skill_queue {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            "CT: No New skill queue for: {}".format(
                audit_char.character.character_name
            )
        )

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
        assets = providers.esi_openapi.client.Assets.GetCharactersCharacterIdAssets(
            character_id=character_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )
        logger.info(
            f"CT: New assets for: {audit_char.character.character_name}")

        _st = time.perf_counter()
        location_names = list(
            EveLocation.objects.all().values_list('location_id', flat=True))

        _current_type_ids = []
        item_ids = []
        items = []

        for item in assets:
            if item.type_id not in _current_type_ids:
                _current_type_ids.append(item.type_id)
            item_ids.append(item.item_id)

            asset_item = CharacterAsset.from_esi_model(audit_char, item)

            # attach location name
            if item.location_id in location_names:
                asset_item.location_name_id = item.location_id

            items.append(asset_item)

        # current ship doesn't show if in space sometimes
        ship = get_current_ship_location(
            character_id,
            force_refresh=force_refresh
        )
        if ship:
            logger.info(
                f"CT: New ship for: {audit_char.character.character_name}"
            )
            if ship.item_id not in item_ids:
                if ship.type_id not in _current_type_ids:
                    _current_type_ids.append(ship.type_id)

                if ship.location_id in location_names:
                    ship.location_name_id = ship.location_id

                items.append(ship)

        EveItemType.objects.create_bulk_from_esi(_current_type_ids)

        delete_query = CharacterAsset.objects.filter(
            character=audit_char
        )  # Flush Assets
        if delete_query.exists():
            # We now have some FKeys so slow it down...
            delete_query.delete()

        CharacterAsset.objects.bulk_create(items)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_assets {character_id}"
        )

        # Locate assets in space!
        update_asset_locations(character_id, force_refresh=force_refresh)
        try:
            # Get Asset Names!
            update_character_assets_names(character_id)
        except Exception as e:
            logger.error(e)
        try:
            # Get den planets!
            update_den_locations(character_id)
        except Exception as e:
            logger.error(e)

    except HTTPNotModified as e:
        _, _, tb = sys.exc_info()
        logger.info(
            f"CT: No New assets for: {audit_char.character.character_name} - ({tb.tb_lineno})"
        )

    audit_char.last_update_assets = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished assets for: {audit_char.character.character_name}"


def chunks(qst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, qst.count(), n):
        yield qst[i:i + n]


def update_character_assets_names(character_id):
    """
        Uses PostCharactersCharacterIdAssetsNames
    """
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )

    logger.debug(
        f"Updating Asset names for: {audit_char.character.character_name}")

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
        assets_names = providers.esi_openapi.client.Assets.PostCharactersCharacterIdAssetsNames(
            character_id=character_id,
            body=[i.item_id for i in subset],
            token=token
        ).results()

        id_list = {i.item_id: i.name for i in assets_names}

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
    """
        Uses PostCharactersCharacterIdAssetsLocations
    """
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )

    logger.debug(
        f"Updating Asset locations for: {audit_char.character.character_name}")

    categories = [
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
        type_name__group__category_id__in=categories,
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

    for ids in chunks(assets, 900):
        locations = providers.esi_openapi.client.Assets.PostCharactersCharacterIdAssetsLocations(
            character_id=audit_char.character.character_id,
            body=list(ids.values_list("item_id", flat=True)),
            token=_token
        ).result()

    # logger.info(locations)

    new_coords = {}
    for loc in locations:
        new_coords[loc.item_id] = loc.position

    new_models = []
    for a in assets:
        if a.item_id in new_coords:
            new_models.append(
                CharAssetCoordiante(
                    item=a,
                    x=new_coords[a.item_id].x,
                    y=new_coords[a.item_id].y,
                    z=new_coords[a.item_id].z
                )
            )

    CharAssetCoordiante.objects.bulk_create(new_models, ignore_conflicts=True)

    return f"CT: Finished asset locations for: {audit_char.character.character_name}"


def update_character_mining(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(f"Updating Mining for: {audit_char.character.character_name}")

    req_scopes = ['esi-industry.read_character_mining.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        mining = providers.esi_openapi.client.Industry.GetCharactersCharacterIdMining(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
        )

        _st = time.perf_counter()
        existing_pks = set(
            CharacterMiningLedger.objects.filter(
                character=audit_char,
                date__gte=timezone.now() - timedelta(days=30)
            ).values_list(
                "id",
                flat=True
            )
        )

        type_ids = set()
        new_events = []
        old_events = []

        for event in mining:
            type_ids.add(event.type_id)
            pk = CharacterMiningLedger.create_primary_key(character_id, event)
            _e = CharacterMiningLedger(
                id=pk,
                character=audit_char,
                date=event.date,
                type_name_id=event.type_id,
                system_id=event.solar_system_id,
                quantity=event.quantity
            )
            if pk in existing_pks:
                old_events.append(_e)
            else:
                new_events.append(_e)

        EveItemType.objects.create_bulk_from_esi(list(type_ids))

        if len(new_events):
            CharacterMiningLedger.objects.bulk_create(
                new_events, ignore_conflicts=True)

        if len(old_events):
            CharacterMiningLedger.objects.bulk_update(
                old_events,
                fields=['quantity']
            )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_mining {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New Mining for: {audit_char.character.character_name}"
        )

    audit_char.last_update_mining = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Mining for: {audit_char.character.character_name}"


def update_character_industry_jobs(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Industry Jobs for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-industry.read_character_jobs.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    try:
        jobs = providers.esi_openapi.client.Industry.GetCharactersCharacterIdIndustryJobs(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
        )

        _st = time.perf_counter()
        existing_pks = set(
            CharacterIndustryJob.objects.filter(
                character=audit_char
            ).values_list(
                "job_id",
                flat=True
            )
        )
        type_ids = set()
        new_events = []
        # old_events = []
        for event in jobs:
            type_ids.add(event.blueprint_type_id)
            if event.product_type_id:
                type_ids.add(event.product_type_id)

            if event.job_id in existing_pks:
                _m = CharacterIndustryJob.objects.get(
                    character=audit_char,
                    job_id=event.job_id
                )
                _m.completed_character_id = event.completed_character_id
                _m.completed_date = event.completed_date
                _m.end_date = event.end_date
                _m.pause_date = event.pause_date
                _m.status = event.status
                _m.successful_runs = event.successful_runs
                _m.save()
                continue

            _e = CharacterIndustryJob(
                character=audit_char,
                activity_id=event.activity_id,
                blueprint_id=event.blueprint_id,
                blueprint_location_id=event.blueprint_location_id,
                blueprint_type_id=event.blueprint_type_id,
                blueprint_type_name_id=event.blueprint_type_id,
                completed_character_id=event.completed_character_id,
                completed_date=event.completed_date,
                cost=event.cost,
                duration=event.duration,
                end_date=event.end_date,
                facility_id=event.facility_id,
                installer_id=event.installer_id,
                job_id=event.job_id,
                licensed_runs=event.licensed_runs,
                output_location_id=event.output_location_id,
                pause_date=event.pause_date,
                probability=event.probability,
                product_type_id=event.product_type_id,
                product_type_name_id=event.product_type_id,
                runs=event.runs,
                start_date=event.start_date,
                station_id=event.station_id,
                status=event.status,
                successful_runs=event.successful_runs
            )
            new_events.append(_e)

        EveItemType.objects.create_bulk_from_esi(list(type_ids))

        if len(new_events):
            CharacterIndustryJob.objects.bulk_create(
                new_events,
                ignore_conflicts=True
            )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_industry_jobs {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New Industry for: {audit_char.character.character_name}"
        )

    audit_char.last_update_indy = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Industry Jobs for: {audit_char.character.character_name}"


def get_current_ship_location(character_id, force_refresh=False):
    """
        Uses GetCharactersCharacterIdShip, GetCharactersCharacterIdLocation
    """
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )

    req_scopes = [
        'esi-location.read_location.v1',
        'esi-location.read_ship_type.v1'
    ]

    token = get_token(character_id, req_scopes)

    if not token:
        return False
    try:
        # Todo decouple this
        ship = providers.esi_openapi.client.Location.GetCharactersCharacterIdShip(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
            use_etag=False
        )

        location = providers.esi_openapi.client.Location.GetCharactersCharacterIdLocation(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
            use_etag=False
        )

        return CharacterAsset.from_esi_location(audit_char, ship, location)
    except HTTPNotModified:
        return False


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
        journal_items = providers.esi_openapi.client.Wallet.GetCharactersCharacterIdWalletJournal(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh,
        )

        _st = time.perf_counter()
        _current_journal = CharacterWalletJournalEntry.objects.filter(
            entry_id__in=[  # only fetch the ones we care about to reduce DB loading/ram
                e.id for e in journal_items
            ],
            character=audit_char
        ).values_list('entry_id', flat=True)

        _current_eve_ids = list(
            EveName.objects.all().values_list('eve_id', flat=True)
        )

        _new_names = []

        items = []
        for item in journal_items:
            if item.id not in _current_journal:
                if item.second_party_id not in _current_eve_ids:
                    _new_names.append(item.second_party_id)
                    _current_eve_ids.append(item.second_party_id)
                if item.first_party_id not in _current_eve_ids:
                    _new_names.append(item.first_party_id)
                    _current_eve_ids.append(item.first_party_id)

                items.append(
                    CharacterWalletJournalEntry.from_esi_model(
                        audit_char,
                        item
                    )
                )

        created_names = EveName.objects.create_bulk_from_esi(_new_names)

        wallet_ballance = providers.esi_openapi.client.Wallet.GetCharactersCharacterIdWallet(
            character_id=character_id,
            token=token
        ).result(
            use_etag=False
        )

        audit_char.balance = wallet_ballance
        audit_char.save()

        if created_names:
            CharacterWalletJournalEntry.objects.bulk_create(items)
        else:
            raise Exception("ESI Fail")
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_wallet {character_id}")
    except HTTPNotModified:
        logger.info(
            f"CT: No New wallet data for: {audit_char.character.character_name}"
        )

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
        journal_items = providers.esi_openapi.client.Wallet.GetCharactersCharacterIdWalletTransactions(
            character_id=character_id,
            token=token
        ).result(
            use_etag=False
        )

        _st = time.perf_counter()

        _current_journal = CharacterWalletJournalEntry.objects.filter(
            character=audit_char,
            context_id_type="market_transaction_id",
            # Max items from ESI
            reason__exact=""
        ).values_list(
            'context_id',
            flat=True
        )[:2500]

        # _new_names = []

        # items = []
        for item in journal_items:
            if item.transaction_id in _current_journal:
                type_name, _ = EveItemType.objects.get_or_create_from_esi(
                    item.type_id
                )
                message = f"{item.quantity}x {type_name.name} @ {item.unit_price:,.2f} ISK"
                CharacterWalletJournalEntry.objects.filter(
                    character=audit_char,
                    context_id_type="market_transaction_id",
                    reason__exact="",
                    context_id=item.transaction_id
                ).update(
                    reason=message
                )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_transactions {character_id}")

    except HTTPNotModified:
        logger.info(
            f"CT: No New wallet data for: {audit_char.character.character_name}"
        )

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

    try:
        jump_clones = providers.esi_openapi.client.Clones.GetCharactersCharacterIdClones(
            character_id=character_id,
            token=token
        ).result()

        active_clone = providers.esi_openapi.client.Clones.GetCharactersCharacterIdImplants(
            character_id=character_id,
            token=token
        ).result(
            use_etag=False
        )

        all_locations = list(EveLocation.objects.all(
        ).values_list('location_id', flat=True))

        home_loc = None  # Setting this to  none will force a lookup later on.
        try:
            home_loc = EveLocation.objects.get(
                location_id=jump_clones.home_location.location_id
            )
        except EveLocation.DoesNotExist:
            pass

        char_clone, created = Clone.objects.update_or_create(
            character=audit_char,
            defaults={
                'last_clone_jump_date': jump_clones.last_clone_jump_date,
                'last_station_change_date': jump_clones.last_station_change_date,
                'location_id': jump_clones.home_location.location_id,
                'location_type': jump_clones.home_location.location_type,
                'location_name': home_loc
            }
        )

        JumpClone.objects.filter(character=audit_char).delete()  # remove all

        implants = []
        type_ids = []

        for clone in jump_clones.jump_clones:
            _jumpclone = JumpClone(
                character=audit_char,
                jump_clone_id=clone.jump_clone_id,
                location_id=clone.location_id,
                location_type=clone.location_type,
                name=clone.name
            )
            if clone.location_id in all_locations:
                _jumpclone.location_name_id = clone.location_id

            _jumpclone.save()

            for implant in clone.implants:
                if implant not in type_ids:
                    type_ids.append(implant)
                implants.append(
                    Implant(
                        clone=_jumpclone,
                        type_name_id=implant
                    )
                )

        _jumpclone = JumpClone.objects.create(
            character=audit_char,
            jump_clone_id=0,
            name="Active Clone"
        )

        for implant in active_clone:
            if implant not in type_ids:
                type_ids.append(implant)
            implants.append(
                Implant(
                    clone=_jumpclone,
                    type_name_id=implant,
                )
            )

        EveItemType.objects.create_bulk_from_esi(type_ids)
        Implant.objects.bulk_create(implants)
    except HTTPNotModified:
        logger.info(
            f"CT: No New Clone data for: {audit_char.character.character_name}"
        )

    audit_char.last_update_clones = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished clones for: {audit_char.character.character_name}"


def update_character_loyaltypoints(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Loyalty Points for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-characters.read_loyalty.v1', ]

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    existing_lp_corps = LoyaltyPoint.objects.filter(
        character=audit_char
    ).values_list("corporation_id", flat=True)

    try:
        loyaltypoints = providers.esi_openapi.client.Loyalty.GetCharactersCharacterIdLoyaltyPoints(
            character_id=character_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )

        _bulkcreate = []
        _bulkupdate = []

        for lp in loyaltypoints:
            lp_corp, _ = EveName.objects.get_or_create_from_esi(
                lp.corporation_id
            )

            if lp.corporation_id in existing_lp_corps:
                existing = LoyaltyPoint.objects.get(
                    character=audit_char, corporation=lp_corp
                )
                existing.amount = lp.loyalty_points
                _bulkupdate.append(existing)
            else:
                _bulkcreate.append(
                    LoyaltyPoint(
                        character=audit_char,
                        corporation=lp_corp,
                        amount=lp.loyalty_points
                    )
                )

        LoyaltyPoint.objects.bulk_create(
            _bulkcreate,
            ignore_conflicts=True,
        )
        LoyaltyPoint.objects.bulk_update(
            _bulkupdate,
            fields=['amount']
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New LP data for: {audit_char.character.character_name}"
        )

    audit_char.last_update_loyaltypoints = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Loyalty Points for: {audit_char.character.character_name}"


def update_character_orders(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Market Orders for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-markets.read_character_orders.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        open_orders = providers.esi_openapi.client.Market.GetCharactersCharacterIdOrders(
            character_id=character_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        open_ids = list(
            CharacterMarketOrder.objects.filter(
                character=audit_char,
                state='active'
            ).values_list("order_id", flat=True)
        )
        all_locations = list(
            EveLocation.objects.all().values_list('location_id', flat=True)
        )

        updates = []
        creates = []
        type_ids = []
        tracked_ids = []

        for order in open_orders:
            tracked_ids.append(order.order_id)

            if order.type_id not in type_ids:
                type_ids.append(order.type_id)

            _order = CharacterMarketOrder.from_esi_model(audit_char, order)

            if order.location_id in all_locations:
                _order.location_name_id = order.location_id

            if order.order_id in open_ids:
                updates.append(_order)
            else:
                creates.append(_order)

        EveItemType.objects.create_bulk_from_esi(type_ids)

        if len(updates) > 0:
            CharacterMarketOrder.objects.bulk_update(
                updates, fields=[
                    'duration',
                    'escrow',
                    'min_volume',
                    'price',
                    'order_range',
                    'volume_remain',
                    'volume_total',
                    'state'
                ]
            )

        if len(creates) > 0:
            CharacterMarketOrder.objects.bulk_create(creates)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_orders {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New orders data for: {audit_char.character.character_name}"
        )

    audit_char.last_update_orders = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return f"CT: Finished Orders for: {audit_char.character.character_name}"


def update_character_order_history(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Market Order History for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-markets.read_character_orders.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        order_history = providers.esi_openapi.client.Market.GetCharactersCharacterIdOrdersHistory(
            character_id=character_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )
        _st = time.perf_counter()

        closed_ids = list(
            CharacterMarketOrder.objects.filter(
                character=audit_char
            ).values_list(
                "order_id",
                flat=True
            )
        )
        all_locations = list(
            EveLocation.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        updates = []
        creates = []
        type_ids = []

        tracked_ids = []

        for order in order_history:
            tracked_ids.append(order.order_id)

            if order.type_id not in type_ids:
                type_ids.append(order.type_id)

            _order = CharacterMarketOrder.from_esi_model(audit_char, order)

            if order.location_id in all_locations:
                _order.location_name_id = order.location_id

            if order.order_id in closed_ids:
                updates.append(_order)
            else:
                creates.append(_order)

        EveItemType.objects.create_bulk_from_esi(type_ids)

        if len(updates) > 0:
            CharacterMarketOrder.objects.bulk_update(
                updates,
                fields=[
                    'duration',
                    'escrow',
                    'min_volume',
                    'price',
                    'order_range',
                    'volume_remain',
                    'volume_total',
                    'state'
                ],
                batch_size=1000
            )

        if len(creates) > 0:
            CharacterMarketOrder.objects.bulk_create(
                creates,
                batch_size=1000
            )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_order_history {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New old orders data for: {audit_char.character.character_name}"
        )

    return f"CT: Finished Order History for: {audit_char.character.character_name}"


@shared_task
def update_character_notifications(character_id, force_refresh=False):
    """
        Uses GetCharactersCharacterIdNotifications
    """
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id
    )
    logger.debug(
        f"Updating Notifications for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-characters.read_notifications.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    try:
        notifications = providers.esi_openapi.client.Character.GetCharactersCharacterIdNotifications(
            character_id=character_id,
            token=token,
        ).result(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        last_five_hundred = list(
            Notification.objects.filter(
                character=audit_char
            ).order_by(
                '-timestamp'
            )[:500].values_list(
                'notification_id',
                flat=True
            )
        )

        _creates = []
        _create_notifs = []
        for note in notifications:
            if not note.notification_id in last_five_hundred:
                _note, _text = Notification.from_esi_model(audit_char, note)
                _creates.append(_note)
                _create_notifs.append(_text)

        NotificationText.objects.bulk_create(
            _create_notifs,
            ignore_conflicts=True,
            batch_size=500
        )
        Notification.objects.bulk_create(
            _creates,
            batch_size=500
        )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_notifications {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New notifications for: {audit_char.character.character_name}"
        )
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
        roles = providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles(
            character_id=character_id,
            token=token,
        ).result(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        director = False
        accountant = False
        station_manager = False
        personnel_manager = False

        if "Director" in roles.roles:
            director = True

        if "Accountant" in roles.roles:
            accountant = True

        if "Station_Manager" in roles.roles:
            station_manager = True

        if "Personnel_Manager" in roles.roles:
            personnel_manager = True

        role_model, create = CharacterRoles.objects.update_or_create(
            character=audit_char,
            defaults={
                "director": director,
                "accountant": accountant,
                "station_manager": station_manager,
                "personnel_manager": personnel_manager
            }
        )
        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_roles {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New roles for: {audit_char.character.character_name}"
        )

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

    details = providers.esi.client.Mail.get_characters_character_id_mail_mail_id(
        character_id=character_id, mail_id=mail_message.mail_id,
        token=token.valid_access_token()
    ).result()

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
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    logger.debug(
        f"Updating Contacts for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-characters.read_contacts.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    _current_eve_ids = list(
        EveName.objects.all().values_list('eve_id', flat=True)
    )

    try:
        labels = providers.esi_openapi.client.Contacts.GetCharactersCharacterIdContactsLabels(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        labels_to_create = []

        for label in labels:  # update labels
            _label_item = CharacterContactLabel.from_esi_model(
                audit_char, label)
            _label_item.build_id()
            labels_to_create.append(_label_item)

        CharacterContactLabel.objects.filter(character=audit_char).delete()
        CharacterContactLabel.objects.bulk_create(labels_to_create)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} CharacterContactLabel {character_id}"
        )
    except HTTPNotModified:
        logger.info(
            f"CT: No New old orders data for: {audit_char.character.character_name}"
        )

    try:
        contacts = providers.esi_openapi.client.Contacts.GetCharactersCharacterIdContacts(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh
        )

        ContactLabelThrough = CharacterContact.labels.through
        _contacts_to_create = []
        _through_to_create = []
        for contact in contacts:  # update contacts
            if contact.contact_id not in _current_eve_ids:
                EveName.objects.get_or_create_from_esi(
                    contact.contact_id
                )
                _current_eve_ids.append(contact.contact_id)

            _contact_item = CharacterContact.from_esi_model(
                audit_char, contact)

            _contacts_to_create.append(_contact_item)

            if contact.label_ids:  # add labels
                for _label in contact.label_ids:
                    _label_id = int(str(audit_char.id) + str(_label))
                    _lbl = ContactLabelThrough(
                        charactercontact_id=_contact_item.id,
                        charactercontactlabel_id=_label_id
                    )
                    _through_to_create.append(_lbl)

        CharacterContact.objects.filter(character=audit_char).delete()

        CharacterContact.objects.bulk_create(
            _contacts_to_create, ignore_conflicts=True)
        ContactLabelThrough.objects.bulk_create(
            _through_to_create, ignore_conflicts=True)

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contacts {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New contacts for: {audit_char.character.character_name}"
        )
        pass

    audit_char.last_update_contacts = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed contacts for: %s" % str(character_id)


def update_character_titles(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    logger.debug(
        f"Updating Title for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-characters.read_titles.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False

    try:
        titles = providers.esi_openapi.client.Character.GetCharactersCharacterIdTitles(
            character_id=character_id,
            token=token
        ).result(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        title_models = []
        for t in titles:  # update titles
            _title_item, _ = CharacterTitle.objects.update_or_create(
                corporation_id=audit_char.character.corporation_id,
                corporation_name=audit_char.character.corporation_name,
                title_id=t.title_id,
                defaults={
                    "title": strip_tags(t.name)
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
            f"CT_TIME: {time.perf_counter() - _st} update_character_titles {character_id}"
        )

    except HTTPNotModified:
        logger.info(
            f"CT: No New titles for: {audit_char.character.character_name}"
        )

    audit_char.last_update_titles = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed titles for: %s" % str(character_id)


def update_character_contracts(character_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    logger.debug(
        f"Updating Contracts for: {audit_char.character.character_name}"
    )

    req_scopes = ['esi-contracts.read_character_contracts.v1']

    token = get_token(character_id, req_scopes)

    new_contract_ids = []

    if not token:
        return False, []
    try:

        contracts = providers.esi_openapi.client.Contracts.GetCharactersCharacterIdContracts(
            character_id=character_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        contract_models_new = []
        contract_models_old = []

        eve_names = set()

        contract_ids = list(
            Contract.objects.filter(
                character=audit_char
            ).values_list(
                "contract_id",
                flat=True
            )
        )

        for c in contracts:  # update labels
            _contract_item = Contract.from_esi_model(audit_char, c)

            eve_names.add(c.assignee_id)
            eve_names.add(c.issuer_corporation_id)
            eve_names.add(c.issuer_id)
            eve_names.add(c.acceptor_id)

            if c.contract_id in contract_ids:
                contract_models_old.append(_contract_item)
            else:
                contract_models_new.append(_contract_item)

        EveName.objects.create_bulk_from_esi(list(eve_names))

        if len(contract_models_new) > 0:
            Contract.objects.bulk_create(
                contract_models_new,
                ignore_conflicts=True
            )

        if len(contract_models_old) > 0:
            Contract.objects.bulk_update(
                contract_models_old,
                fields=[
                    'date_accepted',
                    'date_completed',
                    'acceptor_id',
                    'date_expired',
                    'status',
                    'assignee_name',
                    'acceptor_name',
                    'issuer_corporation_name',
                    'issuer_name'
                ]
            )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contracts {character_id}"
        )

        new_contract_ids = [c.contract_id for c in contract_models_new]
        if force_refresh:
            new_contract_ids += [c.contract_id for c in contract_models_old]

    except HTTPNotModified:
        logger.info(
            f"CT: No New Contracts for: {audit_char.character.character_name}"
        )

    audit_char.last_update_contracts = timezone.now()
    audit_char.save()
    audit_char.is_active()

    return "CT: Completed Contracts for: %s" % str(character_id), new_contract_ids


def update_character_contract_items(character_id, contract_id, force_refresh=False):
    audit_char = CharacterAudit.objects.get(
        character__character_id=character_id)

    logger.debug(
        f"Updating Contract Items for: {audit_char.character.character_name} - {contract_id}"
    )

    contract = Contract.objects.get(
        character=audit_char,
        contract_id=contract_id
    )

    req_scopes = ['esi-contracts.read_character_contracts.v1']

    token = get_token(character_id, req_scopes)

    if not token:
        return False
    try:
        contracts = providers.esi_openapi.client.Contracts.GetCharactersCharacterIdContractsContractIdItems(
            character_id=character_id,
            contract_id=contract_id,
            token=token
        ).results(
            force_refresh=force_refresh
        )

        _st = time.perf_counter()

        contract_models_new = []
        _types = set()

        for c in contracts:  # update labels
            _contract_item = ContractItem.from_esi_model(contract, c)
            _types.add(c.type_id)
            contract_models_new.append(_contract_item)

        EveItemType.objects.create_bulk_from_esi(list(_types))

        ContractItem.objects.bulk_create(
            contract_models_new,
            batch_size=1000,
            ignore_conflicts=True
        )

        logger.debug(
            f"CT_TIME: {time.perf_counter() - _st} update_character_contract_items {character_id}"
        )
    except HTTPNotModified:
        logger.info(
            f"CT: No New Contract items for: {audit_char.character.character_name}"
        )

    return f"CT: Completed Contract items {str(contract_id)} for: {str(character_id)}"
