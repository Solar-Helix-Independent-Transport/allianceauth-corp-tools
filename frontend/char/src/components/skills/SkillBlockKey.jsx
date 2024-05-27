import React from "react";

export const SkillBlockKey = () => {
  return (
    <div className="">
      <h5 className="text-center">Key</h5>
      <div className={`flex-skill-block full-width`}>
        <p>Trained Level</p>
        <i class="fas fa-circle"></i>
      </div>
      <div className={`flex-skill-block full-width`}>
        <p>Omega Restricted</p>
        <i class="fas fa-circle" style={{ color: "grey" }}></i>
      </div>
      <div className={`flex-skill-block full-width`}>
        <p>Missing Level</p>
        <i class="fas fa-circle" style={{ color: "orange" }}></i>
      </div>
    </div>
  );
};
