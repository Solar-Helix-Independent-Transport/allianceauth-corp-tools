import { CharacterPortrait } from "../../Components/EveImages/EveImages";
import { TimeTill } from "../../Components/Helpers/TimeTill";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterMercenaryTacticalOperations } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const CharacterMercenaryTacticalOperations = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["mercenarytacticaloperations", characterID],
    queryFn: () => getCharacterMercenaryTacticalOperations(Number(characterID)),
    refetchOnWindowFocus: false,
  });

  const columnHelper =
    createColumnHelper<components["schemas"]["CharacterMercenaryTacticalOperation"]>();

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
    columnHelper.accessor("mercenary_den_id", {
      header: t("Mercenary Den"),
    }),
    columnHelper.accessor("dungeon_type_id", {
      header: t("Operation Type"),
    }),
    columnHelper.accessor("state", {
      header: t("State"),
    }),
    columnHelper.accessor("expires", {
      header: t("Expires"),
      cell: (cell) => {
        const value = cell.getValue();
        return value ? <TimeTill date={value} /> : <></>;
      },
    }),
  ];

  return <TableWrapper {...{ data, isFetching, columns }} />;
};

export default CharacterMercenaryTacticalOperations;
