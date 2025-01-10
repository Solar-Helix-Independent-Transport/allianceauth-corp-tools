import styles from "../../Pages/Glance/AtAGlance.module.css";
import { components } from "../../api/CtApi";
import ErrorBoundary from "../Helpers/ErrorBoundary";
import TableWrapper from "../Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";

function CharacterContractModalTable({ data, header = "" }: any) {
  const columnHelper = createColumnHelper<components["schemas"]["ContractItems"]>();

  const columns = [
    columnHelper.accessor("type_name", {
      header: "Character",
    }),
    columnHelper.accessor("quantity", {
      header: "QTY",
    }),
  ];

  return (
    <ErrorBoundary>
      {data.length > 0 && (
        <>
          <h6 className={styles.strikeOut}>{header}</h6>
          <TableWrapper {...{ data, columns }} isFetching={false} />
        </>
      )}
    </ErrorBoundary>
  );
}

export default CharacterContractModalTable;
