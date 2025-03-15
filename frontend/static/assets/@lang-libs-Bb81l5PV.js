const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/browser-ponyfill-B9iOa5IF.js", "assets/@app-libs-Cb_auZyT.js"]),
) => i.map((i) => d[i]);
import { r as T } from "./@app-libs-Cb_auZyT.js";
const Ze = (i, e, t, n) => {
    var r, a, u, o;
    const s = [t, { code: e, ...(n || {}) }];
    if (
      (a = (r = i == null ? void 0 : i.services) == null ? void 0 : r.logger) != null &&
      a.forward
    )
      return i.services.logger.forward(s, "warn", "react-i18next::", !0);
    U(s[0]) && (s[0] = `react-i18next:: ${s[0]}`),
      (o = (u = i == null ? void 0 : i.services) == null ? void 0 : u.logger) != null && o.warn
        ? i.services.logger.warn(...s)
        : console != null && console.warn && console.warn(...s);
  },
  ye = {},
  oe = (i, e, t, n) => {
    (U(t) && ye[t]) || (U(t) && (ye[t] = new Date()), Ze(i, e, t, n));
  },
  Ve = (i, e) => () => {
    if (i.isInitialized) e();
    else {
      const t = () => {
        setTimeout(() => {
          i.off("initialized", t);
        }, 0),
          e();
      };
      i.on("initialized", t);
    }
  },
  ue = (i, e, t) => {
    i.loadNamespaces(e, Ve(i, t));
  },
  be = (i, e, t, n) => {
    if ((U(t) && (t = [t]), i.options.preload && i.options.preload.indexOf(e) > -1))
      return ue(i, t, n);
    t.forEach((s) => {
      i.options.ns.indexOf(s) < 0 && i.options.ns.push(s);
    }),
      i.loadLanguages(e, Ve(i, n));
  },
  _e = (i, e, t = {}) =>
    !e.languages || !e.languages.length
      ? (oe(e, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
          languages: e.languages,
        }),
        !0)
      : e.hasLoadedNamespace(i, {
          lng: t.lng,
          precheck: (n, s) => {
            var r;
            if (
              ((r = t.bindI18n) == null ? void 0 : r.indexOf("languageChanging")) > -1 &&
              n.services.backendConnector.backend &&
              n.isLanguageChangingTo &&
              !s(n.isLanguageChangingTo, i)
            )
              return !1;
          },
        }),
  U = (i) => typeof i == "string",
  et = (i) => typeof i == "object" && i !== null,
  tt =
    /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
  nt = {
    "&amp;": "&",
    "&#38;": "&",
    "&lt;": "<",
    "&#60;": "<",
    "&gt;": ">",
    "&#62;": ">",
    "&apos;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&#34;": '"',
    "&nbsp;": " ",
    "&#160;": " ",
    "&copy;": "©",
    "&#169;": "©",
    "&reg;": "®",
    "&#174;": "®",
    "&hellip;": "…",
    "&#8230;": "…",
    "&#x2F;": "/",
    "&#47;": "/",
  },
  st = (i) => nt[i],
  it = (i) => i.replace(tt, st);
let le = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: it,
};
const rt = (i = {}) => {
    le = { ...le, ...i };
  },
  at = () => le;
let qe;
const ot = (i) => {
    qe = i;
  },
  ut = () => qe,
  fn = {
    type: "3rdParty",
    init(i) {
      rt(i.options.react), ot(i);
    },
  },
  lt = T.createContext();
class ft {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(e) {
    e.forEach((t) => {
      this.usedNamespaces[t] || (this.usedNamespaces[t] = !0);
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const ct = (i, e) => {
    const t = T.useRef();
    return (
      T.useEffect(() => {
        t.current = i;
      }, [i, e]),
      t.current
    );
  },
  ze = (i, e, t, n) => i.getFixedT(e, t, n),
  dt = (i, e, t, n) => T.useCallback(ze(i, e, t, n), [i, e, t, n]),
  cn = (i, e = {}) => {
    var R, A, F, x;
    const { i18n: t } = e,
      { i18n: n, defaultNS: s } = T.useContext(lt) || {},
      r = t || n || ut();
    if ((r && !r.reportNamespaces && (r.reportNamespaces = new ft()), !r)) {
      oe(
        r,
        "NO_I18NEXT_INSTANCE",
        "useTranslation: You will need to pass in an i18next instance by using initReactI18next",
      );
      const b = (P, v) =>
          U(v)
            ? v
            : et(v) && U(v.defaultValue)
              ? v.defaultValue
              : Array.isArray(P)
                ? P[P.length - 1]
                : P,
        L = [b, {}, !1];
      return (L.t = b), (L.i18n = {}), (L.ready = !1), L;
    }
    (R = r.options.react) != null &&
      R.wait &&
      oe(
        r,
        "DEPRECATED_OPTION",
        "useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.",
      );
    const a = { ...at(), ...r.options.react, ...e },
      { useSuspense: u, keyPrefix: o } = a;
    let l = s || ((A = r.options) == null ? void 0 : A.defaultNS);
    (l = U(l) ? [l] : l || ["translation"]),
      (x = (F = r.reportNamespaces).addUsedNamespaces) == null || x.call(F, l);
    const f = (r.isInitialized || r.initializedStoreOnce) && l.every((b) => _e(b, r, a)),
      d = dt(r, e.lng || null, a.nsMode === "fallback" ? l : l[0], o),
      c = () => d,
      g = () => ze(r, e.lng || null, a.nsMode === "fallback" ? l : l[0], o),
      [h, p] = T.useState(c);
    let y = l.join();
    e.lng && (y = `${e.lng}${y}`);
    const w = ct(y),
      S = T.useRef(!0);
    T.useEffect(() => {
      const { bindI18n: b, bindI18nStore: L } = a;
      (S.current = !0),
        !f &&
          !u &&
          (e.lng
            ? be(r, e.lng, l, () => {
                S.current && p(g);
              })
            : ue(r, l, () => {
                S.current && p(g);
              })),
        f && w && w !== y && S.current && p(g);
      const P = () => {
        S.current && p(g);
      };
      return (
        b && (r == null || r.on(b, P)),
        L && (r == null || r.store.on(L, P)),
        () => {
          (S.current = !1),
            r && (b == null || b.split(" ").forEach((v) => r.off(v, P))),
            L && r && L.split(" ").forEach((v) => r.store.off(v, P));
        }
      );
    }, [r, y]),
      T.useEffect(() => {
        S.current && f && p(c);
      }, [r, o, f]);
    const O = [h, r, f];
    if (((O.t = h), (O.i18n = r), (O.ready = f), f || (!f && !u))) return O;
    throw new Promise((b) => {
      e.lng ? be(r, e.lng, l, () => b()) : ue(r, l, () => b());
    });
  },
  m = (i) => typeof i == "string",
  B = () => {
    let i, e;
    const t = new Promise((n, s) => {
      (i = n), (e = s);
    });
    return (t.resolve = i), (t.reject = e), t;
  },
  ve = (i) => (i == null ? "" : "" + i),
  ht = (i, e, t) => {
    i.forEach((n) => {
      e[n] && (t[n] = e[n]);
    });
  },
  gt = /###/g,
  Se = (i) => (i && i.indexOf("###") > -1 ? i.replace(gt, ".") : i),
  xe = (i) => !i || m(i),
  W = (i, e, t) => {
    const n = m(e) ? e.split(".") : e;
    let s = 0;
    for (; s < n.length - 1; ) {
      if (xe(i)) return {};
      const r = Se(n[s]);
      !i[r] && t && (i[r] = new t()),
        Object.prototype.hasOwnProperty.call(i, r) ? (i = i[r]) : (i = {}),
        ++s;
    }
    return xe(i) ? {} : { obj: i, k: Se(n[s]) };
  },
  we = (i, e, t) => {
    const { obj: n, k: s } = W(i, e, Object);
    if (n !== void 0 || e.length === 1) {
      n[s] = t;
      return;
    }
    let r = e[e.length - 1],
      a = e.slice(0, e.length - 1),
      u = W(i, a, Object);
    for (; u.obj === void 0 && a.length; )
      (r = `${a[a.length - 1]}.${r}`),
        (a = a.slice(0, a.length - 1)),
        (u = W(i, a, Object)),
        u != null && u.obj && typeof u.obj[`${u.k}.${r}`] < "u" && (u.obj = void 0);
    u.obj[`${u.k}.${r}`] = t;
  },
  pt = (i, e, t, n) => {
    const { obj: s, k: r } = W(i, e, Object);
    (s[r] = s[r] || []), s[r].push(t);
  },
  _ = (i, e) => {
    const { obj: t, k: n } = W(i, e);
    if (t && Object.prototype.hasOwnProperty.call(t, n)) return t[n];
  },
  mt = (i, e, t) => {
    const n = _(i, t);
    return n !== void 0 ? n : _(e, t);
  },
  Be = (i, e, t) => {
    for (const n in e)
      n !== "__proto__" &&
        n !== "constructor" &&
        (n in i
          ? m(i[n]) || i[n] instanceof String || m(e[n]) || e[n] instanceof String
            ? t && (i[n] = e[n])
            : Be(i[n], e[n], t)
          : (i[n] = e[n]));
    return i;
  },
  M = (i) => i.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var yt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" };
const bt = (i) => (m(i) ? i.replace(/[&<>"'\/]/g, (e) => yt[e]) : i);
class vt {
  constructor(e) {
    (this.capacity = e), (this.regExpMap = new Map()), (this.regExpQueue = []);
  }
  getRegExp(e) {
    const t = this.regExpMap.get(e);
    if (t !== void 0) return t;
    const n = new RegExp(e);
    return (
      this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()),
      this.regExpMap.set(e, n),
      this.regExpQueue.push(e),
      n
    );
  }
}
const St = [" ", ",", "?", "!", ";"],
  xt = new vt(20),
  wt = (i, e, t) => {
    (e = e || ""), (t = t || "");
    const n = St.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0);
    if (n.length === 0) return !0;
    const s = xt.getRegExp(`(${n.map((a) => (a === "?" ? "\\?" : a)).join("|")})`);
    let r = !s.test(i);
    if (!r) {
      const a = i.indexOf(t);
      a > 0 && !s.test(i.substring(0, a)) && (r = !0);
    }
    return r;
  },
  fe = function (i, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
    if (!i) return;
    if (i[e]) return Object.prototype.hasOwnProperty.call(i, e) ? i[e] : void 0;
    const n = e.split(t);
    let s = i;
    for (let r = 0; r < n.length; ) {
      if (!s || typeof s != "object") return;
      let a,
        u = "";
      for (let o = r; o < n.length; ++o)
        if ((o !== r && (u += t), (u += n[o]), (a = s[u]), a !== void 0)) {
          if (["string", "number", "boolean"].indexOf(typeof a) > -1 && o < n.length - 1) continue;
          r += o - r + 1;
          break;
        }
      s = a;
    }
    return s;
  },
  ee = (i) => (i == null ? void 0 : i.replace("_", "-")),
  Ot = {
    type: "logger",
    log(i) {
      this.output("log", i);
    },
    warn(i) {
      this.output("warn", i);
    },
    error(i) {
      this.output("error", i);
    },
    output(i, e) {
      var t, n;
      (n = (t = console == null ? void 0 : console[i]) == null ? void 0 : t.apply) == null ||
        n.call(t, console, e);
    },
  };
class te {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(e, t);
  }
  init(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (this.prefix = t.prefix || "i18next:"),
      (this.logger = e || Ot),
      (this.options = t),
      (this.debug = t.debug);
  }
  log() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return this.forward(t, "log", "", !0);
  }
  warn() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return this.forward(t, "warn", "", !0);
  }
  error() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return this.forward(t, "error", "");
  }
  deprecate() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return this.forward(t, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, t, n, s) {
    return s && !this.debug
      ? null
      : (m(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[t](e));
  }
  create(e) {
    return new te(this.logger, { prefix: `${this.prefix}:${e}:`, ...this.options });
  }
  clone(e) {
    return (e = e || this.options), (e.prefix = e.prefix || this.prefix), new te(this.logger, e);
  }
}
var E = new te();
class ie {
  constructor() {
    this.observers = {};
  }
  on(e, t) {
    return (
      e.split(" ").forEach((n) => {
        this.observers[n] || (this.observers[n] = new Map());
        const s = this.observers[n].get(t) || 0;
        this.observers[n].set(t, s + 1);
      }),
      this
    );
  }
  off(e, t) {
    if (this.observers[e]) {
      if (!t) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(t);
    }
  }
  emit(e) {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      n[s - 1] = arguments[s];
    this.observers[e] &&
      Array.from(this.observers[e].entries()).forEach((a) => {
        let [u, o] = a;
        for (let l = 0; l < o; l++) u(...n);
      }),
      this.observers["*"] &&
        Array.from(this.observers["*"].entries()).forEach((a) => {
          let [u, o] = a;
          for (let l = 0; l < o; l++) u.apply(u, [e, ...n]);
        });
  }
}
class Oe extends ie {
  constructor(e) {
    let t =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : { ns: ["translation"], defaultNS: "translation" };
    super(),
      (this.data = e || {}),
      (this.options = t),
      this.options.keySeparator === void 0 && (this.options.keySeparator = "."),
      this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const t = this.options.ns.indexOf(e);
    t > -1 && this.options.ns.splice(t, 1);
  }
  getResource(e, t, n) {
    var l, f;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const r = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator,
      a =
        s.ignoreJSONStructure !== void 0 ? s.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let u;
    e.indexOf(".") > -1
      ? (u = e.split("."))
      : ((u = [e, t]),
        n && (Array.isArray(n) ? u.push(...n) : m(n) && r ? u.push(...n.split(r)) : u.push(n)));
    const o = _(this.data, u);
    return (
      !o && !t && !n && e.indexOf(".") > -1 && ((e = u[0]), (t = u[1]), (n = u.slice(2).join("."))),
      o || !a || !m(n)
        ? o
        : fe((f = (l = this.data) == null ? void 0 : l[e]) == null ? void 0 : f[t], n, r)
    );
  }
  addResource(e, t, n, s) {
    let r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : { silent: !1 };
    const a = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator;
    let u = [e, t];
    n && (u = u.concat(a ? n.split(a) : n)),
      e.indexOf(".") > -1 && ((u = e.split(".")), (s = t), (t = u[1])),
      this.addNamespaces(t),
      we(this.data, u, s),
      r.silent || this.emit("added", e, t, n, s);
  }
  addResources(e, t, n) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : { silent: !1 };
    for (const r in n)
      (m(n[r]) || Array.isArray(n[r])) && this.addResource(e, t, r, n[r], { silent: !0 });
    s.silent || this.emit("added", e, t, n);
  }
  addResourceBundle(e, t, n, s, r) {
    let a =
        arguments.length > 5 && arguments[5] !== void 0
          ? arguments[5]
          : { silent: !1, skipCopy: !1 },
      u = [e, t];
    e.indexOf(".") > -1 && ((u = e.split(".")), (s = n), (n = t), (t = u[1])),
      this.addNamespaces(t);
    let o = _(this.data, u) || {};
    a.skipCopy || (n = JSON.parse(JSON.stringify(n))),
      s ? Be(o, n, r) : (o = { ...o, ...n }),
      we(this.data, u, o),
      a.silent || this.emit("added", e, t, n);
  }
  removeResourceBundle(e, t) {
    this.hasResourceBundle(e, t) && delete this.data[e][t],
      this.removeNamespaces(t),
      this.emit("removed", e, t);
  }
  hasResourceBundle(e, t) {
    return this.getResource(e, t) !== void 0;
  }
  getResourceBundle(e, t) {
    return t || (t = this.options.defaultNS), this.getResource(e, t);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const t = this.getDataByLanguage(e);
    return !!((t && Object.keys(t)) || []).find((s) => t[s] && Object.keys(t[s]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Xe = {
  processors: {},
  addPostProcessor(i) {
    this.processors[i.name] = i;
  },
  handle(i, e, t, n, s) {
    return (
      i.forEach((r) => {
        var a;
        e = ((a = this.processors[r]) == null ? void 0 : a.process(e, t, n, s)) ?? e;
      }),
      e
    );
  },
};
const Le = {},
  Pe = (i) => !m(i) && typeof i != "boolean" && typeof i != "number";
class ne extends ie {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(),
      ht(
        [
          "resourceStore",
          "languageUtils",
          "pluralResolver",
          "interpolator",
          "backendConnector",
          "i18nFormat",
          "utils",
        ],
        e,
        this,
      ),
      (this.options = t),
      this.options.keySeparator === void 0 && (this.options.keySeparator = "."),
      (this.logger = E.create("translator"));
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} };
    if (e == null) return !1;
    const n = this.resolve(e, t);
    return (n == null ? void 0 : n.res) !== void 0;
  }
  extractFromKey(e, t) {
    let n = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator;
    n === void 0 && (n = ":");
    const s = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator;
    let r = t.ns || this.options.defaultNS || [];
    const a = n && e.indexOf(n) > -1,
      u =
        !this.options.userDefinedKeySeparator &&
        !t.keySeparator &&
        !this.options.userDefinedNsSeparator &&
        !t.nsSeparator &&
        !wt(e, n, s);
    if (a && !u) {
      const o = e.match(this.interpolator.nestingRegexp);
      if (o && o.length > 0) return { key: e, namespaces: m(r) ? [r] : r };
      const l = e.split(n);
      (n !== s || (n === s && this.options.ns.indexOf(l[0]) > -1)) && (r = l.shift()),
        (e = l.join(s));
    }
    return { key: e, namespaces: m(r) ? [r] : r };
  }
  translate(e, t, n) {
    if (
      (typeof t != "object" &&
        this.options.overloadTranslationOptionHandler &&
        (t = this.options.overloadTranslationOptionHandler(arguments)),
      typeof t == "object" && (t = { ...t }),
      t || (t = {}),
      e == null)
    )
      return "";
    Array.isArray(e) || (e = [String(e)]);
    const s = t.returnDetails !== void 0 ? t.returnDetails : this.options.returnDetails,
      r = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator,
      { key: a, namespaces: u } = this.extractFromKey(e[e.length - 1], t),
      o = u[u.length - 1],
      l = t.lng || this.language,
      f = t.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((l == null ? void 0 : l.toLowerCase()) === "cimode") {
      if (f) {
        const v = t.nsSeparator || this.options.nsSeparator;
        return s
          ? {
              res: `${o}${v}${a}`,
              usedKey: a,
              exactUsedKey: a,
              usedLng: l,
              usedNS: o,
              usedParams: this.getUsedParamsDetails(t),
            }
          : `${o}${v}${a}`;
      }
      return s
        ? {
            res: a,
            usedKey: a,
            exactUsedKey: a,
            usedLng: l,
            usedNS: o,
            usedParams: this.getUsedParamsDetails(t),
          }
        : a;
    }
    const d = this.resolve(e, t);
    let c = d == null ? void 0 : d.res;
    const g = (d == null ? void 0 : d.usedKey) || a,
      h = (d == null ? void 0 : d.exactUsedKey) || a,
      p = ["[object Number]", "[object Function]", "[object RegExp]"],
      y = t.joinArrays !== void 0 ? t.joinArrays : this.options.joinArrays,
      w = !this.i18nFormat || this.i18nFormat.handleAsObject,
      S = t.count !== void 0 && !m(t.count),
      O = ne.hasDefaultValue(t),
      R = S ? this.pluralResolver.getSuffix(l, t.count, t) : "",
      A = t.ordinal && S ? this.pluralResolver.getSuffix(l, t.count, { ordinal: !1 }) : "",
      F = S && !t.ordinal && t.count === 0,
      x =
        (F && t[`defaultValue${this.options.pluralSeparator}zero`]) ||
        t[`defaultValue${R}`] ||
        t[`defaultValue${A}`] ||
        t.defaultValue;
    let b = c;
    w && !c && O && (b = x);
    const L = Pe(b),
      P = Object.prototype.toString.apply(b);
    if (w && b && L && p.indexOf(P) < 0 && !(m(y) && Array.isArray(b))) {
      if (!t.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler ||
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const v = this.options.returnedObjectHandler
          ? this.options.returnedObjectHandler(g, b, { ...t, ns: u })
          : `key '${a} (${this.language})' returned an object instead of string.`;
        return s ? ((d.res = v), (d.usedParams = this.getUsedParamsDetails(t)), d) : v;
      }
      if (r) {
        const v = Array.isArray(b),
          k = v ? [] : {},
          he = v ? h : g;
        for (const N in b)
          if (Object.prototype.hasOwnProperty.call(b, N)) {
            const j = `${he}${r}${N}`;
            O && !c
              ? (k[N] = this.translate(j, {
                  ...t,
                  defaultValue: Pe(x) ? x[N] : void 0,
                  joinArrays: !1,
                  ns: u,
                }))
              : (k[N] = this.translate(j, { ...t, joinArrays: !1, ns: u })),
              k[N] === j && (k[N] = b[N]);
          }
        c = k;
      }
    } else if (w && m(y) && Array.isArray(c))
      (c = c.join(y)), c && (c = this.extendTranslation(c, e, t, n));
    else {
      let v = !1,
        k = !1;
      !this.isValidLookup(c) && O && ((v = !0), (c = x)),
        this.isValidLookup(c) || ((k = !0), (c = a));
      const N =
          (t.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && k
            ? void 0
            : c,
        j = O && x !== c && this.options.updateMissing;
      if (k || v || j) {
        if ((this.logger.log(j ? "updateKey" : "missingKey", l, o, a, j ? x : c), r)) {
          const $ = this.resolve(a, { ...t, keySeparator: !1 });
          $ &&
            $.res &&
            this.logger.warn(
              "Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.",
            );
        }
        let q = [];
        const Y = this.languageUtils.getFallbackCodes(
          this.options.fallbackLng,
          t.lng || this.language,
        );
        if (this.options.saveMissingTo === "fallback" && Y && Y[0])
          for (let $ = 0; $ < Y.length; $++) q.push(Y[$]);
        else
          this.options.saveMissingTo === "all"
            ? (q = this.languageUtils.toResolveHierarchy(t.lng || this.language))
            : q.push(t.lng || this.language);
        const ge = ($, D, z) => {
          var me;
          const pe = O && z !== c ? z : N;
          this.options.missingKeyHandler
            ? this.options.missingKeyHandler($, o, D, pe, j, t)
            : (me = this.backendConnector) != null &&
              me.saveMissing &&
              this.backendConnector.saveMissing($, o, D, pe, j, t),
            this.emit("missingKey", $, o, D, c);
        };
        this.options.saveMissing &&
          (this.options.saveMissingPlurals && S
            ? q.forEach(($) => {
                const D = this.pluralResolver.getSuffixes($, t);
                F &&
                  t[`defaultValue${this.options.pluralSeparator}zero`] &&
                  D.indexOf(`${this.options.pluralSeparator}zero`) < 0 &&
                  D.push(`${this.options.pluralSeparator}zero`),
                  D.forEach((z) => {
                    ge([$], a + z, t[`defaultValue${z}`] || x);
                  });
              })
            : ge(q, a, x));
      }
      (c = this.extendTranslation(c, e, t, d, n)),
        k && c === a && this.options.appendNamespaceToMissingKey && (c = `${o}:${a}`),
        (k || v) &&
          this.options.parseMissingKeyHandler &&
          (c = this.options.parseMissingKeyHandler(
            this.options.appendNamespaceToMissingKey ? `${o}:${a}` : a,
            v ? c : void 0,
          ));
    }
    return s ? ((d.res = c), (d.usedParams = this.getUsedParamsDetails(t)), d) : c;
  }
  extendTranslation(e, t, n, s, r) {
    var l, f;
    var a = this;
    if ((l = this.i18nFormat) != null && l.parse)
      e = this.i18nFormat.parse(
        e,
        { ...this.options.interpolation.defaultVariables, ...n },
        n.lng || this.language || s.usedLng,
        s.usedNS,
        s.usedKey,
        { resolved: s },
      );
    else if (!n.skipInterpolation) {
      n.interpolation &&
        this.interpolator.init({
          ...n,
          interpolation: { ...this.options.interpolation, ...n.interpolation },
        });
      const d =
        m(e) &&
        (((f = n == null ? void 0 : n.interpolation) == null ? void 0 : f.skipOnVariables) !==
        void 0
          ? n.interpolation.skipOnVariables
          : this.options.interpolation.skipOnVariables);
      let c;
      if (d) {
        const h = e.match(this.interpolator.nestingRegexp);
        c = h && h.length;
      }
      let g = n.replace && !m(n.replace) ? n.replace : n;
      if (
        (this.options.interpolation.defaultVariables &&
          (g = { ...this.options.interpolation.defaultVariables, ...g }),
        (e = this.interpolator.interpolate(e, g, n.lng || this.language || s.usedLng, n)),
        d)
      ) {
        const h = e.match(this.interpolator.nestingRegexp),
          p = h && h.length;
        c < p && (n.nest = !1);
      }
      !n.lng && s && s.res && (n.lng = this.language || s.usedLng),
        n.nest !== !1 &&
          (e = this.interpolator.nest(
            e,
            function () {
              for (var h = arguments.length, p = new Array(h), y = 0; y < h; y++)
                p[y] = arguments[y];
              return (r == null ? void 0 : r[0]) === p[0] && !n.context
                ? (a.logger.warn(
                    `It seems you are nesting recursively key: ${p[0]} in key: ${t[0]}`,
                  ),
                  null)
                : a.translate(...p, t);
            },
            n,
          )),
        n.interpolation && this.interpolator.reset();
    }
    const u = n.postProcess || this.options.postProcess,
      o = m(u) ? [u] : u;
    return (
      e != null &&
        o != null &&
        o.length &&
        n.applyPostProcessor !== !1 &&
        (e = Xe.handle(
          o,
          e,
          t,
          this.options && this.options.postProcessPassResolved
            ? { i18nResolved: { ...s, usedParams: this.getUsedParamsDetails(n) }, ...n }
            : n,
          this,
        )),
      e
    );
  }
  resolve(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n,
      s,
      r,
      a,
      u;
    return (
      m(e) && (e = [e]),
      e.forEach((o) => {
        if (this.isValidLookup(n)) return;
        const l = this.extractFromKey(o, t),
          f = l.key;
        s = f;
        let d = l.namespaces;
        this.options.fallbackNS && (d = d.concat(this.options.fallbackNS));
        const c = t.count !== void 0 && !m(t.count),
          g = c && !t.ordinal && t.count === 0,
          h =
            t.context !== void 0 &&
            (m(t.context) || typeof t.context == "number") &&
            t.context !== "",
          p = t.lngs
            ? t.lngs
            : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng);
        d.forEach((y) => {
          var w, S;
          this.isValidLookup(n) ||
            ((u = y),
            !Le[`${p[0]}-${y}`] &&
              (w = this.utils) != null &&
              w.hasLoadedNamespace &&
              !((S = this.utils) != null && S.hasLoadedNamespace(u)) &&
              ((Le[`${p[0]}-${y}`] = !0),
              this.logger.warn(
                `key "${s}" for languages "${p.join(", ")}" won't get resolved as namespace "${u}" was not yet loaded`,
                "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!",
              )),
            p.forEach((O) => {
              var F;
              if (this.isValidLookup(n)) return;
              a = O;
              const R = [f];
              if ((F = this.i18nFormat) != null && F.addLookupKeys)
                this.i18nFormat.addLookupKeys(R, f, O, y, t);
              else {
                let x;
                c && (x = this.pluralResolver.getSuffix(O, t.count, t));
                const b = `${this.options.pluralSeparator}zero`,
                  L = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                if (
                  (c &&
                    (R.push(f + x),
                    t.ordinal &&
                      x.indexOf(L) === 0 &&
                      R.push(f + x.replace(L, this.options.pluralSeparator)),
                    g && R.push(f + b)),
                  h)
                ) {
                  const P = `${f}${this.options.contextSeparator}${t.context}`;
                  R.push(P),
                    c &&
                      (R.push(P + x),
                      t.ordinal &&
                        x.indexOf(L) === 0 &&
                        R.push(P + x.replace(L, this.options.pluralSeparator)),
                      g && R.push(P + b));
                }
              }
              let A;
              for (; (A = R.pop()); )
                this.isValidLookup(n) || ((r = A), (n = this.getResource(O, y, A, t)));
            }));
        });
      }),
      { res: n, usedKey: s, exactUsedKey: r, usedLng: a, usedNS: u }
    );
  }
  isValidLookup(e) {
    return (
      e !== void 0 &&
      !(!this.options.returnNull && e === null) &&
      !(!this.options.returnEmptyString && e === "")
    );
  }
  getResource(e, t, n) {
    var r;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    return (r = this.i18nFormat) != null && r.getResource
      ? this.i18nFormat.getResource(e, t, n, s)
      : this.resourceStore.getResource(e, t, n, s);
  }
  getUsedParamsDetails() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const t = [
        "defaultValue",
        "ordinal",
        "context",
        "replace",
        "lng",
        "lngs",
        "fallbackLng",
        "ns",
        "keySeparator",
        "nsSeparator",
        "returnObjects",
        "returnDetails",
        "joinArrays",
        "postProcess",
        "interpolation",
      ],
      n = e.replace && !m(e.replace);
    let s = n ? e.replace : e;
    if (
      (n && typeof e.count < "u" && (s.count = e.count),
      this.options.interpolation.defaultVariables &&
        (s = { ...this.options.interpolation.defaultVariables, ...s }),
      !n)
    ) {
      s = { ...s };
      for (const r of t) delete s[r];
    }
    return s;
  }
  static hasDefaultValue(e) {
    const t = "defaultValue";
    for (const n in e)
      if (
        Object.prototype.hasOwnProperty.call(e, n) &&
        t === n.substring(0, t.length) &&
        e[n] !== void 0
      )
        return !0;
    return !1;
  }
}
class Ce {
  constructor(e) {
    (this.options = e),
      (this.supportedLngs = this.options.supportedLngs || !1),
      (this.logger = E.create("languageUtils"));
  }
  getScriptPartFromCode(e) {
    if (((e = ee(e)), !e || e.indexOf("-") < 0)) return null;
    const t = e.split("-");
    return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === "x")
      ? null
      : this.formatLanguageCode(t.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (((e = ee(e)), !e || e.indexOf("-") < 0)) return e;
    const t = e.split("-");
    return this.formatLanguageCode(t[0]);
  }
  formatLanguageCode(e) {
    if (m(e) && e.indexOf("-") > -1) {
      let t;
      try {
        t = Intl.getCanonicalLocales(e)[0];
      } catch {}
      return (
        t && this.options.lowerCaseLng && (t = t.toLowerCase()),
        t || (this.options.lowerCaseLng ? e.toLowerCase() : e)
      );
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (
      (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) &&
        (e = this.getLanguagePartFromCode(e)),
      !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1
    );
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let t;
    return (
      e.forEach((n) => {
        if (t) return;
        const s = this.formatLanguageCode(n);
        (!this.options.supportedLngs || this.isSupportedCode(s)) && (t = s);
      }),
      !t &&
        this.options.supportedLngs &&
        e.forEach((n) => {
          if (t) return;
          const s = this.getLanguagePartFromCode(n);
          if (this.isSupportedCode(s)) return (t = s);
          t = this.options.supportedLngs.find((r) => {
            if (r === s) return r;
            if (
              !(r.indexOf("-") < 0 && s.indexOf("-") < 0) &&
              ((r.indexOf("-") > 0 && s.indexOf("-") < 0 && r.substring(0, r.indexOf("-")) === s) ||
                (r.indexOf(s) === 0 && s.length > 1))
            )
              return r;
          });
        }),
      t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]),
      t
    );
  }
  getFallbackCodes(e, t) {
    if (!e) return [];
    if ((typeof e == "function" && (e = e(t)), m(e) && (e = [e]), Array.isArray(e))) return e;
    if (!t) return e.default || [];
    let n = e[t];
    return (
      n || (n = e[this.getScriptPartFromCode(t)]),
      n || (n = e[this.formatLanguageCode(t)]),
      n || (n = e[this.getLanguagePartFromCode(t)]),
      n || (n = e.default),
      n || []
    );
  }
  toResolveHierarchy(e, t) {
    const n = this.getFallbackCodes(t || this.options.fallbackLng || [], e),
      s = [],
      r = (a) => {
        a &&
          (this.isSupportedCode(a)
            ? s.push(a)
            : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`));
      };
    return (
      m(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1)
        ? (this.options.load !== "languageOnly" && r(this.formatLanguageCode(e)),
          this.options.load !== "languageOnly" &&
            this.options.load !== "currentOnly" &&
            r(this.getScriptPartFromCode(e)),
          this.options.load !== "currentOnly" && r(this.getLanguagePartFromCode(e)))
        : m(e) && r(this.formatLanguageCode(e)),
      n.forEach((a) => {
        s.indexOf(a) < 0 && r(this.formatLanguageCode(a));
      }),
      s
    );
  }
}
const Re = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 },
  $e = {
    select: (i) => (i === 1 ? "one" : "other"),
    resolvedOptions: () => ({ pluralCategories: ["one", "other"] }),
  };
class Lt {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (this.languageUtils = e),
      (this.options = t),
      (this.logger = E.create("pluralResolver")),
      (this.pluralRulesCache = {});
  }
  addRule(e, t) {
    this.rules[e] = t;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = ee(e === "dev" ? "en" : e),
      s = t.ordinal ? "ordinal" : "cardinal",
      r = JSON.stringify({ cleanedCode: n, type: s });
    if (r in this.pluralRulesCache) return this.pluralRulesCache[r];
    let a;
    try {
      a = new Intl.PluralRules(n, { type: s });
    } catch {
      if (!Intl) return this.logger.error("No Intl support, please use an Intl polyfill!"), $e;
      if (!e.match(/-|_/)) return $e;
      const o = this.languageUtils.getLanguagePartFromCode(e);
      a = this.getRule(o, t);
    }
    return (this.pluralRulesCache[r] = a), a;
  }
  needsPlural(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = this.getRule(e, t);
    return (
      n || (n = this.getRule("dev", t)),
      (n == null ? void 0 : n.resolvedOptions().pluralCategories.length) > 1
    );
  }
  getPluralFormsOfKey(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(e, n).map((s) => `${t}${s}`);
  }
  getSuffixes(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = this.getRule(e, t);
    return (
      n || (n = this.getRule("dev", t)),
      n
        ? n
            .resolvedOptions()
            .pluralCategories.sort((s, r) => Re[s] - Re[r])
            .map(
              (s) =>
                `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ""}${s}`,
            )
        : []
    );
  }
  getSuffix(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const s = this.getRule(e, n);
    return s
      ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${s.select(t)}`
      : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", t, n));
  }
}
const ke = function (i, e, t) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".",
      s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0,
      r = mt(i, e, t);
    return !r && s && m(t) && ((r = fe(i, t, n)), r === void 0 && (r = fe(e, t, n))), r;
  },
  re = (i) => i.replace(/\$/g, "$$$$");
class Pt {
  constructor() {
    var t;
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    (this.logger = E.create("interpolator")),
      (this.options = e),
      (this.format =
        ((t = e == null ? void 0 : e.interpolation) == null ? void 0 : t.format) || ((n) => n)),
      this.init(e);
  }
  init() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    e.interpolation || (e.interpolation = { escapeValue: !0 });
    const {
      escape: t,
      escapeValue: n,
      useRawValueToEscape: s,
      prefix: r,
      prefixEscaped: a,
      suffix: u,
      suffixEscaped: o,
      formatSeparator: l,
      unescapeSuffix: f,
      unescapePrefix: d,
      nestingPrefix: c,
      nestingPrefixEscaped: g,
      nestingSuffix: h,
      nestingSuffixEscaped: p,
      nestingOptionsSeparator: y,
      maxReplaces: w,
      alwaysFormat: S,
    } = e.interpolation;
    (this.escape = t !== void 0 ? t : bt),
      (this.escapeValue = n !== void 0 ? n : !0),
      (this.useRawValueToEscape = s !== void 0 ? s : !1),
      (this.prefix = r ? M(r) : a || "{{"),
      (this.suffix = u ? M(u) : o || "}}"),
      (this.formatSeparator = l || ","),
      (this.unescapePrefix = f ? "" : d || "-"),
      (this.unescapeSuffix = this.unescapePrefix ? "" : f || ""),
      (this.nestingPrefix = c ? M(c) : g || M("$t(")),
      (this.nestingSuffix = h ? M(h) : p || M(")")),
      (this.nestingOptionsSeparator = y || ","),
      (this.maxReplaces = w || 1e3),
      (this.alwaysFormat = S !== void 0 ? S : !1),
      this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (t, n) =>
      (t == null ? void 0 : t.source) === n ? ((t.lastIndex = 0), t) : new RegExp(n, "g");
    (this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`)),
      (this.regexpUnescape = e(
        this.regexpUnescape,
        `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`,
      )),
      (this.nestingRegexp = e(
        this.nestingRegexp,
        `${this.nestingPrefix}(.+?)${this.nestingSuffix}`,
      ));
  }
  interpolate(e, t, n, s) {
    var g;
    let r, a, u;
    const o =
        (this.options &&
          this.options.interpolation &&
          this.options.interpolation.defaultVariables) ||
        {},
      l = (h) => {
        if (h.indexOf(this.formatSeparator) < 0) {
          const S = ke(t, o, h, this.options.keySeparator, this.options.ignoreJSONStructure);
          return this.alwaysFormat
            ? this.format(S, void 0, n, { ...s, ...t, interpolationkey: h })
            : S;
        }
        const p = h.split(this.formatSeparator),
          y = p.shift().trim(),
          w = p.join(this.formatSeparator).trim();
        return this.format(
          ke(t, o, y, this.options.keySeparator, this.options.ignoreJSONStructure),
          w,
          n,
          { ...s, ...t, interpolationkey: y },
        );
      };
    this.resetRegExp();
    const f =
        (s == null ? void 0 : s.missingInterpolationHandler) ||
        this.options.missingInterpolationHandler,
      d =
        ((g = s == null ? void 0 : s.interpolation) == null ? void 0 : g.skipOnVariables) !== void 0
          ? s.interpolation.skipOnVariables
          : this.options.interpolation.skipOnVariables;
    return (
      [
        { regex: this.regexpUnescape, safeValue: (h) => re(h) },
        { regex: this.regexp, safeValue: (h) => (this.escapeValue ? re(this.escape(h)) : re(h)) },
      ].forEach((h) => {
        for (u = 0; (r = h.regex.exec(e)); ) {
          const p = r[1].trim();
          if (((a = l(p)), a === void 0))
            if (typeof f == "function") {
              const w = f(e, r, s);
              a = m(w) ? w : "";
            } else if (s && Object.prototype.hasOwnProperty.call(s, p)) a = "";
            else if (d) {
              a = r[0];
              continue;
            } else
              this.logger.warn(`missed to pass in variable ${p} for interpolating ${e}`), (a = "");
          else !m(a) && !this.useRawValueToEscape && (a = ve(a));
          const y = h.safeValue(a);
          if (
            ((e = e.replace(r[0], y)),
            d
              ? ((h.regex.lastIndex += a.length), (h.regex.lastIndex -= r[0].length))
              : (h.regex.lastIndex = 0),
            u++,
            u >= this.maxReplaces)
          )
            break;
        }
      }),
      e
    );
  }
  nest(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s,
      r,
      a;
    const u = (o, l) => {
      const f = this.nestingOptionsSeparator;
      if (o.indexOf(f) < 0) return o;
      const d = o.split(new RegExp(`${f}[ ]*{`));
      let c = `{${d[1]}`;
      (o = d[0]), (c = this.interpolate(c, a));
      const g = c.match(/'/g),
        h = c.match(/"/g);
      ((((g == null ? void 0 : g.length) ?? 0) % 2 === 0 && !h) || h.length % 2 !== 0) &&
        (c = c.replace(/'/g, '"'));
      try {
        (a = JSON.parse(c)), l && (a = { ...l, ...a });
      } catch (p) {
        return (
          this.logger.warn(`failed parsing options string in nesting for key ${o}`, p),
          `${o}${f}${c}`
        );
      }
      return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, o;
    };
    for (; (s = this.nestingRegexp.exec(e)); ) {
      let o = [];
      (a = { ...n }),
        (a = a.replace && !m(a.replace) ? a.replace : a),
        (a.applyPostProcessor = !1),
        delete a.defaultValue;
      let l = !1;
      if (s[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(s[1])) {
        const f = s[1].split(this.formatSeparator).map((d) => d.trim());
        (s[1] = f.shift()), (o = f), (l = !0);
      }
      if (((r = t(u.call(this, s[1].trim(), a), a)), r && s[0] === e && !m(r))) return r;
      m(r) || (r = ve(r)),
        r || (this.logger.warn(`missed to resolve ${s[1]} for nesting ${e}`), (r = "")),
        l &&
          (r = o.reduce(
            (f, d) => this.format(f, d, n.lng, { ...n, interpolationkey: s[1].trim() }),
            r.trim(),
          )),
        (e = e.replace(s[0], r)),
        (this.regexp.lastIndex = 0);
    }
    return e;
  }
}
const Ct = (i) => {
    let e = i.toLowerCase().trim();
    const t = {};
    if (i.indexOf("(") > -1) {
      const n = i.split("(");
      e = n[0].toLowerCase().trim();
      const s = n[1].substring(0, n[1].length - 1);
      e === "currency" && s.indexOf(":") < 0
        ? t.currency || (t.currency = s.trim())
        : e === "relativetime" && s.indexOf(":") < 0
          ? t.range || (t.range = s.trim())
          : s.split(";").forEach((a) => {
              if (a) {
                const [u, ...o] = a.split(":"),
                  l = o
                    .join(":")
                    .trim()
                    .replace(/^'+|'+$/g, ""),
                  f = u.trim();
                t[f] || (t[f] = l),
                  l === "false" && (t[f] = !1),
                  l === "true" && (t[f] = !0),
                  isNaN(l) || (t[f] = parseInt(l, 10));
              }
            });
    }
    return { formatName: e, formatOptions: t };
  },
  K = (i) => {
    const e = {};
    return (t, n, s) => {
      let r = s;
      s &&
        s.interpolationkey &&
        s.formatParams &&
        s.formatParams[s.interpolationkey] &&
        s[s.interpolationkey] &&
        (r = { ...r, [s.interpolationkey]: void 0 });
      const a = n + JSON.stringify(r);
      let u = e[a];
      return u || ((u = i(ee(n), s)), (e[a] = u)), u(t);
    };
  };
class Rt {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    (this.logger = E.create("formatter")),
      (this.options = e),
      (this.formats = {
        number: K((t, n) => {
          const s = new Intl.NumberFormat(t, { ...n });
          return (r) => s.format(r);
        }),
        currency: K((t, n) => {
          const s = new Intl.NumberFormat(t, { ...n, style: "currency" });
          return (r) => s.format(r);
        }),
        datetime: K((t, n) => {
          const s = new Intl.DateTimeFormat(t, { ...n });
          return (r) => s.format(r);
        }),
        relativetime: K((t, n) => {
          const s = new Intl.RelativeTimeFormat(t, { ...n });
          return (r) => s.format(r, n.range || "day");
        }),
        list: K((t, n) => {
          const s = new Intl.ListFormat(t, { ...n });
          return (r) => s.format(r);
        }),
      }),
      this.init(e);
  }
  init(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} };
    this.formatSeparator = t.interpolation.formatSeparator || ",";
  }
  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t;
  }
  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = K(t);
  }
  format(e, t, n) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const r = t.split(this.formatSeparator);
    if (
      r.length > 1 &&
      r[0].indexOf("(") > 1 &&
      r[0].indexOf(")") < 0 &&
      r.find((u) => u.indexOf(")") > -1)
    ) {
      const u = r.findIndex((o) => o.indexOf(")") > -1);
      r[0] = [r[0], ...r.splice(1, u)].join(this.formatSeparator);
    }
    return r.reduce((u, o) => {
      var d;
      const { formatName: l, formatOptions: f } = Ct(o);
      if (this.formats[l]) {
        let c = u;
        try {
          const g =
              ((d = s == null ? void 0 : s.formatParams) == null
                ? void 0
                : d[s.interpolationkey]) || {},
            h = g.locale || g.lng || s.locale || s.lng || n;
          c = this.formats[l](u, h, { ...f, ...s, ...g });
        } catch (g) {
          this.logger.warn(g);
        }
        return c;
      } else this.logger.warn(`there was no format function for ${l}`);
      return u;
    }, e);
  }
}
const $t = (i, e) => {
  i.pending[e] !== void 0 && (delete i.pending[e], i.pendingCount--);
};
class kt extends ie {
  constructor(e, t, n) {
    var r, a;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(),
      (this.backend = e),
      (this.store = t),
      (this.services = n),
      (this.languageUtils = n.languageUtils),
      (this.options = s),
      (this.logger = E.create("backendConnector")),
      (this.waitingReads = []),
      (this.maxParallelReads = s.maxParallelReads || 10),
      (this.readingCalls = 0),
      (this.maxRetries = s.maxRetries >= 0 ? s.maxRetries : 5),
      (this.retryTimeout = s.retryTimeout >= 1 ? s.retryTimeout : 350),
      (this.state = {}),
      (this.queue = []),
      (a = (r = this.backend) == null ? void 0 : r.init) == null || a.call(r, n, s.backend, s);
  }
  queueLoad(e, t, n, s) {
    const r = {},
      a = {},
      u = {},
      o = {};
    return (
      e.forEach((l) => {
        let f = !0;
        t.forEach((d) => {
          const c = `${l}|${d}`;
          !n.reload && this.store.hasResourceBundle(l, d)
            ? (this.state[c] = 2)
            : this.state[c] < 0 ||
              (this.state[c] === 1
                ? a[c] === void 0 && (a[c] = !0)
                : ((this.state[c] = 1),
                  (f = !1),
                  a[c] === void 0 && (a[c] = !0),
                  r[c] === void 0 && (r[c] = !0),
                  o[d] === void 0 && (o[d] = !0)));
        }),
          f || (u[l] = !0);
      }),
      (Object.keys(r).length || Object.keys(a).length) &&
        this.queue.push({
          pending: a,
          pendingCount: Object.keys(a).length,
          loaded: {},
          errors: [],
          callback: s,
        }),
      {
        toLoad: Object.keys(r),
        pending: Object.keys(a),
        toLoadLanguages: Object.keys(u),
        toLoadNamespaces: Object.keys(o),
      }
    );
  }
  loaded(e, t, n) {
    const s = e.split("|"),
      r = s[0],
      a = s[1];
    t && this.emit("failedLoading", r, a, t),
      !t && n && this.store.addResourceBundle(r, a, n, void 0, void 0, { skipCopy: !0 }),
      (this.state[e] = t ? -1 : 2),
      t && n && (this.state[e] = 0);
    const u = {};
    this.queue.forEach((o) => {
      pt(o.loaded, [r], a),
        $t(o, e),
        t && o.errors.push(t),
        o.pendingCount === 0 &&
          !o.done &&
          (Object.keys(o.loaded).forEach((l) => {
            u[l] || (u[l] = {});
            const f = o.loaded[l];
            f.length &&
              f.forEach((d) => {
                u[l][d] === void 0 && (u[l][d] = !0);
              });
          }),
          (o.done = !0),
          o.errors.length ? o.callback(o.errors) : o.callback());
    }),
      this.emit("loaded", u),
      (this.queue = this.queue.filter((o) => !o.done));
  }
  read(e, t, n) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0,
      r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout,
      a = arguments.length > 5 ? arguments[5] : void 0;
    if (!e.length) return a(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({ lng: e, ns: t, fcName: n, tried: s, wait: r, callback: a });
      return;
    }
    this.readingCalls++;
    const u = (l, f) => {
        if ((this.readingCalls--, this.waitingReads.length > 0)) {
          const d = this.waitingReads.shift();
          this.read(d.lng, d.ns, d.fcName, d.tried, d.wait, d.callback);
        }
        if (l && f && s < this.maxRetries) {
          setTimeout(() => {
            this.read.call(this, e, t, n, s + 1, r * 2, a);
          }, r);
          return;
        }
        a(l, f);
      },
      o = this.backend[n].bind(this.backend);
    if (o.length === 2) {
      try {
        const l = o(e, t);
        l && typeof l.then == "function" ? l.then((f) => u(null, f)).catch(u) : u(null, l);
      } catch (l) {
        u(l);
      }
      return;
    }
    return o(e, t, u);
  }
  prepareLoading(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend)
      return (
        this.logger.warn("No backend was added via i18next.use. Will not load resources."), s && s()
      );
    m(e) && (e = this.languageUtils.toResolveHierarchy(e)), m(t) && (t = [t]);
    const r = this.queueLoad(e, t, n, s);
    if (!r.toLoad.length) return r.pending.length || s(), null;
    r.toLoad.forEach((a) => {
      this.loadOne(a);
    });
  }
  load(e, t, n) {
    this.prepareLoading(e, t, {}, n);
  }
  reload(e, t, n) {
    this.prepareLoading(e, t, { reload: !0 }, n);
  }
  loadOne(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const n = e.split("|"),
      s = n[0],
      r = n[1];
    this.read(s, r, "read", void 0, void 0, (a, u) => {
      a && this.logger.warn(`${t}loading namespace ${r} for language ${s} failed`, a),
        !a && u && this.logger.log(`${t}loaded namespace ${r} for language ${s}`, u),
        this.loaded(e, a, u);
    });
  }
  saveMissing(e, t, n, s, r) {
    var o, l, f, d, c;
    let a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {},
      u = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {};
    if (
      (l = (o = this.services) == null ? void 0 : o.utils) != null &&
      l.hasLoadedNamespace &&
      !((d = (f = this.services) == null ? void 0 : f.utils) != null && d.hasLoadedNamespace(t))
    ) {
      this.logger.warn(
        `did not save key "${n}" as the namespace "${t}" was not yet loaded`,
        "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!",
      );
      return;
    }
    if (!(n == null || n === "")) {
      if ((c = this.backend) != null && c.create) {
        const g = { ...a, isUpdate: r },
          h = this.backend.create.bind(this.backend);
        if (h.length < 6)
          try {
            let p;
            h.length === 5 ? (p = h(e, t, n, s, g)) : (p = h(e, t, n, s)),
              p && typeof p.then == "function" ? p.then((y) => u(null, y)).catch(u) : u(null, p);
          } catch (p) {
            u(p);
          }
        else h(e, t, n, s, u, g);
      }
      !e || !e[0] || this.store.addResource(e[0], t, n, s);
    }
  }
}
const Ne = () => ({
    debug: !1,
    initAsync: !0,
    ns: ["translation"],
    defaultNS: ["translation"],
    fallbackLng: ["dev"],
    fallbackNS: !1,
    supportedLngs: !1,
    nonExplicitSupportedLngs: !1,
    load: "all",
    preload: !1,
    simplifyPluralSuffix: !0,
    keySeparator: ".",
    nsSeparator: ":",
    pluralSeparator: "_",
    contextSeparator: "_",
    partialBundledLanguages: !1,
    saveMissing: !1,
    updateMissing: !1,
    saveMissingTo: "fallback",
    saveMissingPlurals: !0,
    missingKeyHandler: !1,
    missingInterpolationHandler: !1,
    postProcess: !1,
    postProcessPassResolved: !1,
    returnNull: !1,
    returnEmptyString: !0,
    returnObjects: !1,
    joinArrays: !1,
    returnedObjectHandler: !1,
    parseMissingKeyHandler: !1,
    appendNamespaceToMissingKey: !1,
    appendNamespaceToCIMode: !1,
    overloadTranslationOptionHandler: (i) => {
      let e = {};
      if (
        (typeof i[1] == "object" && (e = i[1]),
        m(i[1]) && (e.defaultValue = i[1]),
        m(i[2]) && (e.tDescription = i[2]),
        typeof i[2] == "object" || typeof i[3] == "object")
      ) {
        const t = i[3] || i[2];
        Object.keys(t).forEach((n) => {
          e[n] = t[n];
        });
      }
      return e;
    },
    interpolation: {
      escapeValue: !0,
      format: (i) => i,
      prefix: "{{",
      suffix: "}}",
      formatSeparator: ",",
      unescapePrefix: "-",
      nestingPrefix: "$t(",
      nestingSuffix: ")",
      nestingOptionsSeparator: ",",
      maxReplaces: 1e3,
      skipOnVariables: !0,
    },
  }),
  Ee = (i) => {
    var e, t;
    return (
      m(i.ns) && (i.ns = [i.ns]),
      m(i.fallbackLng) && (i.fallbackLng = [i.fallbackLng]),
      m(i.fallbackNS) && (i.fallbackNS = [i.fallbackNS]),
      ((t = (e = i.supportedLngs) == null ? void 0 : e.indexOf) == null
        ? void 0
        : t.call(e, "cimode")) < 0 && (i.supportedLngs = i.supportedLngs.concat(["cimode"])),
      typeof i.initImmediate == "boolean" && (i.initAsync = i.initImmediate),
      i
    );
  },
  Z = () => {},
  Nt = (i) => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(i)).forEach((t) => {
      typeof i[t] == "function" && (i[t] = i[t].bind(i));
    });
  };
class Q extends ie {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = arguments.length > 1 ? arguments[1] : void 0;
    if (
      (super(),
      (this.options = Ee(e)),
      (this.services = {}),
      (this.logger = E),
      (this.modules = { external: [] }),
      Nt(this),
      t && !this.isInitialized && !e.isClone)
    ) {
      if (!this.options.initAsync) return this.init(e, t), this;
      setTimeout(() => {
        this.init(e, t);
      }, 0);
    }
  }
  init() {
    var e = this;
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      n = arguments.length > 1 ? arguments[1] : void 0;
    (this.isInitializing = !0),
      typeof t == "function" && ((n = t), (t = {})),
      t.defaultNS == null &&
        t.ns &&
        (m(t.ns)
          ? (t.defaultNS = t.ns)
          : t.ns.indexOf("translation") < 0 && (t.defaultNS = t.ns[0]));
    const s = Ne();
    (this.options = { ...s, ...this.options, ...Ee(t) }),
      (this.options.interpolation = { ...s.interpolation, ...this.options.interpolation }),
      t.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = t.keySeparator),
      t.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = t.nsSeparator);
    const r = (f) => (f ? (typeof f == "function" ? new f() : f) : null);
    if (!this.options.isClone) {
      this.modules.logger
        ? E.init(r(this.modules.logger), this.options)
        : E.init(null, this.options);
      let f;
      this.modules.formatter ? (f = this.modules.formatter) : (f = Rt);
      const d = new Ce(this.options);
      this.store = new Oe(this.options.resources, this.options);
      const c = this.services;
      (c.logger = E),
        (c.resourceStore = this.store),
        (c.languageUtils = d),
        (c.pluralResolver = new Lt(d, {
          prepend: this.options.pluralSeparator,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix,
        })),
        f &&
          (!this.options.interpolation.format ||
            this.options.interpolation.format === s.interpolation.format) &&
          ((c.formatter = r(f)),
          c.formatter.init(c, this.options),
          (this.options.interpolation.format = c.formatter.format.bind(c.formatter))),
        (c.interpolator = new Pt(this.options)),
        (c.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }),
        (c.backendConnector = new kt(r(this.modules.backend), c.resourceStore, c, this.options)),
        c.backendConnector.on("*", function (g) {
          for (var h = arguments.length, p = new Array(h > 1 ? h - 1 : 0), y = 1; y < h; y++)
            p[y - 1] = arguments[y];
          e.emit(g, ...p);
        }),
        this.modules.languageDetector &&
          ((c.languageDetector = r(this.modules.languageDetector)),
          c.languageDetector.init &&
            c.languageDetector.init(c, this.options.detection, this.options)),
        this.modules.i18nFormat &&
          ((c.i18nFormat = r(this.modules.i18nFormat)),
          c.i18nFormat.init && c.i18nFormat.init(this)),
        (this.translator = new ne(this.services, this.options)),
        this.translator.on("*", function (g) {
          for (var h = arguments.length, p = new Array(h > 1 ? h - 1 : 0), y = 1; y < h; y++)
            p[y - 1] = arguments[y];
          e.emit(g, ...p);
        }),
        this.modules.external.forEach((g) => {
          g.init && g.init(this);
        });
    }
    if (
      ((this.format = this.options.interpolation.format),
      n || (n = Z),
      this.options.fallbackLng && !this.services.languageDetector && !this.options.lng)
    ) {
      const f = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      f.length > 0 && f[0] !== "dev" && (this.options.lng = f[0]);
    }
    !this.services.languageDetector &&
      !this.options.lng &&
      this.logger.warn("init: no languageDetector is used and no lng is defined"),
      ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach(
        (f) => {
          this[f] = function () {
            return e.store[f](...arguments);
          };
        },
      ),
      ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((f) => {
        this[f] = function () {
          return e.store[f](...arguments), e;
        };
      });
    const o = B(),
      l = () => {
        const f = (d, c) => {
          (this.isInitializing = !1),
            this.isInitialized &&
              !this.initializedStoreOnce &&
              this.logger.warn(
                "init: i18next is already initialized. You should call init just once!",
              ),
            (this.isInitialized = !0),
            this.options.isClone || this.logger.log("initialized", this.options),
            this.emit("initialized", this.options),
            o.resolve(c),
            n(d, c);
        };
        if (this.languages && !this.isInitialized) return f(null, this.t.bind(this));
        this.changeLanguage(this.options.lng, f);
      };
    return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), o;
  }
  loadResources(e) {
    var r, a;
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Z;
    const s = m(e) ? e : this.language;
    if (
      (typeof e == "function" && (n = e),
      !this.options.resources || this.options.partialBundledLanguages)
    ) {
      if (
        (s == null ? void 0 : s.toLowerCase()) === "cimode" &&
        (!this.options.preload || this.options.preload.length === 0)
      )
        return n();
      const u = [],
        o = (l) => {
          if (!l || l === "cimode") return;
          this.services.languageUtils.toResolveHierarchy(l).forEach((d) => {
            d !== "cimode" && u.indexOf(d) < 0 && u.push(d);
          });
        };
      s
        ? o(s)
        : this.services.languageUtils
            .getFallbackCodes(this.options.fallbackLng)
            .forEach((f) => o(f)),
        (a = (r = this.options.preload) == null ? void 0 : r.forEach) == null ||
          a.call(r, (l) => o(l)),
        this.services.backendConnector.load(u, this.options.ns, (l) => {
          !l && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language),
            n(l);
        });
    } else n(null);
  }
  reloadResources(e, t, n) {
    const s = B();
    return (
      typeof e == "function" && ((n = e), (e = void 0)),
      typeof t == "function" && ((n = t), (t = void 0)),
      e || (e = this.languages),
      t || (t = this.options.ns),
      n || (n = Z),
      this.services.backendConnector.reload(e, t, (r) => {
        s.resolve(), n(r);
      }),
      s
    );
  }
  use(e) {
    if (!e)
      throw new Error(
        "You are passing an undefined module! Please check the object you are passing to i18next.use()",
      );
    if (!e.type)
      throw new Error(
        "You are passing a wrong module! Please check the object you are passing to i18next.use()",
      );
    return (
      e.type === "backend" && (this.modules.backend = e),
      (e.type === "logger" || (e.log && e.warn && e.error)) && (this.modules.logger = e),
      e.type === "languageDetector" && (this.modules.languageDetector = e),
      e.type === "i18nFormat" && (this.modules.i18nFormat = e),
      e.type === "postProcessor" && Xe.addPostProcessor(e),
      e.type === "formatter" && (this.modules.formatter = e),
      e.type === "3rdParty" && this.modules.external.push(e),
      this
    );
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1))
      for (let t = 0; t < this.languages.length; t++) {
        const n = this.languages[t];
        if (!(["cimode", "dev"].indexOf(n) > -1) && this.store.hasLanguageSomeTranslations(n)) {
          this.resolvedLanguage = n;
          break;
        }
      }
  }
  changeLanguage(e, t) {
    var n = this;
    this.isLanguageChangingTo = e;
    const s = B();
    this.emit("languageChanging", e);
    const r = (o) => {
        (this.language = o),
          (this.languages = this.services.languageUtils.toResolveHierarchy(o)),
          (this.resolvedLanguage = void 0),
          this.setResolvedLanguage(o);
      },
      a = (o, l) => {
        l
          ? (r(l),
            this.translator.changeLanguage(l),
            (this.isLanguageChangingTo = void 0),
            this.emit("languageChanged", l),
            this.logger.log("languageChanged", l))
          : (this.isLanguageChangingTo = void 0),
          s.resolve(function () {
            return n.t(...arguments);
          }),
          t &&
            t(o, function () {
              return n.t(...arguments);
            });
      },
      u = (o) => {
        var f, d;
        !e && !o && this.services.languageDetector && (o = []);
        const l = m(o) ? o : this.services.languageUtils.getBestMatchFromCodes(o);
        l &&
          (this.language || r(l),
          this.translator.language || this.translator.changeLanguage(l),
          (d = (f = this.services.languageDetector) == null ? void 0 : f.cacheUserLanguage) ==
            null || d.call(f, l)),
          this.loadResources(l, (c) => {
            a(c, l);
          });
      };
    return (
      !e && this.services.languageDetector && !this.services.languageDetector.async
        ? u(this.services.languageDetector.detect())
        : !e && this.services.languageDetector && this.services.languageDetector.async
          ? this.services.languageDetector.detect.length === 0
            ? this.services.languageDetector.detect().then(u)
            : this.services.languageDetector.detect(u)
          : u(e),
      s
    );
  }
  getFixedT(e, t, n) {
    var s = this;
    const r = function (a, u) {
      let o;
      if (typeof u != "object") {
        for (var l = arguments.length, f = new Array(l > 2 ? l - 2 : 0), d = 2; d < l; d++)
          f[d - 2] = arguments[d];
        o = s.options.overloadTranslationOptionHandler([a, u].concat(f));
      } else o = { ...u };
      (o.lng = o.lng || r.lng),
        (o.lngs = o.lngs || r.lngs),
        (o.ns = o.ns || r.ns),
        o.keyPrefix !== "" && (o.keyPrefix = o.keyPrefix || n || r.keyPrefix);
      const c = s.options.keySeparator || ".";
      let g;
      return (
        o.keyPrefix && Array.isArray(a)
          ? (g = a.map((h) => `${o.keyPrefix}${c}${h}`))
          : (g = o.keyPrefix ? `${o.keyPrefix}${c}${a}` : a),
        s.t(g, o)
      );
    };
    return m(e) ? (r.lng = e) : (r.lngs = e), (r.ns = t), (r.keyPrefix = n), r;
  }
  t() {
    var s;
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return (s = this.translator) == null ? void 0 : s.translate(...t);
  }
  exists() {
    var s;
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return (s = this.translator) == null ? void 0 : s.exists(...t);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized)
      return (
        this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1
      );
    if (!this.languages || !this.languages.length)
      return (
        this.logger.warn(
          "hasLoadedNamespace: i18n.languages were undefined or empty",
          this.languages,
        ),
        !1
      );
    const n = t.lng || this.resolvedLanguage || this.languages[0],
      s = this.options ? this.options.fallbackLng : !1,
      r = this.languages[this.languages.length - 1];
    if (n.toLowerCase() === "cimode") return !0;
    const a = (u, o) => {
      const l = this.services.backendConnector.state[`${u}|${o}`];
      return l === -1 || l === 0 || l === 2;
    };
    if (t.precheck) {
      const u = t.precheck(this, a);
      if (u !== void 0) return u;
    }
    return !!(
      this.hasResourceBundle(n, e) ||
      !this.services.backendConnector.backend ||
      (this.options.resources && !this.options.partialBundledLanguages) ||
      (a(n, e) && (!s || a(r, e)))
    );
  }
  loadNamespaces(e, t) {
    const n = B();
    return this.options.ns
      ? (m(e) && (e = [e]),
        e.forEach((s) => {
          this.options.ns.indexOf(s) < 0 && this.options.ns.push(s);
        }),
        this.loadResources((s) => {
          n.resolve(), t && t(s);
        }),
        n)
      : (t && t(), Promise.resolve());
  }
  loadLanguages(e, t) {
    const n = B();
    m(e) && (e = [e]);
    const s = this.options.preload || [],
      r = e.filter((a) => s.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a));
    return r.length
      ? ((this.options.preload = s.concat(r)),
        this.loadResources((a) => {
          n.resolve(), t && t(a);
        }),
        n)
      : (t && t(), Promise.resolve());
  }
  dir(e) {
    var s, r;
    if (
      (e ||
        (e =
          this.resolvedLanguage ||
          (((s = this.languages) == null ? void 0 : s.length) > 0
            ? this.languages[0]
            : this.language)),
      !e)
    )
      return "rtl";
    const t = [
        "ar",
        "shu",
        "sqr",
        "ssh",
        "xaa",
        "yhd",
        "yud",
        "aao",
        "abh",
        "abv",
        "acm",
        "acq",
        "acw",
        "acx",
        "acy",
        "adf",
        "ads",
        "aeb",
        "aec",
        "afb",
        "ajp",
        "apc",
        "apd",
        "arb",
        "arq",
        "ars",
        "ary",
        "arz",
        "auz",
        "avl",
        "ayh",
        "ayl",
        "ayn",
        "ayp",
        "bbz",
        "pga",
        "he",
        "iw",
        "ps",
        "pbt",
        "pbu",
        "pst",
        "prp",
        "prd",
        "ug",
        "ur",
        "ydd",
        "yds",
        "yih",
        "ji",
        "yi",
        "hbo",
        "men",
        "xmn",
        "fa",
        "jpr",
        "peo",
        "pes",
        "prs",
        "dv",
        "sam",
        "ckb",
      ],
      n = ((r = this.services) == null ? void 0 : r.languageUtils) || new Ce(Ne());
    return t.indexOf(n.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1
      ? "rtl"
      : "ltr";
  }
  static createInstance() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = arguments.length > 1 ? arguments[1] : void 0;
    return new Q(e, t);
  }
  cloneInstance() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Z;
    const n = e.forkResourceStore;
    n && delete e.forkResourceStore;
    const s = { ...this.options, ...e, isClone: !0 },
      r = new Q(s);
    if (
      ((e.debug !== void 0 || e.prefix !== void 0) && (r.logger = r.logger.clone(e)),
      ["store", "services", "language"].forEach((u) => {
        r[u] = this[u];
      }),
      (r.services = { ...this.services }),
      (r.services.utils = { hasLoadedNamespace: r.hasLoadedNamespace.bind(r) }),
      n)
    ) {
      const u = Object.keys(this.store.data).reduce(
        (o, l) => (
          (o[l] = { ...this.store.data[l] }),
          Object.keys(o[l]).reduce((f, d) => ((f[d] = { ...o[l][d] }), f), {})
        ),
        {},
      );
      (r.store = new Oe(u, s)), (r.services.resourceStore = r.store);
    }
    return (
      (r.translator = new ne(r.services, s)),
      r.translator.on("*", function (u) {
        for (var o = arguments.length, l = new Array(o > 1 ? o - 1 : 0), f = 1; f < o; f++)
          l[f - 1] = arguments[f];
        r.emit(u, ...l);
      }),
      r.init(s, t),
      (r.translator.options = s),
      (r.translator.backendConnector.services.utils = {
        hasLoadedNamespace: r.hasLoadedNamespace.bind(r),
      }),
      r
    );
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage,
    };
  }
}
const C = Q.createInstance();
C.createInstance = Q.createInstance;
C.createInstance;
C.dir;
C.init;
C.loadResources;
C.reloadResources;
C.use;
C.changeLanguage;
C.getFixedT;
C.t;
C.exists;
C.setDefaultNamespace;
C.hasLoadedNamespace;
C.loadNamespaces;
C.loadLanguages;
function ce(i) {
  "@babel/helpers - typeof";
  return (
    (ce =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == "function" &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          }),
    ce(i)
  );
}
function Je() {
  return (
    typeof XMLHttpRequest == "function" ||
    (typeof XMLHttpRequest > "u" ? "undefined" : ce(XMLHttpRequest)) === "object"
  );
}
function Et(i) {
  return !!i && typeof i.then == "function";
}
function jt(i) {
  return Et(i) ? i : Promise.resolve(i);
}
const Tt = "modulepreload",
  At = function (i) {
    return "/" + i;
  },
  je = {},
  Ft = function (e, t, n) {
    let s = Promise.resolve();
    if (t && t.length > 0) {
      document.getElementsByTagName("link");
      const a = document.querySelector("meta[property=csp-nonce]"),
        u = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute("nonce"));
      s = Promise.allSettled(
        t.map((o) => {
          if (((o = At(o)), o in je)) return;
          je[o] = !0;
          const l = o.endsWith(".css"),
            f = l ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${o}"]${f}`)) return;
          const d = document.createElement("link");
          if (
            ((d.rel = l ? "stylesheet" : Tt),
            l || (d.as = "script"),
            (d.crossOrigin = ""),
            (d.href = o),
            u && d.setAttribute("nonce", u),
            document.head.appendChild(d),
            l)
          )
            return new Promise((c, g) => {
              d.addEventListener("load", c),
                d.addEventListener("error", () => g(new Error(`Unable to preload CSS for ${o}`)));
            });
        }),
      );
    }
    function r(a) {
      const u = new Event("vite:preloadError", { cancelable: !0 });
      if (((u.payload = a), window.dispatchEvent(u), !u.defaultPrevented)) throw a;
    }
    return s.then((a) => {
      for (const u of a || []) u.status === "rejected" && r(u.reason);
      return e().catch(r);
    });
  };
function Te(i, e) {
  var t = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    e &&
      (n = n.filter(function (s) {
        return Object.getOwnPropertyDescriptor(i, s).enumerable;
      })),
      t.push.apply(t, n);
  }
  return t;
}
function Ae(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? Te(Object(t), !0).forEach(function (n) {
          It(i, n, t[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t))
        : Te(Object(t)).forEach(function (n) {
            Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(t, n));
          });
  }
  return i;
}
function It(i, e, t) {
  return (
    (e = Dt(e)) in i
      ? Object.defineProperty(i, e, { value: t, enumerable: !0, configurable: !0, writable: !0 })
      : (i[e] = t),
    i
  );
}
function Dt(i) {
  var e = Ut(i, "string");
  return H(e) == "symbol" ? e : e + "";
}
function Ut(i, e) {
  if (H(i) != "object" || !i) return i;
  var t = i[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(i, e);
    if (H(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(i);
}
function H(i) {
  "@babel/helpers - typeof";
  return (
    (H =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == "function" &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          }),
    H(i)
  );
}
var I = typeof fetch == "function" ? fetch : void 0;
typeof global < "u" && global.fetch
  ? (I = global.fetch)
  : typeof window < "u" && window.fetch && (I = window.fetch);
var G;
Je() &&
  (typeof global < "u" && global.XMLHttpRequest
    ? (G = global.XMLHttpRequest)
    : typeof window < "u" && window.XMLHttpRequest && (G = window.XMLHttpRequest));
var se;
typeof ActiveXObject == "function" &&
  (typeof global < "u" && global.ActiveXObject
    ? (se = global.ActiveXObject)
    : typeof window < "u" && window.ActiveXObject && (se = window.ActiveXObject));
typeof I != "function" && (I = void 0);
if (!I && !G && !se)
  try {
    Ft(() => import("./browser-ponyfill-B9iOa5IF.js").then((i) => i.b), __vite__mapDeps([0, 1]))
      .then(function (i) {
        I = i.default;
      })
      .catch(function () {});
  } catch {}
var de = function (e, t) {
    if (t && H(t) === "object") {
      var n = "";
      for (var s in t) n += "&" + encodeURIComponent(s) + "=" + encodeURIComponent(t[s]);
      if (!n) return e;
      e = e + (e.indexOf("?") !== -1 ? "&" : "?") + n.slice(1);
    }
    return e;
  },
  Fe = function (e, t, n, s) {
    var r = function (o) {
      if (!o.ok) return n(o.statusText || "Error", { status: o.status });
      o.text()
        .then(function (l) {
          n(null, { status: o.status, data: l });
        })
        .catch(n);
    };
    if (s) {
      var a = s(e, t);
      if (a instanceof Promise) {
        a.then(r).catch(n);
        return;
      }
    }
    typeof fetch == "function" ? fetch(e, t).then(r).catch(n) : I(e, t).then(r).catch(n);
  },
  Ie = !1,
  Ht = function (e, t, n, s) {
    e.queryStringParams && (t = de(t, e.queryStringParams));
    var r = Ae({}, typeof e.customHeaders == "function" ? e.customHeaders() : e.customHeaders);
    typeof window > "u" &&
      typeof global < "u" &&
      typeof global.process < "u" &&
      global.process.versions &&
      global.process.versions.node &&
      (r["User-Agent"] = "i18next-http-backend (node/"
        .concat(global.process.version, "; ")
        .concat(global.process.platform, " ")
        .concat(global.process.arch, ")")),
      n && (r["Content-Type"] = "application/json");
    var a = typeof e.requestOptions == "function" ? e.requestOptions(n) : e.requestOptions,
      u = Ae(
        { method: n ? "POST" : "GET", body: n ? e.stringify(n) : void 0, headers: r },
        Ie ? {} : a,
      ),
      o =
        typeof e.alternateFetch == "function" && e.alternateFetch.length >= 1
          ? e.alternateFetch
          : void 0;
    try {
      Fe(t, u, s, o);
    } catch (l) {
      if (
        !a ||
        Object.keys(a).length === 0 ||
        !l.message ||
        l.message.indexOf("not implemented") < 0
      )
        return s(l);
      try {
        Object.keys(a).forEach(function (f) {
          delete u[f];
        }),
          Fe(t, u, s, o),
          (Ie = !0);
      } catch (f) {
        s(f);
      }
    }
  },
  Mt = function (e, t, n, s) {
    n && H(n) === "object" && (n = de("", n).slice(1)),
      e.queryStringParams && (t = de(t, e.queryStringParams));
    try {
      var r = G ? new G() : new se("MSXML2.XMLHTTP.3.0");
      r.open(n ? "POST" : "GET", t, 1),
        e.crossDomain || r.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
        (r.withCredentials = !!e.withCredentials),
        n && r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
        r.overrideMimeType && r.overrideMimeType("application/json");
      var a = e.customHeaders;
      if (((a = typeof a == "function" ? a() : a), a)) for (var u in a) r.setRequestHeader(u, a[u]);
      (r.onreadystatechange = function () {
        r.readyState > 3 &&
          s(r.status >= 400 ? r.statusText : null, { status: r.status, data: r.responseText });
      }),
        r.send(n);
    } catch (o) {
      console && console.log(o);
    }
  },
  Kt = function (e, t, n, s) {
    if (
      (typeof n == "function" && ((s = n), (n = void 0)),
      (s = s || function () {}),
      I && t.indexOf("file:") !== 0)
    )
      return Ht(e, t, n, s);
    if (Je() || typeof ActiveXObject == "function") return Mt(e, t, n, s);
    s(new Error("No fetch and no xhr implementation found!"));
  };
function V(i) {
  "@babel/helpers - typeof";
  return (
    (V =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == "function" &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          }),
    V(i)
  );
}
function De(i, e) {
  var t = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    e &&
      (n = n.filter(function (s) {
        return Object.getOwnPropertyDescriptor(i, s).enumerable;
      })),
      t.push.apply(t, n);
  }
  return t;
}
function ae(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? De(Object(t), !0).forEach(function (n) {
          We(i, n, t[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t))
        : De(Object(t)).forEach(function (n) {
            Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(t, n));
          });
  }
  return i;
}
function Vt(i, e) {
  if (!(i instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function qt(i, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(i, Qe(n.key), n);
  }
}
function zt(i, e, t) {
  return e && qt(i.prototype, e), Object.defineProperty(i, "prototype", { writable: !1 }), i;
}
function We(i, e, t) {
  return (
    (e = Qe(e)) in i
      ? Object.defineProperty(i, e, { value: t, enumerable: !0, configurable: !0, writable: !0 })
      : (i[e] = t),
    i
  );
}
function Qe(i) {
  var e = Bt(i, "string");
  return V(e) == "symbol" ? e : e + "";
}
function Bt(i, e) {
  if (V(i) != "object" || !i) return i;
  var t = i[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(i, e);
    if (V(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(i);
}
var Xt = function () {
    return {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      addPath: "/locales/add/{{lng}}/{{ns}}",
      parse: function (t) {
        return JSON.parse(t);
      },
      stringify: JSON.stringify,
      parsePayload: function (t, n, s) {
        return We({}, n, s || "");
      },
      parseLoadPayload: function (t, n) {},
      request: Kt,
      reloadInterval: typeof window < "u" ? !1 : 60 * 60 * 1e3,
      customHeaders: {},
      queryStringParams: {},
      crossDomain: !1,
      withCredentials: !1,
      overrideMimeType: !1,
      requestOptions: { mode: "cors", credentials: "same-origin", cache: "default" },
    };
  },
  Jt = (function () {
    function i(e) {
      var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      Vt(this, i),
        (this.services = e),
        (this.options = t),
        (this.allOptions = n),
        (this.type = "backend"),
        this.init(e, t, n);
    }
    return zt(i, [
      {
        key: "init",
        value: function (t) {
          var n = this,
            s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          if (
            ((this.services = t),
            (this.options = ae(ae(ae({}, Xt()), this.options || {}), s)),
            (this.allOptions = r),
            this.services && this.options.reloadInterval)
          ) {
            var a = setInterval(function () {
              return n.reload();
            }, this.options.reloadInterval);
            V(a) === "object" && typeof a.unref == "function" && a.unref();
          }
        },
      },
      {
        key: "readMulti",
        value: function (t, n, s) {
          this._readAny(t, t, n, n, s);
        },
      },
      {
        key: "read",
        value: function (t, n, s) {
          this._readAny([t], t, [n], n, s);
        },
      },
      {
        key: "_readAny",
        value: function (t, n, s, r, a) {
          var u = this,
            o = this.options.loadPath;
          typeof this.options.loadPath == "function" && (o = this.options.loadPath(t, s)),
            (o = jt(o)),
            o.then(function (l) {
              if (!l) return a(null, {});
              var f = u.services.interpolator.interpolate(l, { lng: t.join("+"), ns: s.join("+") });
              u.loadUrl(f, a, n, r);
            });
        },
      },
      {
        key: "loadUrl",
        value: function (t, n, s, r) {
          var a = this,
            u = typeof s == "string" ? [s] : s,
            o = typeof r == "string" ? [r] : r,
            l = this.options.parseLoadPayload(u, o);
          this.options.request(this.options, t, l, function (f, d) {
            if (d && ((d.status >= 500 && d.status < 600) || !d.status))
              return n("failed loading " + t + "; status code: " + d.status, !0);
            if (d && d.status >= 400 && d.status < 500)
              return n("failed loading " + t + "; status code: " + d.status, !1);
            if (!d && f && f.message) {
              var c = f.message.toLowerCase(),
                g = ["failed", "fetch", "network", "load"].find(function (y) {
                  return c.indexOf(y) > -1;
                });
              if (g) return n("failed loading " + t + ": " + f.message, !0);
            }
            if (f) return n(f, !1);
            var h, p;
            try {
              typeof d.data == "string" ? (h = a.options.parse(d.data, s, r)) : (h = d.data);
            } catch {
              p = "failed parsing " + t + " to json";
            }
            if (p) return n(p, !1);
            n(null, h);
          });
        },
      },
      {
        key: "create",
        value: function (t, n, s, r, a) {
          var u = this;
          if (this.options.addPath) {
            typeof t == "string" && (t = [t]);
            var o = this.options.parsePayload(n, s, r),
              l = 0,
              f = [],
              d = [];
            t.forEach(function (c) {
              var g = u.options.addPath;
              typeof u.options.addPath == "function" && (g = u.options.addPath(c, n));
              var h = u.services.interpolator.interpolate(g, { lng: c, ns: n });
              u.options.request(u.options, h, o, function (p, y) {
                (l += 1), f.push(p), d.push(y), l === t.length && typeof a == "function" && a(f, d);
              });
            });
          }
        },
      },
      {
        key: "reload",
        value: function () {
          var t = this,
            n = this.services,
            s = n.backendConnector,
            r = n.languageUtils,
            a = n.logger,
            u = s.language;
          if (!(u && u.toLowerCase() === "cimode")) {
            var o = [],
              l = function (d) {
                var c = r.toResolveHierarchy(d);
                c.forEach(function (g) {
                  o.indexOf(g) < 0 && o.push(g);
                });
              };
            l(u),
              this.allOptions.preload &&
                this.allOptions.preload.forEach(function (f) {
                  return l(f);
                }),
              o.forEach(function (f) {
                t.allOptions.ns.forEach(function (d) {
                  s.read(f, d, "read", null, null, function (c, g) {
                    c &&
                      a.warn(
                        "loading namespace ".concat(d, " for language ").concat(f, " failed"),
                        c,
                      ),
                      !c &&
                        g &&
                        a.log("loaded namespace ".concat(d, " for language ").concat(f), g),
                      s.loaded("".concat(f, "|").concat(d), c, g);
                  });
                });
              });
          }
        },
      },
    ]);
  })();
Jt.type = "backend";
const { slice: Wt, forEach: Qt } = [];
function Gt(i) {
  return (
    Qt.call(Wt.call(arguments, 1), (e) => {
      if (e) for (const t in e) i[t] === void 0 && (i[t] = e[t]);
    }),
    i
  );
}
const Ue = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,
  Yt = function (i, e) {
    const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { path: "/" },
      s = encodeURIComponent(e);
    let r = `${i}=${s}`;
    if (n.maxAge > 0) {
      const a = n.maxAge - 0;
      if (Number.isNaN(a)) throw new Error("maxAge should be a Number");
      r += `; Max-Age=${Math.floor(a)}`;
    }
    if (n.domain) {
      if (!Ue.test(n.domain)) throw new TypeError("option domain is invalid");
      r += `; Domain=${n.domain}`;
    }
    if (n.path) {
      if (!Ue.test(n.path)) throw new TypeError("option path is invalid");
      r += `; Path=${n.path}`;
    }
    if (n.expires) {
      if (typeof n.expires.toUTCString != "function")
        throw new TypeError("option expires is invalid");
      r += `; Expires=${n.expires.toUTCString()}`;
    }
    if ((n.httpOnly && (r += "; HttpOnly"), n.secure && (r += "; Secure"), n.sameSite))
      switch (typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite) {
        case !0:
          r += "; SameSite=Strict";
          break;
        case "lax":
          r += "; SameSite=Lax";
          break;
        case "strict":
          r += "; SameSite=Strict";
          break;
        case "none":
          r += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    return r;
  },
  He = {
    create(i, e, t, n) {
      let s =
        arguments.length > 4 && arguments[4] !== void 0
          ? arguments[4]
          : { path: "/", sameSite: "strict" };
      t && ((s.expires = new Date()), s.expires.setTime(s.expires.getTime() + t * 60 * 1e3)),
        n && (s.domain = n),
        (document.cookie = Yt(i, encodeURIComponent(e), s));
    },
    read(i) {
      const e = `${i}=`,
        t = document.cookie.split(";");
      for (let n = 0; n < t.length; n++) {
        let s = t[n];
        for (; s.charAt(0) === " "; ) s = s.substring(1, s.length);
        if (s.indexOf(e) === 0) return s.substring(e.length, s.length);
      }
      return null;
    },
    remove(i) {
      this.create(i, "", -1);
    },
  };
var Zt = {
    name: "cookie",
    lookup(i) {
      let { lookupCookie: e } = i;
      if (e && typeof document < "u") return He.read(e) || void 0;
    },
    cacheUserLanguage(i, e) {
      let { lookupCookie: t, cookieMinutes: n, cookieDomain: s, cookieOptions: r } = e;
      t && typeof document < "u" && He.create(t, i, n, s, r);
    },
  },
  _t = {
    name: "querystring",
    lookup(i) {
      var n;
      let { lookupQuerystring: e } = i,
        t;
      if (typeof window < "u") {
        let { search: s } = window.location;
        !window.location.search &&
          ((n = window.location.hash) == null ? void 0 : n.indexOf("?")) > -1 &&
          (s = window.location.hash.substring(window.location.hash.indexOf("?")));
        const a = s.substring(1).split("&");
        for (let u = 0; u < a.length; u++) {
          const o = a[u].indexOf("=");
          o > 0 && a[u].substring(0, o) === e && (t = a[u].substring(o + 1));
        }
      }
      return t;
    },
  };
let X = null;
const Me = () => {
  if (X !== null) return X;
  try {
    X = window !== "undefined" && window.localStorage !== null;
    const i = "i18next.translate.boo";
    window.localStorage.setItem(i, "foo"), window.localStorage.removeItem(i);
  } catch {
    X = !1;
  }
  return X;
};
var en = {
  name: "localStorage",
  lookup(i) {
    let { lookupLocalStorage: e } = i;
    if (Me() && e) return window.localStorage.getItem(e) || void 0;
  },
  cacheUserLanguage(i, e) {
    let { lookupLocalStorage: t } = e;
    Me() && t && window.localStorage.setItem(t, i);
  },
};
let J = null;
const Ke = () => {
  if (J !== null) return J;
  try {
    J = window !== "undefined" && window.sessionStorage !== null;
    const i = "i18next.translate.boo";
    window.sessionStorage.setItem(i, "foo"), window.sessionStorage.removeItem(i);
  } catch {
    J = !1;
  }
  return J;
};
var tn = {
    name: "sessionStorage",
    lookup(i) {
      let { lookupSessionStorage: e } = i;
      if (e && Ke()) return window.sessionStorage.getItem(e) || void 0;
    },
    cacheUserLanguage(i, e) {
      let { lookupSessionStorage: t } = e;
      t && Ke() && window.sessionStorage.setItem(t, i);
    },
  },
  nn = {
    name: "navigator",
    lookup(i) {
      const e = [];
      if (typeof navigator < "u") {
        const { languages: t, userLanguage: n, language: s } = navigator;
        if (t) for (let r = 0; r < t.length; r++) e.push(t[r]);
        n && e.push(n), s && e.push(s);
      }
      return e.length > 0 ? e : void 0;
    },
  },
  sn = {
    name: "htmlTag",
    lookup(i) {
      let { htmlTag: e } = i,
        t;
      const n = e || (typeof document < "u" ? document.documentElement : null);
      return n && typeof n.getAttribute == "function" && (t = n.getAttribute("lang")), t;
    },
  },
  rn = {
    name: "path",
    lookup(i) {
      var s;
      let { lookupFromPathIndex: e } = i;
      if (typeof window > "u") return;
      const t = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
      return Array.isArray(t)
        ? (s = t[typeof e == "number" ? e : 0]) == null
          ? void 0
          : s.replace("/", "")
        : void 0;
    },
  },
  an = {
    name: "subdomain",
    lookup(i) {
      var s, r;
      let { lookupFromSubdomainIndex: e } = i;
      const t = typeof e == "number" ? e + 1 : 1,
        n =
          typeof window < "u" &&
          ((r = (s = window.location) == null ? void 0 : s.hostname) == null
            ? void 0
            : r.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i));
      if (n) return n[t];
    },
  };
let Ge = !1;
try {
  document.cookie, (Ge = !0);
} catch {}
const Ye = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
Ge || Ye.splice(1, 1);
const on = () => ({
  order: Ye,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  convertDetectedLanguage: (i) => i,
});
class un {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (this.type = "languageDetector"), (this.detectors = {}), this.init(e, t);
  }
  init() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { languageUtils: {} },
      t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    (this.services = e),
      (this.options = Gt(t, this.options || {}, on())),
      typeof this.options.convertDetectedLanguage == "string" &&
        this.options.convertDetectedLanguage.indexOf("15897") > -1 &&
        (this.options.convertDetectedLanguage = (s) => s.replace("-", "_")),
      this.options.lookupFromUrlIndex &&
        (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex),
      (this.i18nOptions = n),
      this.addDetector(Zt),
      this.addDetector(_t),
      this.addDetector(en),
      this.addDetector(tn),
      this.addDetector(nn),
      this.addDetector(sn),
      this.addDetector(rn),
      this.addDetector(an);
  }
  addDetector(e) {
    return (this.detectors[e.name] = e), this;
  }
  detect() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order,
      t = [];
    return (
      e.forEach((n) => {
        if (this.detectors[n]) {
          let s = this.detectors[n].lookup(this.options);
          s && typeof s == "string" && (s = [s]), s && (t = t.concat(s));
        }
      }),
      (t = t.map((n) => this.options.convertDetectedLanguage(n))),
      this.services &&
      this.services.languageUtils &&
      this.services.languageUtils.getBestMatchFromCodes
        ? t
        : t.length > 0
          ? t[0]
          : null
    );
  }
  cacheUserLanguage(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    t &&
      ((this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(e) > -1) ||
        t.forEach((n) => {
          this.detectors[n] && this.detectors[n].cacheUserLanguage(e, this.options);
        }));
  }
}
un.type = "languageDetector";
export { Jt as B, fn as a, un as b, C as i, cn as u };
//# sourceMappingURL=@lang-libs-Bb81l5PV.js.map
