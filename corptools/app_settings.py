from django.conf import settings

CORPTOOLS_APP_NAME = getattr(settings, "CORPTOOLS_APP_NAME", "Character Audit")

CORPTOOLS_DISCORD_BOT_COGS = getattr(
    settings, 'CORPTOOLS_DISCORD_BOT_COGS', ["corptools.cogs.routes", "corptools.cogs.locate", "corptools.cogs.where"])

CORPTOOLS_GUEST_HR_STATES = getattr(
    settings, 'CORPTOOLS_GUEST_HR_STATES', ["Guest"])

CT_CHAR_MAX_INACTIVE_DAYS = getattr(settings, 'CT_CHAR_MAX_INACTIVE_DAYS', 3)
CT_CHAR_METENOX_GAS_USE_HOURLY = getattr(
    settings, 'CT_CHAR_METENOX_GAS_USE_HOURLY', 200)

CT_CHAR_ASSETS_MODULE = getattr(settings, 'CT_CHAR_ASSETS_MODULE', True)
CT_CHAR_STANDINGS_MODULE = getattr(settings, 'CT_CHAR_STANDINGS_MODULE', True)
CT_CHAR_KILLMAILS_MODULE = getattr(settings, 'CT_CHAR_KILLMAILS_MODULE', True)
CT_CHAR_FITTINGS_MODULE = getattr(settings, 'CT_CHAR_FITTINGS_MODULE', True)
CT_CHAR_CALENDAR_MODULE = getattr(settings, 'CT_CHAR_CALENDAR_MODULE', True)
CT_CHAR_CONTACTS_MODULE = getattr(settings, 'CT_CHAR_CONTACTS_MODULE', True)
CT_CHAR_NOTIFICATIONS_MODULE = getattr(
    settings, 'CT_CHAR_NOTIFICATIONS_MODULE', True)
CT_CHAR_ROLES_MODULE = getattr(settings, 'CT_CHAR_ROLES_MODULE', True)
CT_CHAR_INDUSTRY_MODULE = getattr(settings, 'CT_CHAR_INDUSTRY_MODULE', True)
CT_CHAR_MINING_MODULE = getattr(settings, 'CT_CHAR_MINING_MODULE', True)
CT_CHAR_WALLET_MODULE = getattr(settings, 'CT_CHAR_WALLET_MODULE', True)
CT_CHAR_SKILLS_MODULE = getattr(settings, 'CT_CHAR_SKILLS_MODULE', True)
CT_CHAR_CLONES_MODULE = getattr(settings, 'CT_CHAR_CLONES_MODULE', True)
CT_CHAR_LOCATIONS_MODULE = getattr(settings, 'CT_CHAR_LOCATIONS_MODULE', True)
CT_CHAR_FLEET_MODULE = getattr(settings, 'CT_CHAR_FLEET_MODULE', True)
CT_CHAR_MAIL_MODULE = getattr(settings, 'CT_CHAR_MAIL_MODULE', False)
CT_CHAR_HELPER_MODULE = getattr(settings, 'CT_CHAR_HELPER_MODULE', True)
CT_CHAR_OPPORTUNITIES = False
CT_CHAR_LOYALTYPOINTS_MODULE = getattr(
    settings, 'CT_CHAR_LOYALTYPOINTS_MODULE', True)

CT_CHAR_ACTIVE_IGNORE_CORP_HISTORY = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_CORP_HISTORY', True)
CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_STANDINGS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_STANDINGS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_KILLMAILS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_KILLMAILS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_FITTINGS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_FITTINGS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_CALLENDAR_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_CALLENDAR_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_CONTACTS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_CONTACTS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_INDUSTRY_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_INDUSTRY_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_LOCATIONS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_LOCATIONS_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE', False)
CT_CHAR_ACTIVE_IGNORE_HELPER_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_HELPER_MODULE', False)

CT_CHAR_PAUSE_CONTRACTS = getattr(settings, 'CT_CHAR_PAUSE_CONTRACTS', False)

# Extra scopes to add to character/corporation token requests
CT_EXTRA_CHARACTER_SCOPES = getattr(
    settings, 'CT_EXTRA_CHARACTER_SCOPES', [])

CT_EXTRA_CORPORATION_SCOPES = getattr(
    settings, 'CT_EXTRA_CORPORATION_SCOPES', [])

# New scopes so existing all will fail so lets ignore this by default.
CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE', True)

# Swap to true for a release or 2
CT_CHAR_ACTIVE_IGNORE_MINING_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_MINING_MODULE', True)


def get_character_scopes():
    _scopes = [
        # Base
        'publicData',
    ]

    if CT_CHAR_HELPER_MODULE:
        _scopes += [
            # Helpers
            'esi-ui.open_window.v1',
            'esi-ui.write_waypoint.v1',
        ]

    if CT_CHAR_STANDINGS_MODULE:
        _scopes += [
            # Standings
            'esi-characters.read_standings.v1',
        ]

    if CT_CHAR_KILLMAILS_MODULE:
        _scopes += [
            # Killmails
            'esi-killmails.read_killmails.v1',
        ]

    if CT_CHAR_FITTINGS_MODULE:
        _scopes += [
            # Fittings
            'esi-fittings.read_fittings.v1',
        ]

    if CT_CHAR_CALENDAR_MODULE:
        _scopes += [
            # Callendar
            'esi-calendar.read_calendar_events.v1',
        ]

    if CT_CHAR_CONTACTS_MODULE:
        _scopes += [
            # Contacts
            'esi-characters.read_contacts.v1',
        ]

    if CT_CHAR_NOTIFICATIONS_MODULE:
        _scopes += [
            # Notifications
            'esi-characters.read_notifications.v1',
        ]

    if CT_CHAR_ROLES_MODULE:
        _scopes += [
            # Roles
            'esi-characters.read_titles.v1',
            'esi-characters.read_corporation_roles.v1',
        ]

    if CT_CHAR_INDUSTRY_MODULE:
        _scopes += [
            # Industry
            'esi-industry.read_character_jobs.v1',
        ]

    if CT_CHAR_MINING_MODULE:
        _scopes += [
            # Mining
            'esi-industry.read_character_mining.v1',
        ]

    if CT_CHAR_WALLET_MODULE:
        _scopes += [
            # Wallet / Market /  Contracts
            'esi-markets.read_character_orders.v1',
            'esi-wallet.read_character_wallet.v1',
            'esi-contracts.read_character_contracts.v1',
        ]

    if CT_CHAR_ASSETS_MODULE:
        _scopes += [
            # Assets
            'esi-assets.read_assets.v1',
        ]

    if CT_CHAR_SKILLS_MODULE:
        _scopes += [
            # Skills
            'esi-skills.read_skillqueue.v1',
            'esi-skills.read_skills.v1',
        ]

    if CT_CHAR_CLONES_MODULE:
        _scopes += [
            # Clones
            'esi-clones.read_implants.v1',
            'esi-clones.read_clones.v1',
        ]

    if CT_CHAR_LOCATIONS_MODULE:
        _scopes += [
            # Locations
            'esi-location.read_location.v1',
            'esi-location.read_online.v1',
            'esi-location.read_ship_type.v1',
            'esi-characters.read_fatigue.v1',
        ]

    if CT_CHAR_FLEET_MODULE:
        _scopes += [
            # Fleets
            'esi-fleets.read_fleet.v1',
            'esi-fleets.write_fleet.v1',
        ]

    if CT_CHAR_MAIL_MODULE:
        _scopes += [
            # Mailsn
            'esi-mail.read_mail.v1',
        ]

    # if CT_CHAR_OPPORTUNITIES:
    #     _scopes += [
    #         'esi-characters.read_opportunities.v1',
    #     ]

    if CT_CHAR_CLONES_MODULE or CT_CHAR_ASSETS_MODULE or CT_CHAR_WALLET_MODULE or CT_CHAR_MINING_MODULE:
        _scopes += [
            'esi-universe.read_structures.v1',
            'esi-search.search_structures.v1',
        ]

    if CT_CHAR_LOYALTYPOINTS_MODULE:
        _scopes += [
            'esi-characters.read_loyalty.v1',
        ]

    # Add user-defined extra scopes
    _scopes += CT_EXTRA_CHARACTER_SCOPES

    return list(set(_scopes))


def get_character_update_attributes():
    _attribs = [
        # Base
        ("Public Data", 'last_update_pub_data'),
    ]

    if CT_CHAR_CONTACTS_MODULE:
        _attribs += [
            # Contacts
            ("Contacts", 'last_update_contacts'),
        ]

    if CT_CHAR_LOCATIONS_MODULE:
        _attribs += [
            # Location
            ("Location", 'last_update_location'),
        ]

    if CT_CHAR_NOTIFICATIONS_MODULE:
        _attribs += [
            # Notifications
            ("Notifications", 'last_update_notif'),
        ]
    if CT_CHAR_NOTIFICATIONS_MODULE:
        _attribs += [
            # Notifications
            ("Mining", 'last_update_mining'),
        ]

    if CT_CHAR_ROLES_MODULE:
        _attribs += [
            # Roles
            ("Roles", 'last_update_roles'),
            ("Titles", 'last_update_titles'),
        ]

    if CT_CHAR_WALLET_MODULE:
        _attribs += [
            # Wallet / Market /  Contracts
            ("Wallet", 'last_update_wallet'),
            ("Orders", 'last_update_orders'),
        ]

    if CT_CHAR_INDUSTRY_MODULE:
        _attribs += [
            # Roles
            ("Industry", 'last_update_indy'),
        ]

    if CT_CHAR_LOYALTYPOINTS_MODULE:
        _attribs += [
            ("LP", 'last_update_loyaltypoints'),
        ]

    if CT_CHAR_ASSETS_MODULE:
        _attribs += [
            # Assets
            ("Assets", 'last_update_assets'),
        ]

    if CT_CHAR_SKILLS_MODULE:
        _attribs += [
            # Skills
            ("Skills", 'last_update_skills'),
            ("Skill Queue", 'last_update_skill_que')
        ]

    if CT_CHAR_CLONES_MODULE:
        _attribs += [
            # Clones
            ("Clones", 'last_update_clones'),
        ]

    if CT_CHAR_MAIL_MODULE:
        _attribs += [
            # Mail
            ("Mail", 'last_update_mails'),
        ]

    return _attribs


def get_corp_update_attributes():
    _attribs = [
        # Base
        ["Assets", 'last_update_assets', "a"],
        ("Structures", 'last_update_structures', "s"),
        ("Wallet", 'last_update_wallet', "w"),
        ("Moons Observations", 'last_update_observers', "m")
    ]

    return _attribs


_corp_scopes_base = [
    # All...
    'esi-search.search_structures.v1',
    'esi-universe.read_structures.v1',
    'esi-characters.read_corporation_roles.v1',
]

# Tracking
_corp_scopes_tracking = [
    'esi-corporations.track_members.v1',
    'esi-corporations.read_titles.v1',
    'esi-corporations.read_corporation_membership.v1',
    'esi-killmails.read_corporation_killmails.v1',
]

# structures
_corp_scopes_structures = [
    'esi-planets.read_customs_offices.v1',
    'esi-corporations.read_structures.v1',
]

# structures
_corp_scopes_starbases = [
    'esi-corporations.read_starbases.v1',
]

# moons
_corp_scopes_moons = [
    'esi-industry.read_corporation_mining.v1',
]

# wallets
_corp_scopes_wallets = [
    'esi-wallet.read_corporation_wallets.v1',
    'esi-markets.read_corporation_orders.v1',
    'esi-industry.read_corporation_jobs.v1',
    'esi-corporations.read_divisions.v1',
]

# assets
_corp_scopes_assets = [
    'esi-assets.read_corporation_assets.v1',
]

_corp_scopes_contracts = [
    "esi-contracts.read_corporation_contracts.v1",
]

_corp_scopes_pocos = [
    'esi-planets.read_customs_offices.v1',
]

_corp_scopes_industry_jobs = [
    'esi-industry.read_corporation_jobs.v1'
]


CORP_REQUIRED_SCOPES = _corp_scopes_base + _corp_scopes_tracking + \
    _corp_scopes_structures + _corp_scopes_moons + \
    _corp_scopes_wallets + _corp_scopes_assets + \
    CT_EXTRA_CORPORATION_SCOPES

CT_BETA_UI = getattr(
    settings, 'CT_BETA_UI', False)

CT_PAGINATION_SIZE = getattr(
    settings, 'CT_PAGINATION_SIZE', 30000)

CT_USERS_CAN_FORCE_REFRESH = getattr(
    settings, 'CT_USERS_CAN_FORCE_REFRESH', False)

CT_TASK_SPREAD_DELAY = getattr(
    settings, 'CT_TASK_SPREAD_DELAY', 1200)  # Default 20 minute spread
