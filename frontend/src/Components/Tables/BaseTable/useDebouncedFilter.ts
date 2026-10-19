import { useEffect, useState } from "react";
import { Column } from "@tanstack/react-table";

export const FILTER_DEBOUNCE_MS = 250;

/** A text filter's input value, applied to the column only once typing
 * pauses - every applied change refilters (and refacets) the whole table,
 * which on a big table made each keystroke lag. The input itself updates
 * immediately. A change made to the filter from elsewhere (e.g. a clear
 * button calling column.setFilterValue) shows up here too. */
export const useDebouncedFilter = <TData>(column: Column<TData, unknown>) => {
  const applied = (column.getFilterValue() as string | undefined) ?? "";
  const [value, setValue] = useState(applied);
  const [lastApplied, setLastApplied] = useState(applied);

  // Changed from outside - adopt it (adjusting state during render, rather
  // than in an effect, so there's no frame showing the stale text).
  if (applied !== lastApplied) {
    setLastApplied(applied);
    setValue(applied);
  }

  useEffect(() => {
    if (value === applied) return;
    const timer = setTimeout(() => {
      setLastApplied(value);
      column.setFilterValue(value);
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, applied, column]);

  return [value, setValue] as const;
};
