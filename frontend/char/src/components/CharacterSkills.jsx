import ErrorBoundary from "./ErrorBoundary";
import { FilterFail } from "./FilterFail";
import { SkillGroup } from "./skills/SkillGroup";
import React from "react";

const CharSkillBlocks = ({ data }) => {
  const groupByKey = (list, key) =>
    list.reduce(
      (hash, obj) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      }),
      {}
    );

  let skills_data = groupByKey(data, "group");

  if (Object.entries(skills_data).length === 0) {
    return <FilterFail />;
  }

  return (
    <ErrorBoundary>
      {Object.entries(skills_data)
        .sort(function (a, b) {
          var nameA = a[0].toLowerCase(),
            nameB = b[0].toLowerCase();
          if (nameA < nameB)
            //sort string ascending
            return -1;
          if (nameA > nameB) return 1;
          return 0; //default return value (no sorting)
        })
        .map((entry) => (
          <SkillGroup group={entry[0]} skills={entry[1]} />
        ))}
    </ErrorBoundary>
  );
};

export default CharSkillBlocks;
