# CorpTools
### Asorted Toolbox of Bits and bobs for todays Corp on the go!

[![Coverage Status](https://coveralls.io/repos/github/pvyParts/allianceauth-corp-tools/badge.svg?branch=master)](https://coveralls.io/github/pvyParts/allianceauth-corp-tools?branch=master) [![Build Status](https://travis-ci.com/pvyParts/allianceauth-corp-tools.svg?branch=master)](https://travis-ci.com/pvyParts/allianceauth-corp-tools)


Corp Toolbox module for [AllianceAuth](https://gitlab.com/allianceauth/allianceauth) with speed and functionality in mind. 

Included `Bits and Bobs`:
 * Basic Member Audit
   * Skills
     * Queue
     * Basic planning against fittings
   * Wallet
     * radar graphs of activity.
   * Assets
   * Clones
     * With Implants
 * Corp Audit
   * Assets
   * Wallet
     * Breakdown of some helpfull stats
       * isk in vs isk out.
       * radar graphs of corp activity.
   * Structure
     * Fuel and Attack Pings.
     * Fittings.
   * Moons Tracking
     * Frac Pings.
     * Moon Tax System.
       * Basic System for taxing moons a % of refined value.
 
Active Devs:
 * [AaronKable](https://github.com/pvyParts)
 
## Installation
 1. Install the Repo `pip install allianceauth-corptools`
 2. Add `'corptools',` to your `INSTALLED_APPS` in your projects `local.py`
 3. run migrations and restart auth
 4. run the `manage.py setup_corptools_db` to initialize the DB models and fire off the initial update tasks.
 5. setup your perms as documented below
 6. add characters and corp tokens.
 7. prepare for pingagedon.

## Permissions
If you are coming fromn the inbuilt module simply replace your perms from `corputils` with the matching `corpstats` perm

 Perm | Admin Site	 | Auth Site 
 --- | --- | --- 
``` not yet ```

## Usage
``` not yet ```

## Contributing
Make sure you have signed the [License Agreement](https://developers.eveonline.com/resource/license-agreement) by logging in at https://developers.eveonline.com before submitting any pull requests.
