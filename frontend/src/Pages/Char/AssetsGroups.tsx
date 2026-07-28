import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { getAssetGroups } from "../../api/character";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { AssetGroups } from "../../Components/AssetGroups";
import LabeledSelect from "../../Components/Helpers/LabeledSelect";

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
      <LabeledSelect label={t("Location Filter")}>
        <CharacterAssetLocationSelect
          characterID={characterID ? Number(characterID) : 0}
          {...{ setLocation }}
        />
      </LabeledSelect>
      {isFetching ? (
        <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />
      ) : (
        <AssetGroups {...{ data }} />
      )}
    </>
  );
};

export default CharacterAssetGroups;
