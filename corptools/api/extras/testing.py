import pprint

from ninja import NinjaAPI

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
            from aiopenapi3 import OpenAPI

            from esi.clients import EsiClientProvider
            esi2 = EsiClientProvider()
            res = esi2.client.Sovereignty.get_sovereignty_campaigns()
            res.request_config.also_return_response = True
            result, headers = res.result()
            etag1 = headers.headers["etag"]
            print("here")
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
            from esi import openapi_clients
            from esi.models import Token
            from esi.rate_limiting import ESIRateLimitBucket

            from corptools.models import CharacterAsset, MapSystem
            esi = openapi_clients.ESIClientProvider(
                compatibility_date="2025-08-26",
                ua_appname="ack-testing-django-esi",
                ua_version="0.0.1a1"
            )

            # def hit_api():
            #     esi.client.Alliance.GetAlliances(
            # ).result()

            # for i in range(0,50):
            #     print(f"Hit {i}")
            #     hit_api()
            # req_scopes = ['esi-assets.read_assets.v1']
            req_scopes = ['esi-fleets.write_fleet.v1']
            cid = 2119950231
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
            print(etag1)

            from esi import openapi_clients
            esi = openapi_clients.ESIClientProvider(
                compatibility_date="2025-08-26",
                ua_appname="ack-testing-django-esi",
                ua_version="0.0.1a1"
            )

            req = esi.client.Sovereignty.GetSovereigntyCampaigns()

            resp2, result2 = req.result(
                return_response=True
            )
            # result2 = res.results()
            etag2 = result2.headers["etag"]
            # print(etag2)

            resp3, result3 = esi.client.Sovereignty.GetSovereigntyCampaigns().result(
                return_response=True,
                use_cache=False
            )
            etag3 = result3.headers["etag"]
            # print(etag3)

            return [etag2, str(resp2), etag3, str(resp3)]
