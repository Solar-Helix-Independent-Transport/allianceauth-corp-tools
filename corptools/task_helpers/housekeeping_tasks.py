from datetime import timedelta
import logging

from corptools.models import Notification, CharacterMarketOrder
from django.utils import timezone

import logging
logger = logging.getLogger(__name__)

NOTIFICAITON_PURGE_TYPES = [
    "NotificationNPCStandingsLost",
    "EntosisCaptureStarted",
    "SovCommandNodeEventStarted",
    "SovStructureReinforced",
    "SovStructureDestroyed",
    "WarInherited",
    "WarDeclared",
    "WarRetractedByConcord",
    "StructureUnderAttack",
    "WarAdopted",
    "WarAdopted ",
    "WarHQRemovedFromSpace",
    "OrbitalAttacked",
    "NPCStandingsGained",
    "SovAllClaimAquiredMsg",
    "OrbitalReinforced",
    "AllWarDeclaredMsg",
    "AllWarInvalidatedMsg",
    "SovAllClaimLostMsg",
    "WarInvalid",
    "StructureWentHighPower",
    "StructureFuelAlert",
    "StructureWentLowPower",
    "StructureLostShields",
    "StructureServicesOffline",
    "CorpWarSurrenderMsg",
    "StructureLostArmor",
    "MercOfferedNegotiationMsg",
    "DeclareWar",
    "InfrastructureHubBillAboutToExpire",
    "AllyJoinedWarAllyMsg",
    "OfferedToAlly",
    "CorpNoLongerWarEligible",
    "CorpBecameWarEligible",
    "StationServiceEnabled",
    "SovereigntySBUDamageMsg",
    "SovereigntyIHDamageMsg",
    "SovereigntyTCUDamageMsg",
    "OfferedSurrender",
    "AllWarSurrenderMsg",
    "WarConcordInvalidates",
    "MercOfferRetractedMsg",
    "SovStructureSelfDestructCancel",
    "SovStructureSelfDestructFinished",
    "SovStructureSelfDestructRequested",
    "CorpWarRetractedMsg",
    "WarEndedHqSecurityDrop",
    "MutualWarInviteSent",
    "WarSurrenderDeclinedMsg",
    "OfferToAllyRetracted",
    "RetractsWar",
    "WarRetracted",
    "MutualWarInviteAccepted",
    "SovDisruptorMsg",
    "SovCorpClaimFailMsg",
    "StructureAnchoring",
    "WarSurrenderOfferMsg",
]


def remove_old_notifications():
    def get_qs():
        oldest = timezone.now() - timedelta(days=182)
        return Notification.objects.filter(notification_type__in=NOTIFICAITON_PURGE_TYPES,
                                           timestamp__lte=oldest)

    step = 50000

    qs_ids = list(get_qs()[:step].values_list("id", flat=True))
    deleted = Notification.objects.filter(pk__in=qs_ids).delete()
    return f"Deleted {len(qs_ids)} Notifications"
