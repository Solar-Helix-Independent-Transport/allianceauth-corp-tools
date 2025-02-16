import { useTranslation } from "react-i18next";
import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";
import { SelectFilter } from "../../Components/Helpers/SelectFilter";
import { TextFilter } from "../../Components/Helpers/TextFilter";
import { ErrorLoader, PanelLoader } from "../../Components/Loaders/loaders";
import CharSkillGroups from "../../Components/Skills/CharacterSkills";
import { getCharacterSkills } from "../../api/character";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterSkills = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [char_id, setCharacter] = useState(characterID);
  const [group_filter, setGroup] = useState("All");
  const [skill_filter, setFilter] = useState("");
  const [level_filter, setLevel] = useState(-1);

  const { isLoading, error, data } = useQuery(
    ["skills", characterID],
    () => getCharacterSkills(characterID ? Number(characterID) : 0),
    { refetchOnWindowFocus: false },
  );

  if (isLoading) return <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />;

  if (error) return <ErrorLoader />;

  if (char_id === "0") {
    setCharacter(data[0].character.character_id);
    return <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />;
  } else {
    const char_data = data.filter(
      (obj: any) => obj.character.character_id === Number(char_id ? char_id : 0),
    );

    let skill_data = char_data?.[0]?.skills;

    if (group_filter !== "" && group_filter !== "All") {
      skill_data = skill_data?.filter((o: any) =>
        o.group.toLowerCase().includes(group_filter.toLowerCase()),
      );
    }

    if (level_filter >= 0) {
      skill_data = skill_data?.filter((o: any) => o.level === level_filter);
    }

    if (skill_filter !== "") {
      skill_data = skill_data?.filter((o: any) =>
        o.skill.toLowerCase().includes(skill_filter.toLowerCase()),
      );
    }
    const charOptions = data.map((char: any) => {
      return {
        value: char.character.character_id,
        label: char.character.character_name,
      };
    });

    const levelOptions = [
      {
        value: -1,
        label: t("All"),
      },
      {
        value: 0,
        label: t("0"),
      },
      {
        value: 1,
        label: t("1"),
      },
      {
        value: 2,
        label: t("2"),
      },
      {
        value: 3,
        label: t("3"),
      },
      {
        value: 4,
        label: t("4"),
      },
      {
        value: 5,
        label: t("5"),
      },
    ];

    const groupOptions = new Set();

    char_data?.[0]?.skills?.forEach((skill: any) => {
      groupOptions.add(skill.group);
    });

    const groups = [{ value: "All", label: "All" }].concat(
      [...groupOptions.values()].sort().map((grp: any) => {
        return {
          value: grp,
          label: grp,
        };
      }),
    );

    return (
      <ErrorBoundary>
        <SelectFilter
          setFilter={setCharacter}
          options={charOptions}
          labelText={t("Character Select:")}
        />
        <div className="d-flex justify-content-between mb-3">
          <SelectFilter
            setFilter={setLevel}
            options={levelOptions}
            labelText={t("Level Filter:")}
          />
          <SelectFilter setFilter={setGroup} options={groups} labelText={t("Group Filter:")} />
          <TextFilter setFilterText={setFilter} labelText={t("Skill Filter:")} />
        </div>

        <CharSkillGroups data={skill_data} />
      </ErrorBoundary>
    );
  }
};

export default CharacterSkills;
