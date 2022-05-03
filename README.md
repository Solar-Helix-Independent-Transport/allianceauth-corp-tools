# CorpTools

[![CI](https://github.com/pvyParts/allianceauth-corp-tools/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/pvyParts/allianceauth-corp-tools/actions/workflows/main.yml) [![PyPI version](https://badge.fury.io/py/allianceauth-corptools.svg)](https://badge.fury.io/py/allianceauth-corptools) ![Discord](https://img.shields.io/discord/399006117012832262?label=Support%20Server)

### Lightweight Toolbox of Bits and bobs for todays Eve Group on the go!

This module is the core of the CorpTools Ecosystem, this includes;

- [Invoices](https://github.com/Solar-Helix-Independent-Transport/allianceauth-invoice-manager): Automatic tracking of payments made to a holding wallet.
- [Moons](https://github.com/pvyParts/allianceauth-corp-tools-moons): Moon Mining tracking and Tax system.
- [Indy Dash](https://github.com/pvyParts/allianceauth-corp-tools-indy-dash): What Industrial structures have what rigs and where are they.
- [Pinger](https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools-pinger): High performance pings from the notification endpoint, using the data avaialbe from character audit.

Included `Bits and Bobs`:

- Character Audit

  - Assets
  - Roles
  - Contacts
  - Notifications
  - Standings
  - Markets
  - Skills
    - List
    - Queue
    - Audit/Export
  - Wallet
    - Activity Analysis
  - History
  - Clones
    - Implants

- Corp Audit

  - Wallets
  - Structures
  - Assets

- [Sec Group](https://github.com/Solar-Helix-Independent-Transport/allianceauth-secure-groups) Filters
  - Audit Fully Loaded
  - Assets
    - Location
    - Type
    - Group
  - Skill List
  - Corporate Roles
  - Corporate Title
  - Main time in corp

Active Devs:

- [AaronKable](https://github.com/pvyParts)

## Installation

1.  Install the Repo from git `pip install -U git+https://github.com/pvyParts/allianceauth-corp-tools.git`
2.  Add `'corptools',` to your `INSTALLED_APPS` in your projects `local.py`
3.  run migrations, collectstatic and restart auth
4.  setup your perms as documented below
5.  add characters and corp tokens as required.
6.  Setup update tasks if you wish for the data to be auto updated. See Usage Below.

## Set Corp Tools Name

Add the below lines to your `local.py` settings file, Changing the contexts to yours.

You can optionally se the name of the app in the ui by setting this setting

```python
## name for Corp Tools
CORPTOOLS_APP_NAME = "Character Audit"
```

## Usage

### Seting up automatic updates

This will show how to do daily updates.

Currently this is:

- 2 times an hour ( minute 15, and 45) 1/48th of the total character updates, for at worst 1 update per character per day
- Corp update run on all corps hourly at minute 30

1. Got Audit Admin
2. Click `Create or Update Periodic Tasks`
3. you can edit the schedules to work more inline with your group as required.

## Permissions

There are some basic access perms

All permissions are filtered by main character, if a person has neutral alts loaded they will also be visible to someone who can see their main.

| Perm                | Admin Site | Perm                                                                         | Description                                            |
| ------------------- | ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| view_characteraudit | nill       | Can view character audit.                                                    | Generic Access perm to show the Member Audit Menu item |
| global_hr           | nill       | Can access other character's data for characters in any corp/alliance/state. | Superuser level access                                 |
| alliance_hr         | nill       | Can access other character's data for own alliance.                          | Alliance only level access                             |
| corp_hr             | nill       | Can access other character's data for own corp.                              | Corp restricted level access                           |

## Contributing

Make sure you have signed the [License Agreement](https://developers.eveonline.com/resource/license-agreement) by logging in at https://developers.eveonline.com before submitting any pull requests. All bug fixes or features must not include extra superfluous formatting changes.
