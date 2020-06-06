from esi.clients import EsiClientProvider

class CorpToolsESIClient(EsiClientProvider):

    # TODO create provider dummy classes for use here to not have to deal with ORM model bullshit and maybe be more async?. 
    
    def _get_category(self, category_id, updates=False):
        from corptools.models import EveItemCategory

        _category = self.client.Universe.get_universe_categories_category_id(category_id=category_id).result()
        groups = _category.get('groups', [])
        category = EveItemCategory(category_id=category_id,name=_category.get('name'))

        if updates is not False:
            if category_id in updates:
                return category, False, groups
            else:
                return category, True, groups
        #category.save()
        return category

    def _get_group(self, group_id, updates=False):
        from corptools.models import EveItemGroup

        _group = self.client.Universe.get_universe_groups_group_id(group_id=group_id).result()
        eve_types = _group.get('types', [])
        group = EveItemGroup(group_id=group_id, category_id=_group.get('category_id'), name=_group.get('name'))

        if updates is not False:
            if group_id in updates:
                return group, False, eve_types
            else:
                return group, True, eve_types
        #group.save()
        return group

    def _get_eve_type(self, type_id, updates=False):
        from corptools.models import EveItemType, EveItemDogmaAttribute

        eve_type = self.client.Universe.get_universe_types_type_id(type_id=type_id).result()
        dogma = []
        if eve_type.get('dogma_attributes'):
            for d_at in eve_type.get('dogma_attributes', []):
                d_at_temp = EveItemDogmaAttribute(eve_type_id=type_id,
                                                attribute_id=d_at.get("attribute_id"),
                                                value=d_at.get('value'))
                dogma.append(d_at_temp)

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
        if updates is not False:
            if type_id in updates:
                return eve_type, False, dogma
            else:
                return eve_type, True, dogma
        #eve_type.save()
        return eve_type, dogma

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
