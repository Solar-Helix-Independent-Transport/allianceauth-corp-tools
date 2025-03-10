import {
  g as or,
  _ as Vo,
  r as l,
  R as V,
  a as _o,
  b as Se,
  j as p,
  O as M,
} from "./@app-libs-Cb_auZyT.js";
var ar = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/ (function (e) {
  (function () {
    var t = {}.hasOwnProperty;
    function n() {
      for (var a = "", s = 0; s < arguments.length; s++) {
        var i = arguments[s];
        i && (a = o(a, r(i)));
      }
      return a;
    }
    function r(a) {
      if (typeof a == "string" || typeof a == "number") return a;
      if (typeof a != "object") return "";
      if (Array.isArray(a)) return n.apply(null, a);
      if (
        a.toString !== Object.prototype.toString &&
        !a.toString.toString().includes("[native code]")
      )
        return a.toString();
      var s = "";
      for (var i in a) t.call(a, i) && a[i] && (s = o(s, i));
      return s;
    }
    function o(a, s) {
      return s ? (a ? a + " " + s : a + s) : a;
    }
    e.exports ? ((n.default = n), (e.exports = n)) : (window.classNames = n);
  })();
})(ar);
var Go = ar.exports;
const O = or(Go);
function sr(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Sn(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function Xo(e) {
  var t = qo(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function qo(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function ir(e, t, n) {
  var r = l.useRef(e !== void 0),
    o = l.useState(t),
    a = o[0],
    s = o[1],
    i = e !== void 0,
    c = r.current;
  return (
    (r.current = i),
    !i && c && a !== t && s(t),
    [
      i ? e : a,
      l.useCallback(
        function (u) {
          for (var d = arguments.length, f = new Array(d > 1 ? d - 1 : 0), v = 1; v < d; v++)
            f[v - 1] = arguments[v];
          n && n.apply(void 0, [u].concat(f)), s(u);
        },
        [n],
      ),
    ]
  );
}
function zt(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      a = n,
      s = a[Sn(r)],
      i = a[r],
      c = sr(a, [Sn(r), r].map(Xo)),
      u = t[r],
      d = ir(i, s, e[u]),
      f = d[0],
      v = d[1];
    return Vo({}, c, ((o = {}), (o[r] = f), (o[u] = v), o));
  }, e);
}
const zo = ["xxl", "xl", "lg", "md", "sm", "xs"],
  Yo = "xs",
  ot = l.createContext({ prefixes: {}, breakpoints: zo, minBreakpoint: Yo }),
  { Consumer: sl, Provider: il } = ot;
function N(e, t) {
  const { prefixes: n } = l.useContext(ot);
  return e || n[t] || t;
}
function lr() {
  const { breakpoints: e } = l.useContext(ot);
  return e;
}
function cr() {
  const { minBreakpoint: e } = l.useContext(ot);
  return e;
}
function Ot() {
  const { dir: e } = l.useContext(ot);
  return e === "rtl";
}
function Ue(e) {
  return (e && e.ownerDocument) || document;
}
function Zo(e) {
  var t = Ue(e);
  return (t && t.defaultView) || window;
}
function Jo(e, t) {
  return Zo(e).getComputedStyle(e, t);
}
var Qo = /([A-Z])/g;
function ea(e) {
  return e.replace(Qo, "-$1").toLowerCase();
}
var ta = /^ms-/;
function ft(e) {
  return ea(e).replace(ta, "-ms-");
}
var na = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function ra(e) {
  return !!(e && na.test(e));
}
function me(e, t) {
  var n = "",
    r = "";
  if (typeof t == "string") return e.style.getPropertyValue(ft(t)) || Jo(e).getPropertyValue(ft(t));
  Object.keys(t).forEach(function (o) {
    var a = t[o];
    !a && a !== 0
      ? e.style.removeProperty(ft(o))
      : ra(o)
        ? (r += o + "(" + a + ") ")
        : (n += ft(o) + ": " + a + ";");
  }),
    r && (n += "transform: " + r + ";"),
    (e.style.cssText += ";" + n);
}
const kn = { disabled: !1 },
  ur = V.createContext(null);
var oa = function (t) {
    return t.scrollTop;
  },
  ze = "unmounted",
  Re = "exited",
  fe = "entering",
  $e = "entered",
  gt = "exiting",
  ye = (function (e) {
    _o(t, e);
    function t(r, o) {
      var a;
      a = e.call(this, r, o) || this;
      var s = o,
        i = s && !s.isMounting ? r.enter : r.appear,
        c;
      return (
        (a.appearStatus = null),
        r.in
          ? i
            ? ((c = Re), (a.appearStatus = fe))
            : (c = $e)
          : r.unmountOnExit || r.mountOnEnter
            ? (c = ze)
            : (c = Re),
        (a.state = { status: c }),
        (a.nextCallback = null),
        a
      );
    }
    t.getDerivedStateFromProps = function (o, a) {
      var s = o.in;
      return s && a.status === ze ? { status: Re } : null;
    };
    var n = t.prototype;
    return (
      (n.componentDidMount = function () {
        this.updateStatus(!0, this.appearStatus);
      }),
      (n.componentDidUpdate = function (o) {
        var a = null;
        if (o !== this.props) {
          var s = this.state.status;
          this.props.in ? s !== fe && s !== $e && (a = fe) : (s === fe || s === $e) && (a = gt);
        }
        this.updateStatus(!1, a);
      }),
      (n.componentWillUnmount = function () {
        this.cancelNextCallback();
      }),
      (n.getTimeouts = function () {
        var o = this.props.timeout,
          a,
          s,
          i;
        return (
          (a = s = i = o),
          o != null &&
            typeof o != "number" &&
            ((a = o.exit), (s = o.enter), (i = o.appear !== void 0 ? o.appear : s)),
          { exit: a, enter: s, appear: i }
        );
      }),
      (n.updateStatus = function (o, a) {
        if ((o === void 0 && (o = !1), a !== null))
          if ((this.cancelNextCallback(), a === fe)) {
            if (this.props.unmountOnExit || this.props.mountOnEnter) {
              var s = this.props.nodeRef ? this.props.nodeRef.current : Se.findDOMNode(this);
              s && oa(s);
            }
            this.performEnter(o);
          } else this.performExit();
        else this.props.unmountOnExit && this.state.status === Re && this.setState({ status: ze });
      }),
      (n.performEnter = function (o) {
        var a = this,
          s = this.props.enter,
          i = this.context ? this.context.isMounting : o,
          c = this.props.nodeRef ? [i] : [Se.findDOMNode(this), i],
          u = c[0],
          d = c[1],
          f = this.getTimeouts(),
          v = i ? f.appear : f.enter;
        if ((!o && !s) || kn.disabled) {
          this.safeSetState({ status: $e }, function () {
            a.props.onEntered(u);
          });
          return;
        }
        this.props.onEnter(u, d),
          this.safeSetState({ status: fe }, function () {
            a.props.onEntering(u, d),
              a.onTransitionEnd(v, function () {
                a.safeSetState({ status: $e }, function () {
                  a.props.onEntered(u, d);
                });
              });
          });
      }),
      (n.performExit = function () {
        var o = this,
          a = this.props.exit,
          s = this.getTimeouts(),
          i = this.props.nodeRef ? void 0 : Se.findDOMNode(this);
        if (!a || kn.disabled) {
          this.safeSetState({ status: Re }, function () {
            o.props.onExited(i);
          });
          return;
        }
        this.props.onExit(i),
          this.safeSetState({ status: gt }, function () {
            o.props.onExiting(i),
              o.onTransitionEnd(s.exit, function () {
                o.safeSetState({ status: Re }, function () {
                  o.props.onExited(i);
                });
              });
          });
      }),
      (n.cancelNextCallback = function () {
        this.nextCallback !== null && (this.nextCallback.cancel(), (this.nextCallback = null));
      }),
      (n.safeSetState = function (o, a) {
        (a = this.setNextCallback(a)), this.setState(o, a);
      }),
      (n.setNextCallback = function (o) {
        var a = this,
          s = !0;
        return (
          (this.nextCallback = function (i) {
            s && ((s = !1), (a.nextCallback = null), o(i));
          }),
          (this.nextCallback.cancel = function () {
            s = !1;
          }),
          this.nextCallback
        );
      }),
      (n.onTransitionEnd = function (o, a) {
        this.setNextCallback(a);
        var s = this.props.nodeRef ? this.props.nodeRef.current : Se.findDOMNode(this),
          i = o == null && !this.props.addEndListener;
        if (!s || i) {
          setTimeout(this.nextCallback, 0);
          return;
        }
        if (this.props.addEndListener) {
          var c = this.props.nodeRef ? [this.nextCallback] : [s, this.nextCallback],
            u = c[0],
            d = c[1];
          this.props.addEndListener(u, d);
        }
        o != null && setTimeout(this.nextCallback, o);
      }),
      (n.render = function () {
        var o = this.state.status;
        if (o === ze) return null;
        var a = this.props,
          s = a.children;
        a.in,
          a.mountOnEnter,
          a.unmountOnExit,
          a.appear,
          a.enter,
          a.exit,
          a.timeout,
          a.addEndListener,
          a.onEnter,
          a.onEntering,
          a.onEntered,
          a.onExit,
          a.onExiting,
          a.onExited,
          a.nodeRef;
        var i = sr(a, [
          "children",
          "in",
          "mountOnEnter",
          "unmountOnExit",
          "appear",
          "enter",
          "exit",
          "timeout",
          "addEndListener",
          "onEnter",
          "onEntering",
          "onEntered",
          "onExit",
          "onExiting",
          "onExited",
          "nodeRef",
        ]);
        return V.createElement(
          ur.Provider,
          { value: null },
          typeof s == "function" ? s(o, i) : V.cloneElement(V.Children.only(s), i),
        );
      }),
      t
    );
  })(V.Component);
ye.contextType = ur;
ye.propTypes = {};
function Ie() {}
ye.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: Ie,
  onEntering: Ie,
  onEntered: Ie,
  onExit: Ie,
  onExiting: Ie,
  onExited: Ie,
};
ye.UNMOUNTED = ze;
ye.EXITED = Re;
ye.ENTERING = fe;
ye.ENTERED = $e;
ye.EXITING = gt;
const Ve = !!(typeof window < "u" && window.document && window.document.createElement);
var Pt = !1,
  Wt = !1;
try {
  var Mt = {
    get passive() {
      return (Pt = !0);
    },
    get once() {
      return (Wt = Pt = !0);
    },
  };
  Ve && (window.addEventListener("test", Mt, Mt), window.removeEventListener("test", Mt, !0));
} catch {}
function Yt(e, t, n, r) {
  if (r && typeof r != "boolean" && !Wt) {
    var o = r.once,
      a = r.capture,
      s = n;
    !Wt &&
      o &&
      ((s =
        n.__once ||
        function i(c) {
          this.removeEventListener(t, i, a), n.call(this, c);
        }),
      (n.__once = s)),
      e.addEventListener(t, s, Pt ? r : a);
  }
  e.addEventListener(t, n, r);
}
function Ht(e, t, n, r) {
  var o = r && typeof r != "boolean" ? r.capture : r;
  e.removeEventListener(t, n, o), n.__once && e.removeEventListener(t, n.__once, o);
}
function ve(e, t, n, r) {
  return (
    Yt(e, t, n, r),
    function () {
      Ht(e, t, n, r);
    }
  );
}
function aa(e, t, n, r) {
  if ((r === void 0 && (r = !0), e)) {
    var o = document.createEvent("HTMLEvents");
    o.initEvent(t, n, r), e.dispatchEvent(o);
  }
}
function sa(e) {
  var t = me(e, "transitionDuration") || "",
    n = t.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(t) * n;
}
function ia(e, t, n) {
  n === void 0 && (n = 5);
  var r = !1,
    o = setTimeout(function () {
      r || aa(e, "transitionend", !0);
    }, t + n),
    a = ve(
      e,
      "transitionend",
      function () {
        r = !0;
      },
      { once: !0 },
    );
  return function () {
    clearTimeout(o), a();
  };
}
function dr(e, t, n, r) {
  n == null && (n = sa(e) || 0);
  var o = ia(e, n, r),
    a = ve(e, "transitionend", t);
  return function () {
    o(), a();
  };
}
function Dn(e, t) {
  const n = me(e, t) || "",
    r = n.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(n) * r;
}
function fr(e, t) {
  const n = Dn(e, "transitionDuration"),
    r = Dn(e, "transitionDelay"),
    o = dr(
      e,
      (a) => {
        a.target === e && (o(), t(a));
      },
      n + r,
    );
}
function Xe(...e) {
  return e
    .filter((t) => t != null)
    .reduce((t, n) => {
      if (typeof n != "function")
        throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");
      return t === null
        ? n
        : function (...o) {
            t.apply(this, o), n.apply(this, o);
          };
    }, null);
}
function pr(e) {
  e.offsetHeight;
}
const Mn = (e) =>
  !e || typeof e == "function"
    ? e
    : (t) => {
        e.current = t;
      };
function la(e, t) {
  const n = Mn(e),
    r = Mn(t);
  return (o) => {
    n && n(o), r && r(o);
  };
}
function se(e, t) {
  return l.useMemo(() => la(e, t), [e, t]);
}
function yt(e) {
  return e && "setState" in e ? Se.findDOMNode(e) : (e ?? null);
}
const vr = V.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        onExited: a,
        addEndListener: s,
        children: i,
        childRef: c,
        ...u
      },
      d,
    ) => {
      const f = l.useRef(null),
        v = se(f, c),
        m = (w) => {
          v(yt(w));
        },
        g = (w) => ($) => {
          w && f.current && w(f.current, $);
        },
        y = l.useCallback(g(e), [e]),
        h = l.useCallback(g(t), [t]),
        E = l.useCallback(g(n), [n]),
        C = l.useCallback(g(r), [r]),
        x = l.useCallback(g(o), [o]),
        b = l.useCallback(g(a), [a]),
        R = l.useCallback(g(s), [s]);
      return p.jsx(ye, {
        ref: d,
        ...u,
        onEnter: y,
        onEntered: E,
        onEntering: h,
        onExit: C,
        onExited: b,
        onExiting: x,
        addEndListener: R,
        nodeRef: f,
        children:
          typeof i == "function" ? (w, $) => i(w, { ...$, ref: m }) : V.cloneElement(i, { ref: m }),
      });
    },
  ),
  ca = { height: ["marginTop", "marginBottom"], width: ["marginLeft", "marginRight"] };
function ua(e, t) {
  const n = `offset${e[0].toUpperCase()}${e.slice(1)}`,
    r = t[n],
    o = ca[e];
  return r + parseInt(me(t, o[0]), 10) + parseInt(me(t, o[1]), 10);
}
const da = { [Re]: "collapse", [gt]: "collapsing", [fe]: "collapsing", [$e]: "collapse show" },
  fa = V.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        className: a,
        children: s,
        dimension: i = "height",
        in: c = !1,
        timeout: u = 300,
        mountOnEnter: d = !1,
        unmountOnExit: f = !1,
        appear: v = !1,
        getDimensionValue: m = ua,
        ...g
      },
      y,
    ) => {
      const h = typeof i == "function" ? i() : i,
        E = l.useMemo(
          () =>
            Xe((w) => {
              w.style[h] = "0";
            }, e),
          [h, e],
        ),
        C = l.useMemo(
          () =>
            Xe((w) => {
              const $ = `scroll${h[0].toUpperCase()}${h.slice(1)}`;
              w.style[h] = `${w[$]}px`;
            }, t),
          [h, t],
        ),
        x = l.useMemo(
          () =>
            Xe((w) => {
              w.style[h] = null;
            }, n),
          [h, n],
        ),
        b = l.useMemo(
          () =>
            Xe((w) => {
              (w.style[h] = `${m(h, w)}px`), pr(w);
            }, r),
          [r, m, h],
        ),
        R = l.useMemo(
          () =>
            Xe((w) => {
              w.style[h] = null;
            }, o),
          [h, o],
        );
      return p.jsx(vr, {
        ref: y,
        addEndListener: fr,
        ...g,
        "aria-expanded": g.role ? c : null,
        onEnter: E,
        onEntering: C,
        onEntered: x,
        onExit: b,
        onExiting: R,
        childRef: s.ref,
        in: c,
        timeout: u,
        mountOnEnter: d,
        unmountOnExit: f,
        appear: v,
        children: (w, $) =>
          V.cloneElement(s, {
            ...$,
            className: O(a, s.props.className, da[w], h === "width" && "collapse-horizontal"),
          }),
      });
    },
  );
function mr(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
const at = l.createContext({});
at.displayName = "AccordionContext";
const Zt = l.forwardRef(
  ({ as: e = "div", bsPrefix: t, className: n, children: r, eventKey: o, ...a }, s) => {
    const { activeEventKey: i } = l.useContext(at);
    return (
      (t = N(t, "accordion-collapse")),
      p.jsx(fa, {
        ref: s,
        in: mr(i, o),
        ...a,
        className: O(n, t),
        children: p.jsx(e, { children: l.Children.only(r) }),
      })
    );
  },
);
Zt.displayName = "AccordionCollapse";
const Rt = l.createContext({ eventKey: "" });
Rt.displayName = "AccordionItemContext";
const hr = l.forwardRef(
  (
    {
      as: e = "div",
      bsPrefix: t,
      className: n,
      onEnter: r,
      onEntering: o,
      onEntered: a,
      onExit: s,
      onExiting: i,
      onExited: c,
      ...u
    },
    d,
  ) => {
    t = N(t, "accordion-body");
    const { eventKey: f } = l.useContext(Rt);
    return p.jsx(Zt, {
      eventKey: f,
      onEnter: r,
      onEntering: o,
      onEntered: a,
      onExit: s,
      onExiting: i,
      onExited: c,
      children: p.jsx(e, { ref: d, ...u, className: O(n, t) }),
    });
  },
);
hr.displayName = "AccordionBody";
function pa(e, t) {
  const { activeEventKey: n, onSelect: r, alwaysOpen: o } = l.useContext(at);
  return (a) => {
    let s = e === n ? null : e;
    o &&
      (Array.isArray(n)
        ? n.includes(e)
          ? (s = n.filter((i) => i !== e))
          : (s = [...n, e])
        : (s = [e])),
      r == null || r(s, a),
      t == null || t(a);
  };
}
const Jt = l.forwardRef(({ as: e = "button", bsPrefix: t, className: n, onClick: r, ...o }, a) => {
  t = N(t, "accordion-button");
  const { eventKey: s } = l.useContext(Rt),
    i = pa(s, r),
    { activeEventKey: c } = l.useContext(at);
  return (
    e === "button" && (o.type = "button"),
    p.jsx(e, {
      ref: a,
      onClick: i,
      ...o,
      "aria-expanded": Array.isArray(c) ? c.includes(s) : s === c,
      className: O(n, t, !mr(c, s) && "collapsed"),
    })
  );
});
Jt.displayName = "AccordionButton";
const gr = l.forwardRef(
  ({ as: e = "h2", bsPrefix: t, className: n, children: r, onClick: o, ...a }, s) => (
    (t = N(t, "accordion-header")),
    p.jsx(e, { ref: s, ...a, className: O(n, t), children: p.jsx(Jt, { onClick: o, children: r }) })
  ),
);
gr.displayName = "AccordionHeader";
const yr = l.forwardRef(({ as: e = "div", bsPrefix: t, className: n, eventKey: r, ...o }, a) => {
  t = N(t, "accordion-item");
  const s = l.useMemo(() => ({ eventKey: r }), [r]);
  return p.jsx(Rt.Provider, { value: s, children: p.jsx(e, { ref: a, ...o, className: O(n, t) }) });
});
yr.displayName = "AccordionItem";
const wr = l.forwardRef((e, t) => {
  const {
      as: n = "div",
      activeKey: r,
      bsPrefix: o,
      className: a,
      onSelect: s,
      flush: i,
      alwaysOpen: c,
      ...u
    } = zt(e, { activeKey: "onSelect" }),
    d = N(o, "accordion"),
    f = l.useMemo(() => ({ activeEventKey: r, onSelect: s, alwaysOpen: c }), [r, s, c]);
  return p.jsx(at.Provider, {
    value: f,
    children: p.jsx(n, { ref: t, ...u, className: O(a, d, i && `${d}-flush`) }),
  });
});
wr.displayName = "Accordion";
const ll = Object.assign(wr, { Button: Jt, Collapse: Zt, Item: yr, Header: gr, Body: hr });
function va(e) {
  const t = l.useRef(e);
  return (
    l.useEffect(() => {
      t.current = e;
    }, [e]),
    t
  );
}
function H(e) {
  const t = va(e);
  return l.useCallback(
    function (...n) {
      return t.current && t.current(...n);
    },
    [t],
  );
}
const Qt = (e) =>
  l.forwardRef((t, n) => p.jsx("div", { ...t, ref: n, className: O(t.className, e) }));
function wt() {
  return l.useState(null);
}
function ma(e, t, n, r = !1) {
  const o = H(n);
  l.useEffect(() => {
    const a = typeof e == "function" ? e() : e;
    return a.addEventListener(t, o, r), () => a.removeEventListener(t, o, r);
  }, [e]);
}
function en() {
  const e = l.useRef(!0),
    t = l.useRef(() => e.current);
  return (
    l.useEffect(
      () => (
        (e.current = !0),
        () => {
          e.current = !1;
        }
      ),
      [],
    ),
    t.current
  );
}
function xr(e) {
  const t = l.useRef(null);
  return (
    l.useEffect(() => {
      t.current = e;
    }),
    t.current
  );
}
const ha = typeof global < "u" && global.navigator && global.navigator.product === "ReactNative",
  ga = typeof document < "u",
  xt = ga || ha ? l.useLayoutEffect : l.useEffect,
  ya = ["as", "disabled"];
function wa(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function xa(e) {
  return !e || e.trim() === "#";
}
function tn({
  tagName: e,
  disabled: t,
  href: n,
  target: r,
  rel: o,
  role: a,
  onClick: s,
  tabIndex: i = 0,
  type: c,
}) {
  e || (n != null || r != null || o != null ? (e = "a") : (e = "button"));
  const u = { tagName: e };
  if (e === "button") return [{ type: c || "button", disabled: t }, u];
  const d = (v) => {
      if (((t || (e === "a" && xa(n))) && v.preventDefault(), t)) {
        v.stopPropagation();
        return;
      }
      s == null || s(v);
    },
    f = (v) => {
      v.key === " " && (v.preventDefault(), d(v));
    };
  return (
    e === "a" && (n || (n = "#"), t && (n = void 0)),
    [
      {
        role: a ?? "button",
        disabled: void 0,
        tabIndex: t ? void 0 : i,
        href: n,
        target: e === "a" ? r : void 0,
        "aria-disabled": t || void 0,
        rel: e === "a" ? o : void 0,
        onClick: d,
        onKeyDown: f,
      },
      u,
    ]
  );
}
const nn = l.forwardRef((e, t) => {
  let { as: n, disabled: r } = e,
    o = wa(e, ya);
  const [a, { tagName: s }] = tn(Object.assign({ tagName: n, disabled: r }, o));
  return p.jsx(s, Object.assign({}, o, a, { ref: t }));
});
nn.displayName = "Button";
const ba = ["onKeyDown"];
function Ca(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Ea(e) {
  return !e || e.trim() === "#";
}
const rn = l.forwardRef((e, t) => {
  let { onKeyDown: n } = e,
    r = Ca(e, ba);
  const [o] = tn(Object.assign({ tagName: "a" }, r)),
    a = H((s) => {
      o.onKeyDown(s), n == null || n(s);
    });
  return Ea(r.href) || r.role === "button"
    ? p.jsx("a", Object.assign({ ref: t }, r, o, { onKeyDown: a }))
    : p.jsx("a", Object.assign({ ref: t }, r, { onKeyDown: n }));
});
rn.displayName = "Anchor";
const Oa = { [fe]: "show", [$e]: "show" },
  Qe = l.forwardRef(
    ({ className: e, children: t, transitionClasses: n = {}, onEnter: r, ...o }, a) => {
      const s = { in: !1, timeout: 300, mountOnEnter: !1, unmountOnExit: !1, appear: !1, ...o },
        i = l.useCallback(
          (c, u) => {
            pr(c), r == null || r(c, u);
          },
          [r],
        );
      return p.jsx(vr, {
        ref: a,
        addEndListener: fr,
        ...s,
        onEnter: i,
        childRef: t.ref,
        children: (c, u) =>
          l.cloneElement(t, { ...u, className: O("fade", e, t.props.className, Oa[c], n[c]) }),
      });
    },
  );
Qe.displayName = "Fade";
const Ra = { "aria-label": M.string, onClick: M.func, variant: M.oneOf(["white"]) },
  on = l.forwardRef(({ className: e, variant: t, "aria-label": n = "Close", ...r }, o) =>
    p.jsx("button", {
      ref: o,
      type: "button",
      className: O("btn-close", t && `btn-close-${t}`, e),
      "aria-label": n,
      ...r,
    }),
  );
on.displayName = "CloseButton";
on.propTypes = Ra;
const $a = l.forwardRef(
  (
    { bsPrefix: e, bg: t = "primary", pill: n = !1, text: r, className: o, as: a = "span", ...s },
    i,
  ) => {
    const c = N(e, "badge");
    return p.jsx(a, {
      ref: i,
      ...s,
      className: O(o, c, n && "rounded-pill", r && `text-${r}`, t && `bg-${t}`),
    });
  },
);
$a.displayName = "Badge";
const an = l.forwardRef(
  (
    {
      as: e,
      bsPrefix: t,
      variant: n = "primary",
      size: r,
      active: o = !1,
      disabled: a = !1,
      className: s,
      ...i
    },
    c,
  ) => {
    const u = N(t, "btn"),
      [d, { tagName: f }] = tn({ tagName: e, disabled: a, ...i }),
      v = f;
    return p.jsx(v, {
      ...d,
      ...i,
      ref: c,
      disabled: a,
      className: O(
        s,
        u,
        o && "active",
        n && `${u}-${n}`,
        r && `${u}-${r}`,
        i.href && a && "disabled",
      ),
    });
  },
);
an.displayName = "Button";
const br = l.forwardRef(
  (
    {
      bsPrefix: e,
      size: t,
      vertical: n = !1,
      className: r,
      role: o = "group",
      as: a = "div",
      ...s
    },
    i,
  ) => {
    const c = N(e, "btn-group");
    let u = c;
    return (
      n && (u = `${c}-vertical`),
      p.jsx(a, { ...s, ref: i, role: o, className: O(r, u, t && `${c}-${t}`) })
    );
  },
);
br.displayName = "ButtonGroup";
const Na = l.forwardRef(({ bsPrefix: e, className: t, role: n = "toolbar", ...r }, o) => {
  const a = N(e, "btn-toolbar");
  return p.jsx("div", { ...r, ref: o, className: O(t, a), role: n });
});
Na.displayName = "ButtonToolbar";
const sn = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "card-body")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
sn.displayName = "CardBody";
const Cr = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "card-footer")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
Cr.displayName = "CardFooter";
const ln = l.createContext(null);
ln.displayName = "CardHeaderContext";
const Er = l.forwardRef(({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
  const a = N(e, "card-header"),
    s = l.useMemo(() => ({ cardHeaderBsPrefix: a }), [a]);
  return p.jsx(ln.Provider, { value: s, children: p.jsx(n, { ref: o, ...r, className: O(t, a) }) });
});
Er.displayName = "CardHeader";
const Or = l.forwardRef(({ bsPrefix: e, className: t, variant: n, as: r = "img", ...o }, a) => {
  const s = N(e, "card-img");
  return p.jsx(r, { ref: a, className: O(n ? `${s}-${n}` : s, t), ...o });
});
Or.displayName = "CardImg";
const Rr = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "card-img-overlay")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
Rr.displayName = "CardImgOverlay";
const $r = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "a", ...r }, o) => (
    (t = N(t, "card-link")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
$r.displayName = "CardLink";
const ja = Qt("h6"),
  Nr = l.forwardRef(
    ({ className: e, bsPrefix: t, as: n = ja, ...r }, o) => (
      (t = N(t, "card-subtitle")), p.jsx(n, { ref: o, className: O(e, t), ...r })
    ),
  );
Nr.displayName = "CardSubtitle";
const jr = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "p", ...r }, o) => (
    (t = N(t, "card-text")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
jr.displayName = "CardText";
const Ta = Qt("h5"),
  Tr = l.forwardRef(
    ({ className: e, bsPrefix: t, as: n = Ta, ...r }, o) => (
      (t = N(t, "card-title")), p.jsx(n, { ref: o, className: O(e, t), ...r })
    ),
  );
Tr.displayName = "CardTitle";
const Sr = l.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      bg: n,
      text: r,
      border: o,
      body: a = !1,
      children: s,
      as: i = "div",
      ...c
    },
    u,
  ) => {
    const d = N(e, "card");
    return p.jsx(i, {
      ref: u,
      ...c,
      className: O(t, d, n && `bg-${n}`, r && `text-${r}`, o && `border-${o}`),
      children: a ? p.jsx(sn, { children: s }) : s,
    });
  },
);
Sr.displayName = "Card";
const cl = Object.assign(Sr, {
  Img: Or,
  Title: Tr,
  Subtitle: Nr,
  Body: sn,
  Link: $r,
  Text: jr,
  Header: Er,
  Footer: Cr,
  ImgOverlay: Rr,
});
function Sa(e) {
  const t = l.useRef(e);
  return (t.current = e), t;
}
function cn(e) {
  const t = Sa(e);
  l.useEffect(() => () => t.current(), []);
}
const Kt = 2 ** 31 - 1;
function kr(e, t, n) {
  const r = n - Date.now();
  e.current = r <= Kt ? setTimeout(t, r) : setTimeout(() => kr(e, t, n), Kt);
}
function ka() {
  const e = en(),
    t = l.useRef();
  return (
    cn(() => clearTimeout(t.current)),
    l.useMemo(() => {
      const n = () => clearTimeout(t.current);
      function r(o, a = 0) {
        e() && (n(), a <= Kt ? (t.current = setTimeout(o, a)) : kr(t, o, Date.now() + a));
      }
      return { set: r, clear: n, handleRef: t };
    }, [])
  );
}
function Da(e, t) {
  let n = 0;
  return l.Children.map(e, (r) => (l.isValidElement(r) ? t(r, n++) : r));
}
function Ma(e, t) {
  return l.Children.toArray(e).some((n) => l.isValidElement(n) && n.type === t);
}
function Aa({ as: e, bsPrefix: t, className: n, ...r }) {
  t = N(t, "col");
  const o = lr(),
    a = cr(),
    s = [],
    i = [];
  return (
    o.forEach((c) => {
      const u = r[c];
      delete r[c];
      let d, f, v;
      typeof u == "object" && u != null ? ({ span: d, offset: f, order: v } = u) : (d = u);
      const m = c !== a ? `-${c}` : "";
      d && s.push(d === !0 ? `${t}${m}` : `${t}${m}-${d}`),
        v != null && i.push(`order${m}-${v}`),
        f != null && i.push(`offset${m}-${f}`);
    }),
    [
      { ...r, className: O(n, ...s, ...i) },
      { as: e, bsPrefix: t, spans: s },
    ]
  );
}
const Dr = l.forwardRef((e, t) => {
  const [{ className: n, ...r }, { as: o = "div", bsPrefix: a, spans: s }] = Aa(e);
  return p.jsx(o, { ...r, ref: t, className: O(n, !s.length && a) });
});
Dr.displayName = "Col";
var Ia = Function.prototype.bind.call(Function.prototype.call, [].slice);
function pe(e, t) {
  return Ia(e.querySelectorAll(t));
}
function Ba(e, t, n) {
  const r = l.useRef(e !== void 0),
    [o, a] = l.useState(t),
    s = e !== void 0,
    i = r.current;
  return (
    (r.current = s),
    !s && i && o !== t && a(t),
    [
      s ? e : o,
      l.useCallback(
        (...c) => {
          const [u, ...d] = c;
          let f = n == null ? void 0 : n(u, ...d);
          return a(u), f;
        },
        [n],
      ),
    ]
  );
}
function Mr() {
  const [, e] = l.useReducer((t) => !t, !1);
  return e;
}
const $t = l.createContext(null);
var An = Object.prototype.hasOwnProperty;
function In(e, t, n) {
  for (n of e.keys()) if (Ye(n, t)) return n;
}
function Ye(e, t) {
  var n, r, o;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length) for (; r-- && Ye(e[r], t[r]); );
      return r === -1;
    }
    if (n === Set) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (((o = r), (o && typeof o == "object" && ((o = In(t, o)), !o)) || !t.has(o))) return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r[0]), (o && typeof o == "object" && ((o = In(t, o)), !o)) || !Ye(r[1], t.get(o)))
        )
          return !1;
      return !0;
    }
    if (n === ArrayBuffer) (e = new Uint8Array(e)), (t = new Uint8Array(t));
    else if (n === DataView) {
      if ((r = e.byteLength) === t.byteLength) for (; r-- && e.getInt8(r) === t.getInt8(r); );
      return r === -1;
    }
    if (ArrayBuffer.isView(e)) {
      if ((r = e.byteLength) === t.byteLength) for (; r-- && e[r] === t[r]; );
      return r === -1;
    }
    if (!n || typeof e == "object") {
      r = 0;
      for (n in e)
        if ((An.call(e, n) && ++r && !An.call(t, n)) || !(n in t) || !Ye(e[n], t[n])) return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
function Fa(e) {
  const t = en();
  return [
    e[0],
    l.useCallback(
      (n) => {
        if (t()) return e[1](n);
      },
      [t, e[1]],
    ),
  ];
}
var Y = "top",
  ee = "bottom",
  te = "right",
  Z = "left",
  un = "auto",
  st = [Y, ee, te, Z],
  Le = "start",
  et = "end",
  La = "clippingParents",
  Ar = "viewport",
  qe = "popper",
  Pa = "reference",
  Bn = st.reduce(function (e, t) {
    return e.concat([t + "-" + Le, t + "-" + et]);
  }, []),
  Ir = [].concat(st, [un]).reduce(function (e, t) {
    return e.concat([t, t + "-" + Le, t + "-" + et]);
  }, []),
  Wa = "beforeRead",
  Ha = "read",
  Ka = "afterRead",
  Ua = "beforeMain",
  Va = "main",
  _a = "afterMain",
  Ga = "beforeWrite",
  Xa = "write",
  qa = "afterWrite",
  za = [Wa, Ha, Ka, Ua, Va, _a, Ga, Xa, qa];
function oe(e) {
  return e.split("-")[0];
}
function J(e) {
  if (e == null) return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function De(e) {
  var t = J(e).Element;
  return e instanceof t || e instanceof Element;
}
function ae(e) {
  var t = J(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function dn(e) {
  if (typeof ShadowRoot > "u") return !1;
  var t = J(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var ke = Math.max,
  bt = Math.min,
  Pe = Math.round;
function Ut() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands)
    ? e.brands
        .map(function (t) {
          return t.brand + "/" + t.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function Br() {
  return !/^((?!chrome|android).)*safari/i.test(Ut());
}
function We(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  var r = e.getBoundingClientRect(),
    o = 1,
    a = 1;
  t &&
    ae(e) &&
    ((o = (e.offsetWidth > 0 && Pe(r.width) / e.offsetWidth) || 1),
    (a = (e.offsetHeight > 0 && Pe(r.height) / e.offsetHeight) || 1));
  var s = De(e) ? J(e) : window,
    i = s.visualViewport,
    c = !Br() && n,
    u = (r.left + (c && i ? i.offsetLeft : 0)) / o,
    d = (r.top + (c && i ? i.offsetTop : 0)) / a,
    f = r.width / o,
    v = r.height / a;
  return { width: f, height: v, top: d, right: u + f, bottom: d + v, left: u, x: u, y: d };
}
function fn(e) {
  var t = We(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function Fr(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && dn(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Ne(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function he(e) {
  return J(e).getComputedStyle(e);
}
function Ya(e) {
  return ["table", "td", "th"].indexOf(Ne(e)) >= 0;
}
function je(e) {
  return ((De(e) ? e.ownerDocument : e.document) || window.document).documentElement;
}
function Nt(e) {
  return Ne(e) === "html" ? e : e.assignedSlot || e.parentNode || (dn(e) ? e.host : null) || je(e);
}
function Fn(e) {
  return !ae(e) || he(e).position === "fixed" ? null : e.offsetParent;
}
function Za(e) {
  var t = /firefox/i.test(Ut()),
    n = /Trident/i.test(Ut());
  if (n && ae(e)) {
    var r = he(e);
    if (r.position === "fixed") return null;
  }
  var o = Nt(e);
  for (dn(o) && (o = o.host); ae(o) && ["html", "body"].indexOf(Ne(o)) < 0; ) {
    var a = he(o);
    if (
      a.transform !== "none" ||
      a.perspective !== "none" ||
      a.contain === "paint" ||
      ["transform", "perspective"].indexOf(a.willChange) !== -1 ||
      (t && a.willChange === "filter") ||
      (t && a.filter && a.filter !== "none")
    )
      return o;
    o = o.parentNode;
  }
  return null;
}
function it(e) {
  for (var t = J(e), n = Fn(e); n && Ya(n) && he(n).position === "static"; ) n = Fn(n);
  return n && (Ne(n) === "html" || (Ne(n) === "body" && he(n).position === "static"))
    ? t
    : n || Za(e) || t;
}
function pn(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function Ze(e, t, n) {
  return ke(e, bt(t, n));
}
function Ja(e, t, n) {
  var r = Ze(e, t, n);
  return r > n ? n : r;
}
function Lr() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function Pr(e) {
  return Object.assign({}, Lr(), e);
}
function Wr(e, t) {
  return t.reduce(function (n, r) {
    return (n[r] = e), n;
  }, {});
}
var Qa = function (t, n) {
  return (
    (t = typeof t == "function" ? t(Object.assign({}, n.rects, { placement: n.placement })) : t),
    Pr(typeof t != "number" ? t : Wr(t, st))
  );
};
function es(e) {
  var t,
    n = e.state,
    r = e.name,
    o = e.options,
    a = n.elements.arrow,
    s = n.modifiersData.popperOffsets,
    i = oe(n.placement),
    c = pn(i),
    u = [Z, te].indexOf(i) >= 0,
    d = u ? "height" : "width";
  if (!(!a || !s)) {
    var f = Qa(o.padding, n),
      v = fn(a),
      m = c === "y" ? Y : Z,
      g = c === "y" ? ee : te,
      y = n.rects.reference[d] + n.rects.reference[c] - s[c] - n.rects.popper[d],
      h = s[c] - n.rects.reference[c],
      E = it(a),
      C = E ? (c === "y" ? E.clientHeight || 0 : E.clientWidth || 0) : 0,
      x = y / 2 - h / 2,
      b = f[m],
      R = C - v[d] - f[g],
      w = C / 2 - v[d] / 2 + x,
      $ = Ze(b, w, R),
      j = c;
    n.modifiersData[r] = ((t = {}), (t[j] = $), (t.centerOffset = $ - w), t);
  }
}
function ts(e) {
  var t = e.state,
    n = e.options,
    r = n.element,
    o = r === void 0 ? "[data-popper-arrow]" : r;
  o != null &&
    ((typeof o == "string" && ((o = t.elements.popper.querySelector(o)), !o)) ||
      (Fr(t.elements.popper, o) && (t.elements.arrow = o)));
}
const ns = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: es,
  effect: ts,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function He(e) {
  return e.split("-")[1];
}
var rs = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function os(e, t) {
  var n = e.x,
    r = e.y,
    o = t.devicePixelRatio || 1;
  return { x: Pe(n * o) / o || 0, y: Pe(r * o) / o || 0 };
}
function Ln(e) {
  var t,
    n = e.popper,
    r = e.popperRect,
    o = e.placement,
    a = e.variation,
    s = e.offsets,
    i = e.position,
    c = e.gpuAcceleration,
    u = e.adaptive,
    d = e.roundOffsets,
    f = e.isFixed,
    v = s.x,
    m = v === void 0 ? 0 : v,
    g = s.y,
    y = g === void 0 ? 0 : g,
    h = typeof d == "function" ? d({ x: m, y }) : { x: m, y };
  (m = h.x), (y = h.y);
  var E = s.hasOwnProperty("x"),
    C = s.hasOwnProperty("y"),
    x = Z,
    b = Y,
    R = window;
  if (u) {
    var w = it(n),
      $ = "clientHeight",
      j = "clientWidth";
    if (
      (w === J(n) &&
        ((w = je(n)),
        he(w).position !== "static" &&
          i === "absolute" &&
          (($ = "scrollHeight"), (j = "scrollWidth"))),
      (w = w),
      o === Y || ((o === Z || o === te) && a === et))
    ) {
      b = ee;
      var A = f && w === R && R.visualViewport ? R.visualViewport.height : w[$];
      (y -= A - r.height), (y *= c ? 1 : -1);
    }
    if (o === Z || ((o === Y || o === ee) && a === et)) {
      x = te;
      var S = f && w === R && R.visualViewport ? R.visualViewport.width : w[j];
      (m -= S - r.width), (m *= c ? 1 : -1);
    }
  }
  var T = Object.assign({ position: i }, u && rs),
    k = d === !0 ? os({ x: m, y }, J(n)) : { x: m, y };
  if (((m = k.x), (y = k.y), c)) {
    var D;
    return Object.assign(
      {},
      T,
      ((D = {}),
      (D[b] = C ? "0" : ""),
      (D[x] = E ? "0" : ""),
      (D.transform =
        (R.devicePixelRatio || 1) <= 1
          ? "translate(" + m + "px, " + y + "px)"
          : "translate3d(" + m + "px, " + y + "px, 0)"),
      D),
    );
  }
  return Object.assign(
    {},
    T,
    ((t = {}), (t[b] = C ? y + "px" : ""), (t[x] = E ? m + "px" : ""), (t.transform = ""), t),
  );
}
function as(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    o = r === void 0 ? !0 : r,
    a = n.adaptive,
    s = a === void 0 ? !0 : a,
    i = n.roundOffsets,
    c = i === void 0 ? !0 : i,
    u = {
      placement: oe(t.placement),
      variation: He(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
      isFixed: t.options.strategy === "fixed",
    };
  t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      Ln(
        Object.assign({}, u, {
          offsets: t.modifiersData.popperOffsets,
          position: t.options.strategy,
          adaptive: s,
          roundOffsets: c,
        }),
      ),
    )),
    t.modifiersData.arrow != null &&
      (t.styles.arrow = Object.assign(
        {},
        t.styles.arrow,
        Ln(
          Object.assign({}, u, {
            offsets: t.modifiersData.arrow,
            position: "absolute",
            adaptive: !1,
            roundOffsets: c,
          }),
        ),
      )),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-placement": t.placement,
    }));
}
const ss = { name: "computeStyles", enabled: !0, phase: "beforeWrite", fn: as, data: {} };
var pt = { passive: !0 };
function is(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    o = r.scroll,
    a = o === void 0 ? !0 : o,
    s = r.resize,
    i = s === void 0 ? !0 : s,
    c = J(t.elements.popper),
    u = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    a &&
      u.forEach(function (d) {
        d.addEventListener("scroll", n.update, pt);
      }),
    i && c.addEventListener("resize", n.update, pt),
    function () {
      a &&
        u.forEach(function (d) {
          d.removeEventListener("scroll", n.update, pt);
        }),
        i && c.removeEventListener("resize", n.update, pt);
    }
  );
}
const ls = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: is,
  data: {},
};
var cs = { left: "right", right: "left", bottom: "top", top: "bottom" };
function mt(e) {
  return e.replace(/left|right|bottom|top/g, function (t) {
    return cs[t];
  });
}
var us = { start: "end", end: "start" };
function Pn(e) {
  return e.replace(/start|end/g, function (t) {
    return us[t];
  });
}
function vn(e) {
  var t = J(e),
    n = t.pageXOffset,
    r = t.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function mn(e) {
  return We(je(e)).left + vn(e).scrollLeft;
}
function ds(e, t) {
  var n = J(e),
    r = je(e),
    o = n.visualViewport,
    a = r.clientWidth,
    s = r.clientHeight,
    i = 0,
    c = 0;
  if (o) {
    (a = o.width), (s = o.height);
    var u = Br();
    (u || (!u && t === "fixed")) && ((i = o.offsetLeft), (c = o.offsetTop));
  }
  return { width: a, height: s, x: i + mn(e), y: c };
}
function fs(e) {
  var t,
    n = je(e),
    r = vn(e),
    o = (t = e.ownerDocument) == null ? void 0 : t.body,
    a = ke(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0),
    s = ke(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0),
    i = -r.scrollLeft + mn(e),
    c = -r.scrollTop;
  return (
    he(o || n).direction === "rtl" && (i += ke(n.clientWidth, o ? o.clientWidth : 0) - a),
    { width: a, height: s, x: i, y: c }
  );
}
function hn(e) {
  var t = he(e),
    n = t.overflow,
    r = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function Hr(e) {
  return ["html", "body", "#document"].indexOf(Ne(e)) >= 0
    ? e.ownerDocument.body
    : ae(e) && hn(e)
      ? e
      : Hr(Nt(e));
}
function Je(e, t) {
  var n;
  t === void 0 && (t = []);
  var r = Hr(e),
    o = r === ((n = e.ownerDocument) == null ? void 0 : n.body),
    a = J(r),
    s = o ? [a].concat(a.visualViewport || [], hn(r) ? r : []) : r,
    i = t.concat(s);
  return o ? i : i.concat(Je(Nt(s)));
}
function Vt(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function ps(e, t) {
  var n = We(e, !1, t === "fixed");
  return (
    (n.top = n.top + e.clientTop),
    (n.left = n.left + e.clientLeft),
    (n.bottom = n.top + e.clientHeight),
    (n.right = n.left + e.clientWidth),
    (n.width = e.clientWidth),
    (n.height = e.clientHeight),
    (n.x = n.left),
    (n.y = n.top),
    n
  );
}
function Wn(e, t, n) {
  return t === Ar ? Vt(ds(e, n)) : De(t) ? ps(t, n) : Vt(fs(je(e)));
}
function vs(e) {
  var t = Je(Nt(e)),
    n = ["absolute", "fixed"].indexOf(he(e).position) >= 0,
    r = n && ae(e) ? it(e) : e;
  return De(r)
    ? t.filter(function (o) {
        return De(o) && Fr(o, r) && Ne(o) !== "body";
      })
    : [];
}
function ms(e, t, n, r) {
  var o = t === "clippingParents" ? vs(e) : [].concat(t),
    a = [].concat(o, [n]),
    s = a[0],
    i = a.reduce(
      function (c, u) {
        var d = Wn(e, u, r);
        return (
          (c.top = ke(d.top, c.top)),
          (c.right = bt(d.right, c.right)),
          (c.bottom = bt(d.bottom, c.bottom)),
          (c.left = ke(d.left, c.left)),
          c
        );
      },
      Wn(e, s, r),
    );
  return (
    (i.width = i.right - i.left), (i.height = i.bottom - i.top), (i.x = i.left), (i.y = i.top), i
  );
}
function Kr(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    o = r ? oe(r) : null,
    a = r ? He(r) : null,
    s = t.x + t.width / 2 - n.width / 2,
    i = t.y + t.height / 2 - n.height / 2,
    c;
  switch (o) {
    case Y:
      c = { x: s, y: t.y - n.height };
      break;
    case ee:
      c = { x: s, y: t.y + t.height };
      break;
    case te:
      c = { x: t.x + t.width, y: i };
      break;
    case Z:
      c = { x: t.x - n.width, y: i };
      break;
    default:
      c = { x: t.x, y: t.y };
  }
  var u = o ? pn(o) : null;
  if (u != null) {
    var d = u === "y" ? "height" : "width";
    switch (a) {
      case Le:
        c[u] = c[u] - (t[d] / 2 - n[d] / 2);
        break;
      case et:
        c[u] = c[u] + (t[d] / 2 - n[d] / 2);
        break;
    }
  }
  return c;
}
function tt(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = r === void 0 ? e.placement : r,
    a = n.strategy,
    s = a === void 0 ? e.strategy : a,
    i = n.boundary,
    c = i === void 0 ? La : i,
    u = n.rootBoundary,
    d = u === void 0 ? Ar : u,
    f = n.elementContext,
    v = f === void 0 ? qe : f,
    m = n.altBoundary,
    g = m === void 0 ? !1 : m,
    y = n.padding,
    h = y === void 0 ? 0 : y,
    E = Pr(typeof h != "number" ? h : Wr(h, st)),
    C = v === qe ? Pa : qe,
    x = e.rects.popper,
    b = e.elements[g ? C : v],
    R = ms(De(b) ? b : b.contextElement || je(e.elements.popper), c, d, s),
    w = We(e.elements.reference),
    $ = Kr({ reference: w, element: x, placement: o }),
    j = Vt(Object.assign({}, x, $)),
    A = v === qe ? j : w,
    S = {
      top: R.top - A.top + E.top,
      bottom: A.bottom - R.bottom + E.bottom,
      left: R.left - A.left + E.left,
      right: A.right - R.right + E.right,
    },
    T = e.modifiersData.offset;
  if (v === qe && T) {
    var k = T[o];
    Object.keys(S).forEach(function (D) {
      var B = [te, ee].indexOf(D) >= 0 ? 1 : -1,
        F = [Y, ee].indexOf(D) >= 0 ? "y" : "x";
      S[D] += k[F] * B;
    });
  }
  return S;
}
function hs(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = n.boundary,
    a = n.rootBoundary,
    s = n.padding,
    i = n.flipVariations,
    c = n.allowedAutoPlacements,
    u = c === void 0 ? Ir : c,
    d = He(r),
    f = d
      ? i
        ? Bn
        : Bn.filter(function (g) {
            return He(g) === d;
          })
      : st,
    v = f.filter(function (g) {
      return u.indexOf(g) >= 0;
    });
  v.length === 0 && (v = f);
  var m = v.reduce(function (g, y) {
    return (g[y] = tt(e, { placement: y, boundary: o, rootBoundary: a, padding: s })[oe(y)]), g;
  }, {});
  return Object.keys(m).sort(function (g, y) {
    return m[g] - m[y];
  });
}
function gs(e) {
  if (oe(e) === un) return [];
  var t = mt(e);
  return [Pn(e), t, Pn(t)];
}
function ys(e) {
  var t = e.state,
    n = e.options,
    r = e.name;
  if (!t.modifiersData[r]._skip) {
    for (
      var o = n.mainAxis,
        a = o === void 0 ? !0 : o,
        s = n.altAxis,
        i = s === void 0 ? !0 : s,
        c = n.fallbackPlacements,
        u = n.padding,
        d = n.boundary,
        f = n.rootBoundary,
        v = n.altBoundary,
        m = n.flipVariations,
        g = m === void 0 ? !0 : m,
        y = n.allowedAutoPlacements,
        h = t.options.placement,
        E = oe(h),
        C = E === h,
        x = c || (C || !g ? [mt(h)] : gs(h)),
        b = [h].concat(x).reduce(function (X, z) {
          return X.concat(
            oe(z) === un
              ? hs(t, {
                  placement: z,
                  boundary: d,
                  rootBoundary: f,
                  padding: u,
                  flipVariations: g,
                  allowedAutoPlacements: y,
                })
              : z,
          );
        }, []),
        R = t.rects.reference,
        w = t.rects.popper,
        $ = new Map(),
        j = !0,
        A = b[0],
        S = 0;
      S < b.length;
      S++
    ) {
      var T = b[S],
        k = oe(T),
        D = He(T) === Le,
        B = [Y, ee].indexOf(k) >= 0,
        F = B ? "width" : "height",
        P = tt(t, { placement: T, boundary: d, rootBoundary: f, altBoundary: v, padding: u }),
        U = B ? (D ? te : Z) : D ? ee : Y;
      R[F] > w[F] && (U = mt(U));
      var W = mt(U),
        _ = [];
      if (
        (a && _.push(P[k] <= 0),
        i && _.push(P[U] <= 0, P[W] <= 0),
        _.every(function (X) {
          return X;
        }))
      ) {
        (A = T), (j = !1);
        break;
      }
      $.set(T, _);
    }
    if (j)
      for (
        var K = g ? 3 : 1,
          q = function (z) {
            var ie = b.find(function (le) {
              var ne = $.get(le);
              if (ne)
                return ne.slice(0, z).every(function (ce) {
                  return ce;
                });
            });
            if (ie) return (A = ie), "break";
          },
          Q = K;
        Q > 0;
        Q--
      ) {
        var G = q(Q);
        if (G === "break") break;
      }
    t.placement !== A && ((t.modifiersData[r]._skip = !0), (t.placement = A), (t.reset = !0));
  }
}
const ws = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: ys,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function Hn(e, t, n) {
  return (
    n === void 0 && (n = { x: 0, y: 0 }),
    {
      top: e.top - t.height - n.y,
      right: e.right - t.width + n.x,
      bottom: e.bottom - t.height + n.y,
      left: e.left - t.width - n.x,
    }
  );
}
function Kn(e) {
  return [Y, te, ee, Z].some(function (t) {
    return e[t] >= 0;
  });
}
function xs(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    o = t.rects.popper,
    a = t.modifiersData.preventOverflow,
    s = tt(t, { elementContext: "reference" }),
    i = tt(t, { altBoundary: !0 }),
    c = Hn(s, r),
    u = Hn(i, o, a),
    d = Kn(c),
    f = Kn(u);
  (t.modifiersData[n] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: u,
    isReferenceHidden: d,
    hasPopperEscaped: f,
  }),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-reference-hidden": d,
      "data-popper-escaped": f,
    }));
}
const bs = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: xs,
};
function Cs(e, t, n) {
  var r = oe(e),
    o = [Z, Y].indexOf(r) >= 0 ? -1 : 1,
    a = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n,
    s = a[0],
    i = a[1];
  return (
    (s = s || 0), (i = (i || 0) * o), [Z, te].indexOf(r) >= 0 ? { x: i, y: s } : { x: s, y: i }
  );
}
function Es(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.offset,
    a = o === void 0 ? [0, 0] : o,
    s = Ir.reduce(function (d, f) {
      return (d[f] = Cs(f, t.rects, a)), d;
    }, {}),
    i = s[t.placement],
    c = i.x,
    u = i.y;
  t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += c), (t.modifiersData.popperOffsets.y += u)),
    (t.modifiersData[r] = s);
}
const Os = { name: "offset", enabled: !0, phase: "main", requires: ["popperOffsets"], fn: Es };
function Rs(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = Kr({
    reference: t.rects.reference,
    element: t.rects.popper,
    placement: t.placement,
  });
}
const $s = { name: "popperOffsets", enabled: !0, phase: "read", fn: Rs, data: {} };
function Ns(e) {
  return e === "x" ? "y" : "x";
}
function js(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.mainAxis,
    a = o === void 0 ? !0 : o,
    s = n.altAxis,
    i = s === void 0 ? !1 : s,
    c = n.boundary,
    u = n.rootBoundary,
    d = n.altBoundary,
    f = n.padding,
    v = n.tether,
    m = v === void 0 ? !0 : v,
    g = n.tetherOffset,
    y = g === void 0 ? 0 : g,
    h = tt(t, { boundary: c, rootBoundary: u, padding: f, altBoundary: d }),
    E = oe(t.placement),
    C = He(t.placement),
    x = !C,
    b = pn(E),
    R = Ns(b),
    w = t.modifiersData.popperOffsets,
    $ = t.rects.reference,
    j = t.rects.popper,
    A = typeof y == "function" ? y(Object.assign({}, t.rects, { placement: t.placement })) : y,
    S =
      typeof A == "number"
        ? { mainAxis: A, altAxis: A }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, A),
    T = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    k = { x: 0, y: 0 };
  if (w) {
    if (a) {
      var D,
        B = b === "y" ? Y : Z,
        F = b === "y" ? ee : te,
        P = b === "y" ? "height" : "width",
        U = w[b],
        W = U + h[B],
        _ = U - h[F],
        K = m ? -j[P] / 2 : 0,
        q = C === Le ? $[P] : j[P],
        Q = C === Le ? -j[P] : -$[P],
        G = t.elements.arrow,
        X = m && G ? fn(G) : { width: 0, height: 0 },
        z = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : Lr(),
        ie = z[B],
        le = z[F],
        ne = Ze(0, $[P], X[P]),
        ce = x ? $[P] / 2 - K - ne - ie - S.mainAxis : q - ne - ie - S.mainAxis,
        we = x ? -$[P] / 2 + K + ne + le + S.mainAxis : Q + ne + le + S.mainAxis,
        xe = t.elements.arrow && it(t.elements.arrow),
        be = xe ? (b === "y" ? xe.clientTop || 0 : xe.clientLeft || 0) : 0,
        Ce = (D = T == null ? void 0 : T[b]) != null ? D : 0,
        Ee = U + ce - Ce - be,
        L = U + we - Ce,
        Te = Ze(m ? bt(W, Ee) : W, U, m ? ke(_, L) : _);
      (w[b] = Te), (k[b] = Te - U);
    }
    if (i) {
      var Oe,
        kt = b === "x" ? Y : Z,
        Dt = b === "x" ? ee : te,
        ue = w[R],
        Me = R === "y" ? "height" : "width",
        ct = ue + h[kt],
        ut = ue - h[Dt],
        Ae = [Y, Z].indexOf(E) !== -1,
        dt = (Oe = T == null ? void 0 : T[R]) != null ? Oe : 0,
        I = Ae ? ct : ue - $[Me] - j[Me] - dt + S.altAxis,
        de = Ae ? ue + $[Me] + j[Me] - dt - S.altAxis : ut,
        Ge = m && Ae ? Ja(I, ue, de) : Ze(m ? I : ct, ue, m ? de : ut);
      (w[R] = Ge), (k[R] = Ge - ue);
    }
    t.modifiersData[r] = k;
  }
}
const Ts = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: js,
  requiresIfExists: ["offset"],
};
function Ss(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function ks(e) {
  return e === J(e) || !ae(e) ? vn(e) : Ss(e);
}
function Ds(e) {
  var t = e.getBoundingClientRect(),
    n = Pe(t.width) / e.offsetWidth || 1,
    r = Pe(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function Ms(e, t, n) {
  n === void 0 && (n = !1);
  var r = ae(t),
    o = ae(t) && Ds(t),
    a = je(t),
    s = We(e, o, n),
    i = { scrollLeft: 0, scrollTop: 0 },
    c = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((Ne(t) !== "body" || hn(a)) && (i = ks(t)),
      ae(t) ? ((c = We(t, !0)), (c.x += t.clientLeft), (c.y += t.clientTop)) : a && (c.x = mn(a))),
    {
      x: s.left + i.scrollLeft - c.x,
      y: s.top + i.scrollTop - c.y,
      width: s.width,
      height: s.height,
    }
  );
}
function As(e) {
  var t = new Map(),
    n = new Set(),
    r = [];
  e.forEach(function (a) {
    t.set(a.name, a);
  });
  function o(a) {
    n.add(a.name);
    var s = [].concat(a.requires || [], a.requiresIfExists || []);
    s.forEach(function (i) {
      if (!n.has(i)) {
        var c = t.get(i);
        c && o(c);
      }
    }),
      r.push(a);
  }
  return (
    e.forEach(function (a) {
      n.has(a.name) || o(a);
    }),
    r
  );
}
function Is(e) {
  var t = As(e);
  return za.reduce(function (n, r) {
    return n.concat(
      t.filter(function (o) {
        return o.phase === r;
      }),
    );
  }, []);
}
function Bs(e) {
  var t;
  return function () {
    return (
      t ||
        (t = new Promise(function (n) {
          Promise.resolve().then(function () {
            (t = void 0), n(e());
          });
        })),
      t
    );
  };
}
function Fs(e) {
  var t = e.reduce(function (n, r) {
    var o = n[r.name];
    return (
      (n[r.name] = o
        ? Object.assign({}, o, r, {
            options: Object.assign({}, o.options, r.options),
            data: Object.assign({}, o.data, r.data),
          })
        : r),
      n
    );
  }, {});
  return Object.keys(t).map(function (n) {
    return t[n];
  });
}
var Un = { placement: "bottom", modifiers: [], strategy: "absolute" };
function Vn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
  return !t.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function Ls(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    o = t.defaultOptions,
    a = o === void 0 ? Un : o;
  return function (i, c, u) {
    u === void 0 && (u = a);
    var d = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, Un, a),
        modifiersData: {},
        elements: { reference: i, popper: c },
        attributes: {},
        styles: {},
      },
      f = [],
      v = !1,
      m = {
        state: d,
        setOptions: function (E) {
          var C = typeof E == "function" ? E(d.options) : E;
          y(),
            (d.options = Object.assign({}, a, d.options, C)),
            (d.scrollParents = {
              reference: De(i) ? Je(i) : i.contextElement ? Je(i.contextElement) : [],
              popper: Je(c),
            });
          var x = Is(Fs([].concat(r, d.options.modifiers)));
          return (
            (d.orderedModifiers = x.filter(function (b) {
              return b.enabled;
            })),
            g(),
            m.update()
          );
        },
        forceUpdate: function () {
          if (!v) {
            var E = d.elements,
              C = E.reference,
              x = E.popper;
            if (Vn(C, x)) {
              (d.rects = {
                reference: Ms(C, it(x), d.options.strategy === "fixed"),
                popper: fn(x),
              }),
                (d.reset = !1),
                (d.placement = d.options.placement),
                d.orderedModifiers.forEach(function (S) {
                  return (d.modifiersData[S.name] = Object.assign({}, S.data));
                });
              for (var b = 0; b < d.orderedModifiers.length; b++) {
                if (d.reset === !0) {
                  (d.reset = !1), (b = -1);
                  continue;
                }
                var R = d.orderedModifiers[b],
                  w = R.fn,
                  $ = R.options,
                  j = $ === void 0 ? {} : $,
                  A = R.name;
                typeof w == "function" &&
                  (d = w({ state: d, options: j, name: A, instance: m }) || d);
              }
            }
          }
        },
        update: Bs(function () {
          return new Promise(function (h) {
            m.forceUpdate(), h(d);
          });
        }),
        destroy: function () {
          y(), (v = !0);
        },
      };
    if (!Vn(i, c)) return m;
    m.setOptions(u).then(function (h) {
      !v && u.onFirstUpdate && u.onFirstUpdate(h);
    });
    function g() {
      d.orderedModifiers.forEach(function (h) {
        var E = h.name,
          C = h.options,
          x = C === void 0 ? {} : C,
          b = h.effect;
        if (typeof b == "function") {
          var R = b({ state: d, name: E, instance: m, options: x }),
            w = function () {};
          f.push(R || w);
        }
      });
    }
    function y() {
      f.forEach(function (h) {
        return h();
      }),
        (f = []);
    }
    return m;
  };
}
const Ps = Ls({ defaultModifiers: [bs, $s, ss, ls, Os, ws, Ts, ns] }),
  Ws = ["enabled", "placement", "strategy", "modifiers"];
function Hs(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const Ks = { name: "applyStyles", enabled: !1, phase: "afterWrite", fn: () => {} },
  Us = {
    name: "ariaDescribedBy",
    enabled: !0,
    phase: "afterWrite",
    effect:
      ({ state: e }) =>
      () => {
        const { reference: t, popper: n } = e.elements;
        if ("removeAttribute" in t) {
          const r = (t.getAttribute("aria-describedby") || "")
            .split(",")
            .filter((o) => o.trim() !== n.id);
          r.length
            ? t.setAttribute("aria-describedby", r.join(","))
            : t.removeAttribute("aria-describedby");
        }
      },
    fn: ({ state: e }) => {
      var t;
      const { popper: n, reference: r } = e.elements,
        o = (t = n.getAttribute("role")) == null ? void 0 : t.toLowerCase();
      if (n.id && o === "tooltip" && "setAttribute" in r) {
        const a = r.getAttribute("aria-describedby");
        if (a && a.split(",").indexOf(n.id) !== -1) return;
        r.setAttribute("aria-describedby", a ? `${a},${n.id}` : n.id);
      }
    },
  },
  Vs = [];
function Ur(e, t, n = {}) {
  let { enabled: r = !0, placement: o = "bottom", strategy: a = "absolute", modifiers: s = Vs } = n,
    i = Hs(n, Ws);
  const c = l.useRef(s),
    u = l.useRef(),
    d = l.useCallback(() => {
      var h;
      (h = u.current) == null || h.update();
    }, []),
    f = l.useCallback(() => {
      var h;
      (h = u.current) == null || h.forceUpdate();
    }, []),
    [v, m] = Fa(
      l.useState({
        placement: o,
        update: d,
        forceUpdate: f,
        attributes: {},
        styles: { popper: {}, arrow: {} },
      }),
    ),
    g = l.useMemo(
      () => ({
        name: "updateStateModifier",
        enabled: !0,
        phase: "write",
        requires: ["computeStyles"],
        fn: ({ state: h }) => {
          const E = {},
            C = {};
          Object.keys(h.elements).forEach((x) => {
            (E[x] = h.styles[x]), (C[x] = h.attributes[x]);
          }),
            m({
              state: h,
              styles: E,
              attributes: C,
              update: d,
              forceUpdate: f,
              placement: h.placement,
            });
        },
      }),
      [d, f, m],
    ),
    y = l.useMemo(() => (Ye(c.current, s) || (c.current = s), c.current), [s]);
  return (
    l.useEffect(() => {
      !u.current ||
        !r ||
        u.current.setOptions({ placement: o, strategy: a, modifiers: [...y, g, Ks] });
    }, [a, o, g, r, y]),
    l.useEffect(() => {
      if (!(!r || e == null || t == null))
        return (
          (u.current = Ps(
            e,
            t,
            Object.assign({}, i, { placement: o, strategy: a, modifiers: [...y, Us, g] }),
          )),
          () => {
            u.current != null &&
              (u.current.destroy(),
              (u.current = void 0),
              m((h) => Object.assign({}, h, { attributes: {}, styles: { popper: {} } })));
          }
        );
    }, [r, e, t]),
    v
  );
}
function nt(e, t) {
  if (e.contains) return e.contains(t);
  if (e.compareDocumentPosition) return e === t || !!(e.compareDocumentPosition(t) & 16);
}
var _s = function () {},
  Gs = _s;
const Xs = or(Gs),
  _n = () => {};
function qs(e) {
  return e.button === 0;
}
function zs(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const ht = (e) => e && ("current" in e ? e.current : e),
  Gn = { click: "mousedown", mouseup: "mousedown", pointerup: "pointerdown" };
function Vr(e, t = _n, { disabled: n, clickTrigger: r = "click" } = {}) {
  const o = l.useRef(!1),
    a = l.useRef(!1),
    s = l.useCallback(
      (u) => {
        const d = ht(e);
        Xs(
          !!d,
          "ClickOutside captured a close event but does not have a ref to compare it to. useClickOutside(), should be passed a ref that resolves to a DOM node",
        ),
          (o.current = !d || zs(u) || !qs(u) || !!nt(d, u.target) || a.current),
          (a.current = !1);
      },
      [e],
    ),
    i = H((u) => {
      const d = ht(e);
      d && nt(d, u.target) && (a.current = !0);
    }),
    c = H((u) => {
      o.current || t(u);
    });
  l.useEffect(() => {
    var u, d;
    if (n || e == null) return;
    const f = Ue(ht(e)),
      v = f.defaultView || window;
    let m = (u = v.event) != null ? u : (d = v.parent) == null ? void 0 : d.event,
      g = null;
    Gn[r] && (g = ve(f, Gn[r], i, !0));
    const y = ve(f, r, s, !0),
      h = ve(f, r, (C) => {
        if (C === m) {
          m = void 0;
          return;
        }
        c(C);
      });
    let E = [];
    return (
      "ontouchstart" in f.documentElement &&
        (E = [].slice.call(f.body.children).map((C) => ve(C, "mousemove", _n))),
      () => {
        g == null || g(), y(), h(), E.forEach((C) => C());
      }
    );
  }, [e, n, r, s, i, c]);
}
function Ys(e) {
  const t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach((n) => {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function Zs(e = {}) {
  return Array.isArray(e) ? e : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
}
function _r({
  enabled: e,
  enableEvents: t,
  placement: n,
  flip: r,
  offset: o,
  fixed: a,
  containerPadding: s,
  arrowElement: i,
  popperConfig: c = {},
}) {
  var u, d, f, v, m;
  const g = Ys(c.modifiers);
  return Object.assign({}, c, {
    placement: n,
    enabled: e,
    strategy: a ? "fixed" : c.strategy,
    modifiers: Zs(
      Object.assign({}, g, {
        eventListeners: {
          enabled: t,
          options: (u = g.eventListeners) == null ? void 0 : u.options,
        },
        preventOverflow: Object.assign({}, g.preventOverflow, {
          options: s
            ? Object.assign({ padding: s }, (d = g.preventOverflow) == null ? void 0 : d.options)
            : (f = g.preventOverflow) == null
              ? void 0
              : f.options,
        }),
        offset: {
          options: Object.assign({ offset: o }, (v = g.offset) == null ? void 0 : v.options),
        },
        arrow: Object.assign({}, g.arrow, {
          enabled: !!i,
          options: Object.assign({}, (m = g.arrow) == null ? void 0 : m.options, { element: i }),
        }),
        flip: Object.assign({ enabled: !!r }, g.flip),
      }),
    ),
  });
}
const Js = ["children"];
function Qs(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const ei = () => {};
function Gr(e = {}) {
  const t = l.useContext($t),
    [n, r] = wt(),
    o = l.useRef(!1),
    {
      flip: a,
      offset: s,
      rootCloseEvent: i,
      fixed: c = !1,
      placement: u,
      popperConfig: d = {},
      enableEventListeners: f = !0,
      usePopper: v = !!t,
    } = e,
    m = (t == null ? void 0 : t.show) == null ? !!e.show : t.show;
  m && !o.current && (o.current = !0);
  const g = (w) => {
      t == null || t.toggle(!1, w);
    },
    { placement: y, setMenu: h, menuElement: E, toggleElement: C } = t || {},
    x = Ur(
      C,
      E,
      _r({
        placement: u || y || "bottom-start",
        enabled: v,
        enableEvents: f ?? m,
        offset: s,
        flip: a,
        fixed: c,
        arrowElement: n,
        popperConfig: d,
      }),
    ),
    b = Object.assign(
      { ref: h || ei, "aria-labelledby": C == null ? void 0 : C.id },
      x.attributes.popper,
      { style: x.styles.popper },
    ),
    R = {
      show: m,
      placement: y,
      hasShown: o.current,
      toggle: t == null ? void 0 : t.toggle,
      popper: v ? x : null,
      arrowProps: v ? Object.assign({ ref: r }, x.attributes.arrow, { style: x.styles.arrow }) : {},
    };
  return Vr(E, g, { clickTrigger: i, disabled: !m }), [b, R];
}
const ti = { usePopper: !0 };
function gn(e) {
  let { children: t } = e,
    n = Qs(e, Js);
  const [r, o] = Gr(n);
  return p.jsx(p.Fragment, { children: t(r, o) });
}
gn.displayName = "DropdownMenu";
gn.defaultProps = ti;
const yn = { prefix: String(Math.round(Math.random() * 1e10)), current: 0 },
  Xr = V.createContext(yn),
  ni = V.createContext(!1);
let ri = !!(typeof window < "u" && window.document && window.document.createElement),
  At = new WeakMap();
function oi(e = !1) {
  let t = l.useContext(Xr),
    n = l.useRef(null);
  if (n.current === null && !e) {
    var r, o;
    let a =
      (o = V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null ||
      o === void 0 ||
      (r = o.ReactCurrentOwner) === null ||
      r === void 0
        ? void 0
        : r.current;
    if (a) {
      let s = At.get(a);
      s == null
        ? At.set(a, { id: t.current, state: a.memoizedState })
        : a.memoizedState !== s.state && ((t.current = s.id), At.delete(a));
    }
    n.current = ++t.current;
  }
  return n.current;
}
function ai(e) {
  let t = l.useContext(Xr);
  t === yn &&
    !ri &&
    console.warn(
      "When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.",
    );
  let n = oi(!!e),
    r = `react-aria${t.prefix}`;
  return e || `${r}-${n}`;
}
function si(e) {
  let t = V.useId(),
    [n] = l.useState(di()),
    r = n ? "react-aria" : `react-aria${yn.prefix}`;
  return e || `${r}-${t}`;
}
const ii = typeof V.useId == "function" ? si : ai;
function li() {
  return !1;
}
function ci() {
  return !0;
}
function ui(e) {
  return () => {};
}
function di() {
  return typeof V.useSyncExternalStore == "function"
    ? V.useSyncExternalStore(ui, li, ci)
    : l.useContext(ni);
}
const qr = (e) => {
    var t;
    return ((t = e.getAttribute("role")) == null ? void 0 : t.toLowerCase()) === "menu";
  },
  Xn = () => {};
function zr() {
  const e = ii(),
    { show: t = !1, toggle: n = Xn, setToggle: r, menuElement: o } = l.useContext($t) || {},
    a = l.useCallback(
      (i) => {
        n(!t, i);
      },
      [t, n],
    ),
    s = { id: e, ref: r || Xn, onClick: a, "aria-expanded": !!t };
  return o && qr(o) && (s["aria-haspopup"] = !0), [s, { show: t, toggle: n }];
}
function Yr({ children: e }) {
  const [t, n] = zr();
  return p.jsx(p.Fragment, { children: e(t, n) });
}
Yr.displayName = "DropdownToggle";
const Ke = l.createContext(null),
  rt = (e, t = null) => (e != null ? String(e) : t || null),
  jt = l.createContext(null);
jt.displayName = "NavContext";
const fi = "data-rr-ui-",
  pi = "rrUi";
function _e(e) {
  return `${fi}${e}`;
}
function vi(e) {
  return `${pi}${e}`;
}
const mi = ["eventKey", "disabled", "onClick", "active", "as"];
function hi(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Zr({ key: e, href: t, active: n, disabled: r, onClick: o }) {
  const a = l.useContext(Ke),
    s = l.useContext(jt),
    { activeKey: i } = s || {},
    c = rt(e, t),
    u = n == null && e != null ? rt(i) === c : n;
  return [
    {
      onClick: H((f) => {
        r || (o == null || o(f), a && !f.isPropagationStopped() && a(c, f));
      }),
      "aria-disabled": r || void 0,
      "aria-selected": u,
      [_e("dropdown-item")]: "",
    },
    { isActive: u },
  ];
}
const Jr = l.forwardRef((e, t) => {
  let { eventKey: n, disabled: r, onClick: o, active: a, as: s = nn } = e,
    i = hi(e, mi);
  const [c] = Zr({ key: n, href: i.href, disabled: r, onClick: o, active: a });
  return p.jsx(s, Object.assign({}, i, { ref: t }, c));
});
Jr.displayName = "DropdownItem";
const Qr = l.createContext(Ve ? window : void 0);
Qr.Provider;
function Tt() {
  return l.useContext(Qr);
}
function qn() {
  const e = Mr(),
    t = l.useRef(null),
    n = l.useCallback(
      (r) => {
        (t.current = r), e();
      },
      [e],
    );
  return [t, n];
}
function lt({
  defaultShow: e,
  show: t,
  onSelect: n,
  onToggle: r,
  itemSelector: o = `* [${_e("dropdown-item")}]`,
  focusFirstItemOnShow: a,
  placement: s = "bottom-start",
  children: i,
}) {
  const c = Tt(),
    [u, d] = Ba(t, e, r),
    [f, v] = qn(),
    m = f.current,
    [g, y] = qn(),
    h = g.current,
    E = xr(u),
    C = l.useRef(null),
    x = l.useRef(!1),
    b = l.useContext(Ke),
    R = l.useCallback(
      (T, k, D = k == null ? void 0 : k.type) => {
        d(T, { originalEvent: k, source: D });
      },
      [d],
    ),
    w = H((T, k) => {
      n == null || n(T, k), R(!1, k, "select"), k.isPropagationStopped() || b == null || b(T, k);
    }),
    $ = l.useMemo(
      () => ({
        toggle: R,
        placement: s,
        show: u,
        menuElement: m,
        toggleElement: h,
        setMenu: v,
        setToggle: y,
      }),
      [R, s, u, m, h, v, y],
    );
  m && E && !u && (x.current = m.contains(m.ownerDocument.activeElement));
  const j = H(() => {
      h && h.focus && h.focus();
    }),
    A = H(() => {
      const T = C.current;
      let k = a;
      if (
        (k == null && (k = f.current && qr(f.current) ? "keyboard" : !1),
        k === !1 || (k === "keyboard" && !/^key.+$/.test(T)))
      )
        return;
      const D = pe(f.current, o)[0];
      D && D.focus && D.focus();
    });
  l.useEffect(() => {
    u ? A() : x.current && ((x.current = !1), j());
  }, [u, x, j, A]),
    l.useEffect(() => {
      C.current = null;
    });
  const S = (T, k) => {
    if (!f.current) return null;
    const D = pe(f.current, o);
    let B = D.indexOf(T) + k;
    return (B = Math.max(0, Math.min(B, D.length))), D[B];
  };
  return (
    ma(
      l.useCallback(() => c.document, [c]),
      "keydown",
      (T) => {
        var k, D;
        const { key: B } = T,
          F = T.target,
          P = (k = f.current) == null ? void 0 : k.contains(F),
          U = (D = g.current) == null ? void 0 : D.contains(F);
        if (
          (/input|textarea/i.test(F.tagName) &&
            (B === " " || (B !== "Escape" && P) || (B === "Escape" && F.type === "search"))) ||
          (!P && !U) ||
          (B === "Tab" && (!f.current || !u))
        )
          return;
        C.current = T.type;
        const _ = { originalEvent: T, source: T.type };
        switch (B) {
          case "ArrowUp": {
            const K = S(F, -1);
            K && K.focus && K.focus(), T.preventDefault();
            return;
          }
          case "ArrowDown":
            if ((T.preventDefault(), !u)) d(!0, _);
            else {
              const K = S(F, 1);
              K && K.focus && K.focus();
            }
            return;
          case "Tab":
            Yt(
              F.ownerDocument,
              "keyup",
              (K) => {
                var q;
                ((K.key === "Tab" && !K.target) ||
                  !((q = f.current) != null && q.contains(K.target))) &&
                  d(!1, _);
              },
              { once: !0 },
            );
            break;
          case "Escape":
            B === "Escape" && (T.preventDefault(), T.stopPropagation()), d(!1, _);
            break;
        }
      },
    ),
    p.jsx(Ke.Provider, { value: w, children: p.jsx($t.Provider, { value: $, children: i }) })
  );
}
lt.displayName = "Dropdown";
lt.Menu = gn;
lt.Toggle = Yr;
lt.Item = Jr;
const wn = l.createContext({});
wn.displayName = "DropdownContext";
const eo = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "hr", role: r = "separator", ...o }, a) => (
    (t = N(t, "dropdown-divider")), p.jsx(n, { ref: a, className: O(e, t), role: r, ...o })
  ),
);
eo.displayName = "DropdownDivider";
const to = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", role: r = "heading", ...o }, a) => (
    (t = N(t, "dropdown-header")), p.jsx(n, { ref: a, className: O(e, t), role: r, ...o })
  ),
);
to.displayName = "DropdownHeader";
const no = l.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      eventKey: n,
      disabled: r = !1,
      onClick: o,
      active: a,
      as: s = rn,
      ...i
    },
    c,
  ) => {
    const u = N(e, "dropdown-item"),
      [d, f] = Zr({ key: n, href: i.href, disabled: r, onClick: o, active: a });
    return p.jsx(s, {
      ...i,
      ...d,
      ref: c,
      className: O(t, u, f.isActive && "active", r && "disabled"),
    });
  },
);
no.displayName = "DropdownItem";
const ro = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "span", ...r }, o) => (
    (t = N(t, "dropdown-item-text")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
ro.displayName = "DropdownItemText";
const xn = l.createContext(null);
xn.displayName = "InputGroupContext";
const bn = l.createContext(null);
bn.displayName = "NavbarContext";
function oo(e, t) {
  return e;
}
const Be = M.oneOf(["start", "end"]),
  gi = M.oneOfType([
    Be,
    M.shape({ sm: Be }),
    M.shape({ md: Be }),
    M.shape({ lg: Be }),
    M.shape({ xl: Be }),
    M.shape({ xxl: Be }),
    M.object,
  ]);
function ao(e, t, n) {
  const r = n ? "top-end" : "top-start",
    o = n ? "top-start" : "top-end",
    a = n ? "bottom-end" : "bottom-start",
    s = n ? "bottom-start" : "bottom-end",
    i = n ? "right-start" : "left-start",
    c = n ? "right-end" : "left-end",
    u = n ? "left-start" : "right-start",
    d = n ? "left-end" : "right-end";
  let f = e ? s : a;
  return (
    t === "up"
      ? (f = e ? o : r)
      : t === "end"
        ? (f = e ? d : u)
        : t === "start"
          ? (f = e ? c : i)
          : t === "down-centered"
            ? (f = "bottom")
            : t === "up-centered" && (f = "top"),
    f
  );
}
const so = l.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      align: n,
      rootCloseEvent: r,
      flip: o = !0,
      show: a,
      renderOnMount: s,
      as: i = "div",
      popperConfig: c,
      variant: u,
      ...d
    },
    f,
  ) => {
    let v = !1;
    const m = l.useContext(bn),
      g = N(e, "dropdown-menu"),
      { align: y, drop: h, isRTL: E } = l.useContext(wn);
    n = n || y;
    const C = l.useContext(xn),
      x = [];
    if (n)
      if (typeof n == "object") {
        const T = Object.keys(n);
        if (T.length) {
          const k = T[0],
            D = n[k];
          (v = D === "start"), x.push(`${g}-${k}-${D}`);
        }
      } else n === "end" && (v = !0);
    const b = ao(v, h, E),
      [R, { hasShown: w, popper: $, show: j, toggle: A }] = Gr({
        flip: o,
        rootCloseEvent: r,
        show: a,
        usePopper: !m && x.length === 0,
        offset: [0, 2],
        popperConfig: c,
        placement: b,
      });
    if (
      ((R.ref = se(oo(f), R.ref)),
      xt(() => {
        j && ($ == null || $.update());
      }, [j]),
      !w && !s && !C)
    )
      return null;
    typeof i != "string" &&
      ((R.show = j), (R.close = () => (A == null ? void 0 : A(!1))), (R.align = n));
    let S = d.style;
    return (
      $ != null &&
        $.placement &&
        ((S = { ...d.style, ...R.style }), (d["x-placement"] = $.placement)),
      p.jsx(i, {
        ...d,
        ...R,
        style: S,
        ...((x.length || m) && { "data-bs-popper": "static" }),
        className: O(t, g, j && "show", v && `${g}-end`, u && `${g}-${u}`, ...x),
      })
    );
  },
);
so.displayName = "DropdownMenu";
const io = l.forwardRef(
  ({ bsPrefix: e, split: t, className: n, childBsPrefix: r, as: o = an, ...a }, s) => {
    const i = N(e, "dropdown-toggle"),
      c = l.useContext($t);
    r !== void 0 && (a.bsPrefix = r);
    const [u] = zr();
    return (
      (u.ref = se(u.ref, oo(s))),
      p.jsx(o, {
        className: O(n, i, t && `${i}-split`, (c == null ? void 0 : c.show) && "show"),
        ...u,
        ...a,
      })
    );
  },
);
io.displayName = "DropdownToggle";
const lo = l.forwardRef((e, t) => {
  const {
      bsPrefix: n,
      drop: r = "down",
      show: o,
      className: a,
      align: s = "start",
      onSelect: i,
      onToggle: c,
      focusFirstItemOnShow: u,
      as: d = "div",
      navbar: f,
      autoClose: v = !0,
      ...m
    } = zt(e, { show: "onToggle" }),
    g = l.useContext(xn),
    y = N(n, "dropdown"),
    h = Ot(),
    E = ($) =>
      v === !1
        ? $ === "click"
        : v === "inside"
          ? $ !== "rootClose"
          : v === "outside"
            ? $ !== "select"
            : !0,
    C = H(($, j) => {
      var A, S;
      (!((A = j.originalEvent) == null || (S = A.target) == null) &&
        S.classList.contains("dropdown-toggle") &&
        j.source === "mousedown") ||
        (j.originalEvent.currentTarget === document &&
          (j.source !== "keydown" || j.originalEvent.key === "Escape") &&
          (j.source = "rootClose"),
        E(j.source) && (c == null || c($, j)));
    }),
    b = ao(s === "end", r, h),
    R = l.useMemo(() => ({ align: s, drop: r, isRTL: h }), [s, r, h]),
    w = {
      down: y,
      "down-centered": `${y}-center`,
      up: "dropup",
      "up-centered": "dropup-center dropup",
      end: "dropend",
      start: "dropstart",
    };
  return p.jsx(wn.Provider, {
    value: R,
    children: p.jsx(lt, {
      placement: b,
      show: o,
      onSelect: i,
      onToggle: C,
      focusFirstItemOnShow: u,
      itemSelector: `.${y}-item:not(.disabled):not(:disabled)`,
      children: g ? m.children : p.jsx(d, { ...m, ref: t, className: O(a, o && "show", w[r]) }),
    }),
  });
});
lo.displayName = "Dropdown";
const re = Object.assign(lo, {
    Toggle: io,
    Menu: so,
    Item: no,
    ItemText: ro,
    Divider: eo,
    Header: to,
  }),
  yi = {
    bsPrefix: M.string,
    fluid: M.bool,
    rounded: M.bool,
    roundedCircle: M.bool,
    thumbnail: M.bool,
  },
  co = l.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        fluid: n = !1,
        rounded: r = !1,
        roundedCircle: o = !1,
        thumbnail: a = !1,
        ...s
      },
      i,
    ) => (
      (e = N(e, "img")),
      p.jsx("img", {
        ref: i,
        ...s,
        className: O(
          t,
          n && `${e}-fluid`,
          r && "rounded",
          o && "rounded-circle",
          a && `${e}-thumbnail`,
        ),
      })
    ),
  );
co.displayName = "Image";
const Cn = l.forwardRef(({ className: e, fluid: t = !0, ...n }, r) =>
  p.jsx(co, { ref: r, ...n, fluid: t, className: O(e, "figure-img") }),
);
Cn.displayName = "FigureImage";
Cn.propTypes = yi;
const uo = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "figcaption", ...r }, o) => (
    (t = N(t, "figure-caption")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
uo.displayName = "FigureCaption";
const fo = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "figure", ...r }, o) => (
    (t = N(t, "figure")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
fo.displayName = "Figure";
const ul = Object.assign(fo, { Image: Cn, Caption: uo }),
  wi = { type: M.string, tooltip: M.bool, as: M.elementType },
  St = l.forwardRef(
    ({ as: e = "div", className: t, type: n = "valid", tooltip: r = !1, ...o }, a) =>
      p.jsx(e, { ...o, ref: a, className: O(t, `${n}-${r ? "tooltip" : "feedback"}`) }),
  );
St.displayName = "Feedback";
St.propTypes = wi;
const ge = l.createContext({}),
  En = l.forwardRef(
    (
      {
        id: e,
        bsPrefix: t,
        className: n,
        type: r = "checkbox",
        isValid: o = !1,
        isInvalid: a = !1,
        as: s = "input",
        ...i
      },
      c,
    ) => {
      const { controlId: u } = l.useContext(ge);
      return (
        (t = N(t, "form-check-input")),
        p.jsx(s, {
          ...i,
          ref: c,
          type: r,
          id: e || u,
          className: O(n, t, o && "is-valid", a && "is-invalid"),
        })
      );
    },
  );
En.displayName = "FormCheckInput";
const Ct = l.forwardRef(({ bsPrefix: e, className: t, htmlFor: n, ...r }, o) => {
  const { controlId: a } = l.useContext(ge);
  return (
    (e = N(e, "form-check-label")),
    p.jsx("label", { ...r, ref: o, htmlFor: n || a, className: O(t, e) })
  );
});
Ct.displayName = "FormCheckLabel";
const po = l.forwardRef(
  (
    {
      id: e,
      bsPrefix: t,
      bsSwitchPrefix: n,
      inline: r = !1,
      reverse: o = !1,
      disabled: a = !1,
      isValid: s = !1,
      isInvalid: i = !1,
      feedbackTooltip: c = !1,
      feedback: u,
      feedbackType: d,
      className: f,
      style: v,
      title: m = "",
      type: g = "checkbox",
      label: y,
      children: h,
      as: E = "input",
      ...C
    },
    x,
  ) => {
    (t = N(t, "form-check")), (n = N(n, "form-switch"));
    const { controlId: b } = l.useContext(ge),
      R = l.useMemo(() => ({ controlId: e || b }), [b, e]),
      w = (!h && y != null && y !== !1) || Ma(h, Ct),
      $ = p.jsx(En, {
        ...C,
        type: g === "switch" ? "checkbox" : g,
        ref: x,
        isValid: s,
        isInvalid: i,
        disabled: a,
        as: E,
      });
    return p.jsx(ge.Provider, {
      value: R,
      children: p.jsx("div", {
        style: v,
        className: O(f, w && t, r && `${t}-inline`, o && `${t}-reverse`, g === "switch" && n),
        children:
          h ||
          p.jsxs(p.Fragment, {
            children: [
              $,
              w && p.jsx(Ct, { title: m, children: y }),
              u && p.jsx(St, { type: d, tooltip: c, children: u }),
            ],
          }),
      }),
    });
  },
);
po.displayName = "FormCheck";
const Et = Object.assign(po, { Input: En, Label: Ct }),
  vo = l.forwardRef(
    (
      {
        bsPrefix: e,
        type: t,
        size: n,
        htmlSize: r,
        id: o,
        className: a,
        isValid: s = !1,
        isInvalid: i = !1,
        plaintext: c,
        readOnly: u,
        as: d = "input",
        ...f
      },
      v,
    ) => {
      const { controlId: m } = l.useContext(ge);
      return (
        (e = N(e, "form-control")),
        p.jsx(d, {
          ...f,
          type: t,
          size: r,
          ref: v,
          readOnly: u,
          id: o || m,
          className: O(
            a,
            c ? `${e}-plaintext` : e,
            n && `${e}-${n}`,
            t === "color" && `${e}-color`,
            s && "is-valid",
            i && "is-invalid",
          ),
        })
      );
    },
  );
vo.displayName = "FormControl";
const xi = Object.assign(vo, { Feedback: St }),
  mo = l.forwardRef(
    ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
      (t = N(t, "form-floating")), p.jsx(n, { ref: o, className: O(e, t), ...r })
    ),
  );
mo.displayName = "FormFloating";
const On = l.forwardRef(({ controlId: e, as: t = "div", ...n }, r) => {
  const o = l.useMemo(() => ({ controlId: e }), [e]);
  return p.jsx(ge.Provider, { value: o, children: p.jsx(t, { ...n, ref: r }) });
});
On.displayName = "FormGroup";
const ho = l.forwardRef(
  (
    {
      as: e = "label",
      bsPrefix: t,
      column: n = !1,
      visuallyHidden: r = !1,
      className: o,
      htmlFor: a,
      ...s
    },
    i,
  ) => {
    const { controlId: c } = l.useContext(ge);
    t = N(t, "form-label");
    let u = "col-form-label";
    typeof n == "string" && (u = `${u} ${u}-${n}`);
    const d = O(o, t, r && "visually-hidden", n && u);
    return (
      (a = a || c),
      n
        ? p.jsx(Dr, { ref: i, as: "label", className: d, htmlFor: a, ...s })
        : p.jsx(e, { ref: i, className: d, htmlFor: a, ...s })
    );
  },
);
ho.displayName = "FormLabel";
const go = l.forwardRef(({ bsPrefix: e, className: t, id: n, ...r }, o) => {
  const { controlId: a } = l.useContext(ge);
  return (
    (e = N(e, "form-range")),
    p.jsx("input", { ...r, type: "range", ref: o, className: O(t, e), id: n || a })
  );
});
go.displayName = "FormRange";
const yo = l.forwardRef(
  (
    {
      bsPrefix: e,
      size: t,
      htmlSize: n,
      className: r,
      isValid: o = !1,
      isInvalid: a = !1,
      id: s,
      ...i
    },
    c,
  ) => {
    const { controlId: u } = l.useContext(ge);
    return (
      (e = N(e, "form-select")),
      p.jsx("select", {
        ...i,
        size: n,
        ref: c,
        className: O(r, e, t && `${e}-${t}`, o && "is-valid", a && "is-invalid"),
        id: s || u,
      })
    );
  },
);
yo.displayName = "FormSelect";
const wo = l.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "small", muted: r, ...o }, a) => (
    (e = N(e, "form-text")), p.jsx(n, { ...o, ref: a, className: O(t, e, r && "text-muted") })
  ),
);
wo.displayName = "FormText";
const xo = l.forwardRef((e, t) => p.jsx(Et, { ...e, ref: t, type: "switch" }));
xo.displayName = "Switch";
const bi = Object.assign(xo, { Input: Et.Input, Label: Et.Label }),
  bo = l.forwardRef(
    ({ bsPrefix: e, className: t, children: n, controlId: r, label: o, ...a }, s) => (
      (e = N(e, "form-floating")),
      p.jsxs(On, {
        ref: s,
        className: O(t, e),
        controlId: r,
        ...a,
        children: [n, p.jsx("label", { htmlFor: r, children: o })],
      })
    ),
  );
bo.displayName = "FloatingLabel";
const Ci = { _ref: M.any, validated: M.bool, as: M.elementType },
  Rn = l.forwardRef(({ className: e, validated: t, as: n = "form", ...r }, o) =>
    p.jsx(n, { ...r, ref: o, className: O(e, t && "was-validated") }),
  );
Rn.displayName = "Form";
Rn.propTypes = Ci;
const dl = Object.assign(Rn, {
    Group: On,
    Control: xi,
    Floating: mo,
    Check: Et,
    Switch: bi,
    Label: ho,
    Text: wo,
    Range: go,
    Select: yo,
    FloatingLabel: bo,
  }),
  Co = l.createContext(null),
  Ei = ["as", "active", "eventKey"];
function Oi(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Eo({ key: e, onClick: t, active: n, id: r, role: o, disabled: a }) {
  const s = l.useContext(Ke),
    i = l.useContext(jt),
    c = l.useContext(Co);
  let u = n;
  const d = { role: o };
  if (i) {
    !o && i.role === "tablist" && (d.role = "tab");
    const f = i.getControllerId(e ?? null),
      v = i.getControlledId(e ?? null);
    (d[_e("event-key")] = e),
      (d.id = f || r),
      (u = n == null && e != null ? i.activeKey === e : n),
      (u || (!(c != null && c.unmountOnExit) && !(c != null && c.mountOnEnter))) &&
        (d["aria-controls"] = v);
  }
  return (
    d.role === "tab" &&
      ((d["aria-selected"] = u),
      u || (d.tabIndex = -1),
      a && ((d.tabIndex = -1), (d["aria-disabled"] = !0))),
    (d.onClick = H((f) => {
      a || (t == null || t(f), e != null && s && !f.isPropagationStopped() && s(e, f));
    })),
    [d, { isActive: u }]
  );
}
const Oo = l.forwardRef((e, t) => {
  let { as: n = nn, active: r, eventKey: o } = e,
    a = Oi(e, Ei);
  const [s, i] = Eo(Object.assign({ key: rt(o, a.href), active: r }, a));
  return (s[_e("active")] = i.isActive), p.jsx(n, Object.assign({}, a, s, { ref: t }));
});
Oo.displayName = "NavItem";
const Ri = ["as", "onSelect", "activeKey", "role", "onKeyDown"];
function $i(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const zn = () => {},
  Yn = _e("event-key"),
  Ro = l.forwardRef((e, t) => {
    let { as: n = "div", onSelect: r, activeKey: o, role: a, onKeyDown: s } = e,
      i = $i(e, Ri);
    const c = Mr(),
      u = l.useRef(!1),
      d = l.useContext(Ke),
      f = l.useContext(Co);
    let v, m;
    f &&
      ((a = a || "tablist"), (o = f.activeKey), (v = f.getControlledId), (m = f.getControllerId));
    const g = l.useRef(null),
      y = (x) => {
        const b = g.current;
        if (!b) return null;
        const R = pe(b, `[${Yn}]:not([aria-disabled=true])`),
          w = b.querySelector("[aria-selected=true]");
        if (!w || w !== document.activeElement) return null;
        const $ = R.indexOf(w);
        if ($ === -1) return null;
        let j = $ + x;
        return j >= R.length && (j = 0), j < 0 && (j = R.length - 1), R[j];
      },
      h = (x, b) => {
        x != null && (r == null || r(x, b), d == null || d(x, b));
      },
      E = (x) => {
        if ((s == null || s(x), !f)) return;
        let b;
        switch (x.key) {
          case "ArrowLeft":
          case "ArrowUp":
            b = y(-1);
            break;
          case "ArrowRight":
          case "ArrowDown":
            b = y(1);
            break;
          default:
            return;
        }
        b && (x.preventDefault(), h(b.dataset[vi("EventKey")] || null, x), (u.current = !0), c());
      };
    l.useEffect(() => {
      if (g.current && u.current) {
        const x = g.current.querySelector(`[${Yn}][aria-selected=true]`);
        x == null || x.focus();
      }
      u.current = !1;
    });
    const C = se(t, g);
    return p.jsx(Ke.Provider, {
      value: h,
      children: p.jsx(jt.Provider, {
        value: { role: a, activeKey: rt(o), getControlledId: v || zn, getControllerId: m || zn },
        children: p.jsx(n, Object.assign({}, i, { onKeyDown: E, ref: C, role: a })),
      }),
    });
  });
Ro.displayName = "Nav";
const Ni = Object.assign(Ro, { Item: Oo });
var vt;
function Zn(e) {
  if (((!vt && vt !== 0) || e) && Ve) {
    var t = document.createElement("div");
    (t.style.position = "absolute"),
      (t.style.top = "-9999px"),
      (t.style.width = "50px"),
      (t.style.height = "50px"),
      (t.style.overflow = "scroll"),
      document.body.appendChild(t),
      (vt = t.offsetWidth - t.clientWidth),
      document.body.removeChild(t);
  }
  return vt;
}
function It(e) {
  e === void 0 && (e = Ue());
  try {
    var t = e.activeElement;
    return !t || !t.nodeName ? null : t;
  } catch {
    return e.body;
  }
}
function ji(e = document) {
  const t = e.defaultView;
  return Math.abs(t.innerWidth - e.documentElement.clientWidth);
}
const Jn = _e("modal-open");
class $n {
  constructor({ ownerDocument: t, handleContainerOverflow: n = !0, isRTL: r = !1 } = {}) {
    (this.handleContainerOverflow = n),
      (this.isRTL = r),
      (this.modals = []),
      (this.ownerDocument = t);
  }
  getScrollbarWidth() {
    return ji(this.ownerDocument);
  }
  getElement() {
    return (this.ownerDocument || document).body;
  }
  setModalAttributes(t) {}
  removeModalAttributes(t) {}
  setContainerStyle(t) {
    const n = { overflow: "hidden" },
      r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.getElement();
    (t.style = { overflow: o.style.overflow, [r]: o.style[r] }),
      t.scrollBarWidth && (n[r] = `${parseInt(me(o, r) || "0", 10) + t.scrollBarWidth}px`),
      o.setAttribute(Jn, ""),
      me(o, n);
  }
  reset() {
    [...this.modals].forEach((t) => this.remove(t));
  }
  removeContainerStyle(t) {
    const n = this.getElement();
    n.removeAttribute(Jn), Object.assign(n.style, t.style);
  }
  add(t) {
    let n = this.modals.indexOf(t);
    return (
      n !== -1 ||
        ((n = this.modals.length), this.modals.push(t), this.setModalAttributes(t), n !== 0) ||
        ((this.state = { scrollBarWidth: this.getScrollbarWidth(), style: {} }),
        this.handleContainerOverflow && this.setContainerStyle(this.state)),
      n
    );
  }
  remove(t) {
    const n = this.modals.indexOf(t);
    n !== -1 &&
      (this.modals.splice(n, 1),
      !this.modals.length && this.handleContainerOverflow && this.removeContainerStyle(this.state),
      this.removeModalAttributes(t));
  }
  isTopModal(t) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === t;
  }
}
const Bt = (e, t) =>
  Ve
    ? e == null
      ? (t || Ue()).body
      : (typeof e == "function" && (e = e()),
        e && "current" in e && (e = e.current),
        e && ("nodeType" in e || e.getBoundingClientRect) ? e : null)
    : null;
function _t(e, t) {
  const n = Tt(),
    [r, o] = l.useState(() => Bt(e, n == null ? void 0 : n.document));
  if (!r) {
    const a = Bt(e);
    a && o(a);
  }
  return (
    l.useEffect(() => {}, [t, r]),
    l.useEffect(() => {
      const a = Bt(e);
      a !== r && o(a);
    }, [e, r]),
    r
  );
}
function Ti({ children: e, in: t, onExited: n, mountOnEnter: r, unmountOnExit: o }) {
  const a = l.useRef(null),
    s = l.useRef(t),
    i = H(n);
  l.useEffect(() => {
    t ? (s.current = !0) : i(a.current);
  }, [t, i]);
  const c = se(a, e.ref),
    u = l.cloneElement(e, { ref: c });
  return t ? u : o || (!s.current && r) ? null : u;
}
function Si({ in: e, onTransition: t }) {
  const n = l.useRef(null),
    r = l.useRef(!0),
    o = H(t);
  return (
    xt(() => {
      if (!n.current) return;
      let a = !1;
      return (
        o({ in: e, element: n.current, initial: r.current, isStale: () => a }),
        () => {
          a = !0;
        }
      );
    }, [e, o]),
    xt(
      () => (
        (r.current = !1),
        () => {
          r.current = !0;
        }
      ),
      [],
    ),
    n
  );
}
function ki({ children: e, in: t, onExited: n, onEntered: r, transition: o }) {
  const [a, s] = l.useState(!t);
  t && a && s(!1);
  const i = Si({
      in: !!t,
      onTransition: (u) => {
        const d = () => {
          u.isStale() ||
            (u.in ? r == null || r(u.element, u.initial) : (s(!0), n == null || n(u.element)));
        };
        Promise.resolve(o(u)).then(d, (f) => {
          throw (u.in || s(!0), f);
        });
      },
    }),
    c = se(i, e.ref);
  return a && !t ? null : l.cloneElement(e, { ref: c });
}
function Gt(e, t, n) {
  return e
    ? p.jsx(e, Object.assign({}, n))
    : t
      ? p.jsx(ki, Object.assign({}, n, { transition: t }))
      : p.jsx(Ti, Object.assign({}, n));
}
function $o(e) {
  return e.code === "Escape" || e.keyCode === 27;
}
const Di = [
  "show",
  "role",
  "className",
  "style",
  "children",
  "backdrop",
  "keyboard",
  "onBackdropClick",
  "onEscapeKeyDown",
  "transition",
  "runTransition",
  "backdropTransition",
  "runBackdropTransition",
  "autoFocus",
  "enforceFocus",
  "restoreFocus",
  "restoreFocusOptions",
  "renderDialog",
  "renderBackdrop",
  "manager",
  "container",
  "onShow",
  "onHide",
  "onExit",
  "onExited",
  "onExiting",
  "onEnter",
  "onEntering",
  "onEntered",
];
function Mi(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    a;
  for (a = 0; a < r.length; a++) (o = r[a]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
let Ft;
function Ai(e) {
  return Ft || (Ft = new $n({ ownerDocument: e == null ? void 0 : e.document })), Ft;
}
function Ii(e) {
  const t = Tt(),
    n = e || Ai(t),
    r = l.useRef({ dialog: null, backdrop: null });
  return Object.assign(r.current, {
    add: () => n.add(r.current),
    remove: () => n.remove(r.current),
    isTopModal: () => n.isTopModal(r.current),
    setDialogRef: l.useCallback((o) => {
      r.current.dialog = o;
    }, []),
    setBackdropRef: l.useCallback((o) => {
      r.current.backdrop = o;
    }, []),
  });
}
const No = l.forwardRef((e, t) => {
  let {
      show: n = !1,
      role: r = "dialog",
      className: o,
      style: a,
      children: s,
      backdrop: i = !0,
      keyboard: c = !0,
      onBackdropClick: u,
      onEscapeKeyDown: d,
      transition: f,
      runTransition: v,
      backdropTransition: m,
      runBackdropTransition: g,
      autoFocus: y = !0,
      enforceFocus: h = !0,
      restoreFocus: E = !0,
      restoreFocusOptions: C,
      renderDialog: x,
      renderBackdrop: b = (L) => p.jsx("div", Object.assign({}, L)),
      manager: R,
      container: w,
      onShow: $,
      onHide: j = () => {},
      onExit: A,
      onExited: S,
      onExiting: T,
      onEnter: k,
      onEntering: D,
      onEntered: B,
    } = e,
    F = Mi(e, Di);
  const P = Tt(),
    U = _t(w),
    W = Ii(R),
    _ = en(),
    K = xr(n),
    [q, Q] = l.useState(!n),
    G = l.useRef(null);
  l.useImperativeHandle(t, () => W, [W]),
    Ve && !K && n && (G.current = It(P == null ? void 0 : P.document)),
    n && q && Q(!1);
  const X = H(() => {
      if (
        (W.add(),
        (we.current = ve(document, "keydown", ne)),
        (ce.current = ve(document, "focus", () => setTimeout(ie), !0)),
        $ && $(),
        y)
      ) {
        var L, Te;
        const Oe = It(
          (L = (Te = W.dialog) == null ? void 0 : Te.ownerDocument) != null
            ? L
            : P == null
              ? void 0
              : P.document,
        );
        W.dialog && Oe && !nt(W.dialog, Oe) && ((G.current = Oe), W.dialog.focus());
      }
    }),
    z = H(() => {
      if ((W.remove(), we.current == null || we.current(), ce.current == null || ce.current(), E)) {
        var L;
        (L = G.current) == null || L.focus == null || L.focus(C), (G.current = null);
      }
    });
  l.useEffect(() => {
    !n || !U || X();
  }, [n, U, X]),
    l.useEffect(() => {
      q && z();
    }, [q, z]),
    cn(() => {
      z();
    });
  const ie = H(() => {
      if (!h || !_() || !W.isTopModal()) return;
      const L = It(P == null ? void 0 : P.document);
      W.dialog && L && !nt(W.dialog, L) && W.dialog.focus();
    }),
    le = H((L) => {
      L.target === L.currentTarget && (u == null || u(L), i === !0 && j());
    }),
    ne = H((L) => {
      c && $o(L) && W.isTopModal() && (d == null || d(L), L.defaultPrevented || j());
    }),
    ce = l.useRef(),
    we = l.useRef(),
    xe = (...L) => {
      Q(!0), S == null || S(...L);
    };
  if (!U) return null;
  const be = Object.assign(
    { role: r, ref: W.setDialogRef, "aria-modal": r === "dialog" ? !0 : void 0 },
    F,
    { style: a, className: o, tabIndex: -1 },
  );
  let Ce = x
    ? x(be)
    : p.jsx("div", Object.assign({}, be, { children: l.cloneElement(s, { role: "document" }) }));
  Ce = Gt(f, v, {
    unmountOnExit: !0,
    mountOnEnter: !0,
    appear: !0,
    in: !!n,
    onExit: A,
    onExiting: T,
    onExited: xe,
    onEnter: k,
    onEntering: D,
    onEntered: B,
    children: Ce,
  });
  let Ee = null;
  return (
    i &&
      ((Ee = b({ ref: W.setBackdropRef, onClick: le })),
      (Ee = Gt(m, g, { in: !!n, appear: !0, mountOnEnter: !0, unmountOnExit: !0, children: Ee }))),
    p.jsx(p.Fragment, { children: Se.createPortal(p.jsxs(p.Fragment, { children: [Ee, Ce] }), U) })
  );
});
No.displayName = "Modal";
const Bi = Object.assign(No, { Manager: $n });
function Xt(e, t) {
  return e.classList
    ? !!t && e.classList.contains(t)
    : (" " + (e.className.baseVal || e.className) + " ").indexOf(" " + t + " ") !== -1;
}
function Fi(e, t) {
  e.classList
    ? e.classList.add(t)
    : Xt(e, t) ||
      (typeof e.className == "string"
        ? (e.className = e.className + " " + t)
        : e.setAttribute("class", ((e.className && e.className.baseVal) || "") + " " + t));
}
function Qn(e, t) {
  return e
    .replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1")
    .replace(/\s+/g, " ")
    .replace(/^\s*|\s*$/g, "");
}
function Li(e, t) {
  e.classList
    ? e.classList.remove(t)
    : typeof e.className == "string"
      ? (e.className = Qn(e.className, t))
      : e.setAttribute("class", Qn((e.className && e.className.baseVal) || "", t));
}
const Fe = {
  FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
  STICKY_CONTENT: ".sticky-top",
  NAVBAR_TOGGLER: ".navbar-toggler",
};
class Pi extends $n {
  adjustAndStore(t, n, r) {
    const o = n.style[t];
    (n.dataset[t] = o), me(n, { [t]: `${parseFloat(me(n, t)) + r}px` });
  }
  restore(t, n) {
    const r = n.dataset[t];
    r !== void 0 && (delete n.dataset[t], me(n, { [t]: r }));
  }
  setContainerStyle(t) {
    super.setContainerStyle(t);
    const n = this.getElement();
    if ((Fi(n, "modal-open"), !t.scrollBarWidth)) return;
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    pe(n, Fe.FIXED_CONTENT).forEach((a) => this.adjustAndStore(r, a, t.scrollBarWidth)),
      pe(n, Fe.STICKY_CONTENT).forEach((a) => this.adjustAndStore(o, a, -t.scrollBarWidth)),
      pe(n, Fe.NAVBAR_TOGGLER).forEach((a) => this.adjustAndStore(o, a, t.scrollBarWidth));
  }
  removeContainerStyle(t) {
    super.removeContainerStyle(t);
    const n = this.getElement();
    Li(n, "modal-open");
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    pe(n, Fe.FIXED_CONTENT).forEach((a) => this.restore(r, a)),
      pe(n, Fe.STICKY_CONTENT).forEach((a) => this.restore(o, a)),
      pe(n, Fe.NAVBAR_TOGGLER).forEach((a) => this.restore(o, a));
  }
}
let Lt;
function Wi(e) {
  return Lt || (Lt = new Pi(e)), Lt;
}
const jo = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "modal-body")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
jo.displayName = "ModalBody";
const To = l.createContext({ onHide() {} }),
  Nn = l.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        contentClassName: n,
        centered: r,
        size: o,
        fullscreen: a,
        children: s,
        scrollable: i,
        ...c
      },
      u,
    ) => {
      e = N(e, "modal");
      const d = `${e}-dialog`,
        f = typeof a == "string" ? `${e}-fullscreen-${a}` : `${e}-fullscreen`;
      return p.jsx("div", {
        ...c,
        ref: u,
        className: O(d, t, o && `${e}-${o}`, r && `${d}-centered`, i && `${d}-scrollable`, a && f),
        children: p.jsx("div", { className: O(`${e}-content`, n), children: s }),
      });
    },
  );
Nn.displayName = "ModalDialog";
const So = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "modal-footer")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
So.displayName = "ModalFooter";
const Hi = l.forwardRef(
    (
      {
        closeLabel: e = "Close",
        closeVariant: t,
        closeButton: n = !1,
        onHide: r,
        children: o,
        ...a
      },
      s,
    ) => {
      const i = l.useContext(To),
        c = H(() => {
          i == null || i.onHide(), r == null || r();
        });
      return p.jsxs("div", {
        ref: s,
        ...a,
        children: [o, n && p.jsx(on, { "aria-label": e, variant: t, onClick: c })],
      });
    },
  ),
  ko = l.forwardRef(
    ({ bsPrefix: e, className: t, closeLabel: n = "Close", closeButton: r = !1, ...o }, a) => (
      (e = N(e, "modal-header")),
      p.jsx(Hi, { ref: a, ...o, className: O(t, e), closeLabel: n, closeButton: r })
    ),
  );
ko.displayName = "ModalHeader";
const Ki = Qt("h4"),
  Do = l.forwardRef(
    ({ className: e, bsPrefix: t, as: n = Ki, ...r }, o) => (
      (t = N(t, "modal-title")), p.jsx(n, { ref: o, className: O(e, t), ...r })
    ),
  );
Do.displayName = "ModalTitle";
function Ui(e) {
  return p.jsx(Qe, { ...e, timeout: null });
}
function Vi(e) {
  return p.jsx(Qe, { ...e, timeout: null });
}
const Mo = l.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      style: n,
      dialogClassName: r,
      contentClassName: o,
      children: a,
      dialogAs: s = Nn,
      "data-bs-theme": i,
      "aria-labelledby": c,
      "aria-describedby": u,
      "aria-label": d,
      show: f = !1,
      animation: v = !0,
      backdrop: m = !0,
      keyboard: g = !0,
      onEscapeKeyDown: y,
      onShow: h,
      onHide: E,
      container: C,
      autoFocus: x = !0,
      enforceFocus: b = !0,
      restoreFocus: R = !0,
      restoreFocusOptions: w,
      onEntered: $,
      onExit: j,
      onExiting: A,
      onEnter: S,
      onEntering: T,
      onExited: k,
      backdropClassName: D,
      manager: B,
      ...F
    },
    P,
  ) => {
    const [U, W] = l.useState({}),
      [_, K] = l.useState(!1),
      q = l.useRef(!1),
      Q = l.useRef(!1),
      G = l.useRef(null),
      [X, z] = wt(),
      ie = se(P, z),
      le = H(E),
      ne = Ot();
    e = N(e, "modal");
    const ce = l.useMemo(() => ({ onHide: le }), [le]);
    function we() {
      return B || Wi({ isRTL: ne });
    }
    function xe(I) {
      if (!Ve) return;
      const de = we().getScrollbarWidth() > 0,
        Ge = I.scrollHeight > Ue(I).documentElement.clientHeight;
      W({ paddingRight: de && !Ge ? Zn() : void 0, paddingLeft: !de && Ge ? Zn() : void 0 });
    }
    const be = H(() => {
      X && xe(X.dialog);
    });
    cn(() => {
      Ht(window, "resize", be), G.current == null || G.current();
    });
    const Ce = () => {
        q.current = !0;
      },
      Ee = (I) => {
        q.current && X && I.target === X.dialog && (Q.current = !0), (q.current = !1);
      },
      L = () => {
        K(!0),
          (G.current = dr(X.dialog, () => {
            K(!1);
          }));
      },
      Te = (I) => {
        I.target === I.currentTarget && L();
      },
      Oe = (I) => {
        if (m === "static") {
          Te(I);
          return;
        }
        if (Q.current || I.target !== I.currentTarget) {
          Q.current = !1;
          return;
        }
        E == null || E();
      },
      kt = (I) => {
        g ? y == null || y(I) : (I.preventDefault(), m === "static" && L());
      },
      Dt = (I, de) => {
        I && xe(I), S == null || S(I, de);
      },
      ue = (I) => {
        G.current == null || G.current(), j == null || j(I);
      },
      Me = (I, de) => {
        T == null || T(I, de), Yt(window, "resize", be);
      },
      ct = (I) => {
        I && (I.style.display = ""), k == null || k(I), Ht(window, "resize", be);
      },
      ut = l.useCallback(
        (I) => p.jsx("div", { ...I, className: O(`${e}-backdrop`, D, !v && "show") }),
        [v, D, e],
      ),
      Ae = { ...n, ...U };
    Ae.display = "block";
    const dt = (I) =>
      p.jsx("div", {
        role: "dialog",
        ...I,
        style: Ae,
        className: O(t, e, _ && `${e}-static`, !v && "show"),
        onClick: m ? Oe : void 0,
        onMouseUp: Ee,
        "data-bs-theme": i,
        "aria-label": d,
        "aria-labelledby": c,
        "aria-describedby": u,
        children: p.jsx(s, {
          ...F,
          onMouseDown: Ce,
          className: r,
          contentClassName: o,
          children: a,
        }),
      });
    return p.jsx(To.Provider, {
      value: ce,
      children: p.jsx(Bi, {
        show: f,
        ref: ie,
        backdrop: m,
        container: C,
        keyboard: !0,
        autoFocus: x,
        enforceFocus: b,
        restoreFocus: R,
        restoreFocusOptions: w,
        onEscapeKeyDown: kt,
        onShow: h,
        onHide: E,
        onEnter: Dt,
        onEntering: Me,
        onEntered: $,
        onExit: ue,
        onExiting: A,
        onExited: ct,
        manager: we(),
        transition: v ? Ui : void 0,
        backdropTransition: v ? Vi : void 0,
        renderBackdrop: ut,
        renderDialog: dt,
      }),
    });
  },
);
Mo.displayName = "Modal";
const fl = Object.assign(Mo, {
  Body: jo,
  Header: ko,
  Title: Do,
  Footer: So,
  Dialog: Nn,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
});
var er = { exports: {} },
  qt = { exports: {} };
(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = n);
  function n(r) {
    function o(s, i, c, u, d, f) {
      var v = u || "<<anonymous>>",
        m = f || c;
      if (i[c] == null)
        return s
          ? new Error("Required " + d + " `" + m + "` was not specified " + ("in `" + v + "`."))
          : null;
      for (var g = arguments.length, y = Array(g > 6 ? g - 6 : 0), h = 6; h < g; h++)
        y[h - 6] = arguments[h];
      return r.apply(void 0, [i, c, v, d, m].concat(y));
    }
    var a = o.bind(null, !1);
    return (a.isRequired = o.bind(null, !0)), a;
  }
  e.exports = t.default;
})(qt, qt.exports);
var _i = qt.exports;
(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = a);
  var n = _i,
    r = o(n);
  function o(s) {
    return s && s.__esModule ? s : { default: s };
  }
  function a() {
    for (var s = arguments.length, i = Array(s), c = 0; c < s; c++) i[c] = arguments[c];
    function u() {
      for (var d = arguments.length, f = Array(d), v = 0; v < d; v++) f[v] = arguments[v];
      var m = null;
      return (
        i.forEach(function (g) {
          if (m == null) {
            var y = g.apply(void 0, f);
            y != null && (m = y);
          }
        }),
        m
      );
    }
    return (0, r.default)(u);
  }
  e.exports = t.default;
})(er, er.exports);
const Ao = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "nav-item")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
Ao.displayName = "NavItem";
const jn = l.forwardRef(
  (
    { bsPrefix: e, className: t, as: n = rn, active: r, eventKey: o, disabled: a = !1, ...s },
    i,
  ) => {
    e = N(e, "nav-link");
    const [c, u] = Eo({ key: rt(o, s.href), active: r, disabled: a, ...s });
    return p.jsx(n, {
      ...s,
      ...c,
      ref: i,
      disabled: a,
      className: O(t, e, a && "disabled", u.isActive && "active"),
    });
  },
);
jn.displayName = "NavLink";
const Io = l.forwardRef((e, t) => {
  const {
      as: n = "div",
      bsPrefix: r,
      variant: o,
      fill: a = !1,
      justify: s = !1,
      navbar: i,
      navbarScroll: c,
      className: u,
      activeKey: d,
      ...f
    } = zt(e, { activeKey: "onSelect" }),
    v = N(r, "nav");
  let m,
    g,
    y = !1;
  const h = l.useContext(bn),
    E = l.useContext(ln);
  return (
    h ? ((m = h.bsPrefix), (y = i ?? !0)) : E && ({ cardHeaderBsPrefix: g } = E),
    p.jsx(Ni, {
      as: n,
      ref: t,
      activeKey: d,
      className: O(u, {
        [v]: !y,
        [`${m}-nav`]: y,
        [`${m}-nav-scroll`]: y && c,
        [`${g}-${o}`]: !!g,
        [`${v}-${o}`]: !!o,
        [`${v}-fill`]: a,
        [`${v}-justified`]: s,
      }),
      ...f,
    })
  );
});
Io.displayName = "Nav";
const pl = Object.assign(Io, { Item: Ao, Link: jn }),
  Bo = l.forwardRef(
    (
      {
        id: e,
        title: t,
        children: n,
        bsPrefix: r,
        className: o,
        rootCloseEvent: a,
        menuRole: s,
        disabled: i,
        active: c,
        renderMenuOnMount: u,
        menuVariant: d,
        ...f
      },
      v,
    ) => {
      const m = N(void 0, "nav-item");
      return p.jsxs(re, {
        ref: v,
        ...f,
        className: O(o, m),
        children: [
          p.jsx(re.Toggle, {
            id: e,
            eventKey: null,
            active: c,
            disabled: i,
            childBsPrefix: r,
            as: jn,
            children: t,
          }),
          p.jsx(re.Menu, { role: s, renderOnMount: u, rootCloseEvent: a, variant: d, children: n }),
        ],
      });
    },
  );
Bo.displayName = "NavDropdown";
const vl = Object.assign(Bo, {
    Item: re.Item,
    ItemText: re.ItemText,
    Divider: re.Divider,
    Header: re.Header,
  }),
  Gi = () => {};
function Xi(e, t, { disabled: n, clickTrigger: r } = {}) {
  const o = t || Gi;
  Vr(e, o, { disabled: n, clickTrigger: r });
  const a = H((s) => {
    $o(s) && o(s);
  });
  l.useEffect(() => {
    if (n || e == null) return;
    const s = Ue(ht(e));
    let i = (s.defaultView || window).event;
    const c = ve(s, "keyup", (u) => {
      if (u === i) {
        i = void 0;
        return;
      }
      a(u);
    });
    return () => {
      c();
    };
  }, [e, n, a]);
}
const Fo = l.forwardRef((e, t) => {
  const {
      flip: n,
      offset: r,
      placement: o,
      containerPadding: a,
      popperConfig: s = {},
      transition: i,
      runTransition: c,
    } = e,
    [u, d] = wt(),
    [f, v] = wt(),
    m = se(d, t),
    g = _t(e.container),
    y = _t(e.target),
    [h, E] = l.useState(!e.show),
    C = Ur(
      y,
      u,
      _r({
        placement: o,
        enableEvents: !!e.show,
        containerPadding: a || 5,
        flip: n,
        offset: r,
        arrowElement: f,
        popperConfig: s,
      }),
    );
  e.show && h && E(!1);
  const x = (...T) => {
      E(!0), e.onExited && e.onExited(...T);
    },
    b = e.show || !h;
  if (
    (Xi(u, e.onHide, {
      disabled: !e.rootClose || e.rootCloseDisabled,
      clickTrigger: e.rootCloseEvent,
    }),
    !b)
  )
    return null;
  const { onExit: R, onExiting: w, onEnter: $, onEntering: j, onEntered: A } = e;
  let S = e.children(Object.assign({}, C.attributes.popper, { style: C.styles.popper, ref: m }), {
    popper: C,
    placement: o,
    show: !!e.show,
    arrowProps: Object.assign({}, C.attributes.arrow, { style: C.styles.arrow, ref: v }),
  });
  return (
    (S = Gt(i, c, {
      in: !!e.show,
      appear: !0,
      mountOnEnter: !0,
      unmountOnExit: !0,
      children: S,
      onExit: R,
      onExiting: w,
      onExited: x,
      onEnter: $,
      onEntering: j,
      onEntered: A,
    })),
    g ? Se.createPortal(S, g) : null
  );
});
Fo.displayName = "Overlay";
const Lo = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "popover-header")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
Lo.displayName = "PopoverHeader";
const Tn = l.forwardRef(
  ({ className: e, bsPrefix: t, as: n = "div", ...r }, o) => (
    (t = N(t, "popover-body")), p.jsx(n, { ref: o, className: O(e, t), ...r })
  ),
);
Tn.displayName = "PopoverBody";
function Po(e, t) {
  let n = e;
  return e === "left" ? (n = t ? "end" : "start") : e === "right" && (n = t ? "start" : "end"), n;
}
function Wo(e = "absolute") {
  return { position: e, top: "0", left: "0", opacity: "0", pointerEvents: "none" };
}
const qi = l.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t = "right",
        className: n,
        style: r,
        children: o,
        body: a,
        arrowProps: s,
        hasDoneInitialMeasure: i,
        popper: c,
        show: u,
        ...d
      },
      f,
    ) => {
      const v = N(e, "popover"),
        m = Ot(),
        [g] = (t == null ? void 0 : t.split("-")) || [],
        y = Po(g, m);
      let h = r;
      return (
        u && !i && (h = { ...r, ...Wo(c == null ? void 0 : c.strategy) }),
        p.jsxs("div", {
          ref: f,
          role: "tooltip",
          style: h,
          "x-placement": g,
          className: O(n, v, g && `bs-popover-${y}`),
          ...d,
          children: [
            p.jsx("div", { className: "popover-arrow", ...s }),
            a ? p.jsx(Tn, { children: o }) : o,
          ],
        })
      );
    },
  ),
  zi = Object.assign(qi, { Header: Lo, Body: Tn, POPPER_OFFSET: [0, 8] }),
  Ho = l.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t = "right",
        className: n,
        style: r,
        children: o,
        arrowProps: a,
        hasDoneInitialMeasure: s,
        popper: i,
        show: c,
        ...u
      },
      d,
    ) => {
      e = N(e, "tooltip");
      const f = Ot(),
        [v] = (t == null ? void 0 : t.split("-")) || [],
        m = Po(v, f);
      let g = r;
      return (
        c && !s && (g = { ...r, ...Wo(i == null ? void 0 : i.strategy) }),
        p.jsxs("div", {
          ref: d,
          style: g,
          role: "tooltip",
          "x-placement": v,
          className: O(n, e, `bs-tooltip-${m}`),
          ...u,
          children: [
            p.jsx("div", { className: "tooltip-arrow", ...a }),
            p.jsx("div", { className: `${e}-inner`, children: o }),
          ],
        })
      );
    },
  );
Ho.displayName = "Tooltip";
const Yi = Object.assign(Ho, { TOOLTIP_OFFSET: [0, 6] });
function Zi(e) {
  const t = l.useRef(null),
    n = N(void 0, "popover"),
    r = N(void 0, "tooltip"),
    o = l.useMemo(
      () => ({
        name: "offset",
        options: {
          offset: () => {
            if (e) return e;
            if (t.current) {
              if (Xt(t.current, n)) return zi.POPPER_OFFSET;
              if (Xt(t.current, r)) return Yi.TOOLTIP_OFFSET;
            }
            return [0, 0];
          },
        },
      }),
      [e, n, r],
    );
  return [t, [o]];
}
function Ji(e, t) {
  const { ref: n } = e,
    { ref: r } = t;
  (e.ref = n.__wrapped || (n.__wrapped = (o) => n(yt(o)))),
    (t.ref = r.__wrapped || (r.__wrapped = (o) => r(yt(o))));
}
const Ko = l.forwardRef(
  (
    {
      children: e,
      transition: t = Qe,
      popperConfig: n = {},
      rootClose: r = !1,
      placement: o = "top",
      show: a = !1,
      ...s
    },
    i,
  ) => {
    const c = l.useRef({}),
      [u, d] = l.useState(null),
      [f, v] = Zi(s.offset),
      m = se(i, f),
      g = t === !0 ? Qe : t || void 0,
      y = H((h) => {
        d(h), n == null || n.onFirstUpdate == null || n.onFirstUpdate(h);
      });
    return (
      xt(() => {
        u && s.target && (c.current.scheduleUpdate == null || c.current.scheduleUpdate());
      }, [u, s.target]),
      l.useEffect(() => {
        a || d(null);
      }, [a]),
      p.jsx(Fo, {
        ...s,
        ref: m,
        popperConfig: { ...n, modifiers: v.concat(n.modifiers || []), onFirstUpdate: y },
        transition: g,
        rootClose: r,
        placement: o,
        show: a,
        children: (h, { arrowProps: E, popper: C, show: x }) => {
          var b, R;
          Ji(h, E);
          const w = C == null ? void 0 : C.placement,
            $ = Object.assign(c.current, {
              state: C == null ? void 0 : C.state,
              scheduleUpdate: C == null ? void 0 : C.update,
              placement: w,
              outOfBoundaries:
                (C == null || (b = C.state) == null || (R = b.modifiersData.hide) == null
                  ? void 0
                  : R.isReferenceHidden) || !1,
              strategy: n.strategy,
            }),
            j = !!u;
          return typeof e == "function"
            ? e({
                ...h,
                placement: w,
                show: x,
                ...(!t && x && { className: "show" }),
                popper: $,
                arrowProps: E,
                hasDoneInitialMeasure: j,
              })
            : l.cloneElement(e, {
                ...h,
                placement: w,
                arrowProps: E,
                popper: $,
                hasDoneInitialMeasure: j,
                className: O(e.props.className, !t && x && "show"),
                style: { ...e.props.style, ...h.style },
              });
        },
      })
    );
  },
);
Ko.displayName = "Overlay";
function Qi(e) {
  return e && typeof e == "object" ? e : { show: e, hide: e };
}
function tr(e, t, n) {
  const [r] = t,
    o = r.currentTarget,
    a = r.relatedTarget || r.nativeEvent[n];
  (!a || a !== o) && !nt(o, a) && e(...t);
}
M.oneOf(["click", "hover", "focus"]);
const ml = ({
    trigger: e = ["hover", "focus"],
    overlay: t,
    children: n,
    popperConfig: r = {},
    show: o,
    defaultShow: a = !1,
    onToggle: s,
    delay: i,
    placement: c,
    flip: u = c && c.indexOf("auto") !== -1,
    ...d
  }) => {
    const f = l.useRef(null),
      v = se(f, n.ref),
      m = ka(),
      g = l.useRef(""),
      [y, h] = ir(o, a, s),
      E = Qi(i),
      {
        onFocus: C,
        onBlur: x,
        onClick: b,
      } = typeof n != "function" ? l.Children.only(n).props : {},
      R = (F) => {
        v(yt(F));
      },
      w = l.useCallback(() => {
        if ((m.clear(), (g.current = "show"), !E.show)) {
          h(!0);
          return;
        }
        m.set(() => {
          g.current === "show" && h(!0);
        }, E.show);
      }, [E.show, h, m]),
      $ = l.useCallback(() => {
        if ((m.clear(), (g.current = "hide"), !E.hide)) {
          h(!1);
          return;
        }
        m.set(() => {
          g.current === "hide" && h(!1);
        }, E.hide);
      }, [E.hide, h, m]),
      j = l.useCallback(
        (...F) => {
          w(), C == null || C(...F);
        },
        [w, C],
      ),
      A = l.useCallback(
        (...F) => {
          $(), x == null || x(...F);
        },
        [$, x],
      ),
      S = l.useCallback(
        (...F) => {
          h(!y), b == null || b(...F);
        },
        [b, h, y],
      ),
      T = l.useCallback(
        (...F) => {
          tr(w, F, "fromElement");
        },
        [w],
      ),
      k = l.useCallback(
        (...F) => {
          tr($, F, "toElement");
        },
        [$],
      ),
      D = e == null ? [] : [].concat(e),
      B = { ref: R };
    return (
      D.indexOf("click") !== -1 && (B.onClick = S),
      D.indexOf("focus") !== -1 && ((B.onFocus = j), (B.onBlur = A)),
      D.indexOf("hover") !== -1 && ((B.onMouseOver = T), (B.onMouseOut = k)),
      p.jsxs(p.Fragment, {
        children: [
          typeof n == "function" ? n(B) : l.cloneElement(n, B),
          p.jsx(Ko, {
            ...d,
            show: y,
            onHide: $,
            flip: u,
            placement: c,
            popperConfig: r,
            target: f.current,
            children: t,
          }),
        ],
      })
    );
  },
  nr = 1e3;
function el(e, t, n) {
  const r = ((e - t) / (n - t)) * 100;
  return Math.round(r * nr) / nr;
}
function rr(
  {
    min: e,
    now: t,
    max: n,
    label: r,
    visuallyHidden: o,
    striped: a,
    animated: s,
    className: i,
    style: c,
    variant: u,
    bsPrefix: d,
    ...f
  },
  v,
) {
  return p.jsx("div", {
    ref: v,
    ...f,
    role: "progressbar",
    className: O(i, `${d}-bar`, {
      [`bg-${u}`]: u,
      [`${d}-bar-animated`]: s,
      [`${d}-bar-striped`]: s || a,
    }),
    style: { width: `${el(t, e, n)}%`, ...c },
    "aria-valuenow": t,
    "aria-valuemin": e,
    "aria-valuemax": n,
    children: o ? p.jsx("span", { className: "visually-hidden", children: r }) : r,
  });
}
const tl = l.forwardRef(({ isChild: e = !1, ...t }, n) => {
  const r = { min: 0, max: 100, animated: !1, visuallyHidden: !1, striped: !1, ...t };
  if (((r.bsPrefix = N(r.bsPrefix, "progress")), e)) return rr(r, n);
  const {
    min: o,
    now: a,
    max: s,
    label: i,
    visuallyHidden: c,
    striped: u,
    animated: d,
    bsPrefix: f,
    variant: v,
    className: m,
    children: g,
    ...y
  } = r;
  return p.jsx("div", {
    ref: n,
    ...y,
    className: O(m, f),
    children: g
      ? Da(g, (h) => l.cloneElement(h, { isChild: !0 }))
      : rr(
          {
            min: o,
            now: a,
            max: s,
            label: i,
            visuallyHidden: c,
            striped: u,
            animated: d,
            bsPrefix: f,
            variant: v,
          },
          n,
        ),
  });
});
tl.displayName = "ProgressBar";
const nl = l.forwardRef(({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
  const a = N(e, "row"),
    s = lr(),
    i = cr(),
    c = `${a}-cols`,
    u = [];
  return (
    s.forEach((d) => {
      const f = r[d];
      delete r[d];
      let v;
      f != null && typeof f == "object" ? ({ cols: v } = f) : (v = f);
      const m = d !== i ? `-${d}` : "";
      v != null && u.push(`${c}${m}-${v}`);
    }),
    p.jsx(n, { ref: o, ...r, className: O(t, a, ...u) })
  );
});
nl.displayName = "Row";
const rl = l.forwardRef(
  (
    {
      bsPrefix: e,
      variant: t,
      animation: n = "border",
      size: r,
      as: o = "div",
      className: a,
      ...s
    },
    i,
  ) => {
    e = N(e, "spinner");
    const c = `${e}-${n}`;
    return p.jsx(o, { ref: i, ...s, className: O(a, c, r && `${c}-${r}`, t && `text-${t}`) });
  },
);
rl.displayName = "Spinner";
const ol = {
    id: M.string,
    toggleLabel: M.string,
    href: M.string,
    target: M.string,
    onClick: M.func,
    title: M.node.isRequired,
    type: M.string,
    disabled: M.bool,
    align: gi,
    menuRole: M.string,
    renderMenuOnMount: M.bool,
    rootCloseEvent: M.string,
    flip: M.bool,
    bsPrefix: M.string,
    variant: M.string,
    size: M.string,
  },
  Uo = l.forwardRef(
    (
      {
        id: e,
        bsPrefix: t,
        size: n,
        variant: r,
        title: o,
        type: a = "button",
        toggleLabel: s = "Toggle dropdown",
        children: i,
        onClick: c,
        href: u,
        target: d,
        menuRole: f,
        renderMenuOnMount: v,
        rootCloseEvent: m,
        flip: g,
        ...y
      },
      h,
    ) =>
      p.jsxs(re, {
        ref: h,
        ...y,
        as: br,
        children: [
          p.jsx(an, {
            size: n,
            variant: r,
            disabled: y.disabled,
            bsPrefix: t,
            href: u,
            target: d,
            onClick: c,
            type: a,
            children: o,
          }),
          p.jsx(re.Toggle, {
            split: !0,
            id: e,
            size: n,
            variant: r,
            disabled: y.disabled,
            childBsPrefix: t,
            children: p.jsx("span", { className: "visually-hidden", children: s }),
          }),
          p.jsx(re.Menu, { role: f, renderOnMount: v, rootCloseEvent: m, flip: g, children: i }),
        ],
      }),
  );
Uo.propTypes = ol;
Uo.displayName = "SplitButton";
const hl = l.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      striped: n,
      bordered: r,
      borderless: o,
      hover: a,
      size: s,
      variant: i,
      responsive: c,
      ...u
    },
    d,
  ) => {
    const f = N(e, "table"),
      v = O(
        t,
        f,
        i && `${f}-${i}`,
        s && `${f}-${s}`,
        n && `${f}-${typeof n == "string" ? `striped-${n}` : "striped"}`,
        r && `${f}-bordered`,
        o && `${f}-borderless`,
        a && `${f}-hover`,
      ),
      m = p.jsx("table", { ...u, className: v, ref: d });
    if (c) {
      let g = `${f}-responsive`;
      return typeof c == "string" && (g = `${g}-${c}`), p.jsx("div", { className: g, children: m });
    }
    return m;
  },
);
export {
  ll as A,
  an as B,
  cl as C,
  re as D,
  dl as F,
  co as I,
  fl as M,
  pl as N,
  ml as O,
  zi as P,
  nl as R,
  Uo as S,
  hl as T,
  sr as _,
  br as a,
  Na as b,
  Yi as c,
  vl as d,
  Dr as e,
  $a as f,
  xi as g,
  rl as h,
  On as i,
  ul as j,
  tl as k,
};
//# sourceMappingURL=@bootstrap-libs-DZc4rDL4.js.map
