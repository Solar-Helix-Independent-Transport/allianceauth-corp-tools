-- Drop all corptools tables and reset migration history
-- Run this when migrations are irreversible and you need a clean slate.
-- After running this, execute: python manage.py migrate corptools

SET FOREIGN_KEY_CHECKS = 0;

-- M2M join tables
DROP TABLE IF EXISTS corptools_mailmessage_labels;
DROP TABLE IF EXISTS corptools_mailmessage_recipients;
DROP TABLE IF EXISTS corptools_characterroles_titles;
DROP TABLE IF EXISTS corptools_skillfilter_required_skill_lists;
DROP TABLE IF EXISTS corptools_skillfilter_single_req_skill_lists;
DROP TABLE IF EXISTS corptools_assetsfilter_systems;
DROP TABLE IF EXISTS corptools_assetsfilter_categories;
DROP TABLE IF EXISTS corptools_assetsfilter_constellations;
DROP TABLE IF EXISTS corptools_assetsfilter_groups;
DROP TABLE IF EXISTS corptools_assetsfilter_regions;
DROP TABLE IF EXISTS corptools_assetsfilter_types;
DROP TABLE IF EXISTS corptools_corporationcontact_labels;
DROP TABLE IF EXISTS corptools_charactercontact_labels;
DROP TABLE IF EXISTS corptools_corptoolsconfiguration_holding_corps;
DROP TABLE IF EXISTS corptools_currentshipfilter_constellations;
DROP TABLE IF EXISTS corptools_currentshipfilter_groups;
DROP TABLE IF EXISTS corptools_currentshipfilter_regions;
DROP TABLE IF EXISTS corptools_currentshipfilter_systems;
DROP TABLE IF EXISTS corptools_currentshipfilter_types;
DROP TABLE IF EXISTS corptools_homestationfilter_evelocation;
DROP TABLE IF EXISTS corptools_jumpclonefilter_evelocation;
DROP TABLE IF EXISTS corptools_rolefilter_alliances_filter;
DROP TABLE IF EXISTS corptools_rolefilter_corps_filter;

-- Concrete model tables
DROP TABLE IF EXISTS corptools_assetcoordiante;
DROP TABLE IF EXISTS corptools_assetsfilter;
DROP TABLE IF EXISTS corptools_bridgeozonelevel;
DROP TABLE IF EXISTS corptools_charassetcoordiante;
DROP TABLE IF EXISTS corptools_characteragefilter;
DROP TABLE IF EXISTS corptools_characterasset;
DROP TABLE IF EXISTS corptools_characteraudit;
DROP TABLE IF EXISTS corptools_characterbountyevent;
DROP TABLE IF EXISTS corptools_characterbountystat;
DROP TABLE IF EXISTS corptools_charactercontact;
DROP TABLE IF EXISTS corptools_charactercontactlabel;
DROP TABLE IF EXISTS corptools_characterindustryjob;
DROP TABLE IF EXISTS corptools_characterlocation;
DROP TABLE IF EXISTS corptools_charactermarketorder;
DROP TABLE IF EXISTS corptools_characterminingledger;
DROP TABLE IF EXISTS corptools_characterroles;
DROP TABLE IF EXISTS corptools_charactertitle;
DROP TABLE IF EXISTS corptools_characterwalletjournalentry;
DROP TABLE IF EXISTS corptools_clone;
DROP TABLE IF EXISTS corptools_contract;
DROP TABLE IF EXISTS corptools_contractitem;
DROP TABLE IF EXISTS corptools_corpasset;
DROP TABLE IF EXISTS corptools_corporatecontract;
DROP TABLE IF EXISTS corptools_corporatecontractitem;
DROP TABLE IF EXISTS corptools_corporationaudit;
DROP TABLE IF EXISTS corptools_corporationcontact;
DROP TABLE IF EXISTS corptools_corporationcontactlabel;
DROP TABLE IF EXISTS corptools_corporationhistory;
DROP TABLE IF EXISTS corptools_corporationindustryjob;
DROP TABLE IF EXISTS corptools_corporationmarketorder;
DROP TABLE IF EXISTS corptools_corporationwalletdivision;
DROP TABLE IF EXISTS corptools_corporationwalletjournalentry;
DROP TABLE IF EXISTS corptools_corptoolsconfiguration;
DROP TABLE IF EXISTS corptools_currentshipfilter;
DROP TABLE IF EXISTS corptools_eveitemcategory;
DROP TABLE IF EXISTS corptools_eveitemdogmaattribute;
DROP TABLE IF EXISTS corptools_eveitemgroup;
DROP TABLE IF EXISTS corptools_eveitemtype;
DROP TABLE IF EXISTS corptools_evelocation;
DROP TABLE IF EXISTS corptools_evename;
DROP TABLE IF EXISTS corptools_fullyloadedfilter;
DROP TABLE IF EXISTS corptools_highestspfilter;
DROP TABLE IF EXISTS corptools_homestationfilter;
DROP TABLE IF EXISTS corptools_implant;
DROP TABLE IF EXISTS corptools_invtypematerials;
DROP TABLE IF EXISTS corptools_jumpclone;
DROP TABLE IF EXISTS corptools_jumpclonefilter;
DROP TABLE IF EXISTS corptools_lastloginfilter;
DROP TABLE IF EXISTS corptools_loyaltypoint;
DROP TABLE IF EXISTS corptools_maillabel;
DROP TABLE IF EXISTS corptools_mailmessage;
DROP TABLE IF EXISTS corptools_mailrecipient;
DROP TABLE IF EXISTS corptools_mapconstellation;
DROP TABLE IF EXISTS corptools_mapjumpbridge;
DROP TABLE IF EXISTS corptools_mapregion;
DROP TABLE IF EXISTS corptools_mapsystem;
DROP TABLE IF EXISTS corptools_mapsystemgate;
DROP TABLE IF EXISTS corptools_mapsystemmoon;
DROP TABLE IF EXISTS corptools_mapsystemplanet;
DROP TABLE IF EXISTS corptools_notification;
DROP TABLE IF EXISTS corptools_notificationtext;
DROP TABLE IF EXISTS corptools_oretax;
DROP TABLE IF EXISTS corptools_oretaxrates;
DROP TABLE IF EXISTS corptools_poco;
DROP TABLE IF EXISTS corptools_rolefilter;
DROP TABLE IF EXISTS corptools_skill;
DROP TABLE IF EXISTS corptools_skilllist;
DROP TABLE IF EXISTS corptools_skillqueue;
DROP TABLE IF EXISTS corptools_skilltotalhistory;
DROP TABLE IF EXISTS corptools_skilltotals;
DROP TABLE IF EXISTS corptools_skillfilter;
DROP TABLE IF EXISTS corptools_sovereigntyhub;
DROP TABLE IF EXISTS corptools_sovereigntyhubreagent;
DROP TABLE IF EXISTS corptools_sovereigntyhubupgrade;
DROP TABLE IF EXISTS corptools_starbase;
DROP TABLE IF EXISTS corptools_structure;
DROP TABLE IF EXISTS corptools_structurecelestial;
DROP TABLE IF EXISTS corptools_structureservice;
DROP TABLE IF EXISTS corptools_timeincorpfilter;
DROP TABLE IF EXISTS corptools_titlefilter;
DROP TABLE IF EXISTS corptools_typeprice;

SET FOREIGN_KEY_CHECKS = 1;

-- Clear migration history so Django will re-apply from scratch
DELETE FROM django_migrations WHERE app = 'corptools';
