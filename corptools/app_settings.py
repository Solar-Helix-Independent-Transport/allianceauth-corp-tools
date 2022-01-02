from django.conf import settings
import importlib.resources
import json
import re

CORPTOOLS_DISCORD_BOT_COGS = getattr(
    settings, 'CORPTOOLS_DISCORD_BOT_COGS', ["corptools.cogs.routes", "corptools.cogs.locate"])

CT_CHAR_ASSETS_MODULE = getattr(settings, 'CT_CHAR_ASSETS_MODULE', True)
CT_CHAR_STANDINGS_MODULE = getattr(settings, 'CT_CHAR_STANDINGS_MODULE', True)
CT_CHAR_KILLMAILS_MODULE = getattr(settings, 'CT_CHAR_KILLMAILS_MODULE', True)
CT_CHAR_FITTINGS_MODULE = getattr(settings, 'CT_CHAR_FITTINGS_MODULE', True)
CT_CHAR_CALLENDAR_MODULE = getattr(settings, 'CT_CHAR_CALLENDAR_MODULE', True)
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
CT_CHAR_MAIL_MODULE = getattr(settings, 'CT_CHAR_MAIL_MODULE', False)
CT_CHAR_HELPER_MODULE = getattr(settings, 'CT_CHAR_HELPER_MODULE', True)

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
CT_CHAR_ACTIVE_IGNORE_MINING_MODULE = getattr(
    settings, 'CT_CHAR_ACTIVE_IGNORE_MINING_MODULE', False)
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


def get_character_scopes():
    _scopes = [
        # Base
        'publicData',
        'esi-universe.read_structures.v1',
        'esi-search.search_structures.v1',
        'esi-characters.read_opportunities.v1',
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

    if CT_CHAR_CALLENDAR_MODULE:
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
            'esi-fleets.read_fleet.v1',
        ]

    if CT_CHAR_MAIL_MODULE:
        _scopes += [
            # Mail
            'esi-mail.read_mail.v1',
        ]

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

    if CT_CHAR_NOTIFICATIONS_MODULE:
        _attribs += [
            # Notifications
            ("Notifications", 'last_update_notif'),
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
