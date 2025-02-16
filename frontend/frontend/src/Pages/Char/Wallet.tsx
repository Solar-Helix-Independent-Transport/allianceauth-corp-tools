import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadWallet } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterWallet = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["wallet", characterID],
    queryFn: () => loadWallet(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterWalletEvent"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("date", {
      header: t("Date"),
    }),
    columnHelper.accessor("ref_type", {
      header: t("Type"),
    }),
    columnHelper.accessor("first_party.name", {
      header: t("First Party"),
    }),
    columnHelper.accessor("second_party.name", {
      header: t("Second Party"),
    }),
    columnHelper.accessor("amount", {
      header: t("Amount"),
    }),
    columnHelper.accessor("balance", {
      header: t("Balance"),
    }),
    columnHelper.accessor("reason", {
      header: t("Reason"),
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterWallet;
