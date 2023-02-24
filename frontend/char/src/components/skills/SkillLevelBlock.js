import React from "react";

export const SkillLevelBlock = ({ level, active = 0, trained = 0 }) => {
  var trained_inactive = trained - active;
  var inactive = level - active - trained_inactive;
  var remain = 5 - Math.max(level, active, trained);

  return (
    <div>
      {Array.from(Array(active)).map((_) => {
        return <i class="fas fa-circle"></i>;
      })}

      {trained_inactive > 0 ? (
        Array.from(Array(trained_inactive)).map((_) => {
          return <i class="fas fa-circle" style={{ color: "grey" }}></i>;
        })
      ) : (
        <></>
      )}

      {inactive > 0 ? (
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
