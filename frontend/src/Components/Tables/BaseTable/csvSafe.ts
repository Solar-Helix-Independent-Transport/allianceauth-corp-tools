// Spreadsheets run a cell starting with one of these as a formula, and a lot
// of what gets exported is written by players (wallet reasons, contract
// titles, names) - so "=HYPERLINK(...)" in a contract title would otherwise
// run in whoever opens the export.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^[-+]?\d+(\.\d+)?$/;

/** A cell value made safe to open in a spreadsheet: a string that would be
 * read as a formula gets a leading `'`. Numbers, and strings that are just
 * a number (e.g. "-5"), are left alone. */
export const csvSafe = (value: unknown) =>
  typeof value === "string" && FORMULA_PREFIX.test(value) && !PLAIN_NUMBER.test(value)
    ? `'${value}`
    : value;
