import { useTranslation } from "react-i18next";
import ErrorBoundary from "../Helpers/ErrorBoundary";
import { PanelLoader } from "../Loaders/loaders";
import { Skill, SkillGroup } from "./SkillGroup";
import Accordion from "react-bootstrap/Accordion";

// list?.reduce(...) looks defensive but isn't: optional chaining short-
// circuits the whole expression to undefined when list is falsy, rather than
// running reduce against an empty array - so it silently breaks the "always
// returns a real object" contract every caller relies on (see #196: a
// character with no skill data yet - e.g. a main whose ESI token was never
// added - reaching here with list undefined threw "Cannot read properties
// of undefined (reading 'reduce')" and later "Cannot convert undefined or
// null to object" at the Object.entries() call site). Defaulting list to []
// before reducing keeps this self-contained regardless of what the caller
// passes.
const groupByKey = (list: Skill[], key: "group") =>
  (list ?? []).reduce<Record<string, Skill[]>>(
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    }),
    {},
  );

const CharSkillGroups = ({ data }: { data: Skill[] }) => {
  const { t } = useTranslation();
  const skills_data = groupByKey(data, "group");

  if (Object.entries(skills_data).length === 0) {
    return <PanelLoader title={t("Nothing Found")} />;
  }
  return (
    <ErrorBoundary>
      <Accordion defaultActiveKey={[]} alwaysOpen>
        {Object.entries(skills_data)
          .sort(function (a, b) {
            const nameA = a[0].toLowerCase(),
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
      </Accordion>
    </ErrorBoundary>
  );
};

export default CharSkillGroups;
