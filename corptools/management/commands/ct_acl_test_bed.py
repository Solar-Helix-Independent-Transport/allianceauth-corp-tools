from django.core.management.base import BaseCommand


class ACLGroup:
    """
        Basically a set split into alli/corp/character for sorting in ACLs
    """
    prefix = ""
    alliance: set
    corporation: set
    character: set

    def __init__(self, prefix: str = "") -> None:
        self.prefix = prefix
        self.alliance = set()
        self.corporation = set()
        self.character = set()

    def add(self, name, cat="character"):
        if cat == "character":
            self.character.add(name)
        if cat == "corporation":
            self.corporation.add(name)
        if cat == "alliance":
            self.alliance.add(name)

    def remove(self, name):
        if name in self.alliance:
            self.alliance.remove(name)
        if name in self.corporation:
            self.corporation.remove(name)
        if name in self.character:
            self.character.remove(name)

    def __contains__(self, key):
        return key in self.alliance or key in self.corporation or key in self.character

    def __len__(self):
        return len(self.alliance) + len(self.corporation) + len(self.character)

    def __iter__(self):
        acl_list = []
        acl_list += sorted(list(self.alliance))
        acl_list += sorted(list(self.corporation))
        acl_list += sorted(list(self.character))
        return iter(acl_list)

    def __str__(self) -> str:
        return f"{self.name}"


class ACL:
    name = "An ACL"
    members: ACLGroup
    managers: ACLGroup
    admins: ACLGroup

    def __init__(self, name: str) -> None:
        self.name = name
        self.members = ACLGroup()
        self.managers = ACLGroup()
        self.admins = ACLGroup()

    def add_to_group(self, group, name, cat="character"):
        if group == "member":
            self.members.add(name, cat=cat)
        elif group == "manager":
            self.managers.add(name, cat=cat)
        elif group == "admin":
            self.admins.add(name, cat=cat)

    def rem_from_group(self, group, name, new_group=None, cat="character"):
        if group == "member":
            self.members.remove(name)
        elif group == "manager":
            self.managers.remove(name)
        elif group == "admin":
            self.admins.remove(name)

        if new_group:
            self.add_to_group(new_group, name, cat=cat)

    def __repr__(self):
        return str(
            {
                "Admin": list(self.admins),
                "Managers": list(self.managers),
                "Members": list(self.members)
            }
        )


class Command(BaseCommand):
    help = 'Check '

    def handle(self, *args, **options):
        import re

        regex = r"^([0-9\.]{10})\s{1}([0-9\:]{8})\s{1}(.*)\s{1}(added|removed|remove|changed)\s{1}([\w\W ]{1,32})( as | to | \()(member|manager|blocked|admin)( from )?(member|manager|blocked|admin)?"

        with open('testacl.txt', 'r') as file:
            lines = file.readlines()
            # Join the lines
            content = '\n'.join(reversed(lines))

            matches = re.finditer(regex, content, re.MULTILINE)

        acl = ACL("ACL Test")
        names = []
        lookup = set()

        for matchNum, match in enumerate(matches, start=1):
            act = match.group(4)
            grp = match.group(7)
            nme = match.group(5)
            cng = match.group(9)
            names.append([act, grp, nme, cng])
            lookup.add(nme)

        from corptools.providers import esi
        lookup = esi.client.Universe.post_universe_ids(
            names=list(lookup)).results()

        corps = [i["name"]
                 for i in (lookup["corporations"] if lookup["corporations"] else [])]
        allis = [i["name"]
                 for i in (lookup["alliances"] if lookup["alliances"] else [])]
        for name in names:
            cat = "character"
            if name[2] in corps:
                cat = "corporation"
            elif name[2] in allis:
                cat = "alliance"
            if name[0] == "added":
                acl.add_to_group(name[1], name[2], cat=cat)
            elif name[0] in ["removed", "remove"]:
                acl.rem_from_group(name[1], name[2])
            elif name[0] in ["changed"]:
                acl.rem_from_group(
                    name[3], name[2], new_group=name[1], cat=cat)

        print(acl)
        print("ACL Should have ", len(acl.admins), "Admins")
        entities = sorted(list(acl.admins))
        print(list(entities))
        print("ACL Should have ", len(acl.managers), "Managers")
        entities = sorted(list(acl.managers))
        print(list(entities))
        print("ACL Should have ", len(acl.members), "Members")
        entities = sorted(list(acl.members))
        print(list(entities))
