import type { paths } from "./CtApi";
import Cookies from "js-cookie";
import createClient from "openapi-fetch";

export const getCatApi = () => {
  const csrf = Cookies.get("csrftoken");

  return createClient<paths>({
    baseUrl: "/",
    headers: { "x-csrftoken": csrf ? csrf : "" },
  });
};
