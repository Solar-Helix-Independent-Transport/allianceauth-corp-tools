"""
Contract sync had two related bugs in Contract.from_esi_model /
update_character_contracts (and the identical pattern in
CorporateContract.from_esi_model / corp_contract_update):

1. issuer_id and issuer_corporation_id (the plain int columns) were never
   set at all - only the *_name_id FK columns were, from the same source
   ids. The int columns just sat at their field default forever.

2. assignee_id was missing from the bulk_update() fields list used to
   refresh existing contracts, while assignee_name (its FK sibling) *was*
   included - so after a contract's assignee changed and got re-synced,
   assignee_id stayed stale while assignee_name pointed at the new EveName,
   leaving the two out of sync and the API's `if c.assignee_id` guard
   checking the wrong value.
"""

# Standard Library
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch

# AA Example App
from corptools.models import CharacterAudit, Contract, EveName
from corptools.task_helpers.char_tasks import update_character_contracts

from . import CorptoolsTestCase


def _contract_stub(
    contract_id,
    issuer_id,
    issuer_corporation_id,
    assignee_id=0,
    acceptor_id=0,
    status="outstanding",
):
    c = MagicMock()
    c.contract_id = contract_id
    c.issuer_id = issuer_id
    c.issuer_corporation_id = issuer_corporation_id
    c.assignee_id = assignee_id
    c.acceptor_id = acceptor_id
    c.availability = "private"
    c.buyout = None
    c.collateral = None
    c.date_accepted = None
    c.date_completed = None
    c.date_expired = datetime(2030, 1, 1, tzinfo=timezone.utc)
    c.date_issued = datetime(2025, 1, 1, tzinfo=timezone.utc)
    c.days_to_complete = 7
    c.end_location_id = 60003760
    c.for_corporation = False
    c.price = 0
    c.reward = 0
    c.start_location_id = 60003760
    c.status = status
    c.title = ""
    c.type = "item_exchange"
    c.volume = 0
    return c


class TestContractSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.audit, _ = CharacterAudit.objects.get_or_create(
            character=self.char1)
        for eve_id, name in (
            (0, "Unknown"),
            (1001, "Issuer One"),
            (2001, "Issuer Corp One"),
            (3001, "Assignee One"),
            (3002, "Assignee Two"),
        ):
            EveName.objects.get_or_create(
                eve_id=eve_id, defaults={"name": name, "category": "character"})

    @patch("corptools.task_helpers.char_tasks.EveName.objects.create_bulk_from_esi")
    @patch("corptools.task_helpers.char_tasks.get_token")
    @patch("corptools.task_helpers.char_tasks.providers")
    def test_issuer_fields_are_populated_on_create(
        self, mock_providers, mock_get_token, mock_bulk_names
    ):
        mock_get_token.return_value = "token"
        mock_bulk_names.return_value = True
        stub = _contract_stub(
            contract_id=555, issuer_id=1001, issuer_corporation_id=2001,
            assignee_id=3001,
        )
        mock_providers.esi_openapi.client.Contracts.GetCharactersCharacterIdContracts \
            .return_value.results.return_value = [stub]

        update_character_contracts(self.char1.character_id)

        contract = Contract.objects.get(character=self.audit, contract_id=555)
        self.assertEqual(contract.issuer_id, 1001)
        self.assertEqual(contract.issuer_corporation_id, 2001)
        self.assertEqual(contract.issuer_name.name, "Issuer One")
        self.assertEqual(
            contract.issuer_corporation_name.name, "Issuer Corp One")

    @patch("corptools.task_helpers.char_tasks.EveName.objects.create_bulk_from_esi")
    @patch("corptools.task_helpers.char_tasks.get_token")
    @patch("corptools.task_helpers.char_tasks.providers")
    def test_assignee_id_refreshes_on_resync_not_left_stale(
        self, mock_providers, mock_get_token, mock_bulk_names
    ):
        mock_get_token.return_value = "token"
        mock_bulk_names.return_value = True
        get_contracts = mock_providers.esi_openapi.client.Contracts \
            .GetCharactersCharacterIdContracts.return_value.results

        # First sync: contract assigned to 3001.
        get_contracts.return_value = [
            _contract_stub(
                contract_id=777, issuer_id=1001, issuer_corporation_id=2001,
                assignee_id=3001,
            )
        ]
        update_character_contracts(self.char1.character_id, force_refresh=True)
        contract = Contract.objects.get(character=self.audit, contract_id=777)
        self.assertEqual(contract.assignee_id, 3001)
        self.assertEqual(contract.assignee_name.name, "Assignee One")

        # Second sync: same contract now reassigned to 3002. This is the
        # bulk_update path (contract already exists), which is exactly what
        # used to leave assignee_id at its stale (3001) value.
        get_contracts.return_value = [
            _contract_stub(
                contract_id=777, issuer_id=1001, issuer_corporation_id=2001,
                assignee_id=3002,
            )
        ]
        update_character_contracts(self.char1.character_id, force_refresh=True)

        contract.refresh_from_db()
        self.assertEqual(contract.assignee_id, 3002)
        self.assertEqual(contract.assignee_name.name, "Assignee Two")
