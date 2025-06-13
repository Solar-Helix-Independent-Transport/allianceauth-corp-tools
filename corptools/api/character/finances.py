from typing import List

from ninja import NinjaAPI
from ninja.pagination import paginate

from django.db.models import Count, F, Sum
from django.utils.translation import gettext_noop as _

from corptools import models
from corptools.api import schema
from corptools.api.helpers import (
    Paginator, get_alts_queryset, get_main_character,
)


class FinancesApiEndpoints:

    tags = ["Finances"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/wallet",
            response={200: List[schema.CharacterWalletEvent], 403: str},
            tags=self.tags
        )
        @paginate(Paginator)
        def get_character_wallet(request, character_id: int, **kwargs):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)
            character_list = list(
                characters.values_list("character_id", flat=True))

            wallet_journal = models.CharacterWalletJournalEntry.objects\
                .filter(character__character__in=characters)\
                .select_related(
                    'first_party_name',
                    'second_party_name',
                    'character__character',
                    "msg"
                ).order_by('-date')[:35000]

            output = []
            for w in wallet_journal:
                own_account = False
                if (w.second_party_id in character_list and w.first_party_id in character_list):
                    own_account = True
                msg = w.reason
                if hasattr(w, "msg"):
                    msg = w.msg.message

                output.append(
                    {
                        "character": w.character.character,
                        "id": w.entry_id,
                        "date": w.date,
                        "first_party": {
                            "id": w.first_party_id,
                            "name": w.first_party_name.name,
                            "cat": w.first_party_name.category,
                        },
                        "second_party": {
                            "id": w.second_party_id,
                            "name": w.second_party_name.name,
                            "cat": w.second_party_name.category,
                        },
                        "ref_type": w.ref_type,
                        "amount": w.amount,
                        "balance": w.balance,
                        "reason": msg,
                        "description": w.description,
                        "own_account": own_account
                    })

            return output

        @api.get(
            "account/{character_id}/orders",
            response={200: List[schema.CharacterOrder], 403: str},
            tags=self.tags
        )
        def get_character_orders(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            orders = models.CharacterMarketOrder.objects\
                .filter(character__character__in=characters)\
                .select_related('type_name', 'location_name', 'character__character')

            output = []
            for w in orders:
                output.append(
                    {
                        "character": w.character.character,
                        "date": w.issued,
                        "duration": w.duration,
                        "volume_min": w.min_volume,
                        "volume_remain": w.volume_remain,
                        "volume_total": w.volume_total,
                        "item": {
                            "id": w.type_id,
                            "name": w.type_name.name
                        },
                        "price": w.price,
                        "escrow": w.escrow,
                        "buy_order": w.is_buy_order,
                        "location": {
                            "id": w.location_id,
                            "name": w.location_name.location_name if w.location_name else w.location_id
                        }
                    }
                )

            return output

        @api.get(
            "account/{character_id}/market",
            response={200: schema.CharacterMarket, 403: str},
            tags=self.tags
        )
        def get_character_market(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            market_data_current = models.CharacterMarketOrder.objects\
                .filter(character__character__in=characters, state="active")\
                .select_related('character__character', 'type_name', 'location_name')

            market_data_old = models.CharacterMarketOrder.objects\
                .filter(character__character__in=characters, duration__gt=0)\
                .select_related('character__character', 'type_name', 'location_name')\
                .exclude(state="active")

            output = {"active": [], "expired": [],
                      "total_active": 0, "total_expired": 0}
            for w in market_data_current:
                output['total_active'] += w.price * w.volume_remain
                o = {
                    "character": w.character.character,
                    "date": w.issued,
                    "duration": w.duration,
                    "volume_min": w.min_volume,
                    "volume_remain": w.volume_remain,
                    "volume_total": w.volume_total,
                    "item": {
                        "id": w.type_name.type_id,
                        "name": w.type_name.name
                    },
                    "price": w.price,
                    "escrow": w.escrow,
                    "buy_order": True if w.is_buy_order else False,
                }
                if w.location_name:
                    o['location'] = {
                        "id": w.location_name.location_id,
                        "name": w.location_name.location_name
                    }
                output["active"].append(o)

            for w in market_data_old:
                output['total_expired'] += w.price * w.volume_total
                o = {
                    "character": w.character.character,
                    "date": w.issued,
                    "duration": w.duration,
                    "volume_min": w.min_volume,
                    "volume_remain": w.volume_remain,
                    "volume_total": w.volume_total,
                    "item": {
                        "id": w.type_name.type_id,
                        "name": w.type_name.name
                    },
                    "price": w.price,
                    "escrow": w.escrow,
                    "buy_order": True if w.is_buy_order else False,
                }
                if w.location_name:
                    o['location'] = {
                        "id": w.location_name.location_id,
                        "name": w.location_name.location_name
                    }
                output["expired"].append(o)

            return output

        @api.get(
            "account/{character_id}/wallet/activity",
            tags=self.tags
        )
        def get_character_wallet_activity(request, character_id: int):
            if not (request.user.has_perm("corptools.global_corp_manager")
                    or request.user.has_perm("corptools.state_corp_manager")
                    or request.user.has_perm("corptools.alliance_corp_manager")
                    or request.user.has_perm("corptools.own_corp_manager")):
                return []

            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)
            character_list = list(
                characters.values_list("character_id", flat=True))

            ref_types = ["player_donation", "player_trading",
                         "contract_price", "corporation_account_withdrawal"]
            wallet_journal = models.CharacterWalletJournalEntry.objects\
                .filter(character__character__in=characters, ref_type__in=ref_types)\
                .select_related('first_party_name', 'second_party_name', 'character__character')\
                .values('first_party_name__name', 'second_party_name__name')\
                .annotate(total_isk=Sum('amount'))\
                .annotate(interactions=Count('amount'))\
                .annotate(fpcat=F('first_party_name__category'))\
                .annotate(spcat=F('second_party_name__category'))\
                .annotate(fpid=F('first_party_name__eve_id'))\
                .annotate(spid=F('second_party_name__eve_id'))\
                .annotate(fpcrp=F('first_party_name__corporation__name'))\
                .annotate(spcrp=F('second_party_name__corporation__name'))\
                .annotate(fpcid=F('first_party_name__corporation__eve_id'))\
                .annotate(spcid=F('second_party_name__corporation__eve_id'))\
                .annotate(fpali=F('first_party_name__alliance__name'))\
                .annotate(spali=F('second_party_name__alliance__name'))\
                .annotate(fpaid=F('first_party_name__alliance__eve_id'))\
                .annotate(spaid=F('second_party_name__alliance__eve_id'))

            output = []
            for w in wallet_journal:
                own_account = False
                if (w['spid'] in character_list and w['fpid'] in character_list):
                    own_account = True

                output.append(
                    {
                        "fpn": w['first_party_name__name'],
                        "firstParty": {
                            "cat": w['fpcat'],
                            "id": w['fpid'],
                            "cid": w['fpcid'],
                            "cn": w['fpcrp'],
                            "aid": w['fpali'],
                            "an": w['fpaid']
                        },
                        "spn": w['second_party_name__name'],
                        "secondParty": {
                            "cat": w['spcat'],
                            "id": w['spid'],
                            "cid": w['spcid'],
                            "cn": w['spcrp'],
                            "aid": w['spali'],
                            "an": w['spaid']
                        },
                        "value": abs(int(w['total_isk'])),
                        "interactions": w['interactions'],
                        "own_account": own_account
                    })

            return output

        @api.get(
            "account/{character_id}/contracts",
            response={200: List[schema.CharacterContract], 403: str},
            tags=self.tags
        )
        def get_character_contracts(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            character_list = list(
                characters.values_list("character_id", flat=True))

            contracts = models.Contract.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'acceptor_name', 'assignee_name', 'issuer_corporation_name', 'issuer_name') \
                .prefetch_related("contractitem_set", "contractitem_set__type_name").order_by("-date_issued")

            output = []

            for c in contracts:
                own_account = False
                if (c.assignee_id in character_list):
                    own_account = True

                _i = []
                for i in c.contractitem_set.all():
                    _i.append({
                        "is_included": i.is_included,
                        "is_singleton": i.is_singleton,
                        "quantity": i.quantity,
                        "raw_quantity": i.raw_quantity,
                        "record_id": i.record_id,
                        "type_name": i.type_name.name,
                    })
                _c = {
                    "character": c.character.character.character_name,
                    "acceptor": c.acceptor_name.name if c.acceptor_id else None,
                    "assignee": c.assignee_name.name if c.assignee_id else None,
                    "contract": c.contract_id,
                    "issuer": c.issuer_name.name,
                    "issuer_corporation_id": c.issuer_corporation_name.name,
                    "days_to_complete": c.days_to_complete,
                    "collateral": c.collateral or 0,
                    "buyout": c.buyout or 0,
                    "price": c.price or 0,
                    "reward": c.reward or 0,
                    "volume": c.volume or 0,
                    "start_location_id": c.start_location_id,
                    "end_location_id": c.end_location_id,
                    "for_corporation": c.for_corporation,
                    "date_accepted": c.date_accepted,
                    "date_completed": c.date_completed,
                    "date_expired": c.date_expired,
                    "date_issued": c.date_issued,
                    "status": c.status,
                    "contract_type": c.contract_type,
                    "availability": c.availability,
                    "title": c.title,
                    "items": _i,
                    "own_account": own_account
                }
                if c.start_location_name:
                    _c.update(
                        {
                            "start_location": {
                                "id": c.start_location_name.location_id,
                                "name": c.start_location_name.location_name
                            }
                        }
                    )
                if c.end_location_name:
                    _c.update(
                        {
                            "end_location": {
                                "id": c.end_location_name.location_id,
                                "name": c.end_location_name.location_name
                            }
                        }
                    )

                output.append(_c)

            return output

        @api.get(
            "account/{character_id}/loyalty",
            response={200: List[schema.LoyaltyPoints], 403: str},
            tags=self.tags
        )
        def get_character_loyalty_Points(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            lp = models.LoyaltyPoint.objects.filter(character__character__in=characters)\
                .select_related('character__character', "corporation")

            output = []

            for _l in lp:
                output.append({
                    "character": _l.character.character,
                    "corporation": {"id": _l.corporation.eve_id, "name": _l.corporation.name},
                    "amount": _l.amount
                })

            return output
