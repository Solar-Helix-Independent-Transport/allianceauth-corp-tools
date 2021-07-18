# CorpTools
### Assorted Toolbox of Bits and bobs for todays Corp/Alliance on the go!

Corp Toolbox module for [AllianceAuth](https://gitlab.com/allianceauth/allianceauth) with speed and functionality in mind.

Included `Bits and Bobs`:
 * Basic Member Audit
   * Asset location Filters
   * Market Orders
   * Skills
     * Queue
     * Basic audit against fittings.
   * Wallet
     * radar graphs of activity.
   * Assets
   * Clones
     * With Implants
 * Corp Audit
   * Wallets
 * JB Route tool, push to AutoPilot, (API no front end)

Planned `Bits and Bobs`:
 * Member Audit:
   * Industry Jobs
   * Contracts
   * Fleet Tools
     * Snapshots
     * Fatigue bot integration
 * Corp Audit
   * Structures and fits
   * Assets
 * Smart Groups
   * eg:
     * Director Groups require director role in game
     * Super group requires hull and fit as well as skill set
 * JB Route tool, push to AutoPilot

Active Devs:
 * [AaronKable](https://github.com/pvyParts)

## Installation
 1. Install the Repo from git `pip install -U git+https://github.com/pvyParts/allianceauth-corp-tools.git`
 2. Add `'corptools',` to your `INSTALLED_APPS` in your projects `local.py`
 3. run migrations and restart auth
 4. run the `myauth/manage.py setup_corptools_models` to initialize the DB models and fire off the initial update tasks.
 5. setup your perms as documented below
 6. add characters and corp tokens as required.
 7. Setup update tasks if you wish for the data to be auto updated. See Usage Below.

## Permissions
There are some basic access perms

Admin perms are filtered by main character, if a person has neutral alts loaded they will also be visible to someone who can see their main.

 Perm | Admin Site	 | Perm | Description
 --- | --- | --- | ---
view_characteraudit | nill | Can view character audit. | Generic Access perm to show the Member Audit Menu item
global_hr | nill | Can access other character's data for characters in any corp/alliance/state. | Superuser level access
alliance_hr | nill | Can access other character's data for own alliance. | Alliance only level access
corp_hr | nill | Can access other character's data for own corp. | Corp restricted level access


## Usage
### Seting up automatic updates
This will show how to do daily updates.

Currently this is:
 * 2 times an hour ( minute 15, and 45) 1/48th of the total character updates, for at worst 1 update per character per day
 * 1 update run on all corps daily at 12:30

1. Got Audit Admin
2. Click `Create or Update Periodic Tasks`
2. Job Done

## Contributing
Make sure you have signed the [License Agreement](https://developers.eveonline.com/resource/license-agreement) by logging in at https://developers.eveonline.com before submitting any pull requests. All bug fixes or features must not include extra superfluous formatting changes.
