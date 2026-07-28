// The backend's OpenAPI schema for CharacterDoctrines.doctrines/skills is
// under-specified (loose `{[key: string]: unknown}`), so these shapes are
// derived from how DoctrineCheck/DoctrineModal actually consume them.
export type DoctrineSkillReqs = {
  _meta: { total_sp: number; trained_sp: number };
  [skillName: string]: number | { total_sp: number; trained_sp: number };
};

export type DoctrineSkillList = {
  [skillName: string]: { active_level: number; trained_level: number };
};
