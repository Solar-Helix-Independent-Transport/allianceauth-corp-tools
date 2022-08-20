from django.apps import AppConfig

from . import __version__


class CorpToolsConfig(AppConfig):
    name = 'corptools'
    label = 'corptools'

    verbose_name = f"Corp Tools v{__version__}"
