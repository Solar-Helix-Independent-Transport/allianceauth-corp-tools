import { CharacterGlancesAccount } from "../Glance/Account";
import { CharacterGlancesActivities, CharacterGlancesActivityHeatmap } from "../Glance/Activities";
import { CharacterGlancesAssets } from "../Glance/Assets";
import { CharacterGlancesFactions } from "../Glance/Factions";

const CharacterAtAGlance = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <CharacterGlancesAccount />
      <CharacterGlancesAssets />
      <CharacterGlancesActivities />
      <CharacterGlancesActivityHeatmap />
      <CharacterGlancesFactions />
    </div>
  );
};

export default CharacterAtAGlance;
