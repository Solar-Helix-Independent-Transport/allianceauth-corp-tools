import re

import networkx as nx

from django.utils import timezone

from esi.clients import EsiClientProvider

from . import __url__, __version__
from .task_helpers.skill_helpers import SkillListCache


class CorpToolsESIClient(EsiClientProvider):

    # TODO create provider dummy classes for use here to not have to deal with ORM model bullshit and maybe be more async?.

    @staticmethod
    def chunk_ids(lo, n=750):
        for i in range(0, len(lo), n):
            yield lo[i:i + n]

    def _get_category(self, category_id, updates=False):
        from corptools.models import EveItemCategory

        _category = self.client.Universe.get_universe_categories_category_id(
            category_id=category_id).result()
        groups = _category.get('groups', [])
        category = EveItemCategory(
            category_id=category_id, name=_category.get('name'))

        if updates is not False:
            if category_id in updates:
                return category, False, groups
            else:
                return category, True, groups
        # category.save()
        return category

    def _get_group(self, group_id, updates=False):
        from corptools.models import EveItemGroup

        _group = self.client.Universe.get_universe_groups_group_id(
            group_id=group_id).result()
        eve_types = _group.get('types', [])
        group = EveItemGroup(group_id=group_id, category_id=_group.get(
            'category_id'), name=_group.get('name'))

        if updates is not False:
            if group_id in updates:
                return group, False, eve_types
            else:
                return group, True, eve_types
        # group.save()
        return group

    def _get_eve_type(self, type_id, updates=False):
        from corptools.models import EveItemDogmaAttribute, EveItemType

        eve_type = self.client.Universe.get_universe_types_type_id(
            type_id=type_id).result()
        dogma = []
        if eve_type.get('dogma_attributes'):
            for d_at in eve_type.get('dogma_attributes', []):
                d_at_temp = EveItemDogmaAttribute(eve_type_id=type_id,
                                                  attribute_id=d_at.get(
                                                      "attribute_id"),
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
        # eve_type.save()
        return eve_type, dogma

    def _get_region(self, region_id, updates):
        from corptools.models import MapRegion

        region = self.client.Universe.get_universe_regions_region_id(
            region_id=region_id).result()
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

        constellation = self.client.Universe.get_universe_constellations_constellation_id(
            constellation_id=constellation_id).result()
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

        system = self.client.Universe.get_universe_systems_system_id(
            system_id=system_id).result()
        gates = system.get('stargates', None)
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
            return system, False, gates
        else:
            return False, system, gates

    def _get_moon(self, moon_id, updates):
        from corptools.models import MapSystemMoon

        moon = self.client.Universe.get_universe_moons_moon_id(
            moon_id=moon_id).result()
        moon = MapSystemMoon(moon_id=moon_id,
                             name=moon.get('name'),
                             system_id=moon.get('system_id', None),
                             x=moon.get('position', {}).get('x'),
                             y=moon.get('position', {}).get('y'),
                             z=moon.get('position', {}).get('z'),
                             )
        if updates is not False:
            if moon_id in updates:
                return moon, False
            else:
                return False, moon
        else:
            return moon

    def _get_planet(self, planet_id, updates):
        from corptools.models import MapSystemPlanet

        planet = self.client.Universe.get_universe_planets_planet_id(
            planet_id=planet_id).result()
        planet = MapSystemPlanet(planet_id=planet_id,
                                 name=planet.get('name'),
                                 system_id=planet.get('system_id', None),
                                 x=planet.get('position', {}).get('x'),
                                 y=planet.get('position', {}).get('y'),
                                 z=planet.get('position', {}).get('z'),
                                 )
        if updates is not False:
            if planet_id in updates:
                return planet, False
            else:
                return False, planet
        else:
            return planet

    def _get_stargate(self, gate_id):
        gate = self.client.Universe.get_universe_stargates_stargate_id(
            stargate_id=gate_id).result()
        return gate['system_id'], gate['destination']['system_id']


class EveRouter():
    def __init__(self):
        self.G = nx.Graph()
        self.last_update = None
        self.bridges = {}

    def bulid_graph(self):
        self.G.clear()
        # logger.debug("Graph cleared.")
        from .models import MapJumpBridge, MapSystem, MapSystemGate

        systems = MapSystem.objects.values_list('system_id', flat=True)
        gates = MapSystemGate.objects.values_list(
            'from_solar_system_id', 'to_solar_system_id')
        bridges_query = MapJumpBridge.objects.values_list(
            'from_solar_system_id', 'to_solar_system_id', 'structure_id')
        bridges = []
        bridge_ids = {}
        for b in bridges_query:
            bridge_ids[b[0]] = b[2]
            bridges.append([b[0], b[1]])
        self.G.add_nodes_from(systems)
        self.G.add_edges_from(gates, type="gate")
        self.G.add_edges_from(bridges, type="bridge")
        self.bridges = bridge_ids
        self.last_update = timezone.now()

    def route(self, source_id, destination_id):
        from .models import MapJumpBridge, MapSystem

        # logger.debug("----------")
        # logger.debug(f"Source: {source_id}")
        # logger.debug(f"Destination: {destination_id}")

        if not self.last_update:
            self.bulid_graph()
        else:
            try:
                last_update = MapJumpBridge.objects.latest("updated").updated
                if last_update > self.last_update:
                    self.bulid_graph()
            except MapJumpBridge.DoesNotExist:
                pass

        path = nx.shortest_path(self.G, source_id, destination_id)
        path_length = len(path) - 1
        systems = MapSystem.objects.filter(system_id__in=path)
        system_map = {}

        for a in systems:
            system_map[a.system_id] = a.name

        output = {}
        for i, p in enumerate(path):
            output[i] = system_map[p]

        dotlan_path = output[0].replace(" ", "_")
        message_path = "`" + output[0].replace(" ", "_") + "`"
        esi_points = []
        for i in range(len(path) - 1):
            if self.G.get_edge_data(path[i], path[i + 1])['type'] == 'bridge':
                message_path += "  >B>  `" + output[i + 1] + "`"
                bridged_path = '::' + output[i + 1].replace(" ", "_")
                dotlan_path += bridged_path
                esi_points.append(self.bridges[path[i]])
            else:
                message_path += "  >G>  `" + output[i + 1] + "`"
                gated_path = ':' + output[i + 1].replace(" ", "_")
                dotlan_path += gated_path
        dotlan_path = re.sub(r'(?<!:)(:[^:\s]+)(?=:)(?!::)', '', dotlan_path)
        esi_points.append(path[len(path) - 1])
        result = {'path': output, 'esi': esi_points, 'path_message': message_path,
                  'dotlan': dotlan_path, 'length': path_length}

        return result


esi = CorpToolsESIClient(app_info_text=f"corptools/{__version__} ({__url__})")
routes = EveRouter()
skills = SkillListCache()
