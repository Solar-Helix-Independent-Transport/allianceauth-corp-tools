import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { getAssetGroups } from "../../api/character";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AssetGroups } from "../../Components/AssetGroups";

const CharacterAssetGroups = () => {
  const { t } = useTranslation();

  const { characterID } = useParams();

  const [LocationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["assetGroups", characterID, LocationID],
    queryFn: () => getAssetGroups(Number(characterID), Number(LocationID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="m-3 d-flex align-items-center">
        <h5 className="me-1">{t("Location Filter")}</h5>
        <div className="flex-grow-1">
          <CharacterAssetLocationSelect
            characterID={characterID ? Number(characterID) : 0}
            {...{ setLocation }}
          />
        </div>
      </div>
      {isFetching ? (
        <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />
      ) : (
        <AssetGroups {...{ data }} />
      )}
    </>
  );
};

export default CharacterAssetGroups;
