import ErrorBoundary from "../Helpers/ErrorBoundary";
import { PanelLoader } from "../Loaders/loaders";
import { SkillGroup } from "./SkillGroup";
import Accordion from "react-bootstrap/Accordion";

const CharSkillGroups = ({ data }: any) => {
  const groupByKey = (list: any, key: any) =>
    list?.reduce(
      (hash: any, obj: any) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      }),
      {},
    );

  const skills_data = groupByKey(data, "group");

  if (Object.entries(skills_data).length === 0) {
    return <PanelLoader title="Nothing Found" />;
  }
  return (
    <ErrorBoundary>
      <Accordion defaultActiveKey={[]} alwaysOpen>
        {Object.entries(skills_data)
          .sort(function (a: any, b: any) {
            const nameA = a[0].toLowerCase(),
              nameB = b[0].toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          })
          .map((entry: any) => (
            <SkillGroup group={entry[0]} skills={entry[1]} />
          ))}
      </Accordion>
    </ErrorBoundary>
  );
};

export default CharSkillGroups;
