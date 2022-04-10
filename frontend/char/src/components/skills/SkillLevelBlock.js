import React from "react";

export const SkillLevelBlock = ({ level, active = -1 }) => {
  var remain = 5 - Math.max(level, active);
  var inactive = level - active;
  return (
    <div>
      {Array.from(Array(active)).map((_) => {
        return <i class="fas fa-circle"></i>;
      })}
      {level > active ? (
        Array.from(Array(inactive)).map((_) => {
          return <i class="fas fa-circle" style={{ color: "orange" }}></i>;
        })
      ) : (
        <></>
      )}
      {Array.from(Array(remain)).map((_) => {
        return <i class="far fa-circle" style={{ color: "grey" }}></i>;
      })}
    </div>
  );
};
