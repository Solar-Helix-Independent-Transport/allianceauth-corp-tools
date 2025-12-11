import json
import logging

from django.db import models

logger = logging.getLogger(__name__)


class JSONModel(models.Model):
    _filename = "not_set.jsonl"
    _update_fields = False

    @classmethod
    def from_jsonl(cls, json_data, name_lookup=False):
        raise AttributeError("Not Implemented")

    @classmethod
    def name_lookup(cls):
        return False

    @classmethod
    def create_update(cls, create_model_list: list["JSONModel"], update_model_list: list["JSONModel"]):
        cls.objects.bulk_create(
            create_model_list,
            ignore_conflicts=True
        )
        if cls._update_fields:
            cls.objects.bulk_update(
                update_model_list,
                cls._update_fields
            )

    @classmethod
    def load_from_sde(cls, folder_name):
        _creates = []
        _updates = []
        name_lookup = cls.name_lookup()
        pks = set(cls.objects.all().values_list("pk", flat=True)
                  ) if cls._update_fields else False
        file_path = f"{folder_name}/{cls._filename}"

        total_lines = 0
        with open(file_path, 'r') as json_file:
            while _ := json_file.readline():
                total_lines += 1

        total_read = 0
        with open(file_path, 'r') as json_file:
            while line := json_file.readline():
                rg = json.loads(line)
                _new = cls.from_jsonl(rg, name_lookup)
                if isinstance(_new, list):
                    if pks:
                        for _i in _new:
                            if _i.pk in pks:
                                _updates.append(_new)
                            else:
                                _creates.append(_new)
                    else:
                        _creates += _new
                else:
                    if pks:
                        if _new.pk in pks:
                            _updates.append(_new)
                        else:
                            _creates.append(_new)
                    else:
                        _creates.append(_new)

                total_read += 1

                if (len(_creates)+len(_updates)) >= 5000:
                    # lets batch these to reduce memory overhead
                    logger.info(
                        f"{file_path} - {int(total_read/total_lines*100)}% - {total_read}/{total_lines} Lines")
                    cls.create_update(_creates, _updates)
                    _creates = []
                    _updates = []

            # create/update any that are left.
            logger.info(
                f"{file_path} - {int(total_read/total_lines*100)}% - {total_read}/{total_lines} Lines")
            cls.create_update(_creates, _updates)

    class Meta:
        abstract = True
