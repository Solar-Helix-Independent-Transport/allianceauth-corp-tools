import { CorporationGlancesActivities } from "../Glance/Activities";
import { CorporationGlancesAssets } from "../Glance/Assets";
import { CorporationGlancesInfo } from "../Glance/Corporation";
import { CorporationGlancesFactions } from "../Glance/Factions";

const CorporationAtAGlance = () => {
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
      <CorporationGlancesInfo />
      <CorporationGlancesActivities />
      <CorporationGlancesAssets />
      <CorporationGlancesFactions />

      {/* <h3 className={`${styles.strikeOut} mt-4 w-100 text-center`}>Character Status</h3> */}
    </div>
  );
};

export default CorporationAtAGlance;
