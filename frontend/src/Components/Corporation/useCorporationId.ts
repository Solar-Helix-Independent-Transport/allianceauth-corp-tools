import { useQueryState } from "nuqs";

export const useCorporationId = () => {
  const [cidStr] = useQueryState("cid");
  return Number(cidStr) || 0;
};
