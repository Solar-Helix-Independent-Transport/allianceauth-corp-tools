import { CharacterGlancesAccount } from "../Glance/Account";
import { CharacterGlancesActivities } from "../Glance/Activities";
import { CharacterGlancesAssets } from "../Glance/Assets";
import { CharacterGlancesFactions } from "../Glance/Factions";
import { CharacterGlancesRatting } from "../Glance/Ratting";

const CharacterAtAGlance = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <CharacterGlancesAccount />
      <CharacterGlancesAssets />
      <CharacterGlancesActivities />
      <CharacterGlancesRatting />
      <CharacterGlancesFactions />
    </div>
  );
};

export default CharacterAtAGlance;
