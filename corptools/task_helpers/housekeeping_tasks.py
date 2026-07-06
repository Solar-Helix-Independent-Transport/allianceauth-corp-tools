# Standard Library
from datetime import timedelta

# Django
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.models import (
    CharacterWalletJournalEntry,
    CorporationWalletJournalEntry,
    Notification,
)
from corptools.models.audits import CorptoolsConfiguration

logger = get_extension_logger(__name__)

WALLET_NPC_TYPES = [
    "acceleration_gate_fee",
    "achievement_category_milestone_reward",
    "achievement_milestone_reward",
    "advertisement_listing_fee",
    "agent_donation",
    "agent_location_services",
    "agent_miscellaneous",
    "agent_mission_collateral_paid",
    "agent_mission_collateral_refunded",
    "agent_mission_reward_corporation_tax",
    "agent_mission_security_tax",
    "agent_mission_time_bonus_reward_corporation_tax",
    "agent_security_services",
    "agent_services_rendered",
    "agents_preward",
    "air_career_program_reward",
    "alliance_maintainance_fee",
    "alliance_registration_fee",
    "allignment_based_gate_toll",
    "asset_safety_recovery_tax",
    "bounty_reimbursement",
    "bounty_surcharge",
    "campaign_objective_isk_reward",
    "clone_activation",
    "clone_transfer",
    "contraband_fine",
    "copying",
    "corporation_logo_change_cost",
    "corporation_registration_fee",
    "cosmetic_market_component_item_purchase",
    "cosmetic_market_skin_sale_broker_fee",
    "cosmetic_market_skin_sale_tax",
    "daily_challenge_reward",
    "daily_goal_payouts",
    "daily_goal_payouts_tax",
    "datacore_fee",
    "dna_modification_fee",
    "docking_fee",
    "external_trade_delivery",
    "external_trade_freeze",
    "external_trade_thaw",
    "factory_slot_rental_fee",
    "flux_payout",
    "flux_tax",
    "flux_ticket_repayment",
    "flux_ticket_sale",
    "freelance_jobs_broadcasting_fee",
    "freelance_jobs_duration_fee",
    "freelance_jobs_escrow_refund",
    "freelance_jobs_reward",
    "freelance_jobs_reward_corporation_tax",
    "freelance_jobs_reward_escrow",
    "industry_security_tax",
    "infrastructure_hub_maintenance",
    "inheritance",
    "insurance",
    "insurgency_corruption_contribution_reward",
    "insurgency_suppression_contribution_reward",
    "item_trader_payment",
    "jump_clone_activation_fee",
    "jump_clone_installation_fee",
    "lp_store",
    "manufacturing",
    "market_fine_paid",
    "market_security_tax",
    "milestone_reward_payment",
    "mission_completion",
    "mission_cost",
    "mission_expiration",
    "mission_reward",
    "npc_bounty_security_tax",
    "office_rental_fee",
    "opportunity_reward",
    "planetary_construction",
    "project_discovery_reward",
    "project_discovery_tax",
    "project_payouts",
    "reaction",
    "reprocessing_tax",
    "researching_material_productivity",
    "researching_technology",
    "researching_time_productivity",
    "release_of_impounded_property",
    "repair_bill",
    "resource_wars_reward",
    "reverse_engineering",
    "season_challenge_reward",
    "security_processing_fee",
    "skill_purchase",
    "skyhook_claim_fee",
    "sovereignity_bill",
    "store_purchase",
    "store_purchase_refund",
    "structure_gate_jump",
    "under_construction",
    "upkeep_adjustment_fee",
]

NOTIFICATION_PURGEABLE_TYPES = [
    # War
    "AcceptedAlly",
    "AcceptedSurrender",
    "AllianceCapitalChanged",
    "AllianceWarDeclaredV2",
    "AllWarCorpJoinedAllianceMsg",
    "AllWarDeclaredMsg",
    "AllWarInvalidatedMsg",
    "AllWarRetractedMsg",
    "AllWarSurrenderMsg",
    "AllyContractCancelled",
    "AllyJoinedWarAggressorMsg",
    "AllyJoinedWarAllyMsg",
    "AllyJoinedWarDefenderMsg",
    "BattlePunishFriendlyFire",
    "CorpBecameWarEligible",
    "CorpFriendlyFireDisableTimerCompleted",
    "CorpFriendlyFireDisableTimerStarted",
    "CorpFriendlyFireEnableTimerCompleted",
    "CorpFriendlyFireEnableTimerStarted",
    "CorpNoLongerWarEligible",
    "CorpWarDeclaredMsg",
    "CorpWarDeclaredV2",
    "CorpWarFightingLegalMsg",
    "CorpWarInvalidatedMsg",
    "CorpWarRetractedMsg",
    "CorpWarSurrenderMsg",
    "DeclareWar",
    "MadeWarMutual",
    "MercenaryDenAttacked",
    "MercenaryDenNewMTO",
    "MercenaryDenReinforced",
    "MercOfferedNegotiationMsg",
    "MercOfferRetractedMsg",
    "MutualWarExpired",
    "MutualWarInviteAccepted",
    "MutualWarInviteRejected",
    "MutualWarInviteSent",
    "OfferedSurrender",
    "OfferedToAlly",
    "OfferToAllyRetracted",
    "RetractsWar",
    "WarAdopted",
    "WarAdopted ",
    "WarAllyInherited",
    "WarAllyOfferDeclinedMsg",
    "WarConcordInvalidates",
    "WarDeclared",
    "WarEndedHqSecurityDrop",
    "WarHQRemovedFromSpace",
    "WarInherited",
    "WarInvalid",
    "WarRetracted",
    "WarRetractedByConcord",
    "WarSurrenderDeclinedMsg",
    "WarSurrenderOfferMsg",
    # Sovereignty
    "EntosisCaptureStarted",
    "IHubDestroyedByBillFailure",
    "SovAllClaimAquiredMsg",
    "SovAllClaimLostMsg",
    "SovCommandNodeEventStarted",
    "SovCorpBillLateMsg",
    "SovCorpClaimFailMsg",
    "SovDisruptorMsg",
    "SovereigntyIHDamageMsg",
    "SovereigntySBUDamageMsg",
    "SovereigntyTCUDamageMsg",
    "SovStationEnteredFreeport",
    "SovStructureDestroyed",
    "SovStructureReinforced",
    "SovStructureSelfDestructCancel",
    "SovStructureSelfDestructFinished",
    "SovStructureSelfDestructRequested",
    # Structures & stations
    "AllAnchoringMsg",
    "AllStrucInvulnerableMsg",
    "AllStructVulnerableMsg",
    "CorpStructLostMsg",
    "DistrictAttacked",
    "DustAppAcceptedMsg",
    "OrbitalAttacked",
    "OrbitalReinforced",
    "SkyhookDeployed",
    "SkyhookDestroyed",
    "SkyhookLostShields",
    "SkyhookOnline",
    "SkyhookUnderAttack",
    "StationAggressionMsg1",
    "StationAggressionMsg2",
    "StationConquerMsg",
    "StationServiceDisabled",
    "StationServiceEnabled",
    "StationStateChangeMsg",
    "StructureAnchoring",
    "StructureCourierContractChanged",
    "StructureDestroyed",
    "StructureFuelAlert",
    "StructureImpendingAbandonmentAssetsAtRisk",
    "StructureItemsDelivered",
    "StructureItemsMovedToSafety",
    "StructureLostArmor",
    "StructureLostShields",
    "StructureLowReagentsAlert",
    "StructureNoReagentsAlert",
    "StructureOnline",
    "StructurePaintPurchased",
    "StructureServicesOffline",
    "StructureUnanchoring",
    "StructureUnderAttack",
    "StructureWentHighPower",
    "StructureWentLowPower",
    "StructuresJobsCancelled",
    "StructuresJobsPaused",
    "StructuresReinforcementChanged",
    "TowerAlertMsg",
    "TowerResourceAlertMsg",
    # NPC billing & office
    "AllMaintenanceBillMsg",
    "BillOutOfMoneyMsg",
    "BillPaidCorpAllMsg",
    "CorpAllBillMsg",
    "CorpOfficeExpirationMsg",
    "InfrastructureHubBillAboutToExpire",
    "OfficeLeaseCanceledInsufficientStandings",
    # NPC clone & jump clone
    "CloneActivationMsg",
    "CloneActivationMsg2",
    "CloneMovedMsg",
    "CloneRevokedMsg1",
    "CloneRevokedMsg2",
    "JumpCloneDeletedMsg1",
    "JumpCloneDeletedMsg2",
    # NPC insurance
    "InsuranceExpirationMsg",
    "InsuranceFirstShipMsg",
    "InsuranceInvalidatedMsg",
    "InsuranceIssuedMsg",
    "InsurancePayoutMsg",
    # NPC missions & agents
    "AgentRetiredTrigravian",
    "MissionCanceledTriglavian",
    "MissionOfferExpirationMsg",
    "MissionTimeoutMsg",
    "ResearchMissionAvailableMsg",
    "StoryLineMissionAvailableMsg",
    # NPC events, rewards & content
    "CombatOperationFinished",
    "DailyItemRewardAutoClaimed",
    "ExpertSystemExpired",
    "ExpertSystemExpiryImminent",
    # "GameTimeAdded",
    # "GameTimeReceived",
    "IncursionCompletedMsg",
    "IndustryTeamAuctionLost",
    "IndustryTeamAuctionWon",
    "InvasionCompletedMsg",
    "InvasionSystemLogin",
    "InvasionSystemStart",
    "LPAutoRedeemed",
    "OperationFinished",
    "RaffleCreated",
    "RaffleExpired",
    "RaffleFinished",
    "ReimbursementMsg",
    "SeasonalChallengeCompleted",
    "SkinSequencingCompleted",
    "SPAutoRedeemed",
    "TutorialMsg",
    # NPC standings
    "NPCStandingsGained",
    "NPCStandingsLost",
    # FW NPC standing warnings
    "FWAllianceKickCeoIndividualStandingWarning",
    "FWAllianceKickedCeoIndividualStanding",
    "FWAllianceWarningMsg",
    "FWCharacterKickFromCorpIndividualStandingWarning",
    "FWCharacterKickedFromCorpIndividualStanding",
    "FWCharWarningMsg",
    "FWCorporationKickCeoIndividualStandingWarning",
    "FWCorporationKickedCeoIndividualStanding",
    "FWCorpWarningMsg",
    # Industry completion timers
    "IndustryOperationFinished",
    # Legacy / misc NPC
    "OldLscMessages",
    "TransactionReversalMsg",
]


def remove_old_notifications():
    retention_days = CorptoolsConfiguration.get_solo().notification_retention_days
    cutoff = timezone.now() - timedelta(days=retention_days)
    step = 50000

    qs_ids = list(
        Notification.objects
        .filter(notification_type__in=NOTIFICATION_PURGEABLE_TYPES, timestamp__lt=cutoff)
        .values_list("id", flat=True)[:step]
    )
    Notification.objects.filter(pk__in=qs_ids).delete()
    return f"Deleted {len(qs_ids)} Notifications"


def purge_npc_wallet_entries():
    retention_days = CorptoolsConfiguration.get_solo().wallet_journal_retention_days
    cutoff = timezone.now() - timedelta(days=retention_days)
    step = 10000
    total = 0

    while True:
        char_ids = list(
            CharacterWalletJournalEntry.objects
            .filter(ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff)
            .values_list("pk", flat=True)[:step]
        )
        if not char_ids:
            break
        CharacterWalletJournalEntry.objects.filter(pk__in=char_ids).delete()
        total += len(char_ids)

    while True:
        corp_ids = list(
            CorporationWalletJournalEntry.objects
            .filter(ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff)
            .values_list("pk", flat=True)[:step]
        )
        if not corp_ids:
            break
        CorporationWalletJournalEntry.objects.filter(pk__in=corp_ids).delete()
        total += len(corp_ids)

    return f"Deleted {total} NPC wallet journal entries older than {retention_days} days"
