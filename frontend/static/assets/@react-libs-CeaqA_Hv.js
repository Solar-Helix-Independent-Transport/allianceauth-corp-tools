import {
  r as d,
  c as xi,
  d as En,
  _ as R,
  e as Oi,
  a as Pi,
  R as we,
} from "./@app-libs-Cb_auZyT.js";
import { _ as Ei } from "./@bootstrap-libs-DZc4rDL4.js";
var Qt = {};
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.parse = Di;
Qt.serialize = Vi;
const Mi = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/,
  Ri = /^[\u0021-\u003A\u003C-\u007E]*$/,
  Ii = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  ki = /^[\u0020-\u003A\u003D-\u007E]*$/,
  Ti = Object.prototype.toString,
  Li = (() => {
    const e = function () {};
    return (e.prototype = Object.create(null)), e;
  })();
function Di(e, t) {
  const r = new Li(),
    i = e.length;
  if (i < 2) return r;
  const n = (t == null ? void 0 : t.decode) || $i;
  let o = 0;
  do {
    const s = e.indexOf("=", o);
    if (s === -1) break;
    const u = e.indexOf(";", o),
      a = u === -1 ? i : u;
    if (s > a) {
      o = e.lastIndexOf(";", s - 1) + 1;
      continue;
    }
    const l = Mn(e, o, s),
      c = Rn(e, s, l),
      f = e.slice(l, c);
    if (r[f] === void 0) {
      let h = Mn(e, s + 1, a),
        v = Rn(e, a, h);
      const b = n(e.slice(h, v));
      r[f] = b;
    }
    o = a + 1;
  } while (o < i);
  return r;
}
function Mn(e, t, r) {
  do {
    const i = e.charCodeAt(t);
    if (i !== 32 && i !== 9) return t;
  } while (++t < r);
  return r;
}
function Rn(e, t, r) {
  for (; t > r; ) {
    const i = e.charCodeAt(--t);
    if (i !== 32 && i !== 9) return t + 1;
  }
  return r;
}
function Vi(e, t, r) {
  const i = (r == null ? void 0 : r.encode) || encodeURIComponent;
  if (!Mi.test(e)) throw new TypeError(`argument name is invalid: ${e}`);
  const n = i(t);
  if (!Ri.test(n)) throw new TypeError(`argument val is invalid: ${t}`);
  let o = e + "=" + n;
  if (!r) return o;
  if (r.maxAge !== void 0) {
    if (!Number.isInteger(r.maxAge)) throw new TypeError(`option maxAge is invalid: ${r.maxAge}`);
    o += "; Max-Age=" + r.maxAge;
  }
  if (r.domain) {
    if (!Ii.test(r.domain)) throw new TypeError(`option domain is invalid: ${r.domain}`);
    o += "; Domain=" + r.domain;
  }
  if (r.path) {
    if (!ki.test(r.path)) throw new TypeError(`option path is invalid: ${r.path}`);
    o += "; Path=" + r.path;
  }
  if (r.expires) {
    if (!Fi(r.expires) || !Number.isFinite(r.expires.valueOf()))
      throw new TypeError(`option expires is invalid: ${r.expires}`);
    o += "; Expires=" + r.expires.toUTCString();
  }
  if (
    (r.httpOnly && (o += "; HttpOnly"),
    r.secure && (o += "; Secure"),
    r.partitioned && (o += "; Partitioned"),
    r.priority)
  )
    switch (typeof r.priority == "string" ? r.priority.toLowerCase() : void 0) {
      case "low":
        o += "; Priority=Low";
        break;
      case "medium":
        o += "; Priority=Medium";
        break;
      case "high":
        o += "; Priority=High";
        break;
      default:
        throw new TypeError(`option priority is invalid: ${r.priority}`);
    }
  if (r.sameSite)
    switch (typeof r.sameSite == "string" ? r.sameSite.toLowerCase() : r.sameSite) {
      case !0:
      case "strict":
        o += "; SameSite=Strict";
        break;
      case "lax":
        o += "; SameSite=Lax";
        break;
      case "none":
        o += "; SameSite=None";
        break;
      default:
        throw new TypeError(`option sameSite is invalid: ${r.sameSite}`);
    }
  return o;
}
function $i(e) {
  if (e.indexOf("%") === -1) return e;
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
function Fi(e) {
  return Ti.call(e) === "[object Date]";
}
/**
 * react-router v7.2.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var In = "popstate";
function Ai(e = {}) {
  function t(i, n) {
    let { pathname: o, search: s, hash: u } = i.location;
    return Ht(
      "",
      { pathname: o, search: s, hash: u },
      (n.state && n.state.usr) || null,
      (n.state && n.state.key) || "default",
    );
  }
  function r(i, n) {
    return typeof n == "string" ? n : Le(n);
  }
  return _i(t, r, null, e);
}
function D(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Z(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Ni() {
  return Math.random().toString(36).substring(2, 10);
}
function kn(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function Ht(e, t, r = null, i) {
  return {
    pathname: typeof e == "string" ? e : e.pathname,
    search: "",
    hash: "",
    ...(typeof t == "string" ? Oe(t) : t),
    state: r,
    key: (t && t.key) || i || Ni(),
  };
}
function Le({ pathname: e = "/", search: t = "", hash: r = "" }) {
  return (
    t && t !== "?" && (e += t.charAt(0) === "?" ? t : "?" + t),
    r && r !== "#" && (e += r.charAt(0) === "#" ? r : "#" + r),
    e
  );
}
function Oe(e) {
  let t = {};
  if (e) {
    let r = e.indexOf("#");
    r >= 0 && ((t.hash = e.substring(r)), (e = e.substring(0, r)));
    let i = e.indexOf("?");
    i >= 0 && ((t.search = e.substring(i)), (e = e.substring(0, i))), e && (t.pathname = e);
  }
  return t;
}
function _i(e, t, r, i = {}) {
  let { window: n = document.defaultView, v5Compat: o = !1 } = i,
    s = n.history,
    u = "POP",
    a = null,
    l = c();
  l == null && ((l = 0), s.replaceState({ ...s.state, idx: l }, ""));
  function c() {
    return (s.state || { idx: null }).idx;
  }
  function f() {
    u = "POP";
    let p = c(),
      m = p == null ? null : p - l;
    (l = p), a && a({ action: u, location: g.location, delta: m });
  }
  function h(p, m) {
    u = "PUSH";
    let S = Ht(g.location, p, m);
    l = c() + 1;
    let y = kn(S, l),
      C = g.createHref(S);
    try {
      s.pushState(y, "", C);
    } catch (x) {
      if (x instanceof DOMException && x.name === "DataCloneError") throw x;
      n.location.assign(C);
    }
    o && a && a({ action: u, location: g.location, delta: 1 });
  }
  function v(p, m) {
    u = "REPLACE";
    let S = Ht(g.location, p, m);
    l = c();
    let y = kn(S, l),
      C = g.createHref(S);
    s.replaceState(y, "", C), o && a && a({ action: u, location: g.location, delta: 0 });
  }
  function b(p) {
    let m = n.location.origin !== "null" ? n.location.origin : n.location.href,
      S = typeof p == "string" ? p : Le(p);
    return (
      (S = S.replace(/ $/, "%20")),
      D(m, `No window.location.(origin|href) available to create URL for href: ${S}`),
      new URL(S, m)
    );
  }
  let g = {
    get action() {
      return u;
    },
    get location() {
      return e(n, s);
    },
    listen(p) {
      if (a) throw new Error("A history only accepts one active listener");
      return (
        n.addEventListener(In, f),
        (a = p),
        () => {
          n.removeEventListener(In, f), (a = null);
        }
      );
    },
    createHref(p) {
      return t(n, p);
    },
    createURL: b,
    encodeLocation(p) {
      let m = b(p);
      return { pathname: m.pathname, search: m.search, hash: m.hash };
    },
    push: h,
    replace: v,
    go(p) {
      return s.go(p);
    },
  };
  return g;
}
function fr(e, t, r = "/") {
  return Hi(e, t, r, !1);
}
function Hi(e, t, r, i) {
  let n = typeof t == "string" ? Oe(t) : t,
    o = ve(n.pathname || "/", r);
  if (o == null) return null;
  let s = dr(e);
  Bi(s);
  let u = null;
  for (let a = 0; u == null && a < s.length; ++a) {
    let l = Zi(o);
    u = Xi(s[a], l, i);
  }
  return u;
}
function dr(e, t = [], r = [], i = "") {
  let n = (o, s, u) => {
    let a = {
      relativePath: u === void 0 ? o.path || "" : u,
      caseSensitive: o.caseSensitive === !0,
      childrenIndex: s,
      route: o,
    };
    a.relativePath.startsWith("/") &&
      (D(
        a.relativePath.startsWith(i),
        `Absolute route path "${a.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
      (a.relativePath = a.relativePath.slice(i.length)));
    let l = ue([i, a.relativePath]),
      c = r.concat(a);
    o.children &&
      o.children.length > 0 &&
      (D(
        o.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${l}".`,
      ),
      dr(o.children, t, c, l)),
      !(o.path == null && !o.index) && t.push({ path: l, score: Gi(l, o.index), routesMeta: c });
  };
  return (
    e.forEach((o, s) => {
      var u;
      if (o.path === "" || !((u = o.path) != null && u.includes("?"))) n(o, s);
      else for (let a of pr(o.path)) n(o, s, a);
    }),
    t
  );
}
function pr(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [r, ...i] = t,
    n = r.endsWith("?"),
    o = r.replace(/\?$/, "");
  if (i.length === 0) return n ? [o, ""] : [o];
  let s = pr(i.join("/")),
    u = [];
  return (
    u.push(...s.map((a) => (a === "" ? o : [o, a].join("/")))),
    n && u.push(...s),
    u.map((a) => (e.startsWith("/") && a === "" ? "/" : a))
  );
}
function Bi(e) {
  e.sort((t, r) =>
    t.score !== r.score
      ? r.score - t.score
      : qi(
          t.routesMeta.map((i) => i.childrenIndex),
          r.routesMeta.map((i) => i.childrenIndex),
        ),
  );
}
var Ui = /^:[\w-]+$/,
  zi = 3,
  ji = 2,
  Wi = 1,
  Ki = 10,
  Yi = -2,
  Tn = (e) => e === "*";
function Gi(e, t) {
  let r = e.split("/"),
    i = r.length;
  return (
    r.some(Tn) && (i += Yi),
    t && (i += ji),
    r.filter((n) => !Tn(n)).reduce((n, o) => n + (Ui.test(o) ? zi : o === "" ? Wi : Ki), i)
  );
}
function qi(e, t) {
  return e.length === t.length && e.slice(0, -1).every((i, n) => i === t[n])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Xi(e, t, r = !1) {
  let { routesMeta: i } = e,
    n = {},
    o = "/",
    s = [];
  for (let u = 0; u < i.length; ++u) {
    let a = i[u],
      l = u === i.length - 1,
      c = o === "/" ? t : t.slice(o.length) || "/",
      f = nt({ path: a.relativePath, caseSensitive: a.caseSensitive, end: l }, c),
      h = a.route;
    if (
      (!f &&
        l &&
        r &&
        !i[i.length - 1].route.index &&
        (f = nt({ path: a.relativePath, caseSensitive: a.caseSensitive, end: !1 }, c)),
      !f)
    )
      return null;
    Object.assign(n, f.params),
      s.push({
        params: n,
        pathname: ue([o, f.pathname]),
        pathnameBase: no(ue([o, f.pathnameBase])),
        route: h,
      }),
      f.pathnameBase !== "/" && (o = ue([o, f.pathnameBase]));
  }
  return s;
}
function nt(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [r, i] = Ji(e.path, e.caseSensitive, e.end),
    n = t.match(r);
  if (!n) return null;
  let o = n[0],
    s = o.replace(/(.)\/+$/, "$1"),
    u = n.slice(1);
  return {
    params: i.reduce((l, { paramName: c, isOptional: f }, h) => {
      if (c === "*") {
        let b = u[h] || "";
        s = o.slice(0, o.length - b.length).replace(/(.)\/+$/, "$1");
      }
      const v = u[h];
      return f && !v ? (l[c] = void 0) : (l[c] = (v || "").replace(/%2F/g, "/")), l;
    }, {}),
    pathname: o,
    pathnameBase: s,
    pattern: e,
  };
}
function Ji(e, t = !1, r = !0) {
  Z(
    e === "*" || !e.endsWith("*") || e.endsWith("/*"),
    `Route path "${e}" will be treated as if it were "${e.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/, "/*")}".`,
  );
  let i = [],
    n =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (s, u, a) => (
            i.push({ paramName: u, isOptional: a != null }), a ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    e.endsWith("*")
      ? (i.push({ paramName: "*" }), (n += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : r
        ? (n += "\\/*$")
        : e !== "" && e !== "/" && (n += "(?:(?=\\/|$))"),
    [new RegExp(n, t ? void 0 : "i"), i]
  );
}
function Zi(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      Z(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`,
      ),
      e
    );
  }
}
function ve(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let r = t.endsWith("/") ? t.length - 1 : t.length,
    i = e.charAt(r);
  return i && i !== "/" ? null : e.slice(r) || "/";
}
function Qi(e, t = "/") {
  let { pathname: r, search: i = "", hash: n = "" } = typeof e == "string" ? Oe(e) : e;
  return { pathname: r ? (r.startsWith("/") ? r : eo(r, t)) : t, search: ro(i), hash: io(n) };
}
function eo(e, t) {
  let r = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((n) => {
      n === ".." ? r.length > 1 && r.pop() : n !== "." && r.push(n);
    }),
    r.length > 1 ? r.join("/") : "/"
  );
}
function It(e, t, r, i) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(i)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function to(e) {
  return e.filter((t, r) => r === 0 || (t.route.path && t.route.path.length > 0));
}
function en(e) {
  let t = to(e);
  return t.map((r, i) => (i === t.length - 1 ? r.pathname : r.pathnameBase));
}
function tn(e, t, r, i = !1) {
  let n;
  typeof e == "string"
    ? (n = Oe(e))
    : ((n = { ...e }),
      D(!n.pathname || !n.pathname.includes("?"), It("?", "pathname", "search", n)),
      D(!n.pathname || !n.pathname.includes("#"), It("#", "pathname", "hash", n)),
      D(!n.search || !n.search.includes("#"), It("#", "search", "hash", n)));
  let o = e === "" || n.pathname === "",
    s = o ? "/" : n.pathname,
    u;
  if (s == null) u = r;
  else {
    let f = t.length - 1;
    if (!i && s.startsWith("..")) {
      let h = s.split("/");
      for (; h[0] === ".."; ) h.shift(), (f -= 1);
      n.pathname = h.join("/");
    }
    u = f >= 0 ? t[f] : "/";
  }
  let a = Qi(n, u),
    l = s && s !== "/" && s.endsWith("/"),
    c = (o || s === ".") && r.endsWith("/");
  return !a.pathname.endsWith("/") && (l || c) && (a.pathname += "/"), a;
}
var ue = (e) => e.join("/").replace(/\/\/+/g, "/"),
  no = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  ro = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  io = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function oo(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
var hr = ["POST", "PUT", "PATCH", "DELETE"];
new Set(hr);
var ao = ["GET", ...hr];
new Set(ao);
var Pe = d.createContext(null);
Pe.displayName = "DataRouter";
var dt = d.createContext(null);
dt.displayName = "DataRouterState";
var mr = d.createContext({ isTransitioning: !1 });
mr.displayName = "ViewTransition";
var so = d.createContext(new Map());
so.displayName = "Fetchers";
var uo = d.createContext(null);
uo.displayName = "Await";
var Q = d.createContext(null);
Q.displayName = "Navigation";
var Fe = d.createContext(null);
Fe.displayName = "Location";
var X = d.createContext({ outlet: null, matches: [], isDataRoute: !1 });
X.displayName = "Route";
var nn = d.createContext(null);
nn.displayName = "RouteError";
function lo(e, { relative: t } = {}) {
  D(Ee(), "useHref() may be used only in the context of a <Router> component.");
  let { basename: r, navigator: i } = d.useContext(Q),
    { hash: n, pathname: o, search: s } = Ae(e, { relative: t }),
    u = o;
  return (
    r !== "/" && (u = o === "/" ? r : ue([r, o])), i.createHref({ pathname: u, search: s, hash: n })
  );
}
function Ee() {
  return d.useContext(Fe) != null;
}
function ge() {
  return (
    D(Ee(), "useLocation() may be used only in the context of a <Router> component."),
    d.useContext(Fe).location
  );
}
var vr =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function gr(e) {
  d.useContext(Q).static || d.useLayoutEffect(e);
}
function br() {
  let { isDataRoute: e } = d.useContext(X);
  return e ? Po() : co();
}
function co() {
  D(Ee(), "useNavigate() may be used only in the context of a <Router> component.");
  let e = d.useContext(Pe),
    { basename: t, navigator: r } = d.useContext(Q),
    { matches: i } = d.useContext(X),
    { pathname: n } = ge(),
    o = JSON.stringify(en(i)),
    s = d.useRef(!1);
  return (
    gr(() => {
      s.current = !0;
    }),
    d.useCallback(
      (a, l = {}) => {
        if ((Z(s.current, vr), !s.current)) return;
        if (typeof a == "number") {
          r.go(a);
          return;
        }
        let c = tn(a, JSON.parse(o), n, l.relative === "path");
        e == null && t !== "/" && (c.pathname = c.pathname === "/" ? t : ue([t, c.pathname])),
          (l.replace ? r.replace : r.push)(c, l.state, l);
      },
      [t, r, o, n, e],
    )
  );
}
var fo = d.createContext(null);
function po(e) {
  let t = d.useContext(X).outlet;
  return t && d.createElement(fo.Provider, { value: e }, t);
}
function Sc() {
  let { matches: e } = d.useContext(X),
    t = e[e.length - 1];
  return t ? t.params : {};
}
function Ae(e, { relative: t } = {}) {
  let { matches: r } = d.useContext(X),
    { pathname: i } = ge(),
    n = JSON.stringify(en(r));
  return d.useMemo(() => tn(e, JSON.parse(n), i, t === "path"), [e, n, i, t]);
}
function ho(e, t) {
  return yr(e, t);
}
function yr(e, t, r, i) {
  var S;
  D(Ee(), "useRoutes() may be used only in the context of a <Router> component.");
  let { navigator: n, static: o } = d.useContext(Q),
    { matches: s } = d.useContext(X),
    u = s[s.length - 1],
    a = u ? u.params : {},
    l = u ? u.pathname : "/",
    c = u ? u.pathnameBase : "/",
    f = u && u.route;
  {
    let y = (f && f.path) || "";
    Sr(
      l,
      !f || y.endsWith("*") || y.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${l}" (under <Route path="${y}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${y}"> to <Route path="${y === "/" ? "*" : `${y}/*`}">.`,
    );
  }
  let h = ge(),
    v;
  if (t) {
    let y = typeof t == "string" ? Oe(t) : t;
    D(
      c === "/" || ((S = y.pathname) == null ? void 0 : S.startsWith(c)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${y.pathname}" was given in the \`location\` prop.`,
    ),
      (v = y);
  } else v = h;
  let b = v.pathname || "/",
    g = b;
  if (c !== "/") {
    let y = c.replace(/^\//, "").split("/");
    g = "/" + b.replace(/^\//, "").split("/").slice(y.length).join("/");
  }
  let p = !o && r && r.matches && r.matches.length > 0 ? r.matches : fr(e, { pathname: g });
  Z(f || p != null, `No routes matched location "${v.pathname}${v.search}${v.hash}" `),
    Z(
      p == null ||
        p[p.length - 1].route.element !== void 0 ||
        p[p.length - 1].route.Component !== void 0 ||
        p[p.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${v.pathname}${v.search}${v.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    );
  let m = yo(
    p &&
      p.map((y) =>
        Object.assign({}, y, {
          params: Object.assign({}, a, y.params),
          pathname: ue([c, n.encodeLocation ? n.encodeLocation(y.pathname).pathname : y.pathname]),
          pathnameBase:
            y.pathnameBase === "/"
              ? c
              : ue([
                  c,
                  n.encodeLocation ? n.encodeLocation(y.pathnameBase).pathname : y.pathnameBase,
                ]),
        }),
      ),
    s,
    r,
    i,
  );
  return t && m
    ? d.createElement(
        Fe.Provider,
        {
          value: {
            location: { pathname: "/", search: "", hash: "", state: null, key: "default", ...v },
            navigationType: "POP",
          },
        },
        m,
      )
    : m;
}
function mo() {
  let e = Oo(),
    t = oo(e) ? `${e.status} ${e.statusText}` : e instanceof Error ? e.message : JSON.stringify(e),
    r = e instanceof Error ? e.stack : null,
    i = "rgba(200,200,200, 0.5)",
    n = { padding: "0.5rem", backgroundColor: i },
    o = { padding: "2px 4px", backgroundColor: i },
    s = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", e),
    (s = d.createElement(
      d.Fragment,
      null,
      d.createElement("p", null, "💿 Hey developer 👋"),
      d.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        d.createElement("code", { style: o }, "ErrorBoundary"),
        " or",
        " ",
        d.createElement("code", { style: o }, "errorElement"),
        " prop on your route.",
      ),
    )),
    d.createElement(
      d.Fragment,
      null,
      d.createElement("h2", null, "Unexpected Application Error!"),
      d.createElement("h3", { style: { fontStyle: "italic" } }, t),
      r ? d.createElement("pre", { style: n }, r) : null,
      s,
    )
  );
}
var vo = d.createElement(mo, null),
  go = class extends d.Component {
    constructor(e) {
      super(e),
        (this.state = { location: e.location, revalidation: e.revalidation, error: e.error });
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location || (t.revalidation !== "idle" && e.revalidation === "idle")
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error !== void 0 ? e.error : t.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      console.error("React Router caught the following error during render", e, t);
    }
    render() {
      return this.state.error !== void 0
        ? d.createElement(
            X.Provider,
            { value: this.props.routeContext },
            d.createElement(nn.Provider, {
              value: this.state.error,
              children: this.props.component,
            }),
          )
        : this.props.children;
    }
  };
function bo({ routeContext: e, match: t, children: r }) {
  let i = d.useContext(Pe);
  return (
    i &&
      i.static &&
      i.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (i.staticContext._deepestRenderedBoundaryId = t.route.id),
    d.createElement(X.Provider, { value: e }, r)
  );
}
function yo(e, t = [], r = null, i = null) {
  if (e == null) {
    if (!r) return null;
    if (r.errors) e = r.matches;
    else if (t.length === 0 && !r.initialized && r.matches.length > 0) e = r.matches;
    else return null;
  }
  let n = e,
    o = r == null ? void 0 : r.errors;
  if (o != null) {
    let a = n.findIndex((l) => l.route.id && (o == null ? void 0 : o[l.route.id]) !== void 0);
    D(
      a >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(o).join(",")}`,
    ),
      (n = n.slice(0, Math.min(n.length, a + 1)));
  }
  let s = !1,
    u = -1;
  if (r)
    for (let a = 0; a < n.length; a++) {
      let l = n[a];
      if (((l.route.HydrateFallback || l.route.hydrateFallbackElement) && (u = a), l.route.id)) {
        let { loaderData: c, errors: f } = r,
          h = l.route.loader && !c.hasOwnProperty(l.route.id) && (!f || f[l.route.id] === void 0);
        if (l.route.lazy || h) {
          (s = !0), u >= 0 ? (n = n.slice(0, u + 1)) : (n = [n[0]]);
          break;
        }
      }
    }
  return n.reduceRight((a, l, c) => {
    let f,
      h = !1,
      v = null,
      b = null;
    r &&
      ((f = o && l.route.id ? o[l.route.id] : void 0),
      (v = l.route.errorElement || vo),
      s &&
        (u < 0 && c === 0
          ? (Sr(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (h = !0),
            (b = null))
          : u === c && ((h = !0), (b = l.route.hydrateFallbackElement || null))));
    let g = t.concat(n.slice(0, c + 1)),
      p = () => {
        let m;
        return (
          f
            ? (m = v)
            : h
              ? (m = b)
              : l.route.Component
                ? (m = d.createElement(l.route.Component, null))
                : l.route.element
                  ? (m = l.route.element)
                  : (m = a),
          d.createElement(bo, {
            match: l,
            routeContext: { outlet: a, matches: g, isDataRoute: r != null },
            children: m,
          })
        );
      };
    return r && (l.route.ErrorBoundary || l.route.errorElement || c === 0)
      ? d.createElement(go, {
          location: r.location,
          revalidation: r.revalidation,
          component: v,
          error: f,
          children: p(),
          routeContext: { outlet: null, matches: g, isDataRoute: !0 },
        })
      : p();
  }, null);
}
function rn(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function So(e) {
  let t = d.useContext(Pe);
  return D(t, rn(e)), t;
}
function wo(e) {
  let t = d.useContext(dt);
  return D(t, rn(e)), t;
}
function Co(e) {
  let t = d.useContext(X);
  return D(t, rn(e)), t;
}
function on(e) {
  let t = Co(e),
    r = t.matches[t.matches.length - 1];
  return D(r.route.id, `${e} can only be used on routes that contain a unique "id"`), r.route.id;
}
function xo() {
  return on("useRouteId");
}
function Oo() {
  var i;
  let e = d.useContext(nn),
    t = wo("useRouteError"),
    r = on("useRouteError");
  return e !== void 0 ? e : (i = t.errors) == null ? void 0 : i[r];
}
function Po() {
  let { router: e } = So("useNavigate"),
    t = on("useNavigate"),
    r = d.useRef(!1);
  return (
    gr(() => {
      r.current = !0;
    }),
    d.useCallback(
      async (n, o = {}) => {
        Z(r.current, vr),
          r.current &&
            (typeof n == "number" ? e.navigate(n) : await e.navigate(n, { fromRouteId: t, ...o }));
      },
      [e, t],
    )
  );
}
var Ln = {};
function Sr(e, t, r) {
  !t && !Ln[e] && ((Ln[e] = !0), Z(!1, r));
}
d.memo(Eo);
function Eo({ routes: e, future: t, state: r }) {
  return yr(e, void 0, r, t);
}
function wc({ to: e, replace: t, state: r, relative: i }) {
  D(Ee(), "<Navigate> may be used only in the context of a <Router> component.");
  let { static: n } = d.useContext(Q);
  Z(
    !n,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.",
  );
  let { matches: o } = d.useContext(X),
    { pathname: s } = ge(),
    u = br(),
    a = tn(e, en(o), s, i === "path"),
    l = JSON.stringify(a);
  return (
    d.useEffect(() => {
      u(JSON.parse(l), { replace: t, state: r, relative: i });
    }, [u, l, i, t, r]),
    null
  );
}
function Cc(e) {
  return po(e.context);
}
function Mo(e) {
  D(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.",
  );
}
function Ro({
  basename: e = "/",
  children: t = null,
  location: r,
  navigationType: i = "POP",
  navigator: n,
  static: o = !1,
}) {
  D(
    !Ee(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.",
  );
  let s = e.replace(/^\/*/, "/"),
    u = d.useMemo(() => ({ basename: s, navigator: n, static: o, future: {} }), [s, n, o]);
  typeof r == "string" && (r = Oe(r));
  let { pathname: a = "/", search: l = "", hash: c = "", state: f = null, key: h = "default" } = r,
    v = d.useMemo(() => {
      let b = ve(a, s);
      return b == null
        ? null
        : { location: { pathname: b, search: l, hash: c, state: f, key: h }, navigationType: i };
    }, [s, a, l, c, f, h, i]);
  return (
    Z(
      v != null,
      `<Router basename="${s}"> is not able to match the URL "${a}${l}${c}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    v == null
      ? null
      : d.createElement(
          Q.Provider,
          { value: u },
          d.createElement(Fe.Provider, { children: t, value: v }),
        )
  );
}
function xc({ children: e, location: t }) {
  return ho(Bt(e), t);
}
function Bt(e, t = []) {
  let r = [];
  return (
    d.Children.forEach(e, (i, n) => {
      if (!d.isValidElement(i)) return;
      let o = [...t, n];
      if (i.type === d.Fragment) {
        r.push.apply(r, Bt(i.props.children, o));
        return;
      }
      D(
        i.type === Mo,
        `[${typeof i.type == "string" ? i.type : i.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        D(!i.props.index || !i.props.children, "An index route cannot have child routes.");
      let s = {
        id: i.props.id || o.join("-"),
        caseSensitive: i.props.caseSensitive,
        element: i.props.element,
        Component: i.props.Component,
        index: i.props.index,
        path: i.props.path,
        loader: i.props.loader,
        action: i.props.action,
        hydrateFallbackElement: i.props.hydrateFallbackElement,
        HydrateFallback: i.props.HydrateFallback,
        errorElement: i.props.errorElement,
        ErrorBoundary: i.props.ErrorBoundary,
        hasErrorBoundary:
          i.props.hasErrorBoundary === !0 ||
          i.props.ErrorBoundary != null ||
          i.props.errorElement != null,
        shouldRevalidate: i.props.shouldRevalidate,
        handle: i.props.handle,
        lazy: i.props.lazy,
      };
      i.props.children && (s.children = Bt(i.props.children, o)), r.push(s);
    }),
    r
  );
}
var Xe = "get",
  Je = "application/x-www-form-urlencoded";
function pt(e) {
  return e != null && typeof e.tagName == "string";
}
function Io(e) {
  return pt(e) && e.tagName.toLowerCase() === "button";
}
function ko(e) {
  return pt(e) && e.tagName.toLowerCase() === "form";
}
function To(e) {
  return pt(e) && e.tagName.toLowerCase() === "input";
}
function Lo(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function Do(e, t) {
  return e.button === 0 && (!t || t === "_self") && !Lo(e);
}
var Be = null;
function Vo() {
  if (Be === null)
    try {
      new FormData(document.createElement("form"), 0), (Be = !1);
    } catch {
      Be = !0;
    }
  return Be;
}
var $o = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function kt(e) {
  return e != null && !$o.has(e)
    ? (Z(
        !1,
        `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Je}"`,
      ),
      null)
    : e;
}
function Fo(e, t) {
  let r, i, n, o, s;
  if (ko(e)) {
    let u = e.getAttribute("action");
    (i = u ? ve(u, t) : null),
      (r = e.getAttribute("method") || Xe),
      (n = kt(e.getAttribute("enctype")) || Je),
      (o = new FormData(e));
  } else if (Io(e) || (To(e) && (e.type === "submit" || e.type === "image"))) {
    let u = e.form;
    if (u == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let a = e.getAttribute("formaction") || u.getAttribute("action");
    if (
      ((i = a ? ve(a, t) : null),
      (r = e.getAttribute("formmethod") || u.getAttribute("method") || Xe),
      (n = kt(e.getAttribute("formenctype")) || kt(u.getAttribute("enctype")) || Je),
      (o = new FormData(u, e)),
      !Vo())
    ) {
      let { name: l, type: c, value: f } = e;
      if (c === "image") {
        let h = l ? `${l}.` : "";
        o.append(`${h}x`, "0"), o.append(`${h}y`, "0");
      } else l && o.append(l, f);
    }
  } else {
    if (pt(e))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    (r = Xe), (i = null), (n = Je), (s = e);
  }
  return (
    o && n === "text/plain" && ((s = o), (o = void 0)),
    { action: i, method: r.toLowerCase(), encType: n, formData: o, body: s }
  );
}
function an(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
async function Ao(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let r = await import(e.module);
    return (t[e.id] = r), r;
  } catch (r) {
    return (
      console.error(`Error loading route module \`${e.module}\`, reloading page...`),
      console.error(r),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function No(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === "preload" && typeof e.imageSrcSet == "string" && typeof e.imageSizes == "string"
      : typeof e.rel == "string" && typeof e.href == "string";
}
async function _o(e, t, r) {
  let i = await Promise.all(
    e.map(async (n) => {
      let o = t.routes[n.route.id];
      if (o) {
        let s = await Ao(o, r);
        return s.links ? s.links() : [];
      }
      return [];
    }),
  );
  return zo(
    i
      .flat(1)
      .filter(No)
      .filter((n) => n.rel === "stylesheet" || n.rel === "preload")
      .map((n) =>
        n.rel === "stylesheet" ? { ...n, rel: "prefetch", as: "style" } : { ...n, rel: "prefetch" },
      ),
  );
}
function Dn(e, t, r, i, n, o) {
  let s = (a, l) => (r[l] ? a.route.id !== r[l].route.id : !0),
    u = (a, l) => {
      var c;
      return (
        r[l].pathname !== a.pathname ||
        (((c = r[l].route.path) == null ? void 0 : c.endsWith("*")) &&
          r[l].params["*"] !== a.params["*"])
      );
    };
  return o === "assets"
    ? t.filter((a, l) => s(a, l) || u(a, l))
    : o === "data"
      ? t.filter((a, l) => {
          var f;
          let c = i.routes[a.route.id];
          if (!c || !c.hasLoader) return !1;
          if (s(a, l) || u(a, l)) return !0;
          if (a.route.shouldRevalidate) {
            let h = a.route.shouldRevalidate({
              currentUrl: new URL(n.pathname + n.search + n.hash, window.origin),
              currentParams: ((f = r[0]) == null ? void 0 : f.params) || {},
              nextUrl: new URL(e, window.origin),
              nextParams: a.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof h == "boolean") return h;
          }
          return !0;
        })
      : [];
}
function Ho(e, t, { includeHydrateFallback: r } = {}) {
  return Bo(
    e
      .map((i) => {
        let n = t.routes[i.route.id];
        if (!n) return [];
        let o = [n.module];
        return (
          n.clientActionModule && (o = o.concat(n.clientActionModule)),
          n.clientLoaderModule && (o = o.concat(n.clientLoaderModule)),
          r && n.hydrateFallbackModule && (o = o.concat(n.hydrateFallbackModule)),
          n.imports && (o = o.concat(n.imports)),
          o
        );
      })
      .flat(1),
  );
}
function Bo(e) {
  return [...new Set(e)];
}
function Uo(e) {
  let t = {},
    r = Object.keys(e).sort();
  for (let i of r) t[i] = e[i];
  return t;
}
function zo(e, t) {
  let r = new Set();
  return (
    new Set(t),
    e.reduce((i, n) => {
      let o = JSON.stringify(Uo(n));
      return r.has(o) || (r.add(o), i.push({ key: o, link: n })), i;
    }, [])
  );
}
function jo(e) {
  let t =
    typeof e == "string"
      ? new URL(e, typeof window > "u" ? "server://singlefetch/" : window.location.origin)
      : e;
  return (
    t.pathname === "/"
      ? (t.pathname = "_root.data")
      : (t.pathname = `${t.pathname.replace(/\/$/, "")}.data`),
    t
  );
}
function Wo() {
  let e = d.useContext(Pe);
  return an(e, "You must render this element inside a <DataRouterContext.Provider> element"), e;
}
function Ko() {
  let e = d.useContext(dt);
  return (
    an(e, "You must render this element inside a <DataRouterStateContext.Provider> element"), e
  );
}
var sn = d.createContext(void 0);
sn.displayName = "FrameworkContext";
function wr() {
  let e = d.useContext(sn);
  return an(e, "You must render this element inside a <HydratedRouter> element"), e;
}
function Yo(e, t) {
  let r = d.useContext(sn),
    [i, n] = d.useState(!1),
    [o, s] = d.useState(!1),
    { onFocus: u, onBlur: a, onMouseEnter: l, onMouseLeave: c, onTouchStart: f } = t,
    h = d.useRef(null);
  d.useEffect(() => {
    if ((e === "render" && s(!0), e === "viewport")) {
      let g = (m) => {
          m.forEach((S) => {
            s(S.isIntersecting);
          });
        },
        p = new IntersectionObserver(g, { threshold: 0.5 });
      return (
        h.current && p.observe(h.current),
        () => {
          p.disconnect();
        }
      );
    }
  }, [e]),
    d.useEffect(() => {
      if (i) {
        let g = setTimeout(() => {
          s(!0);
        }, 100);
        return () => {
          clearTimeout(g);
        };
      }
    }, [i]);
  let v = () => {
      n(!0);
    },
    b = () => {
      n(!1), s(!1);
    };
  return r
    ? e !== "intent"
      ? [o, h, {}]
      : [
          o,
          h,
          {
            onFocus: Re(u, v),
            onBlur: Re(a, b),
            onMouseEnter: Re(l, v),
            onMouseLeave: Re(c, b),
            onTouchStart: Re(f, v),
          },
        ]
    : [!1, h, {}];
}
function Re(e, t) {
  return (r) => {
    e && e(r), r.defaultPrevented || t(r);
  };
}
function Go({ page: e, ...t }) {
  let { router: r } = Wo(),
    i = d.useMemo(() => fr(r.routes, e, r.basename), [r.routes, e, r.basename]);
  return i ? d.createElement(Xo, { page: e, matches: i, ...t }) : null;
}
function qo(e) {
  let { manifest: t, routeModules: r } = wr(),
    [i, n] = d.useState([]);
  return (
    d.useEffect(() => {
      let o = !1;
      return (
        _o(e, t, r).then((s) => {
          o || n(s);
        }),
        () => {
          o = !0;
        }
      );
    }, [e, t, r]),
    i
  );
}
function Xo({ page: e, matches: t, ...r }) {
  let i = ge(),
    { manifest: n, routeModules: o } = wr(),
    { loaderData: s, matches: u } = Ko(),
    a = d.useMemo(() => Dn(e, t, u, n, i, "data"), [e, t, u, n, i]),
    l = d.useMemo(() => Dn(e, t, u, n, i, "assets"), [e, t, u, n, i]),
    c = d.useMemo(() => {
      if (e === i.pathname + i.search + i.hash) return [];
      let v = new Set(),
        b = !1;
      if (
        (t.forEach((p) => {
          var S;
          let m = n.routes[p.route.id];
          !m ||
            !m.hasLoader ||
            ((!a.some((y) => y.route.id === p.route.id) &&
              p.route.id in s &&
              (S = o[p.route.id]) != null &&
              S.shouldRevalidate) ||
            m.hasClientLoader
              ? (b = !0)
              : v.add(p.route.id));
        }),
        v.size === 0)
      )
        return [];
      let g = jo(e);
      return (
        b &&
          v.size > 0 &&
          g.searchParams.set(
            "_routes",
            t
              .filter((p) => v.has(p.route.id))
              .map((p) => p.route.id)
              .join(","),
          ),
        [g.pathname + g.search]
      );
    }, [s, i, n, a, t, e, o]),
    f = d.useMemo(() => Ho(l, n), [l, n]),
    h = qo(l);
  return d.createElement(
    d.Fragment,
    null,
    c.map((v) => d.createElement("link", { key: v, rel: "prefetch", as: "fetch", href: v, ...r })),
    f.map((v) => d.createElement("link", { key: v, rel: "modulepreload", href: v, ...r })),
    h.map(({ key: v, link: b }) => d.createElement("link", { key: v, ...b })),
  );
}
function Jo(...e) {
  return (t) => {
    e.forEach((r) => {
      typeof r == "function" ? r(t) : r != null && (r.current = t);
    });
  };
}
var Cr =
  typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Cr && (window.__reactRouterVersion = "7.2.0");
} catch {}
function Oc({ basename: e, children: t, window: r }) {
  let i = d.useRef();
  i.current == null && (i.current = Ai({ window: r, v5Compat: !0 }));
  let n = i.current,
    [o, s] = d.useState({ action: n.action, location: n.location }),
    u = d.useCallback(
      (a) => {
        d.startTransition(() => s(a));
      },
      [s],
    );
  return (
    d.useLayoutEffect(() => n.listen(u), [n, u]),
    d.createElement(Ro, {
      basename: e,
      children: t,
      location: o.location,
      navigationType: o.action,
      navigator: n,
    })
  );
}
var xr = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Or = d.forwardRef(function (
    {
      onClick: t,
      discover: r = "render",
      prefetch: i = "none",
      relative: n,
      reloadDocument: o,
      replace: s,
      state: u,
      target: a,
      to: l,
      preventScrollReset: c,
      viewTransition: f,
      ...h
    },
    v,
  ) {
    let { basename: b } = d.useContext(Q),
      g = typeof l == "string" && xr.test(l),
      p,
      m = !1;
    if (typeof l == "string" && g && ((p = l), Cr))
      try {
        let I = new URL(window.location.href),
          V = l.startsWith("//") ? new URL(I.protocol + l) : new URL(l),
          B = ve(V.pathname, b);
        V.origin === I.origin && B != null ? (l = B + V.search + V.hash) : (m = !0);
      } catch {
        Z(
          !1,
          `<Link to="${l}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
        );
      }
    let S = lo(l, { relative: n }),
      [y, C, x] = Yo(i, h),
      E = ta(l, {
        replace: s,
        state: u,
        target: a,
        preventScrollReset: c,
        relative: n,
        viewTransition: f,
      });
    function w(I) {
      t && t(I), I.defaultPrevented || E(I);
    }
    let M = d.createElement("a", {
      ...h,
      ...x,
      href: p || S,
      onClick: m || o ? t : w,
      ref: Jo(v, C),
      target: a,
      "data-discover": !g && r === "render" ? "true" : void 0,
    });
    return y && !g ? d.createElement(d.Fragment, null, M, d.createElement(Go, { page: S })) : M;
  });
Or.displayName = "Link";
var Zo = d.forwardRef(function (
  {
    "aria-current": t = "page",
    caseSensitive: r = !1,
    className: i = "",
    end: n = !1,
    style: o,
    to: s,
    viewTransition: u,
    children: a,
    ...l
  },
  c,
) {
  let f = Ae(s, { relative: l.relative }),
    h = ge(),
    v = d.useContext(dt),
    { navigator: b, basename: g } = d.useContext(Q),
    p = v != null && aa(f) && u === !0,
    m = b.encodeLocation ? b.encodeLocation(f).pathname : f.pathname,
    S = h.pathname,
    y = v && v.navigation && v.navigation.location ? v.navigation.location.pathname : null;
  r || ((S = S.toLowerCase()), (y = y ? y.toLowerCase() : null), (m = m.toLowerCase())),
    y && g && (y = ve(y, g) || y);
  const C = m !== "/" && m.endsWith("/") ? m.length - 1 : m.length;
  let x = S === m || (!n && S.startsWith(m) && S.charAt(C) === "/"),
    E = y != null && (y === m || (!n && y.startsWith(m) && y.charAt(m.length) === "/")),
    w = { isActive: x, isPending: E, isTransitioning: p },
    M = x ? t : void 0,
    I;
  typeof i == "function"
    ? (I = i(w))
    : (I = [i, x ? "active" : null, E ? "pending" : null, p ? "transitioning" : null]
        .filter(Boolean)
        .join(" "));
  let V = typeof o == "function" ? o(w) : o;
  return d.createElement(
    Or,
    { ...l, "aria-current": M, className: I, ref: c, style: V, to: s, viewTransition: u },
    typeof a == "function" ? a(w) : a,
  );
});
Zo.displayName = "NavLink";
var Qo = d.forwardRef(
  (
    {
      discover: e = "render",
      fetcherKey: t,
      navigate: r,
      reloadDocument: i,
      replace: n,
      state: o,
      method: s = Xe,
      action: u,
      onSubmit: a,
      relative: l,
      preventScrollReset: c,
      viewTransition: f,
      ...h
    },
    v,
  ) => {
    let b = ia(),
      g = oa(u, { relative: l }),
      p = s.toLowerCase() === "get" ? "get" : "post",
      m = typeof u == "string" && xr.test(u),
      S = (y) => {
        if ((a && a(y), y.defaultPrevented)) return;
        y.preventDefault();
        let C = y.nativeEvent.submitter,
          x = (C == null ? void 0 : C.getAttribute("formmethod")) || s;
        b(C || y.currentTarget, {
          fetcherKey: t,
          method: x,
          navigate: r,
          replace: n,
          state: o,
          relative: l,
          preventScrollReset: c,
          viewTransition: f,
        });
      };
    return d.createElement("form", {
      ref: v,
      method: p,
      action: g,
      onSubmit: i ? a : S,
      ...h,
      "data-discover": !m && e === "render" ? "true" : void 0,
    });
  },
);
Qo.displayName = "Form";
function ea(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Pr(e) {
  let t = d.useContext(Pe);
  return D(t, ea(e)), t;
}
function ta(
  e,
  { target: t, replace: r, state: i, preventScrollReset: n, relative: o, viewTransition: s } = {},
) {
  let u = br(),
    a = ge(),
    l = Ae(e, { relative: o });
  return d.useCallback(
    (c) => {
      if (Do(c, t)) {
        c.preventDefault();
        let f = r !== void 0 ? r : Le(a) === Le(l);
        u(e, { replace: f, state: i, preventScrollReset: n, relative: o, viewTransition: s });
      }
    },
    [a, u, l, r, i, t, e, n, o, s],
  );
}
var na = 0,
  ra = () => `__${String(++na)}__`;
function ia() {
  let { router: e } = Pr("useSubmit"),
    { basename: t } = d.useContext(Q),
    r = xo();
  return d.useCallback(
    async (i, n = {}) => {
      let { action: o, method: s, encType: u, formData: a, body: l } = Fo(i, t);
      if (n.navigate === !1) {
        let c = n.fetcherKey || ra();
        await e.fetch(c, r, n.action || o, {
          preventScrollReset: n.preventScrollReset,
          formData: a,
          body: l,
          formMethod: n.method || s,
          formEncType: n.encType || u,
          flushSync: n.flushSync,
        });
      } else
        await e.navigate(n.action || o, {
          preventScrollReset: n.preventScrollReset,
          formData: a,
          body: l,
          formMethod: n.method || s,
          formEncType: n.encType || u,
          replace: n.replace,
          state: n.state,
          fromRouteId: r,
          flushSync: n.flushSync,
          viewTransition: n.viewTransition,
        });
    },
    [e, t, r],
  );
}
function oa(e, { relative: t } = {}) {
  let { basename: r } = d.useContext(Q),
    i = d.useContext(X);
  D(i, "useFormAction must be used inside a RouteContext");
  let [n] = i.matches.slice(-1),
    o = { ...Ae(e || ".", { relative: t }) },
    s = ge();
  if (e == null) {
    o.search = s.search;
    let u = new URLSearchParams(o.search),
      a = u.getAll("index");
    if (a.some((c) => c === "")) {
      u.delete("index"), a.filter((f) => f).forEach((f) => u.append("index", f));
      let c = u.toString();
      o.search = c ? `?${c}` : "";
    }
  }
  return (
    (!e || e === ".") &&
      n.route.index &&
      (o.search = o.search ? o.search.replace(/^\?/, "?index&") : "?index"),
    r !== "/" && (o.pathname = o.pathname === "/" ? r : ue([r, o.pathname])),
    Le(o)
  );
}
function aa(e, t = {}) {
  let r = d.useContext(mr);
  D(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: i } = Pr("useViewTransitionState"),
    n = Ae(e, { relative: t.relative });
  if (!r.isTransitioning) return !1;
  let o = ve(r.currentLocation.pathname, i) || r.currentLocation.pathname,
    s = ve(r.nextLocation.pathname, i) || r.nextLocation.pathname;
  return nt(n.pathname, s) != null || nt(n.pathname, o) != null;
}
new TextEncoder();
function ye(e) {
  "@babel/helpers - typeof";
  return (
    (ye =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ye(e)
  );
}
function sa(e, t) {
  if (ye(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var i = r.call(e, t);
    if (ye(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Er(e) {
  var t = sa(e, "string");
  return ye(t) == "symbol" ? t : String(t);
}
function Te(e, t, r) {
  return (
    (t = Er(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Vn(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t &&
      (i = i.filter(function (n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })),
      r.push.apply(r, i);
  }
  return r;
}
function P(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Vn(Object(r), !0).forEach(function (i) {
          Te(e, i, r[i]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Vn(Object(r)).forEach(function (i) {
            Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
          });
  }
  return e;
}
function ua(e) {
  if (Array.isArray(e)) return e;
}
function la(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var i,
      n,
      o,
      s,
      u = [],
      a = !0,
      l = !1;
    try {
      if (((o = (r = r.call(e)).next), t === 0)) {
        if (Object(r) !== r) return;
        a = !1;
      } else for (; !(a = (i = o.call(r)).done) && (u.push(i.value), u.length !== t); a = !0);
    } catch (c) {
      (l = !0), (n = c);
    } finally {
      try {
        if (!a && r.return != null && ((s = r.return()), Object(s) !== s)) return;
      } finally {
        if (l) throw n;
      }
    }
    return u;
  }
}
function Ut(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, i = new Array(t); r < t; r++) i[r] = e[r];
  return i;
}
function Mr(e, t) {
  if (e) {
    if (typeof e == "string") return Ut(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Ut(e, t);
  }
}
function ca() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function le(e, t) {
  return ua(e) || la(e, t) || Mr(e, t) || ca();
}
function fe(e, t) {
  if (e == null) return {};
  var r = Ei(e, t),
    i,
    n;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (n = 0; n < o.length; n++)
      (i = o[n]),
        !(t.indexOf(i) >= 0) && Object.prototype.propertyIsEnumerable.call(e, i) && (r[i] = e[i]);
  }
  return r;
}
var fa = [
  "defaultInputValue",
  "defaultMenuIsOpen",
  "defaultValue",
  "inputValue",
  "menuIsOpen",
  "onChange",
  "onInputChange",
  "onMenuClose",
  "onMenuOpen",
  "value",
];
function da(e) {
  var t = e.defaultInputValue,
    r = t === void 0 ? "" : t,
    i = e.defaultMenuIsOpen,
    n = i === void 0 ? !1 : i,
    o = e.defaultValue,
    s = o === void 0 ? null : o,
    u = e.inputValue,
    a = e.menuIsOpen,
    l = e.onChange,
    c = e.onInputChange,
    f = e.onMenuClose,
    h = e.onMenuOpen,
    v = e.value,
    b = fe(e, fa),
    g = d.useState(u !== void 0 ? u : r),
    p = le(g, 2),
    m = p[0],
    S = p[1],
    y = d.useState(a !== void 0 ? a : n),
    C = le(y, 2),
    x = C[0],
    E = C[1],
    w = d.useState(v !== void 0 ? v : s),
    M = le(w, 2),
    I = M[0],
    V = M[1],
    B = d.useCallback(
      function (q, de) {
        typeof l == "function" && l(q, de), V(q);
      },
      [l],
    ),
    z = d.useCallback(
      function (q, de) {
        var pe;
        typeof c == "function" && (pe = c(q, de)), S(pe !== void 0 ? pe : q);
      },
      [c],
    ),
    ie = d.useCallback(
      function () {
        typeof h == "function" && h(), E(!0);
      },
      [h],
    ),
    oe = d.useCallback(
      function () {
        typeof f == "function" && f(), E(!1);
      },
      [f],
    ),
    _ = u !== void 0 ? u : m,
    A = a !== void 0 ? a : x,
    ee = v !== void 0 ? v : I;
  return P(
    P({}, b),
    {},
    {
      inputValue: _,
      menuIsOpen: A,
      onChange: B,
      onInputChange: z,
      onMenuClose: oe,
      onMenuOpen: ie,
      value: ee,
    },
  );
}
function pa(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function $n(e, t) {
  for (var r = 0; r < t.length; r++) {
    var i = t[r];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(e, Er(i.key), i);
  }
}
function ha(e, t, r) {
  return (
    t && $n(e.prototype, t),
    r && $n(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function ma(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && xi(e, t);
}
function rt(e) {
  return (
    (rt = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    rt(e)
  );
}
function Rr() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Rr = function () {
    return !!e;
  })();
}
function va(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ga(e, t) {
  if (t && (ye(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return va(e);
}
function ba(e) {
  var t = Rr();
  return function () {
    var i = rt(e),
      n;
    if (t) {
      var o = rt(this).constructor;
      n = Reflect.construct(i, arguments, o);
    } else n = i.apply(this, arguments);
    return ga(this, n);
  };
}
function ya(e) {
  if (Array.isArray(e)) return Ut(e);
}
function Sa(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function wa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function un(e) {
  return ya(e) || Sa(e) || Mr(e) || wa();
}
function Ca(e) {
  if (e.sheet) return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e) return document.styleSheets[t];
}
function xa(e) {
  var t = document.createElement("style");
  return (
    t.setAttribute("data-emotion", e.key),
    e.nonce !== void 0 && t.setAttribute("nonce", e.nonce),
    t.appendChild(document.createTextNode("")),
    t.setAttribute("data-s", ""),
    t
  );
}
var Oa = (function () {
    function e(r) {
      var i = this;
      (this._insertTag = function (n) {
        var o;
        i.tags.length === 0
          ? i.insertionPoint
            ? (o = i.insertionPoint.nextSibling)
            : i.prepend
              ? (o = i.container.firstChild)
              : (o = i.before)
          : (o = i.tags[i.tags.length - 1].nextSibling),
          i.container.insertBefore(n, o),
          i.tags.push(n);
      }),
        (this.isSpeedy = r.speedy === void 0 ? !0 : r.speedy),
        (this.tags = []),
        (this.ctr = 0),
        (this.nonce = r.nonce),
        (this.key = r.key),
        (this.container = r.container),
        (this.prepend = r.prepend),
        (this.insertionPoint = r.insertionPoint),
        (this.before = null);
    }
    var t = e.prototype;
    return (
      (t.hydrate = function (i) {
        i.forEach(this._insertTag);
      }),
      (t.insert = function (i) {
        this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(xa(this));
        var n = this.tags[this.tags.length - 1];
        if (this.isSpeedy) {
          var o = Ca(n);
          try {
            o.insertRule(i, o.cssRules.length);
          } catch {}
        } else n.appendChild(document.createTextNode(i));
        this.ctr++;
      }),
      (t.flush = function () {
        this.tags.forEach(function (i) {
          return i.parentNode && i.parentNode.removeChild(i);
        }),
          (this.tags = []),
          (this.ctr = 0);
      }),
      e
    );
  })(),
  j = "-ms-",
  it = "-moz-",
  k = "-webkit-",
  Ir = "comm",
  ln = "rule",
  cn = "decl",
  Pa = "@import",
  kr = "@keyframes",
  Ea = "@layer",
  Ma = Math.abs,
  ht = String.fromCharCode,
  Ra = Object.assign;
function Ia(e, t) {
  return U(e, 0) ^ 45
    ? (((((((t << 2) ^ U(e, 0)) << 2) ^ U(e, 1)) << 2) ^ U(e, 2)) << 2) ^ U(e, 3)
    : 0;
}
function Tr(e) {
  return e.trim();
}
function ka(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function T(e, t, r) {
  return e.replace(t, r);
}
function zt(e, t) {
  return e.indexOf(t);
}
function U(e, t) {
  return e.charCodeAt(t) | 0;
}
function De(e, t, r) {
  return e.slice(t, r);
}
function te(e) {
  return e.length;
}
function fn(e) {
  return e.length;
}
function Ue(e, t) {
  return t.push(e), e;
}
function Ta(e, t) {
  return e.map(t).join("");
}
var mt = 1,
  xe = 1,
  Lr = 0,
  W = 0,
  F = 0,
  Me = "";
function vt(e, t, r, i, n, o, s) {
  return {
    value: e,
    root: t,
    parent: r,
    type: i,
    props: n,
    children: o,
    line: mt,
    column: xe,
    length: s,
    return: "",
  };
}
function Ie(e, t) {
  return Ra(vt("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function La() {
  return F;
}
function Da() {
  return (F = W > 0 ? U(Me, --W) : 0), xe--, F === 10 && ((xe = 1), mt--), F;
}
function Y() {
  return (F = W < Lr ? U(Me, W++) : 0), xe++, F === 10 && ((xe = 1), mt++), F;
}
function re() {
  return U(Me, W);
}
function Ze() {
  return W;
}
function Ne(e, t) {
  return De(Me, e, t);
}
function Ve(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function Dr(e) {
  return (mt = xe = 1), (Lr = te((Me = e))), (W = 0), [];
}
function Vr(e) {
  return (Me = ""), e;
}
function Qe(e) {
  return Tr(Ne(W - 1, jt(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Va(e) {
  for (; (F = re()) && F < 33; ) Y();
  return Ve(e) > 2 || Ve(F) > 3 ? "" : " ";
}
function $a(e, t) {
  for (; --t && Y() && !(F < 48 || F > 102 || (F > 57 && F < 65) || (F > 70 && F < 97)); );
  return Ne(e, Ze() + (t < 6 && re() == 32 && Y() == 32));
}
function jt(e) {
  for (; Y(); )
    switch (F) {
      case e:
        return W;
      case 34:
      case 39:
        e !== 34 && e !== 39 && jt(F);
        break;
      case 40:
        e === 41 && jt(e);
        break;
      case 92:
        Y();
        break;
    }
  return W;
}
function Fa(e, t) {
  for (; Y() && e + F !== 57; ) if (e + F === 84 && re() === 47) break;
  return "/*" + Ne(t, W - 1) + "*" + ht(e === 47 ? e : Y());
}
function Aa(e) {
  for (; !Ve(re()); ) Y();
  return Ne(e, W);
}
function Na(e) {
  return Vr(et("", null, null, null, [""], (e = Dr(e)), 0, [0], e));
}
function et(e, t, r, i, n, o, s, u, a) {
  for (
    var l = 0,
      c = 0,
      f = s,
      h = 0,
      v = 0,
      b = 0,
      g = 1,
      p = 1,
      m = 1,
      S = 0,
      y = "",
      C = n,
      x = o,
      E = i,
      w = y;
    p;

  )
    switch (((b = S), (S = Y()))) {
      case 40:
        if (b != 108 && U(w, f - 1) == 58) {
          zt((w += T(Qe(S), "&", "&\f")), "&\f") != -1 && (m = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        w += Qe(S);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        w += Va(b);
        break;
      case 92:
        w += $a(Ze() - 1, 7);
        continue;
      case 47:
        switch (re()) {
          case 42:
          case 47:
            Ue(_a(Fa(Y(), Ze()), t, r), a);
            break;
          default:
            w += "/";
        }
        break;
      case 123 * g:
        u[l++] = te(w) * m;
      case 125 * g:
      case 59:
      case 0:
        switch (S) {
          case 0:
          case 125:
            p = 0;
          case 59 + c:
            m == -1 && (w = T(w, /\f/g, "")),
              v > 0 &&
                te(w) - f &&
                Ue(v > 32 ? An(w + ";", i, r, f - 1) : An(T(w, " ", "") + ";", i, r, f - 2), a);
            break;
          case 59:
            w += ";";
          default:
            if ((Ue((E = Fn(w, t, r, l, c, n, u, y, (C = []), (x = []), f)), o), S === 123))
              if (c === 0) et(w, t, E, E, C, o, f, u, x);
              else
                switch (h === 99 && U(w, 3) === 110 ? 100 : h) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    et(
                      e,
                      E,
                      E,
                      i && Ue(Fn(e, E, E, 0, 0, n, u, y, n, (C = []), f), x),
                      n,
                      x,
                      f,
                      u,
                      i ? C : x,
                    );
                    break;
                  default:
                    et(w, E, E, E, [""], x, 0, u, x);
                }
        }
        (l = c = v = 0), (g = m = 1), (y = w = ""), (f = s);
        break;
      case 58:
        (f = 1 + te(w)), (v = b);
      default:
        if (g < 1) {
          if (S == 123) --g;
          else if (S == 125 && g++ == 0 && Da() == 125) continue;
        }
        switch (((w += ht(S)), S * g)) {
          case 38:
            m = c > 0 ? 1 : ((w += "\f"), -1);
            break;
          case 44:
            (u[l++] = (te(w) - 1) * m), (m = 1);
            break;
          case 64:
            re() === 45 && (w += Qe(Y())), (h = re()), (c = f = te((y = w += Aa(Ze())))), S++;
            break;
          case 45:
            b === 45 && te(w) == 2 && (g = 0);
        }
    }
  return o;
}
function Fn(e, t, r, i, n, o, s, u, a, l, c) {
  for (var f = n - 1, h = n === 0 ? o : [""], v = fn(h), b = 0, g = 0, p = 0; b < i; ++b)
    for (var m = 0, S = De(e, f + 1, (f = Ma((g = s[b])))), y = e; m < v; ++m)
      (y = Tr(g > 0 ? h[m] + " " + S : T(S, /&\f/g, h[m]))) && (a[p++] = y);
  return vt(e, t, r, n === 0 ? ln : u, a, l, c);
}
function _a(e, t, r) {
  return vt(e, t, r, Ir, ht(La()), De(e, 2, -2), 0);
}
function An(e, t, r, i) {
  return vt(e, t, r, cn, De(e, 0, i), De(e, i + 1, -1), i);
}
function Ce(e, t) {
  for (var r = "", i = fn(e), n = 0; n < i; n++) r += t(e[n], n, e, t) || "";
  return r;
}
function Ha(e, t, r, i) {
  switch (e.type) {
    case Ea:
      if (e.children.length) break;
    case Pa:
    case cn:
      return (e.return = e.return || e.value);
    case Ir:
      return "";
    case kr:
      return (e.return = e.value + "{" + Ce(e.children, i) + "}");
    case ln:
      e.value = e.props.join(",");
  }
  return te((r = Ce(e.children, i))) ? (e.return = e.value + "{" + r + "}") : "";
}
function Ba(e) {
  var t = fn(e);
  return function (r, i, n, o) {
    for (var s = "", u = 0; u < t; u++) s += e[u](r, i, n, o) || "";
    return s;
  };
}
function Ua(e) {
  return function (t) {
    t.root || ((t = t.return) && e(t));
  };
}
function za(e) {
  var t = Object.create(null);
  return function (r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var ja = function (t, r, i) {
    for (var n = 0, o = 0; (n = o), (o = re()), n === 38 && o === 12 && (r[i] = 1), !Ve(o); ) Y();
    return Ne(t, W);
  },
  Wa = function (t, r) {
    var i = -1,
      n = 44;
    do
      switch (Ve(n)) {
        case 0:
          n === 38 && re() === 12 && (r[i] = 1), (t[i] += ja(W - 1, r, i));
          break;
        case 2:
          t[i] += Qe(n);
          break;
        case 4:
          if (n === 44) {
            (t[++i] = re() === 58 ? "&\f" : ""), (r[i] = t[i].length);
            break;
          }
        default:
          t[i] += ht(n);
      }
    while ((n = Y()));
    return t;
  },
  Ka = function (t, r) {
    return Vr(Wa(Dr(t), r));
  },
  Nn = new WeakMap(),
  Ya = function (t) {
    if (!(t.type !== "rule" || !t.parent || t.length < 1)) {
      for (
        var r = t.value, i = t.parent, n = t.column === i.column && t.line === i.line;
        i.type !== "rule";

      )
        if (((i = i.parent), !i)) return;
      if (!(t.props.length === 1 && r.charCodeAt(0) !== 58 && !Nn.get(i)) && !n) {
        Nn.set(t, !0);
        for (var o = [], s = Ka(r, o), u = i.props, a = 0, l = 0; a < s.length; a++)
          for (var c = 0; c < u.length; c++, l++)
            t.props[l] = o[a] ? s[a].replace(/&\f/g, u[c]) : u[c] + " " + s[a];
      }
    }
  },
  Ga = function (t) {
    if (t.type === "decl") {
      var r = t.value;
      r.charCodeAt(0) === 108 && r.charCodeAt(2) === 98 && ((t.return = ""), (t.value = ""));
    }
  };
function $r(e, t) {
  switch (Ia(e, t)) {
    case 5103:
      return k + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return k + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return k + e + it + e + j + e + e;
    case 6828:
    case 4268:
      return k + e + j + e + e;
    case 6165:
      return k + e + j + "flex-" + e + e;
    case 5187:
      return k + e + T(e, /(\w+).+(:[^]+)/, k + "box-$1$2" + j + "flex-$1$2") + e;
    case 5443:
      return k + e + j + "flex-item-" + T(e, /flex-|-self/, "") + e;
    case 4675:
      return k + e + j + "flex-line-pack" + T(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return k + e + j + T(e, "shrink", "negative") + e;
    case 5292:
      return k + e + j + T(e, "basis", "preferred-size") + e;
    case 6060:
      return k + "box-" + T(e, "-grow", "") + k + e + j + T(e, "grow", "positive") + e;
    case 4554:
      return k + T(e, /([^-])(transform)/g, "$1" + k + "$2") + e;
    case 6187:
      return T(T(T(e, /(zoom-|grab)/, k + "$1"), /(image-set)/, k + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return T(e, /(image-set\([^]*)/, k + "$1$`$1");
    case 4968:
      return (
        T(
          T(e, /(.+:)(flex-)?(.*)/, k + "box-pack:$3" + j + "flex-pack:$3"),
          /s.+-b[^;]+/,
          "justify",
        ) +
        k +
        e +
        e
      );
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return T(e, /(.+)-inline(.+)/, k + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (te(e) - 1 - t > 6)
        switch (U(e, t + 1)) {
          case 109:
            if (U(e, t + 4) !== 45) break;
          case 102:
            return (
              T(
                e,
                /(.+:)(.+)-([^]+)/,
                "$1" + k + "$2-$3$1" + it + (U(e, t + 3) == 108 ? "$3" : "$2-$3"),
              ) + e
            );
          case 115:
            return ~zt(e, "stretch") ? $r(T(e, "stretch", "fill-available"), t) + e : e;
        }
      break;
    case 4949:
      if (U(e, t + 1) !== 115) break;
    case 6444:
      switch (U(e, te(e) - 3 - (~zt(e, "!important") && 10))) {
        case 107:
          return T(e, ":", ":" + k) + e;
        case 101:
          return (
            T(
              e,
              /(.+:)([^;!]+)(;|!.+)?/,
              "$1" +
                k +
                (U(e, 14) === 45 ? "inline-" : "") +
                "box$3$1" +
                k +
                "$2$3$1" +
                j +
                "$2box$3",
            ) + e
          );
      }
      break;
    case 5936:
      switch (U(e, t + 11)) {
        case 114:
          return k + e + j + T(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return k + e + j + T(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return k + e + j + T(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return k + e + j + e + e;
  }
  return e;
}
var qa = function (t, r, i, n) {
    if (t.length > -1 && !t.return)
      switch (t.type) {
        case cn:
          t.return = $r(t.value, t.length);
          break;
        case kr:
          return Ce([Ie(t, { value: T(t.value, "@", "@" + k) })], n);
        case ln:
          if (t.length)
            return Ta(t.props, function (o) {
              switch (ka(o, /(::plac\w+|:read-\w+)/)) {
                case ":read-only":
                case ":read-write":
                  return Ce([Ie(t, { props: [T(o, /:(read-\w+)/, ":" + it + "$1")] })], n);
                case "::placeholder":
                  return Ce(
                    [
                      Ie(t, { props: [T(o, /:(plac\w+)/, ":" + k + "input-$1")] }),
                      Ie(t, { props: [T(o, /:(plac\w+)/, ":" + it + "$1")] }),
                      Ie(t, { props: [T(o, /:(plac\w+)/, j + "input-$1")] }),
                    ],
                    n,
                  );
              }
              return "";
            });
      }
  },
  Xa = [qa],
  Ja = function (t) {
    var r = t.key;
    if (r === "css") {
      var i = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(i, function (g) {
        var p = g.getAttribute("data-emotion");
        p.indexOf(" ") !== -1 && (document.head.appendChild(g), g.setAttribute("data-s", ""));
      });
    }
    var n = t.stylisPlugins || Xa,
      o = {},
      s,
      u = [];
    (s = t.container || document.head),
      Array.prototype.forEach.call(
        document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
        function (g) {
          for (var p = g.getAttribute("data-emotion").split(" "), m = 1; m < p.length; m++)
            o[p[m]] = !0;
          u.push(g);
        },
      );
    var a,
      l = [Ya, Ga];
    {
      var c,
        f = [
          Ha,
          Ua(function (g) {
            c.insert(g);
          }),
        ],
        h = Ba(l.concat(n, f)),
        v = function (p) {
          return Ce(Na(p), h);
        };
      a = function (p, m, S, y) {
        (c = S), v(p ? p + "{" + m.styles + "}" : m.styles), y && (b.inserted[m.name] = !0);
      };
    }
    var b = {
      key: r,
      sheet: new Oa({
        key: r,
        container: s,
        nonce: t.nonce,
        speedy: t.speedy,
        prepend: t.prepend,
        insertionPoint: t.insertionPoint,
      }),
      nonce: t.nonce,
      inserted: o,
      registered: {},
      insert: a,
    };
    return b.sheet.hydrate(u), b;
  },
  Fr = { exports: {} },
  L = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var H = typeof Symbol == "function" && Symbol.for,
  dn = H ? Symbol.for("react.element") : 60103,
  pn = H ? Symbol.for("react.portal") : 60106,
  gt = H ? Symbol.for("react.fragment") : 60107,
  bt = H ? Symbol.for("react.strict_mode") : 60108,
  yt = H ? Symbol.for("react.profiler") : 60114,
  St = H ? Symbol.for("react.provider") : 60109,
  wt = H ? Symbol.for("react.context") : 60110,
  hn = H ? Symbol.for("react.async_mode") : 60111,
  Ct = H ? Symbol.for("react.concurrent_mode") : 60111,
  xt = H ? Symbol.for("react.forward_ref") : 60112,
  Ot = H ? Symbol.for("react.suspense") : 60113,
  Za = H ? Symbol.for("react.suspense_list") : 60120,
  Pt = H ? Symbol.for("react.memo") : 60115,
  Et = H ? Symbol.for("react.lazy") : 60116,
  Qa = H ? Symbol.for("react.block") : 60121,
  es = H ? Symbol.for("react.fundamental") : 60117,
  ts = H ? Symbol.for("react.responder") : 60118,
  ns = H ? Symbol.for("react.scope") : 60119;
function G(e) {
  if (typeof e == "object" && e !== null) {
    var t = e.$$typeof;
    switch (t) {
      case dn:
        switch (((e = e.type), e)) {
          case hn:
          case Ct:
          case gt:
          case yt:
          case bt:
          case Ot:
            return e;
          default:
            switch (((e = e && e.$$typeof), e)) {
              case wt:
              case xt:
              case Et:
              case Pt:
              case St:
                return e;
              default:
                return t;
            }
        }
      case pn:
        return t;
    }
  }
}
function Ar(e) {
  return G(e) === Ct;
}
L.AsyncMode = hn;
L.ConcurrentMode = Ct;
L.ContextConsumer = wt;
L.ContextProvider = St;
L.Element = dn;
L.ForwardRef = xt;
L.Fragment = gt;
L.Lazy = Et;
L.Memo = Pt;
L.Portal = pn;
L.Profiler = yt;
L.StrictMode = bt;
L.Suspense = Ot;
L.isAsyncMode = function (e) {
  return Ar(e) || G(e) === hn;
};
L.isConcurrentMode = Ar;
L.isContextConsumer = function (e) {
  return G(e) === wt;
};
L.isContextProvider = function (e) {
  return G(e) === St;
};
L.isElement = function (e) {
  return typeof e == "object" && e !== null && e.$$typeof === dn;
};
L.isForwardRef = function (e) {
  return G(e) === xt;
};
L.isFragment = function (e) {
  return G(e) === gt;
};
L.isLazy = function (e) {
  return G(e) === Et;
};
L.isMemo = function (e) {
  return G(e) === Pt;
};
L.isPortal = function (e) {
  return G(e) === pn;
};
L.isProfiler = function (e) {
  return G(e) === yt;
};
L.isStrictMode = function (e) {
  return G(e) === bt;
};
L.isSuspense = function (e) {
  return G(e) === Ot;
};
L.isValidElementType = function (e) {
  return (
    typeof e == "string" ||
    typeof e == "function" ||
    e === gt ||
    e === Ct ||
    e === yt ||
    e === bt ||
    e === Ot ||
    e === Za ||
    (typeof e == "object" &&
      e !== null &&
      (e.$$typeof === Et ||
        e.$$typeof === Pt ||
        e.$$typeof === St ||
        e.$$typeof === wt ||
        e.$$typeof === xt ||
        e.$$typeof === es ||
        e.$$typeof === ts ||
        e.$$typeof === ns ||
        e.$$typeof === Qa))
  );
};
L.typeOf = G;
Fr.exports = L;
var rs = Fr.exports,
  Nr = rs,
  is = { $$typeof: !0, render: !0, defaultProps: !0, displayName: !0, propTypes: !0 },
  os = { $$typeof: !0, compare: !0, defaultProps: !0, displayName: !0, propTypes: !0, type: !0 },
  _r = {};
_r[Nr.ForwardRef] = is;
_r[Nr.Memo] = os;
var as = !0;
function ss(e, t, r) {
  var i = "";
  return (
    r.split(" ").forEach(function (n) {
      e[n] !== void 0 ? t.push(e[n] + ";") : (i += n + " ");
    }),
    i
  );
}
var Hr = function (t, r, i) {
    var n = t.key + "-" + r.name;
    (i === !1 || as === !1) && t.registered[n] === void 0 && (t.registered[n] = r.styles);
  },
  us = function (t, r, i) {
    Hr(t, r, i);
    var n = t.key + "-" + r.name;
    if (t.inserted[r.name] === void 0) {
      var o = r;
      do t.insert(r === o ? "." + n : "", o, t.sheet, !0), (o = o.next);
      while (o !== void 0);
    }
  };
function ls(e) {
  for (var t = 0, r, i = 0, n = e.length; n >= 4; ++i, n -= 4)
    (r =
      (e.charCodeAt(i) & 255) |
      ((e.charCodeAt(++i) & 255) << 8) |
      ((e.charCodeAt(++i) & 255) << 16) |
      ((e.charCodeAt(++i) & 255) << 24)),
      (r = (r & 65535) * 1540483477 + (((r >>> 16) * 59797) << 16)),
      (r ^= r >>> 24),
      (t =
        ((r & 65535) * 1540483477 + (((r >>> 16) * 59797) << 16)) ^
        ((t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)));
  switch (n) {
    case 3:
      t ^= (e.charCodeAt(i + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(i + 1) & 255) << 8;
    case 1:
      (t ^= e.charCodeAt(i) & 255), (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16));
  }
  return (
    (t ^= t >>> 13),
    (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)),
    ((t ^ (t >>> 15)) >>> 0).toString(36)
  );
}
var cs = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1,
  },
  fs = /[A-Z]|^ms/g,
  ds = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
  Br = function (t) {
    return t.charCodeAt(1) === 45;
  },
  _n = function (t) {
    return t != null && typeof t != "boolean";
  },
  Tt = za(function (e) {
    return Br(e) ? e : e.replace(fs, "-$&").toLowerCase();
  }),
  Hn = function (t, r) {
    switch (t) {
      case "animation":
      case "animationName":
        if (typeof r == "string")
          return r.replace(ds, function (i, n, o) {
            return (ne = { name: n, styles: o, next: ne }), n;
          });
    }
    return cs[t] !== 1 && !Br(t) && typeof r == "number" && r !== 0 ? r + "px" : r;
  };
function $e(e, t, r) {
  if (r == null) return "";
  if (r.__emotion_styles !== void 0) return r;
  switch (typeof r) {
    case "boolean":
      return "";
    case "object": {
      if (r.anim === 1) return (ne = { name: r.name, styles: r.styles, next: ne }), r.name;
      if (r.styles !== void 0) {
        var i = r.next;
        if (i !== void 0)
          for (; i !== void 0; ) (ne = { name: i.name, styles: i.styles, next: ne }), (i = i.next);
        var n = r.styles + ";";
        return n;
      }
      return ps(e, t, r);
    }
    case "function": {
      if (e !== void 0) {
        var o = ne,
          s = r(e);
        return (ne = o), $e(e, t, s);
      }
      break;
    }
  }
  return r;
}
function ps(e, t, r) {
  var i = "";
  if (Array.isArray(r)) for (var n = 0; n < r.length; n++) i += $e(e, t, r[n]) + ";";
  else
    for (var o in r) {
      var s = r[o];
      if (typeof s != "object") _n(s) && (i += Tt(o) + ":" + Hn(o, s) + ";");
      else if (Array.isArray(s) && typeof s[0] == "string" && t == null)
        for (var u = 0; u < s.length; u++) _n(s[u]) && (i += Tt(o) + ":" + Hn(o, s[u]) + ";");
      else {
        var a = $e(e, t, s);
        switch (o) {
          case "animation":
          case "animationName": {
            i += Tt(o) + ":" + a + ";";
            break;
          }
          default:
            i += o + "{" + a + "}";
        }
      }
    }
  return i;
}
var Bn = /label:\s*([^\s;\n{]+)\s*(;|$)/g,
  ne,
  Ur = function (t, r, i) {
    if (t.length === 1 && typeof t[0] == "object" && t[0] !== null && t[0].styles !== void 0)
      return t[0];
    var n = !0,
      o = "";
    ne = void 0;
    var s = t[0];
    s == null || s.raw === void 0 ? ((n = !1), (o += $e(i, r, s))) : (o += s[0]);
    for (var u = 1; u < t.length; u++) (o += $e(i, r, t[u])), n && (o += s[u]);
    Bn.lastIndex = 0;
    for (var a = "", l; (l = Bn.exec(o)) !== null; ) a += "-" + l[1];
    var c = ls(o) + a;
    return { name: c, styles: o, next: ne };
  },
  hs = function (t) {
    return t();
  },
  ms = En.useInsertionEffect ? En.useInsertionEffect : !1,
  vs = ms || hs,
  mn = {}.hasOwnProperty,
  zr = d.createContext(typeof HTMLElement < "u" ? Ja({ key: "css" }) : null);
zr.Provider;
var gs = function (t) {
    return d.forwardRef(function (r, i) {
      var n = d.useContext(zr);
      return t(r, n, i);
    });
  },
  bs = d.createContext({}),
  Wt = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__",
  ys = function (t, r) {
    var i = {};
    for (var n in r) mn.call(r, n) && (i[n] = r[n]);
    return (i[Wt] = t), i;
  },
  Ss = function (t) {
    var r = t.cache,
      i = t.serialized,
      n = t.isStringTag;
    return (
      Hr(r, i, n),
      vs(function () {
        return us(r, i, n);
      }),
      null
    );
  },
  ws = gs(function (e, t, r) {
    var i = e.css;
    typeof i == "string" && t.registered[i] !== void 0 && (i = t.registered[i]);
    var n = e[Wt],
      o = [i],
      s = "";
    typeof e.className == "string"
      ? (s = ss(t.registered, o, e.className))
      : e.className != null && (s = e.className + " ");
    var u = Ur(o, void 0, d.useContext(bs));
    s += t.key + "-" + u.name;
    var a = {};
    for (var l in e) mn.call(e, l) && l !== "css" && l !== Wt && (a[l] = e[l]);
    return (
      (a.ref = r),
      (a.className = s),
      d.createElement(
        d.Fragment,
        null,
        d.createElement(Ss, { cache: t, serialized: u, isStringTag: typeof n == "string" }),
        d.createElement(n, a),
      )
    );
  }),
  Cs = ws,
  O = function (t, r) {
    var i = arguments;
    if (r == null || !mn.call(r, "css")) return d.createElement.apply(void 0, i);
    var n = i.length,
      o = new Array(n);
    (o[0] = Cs), (o[1] = ys(t, r));
    for (var s = 2; s < n; s++) o[s] = i[s];
    return d.createElement.apply(null, o);
  };
function vn() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
  return Ur(t);
}
var xs = function () {
  var t = vn.apply(void 0, arguments),
    r = "animation-" + t.name;
  return {
    name: r,
    styles: "@keyframes " + r + "{" + t.styles + "}",
    anim: 1,
    toString: function () {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    },
  };
};
function Os(e, t) {
  return (
    t || (t = e.slice(0)),
    Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }))
  );
}
const Ps = Math.min,
  Es = Math.max,
  ot = Math.round,
  ze = Math.floor,
  at = (e) => ({ x: e, y: e });
function Ms(e) {
  return { ...e, top: e.y, left: e.x, right: e.x + e.width, bottom: e.y + e.height };
}
function jr(e) {
  return Kr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function ce(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Wr(e) {
  var t;
  return (t = (Kr(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function Kr(e) {
  return e instanceof Node || e instanceof ce(e).Node;
}
function Rs(e) {
  return e instanceof Element || e instanceof ce(e).Element;
}
function gn(e) {
  return e instanceof HTMLElement || e instanceof ce(e).HTMLElement;
}
function Un(e) {
  return typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof ce(e).ShadowRoot;
}
function Yr(e) {
  const { overflow: t, overflowX: r, overflowY: i, display: n } = bn(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + r) && !["inline", "contents"].includes(n);
}
function Is() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function ks(e) {
  return ["html", "body", "#document"].includes(jr(e));
}
function bn(e) {
  return ce(e).getComputedStyle(e);
}
function Ts(e) {
  if (jr(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || (Un(e) && e.host) || Wr(e);
  return Un(t) ? t.host : t;
}
function Gr(e) {
  const t = Ts(e);
  return ks(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : gn(t) && Yr(t) ? t : Gr(t);
}
function st(e, t, r) {
  var i;
  t === void 0 && (t = []), r === void 0 && (r = !0);
  const n = Gr(e),
    o = n === ((i = e.ownerDocument) == null ? void 0 : i.body),
    s = ce(n);
  return o
    ? t.concat(
        s,
        s.visualViewport || [],
        Yr(n) ? n : [],
        s.frameElement && r ? st(s.frameElement) : [],
      )
    : t.concat(n, st(n, [], r));
}
function Ls(e) {
  const t = bn(e);
  let r = parseFloat(t.width) || 0,
    i = parseFloat(t.height) || 0;
  const n = gn(e),
    o = n ? e.offsetWidth : r,
    s = n ? e.offsetHeight : i,
    u = ot(r) !== o || ot(i) !== s;
  return u && ((r = o), (i = s)), { width: r, height: i, $: u };
}
function yn(e) {
  return Rs(e) ? e : e.contextElement;
}
function zn(e) {
  const t = yn(e);
  if (!gn(t)) return at(1);
  const r = t.getBoundingClientRect(),
    { width: i, height: n, $: o } = Ls(t);
  let s = (o ? ot(r.width) : r.width) / i,
    u = (o ? ot(r.height) : r.height) / n;
  return (
    (!s || !Number.isFinite(s)) && (s = 1), (!u || !Number.isFinite(u)) && (u = 1), { x: s, y: u }
  );
}
const Ds = at(0);
function Vs(e) {
  const t = ce(e);
  return !Is() || !t.visualViewport
    ? Ds
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function $s(e, t, r) {
  return !1;
}
function jn(e, t, r, i) {
  t === void 0 && (t = !1);
  const n = e.getBoundingClientRect(),
    o = yn(e);
  let s = at(1);
  t && (s = zn(e));
  const u = $s() ? Vs(o) : at(0);
  let a = (n.left + u.x) / s.x,
    l = (n.top + u.y) / s.y,
    c = n.width / s.x,
    f = n.height / s.y;
  if (o) {
    const h = ce(o),
      v = i;
    let b = h,
      g = b.frameElement;
    for (; g && i && v !== b; ) {
      const p = zn(g),
        m = g.getBoundingClientRect(),
        S = bn(g),
        y = m.left + (g.clientLeft + parseFloat(S.paddingLeft)) * p.x,
        C = m.top + (g.clientTop + parseFloat(S.paddingTop)) * p.y;
      (a *= p.x),
        (l *= p.y),
        (c *= p.x),
        (f *= p.y),
        (a += y),
        (l += C),
        (b = ce(g)),
        (g = b.frameElement);
    }
  }
  return Ms({ width: c, height: f, x: a, y: l });
}
function Fs(e, t) {
  let r = null,
    i;
  const n = Wr(e);
  function o() {
    var u;
    clearTimeout(i), (u = r) == null || u.disconnect(), (r = null);
  }
  function s(u, a) {
    u === void 0 && (u = !1), a === void 0 && (a = 1), o();
    const { left: l, top: c, width: f, height: h } = e.getBoundingClientRect();
    if ((u || t(), !f || !h)) return;
    const v = ze(c),
      b = ze(n.clientWidth - (l + f)),
      g = ze(n.clientHeight - (c + h)),
      p = ze(l),
      S = {
        rootMargin: -v + "px " + -b + "px " + -g + "px " + -p + "px",
        threshold: Es(0, Ps(1, a)) || 1,
      };
    let y = !0;
    function C(x) {
      const E = x[0].intersectionRatio;
      if (E !== a) {
        if (!y) return s();
        E
          ? s(!1, E)
          : (i = setTimeout(() => {
              s(!1, 1e-7);
            }, 100));
      }
      y = !1;
    }
    try {
      r = new IntersectionObserver(C, { ...S, root: n.ownerDocument });
    } catch {
      r = new IntersectionObserver(C, S);
    }
    r.observe(e);
  }
  return s(!0), o;
}
function As(e, t, r, i) {
  i === void 0 && (i = {});
  const {
      ancestorScroll: n = !0,
      ancestorResize: o = !0,
      elementResize: s = typeof ResizeObserver == "function",
      layoutShift: u = typeof IntersectionObserver == "function",
      animationFrame: a = !1,
    } = i,
    l = yn(e),
    c = n || o ? [...(l ? st(l) : []), ...st(t)] : [];
  c.forEach((m) => {
    n && m.addEventListener("scroll", r, { passive: !0 }), o && m.addEventListener("resize", r);
  });
  const f = l && u ? Fs(l, r) : null;
  let h = -1,
    v = null;
  s &&
    ((v = new ResizeObserver((m) => {
      let [S] = m;
      S &&
        S.target === l &&
        v &&
        (v.unobserve(t),
        cancelAnimationFrame(h),
        (h = requestAnimationFrame(() => {
          var y;
          (y = v) == null || y.observe(t);
        }))),
        r();
    })),
    l && !a && v.observe(l),
    v.observe(t));
  let b,
    g = a ? jn(e) : null;
  a && p();
  function p() {
    const m = jn(e);
    g && (m.x !== g.x || m.y !== g.y || m.width !== g.width || m.height !== g.height) && r(),
      (g = m),
      (b = requestAnimationFrame(p));
  }
  return (
    r(),
    () => {
      var m;
      c.forEach((S) => {
        n && S.removeEventListener("scroll", r), o && S.removeEventListener("resize", r);
      }),
        f == null || f(),
        (m = v) == null || m.disconnect(),
        (v = null),
        a && cancelAnimationFrame(b);
    }
  );
}
var Kt = d.useLayoutEffect,
  Ns = [
    "className",
    "clearValue",
    "cx",
    "getStyles",
    "getClassNames",
    "getValue",
    "hasValue",
    "isMulti",
    "isRtl",
    "options",
    "selectOption",
    "selectProps",
    "setValue",
    "theme",
  ],
  ut = function () {};
function _s(e, t) {
  return t ? (t[0] === "-" ? e + t : e + "__" + t) : e;
}
function Hs(e, t) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), n = 2; n < r; n++)
    i[n - 2] = arguments[n];
  var o = [].concat(i);
  if (t && e) for (var s in t) t.hasOwnProperty(s) && t[s] && o.push("".concat(_s(e, s)));
  return o
    .filter(function (u) {
      return u;
    })
    .map(function (u) {
      return String(u).trim();
    })
    .join(" ");
}
var Wn = function (t) {
    return qs(t) ? t.filter(Boolean) : ye(t) === "object" && t !== null ? [t] : [];
  },
  qr = function (t) {
    t.className,
      t.clearValue,
      t.cx,
      t.getStyles,
      t.getClassNames,
      t.getValue,
      t.hasValue,
      t.isMulti,
      t.isRtl,
      t.options,
      t.selectOption,
      t.selectProps,
      t.setValue,
      t.theme;
    var r = fe(t, Ns);
    return P({}, r);
  },
  $ = function (t, r, i) {
    var n = t.cx,
      o = t.getStyles,
      s = t.getClassNames,
      u = t.className;
    return { css: o(r, t), className: n(i ?? {}, s(r, t), u) };
  };
function Mt(e) {
  return [document.documentElement, document.body, window].indexOf(e) > -1;
}
function Bs(e) {
  return Mt(e) ? window.innerHeight : e.clientHeight;
}
function Xr(e) {
  return Mt(e) ? window.pageYOffset : e.scrollTop;
}
function lt(e, t) {
  if (Mt(e)) {
    window.scrollTo(0, t);
    return;
  }
  e.scrollTop = t;
}
function Us(e) {
  var t = getComputedStyle(e),
    r = t.position === "absolute",
    i = /(auto|scroll)/;
  if (t.position === "fixed") return document.documentElement;
  for (var n = e; (n = n.parentElement); )
    if (
      ((t = getComputedStyle(n)),
      !(r && t.position === "static") && i.test(t.overflow + t.overflowY + t.overflowX))
    )
      return n;
  return document.documentElement;
}
function zs(e, t, r, i) {
  return r * ((e = e / i - 1) * e * e + 1) + t;
}
function je(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 200,
    i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ut,
    n = Xr(e),
    o = t - n,
    s = 10,
    u = 0;
  function a() {
    u += s;
    var l = zs(u, n, o, r);
    lt(e, l), u < r ? window.requestAnimationFrame(a) : i(e);
  }
  a();
}
function Kn(e, t) {
  var r = e.getBoundingClientRect(),
    i = t.getBoundingClientRect(),
    n = t.offsetHeight / 3;
  i.bottom + n > r.bottom
    ? lt(e, Math.min(t.offsetTop + t.clientHeight - e.offsetHeight + n, e.scrollHeight))
    : i.top - n < r.top && lt(e, Math.max(t.offsetTop - n, 0));
}
function js(e) {
  var t = e.getBoundingClientRect();
  return {
    bottom: t.bottom,
    height: t.height,
    left: t.left,
    right: t.right,
    top: t.top,
    width: t.width,
  };
}
function Yn() {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch {
    return !1;
  }
}
function Ws() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  } catch {
    return !1;
  }
}
var Jr = !1,
  Ks = {
    get passive() {
      return (Jr = !0);
    },
  },
  We = typeof window < "u" ? window : {};
We.addEventListener &&
  We.removeEventListener &&
  (We.addEventListener("p", ut, Ks), We.removeEventListener("p", ut, !1));
var Ys = Jr;
function Gs(e) {
  return e != null;
}
function qs(e) {
  return Array.isArray(e);
}
function Ke(e, t, r) {
  return e ? t : r;
}
var Xs = function (t) {
    for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
      i[n - 1] = arguments[n];
    var o = Object.entries(t).filter(function (s) {
      var u = le(s, 1),
        a = u[0];
      return !i.includes(a);
    });
    return o.reduce(function (s, u) {
      var a = le(u, 2),
        l = a[0],
        c = a[1];
      return (s[l] = c), s;
    }, {});
  },
  Js = ["children", "innerProps"],
  Zs = ["children", "innerProps"];
function Qs(e) {
  var t = e.maxHeight,
    r = e.menuEl,
    i = e.minHeight,
    n = e.placement,
    o = e.shouldScroll,
    s = e.isFixedPosition,
    u = e.controlHeight,
    a = Us(r),
    l = { placement: "bottom", maxHeight: t };
  if (!r || !r.offsetParent) return l;
  var c = a.getBoundingClientRect(),
    f = c.height,
    h = r.getBoundingClientRect(),
    v = h.bottom,
    b = h.height,
    g = h.top,
    p = r.offsetParent.getBoundingClientRect(),
    m = p.top,
    S = s ? window.innerHeight : Bs(a),
    y = Xr(a),
    C = parseInt(getComputedStyle(r).marginBottom, 10),
    x = parseInt(getComputedStyle(r).marginTop, 10),
    E = m - x,
    w = S - g,
    M = E + y,
    I = f - y - g,
    V = v - S + y + C,
    B = y + g - x,
    z = 160;
  switch (n) {
    case "auto":
    case "bottom":
      if (w >= b) return { placement: "bottom", maxHeight: t };
      if (I >= b && !s) return o && je(a, V, z), { placement: "bottom", maxHeight: t };
      if ((!s && I >= i) || (s && w >= i)) {
        o && je(a, V, z);
        var ie = s ? w - C : I - C;
        return { placement: "bottom", maxHeight: ie };
      }
      if (n === "auto" || s) {
        var oe = t,
          _ = s ? E : M;
        return _ >= i && (oe = Math.min(_ - C - u, t)), { placement: "top", maxHeight: oe };
      }
      if (n === "bottom") return o && lt(a, V), { placement: "bottom", maxHeight: t };
      break;
    case "top":
      if (E >= b) return { placement: "top", maxHeight: t };
      if (M >= b && !s) return o && je(a, B, z), { placement: "top", maxHeight: t };
      if ((!s && M >= i) || (s && E >= i)) {
        var A = t;
        return (
          ((!s && M >= i) || (s && E >= i)) && (A = s ? E - x : M - x),
          o && je(a, B, z),
          { placement: "top", maxHeight: A }
        );
      }
      return { placement: "bottom", maxHeight: t };
    default:
      throw new Error('Invalid placement provided "'.concat(n, '".'));
  }
  return l;
}
function eu(e) {
  var t = { bottom: "top", top: "bottom" };
  return e ? t[e] : "bottom";
}
var Zr = function (t) {
    return t === "auto" ? "bottom" : t;
  },
  tu = function (t, r) {
    var i,
      n = t.placement,
      o = t.theme,
      s = o.borderRadius,
      u = o.spacing,
      a = o.colors;
    return P(
      ((i = { label: "menu" }),
      Te(i, eu(n), "100%"),
      Te(i, "position", "absolute"),
      Te(i, "width", "100%"),
      Te(i, "zIndex", 1),
      i),
      r
        ? {}
        : {
            backgroundColor: a.neutral0,
            borderRadius: s,
            boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",
            marginBottom: u.menuGutter,
            marginTop: u.menuGutter,
          },
    );
  },
  Qr = d.createContext(null),
  nu = function (t) {
    var r = t.children,
      i = t.minMenuHeight,
      n = t.maxMenuHeight,
      o = t.menuPlacement,
      s = t.menuPosition,
      u = t.menuShouldScrollIntoView,
      a = t.theme,
      l = d.useContext(Qr) || {},
      c = l.setPortalPlacement,
      f = d.useRef(null),
      h = d.useState(n),
      v = le(h, 2),
      b = v[0],
      g = v[1],
      p = d.useState(null),
      m = le(p, 2),
      S = m[0],
      y = m[1],
      C = a.spacing.controlHeight;
    return (
      Kt(
        function () {
          var x = f.current;
          if (x) {
            var E = s === "fixed",
              w = u && !E,
              M = Qs({
                maxHeight: n,
                menuEl: x,
                minHeight: i,
                placement: o,
                shouldScroll: w,
                isFixedPosition: E,
                controlHeight: C,
              });
            g(M.maxHeight), y(M.placement), c == null || c(M.placement);
          }
        },
        [n, o, s, u, i, c, C],
      ),
      r({ ref: f, placerProps: P(P({}, t), {}, { placement: S || Zr(o), maxHeight: b }) })
    );
  },
  ru = function (t) {
    var r = t.children,
      i = t.innerRef,
      n = t.innerProps;
    return O("div", R({}, $(t, "menu", { menu: !0 }), { ref: i }, n), r);
  },
  iu = ru,
  ou = function (t, r) {
    var i = t.maxHeight,
      n = t.theme.spacing.baseUnit;
    return P(
      { maxHeight: i, overflowY: "auto", position: "relative", WebkitOverflowScrolling: "touch" },
      r ? {} : { paddingBottom: n, paddingTop: n },
    );
  },
  au = function (t) {
    var r = t.children,
      i = t.innerProps,
      n = t.innerRef,
      o = t.isMulti;
    return O(
      "div",
      R({}, $(t, "menuList", { "menu-list": !0, "menu-list--is-multi": o }), { ref: n }, i),
      r,
    );
  },
  ei = function (t, r) {
    var i = t.theme,
      n = i.spacing.baseUnit,
      o = i.colors;
    return P(
      { textAlign: "center" },
      r ? {} : { color: o.neutral40, padding: "".concat(n * 2, "px ").concat(n * 3, "px") },
    );
  },
  su = ei,
  uu = ei,
  lu = function (t) {
    var r = t.children,
      i = r === void 0 ? "No options" : r,
      n = t.innerProps,
      o = fe(t, Js);
    return O(
      "div",
      R(
        {},
        $(P(P({}, o), {}, { children: i, innerProps: n }), "noOptionsMessage", {
          "menu-notice": !0,
          "menu-notice--no-options": !0,
        }),
        n,
      ),
      i,
    );
  },
  cu = function (t) {
    var r = t.children,
      i = r === void 0 ? "Loading..." : r,
      n = t.innerProps,
      o = fe(t, Zs);
    return O(
      "div",
      R(
        {},
        $(P(P({}, o), {}, { children: i, innerProps: n }), "loadingMessage", {
          "menu-notice": !0,
          "menu-notice--loading": !0,
        }),
        n,
      ),
      i,
    );
  },
  fu = function (t) {
    var r = t.rect,
      i = t.offset,
      n = t.position;
    return { left: r.left, position: n, top: i, width: r.width, zIndex: 1 };
  },
  du = function (t) {
    var r = t.appendTo,
      i = t.children,
      n = t.controlElement,
      o = t.innerProps,
      s = t.menuPlacement,
      u = t.menuPosition,
      a = d.useRef(null),
      l = d.useRef(null),
      c = d.useState(Zr(s)),
      f = le(c, 2),
      h = f[0],
      v = f[1],
      b = d.useMemo(function () {
        return { setPortalPlacement: v };
      }, []),
      g = d.useState(null),
      p = le(g, 2),
      m = p[0],
      S = p[1],
      y = d.useCallback(
        function () {
          if (n) {
            var w = js(n),
              M = u === "fixed" ? 0 : window.pageYOffset,
              I = w[h] + M;
            (I !== (m == null ? void 0 : m.offset) ||
              w.left !== (m == null ? void 0 : m.rect.left) ||
              w.width !== (m == null ? void 0 : m.rect.width)) &&
              S({ offset: I, rect: w });
          }
        },
        [
          n,
          u,
          h,
          m == null ? void 0 : m.offset,
          m == null ? void 0 : m.rect.left,
          m == null ? void 0 : m.rect.width,
        ],
      );
    Kt(
      function () {
        y();
      },
      [y],
    );
    var C = d.useCallback(
      function () {
        typeof l.current == "function" && (l.current(), (l.current = null)),
          n &&
            a.current &&
            (l.current = As(n, a.current, y, { elementResize: "ResizeObserver" in window }));
      },
      [n, y],
    );
    Kt(
      function () {
        C();
      },
      [C],
    );
    var x = d.useCallback(
      function (w) {
        (a.current = w), C();
      },
      [C],
    );
    if ((!r && u !== "fixed") || !m) return null;
    var E = O(
      "div",
      R(
        { ref: x },
        $(P(P({}, t), {}, { offset: m.offset, position: u, rect: m.rect }), "menuPortal", {
          "menu-portal": !0,
        }),
        o,
      ),
      i,
    );
    return O(Qr.Provider, { value: b }, r ? Oi.createPortal(E, r) : E);
  },
  pu = function (t) {
    var r = t.isDisabled,
      i = t.isRtl;
    return {
      label: "container",
      direction: i ? "rtl" : void 0,
      pointerEvents: r ? "none" : void 0,
      position: "relative",
    };
  },
  hu = function (t) {
    var r = t.children,
      i = t.innerProps,
      n = t.isDisabled,
      o = t.isRtl;
    return O("div", R({}, $(t, "container", { "--is-disabled": n, "--is-rtl": o }), i), r);
  },
  mu = function (t, r) {
    var i = t.theme.spacing,
      n = t.isMulti,
      o = t.hasValue,
      s = t.selectProps.controlShouldRenderValue;
    return P(
      {
        alignItems: "center",
        display: n && o && s ? "flex" : "grid",
        flex: 1,
        flexWrap: "wrap",
        WebkitOverflowScrolling: "touch",
        position: "relative",
        overflow: "hidden",
      },
      r ? {} : { padding: "".concat(i.baseUnit / 2, "px ").concat(i.baseUnit * 2, "px") },
    );
  },
  vu = function (t) {
    var r = t.children,
      i = t.innerProps,
      n = t.isMulti,
      o = t.hasValue;
    return O(
      "div",
      R(
        {},
        $(t, "valueContainer", {
          "value-container": !0,
          "value-container--is-multi": n,
          "value-container--has-value": o,
        }),
        i,
      ),
      r,
    );
  },
  gu = function () {
    return { alignItems: "center", alignSelf: "stretch", display: "flex", flexShrink: 0 };
  },
  bu = function (t) {
    var r = t.children,
      i = t.innerProps;
    return O("div", R({}, $(t, "indicatorsContainer", { indicators: !0 }), i), r);
  },
  Gn,
  yu = ["size"],
  Su = ["innerProps", "isRtl", "size"],
  wu = {
    name: "8mmkcg",
    styles:
      "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0",
  },
  ti = function (t) {
    var r = t.size,
      i = fe(t, yu);
    return O(
      "svg",
      R(
        {
          height: r,
          width: r,
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          focusable: "false",
          css: wu,
        },
        i,
      ),
    );
  },
  Sn = function (t) {
    return O(
      ti,
      R({ size: 20 }, t),
      O("path", {
        d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z",
      }),
    );
  },
  ni = function (t) {
    return O(
      ti,
      R({ size: 20 }, t),
      O("path", {
        d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z",
      }),
    );
  },
  ri = function (t, r) {
    var i = t.isFocused,
      n = t.theme,
      o = n.spacing.baseUnit,
      s = n.colors;
    return P(
      { label: "indicatorContainer", display: "flex", transition: "color 150ms" },
      r
        ? {}
        : {
            color: i ? s.neutral60 : s.neutral20,
            padding: o * 2,
            ":hover": { color: i ? s.neutral80 : s.neutral40 },
          },
    );
  },
  Cu = ri,
  xu = function (t) {
    var r = t.children,
      i = t.innerProps;
    return O(
      "div",
      R({}, $(t, "dropdownIndicator", { indicator: !0, "dropdown-indicator": !0 }), i),
      r || O(ni, null),
    );
  },
  Ou = ri,
  Pu = function (t) {
    var r = t.children,
      i = t.innerProps;
    return O(
      "div",
      R({}, $(t, "clearIndicator", { indicator: !0, "clear-indicator": !0 }), i),
      r || O(Sn, null),
    );
  },
  Eu = function (t, r) {
    var i = t.isDisabled,
      n = t.theme,
      o = n.spacing.baseUnit,
      s = n.colors;
    return P(
      { label: "indicatorSeparator", alignSelf: "stretch", width: 1 },
      r
        ? {}
        : { backgroundColor: i ? s.neutral10 : s.neutral20, marginBottom: o * 2, marginTop: o * 2 },
    );
  },
  Mu = function (t) {
    var r = t.innerProps;
    return O("span", R({}, r, $(t, "indicatorSeparator", { "indicator-separator": !0 })));
  },
  Ru = xs(
    Gn ||
      (Gn = Os([
        `
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`,
      ])),
  ),
  Iu = function (t, r) {
    var i = t.isFocused,
      n = t.size,
      o = t.theme,
      s = o.colors,
      u = o.spacing.baseUnit;
    return P(
      {
        label: "loadingIndicator",
        display: "flex",
        transition: "color 150ms",
        alignSelf: "center",
        fontSize: n,
        lineHeight: 1,
        marginRight: n,
        textAlign: "center",
        verticalAlign: "middle",
      },
      r ? {} : { color: i ? s.neutral60 : s.neutral20, padding: u * 2 },
    );
  },
  Lt = function (t) {
    var r = t.delay,
      i = t.offset;
    return O("span", {
      css: vn(
        {
          animation: "".concat(Ru, " 1s ease-in-out ").concat(r, "ms infinite;"),
          backgroundColor: "currentColor",
          borderRadius: "1em",
          display: "inline-block",
          marginLeft: i ? "1em" : void 0,
          height: "1em",
          verticalAlign: "top",
          width: "1em",
        },
        "",
        "",
      ),
    });
  },
  ku = function (t) {
    var r = t.innerProps,
      i = t.isRtl,
      n = t.size,
      o = n === void 0 ? 4 : n,
      s = fe(t, Su);
    return O(
      "div",
      R(
        {},
        $(P(P({}, s), {}, { innerProps: r, isRtl: i, size: o }), "loadingIndicator", {
          indicator: !0,
          "loading-indicator": !0,
        }),
        r,
      ),
      O(Lt, { delay: 0, offset: i }),
      O(Lt, { delay: 160, offset: !0 }),
      O(Lt, { delay: 320, offset: !i }),
    );
  },
  Tu = function (t, r) {
    var i = t.isDisabled,
      n = t.isFocused,
      o = t.theme,
      s = o.colors,
      u = o.borderRadius,
      a = o.spacing;
    return P(
      {
        label: "control",
        alignItems: "center",
        cursor: "default",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        minHeight: a.controlHeight,
        outline: "0 !important",
        position: "relative",
        transition: "all 100ms",
      },
      r
        ? {}
        : {
            backgroundColor: i ? s.neutral5 : s.neutral0,
            borderColor: i ? s.neutral10 : n ? s.primary : s.neutral20,
            borderRadius: u,
            borderStyle: "solid",
            borderWidth: 1,
            boxShadow: n ? "0 0 0 1px ".concat(s.primary) : void 0,
            "&:hover": { borderColor: n ? s.primary : s.neutral30 },
          },
    );
  },
  Lu = function (t) {
    var r = t.children,
      i = t.isDisabled,
      n = t.isFocused,
      o = t.innerRef,
      s = t.innerProps,
      u = t.menuIsOpen;
    return O(
      "div",
      R(
        { ref: o },
        $(t, "control", {
          control: !0,
          "control--is-disabled": i,
          "control--is-focused": n,
          "control--menu-is-open": u,
        }),
        s,
        { "aria-disabled": i || void 0 },
      ),
      r,
    );
  },
  Du = Lu,
  Vu = ["data"],
  $u = function (t, r) {
    var i = t.theme.spacing;
    return r ? {} : { paddingBottom: i.baseUnit * 2, paddingTop: i.baseUnit * 2 };
  },
  Fu = function (t) {
    var r = t.children,
      i = t.cx,
      n = t.getStyles,
      o = t.getClassNames,
      s = t.Heading,
      u = t.headingProps,
      a = t.innerProps,
      l = t.label,
      c = t.theme,
      f = t.selectProps;
    return O(
      "div",
      R({}, $(t, "group", { group: !0 }), a),
      O(s, R({}, u, { selectProps: f, theme: c, getStyles: n, getClassNames: o, cx: i }), l),
      O("div", null, r),
    );
  },
  Au = function (t, r) {
    var i = t.theme,
      n = i.colors,
      o = i.spacing;
    return P(
      { label: "group", cursor: "default", display: "block" },
      r
        ? {}
        : {
            color: n.neutral40,
            fontSize: "75%",
            fontWeight: 500,
            marginBottom: "0.25em",
            paddingLeft: o.baseUnit * 3,
            paddingRight: o.baseUnit * 3,
            textTransform: "uppercase",
          },
    );
  },
  Nu = function (t) {
    var r = qr(t);
    r.data;
    var i = fe(r, Vu);
    return O("div", R({}, $(t, "groupHeading", { "group-heading": !0 }), i));
  },
  _u = Fu,
  Hu = ["innerRef", "isDisabled", "isHidden", "inputClassName"],
  Bu = function (t, r) {
    var i = t.isDisabled,
      n = t.value,
      o = t.theme,
      s = o.spacing,
      u = o.colors;
    return P(
      P({ visibility: i ? "hidden" : "visible", transform: n ? "translateZ(0)" : "" }, Uu),
      r
        ? {}
        : {
            margin: s.baseUnit / 2,
            paddingBottom: s.baseUnit / 2,
            paddingTop: s.baseUnit / 2,
            color: u.neutral80,
          },
    );
  },
  ii = {
    gridArea: "1 / 2",
    font: "inherit",
    minWidth: "2px",
    border: 0,
    margin: 0,
    outline: 0,
    padding: 0,
  },
  Uu = {
    flex: "1 1 auto",
    display: "inline-grid",
    gridArea: "1 / 1 / 2 / 3",
    gridTemplateColumns: "0 min-content",
    "&:after": P({ content: 'attr(data-value) " "', visibility: "hidden", whiteSpace: "pre" }, ii),
  },
  zu = function (t) {
    return P(
      { label: "input", color: "inherit", background: 0, opacity: t ? 0 : 1, width: "100%" },
      ii,
    );
  },
  ju = function (t) {
    var r = t.cx,
      i = t.value,
      n = qr(t),
      o = n.innerRef,
      s = n.isDisabled,
      u = n.isHidden,
      a = n.inputClassName,
      l = fe(n, Hu);
    return O(
      "div",
      R({}, $(t, "input", { "input-container": !0 }), { "data-value": i || "" }),
      O("input", R({ className: r({ input: !0 }, a), ref: o, style: zu(u), disabled: s }, l)),
    );
  },
  Wu = ju,
  Ku = function (t, r) {
    var i = t.theme,
      n = i.spacing,
      o = i.borderRadius,
      s = i.colors;
    return P(
      { label: "multiValue", display: "flex", minWidth: 0 },
      r ? {} : { backgroundColor: s.neutral10, borderRadius: o / 2, margin: n.baseUnit / 2 },
    );
  },
  Yu = function (t, r) {
    var i = t.theme,
      n = i.borderRadius,
      o = i.colors,
      s = t.cropWithEllipsis;
    return P(
      {
        overflow: "hidden",
        textOverflow: s || s === void 0 ? "ellipsis" : void 0,
        whiteSpace: "nowrap",
      },
      r
        ? {}
        : { borderRadius: n / 2, color: o.neutral80, fontSize: "85%", padding: 3, paddingLeft: 6 },
    );
  },
  Gu = function (t, r) {
    var i = t.theme,
      n = i.spacing,
      o = i.borderRadius,
      s = i.colors,
      u = t.isFocused;
    return P(
      { alignItems: "center", display: "flex" },
      r
        ? {}
        : {
            borderRadius: o / 2,
            backgroundColor: u ? s.dangerLight : void 0,
            paddingLeft: n.baseUnit,
            paddingRight: n.baseUnit,
            ":hover": { backgroundColor: s.dangerLight, color: s.danger },
          },
    );
  },
  oi = function (t) {
    var r = t.children,
      i = t.innerProps;
    return O("div", i, r);
  },
  qu = oi,
  Xu = oi;
function Ju(e) {
  var t = e.children,
    r = e.innerProps;
  return O("div", R({ role: "button" }, r), t || O(Sn, { size: 14 }));
}
var Zu = function (t) {
    var r = t.children,
      i = t.components,
      n = t.data,
      o = t.innerProps,
      s = t.isDisabled,
      u = t.removeProps,
      a = t.selectProps,
      l = i.Container,
      c = i.Label,
      f = i.Remove;
    return O(
      l,
      {
        data: n,
        innerProps: P(
          P({}, $(t, "multiValue", { "multi-value": !0, "multi-value--is-disabled": s })),
          o,
        ),
        selectProps: a,
      },
      O(
        c,
        {
          data: n,
          innerProps: P({}, $(t, "multiValueLabel", { "multi-value__label": !0 })),
          selectProps: a,
        },
        r,
      ),
      O(f, {
        data: n,
        innerProps: P(
          P({}, $(t, "multiValueRemove", { "multi-value__remove": !0 })),
          {},
          { "aria-label": "Remove ".concat(r || "option") },
          u,
        ),
        selectProps: a,
      }),
    );
  },
  Qu = Zu,
  el = function (t, r) {
    var i = t.isDisabled,
      n = t.isFocused,
      o = t.isSelected,
      s = t.theme,
      u = s.spacing,
      a = s.colors;
    return P(
      {
        label: "option",
        cursor: "default",
        display: "block",
        fontSize: "inherit",
        width: "100%",
        userSelect: "none",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      },
      r
        ? {}
        : {
            backgroundColor: o ? a.primary : n ? a.primary25 : "transparent",
            color: i ? a.neutral20 : o ? a.neutral0 : "inherit",
            padding: "".concat(u.baseUnit * 2, "px ").concat(u.baseUnit * 3, "px"),
            ":active": { backgroundColor: i ? void 0 : o ? a.primary : a.primary50 },
          },
    );
  },
  tl = function (t) {
    var r = t.children,
      i = t.isDisabled,
      n = t.isFocused,
      o = t.isSelected,
      s = t.innerRef,
      u = t.innerProps;
    return O(
      "div",
      R(
        {},
        $(t, "option", {
          option: !0,
          "option--is-disabled": i,
          "option--is-focused": n,
          "option--is-selected": o,
        }),
        { ref: s, "aria-disabled": i },
        u,
      ),
      r,
    );
  },
  nl = tl,
  rl = function (t, r) {
    var i = t.theme,
      n = i.spacing,
      o = i.colors;
    return P(
      { label: "placeholder", gridArea: "1 / 1 / 2 / 3" },
      r ? {} : { color: o.neutral50, marginLeft: n.baseUnit / 2, marginRight: n.baseUnit / 2 },
    );
  },
  il = function (t) {
    var r = t.children,
      i = t.innerProps;
    return O("div", R({}, $(t, "placeholder", { placeholder: !0 }), i), r);
  },
  ol = il,
  al = function (t, r) {
    var i = t.isDisabled,
      n = t.theme,
      o = n.spacing,
      s = n.colors;
    return P(
      {
        label: "singleValue",
        gridArea: "1 / 1 / 2 / 3",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      r
        ? {}
        : {
            color: i ? s.neutral40 : s.neutral80,
            marginLeft: o.baseUnit / 2,
            marginRight: o.baseUnit / 2,
          },
    );
  },
  sl = function (t) {
    var r = t.children,
      i = t.isDisabled,
      n = t.innerProps;
    return O(
      "div",
      R({}, $(t, "singleValue", { "single-value": !0, "single-value--is-disabled": i }), n),
      r,
    );
  },
  ul = sl,
  ll = {
    ClearIndicator: Pu,
    Control: Du,
    DropdownIndicator: xu,
    DownChevron: ni,
    CrossIcon: Sn,
    Group: _u,
    GroupHeading: Nu,
    IndicatorsContainer: bu,
    IndicatorSeparator: Mu,
    Input: Wu,
    LoadingIndicator: ku,
    Menu: iu,
    MenuList: au,
    MenuPortal: du,
    LoadingMessage: cu,
    NoOptionsMessage: lu,
    MultiValue: Qu,
    MultiValueContainer: qu,
    MultiValueLabel: Xu,
    MultiValueRemove: Ju,
    Option: nl,
    Placeholder: ol,
    SelectContainer: hu,
    SingleValue: ul,
    ValueContainer: vu,
  },
  cl = function (t) {
    return P(P({}, ll), t.components);
  },
  qn =
    Number.isNaN ||
    function (t) {
      return typeof t == "number" && t !== t;
    };
function fl(e, t) {
  return !!(e === t || (qn(e) && qn(t)));
}
function dl(e, t) {
  if (e.length !== t.length) return !1;
  for (var r = 0; r < e.length; r++) if (!fl(e[r], t[r])) return !1;
  return !0;
}
function pl(e, t) {
  t === void 0 && (t = dl);
  var r = null;
  function i() {
    for (var n = [], o = 0; o < arguments.length; o++) n[o] = arguments[o];
    if (r && r.lastThis === this && t(n, r.lastArgs)) return r.lastResult;
    var s = e.apply(this, n);
    return (r = { lastResult: s, lastArgs: n, lastThis: this }), s;
  }
  return (
    (i.clear = function () {
      r = null;
    }),
    i
  );
}
var hl = {
    name: "7pg0cj-a11yText",
    styles:
      "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap",
  },
  ml = function (t) {
    return O("span", R({ css: hl }, t));
  },
  Xn = ml,
  vl = {
    guidance: function (t) {
      var r = t.isSearchable,
        i = t.isMulti,
        n = t.tabSelectsValue,
        o = t.context,
        s = t.isInitialFocus;
      switch (o) {
        case "menu":
          return "Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu".concat(
            n ? ", press Tab to select the option and exit the menu" : "",
            ".",
          );
        case "input":
          return s
            ? ""
                .concat(t["aria-label"] || "Select", " is focused ")
                .concat(r ? ",type to refine list" : "", ", press Down to open the menu, ")
                .concat(i ? " press left to focus selected values" : "")
            : "";
        case "value":
          return "Use left and right to toggle between focused values, press Backspace to remove the currently focused value";
        default:
          return "";
      }
    },
    onChange: function (t) {
      var r = t.action,
        i = t.label,
        n = i === void 0 ? "" : i,
        o = t.labels,
        s = t.isDisabled;
      switch (r) {
        case "deselect-option":
        case "pop-value":
        case "remove-value":
          return "option ".concat(n, ", deselected.");
        case "clear":
          return "All selected options have been cleared.";
        case "initial-input-focus":
          return "option".concat(o.length > 1 ? "s" : "", " ").concat(o.join(","), ", selected.");
        case "select-option":
          return s
            ? "option ".concat(n, " is disabled. Select another option.")
            : "option ".concat(n, ", selected.");
        default:
          return "";
      }
    },
    onFocus: function (t) {
      var r = t.context,
        i = t.focused,
        n = t.options,
        o = t.label,
        s = o === void 0 ? "" : o,
        u = t.selectValue,
        a = t.isDisabled,
        l = t.isSelected,
        c = t.isAppleDevice,
        f = function (g, p) {
          return g && g.length ? "".concat(g.indexOf(p) + 1, " of ").concat(g.length) : "";
        };
      if (r === "value" && u) return "value ".concat(s, " focused, ").concat(f(u, i), ".");
      if (r === "menu" && c) {
        var h = a ? " disabled" : "",
          v = "".concat(l ? " selected" : "").concat(h);
        return "".concat(s).concat(v, ", ").concat(f(n, i), ".");
      }
      return "";
    },
    onFilter: function (t) {
      var r = t.inputValue,
        i = t.resultsMessage;
      return "".concat(i).concat(r ? " for search term " + r : "", ".");
    },
  },
  gl = function (t) {
    var r = t.ariaSelection,
      i = t.focusedOption,
      n = t.focusedValue,
      o = t.focusableOptions,
      s = t.isFocused,
      u = t.selectValue,
      a = t.selectProps,
      l = t.id,
      c = t.isAppleDevice,
      f = a.ariaLiveMessages,
      h = a.getOptionLabel,
      v = a.inputValue,
      b = a.isMulti,
      g = a.isOptionDisabled,
      p = a.isSearchable,
      m = a.menuIsOpen,
      S = a.options,
      y = a.screenReaderStatus,
      C = a.tabSelectsValue,
      x = a.isLoading,
      E = a["aria-label"],
      w = a["aria-live"],
      M = d.useMemo(
        function () {
          return P(P({}, vl), f || {});
        },
        [f],
      ),
      I = d.useMemo(
        function () {
          var _ = "";
          if (r && M.onChange) {
            var A = r.option,
              ee = r.options,
              q = r.removedValue,
              de = r.removedValues,
              pe = r.value,
              _e = function (se) {
                return Array.isArray(se) ? null : se;
              },
              N = q || A || _e(pe),
              K = N ? h(N) : "",
              ae = ee || de || void 0,
              he = ae ? ae.map(h) : [],
              J = P({ isDisabled: N && g(N, u), label: K, labels: he }, r);
            _ = M.onChange(J);
          }
          return _;
        },
        [r, M, g, u, h],
      ),
      V = d.useMemo(
        function () {
          var _ = "",
            A = i || n,
            ee = !!(i && u && u.includes(i));
          if (A && M.onFocus) {
            var q = {
              focused: A,
              label: h(A),
              isDisabled: g(A, u),
              isSelected: ee,
              options: o,
              context: A === i ? "menu" : "value",
              selectValue: u,
              isAppleDevice: c,
            };
            _ = M.onFocus(q);
          }
          return _;
        },
        [i, n, h, g, M, o, u, c],
      ),
      B = d.useMemo(
        function () {
          var _ = "";
          if (m && S.length && !x && M.onFilter) {
            var A = y({ count: o.length });
            _ = M.onFilter({ inputValue: v, resultsMessage: A });
          }
          return _;
        },
        [o, v, m, M, S, y, x],
      ),
      z = (r == null ? void 0 : r.action) === "initial-input-focus",
      ie = d.useMemo(
        function () {
          var _ = "";
          if (M.guidance) {
            var A = n ? "value" : m ? "menu" : "input";
            _ = M.guidance({
              "aria-label": E,
              context: A,
              isDisabled: i && g(i, u),
              isMulti: b,
              isSearchable: p,
              tabSelectsValue: C,
              isInitialFocus: z,
            });
          }
          return _;
        },
        [E, i, n, b, g, p, m, M, u, C, z],
      ),
      oe = O(
        d.Fragment,
        null,
        O("span", { id: "aria-selection" }, I),
        O("span", { id: "aria-focused" }, V),
        O("span", { id: "aria-results" }, B),
        O("span", { id: "aria-guidance" }, ie),
      );
    return O(
      d.Fragment,
      null,
      O(Xn, { id: l }, z && oe),
      O(
        Xn,
        { "aria-live": w, "aria-atomic": "false", "aria-relevant": "additions text", role: "log" },
        s && !z && oe,
      ),
    );
  },
  bl = gl,
  Yt = [
    { base: "A", letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ" },
    { base: "AA", letters: "Ꜳ" },
    { base: "AE", letters: "ÆǼǢ" },
    { base: "AO", letters: "Ꜵ" },
    { base: "AU", letters: "Ꜷ" },
    { base: "AV", letters: "ꜸꜺ" },
    { base: "AY", letters: "Ꜽ" },
    { base: "B", letters: "BⒷＢḂḄḆɃƂƁ" },
    { base: "C", letters: "CⒸＣĆĈĊČÇḈƇȻꜾ" },
    { base: "D", letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ" },
    { base: "DZ", letters: "ǱǄ" },
    { base: "Dz", letters: "ǲǅ" },
    { base: "E", letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ" },
    { base: "F", letters: "FⒻＦḞƑꝻ" },
    { base: "G", letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ" },
    { base: "H", letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ" },
    { base: "I", letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ" },
    { base: "J", letters: "JⒿＪĴɈ" },
    { base: "K", letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ" },
    { base: "L", letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ" },
    { base: "LJ", letters: "Ǉ" },
    { base: "Lj", letters: "ǈ" },
    { base: "M", letters: "MⓂＭḾṀṂⱮƜ" },
    { base: "N", letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ" },
    { base: "NJ", letters: "Ǌ" },
    { base: "Nj", letters: "ǋ" },
    { base: "O", letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ" },
    { base: "OI", letters: "Ƣ" },
    { base: "OO", letters: "Ꝏ" },
    { base: "OU", letters: "Ȣ" },
    { base: "P", letters: "PⓅＰṔṖƤⱣꝐꝒꝔ" },
    { base: "Q", letters: "QⓆＱꝖꝘɊ" },
    { base: "R", letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ" },
    { base: "S", letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ" },
    { base: "T", letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ" },
    { base: "TZ", letters: "Ꜩ" },
    { base: "U", letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ" },
    { base: "V", letters: "VⓋＶṼṾƲꝞɅ" },
    { base: "VY", letters: "Ꝡ" },
    { base: "W", letters: "WⓌＷẀẂŴẆẄẈⱲ" },
    { base: "X", letters: "XⓍＸẊẌ" },
    { base: "Y", letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ" },
    { base: "Z", letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ" },
    { base: "a", letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ" },
    { base: "aa", letters: "ꜳ" },
    { base: "ae", letters: "æǽǣ" },
    { base: "ao", letters: "ꜵ" },
    { base: "au", letters: "ꜷ" },
    { base: "av", letters: "ꜹꜻ" },
    { base: "ay", letters: "ꜽ" },
    { base: "b", letters: "bⓑｂḃḅḇƀƃɓ" },
    { base: "c", letters: "cⓒｃćĉċčçḉƈȼꜿↄ" },
    { base: "d", letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ" },
    { base: "dz", letters: "ǳǆ" },
    { base: "e", letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ" },
    { base: "f", letters: "fⓕｆḟƒꝼ" },
    { base: "g", letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ" },
    { base: "h", letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ" },
    { base: "hv", letters: "ƕ" },
    { base: "i", letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı" },
    { base: "j", letters: "jⓙｊĵǰɉ" },
    { base: "k", letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ" },
    { base: "l", letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ" },
    { base: "lj", letters: "ǉ" },
    { base: "m", letters: "mⓜｍḿṁṃɱɯ" },
    { base: "n", letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ" },
    { base: "nj", letters: "ǌ" },
    { base: "o", letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ" },
    { base: "oi", letters: "ƣ" },
    { base: "ou", letters: "ȣ" },
    { base: "oo", letters: "ꝏ" },
    { base: "p", letters: "pⓟｐṕṗƥᵽꝑꝓꝕ" },
    { base: "q", letters: "qⓠｑɋꝗꝙ" },
    { base: "r", letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ" },
    { base: "s", letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ" },
    { base: "t", letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ" },
    { base: "tz", letters: "ꜩ" },
    { base: "u", letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ" },
    { base: "v", letters: "vⓥｖṽṿʋꝟʌ" },
    { base: "vy", letters: "ꝡ" },
    { base: "w", letters: "wⓦｗẁẃŵẇẅẘẉⱳ" },
    { base: "x", letters: "xⓧｘẋẍ" },
    { base: "y", letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ" },
    { base: "z", letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ" },
  ],
  yl = new RegExp(
    "[" +
      Yt.map(function (e) {
        return e.letters;
      }).join("") +
      "]",
    "g",
  ),
  ai = {};
for (var Dt = 0; Dt < Yt.length; Dt++)
  for (var Vt = Yt[Dt], $t = 0; $t < Vt.letters.length; $t++) ai[Vt.letters[$t]] = Vt.base;
var si = function (t) {
    return t.replace(yl, function (r) {
      return ai[r];
    });
  },
  Sl = pl(si),
  Jn = function (t) {
    return t.replace(/^\s+|\s+$/g, "");
  },
  wl = function (t) {
    return "".concat(t.label, " ").concat(t.value);
  },
  Cl = function (t) {
    return function (r, i) {
      if (r.data.__isNew__) return !0;
      var n = P(
          { ignoreCase: !0, ignoreAccents: !0, stringify: wl, trim: !0, matchFrom: "any" },
          t,
        ),
        o = n.ignoreCase,
        s = n.ignoreAccents,
        u = n.stringify,
        a = n.trim,
        l = n.matchFrom,
        c = a ? Jn(i) : i,
        f = a ? Jn(u(r)) : u(r);
      return (
        o && ((c = c.toLowerCase()), (f = f.toLowerCase())),
        s && ((c = Sl(c)), (f = si(f))),
        l === "start" ? f.substr(0, c.length) === c : f.indexOf(c) > -1
      );
    };
  },
  xl = ["innerRef"];
function Ol(e) {
  var t = e.innerRef,
    r = fe(e, xl),
    i = Xs(r, "onExited", "in", "enter", "exit", "appear");
  return O(
    "input",
    R({ ref: t }, i, {
      css: vn(
        {
          label: "dummyInput",
          background: 0,
          border: 0,
          caretColor: "transparent",
          fontSize: "inherit",
          gridArea: "1 / 1 / 2 / 3",
          outline: 0,
          padding: 0,
          width: 1,
          color: "transparent",
          left: -100,
          opacity: 0,
          position: "relative",
          transform: "scale(.01)",
        },
        "",
        "",
      ),
    }),
  );
}
var Pl = function (t) {
  t.cancelable && t.preventDefault(), t.stopPropagation();
};
function El(e) {
  var t = e.isEnabled,
    r = e.onBottomArrive,
    i = e.onBottomLeave,
    n = e.onTopArrive,
    o = e.onTopLeave,
    s = d.useRef(!1),
    u = d.useRef(!1),
    a = d.useRef(0),
    l = d.useRef(null),
    c = d.useCallback(
      function (p, m) {
        if (l.current !== null) {
          var S = l.current,
            y = S.scrollTop,
            C = S.scrollHeight,
            x = S.clientHeight,
            E = l.current,
            w = m > 0,
            M = C - x - y,
            I = !1;
          M > m && s.current && (i && i(p), (s.current = !1)),
            w && u.current && (o && o(p), (u.current = !1)),
            w && m > M
              ? (r && !s.current && r(p), (E.scrollTop = C), (I = !0), (s.current = !0))
              : !w &&
                -m > y &&
                (n && !u.current && n(p), (E.scrollTop = 0), (I = !0), (u.current = !0)),
            I && Pl(p);
        }
      },
      [r, i, n, o],
    ),
    f = d.useCallback(
      function (p) {
        c(p, p.deltaY);
      },
      [c],
    ),
    h = d.useCallback(function (p) {
      a.current = p.changedTouches[0].clientY;
    }, []),
    v = d.useCallback(
      function (p) {
        var m = a.current - p.changedTouches[0].clientY;
        c(p, m);
      },
      [c],
    ),
    b = d.useCallback(
      function (p) {
        if (p) {
          var m = Ys ? { passive: !1 } : !1;
          p.addEventListener("wheel", f, m),
            p.addEventListener("touchstart", h, m),
            p.addEventListener("touchmove", v, m);
        }
      },
      [v, h, f],
    ),
    g = d.useCallback(
      function (p) {
        p &&
          (p.removeEventListener("wheel", f, !1),
          p.removeEventListener("touchstart", h, !1),
          p.removeEventListener("touchmove", v, !1));
      },
      [v, h, f],
    );
  return (
    d.useEffect(
      function () {
        if (t) {
          var p = l.current;
          return (
            b(p),
            function () {
              g(p);
            }
          );
        }
      },
      [t, b, g],
    ),
    function (p) {
      l.current = p;
    }
  );
}
var Zn = ["boxSizing", "height", "overflow", "paddingRight", "position"],
  Qn = { boxSizing: "border-box", overflow: "hidden", position: "relative", height: "100%" };
function er(e) {
  e.preventDefault();
}
function tr(e) {
  e.stopPropagation();
}
function nr() {
  var e = this.scrollTop,
    t = this.scrollHeight,
    r = e + this.offsetHeight;
  e === 0 ? (this.scrollTop = 1) : r === t && (this.scrollTop = e - 1);
}
function rr() {
  return "ontouchstart" in window || navigator.maxTouchPoints;
}
var ir = !!(typeof window < "u" && window.document && window.document.createElement),
  ke = 0,
  Se = { capture: !1, passive: !1 };
function Ml(e) {
  var t = e.isEnabled,
    r = e.accountForScrollbars,
    i = r === void 0 ? !0 : r,
    n = d.useRef({}),
    o = d.useRef(null),
    s = d.useCallback(
      function (a) {
        if (ir) {
          var l = document.body,
            c = l && l.style;
          if (
            (i &&
              Zn.forEach(function (b) {
                var g = c && c[b];
                n.current[b] = g;
              }),
            i && ke < 1)
          ) {
            var f = parseInt(n.current.paddingRight, 10) || 0,
              h = document.body ? document.body.clientWidth : 0,
              v = window.innerWidth - h + f || 0;
            Object.keys(Qn).forEach(function (b) {
              var g = Qn[b];
              c && (c[b] = g);
            }),
              c && (c.paddingRight = "".concat(v, "px"));
          }
          l &&
            rr() &&
            (l.addEventListener("touchmove", er, Se),
            a &&
              (a.addEventListener("touchstart", nr, Se), a.addEventListener("touchmove", tr, Se))),
            (ke += 1);
        }
      },
      [i],
    ),
    u = d.useCallback(
      function (a) {
        if (ir) {
          var l = document.body,
            c = l && l.style;
          (ke = Math.max(ke - 1, 0)),
            i &&
              ke < 1 &&
              Zn.forEach(function (f) {
                var h = n.current[f];
                c && (c[f] = h);
              }),
            l &&
              rr() &&
              (l.removeEventListener("touchmove", er, Se),
              a &&
                (a.removeEventListener("touchstart", nr, Se),
                a.removeEventListener("touchmove", tr, Se)));
        }
      },
      [i],
    );
  return (
    d.useEffect(
      function () {
        if (t) {
          var a = o.current;
          return (
            s(a),
            function () {
              u(a);
            }
          );
        }
      },
      [t, s, u],
    ),
    function (a) {
      o.current = a;
    }
  );
}
var Rl = function (t) {
    var r = t.target;
    return r.ownerDocument.activeElement && r.ownerDocument.activeElement.blur();
  },
  Il = { name: "1kfdb0e", styles: "position:fixed;left:0;bottom:0;right:0;top:0" };
function kl(e) {
  var t = e.children,
    r = e.lockEnabled,
    i = e.captureEnabled,
    n = i === void 0 ? !0 : i,
    o = e.onBottomArrive,
    s = e.onBottomLeave,
    u = e.onTopArrive,
    a = e.onTopLeave,
    l = El({ isEnabled: n, onBottomArrive: o, onBottomLeave: s, onTopArrive: u, onTopLeave: a }),
    c = Ml({ isEnabled: r }),
    f = function (v) {
      l(v), c(v);
    };
  return O(d.Fragment, null, r && O("div", { onClick: Rl, css: Il }), t(f));
}
var Tl = {
    name: "1a0ro4n-requiredInput",
    styles:
      "label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%",
  },
  Ll = function (t) {
    var r = t.name,
      i = t.onFocus;
    return O("input", {
      required: !0,
      name: r,
      tabIndex: -1,
      "aria-hidden": "true",
      onFocus: i,
      css: Tl,
      value: "",
      onChange: function () {},
    });
  },
  Dl = Ll;
function wn(e) {
  var t;
  return typeof window < "u" && window.navigator != null
    ? e.test(
        ((t = window.navigator.userAgentData) === null || t === void 0 ? void 0 : t.platform) ||
          window.navigator.platform,
      )
    : !1;
}
function Vl() {
  return wn(/^iPhone/i);
}
function ui() {
  return wn(/^Mac/i);
}
function $l() {
  return wn(/^iPad/i) || (ui() && navigator.maxTouchPoints > 1);
}
function Fl() {
  return Vl() || $l();
}
function Al() {
  return ui() || Fl();
}
var Nl = function (t) {
    return t.label;
  },
  _l = function (t) {
    return t.label;
  },
  Hl = function (t) {
    return t.value;
  },
  Bl = function (t) {
    return !!t.isDisabled;
  },
  Ul = {
    clearIndicator: Ou,
    container: pu,
    control: Tu,
    dropdownIndicator: Cu,
    group: $u,
    groupHeading: Au,
    indicatorsContainer: gu,
    indicatorSeparator: Eu,
    input: Bu,
    loadingIndicator: Iu,
    loadingMessage: uu,
    menu: tu,
    menuList: ou,
    menuPortal: fu,
    multiValue: Ku,
    multiValueLabel: Yu,
    multiValueRemove: Gu,
    noOptionsMessage: su,
    option: el,
    placeholder: rl,
    singleValue: al,
    valueContainer: mu,
  },
  zl = {
    primary: "#2684FF",
    primary75: "#4C9AFF",
    primary50: "#B2D4FF",
    primary25: "#DEEBFF",
    danger: "#DE350B",
    dangerLight: "#FFBDAD",
    neutral0: "hsl(0, 0%, 100%)",
    neutral5: "hsl(0, 0%, 95%)",
    neutral10: "hsl(0, 0%, 90%)",
    neutral20: "hsl(0, 0%, 80%)",
    neutral30: "hsl(0, 0%, 70%)",
    neutral40: "hsl(0, 0%, 60%)",
    neutral50: "hsl(0, 0%, 50%)",
    neutral60: "hsl(0, 0%, 40%)",
    neutral70: "hsl(0, 0%, 30%)",
    neutral80: "hsl(0, 0%, 20%)",
    neutral90: "hsl(0, 0%, 10%)",
  },
  jl = 4,
  li = 4,
  Wl = 38,
  Kl = li * 2,
  Yl = { baseUnit: li, controlHeight: Wl, menuGutter: Kl },
  Ft = { borderRadius: jl, colors: zl, spacing: Yl },
  Gl = {
    "aria-live": "polite",
    backspaceRemovesValue: !0,
    blurInputOnSelect: Yn(),
    captureMenuScroll: !Yn(),
    classNames: {},
    closeMenuOnSelect: !0,
    closeMenuOnScroll: !1,
    components: {},
    controlShouldRenderValue: !0,
    escapeClearsValue: !1,
    filterOption: Cl(),
    formatGroupLabel: Nl,
    getOptionLabel: _l,
    getOptionValue: Hl,
    isDisabled: !1,
    isLoading: !1,
    isMulti: !1,
    isRtl: !1,
    isSearchable: !0,
    isOptionDisabled: Bl,
    loadingMessage: function () {
      return "Loading...";
    },
    maxMenuHeight: 300,
    minMenuHeight: 140,
    menuIsOpen: !1,
    menuPlacement: "bottom",
    menuPosition: "absolute",
    menuShouldBlockScroll: !1,
    menuShouldScrollIntoView: !Ws(),
    noOptionsMessage: function () {
      return "No options";
    },
    openMenuOnFocus: !1,
    openMenuOnClick: !0,
    options: [],
    pageSize: 5,
    placeholder: "Select...",
    screenReaderStatus: function (t) {
      var r = t.count;
      return "".concat(r, " result").concat(r !== 1 ? "s" : "", " available");
    },
    styles: {},
    tabIndex: 0,
    tabSelectsValue: !0,
    unstyled: !1,
  };
function or(e, t, r, i) {
  var n = di(e, t, r),
    o = pi(e, t, r),
    s = fi(e, t),
    u = ct(e, t);
  return { type: "option", data: t, isDisabled: n, isSelected: o, label: s, value: u, index: i };
}
function tt(e, t) {
  return e.options
    .map(function (r, i) {
      if ("options" in r) {
        var n = r.options
          .map(function (s, u) {
            return or(e, s, t, u);
          })
          .filter(function (s) {
            return sr(e, s);
          });
        return n.length > 0 ? { type: "group", data: r, options: n, index: i } : void 0;
      }
      var o = or(e, r, t, i);
      return sr(e, o) ? o : void 0;
    })
    .filter(Gs);
}
function ci(e) {
  return e.reduce(function (t, r) {
    return (
      r.type === "group"
        ? t.push.apply(
            t,
            un(
              r.options.map(function (i) {
                return i.data;
              }),
            ),
          )
        : t.push(r.data),
      t
    );
  }, []);
}
function ar(e, t) {
  return e.reduce(function (r, i) {
    return (
      i.type === "group"
        ? r.push.apply(
            r,
            un(
              i.options.map(function (n) {
                return { data: n.data, id: "".concat(t, "-").concat(i.index, "-").concat(n.index) };
              }),
            ),
          )
        : r.push({ data: i.data, id: "".concat(t, "-").concat(i.index) }),
      r
    );
  }, []);
}
function ql(e, t) {
  return ci(tt(e, t));
}
function sr(e, t) {
  var r = e.inputValue,
    i = r === void 0 ? "" : r,
    n = t.data,
    o = t.isSelected,
    s = t.label,
    u = t.value;
  return (!mi(e) || !o) && hi(e, { label: s, value: u, data: n }, i);
}
function Xl(e, t) {
  var r = e.focusedValue,
    i = e.selectValue,
    n = i.indexOf(r);
  if (n > -1) {
    var o = t.indexOf(r);
    if (o > -1) return r;
    if (n < t.length) return t[n];
  }
  return null;
}
function Jl(e, t) {
  var r = e.focusedOption;
  return r && t.indexOf(r) > -1 ? r : t[0];
}
var At = function (t, r) {
    var i,
      n =
        (i = t.find(function (o) {
          return o.data === r;
        })) === null || i === void 0
          ? void 0
          : i.id;
    return n || null;
  },
  fi = function (t, r) {
    return t.getOptionLabel(r);
  },
  ct = function (t, r) {
    return t.getOptionValue(r);
  };
function di(e, t, r) {
  return typeof e.isOptionDisabled == "function" ? e.isOptionDisabled(t, r) : !1;
}
function pi(e, t, r) {
  if (r.indexOf(t) > -1) return !0;
  if (typeof e.isOptionSelected == "function") return e.isOptionSelected(t, r);
  var i = ct(e, t);
  return r.some(function (n) {
    return ct(e, n) === i;
  });
}
function hi(e, t, r) {
  return e.filterOption ? e.filterOption(t, r) : !0;
}
var mi = function (t) {
    var r = t.hideSelectedOptions,
      i = t.isMulti;
    return r === void 0 ? i : r;
  },
  Zl = 1,
  vi = (function (e) {
    ma(r, e);
    var t = ba(r);
    function r(i) {
      var n;
      if (
        (pa(this, r),
        (n = t.call(this, i)),
        (n.state = {
          ariaSelection: null,
          focusedOption: null,
          focusedOptionId: null,
          focusableOptionsWithIds: [],
          focusedValue: null,
          inputIsHidden: !1,
          isFocused: !1,
          selectValue: [],
          clearFocusValueOnUpdate: !1,
          prevWasFocused: !1,
          inputIsHiddenAfterUpdate: void 0,
          prevProps: void 0,
          instancePrefix: "",
        }),
        (n.blockOptionHover = !1),
        (n.isComposing = !1),
        (n.commonProps = void 0),
        (n.initialTouchX = 0),
        (n.initialTouchY = 0),
        (n.openAfterFocus = !1),
        (n.scrollToFocusedOptionOnUpdate = !1),
        (n.userIsDragging = void 0),
        (n.isAppleDevice = Al()),
        (n.controlRef = null),
        (n.getControlRef = function (a) {
          n.controlRef = a;
        }),
        (n.focusedOptionRef = null),
        (n.getFocusedOptionRef = function (a) {
          n.focusedOptionRef = a;
        }),
        (n.menuListRef = null),
        (n.getMenuListRef = function (a) {
          n.menuListRef = a;
        }),
        (n.inputRef = null),
        (n.getInputRef = function (a) {
          n.inputRef = a;
        }),
        (n.focus = n.focusInput),
        (n.blur = n.blurInput),
        (n.onChange = function (a, l) {
          var c = n.props,
            f = c.onChange,
            h = c.name;
          (l.name = h), n.ariaOnChange(a, l), f(a, l);
        }),
        (n.setValue = function (a, l, c) {
          var f = n.props,
            h = f.closeMenuOnSelect,
            v = f.isMulti,
            b = f.inputValue;
          n.onInputChange("", { action: "set-value", prevInputValue: b }),
            h && (n.setState({ inputIsHiddenAfterUpdate: !v }), n.onMenuClose()),
            n.setState({ clearFocusValueOnUpdate: !0 }),
            n.onChange(a, { action: l, option: c });
        }),
        (n.selectOption = function (a) {
          var l = n.props,
            c = l.blurInputOnSelect,
            f = l.isMulti,
            h = l.name,
            v = n.state.selectValue,
            b = f && n.isOptionSelected(a, v),
            g = n.isOptionDisabled(a, v);
          if (b) {
            var p = n.getOptionValue(a);
            n.setValue(
              v.filter(function (m) {
                return n.getOptionValue(m) !== p;
              }),
              "deselect-option",
              a,
            );
          } else if (!g)
            f
              ? n.setValue([].concat(un(v), [a]), "select-option", a)
              : n.setValue(a, "select-option");
          else {
            n.ariaOnChange(a, { action: "select-option", option: a, name: h });
            return;
          }
          c && n.blurInput();
        }),
        (n.removeValue = function (a) {
          var l = n.props.isMulti,
            c = n.state.selectValue,
            f = n.getOptionValue(a),
            h = c.filter(function (b) {
              return n.getOptionValue(b) !== f;
            }),
            v = Ke(l, h, h[0] || null);
          n.onChange(v, { action: "remove-value", removedValue: a }), n.focusInput();
        }),
        (n.clearValue = function () {
          var a = n.state.selectValue;
          n.onChange(Ke(n.props.isMulti, [], null), { action: "clear", removedValues: a });
        }),
        (n.popValue = function () {
          var a = n.props.isMulti,
            l = n.state.selectValue,
            c = l[l.length - 1],
            f = l.slice(0, l.length - 1),
            h = Ke(a, f, f[0] || null);
          n.onChange(h, { action: "pop-value", removedValue: c });
        }),
        (n.getFocusedOptionId = function (a) {
          return At(n.state.focusableOptionsWithIds, a);
        }),
        (n.getFocusableOptionsWithIds = function () {
          return ar(tt(n.props, n.state.selectValue), n.getElementId("option"));
        }),
        (n.getValue = function () {
          return n.state.selectValue;
        }),
        (n.cx = function () {
          for (var a = arguments.length, l = new Array(a), c = 0; c < a; c++) l[c] = arguments[c];
          return Hs.apply(void 0, [n.props.classNamePrefix].concat(l));
        }),
        (n.getOptionLabel = function (a) {
          return fi(n.props, a);
        }),
        (n.getOptionValue = function (a) {
          return ct(n.props, a);
        }),
        (n.getStyles = function (a, l) {
          var c = n.props.unstyled,
            f = Ul[a](l, c);
          f.boxSizing = "border-box";
          var h = n.props.styles[a];
          return h ? h(f, l) : f;
        }),
        (n.getClassNames = function (a, l) {
          var c, f;
          return (c = (f = n.props.classNames)[a]) === null || c === void 0 ? void 0 : c.call(f, l);
        }),
        (n.getElementId = function (a) {
          return "".concat(n.state.instancePrefix, "-").concat(a);
        }),
        (n.getComponents = function () {
          return cl(n.props);
        }),
        (n.buildCategorizedOptions = function () {
          return tt(n.props, n.state.selectValue);
        }),
        (n.getCategorizedOptions = function () {
          return n.props.menuIsOpen ? n.buildCategorizedOptions() : [];
        }),
        (n.buildFocusableOptions = function () {
          return ci(n.buildCategorizedOptions());
        }),
        (n.getFocusableOptions = function () {
          return n.props.menuIsOpen ? n.buildFocusableOptions() : [];
        }),
        (n.ariaOnChange = function (a, l) {
          n.setState({ ariaSelection: P({ value: a }, l) });
        }),
        (n.onMenuMouseDown = function (a) {
          a.button === 0 && (a.stopPropagation(), a.preventDefault(), n.focusInput());
        }),
        (n.onMenuMouseMove = function (a) {
          n.blockOptionHover = !1;
        }),
        (n.onControlMouseDown = function (a) {
          if (!a.defaultPrevented) {
            var l = n.props.openMenuOnClick;
            n.state.isFocused
              ? n.props.menuIsOpen
                ? a.target.tagName !== "INPUT" && a.target.tagName !== "TEXTAREA" && n.onMenuClose()
                : l && n.openMenu("first")
              : (l && (n.openAfterFocus = !0), n.focusInput()),
              a.target.tagName !== "INPUT" && a.target.tagName !== "TEXTAREA" && a.preventDefault();
          }
        }),
        (n.onDropdownIndicatorMouseDown = function (a) {
          if (!(a && a.type === "mousedown" && a.button !== 0) && !n.props.isDisabled) {
            var l = n.props,
              c = l.isMulti,
              f = l.menuIsOpen;
            n.focusInput(),
              f
                ? (n.setState({ inputIsHiddenAfterUpdate: !c }), n.onMenuClose())
                : n.openMenu("first"),
              a.preventDefault();
          }
        }),
        (n.onClearIndicatorMouseDown = function (a) {
          (a && a.type === "mousedown" && a.button !== 0) ||
            (n.clearValue(),
            a.preventDefault(),
            (n.openAfterFocus = !1),
            a.type === "touchend"
              ? n.focusInput()
              : setTimeout(function () {
                  return n.focusInput();
                }));
        }),
        (n.onScroll = function (a) {
          typeof n.props.closeMenuOnScroll == "boolean"
            ? a.target instanceof HTMLElement && Mt(a.target) && n.props.onMenuClose()
            : typeof n.props.closeMenuOnScroll == "function" &&
              n.props.closeMenuOnScroll(a) &&
              n.props.onMenuClose();
        }),
        (n.onCompositionStart = function () {
          n.isComposing = !0;
        }),
        (n.onCompositionEnd = function () {
          n.isComposing = !1;
        }),
        (n.onTouchStart = function (a) {
          var l = a.touches,
            c = l && l.item(0);
          c &&
            ((n.initialTouchX = c.clientX), (n.initialTouchY = c.clientY), (n.userIsDragging = !1));
        }),
        (n.onTouchMove = function (a) {
          var l = a.touches,
            c = l && l.item(0);
          if (c) {
            var f = Math.abs(c.clientX - n.initialTouchX),
              h = Math.abs(c.clientY - n.initialTouchY),
              v = 5;
            n.userIsDragging = f > v || h > v;
          }
        }),
        (n.onTouchEnd = function (a) {
          n.userIsDragging ||
            (n.controlRef &&
              !n.controlRef.contains(a.target) &&
              n.menuListRef &&
              !n.menuListRef.contains(a.target) &&
              n.blurInput(),
            (n.initialTouchX = 0),
            (n.initialTouchY = 0));
        }),
        (n.onControlTouchEnd = function (a) {
          n.userIsDragging || n.onControlMouseDown(a);
        }),
        (n.onClearIndicatorTouchEnd = function (a) {
          n.userIsDragging || n.onClearIndicatorMouseDown(a);
        }),
        (n.onDropdownIndicatorTouchEnd = function (a) {
          n.userIsDragging || n.onDropdownIndicatorMouseDown(a);
        }),
        (n.handleInputChange = function (a) {
          var l = n.props.inputValue,
            c = a.currentTarget.value;
          n.setState({ inputIsHiddenAfterUpdate: !1 }),
            n.onInputChange(c, { action: "input-change", prevInputValue: l }),
            n.props.menuIsOpen || n.onMenuOpen();
        }),
        (n.onInputFocus = function (a) {
          n.props.onFocus && n.props.onFocus(a),
            n.setState({ inputIsHiddenAfterUpdate: !1, isFocused: !0 }),
            (n.openAfterFocus || n.props.openMenuOnFocus) && n.openMenu("first"),
            (n.openAfterFocus = !1);
        }),
        (n.onInputBlur = function (a) {
          var l = n.props.inputValue;
          if (n.menuListRef && n.menuListRef.contains(document.activeElement)) {
            n.inputRef.focus();
            return;
          }
          n.props.onBlur && n.props.onBlur(a),
            n.onInputChange("", { action: "input-blur", prevInputValue: l }),
            n.onMenuClose(),
            n.setState({ focusedValue: null, isFocused: !1 });
        }),
        (n.onOptionHover = function (a) {
          if (!(n.blockOptionHover || n.state.focusedOption === a)) {
            var l = n.getFocusableOptions(),
              c = l.indexOf(a);
            n.setState({
              focusedOption: a,
              focusedOptionId: c > -1 ? n.getFocusedOptionId(a) : null,
            });
          }
        }),
        (n.shouldHideSelectedOptions = function () {
          return mi(n.props);
        }),
        (n.onValueInputFocus = function (a) {
          a.preventDefault(), a.stopPropagation(), n.focus();
        }),
        (n.onKeyDown = function (a) {
          var l = n.props,
            c = l.isMulti,
            f = l.backspaceRemovesValue,
            h = l.escapeClearsValue,
            v = l.inputValue,
            b = l.isClearable,
            g = l.isDisabled,
            p = l.menuIsOpen,
            m = l.onKeyDown,
            S = l.tabSelectsValue,
            y = l.openMenuOnFocus,
            C = n.state,
            x = C.focusedOption,
            E = C.focusedValue,
            w = C.selectValue;
          if (!g && !(typeof m == "function" && (m(a), a.defaultPrevented))) {
            switch (((n.blockOptionHover = !0), a.key)) {
              case "ArrowLeft":
                if (!c || v) return;
                n.focusValue("previous");
                break;
              case "ArrowRight":
                if (!c || v) return;
                n.focusValue("next");
                break;
              case "Delete":
              case "Backspace":
                if (v) return;
                if (E) n.removeValue(E);
                else {
                  if (!f) return;
                  c ? n.popValue() : b && n.clearValue();
                }
                break;
              case "Tab":
                if (
                  n.isComposing ||
                  a.shiftKey ||
                  !p ||
                  !S ||
                  !x ||
                  (y && n.isOptionSelected(x, w))
                )
                  return;
                n.selectOption(x);
                break;
              case "Enter":
                if (a.keyCode === 229) break;
                if (p) {
                  if (!x || n.isComposing) return;
                  n.selectOption(x);
                  break;
                }
                return;
              case "Escape":
                p
                  ? (n.setState({ inputIsHiddenAfterUpdate: !1 }),
                    n.onInputChange("", { action: "menu-close", prevInputValue: v }),
                    n.onMenuClose())
                  : b && h && n.clearValue();
                break;
              case " ":
                if (v) return;
                if (!p) {
                  n.openMenu("first");
                  break;
                }
                if (!x) return;
                n.selectOption(x);
                break;
              case "ArrowUp":
                p ? n.focusOption("up") : n.openMenu("last");
                break;
              case "ArrowDown":
                p ? n.focusOption("down") : n.openMenu("first");
                break;
              case "PageUp":
                if (!p) return;
                n.focusOption("pageup");
                break;
              case "PageDown":
                if (!p) return;
                n.focusOption("pagedown");
                break;
              case "Home":
                if (!p) return;
                n.focusOption("first");
                break;
              case "End":
                if (!p) return;
                n.focusOption("last");
                break;
              default:
                return;
            }
            a.preventDefault();
          }
        }),
        (n.state.instancePrefix = "react-select-" + (n.props.instanceId || ++Zl)),
        (n.state.selectValue = Wn(i.value)),
        i.menuIsOpen && n.state.selectValue.length)
      ) {
        var o = n.getFocusableOptionsWithIds(),
          s = n.buildFocusableOptions(),
          u = s.indexOf(n.state.selectValue[0]);
        (n.state.focusableOptionsWithIds = o),
          (n.state.focusedOption = s[u]),
          (n.state.focusedOptionId = At(o, s[u]));
      }
      return n;
    }
    return (
      ha(
        r,
        [
          {
            key: "componentDidMount",
            value: function () {
              this.startListeningComposition(),
                this.startListeningToTouch(),
                this.props.closeMenuOnScroll &&
                  document &&
                  document.addEventListener &&
                  document.addEventListener("scroll", this.onScroll, !0),
                this.props.autoFocus && this.focusInput(),
                this.props.menuIsOpen &&
                  this.state.focusedOption &&
                  this.menuListRef &&
                  this.focusedOptionRef &&
                  Kn(this.menuListRef, this.focusedOptionRef);
            },
          },
          {
            key: "componentDidUpdate",
            value: function (n) {
              var o = this.props,
                s = o.isDisabled,
                u = o.menuIsOpen,
                a = this.state.isFocused;
              ((a && !s && n.isDisabled) || (a && u && !n.menuIsOpen)) && this.focusInput(),
                a && s && !n.isDisabled
                  ? this.setState({ isFocused: !1 }, this.onMenuClose)
                  : !a &&
                    !s &&
                    n.isDisabled &&
                    this.inputRef === document.activeElement &&
                    this.setState({ isFocused: !0 }),
                this.menuListRef &&
                  this.focusedOptionRef &&
                  this.scrollToFocusedOptionOnUpdate &&
                  (Kn(this.menuListRef, this.focusedOptionRef),
                  (this.scrollToFocusedOptionOnUpdate = !1));
            },
          },
          {
            key: "componentWillUnmount",
            value: function () {
              this.stopListeningComposition(),
                this.stopListeningToTouch(),
                document.removeEventListener("scroll", this.onScroll, !0);
            },
          },
          {
            key: "onMenuOpen",
            value: function () {
              this.props.onMenuOpen();
            },
          },
          {
            key: "onMenuClose",
            value: function () {
              this.onInputChange("", {
                action: "menu-close",
                prevInputValue: this.props.inputValue,
              }),
                this.props.onMenuClose();
            },
          },
          {
            key: "onInputChange",
            value: function (n, o) {
              this.props.onInputChange(n, o);
            },
          },
          {
            key: "focusInput",
            value: function () {
              this.inputRef && this.inputRef.focus();
            },
          },
          {
            key: "blurInput",
            value: function () {
              this.inputRef && this.inputRef.blur();
            },
          },
          {
            key: "openMenu",
            value: function (n) {
              var o = this,
                s = this.state,
                u = s.selectValue,
                a = s.isFocused,
                l = this.buildFocusableOptions(),
                c = n === "first" ? 0 : l.length - 1;
              if (!this.props.isMulti) {
                var f = l.indexOf(u[0]);
                f > -1 && (c = f);
              }
              (this.scrollToFocusedOptionOnUpdate = !(a && this.menuListRef)),
                this.setState(
                  {
                    inputIsHiddenAfterUpdate: !1,
                    focusedValue: null,
                    focusedOption: l[c],
                    focusedOptionId: this.getFocusedOptionId(l[c]),
                  },
                  function () {
                    return o.onMenuOpen();
                  },
                );
            },
          },
          {
            key: "focusValue",
            value: function (n) {
              var o = this.state,
                s = o.selectValue,
                u = o.focusedValue;
              if (this.props.isMulti) {
                this.setState({ focusedOption: null });
                var a = s.indexOf(u);
                u || (a = -1);
                var l = s.length - 1,
                  c = -1;
                if (s.length) {
                  switch (n) {
                    case "previous":
                      a === 0 ? (c = 0) : a === -1 ? (c = l) : (c = a - 1);
                      break;
                    case "next":
                      a > -1 && a < l && (c = a + 1);
                      break;
                  }
                  this.setState({ inputIsHidden: c !== -1, focusedValue: s[c] });
                }
              }
            },
          },
          {
            key: "focusOption",
            value: function () {
              var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "first",
                o = this.props.pageSize,
                s = this.state.focusedOption,
                u = this.getFocusableOptions();
              if (u.length) {
                var a = 0,
                  l = u.indexOf(s);
                s || (l = -1),
                  n === "up"
                    ? (a = l > 0 ? l - 1 : u.length - 1)
                    : n === "down"
                      ? (a = (l + 1) % u.length)
                      : n === "pageup"
                        ? ((a = l - o), a < 0 && (a = 0))
                        : n === "pagedown"
                          ? ((a = l + o), a > u.length - 1 && (a = u.length - 1))
                          : n === "last" && (a = u.length - 1),
                  (this.scrollToFocusedOptionOnUpdate = !0),
                  this.setState({
                    focusedOption: u[a],
                    focusedValue: null,
                    focusedOptionId: this.getFocusedOptionId(u[a]),
                  });
              }
            },
          },
          {
            key: "getTheme",
            value: function () {
              return this.props.theme
                ? typeof this.props.theme == "function"
                  ? this.props.theme(Ft)
                  : P(P({}, Ft), this.props.theme)
                : Ft;
            },
          },
          {
            key: "getCommonProps",
            value: function () {
              var n = this.clearValue,
                o = this.cx,
                s = this.getStyles,
                u = this.getClassNames,
                a = this.getValue,
                l = this.selectOption,
                c = this.setValue,
                f = this.props,
                h = f.isMulti,
                v = f.isRtl,
                b = f.options,
                g = this.hasValue();
              return {
                clearValue: n,
                cx: o,
                getStyles: s,
                getClassNames: u,
                getValue: a,
                hasValue: g,
                isMulti: h,
                isRtl: v,
                options: b,
                selectOption: l,
                selectProps: f,
                setValue: c,
                theme: this.getTheme(),
              };
            },
          },
          {
            key: "hasValue",
            value: function () {
              var n = this.state.selectValue;
              return n.length > 0;
            },
          },
          {
            key: "hasOptions",
            value: function () {
              return !!this.getFocusableOptions().length;
            },
          },
          {
            key: "isClearable",
            value: function () {
              var n = this.props,
                o = n.isClearable,
                s = n.isMulti;
              return o === void 0 ? s : o;
            },
          },
          {
            key: "isOptionDisabled",
            value: function (n, o) {
              return di(this.props, n, o);
            },
          },
          {
            key: "isOptionSelected",
            value: function (n, o) {
              return pi(this.props, n, o);
            },
          },
          {
            key: "filterOption",
            value: function (n, o) {
              return hi(this.props, n, o);
            },
          },
          {
            key: "formatOptionLabel",
            value: function (n, o) {
              if (typeof this.props.formatOptionLabel == "function") {
                var s = this.props.inputValue,
                  u = this.state.selectValue;
                return this.props.formatOptionLabel(n, {
                  context: o,
                  inputValue: s,
                  selectValue: u,
                });
              } else return this.getOptionLabel(n);
            },
          },
          {
            key: "formatGroupLabel",
            value: function (n) {
              return this.props.formatGroupLabel(n);
            },
          },
          {
            key: "startListeningComposition",
            value: function () {
              document &&
                document.addEventListener &&
                (document.addEventListener("compositionstart", this.onCompositionStart, !1),
                document.addEventListener("compositionend", this.onCompositionEnd, !1));
            },
          },
          {
            key: "stopListeningComposition",
            value: function () {
              document &&
                document.removeEventListener &&
                (document.removeEventListener("compositionstart", this.onCompositionStart),
                document.removeEventListener("compositionend", this.onCompositionEnd));
            },
          },
          {
            key: "startListeningToTouch",
            value: function () {
              document &&
                document.addEventListener &&
                (document.addEventListener("touchstart", this.onTouchStart, !1),
                document.addEventListener("touchmove", this.onTouchMove, !1),
                document.addEventListener("touchend", this.onTouchEnd, !1));
            },
          },
          {
            key: "stopListeningToTouch",
            value: function () {
              document &&
                document.removeEventListener &&
                (document.removeEventListener("touchstart", this.onTouchStart),
                document.removeEventListener("touchmove", this.onTouchMove),
                document.removeEventListener("touchend", this.onTouchEnd));
            },
          },
          {
            key: "renderInput",
            value: function () {
              var n = this.props,
                o = n.isDisabled,
                s = n.isSearchable,
                u = n.inputId,
                a = n.inputValue,
                l = n.tabIndex,
                c = n.form,
                f = n.menuIsOpen,
                h = n.required,
                v = this.getComponents(),
                b = v.Input,
                g = this.state,
                p = g.inputIsHidden,
                m = g.ariaSelection,
                S = this.commonProps,
                y = u || this.getElementId("input"),
                C = P(
                  P(
                    P(
                      {
                        "aria-autocomplete": "list",
                        "aria-expanded": f,
                        "aria-haspopup": !0,
                        "aria-errormessage": this.props["aria-errormessage"],
                        "aria-invalid": this.props["aria-invalid"],
                        "aria-label": this.props["aria-label"],
                        "aria-labelledby": this.props["aria-labelledby"],
                        "aria-required": h,
                        role: "combobox",
                        "aria-activedescendant": this.isAppleDevice
                          ? void 0
                          : this.state.focusedOptionId || "",
                      },
                      f && { "aria-controls": this.getElementId("listbox") },
                    ),
                    !s && { "aria-readonly": !0 },
                  ),
                  this.hasValue()
                    ? (m == null ? void 0 : m.action) === "initial-input-focus" && {
                        "aria-describedby": this.getElementId("live-region"),
                      }
                    : { "aria-describedby": this.getElementId("placeholder") },
                );
              return s
                ? d.createElement(
                    b,
                    R(
                      {},
                      S,
                      {
                        autoCapitalize: "none",
                        autoComplete: "off",
                        autoCorrect: "off",
                        id: y,
                        innerRef: this.getInputRef,
                        isDisabled: o,
                        isHidden: p,
                        onBlur: this.onInputBlur,
                        onChange: this.handleInputChange,
                        onFocus: this.onInputFocus,
                        spellCheck: "false",
                        tabIndex: l,
                        form: c,
                        type: "text",
                        value: a,
                      },
                      C,
                    ),
                  )
                : d.createElement(
                    Ol,
                    R(
                      {
                        id: y,
                        innerRef: this.getInputRef,
                        onBlur: this.onInputBlur,
                        onChange: ut,
                        onFocus: this.onInputFocus,
                        disabled: o,
                        tabIndex: l,
                        inputMode: "none",
                        form: c,
                        value: "",
                      },
                      C,
                    ),
                  );
            },
          },
          {
            key: "renderPlaceholderOrValue",
            value: function () {
              var n = this,
                o = this.getComponents(),
                s = o.MultiValue,
                u = o.MultiValueContainer,
                a = o.MultiValueLabel,
                l = o.MultiValueRemove,
                c = o.SingleValue,
                f = o.Placeholder,
                h = this.commonProps,
                v = this.props,
                b = v.controlShouldRenderValue,
                g = v.isDisabled,
                p = v.isMulti,
                m = v.inputValue,
                S = v.placeholder,
                y = this.state,
                C = y.selectValue,
                x = y.focusedValue,
                E = y.isFocused;
              if (!this.hasValue() || !b)
                return m
                  ? null
                  : d.createElement(
                      f,
                      R({}, h, {
                        key: "placeholder",
                        isDisabled: g,
                        isFocused: E,
                        innerProps: { id: this.getElementId("placeholder") },
                      }),
                      S,
                    );
              if (p)
                return C.map(function (M, I) {
                  var V = M === x,
                    B = "".concat(n.getOptionLabel(M), "-").concat(n.getOptionValue(M));
                  return d.createElement(
                    s,
                    R({}, h, {
                      components: { Container: u, Label: a, Remove: l },
                      isFocused: V,
                      isDisabled: g,
                      key: B,
                      index: I,
                      removeProps: {
                        onClick: function () {
                          return n.removeValue(M);
                        },
                        onTouchEnd: function () {
                          return n.removeValue(M);
                        },
                        onMouseDown: function (ie) {
                          ie.preventDefault();
                        },
                      },
                      data: M,
                    }),
                    n.formatOptionLabel(M, "value"),
                  );
                });
              if (m) return null;
              var w = C[0];
              return d.createElement(
                c,
                R({}, h, { data: w, isDisabled: g }),
                this.formatOptionLabel(w, "value"),
              );
            },
          },
          {
            key: "renderClearIndicator",
            value: function () {
              var n = this.getComponents(),
                o = n.ClearIndicator,
                s = this.commonProps,
                u = this.props,
                a = u.isDisabled,
                l = u.isLoading,
                c = this.state.isFocused;
              if (!this.isClearable() || !o || a || !this.hasValue() || l) return null;
              var f = {
                onMouseDown: this.onClearIndicatorMouseDown,
                onTouchEnd: this.onClearIndicatorTouchEnd,
                "aria-hidden": "true",
              };
              return d.createElement(o, R({}, s, { innerProps: f, isFocused: c }));
            },
          },
          {
            key: "renderLoadingIndicator",
            value: function () {
              var n = this.getComponents(),
                o = n.LoadingIndicator,
                s = this.commonProps,
                u = this.props,
                a = u.isDisabled,
                l = u.isLoading,
                c = this.state.isFocused;
              if (!o || !l) return null;
              var f = { "aria-hidden": "true" };
              return d.createElement(o, R({}, s, { innerProps: f, isDisabled: a, isFocused: c }));
            },
          },
          {
            key: "renderIndicatorSeparator",
            value: function () {
              var n = this.getComponents(),
                o = n.DropdownIndicator,
                s = n.IndicatorSeparator;
              if (!o || !s) return null;
              var u = this.commonProps,
                a = this.props.isDisabled,
                l = this.state.isFocused;
              return d.createElement(s, R({}, u, { isDisabled: a, isFocused: l }));
            },
          },
          {
            key: "renderDropdownIndicator",
            value: function () {
              var n = this.getComponents(),
                o = n.DropdownIndicator;
              if (!o) return null;
              var s = this.commonProps,
                u = this.props.isDisabled,
                a = this.state.isFocused,
                l = {
                  onMouseDown: this.onDropdownIndicatorMouseDown,
                  onTouchEnd: this.onDropdownIndicatorTouchEnd,
                  "aria-hidden": "true",
                };
              return d.createElement(o, R({}, s, { innerProps: l, isDisabled: u, isFocused: a }));
            },
          },
          {
            key: "renderMenu",
            value: function () {
              var n = this,
                o = this.getComponents(),
                s = o.Group,
                u = o.GroupHeading,
                a = o.Menu,
                l = o.MenuList,
                c = o.MenuPortal,
                f = o.LoadingMessage,
                h = o.NoOptionsMessage,
                v = o.Option,
                b = this.commonProps,
                g = this.state.focusedOption,
                p = this.props,
                m = p.captureMenuScroll,
                S = p.inputValue,
                y = p.isLoading,
                C = p.loadingMessage,
                x = p.minMenuHeight,
                E = p.maxMenuHeight,
                w = p.menuIsOpen,
                M = p.menuPlacement,
                I = p.menuPosition,
                V = p.menuPortalTarget,
                B = p.menuShouldBlockScroll,
                z = p.menuShouldScrollIntoView,
                ie = p.noOptionsMessage,
                oe = p.onMenuScrollToTop,
                _ = p.onMenuScrollToBottom;
              if (!w) return null;
              var A = function (K, ae) {
                  var he = K.type,
                    J = K.data,
                    me = K.isDisabled,
                    se = K.isSelected,
                    He = K.label,
                    Si = K.value,
                    xn = g === J,
                    On = me
                      ? void 0
                      : function () {
                          return n.onOptionHover(J);
                        },
                    wi = me
                      ? void 0
                      : function () {
                          return n.selectOption(J);
                        },
                    Pn = "".concat(n.getElementId("option"), "-").concat(ae),
                    Ci = {
                      id: Pn,
                      onClick: wi,
                      onMouseMove: On,
                      onMouseOver: On,
                      tabIndex: -1,
                      role: "option",
                      "aria-selected": n.isAppleDevice ? void 0 : se,
                    };
                  return d.createElement(
                    v,
                    R({}, b, {
                      innerProps: Ci,
                      data: J,
                      isDisabled: me,
                      isSelected: se,
                      key: Pn,
                      label: He,
                      type: he,
                      value: Si,
                      isFocused: xn,
                      innerRef: xn ? n.getFocusedOptionRef : void 0,
                    }),
                    n.formatOptionLabel(K.data, "menu"),
                  );
                },
                ee;
              if (this.hasOptions())
                ee = this.getCategorizedOptions().map(function (N) {
                  if (N.type === "group") {
                    var K = N.data,
                      ae = N.options,
                      he = N.index,
                      J = "".concat(n.getElementId("group"), "-").concat(he),
                      me = "".concat(J, "-heading");
                    return d.createElement(
                      s,
                      R({}, b, {
                        key: J,
                        data: K,
                        options: ae,
                        Heading: u,
                        headingProps: { id: me, data: N.data },
                        label: n.formatGroupLabel(N.data),
                      }),
                      N.options.map(function (se) {
                        return A(se, "".concat(he, "-").concat(se.index));
                      }),
                    );
                  } else if (N.type === "option") return A(N, "".concat(N.index));
                });
              else if (y) {
                var q = C({ inputValue: S });
                if (q === null) return null;
                ee = d.createElement(f, b, q);
              } else {
                var de = ie({ inputValue: S });
                if (de === null) return null;
                ee = d.createElement(h, b, de);
              }
              var pe = {
                  minMenuHeight: x,
                  maxMenuHeight: E,
                  menuPlacement: M,
                  menuPosition: I,
                  menuShouldScrollIntoView: z,
                },
                _e = d.createElement(nu, R({}, b, pe), function (N) {
                  var K = N.ref,
                    ae = N.placerProps,
                    he = ae.placement,
                    J = ae.maxHeight;
                  return d.createElement(
                    a,
                    R({}, b, pe, {
                      innerRef: K,
                      innerProps: {
                        onMouseDown: n.onMenuMouseDown,
                        onMouseMove: n.onMenuMouseMove,
                      },
                      isLoading: y,
                      placement: he,
                    }),
                    d.createElement(
                      kl,
                      { captureEnabled: m, onTopArrive: oe, onBottomArrive: _, lockEnabled: B },
                      function (me) {
                        return d.createElement(
                          l,
                          R({}, b, {
                            innerRef: function (He) {
                              n.getMenuListRef(He), me(He);
                            },
                            innerProps: {
                              role: "listbox",
                              "aria-multiselectable": b.isMulti,
                              id: n.getElementId("listbox"),
                            },
                            isLoading: y,
                            maxHeight: J,
                            focusedOption: g,
                          }),
                          ee,
                        );
                      },
                    ),
                  );
                });
              return V || I === "fixed"
                ? d.createElement(
                    c,
                    R({}, b, {
                      appendTo: V,
                      controlElement: this.controlRef,
                      menuPlacement: M,
                      menuPosition: I,
                    }),
                    _e,
                  )
                : _e;
            },
          },
          {
            key: "renderFormField",
            value: function () {
              var n = this,
                o = this.props,
                s = o.delimiter,
                u = o.isDisabled,
                a = o.isMulti,
                l = o.name,
                c = o.required,
                f = this.state.selectValue;
              if (c && !this.hasValue() && !u)
                return d.createElement(Dl, { name: l, onFocus: this.onValueInputFocus });
              if (!(!l || u))
                if (a)
                  if (s) {
                    var h = f
                      .map(function (g) {
                        return n.getOptionValue(g);
                      })
                      .join(s);
                    return d.createElement("input", { name: l, type: "hidden", value: h });
                  } else {
                    var v =
                      f.length > 0
                        ? f.map(function (g, p) {
                            return d.createElement("input", {
                              key: "i-".concat(p),
                              name: l,
                              type: "hidden",
                              value: n.getOptionValue(g),
                            });
                          })
                        : d.createElement("input", { name: l, type: "hidden", value: "" });
                    return d.createElement("div", null, v);
                  }
                else {
                  var b = f[0] ? this.getOptionValue(f[0]) : "";
                  return d.createElement("input", { name: l, type: "hidden", value: b });
                }
            },
          },
          {
            key: "renderLiveRegion",
            value: function () {
              var n = this.commonProps,
                o = this.state,
                s = o.ariaSelection,
                u = o.focusedOption,
                a = o.focusedValue,
                l = o.isFocused,
                c = o.selectValue,
                f = this.getFocusableOptions();
              return d.createElement(
                bl,
                R({}, n, {
                  id: this.getElementId("live-region"),
                  ariaSelection: s,
                  focusedOption: u,
                  focusedValue: a,
                  isFocused: l,
                  selectValue: c,
                  focusableOptions: f,
                  isAppleDevice: this.isAppleDevice,
                }),
              );
            },
          },
          {
            key: "render",
            value: function () {
              var n = this.getComponents(),
                o = n.Control,
                s = n.IndicatorsContainer,
                u = n.SelectContainer,
                a = n.ValueContainer,
                l = this.props,
                c = l.className,
                f = l.id,
                h = l.isDisabled,
                v = l.menuIsOpen,
                b = this.state.isFocused,
                g = (this.commonProps = this.getCommonProps());
              return d.createElement(
                u,
                R({}, g, {
                  className: c,
                  innerProps: { id: f, onKeyDown: this.onKeyDown },
                  isDisabled: h,
                  isFocused: b,
                }),
                this.renderLiveRegion(),
                d.createElement(
                  o,
                  R({}, g, {
                    innerRef: this.getControlRef,
                    innerProps: {
                      onMouseDown: this.onControlMouseDown,
                      onTouchEnd: this.onControlTouchEnd,
                    },
                    isDisabled: h,
                    isFocused: b,
                    menuIsOpen: v,
                  }),
                  d.createElement(
                    a,
                    R({}, g, { isDisabled: h }),
                    this.renderPlaceholderOrValue(),
                    this.renderInput(),
                  ),
                  d.createElement(
                    s,
                    R({}, g, { isDisabled: h }),
                    this.renderClearIndicator(),
                    this.renderLoadingIndicator(),
                    this.renderIndicatorSeparator(),
                    this.renderDropdownIndicator(),
                  ),
                ),
                this.renderMenu(),
                this.renderFormField(),
              );
            },
          },
        ],
        [
          {
            key: "getDerivedStateFromProps",
            value: function (n, o) {
              var s = o.prevProps,
                u = o.clearFocusValueOnUpdate,
                a = o.inputIsHiddenAfterUpdate,
                l = o.ariaSelection,
                c = o.isFocused,
                f = o.prevWasFocused,
                h = o.instancePrefix,
                v = n.options,
                b = n.value,
                g = n.menuIsOpen,
                p = n.inputValue,
                m = n.isMulti,
                S = Wn(b),
                y = {};
              if (
                s &&
                (b !== s.value || v !== s.options || g !== s.menuIsOpen || p !== s.inputValue)
              ) {
                var C = g ? ql(n, S) : [],
                  x = g ? ar(tt(n, S), "".concat(h, "-option")) : [],
                  E = u ? Xl(o, S) : null,
                  w = Jl(o, C),
                  M = At(x, w);
                y = {
                  selectValue: S,
                  focusedOption: w,
                  focusedOptionId: M,
                  focusableOptionsWithIds: x,
                  focusedValue: E,
                  clearFocusValueOnUpdate: !1,
                };
              }
              var I =
                  a != null && n !== s
                    ? { inputIsHidden: a, inputIsHiddenAfterUpdate: void 0 }
                    : {},
                V = l,
                B = c && f;
              return (
                c &&
                  !B &&
                  ((V = {
                    value: Ke(m, S, S[0] || null),
                    options: S,
                    action: "initial-input-focus",
                  }),
                  (B = !f)),
                (l == null ? void 0 : l.action) === "initial-input-focus" && (V = null),
                P(P(P({}, y), I), {}, { prevProps: n, ariaSelection: V, prevWasFocused: B })
              );
            },
          },
        ],
      ),
      r
    );
  })(d.Component);
vi.defaultProps = Gl;
var Ql = d.forwardRef(function (e, t) {
    var r = da(e);
    return d.createElement(vi, R({ ref: t }, r));
  }),
  Pc = Ql,
  Rt = {},
  ec = function () {
    var e = document.getSelection();
    if (!e.rangeCount) return function () {};
    for (var t = document.activeElement, r = [], i = 0; i < e.rangeCount; i++)
      r.push(e.getRangeAt(i));
    switch (t.tagName.toUpperCase()) {
      case "INPUT":
      case "TEXTAREA":
        t.blur();
        break;
      default:
        t = null;
        break;
    }
    return (
      e.removeAllRanges(),
      function () {
        e.type === "Caret" && e.removeAllRanges(),
          e.rangeCount ||
            r.forEach(function (n) {
              e.addRange(n);
            }),
          t && t.focus();
      }
    );
  },
  tc = ec,
  ur = { "text/plain": "Text", "text/html": "Url", default: "Text" },
  nc = "Copy to clipboard: #{key}, Enter";
function rc(e) {
  var t = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return e.replace(/#{\s*key\s*}/g, t);
}
function ic(e, t) {
  var r,
    i,
    n,
    o,
    s,
    u,
    a = !1;
  t || (t = {}), (r = t.debug || !1);
  try {
    (n = tc()),
      (o = document.createRange()),
      (s = document.getSelection()),
      (u = document.createElement("span")),
      (u.textContent = e),
      (u.ariaHidden = "true"),
      (u.style.all = "unset"),
      (u.style.position = "fixed"),
      (u.style.top = 0),
      (u.style.clip = "rect(0, 0, 0, 0)"),
      (u.style.whiteSpace = "pre"),
      (u.style.webkitUserSelect = "text"),
      (u.style.MozUserSelect = "text"),
      (u.style.msUserSelect = "text"),
      (u.style.userSelect = "text"),
      u.addEventListener("copy", function (c) {
        if ((c.stopPropagation(), t.format))
          if ((c.preventDefault(), typeof c.clipboardData > "u")) {
            r && console.warn("unable to use e.clipboardData"),
              r && console.warn("trying IE specific stuff"),
              window.clipboardData.clearData();
            var f = ur[t.format] || ur.default;
            window.clipboardData.setData(f, e);
          } else c.clipboardData.clearData(), c.clipboardData.setData(t.format, e);
        t.onCopy && (c.preventDefault(), t.onCopy(c.clipboardData));
      }),
      document.body.appendChild(u),
      o.selectNodeContents(u),
      s.addRange(o);
    var l = document.execCommand("copy");
    if (!l) throw new Error("copy command was unsuccessful");
    a = !0;
  } catch (c) {
    r && console.error("unable to copy using execCommand: ", c),
      r && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(t.format || "text", e),
        t.onCopy && t.onCopy(window.clipboardData),
        (a = !0);
    } catch (f) {
      r && console.error("unable to copy using clipboardData: ", f),
        r && console.error("falling back to prompt"),
        (i = rc("message" in t ? t.message : nc)),
        window.prompt(i, e);
    }
  } finally {
    s && (typeof s.removeRange == "function" ? s.removeRange(o) : s.removeAllRanges()),
      u && document.body.removeChild(u),
      n();
  }
  return a;
}
var oc = ic;
function Gt(e) {
  "@babel/helpers - typeof";
  return (
    (Gt =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Gt(e)
  );
}
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.CopyToClipboard = void 0;
var Ye = gi(d),
  ac = gi(oc),
  sc = ["text", "onCopy", "options", "children"];
function gi(e) {
  return e && e.__esModule ? e : { default: e };
}
function lr(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t &&
      (i = i.filter(function (n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })),
      r.push.apply(r, i);
  }
  return r;
}
function cr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? lr(Object(r), !0).forEach(function (i) {
          Cn(e, i, r[i]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : lr(Object(r)).forEach(function (i) {
            Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
          });
  }
  return e;
}
function uc(e, t) {
  if (e == null) return {};
  var r = lc(e, t),
    i,
    n;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (n = 0; n < o.length; n++)
      (i = o[n]),
        !(t.indexOf(i) >= 0) && Object.prototype.propertyIsEnumerable.call(e, i) && (r[i] = e[i]);
  }
  return r;
}
function lc(e, t) {
  if (e == null) return {};
  var r = {},
    i = Object.keys(e),
    n,
    o;
  for (o = 0; o < i.length; o++) (n = i[o]), !(t.indexOf(n) >= 0) && (r[n] = e[n]);
  return r;
}
function cc(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function fc(e, t) {
  for (var r = 0; r < t.length; r++) {
    var i = t[r];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(e, i.key, i);
  }
}
function dc(e, t, r) {
  return t && fc(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function pc(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && qt(e, t);
}
function qt(e, t) {
  return (
    (qt =
      Object.setPrototypeOf ||
      function (i, n) {
        return (i.__proto__ = n), i;
      }),
    qt(e, t)
  );
}
function hc(e) {
  var t = vc();
  return function () {
    var i = ft(e),
      n;
    if (t) {
      var o = ft(this).constructor;
      n = Reflect.construct(i, arguments, o);
    } else n = i.apply(this, arguments);
    return mc(this, n);
  };
}
function mc(e, t) {
  if (t && (Gt(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return bi(e);
}
function bi(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function vc() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
  } catch {
    return !1;
  }
}
function ft(e) {
  return (
    (ft = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    ft(e)
  );
}
function Cn(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
var yi = (function (e) {
  pc(r, e);
  var t = hc(r);
  function r() {
    var i;
    cc(this, r);
    for (var n = arguments.length, o = new Array(n), s = 0; s < n; s++) o[s] = arguments[s];
    return (
      (i = t.call.apply(t, [this].concat(o))),
      Cn(bi(i), "onClick", function (u) {
        var a = i.props,
          l = a.text,
          c = a.onCopy,
          f = a.children,
          h = a.options,
          v = Ye.default.Children.only(f),
          b = (0, ac.default)(l, h);
        c && c(l, b), v && v.props && typeof v.props.onClick == "function" && v.props.onClick(u);
      }),
      i
    );
  }
  return (
    dc(r, [
      {
        key: "render",
        value: function () {
          var n = this.props;
          n.text, n.onCopy, n.options;
          var o = n.children,
            s = uc(n, sc),
            u = Ye.default.Children.only(o);
          return Ye.default.cloneElement(u, cr(cr({}, s), {}, { onClick: this.onClick }));
        },
      },
    ]),
    r
  );
})(Ye.default.PureComponent);
Rt.CopyToClipboard = yi;
Cn(yi, "defaultProps", { onCopy: void 0, options: void 0 });
var gc = Rt,
  Xt = gc.CopyToClipboard;
Xt.CopyToClipboard = Xt;
var Ec = Xt;
function Nt(e) {
  return (
    e && e.stopPropagation && e.stopPropagation(), e && e.preventDefault && e.preventDefault(), !1
  );
}
function _t(e) {
  return e == null ? [] : Array.isArray(e) ? e.slice() : [e];
}
function Ge(e) {
  return e !== null && e.length === 1 ? e[0] : e.slice();
}
function qe(e) {
  Object.keys(e).forEach((t) => {
    typeof document < "u" && document.addEventListener(t, e[t], !1);
  });
}
function be(e, t) {
  return Jt(
    (function (r, i) {
      let n = r;
      return n <= i.min && (n = i.min), n >= i.max && (n = i.max), n;
    })(e, t),
    t,
  );
}
function Jt(e, t) {
  const r = (e - t.min) % t.step;
  let i = e - r;
  return 2 * Math.abs(r) >= t.step && (i += r > 0 ? t.step : -t.step), parseFloat(i.toFixed(5));
}
let Zt = (function (e) {
  function t(i) {
    var n;
    ((n = e.call(this, i) || this).onKeyUp = () => {
      n.onEnd();
    }),
      (n.onMouseUp = () => {
        n.onEnd(n.getMouseEventMap());
      }),
      (n.onTouchEnd = (u) => {
        u.preventDefault(), n.onEnd(n.getTouchEventMap());
      }),
      (n.onBlur = () => {
        n.setState({ index: -1 }, n.onEnd(n.getKeyDownEventMap()));
      }),
      (n.onMouseMove = (u) => {
        n.setState({ pending: !0 });
        const a = n.getMousePosition(u),
          l = n.getDiffPosition(a[0]),
          c = n.getValueFromPosition(l);
        n.move(c);
      }),
      (n.onTouchMove = (u) => {
        if (u.touches.length > 1) return;
        n.setState({ pending: !0 });
        const a = n.getTouchPosition(u);
        if (n.isScrolling === void 0) {
          const f = a[0] - n.startPosition[0],
            h = a[1] - n.startPosition[1];
          n.isScrolling = Math.abs(h) > Math.abs(f);
        }
        if (n.isScrolling) return void n.setState({ index: -1 });
        const l = n.getDiffPosition(a[0]),
          c = n.getValueFromPosition(l);
        n.move(c);
      }),
      (n.onKeyDown = (u) => {
        if (!(u.ctrlKey || u.shiftKey || u.altKey || u.metaKey))
          switch ((n.setState({ pending: !0 }), u.key)) {
            case "ArrowLeft":
            case "ArrowDown":
            case "Left":
            case "Down":
              u.preventDefault(), n.moveDownByStep();
              break;
            case "ArrowRight":
            case "ArrowUp":
            case "Right":
            case "Up":
              u.preventDefault(), n.moveUpByStep();
              break;
            case "Home":
              u.preventDefault(), n.move(n.props.min);
              break;
            case "End":
              u.preventDefault(), n.move(n.props.max);
              break;
            case "PageDown":
              u.preventDefault(), n.moveDownByStep(n.props.pageFn(n.props.step));
              break;
            case "PageUp":
              u.preventDefault(), n.moveUpByStep(n.props.pageFn(n.props.step));
          }
      }),
      (n.onSliderMouseDown = (u) => {
        if (!n.props.disabled && u.button !== 2) {
          if ((n.setState({ pending: !0 }), !n.props.snapDragDisabled)) {
            const a = n.getMousePosition(u);
            n.forceValueFromPosition(a[0], (l) => {
              n.start(l, a[0]), qe(n.getMouseEventMap());
            });
          }
          Nt(u);
        }
      }),
      (n.onSliderClick = (u) => {
        if (!n.props.disabled && n.props.onSliderClick && !n.hasMoved) {
          const a = n.getMousePosition(u),
            l = be(n.calcValue(n.calcOffsetFromPosition(a[0])), n.props);
          n.props.onSliderClick(l);
        }
      }),
      (n.createOnKeyDown = (u) => (a) => {
        n.props.disabled || (n.start(u), qe(n.getKeyDownEventMap()), Nt(a));
      }),
      (n.createOnMouseDown = (u) => (a) => {
        if (n.props.disabled || a.button === 2) return;
        n.setState({ pending: !0 });
        const l = n.getMousePosition(a);
        n.start(u, l[0]), qe(n.getMouseEventMap()), Nt(a);
      }),
      (n.createOnTouchStart = (u) => (a) => {
        if (n.props.disabled || a.touches.length > 1) return;
        n.setState({ pending: !0 });
        const l = n.getTouchPosition(a);
        (n.startPosition = l),
          (n.isScrolling = void 0),
          n.start(u, l[0]),
          qe(n.getTouchEventMap()),
          (function (c) {
            c.stopPropagation && c.stopPropagation();
          })(a);
      }),
      (n.handleResize = () => {
        const u = window.setTimeout(() => {
          n.pendingResizeTimeouts.shift(), n.resize();
        }, 0);
        n.pendingResizeTimeouts.push(u);
      }),
      (n.renderThumb = (u, a) => {
        const l =
            n.props.thumbClassName +
            " " +
            n.props.thumbClassName +
            "-" +
            a +
            " " +
            (n.state.index === a ? n.props.thumbActiveClassName : ""),
          c = {
            ref: (h) => {
              n["thumb" + a] = h;
            },
            key: n.props.thumbClassName + "-" + a,
            className: l,
            style: u,
            onMouseDown: n.createOnMouseDown(a),
            onTouchStart: n.createOnTouchStart(a),
            onFocus: n.createOnKeyDown(a),
            tabIndex: 0,
            role: "slider",
            "aria-orientation": n.props.orientation,
            "aria-valuenow": n.state.value[a],
            "aria-valuemin": n.props.min,
            "aria-valuemax": n.props.max,
            "aria-label": Array.isArray(n.props.ariaLabel)
              ? n.props.ariaLabel[a]
              : n.props.ariaLabel,
            "aria-labelledby": Array.isArray(n.props.ariaLabelledby)
              ? n.props.ariaLabelledby[a]
              : n.props.ariaLabelledby,
            "aria-disabled": n.props.disabled,
          },
          f = { index: a, value: Ge(n.state.value), valueNow: n.state.value[a] };
        return (
          n.props.ariaValuetext &&
            (c["aria-valuetext"] =
              typeof n.props.ariaValuetext == "string"
                ? n.props.ariaValuetext
                : n.props.ariaValuetext(f)),
          n.props.renderThumb(c, f)
        );
      }),
      (n.renderTrack = (u, a, l) => {
        const c = {
            key: n.props.trackClassName + "-" + u,
            className: n.props.trackClassName + " " + n.props.trackClassName + "-" + u,
            style: n.buildTrackStyle(a, n.state.upperBound - l),
          },
          f = { index: u, value: Ge(n.state.value) };
        return n.props.renderTrack(c, f);
      });
    let o = _t(i.value);
    o.length || (o = _t(i.defaultValue)), (n.pendingResizeTimeouts = []);
    const s = [];
    for (let u = 0; u < o.length; u += 1) (o[u] = be(o[u], i)), s.push(u);
    return (
      (n.resizeObserver = null),
      (n.resizeElementRef = we.createRef()),
      (n.state = { index: -1, upperBound: 0, sliderLength: 0, value: o, zIndices: s }),
      n
    );
  }
  Pi(t, e);
  var r = t.prototype;
  return (
    (r.componentDidMount = function () {
      typeof window < "u" &&
        ((this.resizeObserver = new ResizeObserver(this.handleResize)),
        this.resizeObserver.observe(this.resizeElementRef.current),
        this.resize());
    }),
    (t.getDerivedStateFromProps = function (i, n) {
      const o = _t(i.value);
      return o.length ? (n.pending ? null : { value: o.map((s) => be(s, i)) }) : null;
    }),
    (r.componentDidUpdate = function () {
      this.state.upperBound === 0 && this.resize();
    }),
    (r.componentWillUnmount = function () {
      this.clearPendingResizeTimeouts(), this.resizeObserver && this.resizeObserver.disconnect();
    }),
    (r.onEnd = function (i) {
      i &&
        (function (n) {
          Object.keys(n).forEach((o) => {
            typeof document < "u" && document.removeEventListener(o, n[o], !1);
          });
        })(i),
        this.hasMoved && this.fireChangeEvent("onAfterChange"),
        this.setState({ pending: !1 }),
        (this.hasMoved = !1);
    }),
    (r.getValue = function () {
      return Ge(this.state.value);
    }),
    (r.getClosestIndex = function (i) {
      let n = Number.MAX_VALUE,
        o = -1;
      const { value: s } = this.state,
        u = s.length;
      for (let a = 0; a < u; a += 1) {
        const l = this.calcOffset(s[a]),
          c = Math.abs(i - l);
        c < n && ((n = c), (o = a));
      }
      return o;
    }),
    (r.getMousePosition = function (i) {
      return [i["page" + this.axisKey()], i["page" + this.orthogonalAxisKey()]];
    }),
    (r.getTouchPosition = function (i) {
      const n = i.touches[0];
      return [n["page" + this.axisKey()], n["page" + this.orthogonalAxisKey()]];
    }),
    (r.getKeyDownEventMap = function () {
      return { keydown: this.onKeyDown, keyup: this.onKeyUp, focusout: this.onBlur };
    }),
    (r.getMouseEventMap = function () {
      return { mousemove: this.onMouseMove, mouseup: this.onMouseUp };
    }),
    (r.getTouchEventMap = function () {
      return { touchmove: this.onTouchMove, touchend: this.onTouchEnd };
    }),
    (r.getValueFromPosition = function (i) {
      const n =
        (i / (this.state.sliderLength - this.state.thumbSize)) * (this.props.max - this.props.min);
      return be(this.state.startValue + n, this.props);
    }),
    (r.getDiffPosition = function (i) {
      let n = i - this.state.startPosition;
      return this.props.invert && (n *= -1), n;
    }),
    (r.resize = function () {
      const { slider: i, thumb0: n } = this;
      if (!i || !n) return;
      const o = this.sizeKey(),
        s = i.getBoundingClientRect(),
        u = i[o],
        a = s[this.posMaxKey()],
        l = s[this.posMinKey()],
        c = n.getBoundingClientRect()[o.replace("client", "").toLowerCase()],
        f = u - c,
        h = Math.abs(a - l);
      (this.state.upperBound === f &&
        this.state.sliderLength === h &&
        this.state.thumbSize === c) ||
        this.setState({ upperBound: f, sliderLength: h, thumbSize: c });
    }),
    (r.calcOffset = function (i) {
      const n = this.props.max - this.props.min;
      return n === 0 ? 0 : ((i - this.props.min) / n) * this.state.upperBound;
    }),
    (r.calcValue = function (i) {
      return (i / this.state.upperBound) * (this.props.max - this.props.min) + this.props.min;
    }),
    (r.calcOffsetFromPosition = function (i) {
      const { slider: n } = this,
        o = n.getBoundingClientRect(),
        s = o[this.posMaxKey()],
        u = o[this.posMinKey()];
      let a = i - (window["page" + this.axisKey() + "Offset"] + (this.props.invert ? s : u));
      return (
        this.props.invert && (a = this.state.sliderLength - a), (a -= this.state.thumbSize / 2), a
      );
    }),
    (r.forceValueFromPosition = function (i, n) {
      const o = this.calcOffsetFromPosition(i),
        s = this.getClosestIndex(o),
        u = be(this.calcValue(o), this.props),
        a = this.state.value.slice();
      a[s] = u;
      for (let l = 0; l < a.length - 1; l += 1)
        if (a[l + 1] - a[l] < this.props.minDistance) return;
      this.fireChangeEvent("onBeforeChange"),
        (this.hasMoved = !0),
        this.setState({ value: a }, () => {
          n(s), this.fireChangeEvent("onChange");
        });
    }),
    (r.clearPendingResizeTimeouts = function () {
      do {
        const i = this.pendingResizeTimeouts.shift();
        clearTimeout(i);
      } while (this.pendingResizeTimeouts.length);
    }),
    (r.start = function (i, n) {
      const o = this["thumb" + i];
      o && o.focus();
      const { zIndices: s } = this.state;
      s.splice(s.indexOf(i), 1),
        s.push(i),
        this.setState((u) => ({
          startValue: u.value[i],
          startPosition: n !== void 0 ? n : u.startPosition,
          index: i,
          zIndices: s,
        }));
    }),
    (r.moveUpByStep = function (i) {
      i === void 0 && (i = this.props.step);
      const n = this.state.value[this.state.index],
        o = be(
          this.props.invert && this.props.orientation === "horizontal" ? n - i : n + i,
          this.props,
        );
      this.move(Math.min(o, this.props.max));
    }),
    (r.moveDownByStep = function (i) {
      i === void 0 && (i = this.props.step);
      const n = this.state.value[this.state.index],
        o = be(
          this.props.invert && this.props.orientation === "horizontal" ? n + i : n - i,
          this.props,
        );
      this.move(Math.max(o, this.props.min));
    }),
    (r.move = function (i) {
      const n = this.state.value.slice(),
        { index: o } = this.state,
        { length: s } = n,
        u = n[o];
      if (i === u) return;
      this.hasMoved || this.fireChangeEvent("onBeforeChange"), (this.hasMoved = !0);
      const { pearling: a, max: l, min: c, minDistance: f } = this.props;
      if (!a) {
        if (o > 0) {
          const h = n[o - 1];
          i < h + f && (i = h + f);
        }
        if (o < s - 1) {
          const h = n[o + 1];
          i > h - f && (i = h - f);
        }
      }
      (n[o] = i),
        a &&
          s > 1 &&
          (i > u
            ? (this.pushSucceeding(n, f, o),
              (function (h, v, b, g) {
                for (let p = 0; p < h; p += 1) {
                  const m = g - p * b;
                  v[h - 1 - p] > m && (v[h - 1 - p] = m);
                }
              })(s, n, f, l))
            : i < u &&
              (this.pushPreceding(n, f, o),
              (function (h, v, b, g) {
                for (let p = 0; p < h; p += 1) {
                  const m = g + p * b;
                  v[p] < m && (v[p] = m);
                }
              })(s, n, f, c))),
        this.setState({ value: n }, this.fireChangeEvent.bind(this, "onChange"));
    }),
    (r.pushSucceeding = function (i, n, o) {
      let s, u;
      for (s = o, u = i[s] + n; i[s + 1] !== null && u > i[s + 1]; s += 1, u = i[s] + n)
        i[s + 1] = Jt(u, this.props);
    }),
    (r.pushPreceding = function (i, n, o) {
      for (let s = o, u = i[s] - n; i[s - 1] !== null && u < i[s - 1]; s -= 1, u = i[s] - n)
        i[s - 1] = Jt(u, this.props);
    }),
    (r.axisKey = function () {
      return this.props.orientation === "vertical" ? "Y" : "X";
    }),
    (r.orthogonalAxisKey = function () {
      return this.props.orientation === "vertical" ? "X" : "Y";
    }),
    (r.posMinKey = function () {
      return this.props.orientation === "vertical"
        ? this.props.invert
          ? "bottom"
          : "top"
        : this.props.invert
          ? "right"
          : "left";
    }),
    (r.posMaxKey = function () {
      return this.props.orientation === "vertical"
        ? this.props.invert
          ? "top"
          : "bottom"
        : this.props.invert
          ? "left"
          : "right";
    }),
    (r.sizeKey = function () {
      return this.props.orientation === "vertical" ? "clientHeight" : "clientWidth";
    }),
    (r.fireChangeEvent = function (i) {
      this.props[i] && this.props[i](Ge(this.state.value), this.state.index);
    }),
    (r.buildThumbStyle = function (i, n) {
      const o = {
        position: "absolute",
        touchAction: "none",
        willChange: this.state.index >= 0 ? this.posMinKey() : void 0,
        zIndex: this.state.zIndices.indexOf(n) + 1,
      };
      return (o[this.posMinKey()] = i + "px"), o;
    }),
    (r.buildTrackStyle = function (i, n) {
      const o = {
        position: "absolute",
        willChange: this.state.index >= 0 ? this.posMinKey() + "," + this.posMaxKey() : void 0,
      };
      return (o[this.posMinKey()] = i), (o[this.posMaxKey()] = n), o;
    }),
    (r.buildMarkStyle = function (i) {
      var n;
      return ((n = { position: "absolute" })[this.posMinKey()] = i), n;
    }),
    (r.renderThumbs = function (i) {
      const { length: n } = i,
        o = [];
      for (let u = 0; u < n; u += 1) o[u] = this.buildThumbStyle(i[u], u);
      const s = [];
      for (let u = 0; u < n; u += 1) s[u] = this.renderThumb(o[u], u);
      return s;
    }),
    (r.renderTracks = function (i) {
      const n = [],
        o = i.length - 1;
      n.push(this.renderTrack(0, 0, i[0]));
      for (let s = 0; s < o; s += 1) n.push(this.renderTrack(s + 1, i[s], i[s + 1]));
      return n.push(this.renderTrack(o + 1, i[o], this.state.upperBound)), n;
    }),
    (r.renderMarks = function () {
      let { marks: i } = this.props;
      const n = this.props.max - this.props.min + 1;
      return (
        typeof i == "boolean"
          ? (i = Array.from({ length: n }).map((o, s) => s))
          : typeof i == "number" &&
            (i = Array.from({ length: n })
              .map((o, s) => s)
              .filter((o) => o % i == 0)),
        i
          .map(parseFloat)
          .sort((o, s) => o - s)
          .map((o) => {
            const s = this.calcOffset(o),
              u = { key: o, className: this.props.markClassName, style: this.buildMarkStyle(s) };
            return this.props.renderMark(u);
          })
      );
    }),
    (r.render = function () {
      const i = [],
        { value: n } = this.state,
        o = n.length;
      for (let l = 0; l < o; l += 1) i[l] = this.calcOffset(n[l], l);
      const s = this.props.withTracks ? this.renderTracks(i) : null,
        u = this.renderThumbs(i),
        a = this.props.marks ? this.renderMarks() : null;
      return we.createElement(
        "div",
        {
          ref: (l) => {
            (this.slider = l), (this.resizeElementRef.current = l);
          },
          style: { position: "relative" },
          className: this.props.className + (this.props.disabled ? " disabled" : ""),
          onMouseDown: this.onSliderMouseDown,
          onClick: this.onSliderClick,
        },
        s,
        u,
        a,
      );
    }),
    t
  );
})(we.Component);
(Zt.displayName = "ReactSlider"),
  (Zt.defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    pageFn: (e) => 10 * e,
    minDistance: 0,
    defaultValue: 0,
    orientation: "horizontal",
    className: "slider",
    thumbClassName: "thumb",
    thumbActiveClassName: "active",
    trackClassName: "track",
    markClassName: "mark",
    withTracks: !0,
    pearling: !1,
    disabled: !1,
    snapDragDisabled: !1,
    invert: !1,
    marks: [],
    renderThumb: (e) => we.createElement("div", e),
    renderTrack: (e) => we.createElement("div", e),
    renderMark: (e) => we.createElement("span", e),
  });
var Mc = Zt;
export {
  Oc as B,
  Or as L,
  wc as N,
  Cc as O,
  xc as R,
  Pc as S,
  Sc as a,
  Mc as b,
  Mo as c,
  Ec as l,
  pl as m,
  ge as u,
};
//# sourceMappingURL=@react-libs-CeaqA_Hv.js.map
