import { useTranslation } from "react-i18next";
import styles from "../../Pages/Glance/AtAGlance.module.css";
import ErrorBoundary from "../Helpers/ErrorBoundary";
import TableWrapper from "../Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { TypeIcon } from "../EveImages/EveImages";

function StarbaseModalFuelTable({ data, header = "", isFetching }: any) {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("name", {
      header: t("Name"),
      cell: (cell) => {
        return (
          <div className="d-flex align-items-center">
            <div style={{ widows: "32px" }}>
              <TypeIcon height={32} width={32} type_id={cell.row.original.id} size={32} />
            </div>
            <p className="m-0 ms-2">{cell.getValue()}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("qty", {
      header: t("Quantity"),
      cell: (cell) => {
        return <>{cell.getValue().toLocaleString()}</>;
      },
    }),
  ];

  return (
    <ErrorBoundary>
      {data?.length > 0 && (
        <>
          <h6 className={styles.strikeOut}>{header}</h6>
          <TableWrapper {...{ data, columns }} isFetching={isFetching} />
        </>
      )}
    </ErrorBoundary>
  );
}

export default StarbaseModalFuelTable;
