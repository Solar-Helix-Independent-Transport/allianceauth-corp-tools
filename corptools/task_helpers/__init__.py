LOCATION_FLAG_REPLACEMENTS = {
    "unknown location_flag (185)": "InfrastructureHangar",
    "unknown location_flag (186)": "MoonMaterialBay"
}

NOTIFICATION_TYPE_REPLACEMENTS = {
    "unknown notification type (263)": "CorporationGoalNameChange",
    "unknown notification type (264)": "CorporationGoalExpired",
    "unknown notification type (265)": "CorporationGoalLimitReached",
    "unknown notification type (276)": "SPAutoRedeemed",
    "unknown notification type (280)": "SkinSequencingCompleted",
    "unknown notification type (281)": "SkyhookOnline",
    "unknown notification type (282)": "SkyhookLostShields",
    "unknown notification type (283)": "SkyhookUnderAttack",
    "unknown notification type (284)": "SkyhookDestroyed",
    "unknown notification type (285)": "SkyhookDeployed",
    "unknown notification type (286)": "MercenaryDenReinforced",
    "unknown notification type (287)": "MercenaryDenAttacked",
    "unknown notification type (290)": "FreelanceProjectClosed",
    "unknown notification type (292)": "FreelanceProjectCompleted",
    "unknown notification type (293)": "FreelanceProjectLimitReached",
    "unknown notification type (294)": "FreelanceProjectParticipantKicked",
    "unknown notification type (295)": "FreelanceProjectCreated",
    "unknown notification type (296)": "FreelanceProjectExpired",
    "unknown notification type (6013)": "DailyItemRewardAutoClaimed",
    "unknown notification type (6040)": "StructureLowReagentsAlert",
    "unknown notification type (6041)": "StructureNoReagentsAlert"
}


def sanitize_location_flag(flag):
    return LOCATION_FLAG_REPLACEMENTS.get(flag, flag)


def sanitize_notification_type(note_type):
    return NOTIFICATION_TYPE_REPLACEMENTS.get(note_type, note_type)
