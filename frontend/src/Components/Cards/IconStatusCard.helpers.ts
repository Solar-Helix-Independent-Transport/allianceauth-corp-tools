type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light";

export const COMPACT_NUM_FORMAT: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  notation: "compact",
  compactDisplay: "short",
};

export function statusProps(
  value: number | string | null | undefined,
  isLoading: boolean,
  emptyVariant = "secondary",
  format?: (v: number | string) => string,
) {
  const active = Boolean(value);
  const variant = active ? "success" : isLoading ? undefined : emptyVariant;
  return {
    isLoading,
    text: (value ? (format ? format(value) : String(value)) : "-") as string,
    textVariant: variant as BadgeVariant | "muted" | undefined,
    cardVariant: variant as BadgeVariant | undefined,
  };
}
