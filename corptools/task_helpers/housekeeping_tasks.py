from datetime import timedelta

from django.utils import timezone

from allianceauth.services.hooks import get_extension_logger

from corptools.models import Notification

logger = get_extension_logger(__name__)

NOTIFICAITON_PURGE_TYPES = [
    "AcceptedAlly",
    "AcceptedSurrender",
    "AllMaintenanceBillMsg",
    "AllWarCorpJoinedAllianceMsg",
    "AllWarDeclaredMsg",
    "AllWarInvalidatedMsg",
    "AllWarRetractedMsg",
    "AllWarSurrenderMsg",
    "AllyJoinedWarAggressorMsg",
    "AllyJoinedWarAllyMsg",
    "AllyJoinedWarDefenderMsg",
    "CorpBecameWarEligible",
    "CorpFriendlyFireDisableTimerCompleted",
    "CorpFriendlyFireDisableTimerStarted",
    "CorpFriendlyFireEnableTimerCompleted",
    "CorpFriendlyFireEnableTimerStarted",
    "CorpNoLongerWarEligible",
    "CorpWarDeclaredMsg",
    "CorpWarFightingLegalMsg",
    "CorpWarInvalidatedMsg",
    "CorpWarRetractedMsg",
    "CorpWarSurrenderMsg",
    "DeclareWar",
    "EntosisCaptureStarted",
    "InfrastructureHubBillAboutToExpire",
    "MadeWarMutual",
    "MercOfferedNegotiationMsg",
    "MercOfferRetractedMsg",
    "MutualWarInviteAccepted",
    "MutualWarInviteSent",
    "NPCStandingsGained",
    "NPCStandingsLost", "OfferedSurrender",
    "OfferedToAlly",
    "OfferToAllyRetracted",
    "OrbitalAttacked",
    "OrbitalReinforced",
    "RetractsWar",
    "SovAllClaimAquiredMsg",
    "SovAllClaimLostMsg",
    "SovCommandNodeEventStarted",
    "SovCorpClaimFailMsg",
    "SovDisruptorMsg",
    "SovereigntyIHDamageMsg",
    "SovereigntySBUDamageMsg",
    "SovereigntyTCUDamageMsg",
    "SovStationEnteredFreeport",
    "SovStructureDestroyed",
    "SovStructureReinforced",
    "StationAggressionMsg1",
    "StationAggressionMsg2",
    "StationConquerMsg",
    "StationServiceDisabled",
    "StationServiceEnabled",
    "StructureFuelAlert",
    "StructureLostArmor",
    "StructureLostShields",
    "StructureServicesOffline",
    "StructureUnderAttack",
    "StructureWentHighPower",
    "StructureWentLowPower",
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
    "WarSurrenderOfferMsg"
]


def remove_old_notifications():
    def get_qs():
        oldest = timezone.now() - timedelta(days=90)
        return Notification.objects.filter(notification_type__in=NOTIFICAITON_PURGE_TYPES,
                                           timestamp__lte=oldest)

    step = 50000

    qs_ids = list(get_qs()[:step].values_list("id", flat=True))
    Notification.objects.filter(pk__in=qs_ids).delete()
    return f"Deleted {len(qs_ids)} Notifications"
