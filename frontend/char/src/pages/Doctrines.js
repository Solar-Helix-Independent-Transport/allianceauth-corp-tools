import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import ErrorBoundary from "../components/ErrorBoundary";
import CharSkillBlocks from "../components/CharacterSkills";
import { loadSkills } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import { useQuery } from "react-query";
import { TextFilter } from "../components/TextFilter";
import { SelectFilter } from "../components/SelectFilter";

const CharSkills = ({ character_id }) => {
  const [char_id, setCharacter] = useState(character_id);
  const [group_filter, setGroup] = useState("All");
  const [skill_filter, setFilter] = useState("");
  const [level_filter, setLevel] = useState(-1);

  const { isLoading, error, data } = useQuery(["skills", character_id], () =>
    loadSkills(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  if (char_id === 0) {
    setCharacter(data[0].character.character_id);
    return <PanelLoader />;
  } else {
    let char_data = data.filter(
      (obj) => obj.character.character_id === parseInt(char_id)
    );

    let skill_data = char_data[0].skills;

    if (group_filter !== "" && group_filter !== "All") {
      skill_data = skill_data.filter((o) =>
        o.group.toLowerCase().includes(group_filter.toLowerCase())
      );
    }

    if (level_filter >= 0) {
      skill_data = skill_data.filter((o) => o.level === level_filter);
    }

    if (skill_filter !== "") {
      skill_data = skill_data.filter((o) =>
        o.skill.toLowerCase().includes(skill_filter.toLowerCase())
      );
    }
    let charOptions = data.map((char) => {
      return {
        value: char.character.character_id,
        label: char.character.character_name,
      };
    });

    const levelOptions = [
      {
        value: -1,
        label: "All",
      },
      {
        value: 0,
        label: "0",
      },
      {
        value: 1,
        label: "1",
      },
      {
        value: 2,
        label: "2",
      },
      {
        value: 3,
        label: "3",
      },
      {
        value: 4,
        label: "4",
      },
      {
        value: 5,
        label: "5",
      },
    ];

    let groupOptions = new Set();

    char_data[0].skills.forEach((skill) => {
      groupOptions.add(skill.group);
    });

    groupOptions = [{ value: "All", label: "All" }].concat(
      [...groupOptions.values()].sort().map((grp) => {
        return {
          value: grp,
          label: grp,
        };
      })
    );

    return (
      <ErrorBoundary>
        <Panel.Body className="flex-container-vert-fill">
          <SelectFilter
            setFilter={setCharacter}
            options={charOptions}
            labelText="Character Select:"
          />
          <div className="flex-container">
            <SelectFilter
              setFilter={setLevel}
              options={levelOptions}
              labelText="Level Filter:"
            />
            <SelectFilter
              setFilter={setGroup}
              options={groupOptions}
              labelText="Group Filter:"
            />
            <TextFilter setFilterText={setFilter} labelText={"Skill Filter:"} />
          </div>

          <CharSkillBlocks data={skill_data} />
        </Panel.Body>
      </ErrorBoundary>
    );
  }
};

export default CharSkills;
