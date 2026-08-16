const convertToTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

// Wallet journal ref_type is ESI's raw machine key (e.g. "bounty_prizes").
// name comes from the SDE's AccountingEntryType lookup, joined server-side
// by ref_type; it's absent if the SDE doesn't know about the ref_type yet,
// so fall back to a title-cased version of the raw key. Shared by
// RefTypeLabel and other ref_type displays (e.g. the wallet table's column
// filter) so they all resolve to the exact same label.
export const getRefTypeLabel = (refType: string, name?: string | null) =>
  name || convertToTitleCase(refType.replaceAll("_", " "));
