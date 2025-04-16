import pprint

from ninja import NinjaAPI

from corptools.models import CharacterAsset, MapSystem


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
