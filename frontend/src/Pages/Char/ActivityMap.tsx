import { useParams } from "react-router";
import ActivityMap from "../../Components/ActivityMap/ActivityMap";
import { CHARACTER_ACTIVITY_MAP_DATA_SOURCES } from "../../Components/Character/ActivityMap/dataSources";

const CharacterActivityMap = () => {
  const { characterID } = useParams();

  return (
    <ActivityMap
      id={Number(characterID)}
      dataSources={CHARACTER_ACTIVITY_MAP_DATA_SOURCES}
      queryKeyPrefix="characterActivityMap"
    />
  );
};

export default CharacterActivityMap;
