import { GlancesAccount } from "./Glance/Account";
import { GlancesActivities } from "./Glance/Activities";
import { GlancesAssets } from "./Glance/Assets";
import { GlancesFactions } from "./Glance/Factions";

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
      <GlancesAccount />
      <GlancesAssets />
      <GlancesActivities />
      <GlancesFactions />

      {/* <h3 className={`${styles.strikeOut} mt-4 w-100 text-center`}>Character Status</h3> */}
    </div>
  );
};

export default CharacterAtAGlance;
