import { Row } from "@tanstack/react-table";

export const NameObjectArrayFilterFn = (
  row: Row<unknown>,
  columnId: string,
  filterValue: string,
) => {
  const data = row.getValue(columnId) as { name: string }[];
  const _svrs = data.reduce((o: string, r) => o + `|${r.name}`, "");
  return _svrs.toLowerCase().includes(filterValue.toLowerCase());
};
