import pprint

from ninja import NinjaAPI

from django.core.cache import cache
from django.utils import timezone
from django.utils.http import http_date

from esi.exceptions import HTTPNotModified

from corptools.task_helpers.char_tasks import get_token


class TestingApiEndpoints:
    tags = ["Extras"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "/extras/test/newapi1",
            tags=["Testing"]
        )
        def get_test_api_bravadosih(request):
            """
                Not for real use!
                this is kinda like bravado in use... no type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            from esi.clients import OpenAPIEsiClientProvider
            api = OpenAPIEsiClientProvider()

            return api.client.Alliance.get_alliances_alliance_id(alliance_id=1900696668)

        @api.get(
            "/extras/test/skilltest",
            tags=["Testing"]
        )
        def get_test_api_skilltests(request):
            """
                Not for real use!
                this is kinda like bravado in use... no type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            from corptools.providers import skills
            skills.get_and_cache_user(request.user.id, force_rebuild=True)

            return skills.get_and_cache_user(request.user.id)

        @api.get(
            "/extras/test/newapi2",
            tags=["Testing"]
        )
        def get_test_api_openapi(request):
            """
                Not for real use!
                this has type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            from esi.clients import OpenAPIEsiClientProvider
            api = OpenAPIEsiClientProvider()

            from esi.client.api import AllianceApi

            return AllianceApi(api.client).get_alliances_alliance_id(alliance_id=1900696668)

        @api.get(
            "/extras/test/newapi3",
            tags=["Testing"]
        )
        def get_test_api_openapi_3(request, name=""):
            """
                Not for real use!
                this has type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            from corptools.models import EveItemType
            item, created = EveItemType.objects.get_or_create_from_esi_name(
                name)
            return {
                "created": created,
                "item_name": item.name,
                "item_id": item.type_id
            }

        @api.get(
            "/extras/test/newapi4",
            tags=["Testing"]
        )
        def get_test_api_openapi_4(request, character_id=0):
            """
                Not for real use!
                this has type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            from corptools.task_helpers.char_tasks import (
                update_character_assets,
            )

            update_character_assets(character_id, force_refresh=True)
            return "done"

        @api.get(
            "/extras/test/newapi5",
            tags=["Testing"]
        )
        def get_test_api_oiaopenapi3(request):
            """
                Not for real use!
                this has type hinting
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}
            # from aiopenapi3 import OpenAPI

            # from esi.clients import EsiClientProvider
            # esi2 = EsiClientProvider()
            # res = esi2.client.Sovereignty.get_sovereignty_campaigns()
            # res.request_config.also_return_response = True
            # result, headers = res.result()
            # etag1 = headers.headers["etag"]
            # print("here")
            # res = esi.client.Alliance.GetAlliances(
            # )
            # result, headers = res.result(return_response=True)
            # # print([result, headers])
            # res = esi.client.Alliance.GetAlliancesAllianceId(
            #     alliance_id=1900696668
            # )
            # result, headers = res.result(return_response=True)
            # # print([result, headers])
            # res = esi.client.Status.GetStatus(
            # )
            # result, headers = res.result(return_response=True)
            # # print([result, headers])
            # res = esi.client.Incursions.GetIncursions(
            # )
            # result, headers = res.result(return_response=True)
            # # print([result, headers])
            # from esi.models import Token
            # from esi.rate_limiting import ESIRateLimitBucket
            # from corptools.models import CharacterAsset, MapSystem
            # esi = openapi_clients.ESIClientProvider(
            #     compatibility_date="2025-08-26",
            #     ua_appname="ack-testing-django-esi",
            #     ua_version="0.0.1a1"
            # )
            # def hit_api():
            #     esi.client.Alliance.GetAlliances(
            # ).result()
            # for i in range(0,50):
            #     print(f"Hit {i}")
            #     hit_api()
            # req_scopes = ['esi-assets.read_assets.v1']
            # req_scopes = ['esi-fleets.write_fleet.v1']
            # cid = 2119950231
            # cid = 755166922
            # token = get_token(cid, req_scopes)
            # try:
            #     esi.client.Alliance.GetAlliances(
            #         token=token
            #     ).result()
            # except ValueError:
            #     print("This is good")
            # res = esi.client.Assets.GetCharactersCharacterIdAssets(
            #     character_id=755166922,
            #     token=token
            # )
            # result, headers = res.results(return_response=True)
            # print(result[0])
            # for a in result:
            #     print(a.type_id)
            # flt = esi.client.Fleets.GetCharactersCharacterIdFleet(
            #     body={"is_free_move": True, "motd": "Testing 1, 2, 3"},
            #     character_id=cid,
            #     token=token
            # ).result()
            # flt_up = esi.client.Fleets.PutFleetsFleetId(
            #     body={"is_free_move": True, "motd": "Testing 1, 2, 3"},
            #     fleet_id=1234,
            #     token=token
            # )
            # flt_up.result()
            # print(flt)
            # print(flt_up)
            # res = esi.client.Assets.GetCharactersCharacterIdAssets(
            #     character_id=755166922,
            #     token=Token.objects.all().require_scopes_exact("publicData").first()
            # )
            # result, headers = res.results(return_response=True)
            # print([len(result), headers])
            # from esi import clients as clients2
            # esi2 = clients2.EsiClientProvider(
            #     ua_appname = "ack-testing-django-esi",
            #     ua_version = "0.0.1a1"
            # )
            # token = get_token(755166922, req_scopes)
            # res = esi2.client.Assets.get_characters_character_id_assets(
            #     character_id=755166922,
            #     token=token.valid_access_token()
            # )
            # print(etag1)
            # from esi import openapi_clients
            # esi = openapi_clients.ESIClientProvider(
            #     compatibility_date="2025-08-26",
            #     ua_appname="ack-testing-django-esi",
            #     ua_version="0.0.1a1",
            #     tags=["Character", "Assets", "Skills"]
            # )
            # # try:
            # #     req, res = esi.client.Universe.GetUniverseCategoriesCategoryId(category_id=999999).result(use_etag=False, return_response=True)
            # # except Exception as e:
            # #     print(e)

            # # req, res = esi.client.Universe.GetUniverseCategoriesCategoryId(category_id=5).result(return_response=True)
            # # print(res.headers)
            # from django.core.cache import cache

            # req_scopes = ['esi-skills.read_skills.v1']
            # cid = 755166922
            # token = get_token(cid, req_scopes)
            # op = esi.client.Skills.GetCharactersCharacterIdSkills(character_id=cid, token=token)
            # etag_key = op._etag_key()
            # print("TTL_pre", cache.ttl(etag_key))
            # try:
            #     op.result(use_cache=False)
            # except Exception:
            #     pass
            # print("TTL_post", cache.ttl(etag_key))
            # req = esi.client.Character.GetCharactersCharacterIdNotifications(character_id=cid, token=token).result()

            # req_scopes = ['esi-characters.read_corporation_roles.v1']
            # token = get_token(cid, req_scopes)
            # now = timezone.now()
            # req = esi.client.Character.GetCharactersCharacterIdRoles(
            #     character_id=cid,
            #     token=token
            # ).result(
            #     use_cache=False,
            #     use_etag=False,
            #     extra_headers={
            #         "If-Modified-Since": http_date(now.timestamp())
            #     }
            # )

            # try:
            #     req, res = esi.client.Assets.GetCharactersCharacterIdAssets(
            #         character_id=cid, token=token).results(return_response=True)
            # except HTTPNotModified:
            #     pass
            # cache.clear()
            # req_scopes = ['esi-characters.read_notifications.v1']
            # token = get_token(cid, req_scopes)
            # req, res = esi.client.Character.GetCharactersCharacterIdNotifications(
            #     character_id=cid, token=token).results(return_response=True, use_cache=False, use_etag=False)
            # return [req]

            from django.core.cache import cache

            from corptools.providers import esi_openapi
            from corptools.task_helpers.char_tasks import (
                update_character_skill_list,
            )

            def test_():
                cid = 2117840319
                op = esi_openapi.client.Skills.GetCharactersCharacterIdSkills(
                    character_id=cid)
                etag_key = op._etag_key()
                print("TTL_pre", cache.ttl(etag_key))
                try:
                    update_character_skill_list(cid, force_refresh=False)
                except Exception:
                    pass
                print("TTL_post", cache.ttl(etag_key))
            test_()
