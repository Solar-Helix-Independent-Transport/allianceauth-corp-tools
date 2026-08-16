# PvE ISK stats shown on the character/corp "glances" page, keyed by name.
# Shared by corptools.api.helpers (glance display) and corptools.models.filters
# (PVEIskFilter) so the two never drift apart.
PVE_GLANCE_STATS = {
    "ratting": {
        "ref_types": ["bounty_prizes"],
        "first_parties": None,
        # 5 mill ticks should cover gate rats etc. but still show passive ratting
        "minimum_amount": 1_000_000,
    },
    "missions": {
        "ref_types": ["agent_mission_reward", "agent_mission_time_bonus_reward"],
        "first_parties": None,
        "minimum_amount": None,
    },
    "incursion": {
        "ref_types": ["corporate_reward_payout"],
        "first_parties": [1000125],
        "minimum_amount": None,
    },
    "pochven": {
        "ref_types": ["corporate_reward_payout"],
        "first_parties": [1000298],
        "minimum_amount": None,
    },
}
