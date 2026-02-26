# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.exceptions import HTTPNotModified

# AA Example App
from corptools.models import (
    CorporateContract,
    CorporateContractItem,
    CorporationAudit,
    EveItemType,
    EveName,
)

from .. import providers
from .utils import get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_contracts")
def corp_contract_update(corp_id, force_refresh=False):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id
    )

    logger.debug(
        "updating corporate contracts for: %s" % str(
            _corporation.corporation.corporation_name)
    )

    req_scopes = [
        'esi-contracts.read_corporation_contracts.v1',
        'esi-characters.read_corporation_roles.v1'
    ]

    token = get_corp_token(corp_id, req_scopes, False)

    new_contract_ids = []

    if not token:
        return False, []
    contracts = providers.esi_openapi.client.Contracts.GetCorporationsCorporationIdContracts(
        corporation_id=corp_id,
        token=token
    ).results(
        force_refresh=force_refresh
    )

    contract_models_new = []
    contract_models_old = []
    eve_names = set()
    contract_ids = list(
        CorporateContract.objects.filter(
            corporation=_corporation
        ).values_list(
            "contract_id",
            flat=True
        )
    )
    for c in contracts:  # update labels
        _contract_item = CorporateContract.from_esi_model(_corporation, c)
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
        CorporateContract.objects.bulk_create(
            contract_models_new, batch_size=1000, ignore_conflicts=True)

    if len(contract_models_old) > 0:
        CorporateContract.objects.bulk_update(
            contract_models_old,
            batch_size=1000,
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

    new_contract_ids = [c.contract_id for c in contract_models_new]
    if force_refresh:
        new_contract_ids += [c.contract_id for c in contract_models_old]

    return "CT: Completed corporate contracts for: %s" % str(_corporation.corporation.corporation_name), new_contract_ids


def corp_contract_item_fetch(corp_id, contract_id, force_refresh=False):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id
    )

    logger.debug(
        "updating contract items for: %s (%s)" % (
            str(_corporation.corporation.corporation_name),
            str(contract_id)
        )
    )

    contract = CorporateContract.objects.get(
        corporation=_corporation,
        contract_id=contract_id)

    if contract.status != "deleted":
        req_scopes = [
            'esi-contracts.read_corporation_contracts.v1',
            'esi-characters.read_corporation_roles.v1'
        ]

        token = get_corp_token(corp_id, req_scopes, False)

        if not token:
            return False
        try:
            contracts = providers.esi_openapi.client.Contracts.GetCorporationsCorporationIdContractsContractIdItems(
                corporation_id=corp_id,
                contract_id=contract_id,
                token=token
            ).results(
                force_refresh=force_refresh
            )

            contract_models_new = []
            _types = set()
            for c in contracts:  # update labels
                _contract_item = CorporateContractItem.from_esi_model(
                    contract, c)
                _types.add(c.type_id)
                contract_models_new.append(_contract_item)
            EveItemType.objects.create_bulk_from_esi(list(_types))
            CorporateContractItem.objects.bulk_create(
                contract_models_new, batch_size=1000, ignore_conflicts=True)
        except HTTPNotModified:
            logger.info(
                f"CT: No New Corporate Contract items {str(_corporation.corporation.corporation_name)} ({str(contract_id)})")

    return f"CT: Completed Corporate Contract items {str(_corporation.corporation.corporation_name)} ({str(contract_id)})"
