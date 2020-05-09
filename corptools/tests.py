from unittest import mock

from django.test import TestCase
from django.utils.timezone import now
from allianceauth.tests.auth_utils import AuthUtils
from allianceauth.eveonline.models import EveCorporationInfo, EveAllianceInfo, EveCharacter
from esi.models import Token
from django.contrib.auth.models import User, Permission
from allianceauth.authentication.models import CharacterOwnership

#some tests... 