import { colourStyles } from "./baseTableStyles";
import { RankingInfo, compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";
import React from "react";
import Select from "react-select";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

function strToKey(keyString: string, ob: object) {
  return keyString.split(".").reduce(function (p: any, prop: any) {
    return p[prop];
  }, ob);
}

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: { setFilter: any; filterValue: string; preFilteredRows: any };
}) {
  return <></>;
}

export function TextColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: { setFilter: any; filterValue: string; preFilteredRows: any };
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { setFilter, filterValue, preFilteredRows, id },
}: {
  column: { setFilter: any; filterValue: string; preFilteredRows: any; id: string };
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    if (!preFilteredRows) {
      return [];
    }
    preFilteredRows.forEach((row: any) => {
      if (row.values[id] !== null) {
        if (typeof row.values[id] === "object") {
          options.add(row.values[id]["name"]);
        } else {
          options.add(row.values[id]);
        }
      }
    });
    return Array.from(options.values());
  }, [id, preFilteredRows]);
  console.log(options);
  // Render a multi-select box
  return (
    <Select
      key={filterValue}
      onChange={(e: any) => setFilter(e.value)}
      value={{ label: filterValue || "All" }}
      defaultValue={{ label: "All" }}
      styles={colourStyles}
      options={[{ id: -1, value: "", label: "All" }].concat(
        options.map((i: any) => {
          return { id: i, value: String(i), label: String(i) };
        })
      )}
    />
  );
}

export function useDefaultColumn() {
  return React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
}
export function useFilterTypes() {
  return React.useMemo(
    () => ({
      text: (rows: any, ids: Array<string>, filterValue: string) => {
        return rows.filter((row: any) => {
          return ids.some((id: string) => {
            if (!filterValue) {
              return true;
            } else {
              let rowValue = row.values[id];
              if (typeof rowValue === "object") {
                rowValue = rowValue.name;
              }
              if (row.hasOwnProperty("originalSubRows")) {
                rowValue += row.originalSubRows.reduce((p: string, r: any) => {
                  return (p += " " + strToKey(id, r));
                }, "");
              }
              return rowValue ? rowValue.toLowerCase().includes(filterValue.toLowerCase()) : false;
            }
          });
        });
      },
    }),
    []
  );
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
