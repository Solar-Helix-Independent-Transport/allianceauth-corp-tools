import type { paths } from "./CtApi";
import axios from "axios";
import Cookies from "js-cookie";
import createClient from "openapi-fetch";
import type { PathsWithMethod } from "openapi-typescript-helpers";

// Django's CSRF cookie is named "csrftoken", not axios's own default
// ("XSRF-TOKEN") - both must be set for axios to actually attach the header
// automatically. Set once here rather than duplicated per API module.
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

export type GetEndpoint = PathsWithMethod<paths, "get">;

export const getCatApi = () => {
  const csrf = Cookies.get("csrftoken");

  return createClient<paths>({
    baseUrl: "/",
    headers: { "x-csrftoken": csrf ? csrf : "" },
  });
};
