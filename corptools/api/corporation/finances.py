import logging
from typing import List

from ninja import NinjaAPI

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api import schema

logger = get_extension_logger(__name__)


class FinancesApiEndpoints:

    tags = ["Finances"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corporation/wallettypes",
            tags=self.tags
        )
        def get_corporation_wallet_types(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_wallets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            ref_types = models.CorporationWalletJournalEntry.objects.values_list(
                "ref_type", flat=True).distinct()

            return 200, ["all"] + list(ref_types)

        @api.get(
            "corporation/{corporation_id}/wallet",
            response={200: List[schema.CorporationWalletEvent], 403: str},
            tags=self.tags
        )
        def get_corporation_wallet(request, corporation_id: int, type_refs: str = "", page: int = 1):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_wallets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            wallet_journal = models.CorporationWalletJournalEntry.get_visible(request.user)\
                .filter(division__corporation__corporation__corporation_id=corporation_id)\
                .select_related('first_party_name', 'second_party_name', 'division')\
                .order_by("-date")

            start_count = (page - 1) * 10000
            end_count = page * 10000

            filter_refs = True
            if type_refs:
                refs = type_refs.split(",")
                if "all" in refs:
                    filter_refs = False

                if len(refs) == 0:
                    return 200, []

                if filter_refs:
                    wallet_journal = wallet_journal.filter(ref_type__in=refs)

            wallet_journal = wallet_journal[start_count:end_count]

            output = []
            for w in wallet_journal:
                output.append(
                    {
                        "division": f"{w.division.division} {w.division.name}",
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
                        "reason": w.reason,
                    })

            return output

        @api.get(
            "corporation/{corporation_id}/divisions",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_corporation_divisions(request, corporation_id: int, type_refs: str = "", page: int = 1):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_wallets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            wallet_divisions = models.CorporationWalletDivision.get_visible(
                request.user
            ).filter(
                corporation__corporation__corporation_id=corporation_id
            ).order_by("division")

            output = []
            for w in wallet_divisions:
                output.append(
                    {
                        "division": f"{w.division}",
                        "name": f"{w.name}",
                        "balance": w.balance,
                    })

            return output
