# CorpTools

[![CI](https://github.com/pvyParts/allianceauth-corp-tools/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/pvyParts/allianceauth-corp-tools/actions/workflows/main.yml) [![PyPI version](https://badge.fury.io/py/allianceauth-corptools.svg)](https://badge.fury.io/py/allianceauth-corptools) ![Discord](https://img.shields.io/discord/399006117012832262?label=Support%20Server)

### Lightweight Toolbox of Bits and bobs for today's Eve Group on the go!

This module is the core of the CorpTools Ecosystem, this includes;

- [Invoices](https://github.com/Solar-Helix-Independent-Transport/allianceauth-invoice-manager): Automatic tracking of payments made to a holding wallet.
- [Moons](https://github.com/pvyParts/allianceauth-corp-tools-moons): Moon Mining tracking and Tax system.
- [Indy Dash](https://github.com/pvyParts/allianceauth-corp-tools-indy-dash): What Industrial structures have what rigs and where are they.
- [Pinger](https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools-pinger): High performance pings from the notification endpoint, using the data available from character audit.

Included `Bits and Bobs`:

- Modular Character Audit with selectable scopes. ( See Settings section below. )

  - Assets
  - Clones
    - Implants
  - Contacts
  - Contracts
  - Corporation History
  - Location and Active Ship
  - Loyalty Points
  - Markets
  - Mining Ledger
  - Notifications
  - Roles
  - Skills
    - List
    - Queue
    - Audit/Export
  - Standings
  - Wallet
    - Activity Analysis
  - At a Glance of all above data across all characters on a members

- Corp Audit

  - Wallets
  - Structures
    - Fuel Dashboard
    - Metenox Dashboard
    - Jump Bridge Dashboard
    - Sov Dashboard
  - Assets

- [Sec Group](https://github.com/Solar-Helix-Independent-Transport/allianceauth-secure-groups) Filters
  - Assets
    - Location
    - Type
    - Group
  - Audit Fully Loaded
  - Corporate Roles
  - Corporate Title
  - Highest SP on Account
  - Home Station / Death Clone Location
  - Jump Clone Location
  - Last Login
  - Main time in corp
  - Skill List
  - Current Ship

## Contributors

Thankyou to all our [contributors](https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools/graphs/contributors)!

Please consider helping with [Translations](https://app.transifex.com/alliance-auth/allianceauth-corp-tools/dashboard/)!

![contributors](https://contrib.rocks/image?repo=Solar-Helix-Independent-Transport/allianceauth-corp-tools)

## Installation

### Bare Metal

1.  Install the application `pip install -U allianceauth-corptools`
1.  Add `'corptools',` to your `INSTALLED_APPS` in your projects `local.py`
1.  run migrations, collectstatic and restart auth
1.  run the corp tools setup managemnt command `python manage.py ct_setup`
1.  Continue with the Common section

### Docker

1.  add the application to your `conf/requirments.txt` `allianceauth-corptools==2.8.10`
1.  Add `'corptools',` to your `INSTALLED_APPS` in your projects `conf/local.py`
1.  Build auth, and restart your containers
1.  enter a container `docker compose exec allianceauth_gunicorn bash` and run migrations, collectstatic, and configure corptools.
    - `auth collectstatic`
    - `auth migrate`
    - `auth ct_setup`
1.  Continue with the Common section

### Common

1.  setup your perms as documented below
1.  add characters and corp tokens as required.

## Usage

### adjusting automatic updates

This will show how to setup/modify daily updates.

Currently this is:

- 2 times an hour ( minute 15, and 45) 1/48th of the total character updates, for at worst 1 update per character per day
- Corp update run on all corps hourly at minute 30

1. Got Audit Admin `https://your.url/audit/admin/`
1. Click `Create or Update Periodic Tasks`
1. you can edit the schedules to work more inline with your group as required in auth admin periodic tasks

## Permissions

There are some basic access perms

All permissions are filtered by main character, if a person has neutral alts loaded they will also be visible to someone who can see their main.

### Character

| Perm                | Admin Site | Perm                                                                         | Description                                            |
| ------------------- | ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| view_characteraudit | nill       | Can view character audit.                                                    | Generic Access perm to show the Member Audit Menu item |
| global_hr           | nill       | Can access other character's data for characters in any corp/alliance/state. | Superuser level access                                 |
| alliance_hr         | nill       | Can access other character's data for own alliance.                          | Alliance only level access                             |
| corp_hr             | nill       | Can access other character's data for own corp.                              | Own Corp restricted level access                       |

### Corporate

| Perm                    | Admin Site | Perm                                                                         | Description                        |
| ----------------------- | ---------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| global_corp_manager     | nill       | Can access other character's data for characters in any corp/alliance/state. | Superuser level access             |
| alliance_corp_manager   | nill       | Can access other character's data for own alliance.                          | Alliance only level access         |
| own_corp_manager        | nill       | Can access other character's data for own corp.                              | Own Corp restricted level access   |
| holding_corp_structures | nill       | Can access configured holding corp structure data.                           | Holding Corp Structure data access |
| holding_corp_wallets    | nill       | Can access configured holding corp wallet data.                              | Holding Corp Structure data access |
| holding_corp_assets     | nill       | Can access configured holding corp asset data.                               | Holding Corp Structure data access |

Note: Configure the "Holding Corps" in the `Corptools Configuration` Admin Model. via the auth admin interface.

## Settings

### Modules

Each section of the character audit can be enabled and disabled via settings in your `local.py`

- `True` Enables the module
- `False` Disables the Module

You can also exclude section of hte updates from the "Active" metric, this is handy should you wish to add a module and not have everyone be marked as "Inactive" in the audit module. or if CCP is having issues with part of the ESI. _Looks at Assets_

- `True` Masks the section in the active calculation
- `False` Enforces the section in the active calculation

To assist with auth related tasks we request `publicData` on top of the configured set.

| Module                    | Enable Setting (Default)                 | Active Setting (Default)                               | Description                                     | Scopes Requested                                                                                                           | Note                                  |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Assets                    | `CT_CHAR_ASSETS_MODULE` (`True`)         | `CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE` (`False`)        | Character Assets                                | 'esi-assets.read_assets.v1'                                                                                                | Fully enabled with a Sec Group Filter |
| Standings                 | `CT_CHAR_STANDINGS_MODULE` (`True`)      | `CT_CHAR_ACTIVE_IGNORE_STANDINGS_MODULE` (`False`)     | Character NPC Standings                         | 'esi-characters.read_standings.v1'                                                                                         | Fully enabled                         |
| Killmails                 | `CT_CHAR_KILLMAILS_MODULE` (`True`)      | `CT_CHAR_ACTIVE_IGNORE_KILLMAILS_MODULE` (`False`)     | Character Killmails                             | 'esi-killmails.read_killmails.v1'                                                                                          | Future Version                        |
| Fittings                  | `CT_CHAR_FITTINGS_MODULE` (`True`)       | `CT_CHAR_ACTIVE_IGNORE_FITTINGS_MODULE` (`False`)      | Character Fittings                              | 'esi-fittings.read_fittings.v1'                                                                                            | Future Version                        |
| Calendar                  | `CT_CHAR_CALENDAR_MODULE` (`True`)       | `CT_CHAR_ACTIVE_IGNORE_CALENDAR_MODULE` (`False`)      | Character Killmails                             | 'esi-calendar.read_calendar_events.v1'                                                                                     | Future Version                        |
| Contacts                  | `CT_CHAR_CONTACTS_MODULE` (`True`)       | `CT_CHAR_ACTIVE_IGNORE_CONTACTS_MODULE` (`False`)      | Character Contacts                              | 'esi-characters.read_contacts.v1'                                                                                          | Fully enabled                         |
| Notifications             | `CT_CHAR_NOTIFICATIONS_MODULE` (`True`)  | `CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE` (`False`) | Character Notifications                         | 'esi-characters.read_notifications.v1'                                                                                     | Fully enabled                         |
| Roles                     | `CT_CHAR_ROLES_MODULE` (`True`)          | `CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE` (`False`)         | Character Roles and Titles                      | 'esi-characters.read_titles.v1', 'esi-characters.read_corporation_roles.v1'                                                | Fully enabled with a Sec Group Filter |
| Industry                  | `CT_CHAR_INDUSTRY_MODULE` (`True`)       | `CT_CHAR_ACTIVE_IGNORE_INDUSTRY_MODULE` (`False`)      | Character Indy Jobs                             | 'esi-industry.read_character_jobs.v1'                                                                                      | Fully enabled                         |
| Mining                    | `CT_CHAR_MINING_MODULE` (`True`)         | `CT_CHAR_ACTIVE_IGNORE_MINING_MODULE` (`False`)        | Character Mining Ledgers                        | 'esi-industry.read_character_mining.v1'                                                                                    | Future Version                        |
| Wallets/Markets/Contracts | `CT_CHAR_WALLET_MODULE` (`True`)         | `CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE` (`False`)        | Character Wallets, Contracts and Trading/Orders | 'esi-markets.read_character_orders.v1', 'esi-wallet.read_character_wallet.v1', 'esi-contracts.read_character_contracts.v1' | Fully Enabled                         |
| Skills                    | `CT_CHAR_SKILLS_MODULE` (`True`)         | `CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE` (`False`)        | Character Skills/Queues and Doctrine Tools      | 'esi-skills.read_skillqueue.v1','esi-skills.read_skills.v1'                                                                | Fully Enabled with Sec Group Filters  |
| Clones                    | `CT_CHAR_CLONES_MODULE` (`True`)         | `CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE` (`False`)        | Character Medical and Jump Clone Module         | 'esi-clones.read_implants.v1', 'esi-clones.read_clones.v1'                                                                 | Fully Enabled with a Sec Group Filter |
| Fleet                     | `CT_CHAR_FLEET_MODULE` (`True`)          | nill                                                   | Character Fleet Tools                           | 'esi-fleets.read_fleet.v1', 'esi-fleets.write_fleet.v1`                                                                    | Future Version                        |
| Mail                      | `CT_CHAR_MAIL_MODULE` (`False`)          | `CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE` (`False`)          | Character Mail Views                            | 'esi-mail.read_mail.v1`                                                                                                    | Fully Enabled                         |
| Helpers                   | `CT_CHAR_HELPER_MODULE` (`False`)        | `CT_CHAR_ACTIVE_IGNORE_HELPER_MODULE` (`False`)        | Character Helpers                               | 'esi-ui.open_window.v1','esi-ui.write_waypoint.v1'                                                                         | Future Versions                       |
| Opportunities             | `CT_CHAR_OPPORTUNITIES` (`False`)        | nill                                                   | Character Opportunities                         | 'esi-characters.read_opportunities.v1'                                                                                     | Future Versions                       |
| Loyalty Points            | `CT_CHAR_LOYALTYPOINTS_MODULE` (`False`) | `CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE` (`True`)  | Character LP                                    | 'esi-characters.read_loyalty.v1'                                                                                           | Fully Enabled                         |

### Extra Scopes

If `Assets`, `Clones`, `Wallets` or `Minning` are enabled these extra scopes are requested:

- 'esi-universe.read_structures.v1'
- 'esi-search.search_structures.v1'

this is to be able to lookup location names.

### Other Settings

| Setting                      | Default                                              | Description                                                                                                                                                  |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CT_CHAR_MAX_INACTIVE_DAYS`  | 3                                                    | Days till data is considered Stale                                                                                                                           |
| `CORPTOOLS_DISCORD_BOT_COGS` | `["corptools.cogs.routes", "corptools.cogs.locate"]` | Discord bot cogs to enable/disable                                                                                                                           |
| `CORPTOOLS_GUEST_HR_STATES`  | `["Guest"]`                                          | Configurable list of states considered valid for `guest_hr` permission to see.                                                                               |
| `CT_PAGINATION_SIZE`         | 30000                                                | Max items per page of data in the UI                                                                                                                         |
| `CT_USERS_CAN_FORCE_REFRESH` | False                                                | Set to `True` to force cache invalidation on a regular user requesting updates from the UI. Superusers will always cache invalidate on requesting an update. |

### Custom ESI Scopes

You can add arbitrary ESI scopes to character or corporation token requests using these settings:

```python
# Add extra scopes to character token requests
CT_EXTRA_CHARACTER_SCOPES = [
    'esi-custom-scope.v1',
]

# Add extra scopes to corporation token requests
CT_EXTRA_CORPORATION_SCOPES = [
    'esi-corp-custom.v1',
]
```

Both default to empty lists.

## Contributing

Make sure you have signed the [License Agreement](https://developers.eveonline.com/resource/license-agreement) by logging in at https://developers.eveonline.com before submitting any pull requests. All bug fixes or features must not include extra superfluous formatting changes.
