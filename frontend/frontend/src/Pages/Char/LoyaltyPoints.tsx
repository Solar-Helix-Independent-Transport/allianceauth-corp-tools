import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterLP } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterLP = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["LP", characterID],
    queryFn: () => getCharacterLP(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["LoyaltyPoints"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("character.corporation_name", {
      header: t("Corporation"),
    }),
    columnHelper.accessor("corporation.name", {
      header: t("LP Corporation"),
    }),
    columnHelper.accessor("amount", {
      header: t("Quantity"),
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterLP;
