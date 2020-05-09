from esi.providers import BaseEsiResponseClient

class CorpToolsESIClient(BaseEsiResponseClient):
    
    def _get_category(self, category_id, updates):
        from corptools.models import EveItemCategory

        category = self.client.Universe.get_universe_categories_category_id(category_id=category_id).result()
        groups = category.get('groups', [])
        category = EveItemCategory(category_id=category_id,
                        name=category.get('name'))

        if category_id in updates:
            return category, False, groups
        else:
            return False, category, groups
        return category

    def _get_group(self, group_id, updates):
        from corptools.models import EveItemGroup

        group = self.client.Universe.get_universe_groups_group_id(group_id=group_id).result()
        eve_types = group.get('types', [])
        group = EveItemGroup(group_id=group_id,
                            category_id=group.get('category_id'),
                            name=group.get('name'))

        if group_id in updates:
            return group, False, eve_types
        else:
            return False, group, eve_types
        return group

    def _get_eve_type(self, type_id, updates):
        from corptools.models import EveItemType

        eve_type = self.client.Universe.get_universe_types_type_id(type_id=type_id).result()
        eve_type = EveItemType(type_id=type_id,
                                group_id=eve_type.get('group_id'),
                                name=eve_type.get('name'),
                                description=eve_type.get('description'),
                                mass=eve_type.get('mass'),
                                packaged_volume=eve_type.get('packaged_volume'),
                                portion_size=eve_type.get('portion_size'),
                                volume=eve_type.get('volume'),
                                published=eve_type.get('published'),
                                radius=eve_type.get('radius')
                                )

        if type_id in updates:
            return eve_type, False
        else:
            return False, eve_type
        return eve_type

    def _get_region(self, region_id, updates):
        from corptools.models import MapRegion

        region = self.client.Universe.get_universe_regions_region_id(region_id=region_id).result()
        constelations = region.get('constellations', [])
        region = MapRegion(region_id=region_id,
                        name=region.get('name'),
                        description=region.get('description'))

        if region_id in updates:
            return region, False, constelations
        else:
            return False, region, constelations

    def _get_constellation(self, constellation_id, updates):
        from corptools.models import MapConstellation

        constellation = self.client.Universe.get_universe_constellations_constellation_id(constellation_id=constellation_id).result()
        systems = constellation.get('systems', [])
        constellation = MapConstellation(
                        constellation_id=constellation_id,
                        region_id=constellation.get('region_id'),
                        name=constellation.get('name'))

        if constellation_id in updates:
            return constellation, False, systems
        else:
            return False, constellation, systems

    def _get_system(self, system_id, updates):
        from corptools.models import MapSystem

        system = self.client.Universe.get_universe_systems_system_id(system_id=system_id).result()
        system = MapSystem(system_id=system_id,
                        constellation_id=system.get('constellation_id'),
                        name=system.get('name'),
                        security_class=system.get('security_class', None),
                        security_status=system.get('security_status'),
                        star_id=system.get('star_id', None),
                        x=system.get('position', {}).get('x'),
                        y=system.get('position', {}).get('y'),
                        z=system.get('position', {}).get('z'),
                        )
        if system_id in updates:
            return system, False
        else:
            return False, system


esi = CorpToolsESIClient()
