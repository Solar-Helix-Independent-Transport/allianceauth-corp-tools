# CorpTools
### Asorted Toolbox of Bits and bobs for todays Corp on the go!

[![Coverage Status](https://coveralls.io/repos/github/pvyParts/allianceauth-corp-tools/badge.svg?branch=master)](https://coveralls.io/github/pvyParts/allianceauth-corp-tools?branch=master) [![Build Status](https://travis-ci.com/pvyParts/allianceauth-corp-tools.svg?branch=master)](https://travis-ci.com/pvyParts/allianceauth-corp-tools)


Corp Toolbox module for [AllianceAuth](https://gitlab.com/allianceauth/allianceauth) with speed and functionality in mind. 

Included `Bits and Bobs`:
 * Basic Member Audit
   * Skills
     * Queue
     * Basic planning against fittings.
   * Wallet
     * radar graphs of activity.
   * Assets
   * Clones
     * With Implants
 * Corp Audit
   * **Soon** (tm)

Active Devs:
 * [AaronKable](https://github.com/pvyParts)
 
## Installation
 1. Install the Repo `pip install allianceauth-corptools`
 2. Add `'corptools',` to your `INSTALLED_APPS` in your projects `local.py`
 3. run migrations and restart auth
 4. run the `manage.py setup_corptools_db` to initialize the DB models and fire off the initial update tasks.
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
This will show how to do daily updates. If you poll faster than an endpoints cache expiry the tasks will not run until the cache expires.

1. In Django Admin select periodic tasks
2. Click Add New
3. Se the name to Something meaning full "Corp Tools Update All"
4. Pick `corptools.tasks.update_all_characters`from the task drop down
5. Ensure Enabled is checked
6. Click The green arrow inline with the crontab schedule to add a new cron.
6. Set the cron to: Minutes `0`, Hours `0`, rest leave as `*` this will run the updates every day at GMT 0000 (Or set it to what ever timer you like)
7. Click Save on the cron window.
8. Click save on The Periodic task.

## Contributing
Make sure you have signed the [License Agreement](https://developers.eveonline.com/resource/license-agreement) by logging in at https://developers.eveonline.com before submitting any pull requests. All bug fixes or features must not include extra superfluous formatting changes.
