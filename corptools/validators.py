import json

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def valid_json(value):
    try:
        json.loads(value)
    except Exception:
        raise ValidationError(
            _('This is not valid JSON, please check it and try again.'))
