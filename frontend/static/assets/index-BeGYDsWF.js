import {
  j as i,
  r as R,
  u as O,
  b as Jt,
  f as Xs,
  R as ie,
  O as H,
  T as zn,
  h as $s,
  g as Ro,
  i as Wn,
  k as bo,
  Q as Eo,
  l as No,
  e as Oo,
} from "./@app-libs-Cb_auZyT.js";
import {
  I as Kt,
  P as ei,
  B,
  O as ae,
  F as J,
  D as ct,
  T as Se,
  a as _e,
  b as Io,
  S as To,
  c as rt,
  C as S,
  N as se,
  d as Ze,
  e as ti,
  M as _,
  f as $,
  g as Do,
  h as ko,
  R as Bo,
  i as Po,
  A as Lt,
  j as Mo,
  k as Vo,
} from "./@bootstrap-libs-DZc4rDL4.js";
import {
  u as ze,
  a as q,
  L as jt,
  S as wt,
  O as ni,
  l as Lo,
  m as Ho,
  b as Uo,
  B as _o,
  R as qo,
  c as P,
  N as ln,
} from "./@react-libs-CeaqA_Hv.js";
import { u as b, i as zo, B as Wo, a as Go, b as Yo } from "./@lang-libs-Bb81l5PV.js";
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === "childList")
        for (const A of o.addedNodes) A.tagName === "LINK" && A.rel === "modulepreload" && r(A);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const o = {};
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = n(s);
    fetch(s.href, o);
  }
})();
const Gn = (e) =>
    i.jsx(Kt, {
      height: e.height && e.height,
      width: e.width && e.width,
      style: e.style && e.style,
      className: e.className && e.className,
      src: `https://images.evetech.net/characters/${e.character_id}/portrait?size=${e.size}`,
    }),
  De = (e) =>
    i.jsx(Kt, {
      height: e.height && e.height,
      width: e.width && e.width,
      style: e.style && e.style,
      src: `https://images.evetech.net/corporations/${e.corporation_id}/logo?size=${e.size}`,
    }),
  ri = (e) =>
    i.jsx(Kt, {
      height: e.height && e.height,
      width: e.width && e.width,
      style: e.style && e.style,
      src: `https://images.evetech.net/alliances/${e.alliance_id}/logo?size=${e.size}`,
    }),
  ht = (e) =>
    i.jsx(Kt, {
      height: e.height && e.height,
      width: e.width && e.width,
      style: e.style && e.style,
      src: `https://images.evetech.net/types/${e.type_id}/${e.size > 64 ? "render" : "icon"}?size=${e.size}`,
    }),
  si = (e) => {
    const t = e.rounded_images ? { borderRadius: "50%" } : {};
    return i.jsxs("div", {
      className: e.className && e.className,
      style: { height: `${e.size}px`, width: `${e.size}px`, position: "relative" },
      children: [
        i.jsx(Gn, {
          style: t,
          height: e.size,
          width: e.size,
          character_id: e.character.character_id,
          size: 512,
          className: e.className && e.className,
        }),
        i.jsx(De, {
          style: { position: "absolute", bottom: "0", left: "0", ...t },
          height: e.size / 4,
          width: e.size / 4,
          corporation_id: e.character.corporation_id,
          size: 256,
        }),
        e.character.faction_id
          ? i.jsx(De, {
              style: { position: "absolute", bottom: "0", right: "0", ...t },
              height: e.size / 4,
              width: e.size / 4,
              corporation_id: e.character.faction_id,
              size: 256,
            })
          : e.character.alliance_id &&
            i.jsx(ri, {
              style: { position: "absolute", bottom: "0", right: "0", ...t },
              height: e.size / 4,
              width: e.size / 4,
              alliance_id: e.character.alliance_id,
              size: 256,
            }),
      ],
    });
  },
  Jo = "_refreshAnimate_o9fr8_10",
  Ko = { refreshAnimate: Jo },
  Qo = "_searchInput_203nf_28",
  Zo = "_radioWrapper_203nf_40",
  Xo = "_searchWrapper_203nf_64",
  $o = "_searchWrapperFrom_203nf_68",
  eA = "_searchIcon_203nf_72",
  tA = "_xIcon_203nf_73",
  nA = "_dropDownIcon_203nf_99",
  Q = {
    searchInput: Qo,
    radioWrapper: Zo,
    searchWrapper: Xo,
    searchWrapperFrom: $o,
    searchIcon: eA,
    xIcon: tA,
    dropDownIcon: nA,
  },
  rA = RegExp.prototype.test.bind(/(<([^>]+)>)/i),
  sA = (e, t, n) =>
    e
      .getValue(t)
      .reduce((o, A) => (o += `|${A.name}`), "")
      .toLowerCase()
      .includes(n.toLowerCase()),
  iA = ({ column: e }) => {
    const n = e.getFilterValue(),
      r = i.jsx(ei, {
        id: "popover-positioned-top",
        children: i.jsxs("div", {
          className: "p-3",
          children: [
            i.jsx("input", {
              type: "number",
              value: (n == null ? void 0 : n[0]) ?? "",
              onChange: (s) => e.setFilterValue((o) => [s.target.value, o == null ? void 0 : o[1]]),
              placeholder: "Min",
              className: "form-control",
            }),
            i.jsx("p", { className: "text-center", children: "to" }),
            i.jsx("input", {
              type: "number",
              value: (n == null ? void 0 : n[1]) ?? "",
              onChange: (s) => e.setFilterValue((o) => [o == null ? void 0 : o[0], s.target.value]),
              placeholder: "Max",
              className: "form-control",
            }),
            i.jsx(B, {
              variant: "secondary",
              size: "sm",
              className: "w-100 mt-2",
              onClick: () => document.body.click(),
              children: "Close",
            }),
          ],
        }),
      });
    return i.jsx(ae, {
      trigger: "click",
      placement: "bottom",
      rootClose: !0,
      overlay: r,
      children: i.jsx("form", {
        className: Q.searchWrapperFrom,
        onReset: () => {
          e.setFilterValue(() => [void 0, void 0]);
        },
        children: i.jsxs("div", {
          className: Q.searchWrapper,
          children: [
            i.jsx(J.Control, {
              className: Q.searchInput,
              readOnly: !0,
              type: "text",
              placeholder: "Set Range",
              value:
                typeof (n == null ? void 0 : n[0]) < "u" || typeof (n == null ? void 0 : n[1]) < "u"
                  ? `${typeof (n == null ? void 0 : n[0]) > "u" || (n == null ? void 0 : n[0]) === "" ? "-∞" : n == null ? void 0 : n[0].toLocaleString()} to ${typeof (n == null ? void 0 : n[1]) > "u" || (n == null ? void 0 : n[1]) === "" ? "∞" : n == null ? void 0 : n[1].toLocaleString()}`
                  : void 0,
            }),
            i.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 512 512",
              className: `${Q.searchIcon} ${Q.dropDownIcon}`,
              children: i.jsx("path", {
                fill: "currentColor",
                d: "M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z",
              }),
            }),
            i.jsx("button", {
              type: "reset",
              children: i.jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                className: Q.xIcon,
                children: i.jsx("path", {
                  fill: "currentColor",
                  d: "M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z",
                }),
              }),
            }),
          ],
        }),
      }),
    });
  },
  oA = ({ column: e }) => {
    const t = e.getFilterValue(),
      n = i.jsx(ei, {
        id: "popover-positioned-top",
        children: i.jsxs("div", {
          className: `${Q.radioWrapper} p-2`,
          children: [
            i.jsx(J.Check, {
              label: "True",
              name: "group1",
              type: "radio",
              id: "radio-true",
              onChange: () => {
                e.setFilterValue(!0);
              },
            }),
            i.jsx(J.Check, {
              label: "False",
              name: "group1",
              type: "radio",
              id: "radio-false",
              onChange: () => {
                e.setFilterValue(!1);
              },
            }),
            i.jsx(B, {
              variant: "secondary",
              size: "sm",
              className: "w-100",
              onClick: () => document.body.click(),
              children: "Close",
            }),
          ],
        }),
      });
    return i.jsx(ae, {
      trigger: "click",
      placement: "bottom",
      rootClose: !0,
      overlay: n,
      children: i.jsx("form", {
        className: Q.searchWrapperFrom,
        onReset: () => {
          e.setFilterValue(() => {});
        },
        children: i.jsxs("div", {
          className: Q.searchWrapper,
          children: [
            i.jsx(J.Control, {
              className: Q.searchInput,
              readOnly: !0,
              type: "text",
              placeholder: "Filter",
              value: typeof t > "u" ? void 0 : t ? "True" : "False",
            }),
            i.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 512 512",
              className: `${Q.searchIcon} ${Q.dropDownIcon}`,
              children: i.jsx("path", {
                fill: "currentColor",
                d: "M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z",
              }),
            }),
            i.jsx("button", {
              type: "reset",
              children: i.jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                className: Q.xIcon,
                children: i.jsx("path", {
                  fill: "currentColor",
                  d: "M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z",
                }),
              }),
            }),
          ],
        }),
      }),
    });
  },
  AA = ({ column: e }) =>
    i.jsx("form", {
      onReset: () => {
        e.setFilterValue(null);
      },
      children: i.jsxs("div", {
        className: Q.searchWrapper,
        children: [
          i.jsx(J.Control, {
            className: Q.searchInput,
            type: "text",
            placeholder: "Search",
            onChange: (t) => {
              e.setFilterValue(t.target.value ? t.target.value : "");
            },
          }),
          i.jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            className: Q.searchIcon,
            children: i.jsx("path", {
              fill: "currentColor",
              "fill-rule": "evenodd",
              d: "M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
              "clip-rule": "evenodd",
            }),
          }),
          i.jsx("button", {
            type: "reset",
            children: i.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              className: Q.xIcon,
              children: i.jsx("path", {
                fill: "currentColor",
                d: "M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z",
              }),
            }),
          }),
        ],
      }),
    }),
  lA = ({ column: e }) => {
    const t = Array.from(e.getFacetedUniqueValues().keys()).sort(),
      n = e.getFilterValue(),
      r = rA(t == null ? void 0 : t[0]) || typeof (t == null ? void 0 : t[0]) == "object",
      s = t
        .reduce(
          (o, A) => (
            typeof A < "u" &&
              (r ||
                ((n === void 0 ||
                  (A != null && A.toLowerCase().includes(n == null ? void 0 : n.toLowerCase()))) &&
                  o.push({ value: A, label: A }))),
            o
          ),
          [],
        )
        .slice(0, 10);
    return i.jsx(ae, {
      trigger: "click",
      placement: "bottom-start",
      rootClose: !0,
      overlay: i.jsx(ct, {
        show: !0,
        drop: "down-centered",
        children: i.jsx(ct.Menu, {
          children: i.jsx(i.Fragment, {
            children:
              s.length > 0
                ? s.map((o) =>
                    i.jsx(ct.Item, {
                      eventKey: o.value,
                      onClick: () => {
                        e.setFilterValue(o.value ? o.value : ""), document.body.click();
                      },
                      children: o.label,
                    }),
                  )
                : i.jsx(ct.Item, { disabled: !0, children: "Start typing to search." }),
          }),
        }),
      }),
      children: i.jsx("form", {
        className: Q.searchWrapperFrom,
        onReset: () => {
          e.setFilterValue(() => {});
        },
        children: i.jsxs("div", {
          className: Q.searchWrapper,
          children: [
            i.jsx(J.Control, {
              className: Q.searchInput,
              type: "text",
              placeholder: "Search",
              value: typeof n > "u" ? void 0 : n,
              onChange: (o) => {
                e.setFilterValue(o.target.value ? o.target.value : "");
              },
            }),
            i.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              className: Q.searchIcon,
              children: i.jsx("path", {
                fill: "currentColor",
                "fill-rule": "evenodd",
                d: "M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
                "clip-rule": "evenodd",
              }),
            }),
            i.jsx("button", {
              type: "reset",
              children: i.jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                className: Q.xIcon,
                children: i.jsx("path", {
                  fill: "currentColor",
                  d: "M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z",
                }),
              }),
            }),
          ],
        }),
      }),
    });
  },
  cA = ({ column: e, table: t }) => {
    var r;
    const n = (r = t.getPreFilteredRowModel().flatRows[0]) == null ? void 0 : r.getValue(e.id);
    return typeof n == "number"
      ? i.jsx(iA, { column: e })
      : typeof n == "boolean"
        ? i.jsx(oA, { column: e })
        : typeof n == "object"
          ? i.jsx(AA, { column: e })
          : i.jsx(lA, { column: e });
  };
/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Ie(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ue(e, t) {
  return (n) => {
    t.setState((r) => ({ ...r, [e]: Ie(n, r[e]) }));
  };
}
function _t(e) {
  return e instanceof Function;
}
function aA(e) {
  return Array.isArray(e) && e.every((t) => typeof t == "number");
}
function uA(e, t) {
  const n = [],
    r = (s) => {
      s.forEach((o) => {
        n.push(o);
        const A = t(o);
        A != null && A.length && r(A);
      });
    };
  return r(e), n;
}
function C(e, t, n) {
  let r = [],
    s;
  return (o) => {
    let A;
    n.key && n.debug && (A = Date.now());
    const l = e(o);
    if (!(l.length !== r.length || l.some((u, d) => r[d] !== u))) return s;
    r = l;
    let c;
    if (
      (n.key && n.debug && (c = Date.now()),
      (s = t(...l)),
      n == null || n.onChange == null || n.onChange(s),
      n.key && n.debug && n != null && n.debug())
    ) {
      const u = Math.round((Date.now() - A) * 100) / 100,
        d = Math.round((Date.now() - c) * 100) / 100,
        g = d / 16,
        f = (h, m) => {
          for (h = String(h); h.length < m; ) h = " " + h;
          return h;
        };
      console.info(
        `%c⏱ ${f(d, 5)} /${f(u, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * g, 120))}deg 100% 31%);`,
        n == null ? void 0 : n.key,
      );
    }
    return s;
  };
}
function F(e, t, n, r) {
  return {
    debug: () => {
      var s;
      return (s = e == null ? void 0 : e.debugAll) != null ? s : e[t];
    },
    key: !1,
    onChange: r,
  };
}
function dA(e, t, n, r) {
  var s, o;
  const l = { ...e._getDefaultColumnDef(), ...t },
    a = l.accessorKey;
  let c =
      (s = (o = l.id) != null ? o : a ? a.replace(".", "_") : void 0) != null
        ? s
        : typeof l.header == "string"
          ? l.header
          : void 0,
    u;
  if (
    (l.accessorFn
      ? (u = l.accessorFn)
      : a &&
        (a.includes(".")
          ? (u = (g) => {
              let f = g;
              for (const m of a.split(".")) {
                var h;
                f = (h = f) == null ? void 0 : h[m];
              }
              return f;
            })
          : (u = (g) => g[l.accessorKey])),
    !c)
  )
    throw new Error();
  let d = {
    id: `${String(c)}`,
    accessorFn: u,
    parent: r,
    depth: n,
    columnDef: l,
    columns: [],
    getFlatColumns: C(
      () => [!0],
      () => {
        var g;
        return [d, ...((g = d.columns) == null ? void 0 : g.flatMap((f) => f.getFlatColumns()))];
      },
      F(e.options, "debugColumns"),
    ),
    getLeafColumns: C(
      () => [e._getOrderColumnsFn()],
      (g) => {
        var f;
        if ((f = d.columns) != null && f.length) {
          let h = d.columns.flatMap((m) => m.getLeafColumns());
          return g(h);
        }
        return [d];
      },
      F(e.options, "debugColumns"),
    ),
  };
  for (const g of e._features) g.createColumn == null || g.createColumn(d, e);
  return d;
}
const re = "debugHeaders";
function ds(e, t, n) {
  var r;
  let o = {
    id: (r = n.id) != null ? r : t.id,
    column: t,
    index: n.index,
    isPlaceholder: !!n.isPlaceholder,
    placeholderId: n.placeholderId,
    depth: n.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const A = [],
        l = (a) => {
          a.subHeaders && a.subHeaders.length && a.subHeaders.map(l), A.push(a);
        };
      return l(o), A;
    },
    getContext: () => ({ table: e, header: o, column: t }),
  };
  return (
    e._features.forEach((A) => {
      A.createHeader == null || A.createHeader(o, e);
    }),
    o
  );
}
const fA = {
  createTable: (e) => {
    (e.getHeaderGroups = C(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (t, n, r, s) => {
        var o, A;
        const l =
            (o = r == null ? void 0 : r.map((d) => n.find((g) => g.id === d)).filter(Boolean)) !=
            null
              ? o
              : [],
          a =
            (A = s == null ? void 0 : s.map((d) => n.find((g) => g.id === d)).filter(Boolean)) !=
            null
              ? A
              : [],
          c = n.filter((d) => !(r != null && r.includes(d.id)) && !(s != null && s.includes(d.id)));
        return bt(t, [...l, ...c, ...a], e);
      },
      F(e.options, re),
    )),
      (e.getCenterHeaderGroups = C(
        () => [
          e.getAllColumns(),
          e.getVisibleLeafColumns(),
          e.getState().columnPinning.left,
          e.getState().columnPinning.right,
        ],
        (t, n, r, s) => (
          (n = n.filter(
            (o) => !(r != null && r.includes(o.id)) && !(s != null && s.includes(o.id)),
          )),
          bt(t, n, e, "center")
        ),
        F(e.options, re),
      )),
      (e.getLeftHeaderGroups = C(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left],
        (t, n, r) => {
          var s;
          const o =
            (s = r == null ? void 0 : r.map((A) => n.find((l) => l.id === A)).filter(Boolean)) !=
            null
              ? s
              : [];
          return bt(t, o, e, "left");
        },
        F(e.options, re),
      )),
      (e.getRightHeaderGroups = C(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right],
        (t, n, r) => {
          var s;
          const o =
            (s = r == null ? void 0 : r.map((A) => n.find((l) => l.id === A)).filter(Boolean)) !=
            null
              ? s
              : [];
          return bt(t, o, e, "right");
        },
        F(e.options, re),
      )),
      (e.getFooterGroups = C(
        () => [e.getHeaderGroups()],
        (t) => [...t].reverse(),
        F(e.options, re),
      )),
      (e.getLeftFooterGroups = C(
        () => [e.getLeftHeaderGroups()],
        (t) => [...t].reverse(),
        F(e.options, re),
      )),
      (e.getCenterFooterGroups = C(
        () => [e.getCenterHeaderGroups()],
        (t) => [...t].reverse(),
        F(e.options, re),
      )),
      (e.getRightFooterGroups = C(
        () => [e.getRightHeaderGroups()],
        (t) => [...t].reverse(),
        F(e.options, re),
      )),
      (e.getFlatHeaders = C(
        () => [e.getHeaderGroups()],
        (t) => t.map((n) => n.headers).flat(),
        F(e.options, re),
      )),
      (e.getLeftFlatHeaders = C(
        () => [e.getLeftHeaderGroups()],
        (t) => t.map((n) => n.headers).flat(),
        F(e.options, re),
      )),
      (e.getCenterFlatHeaders = C(
        () => [e.getCenterHeaderGroups()],
        (t) => t.map((n) => n.headers).flat(),
        F(e.options, re),
      )),
      (e.getRightFlatHeaders = C(
        () => [e.getRightHeaderGroups()],
        (t) => t.map((n) => n.headers).flat(),
        F(e.options, re),
      )),
      (e.getCenterLeafHeaders = C(
        () => [e.getCenterFlatHeaders()],
        (t) =>
          t.filter((n) => {
            var r;
            return !((r = n.subHeaders) != null && r.length);
          }),
        F(e.options, re),
      )),
      (e.getLeftLeafHeaders = C(
        () => [e.getLeftFlatHeaders()],
        (t) =>
          t.filter((n) => {
            var r;
            return !((r = n.subHeaders) != null && r.length);
          }),
        F(e.options, re),
      )),
      (e.getRightLeafHeaders = C(
        () => [e.getRightFlatHeaders()],
        (t) =>
          t.filter((n) => {
            var r;
            return !((r = n.subHeaders) != null && r.length);
          }),
        F(e.options, re),
      )),
      (e.getLeafHeaders = C(
        () => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()],
        (t, n, r) => {
          var s, o, A, l, a, c;
          return [
            ...((s = (o = t[0]) == null ? void 0 : o.headers) != null ? s : []),
            ...((A = (l = n[0]) == null ? void 0 : l.headers) != null ? A : []),
            ...((a = (c = r[0]) == null ? void 0 : c.headers) != null ? a : []),
          ]
            .map((u) => u.getLeafHeaders())
            .flat();
        },
        F(e.options, re),
      ));
  },
};
function bt(e, t, n, r) {
  var s, o;
  let A = 0;
  const l = function (g, f) {
    f === void 0 && (f = 1),
      (A = Math.max(A, f)),
      g
        .filter((h) => h.getIsVisible())
        .forEach((h) => {
          var m;
          (m = h.columns) != null && m.length && l(h.columns, f + 1);
        }, 0);
  };
  l(e);
  let a = [];
  const c = (g, f) => {
      const h = { depth: f, id: [r, `${f}`].filter(Boolean).join("_"), headers: [] },
        m = [];
      g.forEach((x) => {
        const j = [...m].reverse()[0],
          v = x.column.depth === h.depth;
        let y,
          k = !1;
        if (
          (v && x.column.parent ? (y = x.column.parent) : ((y = x.column), (k = !0)),
          j && (j == null ? void 0 : j.column) === y)
        )
          j.subHeaders.push(x);
        else {
          const V = ds(n, y, {
            id: [r, f, y.id, x == null ? void 0 : x.id].filter(Boolean).join("_"),
            isPlaceholder: k,
            placeholderId: k ? `${m.filter((I) => I.column === y).length}` : void 0,
            depth: f,
            index: m.length,
          });
          V.subHeaders.push(x), m.push(V);
        }
        h.headers.push(x), (x.headerGroup = h);
      }),
        a.push(h),
        f > 0 && c(m, f - 1);
    },
    u = t.map((g, f) => ds(n, g, { depth: A, index: f }));
  c(u, A - 1), a.reverse();
  const d = (g) =>
    g
      .filter((h) => h.column.getIsVisible())
      .map((h) => {
        let m = 0,
          x = 0,
          j = [0];
        h.subHeaders && h.subHeaders.length
          ? ((j = []),
            d(h.subHeaders).forEach((y) => {
              let { colSpan: k, rowSpan: V } = y;
              (m += k), j.push(V);
            }))
          : (m = 1);
        const v = Math.min(...j);
        return (x = x + v), (h.colSpan = m), (h.rowSpan = x), { colSpan: m, rowSpan: x };
      });
  return d((s = (o = a[0]) == null ? void 0 : o.headers) != null ? s : []), a;
}
const Et = { size: 150, minSize: 20, maxSize: Number.MAX_SAFE_INTEGER },
  cn = () => ({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: !1,
    columnSizingStart: [],
  }),
  gA = {
    getDefaultColumnDef: () => Et,
    getInitialState: (e) => ({ columnSizing: {}, columnSizingInfo: cn(), ...e }),
    getDefaultOptions: (e) => ({
      columnResizeMode: "onEnd",
      columnResizeDirection: "ltr",
      onColumnSizingChange: ue("columnSizing", e),
      onColumnSizingInfoChange: ue("columnSizingInfo", e),
    }),
    createColumn: (e, t) => {
      (e.getSize = () => {
        var n, r, s;
        const o = t.getState().columnSizing[e.id];
        return Math.min(
          Math.max(
            (n = e.columnDef.minSize) != null ? n : Et.minSize,
            (r = o ?? e.columnDef.size) != null ? r : Et.size,
          ),
          (s = e.columnDef.maxSize) != null ? s : Et.maxSize,
        );
      }),
        (e.getStart = C(
          (n) => [n, gt(t, n), t.getState().columnSizing],
          (n, r) => r.slice(0, e.getIndex(n)).reduce((s, o) => s + o.getSize(), 0),
          F(t.options, "debugColumns"),
        )),
        (e.getAfter = C(
          (n) => [n, gt(t, n), t.getState().columnSizing],
          (n, r) => r.slice(e.getIndex(n) + 1).reduce((s, o) => s + o.getSize(), 0),
          F(t.options, "debugColumns"),
        )),
        (e.resetSize = () => {
          t.setColumnSizing((n) => {
            let { [e.id]: r, ...s } = n;
            return s;
          });
        }),
        (e.getCanResize = () => {
          var n, r;
          return (
            ((n = e.columnDef.enableResizing) != null ? n : !0) &&
            ((r = t.options.enableColumnResizing) != null ? r : !0)
          );
        }),
        (e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id);
    },
    createHeader: (e, t) => {
      (e.getSize = () => {
        let n = 0;
        const r = (s) => {
          if (s.subHeaders.length) s.subHeaders.forEach(r);
          else {
            var o;
            n += (o = s.column.getSize()) != null ? o : 0;
          }
        };
        return r(e), n;
      }),
        (e.getStart = () => {
          if (e.index > 0) {
            const n = e.headerGroup.headers[e.index - 1];
            return n.getStart() + n.getSize();
          }
          return 0;
        }),
        (e.getResizeHandler = (n) => {
          const r = t.getColumn(e.column.id),
            s = r == null ? void 0 : r.getCanResize();
          return (o) => {
            if (
              !r ||
              !s ||
              (o.persist == null || o.persist(), an(o) && o.touches && o.touches.length > 1)
            )
              return;
            const A = e.getSize(),
              l = e
                ? e.getLeafHeaders().map((j) => [j.column.id, j.column.getSize()])
                : [[r.id, r.getSize()]],
              a = an(o) ? Math.round(o.touches[0].clientX) : o.clientX,
              c = {},
              u = (j, v) => {
                typeof v == "number" &&
                  (t.setColumnSizingInfo((y) => {
                    var k, V;
                    const I = t.options.columnResizeDirection === "rtl" ? -1 : 1,
                      M = (v - ((k = y == null ? void 0 : y.startOffset) != null ? k : 0)) * I,
                      z = Math.max(
                        M / ((V = y == null ? void 0 : y.startSize) != null ? V : 0),
                        -0.999999,
                      );
                    return (
                      y.columnSizingStart.forEach((W) => {
                        let [G, Y] = W;
                        c[G] = Math.round(Math.max(Y + Y * z, 0) * 100) / 100;
                      }),
                      { ...y, deltaOffset: M, deltaPercentage: z }
                    );
                  }),
                  (t.options.columnResizeMode === "onChange" || j === "end") &&
                    t.setColumnSizing((y) => ({ ...y, ...c })));
              },
              d = (j) => u("move", j),
              g = (j) => {
                u("end", j),
                  t.setColumnSizingInfo((v) => ({
                    ...v,
                    isResizingColumn: !1,
                    startOffset: null,
                    startSize: null,
                    deltaOffset: null,
                    deltaPercentage: null,
                    columnSizingStart: [],
                  }));
              },
              f = n || typeof document < "u" ? document : null,
              h = {
                moveHandler: (j) => d(j.clientX),
                upHandler: (j) => {
                  f == null || f.removeEventListener("mousemove", h.moveHandler),
                    f == null || f.removeEventListener("mouseup", h.upHandler),
                    g(j.clientX);
                },
              },
              m = {
                moveHandler: (j) => (
                  j.cancelable && (j.preventDefault(), j.stopPropagation()),
                  d(j.touches[0].clientX),
                  !1
                ),
                upHandler: (j) => {
                  var v;
                  f == null || f.removeEventListener("touchmove", m.moveHandler),
                    f == null || f.removeEventListener("touchend", m.upHandler),
                    j.cancelable && (j.preventDefault(), j.stopPropagation()),
                    g((v = j.touches[0]) == null ? void 0 : v.clientX);
                },
              },
              x = hA() ? { passive: !1 } : !1;
            an(o)
              ? (f == null || f.addEventListener("touchmove", m.moveHandler, x),
                f == null || f.addEventListener("touchend", m.upHandler, x))
              : (f == null || f.addEventListener("mousemove", h.moveHandler, x),
                f == null || f.addEventListener("mouseup", h.upHandler, x)),
              t.setColumnSizingInfo((j) => ({
                ...j,
                startOffset: a,
                startSize: A,
                deltaOffset: 0,
                deltaPercentage: 0,
                columnSizingStart: l,
                isResizingColumn: r.id,
              }));
          };
        });
    },
    createTable: (e) => {
      (e.setColumnSizing = (t) =>
        e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t)),
        (e.setColumnSizingInfo = (t) =>
          e.options.onColumnSizingInfoChange == null
            ? void 0
            : e.options.onColumnSizingInfoChange(t)),
        (e.resetColumnSizing = (t) => {
          var n;
          e.setColumnSizing(t ? {} : (n = e.initialState.columnSizing) != null ? n : {});
        }),
        (e.resetHeaderSizeInfo = (t) => {
          var n;
          e.setColumnSizingInfo(
            t ? cn() : (n = e.initialState.columnSizingInfo) != null ? n : cn(),
          );
        }),
        (e.getTotalSize = () => {
          var t, n;
          return (t =
            (n = e.getHeaderGroups()[0]) == null
              ? void 0
              : n.headers.reduce((r, s) => r + s.getSize(), 0)) != null
            ? t
            : 0;
        }),
        (e.getLeftTotalSize = () => {
          var t, n;
          return (t =
            (n = e.getLeftHeaderGroups()[0]) == null
              ? void 0
              : n.headers.reduce((r, s) => r + s.getSize(), 0)) != null
            ? t
            : 0;
        }),
        (e.getCenterTotalSize = () => {
          var t, n;
          return (t =
            (n = e.getCenterHeaderGroups()[0]) == null
              ? void 0
              : n.headers.reduce((r, s) => r + s.getSize(), 0)) != null
            ? t
            : 0;
        }),
        (e.getRightTotalSize = () => {
          var t, n;
          return (t =
            (n = e.getRightHeaderGroups()[0]) == null
              ? void 0
              : n.headers.reduce((r, s) => r + s.getSize(), 0)) != null
            ? t
            : 0;
        });
    },
  };
let Nt = null;
function hA() {
  if (typeof Nt == "boolean") return Nt;
  let e = !1;
  try {
    const t = {
        get passive() {
          return (e = !0), !1;
        },
      },
      n = () => {};
    window.addEventListener("test", n, t), window.removeEventListener("test", n);
  } catch {
    e = !1;
  }
  return (Nt = e), Nt;
}
function an(e) {
  return e.type === "touchstart";
}
const mA = {
    getInitialState: (e) => ({ expanded: {}, ...e }),
    getDefaultOptions: (e) => ({ onExpandedChange: ue("expanded", e), paginateExpandedRows: !0 }),
    createTable: (e) => {
      let t = !1,
        n = !1;
      (e._autoResetExpanded = () => {
        var r, s;
        if (!t) {
          e._queue(() => {
            t = !0;
          });
          return;
        }
        if (
          (r = (s = e.options.autoResetAll) != null ? s : e.options.autoResetExpanded) != null
            ? r
            : !e.options.manualExpanding
        ) {
          if (n) return;
          (n = !0),
            e._queue(() => {
              e.resetExpanded(), (n = !1);
            });
        }
      }),
        (e.setExpanded = (r) =>
          e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(r)),
        (e.toggleAllRowsExpanded = (r) => {
          (r ?? !e.getIsAllRowsExpanded()) ? e.setExpanded(!0) : e.setExpanded({});
        }),
        (e.resetExpanded = (r) => {
          var s, o;
          e.setExpanded(
            r ? {} : (s = (o = e.initialState) == null ? void 0 : o.expanded) != null ? s : {},
          );
        }),
        (e.getCanSomeRowsExpand = () =>
          e.getPrePaginationRowModel().flatRows.some((r) => r.getCanExpand())),
        (e.getToggleAllRowsExpandedHandler = () => (r) => {
          r.persist == null || r.persist(), e.toggleAllRowsExpanded();
        }),
        (e.getIsSomeRowsExpanded = () => {
          const r = e.getState().expanded;
          return r === !0 || Object.values(r).some(Boolean);
        }),
        (e.getIsAllRowsExpanded = () => {
          const r = e.getState().expanded;
          return typeof r == "boolean"
            ? r === !0
            : !(!Object.keys(r).length || e.getRowModel().flatRows.some((s) => !s.getIsExpanded()));
        }),
        (e.getExpandedDepth = () => {
          let r = 0;
          return (
            (e.getState().expanded === !0
              ? Object.keys(e.getRowModel().rowsById)
              : Object.keys(e.getState().expanded)
            ).forEach((o) => {
              const A = o.split(".");
              r = Math.max(r, A.length);
            }),
            r
          );
        }),
        (e.getPreExpandedRowModel = () => e.getSortedRowModel()),
        (e.getExpandedRowModel = () => (
          !e._getExpandedRowModel &&
            e.options.getExpandedRowModel &&
            (e._getExpandedRowModel = e.options.getExpandedRowModel(e)),
          e.options.manualExpanding || !e._getExpandedRowModel
            ? e.getPreExpandedRowModel()
            : e._getExpandedRowModel()
        ));
    },
    createRow: (e, t) => {
      (e.toggleExpanded = (n) => {
        t.setExpanded((r) => {
          var s;
          const o = r === !0 ? !0 : !!(r != null && r[e.id]);
          let A = {};
          if (
            (r === !0
              ? Object.keys(t.getRowModel().rowsById).forEach((l) => {
                  A[l] = !0;
                })
              : (A = r),
            (n = (s = n) != null ? s : !o),
            !o && n)
          )
            return { ...A, [e.id]: !0 };
          if (o && !n) {
            const { [e.id]: l, ...a } = A;
            return a;
          }
          return r;
        });
      }),
        (e.getIsExpanded = () => {
          var n;
          const r = t.getState().expanded;
          return !!((n =
            t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) != null
            ? n
            : r === !0 || (r != null && r[e.id]));
        }),
        (e.getCanExpand = () => {
          var n, r, s;
          return (n = t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) !=
            null
            ? n
            : ((r = t.options.enableExpanding) != null ? r : !0) &&
                !!((s = e.subRows) != null && s.length);
        }),
        (e.getIsAllParentsExpanded = () => {
          let n = !0,
            r = e;
          for (; n && r.parentId; ) (r = t.getRow(r.parentId, !0)), (n = r.getIsExpanded());
          return n;
        }),
        (e.getToggleExpandedHandler = () => {
          const n = e.getCanExpand();
          return () => {
            n && e.toggleExpanded();
          };
        });
    },
  },
  ii = (e, t, n) => {
    var r;
    const s = n.toLowerCase();
    return !!(
      !(
        (r = e.getValue(t)) == null ||
        (r = r.toString()) == null ||
        (r = r.toLowerCase()) == null
      ) && r.includes(s)
    );
  };
ii.autoRemove = (e) => xe(e);
const oi = (e, t, n) => {
  var r;
  return !!(!((r = e.getValue(t)) == null || (r = r.toString()) == null) && r.includes(n));
};
oi.autoRemove = (e) => xe(e);
const Ai = (e, t, n) => {
  var r;
  return (
    ((r = e.getValue(t)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) ===
    (n == null ? void 0 : n.toLowerCase())
  );
};
Ai.autoRemove = (e) => xe(e);
const li = (e, t, n) => {
  var r;
  return (r = e.getValue(t)) == null ? void 0 : r.includes(n);
};
li.autoRemove = (e) => xe(e) || !(e != null && e.length);
const ci = (e, t, n) =>
  !n.some((r) => {
    var s;
    return !((s = e.getValue(t)) != null && s.includes(r));
  });
ci.autoRemove = (e) => xe(e) || !(e != null && e.length);
const ai = (e, t, n) =>
  n.some((r) => {
    var s;
    return (s = e.getValue(t)) == null ? void 0 : s.includes(r);
  });
ai.autoRemove = (e) => xe(e) || !(e != null && e.length);
const ui = (e, t, n) => e.getValue(t) === n;
ui.autoRemove = (e) => xe(e);
const di = (e, t, n) => e.getValue(t) == n;
di.autoRemove = (e) => xe(e);
const Yn = (e, t, n) => {
  let [r, s] = n;
  const o = e.getValue(t);
  return o >= r && o <= s;
};
Yn.resolveFilterValue = (e) => {
  let [t, n] = e,
    r = typeof t != "number" ? parseFloat(t) : t,
    s = typeof n != "number" ? parseFloat(n) : n,
    o = t === null || Number.isNaN(r) ? -1 / 0 : r,
    A = n === null || Number.isNaN(s) ? 1 / 0 : s;
  if (o > A) {
    const l = o;
    (o = A), (A = l);
  }
  return [o, A];
};
Yn.autoRemove = (e) => xe(e) || (xe(e[0]) && xe(e[1]));
const Fe = {
  includesString: ii,
  includesStringSensitive: oi,
  equalsString: Ai,
  arrIncludes: li,
  arrIncludesAll: ci,
  arrIncludesSome: ai,
  equals: ui,
  weakEquals: di,
  inNumberRange: Yn,
};
function xe(e) {
  return e == null || e === "";
}
const pA = {
  getDefaultColumnDef: () => ({ filterFn: "auto" }),
  getInitialState: (e) => ({ columnFilters: [], globalFilter: void 0, ...e }),
  getDefaultOptions: (e) => ({
    onColumnFiltersChange: ue("columnFilters", e),
    onGlobalFilterChange: ue("globalFilter", e),
    filterFromLeafRows: !1,
    maxLeafRowFilterDepth: 100,
    globalFilterFn: "auto",
    getColumnCanGlobalFilter: (t) => {
      var n;
      const r =
        (n = e.getCoreRowModel().flatRows[0]) == null ||
        (n = n._getAllCellsByColumnId()[t.id]) == null
          ? void 0
          : n.getValue();
      return typeof r == "string" || typeof r == "number";
    },
  }),
  createColumn: (e, t) => {
    (e.getAutoFilterFn = () => {
      const n = t.getCoreRowModel().flatRows[0],
        r = n == null ? void 0 : n.getValue(e.id);
      return typeof r == "string"
        ? Fe.includesString
        : typeof r == "number"
          ? Fe.inNumberRange
          : typeof r == "boolean" || (r !== null && typeof r == "object")
            ? Fe.equals
            : Array.isArray(r)
              ? Fe.arrIncludes
              : Fe.weakEquals;
    }),
      (e.getFilterFn = () => {
        var n, r;
        return _t(e.columnDef.filterFn)
          ? e.columnDef.filterFn
          : e.columnDef.filterFn === "auto"
            ? e.getAutoFilterFn()
            : (n = (r = t.options.filterFns) == null ? void 0 : r[e.columnDef.filterFn]) != null
              ? n
              : Fe[e.columnDef.filterFn];
      }),
      (e.getCanFilter = () => {
        var n, r, s;
        return (
          ((n = e.columnDef.enableColumnFilter) != null ? n : !0) &&
          ((r = t.options.enableColumnFilters) != null ? r : !0) &&
          ((s = t.options.enableFilters) != null ? s : !0) &&
          !!e.accessorFn
        );
      }),
      (e.getCanGlobalFilter = () => {
        var n, r, s, o;
        return (
          ((n = e.columnDef.enableGlobalFilter) != null ? n : !0) &&
          ((r = t.options.enableGlobalFilter) != null ? r : !0) &&
          ((s = t.options.enableFilters) != null ? s : !0) &&
          ((o =
            t.options.getColumnCanGlobalFilter == null
              ? void 0
              : t.options.getColumnCanGlobalFilter(e)) != null
            ? o
            : !0) &&
          !!e.accessorFn
        );
      }),
      (e.getIsFiltered = () => e.getFilterIndex() > -1),
      (e.getFilterValue = () => {
        var n;
        return (n = t.getState().columnFilters) == null ||
          (n = n.find((r) => r.id === e.id)) == null
          ? void 0
          : n.value;
      }),
      (e.getFilterIndex = () => {
        var n, r;
        return (n =
          (r = t.getState().columnFilters) == null ? void 0 : r.findIndex((s) => s.id === e.id)) !=
          null
          ? n
          : -1;
      }),
      (e.setFilterValue = (n) => {
        t.setColumnFilters((r) => {
          const s = e.getFilterFn(),
            o = r == null ? void 0 : r.find((u) => u.id === e.id),
            A = Ie(n, o ? o.value : void 0);
          if (fs(s, A, e)) {
            var l;
            return (l = r == null ? void 0 : r.filter((u) => u.id !== e.id)) != null ? l : [];
          }
          const a = { id: e.id, value: A };
          if (o) {
            var c;
            return (c = r == null ? void 0 : r.map((u) => (u.id === e.id ? a : u))) != null
              ? c
              : [];
          }
          return r != null && r.length ? [...r, a] : [a];
        });
      }),
      (e._getFacetedRowModel =
        t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id)),
      (e.getFacetedRowModel = () =>
        e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel()),
      (e._getFacetedUniqueValues =
        t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id)),
      (e.getFacetedUniqueValues = () =>
        e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : new Map()),
      (e._getFacetedMinMaxValues =
        t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id)),
      (e.getFacetedMinMaxValues = () => {
        if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
      });
  },
  createRow: (e, t) => {
    (e.columnFilters = {}), (e.columnFiltersMeta = {});
  },
  createTable: (e) => {
    (e.getGlobalAutoFilterFn = () => Fe.includesString),
      (e.getGlobalFilterFn = () => {
        var t, n;
        const { globalFilterFn: r } = e.options;
        return _t(r)
          ? r
          : r === "auto"
            ? e.getGlobalAutoFilterFn()
            : (t = (n = e.options.filterFns) == null ? void 0 : n[r]) != null
              ? t
              : Fe[r];
      }),
      (e.setColumnFilters = (t) => {
        const n = e.getAllLeafColumns(),
          r = (s) => {
            var o;
            return (o = Ie(t, s)) == null
              ? void 0
              : o.filter((A) => {
                  const l = n.find((a) => a.id === A.id);
                  if (l) {
                    const a = l.getFilterFn();
                    if (fs(a, A.value, l)) return !1;
                  }
                  return !0;
                });
          };
        e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange(r);
      }),
      (e.setGlobalFilter = (t) => {
        e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t);
      }),
      (e.resetGlobalFilter = (t) => {
        e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter);
      }),
      (e.resetColumnFilters = (t) => {
        var n, r;
        e.setColumnFilters(
          t ? [] : (n = (r = e.initialState) == null ? void 0 : r.columnFilters) != null ? n : [],
        );
      }),
      (e.getPreFilteredRowModel = () => e.getCoreRowModel()),
      (e.getFilteredRowModel = () => (
        !e._getFilteredRowModel &&
          e.options.getFilteredRowModel &&
          (e._getFilteredRowModel = e.options.getFilteredRowModel(e)),
        e.options.manualFiltering || !e._getFilteredRowModel
          ? e.getPreFilteredRowModel()
          : e._getFilteredRowModel()
      )),
      (e._getGlobalFacetedRowModel =
        e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, "__global__")),
      (e.getGlobalFacetedRowModel = () =>
        e.options.manualFiltering || !e._getGlobalFacetedRowModel
          ? e.getPreFilteredRowModel()
          : e._getGlobalFacetedRowModel()),
      (e._getGlobalFacetedUniqueValues =
        e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, "__global__")),
      (e.getGlobalFacetedUniqueValues = () =>
        e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : new Map()),
      (e._getGlobalFacetedMinMaxValues =
        e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, "__global__")),
      (e.getGlobalFacetedMinMaxValues = () => {
        if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
      });
  },
};
function fs(e, t, n) {
  return (
    (e && e.autoRemove ? e.autoRemove(t, n) : !1) || typeof t > "u" || (typeof t == "string" && !t)
  );
}
const xA = (e, t, n) =>
    n.reduce((r, s) => {
      const o = s.getValue(e);
      return r + (typeof o == "number" ? o : 0);
    }, 0),
  jA = (e, t, n) => {
    let r;
    return (
      n.forEach((s) => {
        const o = s.getValue(e);
        o != null && (r > o || (r === void 0 && o >= o)) && (r = o);
      }),
      r
    );
  },
  wA = (e, t, n) => {
    let r;
    return (
      n.forEach((s) => {
        const o = s.getValue(e);
        o != null && (r < o || (r === void 0 && o >= o)) && (r = o);
      }),
      r
    );
  },
  yA = (e, t, n) => {
    let r, s;
    return (
      n.forEach((o) => {
        const A = o.getValue(e);
        A != null && (r === void 0 ? A >= A && (r = s = A) : (r > A && (r = A), s < A && (s = A)));
      }),
      [r, s]
    );
  },
  SA = (e, t) => {
    let n = 0,
      r = 0;
    if (
      (t.forEach((s) => {
        let o = s.getValue(e);
        o != null && (o = +o) >= o && (++n, (r += o));
      }),
      n)
    )
      return r / n;
  },
  vA = (e, t) => {
    if (!t.length) return;
    const n = t.map((o) => o.getValue(e));
    if (!aA(n)) return;
    if (n.length === 1) return n[0];
    const r = Math.floor(n.length / 2),
      s = n.sort((o, A) => o - A);
    return n.length % 2 !== 0 ? s[r] : (s[r - 1] + s[r]) / 2;
  },
  CA = (e, t) => Array.from(new Set(t.map((n) => n.getValue(e))).values()),
  FA = (e, t) => new Set(t.map((n) => n.getValue(e))).size,
  RA = (e, t) => t.length,
  un = {
    sum: xA,
    min: jA,
    max: wA,
    extent: yA,
    mean: SA,
    median: vA,
    unique: CA,
    uniqueCount: FA,
    count: RA,
  },
  bA = {
    getDefaultColumnDef: () => ({
      aggregatedCell: (e) => {
        var t, n;
        return (t = (n = e.getValue()) == null || n.toString == null ? void 0 : n.toString()) !=
          null
          ? t
          : null;
      },
      aggregationFn: "auto",
    }),
    getInitialState: (e) => ({ grouping: [], ...e }),
    getDefaultOptions: (e) => ({
      onGroupingChange: ue("grouping", e),
      groupedColumnMode: "reorder",
    }),
    createColumn: (e, t) => {
      (e.toggleGrouping = () => {
        t.setGrouping((n) =>
          n != null && n.includes(e.id) ? n.filter((r) => r !== e.id) : [...(n ?? []), e.id],
        );
      }),
        (e.getCanGroup = () => {
          var n, r, s, o;
          return (n =
            (r =
              (s = (o = e.columnDef.enableGrouping) != null ? o : !0) != null
                ? s
                : t.options.enableGrouping) != null
              ? r
              : !0) != null
            ? n
            : !!e.accessorFn;
        }),
        (e.getIsGrouped = () => {
          var n;
          return (n = t.getState().grouping) == null ? void 0 : n.includes(e.id);
        }),
        (e.getGroupedIndex = () => {
          var n;
          return (n = t.getState().grouping) == null ? void 0 : n.indexOf(e.id);
        }),
        (e.getToggleGroupingHandler = () => {
          const n = e.getCanGroup();
          return () => {
            n && e.toggleGrouping();
          };
        }),
        (e.getAutoAggregationFn = () => {
          const n = t.getCoreRowModel().flatRows[0],
            r = n == null ? void 0 : n.getValue(e.id);
          if (typeof r == "number") return un.sum;
          if (Object.prototype.toString.call(r) === "[object Date]") return un.extent;
        }),
        (e.getAggregationFn = () => {
          var n, r;
          if (!e) throw new Error();
          return _t(e.columnDef.aggregationFn)
            ? e.columnDef.aggregationFn
            : e.columnDef.aggregationFn === "auto"
              ? e.getAutoAggregationFn()
              : (n =
                    (r = t.options.aggregationFns) == null
                      ? void 0
                      : r[e.columnDef.aggregationFn]) != null
                ? n
                : un[e.columnDef.aggregationFn];
        });
    },
    createTable: (e) => {
      (e.setGrouping = (t) =>
        e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t)),
        (e.resetGrouping = (t) => {
          var n, r;
          e.setGrouping(
            t ? [] : (n = (r = e.initialState) == null ? void 0 : r.grouping) != null ? n : [],
          );
        }),
        (e.getPreGroupedRowModel = () => e.getFilteredRowModel()),
        (e.getGroupedRowModel = () => (
          !e._getGroupedRowModel &&
            e.options.getGroupedRowModel &&
            (e._getGroupedRowModel = e.options.getGroupedRowModel(e)),
          e.options.manualGrouping || !e._getGroupedRowModel
            ? e.getPreGroupedRowModel()
            : e._getGroupedRowModel()
        ));
    },
    createRow: (e, t) => {
      (e.getIsGrouped = () => !!e.groupingColumnId),
        (e.getGroupingValue = (n) => {
          if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
          const r = t.getColumn(n);
          return r != null && r.columnDef.getGroupingValue
            ? ((e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original)),
              e._groupingValuesCache[n])
            : e.getValue(n);
        }),
        (e._groupingValuesCache = {});
    },
    createCell: (e, t, n, r) => {
      (e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId),
        (e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped()),
        (e.getIsAggregated = () => {
          var s;
          return (
            !e.getIsGrouped() && !e.getIsPlaceholder() && !!((s = n.subRows) != null && s.length)
          );
        });
    },
  };
function EA(e, t, n) {
  if (!(t != null && t.length) || !n) return e;
  const r = e.filter((o) => !t.includes(o.id));
  return n === "remove" ? r : [...t.map((o) => e.find((A) => A.id === o)).filter(Boolean), ...r];
}
const NA = {
    getInitialState: (e) => ({ columnOrder: [], ...e }),
    getDefaultOptions: (e) => ({ onColumnOrderChange: ue("columnOrder", e) }),
    createColumn: (e, t) => {
      (e.getIndex = C(
        (n) => [gt(t, n)],
        (n) => n.findIndex((r) => r.id === e.id),
        F(t.options, "debugColumns"),
      )),
        (e.getIsFirstColumn = (n) => {
          var r;
          return ((r = gt(t, n)[0]) == null ? void 0 : r.id) === e.id;
        }),
        (e.getIsLastColumn = (n) => {
          var r;
          const s = gt(t, n);
          return ((r = s[s.length - 1]) == null ? void 0 : r.id) === e.id;
        });
    },
    createTable: (e) => {
      (e.setColumnOrder = (t) =>
        e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t)),
        (e.resetColumnOrder = (t) => {
          var n;
          e.setColumnOrder(t ? [] : (n = e.initialState.columnOrder) != null ? n : []);
        }),
        (e._getOrderColumnsFn = C(
          () => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode],
          (t, n, r) => (s) => {
            let o = [];
            if (!(t != null && t.length)) o = s;
            else {
              const A = [...t],
                l = [...s];
              for (; l.length && A.length; ) {
                const a = A.shift(),
                  c = l.findIndex((u) => u.id === a);
                c > -1 && o.push(l.splice(c, 1)[0]);
              }
              o = [...o, ...l];
            }
            return EA(o, n, r);
          },
          F(e.options, "debugTable"),
        ));
    },
  },
  Cn = 0,
  Fn = 10,
  dn = () => ({ pageIndex: Cn, pageSize: Fn }),
  OA = {
    getInitialState: (e) => ({
      ...e,
      pagination: { ...dn(), ...(e == null ? void 0 : e.pagination) },
    }),
    getDefaultOptions: (e) => ({ onPaginationChange: ue("pagination", e) }),
    createTable: (e) => {
      let t = !1,
        n = !1;
      (e._autoResetPageIndex = () => {
        var r, s;
        if (!t) {
          e._queue(() => {
            t = !0;
          });
          return;
        }
        if (
          (r = (s = e.options.autoResetAll) != null ? s : e.options.autoResetPageIndex) != null
            ? r
            : !e.options.manualPagination
        ) {
          if (n) return;
          (n = !0),
            e._queue(() => {
              e.resetPageIndex(), (n = !1);
            });
        }
      }),
        (e.setPagination = (r) => {
          const s = (o) => Ie(r, o);
          return e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange(s);
        }),
        (e.resetPagination = (r) => {
          var s;
          e.setPagination(r ? dn() : (s = e.initialState.pagination) != null ? s : dn());
        }),
        (e.setPageIndex = (r) => {
          e.setPagination((s) => {
            let o = Ie(r, s.pageIndex);
            const A =
              typeof e.options.pageCount > "u" || e.options.pageCount === -1
                ? Number.MAX_SAFE_INTEGER
                : e.options.pageCount - 1;
            return (o = Math.max(0, Math.min(o, A))), { ...s, pageIndex: o };
          });
        }),
        (e.resetPageIndex = (r) => {
          var s, o;
          e.setPageIndex(
            r
              ? Cn
              : (s =
                    (o = e.initialState) == null || (o = o.pagination) == null
                      ? void 0
                      : o.pageIndex) != null
                ? s
                : Cn,
          );
        }),
        (e.resetPageSize = (r) => {
          var s, o;
          e.setPageSize(
            r
              ? Fn
              : (s =
                    (o = e.initialState) == null || (o = o.pagination) == null
                      ? void 0
                      : o.pageSize) != null
                ? s
                : Fn,
          );
        }),
        (e.setPageSize = (r) => {
          e.setPagination((s) => {
            const o = Math.max(1, Ie(r, s.pageSize)),
              A = s.pageSize * s.pageIndex,
              l = Math.floor(A / o);
            return { ...s, pageIndex: l, pageSize: o };
          });
        }),
        (e.setPageCount = (r) =>
          e.setPagination((s) => {
            var o;
            let A = Ie(r, (o = e.options.pageCount) != null ? o : -1);
            return typeof A == "number" && (A = Math.max(-1, A)), { ...s, pageCount: A };
          })),
        (e.getPageOptions = C(
          () => [e.getPageCount()],
          (r) => {
            let s = [];
            return r && r > 0 && (s = [...new Array(r)].fill(null).map((o, A) => A)), s;
          },
          F(e.options, "debugTable"),
        )),
        (e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0),
        (e.getCanNextPage = () => {
          const { pageIndex: r } = e.getState().pagination,
            s = e.getPageCount();
          return s === -1 ? !0 : s === 0 ? !1 : r < s - 1;
        }),
        (e.previousPage = () => e.setPageIndex((r) => r - 1)),
        (e.nextPage = () => e.setPageIndex((r) => r + 1)),
        (e.getPrePaginationRowModel = () => e.getExpandedRowModel()),
        (e.getPaginationRowModel = () => (
          !e._getPaginationRowModel &&
            e.options.getPaginationRowModel &&
            (e._getPaginationRowModel = e.options.getPaginationRowModel(e)),
          e.options.manualPagination || !e._getPaginationRowModel
            ? e.getPrePaginationRowModel()
            : e._getPaginationRowModel()
        )),
        (e.getPageCount = () => {
          var r;
          return (r = e.options.pageCount) != null
            ? r
            : Math.ceil(
                e.getPrePaginationRowModel().rows.length / e.getState().pagination.pageSize,
              );
        });
    },
  },
  fn = () => ({ left: [], right: [] }),
  gn = () => ({ top: [], bottom: [] }),
  IA = {
    getInitialState: (e) => ({ columnPinning: fn(), rowPinning: gn(), ...e }),
    getDefaultOptions: (e) => ({
      onColumnPinningChange: ue("columnPinning", e),
      onRowPinningChange: ue("rowPinning", e),
    }),
    createColumn: (e, t) => {
      (e.pin = (n) => {
        const r = e
          .getLeafColumns()
          .map((s) => s.id)
          .filter(Boolean);
        t.setColumnPinning((s) => {
          var o, A;
          if (n === "right") {
            var l, a;
            return {
              left: ((l = s == null ? void 0 : s.left) != null ? l : []).filter(
                (d) => !(r != null && r.includes(d)),
              ),
              right: [
                ...((a = s == null ? void 0 : s.right) != null ? a : []).filter(
                  (d) => !(r != null && r.includes(d)),
                ),
                ...r,
              ],
            };
          }
          if (n === "left") {
            var c, u;
            return {
              left: [
                ...((c = s == null ? void 0 : s.left) != null ? c : []).filter(
                  (d) => !(r != null && r.includes(d)),
                ),
                ...r,
              ],
              right: ((u = s == null ? void 0 : s.right) != null ? u : []).filter(
                (d) => !(r != null && r.includes(d)),
              ),
            };
          }
          return {
            left: ((o = s == null ? void 0 : s.left) != null ? o : []).filter(
              (d) => !(r != null && r.includes(d)),
            ),
            right: ((A = s == null ? void 0 : s.right) != null ? A : []).filter(
              (d) => !(r != null && r.includes(d)),
            ),
          };
        });
      }),
        (e.getCanPin = () =>
          e.getLeafColumns().some((r) => {
            var s, o, A;
            return (
              ((s = r.columnDef.enablePinning) != null ? s : !0) &&
              ((o = (A = t.options.enableColumnPinning) != null ? A : t.options.enablePinning) !=
              null
                ? o
                : !0)
            );
          })),
        (e.getIsPinned = () => {
          const n = e.getLeafColumns().map((l) => l.id),
            { left: r, right: s } = t.getState().columnPinning,
            o = n.some((l) => (r == null ? void 0 : r.includes(l))),
            A = n.some((l) => (s == null ? void 0 : s.includes(l)));
          return o ? "left" : A ? "right" : !1;
        }),
        (e.getPinnedIndex = () => {
          var n, r;
          const s = e.getIsPinned();
          return s
            ? (n =
                (r = t.getState().columnPinning) == null || (r = r[s]) == null
                  ? void 0
                  : r.indexOf(e.id)) != null
              ? n
              : -1
            : 0;
        });
    },
    createRow: (e, t) => {
      (e.pin = (n, r, s) => {
        const o = r
            ? e.getLeafRows().map((a) => {
                let { id: c } = a;
                return c;
              })
            : [],
          A = s
            ? e.getParentRows().map((a) => {
                let { id: c } = a;
                return c;
              })
            : [],
          l = new Set([...A, e.id, ...o]);
        t.setRowPinning((a) => {
          var c, u;
          if (n === "bottom") {
            var d, g;
            return {
              top: ((d = a == null ? void 0 : a.top) != null ? d : []).filter(
                (m) => !(l != null && l.has(m)),
              ),
              bottom: [
                ...((g = a == null ? void 0 : a.bottom) != null ? g : []).filter(
                  (m) => !(l != null && l.has(m)),
                ),
                ...Array.from(l),
              ],
            };
          }
          if (n === "top") {
            var f, h;
            return {
              top: [
                ...((f = a == null ? void 0 : a.top) != null ? f : []).filter(
                  (m) => !(l != null && l.has(m)),
                ),
                ...Array.from(l),
              ],
              bottom: ((h = a == null ? void 0 : a.bottom) != null ? h : []).filter(
                (m) => !(l != null && l.has(m)),
              ),
            };
          }
          return {
            top: ((c = a == null ? void 0 : a.top) != null ? c : []).filter(
              (m) => !(l != null && l.has(m)),
            ),
            bottom: ((u = a == null ? void 0 : a.bottom) != null ? u : []).filter(
              (m) => !(l != null && l.has(m)),
            ),
          };
        });
      }),
        (e.getCanPin = () => {
          var n;
          const { enableRowPinning: r, enablePinning: s } = t.options;
          return typeof r == "function" ? r(e) : (n = r ?? s) != null ? n : !0;
        }),
        (e.getIsPinned = () => {
          const n = [e.id],
            { top: r, bottom: s } = t.getState().rowPinning,
            o = n.some((l) => (r == null ? void 0 : r.includes(l))),
            A = n.some((l) => (s == null ? void 0 : s.includes(l)));
          return o ? "top" : A ? "bottom" : !1;
        }),
        (e.getPinnedIndex = () => {
          var n, r;
          const s = e.getIsPinned();
          if (!s) return -1;
          const o =
            (n = t._getPinnedRows(s)) == null
              ? void 0
              : n.map((A) => {
                  let { id: l } = A;
                  return l;
                });
          return (r = o == null ? void 0 : o.indexOf(e.id)) != null ? r : -1;
        }),
        (e.getCenterVisibleCells = C(
          () => [
            e._getAllVisibleCells(),
            t.getState().columnPinning.left,
            t.getState().columnPinning.right,
          ],
          (n, r, s) => {
            const o = [...(r ?? []), ...(s ?? [])];
            return n.filter((A) => !o.includes(A.column.id));
          },
          F(t.options, "debugRows"),
        )),
        (e.getLeftVisibleCells = C(
          () => [e._getAllVisibleCells(), t.getState().columnPinning.left, ,],
          (n, r) =>
            (r ?? [])
              .map((o) => n.find((A) => A.column.id === o))
              .filter(Boolean)
              .map((o) => ({ ...o, position: "left" })),
          F(t.options, "debugRows"),
        )),
        (e.getRightVisibleCells = C(
          () => [e._getAllVisibleCells(), t.getState().columnPinning.right],
          (n, r) =>
            (r ?? [])
              .map((o) => n.find((A) => A.column.id === o))
              .filter(Boolean)
              .map((o) => ({ ...o, position: "right" })),
          F(t.options, "debugRows"),
        ));
    },
    createTable: (e) => {
      (e.setColumnPinning = (t) =>
        e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t)),
        (e.resetColumnPinning = (t) => {
          var n, r;
          return e.setColumnPinning(
            t
              ? fn()
              : (n = (r = e.initialState) == null ? void 0 : r.columnPinning) != null
                ? n
                : fn(),
          );
        }),
        (e.getIsSomeColumnsPinned = (t) => {
          var n;
          const r = e.getState().columnPinning;
          if (!t) {
            var s, o;
            return !!(((s = r.left) != null && s.length) || ((o = r.right) != null && o.length));
          }
          return !!((n = r[t]) != null && n.length);
        }),
        (e.getLeftLeafColumns = C(
          () => [e.getAllLeafColumns(), e.getState().columnPinning.left],
          (t, n) => (n ?? []).map((r) => t.find((s) => s.id === r)).filter(Boolean),
          F(e.options, "debugColumns"),
        )),
        (e.getRightLeafColumns = C(
          () => [e.getAllLeafColumns(), e.getState().columnPinning.right],
          (t, n) => (n ?? []).map((r) => t.find((s) => s.id === r)).filter(Boolean),
          F(e.options, "debugColumns"),
        )),
        (e.getCenterLeafColumns = C(
          () => [
            e.getAllLeafColumns(),
            e.getState().columnPinning.left,
            e.getState().columnPinning.right,
          ],
          (t, n, r) => {
            const s = [...(n ?? []), ...(r ?? [])];
            return t.filter((o) => !s.includes(o.id));
          },
          F(e.options, "debugColumns"),
        )),
        (e.setRowPinning = (t) =>
          e.options.onRowPinningChange == null ? void 0 : e.options.onRowPinningChange(t)),
        (e.resetRowPinning = (t) => {
          var n, r;
          return e.setRowPinning(
            t
              ? gn()
              : (n = (r = e.initialState) == null ? void 0 : r.rowPinning) != null
                ? n
                : gn(),
          );
        }),
        (e.getIsSomeRowsPinned = (t) => {
          var n;
          const r = e.getState().rowPinning;
          if (!t) {
            var s, o;
            return !!(((s = r.top) != null && s.length) || ((o = r.bottom) != null && o.length));
          }
          return !!((n = r[t]) != null && n.length);
        }),
        (e._getPinnedRows = C(
          (t) => [e.getRowModel().rows, e.getState().rowPinning[t], t],
          (t, n, r) => {
            var s;
            return (
              (s = e.options.keepPinnedRows) == null || s
                ? (n ?? []).map((A) => {
                    const l = e.getRow(A, !0);
                    return l.getIsAllParentsExpanded() ? l : null;
                  })
                : (n ?? []).map((A) => t.find((l) => l.id === A))
            )
              .filter(Boolean)
              .map((A) => ({ ...A, position: r }));
          },
          F(e.options, "debugRows"),
        )),
        (e.getTopRows = () => e._getPinnedRows("top")),
        (e.getBottomRows = () => e._getPinnedRows("bottom")),
        (e.getCenterRows = C(
          () => [e.getRowModel().rows, e.getState().rowPinning.top, e.getState().rowPinning.bottom],
          (t, n, r) => {
            const s = new Set([...(n ?? []), ...(r ?? [])]);
            return t.filter((o) => !s.has(o.id));
          },
          F(e.options, "debugRows"),
        ));
    },
  },
  TA = {
    getInitialState: (e) => ({ rowSelection: {}, ...e }),
    getDefaultOptions: (e) => ({
      onRowSelectionChange: ue("rowSelection", e),
      enableRowSelection: !0,
      enableMultiRowSelection: !0,
      enableSubRowSelection: !0,
    }),
    createTable: (e) => {
      (e.setRowSelection = (t) =>
        e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t)),
        (e.resetRowSelection = (t) => {
          var n;
          return e.setRowSelection(t ? {} : (n = e.initialState.rowSelection) != null ? n : {});
        }),
        (e.toggleAllRowsSelected = (t) => {
          e.setRowSelection((n) => {
            t = typeof t < "u" ? t : !e.getIsAllRowsSelected();
            const r = { ...n },
              s = e.getPreGroupedRowModel().flatRows;
            return (
              t
                ? s.forEach((o) => {
                    o.getCanSelect() && (r[o.id] = !0);
                  })
                : s.forEach((o) => {
                    delete r[o.id];
                  }),
              r
            );
          });
        }),
        (e.toggleAllPageRowsSelected = (t) =>
          e.setRowSelection((n) => {
            const r = typeof t < "u" ? t : !e.getIsAllPageRowsSelected(),
              s = { ...n };
            return (
              e.getRowModel().rows.forEach((o) => {
                Rn(s, o.id, r, !0, e);
              }),
              s
            );
          })),
        (e.getPreSelectedRowModel = () => e.getCoreRowModel()),
        (e.getSelectedRowModel = C(
          () => [e.getState().rowSelection, e.getCoreRowModel()],
          (t, n) => (Object.keys(t).length ? hn(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          F(e.options, "debugTable"),
        )),
        (e.getFilteredSelectedRowModel = C(
          () => [e.getState().rowSelection, e.getFilteredRowModel()],
          (t, n) => (Object.keys(t).length ? hn(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          F(e.options, "debugTable"),
        )),
        (e.getGroupedSelectedRowModel = C(
          () => [e.getState().rowSelection, e.getSortedRowModel()],
          (t, n) => (Object.keys(t).length ? hn(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          F(e.options, "debugTable"),
        )),
        (e.getIsAllRowsSelected = () => {
          const t = e.getFilteredRowModel().flatRows,
            { rowSelection: n } = e.getState();
          let r = !!(t.length && Object.keys(n).length);
          return r && t.some((s) => s.getCanSelect() && !n[s.id]) && (r = !1), r;
        }),
        (e.getIsAllPageRowsSelected = () => {
          const t = e.getPaginationRowModel().flatRows.filter((s) => s.getCanSelect()),
            { rowSelection: n } = e.getState();
          let r = !!t.length;
          return r && t.some((s) => !n[s.id]) && (r = !1), r;
        }),
        (e.getIsSomeRowsSelected = () => {
          var t;
          const n = Object.keys((t = e.getState().rowSelection) != null ? t : {}).length;
          return n > 0 && n < e.getFilteredRowModel().flatRows.length;
        }),
        (e.getIsSomePageRowsSelected = () => {
          const t = e.getPaginationRowModel().flatRows;
          return e.getIsAllPageRowsSelected()
            ? !1
            : t
                .filter((n) => n.getCanSelect())
                .some((n) => n.getIsSelected() || n.getIsSomeSelected());
        }),
        (e.getToggleAllRowsSelectedHandler = () => (t) => {
          e.toggleAllRowsSelected(t.target.checked);
        }),
        (e.getToggleAllPageRowsSelectedHandler = () => (t) => {
          e.toggleAllPageRowsSelected(t.target.checked);
        });
    },
    createRow: (e, t) => {
      (e.toggleSelected = (n, r) => {
        const s = e.getIsSelected();
        t.setRowSelection((o) => {
          var A;
          if (((n = typeof n < "u" ? n : !s), e.getCanSelect() && s === n)) return o;
          const l = { ...o };
          return Rn(l, e.id, n, (A = r == null ? void 0 : r.selectChildren) != null ? A : !0, t), l;
        });
      }),
        (e.getIsSelected = () => {
          const { rowSelection: n } = t.getState();
          return Jn(e, n);
        }),
        (e.getIsSomeSelected = () => {
          const { rowSelection: n } = t.getState();
          return bn(e, n) === "some";
        }),
        (e.getIsAllSubRowsSelected = () => {
          const { rowSelection: n } = t.getState();
          return bn(e, n) === "all";
        }),
        (e.getCanSelect = () => {
          var n;
          return typeof t.options.enableRowSelection == "function"
            ? t.options.enableRowSelection(e)
            : (n = t.options.enableRowSelection) != null
              ? n
              : !0;
        }),
        (e.getCanSelectSubRows = () => {
          var n;
          return typeof t.options.enableSubRowSelection == "function"
            ? t.options.enableSubRowSelection(e)
            : (n = t.options.enableSubRowSelection) != null
              ? n
              : !0;
        }),
        (e.getCanMultiSelect = () => {
          var n;
          return typeof t.options.enableMultiRowSelection == "function"
            ? t.options.enableMultiRowSelection(e)
            : (n = t.options.enableMultiRowSelection) != null
              ? n
              : !0;
        }),
        (e.getToggleSelectedHandler = () => {
          const n = e.getCanSelect();
          return (r) => {
            var s;
            n && e.toggleSelected((s = r.target) == null ? void 0 : s.checked);
          };
        });
    },
  },
  Rn = (e, t, n, r, s) => {
    var o;
    const A = s.getRow(t, !0);
    n
      ? (A.getCanMultiSelect() || Object.keys(e).forEach((l) => delete e[l]),
        A.getCanSelect() && (e[t] = !0))
      : delete e[t],
      r &&
        (o = A.subRows) != null &&
        o.length &&
        A.getCanSelectSubRows() &&
        A.subRows.forEach((l) => Rn(e, l.id, n, r, s));
  };
function hn(e, t) {
  const n = e.getState().rowSelection,
    r = [],
    s = {},
    o = function (A, l) {
      return A.map((a) => {
        var c;
        const u = Jn(a, n);
        if (
          (u && (r.push(a), (s[a.id] = a)),
          (c = a.subRows) != null && c.length && (a = { ...a, subRows: o(a.subRows) }),
          u)
        )
          return a;
      }).filter(Boolean);
    };
  return { rows: o(t.rows), flatRows: r, rowsById: s };
}
function Jn(e, t) {
  var n;
  return (n = t[e.id]) != null ? n : !1;
}
function bn(e, t, n) {
  var r;
  if (!((r = e.subRows) != null && r.length)) return !1;
  let s = !0,
    o = !1;
  return (
    e.subRows.forEach((A) => {
      if (
        !(o && !s) &&
        (A.getCanSelect() && (Jn(A, t) ? (o = !0) : (s = !1)), A.subRows && A.subRows.length)
      ) {
        const l = bn(A, t);
        l === "all" ? (o = !0) : (l === "some" && (o = !0), (s = !1));
      }
    }),
    s ? "all" : o ? "some" : !1
  );
}
const En = /([0-9]+)/gm,
  DA = (e, t, n) => fi(ke(e.getValue(n)).toLowerCase(), ke(t.getValue(n)).toLowerCase()),
  kA = (e, t, n) => fi(ke(e.getValue(n)), ke(t.getValue(n))),
  BA = (e, t, n) => Kn(ke(e.getValue(n)).toLowerCase(), ke(t.getValue(n)).toLowerCase()),
  PA = (e, t, n) => Kn(ke(e.getValue(n)), ke(t.getValue(n))),
  MA = (e, t, n) => {
    const r = e.getValue(n),
      s = t.getValue(n);
    return r > s ? 1 : r < s ? -1 : 0;
  },
  VA = (e, t, n) => Kn(e.getValue(n), t.getValue(n));
function Kn(e, t) {
  return e === t ? 0 : e > t ? 1 : -1;
}
function ke(e) {
  return typeof e == "number"
    ? isNaN(e) || e === 1 / 0 || e === -1 / 0
      ? ""
      : String(e)
    : typeof e == "string"
      ? e
      : "";
}
function fi(e, t) {
  const n = e.split(En).filter(Boolean),
    r = t.split(En).filter(Boolean);
  for (; n.length && r.length; ) {
    const s = n.shift(),
      o = r.shift(),
      A = parseInt(s, 10),
      l = parseInt(o, 10),
      a = [A, l].sort();
    if (isNaN(a[0])) {
      if (s > o) return 1;
      if (o > s) return -1;
      continue;
    }
    if (isNaN(a[1])) return isNaN(A) ? -1 : 1;
    if (A > l) return 1;
    if (l > A) return -1;
  }
  return n.length - r.length;
}
const ot = {
    alphanumeric: DA,
    alphanumericCaseSensitive: kA,
    text: BA,
    textCaseSensitive: PA,
    datetime: MA,
    basic: VA,
  },
  LA = {
    getInitialState: (e) => ({ sorting: [], ...e }),
    getDefaultColumnDef: () => ({ sortingFn: "auto", sortUndefined: 1 }),
    getDefaultOptions: (e) => ({
      onSortingChange: ue("sorting", e),
      isMultiSortEvent: (t) => t.shiftKey,
    }),
    createColumn: (e, t) => {
      (e.getAutoSortingFn = () => {
        const n = t.getFilteredRowModel().flatRows.slice(10);
        let r = !1;
        for (const s of n) {
          const o = s == null ? void 0 : s.getValue(e.id);
          if (Object.prototype.toString.call(o) === "[object Date]") return ot.datetime;
          if (typeof o == "string" && ((r = !0), o.split(En).length > 1)) return ot.alphanumeric;
        }
        return r ? ot.text : ot.basic;
      }),
        (e.getAutoSortDir = () => {
          const n = t.getFilteredRowModel().flatRows[0];
          return typeof (n == null ? void 0 : n.getValue(e.id)) == "string" ? "asc" : "desc";
        }),
        (e.getSortingFn = () => {
          var n, r;
          if (!e) throw new Error();
          return _t(e.columnDef.sortingFn)
            ? e.columnDef.sortingFn
            : e.columnDef.sortingFn === "auto"
              ? e.getAutoSortingFn()
              : (n = (r = t.options.sortingFns) == null ? void 0 : r[e.columnDef.sortingFn]) != null
                ? n
                : ot[e.columnDef.sortingFn];
        }),
        (e.toggleSorting = (n, r) => {
          const s = e.getNextSortingOrder(),
            o = typeof n < "u" && n !== null;
          t.setSorting((A) => {
            const l = A == null ? void 0 : A.find((f) => f.id === e.id),
              a = A == null ? void 0 : A.findIndex((f) => f.id === e.id);
            let c = [],
              u,
              d = o ? n : s === "desc";
            if (
              (A != null && A.length && e.getCanMultiSort() && r
                ? l
                  ? (u = "toggle")
                  : (u = "add")
                : A != null && A.length && a !== A.length - 1
                  ? (u = "replace")
                  : l
                    ? (u = "toggle")
                    : (u = "replace"),
              u === "toggle" && (o || s || (u = "remove")),
              u === "add")
            ) {
              var g;
              (c = [...A, { id: e.id, desc: d }]),
                c.splice(
                  0,
                  c.length -
                    ((g = t.options.maxMultiSortColCount) != null ? g : Number.MAX_SAFE_INTEGER),
                );
            } else
              u === "toggle"
                ? (c = A.map((f) => (f.id === e.id ? { ...f, desc: d } : f)))
                : u === "remove"
                  ? (c = A.filter((f) => f.id !== e.id))
                  : (c = [{ id: e.id, desc: d }]);
            return c;
          });
        }),
        (e.getFirstSortDir = () => {
          var n, r;
          return (
            (n = (r = e.columnDef.sortDescFirst) != null ? r : t.options.sortDescFirst) != null
              ? n
              : e.getAutoSortDir() === "desc"
          )
            ? "desc"
            : "asc";
        }),
        (e.getNextSortingOrder = (n) => {
          var r, s;
          const o = e.getFirstSortDir(),
            A = e.getIsSorted();
          return A
            ? A !== o &&
              ((r = t.options.enableSortingRemoval) == null || r) &&
              (!(n && (s = t.options.enableMultiRemove) != null) || s)
              ? !1
              : A === "desc"
                ? "asc"
                : "desc"
            : o;
        }),
        (e.getCanSort = () => {
          var n, r;
          return (
            ((n = e.columnDef.enableSorting) != null ? n : !0) &&
            ((r = t.options.enableSorting) != null ? r : !0) &&
            !!e.accessorFn
          );
        }),
        (e.getCanMultiSort = () => {
          var n, r;
          return (n = (r = e.columnDef.enableMultiSort) != null ? r : t.options.enableMultiSort) !=
            null
            ? n
            : !!e.accessorFn;
        }),
        (e.getIsSorted = () => {
          var n;
          const r = (n = t.getState().sorting) == null ? void 0 : n.find((s) => s.id === e.id);
          return r ? (r.desc ? "desc" : "asc") : !1;
        }),
        (e.getSortIndex = () => {
          var n, r;
          return (n =
            (r = t.getState().sorting) == null ? void 0 : r.findIndex((s) => s.id === e.id)) != null
            ? n
            : -1;
        }),
        (e.clearSorting = () => {
          t.setSorting((n) => (n != null && n.length ? n.filter((r) => r.id !== e.id) : []));
        }),
        (e.getToggleSortingHandler = () => {
          const n = e.getCanSort();
          return (r) => {
            n &&
              (r.persist == null || r.persist(),
              e.toggleSorting == null ||
                e.toggleSorting(
                  void 0,
                  e.getCanMultiSort()
                    ? t.options.isMultiSortEvent == null
                      ? void 0
                      : t.options.isMultiSortEvent(r)
                    : !1,
                ));
          };
        });
    },
    createTable: (e) => {
      (e.setSorting = (t) =>
        e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t)),
        (e.resetSorting = (t) => {
          var n, r;
          e.setSorting(
            t ? [] : (n = (r = e.initialState) == null ? void 0 : r.sorting) != null ? n : [],
          );
        }),
        (e.getPreSortedRowModel = () => e.getGroupedRowModel()),
        (e.getSortedRowModel = () => (
          !e._getSortedRowModel &&
            e.options.getSortedRowModel &&
            (e._getSortedRowModel = e.options.getSortedRowModel(e)),
          e.options.manualSorting || !e._getSortedRowModel
            ? e.getPreSortedRowModel()
            : e._getSortedRowModel()
        ));
    },
  },
  HA = {
    getInitialState: (e) => ({ columnVisibility: {}, ...e }),
    getDefaultOptions: (e) => ({ onColumnVisibilityChange: ue("columnVisibility", e) }),
    createColumn: (e, t) => {
      (e.toggleVisibility = (n) => {
        e.getCanHide() && t.setColumnVisibility((r) => ({ ...r, [e.id]: n ?? !e.getIsVisible() }));
      }),
        (e.getIsVisible = () => {
          var n, r;
          return (n = (r = t.getState().columnVisibility) == null ? void 0 : r[e.id]) != null
            ? n
            : !0;
        }),
        (e.getCanHide = () => {
          var n, r;
          return (
            ((n = e.columnDef.enableHiding) != null ? n : !0) &&
            ((r = t.options.enableHiding) != null ? r : !0)
          );
        }),
        (e.getToggleVisibilityHandler = () => (n) => {
          e.toggleVisibility == null || e.toggleVisibility(n.target.checked);
        });
    },
    createRow: (e, t) => {
      (e._getAllVisibleCells = C(
        () => [e.getAllCells(), t.getState().columnVisibility],
        (n) => n.filter((r) => r.column.getIsVisible()),
        F(t.options, "debugRows"),
      )),
        (e.getVisibleCells = C(
          () => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()],
          (n, r, s) => [...n, ...r, ...s],
          F(t.options, "debugRows"),
        ));
    },
    createTable: (e) => {
      const t = (n, r) =>
        C(
          () => [
            r(),
            r()
              .filter((s) => s.getIsVisible())
              .map((s) => s.id)
              .join("_"),
          ],
          (s) => s.filter((o) => (o.getIsVisible == null ? void 0 : o.getIsVisible())),
          F(e.options, "debugColumns"),
        );
      (e.getVisibleFlatColumns = t("getVisibleFlatColumns", () => e.getAllFlatColumns())),
        (e.getVisibleLeafColumns = t("getVisibleLeafColumns", () => e.getAllLeafColumns())),
        (e.getLeftVisibleLeafColumns = t("getLeftVisibleLeafColumns", () =>
          e.getLeftLeafColumns(),
        )),
        (e.getRightVisibleLeafColumns = t("getRightVisibleLeafColumns", () =>
          e.getRightLeafColumns(),
        )),
        (e.getCenterVisibleLeafColumns = t("getCenterVisibleLeafColumns", () =>
          e.getCenterLeafColumns(),
        )),
        (e.setColumnVisibility = (n) =>
          e.options.onColumnVisibilityChange == null
            ? void 0
            : e.options.onColumnVisibilityChange(n)),
        (e.resetColumnVisibility = (n) => {
          var r;
          e.setColumnVisibility(n ? {} : (r = e.initialState.columnVisibility) != null ? r : {});
        }),
        (e.toggleAllColumnsVisible = (n) => {
          var r;
          (n = (r = n) != null ? r : !e.getIsAllColumnsVisible()),
            e.setColumnVisibility(
              e
                .getAllLeafColumns()
                .reduce(
                  (s, o) => ({ ...s, [o.id]: n || !(o.getCanHide != null && o.getCanHide()) }),
                  {},
                ),
            );
        }),
        (e.getIsAllColumnsVisible = () =>
          !e.getAllLeafColumns().some((n) => !(n.getIsVisible != null && n.getIsVisible()))),
        (e.getIsSomeColumnsVisible = () =>
          e.getAllLeafColumns().some((n) => (n.getIsVisible == null ? void 0 : n.getIsVisible()))),
        (e.getToggleAllColumnsVisibilityHandler = () => (n) => {
          var r;
          e.toggleAllColumnsVisible((r = n.target) == null ? void 0 : r.checked);
        });
    },
  };
function gt(e, t) {
  return t
    ? t === "center"
      ? e.getCenterVisibleLeafColumns()
      : t === "left"
        ? e.getLeftVisibleLeafColumns()
        : e.getRightVisibleLeafColumns()
    : e.getVisibleLeafColumns();
}
const gs = [fA, HA, NA, IA, pA, LA, bA, mA, OA, TA, gA];
function UA(e) {
  var t;
  (e.debugAll || e.debugTable) && console.info("Creating Table Instance...");
  let n = { _features: gs };
  const r = n._features.reduce(
      (u, d) => Object.assign(u, d.getDefaultOptions == null ? void 0 : d.getDefaultOptions(n)),
      {},
    ),
    s = (u) => (n.options.mergeOptions ? n.options.mergeOptions(r, u) : { ...r, ...u });
  let A = { ...{}, ...((t = e.initialState) != null ? t : {}) };
  n._features.forEach((u) => {
    var d;
    A = (d = u.getInitialState == null ? void 0 : u.getInitialState(A)) != null ? d : A;
  });
  const l = [];
  let a = !1;
  const c = {
    _features: gs,
    options: { ...r, ...e },
    initialState: A,
    _queue: (u) => {
      l.push(u),
        a ||
          ((a = !0),
          Promise.resolve()
            .then(() => {
              for (; l.length; ) l.shift()();
              a = !1;
            })
            .catch((d) =>
              setTimeout(() => {
                throw d;
              }),
            ));
    },
    reset: () => {
      n.setState(n.initialState);
    },
    setOptions: (u) => {
      const d = Ie(u, n.options);
      n.options = s(d);
    },
    getState: () => n.options.state,
    setState: (u) => {
      n.options.onStateChange == null || n.options.onStateChange(u);
    },
    _getRowId: (u, d, g) => {
      var f;
      return (f = n.options.getRowId == null ? void 0 : n.options.getRowId(u, d, g)) != null
        ? f
        : `${g ? [g.id, d].join(".") : d}`;
    },
    getCoreRowModel: () => (
      n._getCoreRowModel || (n._getCoreRowModel = n.options.getCoreRowModel(n)),
      n._getCoreRowModel()
    ),
    getRowModel: () => n.getPaginationRowModel(),
    getRow: (u, d) => {
      let g = (d ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[u];
      if (!g && ((g = n.getCoreRowModel().rowsById[u]), !g)) throw new Error();
      return g;
    },
    _getDefaultColumnDef: C(
      () => [n.options.defaultColumn],
      (u) => {
        var d;
        return (
          (u = (d = u) != null ? d : {}),
          {
            header: (g) => {
              const f = g.header.column.columnDef;
              return f.accessorKey ? f.accessorKey : f.accessorFn ? f.id : null;
            },
            cell: (g) => {
              var f, h;
              return (f =
                (h = g.renderValue()) == null || h.toString == null ? void 0 : h.toString()) != null
                ? f
                : null;
            },
            ...n._features.reduce(
              (g, f) =>
                Object.assign(g, f.getDefaultColumnDef == null ? void 0 : f.getDefaultColumnDef()),
              {},
            ),
            ...u,
          }
        );
      },
      F(e, "debugColumns"),
    ),
    _getColumnDefs: () => n.options.columns,
    getAllColumns: C(
      () => [n._getColumnDefs()],
      (u) => {
        const d = function (g, f, h) {
          return (
            h === void 0 && (h = 0),
            g.map((m) => {
              const x = dA(n, m, h, f),
                j = m;
              return (x.columns = j.columns ? d(j.columns, x, h + 1) : []), x;
            })
          );
        };
        return d(u);
      },
      F(e, "debugColumns"),
    ),
    getAllFlatColumns: C(
      () => [n.getAllColumns()],
      (u) => u.flatMap((d) => d.getFlatColumns()),
      F(e, "debugColumns"),
    ),
    _getAllFlatColumnsById: C(
      () => [n.getAllFlatColumns()],
      (u) => u.reduce((d, g) => ((d[g.id] = g), d), {}),
      F(e, "debugColumns"),
    ),
    getAllLeafColumns: C(
      () => [n.getAllColumns(), n._getOrderColumnsFn()],
      (u, d) => {
        let g = u.flatMap((f) => f.getLeafColumns());
        return d(g);
      },
      F(e, "debugColumns"),
    ),
    getColumn: (u) => n._getAllFlatColumnsById()[u],
  };
  Object.assign(n, c);
  for (let u = 0; u < n._features.length; u++) {
    const d = n._features[u];
    d == null || d.createTable == null || d.createTable(n);
  }
  return n;
}
function _A(e, t, n, r) {
  const s = () => {
      var A;
      return (A = o.getValue()) != null ? A : e.options.renderFallbackValue;
    },
    o = {
      id: `${t.id}_${n.id}`,
      row: t,
      column: n,
      getValue: () => t.getValue(r),
      renderValue: s,
      getContext: C(
        () => [e, n, t, o],
        (A, l, a, c) => ({
          table: A,
          column: l,
          row: a,
          cell: c,
          getValue: c.getValue,
          renderValue: c.renderValue,
        }),
        F(e.options, "debugCells"),
      ),
    };
  return (
    e._features.forEach((A) => {
      A.createCell == null || A.createCell(o, n, t, e);
    }, {}),
    o
  );
}
const Qn = (e, t, n, r, s, o, A) => {
  let l = {
    id: t,
    index: r,
    original: n,
    depth: s,
    parentId: A,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (a) => {
      if (l._valuesCache.hasOwnProperty(a)) return l._valuesCache[a];
      const c = e.getColumn(a);
      if (c != null && c.accessorFn)
        return (l._valuesCache[a] = c.accessorFn(l.original, r)), l._valuesCache[a];
    },
    getUniqueValues: (a) => {
      if (l._uniqueValuesCache.hasOwnProperty(a)) return l._uniqueValuesCache[a];
      const c = e.getColumn(a);
      if (c != null && c.accessorFn)
        return c.columnDef.getUniqueValues
          ? ((l._uniqueValuesCache[a] = c.columnDef.getUniqueValues(l.original, r)),
            l._uniqueValuesCache[a])
          : ((l._uniqueValuesCache[a] = [l.getValue(a)]), l._uniqueValuesCache[a]);
    },
    renderValue: (a) => {
      var c;
      return (c = l.getValue(a)) != null ? c : e.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () => uA(l.subRows, (a) => a.subRows),
    getParentRow: () => (l.parentId ? e.getRow(l.parentId, !0) : void 0),
    getParentRows: () => {
      let a = [],
        c = l;
      for (;;) {
        const u = c.getParentRow();
        if (!u) break;
        a.push(u), (c = u);
      }
      return a.reverse();
    },
    getAllCells: C(
      () => [e.getAllLeafColumns()],
      (a) => a.map((c) => _A(e, l, c, c.id)),
      F(e.options, "debugRows"),
    ),
    _getAllCellsByColumnId: C(
      () => [l.getAllCells()],
      (a) => a.reduce((c, u) => ((c[u.column.id] = u), c), {}),
      F(e.options, "debugRows"),
    ),
  };
  for (let a = 0; a < e._features.length; a++) {
    const c = e._features[a];
    c == null || c.createRow == null || c.createRow(l, e);
  }
  return l;
};
function Z() {
  return {
    accessor: (e, t) =>
      typeof e == "function" ? { ...t, accessorFn: e } : { ...t, accessorKey: e },
    display: (e) => e,
    group: (e) => e,
  };
}
function qA() {
  return (e) =>
    C(
      () => [e.options.data],
      (t) => {
        const n = { rows: [], flatRows: [], rowsById: {} },
          r = function (s, o, A) {
            o === void 0 && (o = 0);
            const l = [];
            for (let c = 0; c < s.length; c++) {
              const u = Qn(
                e,
                e._getRowId(s[c], c, A),
                s[c],
                c,
                o,
                void 0,
                A == null ? void 0 : A.id,
              );
              if ((n.flatRows.push(u), (n.rowsById[u.id] = u), l.push(u), e.options.getSubRows)) {
                var a;
                (u.originalSubRows = e.options.getSubRows(s[c], c)),
                  (a = u.originalSubRows) != null &&
                    a.length &&
                    (u.subRows = r(u.originalSubRows, o + 1, u));
              }
            }
            return l;
          };
        return (n.rows = r(t)), n;
      },
      F(e.options, "debugTable", "getRowModel", () => e._autoResetPageIndex()),
    );
}
function gi(e, t, n) {
  return n.options.filterFromLeafRows ? zA(e, t, n) : WA(e, t, n);
}
function zA(e, t, n) {
  var r;
  const s = [],
    o = {},
    A = (r = n.options.maxLeafRowFilterDepth) != null ? r : 100,
    l = function (a, c) {
      c === void 0 && (c = 0);
      const u = [];
      for (let g = 0; g < a.length; g++) {
        var d;
        let f = a[g];
        const h = Qn(n, f.id, f.original, f.index, f.depth, void 0, f.parentId);
        if (((h.columnFilters = f.columnFilters), (d = f.subRows) != null && d.length && c < A)) {
          if (((h.subRows = l(f.subRows, c + 1)), (f = h), t(f) && !h.subRows.length)) {
            u.push(f), (o[f.id] = f), s.push(f);
            continue;
          }
          if (t(f) || h.subRows.length) {
            u.push(f), (o[f.id] = f), s.push(f);
            continue;
          }
        } else (f = h), t(f) && (u.push(f), (o[f.id] = f), s.push(f));
      }
      return u;
    };
  return { rows: l(e), flatRows: s, rowsById: o };
}
function WA(e, t, n) {
  var r;
  const s = [],
    o = {},
    A = (r = n.options.maxLeafRowFilterDepth) != null ? r : 100,
    l = function (a, c) {
      c === void 0 && (c = 0);
      const u = [];
      for (let g = 0; g < a.length; g++) {
        let f = a[g];
        if (t(f)) {
          var d;
          if ((d = f.subRows) != null && d.length && c < A) {
            const m = Qn(n, f.id, f.original, f.index, f.depth, void 0, f.parentId);
            (m.subRows = l(f.subRows, c + 1)), (f = m);
          }
          u.push(f), s.push(f), (o[f.id] = f);
        }
      }
      return u;
    };
  return { rows: l(e), flatRows: s, rowsById: o };
}
function GA() {
  return (e) =>
    C(
      () => [e.getPreFilteredRowModel(), e.getState().columnFilters, e.getState().globalFilter],
      (t, n, r) => {
        if (!t.rows.length || (!(n != null && n.length) && !r)) {
          for (let g = 0; g < t.flatRows.length; g++)
            (t.flatRows[g].columnFilters = {}), (t.flatRows[g].columnFiltersMeta = {});
          return t;
        }
        const s = [],
          o = [];
        (n ?? []).forEach((g) => {
          var f;
          const h = e.getColumn(g.id);
          if (!h) return;
          const m = h.getFilterFn();
          m &&
            s.push({
              id: g.id,
              filterFn: m,
              resolvedValue:
                (f = m.resolveFilterValue == null ? void 0 : m.resolveFilterValue(g.value)) != null
                  ? f
                  : g.value,
            });
        });
        const A = n.map((g) => g.id),
          l = e.getGlobalFilterFn(),
          a = e.getAllLeafColumns().filter((g) => g.getCanGlobalFilter());
        r &&
          l &&
          a.length &&
          (A.push("__global__"),
          a.forEach((g) => {
            var f;
            o.push({
              id: g.id,
              filterFn: l,
              resolvedValue:
                (f = l.resolveFilterValue == null ? void 0 : l.resolveFilterValue(r)) != null
                  ? f
                  : r,
            });
          }));
        let c, u;
        for (let g = 0; g < t.flatRows.length; g++) {
          const f = t.flatRows[g];
          if (((f.columnFilters = {}), s.length))
            for (let h = 0; h < s.length; h++) {
              c = s[h];
              const m = c.id;
              f.columnFilters[m] = c.filterFn(f, m, c.resolvedValue, (x) => {
                f.columnFiltersMeta[m] = x;
              });
            }
          if (o.length) {
            for (let h = 0; h < o.length; h++) {
              u = o[h];
              const m = u.id;
              if (
                u.filterFn(f, m, u.resolvedValue, (x) => {
                  f.columnFiltersMeta[m] = x;
                })
              ) {
                f.columnFilters.__global__ = !0;
                break;
              }
            }
            f.columnFilters.__global__ !== !0 && (f.columnFilters.__global__ = !1);
          }
        }
        const d = (g) => {
          for (let f = 0; f < A.length; f++) if (g.columnFilters[A[f]] === !1) return !1;
          return !0;
        };
        return gi(t.rows, d, e);
      },
      F(e.options, "debugTable", "getFilteredRowModel", () => e._autoResetPageIndex()),
    );
}
function YA() {
  return (e, t) =>
    C(
      () => [
        e.getPreFilteredRowModel(),
        e.getState().columnFilters,
        e.getState().globalFilter,
        e.getFilteredRowModel(),
      ],
      (n, r, s) => {
        if (!n.rows.length || (!(r != null && r.length) && !s)) return n;
        const o = [...r.map((l) => l.id).filter((l) => l !== t), s ? "__global__" : void 0].filter(
            Boolean,
          ),
          A = (l) => {
            for (let a = 0; a < o.length; a++) if (l.columnFilters[o[a]] === !1) return !1;
            return !0;
          };
        return gi(n.rows, A, e);
      },
      F(e.options, "debugTable"),
    );
}
function JA() {
  return (e, t) =>
    C(
      () => {
        var n;
        return [(n = e.getColumn(t)) == null ? void 0 : n.getFacetedRowModel()];
      },
      (n) => {
        if (!n) return new Map();
        let r = new Map();
        for (let o = 0; o < n.flatRows.length; o++) {
          const A = n.flatRows[o].getUniqueValues(t);
          for (let l = 0; l < A.length; l++) {
            const a = A[l];
            if (r.has(a)) {
              var s;
              r.set(a, ((s = r.get(a)) != null ? s : 0) + 1);
            } else r.set(a, 1);
          }
        }
        return r;
      },
      F(e.options, "debugTable"),
    );
}
function KA() {
  return (e, t) =>
    C(
      () => {
        var n;
        return [(n = e.getColumn(t)) == null ? void 0 : n.getFacetedRowModel()];
      },
      (n) => {
        var r;
        if (!n) return;
        const s = (r = n.flatRows[0]) == null ? void 0 : r.getUniqueValues(t);
        if (typeof s > "u") return;
        let o = [s, s];
        for (let A = 0; A < n.flatRows.length; A++) {
          const l = n.flatRows[A].getUniqueValues(t);
          for (let a = 0; a < l.length; a++) {
            const c = l[a];
            c < o[0] ? (o[0] = c) : c > o[1] && (o[1] = c);
          }
        }
        return o;
      },
      F(e.options, "debugTable"),
    );
}
function QA() {
  return (e) =>
    C(
      () => [e.getState().sorting, e.getPreSortedRowModel()],
      (t, n) => {
        if (!n.rows.length || !(t != null && t.length)) return n;
        const r = e.getState().sorting,
          s = [],
          o = r.filter((a) => {
            var c;
            return (c = e.getColumn(a.id)) == null ? void 0 : c.getCanSort();
          }),
          A = {};
        o.forEach((a) => {
          const c = e.getColumn(a.id);
          c &&
            (A[a.id] = {
              sortUndefined: c.columnDef.sortUndefined,
              invertSorting: c.columnDef.invertSorting,
              sortingFn: c.getSortingFn(),
            });
        });
        const l = (a) => {
          const c = a.map((u) => ({ ...u }));
          return (
            c.sort((u, d) => {
              for (let f = 0; f < o.length; f += 1) {
                var g;
                const h = o[f],
                  m = A[h.id],
                  x = (g = h == null ? void 0 : h.desc) != null ? g : !1;
                let j = 0;
                if (m.sortUndefined) {
                  const v = u.getValue(h.id),
                    y = d.getValue(h.id),
                    k = v === void 0,
                    V = y === void 0;
                  (k || V) && (j = k && V ? 0 : k ? m.sortUndefined : -m.sortUndefined);
                }
                if ((j === 0 && (j = m.sortingFn(u, d, h.id)), j !== 0))
                  return x && (j *= -1), m.invertSorting && (j *= -1), j;
              }
              return u.index - d.index;
            }),
            c.forEach((u) => {
              var d;
              s.push(u), (d = u.subRows) != null && d.length && (u.subRows = l(u.subRows));
            }),
            c
          );
        };
        return { rows: l(n.rows), flatRows: s, rowsById: n.rowsById };
      },
      F(e.options, "debugTable", "getSortedRowModel", () => e._autoResetPageIndex()),
    );
}
function ZA(e) {
  const t = [],
    n = (r) => {
      var s;
      t.push(r), (s = r.subRows) != null && s.length && r.getIsExpanded() && r.subRows.forEach(n);
    };
  return e.rows.forEach(n), { rows: t, flatRows: e.flatRows, rowsById: e.rowsById };
}
function XA(e) {
  return (t) =>
    C(
      () => [
        t.getState().pagination,
        t.getPrePaginationRowModel(),
        t.options.paginateExpandedRows ? void 0 : t.getState().expanded,
      ],
      (n, r) => {
        if (!r.rows.length) return r;
        const { pageSize: s, pageIndex: o } = n;
        let { rows: A, flatRows: l, rowsById: a } = r;
        const c = s * o,
          u = c + s;
        A = A.slice(c, u);
        let d;
        t.options.paginateExpandedRows
          ? (d = { rows: A, flatRows: l, rowsById: a })
          : (d = ZA({ rows: A, flatRows: l, rowsById: a })),
          (d.flatRows = []);
        const g = (f) => {
          d.flatRows.push(f), f.subRows.length && f.subRows.forEach(g);
        };
        return d.rows.forEach(g), d;
      },
      F(t.options, "debugTable"),
    );
}
/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function hs(e, t) {
  return e ? ($A(e) ? R.createElement(e, t) : e) : null;
}
function $A(e) {
  return el(e) || typeof e == "function" || tl(e);
}
function el(e) {
  return (
    typeof e == "function" &&
    (() => {
      const t = Object.getPrototypeOf(e);
      return t.prototype && t.prototype.isReactComponent;
    })()
  );
}
function tl(e) {
  return (
    typeof e == "object" &&
    typeof e.$$typeof == "symbol" &&
    ["react.memo", "react.forward_ref"].includes(e.$$typeof.description)
  );
}
function nl(e) {
  const t = { state: {}, onStateChange: () => {}, renderFallbackValue: null, ...e },
    [n] = R.useState(() => ({ current: UA(t) })),
    [r, s] = R.useState(() => n.current.initialState);
  return (
    n.current.setOptions((o) => ({
      ...o,
      ...e,
      state: { ...r, ...e.state },
      onStateChange: (A) => {
        s(A), e.onStateChange == null || e.onStateChange(A);
      },
    })),
    n.current
  );
}
var ms =
    typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {},
  we = [],
  fe = [],
  rl = typeof Uint8Array < "u" ? Uint8Array : Array,
  Zn = !1;
function hi() {
  Zn = !0;
  for (
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, n = e.length;
    t < n;
    ++t
  )
    (we[t] = e[t]), (fe[e.charCodeAt(t)] = t);
  (fe[45] = 62), (fe[95] = 63);
}
function sl(e) {
  Zn || hi();
  var t,
    n,
    r,
    s,
    o,
    A,
    l = e.length;
  if (l % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
  (o = e[l - 2] === "=" ? 2 : e[l - 1] === "=" ? 1 : 0),
    (A = new rl((l * 3) / 4 - o)),
    (r = o > 0 ? l - 4 : l);
  var a = 0;
  for (t = 0, n = 0; t < r; t += 4, n += 3)
    (s =
      (fe[e.charCodeAt(t)] << 18) |
      (fe[e.charCodeAt(t + 1)] << 12) |
      (fe[e.charCodeAt(t + 2)] << 6) |
      fe[e.charCodeAt(t + 3)]),
      (A[a++] = (s >> 16) & 255),
      (A[a++] = (s >> 8) & 255),
      (A[a++] = s & 255);
  return (
    o === 2
      ? ((s = (fe[e.charCodeAt(t)] << 2) | (fe[e.charCodeAt(t + 1)] >> 4)), (A[a++] = s & 255))
      : o === 1 &&
        ((s =
          (fe[e.charCodeAt(t)] << 10) |
          (fe[e.charCodeAt(t + 1)] << 4) |
          (fe[e.charCodeAt(t + 2)] >> 2)),
        (A[a++] = (s >> 8) & 255),
        (A[a++] = s & 255)),
    A
  );
}
function il(e) {
  return we[(e >> 18) & 63] + we[(e >> 12) & 63] + we[(e >> 6) & 63] + we[e & 63];
}
function ol(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    (r = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2]), s.push(il(r));
  return s.join("");
}
function ps(e) {
  Zn || hi();
  for (var t, n = e.length, r = n % 3, s = "", o = [], A = 16383, l = 0, a = n - r; l < a; l += A)
    o.push(ol(e, l, l + A > a ? a : l + A));
  return (
    r === 1
      ? ((t = e[n - 1]), (s += we[t >> 2]), (s += we[(t << 4) & 63]), (s += "=="))
      : r === 2 &&
        ((t = (e[n - 2] << 8) + e[n - 1]),
        (s += we[t >> 10]),
        (s += we[(t >> 4) & 63]),
        (s += we[(t << 2) & 63]),
        (s += "=")),
    o.push(s),
    o.join("")
  );
}
function Qt(e, t, n, r, s) {
  var o,
    A,
    l = s * 8 - r - 1,
    a = (1 << l) - 1,
    c = a >> 1,
    u = -7,
    d = n ? s - 1 : 0,
    g = n ? -1 : 1,
    f = e[t + d];
  for (
    d += g, o = f & ((1 << -u) - 1), f >>= -u, u += l;
    u > 0;
    o = o * 256 + e[t + d], d += g, u -= 8
  );
  for (A = o & ((1 << -u) - 1), o >>= -u, u += r; u > 0; A = A * 256 + e[t + d], d += g, u -= 8);
  if (o === 0) o = 1 - c;
  else {
    if (o === a) return A ? NaN : (f ? -1 : 1) * (1 / 0);
    (A = A + Math.pow(2, r)), (o = o - c);
  }
  return (f ? -1 : 1) * A * Math.pow(2, o - r);
}
function mi(e, t, n, r, s, o) {
  var A,
    l,
    a,
    c = o * 8 - s - 1,
    u = (1 << c) - 1,
    d = u >> 1,
    g = s === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
    f = r ? 0 : o - 1,
    h = r ? 1 : -1,
    m = t < 0 || (t === 0 && 1 / t < 0) ? 1 : 0;
  for (
    t = Math.abs(t),
      isNaN(t) || t === 1 / 0
        ? ((l = isNaN(t) ? 1 : 0), (A = u))
        : ((A = Math.floor(Math.log(t) / Math.LN2)),
          t * (a = Math.pow(2, -A)) < 1 && (A--, (a *= 2)),
          A + d >= 1 ? (t += g / a) : (t += g * Math.pow(2, 1 - d)),
          t * a >= 2 && (A++, (a /= 2)),
          A + d >= u
            ? ((l = 0), (A = u))
            : A + d >= 1
              ? ((l = (t * a - 1) * Math.pow(2, s)), (A = A + d))
              : ((l = t * Math.pow(2, d - 1) * Math.pow(2, s)), (A = 0)));
    s >= 8;
    e[n + f] = l & 255, f += h, l /= 256, s -= 8
  );
  for (A = (A << s) | l, c += s; c > 0; e[n + f] = A & 255, f += h, A /= 256, c -= 8);
  e[n + f - h] |= m * 128;
}
var Al = {}.toString,
  pi =
    Array.isArray ||
    function (e) {
      return Al.call(e) == "[object Array]";
    },
  ll = 50;
w.TYPED_ARRAY_SUPPORT = ms.TYPED_ARRAY_SUPPORT !== void 0 ? ms.TYPED_ARRAY_SUPPORT : !0;
qt();
function qt() {
  return w.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function Re(e, t) {
  if (qt() < t) throw new RangeError("Invalid typed array length");
  return (
    w.TYPED_ARRAY_SUPPORT
      ? ((e = new Uint8Array(t)), (e.__proto__ = w.prototype))
      : (e === null && (e = new w(t)), (e.length = t)),
    e
  );
}
function w(e, t, n) {
  if (!w.TYPED_ARRAY_SUPPORT && !(this instanceof w)) return new w(e, t, n);
  if (typeof e == "number") {
    if (typeof t == "string")
      throw new Error("If encoding is specified then the first argument must be a string");
    return Xn(this, e);
  }
  return xi(this, e, t, n);
}
w.poolSize = 8192;
w._augment = function (e) {
  return (e.__proto__ = w.prototype), e;
};
function xi(e, t, n, r) {
  if (typeof t == "number") throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer
    ? ul(e, t, n, r)
    : typeof t == "string"
      ? al(e, t, n)
      : dl(e, t);
}
w.from = function (e, t, n) {
  return xi(null, e, t, n);
};
w.TYPED_ARRAY_SUPPORT &&
  ((w.prototype.__proto__ = Uint8Array.prototype),
  (w.__proto__ = Uint8Array),
  typeof Symbol < "u" && Symbol.species && w[Symbol.species]);
function ji(e) {
  if (typeof e != "number") throw new TypeError('"size" argument must be a number');
  if (e < 0) throw new RangeError('"size" argument must not be negative');
}
function cl(e, t, n, r) {
  return (
    ji(t),
    t <= 0
      ? Re(e, t)
      : n !== void 0
        ? typeof r == "string"
          ? Re(e, t).fill(n, r)
          : Re(e, t).fill(n)
        : Re(e, t)
  );
}
w.alloc = function (e, t, n) {
  return cl(null, e, t, n);
};
function Xn(e, t) {
  if ((ji(t), (e = Re(e, t < 0 ? 0 : $n(t) | 0)), !w.TYPED_ARRAY_SUPPORT))
    for (var n = 0; n < t; ++n) e[n] = 0;
  return e;
}
w.allocUnsafe = function (e) {
  return Xn(null, e);
};
w.allocUnsafeSlow = function (e) {
  return Xn(null, e);
};
function al(e, t, n) {
  if (((typeof n != "string" || n === "") && (n = "utf8"), !w.isEncoding(n)))
    throw new TypeError('"encoding" must be a valid string encoding');
  var r = wi(t, n) | 0;
  e = Re(e, r);
  var s = e.write(t, n);
  return s !== r && (e = e.slice(0, s)), e;
}
function Nn(e, t) {
  var n = t.length < 0 ? 0 : $n(t.length) | 0;
  e = Re(e, n);
  for (var r = 0; r < n; r += 1) e[r] = t[r] & 255;
  return e;
}
function ul(e, t, n, r) {
  if ((t.byteLength, n < 0 || t.byteLength < n)) throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
  return (
    n === void 0 && r === void 0
      ? (t = new Uint8Array(t))
      : r === void 0
        ? (t = new Uint8Array(t, n))
        : (t = new Uint8Array(t, n, r)),
    w.TYPED_ARRAY_SUPPORT ? ((e = t), (e.__proto__ = w.prototype)) : (e = Nn(e, t)),
    e
  );
}
function dl(e, t) {
  if (ve(t)) {
    var n = $n(t.length) | 0;
    return (e = Re(e, n)), e.length === 0 || t.copy(e, 0, 0, n), e;
  }
  if (t) {
    if ((typeof ArrayBuffer < "u" && t.buffer instanceof ArrayBuffer) || "length" in t)
      return typeof t.length != "number" || Il(t.length) ? Re(e, 0) : Nn(e, t);
    if (t.type === "Buffer" && pi(t.data)) return Nn(e, t.data);
  }
  throw new TypeError(
    "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.",
  );
}
function $n(e) {
  if (e >= qt())
    throw new RangeError(
      "Attempt to allocate Buffer larger than maximum size: 0x" + qt().toString(16) + " bytes",
    );
  return e | 0;
}
w.isBuffer = Ge;
function ve(e) {
  return !!(e != null && e._isBuffer);
}
w.compare = function (t, n) {
  if (!ve(t) || !ve(n)) throw new TypeError("Arguments must be Buffers");
  if (t === n) return 0;
  for (var r = t.length, s = n.length, o = 0, A = Math.min(r, s); o < A; ++o)
    if (t[o] !== n[o]) {
      (r = t[o]), (s = n[o]);
      break;
    }
  return r < s ? -1 : s < r ? 1 : 0;
};
w.isEncoding = function (t) {
  switch (String(t).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return !0;
    default:
      return !1;
  }
};
w.concat = function (t, n) {
  if (!pi(t)) throw new TypeError('"list" argument must be an Array of Buffers');
  if (t.length === 0) return w.alloc(0);
  var r;
  if (n === void 0) for (n = 0, r = 0; r < t.length; ++r) n += t[r].length;
  var s = w.allocUnsafe(n),
    o = 0;
  for (r = 0; r < t.length; ++r) {
    var A = t[r];
    if (!ve(A)) throw new TypeError('"list" argument must be an Array of Buffers');
    A.copy(s, o), (o += A.length);
  }
  return s;
};
function wi(e, t) {
  if (ve(e)) return e.length;
  if (
    typeof ArrayBuffer < "u" &&
    typeof ArrayBuffer.isView == "function" &&
    (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
  )
    return e.byteLength;
  typeof e != "string" && (e = "" + e);
  var n = e.length;
  if (n === 0) return 0;
  for (var r = !1; ; )
    switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return n;
      case "utf8":
      case "utf-8":
      case void 0:
        return zt(e).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return n * 2;
      case "hex":
        return n >>> 1;
      case "base64":
        return bi(e).length;
      default:
        if (r) return zt(e).length;
        (t = ("" + t).toLowerCase()), (r = !0);
    }
}
w.byteLength = wi;
function fl(e, t, n) {
  var r = !1;
  if (
    ((t === void 0 || t < 0) && (t = 0),
    t > this.length ||
      ((n === void 0 || n > this.length) && (n = this.length), n <= 0) ||
      ((n >>>= 0), (t >>>= 0), n <= t))
  )
    return "";
  for (e || (e = "utf8"); ; )
    switch (e) {
      case "hex":
        return vl(this, t, n);
      case "utf8":
      case "utf-8":
        return vi(this, t, n);
      case "ascii":
        return yl(this, t, n);
      case "latin1":
      case "binary":
        return Sl(this, t, n);
      case "base64":
        return jl(this, t, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Cl(this, t, n);
      default:
        if (r) throw new TypeError("Unknown encoding: " + e);
        (e = (e + "").toLowerCase()), (r = !0);
    }
}
w.prototype._isBuffer = !0;
function He(e, t, n) {
  var r = e[t];
  (e[t] = e[n]), (e[n] = r);
}
w.prototype.swap16 = function () {
  var t = this.length;
  if (t % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var n = 0; n < t; n += 2) He(this, n, n + 1);
  return this;
};
w.prototype.swap32 = function () {
  var t = this.length;
  if (t % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var n = 0; n < t; n += 4) He(this, n, n + 3), He(this, n + 1, n + 2);
  return this;
};
w.prototype.swap64 = function () {
  var t = this.length;
  if (t % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var n = 0; n < t; n += 8)
    He(this, n, n + 7), He(this, n + 1, n + 6), He(this, n + 2, n + 5), He(this, n + 3, n + 4);
  return this;
};
w.prototype.toString = function () {
  var t = this.length | 0;
  return t === 0 ? "" : arguments.length === 0 ? vi(this, 0, t) : fl.apply(this, arguments);
};
w.prototype.equals = function (t) {
  if (!ve(t)) throw new TypeError("Argument must be a Buffer");
  return this === t ? !0 : w.compare(this, t) === 0;
};
w.prototype.inspect = function () {
  var t = "",
    n = ll;
  return (
    this.length > 0 &&
      ((t = this.toString("hex", 0, n).match(/.{2}/g).join(" ")),
      this.length > n && (t += " ... ")),
    "<Buffer " + t + ">"
  );
};
w.prototype.compare = function (t, n, r, s, o) {
  if (!ve(t)) throw new TypeError("Argument must be a Buffer");
  if (
    (n === void 0 && (n = 0),
    r === void 0 && (r = t ? t.length : 0),
    s === void 0 && (s = 0),
    o === void 0 && (o = this.length),
    n < 0 || r > t.length || s < 0 || o > this.length)
  )
    throw new RangeError("out of range index");
  if (s >= o && n >= r) return 0;
  if (s >= o) return -1;
  if (n >= r) return 1;
  if (((n >>>= 0), (r >>>= 0), (s >>>= 0), (o >>>= 0), this === t)) return 0;
  for (
    var A = o - s, l = r - n, a = Math.min(A, l), c = this.slice(s, o), u = t.slice(n, r), d = 0;
    d < a;
    ++d
  )
    if (c[d] !== u[d]) {
      (A = c[d]), (l = u[d]);
      break;
    }
  return A < l ? -1 : l < A ? 1 : 0;
};
function yi(e, t, n, r, s) {
  if (e.length === 0) return -1;
  if (
    (typeof n == "string"
      ? ((r = n), (n = 0))
      : n > 2147483647
        ? (n = 2147483647)
        : n < -2147483648 && (n = -2147483648),
    (n = +n),
    isNaN(n) && (n = s ? 0 : e.length - 1),
    n < 0 && (n = e.length + n),
    n >= e.length)
  ) {
    if (s) return -1;
    n = e.length - 1;
  } else if (n < 0)
    if (s) n = 0;
    else return -1;
  if ((typeof t == "string" && (t = w.from(t, r)), ve(t)))
    return t.length === 0 ? -1 : xs(e, t, n, r, s);
  if (typeof t == "number")
    return (
      (t = t & 255),
      w.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function"
        ? s
          ? Uint8Array.prototype.indexOf.call(e, t, n)
          : Uint8Array.prototype.lastIndexOf.call(e, t, n)
        : xs(e, [t], n, r, s)
    );
  throw new TypeError("val must be string, number or Buffer");
}
function xs(e, t, n, r, s) {
  var o = 1,
    A = e.length,
    l = t.length;
  if (
    r !== void 0 &&
    ((r = String(r).toLowerCase()),
    r === "ucs2" || r === "ucs-2" || r === "utf16le" || r === "utf-16le")
  ) {
    if (e.length < 2 || t.length < 2) return -1;
    (o = 2), (A /= 2), (l /= 2), (n /= 2);
  }
  function a(f, h) {
    return o === 1 ? f[h] : f.readUInt16BE(h * o);
  }
  var c;
  if (s) {
    var u = -1;
    for (c = n; c < A; c++)
      if (a(e, c) === a(t, u === -1 ? 0 : c - u)) {
        if ((u === -1 && (u = c), c - u + 1 === l)) return u * o;
      } else u !== -1 && (c -= c - u), (u = -1);
  } else
    for (n + l > A && (n = A - l), c = n; c >= 0; c--) {
      for (var d = !0, g = 0; g < l; g++)
        if (a(e, c + g) !== a(t, g)) {
          d = !1;
          break;
        }
      if (d) return c;
    }
  return -1;
}
w.prototype.includes = function (t, n, r) {
  return this.indexOf(t, n, r) !== -1;
};
w.prototype.indexOf = function (t, n, r) {
  return yi(this, t, n, r, !0);
};
w.prototype.lastIndexOf = function (t, n, r) {
  return yi(this, t, n, r, !1);
};
function gl(e, t, n, r) {
  n = Number(n) || 0;
  var s = e.length - n;
  r ? ((r = Number(r)), r > s && (r = s)) : (r = s);
  var o = t.length;
  if (o % 2 !== 0) throw new TypeError("Invalid hex string");
  r > o / 2 && (r = o / 2);
  for (var A = 0; A < r; ++A) {
    var l = parseInt(t.substr(A * 2, 2), 16);
    if (isNaN(l)) return A;
    e[n + A] = l;
  }
  return A;
}
function hl(e, t, n, r) {
  return $t(zt(t, e.length - n), e, n, r);
}
function Si(e, t, n, r) {
  return $t(Nl(t), e, n, r);
}
function ml(e, t, n, r) {
  return Si(e, t, n, r);
}
function pl(e, t, n, r) {
  return $t(bi(t), e, n, r);
}
function xl(e, t, n, r) {
  return $t(Ol(t, e.length - n), e, n, r);
}
w.prototype.write = function (t, n, r, s) {
  if (n === void 0) (s = "utf8"), (r = this.length), (n = 0);
  else if (r === void 0 && typeof n == "string") (s = n), (r = this.length), (n = 0);
  else if (isFinite(n))
    (n = n | 0),
      isFinite(r) ? ((r = r | 0), s === void 0 && (s = "utf8")) : ((s = r), (r = void 0));
  else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
  var o = this.length - n;
  if (((r === void 0 || r > o) && (r = o), (t.length > 0 && (r < 0 || n < 0)) || n > this.length))
    throw new RangeError("Attempt to write outside buffer bounds");
  s || (s = "utf8");
  for (var A = !1; ; )
    switch (s) {
      case "hex":
        return gl(this, t, n, r);
      case "utf8":
      case "utf-8":
        return hl(this, t, n, r);
      case "ascii":
        return Si(this, t, n, r);
      case "latin1":
      case "binary":
        return ml(this, t, n, r);
      case "base64":
        return pl(this, t, n, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return xl(this, t, n, r);
      default:
        if (A) throw new TypeError("Unknown encoding: " + s);
        (s = ("" + s).toLowerCase()), (A = !0);
    }
};
w.prototype.toJSON = function () {
  return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
};
function jl(e, t, n) {
  return t === 0 && n === e.length ? ps(e) : ps(e.slice(t, n));
}
function vi(e, t, n) {
  n = Math.min(e.length, n);
  for (var r = [], s = t; s < n; ) {
    var o = e[s],
      A = null,
      l = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
    if (s + l <= n) {
      var a, c, u, d;
      switch (l) {
        case 1:
          o < 128 && (A = o);
          break;
        case 2:
          (a = e[s + 1]),
            (a & 192) === 128 && ((d = ((o & 31) << 6) | (a & 63)), d > 127 && (A = d));
          break;
        case 3:
          (a = e[s + 1]),
            (c = e[s + 2]),
            (a & 192) === 128 &&
              (c & 192) === 128 &&
              ((d = ((o & 15) << 12) | ((a & 63) << 6) | (c & 63)),
              d > 2047 && (d < 55296 || d > 57343) && (A = d));
          break;
        case 4:
          (a = e[s + 1]),
            (c = e[s + 2]),
            (u = e[s + 3]),
            (a & 192) === 128 &&
              (c & 192) === 128 &&
              (u & 192) === 128 &&
              ((d = ((o & 15) << 18) | ((a & 63) << 12) | ((c & 63) << 6) | (u & 63)),
              d > 65535 && d < 1114112 && (A = d));
      }
    }
    A === null
      ? ((A = 65533), (l = 1))
      : A > 65535 && ((A -= 65536), r.push(((A >>> 10) & 1023) | 55296), (A = 56320 | (A & 1023))),
      r.push(A),
      (s += l);
  }
  return wl(r);
}
var js = 4096;
function wl(e) {
  var t = e.length;
  if (t <= js) return String.fromCharCode.apply(String, e);
  for (var n = "", r = 0; r < t; ) n += String.fromCharCode.apply(String, e.slice(r, (r += js)));
  return n;
}
function yl(e, t, n) {
  var r = "";
  n = Math.min(e.length, n);
  for (var s = t; s < n; ++s) r += String.fromCharCode(e[s] & 127);
  return r;
}
function Sl(e, t, n) {
  var r = "";
  n = Math.min(e.length, n);
  for (var s = t; s < n; ++s) r += String.fromCharCode(e[s]);
  return r;
}
function vl(e, t, n) {
  var r = e.length;
  (!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);
  for (var s = "", o = t; o < n; ++o) s += El(e[o]);
  return s;
}
function Cl(e, t, n) {
  for (var r = e.slice(t, n), s = "", o = 0; o < r.length; o += 2)
    s += String.fromCharCode(r[o] + r[o + 1] * 256);
  return s;
}
w.prototype.slice = function (t, n) {
  var r = this.length;
  (t = ~~t),
    (n = n === void 0 ? r : ~~n),
    t < 0 ? ((t += r), t < 0 && (t = 0)) : t > r && (t = r),
    n < 0 ? ((n += r), n < 0 && (n = 0)) : n > r && (n = r),
    n < t && (n = t);
  var s;
  if (w.TYPED_ARRAY_SUPPORT) (s = this.subarray(t, n)), (s.__proto__ = w.prototype);
  else {
    var o = n - t;
    s = new w(o, void 0);
    for (var A = 0; A < o; ++A) s[A] = this[A + t];
  }
  return s;
};
function ne(e, t, n) {
  if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
  if (e + t > n) throw new RangeError("Trying to access beyond buffer length");
}
w.prototype.readUIntLE = function (t, n, r) {
  (t = t | 0), (n = n | 0), r || ne(t, n, this.length);
  for (var s = this[t], o = 1, A = 0; ++A < n && (o *= 256); ) s += this[t + A] * o;
  return s;
};
w.prototype.readUIntBE = function (t, n, r) {
  (t = t | 0), (n = n | 0), r || ne(t, n, this.length);
  for (var s = this[t + --n], o = 1; n > 0 && (o *= 256); ) s += this[t + --n] * o;
  return s;
};
w.prototype.readUInt8 = function (t, n) {
  return n || ne(t, 1, this.length), this[t];
};
w.prototype.readUInt16LE = function (t, n) {
  return n || ne(t, 2, this.length), this[t] | (this[t + 1] << 8);
};
w.prototype.readUInt16BE = function (t, n) {
  return n || ne(t, 2, this.length), (this[t] << 8) | this[t + 1];
};
w.prototype.readUInt32LE = function (t, n) {
  return (
    n || ne(t, 4, this.length),
    (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) + this[t + 3] * 16777216
  );
};
w.prototype.readUInt32BE = function (t, n) {
  return (
    n || ne(t, 4, this.length),
    this[t] * 16777216 + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
  );
};
w.prototype.readIntLE = function (t, n, r) {
  (t = t | 0), (n = n | 0), r || ne(t, n, this.length);
  for (var s = this[t], o = 1, A = 0; ++A < n && (o *= 256); ) s += this[t + A] * o;
  return (o *= 128), s >= o && (s -= Math.pow(2, 8 * n)), s;
};
w.prototype.readIntBE = function (t, n, r) {
  (t = t | 0), (n = n | 0), r || ne(t, n, this.length);
  for (var s = n, o = 1, A = this[t + --s]; s > 0 && (o *= 256); ) A += this[t + --s] * o;
  return (o *= 128), A >= o && (A -= Math.pow(2, 8 * n)), A;
};
w.prototype.readInt8 = function (t, n) {
  return n || ne(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
};
w.prototype.readInt16LE = function (t, n) {
  n || ne(t, 2, this.length);
  var r = this[t] | (this[t + 1] << 8);
  return r & 32768 ? r | 4294901760 : r;
};
w.prototype.readInt16BE = function (t, n) {
  n || ne(t, 2, this.length);
  var r = this[t + 1] | (this[t] << 8);
  return r & 32768 ? r | 4294901760 : r;
};
w.prototype.readInt32LE = function (t, n) {
  return (
    n || ne(t, 4, this.length),
    this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24)
  );
};
w.prototype.readInt32BE = function (t, n) {
  return (
    n || ne(t, 4, this.length),
    (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]
  );
};
w.prototype.readFloatLE = function (t, n) {
  return n || ne(t, 4, this.length), Qt(this, t, !0, 23, 4);
};
w.prototype.readFloatBE = function (t, n) {
  return n || ne(t, 4, this.length), Qt(this, t, !1, 23, 4);
};
w.prototype.readDoubleLE = function (t, n) {
  return n || ne(t, 8, this.length), Qt(this, t, !0, 52, 8);
};
w.prototype.readDoubleBE = function (t, n) {
  return n || ne(t, 8, this.length), Qt(this, t, !1, 52, 8);
};
function Ae(e, t, n, r, s, o) {
  if (!ve(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > s || t < o) throw new RangeError('"value" argument is out of bounds');
  if (n + r > e.length) throw new RangeError("Index out of range");
}
w.prototype.writeUIntLE = function (t, n, r, s) {
  if (((t = +t), (n = n | 0), (r = r | 0), !s)) {
    var o = Math.pow(2, 8 * r) - 1;
    Ae(this, t, n, r, o, 0);
  }
  var A = 1,
    l = 0;
  for (this[n] = t & 255; ++l < r && (A *= 256); ) this[n + l] = (t / A) & 255;
  return n + r;
};
w.prototype.writeUIntBE = function (t, n, r, s) {
  if (((t = +t), (n = n | 0), (r = r | 0), !s)) {
    var o = Math.pow(2, 8 * r) - 1;
    Ae(this, t, n, r, o, 0);
  }
  var A = r - 1,
    l = 1;
  for (this[n + A] = t & 255; --A >= 0 && (l *= 256); ) this[n + A] = (t / l) & 255;
  return n + r;
};
w.prototype.writeUInt8 = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 1, 255, 0),
    w.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
    (this[n] = t & 255),
    n + 1
  );
};
function Zt(e, t, n, r) {
  t < 0 && (t = 65535 + t + 1);
  for (var s = 0, o = Math.min(e.length - n, 2); s < o; ++s)
    e[n + s] = (t & (255 << (8 * (r ? s : 1 - s)))) >>> ((r ? s : 1 - s) * 8);
}
w.prototype.writeUInt16LE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 2, 65535, 0),
    w.TYPED_ARRAY_SUPPORT ? ((this[n] = t & 255), (this[n + 1] = t >>> 8)) : Zt(this, t, n, !0),
    n + 2
  );
};
w.prototype.writeUInt16BE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 2, 65535, 0),
    w.TYPED_ARRAY_SUPPORT ? ((this[n] = t >>> 8), (this[n + 1] = t & 255)) : Zt(this, t, n, !1),
    n + 2
  );
};
function Xt(e, t, n, r) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var s = 0, o = Math.min(e.length - n, 4); s < o; ++s)
    e[n + s] = (t >>> ((r ? s : 3 - s) * 8)) & 255;
}
w.prototype.writeUInt32LE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 4, 4294967295, 0),
    w.TYPED_ARRAY_SUPPORT
      ? ((this[n + 3] = t >>> 24),
        (this[n + 2] = t >>> 16),
        (this[n + 1] = t >>> 8),
        (this[n] = t & 255))
      : Xt(this, t, n, !0),
    n + 4
  );
};
w.prototype.writeUInt32BE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 4, 4294967295, 0),
    w.TYPED_ARRAY_SUPPORT
      ? ((this[n] = t >>> 24),
        (this[n + 1] = t >>> 16),
        (this[n + 2] = t >>> 8),
        (this[n + 3] = t & 255))
      : Xt(this, t, n, !1),
    n + 4
  );
};
w.prototype.writeIntLE = function (t, n, r, s) {
  if (((t = +t), (n = n | 0), !s)) {
    var o = Math.pow(2, 8 * r - 1);
    Ae(this, t, n, r, o - 1, -o);
  }
  var A = 0,
    l = 1,
    a = 0;
  for (this[n] = t & 255; ++A < r && (l *= 256); )
    t < 0 && a === 0 && this[n + A - 1] !== 0 && (a = 1),
      (this[n + A] = (((t / l) >> 0) - a) & 255);
  return n + r;
};
w.prototype.writeIntBE = function (t, n, r, s) {
  if (((t = +t), (n = n | 0), !s)) {
    var o = Math.pow(2, 8 * r - 1);
    Ae(this, t, n, r, o - 1, -o);
  }
  var A = r - 1,
    l = 1,
    a = 0;
  for (this[n + A] = t & 255; --A >= 0 && (l *= 256); )
    t < 0 && a === 0 && this[n + A + 1] !== 0 && (a = 1),
      (this[n + A] = (((t / l) >> 0) - a) & 255);
  return n + r;
};
w.prototype.writeInt8 = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 1, 127, -128),
    w.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
    t < 0 && (t = 255 + t + 1),
    (this[n] = t & 255),
    n + 1
  );
};
w.prototype.writeInt16LE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 2, 32767, -32768),
    w.TYPED_ARRAY_SUPPORT ? ((this[n] = t & 255), (this[n + 1] = t >>> 8)) : Zt(this, t, n, !0),
    n + 2
  );
};
w.prototype.writeInt16BE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 2, 32767, -32768),
    w.TYPED_ARRAY_SUPPORT ? ((this[n] = t >>> 8), (this[n + 1] = t & 255)) : Zt(this, t, n, !1),
    n + 2
  );
};
w.prototype.writeInt32LE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 4, 2147483647, -2147483648),
    w.TYPED_ARRAY_SUPPORT
      ? ((this[n] = t & 255),
        (this[n + 1] = t >>> 8),
        (this[n + 2] = t >>> 16),
        (this[n + 3] = t >>> 24))
      : Xt(this, t, n, !0),
    n + 4
  );
};
w.prototype.writeInt32BE = function (t, n, r) {
  return (
    (t = +t),
    (n = n | 0),
    r || Ae(this, t, n, 4, 2147483647, -2147483648),
    t < 0 && (t = 4294967295 + t + 1),
    w.TYPED_ARRAY_SUPPORT
      ? ((this[n] = t >>> 24),
        (this[n + 1] = t >>> 16),
        (this[n + 2] = t >>> 8),
        (this[n + 3] = t & 255))
      : Xt(this, t, n, !1),
    n + 4
  );
};
function Ci(e, t, n, r, s, o) {
  if (n + r > e.length) throw new RangeError("Index out of range");
  if (n < 0) throw new RangeError("Index out of range");
}
function Fi(e, t, n, r, s) {
  return s || Ci(e, t, n, 4), mi(e, t, n, r, 23, 4), n + 4;
}
w.prototype.writeFloatLE = function (t, n, r) {
  return Fi(this, t, n, !0, r);
};
w.prototype.writeFloatBE = function (t, n, r) {
  return Fi(this, t, n, !1, r);
};
function Ri(e, t, n, r, s) {
  return s || Ci(e, t, n, 8), mi(e, t, n, r, 52, 8), n + 8;
}
w.prototype.writeDoubleLE = function (t, n, r) {
  return Ri(this, t, n, !0, r);
};
w.prototype.writeDoubleBE = function (t, n, r) {
  return Ri(this, t, n, !1, r);
};
w.prototype.copy = function (t, n, r, s) {
  if (
    (r || (r = 0),
    !s && s !== 0 && (s = this.length),
    n >= t.length && (n = t.length),
    n || (n = 0),
    s > 0 && s < r && (s = r),
    s === r || t.length === 0 || this.length === 0)
  )
    return 0;
  if (n < 0) throw new RangeError("targetStart out of bounds");
  if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
  if (s < 0) throw new RangeError("sourceEnd out of bounds");
  s > this.length && (s = this.length), t.length - n < s - r && (s = t.length - n + r);
  var o = s - r,
    A;
  if (this === t && r < n && n < s) for (A = o - 1; A >= 0; --A) t[A + n] = this[A + r];
  else if (o < 1e3 || !w.TYPED_ARRAY_SUPPORT) for (A = 0; A < o; ++A) t[A + n] = this[A + r];
  else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), n);
  return o;
};
w.prototype.fill = function (t, n, r, s) {
  if (typeof t == "string") {
    if (
      (typeof n == "string"
        ? ((s = n), (n = 0), (r = this.length))
        : typeof r == "string" && ((s = r), (r = this.length)),
      t.length === 1)
    ) {
      var o = t.charCodeAt(0);
      o < 256 && (t = o);
    }
    if (s !== void 0 && typeof s != "string") throw new TypeError("encoding must be a string");
    if (typeof s == "string" && !w.isEncoding(s)) throw new TypeError("Unknown encoding: " + s);
  } else typeof t == "number" && (t = t & 255);
  if (n < 0 || this.length < n || this.length < r) throw new RangeError("Out of range index");
  if (r <= n) return this;
  (n = n >>> 0), (r = r === void 0 ? this.length : r >>> 0), t || (t = 0);
  var A;
  if (typeof t == "number") for (A = n; A < r; ++A) this[A] = t;
  else {
    var l = ve(t) ? t : zt(new w(t, s).toString()),
      a = l.length;
    for (A = 0; A < r - n; ++A) this[A + n] = l[A % a];
  }
  return this;
};
var Fl = /[^+\/0-9A-Za-z-_]/g;
function Rl(e) {
  if (((e = bl(e).replace(Fl, "")), e.length < 2)) return "";
  for (; e.length % 4 !== 0; ) e = e + "=";
  return e;
}
function bl(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}
function El(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function zt(e, t) {
  t = t || 1 / 0;
  for (var n, r = e.length, s = null, o = [], A = 0; A < r; ++A) {
    if (((n = e.charCodeAt(A)), n > 55295 && n < 57344)) {
      if (!s) {
        if (n > 56319) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        } else if (A + 1 === r) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        s = n;
        continue;
      }
      if (n < 56320) {
        (t -= 3) > -1 && o.push(239, 191, 189), (s = n);
        continue;
      }
      n = (((s - 55296) << 10) | (n - 56320)) + 65536;
    } else s && (t -= 3) > -1 && o.push(239, 191, 189);
    if (((s = null), n < 128)) {
      if ((t -= 1) < 0) break;
      o.push(n);
    } else if (n < 2048) {
      if ((t -= 2) < 0) break;
      o.push((n >> 6) | 192, (n & 63) | 128);
    } else if (n < 65536) {
      if ((t -= 3) < 0) break;
      o.push((n >> 12) | 224, ((n >> 6) & 63) | 128, (n & 63) | 128);
    } else if (n < 1114112) {
      if ((t -= 4) < 0) break;
      o.push((n >> 18) | 240, ((n >> 12) & 63) | 128, ((n >> 6) & 63) | 128, (n & 63) | 128);
    } else throw new Error("Invalid code point");
  }
  return o;
}
function Nl(e) {
  for (var t = [], n = 0; n < e.length; ++n) t.push(e.charCodeAt(n) & 255);
  return t;
}
function Ol(e, t) {
  for (var n, r, s, o = [], A = 0; A < e.length && !((t -= 2) < 0); ++A)
    (n = e.charCodeAt(A)), (r = n >> 8), (s = n % 256), o.push(s), o.push(r);
  return o;
}
function bi(e) {
  return sl(Rl(e));
}
function $t(e, t, n, r) {
  for (var s = 0; s < r && !(s + n >= t.length || s >= e.length); ++s) t[s + n] = e[s];
  return s;
}
function Il(e) {
  return e !== e;
}
function Ge(e) {
  return e != null && (!!e._isBuffer || Ei(e) || Tl(e));
}
function Ei(e) {
  return (
    !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e)
  );
}
function Tl(e) {
  return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Ei(e.slice(0, 0));
}
const Dl = 46,
  kl = /\\(\\)?/g,
  Bl = RegExp(
    `[^.[\\]]+|\\[(?:([^"'][^[]*)|(["'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))`,
    "g",
  ),
  Pl = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  Ml = /^\w*$/,
  Vl = function (e) {
    return Object.prototype.toString.call(e);
  },
  Ni = function (e) {
    const t = typeof e;
    return t === "symbol" || (t === "object" && e && Vl(e) === "[object Symbol]");
  },
  Ll = function (e, t) {
    if (Array.isArray(e)) return !1;
    const n = typeof e;
    return n === "number" || n === "symbol" || n === "boolean" || !e || Ni(e)
      ? !0
      : Ml.test(e) || !Pl.test(e) || (t != null && e in Object(t));
  },
  Hl = function (e) {
    const t = [];
    return (
      e.charCodeAt(0) === Dl && t.push(""),
      e.replace(Bl, function (n, r, s, o) {
        let A = n;
        s ? (A = o.replace(kl, "$1")) : r && (A = r.trim()), t.push(A);
      }),
      t
    );
  },
  Ul = function (e, t) {
    return Array.isArray(e) ? e : Ll(e, t) ? [e] : Hl(e);
  },
  _l = function (e) {
    if (typeof e == "string" || Ni(e)) return e;
    const t = `${e}`;
    return t == "0" && 1 / e == -INFINITY ? "-0" : t;
  },
  ql = function (e, t) {
    t = Ul(t, e);
    let n = 0;
    const r = t.length;
    for (; e != null && n < r; ) e = e[_l(t[n++])];
    return n && n === r ? e : void 0;
  },
  zl = function (e) {
    return typeof e == "object" && e !== null && !Array.isArray(e);
  },
  Oi = function (e) {
    if (e == null) return [void 0, void 0];
    if (typeof e != "object")
      return [Error('Invalid option "columns": expect an array or an object')];
    if (Array.isArray(e)) {
      const t = [];
      for (const n of e)
        if (typeof n == "string") t.push({ key: n, header: n });
        else if (typeof n == "object" && n !== null && !Array.isArray(n)) {
          if (!n.key) return [Error('Invalid column definition: property "key" is required')];
          n.header === void 0 && (n.header = n.key), t.push(n);
        } else return [Error("Invalid column definition: expect a string or an object")];
      e = t;
    } else {
      const t = [];
      for (const n in e) t.push({ key: n, header: e[n] });
      e = t;
    }
    return [void 0, e];
  };
class Ye extends Error {
  constructor(t, n, ...r) {
    Array.isArray(n) && (n = n.join(" ")),
      super(n),
      Error.captureStackTrace !== void 0 && Error.captureStackTrace(this, Ye),
      (this.code = t);
    for (const s of r)
      for (const o in s) {
        const A = s[o];
        this[o] = Ge(A) ? A.toString() : A == null ? A : JSON.parse(JSON.stringify(A));
      }
  }
}
const Wl = function (e) {
    return e.replace(/([A-Z])/g, function (t, n) {
      return "_" + n.toLowerCase();
    });
  },
  Ii = function (e) {
    const t = {};
    for (const s in e) t[Wl(s)] = e[s];
    if (t.bom === void 0 || t.bom === null || t.bom === !1) t.bom = !1;
    else if (t.bom !== !0)
      return [
        new Ye("CSV_OPTION_BOOLEAN_INVALID_TYPE", [
          "option `bom` is optional and must be a boolean value,",
          `got ${JSON.stringify(t.bom)}`,
        ]),
      ];
    if (t.delimiter === void 0 || t.delimiter === null) t.delimiter = ",";
    else if (Ge(t.delimiter)) t.delimiter = t.delimiter.toString();
    else if (typeof t.delimiter != "string")
      return [
        new Ye("CSV_OPTION_DELIMITER_INVALID_TYPE", [
          "option `delimiter` must be a buffer or a string,",
          `got ${JSON.stringify(t.delimiter)}`,
        ]),
      ];
    if (t.quote === void 0 || t.quote === null) t.quote = '"';
    else if (t.quote === !0) t.quote = '"';
    else if (t.quote === !1) t.quote = "";
    else if (Ge(t.quote)) t.quote = t.quote.toString();
    else if (typeof t.quote != "string")
      return [
        new Ye("CSV_OPTION_QUOTE_INVALID_TYPE", [
          "option `quote` must be a boolean, a buffer or a string,",
          `got ${JSON.stringify(t.quote)}`,
        ]),
      ];
    if (
      ((t.quoted === void 0 || t.quoted === null) && (t.quoted = !1),
      t.escape_formulas === void 0 || t.escape_formulas === null)
    )
      t.escape_formulas = !1;
    else if (typeof t.escape_formulas != "boolean")
      return [
        new Ye("CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE", [
          "option `escape_formulas` must be a boolean,",
          `got ${JSON.stringify(t.escape_formulas)}`,
        ]),
      ];
    if (
      ((t.quoted_empty === void 0 || t.quoted_empty === null) && (t.quoted_empty = void 0),
      t.quoted_match === void 0 || t.quoted_match === null || t.quoted_match === !1
        ? (t.quoted_match = null)
        : Array.isArray(t.quoted_match) || (t.quoted_match = [t.quoted_match]),
      t.quoted_match)
    )
      for (const s of t.quoted_match) {
        const o = typeof s == "string",
          A = s instanceof RegExp;
        if (!o && !A)
          return [
            Error(
              `Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(s)}`,
            ),
          ];
      }
    if (
      ((t.quoted_string === void 0 || t.quoted_string === null) && (t.quoted_string = !1),
      (t.eof === void 0 || t.eof === null) && (t.eof = !0),
      t.escape === void 0 || t.escape === null)
    )
      t.escape = '"';
    else if (Ge(t.escape)) t.escape = t.escape.toString();
    else if (typeof t.escape != "string")
      return [
        Error(
          `Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(t.escape)}`,
        ),
      ];
    if (t.escape.length > 1)
      return [
        Error(`Invalid Option: escape must be one character, got ${t.escape.length} characters`),
      ];
    (t.header === void 0 || t.header === null) && (t.header = !1);
    const [n, r] = Oi(t.columns);
    if (n !== void 0) return [n];
    if (
      ((t.columns = r),
      (t.quoted === void 0 || t.quoted === null) && (t.quoted = !1),
      (t.cast === void 0 || t.cast === null) && (t.cast = {}),
      (t.cast.bigint === void 0 || t.cast.bigint === null) && (t.cast.bigint = (s) => "" + s),
      (t.cast.boolean === void 0 || t.cast.boolean === null) &&
        (t.cast.boolean = (s) => (s ? "1" : "")),
      (t.cast.date === void 0 || t.cast.date === null) && (t.cast.date = (s) => "" + s.getTime()),
      (t.cast.number === void 0 || t.cast.number === null) && (t.cast.number = (s) => "" + s),
      (t.cast.object === void 0 || t.cast.object === null) &&
        (t.cast.object = (s) => JSON.stringify(s)),
      (t.cast.string === void 0 || t.cast.string === null) &&
        (t.cast.string = function (s) {
          return s;
        }),
      t.on_record !== void 0 && typeof t.on_record != "function")
    )
      return [Error('Invalid Option: "on_record" must be a function.')];
    if (t.record_delimiter === void 0 || t.record_delimiter === null)
      t.record_delimiter = `
`;
    else if (Ge(t.record_delimiter)) t.record_delimiter = t.record_delimiter.toString();
    else if (typeof t.record_delimiter != "string")
      return [
        Error(
          `Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(t.record_delimiter)}`,
        ),
      ];
    switch (t.record_delimiter) {
      case "unix":
        t.record_delimiter = `
`;
        break;
      case "mac":
        t.record_delimiter = "\r";
        break;
      case "windows":
        t.record_delimiter = `\r
`;
        break;
      case "ascii":
        t.record_delimiter = "";
        break;
      case "unicode":
        t.record_delimiter = "\u2028";
        break;
    }
    return [void 0, t];
  },
  Gl = w.from([239, 187, 191]),
  Yl = function (e, t, n) {
    return {
      options: e,
      state: t,
      info: n,
      __transform: function (r, s) {
        if (!Array.isArray(r) && typeof r != "object")
          return Error(`Invalid Record: expect an array or an object, got ${JSON.stringify(r)}`);
        if (this.info.records === 0) {
          if (Array.isArray(r)) {
            if (this.options.header === !0 && this.options.columns === void 0)
              return Error(
                "Undiscoverable Columns: header option requires column option or object records",
              );
          } else if (this.options.columns === void 0) {
            const [l, a] = Oi(Object.keys(r));
            if (l) return;
            this.options.columns = a;
          }
        }
        if (this.info.records === 0) {
          this.bom(s);
          const l = this.headers(s);
          if (l) return l;
        }
        try {
          this.options.on_record && this.options.on_record(r, this.info.records);
        } catch (l) {
          return l;
        }
        let o, A;
        if (this.options.eof) {
          if ((([o, A] = this.stringify(r)), o)) return o;
          if (A === void 0) return;
          A = A + this.options.record_delimiter;
        } else {
          if ((([o, A] = this.stringify(r)), o)) return o;
          if (A === void 0) return;
          (this.options.header || this.info.records) && (A = this.options.record_delimiter + A);
        }
        this.info.records++, s(A);
      },
      stringify: function (r, s = !1) {
        if (typeof r != "object") return [void 0, r];
        const { columns: o } = this.options,
          A = [];
        if (Array.isArray(r)) {
          o && r.splice(o.length);
          for (let a = 0; a < r.length; a++) {
            const c = r[a],
              [u, d] = this.__cast(c, {
                index: a,
                column: a,
                records: this.info.records,
                header: s,
              });
            if (u) return [u];
            A[a] = [d, c];
          }
        } else
          for (let a = 0; a < o.length; a++) {
            const c = ql(r, o[a].key),
              [u, d] = this.__cast(c, {
                index: a,
                column: o[a].key,
                records: this.info.records,
                header: s,
              });
            if (u) return [u];
            A[a] = [d, c];
          }
        let l = "";
        for (let a = 0; a < A.length; a++) {
          let c,
            u,
            [d, g] = A[a];
          if (typeof d == "string") c = this.options;
          else if (zl(d)) {
            if (
              ((c = d),
              (d = c.value),
              delete c.value,
              typeof d != "string" && d !== void 0 && d !== null && u)
            )
              return [
                Error(
                  `Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(d)}`,
                ),
              ];
            if (((c = { ...this.options, ...c }), ([u, c] = Ii(c)), u !== void 0)) return [u];
          } else if (d == null) c = this.options;
          else
            return [
              Error(
                `Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(d)}`,
              ),
            ];
          const {
            delimiter: f,
            escape: h,
            quote: m,
            quoted: x,
            quoted_empty: j,
            quoted_string: v,
            quoted_match: y,
            record_delimiter: k,
            escape_formulas: V,
          } = c;
          if (d === "" && g === "") {
            let I = y && y.filter((z) => (typeof z == "string" ? d.indexOf(z) !== -1 : z.test(d)));
            (I = I && I.length > 0),
              (I || j === !0 || (v === !0 && j !== !1)) === !0 && (d = m + d + m),
              (l += d);
          } else if (d) {
            if (typeof d != "string")
              return [
                Error(
                  `Formatter must return a string, null or undefined, got ${JSON.stringify(d)}`,
                ),
              ];
            const I = f.length && d.indexOf(f) >= 0,
              M = m !== "" && d.indexOf(m) >= 0,
              z = d.indexOf(h) >= 0 && h !== m,
              W = d.indexOf(k) >= 0,
              G = v && typeof g == "string";
            let Y =
              y && y.filter((ee) => (typeof ee == "string" ? d.indexOf(ee) !== -1 : ee.test(d)));
            if (((Y = Y && Y.length > 0), V))
              switch (d[0]) {
                case "=":
                case "+":
                case "-":
                case "@":
                case "	":
                case "\r":
                case "＝":
                case "＋":
                case "－":
                case "＠":
                  d = `'${d}`;
                  break;
              }
            const le = M === !0 || I || W || x || G || Y;
            if (le === !0 && z === !0) {
              const ee = h === "\\" ? new RegExp(h + h, "g") : new RegExp(h, "g");
              d = d.replace(ee, h + h);
            }
            if (M === !0) {
              const ee = new RegExp(m, "g");
              d = d.replace(ee, h + m);
            }
            le === !0 && (d = m + d + m), (l += d);
          } else (j === !0 || (g === "" && v === !0 && j !== !1)) && (l += m + m);
          a !== A.length - 1 && (l += f);
        }
        return [void 0, l];
      },
      bom: function (r) {
        this.options.bom === !0 && r(Gl);
      },
      headers: function (r) {
        if (this.options.header === !1 || this.options.columns === void 0) return;
        let s,
          o = this.options.columns.map((A) => A.header);
        if (
          (this.options.eof
            ? (([s, o] = this.stringify(o, !0)), (o += this.options.record_delimiter))
            : ([s, o] = this.stringify(o)),
          s)
        )
          return s;
        r(o);
      },
      __cast: function (r, s) {
        const o = typeof r;
        try {
          return o === "string"
            ? [void 0, this.options.cast.string(r, s)]
            : o === "bigint"
              ? [void 0, this.options.cast.bigint(r, s)]
              : o === "number"
                ? [void 0, this.options.cast.number(r, s)]
                : o === "boolean"
                  ? [void 0, this.options.cast.boolean(r, s)]
                  : r instanceof Date
                    ? [void 0, this.options.cast.date(r, s)]
                    : o === "object" && r !== null
                      ? [void 0, this.options.cast.object(r, s)]
                      : [void 0, r, r];
        } catch (A) {
          return [A];
        }
      },
    };
  },
  Jl = function (e, t = {}) {
    const n = [],
      [r, s] = Ii(t);
    if (r !== void 0) throw r;
    const l = Yl(s, { stop: !1 }, { records: 0 });
    for (const a of e) {
      const c = l.__transform(a, function (u) {
        n.push(u);
      });
      if (c !== void 0) throw c;
    }
    if (n.length === 0) {
      l.bom((c) => {
        n.push(c);
      });
      const a = l.headers((c) => {
        n.push(c);
      });
      if (a !== void 0) throw a;
    }
    return n.join("");
  };
function ws(e) {
  return i.jsx(rt, { id: "character_tooltip", style: { position: "fixed" }, children: e });
}
const Kl = (e) => typeof e.getValue() == "number",
  Ql = (e, t) => {
    const { rows: n } = e.getCoreRowModel(),
      r = e.getHeaderGroups().map((c) => c.headers.map((u) => u.column.columnDef.header)),
      s = n.map((c) => c.getVisibleCells().map((u) => u.getValue()));
    console.log(r, s);
    const o = Jl([...r, ...s]),
      A = "csv",
      l = new Blob([o], { type: `text/${A};charset=utf8;` }),
      a = document.createElement("a");
    (a.download = t),
      (a.href = URL.createObjectURL(l)),
      a.setAttribute("visibility", "hidden"),
      document.body.appendChild(a),
      a.click(),
      document.body.removeChild(a);
  },
  yt = ({
    isFetching: e = !1,
    debugTable: t = !1,
    data: n = [],
    columns: r,
    striped: s = !1,
    hover: o = !1,
    initialState: A = void 0,
    exportFileName: l = void 0,
  }) => {
    let a = { pagination: { pageSize: 15 } };
    A !== void 0 && (a = A);
    const c = nl({
      data: n,
      columns: r,
      getCoreRowModel: qA(),
      getFilteredRowModel: GA(),
      getSortedRowModel: QA(),
      getPaginationRowModel: XA(),
      getFacetedRowModel: YA(),
      getFacetedUniqueValues: JA(),
      getFacetedMinMaxValues: KA(),
      debugTable: t,
      initialState: a,
    });
    return i.jsx(Zl, {
      table: c,
      data: n,
      columns: r,
      isFetching: e,
      debugTable: t,
      initialState: A,
      striped: s,
      hover: o,
      exportFileName: l,
    });
  };
function Zl({
  table: e,
  isFetching: t = !1,
  striped: n = !1,
  hover: r = !1,
  debugTable: s = !1,
  exportFileName: o = void 0,
}) {
  const { rows: A } = e.getRowModel(),
    l = ze(),
    a = typeof o < "u" ? o : `ExportedData_${l.pathname}`;
  return i.jsxs(i.Fragment, {
    children: [
      i.jsxs(Se, {
        striped: n,
        hover: r,
        children: [
          i.jsx("thead", {
            children: e.getHeaderGroups().map((c) =>
              i.jsxs(i.Fragment, {
                children: [
                  i.jsx(
                    "tr",
                    {
                      children: c.headers.map((u) =>
                        i.jsx(
                          "th",
                          {
                            colSpan: u.colSpan,
                            children: u.isPlaceholder
                              ? null
                              : i.jsxs("div", {
                                  className: u.column.getCanSort()
                                    ? "d-flex align-items-center cursor-pointer select-none"
                                    : "d-flex align-items-center",
                                  onClick: u.column.getToggleSortingHandler(),
                                  children: [
                                    u.column.getCanSort()
                                      ? i.jsx("div", {
                                          children:
                                            {
                                              asc: i.jsx("i", {
                                                className: "fas fa-sort-down fa-fw",
                                              }),
                                              desc: i.jsx("i", {
                                                className: "fas fa-sort-up fa-fw",
                                              }),
                                            }[u.column.getIsSorted()] ??
                                            i.jsx("i", { className: "fas fa-sort fa-fw" }),
                                        })
                                      : null,
                                    i.jsx("div", {
                                      children: hs(u.column.columnDef.header, u.getContext()),
                                    }),
                                  ],
                                }),
                          },
                          u.id,
                        ),
                      ),
                    },
                    `name-${c.id}`,
                  ),
                  i.jsx(
                    "tr",
                    {
                      children: c.headers.map((u) =>
                        i.jsx(
                          "th",
                          {
                            colSpan: u.colSpan,
                            children:
                              u.column.getCanFilter() && A.length >= 0
                                ? i.jsx(cA, { column: u.column, table: e })
                                : i.jsx(i.Fragment, {}),
                          },
                          u.id,
                        ),
                      ),
                    },
                    `filter-${c.id}`,
                  ),
                ],
              }),
            ),
          }),
          i.jsx("tbody", {
            children: A.map((c) =>
              i.jsx(
                "tr",
                {
                  children: c.getVisibleCells().map((u) =>
                    i.jsx(
                      "td",
                      {
                        style: { verticalAlign: "middle", textAlign: Kl(u) ? "right" : "left" },
                        children: hs(u.column.columnDef.cell, u.getContext()),
                      },
                      u.id,
                    ),
                  ),
                },
                c.id,
              ),
            ),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "d-flex justify-content-between",
        children: [
          i.jsxs(_e, {
            style: { zIndex: 0 },
            children: [
              i.jsx(B, {
                active: !0,
                variant: "info",
                children: i.jsxs(i.Fragment, {
                  children: [e.getState().pagination.pageIndex + 1, " of ", e.getPageCount()],
                }),
              }),
              t
                ? i.jsx(ae, {
                    placement: "bottom",
                    trigger: "focus",
                    overlay: ws("Refreshing Data"),
                    children: i.jsx(B, {
                      variant: "info",
                      children: i.jsx("i", { className: Ko.refreshAnimate + " fas fa-sync" }),
                    }),
                  })
                : i.jsx(ae, {
                    placement: "bottom",
                    trigger: "focus",
                    overlay: ws("Data Loaded: " + new Date().toLocaleString()),
                    children: i.jsx(B, {
                      variant: "info",
                      children: i.jsx("i", { className: "far fa-check-circle" }),
                    }),
                  }),
              i.jsx(B, {
                active: !0,
                variant: "primary",
                onClick: () => Ql(e, a),
                children: "Export Table to CSV",
              }),
              " ",
            ],
          }),
          i.jsxs(Io, {
            children: [
              i.jsxs(_e, {
                style: { zIndex: 0 },
                children: [
                  i.jsx(B, {
                    variant: "success",
                    onClick: () => e.setPageIndex(0),
                    disabled: !e.getCanPreviousPage(),
                    children: i.jsx("i", { className: "fas fa-angle-double-left" }),
                  }),
                  " ",
                  i.jsx(B, {
                    variant: "success",
                    onClick: () => e.previousPage(),
                    disabled: !e.getCanPreviousPage(),
                    children: i.jsx("i", { className: "fas fa-caret-left" }),
                  }),
                  " ",
                  i.jsx(B, {
                    variant: "success",
                    onClick: () => e.nextPage(),
                    disabled: !e.getCanNextPage(),
                    children: i.jsx("i", { className: "fas fa-caret-right" }),
                  }),
                  i.jsx(B, {
                    variant: "success",
                    onClick: () => e.setPageIndex(e.getPageCount() - 1),
                    disabled: !e.getCanNextPage(),
                    children: i.jsx("i", { className: "fas fa-angle-double-right" }),
                  }),
                ],
              }),
              i.jsxs(_e, {
                style: { zIndex: 0 },
                className: "ms-1",
                children: [
                  i.jsx(B, { active: !0, variant: "success", children: "Page Size:" }),
                  " ",
                  i.jsx(To, {
                    id: "pageSizeDropdown",
                    variant: "success",
                    title: e.getState().pagination.pageSize,
                    children: [15, 30, 60, 100, 1e6].map((c) =>
                      i.jsxs(
                        ct.Item,
                        {
                          id: `${c}`,
                          eventKey: c,
                          onClick: (u) => {
                            console.log(u.target.id), e.setPageSize(Number(u.target.id));
                          },
                          children: ["Show ", c],
                        },
                        c,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      s &&
        i.jsxs("div", {
          className: "col-xs-12",
          children: [
            i.jsxs("div", { children: [e.getRowModel().rows.length, " Rows"] }),
            i.jsx("pre", { children: JSON.stringify(e.getState(), null, 2) }),
          ],
        }),
    ],
  });
}
const te = ({ data: e, isFetching: t, columns: n }) =>
  i.jsx(yt, { isFetching: t, columns: n, data: e });
/*! js-cookie v3.0.5 | MIT */ function Ot(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];
    for (var r in n) e[r] = n[r];
  }
  return e;
}
var Xl = {
  read: function (e) {
    return e[0] === '"' && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function (e) {
    return encodeURIComponent(e).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent,
    );
  },
};
function On(e, t) {
  function n(s, o, A) {
    if (!(typeof document > "u")) {
      (A = Ot({}, t, A)),
        typeof A.expires == "number" && (A.expires = new Date(Date.now() + A.expires * 864e5)),
        A.expires && (A.expires = A.expires.toUTCString()),
        (s = encodeURIComponent(s)
          .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
          .replace(/[()]/g, escape));
      var l = "";
      for (var a in A) A[a] && ((l += "; " + a), A[a] !== !0 && (l += "=" + A[a].split(";")[0]));
      return (document.cookie = s + "=" + e.write(o, s) + l);
    }
  }
  function r(s) {
    if (!(typeof document > "u" || (arguments.length && !s))) {
      for (
        var o = document.cookie ? document.cookie.split("; ") : [], A = {}, l = 0;
        l < o.length;
        l++
      ) {
        var a = o[l].split("="),
          c = a.slice(1).join("=");
        try {
          var u = decodeURIComponent(a[0]);
          if (((A[u] = e.read(c, u)), s === u)) break;
        } catch {}
      }
      return s ? A[s] : A;
    }
  }
  return Object.create(
    {
      set: n,
      get: r,
      remove: function (s, o) {
        n(s, "", Ot({}, o, { expires: -1 }));
      },
      withAttributes: function (s) {
        return On(this.converter, Ot({}, this.attributes, s));
      },
      withConverter: function (s) {
        return On(Ot({}, this.converter, s), this.attributes);
      },
    },
    { attributes: { value: Object.freeze(t) }, converter: { value: Object.freeze(e) } },
  );
}
var Ti = On(Xl, { path: "/" });
const $l = { "Content-Type": "application/json" },
  ec = /\{[^{}]+\}/g;
class tc extends Request {
  constructor(t, n) {
    super(t, n);
    for (const r in n) r in this || (this[r] = n[r]);
  }
}
function nc() {
  return Math.random().toString(36).slice(2, 11);
}
function rc(e) {
  let {
    baseUrl: t = "",
    fetch: n = globalThis.fetch,
    querySerializer: r,
    bodySerializer: s,
    headers: o,
    ...A
  } = { ...e };
  t.endsWith("/") && (t = t.substring(0, t.length - 1)), (o = Ss($l, o));
  const l = [];
  async function a(c, u) {
    const {
      fetch: d = n,
      headers: g,
      params: f = {},
      parseAs: h = "json",
      querySerializer: m,
      bodySerializer: x = s ?? ic,
      ...j
    } = u || {};
    let v = typeof r == "function" ? r : ys(r);
    m && (v = typeof m == "function" ? m : ys({ ...(typeof r == "object" ? r : {}), ...m }));
    const y = { redirect: "follow", ...A, ...j, headers: Ss(o, g, f.header) };
    y.body &&
      ((y.body = x(y.body)), y.body instanceof FormData && y.headers.delete("Content-Type"));
    let k,
      V,
      I = new tc(oc(c, { baseUrl: t, params: f, querySerializer: v }), y);
    if (l.length) {
      (k = nc()),
        (V = Object.freeze({
          baseUrl: t,
          fetch: d,
          parseAs: h,
          querySerializer: v,
          bodySerializer: x,
        }));
      for (const W of l)
        if (W && typeof W == "object" && typeof W.onRequest == "function") {
          const G = await W.onRequest({ request: I, schemaPath: c, params: f, options: V, id: k });
          if (G) {
            if (!(G instanceof Request))
              throw new Error("onRequest: must return new Request() when modifying the request");
            I = G;
          }
        }
    }
    let M = await d(I);
    if (l.length)
      for (let W = l.length - 1; W >= 0; W--) {
        const G = l[W];
        if (G && typeof G == "object" && typeof G.onResponse == "function") {
          const Y = await G.onResponse({
            request: I,
            response: M,
            schemaPath: c,
            params: f,
            options: V,
            id: k,
          });
          if (Y) {
            if (!(Y instanceof Response))
              throw new Error("onResponse: must return new Response() when modifying the response");
            M = Y;
          }
        }
      }
    if (M.status === 204 || M.headers.get("Content-Length") === "0")
      return M.ok ? { data: {}, response: M } : { error: {}, response: M };
    if (M.ok)
      return h === "stream" ? { data: M.body, response: M } : { data: await M[h](), response: M };
    let z = await M.text();
    try {
      z = JSON.parse(z);
    } catch {}
    return { error: z, response: M };
  }
  return {
    async GET(c, u) {
      return a(c, { ...u, method: "GET" });
    },
    async PUT(c, u) {
      return a(c, { ...u, method: "PUT" });
    },
    async POST(c, u) {
      return a(c, { ...u, method: "POST" });
    },
    async DELETE(c, u) {
      return a(c, { ...u, method: "DELETE" });
    },
    async OPTIONS(c, u) {
      return a(c, { ...u, method: "OPTIONS" });
    },
    async HEAD(c, u) {
      return a(c, { ...u, method: "HEAD" });
    },
    async PATCH(c, u) {
      return a(c, { ...u, method: "PATCH" });
    },
    async TRACE(c, u) {
      return a(c, { ...u, method: "TRACE" });
    },
    use(...c) {
      for (const u of c)
        if (u) {
          if (typeof u != "object" || !("onRequest" in u || "onResponse" in u))
            throw new Error(
              "Middleware must be an object with one of `onRequest()` or `onResponse()`",
            );
          l.push(u);
        }
    },
    eject(...c) {
      for (const u of c) {
        const d = l.indexOf(u);
        d !== -1 && l.splice(d, 1);
      }
    },
  };
}
function en(e, t, n) {
  if (t == null) return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.",
    );
  return `${e}=${(n == null ? void 0 : n.allowReserved) === !0 ? t : encodeURIComponent(t)}`;
}
function Di(e, t, n) {
  if (!t || typeof t != "object") return "";
  const r = [],
    s = { simple: ",", label: ".", matrix: ";" }[n.style] || "&";
  if (n.style !== "deepObject" && n.explode === !1) {
    for (const l in t) r.push(l, n.allowReserved === !0 ? t[l] : encodeURIComponent(t[l]));
    const A = r.join(",");
    switch (n.style) {
      case "form":
        return `${e}=${A}`;
      case "label":
        return `.${A}`;
      case "matrix":
        return `;${e}=${A}`;
      default:
        return A;
    }
  }
  for (const A in t) {
    const l = n.style === "deepObject" ? `${e}[${A}]` : A;
    r.push(en(l, t[A], n));
  }
  const o = r.join(s);
  return n.style === "label" || n.style === "matrix" ? `${s}${o}` : o;
}
function ki(e, t, n) {
  if (!Array.isArray(t)) return "";
  if (n.explode === !1) {
    const o = { form: ",", spaceDelimited: "%20", pipeDelimited: "|" }[n.style] || ",",
      A = (n.allowReserved === !0 ? t : t.map((l) => encodeURIComponent(l))).join(o);
    switch (n.style) {
      case "simple":
        return A;
      case "label":
        return `.${A}`;
      case "matrix":
        return `;${e}=${A}`;
      default:
        return `${e}=${A}`;
    }
  }
  const r = { simple: ",", label: ".", matrix: ";" }[n.style] || "&",
    s = [];
  for (const o of t)
    n.style === "simple" || n.style === "label"
      ? s.push(n.allowReserved === !0 ? o : encodeURIComponent(o))
      : s.push(en(e, o, n));
  return n.style === "label" || n.style === "matrix" ? `${r}${s.join(r)}` : s.join(r);
}
function ys(e) {
  return function (n) {
    const r = [];
    if (n && typeof n == "object")
      for (const s in n) {
        const o = n[s];
        if (o != null) {
          if (Array.isArray(o)) {
            r.push(
              ki(s, o, {
                style: "form",
                explode: !0,
                ...(e == null ? void 0 : e.array),
                allowReserved: (e == null ? void 0 : e.allowReserved) || !1,
              }),
            );
            continue;
          }
          if (typeof o == "object") {
            r.push(
              Di(s, o, {
                style: "deepObject",
                explode: !0,
                ...(e == null ? void 0 : e.object),
                allowReserved: (e == null ? void 0 : e.allowReserved) || !1,
              }),
            );
            continue;
          }
          r.push(en(s, o, e));
        }
      }
    return r.join("&");
  };
}
function sc(e, t) {
  let n = e;
  for (const r of e.match(ec) ?? []) {
    let s = r.substring(1, r.length - 1),
      o = !1,
      A = "simple";
    if (
      (s.endsWith("*") && ((o = !0), (s = s.substring(0, s.length - 1))),
      s.startsWith(".")
        ? ((A = "label"), (s = s.substring(1)))
        : s.startsWith(";") && ((A = "matrix"), (s = s.substring(1))),
      !t || t[s] === void 0 || t[s] === null)
    )
      continue;
    const l = t[s];
    if (Array.isArray(l)) {
      n = n.replace(r, ki(s, l, { style: A, explode: o }));
      continue;
    }
    if (typeof l == "object") {
      n = n.replace(r, Di(s, l, { style: A, explode: o }));
      continue;
    }
    if (A === "matrix") {
      n = n.replace(r, `;${en(s, l)}`);
      continue;
    }
    n = n.replace(r, A === "label" ? `.${encodeURIComponent(l)}` : encodeURIComponent(l));
  }
  return n;
}
function ic(e) {
  return JSON.stringify(e);
}
function oc(e, t) {
  var s;
  let n = `${t.baseUrl}${e}`;
  (s = t.params) != null && s.path && (n = sc(n, t.params.path));
  let r = t.querySerializer(t.params.query ?? {});
  return r.startsWith("?") && (r = r.substring(1)), r && (n += `?${r}`), n;
}
function Ss(...e) {
  const t = new Headers();
  for (const n of e) {
    if (!n || typeof n != "object") continue;
    const r = n instanceof Headers ? n.entries() : Object.entries(n);
    for (const [s, o] of r)
      if (o === null) t.delete(s);
      else if (Array.isArray(o)) for (const A of o) t.append(s, A);
      else o !== void 0 && t.set(s, o);
  }
  return t;
}
const er = () => {
  const e = Ti.get("csrftoken");
  return rc({ baseUrl: "/", headers: { "x-csrftoken": e || "" } });
};
function Bi(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: Ac } = Object.prototype,
  { getPrototypeOf: tr } = Object,
  tn = ((e) => (t) => {
    const n = Ac.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  Ce = (e) => ((e = e.toLowerCase()), (t) => tn(t) === e),
  nn = (e) => (t) => typeof t === e,
  { isArray: st } = Array,
  mt = nn("undefined");
function lc(e) {
  return (
    e !== null &&
    !mt(e) &&
    e.constructor !== null &&
    !mt(e.constructor) &&
    ge(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const Pi = Ce("ArrayBuffer");
function cc(e) {
  let t;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && Pi(e.buffer)),
    t
  );
}
const ac = nn("string"),
  ge = nn("function"),
  Mi = nn("number"),
  rn = (e) => e !== null && typeof e == "object",
  uc = (e) => e === !0 || e === !1,
  Ht = (e) => {
    if (tn(e) !== "object") return !1;
    const t = tr(e);
    return (
      (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) &&
      !(Symbol.toStringTag in e) &&
      !(Symbol.iterator in e)
    );
  },
  dc = Ce("Date"),
  fc = Ce("File"),
  gc = Ce("Blob"),
  hc = Ce("FileList"),
  mc = (e) => rn(e) && ge(e.pipe),
  pc = (e) => {
    let t;
    return (
      e &&
      ((typeof FormData == "function" && e instanceof FormData) ||
        (ge(e.append) &&
          ((t = tn(e)) === "formdata" ||
            (t === "object" && ge(e.toString) && e.toString() === "[object FormData]"))))
    );
  },
  xc = Ce("URLSearchParams"),
  jc = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
function St(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let r, s;
  if ((typeof e != "object" && (e = [e]), st(e)))
    for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      A = o.length;
    let l;
    for (r = 0; r < A; r++) (l = o[r]), t.call(null, e[l], l, e);
  }
}
function Vi(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length,
    s;
  for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
  return null;
}
const Li =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : global,
  Hi = (e) => !mt(e) && e !== Li;
function In() {
  const { caseless: e } = (Hi(this) && this) || {},
    t = {},
    n = (r, s) => {
      const o = (e && Vi(t, s)) || s;
      Ht(t[o]) && Ht(r)
        ? (t[o] = In(t[o], r))
        : Ht(r)
          ? (t[o] = In({}, r))
          : st(r)
            ? (t[o] = r.slice())
            : (t[o] = r);
    };
  for (let r = 0, s = arguments.length; r < s; r++) arguments[r] && St(arguments[r], n);
  return t;
}
const wc = (e, t, n, { allOwnKeys: r } = {}) => (
    St(
      t,
      (s, o) => {
        n && ge(s) ? (e[o] = Bi(s, n)) : (e[o] = s);
      },
      { allOwnKeys: r },
    ),
    e
  ),
  yc = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  Sc = (e, t, n, r) => {
    (e.prototype = Object.create(t.prototype, r)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, "super", { value: t.prototype }),
      n && Object.assign(e.prototype, n);
  },
  vc = (e, t, n, r) => {
    let s, o, A;
    const l = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
        (A = s[o]), (!r || r(A, e, t)) && !l[A] && ((t[A] = e[A]), (l[A] = !0));
      e = n !== !1 && tr(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  },
  Cc = (e, t, n) => {
    (e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length);
    const r = e.indexOf(t, n);
    return r !== -1 && r === n;
  },
  Fc = (e) => {
    if (!e) return null;
    if (st(e)) return e;
    let t = e.length;
    if (!Mi(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; ) n[t] = e[t];
    return n;
  },
  Rc = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < "u" && tr(Uint8Array)),
  bc = (e, t) => {
    const r = (e && e[Symbol.iterator]).call(e);
    let s;
    for (; (s = r.next()) && !s.done; ) {
      const o = s.value;
      t.call(e, o[0], o[1]);
    }
  },
  Ec = (e, t) => {
    let n;
    const r = [];
    for (; (n = e.exec(t)) !== null; ) r.push(n);
    return r;
  },
  Nc = Ce("HTMLFormElement"),
  Oc = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, s) {
      return r.toUpperCase() + s;
    }),
  vs = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  Ic = Ce("RegExp"),
  Ui = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      r = {};
    St(n, (s, o) => {
      let A;
      (A = t(s, o, e)) !== !1 && (r[o] = A || s);
    }),
      Object.defineProperties(e, r);
  },
  Tc = (e) => {
    Ui(e, (t, n) => {
      if (ge(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1) return !1;
      const r = e[n];
      if (ge(r)) {
        if (((t.enumerable = !1), "writable" in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'");
          });
      }
    });
  },
  Dc = (e, t) => {
    const n = {},
      r = (s) => {
        s.forEach((o) => {
          n[o] = !0;
        });
      };
    return st(e) ? r(e) : r(String(e).split(t)), n;
  },
  kc = () => {},
  Bc = (e, t) => ((e = +e), Number.isFinite(e) ? e : t),
  mn = "abcdefghijklmnopqrstuvwxyz",
  Cs = "0123456789",
  _i = { DIGIT: Cs, ALPHA: mn, ALPHA_DIGIT: mn + mn.toUpperCase() + Cs },
  Pc = (e = 16, t = _i.ALPHA_DIGIT) => {
    let n = "";
    const { length: r } = t;
    for (; e--; ) n += t[(Math.random() * r) | 0];
    return n;
  };
function Mc(e) {
  return !!(e && ge(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const Vc = (e) => {
    const t = new Array(10),
      n = (r, s) => {
        if (rn(r)) {
          if (t.indexOf(r) >= 0) return;
          if (!("toJSON" in r)) {
            t[s] = r;
            const o = st(r) ? [] : {};
            return (
              St(r, (A, l) => {
                const a = n(A, s + 1);
                !mt(a) && (o[l] = a);
              }),
              (t[s] = void 0),
              o
            );
          }
        }
        return r;
      };
    return n(e, 0);
  },
  Lc = Ce("AsyncFunction"),
  Hc = (e) => e && (rn(e) || ge(e)) && ge(e.then) && ge(e.catch),
  p = {
    isArray: st,
    isArrayBuffer: Pi,
    isBuffer: lc,
    isFormData: pc,
    isArrayBufferView: cc,
    isString: ac,
    isNumber: Mi,
    isBoolean: uc,
    isObject: rn,
    isPlainObject: Ht,
    isUndefined: mt,
    isDate: dc,
    isFile: fc,
    isBlob: gc,
    isRegExp: Ic,
    isFunction: ge,
    isStream: mc,
    isURLSearchParams: xc,
    isTypedArray: Rc,
    isFileList: hc,
    forEach: St,
    merge: In,
    extend: wc,
    trim: jc,
    stripBOM: yc,
    inherits: Sc,
    toFlatObject: vc,
    kindOf: tn,
    kindOfTest: Ce,
    endsWith: Cc,
    toArray: Fc,
    forEachEntry: bc,
    matchAll: Ec,
    isHTMLForm: Nc,
    hasOwnProperty: vs,
    hasOwnProp: vs,
    reduceDescriptors: Ui,
    freezeMethods: Tc,
    toObjectSet: Dc,
    toCamelCase: Oc,
    noop: kc,
    toFiniteNumber: Bc,
    findKey: Vi,
    global: Li,
    isContextDefined: Hi,
    ALPHABET: _i,
    generateString: Pc,
    isSpecCompliantForm: Mc,
    toJSONObject: Vc,
    isAsyncFn: Lc,
    isThenable: Hc,
  };
function U(e, t, n, r, s) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = "AxiosError"),
    t && (this.code = t),
    n && (this.config = n),
    r && (this.request = r),
    s && (this.response = s);
}
p.inherits(U, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: p.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null,
    };
  },
});
const qi = U.prototype,
  zi = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((e) => {
  zi[e] = { value: e };
});
Object.defineProperties(U, zi);
Object.defineProperty(qi, "isAxiosError", { value: !0 });
U.from = (e, t, n, r, s, o) => {
  const A = Object.create(qi);
  return (
    p.toFlatObject(
      e,
      A,
      function (a) {
        return a !== Error.prototype;
      },
      (l) => l !== "isAxiosError",
    ),
    U.call(A, e.message, t, n, r, s),
    (A.cause = e),
    (A.name = e.name),
    o && Object.assign(A, o),
    A
  );
};
const Uc = null;
function Tn(e) {
  return p.isPlainObject(e) || p.isArray(e);
}
function Wi(e) {
  return p.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Fs(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (s, o) {
          return (s = Wi(s)), !n && o ? "[" + s + "]" : s;
        })
        .join(n ? "." : "")
    : t;
}
function _c(e) {
  return p.isArray(e) && !e.some(Tn);
}
const qc = p.toFlatObject(p, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function sn(e, t, n) {
  if (!p.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new FormData()),
    (n = p.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (m, x) {
      return !p.isUndefined(x[m]);
    }));
  const r = n.metaTokens,
    s = n.visitor || u,
    o = n.dots,
    A = n.indexes,
    a = (n.Blob || (typeof Blob < "u" && Blob)) && p.isSpecCompliantForm(t);
  if (!p.isFunction(s)) throw new TypeError("visitor must be a function");
  function c(h) {
    if (h === null) return "";
    if (p.isDate(h)) return h.toISOString();
    if (!a && p.isBlob(h)) throw new U("Blob is not supported. Use a Buffer instead.");
    return p.isArrayBuffer(h) || p.isTypedArray(h)
      ? a && typeof Blob == "function"
        ? new Blob([h])
        : Buffer.from(h)
      : h;
  }
  function u(h, m, x) {
    let j = h;
    if (h && !x && typeof h == "object") {
      if (p.endsWith(m, "{}")) (m = r ? m : m.slice(0, -2)), (h = JSON.stringify(h));
      else if (
        (p.isArray(h) && _c(h)) ||
        ((p.isFileList(h) || p.endsWith(m, "[]")) && (j = p.toArray(h)))
      )
        return (
          (m = Wi(m)),
          j.forEach(function (y, k) {
            !(p.isUndefined(y) || y === null) &&
              t.append(A === !0 ? Fs([m], k, o) : A === null ? m : m + "[]", c(y));
          }),
          !1
        );
    }
    return Tn(h) ? !0 : (t.append(Fs(x, m, o), c(h)), !1);
  }
  const d = [],
    g = Object.assign(qc, { defaultVisitor: u, convertValue: c, isVisitable: Tn });
  function f(h, m) {
    if (!p.isUndefined(h)) {
      if (d.indexOf(h) !== -1) throw Error("Circular reference detected in " + m.join("."));
      d.push(h),
        p.forEach(h, function (j, v) {
          (!(p.isUndefined(j) || j === null) &&
            s.call(t, j, p.isString(v) ? v.trim() : v, m, g)) === !0 && f(j, m ? m.concat(v) : [v]);
        }),
        d.pop();
    }
  }
  if (!p.isObject(e)) throw new TypeError("data must be an object");
  return f(e), t;
}
function Rs(e) {
  const t = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0" };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
    return t[r];
  });
}
function nr(e, t) {
  (this._pairs = []), e && sn(e, this, t);
}
const Gi = nr.prototype;
Gi.append = function (t, n) {
  this._pairs.push([t, n]);
};
Gi.toString = function (t) {
  const n = t
    ? function (r) {
        return t.call(this, r, Rs);
      }
    : Rs;
  return this._pairs
    .map(function (s) {
      return n(s[0]) + "=" + n(s[1]);
    }, "")
    .join("&");
};
function zc(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function Yi(e, t, n) {
  if (!t) return e;
  const r = (n && n.encode) || zc,
    s = n && n.serialize;
  let o;
  if (
    (s ? (o = s(t, n)) : (o = p.isURLSearchParams(t) ? t.toString() : new nr(t, n).toString(r)), o)
  ) {
    const A = e.indexOf("#");
    A !== -1 && (e = e.slice(0, A)), (e += (e.indexOf("?") === -1 ? "?" : "&") + o);
  }
  return e;
}
class bs {
  constructor() {
    this.handlers = [];
  }
  use(t, n, r) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    p.forEach(this.handlers, function (r) {
      r !== null && t(r);
    });
  }
}
const Ji = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
  Wc = typeof URLSearchParams < "u" ? URLSearchParams : nr,
  Gc = typeof FormData < "u" ? FormData : null,
  Yc = typeof Blob < "u" ? Blob : null,
  Jc = {
    isBrowser: !0,
    classes: { URLSearchParams: Wc, FormData: Gc, Blob: Yc },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  Ki = typeof window < "u" && typeof document < "u",
  Kc = ((e) => Ki && ["ReactNative", "NativeScript", "NS"].indexOf(e) < 0)(
    typeof navigator < "u" && navigator.product,
  ),
  Qc =
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function",
  Zc = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: Ki,
        hasStandardBrowserEnv: Kc,
        hasStandardBrowserWebWorkerEnv: Qc,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  ),
  ye = { ...Zc, ...Jc };
function Xc(e, t) {
  return sn(
    e,
    new ye.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (n, r, s, o) {
          return ye.isNode && p.isBuffer(n)
            ? (this.append(r, n.toString("base64")), !1)
            : o.defaultVisitor.apply(this, arguments);
        },
      },
      t,
    ),
  );
}
function $c(e) {
  return p.matchAll(/\w+|\[(\w*)]/g, e).map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function ea(e) {
  const t = {},
    n = Object.keys(e);
  let r;
  const s = n.length;
  let o;
  for (r = 0; r < s; r++) (o = n[r]), (t[o] = e[o]);
  return t;
}
function Qi(e) {
  function t(n, r, s, o) {
    let A = n[o++];
    if (A === "__proto__") return !0;
    const l = Number.isFinite(+A),
      a = o >= n.length;
    return (
      (A = !A && p.isArray(s) ? s.length : A),
      a
        ? (p.hasOwnProp(s, A) ? (s[A] = [s[A], r]) : (s[A] = r), !l)
        : ((!s[A] || !p.isObject(s[A])) && (s[A] = []),
          t(n, r, s[A], o) && p.isArray(s[A]) && (s[A] = ea(s[A])),
          !l)
    );
  }
  if (p.isFormData(e) && p.isFunction(e.entries)) {
    const n = {};
    return (
      p.forEachEntry(e, (r, s) => {
        t($c(r), s, n, 0);
      }),
      n
    );
  }
  return null;
}
function ta(e, t, n) {
  if (p.isString(e))
    try {
      return (t || JSON.parse)(e), p.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError") throw r;
    }
  return (n || JSON.stringify)(e);
}
const vt = {
  transitional: Ji,
  adapter: ["xhr", "http"],
  transformRequest: [
    function (t, n) {
      const r = n.getContentType() || "",
        s = r.indexOf("application/json") > -1,
        o = p.isObject(t);
      if ((o && p.isHTMLForm(t) && (t = new FormData(t)), p.isFormData(t)))
        return s ? JSON.stringify(Qi(t)) : t;
      if (p.isArrayBuffer(t) || p.isBuffer(t) || p.isStream(t) || p.isFile(t) || p.isBlob(t))
        return t;
      if (p.isArrayBufferView(t)) return t.buffer;
      if (p.isURLSearchParams(t))
        return (
          n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString()
        );
      let l;
      if (o) {
        if (r.indexOf("application/x-www-form-urlencoded") > -1)
          return Xc(t, this.formSerializer).toString();
        if ((l = p.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
          const a = this.env && this.env.FormData;
          return sn(l ? { "files[]": t } : t, a && new a(), this.formSerializer);
        }
      }
      return o || s ? (n.setContentType("application/json", !1), ta(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || vt.transitional,
        r = n && n.forcedJSONParsing,
        s = this.responseType === "json";
      if (t && p.isString(t) && ((r && !this.responseType) || s)) {
        const A = !(n && n.silentJSONParsing) && s;
        try {
          return JSON.parse(t);
        } catch (l) {
          if (A)
            throw l.name === "SyntaxError"
              ? U.from(l, U.ERR_BAD_RESPONSE, this, null, this.response)
              : l;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: ye.classes.FormData, Blob: ye.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: { common: { Accept: "application/json, text/plain, */*", "Content-Type": void 0 } },
};
p.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  vt.headers[e] = {};
});
const na = p.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  ra = (e) => {
    const t = {};
    let n, r, s;
    return (
      e &&
        e
          .split(
            `
`,
          )
          .forEach(function (A) {
            (s = A.indexOf(":")),
              (n = A.substring(0, s).trim().toLowerCase()),
              (r = A.substring(s + 1).trim()),
              !(!n || (t[n] && na[n])) &&
                (n === "set-cookie"
                  ? t[n]
                    ? t[n].push(r)
                    : (t[n] = [r])
                  : (t[n] = t[n] ? t[n] + ", " + r : r));
          }),
      t
    );
  },
  Es = Symbol("internals");
function At(e) {
  return e && String(e).trim().toLowerCase();
}
function Ut(e) {
  return e === !1 || e == null ? e : p.isArray(e) ? e.map(Ut) : String(e);
}
function sa(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; (r = n.exec(e)); ) t[r[1]] = r[2];
  return t;
}
const ia = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function pn(e, t, n, r, s) {
  if (p.isFunction(r)) return r.call(this, t, n);
  if ((s && (t = n), !!p.isString(t))) {
    if (p.isString(r)) return t.indexOf(r) !== -1;
    if (p.isRegExp(r)) return r.test(t);
  }
}
function oa(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function Aa(e, t) {
  const n = p.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function (s, o, A) {
        return this[r].call(this, t, s, o, A);
      },
      configurable: !0,
    });
  });
}
let he = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function o(l, a, c) {
      const u = At(a);
      if (!u) throw new Error("header name must be a non-empty string");
      const d = p.findKey(s, u);
      (!d || s[d] === void 0 || c === !0 || (c === void 0 && s[d] !== !1)) && (s[d || a] = Ut(l));
    }
    const A = (l, a) => p.forEach(l, (c, u) => o(c, u, a));
    return (
      p.isPlainObject(t) || t instanceof this.constructor
        ? A(t, n)
        : p.isString(t) && (t = t.trim()) && !ia(t)
          ? A(ra(t), n)
          : t != null && o(n, t, r),
      this
    );
  }
  get(t, n) {
    if (((t = At(t)), t)) {
      const r = p.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n) return s;
        if (n === !0) return sa(s);
        if (p.isFunction(n)) return n.call(this, s, r);
        if (p.isRegExp(n)) return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (((t = At(t)), t)) {
      const r = p.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || pn(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function o(A) {
      if (((A = At(A)), A)) {
        const l = p.findKey(r, A);
        l && (!n || pn(r, r[l], l, n)) && (delete r[l], (s = !0));
      }
    }
    return p.isArray(t) ? t.forEach(o) : o(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length,
      s = !1;
    for (; r--; ) {
      const o = n[r];
      (!t || pn(this, this[o], o, t, !0)) && (delete this[o], (s = !0));
    }
    return s;
  }
  normalize(t) {
    const n = this,
      r = {};
    return (
      p.forEach(this, (s, o) => {
        const A = p.findKey(r, o);
        if (A) {
          (n[A] = Ut(s)), delete n[o];
          return;
        }
        const l = t ? oa(o) : String(o).trim();
        l !== o && delete n[o], (n[l] = Ut(s)), (r[l] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = Object.create(null);
    return (
      p.forEach(this, (r, s) => {
        r != null && r !== !1 && (n[s] = t && p.isArray(r) ? r.join(", ") : r);
      }),
      n
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[Es] = this[Es] = { accessors: {} }).accessors,
      s = this.prototype;
    function o(A) {
      const l = At(A);
      r[l] || (Aa(s, A), (r[l] = !0));
    }
    return p.isArray(t) ? t.forEach(o) : o(t), this;
  }
};
he.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
p.reduceDescriptors(he.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    },
  };
});
p.freezeMethods(he);
function xn(e, t) {
  const n = this || vt,
    r = t || n,
    s = he.from(r.headers);
  let o = r.data;
  return (
    p.forEach(e, function (l) {
      o = l.call(n, o, s.normalize(), t ? t.status : void 0);
    }),
    s.normalize(),
    o
  );
}
function Zi(e) {
  return !!(e && e.__CANCEL__);
}
function Ct(e, t, n) {
  U.call(this, e ?? "canceled", U.ERR_CANCELED, t, n), (this.name = "CanceledError");
}
p.inherits(Ct, U, { __CANCEL__: !0 });
function la(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status)
    ? e(n)
    : t(
        new U(
          "Request failed with status code " + n.status,
          [U.ERR_BAD_REQUEST, U.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
          n.config,
          n.request,
          n,
        ),
      );
}
const ca = ye.hasStandardBrowserEnv
  ? {
      write(e, t, n, r, s, o) {
        const A = [e + "=" + encodeURIComponent(t)];
        p.isNumber(n) && A.push("expires=" + new Date(n).toGMTString()),
          p.isString(r) && A.push("path=" + r),
          p.isString(s) && A.push("domain=" + s),
          o === !0 && A.push("secure"),
          (document.cookie = A.join("; "));
      },
      read(e) {
        const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
        return t ? decodeURIComponent(t[3]) : null;
      },
      remove(e) {
        this.write(e, "", Date.now() - 864e5);
      },
    }
  : {
      write() {},
      read() {
        return null;
      },
      remove() {},
    };
function aa(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function ua(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Xi(e, t) {
  return e && !aa(t) ? ua(e, t) : t;
}
const da = ye.hasStandardBrowserEnv
  ? (function () {
      const t = /(msie|trident)/i.test(navigator.userAgent),
        n = document.createElement("a");
      let r;
      function s(o) {
        let A = o;
        return (
          t && (n.setAttribute("href", A), (A = n.href)),
          n.setAttribute("href", A),
          {
            href: n.href,
            protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
            host: n.host,
            search: n.search ? n.search.replace(/^\?/, "") : "",
            hash: n.hash ? n.hash.replace(/^#/, "") : "",
            hostname: n.hostname,
            port: n.port,
            pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname,
          }
        );
      }
      return (
        (r = s(window.location.href)),
        function (A) {
          const l = p.isString(A) ? s(A) : A;
          return l.protocol === r.protocol && l.host === r.host;
        }
      );
    })()
  : (function () {
      return function () {
        return !0;
      };
    })();
function fa(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function ga(e, t) {
  e = e || 10;
  const n = new Array(e),
    r = new Array(e);
  let s = 0,
    o = 0,
    A;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (a) {
      const c = Date.now(),
        u = r[o];
      A || (A = c), (n[s] = a), (r[s] = c);
      let d = o,
        g = 0;
      for (; d !== s; ) (g += n[d++]), (d = d % e);
      if (((s = (s + 1) % e), s === o && (o = (o + 1) % e), c - A < t)) return;
      const f = u && c - u;
      return f ? Math.round((g * 1e3) / f) : void 0;
    }
  );
}
function Ns(e, t) {
  let n = 0;
  const r = ga(50, 250);
  return (s) => {
    const o = s.loaded,
      A = s.lengthComputable ? s.total : void 0,
      l = o - n,
      a = r(l),
      c = o <= A;
    n = o;
    const u = {
      loaded: o,
      total: A,
      progress: A ? o / A : void 0,
      bytes: l,
      rate: a || void 0,
      estimated: a && A && c ? (A - o) / a : void 0,
      event: s,
    };
    (u[t ? "download" : "upload"] = !0), e(u);
  };
}
const ha = typeof XMLHttpRequest < "u",
  ma =
    ha &&
    function (e) {
      return new Promise(function (n, r) {
        let s = e.data;
        const o = he.from(e.headers).normalize();
        let { responseType: A, withXSRFToken: l } = e,
          a;
        function c() {
          e.cancelToken && e.cancelToken.unsubscribe(a),
            e.signal && e.signal.removeEventListener("abort", a);
        }
        let u;
        if (p.isFormData(s)) {
          if (ye.hasStandardBrowserEnv || ye.hasStandardBrowserWebWorkerEnv) o.setContentType(!1);
          else if ((u = o.getContentType()) !== !1) {
            const [m, ...x] = u
              ? u
                  .split(";")
                  .map((j) => j.trim())
                  .filter(Boolean)
              : [];
            o.setContentType([m || "multipart/form-data", ...x].join("; "));
          }
        }
        let d = new XMLHttpRequest();
        if (e.auth) {
          const m = e.auth.username || "",
            x = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
          o.set("Authorization", "Basic " + btoa(m + ":" + x));
        }
        const g = Xi(e.baseURL, e.url);
        d.open(e.method.toUpperCase(), Yi(g, e.params, e.paramsSerializer), !0),
          (d.timeout = e.timeout);
        function f() {
          if (!d) return;
          const m = he.from("getAllResponseHeaders" in d && d.getAllResponseHeaders()),
            j = {
              data: !A || A === "text" || A === "json" ? d.responseText : d.response,
              status: d.status,
              statusText: d.statusText,
              headers: m,
              config: e,
              request: d,
            };
          la(
            function (y) {
              n(y), c();
            },
            function (y) {
              r(y), c();
            },
            j,
          ),
            (d = null);
        }
        if (
          ("onloadend" in d
            ? (d.onloadend = f)
            : (d.onreadystatechange = function () {
                !d ||
                  d.readyState !== 4 ||
                  (d.status === 0 && !(d.responseURL && d.responseURL.indexOf("file:") === 0)) ||
                  setTimeout(f);
              }),
          (d.onabort = function () {
            d && (r(new U("Request aborted", U.ECONNABORTED, e, d)), (d = null));
          }),
          (d.onerror = function () {
            r(new U("Network Error", U.ERR_NETWORK, e, d)), (d = null);
          }),
          (d.ontimeout = function () {
            let x = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
            const j = e.transitional || Ji;
            e.timeoutErrorMessage && (x = e.timeoutErrorMessage),
              r(new U(x, j.clarifyTimeoutError ? U.ETIMEDOUT : U.ECONNABORTED, e, d)),
              (d = null);
          }),
          ye.hasStandardBrowserEnv &&
            (l && p.isFunction(l) && (l = l(e)), l || (l !== !1 && da(g))))
        ) {
          const m = e.xsrfHeaderName && e.xsrfCookieName && ca.read(e.xsrfCookieName);
          m && o.set(e.xsrfHeaderName, m);
        }
        s === void 0 && o.setContentType(null),
          "setRequestHeader" in d &&
            p.forEach(o.toJSON(), function (x, j) {
              d.setRequestHeader(j, x);
            }),
          p.isUndefined(e.withCredentials) || (d.withCredentials = !!e.withCredentials),
          A && A !== "json" && (d.responseType = e.responseType),
          typeof e.onDownloadProgress == "function" &&
            d.addEventListener("progress", Ns(e.onDownloadProgress, !0)),
          typeof e.onUploadProgress == "function" &&
            d.upload &&
            d.upload.addEventListener("progress", Ns(e.onUploadProgress)),
          (e.cancelToken || e.signal) &&
            ((a = (m) => {
              d && (r(!m || m.type ? new Ct(null, e, d) : m), d.abort(), (d = null));
            }),
            e.cancelToken && e.cancelToken.subscribe(a),
            e.signal && (e.signal.aborted ? a() : e.signal.addEventListener("abort", a)));
        const h = fa(g);
        if (h && ye.protocols.indexOf(h) === -1) {
          r(new U("Unsupported protocol " + h + ":", U.ERR_BAD_REQUEST, e));
          return;
        }
        d.send(s || null);
      });
    },
  Dn = { http: Uc, xhr: ma };
p.forEach(Dn, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {}
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const Os = (e) => `- ${e}`,
  pa = (e) => p.isFunction(e) || e === null || e === !1,
  $i = {
    getAdapter: (e) => {
      e = p.isArray(e) ? e : [e];
      const { length: t } = e;
      let n, r;
      const s = {};
      for (let o = 0; o < t; o++) {
        n = e[o];
        let A;
        if (((r = n), !pa(n) && ((r = Dn[(A = String(n)).toLowerCase()]), r === void 0)))
          throw new U(`Unknown adapter '${A}'`);
        if (r) break;
        s[A || "#" + o] = r;
      }
      if (!r) {
        const o = Object.entries(s).map(
          ([l, a]) =>
            `adapter ${l} ` +
            (a === !1 ? "is not supported by the environment" : "is not available in the build"),
        );
        let A = t
          ? o.length > 1
            ? `since :
` +
              o.map(Os).join(`
`)
            : " " + Os(o[0])
          : "as no adapter specified";
        throw new U("There is no suitable adapter to dispatch the request " + A, "ERR_NOT_SUPPORT");
      }
      return r;
    },
    adapters: Dn,
  };
function jn(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
    throw new Ct(null, e);
}
function Is(e) {
  return (
    jn(e),
    (e.headers = he.from(e.headers)),
    (e.data = xn.call(e, e.transformRequest)),
    ["post", "put", "patch"].indexOf(e.method) !== -1 &&
      e.headers.setContentType("application/x-www-form-urlencoded", !1),
    $i
      .getAdapter(e.adapter || vt.adapter)(e)
      .then(
        function (r) {
          return (
            jn(e),
            (r.data = xn.call(e, e.transformResponse, r)),
            (r.headers = he.from(r.headers)),
            r
          );
        },
        function (r) {
          return (
            Zi(r) ||
              (jn(e),
              r &&
                r.response &&
                ((r.response.data = xn.call(e, e.transformResponse, r.response)),
                (r.response.headers = he.from(r.response.headers)))),
            Promise.reject(r)
          );
        },
      )
  );
}
const Ts = (e) => (e instanceof he ? e.toJSON() : e);
function Xe(e, t) {
  t = t || {};
  const n = {};
  function r(c, u, d) {
    return p.isPlainObject(c) && p.isPlainObject(u)
      ? p.merge.call({ caseless: d }, c, u)
      : p.isPlainObject(u)
        ? p.merge({}, u)
        : p.isArray(u)
          ? u.slice()
          : u;
  }
  function s(c, u, d) {
    if (p.isUndefined(u)) {
      if (!p.isUndefined(c)) return r(void 0, c, d);
    } else return r(c, u, d);
  }
  function o(c, u) {
    if (!p.isUndefined(u)) return r(void 0, u);
  }
  function A(c, u) {
    if (p.isUndefined(u)) {
      if (!p.isUndefined(c)) return r(void 0, c);
    } else return r(void 0, u);
  }
  function l(c, u, d) {
    if (d in t) return r(c, u);
    if (d in e) return r(void 0, c);
  }
  const a = {
    url: o,
    method: o,
    data: o,
    baseURL: A,
    transformRequest: A,
    transformResponse: A,
    paramsSerializer: A,
    timeout: A,
    timeoutMessage: A,
    withCredentials: A,
    withXSRFToken: A,
    adapter: A,
    responseType: A,
    xsrfCookieName: A,
    xsrfHeaderName: A,
    onUploadProgress: A,
    onDownloadProgress: A,
    decompress: A,
    maxContentLength: A,
    maxBodyLength: A,
    beforeRedirect: A,
    transport: A,
    httpAgent: A,
    httpsAgent: A,
    cancelToken: A,
    socketPath: A,
    responseEncoding: A,
    validateStatus: l,
    headers: (c, u) => s(Ts(c), Ts(u), !0),
  };
  return (
    p.forEach(Object.keys(Object.assign({}, e, t)), function (u) {
      const d = a[u] || s,
        g = d(e[u], t[u], u);
      (p.isUndefined(g) && d !== l) || (n[u] = g);
    }),
    n
  );
}
const eo = "1.6.7",
  rr = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  rr[e] = function (r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Ds = {};
rr.transitional = function (t, n, r) {
  function s(o, A) {
    return "[Axios v" + eo + "] Transitional option '" + o + "'" + A + (r ? ". " + r : "");
  }
  return (o, A, l) => {
    if (t === !1) throw new U(s(A, " has been removed" + (n ? " in " + n : "")), U.ERR_DEPRECATED);
    return (
      n &&
        !Ds[A] &&
        ((Ds[A] = !0),
        console.warn(
          s(A, " has been deprecated since v" + n + " and will be removed in the near future"),
        )),
      t ? t(o, A, l) : !0
    );
  };
};
function xa(e, t, n) {
  if (typeof e != "object") throw new U("options must be an object", U.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const o = r[s],
      A = t[o];
    if (A) {
      const l = e[o],
        a = l === void 0 || A(l, o, e);
      if (a !== !0) throw new U("option " + o + " must be " + a, U.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0) throw new U("Unknown option " + o, U.ERR_BAD_OPTION);
  }
}
const kn = { assertOptions: xa, validators: rr },
  Ne = kn.validators;
let qe = class {
  constructor(t) {
    (this.defaults = t), (this.interceptors = { request: new bs(), response: new bs() });
  }
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s;
        Error.captureStackTrace ? Error.captureStackTrace((s = {})) : (s = new Error());
        const o = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        r.stack
          ? o &&
            !String(r.stack).endsWith(o.replace(/^.+\n.+\n/, "")) &&
            (r.stack +=
              `
` + o)
          : (r.stack = o);
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}), (n = Xe(this.defaults, n));
    const { transitional: r, paramsSerializer: s, headers: o } = n;
    r !== void 0 &&
      kn.assertOptions(
        r,
        {
          silentJSONParsing: Ne.transitional(Ne.boolean),
          forcedJSONParsing: Ne.transitional(Ne.boolean),
          clarifyTimeoutError: Ne.transitional(Ne.boolean),
        },
        !1,
      ),
      s != null &&
        (p.isFunction(s)
          ? (n.paramsSerializer = { serialize: s })
          : kn.assertOptions(s, { encode: Ne.function, serialize: Ne.function }, !0)),
      (n.method = (n.method || this.defaults.method || "get").toLowerCase());
    let A = o && p.merge(o.common, o[n.method]);
    o &&
      p.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (h) => {
        delete o[h];
      }),
      (n.headers = he.concat(A, o));
    const l = [];
    let a = !0;
    this.interceptors.request.forEach(function (m) {
      (typeof m.runWhen == "function" && m.runWhen(n) === !1) ||
        ((a = a && m.synchronous), l.unshift(m.fulfilled, m.rejected));
    });
    const c = [];
    this.interceptors.response.forEach(function (m) {
      c.push(m.fulfilled, m.rejected);
    });
    let u,
      d = 0,
      g;
    if (!a) {
      const h = [Is.bind(this), void 0];
      for (h.unshift.apply(h, l), h.push.apply(h, c), g = h.length, u = Promise.resolve(n); d < g; )
        u = u.then(h[d++], h[d++]);
      return u;
    }
    g = l.length;
    let f = n;
    for (d = 0; d < g; ) {
      const h = l[d++],
        m = l[d++];
      try {
        f = h(f);
      } catch (x) {
        m.call(this, x);
        break;
      }
    }
    try {
      u = Is.call(this, f);
    } catch (h) {
      return Promise.reject(h);
    }
    for (d = 0, g = c.length; d < g; ) u = u.then(c[d++], c[d++]);
    return u;
  }
  getUri(t) {
    t = Xe(this.defaults, t);
    const n = Xi(t.baseURL, t.url);
    return Yi(n, t.params, t.paramsSerializer);
  }
};
p.forEach(["delete", "get", "head", "options"], function (t) {
  qe.prototype[t] = function (n, r) {
    return this.request(Xe(r || {}, { method: t, url: n, data: (r || {}).data }));
  };
});
p.forEach(["post", "put", "patch"], function (t) {
  function n(r) {
    return function (o, A, l) {
      return this.request(
        Xe(l || {}, {
          method: t,
          headers: r ? { "Content-Type": "multipart/form-data" } : {},
          url: o,
          data: A,
        }),
      );
    };
  }
  (qe.prototype[t] = n()), (qe.prototype[t + "Form"] = n(!0));
});
let ja = class to {
  constructor(t) {
    if (typeof t != "function") throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function (o) {
      n = o;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let o = r._listeners.length;
      for (; o-- > 0; ) r._listeners[o](s);
      r._listeners = null;
    }),
      (this.promise.then = (s) => {
        let o;
        const A = new Promise((l) => {
          r.subscribe(l), (o = l);
        }).then(s);
        return (
          (A.cancel = function () {
            r.unsubscribe(o);
          }),
          A
        );
      }),
      t(function (o, A, l) {
        r.reason || ((r.reason = new Ct(o, A, l)), n(r.reason));
      });
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  static source() {
    let t;
    return {
      token: new to(function (s) {
        t = s;
      }),
      cancel: t,
    };
  }
};
function wa(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function ya(e) {
  return p.isObject(e) && e.isAxiosError === !0;
}
const Bn = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(Bn).forEach(([e, t]) => {
  Bn[t] = e;
});
function no(e) {
  const t = new qe(e),
    n = Bi(qe.prototype.request, t);
  return (
    p.extend(n, qe.prototype, t, { allOwnKeys: !0 }),
    p.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (s) {
      return no(Xe(e, s));
    }),
    n
  );
}
const E = no(vt);
E.Axios = qe;
E.CanceledError = Ct;
E.CancelToken = ja;
E.isCancel = Zi;
E.VERSION = eo;
E.toFormData = sn;
E.AxiosError = U;
E.Cancel = E.CanceledError;
E.all = function (t) {
  return Promise.all(t);
};
E.spread = wa;
E.isAxiosError = ya;
E.mergeConfig = Xe;
E.AxiosHeaders = he;
E.formToJSON = (e) => Qi(p.isHTMLForm(e) ? new FormData(e) : e);
E.getAdapter = $i.getAdapter;
E.HttpStatusCode = Bn;
E.default = E;
const {
  Axios: vh,
  AxiosError: Ch,
  CanceledError: Fh,
  isCancel: Rh,
  CancelToken: bh,
  VERSION: Eh,
  all: Nh,
  Cancel: Oh,
  isAxiosError: Ih,
  spread: Th,
  toFormData: Dh,
  AxiosHeaders: kh,
  HttpStatusCode: Bh,
  formToJSON: Ph,
  getAdapter: Mh,
  mergeConfig: Vh,
} = E;
E.defaults.xsrfHeaderName = "X-CSRFToken";
async function de(e, t) {
  const { GET: n } = er(),
    { data: r, error: s } = await n(e, { params: { path: { character_id: t } } });
  if (s) console.log(s);
  else return console.log(r), r;
}
async function Sa(e) {
  return de("/audit/api/account/{character_id}/contacts", e);
}
async function va(e) {
  return de("/audit/api/account/{character_id}/loyalty", e);
}
async function Ca(e) {
  return de("/audit/api/account/{character_id}/notifications", e);
}
async function Fa(e) {
  return de("/audit/api/account/{character_id}/clones", e);
}
async function Ra(e) {
  return de("/audit/api/account/{character_id}/roles", e);
}
async function ba(e) {
  return de("/audit/api/account/{character_id}/glance/assets", e);
}
async function Ea(e) {
  return de("/audit/api/account/{character_id}/glance/activities", e);
}
async function Na(e) {
  return de("/audit/api/account/{character_id}/glance/faction", e);
}
async function Oa(e) {
  return de("/audit/api/account/{character_id}/market", e);
}
async function Ia(e) {
  return de("/audit/api/account/{character_id}/contracts", e);
}
async function Ta(e) {
  return de("/audit/api/account/{character_id}/skills", e);
}
async function Da(e) {
  return de("/audit/api/account/{character_id}/skillqueues", e);
}
async function ka(e) {
  return de("/audit/api/account/{character_id}/doctrines", e);
}
async function Ba() {
  const { GET: e } = er(),
    { data: t, error: n } = await e("/audit/api/account/list");
  if (n) console.log(n);
  else return console.log(t), t;
}
async function Pa(e, t) {
  const { GET: n } = er(),
    { data: r, error: s } = await n(
      "/audit/api/account/{character_id}/asset/{location_id}/groups",
      { params: { path: { character_id: e, location_id: t } } },
    );
  if (s) console.log(s);
  else return console.log(r), r;
}
async function sr(e) {
  const t = await E.get(`/audit/api/account/${e}/status`);
  console.log(`got character status from api for '${e}'`);
  const n = Array.from(
    new Set(
      t.data.characters.reduce((s, o) => {
        try {
          return s.concat(Object.keys(o.last_updates));
        } catch {
          return s;
        }
      }, []),
    ),
  );
  return n.sort(), { characters: t.data.characters, main: t.data.main, headers: n };
}
async function Ma(e) {
  const t = await E.get(`/audit/api/account/${e}/pubdata`);
  return console.log(`get pubdata in api ${e}`), { characters: t.data };
}
async function Va(e) {
  const t = await E.get(`/audit/api/account/${e}/mail`);
  return console.log(`get Contracts in api ${e}`), t.data;
}
async function La(e, t) {
  if ((console.log(`sent postMailBody ${e}, ${t}`), !e && !t)) return {};
  const n = await E.get(`/audit/api/account/${e}/mail/${t}`);
  return console.log(`search mail body in api ${e}, ${t}`), n.data;
}
async function Ha(e) {
  const t = await E.get(`/audit/api/account/${e}/mining?look_back=150`);
  return console.log(`get mining in api ${e}`), t.data;
}
async function Ua(e) {
  return (
    console.log(`sent account refresh ${e}`),
    (
      await E.post(
        `/audit/api/account/refresh?character_id=${e}`,
        { character_id: e },
        { headers: { "X-CSRFToken": Ti.get("csrftoken") } },
      )
    ).data
  );
}
async function _a(e, t) {
  const n = await E.get(`/audit/api/account/${e}/asset/${t}/list`);
  return console.log(`get asset list in api ${e} ${t}`), n.data;
}
async function qa(e) {
  const t = await E.get(`/audit/api/account/${e}/asset/locations`);
  return console.log(`get asset locations in api ${e}`), t.data;
}
async function za(e) {
  const t = await E.get(`/audit/api/account/${e}/wallet`);
  return console.log(`get wallet in api ${e}`), t.data.items;
}
async function Wa(e) {
  const t = await E.get(`/audit/api/account/${e}/wallet/activity`);
  return console.log(`get wallet activity in api ${e}`), t.data;
}
const Ga = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isFetching: r } = O({
        queryKey: ["contacts", t],
        queryFn: () => Ba(),
        refetchOnWindowFocus: !1,
      }),
      s = Z(),
      o = [
        s.accessor("main.character_name", {
          header: e("Character"),
          cell: (A) =>
            i.jsxs("div", {
              className: "text-nowrap",
              children: [
                i.jsx(Gn, { size: 32, character_id: A.row.original.main.character_id }),
                " ",
                A.getValue(),
              ],
            }),
        }),
        s.accessor("main.corporation_name", {
          header: e("Main Corporation"),
          cell: (A) =>
            i.jsxs("div", {
              className: "text-nowrap",
              children: [
                i.jsx(De, { size: 32, corporation_id: A.row.original.main.corporation_id }),
                " ",
                A.getValue(),
              ],
            }),
        }),
        s.accessor("characters", {
          header: e("Characters"),
          cell: (A) => {
            var l;
            return A.getValue()
              ? i.jsx("div", {
                  className: "d-flex flex-wrap text-center ",
                  children:
                    (l = A == null ? void 0 : A.getValue()) == null
                      ? void 0
                      : l.map((a) =>
                          i.jsx("span", {
                            className: `badge mx-1 my-1 text-body padded-label aa-callout-sm aa-callout aa-callout-${a.active ? "success" : "danger"}`,
                            children: a.character.character_name,
                          }),
                        ),
                })
              : i.jsx(i.Fragment, {});
          },
          filterFn: (A, l, a) => {
            var c, u;
            if (a) {
              let d =
                (u = (c = A.original) == null ? void 0 : c.characters) == null
                  ? void 0
                  : u.reduce((g, f) => g + "  " + f.character.character_name, "");
              return d ? d.toLowerCase().includes(a.toLowerCase()) : !1;
            } else return !0;
          },
        }),
        s.accessor("main", {
          header: "",
          enableColumnFilter: !1,
          enableSorting: !1,
          cell: (A) =>
            A.getValue()
              ? i.jsx(jt, {
                  className: "btn btn-primary",
                  to: { pathname: `/audit/r/${A.getValue().character_id}/` },
                  children: i.jsx("i", {
                    className: "fas fa-external-link",
                    "aria-hidden": "true",
                  }),
                })
              : i.jsx(i.Fragment, {}),
        }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { data: n, isFetching: r, columns: o }) });
  },
  Ya = {
    option: (e) => ({ ...e, color: "black" }),
    menu: (e) => ({ ...e, zIndex: 9999 }),
    menuList: (e) => ({ ...e, zIndex: 9999 }),
    menuPortal: (e) => ({ ...e, zIndex: 9999 }),
  },
  ro = ({ characterID: e, setLocation: t }) => {
    const { isLoading: n, data: r } = O(["asset_loc", e], () => qa(e), {
      refetchOnWindowFocus: !1,
    });
    return i.jsx(wt, { isLoading: n, styles: Ya, options: r, onChange: (s) => t(s.value) });
  },
  Ja = "_flexContainer_1gi6e_1",
  Ka = "_errorAnim_1gi6e_33",
  Qa = "_ldsDualRing_1gi6e_38",
  $e = { flexContainer: Ja, errorAnim: Ka, ldsDualRing: Qa },
  Za = ({ className: e = "" }) => i.jsx("div", { className: e + " " + $e.ldsDualRing }),
  oe = (e = { title: "Loading..." }) =>
    i.jsx("div", {
      className: $e.flexContainer,
      children: i.jsxs("div", {
        className: "text-center",
        children: [
          i.jsx(Za, {}),
          i.jsx("h3", { children: e.title && e.title }),
          i.jsx("p", { children: e.message && e.message }),
        ],
      }),
    }),
  et = (e = { title: "Error Loading Component" }) =>
    i.jsx("div", {
      className: $e.flexContainer,
      children: i.jsxs("div", {
        className: "text-center",
        children: [
          i.jsx("div", {
            className: $e.errorAnim,
            children: i.jsxs("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "100",
              height: "100",
              fill: "currentColor",
              className: "bi bi-exclamation-triangle",
              viewBox: "0 0 16 16",
              children: [
                i.jsx("path", {
                  d: "M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z",
                }),
                i.jsx("path", {
                  d: "M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z",
                }),
              ],
            }),
          }),
          i.jsx("h3", { children: e.title && e.title }),
          i.jsx("p", { children: e.message && e.message }),
          i.jsx("p", {}),
        ],
      }),
    }),
  pt = (e = { title: "Select Corporation" }) =>
    i.jsx("div", {
      className: $e.flexContainer,
      children: i.jsxs("div", {
        className: "text-center",
        children: [
          i.jsx("div", {
            className: $e.arrorAnim,
            children: i.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "100",
              height: "100",
              fill: "currentColor",
              className: "bi bi-arrow-up-short arrow-anim",
              viewBox: "0 0 16 16",
              children: i.jsx("path", {
                "fill-rule": "evenodd",
                d: "M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z",
              }),
            }),
          }),
          i.jsx("h3", { children: e.title && e.title }),
          i.jsx("p", { children: e.message && e.message }),
        ],
      }),
    }),
  so = ({ data: e }) => {
    const { t } = b();
    return i.jsx("div", {
      className: "d-flex flex-wrap justify-content-evenly",
      children:
        e == null
          ? void 0
          : e.map((n) => {
              var r;
              return i.jsxs(
                S,
                {
                  className: "m-3",
                  children: [
                    i.jsx(S.Header, { children: i.jsx(S.Title, { children: n.name }) }),
                    i.jsxs(S.Body, {
                      style: { height: "500px", overflowY: "scroll" },
                      children: [
                        i.jsx(Se, {
                          striped: !0,
                          style: { marginBottom: 0, minWidth: "400px" },
                          children: i.jsx("thead", {
                            children: i.jsxs(
                              "tr",
                              {
                                children: [
                                  i.jsx("th", { children: t("Group") }),
                                  i.jsx("th", { className: "text-end", children: t("Count") }),
                                ],
                              },
                              "head " + n.name,
                            ),
                          }),
                        }),
                        i.jsx("div", {
                          className: "table-div",
                          children: i.jsx(Se, {
                            striped: !0,
                            children: i.jsx("tbody", {
                              children:
                                (r = n == null ? void 0 : n.items) == null
                                  ? void 0
                                  : r.map((s) =>
                                      i.jsxs(
                                        "tr",
                                        {
                                          children: [
                                            i.jsx("td", { children: s.label }),
                                            i.jsx("td", {
                                              className: "text-end no-wrap",
                                              children: s.value.toLocaleString(),
                                            }),
                                          ],
                                        },
                                        n.name + " " + s.label + " " + s.value,
                                      ),
                                    ),
                            }),
                          }),
                        }),
                      ],
                    }),
                  ],
                },
                n.name,
              );
            }),
    });
  },
  Xa = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(0),
      { data: s, isFetching: o } = O({
        queryKey: ["assetGroups", t, n],
        queryFn: () => Pa(Number(t), Number(n)),
        refetchOnWindowFocus: !1,
      });
    return (
      console.log(o),
      i.jsxs(i.Fragment, {
        children: [
          i.jsxs("div", {
            className: "m-3 d-flex align-items-center",
            children: [
              i.jsx("h5", { className: "me-1", children: e("Location Filter") }),
              i.jsx("div", {
                className: "flex-grow-1",
                children: i.jsx(ro, { characterID: t ? Number(t) : 0, setLocation: r }),
              }),
            ],
          }),
          o
            ? i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") })
            : i.jsx(so, { data: s }),
        ],
      })
    );
  },
  $a = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(0),
      { data: s, isFetching: o } = O({
        queryKey: ["assetList", t, n],
        queryFn: () => _a(Number(t), n),
        refetchOnWindowFocus: !1,
        initialData: { characters: [], main: void 0, headers: [] },
      }),
      A = Z(),
      l = [
        A.accessor("character.character_name", { header: e("Character") }),
        A.accessor("item.name", { header: e("Item Type") }),
        A.accessor("item.cat", { header: e("Category") }),
        A.accessor("quantity", {
          header: e("Quantity"),
          cell: (a) => `${a.getValue().toLocaleString()}`,
        }),
        A.accessor("location.name", { header: e("Location") }),
      ];
    return i.jsxs(i.Fragment, {
      children: [
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center",
          children: [
            i.jsx("h5", { className: "me-1", children: e("Location Filter") }),
            i.jsx("div", {
              className: "flex-grow-1",
              children: i.jsx(ro, { characterID: t ? Number(t) : 0, setLocation: r }),
            }),
          ],
        }),
        i.jsx(te, { isFetching: o, data: s, columns: l }),
      ],
    });
  },
  eu = "_menuRefreshSpin_17lcv_1",
  tu = { menuRefreshSpin: eu },
  nu = () => {
    const { characterID: e } = q(),
      { refetch: t, isFetching: n } = O("my_key", () => Ua(e ? Number(e) : 0), {
        refetchOnWindowFocus: !1,
        enabled: !1,
      });
    async function r() {
      return await t();
    }
    return i.jsx(B, {
      className: "btn-success",
      onClick: r,
      children: i.jsx("i", { className: `fa-solid fa-refresh ${n && tu.menuRefreshSpin}` }),
    });
  };
function ks({ message: e }) {
  return i.jsx(rt, { id: "character_tooltip", style: { position: "fixed" }, children: e });
}
const ru = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      n = { borderRadius: "25%" },
      { data: r } = O(["status", t], () => sr(t ? Number(t) : 0), { refetchOnWindowFocus: !1 }),
      s =
        r == null
          ? void 0
          : r.characters.filter((o) => !o.active).map((o) => o.character.character_name);
    return i.jsx(S, {
      children: i.jsxs("div", {
        className: "d-flex justify-content-start align-items-center flex-no-wrap",
        children: [
          i.jsx(Gn, {
            style: { borderRadius: "0.375rem 0 0 0.375rem" },
            className: "m-0",
            character_id: r == null ? void 0 : r.main.character_id,
            size: 64,
          }),
          i.jsx("h4", {
            className: "m-1 mx-3",
            children: r == null ? void 0 : r.main.character_name,
          }),
          i.jsx(De, {
            style: n,
            className: "m-1 mx-3",
            corporation_id: r == null ? void 0 : r.main.corporation_id,
            size: 32,
          }),
          i.jsx("h5", {
            className: "m-1 mx-3",
            children: r == null ? void 0 : r.main.corporation_name,
          }),
          (r == null ? void 0 : r.main.alliance_id) &&
            i.jsxs(i.Fragment, {
              children: [
                i.jsx(ri, {
                  style: n,
                  className: "m-1 mx-3",
                  alliance_id: r == null ? void 0 : r.main.alliance_id,
                  size: 32,
                }),
                i.jsx("h5", {
                  className: "m-1 mx-3",
                  children: r == null ? void 0 : r.main.alliance_name,
                }),
              ],
            }),
          i.jsxs(_e, {
            className: "me-3 ms-auto",
            children: [
              i.jsx(nu, {}),
              r
                ? s.length === 0
                  ? i.jsx(ae, {
                      placement: "left",
                      overlay: ks({ message: e("No Account Flags") }),
                      children: i.jsx(B, {
                        className: "btn-success",
                        children: i.jsx("i", { className: "fa-solid fa-check" }),
                      }),
                    })
                  : i.jsx(ae, {
                      placement: "left",
                      overlay: ks({ message: e(`Character Flags: ${s.join(", ")}`) }),
                      children: i.jsx(B, { className: "btn-danger", children: s.length }),
                    })
                : i.jsx(i.Fragment, {}),
            ],
          }),
        ],
      }),
    });
  },
  su = ({ cat: e }) => {
    var r, s;
    const t = ze(),
      n =
        (r = e.links) == null
          ? void 0
          : r.reduce((o, A) => (o = o || t.pathname.includes(A.link)), !1);
    return (
      console.log(t, n, e),
      i.jsx(
        Ze,
        {
          as: "li",
          active: n,
          id: e.name,
          title: e.name,
          children:
            (s = e.links) == null
              ? void 0
              : s.map((o) => i.jsx(se.Item, { as: "li", children: i.jsx(iu, { link: o }) })),
        },
        e.name,
      )
    );
  },
  iu = ({ link: e }) => {
    const t = ze(),
      { characterID: n } = q(),
      r = t.pathname.endsWith(e.link);
    return i.jsx(se.Item, {
      as: "li",
      children: i.jsx(
        Ze.Item,
        { as: jt, to: `/audit/r/${n}/${e.link}`, id: e.name, active: r, children: e.name },
        e.name,
      ),
    });
  },
  Pn = ({ link: e }) => {
    const t = ze(),
      { characterID: n } = q(),
      r = t.pathname.endsWith(e.link);
    return i.jsx(se.Item, {
      as: "li",
      children: i.jsx(
        se.Link,
        { as: jt, to: `/audit/r/${n}/${e.link}`, id: e.name, active: r, children: e.name },
        e.name,
      ),
    });
  },
  ou = ({ data: e }) => {
    const { t } = b(),
      n = { name: t("Overview"), link: "account/overview" };
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(Pn, { link: n }),
        e &&
          e.map((r) =>
            r.links
              ? i.jsx(su, { cat: r })
              : i.jsx(i.Fragment, {
                  children: r.link.startsWith("/")
                    ? i.jsx(se.Item, {
                        as: "li",
                        children: i.jsx(
                          se.Link,
                          {
                            id: r.name,
                            href: r.link,
                            children: i.jsx(i.Fragment, { children: r.name }),
                          },
                          r.name,
                        ),
                      })
                    : i.jsx(Pn, { link: r.link }),
                }),
          ),
      ],
    });
  },
  Bs = document.getElementById("nav-left"),
  Au = () => {
    const {
      isLoading: e,
      error: t,
      data: n,
    } = O({
      queryKey: ["Menu"],
      queryFn: async () => (await E.get("/audit/api/account/menu")).data,
      refetchOnWindowFocus: !1,
    });
    return Bs
      ? Jt.createPortal(i.jsx(ou, { error: !!t, isLoading: e, data: n }), Bs)
      : i.jsx(i.Fragment, {});
  },
  lu = "_menuRefreshSpin_17lcv_1",
  cu = { menuRefreshSpin: lu },
  It = document.getElementById("nav-right"),
  au = () => {
    const { t: e } = b(),
      t = Xs(),
      [n, r] = ie.useState(!1);
    ie.useEffect(() => {
      n || (It && ((It.innerHTML = ""), r(!0)));
    }, [n]);
    const s = { link: "account/list", name: e("Account List") };
    return n
      ? It
        ? Jt.createPortal(
            i.jsxs(i.Fragment, {
              children: [
                t
                  ? i.jsx(i.Fragment, {
                      children: i.jsx(se.Link, {
                        children: i.jsx("i", {
                          className: `fas fa-sync-alt fa-fw ${cu.menuRefreshSpin}`,
                        }),
                      }),
                    })
                  : i.jsx(i.Fragment, {}),
                i.jsx(se.Item, {
                  as: "li",
                  children: i.jsx(
                    se.Link,
                    { href: "/audit/char/add/", children: e("Add Character") },
                    "Add Character",
                  ),
                }),
                i.jsx(Pn, { link: s }),
              ],
            }),
            It,
          )
        : i.jsx(i.Fragment, {})
      : null;
  };
class We extends R.Component {
  constructor(t) {
    super(t), (this.state = { hasError: !1, message: "", trace: "" });
  }
  componentDidCatch(t, n) {
    console.error("ErrorBoundary caught an error: ", t, n),
      this.setState({
        hasError: !0,
        title: t.name,
        message: t.message,
        trace: String(n.componentStack),
      });
  }
  render() {
    return this.state.hasError
      ? i.jsxs(i.Fragment, {
          children: [
            i.jsx(et, { title: this.state.title, message: this.state.message }),
            i.jsxs("p", {
              className: "text-center",
              children: [
                "You should not be seeing this message",
                i.jsx("br", {}),
                "Please report this in the Corp Tools Channel on the",
                " ",
                i.jsx("a", {
                  href: "https://discord.gg/fjnHAmk",
                  children: "Alliance Auth Discord",
                }),
                " or create an issue on",
                " ",
                i.jsx("a", {
                  href: "https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools",
                  children: "GitHub",
                }),
                ".",
              ],
            }),
            i.jsx("div", {
              style: { justifyContent: "center" },
              className: "d-flex",
              children: i.jsx("pre", {
                style: { maxWidth: "1000px" },
                className: "border",
                children: this.state.trace,
              }),
            }),
          ],
        })
      : this.props.children;
  }
}
const uu = () =>
    i.jsxs(i.Fragment, {
      children: [
        i.jsx(Au, {}),
        i.jsx(au, {}),
        i.jsx(ru, {}),
        i.jsx(ti, {
          children: i.jsx("div", {
            className: "mt-4",
            children: i.jsxs(We, { children: [i.jsx(ni, {}), " "] }),
          }),
        }),
      ],
    }),
  du = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = ie.useState(!1),
      [s, o] = ie.useState(null),
      { data: A, isFetching: l } = O({
        queryKey: ["clones", t],
        queryFn: () => Fa(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      a = Z(),
      c = [
        a.accessor("character.character_name", { header: e("Character") }),
        a.accessor("home.name", { header: e("Home") }),
        a.accessor("last_clone_jump", { header: e("Last Jump") }),
        a.accessor("last_station_change", { header: e("Last Station Change") }),
        a.accessor("clones", {
          header: e("Clones"),
          cell: (u) => {
            const d = u.getValue();
            return i.jsx(i.Fragment, {
              children: i.jsxs(Se, {
                children: [
                  i.jsx("thead", {
                    children: i.jsxs("tr", {
                      children: [
                        i.jsx("th", { children: e("Location") }),
                        i.jsx("th", { className: "text-end pe-2", children: e("Implants") }),
                      ],
                    }),
                  }),
                  i.jsx("tbody", {
                    children:
                      d == null
                        ? void 0
                        : d.map((g) => {
                            var f, h, m;
                            return i.jsxs(i.Fragment, {
                              children: [
                                i.jsx("tr", {
                                  className: "align-items-center",
                                  children: i.jsxs("td", {
                                    colSpan: 2,
                                    style: { verticalAlign: "middle" },
                                    className: "border-0",
                                    children: [
                                      g.name,
                                      " ",
                                      (f = g.location) == null ? void 0 : f.name,
                                    ],
                                  }),
                                }),
                                i.jsx("tr", {
                                  className: "align-items-center",
                                  children: i.jsx("td", {
                                    colSpan: 2,
                                    style: { verticalAlign: "middle" },
                                    children: i.jsxs("div", {
                                      className: "d-flex justify-content-end align-items-center",
                                      children: [
                                        (h = g.implants) != null && h.length
                                          ? g.implants.map((x) =>
                                              i.jsx(ht, {
                                                textContent: x.name,
                                                type_id: x.id,
                                                size: 32,
                                              }),
                                            )
                                          : i.jsxs(i.Fragment, {
                                              children: [
                                                e("No Implants"),
                                                i.jsx("i", {
                                                  className: "ms-2 fa-regular fa-circle-xmark pe-2",
                                                }),
                                              ],
                                            }),
                                        (m = g.implants) != null && m.length
                                          ? i.jsx(B, {
                                              variant: "primary",
                                              size: "sm",
                                              onClick: () => {
                                                o(g), r(!0);
                                              },
                                              children: i.jsx("i", {
                                                className: "fa-solid fa-info",
                                              }),
                                            })
                                          : i.jsx(i.Fragment, {}),
                                      ],
                                    }),
                                  }),
                                }),
                              ],
                            });
                          }),
                  }),
                ],
              }),
            });
          },
        }),
      ];
    return (
      console.log(s),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx(te, { data: A, isFetching: l, columns: c }),
          (s == null ? void 0 : s.implants) &&
            i.jsxs(_, {
              size: "lg",
              show: n,
              onHide: () => {
                r(!1);
              },
              children: [
                i.jsx(_.Header, { closeButton: !0, children: e("Implant Details") }),
                i.jsx(_.Body, {
                  children: i.jsx("div", {
                    children: i.jsx(Se, {
                      striped: !0,
                      style: { marginBottom: 0 },
                      children: i.jsx("tbody", {
                        children:
                          s == null
                            ? void 0
                            : s.implants.map((u) =>
                                i.jsxs(
                                  "tr",
                                  {
                                    children: [
                                      i.jsx("td", {
                                        className: "text-end",
                                        children: i.jsx(ht, {
                                          textContent: u.name,
                                          type_id: u.id,
                                          size: 32,
                                        }),
                                      }),
                                      i.jsx("td", { className: "text-start", children: u.name }),
                                    ],
                                  },
                                  u.name,
                                ),
                              ),
                      }),
                    }),
                  }),
                }),
                i.jsx(_.Footer, {
                  children: i.jsx(B, {
                    variant: "secondary",
                    className: "w-100",
                    onClick: () => {
                      r(!1);
                    },
                    children: e("Close"),
                  }),
                }),
              ],
            }),
        ],
      })
    );
  },
  Ue = ({ checked: e }) =>
    e
      ? i.jsx(B, { variant: "success", children: i.jsx("i", { className: "fa-solid fa-check" }) })
      : i.jsx(B, {
          variant: "secondary",
          children: i.jsx("i", { className: "fa-solid fa-xmark" }),
        }),
  fu = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(!0),
      { data: s, isFetching: o } = O({
        queryKey: ["contacts", t],
        queryFn: () => Sa(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      A = Z(),
      l = [
        A.accessor("character.character_name", { header: e("Character") }),
        A.accessor("contact.name", {
          header: e("Contact"),
          cell: (c) =>
            i.jsxs(i.Fragment, {
              children: [
                c.getValue(),
                " ",
                c.row.original.contact.id <= 4e6 && i.jsx($, { children: "NPC" }),
              ],
            }),
        }),
        A.accessor("blocked", {
          header: e("Blocked"),
          cell: (c) => i.jsx(Ue, { checked: c.getValue() }),
        }),
        A.accessor("watched", {
          header: e("Watching"),
          cell: (c) => i.jsx(Ue, { checked: c.getValue() }),
        }),
        A.accessor("standing", { header: "Standing" }),
        A.accessor("contact.cat", { header: "Type" }),
      ],
      a = s == null ? void 0 : s.filter((c) => (n ? !0 : c.contact.id > 4e6));
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(S.Header, {
          className: "text-end",
          children: i.jsx("div", {
            className: "d-flex justify-content-end",
            children: i.jsx(J.Check, {
              type: "switch",
              id: "custom-switch",
              label: "Show NPC Contacts",
              onChange: (c) => {
                r(c.target.checked);
              },
              defaultChecked: n,
            }),
          }),
        }),
        i.jsx(te, { data: a, isFetching: o, columns: l }),
      ],
    });
  };
function K({ strValue: e, text: t, valuePre: n = "", valuePost: r = "", children: s }) {
  return e || s
    ? i.jsxs("tr", {
        className: "m-0",
        children: [
          i.jsx("td", {
            className: "m-0",
            children: i.jsx("p", { className: "text-end m-0 py-0", children: t }),
          }),
          i.jsxs("td", {
            style: { paddingLeft: "10px" },
            className: "m-0",
            children: [
              e && i.jsxs("p", { className: "m-0 py-0", children: [n, " ", e, " ", r] }),
              s,
            ],
          }),
        ],
      })
    : i.jsx(i.Fragment, {});
}
function Te({ dateStrValue: e, text: t, valuePre: n = "", valuePost: r = "" }) {
  return e
    ? i.jsx(K, { strValue: new Date(e).toLocaleString(), text: t, valuePre: n, valuePost: r })
    : i.jsx(i.Fragment, {});
}
function gu({ intValue: e, text: t, valuePre: n = "", valuePost: r = "" }) {
  return e !== 0
    ? i.jsx(K, { strValue: e.toLocaleString(), text: t, valuePre: n, valuePost: r })
    : i.jsx(i.Fragment, {});
}
function Oe({ strValue: e, text: t, valuePre: n = "", valuePost: r = "" }) {
  let s = parseInt(e);
  return e ? i.jsx(gu, { intValue: s, text: t, valuePre: n, valuePost: r }) : i.jsx(i.Fragment, {});
}
const hu = "_strikeOut_2g7di_1",
  Be = { strikeOut: hu };
function Ps({ data: e, header: t = "" }) {
  const { t: n } = b(),
    r = Z(),
    s = [
      r.accessor("type_name", { header: n("Character") }),
      r.accessor("quantity", { header: n("QTY") }),
    ];
  return i.jsx(We, {
    children:
      e.length > 0 &&
      i.jsxs(i.Fragment, {
        children: [
          i.jsx("h6", { className: Be.strikeOut, children: t }),
          i.jsx(te, { data: e, columns: s, isFetching: !1 }),
        ],
      }),
  });
}
function mu({ data: e, shown: t, setShown: n }) {
  var s, o;
  const { t: r } = b();
  return i.jsxs(_, {
    show: t,
    size: "lg",
    onHide: () => {
      n(!1);
    },
    children: [
      i.jsx(_.Header, {
        closeButton: !0,
        children: i.jsx(_.Title, { children: "Contract Detail" }),
      }),
      i.jsxs(_.Body, {
        children: [
          i.jsxs("table", {
            className: "table",
            children: [
              i.jsx(K, { strValue: e == null ? void 0 : e.issuer, text: "From:" }),
              i.jsx(K, { strValue: e == null ? void 0 : e.assignee, text: "To:" }),
              i.jsx(K, {
                strValue:
                  (e == null ? void 0 : e.acceptor) === (e == null ? void 0 : e.assignee)
                    ? null
                    : e == null
                      ? void 0
                      : e.acceptor,
                text: "Acceptor:",
              }),
              i.jsx(K, { strValue: e == null ? void 0 : e.availability, text: r("Availability") }),
              i.jsx(K, { strValue: e == null ? void 0 : e.status, text: r("Status") }),
              e != null && e.start_location
                ? i.jsx(K, {
                    strValue: e == null ? void 0 : e.start_location.name,
                    text: r("Start Location"),
                  })
                : i.jsx(Oe, {
                    strValue: e == null ? void 0 : e.start_location_id,
                    text: r("Start Location"),
                  }),
              e != null && e.end_location
                ? i.jsx(K, {
                    strValue: e == null ? void 0 : e.end_location.name,
                    text: r("End Location"),
                  })
                : i.jsx(Oe, {
                    strValue: e == null ? void 0 : e.end_location_id,
                    text: r("End Location"),
                  }),
              i.jsx(Te, { dateStrValue: e == null ? void 0 : e.date_issued, text: r("Issued") }),
              i.jsx(Te, {
                dateStrValue: e == null ? void 0 : e.date_accepted,
                text: r("Accepted"),
              }),
              i.jsx(Te, {
                dateStrValue: e == null ? void 0 : e.date_completed,
                text: r("Completed"),
              }),
              i.jsx(Te, { dateStrValue: e == null ? void 0 : e.date_expired, text: "Expiry" }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.price,
                text: r("Price"),
                valuePre: "$",
              }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.collateral,
                text: r("Collateral"),
                valuePre: "$",
              }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.reward,
                text: r("Reward"),
                valuePre: "$",
              }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.buyout,
                text: r("Buyout"),
                valuePre: "$",
              }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.volume,
                text: r("Volume"),
                valuePost: "m3",
              }),
              i.jsx(Oe, {
                strValue: e == null ? void 0 : e.days_to_complete,
                text: r("Days to Complete"),
              }),
              i.jsx(K, { strValue: e == null ? void 0 : e.title, text: r("Description") }),
            ],
          }),
          i.jsx(Ps, {
            data:
              (s = e == null ? void 0 : e.items) == null ? void 0 : s.filter((A) => A.is_included),
            header: r("Items Received"),
          }),
          i.jsx(Ps, {
            data:
              (o = e == null ? void 0 : e.items) == null ? void 0 : o.filter((A) => !A.is_included),
            header: r("Items Wanted"),
          }),
        ],
      }),
      i.jsx(_.Footer, {
        children: i.jsx(B, { className: "w-100", onClick: () => n(!1), children: r("Close") }),
      }),
    ],
  });
}
const pu = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(!1),
      [s, o] = R.useState(null),
      { data: A, isFetching: l } = O({
        queryKey: ["contracts", t],
        queryFn: () => Ia(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      a = Z(),
      c = [
        a.accessor("character", { header: e("Character") }),
        a.accessor("date_issued", { header: e("Date Created") }),
        a.accessor("contract_type", { header: e("Type") }),
        a.accessor("status", { header: e("Status") }),
        a.accessor("assignee", { header: e("Assignee") }),
        a.accessor("price", {
          header: e("Price"),
          cell: (u) => `${u.getValue().toLocaleString()}`,
        }),
        a.accessor("tittle", { header: e("Tittle") }),
        a.accessor("items", {
          header: e("Details"),
          cell: (u) =>
            i.jsx(i.Fragment, {
              children: i.jsx(B, {
                className: "w-100",
                onClick: () => {
                  o(u.row.original), r(!0);
                },
                children: e("Show Detail"),
              }),
            }),
        }),
      ];
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(te, { data: A, isFetching: l, columns: c }),
        i.jsx(mu, { data: s, shown: n, setShown: r }),
      ],
    });
  },
  io = ({ setFilterText: e, labelText: t }) =>
    i.jsxs("div", {
      className: "flex-grow-1 flex-even d-flex text-nowrap",
      children: [
        i.jsx("div", { className: "my-auto mx-2", children: i.jsx("h6", { children: t }) }),
        i.jsx(Do, { className: "m-2", type: "text", onChange: (n) => e(n.target.value) }),
      ],
    }),
  xu = "_skillBlock_1v52a_1",
  ju = { skillBlock: xu },
  oo = ({ level: e, active: t = 0, trained: n = 0 }) => {
    const r = n - t,
      s = e - t - r,
      o = 5 - Math.max(e, t, n);
    return i.jsxs("div", {
      className: " text-no-wrap",
      children: [
        Array.from(Array(t)).map((A) => i.jsx("i", { className: "fas fa-circle" })),
        r > 0
          ? Array.from(Array(r)).map((A) =>
              i.jsx("i", { className: "fas fa-circle", style: { color: "grey" } }),
            )
          : i.jsx(i.Fragment, {}),
        s > 0
          ? Array.from(Array(s)).map((A) =>
              i.jsx("i", { className: "fas fa-circle", style: { color: "orange" } }),
            )
          : i.jsx(i.Fragment, {}),
        Array.from(Array(o)).map((A) =>
          i.jsx("i", { className: "far fa-circle", style: { color: "grey" } }),
        ),
      ],
    });
  },
  Ao = ({ skill: e, level: t, active: n = 0, trained: r = 0, sp: s = 0, className: o = "" }) =>
    i.jsx("div", {
      className: `${o} ${ju.skillBlock}`,
      children: i.jsxs("div", {
        className:
          "d-flex flex-row justify-content-between my-1 mx-3 align-items-center text-nowrap",
        children: [
          i.jsx("span", { className: "flex-grow-1  text-nowrap", children: e }),
          s
            ? i.jsxs("span", {
                className: "badge bg-secondary me-1 text-nowrap",
                children: [s.toLocaleString(), " SP"],
              })
            : i.jsx(i.Fragment, {}),
          i.jsx(oo, { level: t, active: n, trained: r }),
        ],
      }),
    }),
  wu = () => {
    const { t: e } = b();
    return i.jsxs("div", {
      className: "d-flex flex-column w-100",
      children: [
        i.jsx("h5", { className: "text-center", children: "Key" }),
        i.jsxs("div", {
          className: "d-flex text-center justify-content-center",
          children: [
            i.jsxs("div", {
              className: "m-3",
              children: [
                i.jsx("p", { children: e("Trained Level") }),
                i.jsx("i", { className: "fas fa-circle" }),
              ],
            }),
            i.jsxs("div", {
              className: "m-3",
              children: [
                i.jsx("p", { children: e("Omega Restricted") }),
                i.jsx("i", { className: "fas fa-circle", style: { color: "grey" } }),
              ],
            }),
            i.jsxs("div", {
              className: "m-3",
              children: [
                i.jsx("p", { children: e("Missing Level") }),
                i.jsx("i", { className: "fas fa-circle", style: { color: "orange" } }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  yu = ({ show: e, setShow: t, name: n, skill_reqs: r, skill_list: s }) => {
    const { t: o } = b(),
      A = () => {
        t(!e);
      };
    return i.jsxs(_, {
      show: e,
      onHide: () => A(),
      children: [
        i.jsx(_.Header, {
          closeButton: !0,
          children: i.jsxs(_.Title, { children: [n, " - ", o("Missing Skills")] }),
        }),
        i.jsxs(_.Body, {
          children: [
            Object.entries(r).map(([l, a]) => {
              let c = 0,
                u = 0;
              return (
                s[l] && ((u = s[l].active_level), (c = s[l].trained_level)),
                i.jsx(Ao, { skill: l, level: Number(a), active: u, trained: c, className: "w-100" })
              );
            }),
            i.jsx("hr", {}),
            i.jsx(wu, {}),
          ],
        }),
        i.jsx(_.Footer, { children: i.jsx(B, { onClick: () => A(), children: o("Close") }) }),
      ],
    });
  },
  Tt = ({ name: e, skill_reqs: t, skill_list: n }) => {
    const [r, s] = R.useState(!1);
    let o = Object.entries(t).length === 0,
      A = o ? { variant: "success" } : { variant: "danger" },
      l = Object.entries(t).reduce((c, [u, d]) => {
        let g = 0;
        return n[u] && (g = n[u].trained_level), c && g >= Number(d);
      }, !0);
    !o && l && (A = { variant: "warning" });
    let a = Object.entries(t).reduce(
      (c, [u, d]) =>
        c +
        "" +
        u +
        " " +
        d +
        `
`,
      "",
    );
    return i.jsx(i.Fragment, {
      children: i.jsx(i.Fragment, {
        children: i.jsxs("div", {
          className: "m-2",
          children: [
            i.jsxs(_e, {
              children: [
                i.jsxs(B, {
                  ...A,
                  size: "sm",
                  onClick: () => s(!0),
                  children: [e, o ? i.jsx(i.Fragment, {}) : i.jsx(i.Fragment, {})],
                }),
                l
                  ? i.jsx(B, {
                      size: "sm",
                      ...A,
                      className: "flex-one",
                      children: o
                        ? i.jsx("i", { className: "fa-solid fa-check" })
                        : i.jsx("i", { className: "fa-solid fa-circle-exclamation" }),
                    })
                  : i.jsx(Lo.CopyToClipboard, {
                      text: a,
                      children: i.jsx(B, {
                        size: "sm",
                        variant: "danger",
                        children: i.jsx("i", { className: "fa-solid fa-copy" }),
                      }),
                    }),
              ],
            }),
            o
              ? i.jsx(i.Fragment, {})
              : i.jsx(yu, { show: r, setShow: s, name: e, skill_reqs: t, skill_list: n }),
          ],
        }),
      }),
    });
  },
  Su = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(""),
      [s, o] = R.useState(!1),
      { data: A } = O({
        queryKey: ["doctrines", t],
        queryFn: () => ka(Number(t)),
        refetchOnWindowFocus: !1,
      });
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h5", { className: "text-center", children: e("Status Key") }),
        i.jsxs("div", {
          className: "d-flex justify-content-center align-items-center flex-column",
          children: [
            i.jsxs("table", {
              className: "table",
              children: [
                i.jsxs("tr", {
                  className: "row align-items-center",
                  children: [
                    i.jsx("td", {
                      className: "col align-items-center text-end",
                      children: i.jsx(Tt, { name: "Passed", skill_reqs: [], skill_list: {} }),
                    }),
                    i.jsx("td", {
                      className: "col align-items-center",
                      children: i.jsx("p", { className: "m-0", children: e("All Skills Trained") }),
                    }),
                  ],
                }),
                i.jsxs("tr", {
                  className: "row align-items-center",
                  children: [
                    i.jsx("td", {
                      className: "col align-items-center text-end",
                      children: i.jsx(Tt, {
                        name: e("Alpha Restricted"),
                        skill_reqs: { "Some Skill Trained But Limited": 5 },
                        skill_list: {
                          "Some Skill Trained But Limited": { active_level: 4, trained_level: 5 },
                        },
                      }),
                    }),
                    i.jsx("td", {
                      className: "col align-items-center",
                      children: i.jsxs("p", {
                        className: "m-0 text-nowrap",
                        children: [
                          e("Some Skills Restricted by Alpha State"),
                          i.jsx("br", {}),
                          e("Click to Show More"),
                        ],
                      }),
                    }),
                  ],
                }),
                i.jsxs("tr", {
                  className: "row align-items-center",
                  children: [
                    i.jsx("td", {
                      className: "col align-items-center text-end",
                      children: i.jsx(Tt, {
                        name: "Failed",
                        skill_reqs: { "Some Skill": 5 },
                        skill_list: { "Some Skill": { active_level: 1, trained_level: 1 } },
                      }),
                    }),
                    i.jsx("td", {
                      className: "col align-items-center",
                      children: i.jsxs("p", {
                        className: "m-0 text-nowrap",
                        children: [
                          e("Some Missing Skills"),
                          i.jsx("br", {}),
                          e("Click to Show More"),
                          i.jsx("br", {}),
                          e("Click Copy for easy import in game"),
                        ],
                      }),
                    }),
                  ],
                }),
                i.jsx("tr", { children: i.jsx("td", { colSpan: 2 }) }),
              ],
            }),
            i.jsx(io, { setFilterText: r, labelText: e("Search:") }),
            i.jsx(J.Check, {
              type: "switch",
              id: "custom-switch",
              label: e("Hide Failures"),
              onChange: (l) => {
                o(l.target.checked);
              },
              defaultChecked: s,
            }),
          ],
        }),
        A
          ? A.map((l) => {
              var u;
              const a = Object.entries(l.doctrines).length;
              return (
                ((u = Object.entries(l.doctrines)) == null
                  ? void 0
                  : u.reduce(
                      (d, [g, f]) =>
                        d ||
                        ((!s || Object.entries(f).length === 0) &&
                          (n.length == 0 || g.toLowerCase().includes(n.toLocaleLowerCase()))),
                      !1,
                    )) &&
                i.jsxs(S, {
                  className: "my-2",
                  children: [
                    i.jsx(S.Header, {
                      children: i.jsx(S.Title, {
                        children: i.jsxs("div", {
                          className: "m-0",
                          children: [
                            l.character.character_name,
                            " ",
                            i.jsxs("span", {
                              className: "float-end",
                              children: [
                                l.character.corporation_name,
                                l.character.alliance_name && ` (${l.character.alliance_name})`,
                              ],
                            }),
                          ],
                        }),
                      }),
                    }),
                    i.jsxs(S.Body, {
                      className: "d-flex align-items-center",
                      children: [
                        i.jsx("div", {
                          className: "flex-one m-2",
                          children: i.jsx(si, { size: 128, character: l.character }),
                        }),
                        i.jsx("div", {
                          className: "d-flex flex-grow-1 justify-content-center flex-wrap",
                          children:
                            a > 0
                              ? i.jsx(i.Fragment, {
                                  children: Object.entries(l.doctrines).map(
                                    ([d, g]) =>
                                      (!s || Object.entries(g).length === 0) &&
                                      (n.length == 0 ||
                                        d.toLowerCase().includes(n.toLocaleLowerCase())) &&
                                      i.jsx(Tt, { name: d, skill_reqs: g, skill_list: l.skills }),
                                  ),
                                })
                              : i.jsx("p", { children: e("No Tokens") }),
                        }),
                      ],
                    }),
                  ],
                })
              );
            })
          : i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") }),
      ],
    });
  },
  vu = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isFetching: r } = O({
        queryKey: ["LP", t],
        queryFn: () => va(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      s = Z(),
      o = [
        s.accessor("character.character_name", { header: e("Character") }),
        s.accessor("character.corporation_name", { header: e("Corporation") }),
        s.accessor("corporation.name", { header: e("LP Corporation") }),
        s.accessor("amount", {
          header: e("Quantity"),
          cell: (A) => `${A.getValue().toLocaleString()}`,
        }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { data: n, isFetching: r, columns: o }) });
  };
function Cu({ msg_data: e, shown: t, setShown: n }) {
  const { t: r } = b(),
    {
      isFetching: s,
      error: o,
      data: A,
    } = O(
      ["mailBody", e == null ? void 0 : e.character_id, e == null ? void 0 : e.mail_id],
      () => La(e == null ? void 0 : e.character_id, e == null ? void 0 : e.mail_id),
      { refetchOnWindowFocus: !1 },
    );
  return i.jsxs(_, {
    size: "lg",
    show: t,
    onHide: () => {
      n(!1);
    },
    children: [
      i.jsx(_.Header, {
        closeButton: !0,
        children: i.jsx(_.Title, { children: r("Mail Detail") }),
      }),
      i.jsxs(_.Body, {
        children: [
          i.jsxs("div", {
            className: "container-fluid",
            children: [
              i.jsx(K, { strValue: e == null ? void 0 : e.from, text: "From:" }),
              i.jsx(K, {
                text: "Labels:",
                children: i.jsx("span", {
                  style: { overflowWrap: "anywhere" },
                  children:
                    e == null
                      ? void 0
                      : e.labels.map((l) =>
                          i.jsx($, { style: { marginLeft: "5px" }, children: l }),
                        ),
                }),
              }),
              i.jsxs(K, {
                text: "Recipients:",
                children: [
                  (e == null ? void 0 : e.recipients.length) > 2 &&
                    i.jsxs("p", {
                      children: [e == null ? void 0 : e.recipients.length, " ", r("Recipients")],
                    }),
                  i.jsx("span", {
                    style: { overflowWrap: "anywhere" },
                    children:
                      e == null
                        ? void 0
                        : e.recipients.map((l) =>
                            i.jsx($, { style: { marginLeft: "5px" }, children: l }),
                          ),
                  }),
                ],
              }),
              i.jsx(Te, { dateStrValue: e == null ? void 0 : e.timestamp, text: "Timestamp:" }),
              i.jsx(K, { strValue: e == null ? void 0 : e.subject, text: "Subject:" }),
            ],
          }),
          i.jsx("hr", {}),
          o && i.jsx("p", { children: r("Error from API") }),
          s && i.jsx("p", { children: "Loading From API..." }),
          A &&
            i.jsx("p", { dangerouslySetInnerHTML: { __html: `${A == null ? void 0 : A.body}` } }),
        ],
      }),
      i.jsx(_.Footer, { children: i.jsx(B, { onClick: () => n(!1), children: r("Close") }) }),
    ],
  });
}
const Fu = () => {
    const { t: e } = b();
    let { characterID: t } = q();
    const [n, r] = R.useState(!1),
      [s, o] = R.useState(null),
      { isFetching: A, data: l } = O(["mail", t], () => Va(Number(t)), {
        initialData: [],
        refetchOnWindowFocus: !1,
      }),
      a = Z(),
      c = [
        a.accessor("character", { header: e("Character") }),
        a.accessor("from", { header: e("From") }),
        a.accessor("labels", {
          header: e("Labels"),
          cell: (u) =>
            i.jsx("p", {
              children: u
                .getValue()
                .map((d) => i.jsx($, { style: { marginLeft: "5px" }, children: d })),
            }),
        }),
        a.accessor("recipients", {
          header: e("To"),
          cell: (u) =>
            u.getValue().length > 2
              ? i.jsx("p", {
                  children: i.jsxs($, {
                    bg: "warning",
                    children: ["+ ", u.getValue().length, " ", e("Recipients")],
                  }),
                })
              : i.jsx("p", {
                  children: u
                    .getValue()
                    .map((d) =>
                      i.jsx($, { style: { marginLeft: "5px" }, bg: "info", children: d }),
                    ),
                }),
        }),
        a.accessor("timestamp", {
          header: e("Date"),
          cell: (u) => i.jsx("div", { children: new Date(u.getValue()).toLocaleString() }),
        }),
        a.accessor("subject", { header: e("Subject") }),
        a.accessor("subject", {
          header: e("Details"),
          cell: (u) =>
            i.jsx(i.Fragment, {
              children: i.jsx(B, {
                onClick: () => {
                  o(u.row.original), r(!0);
                },
                children: e("Show Detail"),
              }),
            }),
        }),
      ];
    return i.jsxs(We, {
      children: [
        i.jsx(yt, { isFetching: A, data: l, columns: c }),
        i.jsx(Cu, { msg_data: s, shown: n, setShown: r }),
      ],
    });
  },
  Ru = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isFetching: r } = O({
        queryKey: ["market", t],
        queryFn: () => Oa(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      s = Z(),
      o = [
        s.accessor("character.character_name", { header: e("Character") }),
        s.accessor("buy_order", {
          header: e("Buy Order"),
          cell: (A) =>
            A.getValue() === !0
              ? i.jsx("i", { className: "fa-solid fa-square-check text-success text-center w-100" })
              : i.jsx("i", {
                  className: "fa-solid fa-square-xmark text-warning text-center w-100",
                }),
        }),
        s.accessor("date", {
          header: e("Date"),
          cell: (A) => `${new Date(A.getValue()).toUTCString()}`,
        }),
        s.accessor("item.name", { header: e("Item Type") }),
        s.accessor("location.name", { header: e("Location") }),
        s.accessor("price", {
          header: e("Price"),
          cell: (A) => `${A.getValue().toLocaleString()}`,
        }),
        s.accessor("volume_remain", {
          header: e("Volume"),
          cell: (A) =>
            `${A.getValue().toLocaleString()}/${A.row.original.volume_total.toLocaleString()}`,
        }),
      ];
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h4", { className: "text-center", children: e("Active Orders") }),
        i.jsx(te, { data: n == null ? void 0 : n.active, isFetching: r, columns: o }),
        i.jsx("h4", { className: "text-center", children: e("Expired Orders") }),
        i.jsx(te, { data: n == null ? void 0 : n.expired, isFetching: r, columns: o }),
      ],
    });
  },
  bu = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isFetching: r } = O({
        queryKey: ["notification", t],
        queryFn: () => Ca(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      s = Z(),
      o = [
        s.accessor("character.character_name", { header: e("Character") }),
        s.accessor("is_read", {
          header: e("Is Read"),
          cell: (A) => i.jsx(Ue, { checked: !!A.getValue() }),
        }),
        s.accessor("timestamp", {
          header: e("Date"),
          cell: (A) => i.jsx(i.Fragment, { children: new Date(A.getValue()).toUTCString() }),
          enableColumnFilter: !1,
        }),
        s.accessor("notification_type", { header: e("Type") }),
        s.accessor("notification_text", {
          header: e("Text"),
          cell: (A) => i.jsx("pre", { children: A.getValue() }),
          enableColumnFilter: !1,
        }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { data: n, isFetching: r, columns: o }) });
  },
  Eu = "_imgBg_1j44v_1",
  Nu = { imgBg: Eu },
  Ou = (e) =>
    e
      ? i.jsx(rt, { placement: "top", id: e, style: { position: "fixed" }, children: e })
      : i.jsx(i.Fragment, {}),
  D = ({
    iconSrc: e,
    text: t,
    textVariant: n,
    cardVariant: r,
    borderVariant: s,
    isLoading: o,
    toolTipText: A,
  }) =>
    i.jsx(ae, {
      trigger: ["hover", "focus"],
      overlay: Ou(A),
      children: i.jsxs("div", {
        className: `d-flex m-1 ${t ? "pt-2" : ""} flex-column align-items-center`,
        style: { minWidth: "64px" },
        children: [
          i.jsx("div", {
            className: `${Nu.imgBg} border border-${r} ${s == "thick" ? "border-5" : "border-3"}`,
            children: i.jsx("img", {
              className: "m-1",
              style: { borderRadius: "30%" },
              src: e,
              height: t || o ? 32 : 64,
              width: t || o ? 32 : 64,
            }),
          }),
          o
            ? i.jsx(ko, { animation: "border", size: "sm" })
            : t && i.jsx("h6", { className: `text-${n} text-nowrap mx-1`, children: t }),
        ],
      }),
    }),
  lo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABCJJREFUeNrsWe1LU2EUvw/4dX+A61uQgSUYsyQTtkRC0PVGhBP6ErhVWNNtaZPl3XxNdEsFoY2+hS3IilIJK2oWZREXIxJiH/qW/gH7fO/tPCKktsE9d8992bo/GGPovc85v+d3znPOeTjOggULFixYsPC/gqh98Mev30n4cpjRqcP799Up/d8KtYtIklgWClBPgCjZTOpTTh8CJLHKpFEd04kAqdCfFjlCBPjeKNoXWfYi88xi3aEDGV0IEMV/ckCOEOI7VnMwy2Ifv3z/6UA6vwnrx3XJAatr6/Y8Ckgcr61m4vyntXUbvD+KPM6i9bXVOV0IAOMq97J/wlGzwCqK4f1ecKgS8Uga1hd0OwXy7H6KlfPvv35zyZLkkRHSh+1XvX6FyvjfdQRC7GVYOP9uVbDB8cqjpE9I1Fl/JKcrAXuOwExTw9EcCwJkWeJlmUPUFyTV1FAnFLMmixBYYeH86w+fXfBeF+KRbHNjfdGhpzYEqshfDRYt/+XMR5r1eYLTfpQF8RXqpCqvQJKiR95mi7OhaPlLsswTWbYhEl+q5WQjkyOXcAZj6c0Klf0kRvqtzc4Ow5shFlh49ZYWVJisT6vNKEsbDCVAhCOPEEzW51JnWpqzZUHA06VlDxQ8DkTcC+daT6VNMw8oBvMvXtqh4PEipR/TwhZDCIBCisY9quC5eLZ1oywISD957oHEh2lzhfbzp9Na2aMrAXOPn9m3Oz3F0oeCJ6SlTUzqgAeP5pXtKCFBWFDxKA0SZBqqrkKVZvZS+4WcKRQgyVJSqUdIeLY/+eCj4WEOAkSJK1WwIaCE7wgsBTDKAb4CXSNNeEHEqzYRtb65u8HZ5H0bOEOTo+KsT8fqVzsvCyWngAK7791WgOIaqetKp1CSIbAX07P3HJAYPRjp03LXiBzAPAQSM7NU+g85xFwfWmJfd9c1wQgCmCsAWlyvTFCXGqmg/7ohzjNXwERiCkpikkQ8kr0Z8HdwBoKZAu5MxPH3eYzHW4YSAM4HwSGU9MO9oWxZEDA8Nk4vNdow0o+E+5hnfbAjueP9cV0IiA2N2CRRNHSySzE4POoGOxzYKrFoAqDY4eGDmuxGByLMpQ8KdO74KehCwG0+BtIXXYhHhMEoz3y8BXbYd9lBiPYK6I8M2FRcamgy2QU7dladuZGh2IbmBOCvsrnU2Mgw88luuD9Cd79NbZeoioC+W2E38ipbGB8bTWu0+wFu9+2SoCkBod4++9aiOOlrMtkFW9x5cpC2CqBHHjiEkX4sPjmRY+18IBhyQ9/By0UOSlAEdPcEsJcamam7iQwrp/3dPXY6YIENKFh4wXqoPKO4Gbrh99PF5zjUlZbuEGamp32aKEASt+LezM5v5RvNegFINmZ3Hh3/KALEEhh9E0JHaxYsWLBgwYJS/BFgAE4Kq3N5izE5AAAAAElFTkSuQmCC",
  Mn = "/static/corptools/bs5/static/img/omega_128-B8POqXI6.png",
  co = "/static/corptools/bs5/static/img/skillInjector_64-CiNLYJYo.png",
  ao =
    "data:image/png;base64,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",
  Iu = () => {
    var a, c, u, d;
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isLoading: r } = O({
        queryKey: ["glances", "account", t],
        queryFn: () => sr(t ? Number(t) : 0),
        refetchOnWindowFocus: !1,
      }),
      s =
        (a = n == null ? void 0 : n.characters) == null
          ? void 0
          : a.reduce((g, f) => {
              try {
                return g + f.isk;
              } catch {
                return g;
              }
            }, 0),
      o =
        (c = n == null ? void 0 : n.characters) == null
          ? void 0
          : c.reduce((g, f) => {
              try {
                return g + f.sp;
              } catch {
                return g;
              }
            }, 0),
      A =
        (u = n == null ? void 0 : n.characters) == null
          ? void 0
          : u.filter((g) => !g.active).length,
      l = (d = n == null ? void 0 : n.characters) == null ? void 0 : d.length;
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h3", {
          className: `${Be.strikeOut} w-100 text-center mt-3`,
          children: e("Account at a Glance"),
        }),
        i.jsxs("div", {
          className: "d-flex flex-wrap justify-content-center ",
          children: [
            i.jsx(D, {
              cardVariant: s < 1e6 ? "warning" : "success",
              iconSrc: lo,
              textVariant: s < 1e6 ? "warning" : "success",
              text: `${s == null ? void 0 : s.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`,
              isLoading: r,
              toolTipText: e("Total Liquid Isk across all characters"),
            }),
            i.jsx(D, {
              cardVariant: o < 1e6 ? "warning" : "success",
              iconSrc: co,
              textVariant: o < 1e6 ? "warning" : "success",
              text: `${o == null ? void 0 : o.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} SP`,
              isLoading: r,
              toolTipText: e("Total SP across all characters"),
            }),
            i.jsx(D, {
              iconSrc: Mn,
              text: l == null ? void 0 : l.toLocaleString(),
              isLoading: r,
              toolTipText: e("Count of all known alts"),
            }),
            i.jsx(D, {
              cardVariant: A > 0 ? "danger" : "success",
              iconSrc: ao,
              textVariant: A > 0 ? "danger" : "success",
              text: A == null ? void 0 : A.toLocaleString(),
              isLoading: r,
              toolTipText: e("Count of all known alts not loading into audit"),
            }),
          ],
        }),
      ],
    });
  };
E.defaults.xsrfHeaderName = "X-CSRFToken";
async function uo() {
  const e = await E.get("/audit/api/corp/list");
  console.log("got corp status in api");
  const t = Array.from(
    new Set(
      e.data.reduce((r, s) => {
        try {
          return r.concat(Object.keys(s.last_updates));
        } catch {
          return r;
        }
      }, []),
    ),
  );
  return t.sort(), { corps: e.data, headers: t };
}
async function Tu(e) {
  const t = await E.get(`/audit/api/corporation/${e}/glance/assets`);
  return console.log(`get glance/assets in api ${e}`), t.data;
}
async function Du(e) {
  const t = await E.get(`/audit/api/corporation/${e}/character/status`);
  return console.log(`get glance/assets in api ${e}`), t.data;
}
async function ku(e) {
  const t = await E.get(`/audit/api/corporation/${e}/glance/activities`);
  return console.log(`get glance/activities in api ${e}`), t.data;
}
async function Bu(e) {
  const t = await E.get(`/audit/api/corporation/${e}/glance/faction`);
  return console.log(`get glance/faction in api ${e}`), t.data;
}
async function Pu() {
  const e = await E.get("/audit/api/corp/structures");
  return console.log("get structures in api"), e.data;
}
async function Mu(e) {
  const t = await E.get(`/audit/api/corp/structures/${e}`);
  return console.log("get structures in api"), t.data;
}
async function Vu() {
  const e = await E.get("/audit/api/corp/starbases");
  return console.log("get starbases in api"), e.data;
}
async function Lu(e) {
  const t = await E.get(`/audit/api/corp/starbase/${e}`);
  return console.log(`get starbase ${e} fit in api`), t.data;
}
async function Hu() {
  const e = await E.get("/audit/api/corp/pocos");
  return console.log("get pocos in api"), e.data;
}
async function Uu() {
  const e = await E.get("/audit/api/dashboard/gates");
  return console.log("get bridges in api"), e.data;
}
async function _u(e) {
  const t = await E.get(`/audit/api/corporation/${e}/asset/locations`);
  return console.log(`get asset locations in api ${e}`), t.data;
}
async function qu(e, t) {
  const n = await E.get(`/audit/api/corporation/${e}/asset/${t}/groups`);
  return console.log(`get asset groups in api ${e} ${t}`), n.data;
}
async function zu(e, t, n) {
  const r = await E.get(`/audit/api/corporation/${e}/asset/${t}/list?new_asset_tree=${n}`);
  return console.log(`get asset list in api ${e} ${t}`), r.data;
}
async function Wu(e, t = "", n = 1) {
  const r = await E.get(`/audit/api/corporation/${e}/wallet`, {
    params: { type_refs: t, page: n },
  });
  return console.log(`get wallet in api ${e}`), r.data;
}
async function Gu(e) {
  const t = await E.get(`/audit/api/corporation/${e}/divisions`);
  return console.log(`get divisions in api ${e}`), t.data;
}
async function Yu() {
  const e = await E.get("/audit/api/corporation/wallettypes");
  return console.log("get wallet types in api"), e.data;
}
const Ju = "/static/corptools/bs5/static/img/asteroid_64-_mwThky8.png",
  Ku = "/static/corptools/bs5/static/img/gas_64-lUUIHkb8.png",
  Qu = "/static/corptools/bs5/static/img/ice_64-C-X-JxCQ.png",
  Zu = "/static/corptools/bs5/static/img/incursion_2_64-CezWswVX.png",
  Xu = "/static/corptools/bs5/static/img/industry_128-DM0mBaQY.png",
  $u = "/static/corptools/bs5/static/img/market_128-oRcbZRsd.png",
  ed = "/static/corptools/bs5/static/img/missions_2_128-Dg_KBb12.png",
  td = "/static/corptools/bs5/static/img/moonAsteroid_JackpotR32-CbqQRgx1.png",
  nd = "/static/corptools/bs5/static/img/npcbattleship_32-BFJ3Lc7-.png",
  rd = "/static/corptools/bs5/static/img/planet_128-BhhMKsyX.png",
  sd = "/static/corptools/bs5/static/img/triglavian_128-RGqDm8eK.png",
  fo = ({ data: e, isLoading: t }) => {
    var r, s, o, A, l, a, c, u;
    const { t: n } = b();
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h3", {
          className: `${Be.strikeOut} w-100 text-center mt-3`,
          children: n("Activity"),
        }),
        i.jsxs("div", {
          className: "d-flex flex-wrap justify-content-center",
          children: [
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("PvE") }),
                }),
                i.jsxs("div", {
                  className: "d-flex flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: Zu,
                      textVariant: e != null && e.incursion ? "success" : void 0,
                      cardVariant: e != null && e.incursion ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.incursion
                          ? `+${(r = e == null ? void 0 : e.incursion) == null ? void 0 : r.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                      toolTipText: n("Total Isk earned in Incursions in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: sd,
                      textVariant: e != null && e.pochven ? "success" : void 0,
                      cardVariant: e != null && e.pochven ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.pochven
                          ? `+${(s = e == null ? void 0 : e.pochven) == null ? void 0 : s.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                      toolTipText: n("Total Isk earned in Pochven in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: nd,
                      textVariant: e != null && e.ratting ? "success" : void 0,
                      cardVariant: e != null && e.ratting ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.ratting
                          ? `+${(o = e == null ? void 0 : e.ratting) == null ? void 0 : o.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                      toolTipText: n("Total Isk earned Ratting in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: ed,
                      textVariant: e != null && e.mission ? "success" : void 0,
                      cardVariant: e != null && e.mission ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.mission
                          ? `+${(A = e == null ? void 0 : e.mission) == null ? void 0 : A.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                      toolTipText: n("Total Isk earned running missions in the last 30 Days"),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Economic") }),
                }),
                i.jsxs("div", {
                  className: "d-flex flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      isLoading: t,
                      iconSrc: $u,
                      cardVariant: e != null && e.market ? "success" : void 0,
                      textVariant: (e == null ? void 0 : e.market) > 0 ? "success" : "muted",
                      toolTipText: n("Market activity (Net ISK) in the last 30 Days"),
                      text:
                        e != null && e.market
                          ? `${Number(e == null ? void 0 : e.market).toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                    }),
                    i.jsx(D, {
                      iconSrc: Xu,
                      isLoading: t,
                      cardVariant: e != null && e.industry ? "success" : void 0,
                      textVariant: e != null && e.industry ? "success" : "muted",
                      text: e != null && e.industry ? (e == null ? void 0 : e.industry) : "-",
                      toolTipText: n(
                        "Count of Industry activities such as manufacturing or reactions in the last 30 Days",
                      ),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Mining") }),
                }),
                i.jsxs("div", {
                  className: "d-flex flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: Qu,
                      cardVariant: e != null && e.mining_ice ? "success" : void 0,
                      textVariant: e != null && e.mining_ice ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.mining_ice
                          ? `${(l = e == null ? void 0 : e.mining_ice) == null ? void 0 : l.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} m3`
                          : "-",
                      toolTipText: n("Total m3 of Ice mined in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: Ju,
                      textVariant: e != null && e.mining_ore ? "success" : void 0,
                      cardVariant: e != null && e.mining_ore ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.mining_ore
                          ? `${(a = e == null ? void 0 : e.mining_ore) == null ? void 0 : a.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} m3`
                          : "-",
                      toolTipText: n("Total m3 of standard ore mined in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: td,
                      textVariant: e != null && e.mining_moon ? "success" : void 0,
                      cardVariant: e != null && e.mining_moon ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.mining_moon
                          ? `${(c = e == null ? void 0 : e.mining_moon) == null ? void 0 : c.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} m3`
                          : "-",
                      toolTipText: n("Total m3 of moon ore mined in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: Ku,
                      textVariant: e != null && e.mining_gas ? "success" : void 0,
                      cardVariant: e != null && e.mining_gas ? "success" : void 0,
                      isLoading: t,
                      text:
                        e != null && e.mining_gas
                          ? `${(u = e == null ? void 0 : e.mining_gas) == null ? void 0 : u.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} m3`
                          : "-",
                      toolTipText: n("Total m3 of gas anomalies mined in the last 30 Days"),
                    }),
                    i.jsx(D, {
                      iconSrc: rd,
                      isLoading: t,
                      cardVariant: e != null && e.pi ? "success" : void 0,
                      textVariant: (e == null ? void 0 : e.pi) > 0 ? "success" : "muted",
                      text:
                        e != null && e.pi
                          ? `${Number(e == null ? void 0 : e.pi).toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`
                          : "-",
                      toolTipText: n("Planetary import/export seen in the last 30 Days"),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  id = () => {
    const { characterID: e } = q(),
      { data: t, isLoading: n } = O({
        queryKey: ["glances", "activities", e],
        queryFn: () => Ea(e ? Number(e) : 0),
        refetchOnWindowFocus: !1,
      });
    return i.jsx(fo, { data: t, isLoading: n });
  },
  od = ({ corporationID: e = 0 }) => {
    const { data: t, isLoading: n } = O({
      queryKey: ["glances", "corp", "activities", e],
      queryFn: () => ku(e),
      refetchOnWindowFocus: !1,
    });
    return i.jsx(fo, { data: t, isLoading: n });
  },
  Ad =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOFJREFUeNpiYBgFo2AUUAD+//8/H4QH0nIYmD8glj99+vQ5CNPVEciWy8nJdaioqBQAuefp4gh0y4FCGUDMARQSoLkjcFmOJE87RxCynKaOINZymjiCVMup7ghyLMfmCCA3AJc6JkIGHT169OajR48eAJkLgPgHsQ5gZGT8AKQ2QrkGZDsACm6QYjkpgIlhgMGoA1gIKTAwMJA/c+ZMgrGxsQMZ5ttT7ABVVVUFIKUwICEAzEqMQKphWLeqGAmUZvupYgkjoyPZaeD27dvUiP8EaElKchpwhGoeBaOAZgAgwADRIPnv6gjUcQAAAABJRU5ErkJggg==",
  ld =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATVJREFUeNpiYBgFo4AC8P////kgPJCWw8D8AbH86dOnz0GYro5AtlxOTq5DRUWlAMg9TxdHoFsOFMoAYg6gkADNHYHLciR52jmCkOU0dQSxltPEEaRaTnVHELIcapEAIUcAuQG47GAi5IijR4/efPTo0QMgcwEQ/0C2AEjtB2FsjmBkZPwApDZCuQZkOwAKbuCw3ACK9+MKCUKAiYxogVsODJ0LIEyJI1gosdzGxgYUxBeA4v5AOgHqCEdo8FM3BHBZDsQbgBYmQtMIySFBlAOMjY1xWo6U6Mh2BN5suH379uOwGu/IkSPngcIN+LIVUjUNyoL90GzYQLYDYIAYy3G0FSh3ACmWY3MERQ4gx3J0R+BzACMhA4CJ6yF6giPVEVAzGshNiwEMlANqmDEKRsEwBQABBgAOibaZR7OUTgAAAABJRU5ErkJggg==",
  cd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNpiYBgFFID////PB+GBtBwG5g+I5U+fPn0OwnR1BLLlcnJyHSoqKgVA7nm6OALdcqBQBhBzAIUEaO4IXJYjydPOEYQsp6kjiLWcJo4g1XKqOoJcy6niCEotp9gR1LAcmyOA3AB0eSZcGo8ePXrz0aNHD4DMBUD8g1wHMDIyfgBSG6FcA6IdAAU3KLGcGIDTAdbW1uoWFhYcVMjGAkDKn9ya7jzUAIrj/8iRI+eBQg10cwQOywPoEhJUsZxcR1DVclIdQRPLiXUETS0n5Ai6WI7LEXS1HIcj6Gs5tmY53S1HdsSAWY4EAgbS8lFAMQAIMACyRj6cz5mg0AAAAABJRU5ErkJggg==",
  ad =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMVJREFUeNpiYBgFo2AUUAD+//8/H4QH0nIYmD8glj99+vQ5CNPVEciWy8nJdaioqBQAuefp4gh0y4FCGUDMARQSoLkjcFmOJE87RxCynKaOINZymjiCVMup7ghyLMfmCCA3AJc6JkIGHT169OajR48eAJkLgPgHsQ5gZGT8AKQ2QrkGZDsACm6QYjkpgIlhgMGoA1gIKTAwMJA/c+ZMgrGxsQMZ5ttT7ABVVVUFIKUwICEAzEqMQKphtOk1CkbBKKAlAAgwADz48ZFJ3SP6AAAAAElFTkSuQmCC",
  ud =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAL1JREFUeNpiYBgFo2AUjIKhDP7//z8fhAfSchiYPyCWP3369DkI09URyJbLycl1qKioFAC55+niCHTLgUIZQMwBFBKguSNwWY4kTztHELKcEkcwEmM5kEoAsXfs2HHi8+fPP93c3E7w8/P/wKGFH4gLoOwFjIyMidTKauSC+RSFABAEALEBhbF4AYg3DMrSlJFAFOyniiWMjI645FgIab59+7YCFdwASsQLSHYA1OUJo9XuKBgFo2BYA4AAAwDuOPZAKdxOvgAAAABJRU5ErkJggg==",
  dd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARxJREFUeNpiYBgFo4AC8P////kgPJCWw8D8AbH86dOnz0GYro5AtlxOTq5DRUWlAMg9TxdHoFsOFMoAYg6gkADNHYHLciR52jmCkOU0dQSxltPEEaRaTlVHkGs5VRxBqeUUO4IalmNzBJAbgC7PhEvj0aNHbz569OgBkLkAiH+Q6wBGRsYPQGojlGtAtAOg4AYllhMDmBgGGIw6gAWXhIGBgfyZM2cSjI2NHdCkJkATFtYUD6QKsEjZk5p18IHzUIvw5XmsAKisgagQAPqQEZviI0eO+FtbW4Oy0n6geY6wkIA6aD8o4IDZ94KNjc1GejTFzkN9Dfc50IHnoQ4PoFd78DzdLcfWKKW75ciOGDDLkUDAQFo+CigGAAEGAKzczqNJim5wAAAAAElFTkSuQmCC",
  fd = "/static/corptools/bs5/static/img/extractor_64-BQGwjQ_v.png",
  gd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARtJREFUeNpiYBgFRIL////P/088mE+suSzEWg6kEp49e/bi6NGjN/Gptba2VpeSkkoA6mFgZGRMpJrPnz59+lxOTq4DKJQBxA64sIWFhQdQ+XlSQ4IUyzmI0CdAsSPItZwqjqDUcoocQS3LiXUEEz7NbGxsL4DUAiD+QY2sDMxBBkAqgJQ8D3K5ADV8f+TIkfNAoQaiHEANR1BkOaWOoIrl5DqCqpaT6ghyLGcixSHAukBCVVU1gYRseQGIN9C1OKZKMTxaF4z4usBgQOsCNBcPTF1ADUdQXCJS4giqFcfkOIJUyxmJMRBI7YcmTlDRupGAFn+QWmCCu2BjY7ORWsUxckgQBKQEOyMJ7gCVBaCKSIJuFdEooAcACDAAVWOwQScYFDwAAAAASUVORK5CYII=",
  hd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ9JREFUeNrsV7FugzAQhQihjJkZWLtGYgHB0G7dwifQrWM/IVu7tX9A+gfNxJgFxBjGdKuQoBk7dqPn1qmQhWufTduFkyzHoNx7tu/eHYYxmcC6rks7dUtF/i0ROExJ27bHoiieMcTDMDxzHCcBH4ZpmldoAn3wIAge67p+gfVBloDv+/OyLG+JDxEJ7rE3TfPquu4dPLqGMVe4vgWMvex1jAquTGJM8CESsIz772ZDfyABR+98A+NdlwDc/xtMW7pcCglQO4wBLrLZf+vMRMCSiWCYbhT9P9AAVJZiAr5jIxdhK/Bx8RMJLgHP877BIS2rKIq2GOQ8z1dQDwjxHSGBEY0uy7KSiBH5DY728HjNCgiykhIRuqdCtBYSOJkOOK+cSxNgwZF9QcojwRKwOFJ8uvMKxhOmLxjqA8j8hW0kUkc2tHOmQJ3zBvQBl7zq1/MttFinNAtKcIwKHtXSLNsHSEmxbdtHndIMcbNUyiQmjxcqu9dOZSwJLLgpS4KmUNXrbLj6z8j3Zyr/6QcK5thNJI8YURnH2flkv20fAgwA/mRRRowKgjEAAAAASUVORK5CYII=",
  md =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJxJREFUeNpiYBgFo2AUjIKhDP7//z8fhAfSchiYPyCWP3369DkI09URyJbLycl1qKioFAC55+niCHTLgUIZQMwBFBKguSNwWY4kTztHELKcEkcwEmM5kEoAsXfs2HHi8+fPP93c3E7w8/P/wKGFH4gLoOwFjIyMidTKauSC+RSFABAEALEBhbF4AYg3jBbdo2AUjIJRMAoGJQAIMABD/+3i1WyW1AAAAABJRU5ErkJggg==",
  pd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUhJREFUeNpiYBgFo2AUEAD///+f/598MJ+Q+SyELAdSCc+ePXtx9OjRm6Q43NraWl1KSioBaAYDIyNjIskOQLbc0tJy4aNHjx4A+TeIdYCFhQXH8ePH20FmEHIEzmB/+vTpczk5uQ6gUAYQc5ARfQJAfJ7Y6KCq5WQ7gpqWY3MEkBuALMeETQMowUHjfAEQ/6DUAcD4/wCkNkK5BgQdAAU3qGE5IcA00OXMqANYiEnBQKqATPMnQBMg2UUxyPL96CmXBOAPNMMRnyNwOsDY2BhuOTBbXrCxsdlIis1HjhzxB9YHIIfvBzmClELj//bt24+DCiMQG2jQeaBwA3oBQmJNCiqE+qEFUQNBB8AAJZbjqs6JdgA1LMfmCKIcQE3L0R2B7gBGbAqBqfYhkHkBiDdQu3UFNbuBkNoAGpY9AQyjYBSMAiQAEGAA489NnZ/6iiAAAAAASUVORK5CYII=",
  xd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPhJREFUeNpiYBgFo2AUEAn+//8//z/xYD6x5rIQazmQSnj27NmLo0eP3sSn1traWl1KSioBqIeBkZExkWo+f/r06XM5ObkOoFAGEDvgwhYWFh5A5edJDQlSLOcgQp8AxY4g13KqOYISy7E5AsgNwKaGCZ8BoAT36NGjB0DmAiD+QaoDgInwA5DaCOUakOwAKLhBjuXEAqaBLl9GHTDgDmDElw3fv3//4e/fvw9EREQ+UGCHAggDc0QjkG4gqS4QFBQUwJV9qAVY8ORhRmwuHnYAXxrYT1WLGBkdSW4P3L59W4GKbkiAFulEpwFHqKZRMApGwfAGAAEGAJy+xoU1pcSFAAAAAElFTkSuQmCC",
  jd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANxJREFUeNpiYBgFo2AUjAIiwf///+f/Jx7MJ9ZcFmItB1IJz549e3H06NGb+NRaW1urS0lJJQD1MDAyMiZSzedPnz59Licn1wEUygBiB1zYwsLCA6j8PKkhQYrlHEToE6DYEeRaTjVHUGI5NkcAuQHY1DDhMwCU4B49evQAyFwAxD9IdQAwEX4AUhuhXAOSHQAFN8ixnFjANNDly6gDBtwBjPiy4fv37z/8/fv3gYiIyAcK7FAAYWCOaATSDSTVBYKCggK4sg+1AAuePMyIzcWjYBSMglEw7ABAgAEAnPm+J1RtnyoAAAAASUVORK5CYII=",
  wd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXlJREFUeNrsl7FugzAQQKMOKGPGTigDH+CxY8aO/gQm1DFjNjpWYsjYbskndOMHQF2QMlZiyYTSCSQG2o2eJbuyEOCYs8PSk04oPuT3wBgui8V/IKJt2wPLOeEiDrPAi6K4sLyphAx3XffF87wt/DzdRKILh6EnyCUMraxLDMGluj0JFdyqxLVwKxK6cKMSU+FGJLBwHYk71SSO43zB4Qj5g1nONE0JHOiUVy27ghXm6pMkOcHQs5YARsIIfKqEUbiuhDF4H0glMQYXNR2BVkfiGjir8e2sdcvPkGRMQgEnfA65pr3ulUJiDF6hnoe6rl8lic1QS9YD3wh4HMcfqJ2QZdlO6v38rkQP3BcnR1H0zmuP2G3oD0lw8BicGOkL4E7Qbwg+/75Hcs8K7JwgCI5G4SLyPH8Qayt/3cTzwOCU0jcY2kGubfWGpGmav1ZcwMuyrCT4vdXuOAzDNUh8ivWW+oatdXj37YdtWtAS7I/JLHAplhj4rwADAAc8Lmsu6N7iAAAAAElFTkSuQmCC",
  yd =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUhJREFUeNrslz0OgjAYhqmTo6MTEwcwYeUOduEAbo4egdHNI+DMpFNHHSCOcAUHorfArwlNKukP9gcXvuSLUJs+T4q+QBDMZVFd1+W0/wlnlf8F3rbti/akEjw8DMNjFEUHOK0nkRjCYWgPvYShlXcJEbwoijWF99/7k1DA6779SWjgrPxI6OBlWda0vUno4DCWQWMuE4QSdI6xAEDvKrggmHiJrBfIZIzFGJE4jt9pmhI43FRV1SRJcoXjBtbesi1GCO3g40znQN+YhO1voCOEPFjaSbb96zoPduKk2wGtACsRXBbFAzl7ARlcFcW8hJWACq6LYjbfRiBXwcdEMbeGcWEHUYznKJ6j2EoAohir4DIJJwKyKB7xtOwvin98ZHcbxSbvDc6i2PRvrBJAugXgPv+k937oi2mW9GsYxzEO7MvFGn7qI8AAjvv49jSDa0QAAAAASUVORK5CYII=",
  go = ({ data: e, isLoading: t }) => {
    const { t: n } = b();
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h3", { className: `${Be.strikeOut} w-100 text-center mt-3`, children: n("Assets") }),
        i.jsxs("div", {
          className: "d-flex flex-wrap justify-content-center",
          children: [
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Subcapital") }),
                }),
                i.jsxs("div", {
                  className: "d-flex align-items-center flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: md,
                      textVariant: e != null && e.frigate ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.frigate ? "success" : t ? void 0 : "warning",
                      text: e != null && e.frigate ? (e == null ? void 0 : e.frigate) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Frigate hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: ud,
                      textVariant: e != null && e.destroyer ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.destroyer ? "success" : t ? void 0 : "warning",
                      text: e != null && e.destroyer ? (e == null ? void 0 : e.destroyer) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Destroyer hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: ad,
                      textVariant: e != null && e.cruiser ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.cruiser ? "success" : t ? void 0 : "warning",
                      text: e != null && e.cruiser ? (e == null ? void 0 : e.cruiser) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Cruiser hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: Ad,
                      textVariant:
                        e != null && e.battlecruiser ? "success" : t ? void 0 : "warning",
                      cardVariant:
                        e != null && e.battlecruiser ? "success" : t ? void 0 : "warning",
                      text:
                        e != null && e.battlecruiser ? (e == null ? void 0 : e.battlecruiser) : "-",
                      isLoading: t,
                      toolTipText: n("Count of battlecruisers hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: ld,
                      textVariant: e != null && e.battleship ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.battleship ? "success" : t ? void 0 : "warning",
                      text: e != null && e.battleship ? (e == null ? void 0 : e.battleship) : "-",
                      isLoading: t,
                      toolTipText: n("Count of battleship hulls owned"),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Capital") }),
                }),
                i.jsxs("div", {
                  className: "d-flex align-items-center flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: cd,
                      textVariant: e != null && e.carrier ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.carrier ? "success" : t ? void 0 : "warning",
                      text: e != null && e.carrier ? (e == null ? void 0 : e.carrier) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Carrier hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: gd,
                      textVariant: e != null && e.fax ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.fax ? "success" : t ? void 0 : "warning",
                      text: e != null && e.fax ? (e == null ? void 0 : e.fax) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Fax hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: dd,
                      textVariant: e != null && e.dread ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.dread ? "success" : t ? void 0 : "warning",
                      text: e != null && e.dread ? (e == null ? void 0 : e.dread) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Dread hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: wd,
                      textVariant: e != null && e.supercarrier ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.supercarrier ? "success" : t ? void 0 : "warning",
                      text:
                        e != null && e.supercarrier ? (e == null ? void 0 : e.supercarrier) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Super Carrier hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: yd,
                      textVariant: e != null && e.titan ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.titan ? "success" : t ? void 0 : "warning",
                      text: e != null && e.titan ? (e == null ? void 0 : e.titan) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Titan hulls owned"),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Industrial") }),
                }),
                i.jsxs("div", {
                  className: "d-flex align-items-center flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: jd,
                      textVariant: e != null && e.mining ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.mining ? "success" : t ? void 0 : "warning",
                      text: e != null && e.mining ? (e == null ? void 0 : e.mining) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Subcap Industry hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: xd,
                      textVariant: e != null && e.hauler ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.hauler ? "success" : t ? void 0 : "warning",
                      text: e != null && e.hauler ? (e == null ? void 0 : e.hauler) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Subcap Hauler hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: pd,
                      textVariant: e != null && e.indy_command ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.indy_command ? "success" : t ? void 0 : "warning",
                      text:
                        e != null && e.indy_command ? (e == null ? void 0 : e.indy_command) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Subcap Industrial Command hulls owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: hd,
                      textVariant: e != null && e.capital_indy ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.capital_indy ? "success" : t ? void 0 : "warning",
                      text:
                        e != null && e.capital_indy ? (e == null ? void 0 : e.capital_indy) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Capital Industrial hulls owned"),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: n("Notable") }),
                }),
                i.jsxs("div", {
                  className: "d-flex align-items-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: co,
                      textVariant: e != null && e.injector ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.injector ? "success" : t ? void 0 : "warning",
                      text: e != null && e.injector ? (e == null ? void 0 : e.injector) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Skill Injectors owned"),
                    }),
                    i.jsx(D, {
                      iconSrc: fd,
                      textVariant: e != null && e.extractor ? "success" : t ? void 0 : "warning",
                      cardVariant: e != null && e.extractor ? "success" : t ? void 0 : "warning",
                      text: e != null && e.extractor ? (e == null ? void 0 : e.extractor) : "-",
                      isLoading: t,
                      toolTipText: n("Count of Skill Extractors owned"),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Sd = () => {
    const { characterID: e } = q(),
      { data: t, isLoading: n } = O({
        queryKey: ["glances", "assets", e],
        queryFn: () => ba(e ? Number(e) : 0),
        refetchOnWindowFocus: !1,
      });
    return console.log(t, n), i.jsx(go, { data: t, isLoading: n });
  },
  vd = ({ corporationID: e = 0 }) => {
    const { data: t, isLoading: n } = O({
      queryKey: ["glances", "corp", "assets", e],
      queryFn: () => Tu(e),
      refetchOnWindowFocus: !1,
    });
    return i.jsx(go, { data: t, isLoading: n });
  },
  Cd = "/static/corptools/bs5/static/img/amarr_128-B9KvGWt4.png",
  Fd = "/static/corptools/bs5/static/img/caldari_128-BSQ2VRRx.png",
  Rd =
    "data:image/png;base64,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",
  bd = "/static/corptools/bs5/static/img/gallente_128-oOYpsEmX.png",
  Ed = "/static/corptools/bs5/static/img/minmatar128-BCerHXFk.png",
  ho = ({ data: e }) => {
    var n,
      r,
      s,
      o,
      A,
      l,
      a,
      c,
      u,
      d,
      g,
      f,
      h,
      m,
      x,
      j,
      v,
      y,
      k,
      V,
      I,
      M,
      z,
      W,
      G,
      Y,
      le,
      ee,
      je,
      Ee,
      Pe;
    const { t } = b();
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h3", {
          className: `${Be.strikeOut} w-100 text-center mt-3`,
          children: t("Affiliations"),
        }),
        i.jsxs("div", {
          className: "d-flex flex-wrap justify-content-center",
          children: [
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: t("Detected Militia") }),
                }),
                i.jsxs("div", {
                  className: "d-flex flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: Cd,
                      cardVariant:
                        (n = e == null ? void 0 : e.factions) != null && n.amarr
                          ? "success"
                          : void 0,
                      textVariant:
                        (r = e == null ? void 0 : e.factions) != null && r.amarr
                          ? "success"
                          : "muted",
                      text:
                        (s = e == null ? void 0 : e.factions) != null && s.amarr
                          ? (o = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : o.amarr
                          : "-",
                      toolTipText: t("Number of detected alts in Amarr Militia"),
                    }),
                    i.jsx(D, {
                      iconSrc: bd,
                      cardVariant:
                        (A = e == null ? void 0 : e.factions) != null && A.gallente
                          ? "success"
                          : void 0,
                      textVariant:
                        (l = e == null ? void 0 : e.factions) != null && l.gallente
                          ? "success"
                          : "muted",
                      text:
                        (a = e == null ? void 0 : e.factions) != null && a.gallente
                          ? (c = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : c.gallente
                          : "-",
                      toolTipText: t("Number of detected alts in Gallente Militia"),
                    }),
                    i.jsx(D, {
                      iconSrc: Ed,
                      cardVariant:
                        (u = e == null ? void 0 : e.factions) != null && u.minmatar
                          ? "success"
                          : void 0,
                      textVariant:
                        (d = e == null ? void 0 : e.factions) != null && d.minmatar
                          ? "success"
                          : "muted",
                      text:
                        (g = e == null ? void 0 : e.factions) != null && g.minmatar
                          ? (f = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : f.minmatar
                          : "-",
                      toolTipText: t("Number of detected alts in Minmatar Militia"),
                    }),
                    i.jsx(D, {
                      iconSrc: Fd,
                      cardVariant:
                        (h = e == null ? void 0 : e.factions) != null && h.caldari
                          ? "success"
                          : void 0,
                      textVariant:
                        (m = e == null ? void 0 : e.factions) != null && m.caldari
                          ? "success"
                          : "muted",
                      text:
                        (x = e == null ? void 0 : e.factions) != null && x.caldari
                          ? (j = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : j.caldari
                          : "-",
                      toolTipText: t("Number of detected alts in Caldari Militia"),
                    }),
                    i.jsx(D, {
                      cardVariant:
                        (v = e == null ? void 0 : e.factions) != null && v.angel
                          ? "success"
                          : void 0,
                      textVariant:
                        (y = e == null ? void 0 : e.factions) != null && y.angel
                          ? "success"
                          : "muted",
                      iconSrc: "https://images.evetech.net/corporations/500011/logo?size=128",
                      text:
                        (k = e == null ? void 0 : e.factions) != null && k.angel
                          ? (V = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : V.angel
                          : "-",
                      toolTipText: t("Number of detected alts in Angel Cartel Militia"),
                    }),
                    i.jsx(D, {
                      cardVariant:
                        (I = e == null ? void 0 : e.factions) != null && I.guristas
                          ? "success"
                          : void 0,
                      textVariant:
                        (M = e == null ? void 0 : e.factions) != null && M.guristas
                          ? "success"
                          : "muted",
                      iconSrc: "https://images.evetech.net/corporations/500010/logo?size=128",
                      text:
                        (z = e == null ? void 0 : e.factions) != null && z.guristas
                          ? (W = e == null ? void 0 : e.factions) == null
                            ? void 0
                            : W.guristas
                          : "-",
                      toolTipText: t("Number of detected alts in Guristas Militia"),
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs(S, {
              className: "m-2",
              children: [
                i.jsx(S.Header, {
                  className: "text-center",
                  children: i.jsx(S.Title, { children: t("Loyalty Points") }),
                }),
                i.jsxs("div", {
                  className: "d-flex h-100 align-items-center flex-wrap justify-content-center",
                  children: [
                    i.jsx(D, {
                      iconSrc: Rd,
                      text:
                        (G = e == null ? void 0 : e.lp) != null && G.total
                          ? (le = (Y = e == null ? void 0 : e.lp) == null ? void 0 : Y.total) ==
                            null
                            ? void 0
                            : le.toLocaleString("en-US", {
                                maximumFractionDigits: 2,
                                notation: "compact",
                                compactDisplay: "short",
                              })
                          : "0",
                      textVariant:
                        (ee = e == null ? void 0 : e.lp) != null && ee.total ? "success" : void 0,
                      cardVariant:
                        (je = e == null ? void 0 : e.lp) != null && je.total ? "success" : void 0,
                      toolTipText: t("Total LP"),
                    }),
                    (Pe = (Ee = e == null ? void 0 : e.lp) == null ? void 0 : Ee.top_five) == null
                      ? void 0
                      : Pe.map((X) => {
                          var me;
                          return i.jsx(D, {
                            iconSrc: `https://images.evetech.net/corporations/${X.corp_id}/logo?size=128`,
                            text:
                              X != null && X.lp
                                ? (me = X == null ? void 0 : X.lp) == null
                                  ? void 0
                                  : me.toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                      notation: "compact",
                                      compactDisplay: "short",
                                    })
                                : "?",
                            textVariant: "muted",
                            toolTipText: X.corp_name,
                          });
                        }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Nd = () => {
    const { characterID: e } = q(),
      { data: t } = O({
        queryKey: ["glances", "faction", e],
        queryFn: () => Na(e ? Number(e) : 0),
        refetchOnWindowFocus: !1,
      });
    return i.jsx(ho, { data: t });
  },
  Od = ({ corporationID: e = 0 }) => {
    const { data: t } = O({
      queryKey: ["glances", "corp", "faction", e],
      queryFn: () => Bu(e),
      refetchOnWindowFocus: !1,
    });
    return i.jsx(ho, { data: t });
  },
  Id = () =>
    i.jsxs("div", {
      className: "d-flex flex-column align-items-center",
      children: [i.jsx(Iu, {}), i.jsx(Sd, {}), i.jsx(id, {}), i.jsx(Nd, {})],
    }),
  Td = () => i.jsx(i.Fragment, { children: i.jsx(Id, {}) }),
  Dd = "_menuRefreshSpin_17lcv_1",
  kd = { menuRefreshSpin: Dd };
function ir({
  children: e,
  character: t,
  style: n,
  bg: r,
  border: s,
  isFetching: o,
  headerIcon: A,
  heading: l,
  roundedImages: a,
  portaitSize: c = 350,
}) {
  return i.jsx(
    S,
    {
      className: "m-2",
      style: n,
      bg: r,
      border: s,
      children: i.jsxs(S.Body, {
        className: "d-flex flex-column align-items-center p-0",
        children: [
          i.jsx(si, { className: "card-img-top", size: c, character: t, roundedImages: a }),
          i.jsxs(S.Title, {
            className: "text-center w-100 pt-2",
            children: [
              i.jsxs(Bo, {
                className: "justify-content-between",
                children: [
                  i.jsx("div", {
                    className: "w-auto",
                    children: A && i.jsx("i", { className: `${A} fa-fw` }),
                  }),
                  i.jsx("div", { className: "w-auto", children: l }),
                  i.jsx("div", {
                    className: "w-auto",
                    children:
                      o && i.jsx("i", { className: `fas fa-sync-alt fa-fw ${kd.menuRefreshSpin}` }),
                  }),
                ],
              }),
              A && i.jsx(i.Fragment, {}),
            ],
          }),
          e,
        ],
      }),
    },
    `panel ${t.character_name}`,
  );
}
const Bd = ({ isFetching: e, data: t }) => {
    const { t: n } = b();
    return t
      ? i.jsx("div", {
          className: "d-flex justify-content-around align-items-center flex-row flex-wrap",
          children:
            t == null
              ? void 0
              : t.characters.map((r) => {
                  var o;
                  const s = r.active ? "success" : "warning";
                  return i.jsx(ir, {
                    border: s,
                    isFetching: e,
                    character: r.character,
                    heading: r.character.character_name,
                    roundedImages: "10",
                    children: i.jsx("div", {
                      style: { width: "350px" },
                      children: i.jsxs("div", {
                        children: [
                          i.jsx(Se, {
                            striped: !0,
                            style: { marginBottom: 0 },
                            children: i.jsx("thead", {
                              children: i.jsxs(
                                "tr",
                                {
                                  children: [
                                    i.jsx("th", { children: n("Corporation") }),
                                    i.jsx("th", { className: "text-end", children: n("Joined") }),
                                  ],
                                },
                                `head-${r.character}`,
                              ),
                            }),
                          }),
                          i.jsx("div", {
                            style: { width: "350px", height: "250px", overflowY: "auto" },
                            className: "card-img-bottom",
                            children: i.jsx(Se, {
                              striped: !0,
                              children: i.jsx("tbody", {
                                children:
                                  (o = r.history) == null
                                    ? void 0
                                    : o.map((A) =>
                                        i.jsxs(
                                          "tr",
                                          {
                                            children: [
                                              i.jsx("td", {
                                                children: A.corporation.corporation_name,
                                              }),
                                              i.jsx("td", {
                                                className: "text-end text-nowrap",
                                                children: A.start.slice(0, 10),
                                              }),
                                            ],
                                          },
                                          A.start,
                                        ),
                                      ),
                              }),
                            }),
                          }),
                        ],
                      }),
                    }),
                  });
                }),
        })
      : i.jsx(oe, {});
  },
  Pd = () => {
    const { characterID: e } = q(),
      { data: t, isFetching: n } = O(["pubdata", e], () => Ma(e ? Number(e) : 0), {
        refetchOnWindowFocus: !1,
      });
    return console.log(t), i.jsx(i.Fragment, { children: i.jsx(Bd, { isFetching: n, data: t }) });
  },
  Md = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      { data: n, isFetching: r } = O({
        queryKey: ["roles", t],
        queryFn: () => Ra(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      s = Z(),
      o = [
        s.accessor("character.character_name", { header: e("Character") }),
        s.accessor("character.corporation_name", { header: e("Corporation") }),
        s.accessor("director", {
          header: e("Director"),
          cell: (A) => i.jsx(Ue, { checked: A.getValue() }),
        }),
        s.accessor("station_manager", {
          header: e("Station Manager"),
          cell: (A) => i.jsx(Ue, { checked: A.getValue() }),
        }),
        s.accessor("personnel_manager", {
          header: e("Personnel Manager"),
          cell: (A) => i.jsx(Ue, { checked: A.getValue() }),
        }),
        s.accessor("accountant", {
          header: e("Accountant"),
          cell: (A) => i.jsx(Ue, { checked: A.getValue() }),
        }),
        s.accessor("titles", {
          header: e("Titles"),
          cell: (A) => {
            var l;
            return (l = A.getValue()) == null
              ? void 0
              : l.map((a) => i.jsx($, { bg: "secondary", children: a.name }));
          },
        }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { data: n, isFetching: r, columns: o }) });
  };
var Vd = ["date", "verboseDate", "tooltip", "children"];
function Vn() {
  return (
    (Vn =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }),
    Vn.apply(this, arguments)
  );
}
function Ld(e, t) {
  if (e == null) return {};
  var n = Hd(e, t),
    r,
    s;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (s = 0; s < o.length; s++)
      (r = o[s]),
        !(t.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(e, r) && (n[r] = e[r]);
  }
  return n;
}
function Hd(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    s,
    o;
  for (o = 0; o < r.length; o++) (s = r[o]), !(t.indexOf(s) >= 0) && (n[s] = e[s]);
  return n;
}
function Wt(e, t) {
  var n = e.date,
    r = e.verboseDate,
    s = e.tooltip,
    o = e.children,
    A = Ld(e, Vd),
    l = R.useMemo(
      function () {
        return n.toISOString();
      },
      [n],
    );
  return ie.createElement("time", Vn({ ref: t }, A, { dateTime: l, title: s ? r : void 0 }), o);
}
Wt = ie.forwardRef(Wt);
Wt.propTypes = {
  date: H.instanceOf(Date).isRequired,
  verboseDate: H.string,
  tooltip: H.bool.isRequired,
  children: H.string.isRequired,
};
function Ln(e) {
  "@babel/helpers - typeof";
  return (
    (Ln =
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
    Ln(e)
  );
}
function Ud(e) {
  if (mo()) return Intl.DateTimeFormat.supportedLocalesOf(e)[0];
}
function mo() {
  var e = (typeof Intl > "u" ? "undefined" : Ln(Intl)) === "object";
  return e && typeof Intl.DateTimeFormat == "function";
}
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
function _d(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function qd(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function zd(e, t, n) {
  return t && qd(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var po = (function () {
    function e() {
      _d(this, e), (this.cache = {});
    }
    return (
      zd(e, [
        {
          key: "get",
          value: function () {
            for (var n = this.cache, r = arguments.length, s = new Array(r), o = 0; o < r; o++)
              s[o] = arguments[o];
            for (var A = 0, l = s; A < l.length; A++) {
              var a = l[A];
              if (Gt(n) !== "object") return;
              n = n[a];
            }
            return n;
          },
        },
        {
          key: "put",
          value: function () {
            for (var n = arguments.length, r = new Array(n), s = 0; s < n; s++) r[s] = arguments[s];
            for (var o = r.pop(), A = r.pop(), l = this.cache, a = 0, c = r; a < c.length; a++) {
              var u = c[a];
              Gt(l[u]) !== "object" && (l[u] = {}), (l = l[u]);
            }
            return (l[A] = o);
          },
        },
      ]),
      e
    );
  })(),
  Ms = new po(),
  Wd = mo(),
  Gd = function (t) {
    return t.toString();
  };
function Yd(e, t) {
  if (!Wd) return Gd;
  var n = Kd(e),
    r = JSON.stringify(t),
    s = Ms.get(String(n), r) || Ms.put(String(n), r, new Intl.DateTimeFormat(n, t));
  return function (o) {
    return s.format(o);
  };
}
const Jd = Ho(Yd);
var wn = {};
function Kd(e) {
  var t = e.toString();
  return wn[t] ? wn[t] : (wn[t] = Ud(e));
}
function Hn(e) {
  "@babel/helpers - typeof";
  return (
    (Hn =
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
    Hn(e)
  );
}
function Qd(e) {
  return Zd(e) ? e : new Date(e);
}
function Zd(e) {
  return e instanceof Date || Xd(e);
}
function Xd(e) {
  return Hn(e) === "object" && typeof e.getTime == "function";
}
var Vs = new po();
function $d(e, t) {
  var n = t.polyfill,
    r = String(e) + ":" + String(n);
  return Vs.get(r) || Vs.put(r, new zn(e, { polyfill: n }));
}
var on = { exports: {} },
  at = { exports: {} };
(function () {
  var e, t, n, r, s, o;
  typeof performance < "u" && performance !== null && performance.now
    ? (at.exports = function () {
        return performance.now();
      })
    : typeof process < "u" && process !== null && process.hrtime
      ? ((at.exports = function () {
          return (e() - s) / 1e6;
        }),
        (t = process.hrtime),
        (e = function () {
          var A;
          return (A = t()), A[0] * 1e9 + A[1];
        }),
        (r = e()),
        (o = process.uptime() * 1e9),
        (s = r - o))
      : Date.now
        ? ((at.exports = function () {
            return Date.now() - n;
          }),
          (n = Date.now()))
        : ((at.exports = function () {
            return new Date().getTime() - n;
          }),
          (n = new Date().getTime()));
}).call($s);
var ef = at.exports,
  tf = ef,
  be = typeof window > "u" ? $s : window,
  Dt = ["moz", "webkit"],
  Ke = "AnimationFrame",
  tt = be["request" + Ke],
  xt = be["cancel" + Ke] || be["cancelRequest" + Ke];
for (var lt = 0; !tt && lt < Dt.length; lt++)
  (tt = be[Dt[lt] + "Request" + Ke]),
    (xt = be[Dt[lt] + "Cancel" + Ke] || be[Dt[lt] + "CancelRequest" + Ke]);
if (!tt || !xt) {
  var yn = 0,
    Ls = 0,
    Le = [],
    nf = 1e3 / 60;
  (tt = function (e) {
    if (Le.length === 0) {
      var t = tf(),
        n = Math.max(0, nf - (t - yn));
      (yn = n + t),
        setTimeout(function () {
          var r = Le.slice(0);
          Le.length = 0;
          for (var s = 0; s < r.length; s++)
            if (!r[s].cancelled)
              try {
                r[s].callback(yn);
              } catch (o) {
                setTimeout(function () {
                  throw o;
                }, 0);
              }
        }, Math.round(n));
    }
    return Le.push({ handle: ++Ls, callback: e, cancelled: !1 }), Ls;
  }),
    (xt = function (e) {
      for (var t = 0; t < Le.length; t++) Le[t].handle === e && (Le[t].cancelled = !0);
    });
}
on.exports = function (e) {
  return tt.call(be, e);
};
on.exports.cancel = function () {
  xt.apply(be, arguments);
};
on.exports.polyfill = function (e) {
  e || (e = be), (e.requestAnimationFrame = tt), (e.cancelAnimationFrame = xt);
};
var rf = on.exports;
const Hs = Ro(rf);
function sf(e, t) {
  if (e.length === 0) return 0;
  for (var n = 0, r = e.length - 1, s; n <= r; ) {
    s = Math.floor((r + n) / 2);
    var o = t(e[s]);
    if (o === 0) return s;
    if (o < 0) {
      if (((n = s + 1), n > r)) return n;
    } else if (((r = s - 1), r < n)) return n;
  }
}
function of(e, t) {
  return af(e) || cf(e, t) || lf(e, t) || Af();
}
function Af() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lf(e, t) {
  if (e) {
    if (typeof e == "string") return Us(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if ((n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set"))
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Us(e, t);
  }
}
function Us(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function cf(e, t) {
  var n = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n != null) {
    var r = [],
      s = !0,
      o = !1,
      A,
      l;
    try {
      for (
        n = n.call(e);
        !(s = (A = n.next()).done) && (r.push(A.value), !(t && r.length === t));
        s = !0
      );
    } catch (a) {
      (o = !0), (l = a);
    } finally {
      try {
        !s && n.return != null && n.return();
      } finally {
        if (o) throw l;
      }
    }
    return r;
  }
}
function af(e) {
  if (Array.isArray(e)) return e;
}
const uf = {
  instances: [],
  add: function (t) {
    var n = this,
      r = this.instances.length === 0;
    return (
      xo(this.instances, t),
      r && this.start(),
      {
        stop: function () {
          jo(n.instances, t), n.instances.length === 0 && n.stop();
        },
        forceUpdate: function () {
          _s(t, n.instances);
        },
      }
    );
  },
  tick: function () {
    for (var t = Date.now(); ; ) {
      var n = this.instances[0];
      if (t >= n.nextUpdateTime) _s(n, this.instances);
      else break;
    }
  },
  scheduleNextTick: function () {
    var t = this;
    this.scheduledTick = Hs(function () {
      t.tick(), t.scheduleNextTick();
    });
  },
  start: function () {
    this.scheduleNextTick();
  },
  stop: function () {
    Hs.cancel(this.scheduledTick);
  },
};
function df(e) {
  var t = e.getNextValue(),
    n = of(t, 2),
    r = n[0],
    s = n[1];
  e.setValue(r), (e.nextUpdateTime = s);
}
function _s(e, t) {
  df(e), jo(t, e), xo(t, e);
}
function xo(e, t) {
  var n = ff(e, t);
  e.splice(n, 0, t);
}
function jo(e, t) {
  var n = e.indexOf(t);
  e.splice(n, 1);
}
function ff(e, t) {
  var n = t.nextUpdateTime;
  return sf(e, function (r) {
    return r.nextUpdateTime === n ? 0 : r.nextUpdateTime > n ? 1 : -1;
  });
}
function kt(e, t) {
  return pf(e) || mf(e, t) || hf(e, t) || gf();
}
function gf() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hf(e, t) {
  if (e) {
    if (typeof e == "string") return qs(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if ((n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set"))
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return qs(e, t);
  }
}
function qs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function mf(e, t) {
  var n = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n != null) {
    var r = [],
      s = !0,
      o = !1,
      A,
      l;
    try {
      for (
        n = n.call(e);
        !(s = (A = n.next()).done) && (r.push(A.value), !(t && r.length === t));
        s = !0
      );
    } catch (a) {
      (o = !0), (l = a);
    } finally {
      try {
        !s && n.return != null && n.return();
      } finally {
        if (o) throw l;
      }
    }
    return r;
  }
}
function pf(e) {
  if (Array.isArray(e)) return e;
}
function xf(e) {
  var t = e.date,
    n = e.future,
    r = e.locale,
    s = e.locales,
    o = e.timeStyle,
    A = e.round,
    l = e.minTimeLeft,
    a = e.formatVerboseDate,
    c = e.verboseDateFormat,
    u = c === void 0 ? yf : c,
    d = e.updateInterval,
    g = e.tick,
    f = g === void 0 ? !0 : g,
    h = e.now,
    m = e.timeOffset,
    x = m === void 0 ? 0 : m,
    j = e.polyfill,
    v = R.useMemo(
      function () {
        return r && (s = [r]), s.concat(zn.getDefaultLocale());
      },
      [r, s],
    ),
    y = R.useMemo(
      function () {
        return $d(v, { polyfill: j });
      },
      [v, j],
    );
  t = R.useMemo(
    function () {
      return Qd(t);
    },
    [t],
  );
  var k = R.useCallback(
      function () {
        var X = (h || Date.now()) - x,
          me;
        if ((n && X >= t.getTime() && ((X = t.getTime()), (me = !0)), l !== void 0)) {
          var Me = t.getTime() - l * 1e3;
          X > Me && ((X = Me), (me = !0));
        }
        var Ft = y.format(t, o, { getTimeToNextUpdate: !0, now: X, future: n, round: A }),
          it = kt(Ft, 2),
          Rt = it[0],
          Ve = it[1];
        return me ? (Ve = wf) : (Ve = d || Ve || 60 * 1e3), [Rt, X + Ve];
      },
      [t, n, o, d, A, l, y, h],
    ),
    V = R.useRef();
  V.current = k;
  var I = R.useMemo(k, []),
    M = kt(I, 2),
    z = M[0],
    W = M[1],
    G = R.useState(z),
    Y = kt(G, 2),
    le = Y[0],
    ee = Y[1],
    je = R.useRef();
  R.useEffect(
    function () {
      if (f)
        return (
          (je.current = uf.add({
            getNextValue: function () {
              return V.current();
            },
            setValue: ee,
            nextUpdateTime: W,
          })),
          function () {
            return je.current.stop();
          }
        );
    },
    [f],
  ),
    R.useEffect(
      function () {
        if (je.current) je.current.forceUpdate();
        else {
          var X = k(),
            me = kt(X, 1),
            Me = me[0];
          ee(Me);
        }
      },
      [k],
    );
  var Ee = R.useMemo(
      function () {
        return Jd(v, u);
      },
      [v, u],
    ),
    Pe = R.useMemo(
      function () {
        return a ? a(t) : Ee(t);
      },
      [t, a, Ee],
    );
  return { date: t, formattedDate: le, verboseDate: Pe };
}
var jf = 365 * 24 * 60 * 60 * 1e3,
  wf = 1e3 * jf,
  yf = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  },
  Un = H.oneOfType,
  zs = H.arrayOf,
  Je = H.string,
  Ws = H.number,
  ut = H.shape,
  Bt = H.func,
  Sf = Un([
    ut({ minTime: Ws, formatAs: Je.isRequired }),
    ut({ test: Bt, formatAs: Je.isRequired }),
    ut({ minTime: Ws, format: Bt.isRequired }),
    ut({ test: Bt, format: Bt.isRequired }),
  ]),
  vf = Un([Je, ut({ steps: zs(Sf).isRequired, labels: Un([Je, zs(Je)]).isRequired, round: Je })]),
  Cf = [
    "date",
    "future",
    "timeStyle",
    "round",
    "minTimeLeft",
    "locale",
    "locales",
    "formatVerboseDate",
    "verboseDateFormat",
    "updateInterval",
    "tick",
    "now",
    "timeOffset",
    "polyfill",
    "tooltip",
    "component",
    "container",
    "wrapperComponent",
    "wrapperProps",
  ];
function Yt() {
  return (
    (Yt =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }),
    Yt.apply(this, arguments)
  );
}
function Ff(e, t) {
  if (e == null) return {};
  var n = Rf(e, t),
    r,
    s;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (s = 0; s < o.length; s++)
      (r = o[s]),
        !(t.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(e, r) && (n[r] = e[r]);
  }
  return n;
}
function Rf(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    s,
    o;
  for (o = 0; o < r.length; o++) (s = r[o]), !(t.indexOf(s) >= 0) && (n[s] = e[s]);
  return n;
}
function nt(e) {
  var t = e.date,
    n = e.future,
    r = e.timeStyle,
    s = e.round,
    o = e.minTimeLeft,
    A = e.locale,
    l = e.locales,
    a = l === void 0 ? [] : l,
    c = e.formatVerboseDate,
    u = e.verboseDateFormat,
    d = e.updateInterval,
    g = e.tick,
    f = e.now,
    h = e.timeOffset,
    m = e.polyfill,
    x = e.tooltip,
    j = x === void 0 ? !0 : x,
    v = e.component,
    y = v === void 0 ? Wt : v,
    k = e.container,
    V = e.wrapperComponent,
    I = e.wrapperProps,
    M = Ff(e, Cf),
    z = xf({
      date: t,
      future: n,
      timeStyle: r,
      round: s,
      minTimeLeft: o,
      locale: A,
      locales: a,
      formatVerboseDate: c,
      verboseDateFormat: u,
      updateInterval: d,
      tick: g,
      now: f,
      timeOffset: h,
      polyfill: m,
    }),
    W = z.date,
    G = z.verboseDate,
    Y = z.formattedDate,
    le = ie.createElement(y, Yt({ date: W, verboseDate: G, tooltip: j }, M), Y),
    ee = V || k;
  return ee ? ie.createElement(ee, Yt({}, I, { verboseDate: G }), le) : le;
}
nt.propTypes = {
  date: H.oneOfType([H.instanceOf(Date), H.number]).isRequired,
  locale: H.string,
  locales: H.arrayOf(H.string),
  future: H.bool,
  timeStyle: vf,
  round: H.string,
  minTimeLeft: H.number,
  component: H.elementType,
  tooltip: H.bool,
  formatVerboseDate: H.func,
  verboseDateFormat: H.object,
  updateInterval: H.oneOfType([
    H.number,
    H.arrayOf(H.shape({ threshold: H.number, interval: H.number.isRequired })),
  ]),
  tick: H.bool,
  now: H.number,
  timeOffset: H.number,
  polyfill: H.bool,
  wrapperComponent: H.elementType,
  wrapperProps: H.object,
};
nt = ie.memo(nt);
const bf = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      {
        isLoading: n,
        isFetching: r,
        error: s,
        data: o,
      } = O(["skills", "queue", t], () => Da(t ? Number(t) : 0), { refetchOnWindowFocus: !1 }),
      [A, l] = R.useState(!0),
      [a, c] = R.useState(!0),
      [u, d] = R.useState(!1);
    if (n) return i.jsx(oe, {});
    if (s) return i.jsx(et, {});
    const g = (x) => {
        l(x.currentTarget.checked);
      },
      f = (x) => {
        c(x.currentTarget.checked);
      },
      h = (x) => {
        d(x.currentTarget.checked);
      };
    let m = o.filter((x) => {
      let j = !1,
        v = !1,
        y = !1;
      return (
        x.queue
          ? x.queue.length && x.queue[0].end
            ? (j = !0)
            : x.queue.length
              ? (v = !0)
              : (y = !0)
          : (y = !0),
        (A && j) || (u && y) || (a && v)
      );
    });
    return n
      ? i.jsx(oe, {})
      : s
        ? i.jsx(et, {})
        : i.jsxs(i.Fragment, {
            children: [
              i.jsx("h5", { className: "text-center", children: e("Filters") }),
              i.jsxs(Po, {
                className: "col-xs-12 text-center",
                children: [
                  i.jsx(J.Check, {
                    defaultChecked: A,
                    onChange: g,
                    label: e("Active"),
                    inline: !0,
                  }),
                  i.jsx(J.Check, {
                    defaultChecked: a,
                    onChange: f,
                    label: e("Paused"),
                    inline: !0,
                  }),
                  i.jsx(J.Check, { defaultChecked: u, onChange: h, label: e("Empty"), inline: !0 }),
                ],
              }),
              i.jsx("div", {
                className: "d-flex justify-content-around align-items-center flex-row flex-wrap",
                children:
                  m == null
                    ? void 0
                    : m.map((x) => {
                        var v;
                        let j = x.queue.length ? { border: "success" } : { border: "warning" };
                        return (
                          x.queue.length > 0 && !x.queue[0].end && (j = { border: "info" }),
                          i.jsxs(ir, {
                            ...j,
                            isFetching: r,
                            character: x.character,
                            heading: x.character.character_name,
                            roundedImages: "10",
                            portaitSize: 450,
                            children: [
                              i.jsxs("h6", {
                                children: [
                                  x.character.corporation_name,
                                  x.character.alliance_name && ` (${x.character.alliance_name})`,
                                ],
                              }),
                              i.jsx("div", {
                                style: { width: "450px" },
                                children: i.jsxs("div", {
                                  children: [
                                    i.jsx(Se, {
                                      striped: !0,
                                      style: { marginBottom: 0 },
                                      children: i.jsx("thead", {
                                        children: i.jsxs(
                                          "tr",
                                          {
                                            children: [
                                              i.jsx("th", { children: e("Skill") }),
                                              i.jsx("th", {
                                                className: "text-end",
                                                children: e("Level"),
                                              }),
                                            ],
                                          },
                                          `head-${x.character.character_name}`,
                                        ),
                                      }),
                                    }),
                                    i.jsx("div", {
                                      style: { width: "450px", height: "350px", overflowY: "auto" },
                                      className: "card-img-bottom",
                                      children: i.jsx(Se, {
                                        striped: !0,
                                        children: i.jsx("tbody", {
                                          children:
                                            (v = x.queue) == null
                                              ? void 0
                                              : v.map((y) =>
                                                  i.jsx(
                                                    "tr",
                                                    {
                                                      children: i.jsxs("td", {
                                                        className: "no-margin",
                                                        children: [
                                                          i.jsxs("div", {
                                                            className:
                                                              "d-flex justify-content-between",
                                                            children: [
                                                              i.jsx("p", {
                                                                className: "m-0",
                                                                children: y.skill,
                                                              }),
                                                              i.jsx(oo, {
                                                                level: y.end_level,
                                                                trained: y.current_level,
                                                                active: y.current_level,
                                                              }),
                                                            ],
                                                          }),
                                                          i.jsx("div", {
                                                            className:
                                                              "d-flex justify-content-between",
                                                            children: y.end
                                                              ? i.jsxs(i.Fragment, {
                                                                  children: [
                                                                    i.jsx(nt, {
                                                                      date: Date.parse(y.end),
                                                                    }),
                                                                    i.jsxs("p", {
                                                                      className: "m-0 small",
                                                                      children: [
                                                                        (
                                                                          y.end_sp - y.start_sp
                                                                        ).toLocaleString(),
                                                                        "/",
                                                                        y.end_sp.toLocaleString(),
                                                                        " SP",
                                                                      ],
                                                                    }),
                                                                  ],
                                                                })
                                                              : i.jsxs(i.Fragment, {
                                                                  children: [
                                                                    i.jsx("i", {
                                                                      className:
                                                                        "fa-solid fa-pause",
                                                                    }),
                                                                    i.jsxs("p", {
                                                                      className: "m-0",
                                                                      children: [
                                                                        (
                                                                          y.end_sp - y.start_sp
                                                                        ).toLocaleString(),
                                                                        "/",
                                                                        y.end_sp.toLocaleString(),
                                                                        " SP",
                                                                      ],
                                                                    }),
                                                                  ],
                                                                }),
                                                          }),
                                                        ],
                                                      }),
                                                    },
                                                    `${x.character.character_name}${y.skill}${y.end_level}`,
                                                  ),
                                                ),
                                        }),
                                      }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          })
                        );
                      }),
              }),
            ],
          });
  },
  Ef = {
    option: (e) => ({ ...e, color: "black" }),
    container: (e) => ({ ...e, zIndex: 0 }),
    menu: (e) => ({ ...e, zIndex: 9999 }),
    menuList: (e) => ({ ...e, zIndex: 9999 }),
    menuPortal: (e) => ({ ...e, zIndex: 9999 }),
  },
  Sn = ({ setFilter: e, options: t, labelText: n }) =>
    i.jsxs("div", {
      className: "flex-grow-1 flex-even d-flex text-nowrap",
      children: [
        i.jsx("div", { className: "my-auto mx-2", children: i.jsx("h6", { children: n }) }),
        i.jsx(wt, {
          className: "m-1 flex-grow-1",
          styles: Ef,
          options: t,
          onChange: (r) => e(r.value),
          defaultValue: t[0],
          menuPortalTarget: document.body,
          menuPosition: "fixed",
        }),
      ],
    }),
  Nf = ({ group: e, skills: t }) => {
    const { t: n } = b();
    return i.jsxs(Lt.Item, {
      eventKey: `${e}`,
      children: [
        i.jsxs(Lt.Header, {
          children: [
            i.jsx("span", { className: "flex-grow-1", children: e }),
            i.jsxs("span", {
              className: "badge bg-secondary me-2",
              children: [
                t.reduce((r, s) => ((r += s.sp), r), 0).toLocaleString(),
                " ",
                n("Filtered SP"),
              ],
            }),
          ],
        }),
        i.jsx(Lt.Body, {
          className: "d-flex flex-wrap ",
          children: t
            .sort(function (r, s) {
              const o = r.skill.toLowerCase(),
                A = s.skill.toLowerCase();
              return o < A ? -1 : o > A ? 1 : 0;
            })
            .map((r) =>
              i.jsx(Ao, {
                skill: r.skill,
                level: r.level,
                active: r.active,
                trained: r.active,
                sp: r.sp,
              }),
            ),
        }),
      ],
    });
  },
  Of = ({ data: e }) => {
    const n = ((r, s) => r.reduce((o, A) => ({ ...o, [A[s]]: (o[A[s]] || []).concat(A) }), {}))(
      e,
      "group",
    );
    return Object.entries(n).length === 0
      ? i.jsx(oe, { title: "Nothing Found" })
      : (console.log(n),
        i.jsx(We, {
          children: i.jsx(Lt, {
            defaultActiveKey: [],
            alwaysOpen: !0,
            children: Object.entries(n)
              .sort(function (r, s) {
                const o = r[0].toLowerCase(),
                  A = s[0].toLowerCase();
                return o < A ? -1 : o > A ? 1 : 0;
              })
              .map((r) => i.jsx(Nf, { group: r[0], skills: r[1] })),
          }),
        }));
  },
  If = () => {
    var f, h, m;
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(t),
      [s, o] = R.useState("All"),
      [A, l] = R.useState(""),
      [a, c] = R.useState(-1),
      {
        isLoading: u,
        error: d,
        data: g,
      } = O(["skills", t], () => Ta(t ? Number(t) : 0), { refetchOnWindowFocus: !1 });
    if (u) return i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") });
    if (d) return i.jsx(et, {});
    if (n === "0")
      return (
        r(g[0].character.character_id),
        i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") })
      );
    {
      const x = g.filter((I) => I.character.character_id === Number(n || 0));
      let j = (f = x == null ? void 0 : x[0]) == null ? void 0 : f.skills;
      s !== "" &&
        s !== "All" &&
        (j = j == null ? void 0 : j.filter((I) => I.group.toLowerCase().includes(s.toLowerCase()))),
        a >= 0 && (j = j == null ? void 0 : j.filter((I) => I.level === a)),
        A !== "" &&
          (j =
            j == null ? void 0 : j.filter((I) => I.skill.toLowerCase().includes(A.toLowerCase())));
      const v = g.map((I) => ({
          value: I.character.character_id,
          label: I.character.character_name,
        })),
        y = [
          { value: -1, label: e("All") },
          { value: 0, label: e("0") },
          { value: 1, label: e("1") },
          { value: 2, label: e("2") },
          { value: 3, label: e("3") },
          { value: 4, label: e("4") },
          { value: 5, label: e("5") },
        ],
        k = new Set();
      (m = (h = x == null ? void 0 : x[0]) == null ? void 0 : h.skills) == null ||
        m.forEach((I) => {
          k.add(I.group);
        });
      const V = [{ value: "All", label: "All" }].concat(
        [...k.values()].sort().map((I) => ({ value: I, label: I })),
      );
      return i.jsxs(We, {
        children: [
          i.jsx(Sn, { setFilter: r, options: v, labelText: e("Character Select:") }),
          i.jsxs("div", {
            className: "d-flex justify-content-between mb-3",
            children: [
              i.jsx(Sn, { setFilter: c, options: y, labelText: e("Level Filter:") }),
              i.jsx(Sn, { setFilter: o, options: V, labelText: e("Group Filter:") }),
              i.jsx(io, { setFilterText: l, labelText: e("Skill Filter:") }),
            ],
          }),
          i.jsx(Of, { data: j }),
        ],
      });
    }
  };
function Pt(e) {
  const t = new Date(e);
  if (!Number.isNaN(t.valueOf())) return t;
  const n = String(e).match(/\d+/g);
  if (n == null || n.length <= 2) return t;
  {
    const [r, s, ...o] = n.map((a) => parseInt(a)),
      A = [r, s - 1, ...o];
    return new Date(Date.UTC(...A));
  }
}
function Gs(e, t, n) {
  const r = e !== 1 ? t + "s" : t;
  return e + " " + r + " " + n;
}
function _n() {
  return (
    (_n = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    _n.apply(this, arguments)
  );
}
const dt = 60,
  ft = dt * 60,
  Qe = ft * 24,
  Mt = Qe * 7,
  Ys = Qe * 30,
  Js = Qe * 365,
  Tf = () => Date.now();
function wo({
  date: e,
  formatter: t = Gs,
  component: n = "time",
  live: r = !0,
  minPeriod: s = 0,
  maxPeriod: o = Mt,
  title: A,
  now: l = Tf,
  ...a
}) {
  const [c, u] = R.useState(l());
  R.useEffect(() => {
    if (!r) return;
    const V = (() => {
      const I = Pt(e).valueOf();
      if (!I) return console.warn("[react-timeago] Invalid Date provided"), 0;
      const M = Math.round(Math.abs(c - I) / 1e3),
        z = M < dt ? 1e3 : M < ft ? 1e3 * dt : M < Qe ? 1e3 * ft : 1e3 * Mt,
        W = Math.min(Math.max(z, s * 1e3), o * 1e3);
      return W
        ? setTimeout(() => {
            u(l());
          }, W)
        : 0;
    })();
    return () => {
      V && clearTimeout(V);
    };
  }, [e, r, o, s, l, c]);
  const d = n,
    g = Pt(e).valueOf();
  if (!g) return null;
  const f = Math.round(Math.abs(c - g) / 1e3),
    h = g < c ? "ago" : "from now",
    [m, x] =
      f < dt
        ? [Math.round(f), "second"]
        : f < ft
          ? [Math.round(f / dt), "minute"]
          : f < Qe
            ? [Math.round(f / ft), "hour"]
            : f < Mt
              ? [Math.round(f / Qe), "day"]
              : f < Ys
                ? [Math.round(f / Mt), "week"]
                : f < Js
                  ? [Math.round(f / Ys), "month"]
                  : [Math.round(f / Js), "year"],
    j =
      typeof A > "u"
        ? typeof e == "string"
          ? e
          : Pt(e).toISOString().substr(0, 16).replace("T", " ")
        : A,
    v = d === "time" ? { ...a, dateTime: Pt(e).toISOString() } : a,
    y = Gs.bind(null, m, x, h);
  return R.createElement(d, _n({}, v, { title: j }), t(m, x, h, g, y, l));
}
const Df = ({ data: e, isFetching: t }) => {
    const { t: n } = b(),
      [r, s] = ie.useState(!1),
      [o, A] = ie.useState(null);
    return i.jsxs("div", {
      className: "d-flex justify-content-around align-items-center flex-row flex-wrap",
      children: [
        e == null
          ? void 0
          : e.characters.map((l) => {
              const a = l.active ? "success" : "warning";
              return i.jsx(ir, {
                border: a,
                character: l.character,
                heading: l.character.character_name,
                roundedImages: "10",
                isFetching: t,
                portaitSize: 450,
                children: i.jsxs("div", {
                  className: "mt-2",
                  style: { width: "450px" },
                  children: [
                    i.jsxs(S.Text, {
                      className: "text-center",
                      children: [
                        l.character.corporation_name,
                        i.jsx("br", {}),
                        l.character.alliance_name ? l.character.alliance_name : i.jsx("br", {}),
                      ],
                    }),
                    i.jsxs(S.Text, {
                      className: "text-center",
                      children: [
                        n("Skill Points"),
                        ":",
                        " ",
                        i.jsx($, {
                          className: "text-center",
                          children: l.sp && l.sp.toLocaleString(),
                        }),
                        i.jsx("br", {}),
                        n("Isk"),
                        ":",
                        " ",
                        i.jsxs($, {
                          className: "text-center",
                          children: ["$", l.isk && l.isk.toLocaleString()],
                        }),
                      ],
                    }),
                    i.jsx(S.Title, { className: "text-center", children: n("Location") }),
                    i.jsxs(S.Text, {
                      className: "text-center",
                      children: [
                        i.jsx($, {
                          className: "text-center",
                          children: l.location ? l.location : n("Unknown Location"),
                        }),
                        i.jsx("br", {}),
                        i.jsxs($, {
                          className: "text-center m-1",
                          children: [
                            l.ship_name && i.jsx(i.Fragment, { children: l.ship_name }),
                            l.ship && i.jsxs(i.Fragment, { children: [i.jsx("br", {}), l.ship] }),
                          ],
                        }),
                      ],
                    }),
                    i.jsxs(S.Text, {
                      className: "text-center",
                      children: [
                        i.jsxs(_e, {
                          className: "w-75",
                          children: [
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://zkillboard.com/character/${l.character.character_id}`,
                              target: "_blank",
                              children: "zKill",
                            }),
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://evewho.com/character/${l.character.character_id}`,
                              target: "_blank",
                              children: "EVE Who",
                            }),
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://evemaps.dotlan.net/corp/${l.character.corporation_name.replace(" ", "_")}`,
                              target: "_blank",
                              children: "DotLan",
                            }),
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://www.eve411.com/character/${l.character.character_id}`,
                              target: "_blank",
                              children: "EVE411",
                            }),
                          ],
                        }),
                        i.jsxs(_e, {
                          className: "w-75 mt-1",
                          children: [
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://forums.eveonline.com/u/${l.character.character_name.replace(" ", "_")}/summary`,
                              target: "_blank",
                              children: "EVE Forums",
                            }),
                            i.jsx(B, {
                              variant: "secondary",
                              size: "sm",
                              href: `https://eve-search.com/search/author/${l.character.character_name}`,
                              target: "_blank",
                              children: "EVE Search",
                            }),
                          ],
                        }),
                        i.jsx(B, {
                          variant: a,
                          size: "sm",
                          className: "w-100 mt-2",
                          style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                          onClick: () => {
                            A(l), s(!0);
                          },
                          children: n("Show Update Status"),
                        }),
                      ],
                    }),
                  ],
                }),
              });
            }),
        (o == null ? void 0 : o.character) &&
          i.jsxs(_, {
            show: r,
            onHide: () => {
              s(!1);
            },
            children: [
              i.jsx(_.Header, {
                closeButton: !0,
                children: n(`${o == null ? void 0 : o.character.character_name} Update Status`),
              }),
              i.jsx(_.Body, {
                children: i.jsx("div", {
                  children: i.jsxs(Se, {
                    striped: !0,
                    style: { marginBottom: 0 },
                    children: [
                      i.jsx("thead", {
                        children: i.jsxs(
                          "tr",
                          {
                            children: [
                              i.jsx("th", { children: n("Update") }),
                              i.jsx("th", { className: "text-end", children: n("Last Run") }),
                            ],
                          },
                          `head-${o == null ? void 0 : o.character}`,
                        ),
                      }),
                      i.jsx("tbody", {
                        children:
                          e == null
                            ? void 0
                            : e.headers.map((l) =>
                                i.jsxs(
                                  "tr",
                                  {
                                    children: [
                                      i.jsx("td", { children: l }),
                                      i.jsx("td", {
                                        className: "text-end",
                                        children:
                                          o != null &&
                                          o.last_updates &&
                                          o != null &&
                                          o.last_updates[l]
                                            ? i.jsx(wo, {
                                                date: o == null ? void 0 : o.last_updates[l],
                                              })
                                            : n("Never"),
                                      }),
                                    ],
                                  },
                                  l,
                                ),
                              ),
                      }),
                    ],
                  }),
                }),
              }),
              i.jsx(_.Footer, {
                children: i.jsx(B, {
                  variant: "secondary",
                  className: "w-100",
                  onClick: () => {
                    s(!1);
                  },
                  children: n("Close"),
                }),
              }),
            ],
          }),
      ],
    });
  },
  kf = ({ data: e, isFetching: t }) => {
    var o, A, l;
    const { t: n } = b(),
      r = Z();
    let s = [
      r.accessor("character.character_name", { header: n("Character") }),
      r.accessor("character.corporation_name", { header: n("Corporation") }),
      r.accessor("character.alliance_name", { header: n("Alliance") }),
      r.accessor("isk", {
        header: n("Isk"),
        cell: (a) => {
          var c;
          return (c = a.getValue()) == null ? void 0 : c.toLocaleString();
        },
      }),
      r.accessor("sp", {
        header: n("SP"),
        cell: (a) => {
          var c;
          return (c = a.getValue()) == null ? void 0 : c.toLocaleString();
        },
      }),
      r.accessor("active", {
        header: n("Active"),
        cell: (a) => {
          const c = a.getValue();
          return i.jsx("div", {
            className: "text-center",
            children: i.jsx(B, {
              variant: c ? "success" : "warning",
              children: c
                ? i.jsx("i", { className: "fa-solid fa-check" })
                : i.jsx("i", { className: "fa-solid fa-xmark" }),
            }),
          });
        },
      }),
    ];
    return (
      console.log(e == null ? void 0 : e.last_updates),
      (o = e == null ? void 0 : e.characters[0]) != null &&
        o.last_updates &&
        ((l = Object.keys(
          (A = e == null ? void 0 : e.characters[0]) == null ? void 0 : A.last_updates,
        )) == null ||
          l.map((a) => {
            console.log(a),
              s.push(
                r.accessor(`last_updates.${a}`, {
                  header: a,
                  cell: (c) => (c.getValue() ? i.jsx(wo, { date: c.getValue() }) : n("Never")),
                }),
              );
          })),
      i.jsx(yt, { data: e == null ? void 0 : e.characters, isFetching: t, columns: s })
    );
  },
  Bf = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(!1),
      { data: s, isFetching: o } = O({
        queryKey: ["status", t],
        queryFn: () => sr(t ? Number(t) : 0),
        refetchOnWindowFocus: !1,
        initialData: { characters: [], main: void 0, headers: [] },
      });
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(S.Header, {
          className: "text-end",
          children: i.jsx("div", {
            className: "d-flex justify-content-end",
            children: i.jsx(J.Check, {
              type: "switch",
              id: "custom-switch",
              label: e("Display in Table Format"),
              onChange: (A) => {
                r(A.target.checked);
              },
              defaultChecked: n,
            }),
          }),
        }),
        n
          ? i.jsx(kf, { isFetching: o, data: s })
          : i.jsx(i.Fragment, { children: i.jsx(Df, { isFetching: o, data: s }) }),
      ],
    });
  },
  Pf = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(!0),
      { data: s, isFetching: o } = O({
        queryKey: ["wallet", t],
        queryFn: () => za(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      A = Z(),
      l = [
        A.accessor("character.character_name", { header: e("Character") }),
        A.accessor("date", { header: e("Date") }),
        A.accessor("ref_type", { header: e("Type") }),
        A.accessor("first_party.name", { header: e("First Party") }),
        A.accessor("second_party.name", { header: e("Second Party") }),
        A.accessor("amount", {
          header: e("Amount"),
          cell: (c) => `${c.getValue().toLocaleString()}`,
        }),
        A.accessor("balance", {
          header: e("Balance"),
          cell: (c) => `${c.getValue().toLocaleString()}`,
        }),
        A.accessor("reason", { header: e("Reason") }),
      ],
      a = s == null ? void 0 : s.filter((c) => (n ? !0 : !c.own_account));
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(J.Check, {
          type: "switch",
          id: "custom-switch",
          label: e("Show Own Account Activity"),
          className: "float-end",
          onChange: (c) => {
            r(c.target.checked);
          },
          defaultChecked: n,
        }),
        i.jsx(te, { data: a, isFetching: o, columns: l }),
      ],
    });
  },
  Mf = ({ corporationID: e = 0 }) => {
    var s, o, A, l, a, c, u, d, g, f, h, m, x, j, v, y, k, V;
    const { t } = b(),
      { data: n, isLoading: r } = O({
        queryKey: ["glances", "corporation", "status", e],
        queryFn: () => Du(e),
        refetchOnWindowFocus: !1,
      });
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("h3", {
          className: `${Be.strikeOut} w-100 text-center mt-3`,
          children: t("Corporation Members"),
        }),
        i.jsxs("div", {
          className: "d-flex flex-wrap justify-content-center",
          children: [
            i.jsx(D, {
              cardVariant:
                ((s = n == null ? void 0 : n.characters) == null ? void 0 : s.liquid) < 1e6
                  ? "warning"
                  : void 0,
              iconSrc: lo,
              textVariant:
                ((o = n == null ? void 0 : n.characters) == null ? void 0 : o.liquid) < 1e6
                  ? "warning"
                  : void 0,
              text: `${(l = (A = n == null ? void 0 : n.characters) == null ? void 0 : A.liquid) == null ? void 0 : l.toLocaleString("en-US", { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" })} ISK`,
              isLoading: r,
              toolTipText: t("Total Liquid Isk across all characters and alts in corporation"),
            }),
            i.jsx(D, {
              iconSrc: Mn,
              text:
                (c = (a = n == null ? void 0 : n.characters) == null ? void 0 : a.known_and_alts) ==
                null
                  ? void 0
                  : c.toLocaleString(),
              isLoading: r,
              toolTipText: t("Count of all known Characters and Alts"),
            }),
            i.jsx(D, {
              cardVariant:
                ((u = n == null ? void 0 : n.characters) == null ? void 0 : u.known_in_corp) <
                ((d = n == null ? void 0 : n.characters) == null ? void 0 : d.in_corp)
                  ? "warning"
                  : "success",
              textVariant:
                ((g = n == null ? void 0 : n.characters) == null ? void 0 : g.known_in_corp) <
                ((f = n == null ? void 0 : n.characters) == null ? void 0 : f.in_corp)
                  ? "warning"
                  : "success",
              iconSrc: Mn,
              text: `${(m = (h = n == null ? void 0 : n.characters) == null ? void 0 : h.known_in_corp) == null ? void 0 : m.toLocaleString()}/${(j = (x = n == null ? void 0 : n.characters) == null ? void 0 : x.in_corp) == null ? void 0 : j.toLocaleString()}`,
              isLoading: r,
              toolTipText: t("Count of all known Characters in Corp"),
            }),
            i.jsx(D, {
              cardVariant:
                ((v = n == null ? void 0 : n.characters) == null ? void 0 : v.bad) > 0
                  ? "danger"
                  : "success",
              iconSrc: ao,
              textVariant:
                ((y = n == null ? void 0 : n.characters) == null ? void 0 : y.bad) > 0
                  ? "danger"
                  : "success",
              text:
                (V = (k = n == null ? void 0 : n.characters) == null ? void 0 : k.bad) == null
                  ? void 0
                  : V.toLocaleString(),
              isLoading: r,
              toolTipText: t("Count of all known characters or alts not loading into audit"),
            }),
          ],
        }),
      ],
    });
  },
  Vf = {
    option: (e) => ({ ...e, color: "black" }),
    menu: (e) => ({ ...e, zIndex: 9999 }),
    menuList: (e) => ({ ...e, zIndex: 9999 }),
    menuPortal: (e) => ({ ...e, zIndex: 9999 }),
  },
  An = ({ setCorporation: e }) => {
    const { isLoading: t, data: n } = O({ queryKey: ["corp-status"], queryFn: () => uo() });
    let r = [];
    return (
      t ||
        ((r =
          n == null
            ? void 0
            : n.corps.map((s) => ({
                value: s.corporation.corporation_id,
                label: s.corporation.corporation_name,
              }))),
        (n == null ? void 0 : n.corps.length) === 1 && e(r[0].value)),
      i.jsx(wt, { isLoading: t, styles: Vf, options: r, onChange: (s) => e(s.value) })
    );
  },
  Lf = () => {
    const { t: e } = b(),
      [t, n] = R.useState(0);
    return i.jsxs(i.Fragment, {
      children: [
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center my-1",
          children: [
            i.jsx("h6", { className: "me-1", children: e("Corporation Selection") }),
            i.jsx("div", { className: "flex-grow-1", children: i.jsx(An, { setCorporation: n }) }),
          ],
        }),
        i.jsx("div", {
          className: "d-flex flex-column align-items-center w-100",
          children:
            t > 0
              ? i.jsxs(i.Fragment, {
                  children: [
                    i.jsx(Mf, { corporationID: t }),
                    i.jsx(od, { corporationID: t }),
                    i.jsx(vd, { corporationID: t }),
                    i.jsx(Od, { corporationID: t }),
                  ],
                })
              : i.jsx(pt, { title: e("Select Corporation") }),
        }),
      ],
    });
  },
  yo = "/audit/r/corp/",
  Hf = ({ cat: e }) => {
    var r, s;
    const t = ze(),
      n =
        (r = e.links) == null
          ? void 0
          : r.reduce((o, A) => (o = o || t.pathname.includes(A.link)), !1);
    return i.jsx(
      Ze,
      {
        as: "li",
        active: n,
        id: e.name,
        title: e.name,
        children:
          (s = e.links) == null
            ? void 0
            : s.map((o) =>
                i.jsx(se.Item, {
                  as: "li",
                  children: o.link.startsWith("/")
                    ? i.jsx(
                        Ze.Item,
                        {
                          id: o.name,
                          href: o.link,
                          children: i.jsx(i.Fragment, { children: o.name }),
                        },
                        o.name,
                      )
                    : i.jsx(Uf, { link: o }),
                }),
              ),
      },
      e.name,
    );
  },
  Uf = ({ link: e }) => {
    const n = ze().pathname.endsWith(e.link);
    return i.jsx(se.Item, {
      as: "li",
      children: i.jsx(
        Ze.Item,
        { as: jt, to: `${yo}${e.link}`, id: e.name, active: n, children: e.name },
        e.name,
      ),
    });
  },
  So = ({ link: e }) => {
    const n = ze().pathname.endsWith(e.link);
    return i.jsx(se.Item, {
      as: "li",
      children: i.jsx(
        se.Link,
        { as: jt, to: `${yo}${e.link}`, id: e.name, active: n, children: e.name },
        e.name,
      ),
    });
  },
  _f = () => {
    const { t: e } = b(),
      t = [
        { name: e("Overview"), link: "glance" },
        {
          name: e("Structures"),
          links: [
            { name: e("Structures"), link: "structures" },
            { name: e("Pocos"), link: "pocos" },
            { name: e("Starbases"), link: "starbases" },
          ],
        },
        { name: e("Wallets"), link: "wallets" },
        {
          name: e("Assets"),
          links: [
            { name: e("Asset Overview"), link: "assetgroup" },
            { name: e("Asset List"), link: "assetlist" },
          ],
        },
        {
          name: e("Dashboards"),
          links: [
            { name: e("Fuel"), link: "/audit/corp/dashboard/fuel" },
            { name: e("Metenox"), link: "/audit/corp/dashboard/metenox" },
            { name: e("Bridges"), link: "bridges" },
          ],
        },
      ];
    return i.jsx(i.Fragment, {
      children: t.map((n) => {
        var r;
        return n.links
          ? i.jsx(Hf, { cat: n })
          : i.jsx(i.Fragment, {
              children:
                (r = n == null ? void 0 : n.link) != null && r.startsWith("/")
                  ? i.jsx(se.Item, {
                      as: "li",
                      children: i.jsx(
                        se.Link,
                        {
                          id: n.name,
                          href: n.link,
                          children: i.jsx(i.Fragment, { children: n.name }),
                        },
                        n.name,
                      ),
                    })
                  : i.jsx(So, { link: n }),
            });
      }),
    });
  },
  Ks = document.getElementById("nav-left"),
  qf = () => (Ks ? Jt.createPortal(i.jsx(_f, {}), Ks) : i.jsx(i.Fragment, {}));
function zf() {
  const { t: e } = b();
  return i.jsx(i.Fragment, {
    children: i.jsx(Ze, {
      title: "Add Token",
      id: "add-token",
      children: i.jsx("div", {
        className: "m-4",
        style: { width: "400px" },
        children: i.jsxs(J, {
          action: "/audit/corp/add_options",
          method: "get",
          children: [
            i.jsx(J.Check, {
              label: e("Structures"),
              type: "checkbox",
              defaultChecked: !0,
              inline: !0,
              id: "s",
              name: "s",
            }),
            i.jsx("br", {}),
            i.jsx(J.Check, {
              label: e("Starbases"),
              type: "checkbox",
              defaultChecked: !0,
              inline: !0,
              id: "sb",
              name: "sb",
            }),
            i.jsx("br", {}),
            i.jsx(J.Check, {
              type: "checkbox",
              defaultChecked: !1,
              id: "a",
              name: "a",
              label: e("Assets"),
            }),
            i.jsx("p", {
              children: e(
                "Assets also Enables: LO levels in Bridges, fittings on Structures, in space fittings adjacent to Starbases",
              ),
            }),
            i.jsx(J.Check, {
              type: "checkbox",
              defaultChecked: !1,
              id: "m",
              name: "m",
              label: e("Moons"),
            }),
            i.jsx("p", { children: e("Moons enable Active Observation Tracking") }),
            i.jsx(J.Check, {
              type: "checkbox",
              defaultChecked: !1,
              id: "w",
              name: "w",
              label: e("Wallets"),
            }),
            i.jsx("p", { children: e("Required for invoice module on holding corps") }),
            i.jsx(J.Check, {
              type: "checkbox",
              defaultChecked: !1,
              id: "t",
              name: "t",
              label: e("Member Tracking"),
            }),
            i.jsx("p", {
              children: e(
                "Member Tracking enables the Last Login Tracking of characters for smart filters",
              ),
            }),
            i.jsx(J.Check, {
              type: "checkbox",
              defaultChecked: !1,
              id: "c",
              name: "c",
              label: e("Contracts"),
            }),
            i.jsx("br", {}),
            i.jsx("br", {}),
            i.jsx(B, { variant: "primary", type: "submit", children: e("Add Token") }),
          ],
        }),
      }),
    }),
  });
}
const Wf = "_menuRefreshSpin_17lcv_1",
  Gf = { menuRefreshSpin: Wf },
  Vt = document.getElementById("nav-right"),
  Yf = () => {
    const { t: e } = b(),
      t = Xs(),
      [n, r] = ie.useState(!1);
    return (
      ie.useEffect(() => {
        n || (Vt && ((Vt.innerHTML = ""), r(!0)));
      }, [n]),
      n
        ? Vt
          ? Jt.createPortal(
              i.jsxs(i.Fragment, {
                children: [
                  t
                    ? i.jsx(i.Fragment, {
                        children: i.jsx(se.Link, {
                          children: i.jsx("i", {
                            className: `fas fa-sync-alt fa-fw ${Gf.menuRefreshSpin}`,
                          }),
                        }),
                      })
                    : i.jsx(i.Fragment, {}),
                  i.jsx(zf, {}),
                  i.jsx(So, { link: { link: "corporations", name: e("Corporations") } }),
                ],
              }),
              Vt,
            )
          : i.jsx(i.Fragment, {})
        : null
    );
  },
  Jf = () =>
    i.jsxs(i.Fragment, {
      children: [
        i.jsx(qf, {}),
        i.jsx(Yf, {}),
        i.jsx(ti, { children: i.jsxs(We, { children: [i.jsx(ni, {}), " "] }) }),
      ],
    });
function Kf(e) {
  let t = e instanceof Number;
  return t && (t = isNaN(e)), Object.prototype.toString.call(e) === "[object Date]" && !t;
}
function vo({ date: e }) {
  const t = new Date(e),
    n = navigator.language || (navigator.languages || ["en"])[0];
  return Kf(t)
    ? i.jsxs("div", {
        className: "text-nowrap",
        children: [
          i.jsx(nt, { date: t }),
          i.jsx("br", {}),
          i.jsx(Mo.Caption, {
            children: t.toLocaleString(n, {
              timeZone: "UTC",
              hour12: !1,
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }),
        ],
      })
    : i.jsx(i.Fragment, {});
}
const Qf = "/static/corptools/bs5/static/img/tyrannis-DSq5_x0q.png",
  Zf =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAY4AAAGOCAYAAACABOR8AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAewgAAHsIBbtB1PgAAAAd0SU1FB9oMARIMHdIsS0YAAAmeSURBVHja7d1viKVVHQfwb61/FjYoMtigwEBhhQQXXFBQ8ID7YqGFtF1wQ8N9YWhkKLGQoIGBxUqG9gcK2kBhwZUMEjYwWOgQCgb7YgUFfZWBQYIKK26l7Uovztn2Ns7M3rn3ubMzcz8fGGbmztznDs8M5zu/8zvneRIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5ssnnIL5UGv9v89LKU4KIDg4f2AID2BaFzkF8xMYZ4NiuTABEBwCQ2UBDMpU1ZwGxtnvFyqAikNgCANAxcHwgTH6fEEDCI45C41JB37TVYDgEBgTH094AIJDYKg6gJn4pFMwv6Gx3OsAqDgEhqoDEBzzEBirMaDrdQArYapqjVcZ4w7k00w1CQtAxbEBAmM1nqvqAFQccx4a0xAWgOBYB4ExbbWw2PdbHQUIjjmpMtbSf/zCBxAca9i0gTFk1WG6ChAca6/SuHy9nHdVByA4LvxA/K0kr9darymlfDTkAK3qAATHxgqMTbXWnyf5bpKfJXm21rolM14KPcRtYlUdwGLs45htaGxNciTJv5PsK6WcrLX+NsnpUsrXa60XJTk91H/6tdaPHWecwX+5ikUFAqg4Vi80rknyUpIXkuwupZzsX9qfZEet9e5Syukkm4b6736S0FB1AIJjbYTG7UmeT/JQKeX7pZQzI4P7qSR7kxzs/Y4zQwzSi+0LmSRszvc4gKmqYQNjU5KDPRhuKaW8vMz33p3kgSTbk7yf5Mw0A/Y4mwlXegFFlyEBBMdsQ+PTSZ7tn+4rpbwzxnOeTrK5lHJrrfWSJB9OMkjP8oq6eh3AQqaqhhlcv5DWz3gjya5xQqO7K8lVtdb7SikfJrloqSBYSWgACI61HRrXJDme5HAp5ZujPYvzGel3PFxrvbY3y6c2ZHUwxLJeQHBwLjRuTlKTPFBK+eGEA/OrSe5P299x2UqqjtW46ZPAAATHcAPqnWk9jb2llKem/K/+qR5Ah3vVsflCD9qTrtICNj7N8ckG1QeT3JvWz3h5oGNuSeuTHC6lPFprvTjJf5aqImZVbVyIW9cCgmMjB8amJI8l2ZVkZynl7wMf/8s5t2HwxXFWNA216klgAIJjNqFxJMnVbUwtb83odW7r4bQ9yT+T/GuWg7jAAATHbEPjyrTpqbdm/Hq/TPKlJLvT+h2nhh7QBQYwKc3x8UPj80luXC40aq1fqbVeN8DL3t9f76G+ZPfipQb7IUJjrd2BEFBxbJTQ2NUH8aW+99tJnkjydpId0/Y/aq1XpO0P2ZvkT0k+mrYqmPYe5wCCY7jQuDzJK0k+1R860auTU1P+DLf1MNqeNl31/iQDvmkpQHCsodBYMMgfGXno92l7PM5M+bM8ntaQ35VkS5L3VjLwqzKAoelxLO5Qks+MGxp9QH4mycMjD92S5JEBfpYD/Wd5qJTyXpJLxg2MhVe3FRqAimM21cbjSXasJDQWPP/pJPtGHtq/3M7yXt1c1d/qYhdI7FNhJ/pxa5IPlqoeTEsBgmN1Q+O+JPek9SfemfAYl/bB/fr+0JtJriylfNAD4OoeEjtGAmPz2SqllPLcEsf9aq+Etqft7Xh3YSiYlgJWg6mqc4PunWnTQmXS0OiD9Qdp01RvJnktyfX9sSR5MsnRtA1++3oIbB55+o5ljvtcf/6RJCeTfHY0LIQGIDhWNzT2pPUjdg6xua8fo+Tjy3JPLPGU19IumHj8PId+oL9/pJTybpJLF4aGXgYwa3M/VVVrvSFtBdTuUspfZvxat6dt7jvR344neWUlvZR+06gTSe5I8uf0S5KoMgDBsXrB8WCS/b3a+NuAx92S1ueo0y7JXeTYP0rytVLKVf6EgdU291NV/QZMh5K8VGu9dsBD70tyLMkbtdbvDRQYm2qtv05ya5Lb/PkCguPChcejaVNIx/rqpSHs7++/mH5XvylDY2vaJdc/l9Y7edlvDhAcFzY8nkm7Gu2hft2paQb5K5LcOPLQk1Me77q0vsbzpZRbp72UCYDgGC48XuwD/oFa64+nONQdIx8fm+aCh32Z8NEkd5VSfuC3BFxoNgAuPlhvTVtp9WaSO0b2YYz7/L+m3U8jOc/O8WWOsSntAoe70jYGvuo3A6g41m7l8VaSnWm9iWO11stWMODfNBIa76ftz1hpaGzpVcbVaf0MoQEIjnUQHqfS7oVxIskLvW8xjv0jHz+70n7ESBP87bQlwif9NgDBsX7C40wp5Ttpy3VfGPPufk8kOZg2zXV4haGxLW1T4NFSyjeG3v8BMAQ9jvEH9T1JfpXknlLK72Zw/JvS+ioHSim/ccYBwbExwuOGtJ7FwVLKTwcOpUNJ9pVS/uhMA4JjY4XHtrTG9dFeHUx7h7+zobG7LwcGEBwbMDy29srjH2nLbU9NeJw96UturZwC1gvN8Qn05bq7+qfP9yCZNDR2Cg1AcMxHeJxKu5Dh8ZYDddsKQuPukdB43dkE1hNTVQPot5w9kNbcfnGM0Hi4ZY/QAATHPIfHniS/SHLvUst1F0xPCQ1AcAiP/y3XfayU8pMFX7u5f+1GPQ1AcDAaENvSNvIdS3J/KeXMSKDsteQWEBwsFh5nl+u+neSRnLss+h+cHWC9s6pqBkaurns6bdXVvUIDgHGrj8ucBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANas/wJZSzYjrDy1UgAAAABJRU5ErkJggg==",
  Xf =
    "data:image/png;base64,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",
  $f = "/static/corptools/bs5/static/img/3h-X6O4aMtx.png",
  eg = "/static/corptools/bs5/static/img/4h-DM7Dhiqa.png",
  tg = "/static/corptools/bs5/static/img/5h-BicZ_kS5.png",
  ng = "/static/corptools/bs5/static/img/6h-ndoyFy77.png",
  rg = "/static/corptools/bs5/static/img/7h-B5R4GWMb.png",
  sg = "/static/corptools/bs5/static/img/8h-C17Yjhwj.png",
  ig =
    "data:image/png;base64,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",
  og =
    "data:image/png;base64,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",
  Ag =
    "data:image/png;base64,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",
  lg = "/static/corptools/bs5/static/img/4m-DvP_HOND.png",
  cg = "/static/corptools/bs5/static/img/5m-fFpAJ2rM.png",
  ag = "/static/corptools/bs5/static/img/6m-DKVPLsUc.png",
  ug = "/static/corptools/bs5/static/img/7m-BLe6olY4.png",
  dg = "/static/corptools/bs5/static/img/8m-hxd_N3hx.png",
  fg = "/static/corptools/bs5/static/img/8l-UbnNMK0o.png",
  gg = "/static/corptools/bs5/static/img/7l-Dql_h1Xo.png",
  hg = "/static/corptools/bs5/static/img/6l-Ciemt68W.png",
  mg = "/static/corptools/bs5/static/img/5l-DtBLoe7X.png",
  pg = "/static/corptools/bs5/static/img/4l-BsWsNOjS.png",
  xg =
    "data:image/png;base64,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",
  jg =
    "data:image/png;base64,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",
  wg =
    "data:image/png;base64,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",
  yg =
    "data:image/png;base64,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",
  Sg =
    "data:image/png;base64,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",
  vg = "/static/corptools/bs5/static/img/3r-BEm9rD6Q.png",
  Cg = "/static/corptools/bs5/static/img/1s-3LB3dveW.png",
  Fg = "/static/corptools/bs5/static/img/2s-DLD5F1oU.png",
  Rg = "/static/corptools/bs5/static/img/3s-bnWOfmy9.png",
  bg = "/static/corptools/bs5/static/img/4s-wQRUJNgw.png",
  Eg = "/static/corptools/bs5/static/img/5s-C_pFgY_F.png",
  or = (e, t = 32) =>
    `https://images.evetech.net/types/${e}/${t >= 256 ? "render" : `icon?size=${t}`}`,
  Ng = ({ slots: e }) => {
    let t = !1;
    switch (e) {
      case 1:
        t = Zf;
        break;
      case 2:
        t = Xf;
        break;
      case 3:
        t = $f;
        break;
      case 4:
        t = eg;
        break;
      case 5:
        t = tg;
        break;
      case 6:
        t = ng;
        break;
      case 7:
        t = rg;
        break;
      case 8:
        t = sg;
        break;
      default:
        t = !1;
    }
    return t
      ? i.jsx("img", { className: "rounded", src: t, style: { border: 0 } })
      : i.jsx(i.Fragment, {});
  },
  Og = ({ slots: e }) => {
    let t = !1;
    switch (e) {
      case 1:
        t = ig;
        break;
      case 2:
        t = og;
        break;
      case 3:
        t = Ag;
        break;
      case 4:
        t = lg;
        break;
      case 5:
        t = cg;
        break;
      case 6:
        t = ag;
        break;
      case 7:
        t = ug;
        break;
      case 8:
        t = dg;
        break;
      default:
        t = !1;
    }
    return t
      ? i.jsx("img", { className: "rounded", src: t, style: { border: 0 } })
      : i.jsx(i.Fragment, {});
  },
  Ig = ({ slots: e }) => {
    let t = !1;
    switch (e) {
      case 1:
        t = wg;
        break;
      case 2:
        t = jg;
        break;
      case 3:
        t = xg;
        break;
      case 4:
        t = pg;
        break;
      case 5:
        t = mg;
        break;
      case 6:
        t = hg;
        break;
      case 7:
        t = gg;
        break;
      case 8:
        t = fg;
        break;
      default:
        t = !1;
    }
    return t
      ? i.jsx("img", { className: "rounded", src: t, style: { border: 0 } })
      : i.jsx(i.Fragment, {});
  },
  Tg = ({ slots: e }) => {
    let t = !1;
    switch (e) {
      case 1:
        t = yg;
        break;
      case 2:
        t = Sg;
        break;
      case 3:
        t = vg;
        break;
      default:
        t = !1;
    }
    return t
      ? i.jsx("img", { className: "rounded", src: t, style: { border: 0 } })
      : i.jsx(i.Fragment, {});
  },
  Dg = ({ slots: e }) => {
    let t = !1;
    switch (e) {
      case 1:
        t = Cg;
        break;
      case 2:
        t = Fg;
        break;
      case 3:
        t = Rg;
        break;
      case 4:
        t = bg;
        break;
      case 5:
        t = Eg;
        break;
      default:
        t = !1;
    }
    return t
      ? i.jsx("img", { className: "rounded", src: t, style: { border: 0 } })
      : i.jsx(i.Fragment, {});
  },
  L = ({ item: e, id: t, left: n, top: r }) =>
    i.jsx("div", {
      id: t,
      style: { position: "absolute", left: `${n}px`, top: `${r}px`, width: "32px", height: "32px" },
      children: i.jsx("img", { className: "rounded", src: or(e.id), title: e.name, alt: e.name }),
    }),
  N = ({ item: e, qty: t = 0, prefix: n = "" }) =>
    i.jsxs("div", {
      id: e.id,
      className: "d-flex align-items-center",
      children: [
        i.jsx("img", {
          className: "rounded",
          src: or(e.id),
          title: e.name,
          alt: e.name,
          width: "32px",
          height: "32px",
        }),
        n != "" &&
          i.jsx("h6", { className: "m-0 p-0 mx-2", style: { minWidth: "50px" }, children: `${n}` }),
        i.jsxs("p", {
          className: "m-0 p-0 ms-2",
          children: [t > 0 && `${t.toLocaleString()}x `, e.name],
        }),
      ],
    }),
  T = ({ message: e }) =>
    i.jsxs("div", {
      className: "d-flex align-items-center",
      children: [
        i.jsx("div", {
          className: "d-flex justify-content-center align-items-center",
          style: { width: "32px", height: "32px" },
          children: i.jsx("i", {
            className: "fa-regular fa-square align-self-center text-muted",
            style: { fontSize: "22px" },
          }),
        }),
        i.jsx("p", { className: "m-0 p-0 ms-2", children: e }),
      ],
    }),
  kg = ({
    ship: e,
    fitting: t,
    low: n = 8,
    med: r = 8,
    high: s = 8,
    services: o = 5,
    rigs: A = 3,
  }) =>
    i.jsxs("div", {
      id: "Fitting_Panel",
      style: { position: "relative", height: "398px", width: "398px", zIndex: 3, margin: "0 auto" },
      children: [
        i.jsx("div", {
          id: "mask",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx("img", {
            className: "rounded",
            style: {
              position: "absolute",
              height: "398px",
              width: "398px",
              margin: "0 auto",
              left: 0,
              top: 0,
              border: 0,
            },
            src: Qf,
            alt: "",
          }),
        }),
        i.jsx("div", {
          id: "highx",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx(Ng, { slots: s }),
        }),
        t.HiSlot0 && i.jsx(L, { item: t.HiSlot0, left: 73, top: 60, id: "high1" }),
        t.HiSlot1 && i.jsx(L, { item: t.HiSlot1, left: 102, top: 42, id: "high2" }),
        t.HiSlot2 && i.jsx(L, { item: t.HiSlot2, left: 134, top: 27, id: "high3" }),
        t.HiSlot3 && i.jsx(L, { item: t.HiSlot3, left: 169, top: 21, id: "high4" }),
        t.HiSlot4 && i.jsx(L, { item: t.HiSlot4, left: 203, top: 22, id: "high5" }),
        t.HiSlot5 && i.jsx(L, { item: t.HiSlot5, left: 238, top: 30, id: "high6" }),
        t.HiSlot6 && i.jsx(L, { item: t.HiSlot6, left: 270, top: 45, id: "high7" }),
        t.HiSlot7 && i.jsx(L, { item: t.HiSlot7, left: 295, top: 64, id: "high8" }),
        i.jsx("div", {
          id: "midx",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx(Og, { slots: r }),
        }),
        t.MedSlot0 && i.jsx(L, { item: t.MedSlot0, left: 26, top: 140, id: "mid1" }),
        t.MedSlot1 && i.jsx(L, { item: t.MedSlot1, left: 24, top: 176, id: "mid2" }),
        t.MedSlot2 && i.jsx(L, { item: t.MedSlot2, left: 23, top: 212, id: "mid3" }),
        t.MedSlot3 && i.jsx(L, { item: t.MedSlot3, left: 30, top: 245, id: "mid4" }),
        t.MedSlot4 && i.jsx(L, { item: t.MedSlot4, left: 46, top: 276, id: "mid5" }),
        t.MedSlot5 && i.jsx(L, { item: t.MedSlot5, left: 69, top: 304, id: "mid6" }),
        t.MedSlot6 && i.jsx(L, { item: t.MedSlot6, left: 100, top: 328, id: "mid7" }),
        t.MedSlot7 && i.jsx(L, { item: t.MedSlot7, left: 133, top: 342, id: "mid8" }),
        i.jsx("div", {
          id: "lowx",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx(Ig, { slots: n }),
        }),
        t.LoSlot0 && i.jsx(L, { item: t.LoSlot0, left: 344, top: 143, id: "low1" }),
        t.LoSlot1 && i.jsx(L, { item: t.LoSlot1, left: 350, top: 178, id: "low2" }),
        t.LoSlot2 && i.jsx(L, { item: t.LoSlot2, left: 349, top: 213, id: "low3" }),
        t.LoSlot3 && i.jsx(L, { item: t.LoSlot3, left: 340, top: 246, id: "low4" }),
        t.LoSlot4 && i.jsx(L, { item: t.LoSlot4, left: 323, top: 277, id: "low5" }),
        t.LoSlot5 && i.jsx(L, { item: t.LoSlot5, left: 300, top: 304, id: "low6" }),
        t.LoSlot6 && i.jsx(L, { item: t.LoSlot6, left: 268, top: 324, id: "low7" }),
        t.LoSlot7 && i.jsx(L, { item: t.LoSlot7, left: 234, top: 338, id: "low8" }),
        i.jsx("div", {
          id: "rigxx",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx(Tg, { slots: A }),
        }),
        t.RigSlot0 && i.jsx(L, { item: t.RigSlot0, left: 148, top: 259, id: "rig1" }),
        t.RigSlot1 && i.jsx(L, { item: t.RigSlot1, left: 185, top: 267, id: "rig2" }),
        t.RigSlot2 && i.jsx(L, { item: t.RigSlot2, left: 221, top: 259, id: "rig3" }),
        i.jsx("div", {
          id: "subx",
          style: {
            position: "absolute",
            height: "398px",
            width: "398px",
            zIndex: -1,
            margin: "0 auto",
            left: 0,
            top: 0,
          },
          children: i.jsx(Dg, { slots: o }),
        }),
        t.SubSystemSlot0 && i.jsx(L, { item: t.SubSystemSlot0, left: 117, top: 131, id: "sub1" }),
        t.SubSystemSlot1 && i.jsx(L, { item: t.SubSystemSlot1, left: 147, top: 108, id: "sub2" }),
        t.SubSystemSlot2 && i.jsx(L, { item: t.SubSystemSlot2, left: 184, top: 98, id: "sub3" }),
        t.SubSystemSlot3 && i.jsx(L, { item: t.SubSystemSlot3, left: 221, top: 107, id: "sub4" }),
        t.ServiceSlot0 && i.jsx(L, { item: t.ServiceSlot0, left: 117, top: 131, id: "sub1" }),
        t.ServiceSlot1 && i.jsx(L, { item: t.ServiceSlot1, left: 147, top: 108, id: "sub2" }),
        t.ServiceSlot2 && i.jsx(L, { item: t.ServiceSlot2, left: 184, top: 98, id: "sub3" }),
        t.ServiceSlot3 && i.jsx(L, { item: t.ServiceSlot3, left: 221, top: 107, id: "sub4" }),
        i.jsx("div", {
          id: "bigship",
          style: {
            position: "absolute",
            height: "256px",
            width: "256px",
            zIndex: -2,
            left: "72px",
            top: "71px",
          },
          children: i.jsx("img", {
            className: "rounded",
            src: or(e.type.id, 256),
            style: { height: "256px", width: "256px" },
            title: "{{ fit.ship_type.name }}",
            alt: "{{ fit.ship_type.name }}",
            "data-bs-tooltip": "aa-fittings",
          }),
        }),
      ],
    }),
  Bg = ({ ship: e, showModal: t, setShowModal: n }) => {
    var A,
      l,
      a,
      c,
      u,
      d,
      g,
      f,
      h,
      m,
      x,
      j,
      v,
      y,
      k,
      V,
      I,
      M,
      z,
      W,
      G,
      Y,
      le,
      ee,
      je,
      Ee,
      Pe,
      X,
      me,
      Me,
      Ft,
      it,
      Rt,
      Ve,
      Ar,
      lr,
      cr,
      ar,
      ur,
      dr,
      fr,
      gr,
      hr,
      mr,
      pr,
      xr,
      jr,
      wr,
      yr,
      Sr,
      vr,
      Cr,
      Fr,
      Rr,
      br,
      Er,
      Nr,
      Or,
      Ir,
      Tr,
      Dr,
      kr,
      Br,
      Pr,
      Mr,
      Vr,
      Lr,
      Hr,
      Ur,
      _r,
      qr,
      zr,
      Wr,
      Gr,
      Yr,
      Jr,
      Kr,
      Qr,
      Zr,
      Xr,
      $r,
      es,
      ts,
      ns,
      rs,
      ss,
      is,
      os,
      As,
      ls,
      cs,
      as,
      us;
    const { t: r } = b(),
      { data: s, isFetching: o } = O({
        queryKey: ["glances", "account", e.id],
        queryFn: () => Mu(e.id ? Number(e.id) : 0),
        refetchOnWindowFocus: !1,
      });
    return i.jsx(i.Fragment, {
      children: i.jsxs(_, {
        size: "xl",
        show: t,
        onHide: () => {
          n(!1);
        },
        children: [
          i.jsx(_.Header, { children: i.jsx(_.Title, { children: e == null ? void 0 : e.name }) }),
          o
            ? i.jsx(oe, { title: r("Laoding Fit"), message: r("Please Wait") })
            : i.jsxs("div", {
                className: "d-flex",
                children: [
                  i.jsx("div", {
                    className: "m-3",
                    children: i.jsx(kg, {
                      ship: e,
                      fitting: s.fit,
                      high: s.high,
                      med: s.med,
                      low: s.low,
                      services: s.service,
                      rigs: s.rig,
                    }),
                  }),
                  i.jsxs("div", {
                    className: "d-flex flex-column flex-grow-1 m-3",
                    children: [
                      s.high > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Hi Slots") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (A = s == null ? void 0 : s.fit) != null && A.HiSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (l = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : l.HiSlot0,
                                    })
                                  : s.high > 0 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (a = s == null ? void 0 : s.fit) != null && a.HiSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (c = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : c.HiSlot1,
                                    })
                                  : s.high > 1 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (u = s == null ? void 0 : s.fit) != null && u.HiSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (d = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : d.HiSlot2,
                                    })
                                  : s.high > 2 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (g = s == null ? void 0 : s.fit) != null && g.HiSlot3
                                  ? i.jsx(N, {
                                      item:
                                        (f = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : f.HiSlot3,
                                    })
                                  : s.high > 3 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (h = s == null ? void 0 : s.fit) != null && h.HiSlot4
                                  ? i.jsx(N, {
                                      item:
                                        (m = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : m.HiSlot4,
                                    })
                                  : s.high > 4 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (x = s == null ? void 0 : s.fit) != null && x.HiSlot5
                                  ? i.jsx(N, {
                                      item:
                                        (j = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : j.HiSlot5,
                                    })
                                  : s.high > 5 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (v = s == null ? void 0 : s.fit) != null && v.HiSlot6
                                  ? i.jsx(N, {
                                      item:
                                        (y = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : y.HiSlot6,
                                    })
                                  : s.high > 6 && i.jsx(T, { message: r("Empty Hi Slot") }),
                                (k = s == null ? void 0 : s.fit) != null && k.HiSlot7
                                  ? i.jsx(N, {
                                      item:
                                        (V = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : V.HiSlot7,
                                    })
                                  : s.high > 7 && i.jsx(T, { message: r("Empty Hi Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.med > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Med Slots") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (I = s == null ? void 0 : s.fit) != null && I.MedSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (M = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : M.MedSlot0,
                                    })
                                  : s.med > 0 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (z = s == null ? void 0 : s.fit) != null && z.MedSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (W = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : W.MedSlot1,
                                    })
                                  : s.med > 1 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (G = s == null ? void 0 : s.fit) != null && G.MedSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (Y = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Y.MedSlot2,
                                    })
                                  : s.med > 2 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (le = s == null ? void 0 : s.fit) != null && le.MedSlot3
                                  ? i.jsx(N, {
                                      item:
                                        (ee = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : ee.MedSlot3,
                                    })
                                  : s.med > 3 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (je = s == null ? void 0 : s.fit) != null && je.MedSlot4
                                  ? i.jsx(N, {
                                      item:
                                        (Ee = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Ee.MedSlot4,
                                    })
                                  : s.med > 4 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (Pe = s == null ? void 0 : s.fit) != null && Pe.MedSlot5
                                  ? i.jsx(N, {
                                      item:
                                        (X = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : X.MedSlot5,
                                    })
                                  : s.med > 5 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (me = s == null ? void 0 : s.fit) != null && me.MedSlot6
                                  ? i.jsx(N, {
                                      item:
                                        (Me = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Me.MedSlot6,
                                    })
                                  : s.med > 6 && i.jsx(T, { message: r("Empty Med Slot") }),
                                (Ft = s == null ? void 0 : s.fit) != null && Ft.MedSlot7
                                  ? i.jsx(N, {
                                      item:
                                        (it = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : it.MedSlot7,
                                    })
                                  : s.med > 7 && i.jsx(T, { message: r("Empty Med Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.low > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Lo Slots") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (Rt = s == null ? void 0 : s.fit) != null && Rt.LoSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (Ve = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Ve.LoSlot0,
                                    })
                                  : s.low > 0 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (Ar = s == null ? void 0 : s.fit) != null && Ar.LoSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (lr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : lr.LoSlot1,
                                    })
                                  : s.low > 1 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (cr = s == null ? void 0 : s.fit) != null && cr.LoSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (ar = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : ar.LoSlot2,
                                    })
                                  : s.low > 2 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (ur = s == null ? void 0 : s.fit) != null && ur.LoSlot3
                                  ? i.jsx(N, {
                                      item:
                                        (dr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : dr.LoSlot3,
                                    })
                                  : s.low > 3 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (fr = s == null ? void 0 : s.fit) != null && fr.LoSlot4
                                  ? i.jsx(N, {
                                      item:
                                        (gr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : gr.LoSlot4,
                                    })
                                  : s.low > 4 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (hr = s == null ? void 0 : s.fit) != null && hr.LoSlot5
                                  ? i.jsx(N, {
                                      item:
                                        (mr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : mr.LoSlot5,
                                    })
                                  : s.low > 5 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (pr = s == null ? void 0 : s.fit) != null && pr.LoSlot6
                                  ? i.jsx(N, {
                                      item:
                                        (xr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : xr.LoSlot6,
                                    })
                                  : s.low > 6 && i.jsx(T, { message: r("Empty Lo Slot") }),
                                (jr = s == null ? void 0 : s.fit) != null && jr.LoSlot7
                                  ? i.jsx(N, {
                                      item:
                                        (wr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : wr.LoSlot7,
                                    })
                                  : s.low > 7 && i.jsx(T, { message: r("Empty Lo Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.rig > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Rigs") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (yr = s == null ? void 0 : s.fit) != null && yr.RigSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (Sr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Sr.RigSlot0,
                                    })
                                  : s.rig > 0 && i.jsx(T, { message: r("Empty Rig Slot") }),
                                (vr = s == null ? void 0 : s.fit) != null && vr.RigSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (Cr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Cr.RigSlot1,
                                    })
                                  : s.rig > 1 && i.jsx(T, { message: r("Empty Rig Slot") }),
                                (Fr = s == null ? void 0 : s.fit) != null && Fr.RigSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (Rr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Rr.RigSlot2,
                                    })
                                  : s.rig > 2 && i.jsx(T, { message: r("Empty Rig Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.service > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Service Slots") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (br = s == null ? void 0 : s.fit) != null && br.ServiceSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (Er = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Er.ServiceSlot0,
                                    })
                                  : s.service > 0 && i.jsx(T, { message: r("Empty Service Slot") }),
                                (Nr = s == null ? void 0 : s.fit) != null && Nr.ServiceSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (Or = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Or.ServiceSlot1,
                                    })
                                  : s.service > 1 && i.jsx(T, { message: r("Empty Service Slot") }),
                                (Ir = s == null ? void 0 : s.fit) != null && Ir.ServiceSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (Tr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Tr.ServiceSlot2,
                                    })
                                  : s.service > 2 && i.jsx(T, { message: r("Empty Service Slot") }),
                                (Dr = s == null ? void 0 : s.fit) != null && Dr.ServiceSlot3
                                  ? i.jsx(N, {
                                      item:
                                        (kr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : kr.ServiceSlot3,
                                    })
                                  : s.service > 3 && i.jsx(T, { message: r("Empty Service Slot") }),
                                (Br = s == null ? void 0 : s.fit) != null && Br.ServiceSlot4
                                  ? i.jsx(N, {
                                      item:
                                        (Pr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Pr.ServiceSlot4,
                                    })
                                  : s.service > 4 && i.jsx(T, { message: r("Empty Service Slot") }),
                                (Mr = s == null ? void 0 : s.fit) != null && Mr.ServiceSlot5
                                  ? i.jsx(N, {
                                      item:
                                        (Vr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Vr.ServiceSlot5,
                                    })
                                  : s.service > 5 && i.jsx(T, { message: r("Empty Service Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.subsystem > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Service Slots") }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (Lr = s == null ? void 0 : s.fit) != null && Lr.SubSystemSlot0
                                  ? i.jsx(N, {
                                      item:
                                        (Hr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Hr.SubSystemSlot0,
                                    })
                                  : s.subsystem > 0 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                                (Ur = s == null ? void 0 : s.fit) != null && Ur.SubSystemSlot1
                                  ? i.jsx(N, {
                                      item:
                                        (_r = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : _r.SubSystemSlot1,
                                    })
                                  : s.subsystem > 1 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                                (qr = s == null ? void 0 : s.fit) != null && qr.SubSystemSlot2
                                  ? i.jsx(N, {
                                      item:
                                        (zr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : zr.SubSystemSlot2,
                                    })
                                  : s.subsystem > 2 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                                (Wr = s == null ? void 0 : s.fit) != null && Wr.SubSystemSlot3
                                  ? i.jsx(N, {
                                      item:
                                        (Gr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Gr.SubSystemSlot3,
                                    })
                                  : s.subsystem > 3 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                                (Yr = s == null ? void 0 : s.fit) != null && Yr.SubSystemSlot4
                                  ? i.jsx(N, {
                                      item:
                                        (Jr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Jr.SubSystemSlot4,
                                    })
                                  : s.subsystem > 4 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                                (Kr = s == null ? void 0 : s.fit) != null && Kr.SubSystemSlot5
                                  ? i.jsx(N, {
                                      item:
                                        (Qr = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : Qr.SubSystemSlot5,
                                    })
                                  : s.subsystem > 5 &&
                                    i.jsx(T, { message: r("Empty Sub System Slot") }),
                              ],
                            }),
                          ],
                        }),
                      s.fit.StructureFuel &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Structure Fuel") }),
                            }),
                            i.jsx("div", {
                              className: "px-3",
                              children:
                                (Zr = s == null ? void 0 : s.fit) == null
                                  ? void 0
                                  : Zr.StructureFuel.map((pe) =>
                                      i.jsx(N, { item: pe, qty: pe.qty }),
                                    ),
                            }),
                          ],
                        }),
                      s.fit.Cargo &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Cargo") }),
                            }),
                            i.jsx("div", {
                              className: "px-3",
                              children:
                                (Xr = s == null ? void 0 : s.fit) == null
                                  ? void 0
                                  : Xr.Cargo.map((pe) => i.jsx(N, { item: pe, qty: pe.qty })),
                            }),
                          ],
                        }),
                      s.fit.MoonMaterialBay &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Moon Material Bay") }),
                            }),
                            i.jsx("div", {
                              className: "px-3",
                              children:
                                ($r = s == null ? void 0 : s.fit) == null
                                  ? void 0
                                  : $r.MoonMaterialBay.map((pe) =>
                                      i.jsx(N, { item: pe, qty: pe.qty }),
                                    ),
                            }),
                          ],
                        }),
                      s.fighter > 0 &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: "Fighter Tubes" }),
                            }),
                            i.jsxs("div", {
                              className: "px-3",
                              children: [
                                (es = s == null ? void 0 : s.fit) != null && es.FighterTube0
                                  ? i.jsx(N, {
                                      prefix: "Tube 1:",
                                      item:
                                        (ts = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : ts.FighterTube0,
                                    })
                                  : s.fighter > 0 && i.jsx(T, { message: "Empty Fighter Tube" }),
                                (ns = s == null ? void 0 : s.fit) != null && ns.FighterTube1
                                  ? i.jsx(N, {
                                      prefix: "Tube 2:",
                                      item:
                                        (rs = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : rs.FighterTube1,
                                    })
                                  : s.fighter > 1 && i.jsx(T, { message: "Empty Fighter Tube" }),
                                (ss = s == null ? void 0 : s.fit) != null && ss.FighterTube2
                                  ? i.jsx(N, {
                                      prefix: "Tube 3:",
                                      item:
                                        (is = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : is.FighterTube2,
                                    })
                                  : s.fighter > 2 && i.jsx(T, { message: "Empty Fighter Tube" }),
                                (os = s == null ? void 0 : s.fit) != null && os.FighterTube3
                                  ? i.jsx(N, {
                                      prefix: "Tube 4:",
                                      item:
                                        (As = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : As.FighterTube3,
                                    })
                                  : s.fighter > 3 && i.jsx(T, { message: "Empty Fighter Tube" }),
                                (ls = s == null ? void 0 : s.fit) != null && ls.FighterTube4
                                  ? i.jsx(N, {
                                      prefix: "Tube 5:",
                                      item:
                                        (cs = s == null ? void 0 : s.fit) == null
                                          ? void 0
                                          : cs.FighterTube4,
                                    })
                                  : s.fighter > 4 && i.jsx(T, { message: "Empty Fighter Tube" }),
                              ],
                            }),
                          ],
                        }),
                      ((as = s == null ? void 0 : s.fit) == null ? void 0 : as.FighterBay) &&
                        i.jsxs("div", {
                          className: "my-2",
                          children: [
                            i.jsx("div", {
                              className: "aa-callout aa-callout-warning",
                              children: i.jsx(S.Title, { children: r("Fighter Bay") }),
                            }),
                            i.jsx("div", {
                              className: "px-3",
                              children:
                                (us = s == null ? void 0 : s.fit) == null
                                  ? void 0
                                  : us.FighterBay.map((pe) => i.jsx(N, { item: pe, qty: pe.qty })),
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
        ],
      }),
    });
  },
  Pg = (e) =>
    e
      ? i.jsx(rt, { placement: "top", id: e, style: { position: "fixed" }, children: e })
      : i.jsx(i.Fragment, {}),
  Mg = ({ data: e, isFetching: t }) => {
    const { t: n } = b(),
      [r, s] = R.useState({ id: 0, name: "" }),
      [o, A] = R.useState(!1),
      l = Z(),
      a = [
        l.accessor("location.name", {
          header: n("System"),
          cell: (c) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/system/${c.getValue().replace(" ", "_")}`,
              children: c.getValue(),
            }),
        }),
        l.accessor("constellation.name", {
          header: n("Constellation"),
          cell: (c) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${c.row.original.region.name.replace(" ", "_")}/${c.getValue().replace(" ", "_")}`,
              children: c.getValue(),
            }),
        }),
        l.accessor("region.name", {
          header: n("Region"),
          cell: (c) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${c.row.original.region.name.replace(" ", "_")}`,
              children: c.getValue(),
            }),
        }),
        l.accessor("name", {
          header: n("Structure"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex text-nowrap",
              children: [
                i.jsx("span", { className: "me-auto align-self-center", children: c.getValue() }),
                i.jsx(ae, {
                  trigger: ["hover"],
                  overlay: Pg(n("Open Structure Fitting. If Assets Token is loaded.")),
                  children: i.jsx(B, {
                    size: "sm",
                    onClick: () => {
                      s(c.row.original), A(!0);
                    },
                    children: i.jsx("i", { className: "fa-solid fa-wrench" }),
                  }),
                }),
              ],
            }),
        }),
        l.accessor("type.name", {
          header: n("Type"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex text-nowrap",
              children: [
                i.jsx(ht, { type_id: c.row.original.type.id, size: 32 }),
                i.jsx("span", { className: "mx-2 ", children: c.row.original.type.name }),
              ],
            }),
        }),
        l.accessor("owner.corporation_name", {
          header: n("Owner"),
          cell: (c) =>
            i.jsxs("div", {
              className: "text-nowrap",
              children: [
                i.jsx(De, { corporation_id: c.row.original.owner.corporation_id, size: 32 }),
                i.jsx("span", {
                  className: "ms-2",
                  children: c.row.original.owner.corporation_name,
                }),
              ],
            }),
        }),
        l.accessor("fuel_expiry", {
          header: n("Fuel Expiry"),
          enableColumnFilter: !1,
          cell: (c) => i.jsx(vo, { date: c.getValue() }),
        }),
        l.accessor("state", { header: n("State") }),
        l.accessor("services", {
          header: n("Services"),
          filterFn: sA,
          cell: (c) =>
            c.getValue()
              ? i.jsx("div", {
                  className: "text-center",
                  style: {
                    maxWidth: "500px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    alignContent: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  },
                  children: c.getValue().map((u) =>
                    i.jsx($, {
                      bg: u.state === "online" ? "primary" : "danger",
                      children: u.name,
                    }),
                  ),
                })
              : i.jsx(i.Fragment, {}),
        }),
      ];
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(yt, { isFetching: t, columns: a, data: e }),
        (r == null ? void 0 : r.id) !== 0 && i.jsx(Bg, { ship: r, showModal: o, setShowModal: A }),
      ],
    });
  },
  Vg = () => {
    const { data: e, isFetching: t } = O({
      queryKey: ["structures"],
      queryFn: () => Pu(),
      refetchOnWindowFocus: !1,
      initialData: { characters: [], main: void 0, headers: [] },
    });
    return i.jsx(i.Fragment, { children: i.jsx(Mg, { data: e, isFetching: t }) });
  },
  Lg = () => {
    const { t: e } = b(),
      { characterID: t } = q(),
      [n, r] = R.useState(!0),
      { data: s, isFetching: o } = O({
        queryKey: ["wallet-activity", t],
        queryFn: () => Wa(Number(t)),
        refetchOnWindowFocus: !1,
      }),
      A = Z(),
      l = [
        A.accessor("fpn", {
          header: e("From"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex justify-content-between align-items-center",
              children: [
                c.getValue(),
                i.jsx("a", {
                  className: "btn btn-sm btn-primary",
                  href: `https://zkillboard.com/${c.row.original.firstParty.cat}/${c.row.original.firstParty.id}`,
                  children: i.jsx("i", { className: "fa fa-external-link", "aria-hidden": "true" }),
                }),
              ],
            }),
        }),
        A.accessor("spn", {
          header: e("To"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex justify-content-between align-items-center",
              children: [
                c.getValue(),
                i.jsx("a", {
                  className: "btn btn-sm btn-primary",
                  href: `https://zkillboard.com/${c.row.original.secondParty.cat}/${c.row.original.secondParty.id}`,
                  children: i.jsx("i", { className: "fa fa-external-link", "aria-hidden": "true" }),
                }),
              ],
            }),
        }),
        A.accessor("value", {
          header: e("Amount"),
          cell: (c) => `${c.getValue().toLocaleString()}`,
        }),
        A.accessor("interactions", {
          header: e("Interaction Count"),
          cell: (c) => `${c.getValue().toLocaleString()}`,
        }),
      ],
      a = s == null ? void 0 : s.filter((c) => (n ? !0 : !c.own_account));
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(J.Check, {
          type: "switch",
          id: "custom-switch",
          label: e("Show Own Account Activity"),
          className: "float-end",
          onChange: (c) => {
            r(c.target.checked);
          },
          defaultChecked: n,
        }),
        i.jsx(te, { data: a, isFetching: o, columns: l }),
      ],
    });
  };
function Co(e) {
  var t = `${e}`;
  if (e >= 1e3) {
    for (
      var n = ["", "k", "m", "b", "t"], r = Math.floor(("" + e).length / 3.1), s = "", o = e, A = 3;
      A >= 2;
      A--
    ) {
      (o = parseFloat((r !== 0 ? e / Math.pow(1e3, r) : e).toPrecision(A))), (s = `${o}`);
      var l = (s + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (l.length <= 2) break;
    }
    o % 1 !== 0 && (s = o.toFixed(1)), (t = s + n[r]);
  }
  return t;
}
const Hg = ({ data: e, ores: t }) => (
  console.log(t, e),
  i.jsx(Wn, {
    data: e,
    keys: t,
    indexBy: "name",
    padding: 0.2,
    margin: { top: 10, right: 0, bottom: 50, left: 80 },
    pixelRatio: 2,
    innerPadding: 0,
    minValue: "auto",
    maxValue: "auto",
    groupMode: "stacked",
    layout: "vertical",
    reverse: !1,
    valueScale: { type: "linear" },
    indexScale: { type: "band", round: !0 },
    colors: { scheme: "spectral" },
    colorBy: "id",
    borderWidth: 0,
    borderRadius: 0,
    borderColor: { from: "color", modifiers: [["brighter", 2]] },
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 3,
      legend: "Ore",
      legendPosition: "middle",
      legendOffset: 35,
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      format: (n) => `${Co(n)}`,
      legend: "Total Volume",
      legendPosition: "middle",
      legendOffset: -70,
    },
    enableGridX: !1,
    enableGridY: !0,
    enableLabel: !1,
    labelSkipWidth: 24,
    labelSkipHeight: 24,
    labelTextColor: "#fff",
    valueFormat: " ^-,.0f",
    isInteractive: !0,
    legends: [],
    theme: {
      background: "#646464",
      text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
      axis: {
        domain: { line: { stroke: "#ddd", strokeWidth: 1 } },
        legend: {
          text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        },
        ticks: {
          line: { stroke: "#ddd", strokeWidth: 1 },
          text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        },
      },
      grid: { line: { stroke: "#999", strokeWidth: 1 } },
      legends: {
        title: {
          text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        },
        text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        ticks: {
          line: {},
          text: { fontSize: 12, fill: "#000", outlineWidth: 0, outlineColor: "transparent" },
        },
      },
      annotations: {
        text: {
          fontSize: 12,
          fill: "#ddd",
          outlineWidth: 2,
          outlineColor: "#ffffff",
          outlineOpacity: 1,
        },
        link: {
          stroke: "#ddd",
          strokeWidth: 1,
          outlineWidth: 2,
          outlineColor: "#ffffff",
          outlineOpacity: 1,
        },
        outline: {
          stroke: "#ddd",
          strokeWidth: 2,
          outlineWidth: 2,
          outlineColor: "#ffffff",
          outlineOpacity: 1,
        },
        symbol: { fill: "#ddd", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
      },
      tooltip: {
        container: { background: "#000", fontSize: 14 },
        basic: {},
        chip: {},
        table: {},
        tableCell: {},
        tableCellValue: {},
      },
    },
  })
);
function Ug(e, t) {
  if (e.length <= t) return e;
  var n = Math.round(e.length / t);
  return (
    console.log(e.length, t, n),
    e.slice(Math.round(n / 2), n * t + Math.round(n / 2)).filter(function (r, s) {
      return s % n === 0;
    })
  );
}
const _g = ({ data: e, keys: t }) => {
    const n = Ug(e, 10).map((r) => r.id);
    return i.jsx(Wn, {
      data: e,
      keys: t,
      indexBy: "id",
      padding: 0.2,
      margin: { top: 10, right: 0, bottom: 50, left: 80 },
      pixelRatio: 2,
      innerPadding: 0,
      minValue: "auto",
      maxValue: "auto",
      groupMode: "stacked",
      layout: "vertical",
      reverse: !1,
      valueScale: { type: "linear" },
      indexScale: { type: "band", round: !0 },
      colors: { scheme: "spectral" },
      colorBy: "id",
      borderWidth: 0,
      borderRadius: 0,
      valueFormat: " ^-,.0f",
      borderColor: { from: "color", modifiers: [["brighter", 2]] },
      axisRight: null,
      axisBottom: {
        tickSize: 5,
        tickPadding: 3,
        tickValues: n,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 35,
      },
      axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (r) => `${Co(r)}`,
        legend: "Daily Volume",
        legendPosition: "middle",
        legendOffset: -70,
      },
      enableGridX: !1,
      enableGridY: !0,
      enableLabel: !1,
      labelSkipWidth: 24,
      labelSkipHeight: 24,
      labelTextColor: "#fff",
      isInteractive: !0,
      legends: [],
      theme: {
        background: "#646464",
        text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        axis: {
          domain: { line: { stroke: "#ddd", strokeWidth: 1 } },
          legend: {
            text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
          ticks: {
            line: { stroke: "#ddd", strokeWidth: 1 },
            text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
        },
        grid: { line: { stroke: "#999", strokeWidth: 1 } },
        legends: {
          title: {
            text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
          text: { fontSize: 14, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          ticks: {
            line: {},
            text: { fontSize: 12, fill: "#000", outlineWidth: 0, outlineColor: "transparent" },
          },
        },
        annotations: {
          text: {
            fontSize: 12,
            fill: "#ddd",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          link: {
            stroke: "#ddd",
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          outline: {
            stroke: "#ddd",
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          symbol: { fill: "#ddd", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
        },
        tooltip: {
          container: { background: "#000", fontSize: 14 },
          basic: {},
          chip: {},
          table: {},
          tableCell: {},
          tableCellValue: {},
        },
      },
    });
  },
  qg = ({ data: e, keys: t }) =>
    i.jsx(Wn, {
      data: e,
      keys: t,
      indexBy: "id",
      margin: { top: 0, right: 5, bottom: 0, left: 5 },
      pixelRatio: 2,
      innerPadding: 0,
      groupMode: "stacked",
      layout: "vertical",
      reverse: !1,
      indexScale: { type: "band", round: !1 },
      colors: { scheme: "spectral" },
      colorBy: "id",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: { from: "color", modifiers: [["brighter", 2]] },
      axisRight: null,
      axisBottom: null,
      axisLeft: null,
      enableGridX: !0,
      enableGridY: !1,
      enableLabel: !1,
      isInteractive: !1,
      legends: [],
      theme: {
        background: "#646464",
        text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
        axis: {
          domain: { line: { stroke: "#ddd", strokeWidth: 1 } },
          legend: {
            text: { fontSize: 12, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
          ticks: {
            line: { stroke: "#ddd", strokeWidth: 1 },
            text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
        },
        grid: { line: { stroke: "#999", strokeWidth: 1 } },
        legends: {
          title: {
            text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          },
          text: { fontSize: 11, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" },
          ticks: {
            line: {},
            text: { fontSize: 10, fill: "#000", outlineWidth: 0, outlineColor: "transparent" },
          },
        },
        annotations: {
          text: {
            fontSize: 13,
            fill: "#ddd",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          link: {
            stroke: "#ddd",
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          outline: {
            stroke: "#ddd",
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          symbol: { fill: "#ddd", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
        },
        tooltip: {
          container: { background: "#000", fontSize: 12 },
          basic: {},
          chip: {},
          table: {},
          tableCell: {},
          tableCellValue: {},
        },
      },
    });
function Qs(e, t = "volume") {
  return e.map((r) => {
    let s = { id: r.date };
    for (let o = 0; o < r.ores.length; ++o) s[r.ores[o].name] = r.ores[o][t];
    return s;
  });
}
function zg(e, t, n, r = "volume") {
  let s = Object.fromEntries(e.map((o) => [o, Object.fromEntries(t.map((A) => [A, 0]))]));
  return (
    console.log("PRE", s),
    n.map((o) => {
      for (let A = 0; A < o.ores.length; ++A) s[o.ores[A].group][o.ores[A].name] += o.ores[A][r];
      return 0;
    }),
    console.log("POST", s),
    Object.entries(s).map((o) => {
      let A = { name: o[0] };
      return Object.entries(o[1]).map((l) => (A[l[0]] = l[1])), A;
    })
  );
}
const Wg = ({ data: e }) => {
    const { t } = b(),
      [n, r] = R.useState([0, e.data.length]),
      s = Qs(e.data.filter((c, u) => n[0] < u && u < n[1])),
      o = e.data.filter((c, u) => {
        let d = n[0] < u && u < n[1];
        return (d = d && c.characters.length > 0), d;
      }),
      A = zg(
        e.all_groups,
        e.all_ores,
        e.data.filter((c, u) => n[0] < u && u < n[1]),
      ),
      l = Z(),
      a = [
        l.accessor("date", { header: t("Date") }),
        l.accessor("characters", {
          header: t("Characters"),
          cell: (c) => {
            var u;
            return (u = c.getValue()) == null
              ? void 0
              : u.map((d) => i.jsxs(i.Fragment, { children: [`${d}`, i.jsx("br", {})] }));
          },
        }),
        l.accessor("systems", {
          header: t("Systems"),
          cell: (c) => {
            var u;
            return (u = c.getValue()) == null
              ? void 0
              : u.map((d) => i.jsxs(i.Fragment, { children: [`${d}`, i.jsx("br", {})] }));
          },
        }),
        l.accessor("ores", {
          header: t("Quantity"),
          cell: (c) => {
            var u;
            return (u = c.getValue()) == null
              ? void 0
              : u.map((d) =>
                  i.jsxs(i.Fragment, {
                    children: [`${d.name}: ${(~~d.volume).toLocaleString()}`, i.jsx("br", {})],
                  }),
                );
          },
        }),
      ];
    return (
      console.log("I'm HERE", o, s, A),
      i.jsxs(i.Fragment, {
        children: [
          i.jsxs("div", {
            style: {
              background: "#646464",
              color: "#ffffff",
              paddingTop: "2px",
              paddingBottom: "2px",
              borderRadius: "10px",
              margin: "5px",
            },
            children: [
              i.jsx("div", {
                style: { height: "250px", margin: "5px", background: "#646464" },
                children: i.jsx(Hg, { data: A, groups: e.all_groups, ores: e.all_ores }),
              }),
              i.jsx("div", {
                style: { height: "300px", margin: "5px", background: "#646464" },
                children: i.jsx(_g, { data: s, keys: e.all_ores }),
              }),
              i.jsxs("div", {
                style: { display: "flex", margin: "7px" },
                children: [
                  i.jsx("p", {
                    style: { margin: "5px", marginTop: "auto", marginBottom: "auto" },
                    children: "Zoom:",
                  }),
                  i.jsxs("div", {
                    style: { flexGrow: "1", height: "50px" },
                    children: [
                      i.jsx(Uo, {
                        className: "slider",
                        thumbClassName: "thumb",
                        trackClassName: "track",
                        defaultValue: [0, e.data.length - 1],
                        pearling: !0,
                        minDistance: 3,
                        min: 0,
                        max: e.data.length - 1,
                        onChange: (c) => r(c),
                      }),
                      i.jsx("div", {
                        style: { height: "50px", top: "-50px" },
                        children: i.jsx(qg, { data: Qs(e.data), keys: e.all_ores }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsx(te, { data: o, columns: a, isFetching: !1 }),
        ],
      })
    );
  },
  Gg = () => {
    const { characterID: e } = q(),
      { data: t } = O({
        queryKey: ["mining-ledger", e],
        queryFn: () => Ha(Number(e)),
        refetchOnWindowFocus: !1,
      });
    return t ? i.jsx(Wg, { data: t }) : i.jsx(oe, {});
  },
  Yg = "_start_1jq3w_1",
  Jg = "_end_1jq3w_18",
  Kg = "_gateActive_1jq3w_35",
  Qg = "_gateInactive_1jq3w_39",
  Zg = "_gateUnknown_1jq3w_43",
  ce = { start: Yg, end: Jg, gateActive: Kg, gateInactive: Qg, gateUnknown: Zg };
function vn({ message: e }) {
  return i.jsx(rt, { style: { position: "fixed" }, id: "tooltip", children: e });
}
const Xg = ({ start: e, end: t }) =>
    i.jsxs("div", {
      className: "bridge-div d-flex col-xs-12 my-3",
      children: [
        e.system_name
          ? i.jsxs(i.Fragment, {
              children: [
                i.jsxs("div", {
                  style: { justifyContent: "center" },
                  className: `d-flex flex-column ${ce.start} ${e.active ? ce.gateActive : ce.gateInactive}`,
                  children: [
                    i.jsx("h4", { children: e.system_name }),
                    i.jsx("p", { children: e.name }),
                  ],
                }),
                i.jsxs("div", {
                  className: "d-flex justify-content-evenly align-content-center flex-column",
                  children: [
                    i.jsxs($, {
                      bg: e.ozone > 25e5 ? "info" : "danger",
                      children: [" ", "Ozone: ", e.ozone.toLocaleString()],
                    }),
                    i.jsxs($, {
                      bg: e.expires > 13 ? "info" : "danger",
                      children: [" Fuel: ", e.expires, " days"],
                    }),
                  ],
                }),
                e.active
                  ? i.jsx(i.Fragment, {})
                  : i.jsx(ae, {
                      placement: "top",
                      overlay: vn({ message: "Gate Offline!" }),
                      children: i.jsx("i", { className: "far fa-times-circle" }),
                    }),
              ],
            })
          : i.jsxs(i.Fragment, {
              children: [
                i.jsx("div", {
                  className: `${ce.start} ${ce.gateInactive}`,
                  children: i.jsx("h4", { children: "Unknown" }),
                }),
                i.jsx("i", { className: "flex-child far fa-question-circle" }),
              ],
            }),
        i.jsx("div", {
          className: "align-self-center",
          style: { flexGrow: "5", textAlign: "center" },
          children: i.jsx(Vo, {
            style: { margin: "auto", marginLeft: "5px", marginRight: "5px" },
            animated:
              t.known && e.known ? (t.active && e.active ? !0 : !!(t.active || e.activefalse)) : !0,
            variant:
              t.known && e.known
                ? t.active && e.active
                  ? "success"
                  : t.active || e.activefalse
                    ? "warning"
                    : "danger"
                : "warning",
            now: 100,
          }),
        }),
        t.known
          ? i.jsx(i.Fragment, {
              children: t.system_name
                ? i.jsxs(i.Fragment, {
                    children: [
                      i.jsxs("div", {
                        className: "d-flex justify-content-evenly align-content-center flex-column",
                        children: [
                          i.jsxs($, {
                            className: "flex-child",
                            bg: t.ozone > 25e5 ? "info" : "danger",
                            children: ["Ozone: ", t.ozone.toLocaleString()],
                          }),
                          i.jsxs($, {
                            className: "flex-child",
                            bg: t.expires > 13 ? "info" : "danger",
                            children: ["Fuel: ", t.expires, " Days"],
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: `${ce.end} ${t.active ? ce.gateActive : ce.gateInactive}`,
                        children: [
                          i.jsx("h4", { children: t.system_name }),
                          i.jsx("p", { children: t.name }),
                        ],
                      }),
                    ],
                  })
                : i.jsx(ae, {
                    placement: "top",
                    overlay: vn({ message: "Gate Offline!" }),
                    children: i.jsx("i", { className: "far fa-times-circle" }),
                  }),
            })
          : i.jsxs(i.Fragment, {
              children: [
                i.jsx(ae, {
                  placement: "top",
                  overlay: vn({ message: "Gate not found in the Audit Module!" }),
                  children: i.jsx("i", { className: "align-self-center far fa-question-circle" }),
                }),
                i.jsx("div", {
                  style: { justifyContent: "center" },
                  className: `d-flex flex-column ${ce.end} ${ce.gateInactive}`,
                  children: i.jsx("h4", { children: "Unknown" }),
                }),
              ],
            }),
      ],
    }),
  $g = () =>
    i.jsxs("div", {
      style: { justifyContent: "center" },
      className: "d-flex align-items-center",
      children: [
        i.jsx("p", {
          className: ce.gateActive,
          style: { margin: "15px", borderBottom: "3px dotted" },
          children: "Gate Online",
        }),
        i.jsx("p", {
          className: ce.gateInactive,
          style: { margin: "15px", borderBottom: "3px dotted" },
          children: "Gate Offline",
        }),
        " ",
        i.jsx("p", {
          className: ce.gateUnknown,
          style: { margin: "15px", borderBottom: "3px dotted" },
          children: "Gate Unknown",
        }),
        i.jsx($, { bg: "info", style: { margin: "15px" }, children: "Lo/Fuel Level Ok" }),
        i.jsx($, { bg: "danger", style: { margin: "15px" }, children: "Lo/Fuel Level Low" }),
      ],
    }),
  eh = () => {
    const { data: e, isFetching: t } = O({
      queryKey: ["bridges"],
      queryFn: () => Uu(),
      refetchOnWindowFocus: !1,
      initialData: { characters: [], main: void 0, headers: [] },
    });
    return e.length > 0
      ? i.jsx(i.Fragment, {
          children: i.jsxs(S.Body, {
            className: "flex-container",
            children: [
              i.jsx($g, {}),
              i.jsx("hr", { className: "col-xs-12" }),
              e
                .sort((n, r) => {
                  let s = [],
                    o = [];
                  return (
                    n.start.known && s.push(n.start.ozone),
                    n.end.known && s.push(n.end.ozone),
                    r.start.known && o.push(r.start.ozone),
                    r.end.known && o.push(r.end.ozone),
                    Math.min(...s) > Math.min(...o) ? 1 : Math.min(...s) < Math.min(...o) ? -1 : 0
                  );
                })
                .map((n) => i.jsx(Xg, { start: n.start, end: n.end })),
            ],
          }),
        })
      : t
        ? i.jsx(oe, {})
        : i.jsx(oe, { message: "No Bridges Found" });
  },
  th = {
    option: (e) => ({ ...e, color: "black" }),
    menu: (e) => ({ ...e, zIndex: 9999 }),
    menuList: (e) => ({ ...e, zIndex: 9999 }),
    menuPortal: (e) => ({ ...e, zIndex: 9999 }),
  },
  Fo = ({ corporationID: e, setLocation: t }) => {
    const { isLoading: n, data: r } = O(["corp_asset_loc", e], () => _u(e));
    return i.jsx(wt, {
      isLoading: n,
      styles: th,
      options: r,
      isDisabled: !e,
      onChange: (s) => t(s.value),
    });
  },
  nh = () => {
    const { t: e } = b(),
      [t, n] = R.useState(0),
      [r, s] = R.useState(0),
      { data: o, isFetching: A } = O({
        queryKey: ["assetGroups", t, r],
        queryFn: () => qu(Number(t), Number(r)),
        refetchOnWindowFocus: !1,
      });
    return (
      console.log(A),
      i.jsxs(i.Fragment, {
        children: [
          i.jsxs("div", {
            className: "m-3 d-flex align-items-center",
            children: [
              i.jsx("h6", { className: "me-1", children: e("Corporation Filter") }),
              i.jsx("div", {
                className: "flex-grow-1",
                children: i.jsx(An, { setCorporation: n }),
              }),
            ],
          }),
          i.jsxs("div", {
            className: "m-3 d-flex align-items-center",
            children: [
              i.jsx("h6", { className: "me-1", children: e("Location Filter") }),
              i.jsx("div", {
                className: "flex-grow-1",
                children: i.jsx(Fo, { corporationID: t ? Number(t) : 0, setLocation: s }),
              }),
            ],
          }),
          A
            ? i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") })
            : t > 0
              ? i.jsx(so, { data: o })
              : i.jsx(pt, { title: e("Select Corporation") }),
        ],
      })
    );
  },
  rh = () => {
    const { t: e } = b(),
      [t, n] = R.useState(0),
      [r, s] = R.useState(0),
      { data: o, isFetching: A } = O({
        queryKey: ["corpassetList", t, r],
        queryFn: () => zu(Number(t), r, !0),
        refetchOnWindowFocus: !1,
        initialData: { characters: [], main: void 0, headers: [] },
      }),
      l = Z(),
      a = [
        l.accessor("item.name", { header: e("Item Type") }),
        l.accessor("item.cat", { header: e("Category") }),
        l.accessor("quantity", {
          header: e("Quantity"),
          cell: (c) => `${c.getValue().toLocaleString()}`,
        }),
        l.accessor("location.name", { header: e("Location") }),
      ];
    return i.jsxs(i.Fragment, {
      children: [
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center my-1",
          children: [
            i.jsx("h6", { className: "me-1", children: e("Corporation Filter") }),
            i.jsx("div", { className: "flex-grow-1", children: i.jsx(An, { setCorporation: n }) }),
          ],
        }),
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center my-1",
          children: [
            i.jsx("h6", { className: "me-1", children: e("Location Filter") }),
            i.jsx("div", {
              className: "flex-grow-1",
              children: i.jsx(Fo, { corporationID: t ? Number(t) : 0, setLocation: s }),
            }),
          ],
        }),
        A
          ? i.jsx(oe, { title: e("Data Loading"), message: e("Please Wait") })
          : t > 0
            ? i.jsx(te, { isFetching: A, data: o, columns: a })
            : i.jsx(pt, { title: e("Select Corporation") }),
      ],
    });
  },
  sh = {
    option: (e) => ({ ...e, color: "black" }),
    menu: (e) => ({ ...e, zIndex: 9999 }),
    menuList: (e) => ({ ...e, zIndex: 9999 }),
    menuPortal: (e) => ({ ...e, zIndex: 9999 }),
  },
  ih = ({ setFilter: e }) => {
    const { data: t, isLoading: n } = O({
      queryKey: ["ref_types", 0],
      queryFn: () => Yu(),
      initialData: [],
      refetchOnWindowFocus: !1,
    });
    console.log(t);
    let r = [];
    return (
      n || (r = t == null ? void 0 : t.map((s) => ({ value: s, label: s }))),
      i.jsx(wt, { isLoading: n, styles: sh, options: r, isMulti: !0, onChange: e })
    );
  },
  oh = ({ corporationID: e, refTypes: t }) => {
    const { t: n } = b(),
      r = 1,
      { data: s, isFetching: o } = O({
        queryKey: ["wallet", e, t, r],
        queryFn: () => Wu(Number(e), t, r),
        refetchOnWindowFocus: !1,
        initialData: { characters: [], main: void 0, headers: [] },
      }),
      A = Z(),
      l = [
        A.accessor("date", { header: n("Date") }),
        A.accessor("ref_type", { header: n("Type") }),
        A.accessor("division", { header: n("Division") }),
        A.accessor("first_party.name", { header: n("First Party") }),
        A.accessor("second_party.name", { header: n("Second Party") }),
        A.accessor("amount", {
          header: n("Amount"),
          cell: (a) => `${a.getValue().toLocaleString()}`,
        }),
        A.accessor("balance", {
          header: n("Balance"),
          cell: (a) => `${a.getValue().toLocaleString()}`,
        }),
        A.accessor("reason", { header: n("Reason") }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { isFetching: o, data: s, columns: l }) });
  },
  Ah = ({ corporationID: e }) => {
    const { t } = b(),
      { data: n, isLoading: r } = O({
        queryKey: ["corp-divisions", e],
        queryFn: () => Gu(e),
        initialData: [],
      });
    return i.jsx("div", {
      className: "d-flex flex-wrap",
      children:
        n.length > 0
          ? n.map((s) =>
              i.jsx("div", {
                children: i.jsx("h5", {
                  children: i.jsxs($, {
                    className: "text-center m-2",
                    children: [
                      s.division,
                      " ",
                      s.name == "Unknown" ? "" : s.name,
                      ":",
                      " ",
                      Number(s.balance).toLocaleString(),
                      " Isk",
                    ],
                  }),
                }),
              }),
            )
          : r
            ? i.jsx($, { children: t("Divisions Loading") })
            : i.jsx($, { children: t("Divisions Unavailable") }),
    });
  },
  lh = () => {
    const { t: e } = b(),
      [t, n] = R.useState(0),
      [r, s] = R.useState(""),
      o = (A) => {
        let l = A.map((a) => a.value);
        s(l.sort().join(","));
      };
    return i.jsxs(i.Fragment, {
      children: [
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center my-1",
          children: [
            i.jsx("h6", { className: "me-1", children: e("Corporation Filter") }),
            i.jsx("div", { className: "flex-grow-1", children: i.jsx(An, { setCorporation: n }) }),
          ],
        }),
        i.jsxs("div", {
          className: "m-3 d-flex align-items-center my-1",
          children: [
            i.jsx("h6", { className: "me-1", children: e("Ref Type Filter") }),
            i.jsx("div", { className: "flex-grow-1", children: i.jsx(ih, { setFilter: o }) }),
          ],
        }),
        i.jsxs("div", {
          className: "d-flex flex-column align-items-center my-1",
          children: [
            i.jsx("h5", { children: e("Division Balances") }),
            i.jsx(Ah, { corporationID: t }),
          ],
        }),
        t
          ? r == ""
            ? i.jsx(pt, { title: e("Select Ref Types") })
            : i.jsx(oh, { corporationID: t, refTypes: r })
          : i.jsx(pt, {}),
      ],
    });
  },
  ch = () => {
    const { t: e } = b(),
      { data: t, isFetching: n } = O({
        queryKey: ["pocos"],
        queryFn: () => Hu(),
        refetchOnWindowFocus: !1,
      }),
      r = Z(),
      s = [
        r.accessor("location.region", {
          header: e("Region"),
          cell: (o) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${o.getValue().replace(" ", "_")}`,
              children: o.getValue(),
            }),
        }),
        r.accessor("location.constellation", {
          header: e("Constellation"),
          cell: (o) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${o.row.original.location.region.replace(" ", "_")}/${o.getValue().replace(" ", "_")}`,
              children: o.getValue(),
            }),
        }),
        r.accessor("location.name", { header: e("Plannet") }),
        r.accessor("owner.corporation_name", {
          header: e("Owner"),
          cell: (o) =>
            i.jsxs(i.Fragment, {
              children: [
                i.jsx(De, { corporation_id: o.row.original.owner.corporation_id, size: 32 }),
                i.jsx("span", {
                  className: "ms-2",
                  children: o.row.original.owner.corporation_name,
                }),
              ],
            }),
        }),
        r.accessor("allow_access_with_standings", { header: e("Standings Access") }),
        r.accessor("allow_alliance_access", { header: e("Alliance Access") }),
        r.accessor("alliance_tax_rate", { header: e("Alliance") }),
        r.accessor("corporation_tax_rate", { header: e("Corporations") }),
        r.accessor("terrible_standing_tax_rate", { header: e("Terrible") }),
        r.accessor("bad_standing_tax_rate", { header: e("Bad") }),
        r.accessor("neutral_standing_tax_rate", { header: e("Nuetral") }),
        r.accessor("good_standing_tax_rate", { header: e("Good") }),
        r.accessor("excellent_standing_tax_rate", { header: e("Excelent") }),
        r.accessor("reinforce_exit_start", { header: e("Ref Exit Start") }),
        r.accessor("reinforce_exit_end", { header: e("Ref Exit End") }),
      ];
    return i.jsx(i.Fragment, { children: i.jsx(te, { isFetching: n, data: t, columns: s }) });
  },
  ah = () => {
    var A;
    const { t: e } = b(),
      { data: t, isFetching: n } = O({
        queryKey: ["corp-status"],
        queryFn: () => uo(),
        refetchOnWindowFocus: !1,
      }),
      r = Z();
    let s = [
      r.accessor("corporation.corporation_name", {
        header: e("Corporation"),
        cell: (l) =>
          i.jsxs(i.Fragment, {
            children: [
              i.jsx(De, { corporation_id: l.row.original.corporation.corporation_id, size: 32 }),
              i.jsx("span", {
                className: "ms-2",
                children: l.row.original.corporation.corporation_name,
              }),
            ],
          }),
      }),
    ];
    const o =
      (A = t == null ? void 0 : t.headers) == null
        ? void 0
        : A.map((l) =>
            r.accessor("corps.corporation", {
              id: `${l}`,
              header: l,
              enableColumnFilter: !1,
              enableSorting: !0,
              cell: (a) =>
                a.row.original.last_updates[l].update
                  ? i.jsx(i.Fragment, {
                      children: i.jsx(nt, {
                        date: Date.parse(a.row.original.last_updates[l].update),
                      }),
                    })
                  : i.jsx("span", { className: "text-warning", children: "Never" }),
            }),
          );
    return (
      o && (s = s.concat(o)),
      i.jsx(i.Fragment, {
        children: i.jsx(te, { data: t == null ? void 0 : t.corps, isFetching: n, columns: s }),
      })
    );
  };
function uh({ data: e, header: t = "", isFetching: n }) {
  const { t: r } = b(),
    s = Z(),
    o = [
      s.accessor("type.name", {
        header: r("Name"),
        cell: (A) =>
          i.jsxs("div", {
            className: "d-flex align-items-center",
            children: [
              i.jsx("div", {
                style: { widows: "32px" },
                children: i.jsx(ht, {
                  height: 32,
                  width: 32,
                  type_id: A.row.original.type.id,
                  size: 32,
                }),
              }),
              i.jsx("p", { className: "m-0 ms-2", children: A.getValue() }),
            ],
          }),
      }),
      s.accessor("distance", {
        header: r("Distance"),
        cell: (A) =>
          i.jsxs(i.Fragment, {
            children: [
              A.getValue().toLocaleString("en-US", {
                maximumFractionDigits: 2,
                notation: "compact",
                compactDisplay: "short",
              }),
              "m",
            ],
          }),
      }),
    ];
  return i.jsx(We, {
    children:
      (e == null ? void 0 : e.length) > 0 &&
      i.jsxs(i.Fragment, {
        children: [
          i.jsx("h6", { className: Be.strikeOut, children: t }),
          i.jsx(te, { data: e, columns: o, isFetching: n }),
        ],
      }),
  });
}
function dh({ starbase: e, showModal: t, setShowModal: n }) {
  var A, l;
  const { t: r } = b(),
    { data: s, isFetching: o } = O({
      queryKey: ["starbase", e.starbase_id],
      queryFn: () => Lu(e.starbase_id ? Number(e.starbase_id) : 0),
      refetchOnWindowFocus: !1,
    });
  return (
    console.log(s),
    console.log(e),
    i.jsxs(_, {
      show: t,
      size: "lg",
      onHide: () => {
        n(!1);
      },
      children: [
        i.jsx(_.Header, {
          closeButton: !0,
          children: i.jsx(_.Title, { children: r("Starbase Detail") }),
        }),
        i.jsxs(_.Body, {
          children: [
            i.jsx("div", {
              className: "text-center m-2",
              children: i.jsx(ht, {
                type_id: (A = e == null ? void 0 : e.type) == null ? void 0 : A.id,
                size: 256,
              }),
            }),
            (e == null ? void 0 : e.name) &&
              i.jsx("h3", { className: "text-center m-2", children: e == null ? void 0 : e.name }),
            i.jsx("h6", { className: Be.strikeOut, children: r("Detail") }),
            i.jsxs("table", {
              className: "table",
              children: [
                i.jsx(K, { strValue: e == null ? void 0 : e.state, text: r("State") }),
                i.jsx(Te, {
                  dateStrValue: e == null ? void 0 : e.onlined_since,
                  text: r("Online Since"),
                }),
                i.jsx(Te, {
                  dateStrValue: e == null ? void 0 : e.reinforced_until,
                  text: r("Reinforced Till"),
                }),
                i.jsx(Te, {
                  dateStrValue: e == null ? void 0 : e.unanchor_at,
                  text: r("Unanchoring AT"),
                }),
                i.jsx(K, {
                  strValue: (l = e == null ? void 0 : e.moon) == null ? void 0 : l.name,
                  text: r("Moon"),
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.anchor,
                  text: "Anchoring Permissions:",
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.online,
                  text: "Onlining Permissions:",
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.offline,
                  text: "Offlining Permissions:",
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.unanchor,
                  text: "UnAnchoring Permissions:",
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.fuel_bay_take,
                  text: "Fuel Take Permissions:",
                }),
                i.jsx(K, {
                  strValue: e == null ? void 0 : e.fuel_bay_view,
                  text: "Fuel View Permissions:",
                }),
              ],
            }),
            i.jsx(uh, { data: s, isFetching: o, header: r("Fitting") }),
          ],
        }),
        i.jsx(_.Footer, {
          children: i.jsx(B, { className: "w-100", onClick: () => n(!1), children: r("Close") }),
        }),
      ],
    })
  );
}
const fh = (e) =>
    e
      ? i.jsx(rt, { placement: "top", id: e, style: { position: "fixed" }, children: e })
      : i.jsx(i.Fragment, {}),
  gh = () => {
    const { t: e } = b(),
      [t, n] = R.useState({}),
      [r, s] = R.useState(!0),
      { data: o, isFetching: A } = O({
        queryKey: ["starbases"],
        queryFn: () => Vu(),
        refetchOnWindowFocus: !1,
      }),
      l = Z(),
      a = [
        l.accessor("region.name", {
          header: e("Region"),
          cell: (c) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${c.getValue().replace(" ", "_")}`,
              children: c.getValue(),
            }),
        }),
        l.accessor("constellation.name", {
          header: e("Constellation"),
          cell: (c) => {
            var u;
            return i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${(u = c.row.original.region) == null ? void 0 : u.name.replace(" ", "_")}/${c.getValue().replace(" ", "_")}`,
              children: c.getValue(),
            });
          },
        }),
        l.accessor("system.name", {
          header: e("System"),
          cell: (c) =>
            i.jsx("a", {
              href: `https://evemaps.dotlan.net/map/${c.getValue().replace(" ", "_")}`,
              children: c.getValue(),
            }),
        }),
        l.accessor("moon.name", {
          header: e("Moon"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex text-nowrap",
              children: [
                i.jsx("span", { className: "me-auto align-self-center", children: c.getValue() }),
                i.jsx(ae, {
                  trigger: ["hover", "focus"],
                  overlay: fh(e("Open Starbase Fitting. If Assets Token is loaded.")),
                  children: i.jsx(B, {
                    size: "sm",
                    onClick: () => {
                      console.log(c.row.original), n(c.row.original), s(!0);
                    },
                    children: i.jsx("i", { className: "fa-solid fa-wrench" }),
                  }),
                }),
              ],
            }),
        }),
        l.accessor("name", { header: e("Name") }),
        l.accessor("owner.corporation_name", {
          header: e("Owner"),
          cell: (c) =>
            i.jsxs(i.Fragment, {
              children: [
                i.jsx(De, { corporation_id: c.row.original.owner.corporation_id, size: 32 }),
                i.jsx("span", {
                  className: "ms-2",
                  children: c.row.original.owner.corporation_name,
                }),
              ],
            }),
        }),
        l.accessor("state", {
          header: e("State"),
          cell: (c) =>
            i.jsxs("div", {
              className: "d-flex flex-column",
              children: [
                i.jsx("span", { children: c.getValue() }),
                c.getValue() == "online" &&
                  i.jsx(i.Fragment, {
                    children: i.jsx(vo, { date: c.row.original.onlined_since }),
                  }),
              ],
            }),
        }),
      ];
    return (
      console.log(t),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx(yt, { isFetching: A, data: o, columns: a }),
          t.starbase_id && i.jsx(dh, { starbase: t, showModal: r, setShowModal: s }),
        ],
      })
    );
  };
zn.addDefaultLocale(bo);
const hh = new Eo();
zo.use(Wo)
  .use(Go)
  .use(Yo)
  .init({
    detection: {
      order: [
        "htmlTag",
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      htmlTag: document.getElementById("root"),
    },
    fallbackLng: "en",
    interpolation: { escapeValue: !1 },
    react: { useSuspense: !1 },
    backend: { loadPath: "/static/corptools/i18n/{{lng}}/{{ns}}.json" },
  });
function mh() {
  return i.jsx(ie.StrictMode, {
    children: i.jsx(No, {
      client: hh,
      children: i.jsx(_o, {
        children: i.jsxs(qo, {
          children: [
            i.jsxs(P, {
              path: "audit/r/:characterID/",
              element: i.jsx(uu, {}),
              children: [
                i.jsx(P, {
                  index: !0,
                  element: i.jsx(ln, { to: "account/overview", replace: !0 }),
                }),
                i.jsx(P, { path: "account/overview", element: i.jsx(Td, {}) }),
                i.jsx(P, { path: "account/status", element: i.jsx(Bf, {}) }),
                i.jsx(P, { path: "account/assets", element: i.jsx(Xa, {}) }),
                i.jsx(P, { path: "account/listassets", element: i.jsx($a, {}) }),
                i.jsx(P, { path: "account/pubdata", element: i.jsx(Pd, {}) }),
                i.jsx(P, { path: "account/clones", element: i.jsx(du, {}) }),
                i.jsx(P, { path: "account/roles", element: i.jsx(Md, {}) }),
                i.jsx(P, { path: "account/wallet", element: i.jsx(Pf, {}) }),
                i.jsx(P, { path: "account/mail", element: i.jsx(Fu, {}) }),
                i.jsx(P, { path: "account/mining", element: i.jsx(Gg, {}) }),
                i.jsx(P, { path: "account/lp", element: i.jsx(vu, {}) }),
                i.jsx(P, { path: "account/walletactivity", element: i.jsx(Lg, {}) }),
                i.jsx(P, { path: "account/notifications", element: i.jsx(bu, {}) }),
                i.jsx(P, { path: "account/contact", element: i.jsx(fu, {}) }),
                i.jsx(P, { path: "account/contract", element: i.jsx(pu, {}) }),
                i.jsx(P, { path: "account/skills", element: i.jsx(If, {}) }),
                i.jsx(P, { path: "account/skillqueue", element: i.jsx(bf, {}) }),
                i.jsx(P, { path: "account/doctrines", element: i.jsx(Su, {}) }),
                i.jsx(P, { path: "account/market", element: i.jsx(Ru, {}) }),
                i.jsx(P, {
                  path: "account/standings",
                  element: i.jsx(S, {
                    children: i.jsx(S.Body, {
                      className: "text-center",
                      children: "This is account/standings.",
                    }),
                  }),
                }),
                i.jsx(P, { path: "account/list", element: i.jsx(Ga, {}) }),
                i.jsx(P, {
                  path: "*",
                  element: i.jsx(et, {
                    title: "Error 404",
                    message: "This is not the path you are looking for! Page not found.",
                  }),
                }),
              ],
            }),
            i.jsxs(P, {
              path: "audit/r/corp/",
              element: i.jsx(Jf, {}),
              children: [
                i.jsx(P, { index: !0, element: i.jsx(ln, { to: "glance", replace: !0 }) }),
                i.jsx(P, { path: "corporations", element: i.jsx(ah, {}) }),
                i.jsx(P, { path: "glance", element: i.jsx(Lf, {}) }),
                i.jsx(P, { path: "structures", element: i.jsx(Vg, {}) }),
                i.jsx(P, { path: "wallets", element: i.jsx(lh, {}) }),
                i.jsx(P, { path: "assetgroup", element: i.jsx(nh, {}) }),
                i.jsx(P, { path: "assetlist", element: i.jsx(rh, {}) }),
                i.jsx(P, { path: "pocos", element: i.jsx(ch, {}) }),
                i.jsx(P, { path: "starbases", element: i.jsx(gh, {}) }),
                i.jsx(P, { path: "bridges", element: i.jsx(eh, {}) }),
                i.jsx(P, {
                  path: "*",
                  element: i.jsx(et, {
                    title: "Error 404",
                    message: "This is not the path you are looking for! Page not found.",
                  }),
                }),
              ],
            }),
            i.jsx(P, { path: "*", element: i.jsx(ln, { to: "audit/r/0", replace: !0 }) }),
          ],
        }),
      }),
    }),
  });
}
var qn = {},
  Zs = Oo;
(qn.createRoot = Zs.createRoot), (qn.hydrateRoot = Zs.hydrateRoot);
qn.createRoot(document.getElementById("root")).render(
  i.jsx(ie.StrictMode, { children: i.jsx(mh, {}) }),
);
//# sourceMappingURL=index-BeGYDsWF.js.map
