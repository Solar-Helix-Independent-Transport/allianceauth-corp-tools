import { CharacterPortrait, TypeIcon } from "../../Components/EveImages/EveImages";
import { TimeTill } from "../../Components/Helpers/TimeTill";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterMercenaryDens } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CharacterMercenaryDens = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["mercenarydens", characterID],
    queryFn: () => getCharacterMercenaryDens(Number(characterID)),
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<components["schemas"]["CharacterMercenaryDen"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
      cell: (cell) => (
        <>
          <CharacterPortrait character_id={cell.row.original.character.character_id} size={32} />
          <span className="ms-2">{cell.getValue()}</span>
        </>
      ),
    }),
    columnHelper.accessor("planet.name", {
      header: t("Planet"),
    }),
    columnHelper.accessor("type.name", {
      header: t("Type"),
      cell: (cell) => (
        <>
          <TypeIcon type_id={cell.row.original.type.id} size={32} />
          <span className="ms-2">{cell.getValue()}</span>
        </>
      ),
    }),
    columnHelper.accessor("state", {
      header: t("State"),
    }),
    columnHelper.accessor("development_level", {
      header: t("Development"),
      cell: (cell) => (
        <>
          {cell.getValue()} ({cell.row.original.development_amount})
        </>
      ),
    }),
    columnHelper.accessor("anarchy_level", {
      header: t("Anarchy"),
      cell: (cell) => (
        <>
          {cell.getValue()} ({cell.row.original.anarchy_amount})
        </>
      ),
    }),
    columnHelper.accessor("infomorph_amount", {
      header: t("Infomorphs"),
    }),
    columnHelper.accessor("reinforcement_end", {
      header: t("Reinforced Until"),
      cell: (cell) => {
        const value = cell.getValue();
        return value ? <TimeTill date={value} /> : <></>;
      },
    }),
  ];

  return <TableWrapper {...{ data, isFetching, columns }} />;
};

export default CharacterMercenaryDens;
