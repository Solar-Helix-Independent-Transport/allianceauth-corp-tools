import { useTranslation } from "react-i18next";
import ErrorBoundary from "../Helpers/ErrorBoundary";
import { PanelLoader } from "../Loaders/loaders";
import { Skill, SkillGroup } from "./SkillGroup";
import Accordion from "react-bootstrap/Accordion";

const groupByKey = (list: Skill[], key: "group") =>
  list?.reduce<Record<string, Skill[]>>(
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
