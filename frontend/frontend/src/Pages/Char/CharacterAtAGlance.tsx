import { CharacterGlancesAccount } from "../Glance/Account";
import { CharacterGlancesActivities } from "../Glance/Activities";
import { CharacterGlancesAssets } from "../Glance/Assets";
import { CharacterGlancesFactions } from "../Glance/Factions";

const CharacterAtAGlance = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <CharacterAllegiancePortrait
        character={{
          character_id: characterID,
          corporation_id: 1,
          alliance_id: 1,
        }}
        size={256}
        rounded_images={true}
      /> */}
      <CharacterGlancesAccount />
      <CharacterGlancesAssets />
      <CharacterGlancesActivities />
      <CharacterGlancesFactions />

      {/* <h3 className={`${styles.strikeOut} mt-4 w-100 text-center`}>Character Status</h3> */}
    </div>
  );
};

export default CharacterAtAGlance;
