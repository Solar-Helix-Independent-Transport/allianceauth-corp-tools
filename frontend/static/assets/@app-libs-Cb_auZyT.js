function X3(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const i in r)
        if (i !== "default" && !(i in e)) {
          const a = Object.getOwnPropertyDescriptor(r, i);
          a && Object.defineProperty(e, i, a.get ? a : { enumerable: !0, get: () => r[i] });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var wu =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function gt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fy = { exports: {} },
  _l = {},
  Dy = { exports: {} },
  ue = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Xo = Symbol.for("react.element"),
  Z3 = Symbol.for("react.portal"),
  J3 = Symbol.for("react.fragment"),
  e4 = Symbol.for("react.strict_mode"),
  t4 = Symbol.for("react.profiler"),
  n4 = Symbol.for("react.provider"),
  r4 = Symbol.for("react.context"),
  i4 = Symbol.for("react.forward_ref"),
  a4 = Symbol.for("react.suspense"),
  o4 = Symbol.for("react.memo"),
  u4 = Symbol.for("react.lazy"),
  om = Symbol.iterator;
function s4(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (om && e[om]) || e["@@iterator"]), typeof e == "function" ? e : null);
}
var Ny = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Iy = Object.assign,
  Ly = {};
function fa(e, t, n) {
  (this.props = e), (this.context = t), (this.refs = Ly), (this.updater = n || Ny);
}
fa.prototype.isReactComponent = {};
fa.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
fa.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function jy() {}
jy.prototype = fa.prototype;
function jh(e, t, n) {
  (this.props = e), (this.context = t), (this.refs = Ly), (this.updater = n || Ny);
}
var Uh = (jh.prototype = new jy());
Uh.constructor = jh;
Iy(Uh, fa.prototype);
Uh.isPureReactComponent = !0;
var um = Array.isArray,
  Uy = Object.prototype.hasOwnProperty,
  zh = { current: null },
  zy = { key: !0, ref: !0, __self: !0, __source: !0 };
function Wy(e, t, n) {
  var r,
    i = {},
    a = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (a = "" + t.key), t))
      Uy.call(t, r) && !zy.hasOwnProperty(r) && (i[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) i.children = n;
  else if (1 < u) {
    for (var s = Array(u), l = 0; l < u; l++) s[l] = arguments[l + 2];
    i.children = s;
  }
  if (e && e.defaultProps) for (r in ((u = e.defaultProps), u)) i[r] === void 0 && (i[r] = u[r]);
  return { $$typeof: Xo, type: e, key: a, ref: o, props: i, _owner: zh.current };
}
function l4(e, t) {
  return { $$typeof: Xo, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Wh(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Xo;
}
function f4(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var sm = /\/+/g;
function Gf(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? f4("" + e.key) : t.toString(36);
}
function Gu(e, t, n, r, i) {
  var a = typeof e;
  (a === "undefined" || a === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (a) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Xo:
          case Z3:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (i = i(o)),
      (e = r === "" ? "." + Gf(o, 0) : r),
      um(i)
        ? ((n = ""),
          e != null && (n = e.replace(sm, "$&/") + "/"),
          Gu(i, t, n, "", function (l) {
            return l;
          }))
        : i != null &&
          (Wh(i) &&
            (i = l4(
              i,
              n +
                (!i.key || (o && o.key === i.key) ? "" : ("" + i.key).replace(sm, "$&/") + "/") +
                e,
            )),
          t.push(i)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), um(e)))
    for (var u = 0; u < e.length; u++) {
      a = e[u];
      var s = r + Gf(a, u);
      o += Gu(a, t, n, s, i);
    }
  else if (((s = s4(e)), typeof s == "function"))
    for (e = s.call(e), u = 0; !(a = e.next()).done; )
      (a = a.value), (s = r + Gf(a, u++)), (o += Gu(a, t, n, s, i));
  else if (a === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) +
          "). If you meant to render a collection of children, use an array instead.",
      ))
    );
  return o;
}
function xu(e, t, n) {
  if (e == null) return e;
  var r = [],
    i = 0;
  return (
    Gu(e, r, "", "", function (a) {
      return t.call(n, a, i++);
    }),
    r
  );
}
function c4(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var yt = { current: null },
  Ku = { transition: null },
  d4 = { ReactCurrentDispatcher: yt, ReactCurrentBatchConfig: Ku, ReactCurrentOwner: zh };
ue.Children = {
  map: xu,
  forEach: function (e, t, n) {
    xu(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      xu(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      xu(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Wh(e))
      throw Error("React.Children.only expected to receive a single React element child.");
    return e;
  },
};
ue.Component = fa;
ue.Fragment = J3;
ue.Profiler = t4;
ue.PureComponent = jh;
ue.StrictMode = e4;
ue.Suspense = a4;
ue.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = d4;
ue.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " + e + ".",
    );
  var r = Iy({}, e.props),
    i = e.key,
    a = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((a = t.ref), (o = zh.current)),
      t.key !== void 0 && (i = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var u = e.type.defaultProps;
    for (s in t)
      Uy.call(t, s) &&
        !zy.hasOwnProperty(s) &&
        (r[s] = t[s] === void 0 && u !== void 0 ? u[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    u = Array(s);
    for (var l = 0; l < s; l++) u[l] = arguments[l + 2];
    r.children = u;
  }
  return { $$typeof: Xo, type: e.type, key: i, ref: a, props: r, _owner: o };
};
ue.createContext = function (e) {
  return (
    (e = {
      $$typeof: r4,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: n4, _context: e }),
    (e.Consumer = e)
  );
};
ue.createElement = Wy;
ue.createFactory = function (e) {
  var t = Wy.bind(null, e);
  return (t.type = e), t;
};
ue.createRef = function () {
  return { current: null };
};
ue.forwardRef = function (e) {
  return { $$typeof: i4, render: e };
};
ue.isValidElement = Wh;
ue.lazy = function (e) {
  return { $$typeof: u4, _payload: { _status: -1, _result: e }, _init: c4 };
};
ue.memo = function (e, t) {
  return { $$typeof: o4, type: e, compare: t === void 0 ? null : t };
};
ue.startTransition = function (e) {
  var t = Ku.transition;
  Ku.transition = {};
  try {
    e();
  } finally {
    Ku.transition = t;
  }
};
ue.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
ue.useCallback = function (e, t) {
  return yt.current.useCallback(e, t);
};
ue.useContext = function (e) {
  return yt.current.useContext(e);
};
ue.useDebugValue = function () {};
ue.useDeferredValue = function (e) {
  return yt.current.useDeferredValue(e);
};
ue.useEffect = function (e, t) {
  return yt.current.useEffect(e, t);
};
ue.useId = function () {
  return yt.current.useId();
};
ue.useImperativeHandle = function (e, t, n) {
  return yt.current.useImperativeHandle(e, t, n);
};
ue.useInsertionEffect = function (e, t) {
  return yt.current.useInsertionEffect(e, t);
};
ue.useLayoutEffect = function (e, t) {
  return yt.current.useLayoutEffect(e, t);
};
ue.useMemo = function (e, t) {
  return yt.current.useMemo(e, t);
};
ue.useReducer = function (e, t, n) {
  return yt.current.useReducer(e, t, n);
};
ue.useRef = function (e) {
  return yt.current.useRef(e);
};
ue.useState = function (e) {
  return yt.current.useState(e);
};
ue.useSyncExternalStore = function (e, t, n) {
  return yt.current.useSyncExternalStore(e, t, n);
};
ue.useTransition = function () {
  return yt.current.useTransition();
};
ue.version = "18.2.0";
Dy.exports = ue;
var A = Dy.exports;
const ze = gt(A),
  PB = X3({ __proto__: null, default: ze }, [A]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var h4 = A,
  p4 = Symbol.for("react.element"),
  m4 = Symbol.for("react.fragment"),
  v4 = Object.prototype.hasOwnProperty,
  g4 = h4.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  y4 = { key: !0, ref: !0, __self: !0, __source: !0 };
function qy(e, t, n) {
  var r,
    i = {},
    a = null,
    o = null;
  n !== void 0 && (a = "" + n),
    t.key !== void 0 && (a = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (r in t) v4.call(t, r) && !y4.hasOwnProperty(r) && (i[r] = t[r]);
  if (e && e.defaultProps) for (r in ((t = e.defaultProps), t)) i[r] === void 0 && (i[r] = t[r]);
  return { $$typeof: p4, type: e, key: a, ref: o, props: i, _owner: g4.current };
}
_l.Fragment = m4;
_l.jsx = qy;
_l.jsxs = qy;
Fy.exports = _l;
var B = Fy.exports;
function me() {
  return (
    (me = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    me.apply(this, arguments)
  );
}
function Xc(e, t) {
  return (
    (Xc = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, i) {
          return (r.__proto__ = i), r;
        }),
    Xc(e, t)
  );
}
function Zo(e, t) {
  (e.prototype = Object.create(t.prototype)), (e.prototype.constructor = e), Xc(e, t);
}
var Hy = { exports: {} },
  b4 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  _4 = b4,
  w4 = _4;
function By() {}
function Vy() {}
Vy.resetWarningCache = By;
var x4 = function () {
  function e(r, i, a, o, u, s) {
    if (s !== w4) {
      var l = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
      );
      throw ((l.name = "Invariant Violation"), l);
    }
  }
  e.isRequired = e;
  function t() {
    return e;
  }
  var n = {
    array: e,
    bigint: e,
    bool: e,
    func: e,
    number: e,
    object: e,
    string: e,
    symbol: e,
    any: e,
    arrayOf: t,
    element: e,
    elementType: e,
    instanceOf: t,
    node: e,
    objectOf: t,
    oneOf: t,
    oneOfType: t,
    shape: t,
    exact: t,
    checkPropTypes: Vy,
    resetWarningCache: By,
  };
  return (n.PropTypes = n), n;
};
Hy.exports = x4();
var S4 = Hy.exports;
const C = gt(S4);
var Qy = { exports: {} },
  Nt = {},
  Yy = { exports: {} },
  Gy = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(P, O) {
    var W = P.length;
    P.push(O);
    e: for (; 0 < W; ) {
      var K = (W - 1) >>> 1,
        X = P[K];
      if (0 < i(X, O)) (P[K] = O), (P[W] = X), (W = K);
      else break e;
    }
  }
  function n(P) {
    return P.length === 0 ? null : P[0];
  }
  function r(P) {
    if (P.length === 0) return null;
    var O = P[0],
      W = P.pop();
    if (W !== O) {
      P[0] = W;
      e: for (var K = 0, X = P.length, Oe = X >>> 1; K < Oe; ) {
        var ve = 2 * (K + 1) - 1,
          se = P[ve],
          oe = ve + 1,
          te = P[oe];
        if (0 > i(se, W))
          oe < X && 0 > i(te, se)
            ? ((P[K] = te), (P[oe] = W), (K = oe))
            : ((P[K] = se), (P[ve] = W), (K = ve));
        else if (oe < X && 0 > i(te, W)) (P[K] = te), (P[oe] = W), (K = oe);
        else break e;
      }
    }
    return O;
  }
  function i(P, O) {
    var W = P.sortIndex - O.sortIndex;
    return W !== 0 ? W : P.id - O.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var a = performance;
    e.unstable_now = function () {
      return a.now();
    };
  } else {
    var o = Date,
      u = o.now();
    e.unstable_now = function () {
      return o.now() - u;
    };
  }
  var s = [],
    l = [],
    f = 1,
    c = null,
    d = 3,
    p = !1,
    g = !1,
    y = !1,
    b = typeof setTimeout == "function" ? setTimeout : null,
    h = typeof clearTimeout == "function" ? clearTimeout : null,
    m = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function v(P) {
    for (var O = n(l); O !== null; ) {
      if (O.callback === null) r(l);
      else if (O.startTime <= P) r(l), (O.sortIndex = O.expirationTime), t(s, O);
      else break;
      O = n(l);
    }
  }
  function _(P) {
    if (((y = !1), v(P), !g))
      if (n(s) !== null) (g = !0), z(S);
      else {
        var O = n(l);
        O !== null && H(_, O.startTime - P);
      }
  }
  function S(P, O) {
    (g = !1), y && ((y = !1), h(k), (k = -1)), (p = !0);
    var W = d;
    try {
      for (v(O), c = n(s); c !== null && (!(c.expirationTime > O) || (P && !E())); ) {
        var K = c.callback;
        if (typeof K == "function") {
          (c.callback = null), (d = c.priorityLevel);
          var X = K(c.expirationTime <= O);
          (O = e.unstable_now()),
            typeof X == "function" ? (c.callback = X) : c === n(s) && r(s),
            v(O);
        } else r(s);
        c = n(s);
      }
      if (c !== null) var Oe = !0;
      else {
        var ve = n(l);
        ve !== null && H(_, ve.startTime - O), (Oe = !1);
      }
      return Oe;
    } finally {
      (c = null), (d = W), (p = !1);
    }
  }
  var w = !1,
    T = null,
    k = -1,
    j = 5,
    R = -1;
  function E() {
    return !(e.unstable_now() - R < j);
  }
  function q() {
    if (T !== null) {
      var P = e.unstable_now();
      R = P;
      var O = !0;
      try {
        O = T(!0, P);
      } finally {
        O ? I() : ((w = !1), (T = null));
      }
    } else w = !1;
  }
  var I;
  if (typeof m == "function")
    I = function () {
      m(q);
    };
  else if (typeof MessageChannel < "u") {
    var F = new MessageChannel(),
      D = F.port2;
    (F.port1.onmessage = q),
      (I = function () {
        D.postMessage(null);
      });
  } else
    I = function () {
      b(q, 0);
    };
  function z(P) {
    (T = P), w || ((w = !0), I());
  }
  function H(P, O) {
    k = b(function () {
      P(e.unstable_now());
    }, O);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (P) {
      P.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      g || p || ((g = !0), z(S));
    }),
    (e.unstable_forceFrameRate = function (P) {
      0 > P || 125 < P
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (j = 0 < P ? Math.floor(1e3 / P) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return d;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(s);
    }),
    (e.unstable_next = function (P) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = d;
      }
      var W = d;
      d = O;
      try {
        return P();
      } finally {
        d = W;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (P, O) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var W = d;
      d = P;
      try {
        return O();
      } finally {
        d = W;
      }
    }),
    (e.unstable_scheduleCallback = function (P, O, W) {
      var K = e.unstable_now();
      switch (
        (typeof W == "object" && W !== null
          ? ((W = W.delay), (W = typeof W == "number" && 0 < W ? K + W : K))
          : (W = K),
        P)
      ) {
        case 1:
          var X = -1;
          break;
        case 2:
          X = 250;
          break;
        case 5:
          X = 1073741823;
          break;
        case 4:
          X = 1e4;
          break;
        default:
          X = 5e3;
      }
      return (
        (X = W + X),
        (P = {
          id: f++,
          callback: O,
          priorityLevel: P,
          startTime: W,
          expirationTime: X,
          sortIndex: -1,
        }),
        W > K
          ? ((P.sortIndex = W),
            t(l, P),
            n(s) === null && P === n(l) && (y ? (h(k), (k = -1)) : (y = !0), H(_, W - K)))
          : ((P.sortIndex = X), t(s, P), g || p || ((g = !0), z(S))),
        P
      );
    }),
    (e.unstable_shouldYield = E),
    (e.unstable_wrapCallback = function (P) {
      var O = d;
      return function () {
        var W = d;
        d = O;
        try {
          return P.apply(this, arguments);
        } finally {
          d = W;
        }
      };
    });
})(Gy);
Yy.exports = Gy;
var $4 = Yy.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ky = A,
  Dt = $4;
function U(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Xy = new Set(),
  vo = {};
function ai(e, t) {
  Qi(e, t), Qi(e + "Capture", t);
}
function Qi(e, t) {
  for (vo[e] = t, e = 0; e < t.length; e++) Xy.add(t[e]);
}
var zn = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Zc = Object.prototype.hasOwnProperty,
  T4 =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  lm = {},
  fm = {};
function C4(e) {
  return Zc.call(fm, e) ? !0 : Zc.call(lm, e) ? !1 : T4.test(e) ? (fm[e] = !0) : ((lm[e] = !0), !1);
}
function k4(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function O4(e, t, n, r) {
  if (t === null || typeof t > "u" || k4(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function bt(e, t, n, r, i, a, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = a),
    (this.removeEmptyString = o);
}
var at = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    at[e] = new bt(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  at[t] = new bt(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  at[e] = new bt(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
  at[e] = new bt(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    at[e] = new bt(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  at[e] = new bt(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  at[e] = new bt(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  at[e] = new bt(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  at[e] = new bt(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var qh = /[\-:]([a-z])/g;
function Hh(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(qh, Hh);
    at[t] = new bt(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(qh, Hh);
    at[t] = new bt(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(qh, Hh);
  at[t] = new bt(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  at[e] = new bt(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
at.xlinkHref = new bt("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function (e) {
  at[e] = new bt(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Bh(e, t, n, r) {
  var i = at.hasOwnProperty(t) ? at[t] : null;
  (i !== null
    ? i.type !== 0
    : r || !(2 < t.length) || (t[0] !== "o" && t[0] !== "O") || (t[1] !== "n" && t[1] !== "N")) &&
    (O4(t, n, i, r) && (n = null),
    r || i === null
      ? C4(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : i.mustUseProperty
        ? (e[i.propertyName] = n === null ? (i.type === 3 ? !1 : "") : n)
        : ((t = i.attributeName),
          (r = i.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((i = i.type),
              (n = i === 3 || (i === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Yn = Ky.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Su = Symbol.for("react.element"),
  xi = Symbol.for("react.portal"),
  Si = Symbol.for("react.fragment"),
  Vh = Symbol.for("react.strict_mode"),
  Jc = Symbol.for("react.profiler"),
  Zy = Symbol.for("react.provider"),
  Jy = Symbol.for("react.context"),
  Qh = Symbol.for("react.forward_ref"),
  ed = Symbol.for("react.suspense"),
  td = Symbol.for("react.suspense_list"),
  Yh = Symbol.for("react.memo"),
  nr = Symbol.for("react.lazy"),
  eb = Symbol.for("react.offscreen"),
  cm = Symbol.iterator;
function Ma(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (cm && e[cm]) || e["@@iterator"]), typeof e == "function" ? e : null);
}
var Re = Object.assign,
  Kf;
function Ka(e) {
  if (Kf === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Kf = (t && t[1]) || "";
    }
  return (
    `
` +
    Kf +
    e
  );
}
var Xf = !1;
function Zf(e, t) {
  if (!e || Xf) return "";
  Xf = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (l) {
          var r = l;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (l) {
          r = l;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (l) {
        r = l;
      }
      e();
    }
  } catch (l) {
    if (l && r && typeof l.stack == "string") {
      for (
        var i = l.stack.split(`
`),
          a = r.stack.split(`
`),
          o = i.length - 1,
          u = a.length - 1;
        1 <= o && 0 <= u && i[o] !== a[u];

      )
        u--;
      for (; 1 <= o && 0 <= u; o--, u--)
        if (i[o] !== a[u]) {
          if (o !== 1 || u !== 1)
            do
              if ((o--, u--, 0 > u || i[o] !== a[u])) {
                var s =
                  `
` + i[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    s.includes("<anonymous>") &&
                    (s = s.replace("<anonymous>", e.displayName)),
                  s
                );
              }
            while (1 <= o && 0 <= u);
          break;
        }
    }
  } finally {
    (Xf = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? Ka(e) : "";
}
function M4(e) {
  switch (e.tag) {
    case 5:
      return Ka(e.type);
    case 16:
      return Ka("Lazy");
    case 13:
      return Ka("Suspense");
    case 19:
      return Ka("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Zf(e.type, !1)), e;
    case 11:
      return (e = Zf(e.type.render, !1)), e;
    case 1:
      return (e = Zf(e.type, !0)), e;
    default:
      return "";
  }
}
function nd(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Si:
      return "Fragment";
    case xi:
      return "Portal";
    case Jc:
      return "Profiler";
    case Vh:
      return "StrictMode";
    case ed:
      return "Suspense";
    case td:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Jy:
        return (e.displayName || "Context") + ".Consumer";
      case Zy:
        return (e._context.displayName || "Context") + ".Provider";
      case Qh:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Yh:
        return (t = e.displayName || null), t !== null ? t : nd(e.type) || "Memo";
      case nr:
        (t = e._payload), (e = e._init);
        try {
          return nd(e(t));
        } catch {}
    }
  return null;
}
function P4(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return nd(t);
    case 8:
      return t === Vh ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function br(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function tb(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function E4(e) {
  var t = tb(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var i = n.get,
      a = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return i.call(this);
        },
        set: function (o) {
          (r = "" + o), a.call(this, o);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function $u(e) {
  e._valueTracker || (e._valueTracker = E4(e));
}
function nb(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = tb(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function ps(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")) return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function rd(e, t) {
  var n = t.checked;
  return Re({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function dm(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = br(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null,
    });
}
function rb(e, t) {
  (t = t.checked), t != null && Bh(e, "checked", t, !1);
}
function id(e, t) {
  rb(e, t);
  var n = br(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? ad(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && ad(e, t.type, br(t.defaultValue)),
    t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function hm(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!((r !== "submit" && r !== "reset") || (t.value !== void 0 && t.value !== null))) return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function ad(e, t, n) {
  (t !== "number" || ps(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Xa = Array.isArray;
function Ni(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
    for (n = 0; n < e.length; n++)
      (i = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== i && (e[n].selected = i),
        i && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + br(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        (e[i].selected = !0), r && (e[i].defaultSelected = !0);
        return;
      }
      t !== null || e[i].disabled || (t = e[i]);
    }
    t !== null && (t.selected = !0);
  }
}
function od(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(U(91));
  return Re({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function pm(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(U(92));
      if (Xa(n)) {
        if (1 < n.length) throw Error(U(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: br(n) };
}
function ib(e, t) {
  var n = br(t.value),
    r = br(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function mm(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function ab(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function ud(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? ab(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Tu,
  ob = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, i);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (
        Tu = Tu || document.createElement("div"),
          Tu.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Tu.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function go(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var to = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  A4 = ["Webkit", "ms", "Moz", "O"];
Object.keys(to).forEach(function (e) {
  A4.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (to[t] = to[e]);
  });
});
function ub(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (to.hasOwnProperty(e) && to[e])
      ? ("" + t).trim()
      : t + "px";
}
function sb(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        i = ub(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, i) : (e[n] = i);
    }
}
var R4 = Re(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function sd(e, t) {
  if (t) {
    if (R4[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(U(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(U(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML))
        throw Error(U(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(U(62));
  }
}
function ld(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var fd = null;
function Gh(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var cd = null,
  Ii = null,
  Li = null;
function vm(e) {
  if ((e = tu(e))) {
    if (typeof cd != "function") throw Error(U(280));
    var t = e.stateNode;
    t && ((t = Tl(t)), cd(e.stateNode, e.type, t));
  }
}
function lb(e) {
  Ii ? (Li ? Li.push(e) : (Li = [e])) : (Ii = e);
}
function fb() {
  if (Ii) {
    var e = Ii,
      t = Li;
    if (((Li = Ii = null), vm(e), t)) for (e = 0; e < t.length; e++) vm(t[e]);
  }
}
function cb(e, t) {
  return e(t);
}
function db() {}
var Jf = !1;
function hb(e, t, n) {
  if (Jf) return e(t, n);
  Jf = !0;
  try {
    return cb(e, t, n);
  } finally {
    (Jf = !1), (Ii !== null || Li !== null) && (db(), fb());
  }
}
function yo(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Tl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(e === "button" || e === "input" || e === "select" || e === "textarea"))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(U(231, t, typeof n));
  return n;
}
var dd = !1;
if (zn)
  try {
    var Pa = {};
    Object.defineProperty(Pa, "passive", {
      get: function () {
        dd = !0;
      },
    }),
      window.addEventListener("test", Pa, Pa),
      window.removeEventListener("test", Pa, Pa);
  } catch {
    dd = !1;
  }
function F4(e, t, n, r, i, a, o, u, s) {
  var l = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, l);
  } catch (f) {
    this.onError(f);
  }
}
var no = !1,
  ms = null,
  vs = !1,
  hd = null,
  D4 = {
    onError: function (e) {
      (no = !0), (ms = e);
    },
  };
function N4(e, t, n, r, i, a, o, u, s) {
  (no = !1), (ms = null), F4.apply(D4, arguments);
}
function I4(e, t, n, r, i, a, o, u, s) {
  if ((N4.apply(this, arguments), no)) {
    if (no) {
      var l = ms;
      (no = !1), (ms = null);
    } else throw Error(U(198));
    vs || ((vs = !0), (hd = l));
  }
}
function oi(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function pb(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
      return t.dehydrated;
  }
  return null;
}
function gm(e) {
  if (oi(e) !== e) throw Error(U(188));
}
function L4(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = oi(e)), t === null)) throw Error(U(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var i = n.return;
    if (i === null) break;
    var a = i.alternate;
    if (a === null) {
      if (((r = i.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === a.child) {
      for (a = i.child; a; ) {
        if (a === n) return gm(i), e;
        if (a === r) return gm(i), t;
        a = a.sibling;
      }
      throw Error(U(188));
    }
    if (n.return !== r.return) (n = i), (r = a);
    else {
      for (var o = !1, u = i.child; u; ) {
        if (u === n) {
          (o = !0), (n = i), (r = a);
          break;
        }
        if (u === r) {
          (o = !0), (r = i), (n = a);
          break;
        }
        u = u.sibling;
      }
      if (!o) {
        for (u = a.child; u; ) {
          if (u === n) {
            (o = !0), (n = a), (r = i);
            break;
          }
          if (u === r) {
            (o = !0), (r = a), (n = i);
            break;
          }
          u = u.sibling;
        }
        if (!o) throw Error(U(189));
      }
    }
    if (n.alternate !== r) throw Error(U(190));
  }
  if (n.tag !== 3) throw Error(U(188));
  return n.stateNode.current === n ? e : t;
}
function mb(e) {
  return (e = L4(e)), e !== null ? vb(e) : null;
}
function vb(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = vb(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var gb = Dt.unstable_scheduleCallback,
  ym = Dt.unstable_cancelCallback,
  j4 = Dt.unstable_shouldYield,
  U4 = Dt.unstable_requestPaint,
  Ie = Dt.unstable_now,
  z4 = Dt.unstable_getCurrentPriorityLevel,
  Kh = Dt.unstable_ImmediatePriority,
  yb = Dt.unstable_UserBlockingPriority,
  gs = Dt.unstable_NormalPriority,
  W4 = Dt.unstable_LowPriority,
  bb = Dt.unstable_IdlePriority,
  wl = null,
  xn = null;
function q4(e) {
  if (xn && typeof xn.onCommitFiberRoot == "function")
    try {
      xn.onCommitFiberRoot(wl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var un = Math.clz32 ? Math.clz32 : V4,
  H4 = Math.log,
  B4 = Math.LN2;
function V4(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((H4(e) / B4) | 0)) | 0;
}
var Cu = 64,
  ku = 4194304;
function Za(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function ys(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    i = e.suspendedLanes,
    a = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var u = o & ~i;
    u !== 0 ? (r = Za(u)) : ((a &= o), a !== 0 && (r = Za(a)));
  } else (o = n & ~i), o !== 0 ? (r = Za(o)) : a !== 0 && (r = Za(a));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & i) &&
    ((i = r & -r), (a = t & -t), i >= a || (i === 16 && (a & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - un(t)), (i = 1 << n), (r |= e[n]), (t &= ~i);
  return r;
}
function Q4(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Y4(e, t) {
  for (
    var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes;
    0 < a;

  ) {
    var o = 31 - un(a),
      u = 1 << o,
      s = i[o];
    s === -1 ? (!(u & n) || u & r) && (i[o] = Q4(u, t)) : s <= t && (e.expiredLanes |= u),
      (a &= ~u);
  }
}
function pd(e) {
  return (e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function _b() {
  var e = Cu;
  return (Cu <<= 1), !(Cu & 4194240) && (Cu = 64), e;
}
function ec(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Jo(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - un(t)),
    (e[t] = n);
}
function G4(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var i = 31 - un(n),
      a = 1 << i;
    (t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~a);
  }
}
function Xh(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - un(n),
      i = 1 << r;
    (i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i);
  }
}
var ge = 0;
function wb(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1;
}
var xb,
  Zh,
  Sb,
  $b,
  Tb,
  md = !1,
  Ou = [],
  fr = null,
  cr = null,
  dr = null,
  bo = new Map(),
  _o = new Map(),
  ir = [],
  K4 =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function bm(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      fr = null;
      break;
    case "dragenter":
    case "dragleave":
      cr = null;
      break;
    case "mouseover":
    case "mouseout":
      dr = null;
      break;
    case "pointerover":
    case "pointerout":
      bo.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      _o.delete(t.pointerId);
  }
}
function Ea(e, t, n, r, i, a) {
  return e === null || e.nativeEvent !== a
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: a,
        targetContainers: [i],
      }),
      t !== null && ((t = tu(t)), t !== null && Zh(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      i !== null && t.indexOf(i) === -1 && t.push(i),
      e);
}
function X4(e, t, n, r, i) {
  switch (t) {
    case "focusin":
      return (fr = Ea(fr, e, t, n, r, i)), !0;
    case "dragenter":
      return (cr = Ea(cr, e, t, n, r, i)), !0;
    case "mouseover":
      return (dr = Ea(dr, e, t, n, r, i)), !0;
    case "pointerover":
      var a = i.pointerId;
      return bo.set(a, Ea(bo.get(a) || null, e, t, n, r, i)), !0;
    case "gotpointercapture":
      return (a = i.pointerId), _o.set(a, Ea(_o.get(a) || null, e, t, n, r, i)), !0;
  }
  return !1;
}
function Cb(e) {
  var t = Dr(e.target);
  if (t !== null) {
    var n = oi(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = pb(n)), t !== null)) {
          (e.blockedOn = t),
            Tb(e.priority, function () {
              Sb(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Xu(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = vd(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (fd = r), n.target.dispatchEvent(r), (fd = null);
    } else return (t = tu(n)), t !== null && Zh(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function _m(e, t, n) {
  Xu(e) && n.delete(t);
}
function Z4() {
  (md = !1),
    fr !== null && Xu(fr) && (fr = null),
    cr !== null && Xu(cr) && (cr = null),
    dr !== null && Xu(dr) && (dr = null),
    bo.forEach(_m),
    _o.forEach(_m);
}
function Aa(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    md || ((md = !0), Dt.unstable_scheduleCallback(Dt.unstable_NormalPriority, Z4)));
}
function wo(e) {
  function t(i) {
    return Aa(i, e);
  }
  if (0 < Ou.length) {
    Aa(Ou[0], e);
    for (var n = 1; n < Ou.length; n++) {
      var r = Ou[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    fr !== null && Aa(fr, e),
      cr !== null && Aa(cr, e),
      dr !== null && Aa(dr, e),
      bo.forEach(t),
      _o.forEach(t),
      n = 0;
    n < ir.length;
    n++
  )
    (r = ir[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < ir.length && ((n = ir[0]), n.blockedOn === null); )
    Cb(n), n.blockedOn === null && ir.shift();
}
var ji = Yn.ReactCurrentBatchConfig,
  bs = !0;
function J4(e, t, n, r) {
  var i = ge,
    a = ji.transition;
  ji.transition = null;
  try {
    (ge = 1), Jh(e, t, n, r);
  } finally {
    (ge = i), (ji.transition = a);
  }
}
function e8(e, t, n, r) {
  var i = ge,
    a = ji.transition;
  ji.transition = null;
  try {
    (ge = 4), Jh(e, t, n, r);
  } finally {
    (ge = i), (ji.transition = a);
  }
}
function Jh(e, t, n, r) {
  if (bs) {
    var i = vd(e, t, n, r);
    if (i === null) fc(e, t, r, _s, n), bm(e, r);
    else if (X4(i, e, t, n, r)) r.stopPropagation();
    else if ((bm(e, r), t & 4 && -1 < K4.indexOf(e))) {
      for (; i !== null; ) {
        var a = tu(i);
        if ((a !== null && xb(a), (a = vd(e, t, n, r)), a === null && fc(e, t, r, _s, n), a === i))
          break;
        i = a;
      }
      i !== null && r.stopPropagation();
    } else fc(e, t, r, null, n);
  }
}
var _s = null;
function vd(e, t, n, r) {
  if (((_s = null), (e = Gh(r)), (e = Dr(e)), e !== null))
    if (((t = oi(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = pb(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (_s = e), null;
}
function kb(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (z4()) {
        case Kh:
          return 1;
        case yb:
          return 4;
        case gs:
        case W4:
          return 16;
        case bb:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var or = null,
  e0 = null,
  Zu = null;
function Ob() {
  if (Zu) return Zu;
  var e,
    t = e0,
    n = t.length,
    r,
    i = "value" in or ? or.value : or.textContent,
    a = i.length;
  for (e = 0; e < n && t[e] === i[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
  return (Zu = i.slice(e, 1 < r ? 1 - r : void 0));
}
function Ju(e) {
  var t = e.keyCode;
  return (
    "charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Mu() {
  return !0;
}
function wm() {
  return !1;
}
function It(e) {
  function t(n, r, i, a, o) {
    (this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = a),
      (this.target = o),
      (this.currentTarget = null);
    for (var u in e) e.hasOwnProperty(u) && ((n = e[u]), (this[u] = n ? n(a) : a[u]));
    return (
      (this.isDefaultPrevented = (
        a.defaultPrevented != null ? a.defaultPrevented : a.returnValue === !1
      )
        ? Mu
        : wm),
      (this.isPropagationStopped = wm),
      this
    );
  }
  return (
    Re(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Mu));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Mu));
      },
      persist: function () {},
      isPersistent: Mu,
    }),
    t
  );
}
var ca = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  t0 = It(ca),
  eu = Re({}, ca, { view: 0, detail: 0 }),
  t8 = It(eu),
  tc,
  nc,
  Ra,
  xl = Re({}, eu, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: n0,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Ra &&
            (Ra && e.type === "mousemove"
              ? ((tc = e.screenX - Ra.screenX), (nc = e.screenY - Ra.screenY))
              : (nc = tc = 0),
            (Ra = e)),
          tc);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : nc;
    },
  }),
  xm = It(xl),
  n8 = Re({}, xl, { dataTransfer: 0 }),
  r8 = It(n8),
  i8 = Re({}, eu, { relatedTarget: 0 }),
  rc = It(i8),
  a8 = Re({}, ca, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  o8 = It(a8),
  u8 = Re({}, ca, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  s8 = It(u8),
  l8 = Re({}, ca, { data: 0 }),
  Sm = It(l8),
  f8 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  c8 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  d8 = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function h8(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = d8[e]) ? !!t[e] : !1;
}
function n0() {
  return h8;
}
var p8 = Re({}, eu, {
    key: function (e) {
      if (e.key) {
        var t = f8[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Ju(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? c8[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: n0,
    charCode: function (e) {
      return e.type === "keypress" ? Ju(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Ju(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  m8 = It(p8),
  v8 = Re({}, xl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  $m = It(v8),
  g8 = Re({}, eu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: n0,
  }),
  y8 = It(g8),
  b8 = Re({}, ca, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  _8 = It(b8),
  w8 = Re({}, xl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  x8 = It(w8),
  S8 = [9, 13, 27, 32],
  r0 = zn && "CompositionEvent" in window,
  ro = null;
zn && "documentMode" in document && (ro = document.documentMode);
var $8 = zn && "TextEvent" in window && !ro,
  Mb = zn && (!r0 || (ro && 8 < ro && 11 >= ro)),
  Tm = " ",
  Cm = !1;
function Pb(e, t) {
  switch (e) {
    case "keyup":
      return S8.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Eb(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var $i = !1;
function T8(e, t) {
  switch (e) {
    case "compositionend":
      return Eb(t);
    case "keypress":
      return t.which !== 32 ? null : ((Cm = !0), Tm);
    case "textInput":
      return (e = t.data), e === Tm && Cm ? null : e;
    default:
      return null;
  }
}
function C8(e, t) {
  if ($i)
    return e === "compositionend" || (!r0 && Pb(e, t))
      ? ((e = Ob()), (Zu = e0 = or = null), ($i = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Mb && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var k8 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function km(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!k8[e.type] : t === "textarea";
}
function Ab(e, t, n, r) {
  lb(r),
    (t = ws(t, "onChange")),
    0 < t.length &&
      ((n = new t0("onChange", "change", null, n, r)), e.push({ event: n, listeners: t }));
}
var io = null,
  xo = null;
function O8(e) {
  qb(e, 0);
}
function Sl(e) {
  var t = ki(e);
  if (nb(t)) return e;
}
function M8(e, t) {
  if (e === "change") return t;
}
var Rb = !1;
if (zn) {
  var ic;
  if (zn) {
    var ac = "oninput" in document;
    if (!ac) {
      var Om = document.createElement("div");
      Om.setAttribute("oninput", "return;"), (ac = typeof Om.oninput == "function");
    }
    ic = ac;
  } else ic = !1;
  Rb = ic && (!document.documentMode || 9 < document.documentMode);
}
function Mm() {
  io && (io.detachEvent("onpropertychange", Fb), (xo = io = null));
}
function Fb(e) {
  if (e.propertyName === "value" && Sl(xo)) {
    var t = [];
    Ab(t, xo, e, Gh(e)), hb(O8, t);
  }
}
function P8(e, t, n) {
  e === "focusin"
    ? (Mm(), (io = t), (xo = n), io.attachEvent("onpropertychange", Fb))
    : e === "focusout" && Mm();
}
function E8(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Sl(xo);
}
function A8(e, t) {
  if (e === "click") return Sl(t);
}
function R8(e, t) {
  if (e === "input" || e === "change") return Sl(t);
}
function F8(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var ln = typeof Object.is == "function" ? Object.is : F8;
function So(e, t) {
  if (ln(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Zc.call(t, i) || !ln(e[i], t[i])) return !1;
  }
  return !0;
}
function Pm(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Em(e, t) {
  var n = Pm(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Pm(n);
  }
}
function Db(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Db(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function Nb() {
  for (var e = window, t = ps(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = ps(e.document);
  }
  return t;
}
function i0(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function D8(e) {
  var t = Nb(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Db(n.ownerDocument.documentElement, n)) {
    if (r !== null && i0(n)) {
      if (((t = r.start), (e = r.end), e === void 0 && (e = t), "selectionStart" in n))
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)
      ) {
        e = e.getSelection();
        var i = n.textContent.length,
          a = Math.min(r.start, i);
        (r = r.end === void 0 ? a : Math.min(r.end, i)),
          !e.extend && a > r && ((i = r), (r = a), (a = i)),
          (i = Em(n, a));
        var o = Em(n, r);
        i &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(i.node, i.offset),
          e.removeAllRanges(),
          a > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top);
  }
}
var N8 = zn && "documentMode" in document && 11 >= document.documentMode,
  Ti = null,
  gd = null,
  ao = null,
  yd = !1;
function Am(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  yd ||
    Ti == null ||
    Ti !== ps(r) ||
    ((r = Ti),
    "selectionStart" in r && i0(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (ao && So(ao, r)) ||
      ((ao = r),
      (r = ws(gd, "onSelect")),
      0 < r.length &&
        ((t = new t0("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Ti))));
}
function Pu(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Ci = {
    animationend: Pu("Animation", "AnimationEnd"),
    animationiteration: Pu("Animation", "AnimationIteration"),
    animationstart: Pu("Animation", "AnimationStart"),
    transitionend: Pu("Transition", "TransitionEnd"),
  },
  oc = {},
  Ib = {};
zn &&
  ((Ib = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Ci.animationend.animation,
    delete Ci.animationiteration.animation,
    delete Ci.animationstart.animation),
  "TransitionEvent" in window || delete Ci.transitionend.transition);
function $l(e) {
  if (oc[e]) return oc[e];
  if (!Ci[e]) return e;
  var t = Ci[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Ib) return (oc[e] = t[n]);
  return e;
}
var Lb = $l("animationend"),
  jb = $l("animationiteration"),
  Ub = $l("animationstart"),
  zb = $l("transitionend"),
  Wb = new Map(),
  Rm =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function $r(e, t) {
  Wb.set(e, t), ai(t, [e]);
}
for (var uc = 0; uc < Rm.length; uc++) {
  var sc = Rm[uc],
    I8 = sc.toLowerCase(),
    L8 = sc[0].toUpperCase() + sc.slice(1);
  $r(I8, "on" + L8);
}
$r(Lb, "onAnimationEnd");
$r(jb, "onAnimationIteration");
$r(Ub, "onAnimationStart");
$r("dblclick", "onDoubleClick");
$r("focusin", "onFocus");
$r("focusout", "onBlur");
$r(zb, "onTransitionEnd");
Qi("onMouseEnter", ["mouseout", "mouseover"]);
Qi("onMouseLeave", ["mouseout", "mouseover"]);
Qi("onPointerEnter", ["pointerout", "pointerover"]);
Qi("onPointerLeave", ["pointerout", "pointerover"]);
ai("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
ai(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "),
);
ai("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
ai("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
ai("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
ai("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Ja =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  j8 = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ja));
function Fm(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), I4(r, t, void 0, e), (e.currentTarget = null);
}
function qb(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      i = r.event;
    r = r.listeners;
    e: {
      var a = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var u = r[o],
            s = u.instance,
            l = u.currentTarget;
          if (((u = u.listener), s !== a && i.isPropagationStopped())) break e;
          Fm(i, u, l), (a = s);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((u = r[o]),
            (s = u.instance),
            (l = u.currentTarget),
            (u = u.listener),
            s !== a && i.isPropagationStopped())
          )
            break e;
          Fm(i, u, l), (a = s);
        }
    }
  }
  if (vs) throw ((e = hd), (vs = !1), (hd = null), e);
}
function Se(e, t) {
  var n = t[Sd];
  n === void 0 && (n = t[Sd] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Hb(t, e, 2, !1), n.add(r));
}
function lc(e, t, n) {
  var r = 0;
  t && (r |= 4), Hb(n, e, r, t);
}
var Eu = "_reactListening" + Math.random().toString(36).slice(2);
function $o(e) {
  if (!e[Eu]) {
    (e[Eu] = !0),
      Xy.forEach(function (n) {
        n !== "selectionchange" && (j8.has(n) || lc(n, !1, e), lc(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Eu] || ((t[Eu] = !0), lc("selectionchange", !1, t));
  }
}
function Hb(e, t, n, r) {
  switch (kb(t)) {
    case 1:
      var i = J4;
      break;
    case 4:
      i = e8;
      break;
    default:
      i = Jh;
  }
  (n = i.bind(null, t, n, e)),
    (i = void 0),
    !dd || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (i = !0),
    r
      ? i !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: i })
        : e.addEventListener(t, n, !0)
      : i !== void 0
        ? e.addEventListener(t, n, { passive: i })
        : e.addEventListener(t, n, !1);
}
function fc(e, t, n, r, i) {
  var a = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var u = r.stateNode.containerInfo;
        if (u === i || (u.nodeType === 8 && u.parentNode === i)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var s = o.tag;
            if (
              (s === 3 || s === 4) &&
              ((s = o.stateNode.containerInfo), s === i || (s.nodeType === 8 && s.parentNode === i))
            )
              return;
            o = o.return;
          }
        for (; u !== null; ) {
          if (((o = Dr(u)), o === null)) return;
          if (((s = o.tag), s === 5 || s === 6)) {
            r = a = o;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
  hb(function () {
    var l = a,
      f = Gh(n),
      c = [];
    e: {
      var d = Wb.get(e);
      if (d !== void 0) {
        var p = t0,
          g = e;
        switch (e) {
          case "keypress":
            if (Ju(n) === 0) break e;
          case "keydown":
          case "keyup":
            p = m8;
            break;
          case "focusin":
            (g = "focus"), (p = rc);
            break;
          case "focusout":
            (g = "blur"), (p = rc);
            break;
          case "beforeblur":
          case "afterblur":
            p = rc;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            p = xm;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            p = r8;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            p = y8;
            break;
          case Lb:
          case jb:
          case Ub:
            p = o8;
            break;
          case zb:
            p = _8;
            break;
          case "scroll":
            p = t8;
            break;
          case "wheel":
            p = x8;
            break;
          case "copy":
          case "cut":
          case "paste":
            p = s8;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            p = $m;
        }
        var y = (t & 4) !== 0,
          b = !y && e === "scroll",
          h = y ? (d !== null ? d + "Capture" : null) : d;
        y = [];
        for (var m = l, v; m !== null; ) {
          v = m;
          var _ = v.stateNode;
          if (
            (v.tag === 5 &&
              _ !== null &&
              ((v = _), h !== null && ((_ = yo(m, h)), _ != null && y.push(To(m, _, v)))),
            b)
          )
            break;
          m = m.return;
        }
        0 < y.length && ((d = new p(d, g, null, n, f)), c.push({ event: d, listeners: y }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((d = e === "mouseover" || e === "pointerover"),
          (p = e === "mouseout" || e === "pointerout"),
          d && n !== fd && (g = n.relatedTarget || n.fromElement) && (Dr(g) || g[Wn]))
        )
          break e;
        if (
          (p || d) &&
          ((d =
            f.window === f ? f : (d = f.ownerDocument) ? d.defaultView || d.parentWindow : window),
          p
            ? ((g = n.relatedTarget || n.toElement),
              (p = l),
              (g = g ? Dr(g) : null),
              g !== null && ((b = oi(g)), g !== b || (g.tag !== 5 && g.tag !== 6)) && (g = null))
            : ((p = null), (g = l)),
          p !== g)
        ) {
          if (
            ((y = xm),
            (_ = "onMouseLeave"),
            (h = "onMouseEnter"),
            (m = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((y = $m), (_ = "onPointerLeave"), (h = "onPointerEnter"), (m = "pointer")),
            (b = p == null ? d : ki(p)),
            (v = g == null ? d : ki(g)),
            (d = new y(_, m + "leave", p, n, f)),
            (d.target = b),
            (d.relatedTarget = v),
            (_ = null),
            Dr(f) === l &&
              ((y = new y(h, m + "enter", g, n, f)),
              (y.target = v),
              (y.relatedTarget = b),
              (_ = y)),
            (b = _),
            p && g)
          )
            t: {
              for (y = p, h = g, m = 0, v = y; v; v = gi(v)) m++;
              for (v = 0, _ = h; _; _ = gi(_)) v++;
              for (; 0 < m - v; ) (y = gi(y)), m--;
              for (; 0 < v - m; ) (h = gi(h)), v--;
              for (; m--; ) {
                if (y === h || (h !== null && y === h.alternate)) break t;
                (y = gi(y)), (h = gi(h));
              }
              y = null;
            }
          else y = null;
          p !== null && Dm(c, d, p, y, !1), g !== null && b !== null && Dm(c, b, g, y, !0);
        }
      }
      e: {
        if (
          ((d = l ? ki(l) : window),
          (p = d.nodeName && d.nodeName.toLowerCase()),
          p === "select" || (p === "input" && d.type === "file"))
        )
          var S = M8;
        else if (km(d))
          if (Rb) S = R8;
          else {
            S = E8;
            var w = P8;
          }
        else
          (p = d.nodeName) &&
            p.toLowerCase() === "input" &&
            (d.type === "checkbox" || d.type === "radio") &&
            (S = A8);
        if (S && (S = S(e, l))) {
          Ab(c, S, n, f);
          break e;
        }
        w && w(e, d, l),
          e === "focusout" &&
            (w = d._wrapperState) &&
            w.controlled &&
            d.type === "number" &&
            ad(d, "number", d.value);
      }
      switch (((w = l ? ki(l) : window), e)) {
        case "focusin":
          (km(w) || w.contentEditable === "true") && ((Ti = w), (gd = l), (ao = null));
          break;
        case "focusout":
          ao = gd = Ti = null;
          break;
        case "mousedown":
          yd = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (yd = !1), Am(c, n, f);
          break;
        case "selectionchange":
          if (N8) break;
        case "keydown":
        case "keyup":
          Am(c, n, f);
      }
      var T;
      if (r0)
        e: {
          switch (e) {
            case "compositionstart":
              var k = "onCompositionStart";
              break e;
            case "compositionend":
              k = "onCompositionEnd";
              break e;
            case "compositionupdate":
              k = "onCompositionUpdate";
              break e;
          }
          k = void 0;
        }
      else
        $i
          ? Pb(e, n) && (k = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (k = "onCompositionStart");
      k &&
        (Mb &&
          n.locale !== "ko" &&
          ($i || k !== "onCompositionStart"
            ? k === "onCompositionEnd" && $i && (T = Ob())
            : ((or = f), (e0 = "value" in or ? or.value : or.textContent), ($i = !0))),
        (w = ws(l, k)),
        0 < w.length &&
          ((k = new Sm(k, e, null, n, f)),
          c.push({ event: k, listeners: w }),
          T ? (k.data = T) : ((T = Eb(n)), T !== null && (k.data = T)))),
        (T = $8 ? T8(e, n) : C8(e, n)) &&
          ((l = ws(l, "onBeforeInput")),
          0 < l.length &&
            ((f = new Sm("onBeforeInput", "beforeinput", null, n, f)),
            c.push({ event: f, listeners: l }),
            (f.data = T)));
    }
    qb(c, t);
  });
}
function To(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function ws(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var i = e,
      a = i.stateNode;
    i.tag === 5 &&
      a !== null &&
      ((i = a),
      (a = yo(e, n)),
      a != null && r.unshift(To(e, a, i)),
      (a = yo(e, t)),
      a != null && r.push(To(e, a, i))),
      (e = e.return);
  }
  return r;
}
function gi(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Dm(e, t, n, r, i) {
  for (var a = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n,
      s = u.alternate,
      l = u.stateNode;
    if (s !== null && s === r) break;
    u.tag === 5 &&
      l !== null &&
      ((u = l),
      i
        ? ((s = yo(n, a)), s != null && o.unshift(To(n, s, u)))
        : i || ((s = yo(n, a)), s != null && o.push(To(n, s, u)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var U8 = /\r\n?/g,
  z8 = /\u0000|\uFFFD/g;
function Nm(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      U8,
      `
`,
    )
    .replace(z8, "");
}
function Au(e, t, n) {
  if (((t = Nm(t)), Nm(e) !== t && n)) throw Error(U(425));
}
function xs() {}
var bd = null,
  _d = null;
function wd(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var xd = typeof setTimeout == "function" ? setTimeout : void 0,
  W8 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Im = typeof Promise == "function" ? Promise : void 0,
  q8 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Im < "u"
        ? function (e) {
            return Im.resolve(null).then(e).catch(H8);
          }
        : xd;
function H8(e) {
  setTimeout(function () {
    throw e;
  });
}
function cc(e, t) {
  var n = t,
    r = 0;
  do {
    var i = n.nextSibling;
    if ((e.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(i), wo(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = i;
  } while (n);
  wo(t);
}
function hr(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Lm(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var da = Math.random().toString(36).slice(2),
  _n = "__reactFiber$" + da,
  Co = "__reactProps$" + da,
  Wn = "__reactContainer$" + da,
  Sd = "__reactEvents$" + da,
  B8 = "__reactListeners$" + da,
  V8 = "__reactHandles$" + da;
function Dr(e) {
  var t = e[_n];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Wn] || n[_n])) {
      if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
        for (e = Lm(e); e !== null; ) {
          if ((n = e[_n])) return n;
          e = Lm(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function tu(e) {
  return (
    (e = e[_n] || e[Wn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function ki(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(U(33));
}
function Tl(e) {
  return e[Co] || null;
}
var $d = [],
  Oi = -1;
function Tr(e) {
  return { current: e };
}
function Te(e) {
  0 > Oi || ((e.current = $d[Oi]), ($d[Oi] = null), Oi--);
}
function xe(e, t) {
  Oi++, ($d[Oi] = e.current), (e.current = t);
}
var _r = {},
  dt = Tr(_r),
  Ct = Tr(!1),
  Yr = _r;
function Yi(e, t) {
  var n = e.type.contextTypes;
  if (!n) return _r;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var i = {},
    a;
  for (a in n) i[a] = t[a];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    i
  );
}
function kt(e) {
  return (e = e.childContextTypes), e != null;
}
function Ss() {
  Te(Ct), Te(dt);
}
function jm(e, t, n) {
  if (dt.current !== _r) throw Error(U(168));
  xe(dt, t), xe(Ct, n);
}
function Bb(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function")) return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in t)) throw Error(U(108, P4(e) || "Unknown", i));
  return Re({}, n, r);
}
function $s(e) {
  return (
    (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || _r),
    (Yr = dt.current),
    xe(dt, e),
    xe(Ct, Ct.current),
    !0
  );
}
function Um(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(U(169));
  n
    ? ((e = Bb(e, t, Yr)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      Te(Ct),
      Te(dt),
      xe(dt, e))
    : Te(Ct),
    xe(Ct, n);
}
var An = null,
  Cl = !1,
  dc = !1;
function Vb(e) {
  An === null ? (An = [e]) : An.push(e);
}
function Q8(e) {
  (Cl = !0), Vb(e);
}
function Cr() {
  if (!dc && An !== null) {
    dc = !0;
    var e = 0,
      t = ge;
    try {
      var n = An;
      for (ge = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (An = null), (Cl = !1);
    } catch (i) {
      throw (An !== null && (An = An.slice(e + 1)), gb(Kh, Cr), i);
    } finally {
      (ge = t), (dc = !1);
    }
  }
  return null;
}
var Mi = [],
  Pi = 0,
  Ts = null,
  Cs = 0,
  Ut = [],
  zt = 0,
  Gr = null,
  Dn = 1,
  Nn = "";
function Ar(e, t) {
  (Mi[Pi++] = Cs), (Mi[Pi++] = Ts), (Ts = e), (Cs = t);
}
function Qb(e, t, n) {
  (Ut[zt++] = Dn), (Ut[zt++] = Nn), (Ut[zt++] = Gr), (Gr = e);
  var r = Dn;
  e = Nn;
  var i = 32 - un(r) - 1;
  (r &= ~(1 << i)), (n += 1);
  var a = 32 - un(t) + i;
  if (30 < a) {
    var o = i - (i % 5);
    (a = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (i -= o),
      (Dn = (1 << (32 - un(t) + i)) | (n << i) | r),
      (Nn = a + e);
  } else (Dn = (1 << a) | (n << i) | r), (Nn = e);
}
function a0(e) {
  e.return !== null && (Ar(e, 1), Qb(e, 1, 0));
}
function o0(e) {
  for (; e === Ts; ) (Ts = Mi[--Pi]), (Mi[Pi] = null), (Cs = Mi[--Pi]), (Mi[Pi] = null);
  for (; e === Gr; )
    (Gr = Ut[--zt]),
      (Ut[zt] = null),
      (Nn = Ut[--zt]),
      (Ut[zt] = null),
      (Dn = Ut[--zt]),
      (Ut[zt] = null);
}
var Ft = null,
  Rt = null,
  ke = !1,
  nn = null;
function Yb(e, t) {
  var n = Ht(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function zm(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
        t !== null ? ((e.stateNode = t), (Ft = e), (Rt = hr(t.firstChild)), !0) : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ft = e), (Rt = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Gr !== null ? { id: Dn, overflow: Nn } : null),
            (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
            (n = Ht(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ft = e),
            (Rt = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Td(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Cd(e) {
  if (ke) {
    var t = Rt;
    if (t) {
      var n = t;
      if (!zm(e, t)) {
        if (Td(e)) throw Error(U(418));
        t = hr(n.nextSibling);
        var r = Ft;
        t && zm(e, t) ? Yb(r, n) : ((e.flags = (e.flags & -4097) | 2), (ke = !1), (Ft = e));
      }
    } else {
      if (Td(e)) throw Error(U(418));
      (e.flags = (e.flags & -4097) | 2), (ke = !1), (Ft = e);
    }
  }
}
function Wm(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Ft = e;
}
function Ru(e) {
  if (e !== Ft) return !1;
  if (!ke) return Wm(e), (ke = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type), (t = t !== "head" && t !== "body" && !wd(e.type, e.memoizedProps))),
    t && (t = Rt))
  ) {
    if (Td(e)) throw (Gb(), Error(U(418)));
    for (; t; ) Yb(e, t), (t = hr(t.nextSibling));
  }
  if ((Wm(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(U(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Rt = hr(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Rt = null;
    }
  } else Rt = Ft ? hr(e.stateNode.nextSibling) : null;
  return !0;
}
function Gb() {
  for (var e = Rt; e; ) e = hr(e.nextSibling);
}
function Gi() {
  (Rt = Ft = null), (ke = !1);
}
function u0(e) {
  nn === null ? (nn = [e]) : nn.push(e);
}
var Y8 = Yn.ReactCurrentBatchConfig;
function en(e, t) {
  if (e && e.defaultProps) {
    (t = Re({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var ks = Tr(null),
  Os = null,
  Ei = null,
  s0 = null;
function l0() {
  s0 = Ei = Os = null;
}
function f0(e) {
  var t = ks.current;
  Te(ks), (e._currentValue = t);
}
function kd(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function Ui(e, t) {
  (Os = e),
    (s0 = Ei = null),
    (e = e.dependencies),
    e !== null && e.firstContext !== null && (e.lanes & t && (Tt = !0), (e.firstContext = null));
}
function Gt(e) {
  var t = e._currentValue;
  if (s0 !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Ei === null)) {
      if (Os === null) throw Error(U(308));
      (Ei = e), (Os.dependencies = { lanes: 0, firstContext: e });
    } else Ei = Ei.next = e;
  return t;
}
var Nr = null;
function c0(e) {
  Nr === null ? (Nr = [e]) : Nr.push(e);
}
function Kb(e, t, n, r) {
  var i = t.interleaved;
  return (
    i === null ? ((n.next = n), c0(t)) : ((n.next = i.next), (i.next = n)),
    (t.interleaved = n),
    qn(e, r)
  );
}
function qn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var rr = !1;
function d0(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Xb(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function jn(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function pr(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), fe & 2)) {
    var i = r.pending;
    return i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)), (r.pending = t), qn(e, n);
  }
  return (
    (i = r.interleaved),
    i === null ? ((t.next = t), c0(r)) : ((t.next = i.next), (i.next = t)),
    (r.interleaved = t),
    qn(e, n)
  );
}
function es(e, t, n) {
  if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Xh(e, n);
  }
}
function qm(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var i = null,
      a = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        a === null ? (i = a = o) : (a = a.next = o), (n = n.next);
      } while (n !== null);
      a === null ? (i = a = t) : (a = a.next = t);
    } else i = a = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: a,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function Ms(e, t, n, r) {
  var i = e.updateQueue;
  rr = !1;
  var a = i.firstBaseUpdate,
    o = i.lastBaseUpdate,
    u = i.shared.pending;
  if (u !== null) {
    i.shared.pending = null;
    var s = u,
      l = s.next;
    (s.next = null), o === null ? (a = l) : (o.next = l), (o = s);
    var f = e.alternate;
    f !== null &&
      ((f = f.updateQueue),
      (u = f.lastBaseUpdate),
      u !== o && (u === null ? (f.firstBaseUpdate = l) : (u.next = l), (f.lastBaseUpdate = s)));
  }
  if (a !== null) {
    var c = i.baseState;
    (o = 0), (f = l = s = null), (u = a);
    do {
      var d = u.lane,
        p = u.eventTime;
      if ((r & d) === d) {
        f !== null &&
          (f = f.next =
            {
              eventTime: p,
              lane: 0,
              tag: u.tag,
              payload: u.payload,
              callback: u.callback,
              next: null,
            });
        e: {
          var g = e,
            y = u;
          switch (((d = t), (p = n), y.tag)) {
            case 1:
              if (((g = y.payload), typeof g == "function")) {
                c = g.call(p, c, d);
                break e;
              }
              c = g;
              break e;
            case 3:
              g.flags = (g.flags & -65537) | 128;
            case 0:
              if (((g = y.payload), (d = typeof g == "function" ? g.call(p, c, d) : g), d == null))
                break e;
              c = Re({}, c, d);
              break e;
            case 2:
              rr = !0;
          }
        }
        u.callback !== null &&
          u.lane !== 0 &&
          ((e.flags |= 64), (d = i.effects), d === null ? (i.effects = [u]) : d.push(u));
      } else
        (p = {
          eventTime: p,
          lane: d,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null,
        }),
          f === null ? ((l = f = p), (s = c)) : (f = f.next = p),
          (o |= d);
      if (((u = u.next), u === null)) {
        if (((u = i.shared.pending), u === null)) break;
        (d = u), (u = d.next), (d.next = null), (i.lastBaseUpdate = d), (i.shared.pending = null);
      }
    } while (!0);
    if (
      (f === null && (s = c),
      (i.baseState = s),
      (i.firstBaseUpdate = l),
      (i.lastBaseUpdate = f),
      (t = i.shared.interleaved),
      t !== null)
    ) {
      i = t;
      do (o |= i.lane), (i = i.next);
      while (i !== t);
    } else a === null && (i.shared.lanes = 0);
    (Xr |= o), (e.lanes = o), (e.memoizedState = c);
  }
}
function Hm(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        i = r.callback;
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != "function")) throw Error(U(191, i));
        i.call(r);
      }
    }
}
var Zb = new Ky.Component().refs;
function Od(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Re({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var kl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? oi(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = vt(),
      i = vr(e),
      a = jn(r, i);
    (a.payload = t),
      n != null && (a.callback = n),
      (t = pr(e, a, i)),
      t !== null && (sn(t, e, i, r), es(t, e, i));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = vt(),
      i = vr(e),
      a = jn(r, i);
    (a.tag = 1),
      (a.payload = t),
      n != null && (a.callback = n),
      (t = pr(e, a, i)),
      t !== null && (sn(t, e, i, r), es(t, e, i));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = vt(),
      r = vr(e),
      i = jn(n, r);
    (i.tag = 2),
      t != null && (i.callback = t),
      (t = pr(e, i, r)),
      t !== null && (sn(t, e, r, n), es(t, e, r));
  },
};
function Bm(e, t, n, r, i, a, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, a, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !So(n, r) || !So(i, a)
        : !0
  );
}
function Jb(e, t, n) {
  var r = !1,
    i = _r,
    a = t.contextType;
  return (
    typeof a == "object" && a !== null
      ? (a = Gt(a))
      : ((i = kt(t) ? Yr : dt.current),
        (r = t.contextTypes),
        (a = (r = r != null) ? Yi(e, i) : _r)),
    (t = new t(n, a)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = kl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = a)),
    t
  );
}
function Vm(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && kl.enqueueReplaceState(t, t.state, null);
}
function Md(e, t, n, r) {
  var i = e.stateNode;
  (i.props = n), (i.state = e.memoizedState), (i.refs = Zb), d0(e);
  var a = t.contextType;
  typeof a == "object" && a !== null
    ? (i.context = Gt(a))
    : ((a = kt(t) ? Yr : dt.current), (i.context = Yi(e, a))),
    (i.state = e.memoizedState),
    (a = t.getDerivedStateFromProps),
    typeof a == "function" && (Od(e, t, a, n), (i.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function" ||
      (typeof i.UNSAFE_componentWillMount != "function" &&
        typeof i.componentWillMount != "function") ||
      ((t = i.state),
      typeof i.componentWillMount == "function" && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(),
      t !== i.state && kl.enqueueReplaceState(i, i.state, null),
      Ms(e, n, i, r),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == "function" && (e.flags |= 4194308);
}
function Fa(e, t, n) {
  if (((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(U(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(U(147, e));
      var i = r,
        a = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === a
        ? t.ref
        : ((t = function (o) {
            var u = i.refs;
            u === Zb && (u = i.refs = {}), o === null ? delete u[a] : (u[a] = o);
          }),
          (t._stringRef = a),
          t);
    }
    if (typeof e != "string") throw Error(U(284));
    if (!n._owner) throw Error(U(290, e));
  }
  return e;
}
function Fu(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      U(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e),
    ))
  );
}
function Qm(e) {
  var t = e._init;
  return t(e._payload);
}
function e2(e) {
  function t(h, m) {
    if (e) {
      var v = h.deletions;
      v === null ? ((h.deletions = [m]), (h.flags |= 16)) : v.push(m);
    }
  }
  function n(h, m) {
    if (!e) return null;
    for (; m !== null; ) t(h, m), (m = m.sibling);
    return null;
  }
  function r(h, m) {
    for (h = new Map(); m !== null; )
      m.key !== null ? h.set(m.key, m) : h.set(m.index, m), (m = m.sibling);
    return h;
  }
  function i(h, m) {
    return (h = gr(h, m)), (h.index = 0), (h.sibling = null), h;
  }
  function a(h, m, v) {
    return (
      (h.index = v),
      e
        ? ((v = h.alternate),
          v !== null ? ((v = v.index), v < m ? ((h.flags |= 2), m) : v) : ((h.flags |= 2), m))
        : ((h.flags |= 1048576), m)
    );
  }
  function o(h) {
    return e && h.alternate === null && (h.flags |= 2), h;
  }
  function u(h, m, v, _) {
    return m === null || m.tag !== 6
      ? ((m = bc(v, h.mode, _)), (m.return = h), m)
      : ((m = i(m, v)), (m.return = h), m);
  }
  function s(h, m, v, _) {
    var S = v.type;
    return S === Si
      ? f(h, m, v.props.children, _, v.key)
      : m !== null &&
          (m.elementType === S ||
            (typeof S == "object" && S !== null && S.$$typeof === nr && Qm(S) === m.type))
        ? ((_ = i(m, v.props)), (_.ref = Fa(h, m, v)), (_.return = h), _)
        : ((_ = os(v.type, v.key, v.props, null, h.mode, _)),
          (_.ref = Fa(h, m, v)),
          (_.return = h),
          _);
  }
  function l(h, m, v, _) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== v.containerInfo ||
      m.stateNode.implementation !== v.implementation
      ? ((m = _c(v, h.mode, _)), (m.return = h), m)
      : ((m = i(m, v.children || [])), (m.return = h), m);
  }
  function f(h, m, v, _, S) {
    return m === null || m.tag !== 7
      ? ((m = Hr(v, h.mode, _, S)), (m.return = h), m)
      : ((m = i(m, v)), (m.return = h), m);
  }
  function c(h, m, v) {
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return (m = bc("" + m, h.mode, v)), (m.return = h), m;
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case Su:
          return (
            (v = os(m.type, m.key, m.props, null, h.mode, v)),
            (v.ref = Fa(h, null, m)),
            (v.return = h),
            v
          );
        case xi:
          return (m = _c(m, h.mode, v)), (m.return = h), m;
        case nr:
          var _ = m._init;
          return c(h, _(m._payload), v);
      }
      if (Xa(m) || Ma(m)) return (m = Hr(m, h.mode, v, null)), (m.return = h), m;
      Fu(h, m);
    }
    return null;
  }
  function d(h, m, v, _) {
    var S = m !== null ? m.key : null;
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return S !== null ? null : u(h, m, "" + v, _);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Su:
          return v.key === S ? s(h, m, v, _) : null;
        case xi:
          return v.key === S ? l(h, m, v, _) : null;
        case nr:
          return (S = v._init), d(h, m, S(v._payload), _);
      }
      if (Xa(v) || Ma(v)) return S !== null ? null : f(h, m, v, _, null);
      Fu(h, v);
    }
    return null;
  }
  function p(h, m, v, _, S) {
    if ((typeof _ == "string" && _ !== "") || typeof _ == "number")
      return (h = h.get(v) || null), u(m, h, "" + _, S);
    if (typeof _ == "object" && _ !== null) {
      switch (_.$$typeof) {
        case Su:
          return (h = h.get(_.key === null ? v : _.key) || null), s(m, h, _, S);
        case xi:
          return (h = h.get(_.key === null ? v : _.key) || null), l(m, h, _, S);
        case nr:
          var w = _._init;
          return p(h, m, v, w(_._payload), S);
      }
      if (Xa(_) || Ma(_)) return (h = h.get(v) || null), f(m, h, _, S, null);
      Fu(m, _);
    }
    return null;
  }
  function g(h, m, v, _) {
    for (var S = null, w = null, T = m, k = (m = 0), j = null; T !== null && k < v.length; k++) {
      T.index > k ? ((j = T), (T = null)) : (j = T.sibling);
      var R = d(h, T, v[k], _);
      if (R === null) {
        T === null && (T = j);
        break;
      }
      e && T && R.alternate === null && t(h, T),
        (m = a(R, m, k)),
        w === null ? (S = R) : (w.sibling = R),
        (w = R),
        (T = j);
    }
    if (k === v.length) return n(h, T), ke && Ar(h, k), S;
    if (T === null) {
      for (; k < v.length; k++)
        (T = c(h, v[k], _)),
          T !== null && ((m = a(T, m, k)), w === null ? (S = T) : (w.sibling = T), (w = T));
      return ke && Ar(h, k), S;
    }
    for (T = r(h, T); k < v.length; k++)
      (j = p(T, h, k, v[k], _)),
        j !== null &&
          (e && j.alternate !== null && T.delete(j.key === null ? k : j.key),
          (m = a(j, m, k)),
          w === null ? (S = j) : (w.sibling = j),
          (w = j));
    return (
      e &&
        T.forEach(function (E) {
          return t(h, E);
        }),
      ke && Ar(h, k),
      S
    );
  }
  function y(h, m, v, _) {
    var S = Ma(v);
    if (typeof S != "function") throw Error(U(150));
    if (((v = S.call(v)), v == null)) throw Error(U(151));
    for (
      var w = (S = null), T = m, k = (m = 0), j = null, R = v.next();
      T !== null && !R.done;
      k++, R = v.next()
    ) {
      T.index > k ? ((j = T), (T = null)) : (j = T.sibling);
      var E = d(h, T, R.value, _);
      if (E === null) {
        T === null && (T = j);
        break;
      }
      e && T && E.alternate === null && t(h, T),
        (m = a(E, m, k)),
        w === null ? (S = E) : (w.sibling = E),
        (w = E),
        (T = j);
    }
    if (R.done) return n(h, T), ke && Ar(h, k), S;
    if (T === null) {
      for (; !R.done; k++, R = v.next())
        (R = c(h, R.value, _)),
          R !== null && ((m = a(R, m, k)), w === null ? (S = R) : (w.sibling = R), (w = R));
      return ke && Ar(h, k), S;
    }
    for (T = r(h, T); !R.done; k++, R = v.next())
      (R = p(T, h, k, R.value, _)),
        R !== null &&
          (e && R.alternate !== null && T.delete(R.key === null ? k : R.key),
          (m = a(R, m, k)),
          w === null ? (S = R) : (w.sibling = R),
          (w = R));
    return (
      e &&
        T.forEach(function (q) {
          return t(h, q);
        }),
      ke && Ar(h, k),
      S
    );
  }
  function b(h, m, v, _) {
    if (
      (typeof v == "object" &&
        v !== null &&
        v.type === Si &&
        v.key === null &&
        (v = v.props.children),
      typeof v == "object" && v !== null)
    ) {
      switch (v.$$typeof) {
        case Su:
          e: {
            for (var S = v.key, w = m; w !== null; ) {
              if (w.key === S) {
                if (((S = v.type), S === Si)) {
                  if (w.tag === 7) {
                    n(h, w.sibling), (m = i(w, v.props.children)), (m.return = h), (h = m);
                    break e;
                  }
                } else if (
                  w.elementType === S ||
                  (typeof S == "object" && S !== null && S.$$typeof === nr && Qm(S) === w.type)
                ) {
                  n(h, w.sibling),
                    (m = i(w, v.props)),
                    (m.ref = Fa(h, w, v)),
                    (m.return = h),
                    (h = m);
                  break e;
                }
                n(h, w);
                break;
              } else t(h, w);
              w = w.sibling;
            }
            v.type === Si
              ? ((m = Hr(v.props.children, h.mode, _, v.key)), (m.return = h), (h = m))
              : ((_ = os(v.type, v.key, v.props, null, h.mode, _)),
                (_.ref = Fa(h, m, v)),
                (_.return = h),
                (h = _));
          }
          return o(h);
        case xi:
          e: {
            for (w = v.key; m !== null; ) {
              if (m.key === w)
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === v.containerInfo &&
                  m.stateNode.implementation === v.implementation
                ) {
                  n(h, m.sibling), (m = i(m, v.children || [])), (m.return = h), (h = m);
                  break e;
                } else {
                  n(h, m);
                  break;
                }
              else t(h, m);
              m = m.sibling;
            }
            (m = _c(v, h.mode, _)), (m.return = h), (h = m);
          }
          return o(h);
        case nr:
          return (w = v._init), b(h, m, w(v._payload), _);
      }
      if (Xa(v)) return g(h, m, v, _);
      if (Ma(v)) return y(h, m, v, _);
      Fu(h, v);
    }
    return (typeof v == "string" && v !== "") || typeof v == "number"
      ? ((v = "" + v),
        m !== null && m.tag === 6
          ? (n(h, m.sibling), (m = i(m, v)), (m.return = h), (h = m))
          : (n(h, m), (m = bc(v, h.mode, _)), (m.return = h), (h = m)),
        o(h))
      : n(h, m);
  }
  return b;
}
var Ki = e2(!0),
  t2 = e2(!1),
  nu = {},
  Sn = Tr(nu),
  ko = Tr(nu),
  Oo = Tr(nu);
function Ir(e) {
  if (e === nu) throw Error(U(174));
  return e;
}
function h0(e, t) {
  switch ((xe(Oo, t), xe(ko, e), xe(Sn, nu), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ud(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = ud(t, e));
  }
  Te(Sn), xe(Sn, t);
}
function Xi() {
  Te(Sn), Te(ko), Te(Oo);
}
function n2(e) {
  Ir(Oo.current);
  var t = Ir(Sn.current),
    n = ud(t, e.type);
  t !== n && (xe(ko, e), xe(Sn, n));
}
function p0(e) {
  ko.current === e && (Te(Sn), Te(ko));
}
var Pe = Tr(0);
function Ps(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!"))
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var hc = [];
function m0() {
  for (var e = 0; e < hc.length; e++) hc[e]._workInProgressVersionPrimary = null;
  hc.length = 0;
}
var ts = Yn.ReactCurrentDispatcher,
  pc = Yn.ReactCurrentBatchConfig,
  Kr = 0,
  Ae = null,
  Ve = null,
  Ke = null,
  Es = !1,
  oo = !1,
  Mo = 0,
  G8 = 0;
function ut() {
  throw Error(U(321));
}
function v0(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!ln(e[n], t[n])) return !1;
  return !0;
}
function g0(e, t, n, r, i, a) {
  if (
    ((Kr = a),
    (Ae = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (ts.current = e === null || e.memoizedState === null ? J8 : e6),
    (e = n(r, i)),
    oo)
  ) {
    a = 0;
    do {
      if (((oo = !1), (Mo = 0), 25 <= a)) throw Error(U(301));
      (a += 1), (Ke = Ve = null), (t.updateQueue = null), (ts.current = t6), (e = n(r, i));
    } while (oo);
  }
  if (
    ((ts.current = As),
    (t = Ve !== null && Ve.next !== null),
    (Kr = 0),
    (Ke = Ve = Ae = null),
    (Es = !1),
    t)
  )
    throw Error(U(300));
  return e;
}
function y0() {
  var e = Mo !== 0;
  return (Mo = 0), e;
}
function yn() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return Ke === null ? (Ae.memoizedState = Ke = e) : (Ke = Ke.next = e), Ke;
}
function Kt() {
  if (Ve === null) {
    var e = Ae.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Ve.next;
  var t = Ke === null ? Ae.memoizedState : Ke.next;
  if (t !== null) (Ke = t), (Ve = e);
  else {
    if (e === null) throw Error(U(310));
    (Ve = e),
      (e = {
        memoizedState: Ve.memoizedState,
        baseState: Ve.baseState,
        baseQueue: Ve.baseQueue,
        queue: Ve.queue,
        next: null,
      }),
      Ke === null ? (Ae.memoizedState = Ke = e) : (Ke = Ke.next = e);
  }
  return Ke;
}
function Po(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function mc(e) {
  var t = Kt(),
    n = t.queue;
  if (n === null) throw Error(U(311));
  n.lastRenderedReducer = e;
  var r = Ve,
    i = r.baseQueue,
    a = n.pending;
  if (a !== null) {
    if (i !== null) {
      var o = i.next;
      (i.next = a.next), (a.next = o);
    }
    (r.baseQueue = i = a), (n.pending = null);
  }
  if (i !== null) {
    (a = i.next), (r = r.baseState);
    var u = (o = null),
      s = null,
      l = a;
    do {
      var f = l.lane;
      if ((Kr & f) === f)
        s !== null &&
          (s = s.next =
            {
              lane: 0,
              action: l.action,
              hasEagerState: l.hasEagerState,
              eagerState: l.eagerState,
              next: null,
            }),
          (r = l.hasEagerState ? l.eagerState : e(r, l.action));
      else {
        var c = {
          lane: f,
          action: l.action,
          hasEagerState: l.hasEagerState,
          eagerState: l.eagerState,
          next: null,
        };
        s === null ? ((u = s = c), (o = r)) : (s = s.next = c), (Ae.lanes |= f), (Xr |= f);
      }
      l = l.next;
    } while (l !== null && l !== a);
    s === null ? (o = r) : (s.next = u),
      ln(r, t.memoizedState) || (Tt = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = s),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    i = e;
    do (a = i.lane), (Ae.lanes |= a), (Xr |= a), (i = i.next);
    while (i !== e);
  } else i === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function vc(e) {
  var t = Kt(),
    n = t.queue;
  if (n === null) throw Error(U(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    i = n.pending,
    a = t.memoizedState;
  if (i !== null) {
    n.pending = null;
    var o = (i = i.next);
    do (a = e(a, o.action)), (o = o.next);
    while (o !== i);
    ln(a, t.memoizedState) || (Tt = !0),
      (t.memoizedState = a),
      t.baseQueue === null && (t.baseState = a),
      (n.lastRenderedState = a);
  }
  return [a, r];
}
function r2() {}
function i2(e, t) {
  var n = Ae,
    r = Kt(),
    i = t(),
    a = !ln(r.memoizedState, i);
  if (
    (a && ((r.memoizedState = i), (Tt = !0)),
    (r = r.queue),
    b0(u2.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || a || (Ke !== null && Ke.memoizedState.tag & 1))
  ) {
    if (((n.flags |= 2048), Eo(9, o2.bind(null, n, r, i, t), void 0, null), Xe === null))
      throw Error(U(349));
    Kr & 30 || a2(n, t, i);
  }
  return i;
}
function a2(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = Ae.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }), (Ae.updateQueue = t), (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function o2(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), s2(t) && l2(e);
}
function u2(e, t, n) {
  return n(function () {
    s2(t) && l2(e);
  });
}
function s2(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !ln(e, n);
  } catch {
    return !0;
  }
}
function l2(e) {
  var t = qn(e, 1);
  t !== null && sn(t, e, 1, -1);
}
function Ym(e) {
  var t = yn();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Po,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Z8.bind(null, Ae, e)),
    [t.memoizedState, e]
  );
}
function Eo(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = Ae.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Ae.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function f2() {
  return Kt().memoizedState;
}
function ns(e, t, n, r) {
  var i = yn();
  (Ae.flags |= e), (i.memoizedState = Eo(1 | t, n, void 0, r === void 0 ? null : r));
}
function Ol(e, t, n, r) {
  var i = Kt();
  r = r === void 0 ? null : r;
  var a = void 0;
  if (Ve !== null) {
    var o = Ve.memoizedState;
    if (((a = o.destroy), r !== null && v0(r, o.deps))) {
      i.memoizedState = Eo(t, n, a, r);
      return;
    }
  }
  (Ae.flags |= e), (i.memoizedState = Eo(1 | t, n, a, r));
}
function Gm(e, t) {
  return ns(8390656, 8, e, t);
}
function b0(e, t) {
  return Ol(2048, 8, e, t);
}
function c2(e, t) {
  return Ol(4, 2, e, t);
}
function d2(e, t) {
  return Ol(4, 4, e, t);
}
function h2(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function p2(e, t, n) {
  return (n = n != null ? n.concat([e]) : null), Ol(4, 4, h2.bind(null, t, e), n);
}
function _0() {}
function m2(e, t) {
  var n = Kt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && v0(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
}
function v2(e, t) {
  var n = Kt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && v0(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function g2(e, t, n) {
  return Kr & 21
    ? (ln(n, t) || ((n = _b()), (Ae.lanes |= n), (Xr |= n), (e.baseState = !0)), t)
    : (e.baseState && ((e.baseState = !1), (Tt = !0)), (e.memoizedState = n));
}
function K8(e, t) {
  var n = ge;
  (ge = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = pc.transition;
  pc.transition = {};
  try {
    e(!1), t();
  } finally {
    (ge = n), (pc.transition = r);
  }
}
function y2() {
  return Kt().memoizedState;
}
function X8(e, t, n) {
  var r = vr(e);
  if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), b2(e)))
    _2(t, n);
  else if (((n = Kb(e, t, n, r)), n !== null)) {
    var i = vt();
    sn(n, e, r, i), w2(n, t, r);
  }
}
function Z8(e, t, n) {
  var r = vr(e),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (b2(e)) _2(t, i);
  else {
    var a = e.alternate;
    if (e.lanes === 0 && (a === null || a.lanes === 0) && ((a = t.lastRenderedReducer), a !== null))
      try {
        var o = t.lastRenderedState,
          u = a(o, n);
        if (((i.hasEagerState = !0), (i.eagerState = u), ln(u, o))) {
          var s = t.interleaved;
          s === null ? ((i.next = i), c0(t)) : ((i.next = s.next), (s.next = i)),
            (t.interleaved = i);
          return;
        }
      } catch {
      } finally {
      }
    (n = Kb(e, t, i, r)), n !== null && ((i = vt()), sn(n, e, r, i), w2(n, t, r));
  }
}
function b2(e) {
  var t = e.alternate;
  return e === Ae || (t !== null && t === Ae);
}
function _2(e, t) {
  oo = Es = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t);
}
function w2(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Xh(e, n);
  }
}
var As = {
    readContext: Gt,
    useCallback: ut,
    useContext: ut,
    useEffect: ut,
    useImperativeHandle: ut,
    useInsertionEffect: ut,
    useLayoutEffect: ut,
    useMemo: ut,
    useReducer: ut,
    useRef: ut,
    useState: ut,
    useDebugValue: ut,
    useDeferredValue: ut,
    useTransition: ut,
    useMutableSource: ut,
    useSyncExternalStore: ut,
    useId: ut,
    unstable_isNewReconciler: !1,
  },
  J8 = {
    readContext: Gt,
    useCallback: function (e, t) {
      return (yn().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: Gt,
    useEffect: Gm,
    useImperativeHandle: function (e, t, n) {
      return (n = n != null ? n.concat([e]) : null), ns(4194308, 4, h2.bind(null, t, e), n);
    },
    useLayoutEffect: function (e, t) {
      return ns(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return ns(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = yn();
      return (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e;
    },
    useReducer: function (e, t, n) {
      var r = yn();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = X8.bind(null, Ae, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = yn();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Ym,
    useDebugValue: _0,
    useDeferredValue: function (e) {
      return (yn().memoizedState = e);
    },
    useTransition: function () {
      var e = Ym(!1),
        t = e[0];
      return (e = K8.bind(null, e[1])), (yn().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = Ae,
        i = yn();
      if (ke) {
        if (n === void 0) throw Error(U(407));
        n = n();
      } else {
        if (((n = t()), Xe === null)) throw Error(U(349));
        Kr & 30 || a2(r, t, n);
      }
      i.memoizedState = n;
      var a = { value: n, getSnapshot: t };
      return (
        (i.queue = a),
        Gm(u2.bind(null, r, a, e), [e]),
        (r.flags |= 2048),
        Eo(9, o2.bind(null, r, a, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = yn(),
        t = Xe.identifierPrefix;
      if (ke) {
        var n = Nn,
          r = Dn;
        (n = (r & ~(1 << (32 - un(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Mo++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = G8++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  e6 = {
    readContext: Gt,
    useCallback: m2,
    useContext: Gt,
    useEffect: b0,
    useImperativeHandle: p2,
    useInsertionEffect: c2,
    useLayoutEffect: d2,
    useMemo: v2,
    useReducer: mc,
    useRef: f2,
    useState: function () {
      return mc(Po);
    },
    useDebugValue: _0,
    useDeferredValue: function (e) {
      var t = Kt();
      return g2(t, Ve.memoizedState, e);
    },
    useTransition: function () {
      var e = mc(Po)[0],
        t = Kt().memoizedState;
      return [e, t];
    },
    useMutableSource: r2,
    useSyncExternalStore: i2,
    useId: y2,
    unstable_isNewReconciler: !1,
  },
  t6 = {
    readContext: Gt,
    useCallback: m2,
    useContext: Gt,
    useEffect: b0,
    useImperativeHandle: p2,
    useInsertionEffect: c2,
    useLayoutEffect: d2,
    useMemo: v2,
    useReducer: vc,
    useRef: f2,
    useState: function () {
      return vc(Po);
    },
    useDebugValue: _0,
    useDeferredValue: function (e) {
      var t = Kt();
      return Ve === null ? (t.memoizedState = e) : g2(t, Ve.memoizedState, e);
    },
    useTransition: function () {
      var e = vc(Po)[0],
        t = Kt().memoizedState;
      return [e, t];
    },
    useMutableSource: r2,
    useSyncExternalStore: i2,
    useId: y2,
    unstable_isNewReconciler: !1,
  };
function Zi(e, t) {
  try {
    var n = "",
      r = t;
    do (n += M4(r)), (r = r.return);
    while (r);
    var i = n;
  } catch (a) {
    i =
      `
Error generating stack: ` +
      a.message +
      `
` +
      a.stack;
  }
  return { value: e, source: t, stack: i, digest: null };
}
function gc(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Pd(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var n6 = typeof WeakMap == "function" ? WeakMap : Map;
function x2(e, t, n) {
  (n = jn(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      Fs || ((Fs = !0), (Ud = r)), Pd(e, t);
    }),
    n
  );
}
function S2(e, t, n) {
  (n = jn(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = t.value;
    (n.payload = function () {
      return r(i);
    }),
      (n.callback = function () {
        Pd(e, t);
      });
  }
  var a = e.stateNode;
  return (
    a !== null &&
      typeof a.componentDidCatch == "function" &&
      (n.callback = function () {
        Pd(e, t), typeof r != "function" && (mr === null ? (mr = new Set([this])) : mr.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
      }),
    n
  );
}
function Km(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new n6();
    var i = new Set();
    r.set(t, i);
  } else (i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i));
  i.has(n) || (i.add(n), (e = v6.bind(null, e, t, n)), t.then(e, e));
}
function Xm(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) && ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Zm(e, t, n, r, i) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = i), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null ? (n.tag = 17) : ((t = jn(-1, 1)), (t.tag = 2), pr(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var r6 = Yn.ReactCurrentOwner,
  Tt = !1;
function pt(e, t, n, r) {
  t.child = e === null ? t2(t, null, n, r) : Ki(t, e.child, n, r);
}
function Jm(e, t, n, r, i) {
  n = n.render;
  var a = t.ref;
  return (
    Ui(t, i),
    (r = g0(e, t, n, r, a, i)),
    (n = y0()),
    e !== null && !Tt
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), Hn(e, t, i))
      : (ke && n && a0(t), (t.flags |= 1), pt(e, t, r, i), t.child)
  );
}
function ev(e, t, n, r, i) {
  if (e === null) {
    var a = n.type;
    return typeof a == "function" &&
      !O0(a) &&
      a.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = a), $2(e, t, a, r, i))
      : ((e = os(n.type, null, r, t, t.mode, i)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  if (((a = e.child), !(e.lanes & i))) {
    var o = a.memoizedProps;
    if (((n = n.compare), (n = n !== null ? n : So), n(o, r) && e.ref === t.ref))
      return Hn(e, t, i);
  }
  return (t.flags |= 1), (e = gr(a, r)), (e.ref = t.ref), (e.return = t), (t.child = e);
}
function $2(e, t, n, r, i) {
  if (e !== null) {
    var a = e.memoizedProps;
    if (So(a, r) && e.ref === t.ref)
      if (((Tt = !1), (t.pendingProps = r = a), (e.lanes & i) !== 0)) e.flags & 131072 && (Tt = !0);
      else return (t.lanes = e.lanes), Hn(e, t, i);
  }
  return Ed(e, t, n, r, i);
}
function T2(e, t, n) {
  var r = t.pendingProps,
    i = r.children,
    a = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        xe(Ri, At),
        (At |= n);
    else {
      if (!(n & 1073741824))
        return (
          (e = a !== null ? a.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
          (t.updateQueue = null),
          xe(Ri, At),
          (At |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = a !== null ? a.baseLanes : n),
        xe(Ri, At),
        (At |= r);
    }
  else
    a !== null ? ((r = a.baseLanes | n), (t.memoizedState = null)) : (r = n), xe(Ri, At), (At |= r);
  return pt(e, t, i, n), t.child;
}
function C2(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Ed(e, t, n, r, i) {
  var a = kt(n) ? Yr : dt.current;
  return (
    (a = Yi(t, a)),
    Ui(t, i),
    (n = g0(e, t, n, r, a, i)),
    (r = y0()),
    e !== null && !Tt
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), Hn(e, t, i))
      : (ke && r && a0(t), (t.flags |= 1), pt(e, t, n, i), t.child)
  );
}
function tv(e, t, n, r, i) {
  if (kt(n)) {
    var a = !0;
    $s(t);
  } else a = !1;
  if ((Ui(t, i), t.stateNode === null)) rs(e, t), Jb(t, n, r), Md(t, n, r, i), (r = !0);
  else if (e === null) {
    var o = t.stateNode,
      u = t.memoizedProps;
    o.props = u;
    var s = o.context,
      l = n.contextType;
    typeof l == "object" && l !== null
      ? (l = Gt(l))
      : ((l = kt(n) ? Yr : dt.current), (l = Yi(t, l)));
    var f = n.getDerivedStateFromProps,
      c = typeof f == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    c ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((u !== r || s !== l) && Vm(t, o, r, l)),
      (rr = !1);
    var d = t.memoizedState;
    (o.state = d),
      Ms(t, r, o, i),
      (s = t.memoizedState),
      u !== r || d !== s || Ct.current || rr
        ? (typeof f == "function" && (Od(t, n, f, r), (s = t.memoizedState)),
          (u = rr || Bm(t, n, u, r, d, s, l))
            ? (c ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" && o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = s)),
          (o.props = r),
          (o.state = s),
          (o.context = l),
          (r = u))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), (r = !1));
  } else {
    (o = t.stateNode),
      Xb(e, t),
      (u = t.memoizedProps),
      (l = t.type === t.elementType ? u : en(t.type, u)),
      (o.props = l),
      (c = t.pendingProps),
      (d = o.context),
      (s = n.contextType),
      typeof s == "object" && s !== null
        ? (s = Gt(s))
        : ((s = kt(n) ? Yr : dt.current), (s = Yi(t, s)));
    var p = n.getDerivedStateFromProps;
    (f = typeof p == "function" || typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((u !== c || d !== s) && Vm(t, o, r, s)),
      (rr = !1),
      (d = t.memoizedState),
      (o.state = d),
      Ms(t, r, o, i);
    var g = t.memoizedState;
    u !== c || d !== g || Ct.current || rr
      ? (typeof p == "function" && (Od(t, n, p, r), (g = t.memoizedState)),
        (l = rr || Bm(t, n, l, r, d, g, s) || !1)
          ? (f ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, g, s),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, g, s)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (u === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (u === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = g)),
        (o.props = r),
        (o.state = g),
        (o.context = s),
        (r = l))
      : (typeof o.componentDidUpdate != "function" ||
          (u === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (u === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Ad(e, t, n, r, a, i);
}
function Ad(e, t, n, r, i, a) {
  C2(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return i && Um(t, n, !1), Hn(e, t, a);
  (r = t.stateNode), (r6.current = t);
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Ki(t, e.child, null, a)), (t.child = Ki(t, null, u, a)))
      : pt(e, t, u, a),
    (t.memoizedState = r.state),
    i && Um(t, n, !0),
    t.child
  );
}
function k2(e) {
  var t = e.stateNode;
  t.pendingContext
    ? jm(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && jm(e, t.context, !1),
    h0(e, t.containerInfo);
}
function nv(e, t, n, r, i) {
  return Gi(), u0(i), (t.flags |= 256), pt(e, t, n, r), t.child;
}
var Rd = { dehydrated: null, treeContext: null, retryLane: 0 };
function Fd(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function O2(e, t, n) {
  var r = t.pendingProps,
    i = Pe.current,
    a = !1,
    o = (t.flags & 128) !== 0,
    u;
  if (
    ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0),
    u ? ((a = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (i |= 1),
    xe(Pe, i & 1),
    e === null)
  )
    return (
      Cd(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1 ? (e.data === "$!" ? (t.lanes = 8) : (t.lanes = 1073741824)) : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          a
            ? ((r = t.mode),
              (a = t.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && a !== null
                ? ((a.childLanes = 0), (a.pendingProps = o))
                : (a = El(o, r, 0, null)),
              (e = Hr(e, r, n, null)),
              (a.return = t),
              (e.return = t),
              (a.sibling = e),
              (t.child = a),
              (t.child.memoizedState = Fd(n)),
              (t.memoizedState = Rd),
              e)
            : w0(t, o))
    );
  if (((i = e.memoizedState), i !== null && ((u = i.dehydrated), u !== null)))
    return i6(e, t, o, r, u, i, n);
  if (a) {
    (a = r.fallback), (o = t.mode), (i = e.child), (u = i.sibling);
    var s = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && t.child !== i
        ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = s), (t.deletions = null))
        : ((r = gr(i, s)), (r.subtreeFlags = i.subtreeFlags & 14680064)),
      u !== null ? (a = gr(u, a)) : ((a = Hr(a, o, n, null)), (a.flags |= 2)),
      (a.return = t),
      (r.return = t),
      (r.sibling = a),
      (t.child = r),
      (r = a),
      (a = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Fd(n)
          : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }),
      (a.memoizedState = o),
      (a.childLanes = e.childLanes & ~n),
      (t.memoizedState = Rd),
      r
    );
  }
  return (
    (a = e.child),
    (e = a.sibling),
    (r = gr(a, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function w0(e, t) {
  return (t = El({ mode: "visible", children: t }, e.mode, 0, null)), (t.return = e), (e.child = t);
}
function Du(e, t, n, r) {
  return (
    r !== null && u0(r),
    Ki(t, e.child, null, n),
    (e = w0(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function i6(e, t, n, r, i, a, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = gc(Error(U(422)))), Du(e, t, o, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((a = r.fallback),
          (i = t.mode),
          (r = El({ mode: "visible", children: r.children }, i, 0, null)),
          (a = Hr(a, i, o, null)),
          (a.flags |= 2),
          (r.return = t),
          (a.return = t),
          (r.sibling = a),
          (t.child = r),
          t.mode & 1 && Ki(t, e.child, null, o),
          (t.child.memoizedState = Fd(o)),
          (t.memoizedState = Rd),
          a);
  if (!(t.mode & 1)) return Du(e, t, o, null);
  if (i.data === "$!") {
    if (((r = i.nextSibling && i.nextSibling.dataset), r)) var u = r.dgst;
    return (r = u), (a = Error(U(419))), (r = gc(a, r, void 0)), Du(e, t, o, r);
  }
  if (((u = (o & e.childLanes) !== 0), Tt || u)) {
    if (((r = Xe), r !== null)) {
      switch (o & -o) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      (i = i & (r.suspendedLanes | o) ? 0 : i),
        i !== 0 && i !== a.retryLane && ((a.retryLane = i), qn(e, i), sn(r, e, i, -1));
    }
    return k0(), (r = gc(Error(U(421)))), Du(e, t, o, r);
  }
  return i.data === "$?"
    ? ((t.flags |= 128), (t.child = e.child), (t = g6.bind(null, e)), (i._reactRetry = t), null)
    : ((e = a.treeContext),
      (Rt = hr(i.nextSibling)),
      (Ft = t),
      (ke = !0),
      (nn = null),
      e !== null &&
        ((Ut[zt++] = Dn),
        (Ut[zt++] = Nn),
        (Ut[zt++] = Gr),
        (Dn = e.id),
        (Nn = e.overflow),
        (Gr = t)),
      (t = w0(t, r.children)),
      (t.flags |= 4096),
      t);
}
function rv(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), kd(e.return, t, n);
}
function yc(e, t, n, r, i) {
  var a = e.memoizedState;
  a === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: i,
      })
    : ((a.isBackwards = t),
      (a.rendering = null),
      (a.renderingStartTime = 0),
      (a.last = r),
      (a.tail = n),
      (a.tailMode = i));
}
function M2(e, t, n) {
  var r = t.pendingProps,
    i = r.revealOrder,
    a = r.tail;
  if ((pt(e, t, r.children, n), (r = Pe.current), r & 2)) (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && rv(e, n, t);
        else if (e.tag === 19) rv(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((xe(Pe, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          (e = n.alternate), e !== null && Ps(e) === null && (i = n), (n = n.sibling);
        (n = i),
          n === null ? ((i = t.child), (t.child = null)) : ((i = n.sibling), (n.sibling = null)),
          yc(t, !1, i, n, a);
        break;
      case "backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (((e = i.alternate), e !== null && Ps(e) === null)) {
            t.child = i;
            break;
          }
          (e = i.sibling), (i.sibling = n), (n = i), (i = e);
        }
        yc(t, !0, n, null, a);
        break;
      case "together":
        yc(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function rs(e, t) {
  !(t.mode & 1) && e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Hn(e, t, n) {
  if ((e !== null && (t.dependencies = e.dependencies), (Xr |= t.lanes), !(n & t.childLanes)))
    return null;
  if (e !== null && t.child !== e.child) throw Error(U(153));
  if (t.child !== null) {
    for (e = t.child, n = gr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
      (e = e.sibling), (n = n.sibling = gr(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function a6(e, t, n) {
  switch (t.tag) {
    case 3:
      k2(t), Gi();
      break;
    case 5:
      n2(t);
      break;
    case 1:
      kt(t.type) && $s(t);
      break;
    case 4:
      h0(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        i = t.memoizedProps.value;
      xe(ks, r._currentValue), (r._currentValue = i);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (xe(Pe, Pe.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? O2(e, t, n)
            : (xe(Pe, Pe.current & 1), (e = Hn(e, t, n)), e !== null ? e.sibling : null);
      xe(Pe, Pe.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return M2(e, t, n);
        t.flags |= 128;
      }
      if (
        ((i = t.memoizedState),
        i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        xe(Pe, Pe.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), T2(e, t, n);
  }
  return Hn(e, t, n);
}
var P2, Dd, E2, A2;
P2 = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
Dd = function () {};
E2 = function (e, t, n, r) {
  var i = e.memoizedProps;
  if (i !== r) {
    (e = t.stateNode), Ir(Sn.current);
    var a = null;
    switch (n) {
      case "input":
        (i = rd(e, i)), (r = rd(e, r)), (a = []);
        break;
      case "select":
        (i = Re({}, i, { value: void 0 })), (r = Re({}, r, { value: void 0 })), (a = []);
        break;
      case "textarea":
        (i = od(e, i)), (r = od(e, r)), (a = []);
        break;
      default:
        typeof i.onClick != "function" && typeof r.onClick == "function" && (e.onclick = xs);
    }
    sd(n, r);
    var o;
    n = null;
    for (l in i)
      if (!r.hasOwnProperty(l) && i.hasOwnProperty(l) && i[l] != null)
        if (l === "style") {
          var u = i[l];
          for (o in u) u.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          l !== "dangerouslySetInnerHTML" &&
            l !== "children" &&
            l !== "suppressContentEditableWarning" &&
            l !== "suppressHydrationWarning" &&
            l !== "autoFocus" &&
            (vo.hasOwnProperty(l) ? a || (a = []) : (a = a || []).push(l, null));
    for (l in r) {
      var s = r[l];
      if (
        ((u = i != null ? i[l] : void 0),
        r.hasOwnProperty(l) && s !== u && (s != null || u != null))
      )
        if (l === "style")
          if (u) {
            for (o in u)
              !u.hasOwnProperty(o) || (s && s.hasOwnProperty(o)) || (n || (n = {}), (n[o] = ""));
            for (o in s) s.hasOwnProperty(o) && u[o] !== s[o] && (n || (n = {}), (n[o] = s[o]));
          } else n || (a || (a = []), a.push(l, n)), (n = s);
        else
          l === "dangerouslySetInnerHTML"
            ? ((s = s ? s.__html : void 0),
              (u = u ? u.__html : void 0),
              s != null && u !== s && (a = a || []).push(l, s))
            : l === "children"
              ? (typeof s != "string" && typeof s != "number") || (a = a || []).push(l, "" + s)
              : l !== "suppressContentEditableWarning" &&
                l !== "suppressHydrationWarning" &&
                (vo.hasOwnProperty(l)
                  ? (s != null && l === "onScroll" && Se("scroll", e), a || u === s || (a = []))
                  : (a = a || []).push(l, s));
    }
    n && (a = a || []).push("style", n);
    var l = a;
    (t.updateQueue = l) && (t.flags |= 4);
  }
};
A2 = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Da(e, t) {
  if (!ke)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function st(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags & 14680064),
        (r |= i.flags & 14680064),
        (i.return = e),
        (i = i.sibling);
  else
    for (i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags),
        (r |= i.flags),
        (i.return = e),
        (i = i.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function o6(e, t, n) {
  var r = t.pendingProps;
  switch ((o0(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return st(t), null;
    case 1:
      return kt(t.type) && Ss(), st(t), null;
    case 3:
      return (
        (r = t.stateNode),
        Xi(),
        Te(Ct),
        Te(dt),
        m0(),
        r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ru(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), nn !== null && (qd(nn), (nn = null)))),
        Dd(e, t),
        st(t),
        null
      );
    case 5:
      p0(t);
      var i = Ir(Oo.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        E2(e, t, n, r, i), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(U(166));
          return st(t), null;
        }
        if (((e = Ir(Sn.current)), Ru(t))) {
          (r = t.stateNode), (n = t.type);
          var a = t.memoizedProps;
          switch (((r[_n] = t), (r[Co] = a), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              Se("cancel", r), Se("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              Se("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < Ja.length; i++) Se(Ja[i], r);
              break;
            case "source":
              Se("error", r);
              break;
            case "img":
            case "image":
            case "link":
              Se("error", r), Se("load", r);
              break;
            case "details":
              Se("toggle", r);
              break;
            case "input":
              dm(r, a), Se("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!a.multiple }), Se("invalid", r);
              break;
            case "textarea":
              pm(r, a), Se("invalid", r);
          }
          sd(n, a), (i = null);
          for (var o in a)
            if (a.hasOwnProperty(o)) {
              var u = a[o];
              o === "children"
                ? typeof u == "string"
                  ? r.textContent !== u &&
                    (a.suppressHydrationWarning !== !0 && Au(r.textContent, u, e),
                    (i = ["children", u]))
                  : typeof u == "number" &&
                    r.textContent !== "" + u &&
                    (a.suppressHydrationWarning !== !0 && Au(r.textContent, u, e),
                    (i = ["children", "" + u]))
                : vo.hasOwnProperty(o) && u != null && o === "onScroll" && Se("scroll", r);
            }
          switch (n) {
            case "input":
              $u(r), hm(r, a, !0);
              break;
            case "textarea":
              $u(r), mm(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof a.onClick == "function" && (r.onclick = xs);
          }
          (r = i), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (o = i.nodeType === 9 ? i : i.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = ab(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = o.createElement(n, { is: r.is }))
                  : ((e = o.createElement(n)),
                    n === "select" &&
                      ((o = e), r.multiple ? (o.multiple = !0) : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[_n] = t),
            (e[Co] = r),
            P2(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = ld(n, r)), n)) {
              case "dialog":
                Se("cancel", e), Se("close", e), (i = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Se("load", e), (i = r);
                break;
              case "video":
              case "audio":
                for (i = 0; i < Ja.length; i++) Se(Ja[i], e);
                i = r;
                break;
              case "source":
                Se("error", e), (i = r);
                break;
              case "img":
              case "image":
              case "link":
                Se("error", e), Se("load", e), (i = r);
                break;
              case "details":
                Se("toggle", e), (i = r);
                break;
              case "input":
                dm(e, r), (i = rd(e, r)), Se("invalid", e);
                break;
              case "option":
                i = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (i = Re({}, r, { value: void 0 })),
                  Se("invalid", e);
                break;
              case "textarea":
                pm(e, r), (i = od(e, r)), Se("invalid", e);
                break;
              default:
                i = r;
            }
            sd(n, i), (u = i);
            for (a in u)
              if (u.hasOwnProperty(a)) {
                var s = u[a];
                a === "style"
                  ? sb(e, s)
                  : a === "dangerouslySetInnerHTML"
                    ? ((s = s ? s.__html : void 0), s != null && ob(e, s))
                    : a === "children"
                      ? typeof s == "string"
                        ? (n !== "textarea" || s !== "") && go(e, s)
                        : typeof s == "number" && go(e, "" + s)
                      : a !== "suppressContentEditableWarning" &&
                        a !== "suppressHydrationWarning" &&
                        a !== "autoFocus" &&
                        (vo.hasOwnProperty(a)
                          ? s != null && a === "onScroll" && Se("scroll", e)
                          : s != null && Bh(e, a, s, o));
              }
            switch (n) {
              case "input":
                $u(e), hm(e, r, !1);
                break;
              case "textarea":
                $u(e), mm(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + br(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (a = r.value),
                  a != null
                    ? Ni(e, !!r.multiple, a, !1)
                    : r.defaultValue != null && Ni(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof i.onClick == "function" && (e.onclick = xs);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return st(t), null;
    case 6:
      if (e && t.stateNode != null) A2(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(U(166));
        if (((n = Ir(Oo.current)), Ir(Sn.current), Ru(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[_n] = t),
            (a = r.nodeValue !== n) && ((e = Ft), e !== null))
          )
            switch (e.tag) {
              case 3:
                Au(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Au(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          a && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[_n] = t),
            (t.stateNode = r);
      }
      return st(t), null;
    case 13:
      if (
        (Te(Pe),
        (r = t.memoizedState),
        e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (ke && Rt !== null && t.mode & 1 && !(t.flags & 128))
          Gb(), Gi(), (t.flags |= 98560), (a = !1);
        else if (((a = Ru(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!a) throw Error(U(318));
            if (((a = t.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
              throw Error(U(317));
            a[_n] = t;
          } else Gi(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          st(t), (a = !1);
        } else nn !== null && (qd(nn), (nn = null)), (a = !0);
        if (!a) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 && (e === null || Pe.current & 1 ? Qe === 0 && (Qe = 3) : k0())),
          t.updateQueue !== null && (t.flags |= 4),
          st(t),
          null);
    case 4:
      return Xi(), Dd(e, t), e === null && $o(t.stateNode.containerInfo), st(t), null;
    case 10:
      return f0(t.type._context), st(t), null;
    case 17:
      return kt(t.type) && Ss(), st(t), null;
    case 19:
      if ((Te(Pe), (a = t.memoizedState), a === null)) return st(t), null;
      if (((r = (t.flags & 128) !== 0), (o = a.rendering), o === null))
        if (r) Da(a, !1);
        else {
          if (Qe !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = Ps(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Da(a, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (a = n),
                    (e = r),
                    (a.flags &= 14680066),
                    (o = a.alternate),
                    o === null
                      ? ((a.childLanes = 0),
                        (a.lanes = e),
                        (a.child = null),
                        (a.subtreeFlags = 0),
                        (a.memoizedProps = null),
                        (a.memoizedState = null),
                        (a.updateQueue = null),
                        (a.dependencies = null),
                        (a.stateNode = null))
                      : ((a.childLanes = o.childLanes),
                        (a.lanes = o.lanes),
                        (a.child = o.child),
                        (a.subtreeFlags = 0),
                        (a.deletions = null),
                        (a.memoizedProps = o.memoizedProps),
                        (a.memoizedState = o.memoizedState),
                        (a.updateQueue = o.updateQueue),
                        (a.type = o.type),
                        (e = o.dependencies),
                        (a.dependencies =
                          e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                    (n = n.sibling);
                return xe(Pe, (Pe.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          a.tail !== null &&
            Ie() > Ji &&
            ((t.flags |= 128), (r = !0), Da(a, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Ps(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Da(a, !0),
              a.tail === null && a.tailMode === "hidden" && !o.alternate && !ke)
            )
              return st(t), null;
          } else
            2 * Ie() - a.renderingStartTime > Ji &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Da(a, !1), (t.lanes = 4194304));
        a.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = a.last), n !== null ? (n.sibling = o) : (t.child = o), (a.last = o));
      }
      return a.tail !== null
        ? ((t = a.tail),
          (a.rendering = t),
          (a.tail = t.sibling),
          (a.renderingStartTime = Ie()),
          (t.sibling = null),
          (n = Pe.current),
          xe(Pe, r ? (n & 1) | 2 : n & 1),
          t)
        : (st(t), null);
    case 22:
    case 23:
      return (
        C0(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? At & 1073741824 && (st(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : st(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(U(156, t.tag));
}
function u6(e, t) {
  switch ((o0(t), t.tag)) {
    case 1:
      return (
        kt(t.type) && Ss(), (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Xi(),
        Te(Ct),
        Te(dt),
        m0(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return p0(t), null;
    case 13:
      if ((Te(Pe), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(U(340));
        Gi();
      }
      return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
    case 19:
      return Te(Pe), null;
    case 4:
      return Xi(), null;
    case 10:
      return f0(t.type._context), null;
    case 22:
    case 23:
      return C0(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Nu = !1,
  ft = !1,
  s6 = typeof WeakSet == "function" ? WeakSet : Set,
  Q = null;
function Ai(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Fe(e, t, r);
      }
    else n.current = null;
}
function Nd(e, t, n) {
  try {
    n();
  } catch (r) {
    Fe(e, t, r);
  }
}
var iv = !1;
function l6(e, t) {
  if (((bd = bs), (e = Nb()), i0(e))) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var i = r.anchorOffset,
            a = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, a.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            u = -1,
            s = -1,
            l = 0,
            f = 0,
            c = e,
            d = null;
          t: for (;;) {
            for (
              var p;
              c !== n || (i !== 0 && c.nodeType !== 3) || (u = o + i),
                c !== a || (r !== 0 && c.nodeType !== 3) || (s = o + r),
                c.nodeType === 3 && (o += c.nodeValue.length),
                (p = c.firstChild) !== null;

            )
              (d = c), (c = p);
            for (;;) {
              if (c === e) break t;
              if (
                (d === n && ++l === i && (u = o),
                d === a && ++f === r && (s = o),
                (p = c.nextSibling) !== null)
              )
                break;
              (c = d), (d = c.parentNode);
            }
            c = p;
          }
          n = u === -1 || s === -1 ? null : { start: u, end: s };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (_d = { focusedElem: e, selectionRange: n }, bs = !1, Q = t; Q !== null; )
    if (((t = Q), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (Q = e);
    else
      for (; Q !== null; ) {
        t = Q;
        try {
          var g = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (g !== null) {
                  var y = g.memoizedProps,
                    b = g.memoizedState,
                    h = t.stateNode,
                    m = h.getSnapshotBeforeUpdate(t.elementType === t.type ? y : en(t.type, y), b);
                  h.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var v = t.stateNode.containerInfo;
                v.nodeType === 1
                  ? (v.textContent = "")
                  : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(U(163));
            }
        } catch (_) {
          Fe(t, t.return, _);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (Q = e);
          break;
        }
        Q = t.return;
      }
  return (g = iv), (iv = !1), g;
}
function uo(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next);
    do {
      if ((i.tag & e) === e) {
        var a = i.destroy;
        (i.destroy = void 0), a !== void 0 && Nd(t, n, a);
      }
      i = i.next;
    } while (i !== r);
  }
}
function Ml(e, t) {
  if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Id(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function R2(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), R2(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null && (delete t[_n], delete t[Co], delete t[Sd], delete t[B8], delete t[V8])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function F2(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function av(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || F2(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Ld(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = xs));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Ld(e, t, n), e = e.sibling; e !== null; ) Ld(e, t, n), (e = e.sibling);
}
function jd(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (jd(e, t, n), e = e.sibling; e !== null; ) jd(e, t, n), (e = e.sibling);
}
var rt = null,
  tn = !1;
function er(e, t, n) {
  for (n = n.child; n !== null; ) D2(e, t, n), (n = n.sibling);
}
function D2(e, t, n) {
  if (xn && typeof xn.onCommitFiberUnmount == "function")
    try {
      xn.onCommitFiberUnmount(wl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      ft || Ai(n, t);
    case 6:
      var r = rt,
        i = tn;
      (rt = null),
        er(e, t, n),
        (rt = r),
        (tn = i),
        rt !== null &&
          (tn
            ? ((e = rt),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : rt.removeChild(n.stateNode));
      break;
    case 18:
      rt !== null &&
        (tn
          ? ((e = rt),
            (n = n.stateNode),
            e.nodeType === 8 ? cc(e.parentNode, n) : e.nodeType === 1 && cc(e, n),
            wo(e))
          : cc(rt, n.stateNode));
      break;
    case 4:
      (r = rt),
        (i = tn),
        (rt = n.stateNode.containerInfo),
        (tn = !0),
        er(e, t, n),
        (rt = r),
        (tn = i);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ft && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
        i = r = r.next;
        do {
          var a = i,
            o = a.destroy;
          (a = a.tag), o !== void 0 && (a & 2 || a & 4) && Nd(n, t, o), (i = i.next);
        } while (i !== r);
      }
      er(e, t, n);
      break;
    case 1:
      if (!ft && (Ai(n, t), (r = n.stateNode), typeof r.componentWillUnmount == "function"))
        try {
          (r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount();
        } catch (u) {
          Fe(n, t, u);
        }
      er(e, t, n);
      break;
    case 21:
      er(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((ft = (r = ft) || n.memoizedState !== null), er(e, t, n), (ft = r))
        : er(e, t, n);
      break;
    default:
      er(e, t, n);
  }
}
function ov(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new s6()),
      t.forEach(function (r) {
        var i = y6.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(i, i));
      });
  }
}
function Jt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r];
      try {
        var a = e,
          o = t,
          u = o;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              (rt = u.stateNode), (tn = !1);
              break e;
            case 3:
              (rt = u.stateNode.containerInfo), (tn = !0);
              break e;
            case 4:
              (rt = u.stateNode.containerInfo), (tn = !0);
              break e;
          }
          u = u.return;
        }
        if (rt === null) throw Error(U(160));
        D2(a, o, i), (rt = null), (tn = !1);
        var s = i.alternate;
        s !== null && (s.return = null), (i.return = null);
      } catch (l) {
        Fe(i, t, l);
      }
    }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) N2(t, e), (t = t.sibling);
}
function N2(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Jt(t, e), gn(e), r & 4)) {
        try {
          uo(3, e, e.return), Ml(3, e);
        } catch (y) {
          Fe(e, e.return, y);
        }
        try {
          uo(5, e, e.return);
        } catch (y) {
          Fe(e, e.return, y);
        }
      }
      break;
    case 1:
      Jt(t, e), gn(e), r & 512 && n !== null && Ai(n, n.return);
      break;
    case 5:
      if ((Jt(t, e), gn(e), r & 512 && n !== null && Ai(n, n.return), e.flags & 32)) {
        var i = e.stateNode;
        try {
          go(i, "");
        } catch (y) {
          Fe(e, e.return, y);
        }
      }
      if (r & 4 && ((i = e.stateNode), i != null)) {
        var a = e.memoizedProps,
          o = n !== null ? n.memoizedProps : a,
          u = e.type,
          s = e.updateQueue;
        if (((e.updateQueue = null), s !== null))
          try {
            u === "input" && a.type === "radio" && a.name != null && rb(i, a), ld(u, o);
            var l = ld(u, a);
            for (o = 0; o < s.length; o += 2) {
              var f = s[o],
                c = s[o + 1];
              f === "style"
                ? sb(i, c)
                : f === "dangerouslySetInnerHTML"
                  ? ob(i, c)
                  : f === "children"
                    ? go(i, c)
                    : Bh(i, f, c, l);
            }
            switch (u) {
              case "input":
                id(i, a);
                break;
              case "textarea":
                ib(i, a);
                break;
              case "select":
                var d = i._wrapperState.wasMultiple;
                i._wrapperState.wasMultiple = !!a.multiple;
                var p = a.value;
                p != null
                  ? Ni(i, !!a.multiple, p, !1)
                  : d !== !!a.multiple &&
                    (a.defaultValue != null
                      ? Ni(i, !!a.multiple, a.defaultValue, !0)
                      : Ni(i, !!a.multiple, a.multiple ? [] : "", !1));
            }
            i[Co] = a;
          } catch (y) {
            Fe(e, e.return, y);
          }
      }
      break;
    case 6:
      if ((Jt(t, e), gn(e), r & 4)) {
        if (e.stateNode === null) throw Error(U(162));
        (i = e.stateNode), (a = e.memoizedProps);
        try {
          i.nodeValue = a;
        } catch (y) {
          Fe(e, e.return, y);
        }
      }
      break;
    case 3:
      if ((Jt(t, e), gn(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
        try {
          wo(t.containerInfo);
        } catch (y) {
          Fe(e, e.return, y);
        }
      break;
    case 4:
      Jt(t, e), gn(e);
      break;
    case 13:
      Jt(t, e),
        gn(e),
        (i = e.child),
        i.flags & 8192 &&
          ((a = i.memoizedState !== null),
          (i.stateNode.isHidden = a),
          !a || (i.alternate !== null && i.alternate.memoizedState !== null) || ($0 = Ie())),
        r & 4 && ov(e);
      break;
    case 22:
      if (
        ((f = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((ft = (l = ft) || f), Jt(t, e), (ft = l)) : Jt(t, e),
        gn(e),
        r & 8192)
      ) {
        if (((l = e.memoizedState !== null), (e.stateNode.isHidden = l) && !f && e.mode & 1))
          for (Q = e, f = e.child; f !== null; ) {
            for (c = Q = f; Q !== null; ) {
              switch (((d = Q), (p = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  uo(4, d, d.return);
                  break;
                case 1:
                  Ai(d, d.return);
                  var g = d.stateNode;
                  if (typeof g.componentWillUnmount == "function") {
                    (r = d), (n = d.return);
                    try {
                      (t = r),
                        (g.props = t.memoizedProps),
                        (g.state = t.memoizedState),
                        g.componentWillUnmount();
                    } catch (y) {
                      Fe(r, n, y);
                    }
                  }
                  break;
                case 5:
                  Ai(d, d.return);
                  break;
                case 22:
                  if (d.memoizedState !== null) {
                    sv(c);
                    continue;
                  }
              }
              p !== null ? ((p.return = d), (Q = p)) : sv(c);
            }
            f = f.sibling;
          }
        e: for (f = null, c = e; ; ) {
          if (c.tag === 5) {
            if (f === null) {
              f = c;
              try {
                (i = c.stateNode),
                  l
                    ? ((a = i.style),
                      typeof a.setProperty == "function"
                        ? a.setProperty("display", "none", "important")
                        : (a.display = "none"))
                    : ((u = c.stateNode),
                      (s = c.memoizedProps.style),
                      (o = s != null && s.hasOwnProperty("display") ? s.display : null),
                      (u.style.display = ub("display", o)));
              } catch (y) {
                Fe(e, e.return, y);
              }
            }
          } else if (c.tag === 6) {
            if (f === null)
              try {
                c.stateNode.nodeValue = l ? "" : c.memoizedProps;
              } catch (y) {
                Fe(e, e.return, y);
              }
          } else if (
            ((c.tag !== 22 && c.tag !== 23) || c.memoizedState === null || c === e) &&
            c.child !== null
          ) {
            (c.child.return = c), (c = c.child);
            continue;
          }
          if (c === e) break e;
          for (; c.sibling === null; ) {
            if (c.return === null || c.return === e) break e;
            f === c && (f = null), (c = c.return);
          }
          f === c && (f = null), (c.sibling.return = c.return), (c = c.sibling);
        }
      }
      break;
    case 19:
      Jt(t, e), gn(e), r & 4 && ov(e);
      break;
    case 21:
      break;
    default:
      Jt(t, e), gn(e);
  }
}
function gn(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (F2(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(U(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (go(i, ""), (r.flags &= -33));
          var a = av(e);
          jd(e, a, i);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            u = av(e);
          Ld(e, u, o);
          break;
        default:
          throw Error(U(161));
      }
    } catch (s) {
      Fe(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function f6(e, t, n) {
  (Q = e), I2(e);
}
function I2(e, t, n) {
  for (var r = (e.mode & 1) !== 0; Q !== null; ) {
    var i = Q,
      a = i.child;
    if (i.tag === 22 && r) {
      var o = i.memoizedState !== null || Nu;
      if (!o) {
        var u = i.alternate,
          s = (u !== null && u.memoizedState !== null) || ft;
        u = Nu;
        var l = ft;
        if (((Nu = o), (ft = s) && !l))
          for (Q = i; Q !== null; )
            (o = Q),
              (s = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? lv(i)
                : s !== null
                  ? ((s.return = o), (Q = s))
                  : lv(i);
        for (; a !== null; ) (Q = a), I2(a), (a = a.sibling);
        (Q = i), (Nu = u), (ft = l);
      }
      uv(e);
    } else i.subtreeFlags & 8772 && a !== null ? ((a.return = i), (Q = a)) : uv(e);
  }
}
function uv(e) {
  for (; Q !== null; ) {
    var t = Q;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ft || Ml(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !ft)
                if (n === null) r.componentDidMount();
                else {
                  var i = t.elementType === t.type ? n.memoizedProps : en(t.type, n.memoizedProps);
                  r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                }
              var a = t.updateQueue;
              a !== null && Hm(t, a, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Hm(t, o, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var s = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s.autoFocus && n.focus();
                    break;
                  case "img":
                    s.src && (n.src = s.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var l = t.alternate;
                if (l !== null) {
                  var f = l.memoizedState;
                  if (f !== null) {
                    var c = f.dehydrated;
                    c !== null && wo(c);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(U(163));
          }
        ft || (t.flags & 512 && Id(t));
      } catch (d) {
        Fe(t, t.return, d);
      }
    }
    if (t === e) {
      Q = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (Q = n);
      break;
    }
    Q = t.return;
  }
}
function sv(e) {
  for (; Q !== null; ) {
    var t = Q;
    if (t === e) {
      Q = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (Q = n);
      break;
    }
    Q = t.return;
  }
}
function lv(e) {
  for (; Q !== null; ) {
    var t = Q;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Ml(4, t);
          } catch (s) {
            Fe(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              Fe(t, i, s);
            }
          }
          var a = t.return;
          try {
            Id(t);
          } catch (s) {
            Fe(t, a, s);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Id(t);
          } catch (s) {
            Fe(t, o, s);
          }
      }
    } catch (s) {
      Fe(t, t.return, s);
    }
    if (t === e) {
      Q = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      (u.return = t.return), (Q = u);
      break;
    }
    Q = t.return;
  }
}
var c6 = Math.ceil,
  Rs = Yn.ReactCurrentDispatcher,
  x0 = Yn.ReactCurrentOwner,
  Vt = Yn.ReactCurrentBatchConfig,
  fe = 0,
  Xe = null,
  We = null,
  it = 0,
  At = 0,
  Ri = Tr(0),
  Qe = 0,
  Ao = null,
  Xr = 0,
  Pl = 0,
  S0 = 0,
  so = null,
  $t = null,
  $0 = 0,
  Ji = 1 / 0,
  Pn = null,
  Fs = !1,
  Ud = null,
  mr = null,
  Iu = !1,
  ur = null,
  Ds = 0,
  lo = 0,
  zd = null,
  is = -1,
  as = 0;
function vt() {
  return fe & 6 ? Ie() : is !== -1 ? is : (is = Ie());
}
function vr(e) {
  return e.mode & 1
    ? fe & 2 && it !== 0
      ? it & -it
      : Y8.transition !== null
        ? (as === 0 && (as = _b()), as)
        : ((e = ge), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : kb(e.type))), e)
    : 1;
}
function sn(e, t, n, r) {
  if (50 < lo) throw ((lo = 0), (zd = null), Error(U(185)));
  Jo(e, n, r),
    (!(fe & 2) || e !== Xe) &&
      (e === Xe && (!(fe & 2) && (Pl |= n), Qe === 4 && ar(e, it)),
      Ot(e, r),
      n === 1 && fe === 0 && !(t.mode & 1) && ((Ji = Ie() + 500), Cl && Cr()));
}
function Ot(e, t) {
  var n = e.callbackNode;
  Y4(e, t);
  var r = ys(e, e === Xe ? it : 0);
  if (r === 0) n !== null && ym(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && ym(n), t === 1))
      e.tag === 0 ? Q8(fv.bind(null, e)) : Vb(fv.bind(null, e)),
        q8(function () {
          !(fe & 6) && Cr();
        }),
        (n = null);
    else {
      switch (wb(r)) {
        case 1:
          n = Kh;
          break;
        case 4:
          n = yb;
          break;
        case 16:
          n = gs;
          break;
        case 536870912:
          n = bb;
          break;
        default:
          n = gs;
      }
      n = B2(n, L2.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function L2(e, t) {
  if (((is = -1), (as = 0), fe & 6)) throw Error(U(327));
  var n = e.callbackNode;
  if (zi() && e.callbackNode !== n) return null;
  var r = ys(e, e === Xe ? it : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Ns(e, r);
  else {
    t = r;
    var i = fe;
    fe |= 2;
    var a = U2();
    (Xe !== e || it !== t) && ((Pn = null), (Ji = Ie() + 500), qr(e, t));
    do
      try {
        p6();
        break;
      } catch (u) {
        j2(e, u);
      }
    while (!0);
    l0(), (Rs.current = a), (fe = i), We !== null ? (t = 0) : ((Xe = null), (it = 0), (t = Qe));
  }
  if (t !== 0) {
    if ((t === 2 && ((i = pd(e)), i !== 0 && ((r = i), (t = Wd(e, i)))), t === 1))
      throw ((n = Ao), qr(e, 0), ar(e, r), Ot(e, Ie()), n);
    if (t === 6) ar(e, r);
    else {
      if (
        ((i = e.current.alternate),
        !(r & 30) &&
          !d6(i) &&
          ((t = Ns(e, r)), t === 2 && ((a = pd(e)), a !== 0 && ((r = a), (t = Wd(e, a)))), t === 1))
      )
        throw ((n = Ao), qr(e, 0), ar(e, r), Ot(e, Ie()), n);
      switch (((e.finishedWork = i), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(U(345));
        case 2:
          Rr(e, $t, Pn);
          break;
        case 3:
          if ((ar(e, r), (r & 130023424) === r && ((t = $0 + 500 - Ie()), 10 < t))) {
            if (ys(e, 0) !== 0) break;
            if (((i = e.suspendedLanes), (i & r) !== r)) {
              vt(), (e.pingedLanes |= e.suspendedLanes & i);
              break;
            }
            e.timeoutHandle = xd(Rr.bind(null, e, $t, Pn), t);
            break;
          }
          Rr(e, $t, Pn);
          break;
        case 4:
          if ((ar(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, i = -1; 0 < r; ) {
            var o = 31 - un(r);
            (a = 1 << o), (o = t[o]), o > i && (i = o), (r &= ~a);
          }
          if (
            ((r = i),
            (r = Ie() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * c6(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = xd(Rr.bind(null, e, $t, Pn), r);
            break;
          }
          Rr(e, $t, Pn);
          break;
        case 5:
          Rr(e, $t, Pn);
          break;
        default:
          throw Error(U(329));
      }
    }
  }
  return Ot(e, Ie()), e.callbackNode === n ? L2.bind(null, e) : null;
}
function Wd(e, t) {
  var n = so;
  return (
    e.current.memoizedState.isDehydrated && (qr(e, t).flags |= 256),
    (e = Ns(e, t)),
    e !== 2 && ((t = $t), ($t = n), t !== null && qd(t)),
    e
  );
}
function qd(e) {
  $t === null ? ($t = e) : $t.push.apply($t, e);
}
function d6(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            a = i.getSnapshot;
          i = i.value;
          try {
            if (!ln(a(), i)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function ar(e, t) {
  for (
    t &= ~S0, t &= ~Pl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - un(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function fv(e) {
  if (fe & 6) throw Error(U(327));
  zi();
  var t = ys(e, 0);
  if (!(t & 1)) return Ot(e, Ie()), null;
  var n = Ns(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = pd(e);
    r !== 0 && ((t = r), (n = Wd(e, r)));
  }
  if (n === 1) throw ((n = Ao), qr(e, 0), ar(e, t), Ot(e, Ie()), n);
  if (n === 6) throw Error(U(345));
  return (
    (e.finishedWork = e.current.alternate), (e.finishedLanes = t), Rr(e, $t, Pn), Ot(e, Ie()), null
  );
}
function T0(e, t) {
  var n = fe;
  fe |= 1;
  try {
    return e(t);
  } finally {
    (fe = n), fe === 0 && ((Ji = Ie() + 500), Cl && Cr());
  }
}
function Zr(e) {
  ur !== null && ur.tag === 0 && !(fe & 6) && zi();
  var t = fe;
  fe |= 1;
  var n = Vt.transition,
    r = ge;
  try {
    if (((Vt.transition = null), (ge = 1), e)) return e();
  } finally {
    (ge = r), (Vt.transition = n), (fe = t), !(fe & 6) && Cr();
  }
}
function C0() {
  (At = Ri.current), Te(Ri);
}
function qr(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), W8(n)), We !== null))
    for (n = We.return; n !== null; ) {
      var r = n;
      switch ((o0(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Ss();
          break;
        case 3:
          Xi(), Te(Ct), Te(dt), m0();
          break;
        case 5:
          p0(r);
          break;
        case 4:
          Xi();
          break;
        case 13:
          Te(Pe);
          break;
        case 19:
          Te(Pe);
          break;
        case 10:
          f0(r.type._context);
          break;
        case 22:
        case 23:
          C0();
      }
      n = n.return;
    }
  if (
    ((Xe = e),
    (We = e = gr(e.current, null)),
    (it = At = t),
    (Qe = 0),
    (Ao = null),
    (S0 = Pl = Xr = 0),
    ($t = so = null),
    Nr !== null)
  ) {
    for (t = 0; t < Nr.length; t++)
      if (((n = Nr[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var i = r.next,
          a = n.pending;
        if (a !== null) {
          var o = a.next;
          (a.next = i), (r.next = o);
        }
        n.pending = r;
      }
    Nr = null;
  }
  return e;
}
function j2(e, t) {
  do {
    var n = We;
    try {
      if ((l0(), (ts.current = As), Es)) {
        for (var r = Ae.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), (r = r.next);
        }
        Es = !1;
      }
      if (
        ((Kr = 0),
        (Ke = Ve = Ae = null),
        (oo = !1),
        (Mo = 0),
        (x0.current = null),
        n === null || n.return === null)
      ) {
        (Qe = 1), (Ao = t), (We = null);
        break;
      }
      e: {
        var a = e,
          o = n.return,
          u = n,
          s = t;
        if (
          ((t = it),
          (u.flags |= 32768),
          s !== null && typeof s == "object" && typeof s.then == "function")
        ) {
          var l = s,
            f = u,
            c = f.tag;
          if (!(f.mode & 1) && (c === 0 || c === 11 || c === 15)) {
            var d = f.alternate;
            d
              ? ((f.updateQueue = d.updateQueue),
                (f.memoizedState = d.memoizedState),
                (f.lanes = d.lanes))
              : ((f.updateQueue = null), (f.memoizedState = null));
          }
          var p = Xm(o);
          if (p !== null) {
            (p.flags &= -257), Zm(p, o, u, a, t), p.mode & 1 && Km(a, l, t), (t = p), (s = l);
            var g = t.updateQueue;
            if (g === null) {
              var y = new Set();
              y.add(s), (t.updateQueue = y);
            } else g.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              Km(a, l, t), k0();
              break e;
            }
            s = Error(U(426));
          }
        } else if (ke && u.mode & 1) {
          var b = Xm(o);
          if (b !== null) {
            !(b.flags & 65536) && (b.flags |= 256), Zm(b, o, u, a, t), u0(Zi(s, u));
            break e;
          }
        }
        (a = s = Zi(s, u)), Qe !== 4 && (Qe = 2), so === null ? (so = [a]) : so.push(a), (a = o);
        do {
          switch (a.tag) {
            case 3:
              (a.flags |= 65536), (t &= -t), (a.lanes |= t);
              var h = x2(a, s, t);
              qm(a, h);
              break e;
            case 1:
              u = s;
              var m = a.type,
                v = a.stateNode;
              if (
                !(a.flags & 128) &&
                (typeof m.getDerivedStateFromError == "function" ||
                  (v !== null &&
                    typeof v.componentDidCatch == "function" &&
                    (mr === null || !mr.has(v))))
              ) {
                (a.flags |= 65536), (t &= -t), (a.lanes |= t);
                var _ = S2(a, u, t);
                qm(a, _);
                break e;
              }
          }
          a = a.return;
        } while (a !== null);
      }
      W2(n);
    } catch (S) {
      (t = S), We === n && n !== null && (We = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function U2() {
  var e = Rs.current;
  return (Rs.current = As), e === null ? As : e;
}
function k0() {
  (Qe === 0 || Qe === 3 || Qe === 2) && (Qe = 4),
    Xe === null || (!(Xr & 268435455) && !(Pl & 268435455)) || ar(Xe, it);
}
function Ns(e, t) {
  var n = fe;
  fe |= 2;
  var r = U2();
  (Xe !== e || it !== t) && ((Pn = null), qr(e, t));
  do
    try {
      h6();
      break;
    } catch (i) {
      j2(e, i);
    }
  while (!0);
  if ((l0(), (fe = n), (Rs.current = r), We !== null)) throw Error(U(261));
  return (Xe = null), (it = 0), Qe;
}
function h6() {
  for (; We !== null; ) z2(We);
}
function p6() {
  for (; We !== null && !j4(); ) z2(We);
}
function z2(e) {
  var t = H2(e.alternate, e, At);
  (e.memoizedProps = e.pendingProps), t === null ? W2(e) : (We = t), (x0.current = null);
}
function W2(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = u6(n, t)), n !== null)) {
        (n.flags &= 32767), (We = n);
        return;
      }
      if (e !== null) (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (Qe = 6), (We = null);
        return;
      }
    } else if (((n = o6(n, t, At)), n !== null)) {
      We = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      We = t;
      return;
    }
    We = t = e;
  } while (t !== null);
  Qe === 0 && (Qe = 5);
}
function Rr(e, t, n) {
  var r = ge,
    i = Vt.transition;
  try {
    (Vt.transition = null), (ge = 1), m6(e, t, n, r);
  } finally {
    (Vt.transition = i), (ge = r);
  }
  return null;
}
function m6(e, t, n, r) {
  do zi();
  while (ur !== null);
  if (fe & 6) throw Error(U(327));
  n = e.finishedWork;
  var i = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(U(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var a = n.lanes | n.childLanes;
  if (
    (G4(e, a),
    e === Xe && ((We = Xe = null), (it = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Iu ||
      ((Iu = !0),
      B2(gs, function () {
        return zi(), null;
      })),
    (a = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || a)
  ) {
    (a = Vt.transition), (Vt.transition = null);
    var o = ge;
    ge = 1;
    var u = fe;
    (fe |= 4),
      (x0.current = null),
      l6(e, n),
      N2(n, e),
      D8(_d),
      (bs = !!bd),
      (_d = bd = null),
      (e.current = n),
      f6(n),
      U4(),
      (fe = u),
      (ge = o),
      (Vt.transition = a);
  } else e.current = n;
  if (
    (Iu && ((Iu = !1), (ur = e), (Ds = i)),
    (a = e.pendingLanes),
    a === 0 && (mr = null),
    q4(n.stateNode),
    Ot(e, Ie()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (i = t[n]), r(i.value, { componentStack: i.stack, digest: i.digest });
  if (Fs) throw ((Fs = !1), (e = Ud), (Ud = null), e);
  return (
    Ds & 1 && e.tag !== 0 && zi(),
    (a = e.pendingLanes),
    a & 1 ? (e === zd ? lo++ : ((lo = 0), (zd = e))) : (lo = 0),
    Cr(),
    null
  );
}
function zi() {
  if (ur !== null) {
    var e = wb(Ds),
      t = Vt.transition,
      n = ge;
    try {
      if (((Vt.transition = null), (ge = 16 > e ? 16 : e), ur === null)) var r = !1;
      else {
        if (((e = ur), (ur = null), (Ds = 0), fe & 6)) throw Error(U(331));
        var i = fe;
        for (fe |= 4, Q = e.current; Q !== null; ) {
          var a = Q,
            o = a.child;
          if (Q.flags & 16) {
            var u = a.deletions;
            if (u !== null) {
              for (var s = 0; s < u.length; s++) {
                var l = u[s];
                for (Q = l; Q !== null; ) {
                  var f = Q;
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      uo(8, f, a);
                  }
                  var c = f.child;
                  if (c !== null) (c.return = f), (Q = c);
                  else
                    for (; Q !== null; ) {
                      f = Q;
                      var d = f.sibling,
                        p = f.return;
                      if ((R2(f), f === l)) {
                        Q = null;
                        break;
                      }
                      if (d !== null) {
                        (d.return = p), (Q = d);
                        break;
                      }
                      Q = p;
                    }
                }
              }
              var g = a.alternate;
              if (g !== null) {
                var y = g.child;
                if (y !== null) {
                  g.child = null;
                  do {
                    var b = y.sibling;
                    (y.sibling = null), (y = b);
                  } while (y !== null);
                }
              }
              Q = a;
            }
          }
          if (a.subtreeFlags & 2064 && o !== null) (o.return = a), (Q = o);
          else
            e: for (; Q !== null; ) {
              if (((a = Q), a.flags & 2048))
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    uo(9, a, a.return);
                }
              var h = a.sibling;
              if (h !== null) {
                (h.return = a.return), (Q = h);
                break e;
              }
              Q = a.return;
            }
        }
        var m = e.current;
        for (Q = m; Q !== null; ) {
          o = Q;
          var v = o.child;
          if (o.subtreeFlags & 2064 && v !== null) (v.return = o), (Q = v);
          else
            e: for (o = m; Q !== null; ) {
              if (((u = Q), u.flags & 2048))
                try {
                  switch (u.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ml(9, u);
                  }
                } catch (S) {
                  Fe(u, u.return, S);
                }
              if (u === o) {
                Q = null;
                break e;
              }
              var _ = u.sibling;
              if (_ !== null) {
                (_.return = u.return), (Q = _);
                break e;
              }
              Q = u.return;
            }
        }
        if (((fe = i), Cr(), xn && typeof xn.onPostCommitFiberRoot == "function"))
          try {
            xn.onPostCommitFiberRoot(wl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (ge = n), (Vt.transition = t);
    }
  }
  return !1;
}
function cv(e, t, n) {
  (t = Zi(n, t)),
    (t = x2(e, t, 1)),
    (e = pr(e, t, 1)),
    (t = vt()),
    e !== null && (Jo(e, 1, t), Ot(e, t));
}
function Fe(e, t, n) {
  if (e.tag === 3) cv(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        cv(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" && (mr === null || !mr.has(r)))
        ) {
          (e = Zi(n, e)),
            (e = S2(t, e, 1)),
            (t = pr(t, e, 1)),
            (e = vt()),
            t !== null && (Jo(t, 1, e), Ot(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function v6(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = vt()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Xe === e &&
      (it & n) === n &&
      (Qe === 4 || (Qe === 3 && (it & 130023424) === it && 500 > Ie() - $0) ? qr(e, 0) : (S0 |= n)),
    Ot(e, t);
}
function q2(e, t) {
  t === 0 && (e.mode & 1 ? ((t = ku), (ku <<= 1), !(ku & 130023424) && (ku = 4194304)) : (t = 1));
  var n = vt();
  (e = qn(e, t)), e !== null && (Jo(e, t, n), Ot(e, n));
}
function g6(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), q2(e, n);
}
function y6(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        i = e.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(U(314));
  }
  r !== null && r.delete(t), q2(e, n);
}
var H2;
H2 = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Ct.current) Tt = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (Tt = !1), a6(e, t, n);
      Tt = !!(e.flags & 131072);
    }
  else (Tt = !1), ke && t.flags & 1048576 && Qb(t, Cs, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      rs(e, t), (e = t.pendingProps);
      var i = Yi(t, dt.current);
      Ui(t, n), (i = g0(null, t, r, e, i, n));
      var a = y0();
      return (
        (t.flags |= 1),
        typeof i == "object" && i !== null && typeof i.render == "function" && i.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            kt(r) ? ((a = !0), $s(t)) : (a = !1),
            (t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
            d0(t),
            (i.updater = kl),
            (t.stateNode = i),
            (i._reactInternals = t),
            Md(t, r, e, n),
            (t = Ad(null, t, r, !0, a, n)))
          : ((t.tag = 0), ke && a && a0(t), pt(null, t, i, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (rs(e, t),
          (e = t.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (t.type = r),
          (i = t.tag = _6(r)),
          (e = en(r, e)),
          i)
        ) {
          case 0:
            t = Ed(null, t, r, e, n);
            break e;
          case 1:
            t = tv(null, t, r, e, n);
            break e;
          case 11:
            t = Jm(null, t, r, e, n);
            break e;
          case 14:
            t = ev(null, t, r, en(r.type, e), n);
            break e;
        }
        throw Error(U(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : en(r, i)),
        Ed(e, t, r, i, n)
      );
    case 1:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : en(r, i)),
        tv(e, t, r, i, n)
      );
    case 3:
      e: {
        if ((k2(t), e === null)) throw Error(U(387));
        (r = t.pendingProps), (a = t.memoizedState), (i = a.element), Xb(e, t), Ms(t, r, null, n);
        var o = t.memoizedState;
        if (((r = o.element), a.isDehydrated))
          if (
            ((a = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = a),
            (t.memoizedState = a),
            t.flags & 256)
          ) {
            (i = Zi(Error(U(423)), t)), (t = nv(e, t, r, n, i));
            break e;
          } else if (r !== i) {
            (i = Zi(Error(U(424)), t)), (t = nv(e, t, r, n, i));
            break e;
          } else
            for (
              Rt = hr(t.stateNode.containerInfo.firstChild),
                Ft = t,
                ke = !0,
                nn = null,
                n = t2(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Gi(), r === i)) {
            t = Hn(e, t, n);
            break e;
          }
          pt(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        n2(t),
        e === null && Cd(t),
        (r = t.type),
        (i = t.pendingProps),
        (a = e !== null ? e.memoizedProps : null),
        (o = i.children),
        wd(r, i) ? (o = null) : a !== null && wd(r, a) && (t.flags |= 32),
        C2(e, t),
        pt(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && Cd(t), null;
    case 13:
      return O2(e, t, n);
    case 4:
      return (
        h0(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Ki(t, null, r, n)) : pt(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : en(r, i)),
        Jm(e, t, r, i, n)
      );
    case 7:
      return pt(e, t, t.pendingProps, n), t.child;
    case 8:
      return pt(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return pt(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (i = t.pendingProps),
          (a = t.memoizedProps),
          (o = i.value),
          xe(ks, r._currentValue),
          (r._currentValue = o),
          a !== null)
        )
          if (ln(a.value, o)) {
            if (a.children === i.children && !Ct.current) {
              t = Hn(e, t, n);
              break e;
            }
          } else
            for (a = t.child, a !== null && (a.return = t); a !== null; ) {
              var u = a.dependencies;
              if (u !== null) {
                o = a.child;
                for (var s = u.firstContext; s !== null; ) {
                  if (s.context === r) {
                    if (a.tag === 1) {
                      (s = jn(-1, n & -n)), (s.tag = 2);
                      var l = a.updateQueue;
                      if (l !== null) {
                        l = l.shared;
                        var f = l.pending;
                        f === null ? (s.next = s) : ((s.next = f.next), (f.next = s)),
                          (l.pending = s);
                      }
                    }
                    (a.lanes |= n),
                      (s = a.alternate),
                      s !== null && (s.lanes |= n),
                      kd(a.return, n, t),
                      (u.lanes |= n);
                    break;
                  }
                  s = s.next;
                }
              } else if (a.tag === 10) o = a.type === t.type ? null : a.child;
              else if (a.tag === 18) {
                if (((o = a.return), o === null)) throw Error(U(341));
                (o.lanes |= n),
                  (u = o.alternate),
                  u !== null && (u.lanes |= n),
                  kd(o, n, t),
                  (o = a.sibling);
              } else o = a.child;
              if (o !== null) o.return = a;
              else
                for (o = a; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((a = o.sibling), a !== null)) {
                    (a.return = o.return), (o = a);
                    break;
                  }
                  o = o.return;
                }
              a = o;
            }
        pt(e, t, i.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (i = t.type),
        (r = t.pendingProps.children),
        Ui(t, n),
        (i = Gt(i)),
        (r = r(i)),
        (t.flags |= 1),
        pt(e, t, r, n),
        t.child
      );
    case 14:
      return (r = t.type), (i = en(r, t.pendingProps)), (i = en(r.type, i)), ev(e, t, r, i, n);
    case 15:
      return $2(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : en(r, i)),
        rs(e, t),
        (t.tag = 1),
        kt(r) ? ((e = !0), $s(t)) : (e = !1),
        Ui(t, n),
        Jb(t, r, i),
        Md(t, r, i, n),
        Ad(null, t, r, !0, e, n)
      );
    case 19:
      return M2(e, t, n);
    case 22:
      return T2(e, t, n);
  }
  throw Error(U(156, t.tag));
};
function B2(e, t) {
  return gb(e, t);
}
function b6(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function Ht(e, t, n, r) {
  return new b6(e, t, n, r);
}
function O0(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function _6(e) {
  if (typeof e == "function") return O0(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Qh)) return 11;
    if (e === Yh) return 14;
  }
  return 2;
}
function gr(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Ht(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function os(e, t, n, r, i, a) {
  var o = 2;
  if (((r = e), typeof e == "function")) O0(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case Si:
        return Hr(n.children, i, a, t);
      case Vh:
        (o = 8), (i |= 8);
        break;
      case Jc:
        return (e = Ht(12, n, t, i | 2)), (e.elementType = Jc), (e.lanes = a), e;
      case ed:
        return (e = Ht(13, n, t, i)), (e.elementType = ed), (e.lanes = a), e;
      case td:
        return (e = Ht(19, n, t, i)), (e.elementType = td), (e.lanes = a), e;
      case eb:
        return El(n, i, a, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Zy:
              o = 10;
              break e;
            case Jy:
              o = 9;
              break e;
            case Qh:
              o = 11;
              break e;
            case Yh:
              o = 14;
              break e;
            case nr:
              (o = 16), (r = null);
              break e;
          }
        throw Error(U(130, e == null ? e : typeof e, ""));
    }
  return (t = Ht(o, n, t, i)), (t.elementType = e), (t.type = r), (t.lanes = a), t;
}
function Hr(e, t, n, r) {
  return (e = Ht(7, e, r, t)), (e.lanes = n), e;
}
function El(e, t, n, r) {
  return (
    (e = Ht(22, e, r, t)), (e.elementType = eb), (e.lanes = n), (e.stateNode = { isHidden: !1 }), e
  );
}
function bc(e, t, n) {
  return (e = Ht(6, e, null, t)), (e.lanes = n), e;
}
function _c(e, t, n) {
  return (
    (t = Ht(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function w6(e, t, n, r, i) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ec(0)),
    (this.expirationTimes = ec(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ec(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null);
}
function M0(e, t, n, r, i, a, o, u, s) {
  return (
    (e = new w6(e, t, n, u, s)),
    t === 1 ? ((t = 1), a === !0 && (t |= 8)) : (t = 0),
    (a = Ht(3, null, null, t)),
    (e.current = a),
    (a.stateNode = e),
    (a.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    d0(a),
    e
  );
}
function x6(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: xi,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function V2(e) {
  if (!e) return _r;
  e = e._reactInternals;
  e: {
    if (oi(e) !== e || e.tag !== 1) throw Error(U(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (kt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(U(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (kt(n)) return Bb(e, n, t);
  }
  return t;
}
function Q2(e, t, n, r, i, a, o, u, s) {
  return (
    (e = M0(n, r, !0, e, i, a, o, u, s)),
    (e.context = V2(null)),
    (n = e.current),
    (r = vt()),
    (i = vr(n)),
    (a = jn(r, i)),
    (a.callback = t ?? null),
    pr(n, a, i),
    (e.current.lanes = i),
    Jo(e, i, r),
    Ot(e, r),
    e
  );
}
function Al(e, t, n, r) {
  var i = t.current,
    a = vt(),
    o = vr(i);
  return (
    (n = V2(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = jn(a, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = pr(i, t, o)),
    e !== null && (sn(e, i, o, a), es(e, i, o)),
    o
  );
}
function Is(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function dv(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function P0(e, t) {
  dv(e, t), (e = e.alternate) && dv(e, t);
}
function S6() {
  return null;
}
var Y2 =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function E0(e) {
  this._internalRoot = e;
}
Rl.prototype.render = E0.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(U(409));
  Al(e, t, null, null);
};
Rl.prototype.unmount = E0.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Zr(function () {
      Al(null, e, null, null);
    }),
      (t[Wn] = null);
  }
};
function Rl(e) {
  this._internalRoot = e;
}
Rl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = $b();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ir.length && t !== 0 && t < ir[n].priority; n++);
    ir.splice(n, 0, e), n === 0 && Cb(e);
  }
};
function A0(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Fl(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function hv() {}
function $6(e, t, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var a = r;
      r = function () {
        var l = Is(o);
        a.call(l);
      };
    }
    var o = Q2(t, r, e, 0, null, !1, !1, "", hv);
    return (
      (e._reactRootContainer = o),
      (e[Wn] = o.current),
      $o(e.nodeType === 8 ? e.parentNode : e),
      Zr(),
      o
    );
  }
  for (; (i = e.lastChild); ) e.removeChild(i);
  if (typeof r == "function") {
    var u = r;
    r = function () {
      var l = Is(s);
      u.call(l);
    };
  }
  var s = M0(e, 0, !1, null, null, !1, !1, "", hv);
  return (
    (e._reactRootContainer = s),
    (e[Wn] = s.current),
    $o(e.nodeType === 8 ? e.parentNode : e),
    Zr(function () {
      Al(t, s, n, r);
    }),
    s
  );
}
function Dl(e, t, n, r, i) {
  var a = n._reactRootContainer;
  if (a) {
    var o = a;
    if (typeof i == "function") {
      var u = i;
      i = function () {
        var s = Is(o);
        u.call(s);
      };
    }
    Al(t, o, e, i);
  } else o = $6(n, t, e, i, r);
  return Is(o);
}
xb = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Za(t.pendingLanes);
        n !== 0 && (Xh(t, n | 1), Ot(t, Ie()), !(fe & 6) && ((Ji = Ie() + 500), Cr()));
      }
      break;
    case 13:
      Zr(function () {
        var r = qn(e, 1);
        if (r !== null) {
          var i = vt();
          sn(r, e, 1, i);
        }
      }),
        P0(e, 1);
  }
};
Zh = function (e) {
  if (e.tag === 13) {
    var t = qn(e, 134217728);
    if (t !== null) {
      var n = vt();
      sn(t, e, 134217728, n);
    }
    P0(e, 134217728);
  }
};
Sb = function (e) {
  if (e.tag === 13) {
    var t = vr(e),
      n = qn(e, t);
    if (n !== null) {
      var r = vt();
      sn(n, e, t, r);
    }
    P0(e, t);
  }
};
$b = function () {
  return ge;
};
Tb = function (e, t) {
  var n = ge;
  try {
    return (ge = e), t();
  } finally {
    ge = n;
  }
};
cd = function (e, t, n) {
  switch (t) {
    case "input":
      if ((id(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var i = Tl(r);
            if (!i) throw Error(U(90));
            nb(r), id(r, i);
          }
        }
      }
      break;
    case "textarea":
      ib(e, n);
      break;
    case "select":
      (t = n.value), t != null && Ni(e, !!n.multiple, t, !1);
  }
};
cb = T0;
db = Zr;
var T6 = { usingClientEntryPoint: !1, Events: [tu, ki, Tl, lb, fb, T0] },
  Na = {
    findFiberByHostInstance: Dr,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  C6 = {
    bundleType: Na.bundleType,
    version: Na.version,
    rendererPackageName: Na.rendererPackageName,
    rendererConfig: Na.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Yn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = mb(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Na.findFiberByHostInstance || S6,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Lu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Lu.isDisabled && Lu.supportsFiber)
    try {
      (wl = Lu.inject(C6)), (xn = Lu);
    } catch {}
}
Nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T6;
Nt.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!A0(t)) throw Error(U(200));
  return x6(e, t, null, n);
};
Nt.createRoot = function (e, t) {
  if (!A0(e)) throw Error(U(299));
  var n = !1,
    r = "",
    i = Y2;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
    (t = M0(e, 1, !1, null, null, n, !1, r, i)),
    (e[Wn] = t.current),
    $o(e.nodeType === 8 ? e.parentNode : e),
    new E0(t)
  );
};
Nt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(U(188))
      : ((e = Object.keys(e).join(",")), Error(U(268, e)));
  return (e = mb(t)), (e = e === null ? null : e.stateNode), e;
};
Nt.flushSync = function (e) {
  return Zr(e);
};
Nt.hydrate = function (e, t, n) {
  if (!Fl(t)) throw Error(U(200));
  return Dl(null, e, t, !0, n);
};
Nt.hydrateRoot = function (e, t, n) {
  if (!A0(e)) throw Error(U(405));
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    a = "",
    o = Y2;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (a = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = Q2(t, null, e, 1, n ?? null, i, !1, a, o)),
    (e[Wn] = t.current),
    $o(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (i = n._getVersion),
        (i = i(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, i])
          : t.mutableSourceEagerHydrationData.push(n, i);
  return new Rl(t);
};
Nt.render = function (e, t, n) {
  if (!Fl(t)) throw Error(U(200));
  return Dl(null, e, t, !1, n);
};
Nt.unmountComponentAtNode = function (e) {
  if (!Fl(e)) throw Error(U(40));
  return e._reactRootContainer
    ? (Zr(function () {
        Dl(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Wn] = null);
        });
      }),
      !0)
    : !1;
};
Nt.unstable_batchedUpdates = T0;
Nt.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Fl(n)) throw Error(U(200));
  if (e == null || e._reactInternals === void 0) throw Error(U(38));
  return Dl(e, t, n, !1, r);
};
Nt.version = "18.2.0-next-9e3b772b8-20220608";
function G2() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(G2);
    } catch (e) {
      console.error(e);
    }
}
G2(), (Qy.exports = Nt);
var K2 = Qy.exports;
const k6 = gt(K2);
var ru = (function () {
    function e() {
      this.listeners = [];
    }
    var t = e.prototype;
    return (
      (t.subscribe = function (r) {
        var i = this,
          a = r || function () {};
        return (
          this.listeners.push(a),
          this.onSubscribe(),
          function () {
            (i.listeners = i.listeners.filter(function (o) {
              return o !== a;
            })),
              i.onUnsubscribe();
          }
        );
      }),
      (t.hasListeners = function () {
        return this.listeners.length > 0;
      }),
      (t.onSubscribe = function () {}),
      (t.onUnsubscribe = function () {}),
      e
    );
  })(),
  Ls = typeof window > "u";
function lt() {}
function O6(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Hd(e) {
  return typeof e == "number" && e >= 0 && e !== 1 / 0;
}
function js(e) {
  return Array.isArray(e) ? e : [e];
}
function X2(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function us(e, t, n) {
  return Nl(e)
    ? typeof t == "function"
      ? me({}, n, { queryKey: e, queryFn: t })
      : me({}, t, { queryKey: e })
    : e;
}
function Rn(e, t, n) {
  return Nl(e) ? [me({}, t, { queryKey: e }), n] : [e || {}, t];
}
function M6(e, t) {
  if ((e === !0 && t === !0) || (e == null && t == null)) return "all";
  if (e === !1 && t === !1) return "none";
  var n = e ?? !t;
  return n ? "active" : "inactive";
}
function pv(e, t) {
  var n = e.active,
    r = e.exact,
    i = e.fetching,
    a = e.inactive,
    o = e.predicate,
    u = e.queryKey,
    s = e.stale;
  if (Nl(u)) {
    if (r) {
      if (t.queryHash !== R0(u, t.options)) return !1;
    } else if (!Us(t.queryKey, u)) return !1;
  }
  var l = M6(n, a);
  if (l === "none") return !1;
  if (l !== "all") {
    var f = t.isActive();
    if ((l === "active" && !f) || (l === "inactive" && f)) return !1;
  }
  return !(
    (typeof s == "boolean" && t.isStale() !== s) ||
    (typeof i == "boolean" && t.isFetching() !== i) ||
    (o && !o(t))
  );
}
function mv(e, t) {
  var n = e.exact,
    r = e.fetching,
    i = e.predicate,
    a = e.mutationKey;
  if (Nl(a)) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (Lr(t.options.mutationKey) !== Lr(a)) return !1;
    } else if (!Us(t.options.mutationKey, a)) return !1;
  }
  return !((typeof r == "boolean" && (t.state.status === "loading") !== r) || (i && !i(t)));
}
function R0(e, t) {
  var n = (t == null ? void 0 : t.queryKeyHashFn) || Lr;
  return n(e);
}
function Lr(e) {
  var t = js(e);
  return P6(t);
}
function P6(e) {
  return JSON.stringify(e, function (t, n) {
    return Bd(n)
      ? Object.keys(n)
          .sort()
          .reduce(function (r, i) {
            return (r[i] = n[i]), r;
          }, {})
      : n;
  });
}
function Us(e, t) {
  return Z2(js(e), js(t));
}
function Z2(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
      ? !1
      : e && t && typeof e == "object" && typeof t == "object"
        ? !Object.keys(t).some(function (n) {
            return !Z2(e[n], t[n]);
          })
        : !1;
}
function zs(e, t) {
  if (e === t) return e;
  var n = Array.isArray(e) && Array.isArray(t);
  if (n || (Bd(e) && Bd(t))) {
    for (
      var r = n ? e.length : Object.keys(e).length,
        i = n ? t : Object.keys(t),
        a = i.length,
        o = n ? [] : {},
        u = 0,
        s = 0;
      s < a;
      s++
    ) {
      var l = n ? s : i[s];
      (o[l] = zs(e[l], t[l])), o[l] === e[l] && u++;
    }
    return r === a && u === r ? e : o;
  }
  return t;
}
function E6(e, t) {
  if ((e && !t) || (t && !e)) return !1;
  for (var n in e) if (e[n] !== t[n]) return !1;
  return !0;
}
function Bd(e) {
  if (!vv(e)) return !1;
  var t = e.constructor;
  if (typeof t > "u") return !0;
  var n = t.prototype;
  return !(!vv(n) || !n.hasOwnProperty("isPrototypeOf"));
}
function vv(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function Nl(e) {
  return typeof e == "string" || Array.isArray(e);
}
function A6(e) {
  return new Promise(function (t) {
    setTimeout(t, e);
  });
}
function gv(e) {
  Promise.resolve()
    .then(e)
    .catch(function (t) {
      return setTimeout(function () {
        throw t;
      });
    });
}
function J2() {
  if (typeof AbortController == "function") return new AbortController();
}
var R6 = (function (e) {
    Zo(t, e);
    function t() {
      var r;
      return (
        (r = e.call(this) || this),
        (r.setup = function (i) {
          var a;
          if (!Ls && (a = window) != null && a.addEventListener) {
            var o = function () {
              return i();
            };
            return (
              window.addEventListener("visibilitychange", o, !1),
              window.addEventListener("focus", o, !1),
              function () {
                window.removeEventListener("visibilitychange", o),
                  window.removeEventListener("focus", o);
              }
            );
          }
        }),
        r
      );
    }
    var n = t.prototype;
    return (
      (n.onSubscribe = function () {
        this.cleanup || this.setEventListener(this.setup);
      }),
      (n.onUnsubscribe = function () {
        if (!this.hasListeners()) {
          var i;
          (i = this.cleanup) == null || i.call(this), (this.cleanup = void 0);
        }
      }),
      (n.setEventListener = function (i) {
        var a,
          o = this;
        (this.setup = i),
          (a = this.cleanup) == null || a.call(this),
          (this.cleanup = i(function (u) {
            typeof u == "boolean" ? o.setFocused(u) : o.onFocus();
          }));
      }),
      (n.setFocused = function (i) {
        (this.focused = i), i && this.onFocus();
      }),
      (n.onFocus = function () {
        this.listeners.forEach(function (i) {
          i();
        });
      }),
      (n.isFocused = function () {
        return typeof this.focused == "boolean"
          ? this.focused
          : typeof document > "u"
            ? !0
            : [void 0, "visible", "prerender"].includes(document.visibilityState);
      }),
      t
    );
  })(ru),
  fo = new R6(),
  F6 = (function (e) {
    Zo(t, e);
    function t() {
      var r;
      return (
        (r = e.call(this) || this),
        (r.setup = function (i) {
          var a;
          if (!Ls && (a = window) != null && a.addEventListener) {
            var o = function () {
              return i();
            };
            return (
              window.addEventListener("online", o, !1),
              window.addEventListener("offline", o, !1),
              function () {
                window.removeEventListener("online", o), window.removeEventListener("offline", o);
              }
            );
          }
        }),
        r
      );
    }
    var n = t.prototype;
    return (
      (n.onSubscribe = function () {
        this.cleanup || this.setEventListener(this.setup);
      }),
      (n.onUnsubscribe = function () {
        if (!this.hasListeners()) {
          var i;
          (i = this.cleanup) == null || i.call(this), (this.cleanup = void 0);
        }
      }),
      (n.setEventListener = function (i) {
        var a,
          o = this;
        (this.setup = i),
          (a = this.cleanup) == null || a.call(this),
          (this.cleanup = i(function (u) {
            typeof u == "boolean" ? o.setOnline(u) : o.onOnline();
          }));
      }),
      (n.setOnline = function (i) {
        (this.online = i), i && this.onOnline();
      }),
      (n.onOnline = function () {
        this.listeners.forEach(function (i) {
          i();
        });
      }),
      (n.isOnline = function () {
        return typeof this.online == "boolean"
          ? this.online
          : typeof navigator > "u" || typeof navigator.onLine > "u"
            ? !0
            : navigator.onLine;
      }),
      t
    );
  })(ru),
  ss = new F6();
function D6(e) {
  return Math.min(1e3 * Math.pow(2, e), 3e4);
}
function Ws(e) {
  return typeof (e == null ? void 0 : e.cancel) == "function";
}
var e_ = function (t) {
  (this.revert = t == null ? void 0 : t.revert), (this.silent = t == null ? void 0 : t.silent);
};
function ls(e) {
  return e instanceof e_;
}
var t_ = function (t) {
    var n = this,
      r = !1,
      i,
      a,
      o,
      u;
    (this.abort = t.abort),
      (this.cancel = function (d) {
        return i == null ? void 0 : i(d);
      }),
      (this.cancelRetry = function () {
        r = !0;
      }),
      (this.continueRetry = function () {
        r = !1;
      }),
      (this.continue = function () {
        return a == null ? void 0 : a();
      }),
      (this.failureCount = 0),
      (this.isPaused = !1),
      (this.isResolved = !1),
      (this.isTransportCancelable = !1),
      (this.promise = new Promise(function (d, p) {
        (o = d), (u = p);
      }));
    var s = function (p) {
        n.isResolved ||
          ((n.isResolved = !0), t.onSuccess == null || t.onSuccess(p), a == null || a(), o(p));
      },
      l = function (p) {
        n.isResolved ||
          ((n.isResolved = !0), t.onError == null || t.onError(p), a == null || a(), u(p));
      },
      f = function () {
        return new Promise(function (p) {
          (a = p), (n.isPaused = !0), t.onPause == null || t.onPause();
        }).then(function () {
          (a = void 0), (n.isPaused = !1), t.onContinue == null || t.onContinue();
        });
      },
      c = function d() {
        if (!n.isResolved) {
          var p;
          try {
            p = t.fn();
          } catch (g) {
            p = Promise.reject(g);
          }
          (i = function (y) {
            if (!n.isResolved && (l(new e_(y)), n.abort == null || n.abort(), Ws(p)))
              try {
                p.cancel();
              } catch {}
          }),
            (n.isTransportCancelable = Ws(p)),
            Promise.resolve(p)
              .then(s)
              .catch(function (g) {
                var y, b;
                if (!n.isResolved) {
                  var h = (y = t.retry) != null ? y : 3,
                    m = (b = t.retryDelay) != null ? b : D6,
                    v = typeof m == "function" ? m(n.failureCount, g) : m,
                    _ =
                      h === !0 ||
                      (typeof h == "number" && n.failureCount < h) ||
                      (typeof h == "function" && h(n.failureCount, g));
                  if (r || !_) {
                    l(g);
                    return;
                  }
                  n.failureCount++,
                    t.onFail == null || t.onFail(n.failureCount, g),
                    A6(v)
                      .then(function () {
                        if (!fo.isFocused() || !ss.isOnline()) return f();
                      })
                      .then(function () {
                        r ? l(g) : d();
                      });
                }
              });
        }
      };
    c();
  },
  N6 = (function () {
    function e() {
      (this.queue = []),
        (this.transactions = 0),
        (this.notifyFn = function (n) {
          n();
        }),
        (this.batchNotifyFn = function (n) {
          n();
        });
    }
    var t = e.prototype;
    return (
      (t.batch = function (r) {
        var i;
        this.transactions++;
        try {
          i = r();
        } finally {
          this.transactions--, this.transactions || this.flush();
        }
        return i;
      }),
      (t.schedule = function (r) {
        var i = this;
        this.transactions
          ? this.queue.push(r)
          : gv(function () {
              i.notifyFn(r);
            });
      }),
      (t.batchCalls = function (r) {
        var i = this;
        return function () {
          for (var a = arguments.length, o = new Array(a), u = 0; u < a; u++) o[u] = arguments[u];
          i.schedule(function () {
            r.apply(void 0, o);
          });
        };
      }),
      (t.flush = function () {
        var r = this,
          i = this.queue;
        (this.queue = []),
          i.length &&
            gv(function () {
              r.batchNotifyFn(function () {
                i.forEach(function (a) {
                  r.notifyFn(a);
                });
              });
            });
      }),
      (t.setNotifyFunction = function (r) {
        this.notifyFn = r;
      }),
      (t.setBatchNotifyFunction = function (r) {
        this.batchNotifyFn = r;
      }),
      e
    );
  })(),
  Ee = new N6(),
  n_ = console;
function qs() {
  return n_;
}
function I6(e) {
  n_ = e;
}
var L6 = (function () {
    function e(n) {
      (this.abortSignalConsumed = !1),
        (this.hadObservers = !1),
        (this.defaultOptions = n.defaultOptions),
        this.setOptions(n.options),
        (this.observers = []),
        (this.cache = n.cache),
        (this.queryKey = n.queryKey),
        (this.queryHash = n.queryHash),
        (this.initialState = n.state || this.getDefaultState(this.options)),
        (this.state = this.initialState),
        (this.meta = n.meta),
        this.scheduleGc();
    }
    var t = e.prototype;
    return (
      (t.setOptions = function (r) {
        var i;
        (this.options = me({}, this.defaultOptions, r)),
          (this.meta = r == null ? void 0 : r.meta),
          (this.cacheTime = Math.max(
            this.cacheTime || 0,
            (i = this.options.cacheTime) != null ? i : 5 * 60 * 1e3,
          ));
      }),
      (t.setDefaultOptions = function (r) {
        this.defaultOptions = r;
      }),
      (t.scheduleGc = function () {
        var r = this;
        this.clearGcTimeout(),
          Hd(this.cacheTime) &&
            (this.gcTimeout = setTimeout(function () {
              r.optionalRemove();
            }, this.cacheTime));
      }),
      (t.clearGcTimeout = function () {
        this.gcTimeout && (clearTimeout(this.gcTimeout), (this.gcTimeout = void 0));
      }),
      (t.optionalRemove = function () {
        this.observers.length ||
          (this.state.isFetching
            ? this.hadObservers && this.scheduleGc()
            : this.cache.remove(this));
      }),
      (t.setData = function (r, i) {
        var a,
          o,
          u = this.state.data,
          s = O6(r, u);
        return (
          (a = (o = this.options).isDataEqual) != null && a.call(o, u, s)
            ? (s = u)
            : this.options.structuralSharing !== !1 && (s = zs(u, s)),
          this.dispatch({
            data: s,
            type: "success",
            dataUpdatedAt: i == null ? void 0 : i.updatedAt,
          }),
          s
        );
      }),
      (t.setState = function (r, i) {
        this.dispatch({ type: "setState", state: r, setStateOptions: i });
      }),
      (t.cancel = function (r) {
        var i,
          a = this.promise;
        return (
          (i = this.retryer) == null || i.cancel(r), a ? a.then(lt).catch(lt) : Promise.resolve()
        );
      }),
      (t.destroy = function () {
        this.clearGcTimeout(), this.cancel({ silent: !0 });
      }),
      (t.reset = function () {
        this.destroy(), this.setState(this.initialState);
      }),
      (t.isActive = function () {
        return this.observers.some(function (r) {
          return r.options.enabled !== !1;
        });
      }),
      (t.isFetching = function () {
        return this.state.isFetching;
      }),
      (t.isStale = function () {
        return (
          this.state.isInvalidated ||
          !this.state.dataUpdatedAt ||
          this.observers.some(function (r) {
            return r.getCurrentResult().isStale;
          })
        );
      }),
      (t.isStaleByTime = function (r) {
        return (
          r === void 0 && (r = 0),
          this.state.isInvalidated || !this.state.dataUpdatedAt || !X2(this.state.dataUpdatedAt, r)
        );
      }),
      (t.onFocus = function () {
        var r,
          i = this.observers.find(function (a) {
            return a.shouldFetchOnWindowFocus();
          });
        i && i.refetch(), (r = this.retryer) == null || r.continue();
      }),
      (t.onOnline = function () {
        var r,
          i = this.observers.find(function (a) {
            return a.shouldFetchOnReconnect();
          });
        i && i.refetch(), (r = this.retryer) == null || r.continue();
      }),
      (t.addObserver = function (r) {
        this.observers.indexOf(r) === -1 &&
          (this.observers.push(r),
          (this.hadObservers = !0),
          this.clearGcTimeout(),
          this.cache.notify({ type: "observerAdded", query: this, observer: r }));
      }),
      (t.removeObserver = function (r) {
        this.observers.indexOf(r) !== -1 &&
          ((this.observers = this.observers.filter(function (i) {
            return i !== r;
          })),
          this.observers.length ||
            (this.retryer &&
              (this.retryer.isTransportCancelable || this.abortSignalConsumed
                ? this.retryer.cancel({ revert: !0 })
                : this.retryer.cancelRetry()),
            this.cacheTime ? this.scheduleGc() : this.cache.remove(this)),
          this.cache.notify({ type: "observerRemoved", query: this, observer: r }));
      }),
      (t.getObserversCount = function () {
        return this.observers.length;
      }),
      (t.invalidate = function () {
        this.state.isInvalidated || this.dispatch({ type: "invalidate" });
      }),
      (t.fetch = function (r, i) {
        var a = this,
          o,
          u,
          s;
        if (this.state.isFetching) {
          if (this.state.dataUpdatedAt && i != null && i.cancelRefetch) this.cancel({ silent: !0 });
          else if (this.promise) {
            var l;
            return (l = this.retryer) == null || l.continueRetry(), this.promise;
          }
        }
        if ((r && this.setOptions(r), !this.options.queryFn)) {
          var f = this.observers.find(function (m) {
            return m.options.queryFn;
          });
          f && this.setOptions(f.options);
        }
        var c = js(this.queryKey),
          d = J2(),
          p = { queryKey: c, pageParam: void 0, meta: this.meta };
        Object.defineProperty(p, "signal", {
          enumerable: !0,
          get: function () {
            if (d) return (a.abortSignalConsumed = !0), d.signal;
          },
        });
        var g = function () {
            return a.options.queryFn
              ? ((a.abortSignalConsumed = !1), a.options.queryFn(p))
              : Promise.reject("Missing queryFn");
          },
          y = {
            fetchOptions: i,
            options: this.options,
            queryKey: c,
            state: this.state,
            fetchFn: g,
            meta: this.meta,
          };
        if ((o = this.options.behavior) != null && o.onFetch) {
          var b;
          (b = this.options.behavior) == null || b.onFetch(y);
        }
        if (
          ((this.revertState = this.state),
          !this.state.isFetching ||
            this.state.fetchMeta !== ((u = y.fetchOptions) == null ? void 0 : u.meta))
        ) {
          var h;
          this.dispatch({ type: "fetch", meta: (h = y.fetchOptions) == null ? void 0 : h.meta });
        }
        return (
          (this.retryer = new t_({
            fn: y.fetchFn,
            abort: d == null || (s = d.abort) == null ? void 0 : s.bind(d),
            onSuccess: function (v) {
              a.setData(v),
                a.cache.config.onSuccess == null || a.cache.config.onSuccess(v, a),
                a.cacheTime === 0 && a.optionalRemove();
            },
            onError: function (v) {
              (ls(v) && v.silent) || a.dispatch({ type: "error", error: v }),
                ls(v) ||
                  (a.cache.config.onError == null || a.cache.config.onError(v, a), qs().error(v)),
                a.cacheTime === 0 && a.optionalRemove();
            },
            onFail: function () {
              a.dispatch({ type: "failed" });
            },
            onPause: function () {
              a.dispatch({ type: "pause" });
            },
            onContinue: function () {
              a.dispatch({ type: "continue" });
            },
            retry: y.options.retry,
            retryDelay: y.options.retryDelay,
          })),
          (this.promise = this.retryer.promise),
          this.promise
        );
      }),
      (t.dispatch = function (r) {
        var i = this;
        (this.state = this.reducer(this.state, r)),
          Ee.batch(function () {
            i.observers.forEach(function (a) {
              a.onQueryUpdate(r);
            }),
              i.cache.notify({ query: i, type: "queryUpdated", action: r });
          });
      }),
      (t.getDefaultState = function (r) {
        var i = typeof r.initialData == "function" ? r.initialData() : r.initialData,
          a = typeof r.initialData < "u",
          o = a
            ? typeof r.initialDataUpdatedAt == "function"
              ? r.initialDataUpdatedAt()
              : r.initialDataUpdatedAt
            : 0,
          u = typeof i < "u";
        return {
          data: i,
          dataUpdateCount: 0,
          dataUpdatedAt: u ? (o ?? Date.now()) : 0,
          error: null,
          errorUpdateCount: 0,
          errorUpdatedAt: 0,
          fetchFailureCount: 0,
          fetchMeta: null,
          isFetching: !1,
          isInvalidated: !1,
          isPaused: !1,
          status: u ? "success" : "idle",
        };
      }),
      (t.reducer = function (r, i) {
        var a, o;
        switch (i.type) {
          case "failed":
            return me({}, r, { fetchFailureCount: r.fetchFailureCount + 1 });
          case "pause":
            return me({}, r, { isPaused: !0 });
          case "continue":
            return me({}, r, { isPaused: !1 });
          case "fetch":
            return me(
              {},
              r,
              {
                fetchFailureCount: 0,
                fetchMeta: (a = i.meta) != null ? a : null,
                isFetching: !0,
                isPaused: !1,
              },
              !r.dataUpdatedAt && { error: null, status: "loading" },
            );
          case "success":
            return me({}, r, {
              data: i.data,
              dataUpdateCount: r.dataUpdateCount + 1,
              dataUpdatedAt: (o = i.dataUpdatedAt) != null ? o : Date.now(),
              error: null,
              fetchFailureCount: 0,
              isFetching: !1,
              isInvalidated: !1,
              isPaused: !1,
              status: "success",
            });
          case "error":
            var u = i.error;
            return ls(u) && u.revert && this.revertState
              ? me({}, this.revertState)
              : me({}, r, {
                  error: u,
                  errorUpdateCount: r.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: r.fetchFailureCount + 1,
                  isFetching: !1,
                  isPaused: !1,
                  status: "error",
                });
          case "invalidate":
            return me({}, r, { isInvalidated: !0 });
          case "setState":
            return me({}, r, i.state);
          default:
            return r;
        }
      }),
      e
    );
  })(),
  j6 = (function (e) {
    Zo(t, e);
    function t(r) {
      var i;
      return (
        (i = e.call(this) || this), (i.config = r || {}), (i.queries = []), (i.queriesMap = {}), i
      );
    }
    var n = t.prototype;
    return (
      (n.build = function (i, a, o) {
        var u,
          s = a.queryKey,
          l = (u = a.queryHash) != null ? u : R0(s, a),
          f = this.get(l);
        return (
          f ||
            ((f = new L6({
              cache: this,
              queryKey: s,
              queryHash: l,
              options: i.defaultQueryOptions(a),
              state: o,
              defaultOptions: i.getQueryDefaults(s),
              meta: a.meta,
            })),
            this.add(f)),
          f
        );
      }),
      (n.add = function (i) {
        this.queriesMap[i.queryHash] ||
          ((this.queriesMap[i.queryHash] = i),
          this.queries.push(i),
          this.notify({ type: "queryAdded", query: i }));
      }),
      (n.remove = function (i) {
        var a = this.queriesMap[i.queryHash];
        a &&
          (i.destroy(),
          (this.queries = this.queries.filter(function (o) {
            return o !== i;
          })),
          a === i && delete this.queriesMap[i.queryHash],
          this.notify({ type: "queryRemoved", query: i }));
      }),
      (n.clear = function () {
        var i = this;
        Ee.batch(function () {
          i.queries.forEach(function (a) {
            i.remove(a);
          });
        });
      }),
      (n.get = function (i) {
        return this.queriesMap[i];
      }),
      (n.getAll = function () {
        return this.queries;
      }),
      (n.find = function (i, a) {
        var o = Rn(i, a),
          u = o[0];
        return (
          typeof u.exact > "u" && (u.exact = !0),
          this.queries.find(function (s) {
            return pv(u, s);
          })
        );
      }),
      (n.findAll = function (i, a) {
        var o = Rn(i, a),
          u = o[0];
        return Object.keys(u).length > 0
          ? this.queries.filter(function (s) {
              return pv(u, s);
            })
          : this.queries;
      }),
      (n.notify = function (i) {
        var a = this;
        Ee.batch(function () {
          a.listeners.forEach(function (o) {
            o(i);
          });
        });
      }),
      (n.onFocus = function () {
        var i = this;
        Ee.batch(function () {
          i.queries.forEach(function (a) {
            a.onFocus();
          });
        });
      }),
      (n.onOnline = function () {
        var i = this;
        Ee.batch(function () {
          i.queries.forEach(function (a) {
            a.onOnline();
          });
        });
      }),
      t
    );
  })(ru),
  U6 = (function () {
    function e(n) {
      (this.options = me({}, n.defaultOptions, n.options)),
        (this.mutationId = n.mutationId),
        (this.mutationCache = n.mutationCache),
        (this.observers = []),
        (this.state = n.state || z6()),
        (this.meta = n.meta);
    }
    var t = e.prototype;
    return (
      (t.setState = function (r) {
        this.dispatch({ type: "setState", state: r });
      }),
      (t.addObserver = function (r) {
        this.observers.indexOf(r) === -1 && this.observers.push(r);
      }),
      (t.removeObserver = function (r) {
        this.observers = this.observers.filter(function (i) {
          return i !== r;
        });
      }),
      (t.cancel = function () {
        return this.retryer
          ? (this.retryer.cancel(), this.retryer.promise.then(lt).catch(lt))
          : Promise.resolve();
      }),
      (t.continue = function () {
        return this.retryer ? (this.retryer.continue(), this.retryer.promise) : this.execute();
      }),
      (t.execute = function () {
        var r = this,
          i,
          a = this.state.status === "loading",
          o = Promise.resolve();
        return (
          a ||
            (this.dispatch({ type: "loading", variables: this.options.variables }),
            (o = o
              .then(function () {
                r.mutationCache.config.onMutate == null ||
                  r.mutationCache.config.onMutate(r.state.variables, r);
              })
              .then(function () {
                return r.options.onMutate == null ? void 0 : r.options.onMutate(r.state.variables);
              })
              .then(function (u) {
                u !== r.state.context &&
                  r.dispatch({ type: "loading", context: u, variables: r.state.variables });
              }))),
          o
            .then(function () {
              return r.executeMutation();
            })
            .then(function (u) {
              (i = u),
                r.mutationCache.config.onSuccess == null ||
                  r.mutationCache.config.onSuccess(i, r.state.variables, r.state.context, r);
            })
            .then(function () {
              return r.options.onSuccess == null
                ? void 0
                : r.options.onSuccess(i, r.state.variables, r.state.context);
            })
            .then(function () {
              return r.options.onSettled == null
                ? void 0
                : r.options.onSettled(i, null, r.state.variables, r.state.context);
            })
            .then(function () {
              return r.dispatch({ type: "success", data: i }), i;
            })
            .catch(function (u) {
              return (
                r.mutationCache.config.onError == null ||
                  r.mutationCache.config.onError(u, r.state.variables, r.state.context, r),
                qs().error(u),
                Promise.resolve()
                  .then(function () {
                    return r.options.onError == null
                      ? void 0
                      : r.options.onError(u, r.state.variables, r.state.context);
                  })
                  .then(function () {
                    return r.options.onSettled == null
                      ? void 0
                      : r.options.onSettled(void 0, u, r.state.variables, r.state.context);
                  })
                  .then(function () {
                    throw (r.dispatch({ type: "error", error: u }), u);
                  })
              );
            })
        );
      }),
      (t.executeMutation = function () {
        var r = this,
          i;
        return (
          (this.retryer = new t_({
            fn: function () {
              return r.options.mutationFn
                ? r.options.mutationFn(r.state.variables)
                : Promise.reject("No mutationFn found");
            },
            onFail: function () {
              r.dispatch({ type: "failed" });
            },
            onPause: function () {
              r.dispatch({ type: "pause" });
            },
            onContinue: function () {
              r.dispatch({ type: "continue" });
            },
            retry: (i = this.options.retry) != null ? i : 0,
            retryDelay: this.options.retryDelay,
          })),
          this.retryer.promise
        );
      }),
      (t.dispatch = function (r) {
        var i = this;
        (this.state = W6(this.state, r)),
          Ee.batch(function () {
            i.observers.forEach(function (a) {
              a.onMutationUpdate(r);
            }),
              i.mutationCache.notify(i);
          });
      }),
      e
    );
  })();
function z6() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    isPaused: !1,
    status: "idle",
    variables: void 0,
  };
}
function W6(e, t) {
  switch (t.type) {
    case "failed":
      return me({}, e, { failureCount: e.failureCount + 1 });
    case "pause":
      return me({}, e, { isPaused: !0 });
    case "continue":
      return me({}, e, { isPaused: !1 });
    case "loading":
      return me({}, e, {
        context: t.context,
        data: void 0,
        error: null,
        isPaused: !1,
        status: "loading",
        variables: t.variables,
      });
    case "success":
      return me({}, e, { data: t.data, error: null, status: "success", isPaused: !1 });
    case "error":
      return me({}, e, {
        data: void 0,
        error: t.error,
        failureCount: e.failureCount + 1,
        isPaused: !1,
        status: "error",
      });
    case "setState":
      return me({}, e, t.state);
    default:
      return e;
  }
}
var q6 = (function (e) {
  Zo(t, e);
  function t(r) {
    var i;
    return (
      (i = e.call(this) || this), (i.config = r || {}), (i.mutations = []), (i.mutationId = 0), i
    );
  }
  var n = t.prototype;
  return (
    (n.build = function (i, a, o) {
      var u = new U6({
        mutationCache: this,
        mutationId: ++this.mutationId,
        options: i.defaultMutationOptions(a),
        state: o,
        defaultOptions: a.mutationKey ? i.getMutationDefaults(a.mutationKey) : void 0,
        meta: a.meta,
      });
      return this.add(u), u;
    }),
    (n.add = function (i) {
      this.mutations.push(i), this.notify(i);
    }),
    (n.remove = function (i) {
      (this.mutations = this.mutations.filter(function (a) {
        return a !== i;
      })),
        i.cancel(),
        this.notify(i);
    }),
    (n.clear = function () {
      var i = this;
      Ee.batch(function () {
        i.mutations.forEach(function (a) {
          i.remove(a);
        });
      });
    }),
    (n.getAll = function () {
      return this.mutations;
    }),
    (n.find = function (i) {
      return (
        typeof i.exact > "u" && (i.exact = !0),
        this.mutations.find(function (a) {
          return mv(i, a);
        })
      );
    }),
    (n.findAll = function (i) {
      return this.mutations.filter(function (a) {
        return mv(i, a);
      });
    }),
    (n.notify = function (i) {
      var a = this;
      Ee.batch(function () {
        a.listeners.forEach(function (o) {
          o(i);
        });
      });
    }),
    (n.onFocus = function () {
      this.resumePausedMutations();
    }),
    (n.onOnline = function () {
      this.resumePausedMutations();
    }),
    (n.resumePausedMutations = function () {
      var i = this.mutations.filter(function (a) {
        return a.state.isPaused;
      });
      return Ee.batch(function () {
        return i.reduce(function (a, o) {
          return a.then(function () {
            return o.continue().catch(lt);
          });
        }, Promise.resolve());
      });
    }),
    t
  );
})(ru);
function H6() {
  return {
    onFetch: function (t) {
      t.fetchFn = function () {
        var n,
          r,
          i,
          a,
          o,
          u,
          s = (n = t.fetchOptions) == null || (r = n.meta) == null ? void 0 : r.refetchPage,
          l = (i = t.fetchOptions) == null || (a = i.meta) == null ? void 0 : a.fetchMore,
          f = l == null ? void 0 : l.pageParam,
          c = (l == null ? void 0 : l.direction) === "forward",
          d = (l == null ? void 0 : l.direction) === "backward",
          p = ((o = t.state.data) == null ? void 0 : o.pages) || [],
          g = ((u = t.state.data) == null ? void 0 : u.pageParams) || [],
          y = J2(),
          b = y == null ? void 0 : y.signal,
          h = g,
          m = !1,
          v =
            t.options.queryFn ||
            function () {
              return Promise.reject("Missing queryFn");
            },
          _ = function (F, D, z, H) {
            return (
              (h = H ? [D].concat(h) : [].concat(h, [D])), H ? [z].concat(F) : [].concat(F, [z])
            );
          },
          S = function (F, D, z, H) {
            if (m) return Promise.reject("Cancelled");
            if (typeof z > "u" && !D && F.length) return Promise.resolve(F);
            var P = { queryKey: t.queryKey, signal: b, pageParam: z, meta: t.meta },
              O = v(P),
              W = Promise.resolve(O).then(function (X) {
                return _(F, z, X, H);
              });
            if (Ws(O)) {
              var K = W;
              K.cancel = O.cancel;
            }
            return W;
          },
          w;
        if (!p.length) w = S([]);
        else if (c) {
          var T = typeof f < "u",
            k = T ? f : yv(t.options, p);
          w = S(p, T, k);
        } else if (d) {
          var j = typeof f < "u",
            R = j ? f : B6(t.options, p);
          w = S(p, j, R, !0);
        } else
          (function () {
            h = [];
            var I = typeof t.options.getNextPageParam > "u",
              F = s && p[0] ? s(p[0], 0, p) : !0;
            w = F ? S([], I, g[0]) : Promise.resolve(_([], g[0], p[0]));
            for (
              var D = function (P) {
                  w = w.then(function (O) {
                    var W = s && p[P] ? s(p[P], P, p) : !0;
                    if (W) {
                      var K = I ? g[P] : yv(t.options, O);
                      return S(O, I, K);
                    }
                    return Promise.resolve(_(O, g[P], p[P]));
                  });
                },
                z = 1;
              z < p.length;
              z++
            )
              D(z);
          })();
        var E = w.then(function (I) {
            return { pages: I, pageParams: h };
          }),
          q = E;
        return (
          (q.cancel = function () {
            (m = !0), y == null || y.abort(), Ws(w) && w.cancel();
          }),
          E
        );
      };
    },
  };
}
function yv(e, t) {
  return e.getNextPageParam == null ? void 0 : e.getNextPageParam(t[t.length - 1], t);
}
function B6(e, t) {
  return e.getPreviousPageParam == null ? void 0 : e.getPreviousPageParam(t[0], t);
}
var EB = (function () {
    function e(n) {
      n === void 0 && (n = {}),
        (this.queryCache = n.queryCache || new j6()),
        (this.mutationCache = n.mutationCache || new q6()),
        (this.defaultOptions = n.defaultOptions || {}),
        (this.queryDefaults = []),
        (this.mutationDefaults = []);
    }
    var t = e.prototype;
    return (
      (t.mount = function () {
        var r = this;
        (this.unsubscribeFocus = fo.subscribe(function () {
          fo.isFocused() && ss.isOnline() && (r.mutationCache.onFocus(), r.queryCache.onFocus());
        })),
          (this.unsubscribeOnline = ss.subscribe(function () {
            fo.isFocused() &&
              ss.isOnline() &&
              (r.mutationCache.onOnline(), r.queryCache.onOnline());
          }));
      }),
      (t.unmount = function () {
        var r, i;
        (r = this.unsubscribeFocus) == null || r.call(this),
          (i = this.unsubscribeOnline) == null || i.call(this);
      }),
      (t.isFetching = function (r, i) {
        var a = Rn(r, i),
          o = a[0];
        return (o.fetching = !0), this.queryCache.findAll(o).length;
      }),
      (t.isMutating = function (r) {
        return this.mutationCache.findAll(me({}, r, { fetching: !0 })).length;
      }),
      (t.getQueryData = function (r, i) {
        var a;
        return (a = this.queryCache.find(r, i)) == null ? void 0 : a.state.data;
      }),
      (t.getQueriesData = function (r) {
        return this.getQueryCache()
          .findAll(r)
          .map(function (i) {
            var a = i.queryKey,
              o = i.state,
              u = o.data;
            return [a, u];
          });
      }),
      (t.setQueryData = function (r, i, a) {
        var o = us(r),
          u = this.defaultQueryOptions(o);
        return this.queryCache.build(this, u).setData(i, a);
      }),
      (t.setQueriesData = function (r, i, a) {
        var o = this;
        return Ee.batch(function () {
          return o
            .getQueryCache()
            .findAll(r)
            .map(function (u) {
              var s = u.queryKey;
              return [s, o.setQueryData(s, i, a)];
            });
        });
      }),
      (t.getQueryState = function (r, i) {
        var a;
        return (a = this.queryCache.find(r, i)) == null ? void 0 : a.state;
      }),
      (t.removeQueries = function (r, i) {
        var a = Rn(r, i),
          o = a[0],
          u = this.queryCache;
        Ee.batch(function () {
          u.findAll(o).forEach(function (s) {
            u.remove(s);
          });
        });
      }),
      (t.resetQueries = function (r, i, a) {
        var o = this,
          u = Rn(r, i, a),
          s = u[0],
          l = u[1],
          f = this.queryCache,
          c = me({}, s, { active: !0 });
        return Ee.batch(function () {
          return (
            f.findAll(s).forEach(function (d) {
              d.reset();
            }),
            o.refetchQueries(c, l)
          );
        });
      }),
      (t.cancelQueries = function (r, i, a) {
        var o = this,
          u = Rn(r, i, a),
          s = u[0],
          l = u[1],
          f = l === void 0 ? {} : l;
        typeof f.revert > "u" && (f.revert = !0);
        var c = Ee.batch(function () {
          return o.queryCache.findAll(s).map(function (d) {
            return d.cancel(f);
          });
        });
        return Promise.all(c).then(lt).catch(lt);
      }),
      (t.invalidateQueries = function (r, i, a) {
        var o,
          u,
          s,
          l = this,
          f = Rn(r, i, a),
          c = f[0],
          d = f[1],
          p = me({}, c, {
            active: (o = (u = c.refetchActive) != null ? u : c.active) != null ? o : !0,
            inactive: (s = c.refetchInactive) != null ? s : !1,
          });
        return Ee.batch(function () {
          return (
            l.queryCache.findAll(c).forEach(function (g) {
              g.invalidate();
            }),
            l.refetchQueries(p, d)
          );
        });
      }),
      (t.refetchQueries = function (r, i, a) {
        var o = this,
          u = Rn(r, i, a),
          s = u[0],
          l = u[1],
          f = Ee.batch(function () {
            return o.queryCache.findAll(s).map(function (d) {
              return d.fetch(
                void 0,
                me({}, l, { meta: { refetchPage: s == null ? void 0 : s.refetchPage } }),
              );
            });
          }),
          c = Promise.all(f).then(lt);
        return (l != null && l.throwOnError) || (c = c.catch(lt)), c;
      }),
      (t.fetchQuery = function (r, i, a) {
        var o = us(r, i, a),
          u = this.defaultQueryOptions(o);
        typeof u.retry > "u" && (u.retry = !1);
        var s = this.queryCache.build(this, u);
        return s.isStaleByTime(u.staleTime) ? s.fetch(u) : Promise.resolve(s.state.data);
      }),
      (t.prefetchQuery = function (r, i, a) {
        return this.fetchQuery(r, i, a).then(lt).catch(lt);
      }),
      (t.fetchInfiniteQuery = function (r, i, a) {
        var o = us(r, i, a);
        return (o.behavior = H6()), this.fetchQuery(o);
      }),
      (t.prefetchInfiniteQuery = function (r, i, a) {
        return this.fetchInfiniteQuery(r, i, a).then(lt).catch(lt);
      }),
      (t.cancelMutations = function () {
        var r = this,
          i = Ee.batch(function () {
            return r.mutationCache.getAll().map(function (a) {
              return a.cancel();
            });
          });
        return Promise.all(i).then(lt).catch(lt);
      }),
      (t.resumePausedMutations = function () {
        return this.getMutationCache().resumePausedMutations();
      }),
      (t.executeMutation = function (r) {
        return this.mutationCache.build(this, r).execute();
      }),
      (t.getQueryCache = function () {
        return this.queryCache;
      }),
      (t.getMutationCache = function () {
        return this.mutationCache;
      }),
      (t.getDefaultOptions = function () {
        return this.defaultOptions;
      }),
      (t.setDefaultOptions = function (r) {
        this.defaultOptions = r;
      }),
      (t.setQueryDefaults = function (r, i) {
        var a = this.queryDefaults.find(function (o) {
          return Lr(r) === Lr(o.queryKey);
        });
        a ? (a.defaultOptions = i) : this.queryDefaults.push({ queryKey: r, defaultOptions: i });
      }),
      (t.getQueryDefaults = function (r) {
        var i;
        return r
          ? (i = this.queryDefaults.find(function (a) {
              return Us(r, a.queryKey);
            })) == null
            ? void 0
            : i.defaultOptions
          : void 0;
      }),
      (t.setMutationDefaults = function (r, i) {
        var a = this.mutationDefaults.find(function (o) {
          return Lr(r) === Lr(o.mutationKey);
        });
        a
          ? (a.defaultOptions = i)
          : this.mutationDefaults.push({ mutationKey: r, defaultOptions: i });
      }),
      (t.getMutationDefaults = function (r) {
        var i;
        return r
          ? (i = this.mutationDefaults.find(function (a) {
              return Us(r, a.mutationKey);
            })) == null
            ? void 0
            : i.defaultOptions
          : void 0;
      }),
      (t.defaultQueryOptions = function (r) {
        if (r != null && r._defaulted) return r;
        var i = me(
          {},
          this.defaultOptions.queries,
          this.getQueryDefaults(r == null ? void 0 : r.queryKey),
          r,
          { _defaulted: !0 },
        );
        return !i.queryHash && i.queryKey && (i.queryHash = R0(i.queryKey, i)), i;
      }),
      (t.defaultQueryObserverOptions = function (r) {
        return this.defaultQueryOptions(r);
      }),
      (t.defaultMutationOptions = function (r) {
        return r != null && r._defaulted
          ? r
          : me(
              {},
              this.defaultOptions.mutations,
              this.getMutationDefaults(r == null ? void 0 : r.mutationKey),
              r,
              { _defaulted: !0 },
            );
      }),
      (t.clear = function () {
        this.queryCache.clear(), this.mutationCache.clear();
      }),
      e
    );
  })(),
  V6 = (function (e) {
    Zo(t, e);
    function t(r, i) {
      var a;
      return (
        (a = e.call(this) || this),
        (a.client = r),
        (a.options = i),
        (a.trackedProps = []),
        (a.selectError = null),
        a.bindMethods(),
        a.setOptions(i),
        a
      );
    }
    var n = t.prototype;
    return (
      (n.bindMethods = function () {
        (this.remove = this.remove.bind(this)), (this.refetch = this.refetch.bind(this));
      }),
      (n.onSubscribe = function () {
        this.listeners.length === 1 &&
          (this.currentQuery.addObserver(this),
          bv(this.currentQuery, this.options) && this.executeFetch(),
          this.updateTimers());
      }),
      (n.onUnsubscribe = function () {
        this.listeners.length || this.destroy();
      }),
      (n.shouldFetchOnReconnect = function () {
        return Vd(this.currentQuery, this.options, this.options.refetchOnReconnect);
      }),
      (n.shouldFetchOnWindowFocus = function () {
        return Vd(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
      }),
      (n.destroy = function () {
        (this.listeners = []), this.clearTimers(), this.currentQuery.removeObserver(this);
      }),
      (n.setOptions = function (i, a) {
        var o = this.options,
          u = this.currentQuery;
        if (
          ((this.options = this.client.defaultQueryObserverOptions(i)),
          typeof this.options.enabled < "u" && typeof this.options.enabled != "boolean")
        )
          throw new Error("Expected enabled to be a boolean");
        this.options.queryKey || (this.options.queryKey = o.queryKey), this.updateQuery();
        var s = this.hasListeners();
        s && _v(this.currentQuery, u, this.options, o) && this.executeFetch(),
          this.updateResult(a),
          s &&
            (this.currentQuery !== u ||
              this.options.enabled !== o.enabled ||
              this.options.staleTime !== o.staleTime) &&
            this.updateStaleTimeout();
        var l = this.computeRefetchInterval();
        s &&
          (this.currentQuery !== u ||
            this.options.enabled !== o.enabled ||
            l !== this.currentRefetchInterval) &&
          this.updateRefetchInterval(l);
      }),
      (n.getOptimisticResult = function (i) {
        var a = this.client.defaultQueryObserverOptions(i),
          o = this.client.getQueryCache().build(this.client, a);
        return this.createResult(o, a);
      }),
      (n.getCurrentResult = function () {
        return this.currentResult;
      }),
      (n.trackResult = function (i, a) {
        var o = this,
          u = {},
          s = function (f) {
            o.trackedProps.includes(f) || o.trackedProps.push(f);
          };
        return (
          Object.keys(i).forEach(function (l) {
            Object.defineProperty(u, l, {
              configurable: !1,
              enumerable: !0,
              get: function () {
                return s(l), i[l];
              },
            });
          }),
          (a.useErrorBoundary || a.suspense) && s("error"),
          u
        );
      }),
      (n.getNextResult = function (i) {
        var a = this;
        return new Promise(function (o, u) {
          var s = a.subscribe(function (l) {
            l.isFetching || (s(), l.isError && i != null && i.throwOnError ? u(l.error) : o(l));
          });
        });
      }),
      (n.getCurrentQuery = function () {
        return this.currentQuery;
      }),
      (n.remove = function () {
        this.client.getQueryCache().remove(this.currentQuery);
      }),
      (n.refetch = function (i) {
        return this.fetch(me({}, i, { meta: { refetchPage: i == null ? void 0 : i.refetchPage } }));
      }),
      (n.fetchOptimistic = function (i) {
        var a = this,
          o = this.client.defaultQueryObserverOptions(i),
          u = this.client.getQueryCache().build(this.client, o);
        return u.fetch().then(function () {
          return a.createResult(u, o);
        });
      }),
      (n.fetch = function (i) {
        var a = this;
        return this.executeFetch(i).then(function () {
          return a.updateResult(), a.currentResult;
        });
      }),
      (n.executeFetch = function (i) {
        this.updateQuery();
        var a = this.currentQuery.fetch(this.options, i);
        return (i != null && i.throwOnError) || (a = a.catch(lt)), a;
      }),
      (n.updateStaleTimeout = function () {
        var i = this;
        if (
          (this.clearStaleTimeout(),
          !(Ls || this.currentResult.isStale || !Hd(this.options.staleTime)))
        ) {
          var a = X2(this.currentResult.dataUpdatedAt, this.options.staleTime),
            o = a + 1;
          this.staleTimeoutId = setTimeout(function () {
            i.currentResult.isStale || i.updateResult();
          }, o);
        }
      }),
      (n.computeRefetchInterval = function () {
        var i;
        return typeof this.options.refetchInterval == "function"
          ? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
          : (i = this.options.refetchInterval) != null
            ? i
            : !1;
      }),
      (n.updateRefetchInterval = function (i) {
        var a = this;
        this.clearRefetchInterval(),
          (this.currentRefetchInterval = i),
          !(
            Ls ||
            this.options.enabled === !1 ||
            !Hd(this.currentRefetchInterval) ||
            this.currentRefetchInterval === 0
          ) &&
            (this.refetchIntervalId = setInterval(function () {
              (a.options.refetchIntervalInBackground || fo.isFocused()) && a.executeFetch();
            }, this.currentRefetchInterval));
      }),
      (n.updateTimers = function () {
        this.updateStaleTimeout(), this.updateRefetchInterval(this.computeRefetchInterval());
      }),
      (n.clearTimers = function () {
        this.clearStaleTimeout(), this.clearRefetchInterval();
      }),
      (n.clearStaleTimeout = function () {
        this.staleTimeoutId && (clearTimeout(this.staleTimeoutId), (this.staleTimeoutId = void 0));
      }),
      (n.clearRefetchInterval = function () {
        this.refetchIntervalId &&
          (clearInterval(this.refetchIntervalId), (this.refetchIntervalId = void 0));
      }),
      (n.createResult = function (i, a) {
        var o = this.currentQuery,
          u = this.options,
          s = this.currentResult,
          l = this.currentResultState,
          f = this.currentResultOptions,
          c = i !== o,
          d = c ? i.state : this.currentQueryInitialState,
          p = c ? this.currentResult : this.previousQueryResult,
          g = i.state,
          y = g.dataUpdatedAt,
          b = g.error,
          h = g.errorUpdatedAt,
          m = g.isFetching,
          v = g.status,
          _ = !1,
          S = !1,
          w;
        if (a.optimisticResults) {
          var T = this.hasListeners(),
            k = !T && bv(i, a),
            j = T && _v(i, o, a, u);
          (k || j) && ((m = !0), y || (v = "loading"));
        }
        if (a.keepPreviousData && !g.dataUpdateCount && p != null && p.isSuccess && v !== "error")
          (w = p.data), (y = p.dataUpdatedAt), (v = p.status), (_ = !0);
        else if (a.select && typeof g.data < "u")
          if (s && g.data === (l == null ? void 0 : l.data) && a.select === this.selectFn)
            w = this.selectResult;
          else
            try {
              (this.selectFn = a.select),
                (w = a.select(g.data)),
                a.structuralSharing !== !1 && (w = zs(s == null ? void 0 : s.data, w)),
                (this.selectResult = w),
                (this.selectError = null);
            } catch (q) {
              qs().error(q), (this.selectError = q);
            }
        else w = g.data;
        if (typeof a.placeholderData < "u" && typeof w > "u" && (v === "loading" || v === "idle")) {
          var R;
          if (
            s != null &&
            s.isPlaceholderData &&
            a.placeholderData === (f == null ? void 0 : f.placeholderData)
          )
            R = s.data;
          else if (
            ((R = typeof a.placeholderData == "function" ? a.placeholderData() : a.placeholderData),
            a.select && typeof R < "u")
          )
            try {
              (R = a.select(R)),
                a.structuralSharing !== !1 && (R = zs(s == null ? void 0 : s.data, R)),
                (this.selectError = null);
            } catch (q) {
              qs().error(q), (this.selectError = q);
            }
          typeof R < "u" && ((v = "success"), (w = R), (S = !0));
        }
        this.selectError &&
          ((b = this.selectError), (w = this.selectResult), (h = Date.now()), (v = "error"));
        var E = {
          status: v,
          isLoading: v === "loading",
          isSuccess: v === "success",
          isError: v === "error",
          isIdle: v === "idle",
          data: w,
          dataUpdatedAt: y,
          error: b,
          errorUpdatedAt: h,
          failureCount: g.fetchFailureCount,
          errorUpdateCount: g.errorUpdateCount,
          isFetched: g.dataUpdateCount > 0 || g.errorUpdateCount > 0,
          isFetchedAfterMount:
            g.dataUpdateCount > d.dataUpdateCount || g.errorUpdateCount > d.errorUpdateCount,
          isFetching: m,
          isRefetching: m && v !== "loading",
          isLoadingError: v === "error" && g.dataUpdatedAt === 0,
          isPlaceholderData: S,
          isPreviousData: _,
          isRefetchError: v === "error" && g.dataUpdatedAt !== 0,
          isStale: F0(i, a),
          refetch: this.refetch,
          remove: this.remove,
        };
        return E;
      }),
      (n.shouldNotifyListeners = function (i, a) {
        if (!a) return !0;
        var o = this.options,
          u = o.notifyOnChangeProps,
          s = o.notifyOnChangePropsExclusions;
        if ((!u && !s) || (u === "tracked" && !this.trackedProps.length)) return !0;
        var l = u === "tracked" ? this.trackedProps : u;
        return Object.keys(i).some(function (f) {
          var c = f,
            d = i[c] !== a[c],
            p =
              l == null
                ? void 0
                : l.some(function (y) {
                    return y === f;
                  }),
            g =
              s == null
                ? void 0
                : s.some(function (y) {
                    return y === f;
                  });
          return d && !g && (!l || p);
        });
      }),
      (n.updateResult = function (i) {
        var a = this.currentResult;
        if (
          ((this.currentResult = this.createResult(this.currentQuery, this.options)),
          (this.currentResultState = this.currentQuery.state),
          (this.currentResultOptions = this.options),
          !E6(this.currentResult, a))
        ) {
          var o = { cache: !0 };
          (i == null ? void 0 : i.listeners) !== !1 &&
            this.shouldNotifyListeners(this.currentResult, a) &&
            (o.listeners = !0),
            this.notify(me({}, o, i));
        }
      }),
      (n.updateQuery = function () {
        var i = this.client.getQueryCache().build(this.client, this.options);
        if (i !== this.currentQuery) {
          var a = this.currentQuery;
          (this.currentQuery = i),
            (this.currentQueryInitialState = i.state),
            (this.previousQueryResult = this.currentResult),
            this.hasListeners() && (a == null || a.removeObserver(this), i.addObserver(this));
        }
      }),
      (n.onQueryUpdate = function (i) {
        var a = {};
        i.type === "success"
          ? (a.onSuccess = !0)
          : i.type === "error" && !ls(i.error) && (a.onError = !0),
          this.updateResult(a),
          this.hasListeners() && this.updateTimers();
      }),
      (n.notify = function (i) {
        var a = this;
        Ee.batch(function () {
          i.onSuccess
            ? (a.options.onSuccess == null || a.options.onSuccess(a.currentResult.data),
              a.options.onSettled == null || a.options.onSettled(a.currentResult.data, null))
            : i.onError &&
              (a.options.onError == null || a.options.onError(a.currentResult.error),
              a.options.onSettled == null || a.options.onSettled(void 0, a.currentResult.error)),
            i.listeners &&
              a.listeners.forEach(function (o) {
                o(a.currentResult);
              }),
            i.cache &&
              a.client
                .getQueryCache()
                .notify({ query: a.currentQuery, type: "observerResultsUpdated" });
        });
      }),
      t
    );
  })(ru);
function Q6(e, t) {
  return (
    t.enabled !== !1 &&
    !e.state.dataUpdatedAt &&
    !(e.state.status === "error" && t.retryOnMount === !1)
  );
}
function bv(e, t) {
  return Q6(e, t) || (e.state.dataUpdatedAt > 0 && Vd(e, t, t.refetchOnMount));
}
function Vd(e, t, n) {
  if (t.enabled !== !1) {
    var r = typeof n == "function" ? n(e) : n;
    return r === "always" || (r !== !1 && F0(e, t));
  }
  return !1;
}
function _v(e, t, n, r) {
  return (
    n.enabled !== !1 &&
    (e !== t || r.enabled === !1) &&
    (!n.suspense || e.state.status !== "error") &&
    F0(e, n)
  );
}
function F0(e, t) {
  return e.isStaleByTime(t.staleTime);
}
var Y6 = k6.unstable_batchedUpdates;
Ee.setBatchNotifyFunction(Y6);
var G6 = console;
I6(G6);
var wv = ze.createContext(void 0),
  r_ = ze.createContext(!1);
function i_(e) {
  return e && typeof window < "u"
    ? (window.ReactQueryClientContext || (window.ReactQueryClientContext = wv),
      window.ReactQueryClientContext)
    : wv;
}
var a_ = function () {
    var t = ze.useContext(i_(ze.useContext(r_)));
    if (!t) throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return t;
  },
  AB = function (t) {
    var n = t.client,
      r = t.contextSharing,
      i = r === void 0 ? !1 : r,
      a = t.children;
    ze.useEffect(
      function () {
        return (
          n.mount(),
          function () {
            n.unmount();
          }
        );
      },
      [n],
    );
    var o = i_(i);
    return ze.createElement(
      r_.Provider,
      { value: i },
      ze.createElement(o.Provider, { value: n }, a),
    );
  };
function K6() {
  var e = !1;
  return {
    clearReset: function () {
      e = !1;
    },
    reset: function () {
      e = !0;
    },
    isReset: function () {
      return e;
    },
  };
}
var X6 = ze.createContext(K6()),
  Z6 = function () {
    return ze.useContext(X6);
  },
  xv = function (t, n, r, i) {
    var a = t.isFetching(n);
    r !== a && i(a);
  };
function RB(e, t) {
  var n = ze.useRef(!1),
    r = a_(),
    i = Rn(e, t),
    a = i[0],
    o = ze.useState(r.isFetching(a)),
    u = o[0],
    s = o[1],
    l = ze.useRef(a);
  l.current = a;
  var f = ze.useRef(u);
  return (
    (f.current = u),
    ze.useEffect(
      function () {
        (n.current = !0), xv(r, l.current, f.current, s);
        var c = r.getQueryCache().subscribe(
          Ee.batchCalls(function () {
            n.current && xv(r, l.current, f.current, s);
          }),
        );
        return function () {
          (n.current = !1), c();
        };
      },
      [r],
    ),
    u
  );
}
function J6(e, t, n) {
  return typeof t == "function" ? t.apply(void 0, n) : typeof t == "boolean" ? t : !!e;
}
function e5(e, t) {
  var n = ze.useRef(!1),
    r = ze.useState(0),
    i = r[1],
    a = a_(),
    o = Z6(),
    u = a.defaultQueryObserverOptions(e);
  (u.optimisticResults = !0),
    u.onError && (u.onError = Ee.batchCalls(u.onError)),
    u.onSuccess && (u.onSuccess = Ee.batchCalls(u.onSuccess)),
    u.onSettled && (u.onSettled = Ee.batchCalls(u.onSettled)),
    u.suspense &&
      (typeof u.staleTime != "number" && (u.staleTime = 1e3),
      u.cacheTime === 0 && (u.cacheTime = 1)),
    (u.suspense || u.useErrorBoundary) && (o.isReset() || (u.retryOnMount = !1));
  var s = ze.useState(function () {
      return new t(a, u);
    }),
    l = s[0],
    f = l.getOptimisticResult(u);
  if (
    (ze.useEffect(
      function () {
        (n.current = !0), o.clearReset();
        var c = l.subscribe(
          Ee.batchCalls(function () {
            n.current &&
              i(function (d) {
                return d + 1;
              });
          }),
        );
        return (
          l.updateResult(),
          function () {
            (n.current = !1), c();
          }
        );
      },
      [o, l],
    ),
    ze.useEffect(
      function () {
        l.setOptions(u, { listeners: !1 });
      },
      [u, l],
    ),
    u.suspense && f.isLoading)
  )
    throw l
      .fetchOptimistic(u)
      .then(function (c) {
        var d = c.data;
        u.onSuccess == null || u.onSuccess(d), u.onSettled == null || u.onSettled(d, null);
      })
      .catch(function (c) {
        o.clearReset(),
          u.onError == null || u.onError(c),
          u.onSettled == null || u.onSettled(void 0, c);
      });
  if (
    f.isError &&
    !o.isReset() &&
    !f.isFetching &&
    J6(u.suspense, u.useErrorBoundary, [f.error, l.getCurrentQuery()])
  )
    throw f.error;
  return u.notifyOnChangeProps === "tracked" && (f = l.trackResult(f, u)), f;
}
function FB(e, t, n) {
  var r = us(e, t, n);
  return e5(r, V6);
}
var o_ = "en",
  D0 = {},
  Qd = {};
function u_() {
  return o_;
}
function t5(e) {
  o_ = e;
}
function n5(e) {
  return D0[e];
}
function r5(e) {
  if (!e) throw new Error("No locale data passed");
  (D0[e.locale] = e), (Qd[e.locale.toLowerCase()] = e.locale);
}
function Sv(e) {
  if (D0[e]) return e;
  if (Qd[e.toLowerCase()]) return Qd[e.toLowerCase()];
}
function s_(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    n = t.localeMatcher || "lookup";
  switch (n) {
    case "lookup":
      return $v(e);
    case "best fit":
      return $v(e);
    default:
      throw new RangeError('Invalid "localeMatcher" option: '.concat(n));
  }
}
function $v(e) {
  var t = Sv(e);
  if (t) return t;
  for (var n = e.split("-"); e.length > 1; ) {
    n.pop(), (e = n.join("-"));
    var r = Sv(e);
    if (r) return r;
  }
}
var $ = {
  af: function (t) {
    return t == 1 ? "one" : "other";
  },
  am: function (t) {
    return t >= 0 && t <= 1 ? "one" : "other";
  },
  ar: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t,
      i = r && n[0].slice(-2);
    return t == 0
      ? "zero"
      : t == 1
        ? "one"
        : t == 2
          ? "two"
          : i >= 3 && i <= 10
            ? "few"
            : i >= 11 && i <= 99
              ? "many"
              : "other";
  },
  ast: function (t) {
    var n = String(t).split("."),
      r = !n[1];
    return t == 1 && r ? "one" : "other";
  },
  be: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t,
      i = r && n[0].slice(-1),
      a = r && n[0].slice(-2);
    return i == 1 && a != 11
      ? "one"
      : i >= 2 && i <= 4 && (a < 12 || a > 14)
        ? "few"
        : (r && i == 0) || (i >= 5 && i <= 9) || (a >= 11 && a <= 14)
          ? "many"
          : "other";
  },
  br: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t,
      i = r && n[0].slice(-1),
      a = r && n[0].slice(-2),
      o = r && n[0].slice(-6);
    return i == 1 && a != 11 && a != 71 && a != 91
      ? "one"
      : i == 2 && a != 12 && a != 72 && a != 92
        ? "two"
        : (i == 3 || i == 4 || i == 9) &&
            (a < 10 || a > 19) &&
            (a < 70 || a > 79) &&
            (a < 90 || a > 99)
          ? "few"
          : t != 0 && r && o == 0
            ? "many"
            : "other";
  },
  bs: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = n[1] || "",
      a = !n[1],
      o = r.slice(-1),
      u = r.slice(-2),
      s = i.slice(-1),
      l = i.slice(-2);
    return (a && o == 1 && u != 11) || (s == 1 && l != 11)
      ? "one"
      : (a && o >= 2 && o <= 4 && (u < 12 || u > 14)) || (s >= 2 && s <= 4 && (l < 12 || l > 14))
        ? "few"
        : "other";
  },
  ca: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-6);
    return t == 1 && i ? "one" : r != 0 && a == 0 && i ? "many" : "other";
  },
  ceb: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = n[1] || "",
      a = !n[1],
      o = r.slice(-1),
      u = i.slice(-1);
    return (a && (r == 1 || r == 2 || r == 3)) ||
      (a && o != 4 && o != 6 && o != 9) ||
      (!a && u != 4 && u != 6 && u != 9)
      ? "one"
      : "other";
  },
  cs: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1];
    return t == 1 && i ? "one" : r >= 2 && r <= 4 && i ? "few" : i ? "other" : "many";
  },
  cy: function (t) {
    return t == 0
      ? "zero"
      : t == 1
        ? "one"
        : t == 2
          ? "two"
          : t == 3
            ? "few"
            : t == 6
              ? "many"
              : "other";
  },
  da: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = Number(n[0]) == t;
    return t == 1 || (!i && (r == 0 || r == 1)) ? "one" : "other";
  },
  dsb: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = n[1] || "",
      a = !n[1],
      o = r.slice(-2),
      u = i.slice(-2);
    return (a && o == 1) || u == 1
      ? "one"
      : (a && o == 2) || u == 2
        ? "two"
        : (a && (o == 3 || o == 4)) || u == 3 || u == 4
          ? "few"
          : "other";
  },
  dz: function (t) {
    return "other";
  },
  es: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-6);
    return t == 1 ? "one" : r != 0 && a == 0 && i ? "many" : "other";
  },
  ff: function (t) {
    return t >= 0 && t < 2 ? "one" : "other";
  },
  fr: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-6);
    return t >= 0 && t < 2 ? "one" : r != 0 && a == 0 && i ? "many" : "other";
  },
  ga: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t;
    return t == 1
      ? "one"
      : t == 2
        ? "two"
        : r && t >= 3 && t <= 6
          ? "few"
          : r && t >= 7 && t <= 10
            ? "many"
            : "other";
  },
  gd: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t;
    return t == 1 || t == 11
      ? "one"
      : t == 2 || t == 12
        ? "two"
        : (r && t >= 3 && t <= 10) || (r && t >= 13 && t <= 19)
          ? "few"
          : "other";
  },
  he: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1];
    return (r == 1 && i) || (r == 0 && !i) ? "one" : r == 2 && i ? "two" : "other";
  },
  is: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = (n[1] || "").replace(/0+$/, ""),
      a = Number(n[0]) == t,
      o = r.slice(-1),
      u = r.slice(-2);
    return (a && o == 1 && u != 11) || (i % 10 == 1 && i % 100 != 11) ? "one" : "other";
  },
  ksh: function (t) {
    return t == 0 ? "zero" : t == 1 ? "one" : "other";
  },
  lt: function (t) {
    var n = String(t).split("."),
      r = n[1] || "",
      i = Number(n[0]) == t,
      a = i && n[0].slice(-1),
      o = i && n[0].slice(-2);
    return a == 1 && (o < 11 || o > 19)
      ? "one"
      : a >= 2 && a <= 9 && (o < 11 || o > 19)
        ? "few"
        : r != 0
          ? "many"
          : "other";
  },
  lv: function (t) {
    var n = String(t).split("."),
      r = n[1] || "",
      i = r.length,
      a = Number(n[0]) == t,
      o = a && n[0].slice(-1),
      u = a && n[0].slice(-2),
      s = r.slice(-2),
      l = r.slice(-1);
    return (a && o == 0) || (u >= 11 && u <= 19) || (i == 2 && s >= 11 && s <= 19)
      ? "zero"
      : (o == 1 && u != 11) || (i == 2 && l == 1 && s != 11) || (i != 2 && l == 1)
        ? "one"
        : "other";
  },
  mk: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = n[1] || "",
      a = !n[1],
      o = r.slice(-1),
      u = r.slice(-2),
      s = i.slice(-1),
      l = i.slice(-2);
    return (a && o == 1 && u != 11) || (s == 1 && l != 11) ? "one" : "other";
  },
  mt: function (t) {
    var n = String(t).split("."),
      r = Number(n[0]) == t,
      i = r && n[0].slice(-2);
    return t == 1
      ? "one"
      : t == 2
        ? "two"
        : t == 0 || (i >= 3 && i <= 10)
          ? "few"
          : i >= 11 && i <= 19
            ? "many"
            : "other";
  },
  pa: function (t) {
    return t == 0 || t == 1 ? "one" : "other";
  },
  pl: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-1),
      o = r.slice(-2);
    return t == 1 && i
      ? "one"
      : i && a >= 2 && a <= 4 && (o < 12 || o > 14)
        ? "few"
        : (i && r != 1 && (a == 0 || a == 1)) ||
            (i && a >= 5 && a <= 9) ||
            (i && o >= 12 && o <= 14)
          ? "many"
          : "other";
  },
  pt: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-6);
    return r == 0 || r == 1 ? "one" : r != 0 && a == 0 && i ? "many" : "other";
  },
  ro: function (t) {
    var n = String(t).split("."),
      r = !n[1],
      i = Number(n[0]) == t,
      a = i && n[0].slice(-2);
    return t == 1 && r ? "one" : !r || t == 0 || (t != 1 && a >= 1 && a <= 19) ? "few" : "other";
  },
  ru: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-1),
      o = r.slice(-2);
    return i && a == 1 && o != 11
      ? "one"
      : i && a >= 2 && a <= 4 && (o < 12 || o > 14)
        ? "few"
        : (i && a == 0) || (i && a >= 5 && a <= 9) || (i && o >= 11 && o <= 14)
          ? "many"
          : "other";
  },
  se: function (t) {
    return t == 1 ? "one" : t == 2 ? "two" : "other";
  },
  si: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = n[1] || "";
    return t == 0 || t == 1 || (r == 0 && i == 1) ? "one" : "other";
  },
  sl: function (t) {
    var n = String(t).split("."),
      r = n[0],
      i = !n[1],
      a = r.slice(-2);
    return i && a == 1
      ? "one"
      : i && a == 2
        ? "two"
        : (i && (a == 3 || a == 4)) || !i
          ? "few"
          : "other";
  },
};
$.as = $.am;
$.az = $.af;
$.bg = $.af;
$.bn = $.am;
$.brx = $.af;
$.ce = $.af;
$.chr = $.af;
$.de = $.ast;
$.ee = $.af;
$.el = $.af;
$.en = $.ast;
$.et = $.ast;
$.eu = $.af;
$.fa = $.am;
$.fi = $.ast;
$.fil = $.ceb;
$.fo = $.af;
$.fur = $.af;
$.fy = $.ast;
$.gl = $.ast;
$.gu = $.am;
$.ha = $.af;
$.hi = $.am;
$.hr = $.bs;
$.hsb = $.dsb;
$.hu = $.af;
$.hy = $.ff;
$.ia = $.ast;
$.id = $.dz;
$.ig = $.dz;
$.it = $.ca;
$.ja = $.dz;
$.jgo = $.af;
$.jv = $.dz;
$.ka = $.af;
$.kea = $.dz;
$.kk = $.af;
$.kl = $.af;
$.km = $.dz;
$.kn = $.am;
$.ko = $.dz;
$.ks = $.af;
$.ku = $.af;
$.ky = $.af;
$.lb = $.af;
$.lkt = $.dz;
$.lo = $.dz;
$.ml = $.af;
$.mn = $.af;
$.mr = $.af;
$.ms = $.dz;
$.my = $.dz;
$.nb = $.af;
$.ne = $.af;
$.nl = $.ast;
$.nn = $.af;
$.no = $.af;
$.or = $.af;
$.pcm = $.am;
$.ps = $.af;
$.rm = $.af;
$.sah = $.dz;
$.sc = $.ast;
$.sd = $.af;
$.sk = $.cs;
$.so = $.af;
$.sq = $.af;
$.sr = $.bs;
$.su = $.dz;
$.sv = $.ast;
$.sw = $.ast;
$.ta = $.af;
$.te = $.af;
$.th = $.dz;
$.ti = $.pa;
$.tk = $.af;
$.to = $.dz;
$.tr = $.af;
$.ug = $.af;
$.uk = $.ru;
$.ur = $.ast;
$.uz = $.af;
$.vi = $.dz;
$.wae = $.af;
$.wo = $.dz;
$.xh = $.af;
$.yi = $.ast;
$.yo = $.dz;
$.yue = $.dz;
$.zh = $.dz;
$.zu = $.am;
function Tv(e) {
  return e === "pt-PT" ? e : a5(e);
}
var i5 = /^([a-z0-9]+)/i;
function a5(e) {
  var t = e.match(i5);
  if (!t) throw new TypeError("Invalid locale: ".concat(e));
  return t[1];
}
function o5(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Cv(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function u5(e, t, n) {
  return (
    t && Cv(e.prototype, t),
    n && Cv(e, n),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
var Yd = (function () {
  function e(t, n) {
    o5(this, e);
    var r = e.supportedLocalesOf(t);
    if (r.length === 0) throw new RangeError("Unsupported locale: " + t);
    if (n && n.type !== "cardinal") throw new RangeError('Only "cardinal" "type" is supported');
    this.$ = $[Tv(r[0])];
  }
  return (
    u5(
      e,
      [
        {
          key: "select",
          value: function (n) {
            return this.$(n);
          },
        },
      ],
      [
        {
          key: "supportedLocalesOf",
          value: function (n) {
            return (
              typeof n == "string" && (n = [n]),
              n.filter(function (r) {
                return $[Tv(r)];
              })
            );
          },
        },
      ],
    ),
    e
  );
})();
function Gd(e) {
  "@babel/helpers - typeof";
  return (
    (Gd =
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
    Gd(e)
  );
}
function kv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Ov(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? kv(Object(n), !0).forEach(function (r) {
          s5(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : kv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function s5(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
function Mv(e, t) {
  return d5(e) || c5(e, t) || f5(e, t) || l5();
}
function l5() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function f5(e, t) {
  if (e) {
    if (typeof e == "string") return Pv(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if ((n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set"))
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Pv(e, t);
  }
}
function Pv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function c5(e, t) {
  var n = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n != null) {
    var r = [],
      i = !0,
      a = !1,
      o,
      u;
    try {
      for (
        n = n.call(e);
        !(i = (o = n.next()).done) && (r.push(o.value), !(t && r.length === t));
        i = !0
      );
    } catch (s) {
      (a = !0), (u = s);
    } finally {
      try {
        !i && n.return != null && n.return();
      } finally {
        if (a) throw u;
      }
    }
    return r;
  }
}
function d5(e) {
  if (Array.isArray(e)) return e;
}
function h5(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function p5(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function m5(e, t, n) {
  return t && p5(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var v5 = ["second", "minute", "hour", "day", "week", "month", "quarter", "year"],
  g5 = ["auto", "always"],
  y5 = ["long", "short", "narrow"],
  b5 = ["lookup", "best fit"],
  wr = (function () {
    function e() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
        n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      h5(this, e);
      var r = n.numeric,
        i = n.style,
        a = n.localeMatcher;
      if (
        ((this.numeric = "always"),
        (this.style = "long"),
        (this.localeMatcher = "lookup"),
        r !== void 0)
      ) {
        if (g5.indexOf(r) < 0) throw new RangeError('Invalid "numeric" option: '.concat(r));
        this.numeric = r;
      }
      if (i !== void 0) {
        if (y5.indexOf(i) < 0) throw new RangeError('Invalid "style" option: '.concat(i));
        this.style = i;
      }
      if (a !== void 0) {
        if (b5.indexOf(a) < 0) throw new RangeError('Invalid "localeMatcher" option: '.concat(a));
        this.localeMatcher = a;
      }
      if (
        (typeof t == "string" && (t = [t]),
        t.push(u_()),
        (this.locale = e.supportedLocalesOf(t, { localeMatcher: this.localeMatcher })[0]),
        !this.locale)
      )
        throw new Error("No supported locale was found");
      Yd.supportedLocalesOf(this.locale).length > 0
        ? (this.pluralRules = new Yd(this.locale))
        : console.warn('"'.concat(this.locale, '" locale is not supported')),
        typeof Intl < "u" && Intl.NumberFormat
          ? ((this.numberFormat = new Intl.NumberFormat(this.locale)),
            (this.numberingSystem = this.numberFormat.resolvedOptions().numberingSystem))
          : (this.numberingSystem = "latn"),
        (this.locale = s_(this.locale, { localeMatcher: this.localeMatcher }));
    }
    return (
      m5(e, [
        {
          key: "format",
          value: function () {
            var n = Ev(arguments),
              r = Mv(n, 2),
              i = r[0],
              a = r[1];
            return this.getRule(i, a).replace("{0}", this.formatNumber(Math.abs(i)));
          },
        },
        {
          key: "formatToParts",
          value: function () {
            var n = Ev(arguments),
              r = Mv(n, 2),
              i = r[0],
              a = r[1],
              o = this.getRule(i, a),
              u = o.indexOf("{0}");
            if (u < 0) return [{ type: "literal", value: o }];
            var s = [];
            return (
              u > 0 && s.push({ type: "literal", value: o.slice(0, u) }),
              (s = s.concat(
                this.formatNumberToParts(Math.abs(i)).map(function (l) {
                  return Ov(Ov({}, l), {}, { unit: a });
                }),
              )),
              u + 3 < o.length - 1 && s.push({ type: "literal", value: o.slice(u + 3) }),
              s
            );
          },
        },
        {
          key: "getRule",
          value: function (n, r) {
            var i = n5(this.locale)[this.style][r];
            if (typeof i == "string") return i;
            if (this.numeric === "auto") {
              if (n === -2 || n === -1) {
                var a = i["previous".concat(n === -1 ? "" : "-" + Math.abs(n))];
                if (a) return a;
              } else if (n === 1 || n === 2) {
                var o = i["next".concat(n === 1 ? "" : "-" + Math.abs(n))];
                if (o) return o;
              } else if (n === 0 && i.current) return i.current;
            }
            var u = i[$5(n) ? "past" : "future"];
            if (typeof u == "string") return u;
            var s = (this.pluralRules && this.pluralRules.select(Math.abs(n))) || "other";
            return u[s] || u.other;
          },
        },
        {
          key: "formatNumber",
          value: function (n) {
            return this.numberFormat ? this.numberFormat.format(n) : String(n);
          },
        },
        {
          key: "formatNumberToParts",
          value: function (n) {
            return this.numberFormat && this.numberFormat.formatToParts
              ? this.numberFormat.formatToParts(n)
              : [{ type: "integer", value: this.formatNumber(n) }];
          },
        },
        {
          key: "resolvedOptions",
          value: function () {
            return {
              locale: this.locale,
              style: this.style,
              numeric: this.numeric,
              numberingSystem: this.numberingSystem,
            };
          },
        },
      ]),
      e
    );
  })();
wr.supportedLocalesOf = function (e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (typeof e == "string") e = [e];
  else if (!Array.isArray(e)) throw new TypeError('Invalid "locales" argument');
  return e.filter(function (n) {
    return s_(n, t);
  });
};
wr.addLocale = r5;
wr.setDefaultLocale = t5;
wr.getDefaultLocale = u_;
wr.PluralRules = Yd;
var wc = 'Invalid "unit" argument';
function _5(e) {
  if (Gd(e) === "symbol") throw new TypeError(wc);
  if (typeof e != "string") throw new RangeError("".concat(wc, ": ").concat(e));
  if ((e[e.length - 1] === "s" && (e = e.slice(0, e.length - 1)), v5.indexOf(e) < 0))
    throw new RangeError("".concat(wc, ": ").concat(e));
  return e;
}
var w5 = 'Invalid "number" argument';
function x5(e) {
  if (((e = Number(e)), Number.isFinite && !Number.isFinite(e)))
    throw new RangeError("".concat(w5, ": ").concat(e));
  return e;
}
function S5(e) {
  return 1 / e === -1 / 0;
}
function $5(e) {
  return e < 0 || (e === 0 && S5(e));
}
function Ev(e) {
  if (e.length < 2) throw new TypeError('"unit" argument is required');
  return [x5(e[0]), _5(e[1])];
}
function Hs(e) {
  "@babel/helpers - typeof";
  return (
    (Hs =
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
    Hs(e)
  );
}
function T5(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function C5(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function k5(e, t, n) {
  return t && C5(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var Av = (function () {
  function e() {
    T5(this, e), (this.cache = {});
  }
  return (
    k5(e, [
      {
        key: "get",
        value: function () {
          for (var n = this.cache, r = arguments.length, i = new Array(r), a = 0; a < r; a++)
            i[a] = arguments[a];
          for (var o = 0, u = i; o < u.length; o++) {
            var s = u[o];
            if (Hs(n) !== "object") return;
            n = n[s];
          }
          return n;
        },
      },
      {
        key: "put",
        value: function () {
          for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) r[i] = arguments[i];
          for (var a = r.pop(), o = r.pop(), u = this.cache, s = 0, l = r; s < l.length; s++) {
            var f = l[s];
            Hs(u[f]) !== "object" && (u[f] = {}), (u = u[f]);
          }
          return (u[o] = a);
        },
      },
    ]),
    e
  );
})();
function Kd(e) {
  "@babel/helpers - typeof";
  return (
    (Kd =
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
    Kd(e)
  );
}
function O5(e, t) {
  var n = (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = M5(e)) || t) {
    n && (e = n);
    var r = 0;
    return function () {
      return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function M5(e, t) {
  if (e) {
    if (typeof e == "string") return Rv(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if ((n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set"))
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Rv(e, t);
  }
}
function Rv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function P5(e, t) {
  for (var n = O5(e), r; !(r = n()).done; ) {
    var i = r.value;
    if (t(i)) return i;
    for (var a = i.split("-"); a.length > 1; ) if ((a.pop(), (i = a.join("-")), t(i))) return i;
  }
  throw new Error(
    "No locale data has been registered for any of the locales: ".concat(e.join(", ")),
  );
}
function E5() {
  var e = (typeof Intl > "u" ? "undefined" : Kd(Intl)) === "object";
  return e && typeof Intl.DateTimeFormat == "function";
}
function Xd(e) {
  "@babel/helpers - typeof";
  return (
    (Xd =
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
    Xd(e)
  );
}
function A5(e) {
  return (
    F5(e) &&
    (Array.isArray(e.steps) ||
      Array.isArray(e.gradation) ||
      Array.isArray(e.flavour) ||
      typeof e.flavour == "string" ||
      Array.isArray(e.labels) ||
      typeof e.labels == "string" ||
      Array.isArray(e.units) ||
      typeof e.custom == "function")
  );
}
var R5 = {}.constructor;
function F5(e) {
  return Xd(e) !== void 0 && e !== null && e.constructor === R5;
}
var Fn = 60,
  Bs = 60 * Fn,
  Br = 24 * Bs,
  Zd = 7 * Br,
  Jd = 30.44 * Br,
  l_ = (146097 / 400) * Br;
function Wi(e) {
  switch (e) {
    case "second":
      return 1;
    case "minute":
      return Fn;
    case "hour":
      return Bs;
    case "day":
      return Br;
    case "week":
      return Zd;
    case "month":
      return Jd;
    case "year":
      return l_;
  }
}
function f_(e) {
  return e.factor !== void 0 ? e.factor : Wi(e.unit || e.formatAs) || 1;
}
function Ro(e) {
  switch (e) {
    case "floor":
      return Math.floor;
    default:
      return Math.round;
  }
}
function N0(e) {
  switch (e) {
    case "floor":
      return 1;
    default:
      return 0.5;
  }
}
function eh(e) {
  "@babel/helpers - typeof";
  return (
    (eh =
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
    eh(e)
  );
}
function c_(e, t) {
  var n = t.prevStep,
    r = t.timestamp,
    i = t.now,
    a = t.future,
    o = t.round,
    u;
  return (
    n && (n.id || n.unit) && (u = e["threshold_for_".concat(n.id || n.unit)]),
    u === void 0 &&
      e.threshold !== void 0 &&
      ((u = e.threshold), typeof u == "function" && (u = u(i, a))),
    u === void 0 && (u = e.minTime),
    eh(u) === "object" && (n && n.id && u[n.id] !== void 0 ? (u = u[n.id]) : (u = u.default)),
    typeof u == "function" &&
      (u = u(r, {
        future: a,
        getMinTimeForUnit: function (l, f) {
          return Fv(l, f || (n && n.formatAs), { round: o });
        },
      })),
    u === void 0 && e.test && (e.test(r, { now: i, future: a }) ? (u = 0) : (u = 9007199254740991)),
    u === void 0 &&
      (n ? e.formatAs && n.formatAs && (u = Fv(e.formatAs, n.formatAs, { round: o })) : (u = 0)),
    u === void 0 &&
      console.warn(
        "[javascript-time-ago] A step should specify `minTime`:\n" + JSON.stringify(e, null, 2),
      ),
    u
  );
}
function Fv(e, t, n) {
  var r = n.round,
    i = Wi(e),
    a;
  if ((t === "now" ? (a = Wi(e)) : (a = Wi(t)), i !== void 0 && a !== void 0))
    return i - a * (1 - N0(r));
}
function Dv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function D5(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Dv(Object(n), !0).forEach(function (r) {
          N5(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Dv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function N5(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
function I5(e, t, n) {
  var r = n.now,
    i = n.future,
    a = n.round,
    o = n.units;
  e = j5(e, o);
  var u = L5(e, t, { now: r, future: i, round: a });
  {
    if (u) {
      var s = e[e.indexOf(u) - 1],
        l = e[e.indexOf(u) + 1];
      return [s, u, l];
    }
    return [void 0, void 0, e[0]];
  }
}
function L5(e, t, n) {
  var r = n.now,
    i = n.future,
    a = n.round;
  if (e.length !== 0) {
    var o = d_(e, t, { now: r, future: i || t < 0, round: a });
    if (o !== -1) {
      var u = e[o];
      if (u.granularity) {
        var s = Ro(a)(Math.abs(t) / f_(u) / u.granularity) * u.granularity;
        if (s === 0 && o > 0) return e[o - 1];
      }
      return u;
    }
  }
}
function d_(e, t, n) {
  var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0,
    i = c_(e[r], D5({ prevStep: e[r - 1], timestamp: n.now - t * 1e3 }, n));
  return i === void 0 || Math.abs(t) < i ? r - 1 : r === e.length - 1 ? r : d_(e, t, n, r + 1);
}
function j5(e, t) {
  return e.filter(function (n) {
    var r = n.unit,
      i = n.formatAs;
    return (r = r || i), r ? t.indexOf(r) >= 0 : !0;
  });
}
function U5(e, t, n) {
  var r = n.now,
    i = n.round;
  if (Wi(e)) {
    var a = Wi(e) * 1e3,
      o = t > r,
      u = Math.abs(t - r),
      s = Ro(i)(u / a) * a;
    return o ? (s > 0 ? u - s + W5(i, a) : u - s + 1) : -(u - s) + z5(i, a);
  }
}
function z5(e, t) {
  return N0(e) * t;
}
function W5(e, t) {
  return (1 - N0(e)) * t + 1;
}
var q5 = 365 * 24 * 60 * 60 * 1e3,
  h_ = 1e3 * q5;
function H5(e, t, n) {
  var r = n.prevStep,
    i = n.nextStep,
    a = n.now,
    o = n.future,
    u = n.round,
    s = e.getTime ? e.getTime() : e,
    l = function (g) {
      return U5(g, s, { now: a, round: u });
    },
    f = V5(o ? t : i, s, { future: o, now: a, round: u, prevStep: o ? r : t });
  if (f !== void 0) {
    var c;
    if (
      t &&
      (t.getTimeToNextUpdate &&
        (c = t.getTimeToNextUpdate(s, {
          getTimeToNextUpdateForUnit: l,
          getRoundFunction: Ro,
          now: a,
          future: o,
          round: u,
        })),
      c === void 0)
    ) {
      var d = t.unit || t.formatAs;
      d && (c = l(d));
    }
    return c === void 0 ? f : Math.min(c, f);
  }
}
function B5(e, t, n) {
  var r = n.now,
    i = n.future,
    a = n.round,
    o = n.prevStep,
    u = c_(e, { timestamp: t, now: r, future: i, round: a, prevStep: o });
  if (u !== void 0) return i ? t - u * 1e3 + 1 : u === 0 && t === r ? h_ : t + u * 1e3;
}
function V5(e, t, n) {
  var r = n.now,
    i = n.future,
    a = n.round,
    o = n.prevStep;
  if (e) {
    var u = B5(e, t, { now: r, future: i, round: a, prevStep: o });
    return u === void 0 ? void 0 : u - r;
  } else return i ? t - r + 1 : h_;
}
var p_ = {};
function Fi(e) {
  return p_[e];
}
function m_(e) {
  if (!e) throw new Error("[javascript-time-ago] No locale data passed.");
  p_[e.locale] = e;
}
const Q5 = [
    { formatAs: "now" },
    { formatAs: "second" },
    { formatAs: "minute" },
    { formatAs: "hour" },
    { formatAs: "day" },
    { formatAs: "week" },
    { formatAs: "month" },
    { formatAs: "year" },
  ],
  th = { steps: Q5, labels: "long" };
function Nv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Iv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Nv(Object(n), !0).forEach(function (r) {
          Y5(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Nv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function Y5(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const nh = Iv(
    Iv({}, th),
    {},
    {
      steps: th.steps.filter(function (e) {
        return e.formatAs !== "second";
      }),
    },
  ),
  v_ = [
    { factor: 1, unit: "now" },
    { threshold: 1, threshold_for_now: 45.5, factor: 1, unit: "second" },
    { threshold: 45.5, factor: Fn, unit: "minute" },
    { threshold: 2.5 * Fn, granularity: 5, factor: Fn, unit: "minute" },
    { threshold: 22.5 * Fn, factor: 0.5 * Bs, unit: "half-hour" },
    { threshold: 42.5 * Fn, threshold_for_minute: 52.5 * Fn, factor: Bs, unit: "hour" },
    { threshold: (20.5 / 24) * Br, factor: Br, unit: "day" },
    { threshold: 5.5 * Br, factor: Zd, unit: "week" },
    { threshold: 3.5 * Zd, factor: Jd, unit: "month" },
    { threshold: 10.5 * Jd, factor: l_, unit: "year" },
  ],
  Lv = {
    gradation: v_,
    flavour: "long",
    units: ["now", "minute", "hour", "day", "week", "month", "year"],
  },
  G5 = {
    gradation: v_,
    flavour: "long-time",
    units: ["now", "minute", "hour", "day", "week", "month", "year"],
  };
function g_(e) {
  return e instanceof Date ? e : new Date(e);
}
var rh = [{ formatAs: "second" }, { formatAs: "minute" }, { formatAs: "hour" }],
  wn = {},
  K5 = {
    minTime: function (t, n) {
      n.future;
      var r = n.getMinTimeForUnit;
      return r("day");
    },
    format: function (t, n) {
      return (
        wn[n] || (wn[n] = {}),
        wn[n].dayMonth ||
          (wn[n].dayMonth = new Intl.DateTimeFormat(n, { month: "short", day: "numeric" })),
        wn[n].dayMonth.format(g_(t))
      );
    },
  },
  X5 = {
    minTime: function (t, n) {
      var r = n.future;
      if (r) {
        var i = new Date(new Date(t).getFullYear(), 0).getTime() - 1;
        return (t - i) / 1e3;
      } else {
        var a = new Date(new Date(t).getFullYear() + 1, 0).getTime();
        return (a - t) / 1e3;
      }
    },
    format: function (t, n) {
      return (
        wn[n] || (wn[n] = {}),
        wn[n].dayMonthYear ||
          (wn[n].dayMonthYear = new Intl.DateTimeFormat(n, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })),
        wn[n].dayMonthYear.format(g_(t))
      );
    },
  };
E5()
  ? rh.push(K5, X5)
  : rh.push({ formatAs: "day" }, { formatAs: "week" }, { formatAs: "month" }, { formatAs: "year" });
const Jr = { steps: rh, labels: ["mini", "short-time", "narrow", "short"] };
function jv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Uv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? jv(Object(n), !0).forEach(function (r) {
          Z5(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : jv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function Z5(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const J5 = Uv(Uv({}, Jr), {}, { steps: [{ formatAs: "now" }].concat(Jr.steps) });
function zv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Wv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? zv(Object(n), !0).forEach(function (r) {
          eS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : zv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function eS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const ih = Wv(
  Wv({}, Jr),
  {},
  {
    steps: Jr.steps.filter(function (e) {
      return e.formatAs !== "second";
    }),
  },
);
function qv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Hv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? qv(Object(n), !0).forEach(function (r) {
          tS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : qv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function tS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const nS = Hv(Hv({}, ih), {}, { steps: [{ formatAs: "now" }].concat(ih.steps) });
function Bv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function ju(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Bv(Object(n), !0).forEach(function (r) {
          rS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Bv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function rS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const iS = ju(
    ju({}, Jr),
    {},
    {
      steps: Jr.steps
        .filter(function (e) {
          return e.formatAs !== "second";
        })
        .map(function (e) {
          return e.formatAs === "minute" ? ju(ju({}, e), {}, { minTime: Fn }) : e;
        }),
    },
  ),
  Fo = {
    steps: [
      { formatAs: "second" },
      { formatAs: "minute" },
      { formatAs: "hour" },
      { formatAs: "day" },
      { formatAs: "month" },
      { formatAs: "year" },
    ],
    labels: ["mini", "short-time", "narrow", "short"],
  };
function Vv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Qv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Vv(Object(n), !0).forEach(function (r) {
          aS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Vv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function aS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const oS = Qv(Qv({}, Fo), {}, { steps: [{ formatAs: "now" }].concat(Fo.steps) });
function Yv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Gv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Yv(Object(n), !0).forEach(function (r) {
          uS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Yv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function uS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const ah = Gv(
  Gv({}, Fo),
  {},
  {
    steps: Fo.steps.filter(function (e) {
      return e.formatAs !== "second";
    }),
  },
);
function Kv(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Xv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Kv(Object(n), !0).forEach(function (r) {
          sS(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : Kv(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
          });
  }
  return e;
}
function sS(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
const lS = Xv(Xv({}, ah), {}, { steps: [{ formatAs: "now" }].concat(ah.steps) });
function fS(e) {
  switch (e) {
    case "default":
    case "round":
      return th;
    case "round-minute":
      return nh;
    case "approximate":
      return Lv;
    case "time":
    case "approximate-time":
      return G5;
    case "mini":
      return Fo;
    case "mini-now":
      return oS;
    case "mini-minute":
      return ah;
    case "mini-minute-now":
      return lS;
    case "twitter":
      return Jr;
    case "twitter-now":
      return J5;
    case "twitter-minute":
      return ih;
    case "twitter-minute-now":
      return nS;
    case "twitter-first-minute":
      return iS;
    default:
      return Lv;
  }
}
function Vs(e) {
  "@babel/helpers - typeof";
  return (
    (Vs =
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
    Vs(e)
  );
}
function cS(e, t) {
  var n = (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = y_(e)) || t) {
    n && (e = n);
    var r = 0;
    return function () {
      return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function dS(e, t) {
  return mS(e) || pS(e, t) || y_(e, t) || hS();
}
function hS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function y_(e, t) {
  if (e) {
    if (typeof e == "string") return Zv(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if ((n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set"))
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Zv(e, t);
  }
}
function Zv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function pS(e, t) {
  var n = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n != null) {
    var r = [],
      i = !0,
      a = !1,
      o,
      u;
    try {
      for (
        n = n.call(e);
        !(i = (o = n.next()).done) && (r.push(o.value), !(t && r.length === t));
        i = !0
      );
    } catch (s) {
      (a = !0), (u = s);
    } finally {
      try {
        !i && n.return != null && n.return();
      } finally {
        if (a) throw u;
      }
    }
    return r;
  }
}
function mS(e) {
  if (Array.isArray(e)) return e;
}
function vS(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function gS(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function yS(e, t, n) {
  return t && gS(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var Un = (function () {
    function e() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
        n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        r = n.polyfill;
      vS(this, e),
        typeof t == "string" && (t = [t]),
        (this.locale = P5(t.concat(e.getDefaultLocale()), Fi)),
        typeof Intl < "u" &&
          Intl.NumberFormat &&
          (this.numberFormat = new Intl.NumberFormat(this.locale)),
        r === !1
          ? ((this.IntlRelativeTimeFormat = Intl.RelativeTimeFormat),
            (this.IntlPluralRules = Intl.PluralRules))
          : ((this.IntlRelativeTimeFormat = wr), (this.IntlPluralRules = wr.PluralRules)),
        (this.relativeTimeFormatCache = new Av()),
        (this.pluralRulesCache = new Av());
    }
    return (
      yS(e, [
        {
          key: "format",
          value: function (n, r, i) {
            i || (r && !SS(r) ? ((i = r), (r = void 0)) : (i = {})),
              r || (r = nh),
              typeof r == "string" && (r = fS(r));
            var a = bS(n),
              o = this.getLabels(r.flavour || r.labels),
              u = o.labels,
              s = o.labelsType,
              l;
            r.now !== void 0 && (l = r.now),
              l === void 0 && i.now !== void 0 && (l = i.now),
              l === void 0 && (l = Date.now());
            var f = (l - a) / 1e3,
              c = i.future || f < 0,
              d = xS(u, Fi(this.locale).now, Fi(this.locale).long, c);
            if (r.custom) {
              var p = r.custom({
                now: l,
                date: new Date(a),
                time: a,
                elapsed: f,
                locale: this.locale,
              });
              if (p !== void 0) return p;
            }
            var g = wS(r.units, u, d),
              y = i.round || r.round,
              b = I5(r.gradation || r.steps || nh.steps, f, {
                now: l,
                units: g,
                round: y,
                future: c,
              }),
              h = dS(b, 3),
              m = h[0],
              v = h[1],
              _ = h[2],
              S =
                this.formatDateForStep(a, v, f, {
                  labels: u,
                  labelsType: s,
                  nowLabel: d,
                  now: l,
                  future: c,
                  round: y,
                }) || "";
            if (i.getTimeToNextUpdate) {
              var w = H5(a, v, { nextStep: _, prevStep: m, now: l, future: c, round: y });
              return [S, w];
            }
            return S;
          },
        },
        {
          key: "formatDateForStep",
          value: function (n, r, i, a) {
            var o = this,
              u = a.labels,
              s = a.labelsType,
              l = a.nowLabel,
              f = a.now,
              c = a.future,
              d = a.round;
            if (r) {
              if (r.format)
                return r.format(n, this.locale, {
                  formatAs: function (h, m) {
                    return o.formatValue(m, h, { labels: u, future: c });
                  },
                  now: f,
                  future: c,
                });
              var p = r.unit || r.formatAs;
              if (!p)
                throw new Error(
                  "[javascript-time-ago] Each step must define either `formatAs` or `format()`. Step: ".concat(
                    JSON.stringify(r),
                  ),
                );
              if (p === "now") return l;
              var g = Math.abs(i) / f_(r);
              r.granularity && (g = Ro(d)(g / r.granularity) * r.granularity);
              var y = -1 * Math.sign(i) * Ro(d)(g);
              switch ((y === 0 && (c ? (y = 0) : (y = -0)), s)) {
                case "long":
                case "short":
                case "narrow":
                  return this.getFormatter(s).format(y, p);
                default:
                  return this.formatValue(y, p, { labels: u, future: c });
              }
            }
          },
        },
        {
          key: "formatValue",
          value: function (n, r, i) {
            var a = i.labels,
              o = i.future;
            return this.getFormattingRule(a, r, n, { future: o }).replace(
              "{0}",
              this.formatNumber(Math.abs(n)),
            );
          },
        },
        {
          key: "getFormattingRule",
          value: function (n, r, i, a) {
            var o = a.future;
            if ((this.locale, (n = n[r]), typeof n == "string")) return n;
            var u = i === 0 ? (o ? "future" : "past") : i < 0 ? "past" : "future",
              s = n[u] || n;
            if (typeof s == "string") return s;
            var l = this.getPluralRules().select(Math.abs(i));
            return s[l] || s.other;
          },
        },
        {
          key: "formatNumber",
          value: function (n) {
            return this.numberFormat ? this.numberFormat.format(n) : String(n);
          },
        },
        {
          key: "getFormatter",
          value: function (n) {
            return (
              this.relativeTimeFormatCache.get(this.locale, n) ||
              this.relativeTimeFormatCache.put(
                this.locale,
                n,
                new this.IntlRelativeTimeFormat(this.locale, { style: n }),
              )
            );
          },
        },
        {
          key: "getPluralRules",
          value: function () {
            return (
              this.pluralRulesCache.get(this.locale) ||
              this.pluralRulesCache.put(this.locale, new this.IntlPluralRules(this.locale))
            );
          },
        },
        {
          key: "getLabels",
          value: function () {
            var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
            typeof n == "string" && (n = [n]),
              (n = n.map(function (u) {
                switch (u) {
                  case "tiny":
                  case "mini-time":
                    return "mini";
                  default:
                    return u;
                }
              })),
              (n = n.concat("long"));
            for (var r = Fi(this.locale), i = cS(n), a; !(a = i()).done; ) {
              var o = a.value;
              if (r[o]) return { labelsType: o, labels: r[o] };
            }
          },
        },
      ]),
      e
    );
  })(),
  b_ = "en";
Un.getDefaultLocale = function () {
  return b_;
};
Un.setDefaultLocale = function (e) {
  return (b_ = e);
};
Un.addDefaultLocale = function (e) {
  if (Jv)
    return console.error(
      "[javascript-time-ago] `TimeAgo.addDefaultLocale()` can only be called once. To add other locales, use `TimeAgo.addLocale()`.",
    );
  (Jv = !0), Un.setDefaultLocale(e.locale), Un.addLocale(e);
};
var Jv;
Un.addLocale = function (e) {
  m_(e), wr.addLocale(e);
};
Un.locale = Un.addLocale;
Un.addLabels = function (e, t, n) {
  var r = Fi(e);
  r || (m_({ locale: e }), (r = Fi(e))), (r[t] = n);
};
function bS(e) {
  if (e.constructor === Date || _S(e)) return e.getTime();
  if (typeof e == "number") return e;
  throw new Error("Unsupported relative time formatter input: ".concat(Vs(e), ", ").concat(e));
}
function _S(e) {
  return Vs(e) === "object" && typeof e.getTime == "function";
}
function wS(e, t, n) {
  var r = Object.keys(t);
  return (
    n && r.push("now"),
    e &&
      (r = e.filter(function (i) {
        return i === "now" || r.indexOf(i) >= 0;
      })),
    r
  );
}
function xS(e, t, n, r) {
  var i = e.now || (t && t.now);
  if (i) return typeof i == "string" ? i : r ? i.future : i.past;
  if (n && n.second && n.second.current) return n.second.current;
}
function SS(e) {
  return typeof e == "string" || A5(e);
}
const DB = {
  locale: "en",
  long: {
    year: {
      previous: "last year",
      current: "this year",
      next: "next year",
      past: { one: "{0} year ago", other: "{0} years ago" },
      future: { one: "in {0} year", other: "in {0} years" },
    },
    quarter: {
      previous: "last quarter",
      current: "this quarter",
      next: "next quarter",
      past: { one: "{0} quarter ago", other: "{0} quarters ago" },
      future: { one: "in {0} quarter", other: "in {0} quarters" },
    },
    month: {
      previous: "last month",
      current: "this month",
      next: "next month",
      past: { one: "{0} month ago", other: "{0} months ago" },
      future: { one: "in {0} month", other: "in {0} months" },
    },
    week: {
      previous: "last week",
      current: "this week",
      next: "next week",
      past: { one: "{0} week ago", other: "{0} weeks ago" },
      future: { one: "in {0} week", other: "in {0} weeks" },
    },
    day: {
      previous: "yesterday",
      current: "today",
      next: "tomorrow",
      past: { one: "{0} day ago", other: "{0} days ago" },
      future: { one: "in {0} day", other: "in {0} days" },
    },
    hour: {
      current: "this hour",
      past: { one: "{0} hour ago", other: "{0} hours ago" },
      future: { one: "in {0} hour", other: "in {0} hours" },
    },
    minute: {
      current: "this minute",
      past: { one: "{0} minute ago", other: "{0} minutes ago" },
      future: { one: "in {0} minute", other: "in {0} minutes" },
    },
    second: {
      current: "now",
      past: { one: "{0} second ago", other: "{0} seconds ago" },
      future: { one: "in {0} second", other: "in {0} seconds" },
    },
  },
  short: {
    year: {
      previous: "last yr.",
      current: "this yr.",
      next: "next yr.",
      past: "{0} yr. ago",
      future: "in {0} yr.",
    },
    quarter: {
      previous: "last qtr.",
      current: "this qtr.",
      next: "next qtr.",
      past: { one: "{0} qtr. ago", other: "{0} qtrs. ago" },
      future: { one: "in {0} qtr.", other: "in {0} qtrs." },
    },
    month: {
      previous: "last mo.",
      current: "this mo.",
      next: "next mo.",
      past: "{0} mo. ago",
      future: "in {0} mo.",
    },
    week: {
      previous: "last wk.",
      current: "this wk.",
      next: "next wk.",
      past: "{0} wk. ago",
      future: "in {0} wk.",
    },
    day: {
      previous: "yesterday",
      current: "today",
      next: "tomorrow",
      past: { one: "{0} day ago", other: "{0} days ago" },
      future: { one: "in {0} day", other: "in {0} days" },
    },
    hour: { current: "this hour", past: "{0} hr. ago", future: "in {0} hr." },
    minute: { current: "this minute", past: "{0} min. ago", future: "in {0} min." },
    second: { current: "now", past: "{0} sec. ago", future: "in {0} sec." },
  },
  narrow: {
    year: {
      previous: "last yr.",
      current: "this yr.",
      next: "next yr.",
      past: "{0}y ago",
      future: "in {0}y",
    },
    quarter: {
      previous: "last qtr.",
      current: "this qtr.",
      next: "next qtr.",
      past: "{0}q ago",
      future: "in {0}q",
    },
    month: {
      previous: "last mo.",
      current: "this mo.",
      next: "next mo.",
      past: "{0}mo ago",
      future: "in {0}mo",
    },
    week: {
      previous: "last wk.",
      current: "this wk.",
      next: "next wk.",
      past: "{0}w ago",
      future: "in {0}w",
    },
    day: {
      previous: "yesterday",
      current: "today",
      next: "tomorrow",
      past: "{0}d ago",
      future: "in {0}d",
    },
    hour: { current: "this hour", past: "{0}h ago", future: "in {0}h" },
    minute: { current: "this minute", past: "{0}m ago", future: "in {0}m" },
    second: { current: "now", past: "{0}s ago", future: "in {0}s" },
  },
  now: { now: { current: "now", future: "in a moment", past: "just now" } },
  mini: {
    year: "{0}yr",
    month: "{0}mo",
    week: "{0}wk",
    day: "{0}d",
    hour: "{0}h",
    minute: "{0}m",
    second: "{0}s",
    now: "now",
  },
  "short-time": {
    year: "{0} yr.",
    month: "{0} mo.",
    week: "{0} wk.",
    day: { one: "{0} day", other: "{0} days" },
    hour: "{0} hr.",
    minute: "{0} min.",
    second: "{0} sec.",
  },
  "long-time": {
    year: { one: "{0} year", other: "{0} years" },
    month: { one: "{0} month", other: "{0} months" },
    week: { one: "{0} week", other: "{0} weeks" },
    day: { one: "{0} day", other: "{0} days" },
    hour: { one: "{0} hour", other: "{0} hours" },
    minute: { one: "{0} minute", other: "{0} minutes" },
    second: { one: "{0} second", other: "{0} seconds" },
  },
};
var I0 = au(),
  ee = (e) => iu(e, I0),
  L0 = au();
ee.write = (e) => iu(e, L0);
var Il = au();
ee.onStart = (e) => iu(e, Il);
var j0 = au();
ee.onFrame = (e) => iu(e, j0);
var U0 = au();
ee.onFinish = (e) => iu(e, U0);
var qi = [];
ee.setTimeout = (e, t) => {
  const n = ee.now() + t,
    r = () => {
      const a = qi.findIndex((o) => o.cancel == r);
      ~a && qi.splice(a, 1), (lr -= ~a ? 1 : 0);
    },
    i = { time: n, handler: e, cancel: r };
  return qi.splice(__(n), 0, i), (lr += 1), w_(), i;
};
var __ = (e) => ~(~qi.findIndex((t) => t.time > e) || ~qi.length);
ee.cancel = (e) => {
  Il.delete(e), j0.delete(e), U0.delete(e), I0.delete(e), L0.delete(e);
};
ee.sync = (e) => {
  (oh = !0), ee.batchedUpdates(e), (oh = !1);
};
ee.throttle = (e) => {
  let t;
  function n() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function r(...i) {
    (t = i), ee.onStart(n);
  }
  return (
    (r.handler = e),
    (r.cancel = () => {
      Il.delete(n), (t = null);
    }),
    r
  );
};
var z0 = typeof window < "u" ? window.requestAnimationFrame : () => {};
ee.use = (e) => (z0 = e);
ee.now = typeof performance < "u" ? () => performance.now() : Date.now;
ee.batchedUpdates = (e) => e();
ee.catch = console.error;
ee.frameLoop = "always";
ee.advance = () => {
  ee.frameLoop !== "demand"
    ? console.warn(
        "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand",
      )
    : S_();
};
var sr = -1,
  lr = 0,
  oh = !1;
function iu(e, t) {
  oh ? (t.delete(e), e(0)) : (t.add(e), w_());
}
function w_() {
  sr < 0 && ((sr = 0), ee.frameLoop !== "demand" && z0(x_));
}
function $S() {
  sr = -1;
}
function x_() {
  ~sr && (z0(x_), ee.batchedUpdates(S_));
}
function S_() {
  const e = sr;
  sr = ee.now();
  const t = __(sr);
  if ((t && ($_(qi.splice(0, t), (n) => n.handler()), (lr -= t)), !lr)) {
    $S();
    return;
  }
  Il.flush(), I0.flush(e ? Math.min(64, sr - e) : 16.667), j0.flush(), L0.flush(), U0.flush();
}
function au() {
  let e = new Set(),
    t = e;
  return {
    add(n) {
      (lr += t == e && !e.has(n) ? 1 : 0), e.add(n);
    },
    delete(n) {
      return (lr -= t == e && e.has(n) ? 1 : 0), e.delete(n);
    },
    flush(n) {
      t.size &&
        ((e = new Set()), (lr -= t.size), $_(t, (r) => r(n) && e.add(r)), (lr += e.size), (t = e));
    },
  };
}
function $_(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      ee.catch(r);
    }
  });
}
var TS = Object.defineProperty,
  CS = (e, t) => {
    for (var n in t) TS(e, n, { get: t[n], enumerable: !0 });
  },
  fn = {};
CS(fn, {
  assign: () => OS,
  colors: () => yr,
  createStringInterpolator: () => q0,
  skipAnimation: () => C_,
  to: () => T_,
  willAdvance: () => H0,
});
function uh() {}
var kS = (e, t, n) => Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }),
  L = {
    arr: Array.isArray,
    obj: (e) => !!e && e.constructor.name === "Object",
    fun: (e) => typeof e == "function",
    str: (e) => typeof e == "string",
    num: (e) => typeof e == "number",
    und: (e) => e === void 0,
  };
function En(e, t) {
  if (L.arr(e)) {
    if (!L.arr(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
    return !0;
  }
  return e === t;
}
var Z = (e, t) => e.forEach(t);
function Tn(e, t, n) {
  if (L.arr(e)) {
    for (let r = 0; r < e.length; r++) t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e) e.hasOwnProperty(r) && t.call(n, e[r], r);
}
var mt = (e) => (L.und(e) ? [] : L.arr(e) ? e : [e]);
function co(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), Z(n, t);
  }
}
var eo = (e, ...t) => co(e, (n) => n(...t)),
  W0 = () =>
    typeof window > "u" ||
    !window.navigator ||
    /ServerSideRendering|^Deno\//.test(window.navigator.userAgent),
  q0,
  T_,
  yr = null,
  C_ = !1,
  H0 = uh,
  OS = (e) => {
    e.to && (T_ = e.to),
      e.now && (ee.now = e.now),
      e.colors !== void 0 && (yr = e.colors),
      e.skipAnimation != null && (C_ = e.skipAnimation),
      e.createStringInterpolator && (q0 = e.createStringInterpolator),
      e.requestAnimationFrame && ee.use(e.requestAnimationFrame),
      e.batchedUpdates && (ee.batchedUpdates = e.batchedUpdates),
      e.willAdvance && (H0 = e.willAdvance),
      e.frameLoop && (ee.frameLoop = e.frameLoop);
  },
  ho = new Set(),
  qt = [],
  xc = [],
  Qs = 0,
  Ll = {
    get idle() {
      return !ho.size && !qt.length;
    },
    start(e) {
      Qs > e.priority ? (ho.add(e), ee.onStart(MS)) : (k_(e), ee(sh));
    },
    advance: sh,
    sort(e) {
      if (Qs) ee.onFrame(() => Ll.sort(e));
      else {
        const t = qt.indexOf(e);
        ~t && (qt.splice(t, 1), O_(e));
      }
    },
    clear() {
      (qt = []), ho.clear();
    },
  };
function MS() {
  ho.forEach(k_), ho.clear(), ee(sh);
}
function k_(e) {
  qt.includes(e) || O_(e);
}
function O_(e) {
  qt.splice(
    PS(qt, (t) => t.priority > e.priority),
    0,
    e,
  );
}
function sh(e) {
  const t = xc;
  for (let n = 0; n < qt.length; n++) {
    const r = qt[n];
    (Qs = r.priority), r.idle || (H0(r), r.advance(e), r.idle || t.push(r));
  }
  return (Qs = 0), (xc = qt), (xc.length = 0), (qt = t), qt.length > 0;
}
function PS(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
var ES = {
    transparent: 0,
    aliceblue: 4042850303,
    antiquewhite: 4209760255,
    aqua: 16777215,
    aquamarine: 2147472639,
    azure: 4043309055,
    beige: 4126530815,
    bisque: 4293182719,
    black: 255,
    blanchedalmond: 4293643775,
    blue: 65535,
    blueviolet: 2318131967,
    brown: 2771004159,
    burlywood: 3736635391,
    burntsienna: 3934150143,
    cadetblue: 1604231423,
    chartreuse: 2147418367,
    chocolate: 3530104575,
    coral: 4286533887,
    cornflowerblue: 1687547391,
    cornsilk: 4294499583,
    crimson: 3692313855,
    cyan: 16777215,
    darkblue: 35839,
    darkcyan: 9145343,
    darkgoldenrod: 3095792639,
    darkgray: 2846468607,
    darkgreen: 6553855,
    darkgrey: 2846468607,
    darkkhaki: 3182914559,
    darkmagenta: 2332068863,
    darkolivegreen: 1433087999,
    darkorange: 4287365375,
    darkorchid: 2570243327,
    darkred: 2332033279,
    darksalmon: 3918953215,
    darkseagreen: 2411499519,
    darkslateblue: 1211993087,
    darkslategray: 793726975,
    darkslategrey: 793726975,
    darkturquoise: 13554175,
    darkviolet: 2483082239,
    deeppink: 4279538687,
    deepskyblue: 12582911,
    dimgray: 1768516095,
    dimgrey: 1768516095,
    dodgerblue: 512819199,
    firebrick: 2988581631,
    floralwhite: 4294635775,
    forestgreen: 579543807,
    fuchsia: 4278255615,
    gainsboro: 3705462015,
    ghostwhite: 4177068031,
    gold: 4292280575,
    goldenrod: 3668254975,
    gray: 2155905279,
    green: 8388863,
    greenyellow: 2919182335,
    grey: 2155905279,
    honeydew: 4043305215,
    hotpink: 4285117695,
    indianred: 3445382399,
    indigo: 1258324735,
    ivory: 4294963455,
    khaki: 4041641215,
    lavender: 3873897215,
    lavenderblush: 4293981695,
    lawngreen: 2096890111,
    lemonchiffon: 4294626815,
    lightblue: 2916673279,
    lightcoral: 4034953471,
    lightcyan: 3774873599,
    lightgoldenrodyellow: 4210742015,
    lightgray: 3553874943,
    lightgreen: 2431553791,
    lightgrey: 3553874943,
    lightpink: 4290167295,
    lightsalmon: 4288707327,
    lightseagreen: 548580095,
    lightskyblue: 2278488831,
    lightslategray: 2005441023,
    lightslategrey: 2005441023,
    lightsteelblue: 2965692159,
    lightyellow: 4294959359,
    lime: 16711935,
    limegreen: 852308735,
    linen: 4210091775,
    magenta: 4278255615,
    maroon: 2147483903,
    mediumaquamarine: 1724754687,
    mediumblue: 52735,
    mediumorchid: 3126187007,
    mediumpurple: 2473647103,
    mediumseagreen: 1018393087,
    mediumslateblue: 2070474495,
    mediumspringgreen: 16423679,
    mediumturquoise: 1221709055,
    mediumvioletred: 3340076543,
    midnightblue: 421097727,
    mintcream: 4127193855,
    mistyrose: 4293190143,
    moccasin: 4293178879,
    navajowhite: 4292783615,
    navy: 33023,
    oldlace: 4260751103,
    olive: 2155872511,
    olivedrab: 1804477439,
    orange: 4289003775,
    orangered: 4282712319,
    orchid: 3664828159,
    palegoldenrod: 4008225535,
    palegreen: 2566625535,
    paleturquoise: 2951671551,
    palevioletred: 3681588223,
    papayawhip: 4293907967,
    peachpuff: 4292524543,
    peru: 3448061951,
    pink: 4290825215,
    plum: 3718307327,
    powderblue: 2967529215,
    purple: 2147516671,
    rebeccapurple: 1714657791,
    red: 4278190335,
    rosybrown: 3163525119,
    royalblue: 1097458175,
    saddlebrown: 2336560127,
    salmon: 4202722047,
    sandybrown: 4104413439,
    seagreen: 780883967,
    seashell: 4294307583,
    sienna: 2689740287,
    silver: 3233857791,
    skyblue: 2278484991,
    slateblue: 1784335871,
    slategray: 1887473919,
    slategrey: 1887473919,
    snow: 4294638335,
    springgreen: 16744447,
    steelblue: 1182971135,
    tan: 3535047935,
    teal: 8421631,
    thistle: 3636451583,
    tomato: 4284696575,
    turquoise: 1088475391,
    violet: 4001558271,
    wheat: 4125012991,
    white: 4294967295,
    whitesmoke: 4126537215,
    yellow: 4294902015,
    yellowgreen: 2597139199,
  },
  on = "[-+]?\\d*\\.?\\d+",
  Ys = on + "%";
function jl(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var AS = new RegExp("rgb" + jl(on, on, on)),
  RS = new RegExp("rgba" + jl(on, on, on, on)),
  FS = new RegExp("hsl" + jl(on, Ys, Ys)),
  DS = new RegExp("hsla" + jl(on, Ys, Ys, on)),
  NS = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  IS = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  LS = /^#([0-9a-fA-F]{6})$/,
  jS = /^#([0-9a-fA-F]{8})$/;
function US(e) {
  let t;
  return typeof e == "number"
    ? e >>> 0 === e && e >= 0 && e <= 4294967295
      ? e
      : null
    : (t = LS.exec(e))
      ? parseInt(t[1] + "ff", 16) >>> 0
      : yr && yr[e] !== void 0
        ? yr[e]
        : (t = AS.exec(e))
          ? ((yi(t[1]) << 24) | (yi(t[2]) << 16) | (yi(t[3]) << 8) | 255) >>> 0
          : (t = RS.exec(e))
            ? ((yi(t[1]) << 24) | (yi(t[2]) << 16) | (yi(t[3]) << 8) | n1(t[4])) >>> 0
            : (t = NS.exec(e))
              ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0
              : (t = jS.exec(e))
                ? parseInt(t[1], 16) >>> 0
                : (t = IS.exec(e))
                  ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0
                  : (t = FS.exec(e))
                    ? (e1(t1(t[1]), Uu(t[2]), Uu(t[3])) | 255) >>> 0
                    : (t = DS.exec(e))
                      ? (e1(t1(t[1]), Uu(t[2]), Uu(t[3])) | n1(t[4])) >>> 0
                      : null;
}
function Sc(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
  );
}
function e1(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t,
    i = 2 * n - r,
    a = Sc(i, r, e + 1 / 3),
    o = Sc(i, r, e),
    u = Sc(i, r, e - 1 / 3);
  return (Math.round(a * 255) << 24) | (Math.round(o * 255) << 16) | (Math.round(u * 255) << 8);
}
function yi(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function t1(e) {
  return (((parseFloat(e) % 360) + 360) % 360) / 360;
}
function n1(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function Uu(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function r1(e) {
  let t = US(e);
  if (t === null) return e;
  t = t || 0;
  const n = (t & 4278190080) >>> 24,
    r = (t & 16711680) >>> 16,
    i = (t & 65280) >>> 8,
    a = (t & 255) / 255;
  return `rgba(${n}, ${r}, ${i}, ${a})`;
}
var Do = (e, t, n) => {
  if (L.fun(e)) return e;
  if (L.arr(e)) return Do({ range: e, output: t, extrapolate: n });
  if (L.str(e.output[0])) return q0(e);
  const r = e,
    i = r.output,
    a = r.range || [0, 1],
    o = r.extrapolateLeft || r.extrapolate || "extend",
    u = r.extrapolateRight || r.extrapolate || "extend",
    s = r.easing || ((l) => l);
  return (l) => {
    const f = WS(l, a);
    return zS(l, a[f], a[f + 1], i[f], i[f + 1], s, o, u, r.map);
  };
};
function zS(e, t, n, r, i, a, o, u, s) {
  let l = s ? s(e) : e;
  if (l < t) {
    if (o === "identity") return l;
    o === "clamp" && (l = t);
  }
  if (l > n) {
    if (u === "identity") return l;
    u === "clamp" && (l = n);
  }
  return r === i
    ? r
    : t === n
      ? e <= t
        ? r
        : i
      : (t === -1 / 0 ? (l = -l) : n === 1 / 0 ? (l = l - t) : (l = (l - t) / (n - t)),
        (l = a(l)),
        r === -1 / 0 ? (l = -l) : i === 1 / 0 ? (l = l + r) : (l = l * (i - r) + r),
        l);
}
function WS(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n);
  return n - 1;
}
var qS = { linear: (e) => e },
  No = Symbol.for("FluidValue.get"),
  ea = Symbol.for("FluidValue.observers"),
  Wt = (e) => !!(e && e[No]),
  xt = (e) => (e && e[No] ? e[No]() : e),
  i1 = (e) => e[ea] || null;
function HS(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function Io(e, t) {
  const n = e[ea];
  n &&
    n.forEach((r) => {
      HS(r, t);
    });
}
var M_ = class {
    constructor(e) {
      if (!e && !(e = this.get)) throw Error("Unknown getter");
      BS(this, e);
    }
  },
  BS = (e, t) => P_(e, No, t);
function ha(e, t) {
  if (e[No]) {
    let n = e[ea];
    n || P_(e, ea, (n = new Set())),
      n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function Lo(e, t) {
  const n = e[ea];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : (e[ea] = null), e.observerRemoved && e.observerRemoved(r, t);
  }
}
var P_ = (e, t, n) => Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }),
  fs = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  VS = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,
  a1 = new RegExp(`(${fs.source})(%|[a-z]+)`, "i"),
  QS = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi,
  Ul = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/,
  E_ = (e) => {
    const [t, n] = YS(e);
    if (!t || W0()) return e;
    const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
    if (r) return r.trim();
    if (n && n.startsWith("--")) {
      const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
      return i || e;
    } else {
      if (n && Ul.test(n)) return E_(n);
      if (n) return n;
    }
    return e;
  },
  YS = (e) => {
    const t = Ul.exec(e);
    if (!t) return [,];
    const [, n, r] = t;
    return [n, r];
  },
  $c,
  GS = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`,
  A_ = (e) => {
    $c || ($c = yr ? new RegExp(`(${Object.keys(yr).join("|")})(?!\\w)`, "g") : /^\b$/);
    const t = e.output.map((a) => xt(a).replace(Ul, E_).replace(VS, r1).replace($c, r1)),
      n = t.map((a) => a.match(fs).map(Number)),
      i = n[0]
        .map((a, o) =>
          n.map((u) => {
            if (!(o in u)) throw Error('The arity of each "output" value must be equal');
            return u[o];
          }),
        )
        .map((a) => Do({ ...e, output: a }));
    return (a) => {
      var s;
      const o =
        !a1.test(t[0]) && ((s = t.find((l) => a1.test(l))) == null ? void 0 : s.replace(fs, ""));
      let u = 0;
      return t[0].replace(fs, () => `${i[u++](a)}${o || ""}`).replace(QS, GS);
    };
  },
  B0 = "react-spring: ",
  R_ = (e) => {
    const t = e;
    let n = !1;
    if (typeof t != "function") throw new TypeError(`${B0}once requires a function parameter`);
    return (...r) => {
      n || (t(...r), (n = !0));
    };
  },
  KS = R_(console.warn);
function XS() {
  KS(`${B0}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
var ZS = R_(console.warn);
function JS() {
  ZS(
    `${B0}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`,
  );
}
function zl(e) {
  return L.str(e) && (e[0] == "#" || /\d/.test(e) || (!W0() && Ul.test(e)) || e in (yr || {}));
}
var jr = W0() ? A.useEffect : A.useLayoutEffect,
  e7 = () => {
    const e = A.useRef(!1);
    return (
      jr(
        () => (
          (e.current = !0),
          () => {
            e.current = !1;
          }
        ),
        [],
      ),
      e
    );
  };
function V0() {
  const e = A.useState()[1],
    t = e7();
  return () => {
    t.current && e(Math.random());
  };
}
function t7(e, t) {
  const [n] = A.useState(() => ({ inputs: t, result: e() })),
    r = A.useRef(),
    i = r.current;
  let a = i;
  return (
    a ? (t && a.inputs && n7(t, a.inputs)) || (a = { inputs: t, result: e() }) : (a = n),
    A.useEffect(() => {
      (r.current = a), i == n && (n.inputs = n.result = void 0);
    }, [a]),
    a.result
  );
}
function n7(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
var Q0 = (e) => A.useEffect(e, r7),
  r7 = [];
function lh(e) {
  const t = A.useRef();
  return (
    A.useEffect(() => {
      t.current = e;
    }),
    t.current
  );
}
var jo = Symbol.for("Animated:node"),
  i7 = (e) => !!e && e[jo] === e,
  bn = (e) => e && e[jo],
  Y0 = (e, t) => kS(e, jo, t),
  Wl = (e) => e && e[jo] && e[jo].getPayload(),
  F_ = class {
    constructor() {
      Y0(this, this);
    }
    getPayload() {
      return this.payload || [];
    }
  },
  ou = class extends F_ {
    constructor(e) {
      super(),
        (this._value = e),
        (this.done = !0),
        (this.durationProgress = 0),
        L.num(this._value) && (this.lastPosition = this._value);
    }
    static create(e) {
      return new ou(e);
    }
    getPayload() {
      return [this];
    }
    getValue() {
      return this._value;
    }
    setValue(e, t) {
      return (
        L.num(e) &&
          ((this.lastPosition = e),
          t && ((e = Math.round(e / t) * t), this.done && (this.lastPosition = e))),
        this._value === e ? !1 : ((this._value = e), !0)
      );
    }
    reset() {
      const { done: e } = this;
      (this.done = !1),
        L.num(this._value) &&
          ((this.elapsedTime = 0),
          (this.durationProgress = 0),
          (this.lastPosition = this._value),
          e && (this.lastVelocity = null),
          (this.v0 = null));
    }
  },
  Uo = class extends ou {
    constructor(e) {
      super(0), (this._string = null), (this._toString = Do({ output: [e, e] }));
    }
    static create(e) {
      return new Uo(e);
    }
    getValue() {
      const e = this._string;
      return e ?? (this._string = this._toString(this._value));
    }
    setValue(e) {
      if (L.str(e)) {
        if (e == this._string) return !1;
        (this._string = e), (this._value = 1);
      } else if (super.setValue(e)) this._string = null;
      else return !1;
      return !0;
    }
    reset(e) {
      e && (this._toString = Do({ output: [this.getValue(), e] })),
        (this._value = 0),
        super.reset();
    }
  },
  Gs = { dependencies: null },
  ql = class extends F_ {
    constructor(e) {
      super(), (this.source = e), this.setValue(e);
    }
    getValue(e) {
      const t = {};
      return (
        Tn(this.source, (n, r) => {
          i7(n) ? (t[r] = n.getValue(e)) : Wt(n) ? (t[r] = xt(n)) : e || (t[r] = n);
        }),
        t
      );
    }
    setValue(e) {
      (this.source = e), (this.payload = this._makePayload(e));
    }
    reset() {
      this.payload && Z(this.payload, (e) => e.reset());
    }
    _makePayload(e) {
      if (e) {
        const t = new Set();
        return Tn(e, this._addToPayload, t), Array.from(t);
      }
    }
    _addToPayload(e) {
      Gs.dependencies && Wt(e) && Gs.dependencies.add(e);
      const t = Wl(e);
      t && Z(t, (n) => this.add(n));
    }
  },
  D_ = class extends ql {
    constructor(e) {
      super(e);
    }
    static create(e) {
      return new D_(e);
    }
    getValue() {
      return this.source.map((e) => e.getValue());
    }
    setValue(e) {
      const t = this.getPayload();
      return e.length == t.length
        ? t.map((n, r) => n.setValue(e[r])).some(Boolean)
        : (super.setValue(e.map(a7)), !0);
    }
  };
function a7(e) {
  return (zl(e) ? Uo : ou).create(e);
}
function fh(e) {
  const t = bn(e);
  return t ? t.constructor : L.arr(e) ? D_ : zl(e) ? Uo : ou;
}
var o1 = (e, t) => {
    const n = !L.fun(e) || (e.prototype && e.prototype.isReactComponent);
    return A.forwardRef((r, i) => {
      const a = A.useRef(null),
        o =
          n &&
          A.useCallback(
            (g) => {
              a.current = s7(i, g);
            },
            [i],
          ),
        [u, s] = u7(r, t),
        l = V0(),
        f = () => {
          const g = a.current;
          if (n && !g) return;
          (g ? t.applyAnimatedValues(g, u.getValue(!0)) : !1) === !1 && l();
        },
        c = new o7(f, s),
        d = A.useRef();
      jr(
        () => (
          (d.current = c),
          Z(s, (g) => ha(g, c)),
          () => {
            d.current && (Z(d.current.deps, (g) => Lo(g, d.current)), ee.cancel(d.current.update));
          }
        ),
      ),
        A.useEffect(f, []),
        Q0(() => () => {
          const g = d.current;
          Z(g.deps, (y) => Lo(y, g));
        });
      const p = t.getComponentProps(u.getValue());
      return A.createElement(e, { ...p, ref: o });
    });
  },
  o7 = class {
    constructor(e, t) {
      (this.update = e), (this.deps = t);
    }
    eventObserved(e) {
      e.type == "change" && ee.write(this.update);
    }
  };
function u7(e, t) {
  const n = new Set();
  return (
    (Gs.dependencies = n),
    e.style && (e = { ...e, style: t.createAnimatedStyle(e.style) }),
    (e = new ql(e)),
    (Gs.dependencies = null),
    [e, n]
  );
}
function s7(e, t) {
  return e && (L.fun(e) ? e(t) : (e.current = t)), t;
}
var u1 = Symbol.for("AnimatedComponent"),
  l7 = (
    e,
    {
      applyAnimatedValues: t = () => !1,
      createAnimatedStyle: n = (i) => new ql(i),
      getComponentProps: r = (i) => i,
    } = {},
  ) => {
    const i = { applyAnimatedValues: t, createAnimatedStyle: n, getComponentProps: r },
      a = (o) => {
        const u = s1(o) || "Anonymous";
        return (
          L.str(o) ? (o = a[o] || (a[o] = o1(o, i))) : (o = o[u1] || (o[u1] = o1(o, i))),
          (o.displayName = `Animated(${u})`),
          o
        );
      };
    return (
      Tn(e, (o, u) => {
        L.arr(e) && (u = s1(o)), (a[u] = a(o));
      }),
      { animated: a }
    );
  },
  s1 = (e) =>
    L.str(e) ? e : e && L.str(e.displayName) ? e.displayName : (L.fun(e) && e.name) || null;
function St(e, ...t) {
  return L.fun(e) ? e(...t) : e;
}
var po = (e, t) => e === !0 || !!(t && e && (L.fun(e) ? e(t) : mt(e).includes(t))),
  N_ = (e, t) => (L.obj(e) ? t && e[t] : e),
  I_ = (e, t) => (e.default === !0 ? e[t] : e.default ? e.default[t] : void 0),
  f7 = (e) => e,
  Hl = (e, t = f7) => {
    let n = c7;
    e.default && e.default !== !0 && ((e = e.default), (n = Object.keys(e)));
    const r = {};
    for (const i of n) {
      const a = t(e[i], i);
      L.und(a) || (r[i] = a);
    }
    return r;
  },
  c7 = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"],
  d7 = {
    config: 1,
    from: 1,
    to: 1,
    ref: 1,
    loop: 1,
    reset: 1,
    pause: 1,
    cancel: 1,
    reverse: 1,
    immediate: 1,
    default: 1,
    delay: 1,
    onProps: 1,
    onStart: 1,
    onChange: 1,
    onPause: 1,
    onResume: 1,
    onRest: 1,
    onResolve: 1,
    items: 1,
    trail: 1,
    sort: 1,
    expires: 1,
    initial: 1,
    enter: 1,
    update: 1,
    leave: 1,
    children: 1,
    onDestroyed: 1,
    keys: 1,
    callId: 1,
    parentId: 1,
  };
function h7(e) {
  const t = {};
  let n = 0;
  if (
    (Tn(e, (r, i) => {
      d7[i] || ((t[i] = r), n++);
    }),
    n)
  )
    return t;
}
function G0(e) {
  const t = h7(e);
  if (t) {
    const n = { to: t };
    return Tn(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return { ...e };
}
function zo(e) {
  return (
    (e = xt(e)),
    L.arr(e)
      ? e.map(zo)
      : zl(e)
        ? fn.createStringInterpolator({ range: [0, 1], output: [e, e] })(1)
        : e
  );
}
function L_(e) {
  for (const t in e) return !0;
  return !1;
}
function ch(e) {
  return L.fun(e) || (L.arr(e) && L.obj(e[0]));
}
function dh(e, t) {
  var n;
  (n = e.ref) == null || n.delete(e), t == null || t.delete(e);
}
function j_(e, t) {
  var n;
  t && e.ref !== t && ((n = e.ref) == null || n.delete(e), t.add(e), (e.ref = t));
}
var K0 = {
    default: { tension: 170, friction: 26 },
    gentle: { tension: 120, friction: 14 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 210, friction: 20 },
    slow: { tension: 280, friction: 60 },
    molasses: { tension: 280, friction: 120 },
  },
  hh = { ...K0.default, mass: 1, damping: 1, easing: qS.linear, clamp: !1 },
  p7 = class {
    constructor() {
      (this.velocity = 0), Object.assign(this, hh);
    }
  };
function m7(e, t, n) {
  n && ((n = { ...n }), l1(n, t), (t = { ...n, ...t })), l1(e, t), Object.assign(e, t);
  for (const o in hh) e[o] == null && (e[o] = hh[o]);
  let { frequency: r, damping: i } = e;
  const { mass: a } = e;
  return (
    L.und(r) ||
      (r < 0.01 && (r = 0.01),
      i < 0 && (i = 0),
      (e.tension = Math.pow((2 * Math.PI) / r, 2) * a),
      (e.friction = (4 * Math.PI * i * a) / r)),
    e
  );
}
function l1(e, t) {
  if (!L.und(t.decay)) e.duration = void 0;
  else {
    const n = !L.und(t.tension) || !L.und(t.friction);
    (n || !L.und(t.frequency) || !L.und(t.damping) || !L.und(t.mass)) &&
      ((e.duration = void 0), (e.decay = void 0)),
      n && (e.frequency = void 0);
  }
}
var f1 = [],
  v7 = class {
    constructor() {
      (this.changed = !1),
        (this.values = f1),
        (this.toValues = null),
        (this.fromValues = f1),
        (this.config = new p7()),
        (this.immediate = !1);
    }
  };
function U_(e, { key: t, props: n, defaultProps: r, state: i, actions: a }) {
  return new Promise((o, u) => {
    let s,
      l,
      f = po(n.cancel ?? (r == null ? void 0 : r.cancel), t);
    if (f) p();
    else {
      L.und(n.pause) || (i.paused = po(n.pause, t));
      let g = r == null ? void 0 : r.pause;
      g !== !0 && (g = i.paused || po(g, t)),
        (s = St(n.delay || 0, t)),
        g ? (i.resumeQueue.add(d), a.pause()) : (a.resume(), d());
    }
    function c() {
      i.resumeQueue.add(d), i.timeouts.delete(l), l.cancel(), (s = l.time - ee.now());
    }
    function d() {
      s > 0 && !fn.skipAnimation
        ? ((i.delayed = !0), (l = ee.setTimeout(p, s)), i.pauseQueue.add(c), i.timeouts.add(l))
        : p();
    }
    function p() {
      i.delayed && (i.delayed = !1),
        i.pauseQueue.delete(c),
        i.timeouts.delete(l),
        e <= (i.cancelId || 0) && (f = !0);
      try {
        a.start({ ...n, callId: e, cancel: f }, o);
      } catch (g) {
        u(g);
      }
    }
  });
}
var X0 = (e, t) =>
    t.length == 1
      ? t[0]
      : t.some((n) => n.cancelled)
        ? Hi(e.get())
        : t.every((n) => n.noop)
          ? z_(e.get())
          : rn(
              e.get(),
              t.every((n) => n.finished),
            ),
  z_ = (e) => ({ value: e, noop: !0, finished: !0, cancelled: !1 }),
  rn = (e, t, n = !1) => ({ value: e, finished: t, cancelled: n }),
  Hi = (e) => ({ value: e, cancelled: !0, finished: !1 });
function W_(e, t, n, r) {
  const { callId: i, parentId: a, onRest: o } = t,
    { asyncTo: u, promise: s } = n;
  return !a && e === u && !t.reset
    ? s
    : (n.promise = (async () => {
        (n.asyncId = i), (n.asyncTo = e);
        const l = Hl(t, (b, h) => (h === "onRest" ? void 0 : b));
        let f, c;
        const d = new Promise((b, h) => ((f = b), (c = h))),
          p = (b) => {
            const h = (i <= (n.cancelId || 0) && Hi(r)) || (i !== n.asyncId && rn(r, !1));
            if (h) throw ((b.result = h), c(b), b);
          },
          g = (b, h) => {
            const m = new c1(),
              v = new d1();
            return (async () => {
              if (fn.skipAnimation) throw (Wo(n), (v.result = rn(r, !1)), c(v), v);
              p(m);
              const _ = L.obj(b) ? { ...b } : { ...h, to: b };
              (_.parentId = i),
                Tn(l, (w, T) => {
                  L.und(_[T]) && (_[T] = w);
                });
              const S = await r.start(_);
              return (
                p(m),
                n.paused &&
                  (await new Promise((w) => {
                    n.resumeQueue.add(w);
                  })),
                S
              );
            })();
          };
        let y;
        if (fn.skipAnimation) return Wo(n), rn(r, !1);
        try {
          let b;
          L.arr(e)
            ? (b = (async (h) => {
                for (const m of h) await g(m);
              })(e))
            : (b = Promise.resolve(e(g, r.stop.bind(r)))),
            await Promise.all([b.then(f), d]),
            (y = rn(r.get(), !0, !1));
        } catch (b) {
          if (b instanceof c1) y = b.result;
          else if (b instanceof d1) y = b.result;
          else throw b;
        } finally {
          i == n.asyncId &&
            ((n.asyncId = a), (n.asyncTo = a ? u : void 0), (n.promise = a ? s : void 0));
        }
        return (
          L.fun(o) &&
            ee.batchedUpdates(() => {
              o(y, r, r.item);
            }),
          y
        );
      })());
}
function Wo(e, t) {
  co(e.timeouts, (n) => n.cancel()),
    e.pauseQueue.clear(),
    e.resumeQueue.clear(),
    (e.asyncId = e.asyncTo = e.promise = void 0),
    t && (e.cancelId = t);
}
var c1 = class extends Error {
    constructor() {
      super(
        "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.",
      );
    }
  },
  d1 = class extends Error {
    constructor() {
      super("SkipAnimationSignal");
    }
  },
  ph = (e) => e instanceof Z0,
  g7 = 1,
  Z0 = class extends M_ {
    constructor() {
      super(...arguments), (this.id = g7++), (this._priority = 0);
    }
    get priority() {
      return this._priority;
    }
    set priority(e) {
      this._priority != e && ((this._priority = e), this._onPriorityChange(e));
    }
    get() {
      const e = bn(this);
      return e && e.getValue();
    }
    to(...e) {
      return fn.to(this, e);
    }
    interpolate(...e) {
      return XS(), fn.to(this, e);
    }
    toJSON() {
      return this.get();
    }
    observerAdded(e) {
      e == 1 && this._attach();
    }
    observerRemoved(e) {
      e == 0 && this._detach();
    }
    _attach() {}
    _detach() {}
    _onChange(e, t = !1) {
      Io(this, { type: "change", parent: this, value: e, idle: t });
    }
    _onPriorityChange(e) {
      this.idle || Ll.sort(this), Io(this, { type: "priority", parent: this, priority: e });
    }
  },
  ei = Symbol.for("SpringPhase"),
  q_ = 1,
  H_ = 2,
  B_ = 4,
  Tc = (e) => (e[ei] & q_) > 0,
  tr = (e) => (e[ei] & H_) > 0,
  Ia = (e) => (e[ei] & B_) > 0,
  h1 = (e, t) => (t ? (e[ei] |= H_ | q_) : (e[ei] &= -3)),
  p1 = (e, t) => (t ? (e[ei] |= B_) : (e[ei] &= -5)),
  y7 = class extends Z0 {
    constructor(e, t) {
      if (
        (super(),
        (this.animation = new v7()),
        (this.defaultProps = {}),
        (this._state = {
          paused: !1,
          delayed: !1,
          pauseQueue: new Set(),
          resumeQueue: new Set(),
          timeouts: new Set(),
        }),
        (this._pendingCalls = new Set()),
        (this._lastCallId = 0),
        (this._lastToId = 0),
        (this._memoizedDuration = 0),
        !L.und(e) || !L.und(t))
      ) {
        const n = L.obj(e) ? { ...e } : { ...t, from: e };
        L.und(n.default) && (n.default = !0), this.start(n);
      }
    }
    get idle() {
      return !(tr(this) || this._state.asyncTo) || Ia(this);
    }
    get goal() {
      return xt(this.animation.to);
    }
    get velocity() {
      const e = bn(this);
      return e instanceof ou ? e.lastVelocity || 0 : e.getPayload().map((t) => t.lastVelocity || 0);
    }
    get hasAnimated() {
      return Tc(this);
    }
    get isAnimating() {
      return tr(this);
    }
    get isPaused() {
      return Ia(this);
    }
    get isDelayed() {
      return this._state.delayed;
    }
    advance(e) {
      let t = !0,
        n = !1;
      const r = this.animation;
      let { toValues: i } = r;
      const { config: a } = r,
        o = Wl(r.to);
      !o && Wt(r.to) && (i = mt(xt(r.to))),
        r.values.forEach((l, f) => {
          if (l.done) return;
          const c = l.constructor == Uo ? 1 : o ? o[f].lastPosition : i[f];
          let d = r.immediate,
            p = c;
          if (!d) {
            if (((p = l.lastPosition), a.tension <= 0)) {
              l.done = !0;
              return;
            }
            let g = (l.elapsedTime += e);
            const y = r.fromValues[f],
              b = l.v0 != null ? l.v0 : (l.v0 = L.arr(a.velocity) ? a.velocity[f] : a.velocity);
            let h;
            const m = a.precision || (y == c ? 0.005 : Math.min(1, Math.abs(c - y) * 0.001));
            if (L.und(a.duration))
              if (a.decay) {
                const v = a.decay === !0 ? 0.998 : a.decay,
                  _ = Math.exp(-(1 - v) * g);
                (p = y + (b / (1 - v)) * (1 - _)),
                  (d = Math.abs(l.lastPosition - p) <= m),
                  (h = b * _);
              } else {
                h = l.lastVelocity == null ? b : l.lastVelocity;
                const v = a.restVelocity || m / 10,
                  _ = a.clamp ? 0 : a.bounce,
                  S = !L.und(_),
                  w = y == c ? l.v0 > 0 : y < c;
                let T,
                  k = !1;
                const j = 1,
                  R = Math.ceil(e / j);
                for (
                  let E = 0;
                  E < R && ((T = Math.abs(h) > v), !(!T && ((d = Math.abs(c - p) <= m), d)));
                  ++E
                ) {
                  S && ((k = p == c || p > c == w), k && ((h = -h * _), (p = c)));
                  const q = -a.tension * 1e-6 * (p - c),
                    I = -a.friction * 0.001 * h,
                    F = (q + I) / a.mass;
                  (h = h + F * j), (p = p + h * j);
                }
              }
            else {
              let v = 1;
              a.duration > 0 &&
                (this._memoizedDuration !== a.duration &&
                  ((this._memoizedDuration = a.duration),
                  l.durationProgress > 0 &&
                    ((l.elapsedTime = a.duration * l.durationProgress), (g = l.elapsedTime += e))),
                (v = (a.progress || 0) + g / this._memoizedDuration),
                (v = v > 1 ? 1 : v < 0 ? 0 : v),
                (l.durationProgress = v)),
                (p = y + a.easing(v) * (c - y)),
                (h = (p - l.lastPosition) / e),
                (d = v == 1);
            }
            (l.lastVelocity = h),
              Number.isNaN(p) && (console.warn("Got NaN while animating:", this), (d = !0));
          }
          o && !o[f].done && (d = !1),
            d ? (l.done = !0) : (t = !1),
            l.setValue(p, a.round) && (n = !0);
        });
      const u = bn(this),
        s = u.getValue();
      if (t) {
        const l = xt(r.to);
        (s !== l || n) && !a.decay
          ? (u.setValue(l), this._onChange(l))
          : n && a.decay && this._onChange(s),
          this._stop();
      } else n && this._onChange(s);
    }
    set(e) {
      return (
        ee.batchedUpdates(() => {
          this._stop(), this._focus(e), this._set(e);
        }),
        this
      );
    }
    pause() {
      this._update({ pause: !0 });
    }
    resume() {
      this._update({ pause: !1 });
    }
    finish() {
      if (tr(this)) {
        const { to: e, config: t } = this.animation;
        ee.batchedUpdates(() => {
          this._onStart(), t.decay || this._set(e, !1), this._stop();
        });
      }
      return this;
    }
    update(e) {
      return (this.queue || (this.queue = [])).push(e), this;
    }
    start(e, t) {
      let n;
      return (
        L.und(e)
          ? ((n = this.queue || []), (this.queue = []))
          : (n = [L.obj(e) ? e : { ...t, to: e }]),
        Promise.all(n.map((r) => this._update(r))).then((r) => X0(this, r))
      );
    }
    stop(e) {
      const { to: t } = this.animation;
      return (
        this._focus(this.get()),
        Wo(this._state, e && this._lastCallId),
        ee.batchedUpdates(() => this._stop(t, e)),
        this
      );
    }
    reset() {
      this._update({ reset: !0 });
    }
    eventObserved(e) {
      e.type == "change" ? this._start() : e.type == "priority" && (this.priority = e.priority + 1);
    }
    _prepareNode(e) {
      const t = this.key || "";
      let { to: n, from: r } = e;
      (n = L.obj(n) ? n[t] : n),
        (n == null || ch(n)) && (n = void 0),
        (r = L.obj(r) ? r[t] : r),
        r == null && (r = void 0);
      const i = { to: n, from: r };
      return (
        Tc(this) ||
          (e.reverse && ([n, r] = [r, n]),
          (r = xt(r)),
          L.und(r) ? bn(this) || this._set(n) : this._set(r)),
        i
      );
    }
    _update({ ...e }, t) {
      const { key: n, defaultProps: r } = this;
      e.default &&
        Object.assign(
          r,
          Hl(e, (o, u) => (/^on/.test(u) ? N_(o, n) : o)),
        ),
        v1(this, e, "onProps"),
        ja(this, "onProps", e, this);
      const i = this._prepareNode(e);
      if (Object.isFrozen(this))
        throw Error(
          "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?",
        );
      const a = this._state;
      return U_(++this._lastCallId, {
        key: n,
        props: e,
        defaultProps: r,
        state: a,
        actions: {
          pause: () => {
            Ia(this) ||
              (p1(this, !0),
              eo(a.pauseQueue),
              ja(this, "onPause", rn(this, La(this, this.animation.to)), this));
          },
          resume: () => {
            Ia(this) &&
              (p1(this, !1),
              tr(this) && this._resume(),
              eo(a.resumeQueue),
              ja(this, "onResume", rn(this, La(this, this.animation.to)), this));
          },
          start: this._merge.bind(this, i),
        },
      }).then((o) => {
        if (e.loop && o.finished && !(t && o.noop)) {
          const u = V_(e);
          if (u) return this._update(u, !0);
        }
        return o;
      });
    }
    _merge(e, t, n) {
      if (t.cancel) return this.stop(!0), n(Hi(this));
      const r = !L.und(e.to),
        i = !L.und(e.from);
      if (r || i)
        if (t.callId > this._lastToId) this._lastToId = t.callId;
        else return n(Hi(this));
      const { key: a, defaultProps: o, animation: u } = this,
        { to: s, from: l } = u;
      let { to: f = s, from: c = l } = e;
      i && !r && (!t.default || L.und(f)) && (f = c), t.reverse && ([f, c] = [c, f]);
      const d = !En(c, l);
      d && (u.from = c), (c = xt(c));
      const p = !En(f, s);
      p && this._focus(f);
      const g = ch(t.to),
        { config: y } = u,
        { decay: b, velocity: h } = y;
      (r || i) && (y.velocity = 0),
        t.config && !g && m7(y, St(t.config, a), t.config !== o.config ? St(o.config, a) : void 0);
      let m = bn(this);
      if (!m || L.und(f)) return n(rn(this, !0));
      const v = L.und(t.reset) ? i && !t.default : !L.und(c) && po(t.reset, a),
        _ = v ? c : this.get(),
        S = zo(f),
        w = L.num(S) || L.arr(S) || zl(S),
        T = !g && (!w || po(o.immediate || t.immediate, a));
      if (p) {
        const E = fh(f);
        if (E !== m.constructor)
          if (T) m = this._set(S);
          else
            throw Error(
              `Cannot animate between ${m.constructor.name} and ${E.name}, as the "to" prop suggests`,
            );
      }
      const k = m.constructor;
      let j = Wt(f),
        R = !1;
      if (!j) {
        const E = v || (!Tc(this) && d);
        (p || E) && ((R = En(zo(_), S)), (j = !R)),
          ((!En(u.immediate, T) && !T) || !En(y.decay, b) || !En(y.velocity, h)) && (j = !0);
      }
      if (
        (R && tr(this) && (u.changed && !v ? (j = !0) : j || this._stop(s)),
        !g &&
          ((j || Wt(s)) &&
            ((u.values = m.getPayload()), (u.toValues = Wt(f) ? null : k == Uo ? [1] : mt(S))),
          u.immediate != T && ((u.immediate = T), !T && !v && this._set(s)),
          j))
      ) {
        const { onRest: E } = u;
        Z(_7, (I) => v1(this, t, I));
        const q = rn(this, La(this, s));
        eo(this._pendingCalls, q),
          this._pendingCalls.add(n),
          u.changed &&
            ee.batchedUpdates(() => {
              var I;
              (u.changed = !v),
                E == null || E(q, this),
                v ? St(o.onRest, q) : (I = u.onStart) == null || I.call(u, q, this);
            });
      }
      v && this._set(_),
        g
          ? n(W_(t.to, t, this._state, this))
          : j
            ? this._start()
            : tr(this) && !p
              ? this._pendingCalls.add(n)
              : n(z_(_));
    }
    _focus(e) {
      const t = this.animation;
      e !== t.to && (i1(this) && this._detach(), (t.to = e), i1(this) && this._attach());
    }
    _attach() {
      let e = 0;
      const { to: t } = this.animation;
      Wt(t) && (ha(t, this), ph(t) && (e = t.priority + 1)), (this.priority = e);
    }
    _detach() {
      const { to: e } = this.animation;
      Wt(e) && Lo(e, this);
    }
    _set(e, t = !0) {
      const n = xt(e);
      if (!L.und(n)) {
        const r = bn(this);
        if (!r || !En(n, r.getValue())) {
          const i = fh(n);
          !r || r.constructor != i ? Y0(this, i.create(n)) : r.setValue(n),
            r &&
              ee.batchedUpdates(() => {
                this._onChange(n, t);
              });
        }
      }
      return bn(this);
    }
    _onStart() {
      const e = this.animation;
      e.changed || ((e.changed = !0), ja(this, "onStart", rn(this, La(this, e.to)), this));
    }
    _onChange(e, t) {
      t || (this._onStart(), St(this.animation.onChange, e, this)),
        St(this.defaultProps.onChange, e, this),
        super._onChange(e, t);
    }
    _start() {
      const e = this.animation;
      bn(this).reset(xt(e.to)),
        e.immediate || (e.fromValues = e.values.map((t) => t.lastPosition)),
        tr(this) || (h1(this, !0), Ia(this) || this._resume());
    }
    _resume() {
      fn.skipAnimation ? this.finish() : Ll.start(this);
    }
    _stop(e, t) {
      if (tr(this)) {
        h1(this, !1);
        const n = this.animation;
        Z(n.values, (i) => {
          i.done = !0;
        }),
          n.toValues && (n.onChange = n.onPause = n.onResume = void 0),
          Io(this, { type: "idle", parent: this });
        const r = t ? Hi(this.get()) : rn(this.get(), La(this, e ?? n.to));
        eo(this._pendingCalls, r), n.changed && ((n.changed = !1), ja(this, "onRest", r, this));
      }
    }
  };
function La(e, t) {
  const n = zo(t),
    r = zo(e.get());
  return En(r, n);
}
function V_(e, t = e.loop, n = e.to) {
  const r = St(t);
  if (r) {
    const i = r !== !0 && G0(r),
      a = (i || e).reverse,
      o = !i || i.reset;
    return qo({
      ...e,
      loop: t,
      default: !1,
      pause: void 0,
      to: !a || ch(n) ? n : void 0,
      from: o ? e.from : void 0,
      reset: o,
      ...i,
    });
  }
}
function qo(e) {
  const { to: t, from: n } = (e = G0(e)),
    r = new Set();
  return L.obj(t) && m1(t, r), L.obj(n) && m1(n, r), (e.keys = r.size ? Array.from(r) : null), e;
}
function b7(e) {
  const t = qo(e);
  return L.und(t.default) && (t.default = Hl(t)), t;
}
function m1(e, t) {
  Tn(e, (n, r) => n != null && t.add(r));
}
var _7 = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function v1(e, t, n) {
  e.animation[n] = t[n] !== I_(t, n) ? N_(t[n], e.key) : void 0;
}
function ja(e, t, ...n) {
  var r, i, a, o;
  (i = (r = e.animation)[t]) == null || i.call(r, ...n),
    (o = (a = e.defaultProps)[t]) == null || o.call(a, ...n);
}
var w7 = ["onStart", "onChange", "onRest"],
  x7 = 1,
  Q_ = class {
    constructor(e, t) {
      (this.id = x7++),
        (this.springs = {}),
        (this.queue = []),
        (this._lastAsyncId = 0),
        (this._active = new Set()),
        (this._changed = new Set()),
        (this._started = !1),
        (this._state = {
          paused: !1,
          pauseQueue: new Set(),
          resumeQueue: new Set(),
          timeouts: new Set(),
        }),
        (this._events = { onStart: new Map(), onChange: new Map(), onRest: new Map() }),
        (this._onFrame = this._onFrame.bind(this)),
        t && (this._flush = t),
        e && this.start({ default: !0, ...e });
    }
    get idle() {
      return (
        !this._state.asyncTo &&
        Object.values(this.springs).every((e) => e.idle && !e.isDelayed && !e.isPaused)
      );
    }
    get item() {
      return this._item;
    }
    set item(e) {
      this._item = e;
    }
    get() {
      const e = {};
      return this.each((t, n) => (e[n] = t.get())), e;
    }
    set(e) {
      for (const t in e) {
        const n = e[t];
        L.und(n) || this.springs[t].set(n);
      }
    }
    update(e) {
      return e && this.queue.push(qo(e)), this;
    }
    start(e) {
      let { queue: t } = this;
      return (
        e ? (t = mt(e).map(qo)) : (this.queue = []),
        this._flush ? this._flush(this, t) : (Z_(this, t), mh(this, t))
      );
    }
    stop(e, t) {
      if ((e !== !!e && (t = e), t)) {
        const n = this.springs;
        Z(mt(t), (r) => n[r].stop(!!e));
      } else Wo(this._state, this._lastAsyncId), this.each((n) => n.stop(!!e));
      return this;
    }
    pause(e) {
      if (L.und(e)) this.start({ pause: !0 });
      else {
        const t = this.springs;
        Z(mt(e), (n) => t[n].pause());
      }
      return this;
    }
    resume(e) {
      if (L.und(e)) this.start({ pause: !1 });
      else {
        const t = this.springs;
        Z(mt(e), (n) => t[n].resume());
      }
      return this;
    }
    each(e) {
      Tn(this.springs, e);
    }
    _onFrame() {
      const { onStart: e, onChange: t, onRest: n } = this._events,
        r = this._active.size > 0,
        i = this._changed.size > 0;
      ((r && !this._started) || (i && !this._started)) &&
        ((this._started = !0),
        co(e, ([u, s]) => {
          (s.value = this.get()), u(s, this, this._item);
        }));
      const a = !r && this._started,
        o = i || (a && n.size) ? this.get() : null;
      i &&
        t.size &&
        co(t, ([u, s]) => {
          (s.value = o), u(s, this, this._item);
        }),
        a &&
          ((this._started = !1),
          co(n, ([u, s]) => {
            (s.value = o), u(s, this, this._item);
          }));
    }
    eventObserved(e) {
      if (e.type == "change") this._changed.add(e.parent), e.idle || this._active.add(e.parent);
      else if (e.type == "idle") this._active.delete(e.parent);
      else return;
      ee.onFrame(this._onFrame);
    }
  };
function mh(e, t) {
  return Promise.all(t.map((n) => Y_(e, n))).then((n) => X0(e, n));
}
async function Y_(e, t, n) {
  const { keys: r, to: i, from: a, loop: o, onRest: u, onResolve: s } = t,
    l = L.obj(t.default) && t.default;
  o && (t.loop = !1), i === !1 && (t.to = null), a === !1 && (t.from = null);
  const f = L.arr(i) || L.fun(i) ? i : void 0;
  f
    ? ((t.to = void 0), (t.onRest = void 0), l && (l.onRest = void 0))
    : Z(w7, (y) => {
        const b = t[y];
        if (L.fun(b)) {
          const h = e._events[y];
          (t[y] = ({ finished: m, cancelled: v }) => {
            const _ = h.get(b);
            _
              ? (m || (_.finished = !1), v && (_.cancelled = !0))
              : h.set(b, { value: null, finished: m || !1, cancelled: v || !1 });
          }),
            l && (l[y] = t[y]);
        }
      });
  const c = e._state;
  t.pause === !c.paused
    ? ((c.paused = t.pause), eo(t.pause ? c.pauseQueue : c.resumeQueue))
    : c.paused && (t.pause = !0);
  const d = (r || Object.keys(e.springs)).map((y) => e.springs[y].start(t)),
    p = t.cancel === !0 || I_(t, "cancel") === !0;
  (f || (p && c.asyncId)) &&
    d.push(
      U_(++e._lastAsyncId, {
        props: t,
        state: c,
        actions: {
          pause: uh,
          resume: uh,
          start(y, b) {
            p ? (Wo(c, e._lastAsyncId), b(Hi(e))) : ((y.onRest = u), b(W_(f, y, c, e)));
          },
        },
      }),
    ),
    c.paused &&
      (await new Promise((y) => {
        c.resumeQueue.add(y);
      }));
  const g = X0(e, await Promise.all(d));
  if (o && g.finished && !(n && g.noop)) {
    const y = V_(t, o, i);
    if (y) return Z_(e, [y]), Y_(e, y, !0);
  }
  return s && ee.batchedUpdates(() => s(g, e, e.item)), g;
}
function vh(e, t) {
  const n = { ...e.springs };
  return (
    t &&
      Z(mt(t), (r) => {
        L.und(r.keys) && (r = qo(r)),
          L.obj(r.to) || (r = { ...r, to: void 0 }),
          X_(n, r, (i) => K_(i));
      }),
    G_(e, n),
    n
  );
}
function G_(e, t) {
  Tn(t, (n, r) => {
    e.springs[r] || ((e.springs[r] = n), ha(n, e));
  });
}
function K_(e, t) {
  const n = new y7();
  return (n.key = e), t && ha(n, t), n;
}
function X_(e, t, n) {
  t.keys &&
    Z(t.keys, (r) => {
      (e[r] || (e[r] = n(r)))._prepareNode(t);
    });
}
function Z_(e, t) {
  Z(t, (n) => {
    X_(e.springs, n, (r) => K_(r, e));
  });
}
var uu = ({ children: e, ...t }) => {
    const n = A.useContext(Ks),
      r = t.pause || !!n.pause,
      i = t.immediate || !!n.immediate;
    t = t7(() => ({ pause: r, immediate: i }), [r, i]);
    const { Provider: a } = Ks;
    return A.createElement(a, { value: t }, e);
  },
  Ks = S7(uu, {});
uu.Provider = Ks.Provider;
uu.Consumer = Ks.Consumer;
function S7(e, t) {
  return (
    Object.assign(e, A.createContext(t)), (e.Provider._context = e), (e.Consumer._context = e), e
  );
}
var J_ = () => {
  const e = [],
    t = function (r) {
      JS();
      const i = [];
      return (
        Z(e, (a, o) => {
          if (L.und(r)) i.push(a.start());
          else {
            const u = n(r, a, o);
            u && i.push(a.start(u));
          }
        }),
        i
      );
    };
  (t.current = e),
    (t.add = function (r) {
      e.includes(r) || e.push(r);
    }),
    (t.delete = function (r) {
      const i = e.indexOf(r);
      ~i && e.splice(i, 1);
    }),
    (t.pause = function () {
      return Z(e, (r) => r.pause(...arguments)), this;
    }),
    (t.resume = function () {
      return Z(e, (r) => r.resume(...arguments)), this;
    }),
    (t.set = function (r) {
      Z(e, (i, a) => {
        const o = L.fun(r) ? r(a, i) : r;
        o && i.set(o);
      });
    }),
    (t.start = function (r) {
      const i = [];
      return (
        Z(e, (a, o) => {
          if (L.und(r)) i.push(a.start());
          else {
            const u = this._getProps(r, a, o);
            u && i.push(a.start(u));
          }
        }),
        i
      );
    }),
    (t.stop = function () {
      return Z(e, (r) => r.stop(...arguments)), this;
    }),
    (t.update = function (r) {
      return Z(e, (i, a) => i.update(this._getProps(r, i, a))), this;
    });
  const n = function (r, i, a) {
    return L.fun(r) ? r(a, i) : r;
  };
  return (t._getProps = n), t;
};
function $7(e, t, n) {
  const r = L.fun(t) && t;
  r && !n && (n = []);
  const i = A.useMemo(() => (r || arguments.length == 3 ? J_() : void 0), []),
    a = A.useRef(0),
    o = V0(),
    u = A.useMemo(
      () => ({
        ctrls: [],
        queue: [],
        flush(h, m) {
          const v = vh(h, m);
          return a.current > 0 && !u.queue.length && !Object.keys(v).some((S) => !h.springs[S])
            ? mh(h, m)
            : new Promise((S) => {
                G_(h, v),
                  u.queue.push(() => {
                    S(mh(h, m));
                  }),
                  o();
              });
        },
      }),
      [],
    ),
    s = A.useRef([...u.ctrls]),
    l = [],
    f = lh(e) || 0;
  A.useMemo(() => {
    Z(s.current.slice(e, f), (h) => {
      dh(h, i), h.stop(!0);
    }),
      (s.current.length = e),
      c(f, e);
  }, [e]),
    A.useMemo(() => {
      c(0, Math.min(f, e));
    }, n);
  function c(h, m) {
    for (let v = h; v < m; v++) {
      const _ = s.current[v] || (s.current[v] = new Q_(null, u.flush)),
        S = r ? r(v, _) : t[v];
      S && (l[v] = b7(S));
    }
  }
  const d = s.current.map((h, m) => vh(h, l[m])),
    p = A.useContext(uu),
    g = lh(p),
    y = p !== g && L_(p);
  jr(() => {
    a.current++, (u.ctrls = s.current);
    const { queue: h } = u;
    h.length && ((u.queue = []), Z(h, (m) => m())),
      Z(s.current, (m, v) => {
        i == null || i.add(m), y && m.start({ default: p });
        const _ = l[v];
        _ && (j_(m, _.ref), m.ref ? m.queue.push(_) : m.start(_));
      });
  }),
    Q0(() => () => {
      Z(u.ctrls, (h) => h.stop(!0));
    });
  const b = d.map((h) => ({ ...h }));
  return i ? [b, i] : b;
}
function Bl(e, t) {
  const n = L.fun(e),
    [[r], i] = $7(1, n ? e : [e], n ? [] : t);
  return n || arguments.length == 2 ? [r, i] : r;
}
function ew(e, t, n) {
  const r = L.fun(t) && t,
    {
      reset: i,
      sort: a,
      trail: o = 0,
      expires: u = !0,
      exitBeforeEnter: s = !1,
      onDestroyed: l,
      ref: f,
      config: c,
    } = r ? r() : t,
    d = A.useMemo(() => (r || arguments.length == 3 ? J_() : void 0), []),
    p = mt(e),
    g = [],
    y = A.useRef(null),
    b = i ? null : y.current;
  jr(() => {
    y.current = g;
  }),
    Q0(
      () => (
        Z(g, (F) => {
          d == null || d.add(F.ctrl), (F.ctrl.ref = d);
        }),
        () => {
          Z(y.current, (F) => {
            F.expired && clearTimeout(F.expirationId), dh(F.ctrl, d), F.ctrl.stop(!0);
          });
        }
      ),
    );
  const h = C7(p, r ? r() : t, b),
    m = (i && y.current) || [];
  jr(() =>
    Z(m, ({ ctrl: F, item: D, key: z }) => {
      dh(F, d), St(l, D, z);
    }),
  );
  const v = [];
  if (
    (b &&
      Z(b, (F, D) => {
        F.expired
          ? (clearTimeout(F.expirationId), m.push(F))
          : ((D = v[D] = h.indexOf(F.key)), ~D && (g[D] = F));
      }),
    Z(p, (F, D) => {
      g[D] ||
        ((g[D] = { key: h[D], item: F, phase: "mount", ctrl: new Q_() }), (g[D].ctrl.item = F));
    }),
    v.length)
  ) {
    let F = -1;
    const { leave: D } = r ? r() : t;
    Z(v, (z, H) => {
      const P = b[H];
      ~z ? ((F = g.indexOf(P)), (g[F] = { ...P, item: p[z] })) : D && g.splice(++F, 0, P);
    });
  }
  L.fun(a) && g.sort((F, D) => a(F.item, D.item));
  let _ = -o;
  const S = V0(),
    w = Hl(t),
    T = new Map(),
    k = A.useRef(new Map()),
    j = A.useRef(!1);
  Z(g, (F, D) => {
    const z = F.key,
      H = F.phase,
      P = r ? r() : t;
    let O, W;
    const K = St(P.delay || 0, z);
    if (H == "mount") (O = P.enter), (W = "enter");
    else {
      const se = h.indexOf(z) < 0;
      if (H != "leave")
        if (se) (O = P.leave), (W = "leave");
        else if ((O = P.update)) W = "update";
        else return;
      else if (!se) (O = P.enter), (W = "enter");
      else return;
    }
    if (((O = St(O, F.item, D)), (O = L.obj(O) ? G0(O) : { to: O }), !O.config)) {
      const se = c || w.config;
      O.config = St(se, F.item, D, W);
    }
    _ += o;
    const X = { ...w, delay: K + _, ref: f, immediate: P.immediate, reset: !1, ...O };
    if (W == "enter" && L.und(X.from)) {
      const se = r ? r() : t,
        oe = L.und(se.initial) || b ? se.from : se.initial;
      X.from = St(oe, F.item, D);
    }
    const { onResolve: Oe } = X;
    X.onResolve = (se) => {
      St(Oe, se);
      const oe = y.current,
        te = oe.find((tt) => tt.key === z);
      if (te && !(se.cancelled && te.phase != "update") && te.ctrl.idle) {
        const tt = oe.every((M) => M.ctrl.idle);
        if (te.phase == "leave") {
          const M = St(u, te.item);
          if (M !== !1) {
            const N = M === !0 ? 0 : M;
            if (((te.expired = !0), !tt && N > 0)) {
              N <= 2147483647 && (te.expirationId = setTimeout(S, N));
              return;
            }
          }
        }
        tt && oe.some((M) => M.expired) && (k.current.delete(te), s && (j.current = !0), S());
      }
    };
    const ve = vh(F.ctrl, X);
    W === "leave" && s
      ? k.current.set(F, { phase: W, springs: ve, payload: X })
      : T.set(F, { phase: W, springs: ve, payload: X });
  });
  const R = A.useContext(uu),
    E = lh(R),
    q = R !== E && L_(R);
  jr(() => {
    q &&
      Z(g, (F) => {
        F.ctrl.start({ default: R });
      });
  }, [R]),
    Z(T, (F, D) => {
      if (k.current.size) {
        const z = g.findIndex((H) => H.key === D.key);
        g.splice(z, 1);
      }
    }),
    jr(
      () => {
        Z(k.current.size ? k.current : T, ({ phase: F, payload: D }, z) => {
          const { ctrl: H } = z;
          (z.phase = F),
            d == null || d.add(H),
            q && F == "enter" && H.start({ default: R }),
            D &&
              (j_(H, D.ref),
              (H.ref || d) && !j.current
                ? H.update(D)
                : (H.start(D), j.current && (j.current = !1)));
        });
      },
      i ? void 0 : n,
    );
  const I = (F) =>
    A.createElement(
      A.Fragment,
      null,
      g.map((D, z) => {
        const { springs: H } = T.get(D) || D.ctrl,
          P = F({ ...H }, D.item, D, z);
        return P && P.type
          ? A.createElement(P.type, {
              ...P.props,
              key: L.str(D.key) || L.num(D.key) ? D.key : D.ctrl.id,
              ref: P.ref,
            })
          : P;
      }),
    );
  return d ? [I, d] : I;
}
var T7 = 1;
function C7(e, { key: t, keys: n = t }, r) {
  if (n === null) {
    const i = new Set();
    return e.map((a) => {
      const o = r && r.find((u) => u.item === a && u.phase !== "leave" && !i.has(u));
      return o ? (i.add(o), o.key) : T7++;
    });
  }
  return L.und(n) ? e : L.fun(n) ? e.map(n) : mt(n);
}
var tw = class extends Z0 {
  constructor(e, t) {
    super(),
      (this.source = e),
      (this.idle = !0),
      (this._active = new Set()),
      (this.calc = Do(...t));
    const n = this._get(),
      r = fh(n);
    Y0(this, r.create(n));
  }
  advance(e) {
    const t = this._get(),
      n = this.get();
    En(t, n) || (bn(this).setValue(t), this._onChange(t, this.idle)),
      !this.idle && g1(this._active) && Cc(this);
  }
  _get() {
    const e = L.arr(this.source) ? this.source.map(xt) : mt(xt(this.source));
    return this.calc(...e);
  }
  _start() {
    this.idle &&
      !g1(this._active) &&
      ((this.idle = !1),
      Z(Wl(this), (e) => {
        e.done = !1;
      }),
      fn.skipAnimation ? (ee.batchedUpdates(() => this.advance()), Cc(this)) : Ll.start(this));
  }
  _attach() {
    let e = 1;
    Z(mt(this.source), (t) => {
      Wt(t) && ha(t, this),
        ph(t) && (t.idle || this._active.add(t), (e = Math.max(e, t.priority + 1)));
    }),
      (this.priority = e),
      this._start();
  }
  _detach() {
    Z(mt(this.source), (e) => {
      Wt(e) && Lo(e, this);
    }),
      this._active.clear(),
      Cc(this);
  }
  eventObserved(e) {
    e.type == "change"
      ? e.idle
        ? this.advance()
        : (this._active.add(e.parent), this._start())
      : e.type == "idle"
        ? this._active.delete(e.parent)
        : e.type == "priority" &&
          (this.priority = mt(this.source).reduce(
            (t, n) => Math.max(t, (ph(n) ? n.priority : 0) + 1),
            0,
          ));
  }
};
function k7(e) {
  return e.idle !== !1;
}
function g1(e) {
  return !e.size || Array.from(e).every(k7);
}
function Cc(e) {
  e.idle ||
    ((e.idle = !0),
    Z(Wl(e), (t) => {
      t.done = !0;
    }),
    Io(e, { type: "idle", parent: e }));
}
var y1 = (e, ...t) => new tw(e, t);
fn.assign({ createStringInterpolator: A_, to: (e, t) => new tw(e, t) });
var nw = /^--/;
function O7(e, t) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : typeof t == "number" && t !== 0 && !nw.test(e) && !(mo.hasOwnProperty(e) && mo[e])
      ? t + "px"
      : ("" + t).trim();
}
var b1 = {};
function M7(e, t) {
  if (!e.nodeType || !e.setAttribute) return !1;
  const n = e.nodeName === "filter" || (e.parentNode && e.parentNode.nodeName === "filter"),
    { className: r, style: i, children: a, scrollTop: o, scrollLeft: u, viewBox: s, ...l } = t,
    f = Object.values(l),
    c = Object.keys(l).map((d) =>
      n || e.hasAttribute(d)
        ? d
        : b1[d] || (b1[d] = d.replace(/([A-Z])/g, (p) => "-" + p.toLowerCase())),
    );
  a !== void 0 && (e.textContent = a);
  for (const d in i)
    if (i.hasOwnProperty(d)) {
      const p = O7(d, i[d]);
      nw.test(d) ? e.style.setProperty(d, p) : (e.style[d] = p);
    }
  c.forEach((d, p) => {
    e.setAttribute(d, f[p]);
  }),
    r !== void 0 && (e.className = r),
    o !== void 0 && (e.scrollTop = o),
    u !== void 0 && (e.scrollLeft = u),
    s !== void 0 && e.setAttribute("viewBox", s);
}
var mo = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  P7 = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1),
  E7 = ["Webkit", "Ms", "Moz", "O"];
mo = Object.keys(mo).reduce((e, t) => (E7.forEach((n) => (e[P7(n, t)] = e[t])), e), mo);
var A7 = /^(matrix|translate|scale|rotate|skew)/,
  R7 = /^(translate)/,
  F7 = /^(rotate|skew)/,
  kc = (e, t) => (L.num(e) && e !== 0 ? e + t : e),
  cs = (e, t) => (L.arr(e) ? e.every((n) => cs(n, t)) : L.num(e) ? e === t : parseFloat(e) === t),
  D7 = class extends ql {
    constructor({ x: e, y: t, z: n, ...r }) {
      const i = [],
        a = [];
      (e || t || n) &&
        (i.push([e || 0, t || 0, n || 0]),
        a.push((o) => [`translate3d(${o.map((u) => kc(u, "px")).join(",")})`, cs(o, 0)])),
        Tn(r, (o, u) => {
          if (u === "transform") i.push([o || ""]), a.push((s) => [s, s === ""]);
          else if (A7.test(u)) {
            if ((delete r[u], L.und(o))) return;
            const s = R7.test(u) ? "px" : F7.test(u) ? "deg" : "";
            i.push(mt(o)),
              a.push(
                u === "rotate3d"
                  ? ([l, f, c, d]) => [`rotate3d(${l},${f},${c},${kc(d, s)})`, cs(d, 0)]
                  : (l) => [
                      `${u}(${l.map((f) => kc(f, s)).join(",")})`,
                      cs(l, u.startsWith("scale") ? 1 : 0),
                    ],
              );
          }
        }),
        i.length && (r.transform = new N7(i, a)),
        super(r);
    }
  },
  N7 = class extends M_ {
    constructor(e, t) {
      super(), (this.inputs = e), (this.transforms = t), (this._value = null);
    }
    get() {
      return this._value || (this._value = this._get());
    }
    _get() {
      let e = "",
        t = !0;
      return (
        Z(this.inputs, (n, r) => {
          const i = xt(n[0]),
            [a, o] = this.transforms[r](L.arr(i) ? i : n.map(xt));
          (e += " " + a), (t = t && o);
        }),
        t ? "none" : e
      );
    }
    observerAdded(e) {
      e == 1 && Z(this.inputs, (t) => Z(t, (n) => Wt(n) && ha(n, this)));
    }
    observerRemoved(e) {
      e == 0 && Z(this.inputs, (t) => Z(t, (n) => Wt(n) && Lo(n, this)));
    }
    eventObserved(e) {
      e.type == "change" && (this._value = null), Io(this, e);
    }
  },
  I7 = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan",
  ];
fn.assign({ batchedUpdates: K2.unstable_batchedUpdates, createStringInterpolator: A_, colors: ES });
var L7 = l7(I7, {
    applyAnimatedValues: M7,
    createAnimatedStyle: (e) => new D7(e),
    getComponentProps: ({ scrollTop: e, scrollLeft: t, ...n }) => n,
  }),
  Qt = L7.animated;
function ti() {
  return (
    (ti = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    ti.apply(this, arguments)
  );
}
var j7 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 },
  _1 = function (e, t) {
    return "translate(" + e + "px, " + t + "px)";
  },
  rw = A.memo(function (e) {
    var t,
      n = e.position,
      r = e.anchor,
      i = e.children,
      a = Xt(),
      o = pu(),
      u = o.animate,
      s = o.config,
      l = Wx(),
      f = l[0],
      c = l[1],
      d = A.useRef(!1),
      p = void 0,
      g = !1,
      y = c.width > 0 && c.height > 0,
      b = Math.round(n[0]),
      h = Math.round(n[1]);
    y &&
      (r === "top"
        ? ((b -= c.width / 2), (h -= c.height + 14))
        : r === "right"
          ? ((b += 14), (h -= c.height / 2))
          : r === "bottom"
            ? ((b -= c.width / 2), (h += 14))
            : r === "left"
              ? ((b -= c.width + 14), (h -= c.height / 2))
              : r === "center" && ((b -= c.width / 2), (h -= c.height / 2)),
      (p = { transform: _1(b, h) }),
      d.current || (g = !0),
      (d.current = [b, h]));
    var m = Bl({ to: p, config: s, immediate: !u || g }),
      v = ti({}, j7, a.tooltip.wrapper, {
        transform: (t = m.transform) != null ? t : _1(b, h),
        opacity: m.transform ? 1 : 0,
      });
    return B.jsx(Qt.div, { ref: f, style: v, children: i });
  });
rw.displayName = "TooltipWrapper";
var U7 = A.memo(function (e) {
    var t = e.size,
      n = t === void 0 ? 12 : t,
      r = e.color,
      i = e.style;
    return B.jsx("span", {
      style: ti({ display: "block", width: n, height: n, background: r }, i === void 0 ? {} : i),
    });
  }),
  z7 = A.memo(function (e) {
    var t,
      n = e.id,
      r = e.value,
      i = e.format,
      a = e.enableChip,
      o = a !== void 0 && a,
      u = e.color,
      s = e.renderContent,
      l = Xt(),
      f = Yp(i);
    if (typeof s == "function") t = s();
    else {
      var c = r;
      f !== void 0 && c !== void 0 && (c = f(c)),
        (t = B.jsxs("div", {
          style: l.tooltip.basic,
          children: [
            o && B.jsx(U7, { color: u, style: l.tooltip.chip }),
            c !== void 0
              ? B.jsxs("span", { children: [n, ": ", B.jsx("strong", { children: "" + c })] })
              : n,
          ],
        }));
    }
    return B.jsx("div", { style: l.tooltip.container, children: t });
  }),
  W7 = { width: "100%", borderCollapse: "collapse" },
  q7 = A.memo(function (e) {
    var t,
      n = e.title,
      r = e.rows,
      i = r === void 0 ? [] : r,
      a = e.renderContent,
      o = Xt();
    return i.length
      ? ((t =
          typeof a == "function"
            ? a()
            : B.jsxs("div", {
                children: [
                  n && n,
                  B.jsx("table", {
                    style: ti({}, W7, o.tooltip.table),
                    children: B.jsx("tbody", {
                      children: i.map(function (u, s) {
                        return B.jsx(
                          "tr",
                          {
                            children: u.map(function (l, f) {
                              return B.jsx("td", { style: o.tooltip.tableCell, children: l }, f);
                            }),
                          },
                          s,
                        );
                      }),
                    }),
                  }),
                ],
              })),
        B.jsx("div", { style: o.tooltip.container, children: t }))
      : null;
  });
q7.displayName = "TableTooltip";
var gh = A.memo(function (e) {
  var t = e.x0,
    n = e.x1,
    r = e.y0,
    i = e.y1,
    a = Xt(),
    o = pu(),
    u = o.animate,
    s = o.config,
    l = A.useMemo(
      function () {
        return ti({}, a.crosshair.line, { pointerEvents: "none" });
      },
      [a.crosshair.line],
    ),
    f = Bl({ x1: t, x2: n, y1: r, y2: i, config: s, immediate: !u });
  return B.jsx(Qt.line, ti({}, f, { fill: "none", style: l }));
});
gh.displayName = "CrosshairLine";
var H7 = A.memo(function (e) {
  var t,
    n,
    r = e.width,
    i = e.height,
    a = e.type,
    o = e.x,
    u = e.y;
  return (
    a === "cross"
      ? ((t = { x0: o, x1: o, y0: 0, y1: i }), (n = { x0: 0, x1: r, y0: u, y1: u }))
      : a === "top-left"
        ? ((t = { x0: o, x1: o, y0: 0, y1: u }), (n = { x0: 0, x1: o, y0: u, y1: u }))
        : a === "top"
          ? (t = { x0: o, x1: o, y0: 0, y1: u })
          : a === "top-right"
            ? ((t = { x0: o, x1: o, y0: 0, y1: u }), (n = { x0: o, x1: r, y0: u, y1: u }))
            : a === "right"
              ? (n = { x0: o, x1: r, y0: u, y1: u })
              : a === "bottom-right"
                ? ((t = { x0: o, x1: o, y0: u, y1: i }), (n = { x0: o, x1: r, y0: u, y1: u }))
                : a === "bottom"
                  ? (t = { x0: o, x1: o, y0: u, y1: i })
                  : a === "bottom-left"
                    ? ((t = { x0: o, x1: o, y0: u, y1: i }), (n = { x0: 0, x1: o, y0: u, y1: u }))
                    : a === "left"
                      ? (n = { x0: 0, x1: o, y0: u, y1: u })
                      : a === "x"
                        ? (t = { x0: o, x1: o, y0: 0, y1: i })
                        : a === "y" && (n = { x0: 0, x1: r, y0: u, y1: u }),
    B.jsxs(B.Fragment, {
      children: [
        t && B.jsx(gh, { x0: t.x0, x1: t.x1, y0: t.y0, y1: t.y1 }),
        n && B.jsx(gh, { x0: n.x0, x1: n.x1, y0: n.y0, y1: n.y1 }),
      ],
    })
  );
});
H7.displayName = "Crosshair";
var iw = A.createContext({
    showTooltipAt: function () {},
    showTooltipFromEvent: function () {},
    hideTooltip: function () {},
  }),
  yh = { isVisible: !1, position: [null, null], content: null, anchor: null },
  aw = A.createContext(yh),
  B7 = function (e) {
    var t = A.useState(yh),
      n = t[0],
      r = t[1],
      i = A.useCallback(
        function (u, s, l) {
          var f = s[0],
            c = s[1];
          l === void 0 && (l = "top"),
            r({ isVisible: !0, position: [f, c], anchor: l, content: u });
        },
        [r],
      ),
      a = A.useCallback(
        function (u, s, l) {
          l === void 0 && (l = "top");
          var f = e.current.getBoundingClientRect(),
            c = e.current.offsetWidth,
            d = c === f.width ? 1 : c / f.width,
            p = "touches" in s ? s.touches[0] : s,
            g = p.clientX,
            y = p.clientY,
            b = (g - f.left) * d,
            h = (y - f.top) * d;
          (l !== "left" && l !== "right") || (l = b < f.width / 2 ? "right" : "left"),
            r({ isVisible: !0, position: [b, h], anchor: l, content: u });
        },
        [e, r],
      ),
      o = A.useCallback(
        function () {
          r(yh);
        },
        [r],
      );
    return {
      actions: A.useMemo(
        function () {
          return { showTooltipAt: i, showTooltipFromEvent: a, hideTooltip: o };
        },
        [i, a, o],
      ),
      state: n,
    };
  },
  ow = function () {
    var e = A.useContext(iw);
    if (e === void 0) throw new Error("useTooltip must be used within a TooltipProvider");
    return e;
  },
  V7 = function () {
    var e = A.useContext(aw);
    if (e === void 0) throw new Error("useTooltipState must be used within a TooltipProvider");
    return e;
  },
  Q7 = function (e) {
    return e.isVisible;
  },
  Y7 = function () {
    var e = V7();
    return Q7(e)
      ? B.jsx(rw, { position: e.position, anchor: e.anchor, children: e.content })
      : null;
  },
  G7 = function (e) {
    var t = e.container,
      n = e.children,
      r = B7(t),
      i = r.actions,
      a = r.state;
    return B.jsx(iw.Provider, {
      value: i,
      children: B.jsx(aw.Provider, { value: a, children: n }),
    });
  };
function K7() {
  (this.__data__ = []), (this.size = 0);
}
var X7 = K7;
function Z7(e, t) {
  return e === t || (e !== e && t !== t);
}
var su = Z7,
  J7 = su;
function e$(e, t) {
  for (var n = e.length; n--; ) if (J7(e[n][0], t)) return n;
  return -1;
}
var Vl = e$,
  t$ = Vl,
  n$ = Array.prototype,
  r$ = n$.splice;
function i$(e) {
  var t = this.__data__,
    n = t$(t, e);
  if (n < 0) return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : r$.call(t, n, 1), --this.size, !0;
}
var a$ = i$,
  o$ = Vl;
function u$(e) {
  var t = this.__data__,
    n = o$(t, e);
  return n < 0 ? void 0 : t[n][1];
}
var s$ = u$,
  l$ = Vl;
function f$(e) {
  return l$(this.__data__, e) > -1;
}
var c$ = f$,
  d$ = Vl;
function h$(e, t) {
  var n = this.__data__,
    r = d$(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : (n[r][1] = t), this;
}
var p$ = h$,
  m$ = X7,
  v$ = a$,
  g$ = s$,
  y$ = c$,
  b$ = p$;
function pa(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
pa.prototype.clear = m$;
pa.prototype.delete = v$;
pa.prototype.get = g$;
pa.prototype.has = y$;
pa.prototype.set = b$;
var Ql = pa,
  _$ = Ql;
function w$() {
  (this.__data__ = new _$()), (this.size = 0);
}
var x$ = w$;
function S$(e) {
  var t = this.__data__,
    n = t.delete(e);
  return (this.size = t.size), n;
}
var $$ = S$;
function T$(e) {
  return this.__data__.get(e);
}
var C$ = T$;
function k$(e) {
  return this.__data__.has(e);
}
var O$ = k$,
  M$ = typeof wu == "object" && wu && wu.Object === Object && wu,
  uw = M$,
  P$ = uw,
  E$ = typeof self == "object" && self && self.Object === Object && self,
  A$ = P$ || E$ || Function("return this")(),
  kn = A$,
  R$ = kn,
  F$ = R$.Symbol,
  ma = F$,
  w1 = ma,
  sw = Object.prototype,
  D$ = sw.hasOwnProperty,
  N$ = sw.toString,
  Ua = w1 ? w1.toStringTag : void 0;
function I$(e) {
  var t = D$.call(e, Ua),
    n = e[Ua];
  try {
    e[Ua] = void 0;
    var r = !0;
  } catch {}
  var i = N$.call(e);
  return r && (t ? (e[Ua] = n) : delete e[Ua]), i;
}
var L$ = I$,
  j$ = Object.prototype,
  U$ = j$.toString;
function z$(e) {
  return U$.call(e);
}
var W$ = z$,
  x1 = ma,
  q$ = L$,
  H$ = W$,
  B$ = "[object Null]",
  V$ = "[object Undefined]",
  S1 = x1 ? x1.toStringTag : void 0;
function Q$(e) {
  return e == null ? (e === void 0 ? V$ : B$) : S1 && S1 in Object(e) ? q$(e) : H$(e);
}
var kr = Q$;
function Y$(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var On = Y$,
  G$ = kr,
  K$ = On,
  X$ = "[object AsyncFunction]",
  Z$ = "[object Function]",
  J$ = "[object GeneratorFunction]",
  e9 = "[object Proxy]";
function t9(e) {
  if (!K$(e)) return !1;
  var t = G$(e);
  return t == Z$ || t == J$ || t == X$ || t == e9;
}
var Yl = t9;
const n9 = gt(Yl);
var r9 = kn,
  i9 = r9["__core-js_shared__"],
  a9 = i9,
  Oc = a9,
  $1 = (function () {
    var e = /[^.]+$/.exec((Oc && Oc.keys && Oc.keys.IE_PROTO) || "");
    return e ? "Symbol(src)_1." + e : "";
  })();
function o9(e) {
  return !!$1 && $1 in e;
}
var u9 = o9,
  s9 = Function.prototype,
  l9 = s9.toString;
function f9(e) {
  if (e != null) {
    try {
      return l9.call(e);
    } catch {}
    try {
      return e + "";
    } catch {}
  }
  return "";
}
var lw = f9,
  c9 = Yl,
  d9 = u9,
  h9 = On,
  p9 = lw,
  m9 = /[\\^$.*+?()[\]{}|]/g,
  v9 = /^\[object .+?Constructor\]$/,
  g9 = Function.prototype,
  y9 = Object.prototype,
  b9 = g9.toString,
  _9 = y9.hasOwnProperty,
  w9 = RegExp(
    "^" +
      b9
        .call(_9)
        .replace(m9, "\\$&")
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
      "$",
  );
function x9(e) {
  if (!h9(e) || d9(e)) return !1;
  var t = c9(e) ? w9 : v9;
  return t.test(p9(e));
}
var S9 = x9;
function $9(e, t) {
  return e == null ? void 0 : e[t];
}
var T9 = $9,
  C9 = S9,
  k9 = T9;
function O9(e, t) {
  var n = k9(e, t);
  return C9(n) ? n : void 0;
}
var ui = O9,
  M9 = ui,
  P9 = kn,
  E9 = M9(P9, "Map"),
  J0 = E9,
  A9 = ui,
  R9 = A9(Object, "create"),
  Gl = R9,
  T1 = Gl;
function F9() {
  (this.__data__ = T1 ? T1(null) : {}), (this.size = 0);
}
var D9 = F9;
function N9(e) {
  var t = this.has(e) && delete this.__data__[e];
  return (this.size -= t ? 1 : 0), t;
}
var I9 = N9,
  L9 = Gl,
  j9 = "__lodash_hash_undefined__",
  U9 = Object.prototype,
  z9 = U9.hasOwnProperty;
function W9(e) {
  var t = this.__data__;
  if (L9) {
    var n = t[e];
    return n === j9 ? void 0 : n;
  }
  return z9.call(t, e) ? t[e] : void 0;
}
var q9 = W9,
  H9 = Gl,
  B9 = Object.prototype,
  V9 = B9.hasOwnProperty;
function Q9(e) {
  var t = this.__data__;
  return H9 ? t[e] !== void 0 : V9.call(t, e);
}
var Y9 = Q9,
  G9 = Gl,
  K9 = "__lodash_hash_undefined__";
function X9(e, t) {
  var n = this.__data__;
  return (this.size += this.has(e) ? 0 : 1), (n[e] = G9 && t === void 0 ? K9 : t), this;
}
var Z9 = X9,
  J9 = D9,
  eT = I9,
  tT = q9,
  nT = Y9,
  rT = Z9;
function va(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
va.prototype.clear = J9;
va.prototype.delete = eT;
va.prototype.get = tT;
va.prototype.has = nT;
va.prototype.set = rT;
var iT = va,
  C1 = iT,
  aT = Ql,
  oT = J0;
function uT() {
  (this.size = 0), (this.__data__ = { hash: new C1(), map: new (oT || aT)(), string: new C1() });
}
var sT = uT;
function lT(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean"
    ? e !== "__proto__"
    : e === null;
}
var fT = lT,
  cT = fT;
function dT(e, t) {
  var n = e.__data__;
  return cT(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
var Kl = dT,
  hT = Kl;
function pT(e) {
  var t = hT(this, e).delete(e);
  return (this.size -= t ? 1 : 0), t;
}
var mT = pT,
  vT = Kl;
function gT(e) {
  return vT(this, e).get(e);
}
var yT = gT,
  bT = Kl;
function _T(e) {
  return bT(this, e).has(e);
}
var wT = _T,
  xT = Kl;
function ST(e, t) {
  var n = xT(this, e),
    r = n.size;
  return n.set(e, t), (this.size += n.size == r ? 0 : 1), this;
}
var $T = ST,
  TT = sT,
  CT = mT,
  kT = yT,
  OT = wT,
  MT = $T;
function ga(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
ga.prototype.clear = TT;
ga.prototype.delete = CT;
ga.prototype.get = kT;
ga.prototype.has = OT;
ga.prototype.set = MT;
var ep = ga,
  PT = Ql,
  ET = J0,
  AT = ep,
  RT = 200;
function FT(e, t) {
  var n = this.__data__;
  if (n instanceof PT) {
    var r = n.__data__;
    if (!ET || r.length < RT - 1) return r.push([e, t]), (this.size = ++n.size), this;
    n = this.__data__ = new AT(r);
  }
  return n.set(e, t), (this.size = n.size), this;
}
var DT = FT,
  NT = Ql,
  IT = x$,
  LT = $$,
  jT = C$,
  UT = O$,
  zT = DT;
function ya(e) {
  var t = (this.__data__ = new NT(e));
  this.size = t.size;
}
ya.prototype.clear = IT;
ya.prototype.delete = LT;
ya.prototype.get = jT;
ya.prototype.has = UT;
ya.prototype.set = zT;
var Xl = ya,
  WT = ui,
  qT = (function () {
    try {
      var e = WT(Object, "defineProperty");
      return e({}, "", {}), e;
    } catch {}
  })(),
  fw = qT,
  k1 = fw;
function HT(e, t, n) {
  t == "__proto__" && k1
    ? k1(e, t, { configurable: !0, enumerable: !0, value: n, writable: !0 })
    : (e[t] = n);
}
var tp = HT,
  BT = tp,
  VT = su;
function QT(e, t, n) {
  ((n !== void 0 && !VT(e[t], n)) || (n === void 0 && !(t in e))) && BT(e, t, n);
}
var cw = QT;
function YT(e) {
  return function (t, n, r) {
    for (var i = -1, a = Object(t), o = r(t), u = o.length; u--; ) {
      var s = o[e ? u : ++i];
      if (n(a[s], s, a) === !1) break;
    }
    return t;
  };
}
var GT = YT,
  KT = GT,
  XT = KT(),
  dw = XT,
  Xs = { exports: {} };
Xs.exports;
(function (e, t) {
  var n = kn,
    r = t && !t.nodeType && t,
    i = r && !0 && e && !e.nodeType && e,
    a = i && i.exports === r,
    o = a ? n.Buffer : void 0,
    u = o ? o.allocUnsafe : void 0;
  function s(l, f) {
    if (f) return l.slice();
    var c = l.length,
      d = u ? u(c) : new l.constructor(c);
    return l.copy(d), d;
  }
  e.exports = s;
})(Xs, Xs.exports);
var hw = Xs.exports,
  ZT = kn,
  JT = ZT.Uint8Array,
  pw = JT,
  O1 = pw;
function eC(e) {
  var t = new e.constructor(e.byteLength);
  return new O1(t).set(new O1(e)), t;
}
var np = eC,
  tC = np;
function nC(e, t) {
  var n = t ? tC(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var mw = nC;
function rC(e, t) {
  var n = -1,
    r = e.length;
  for (t || (t = Array(r)); ++n < r; ) t[n] = e[n];
  return t;
}
var vw = rC,
  iC = On,
  M1 = Object.create,
  aC = (function () {
    function e() {}
    return function (t) {
      if (!iC(t)) return {};
      if (M1) return M1(t);
      e.prototype = t;
      var n = new e();
      return (e.prototype = void 0), n;
    };
  })(),
  oC = aC;
function uC(e, t) {
  return function (n) {
    return e(t(n));
  };
}
var gw = uC,
  sC = gw,
  lC = sC(Object.getPrototypeOf, Object),
  rp = lC,
  fC = Object.prototype;
function cC(e) {
  var t = e && e.constructor,
    n = (typeof t == "function" && t.prototype) || fC;
  return e === n;
}
var ip = cC,
  dC = oC,
  hC = rp,
  pC = ip;
function mC(e) {
  return typeof e.constructor == "function" && !pC(e) ? dC(hC(e)) : {};
}
var yw = mC;
function vC(e) {
  return e != null && typeof e == "object";
}
var cn = vC,
  gC = kr,
  yC = cn,
  bC = "[object Arguments]";
function _C(e) {
  return yC(e) && gC(e) == bC;
}
var wC = _C,
  P1 = wC,
  xC = cn,
  bw = Object.prototype,
  SC = bw.hasOwnProperty,
  $C = bw.propertyIsEnumerable,
  TC = P1(
    (function () {
      return arguments;
    })(),
  )
    ? P1
    : function (e) {
        return xC(e) && SC.call(e, "callee") && !$C.call(e, "callee");
      },
  Zl = TC,
  CC = Array.isArray,
  Mt = CC,
  kC = 9007199254740991;
function OC(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= kC;
}
var ap = OC,
  MC = Yl,
  PC = ap;
function EC(e) {
  return e != null && PC(e.length) && !MC(e);
}
var ba = EC,
  AC = ba,
  RC = cn;
function FC(e) {
  return RC(e) && AC(e);
}
var _w = FC,
  Zs = { exports: {} };
function DC() {
  return !1;
}
var NC = DC;
Zs.exports;
(function (e, t) {
  var n = kn,
    r = NC,
    i = t && !t.nodeType && t,
    a = i && !0 && e && !e.nodeType && e,
    o = a && a.exports === i,
    u = o ? n.Buffer : void 0,
    s = u ? u.isBuffer : void 0,
    l = s || r;
  e.exports = l;
})(Zs, Zs.exports);
var Jl = Zs.exports,
  IC = kr,
  LC = rp,
  jC = cn,
  UC = "[object Object]",
  zC = Function.prototype,
  WC = Object.prototype,
  ww = zC.toString,
  qC = WC.hasOwnProperty,
  HC = ww.call(Object);
function BC(e) {
  if (!jC(e) || IC(e) != UC) return !1;
  var t = LC(e);
  if (t === null) return !0;
  var n = qC.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n instanceof n && ww.call(n) == HC;
}
var op = BC;
const xw = gt(op);
var VC = kr,
  QC = ap,
  YC = cn,
  GC = "[object Arguments]",
  KC = "[object Array]",
  XC = "[object Boolean]",
  ZC = "[object Date]",
  JC = "[object Error]",
  ek = "[object Function]",
  tk = "[object Map]",
  nk = "[object Number]",
  rk = "[object Object]",
  ik = "[object RegExp]",
  ak = "[object Set]",
  ok = "[object String]",
  uk = "[object WeakMap]",
  sk = "[object ArrayBuffer]",
  lk = "[object DataView]",
  fk = "[object Float32Array]",
  ck = "[object Float64Array]",
  dk = "[object Int8Array]",
  hk = "[object Int16Array]",
  pk = "[object Int32Array]",
  mk = "[object Uint8Array]",
  vk = "[object Uint8ClampedArray]",
  gk = "[object Uint16Array]",
  yk = "[object Uint32Array]",
  $e = {};
$e[fk] = $e[ck] = $e[dk] = $e[hk] = $e[pk] = $e[mk] = $e[vk] = $e[gk] = $e[yk] = !0;
$e[GC] =
  $e[KC] =
  $e[sk] =
  $e[XC] =
  $e[lk] =
  $e[ZC] =
  $e[JC] =
  $e[ek] =
  $e[tk] =
  $e[nk] =
  $e[rk] =
  $e[ik] =
  $e[ak] =
  $e[ok] =
  $e[uk] =
    !1;
function bk(e) {
  return YC(e) && QC(e.length) && !!$e[VC(e)];
}
var _k = bk;
function wk(e) {
  return function (t) {
    return e(t);
  };
}
var lu = wk,
  Js = { exports: {} };
Js.exports;
(function (e, t) {
  var n = uw,
    r = t && !t.nodeType && t,
    i = r && !0 && e && !e.nodeType && e,
    a = i && i.exports === r,
    o = a && n.process,
    u = (function () {
      try {
        var s = i && i.require && i.require("util").types;
        return s || (o && o.binding && o.binding("util"));
      } catch {}
    })();
  e.exports = u;
})(Js, Js.exports);
var ef = Js.exports,
  xk = _k,
  Sk = lu,
  E1 = ef,
  A1 = E1 && E1.isTypedArray,
  $k = A1 ? Sk(A1) : xk,
  up = $k;
function Tk(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__") return e[t];
}
var Sw = Tk,
  Ck = tp,
  kk = su,
  Ok = Object.prototype,
  Mk = Ok.hasOwnProperty;
function Pk(e, t, n) {
  var r = e[t];
  (!(Mk.call(e, t) && kk(r, n)) || (n === void 0 && !(t in e))) && Ck(e, t, n);
}
var sp = Pk,
  Ek = sp,
  Ak = tp;
function Rk(e, t, n, r) {
  var i = !n;
  n || (n = {});
  for (var a = -1, o = t.length; ++a < o; ) {
    var u = t[a],
      s = r ? r(n[u], e[u], u, n, e) : void 0;
    s === void 0 && (s = e[u]), i ? Ak(n, u, s) : Ek(n, u, s);
  }
  return n;
}
var _a = Rk;
function Fk(e, t) {
  for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n);
  return r;
}
var Dk = Fk,
  Nk = 9007199254740991,
  Ik = /^(?:0|[1-9]\d*)$/;
function Lk(e, t) {
  var n = typeof e;
  return (
    (t = t ?? Nk),
    !!t && (n == "number" || (n != "symbol" && Ik.test(e))) && e > -1 && e % 1 == 0 && e < t
  );
}
var tf = Lk,
  jk = Dk,
  Uk = Zl,
  zk = Mt,
  Wk = Jl,
  qk = tf,
  Hk = up,
  Bk = Object.prototype,
  Vk = Bk.hasOwnProperty;
function Qk(e, t) {
  var n = zk(e),
    r = !n && Uk(e),
    i = !n && !r && Wk(e),
    a = !n && !r && !i && Hk(e),
    o = n || r || i || a,
    u = o ? jk(e.length, String) : [],
    s = u.length;
  for (var l in e)
    (t || Vk.call(e, l)) &&
      !(
        o &&
        (l == "length" ||
          (i && (l == "offset" || l == "parent")) ||
          (a && (l == "buffer" || l == "byteLength" || l == "byteOffset")) ||
          qk(l, s))
      ) &&
      u.push(l);
  return u;
}
var $w = Qk;
function Yk(e) {
  var t = [];
  if (e != null) for (var n in Object(e)) t.push(n);
  return t;
}
var Gk = Yk,
  Kk = On,
  Xk = ip,
  Zk = Gk,
  Jk = Object.prototype,
  eO = Jk.hasOwnProperty;
function tO(e) {
  if (!Kk(e)) return Zk(e);
  var t = Xk(e),
    n = [];
  for (var r in e) (r == "constructor" && (t || !eO.call(e, r))) || n.push(r);
  return n;
}
var nO = tO,
  rO = $w,
  iO = nO,
  aO = ba;
function oO(e) {
  return aO(e) ? rO(e, !0) : iO(e);
}
var fu = oO,
  uO = _a,
  sO = fu;
function lO(e) {
  return uO(e, sO(e));
}
var fO = lO,
  R1 = cw,
  cO = hw,
  dO = mw,
  hO = vw,
  pO = yw,
  F1 = Zl,
  D1 = Mt,
  mO = _w,
  vO = Jl,
  gO = Yl,
  yO = On,
  bO = op,
  _O = up,
  N1 = Sw,
  wO = fO;
function xO(e, t, n, r, i, a, o) {
  var u = N1(e, n),
    s = N1(t, n),
    l = o.get(s);
  if (l) {
    R1(e, n, l);
    return;
  }
  var f = a ? a(u, s, n + "", e, t, o) : void 0,
    c = f === void 0;
  if (c) {
    var d = D1(s),
      p = !d && vO(s),
      g = !d && !p && _O(s);
    (f = s),
      d || p || g
        ? D1(u)
          ? (f = u)
          : mO(u)
            ? (f = hO(u))
            : p
              ? ((c = !1), (f = cO(s, !0)))
              : g
                ? ((c = !1), (f = dO(s, !0)))
                : (f = [])
        : bO(s) || F1(s)
          ? ((f = u), F1(u) ? (f = wO(u)) : (!yO(u) || gO(u)) && (f = pO(s)))
          : (c = !1);
  }
  c && (o.set(s, f), i(f, s, r, a, o), o.delete(s)), R1(e, n, f);
}
var SO = xO,
  $O = Xl,
  TO = cw,
  CO = dw,
  kO = SO,
  OO = On,
  MO = fu,
  PO = Sw;
function Tw(e, t, n, r, i) {
  e !== t &&
    CO(
      t,
      function (a, o) {
        if ((i || (i = new $O()), OO(a))) kO(e, t, o, n, Tw, r, i);
        else {
          var u = r ? r(PO(e, o), a, o + "", e, t, i) : void 0;
          u === void 0 && (u = a), TO(e, o, u);
        }
      },
      MO,
    );
}
var EO = Tw;
function AO(e) {
  return e;
}
var nf = AO;
function RO(e, t, n) {
  switch (n.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, n[0]);
    case 2:
      return e.call(t, n[0], n[1]);
    case 3:
      return e.call(t, n[0], n[1], n[2]);
  }
  return e.apply(t, n);
}
var FO = RO,
  DO = FO,
  I1 = Math.max;
function NO(e, t, n) {
  return (
    (t = I1(t === void 0 ? e.length - 1 : t, 0)),
    function () {
      for (var r = arguments, i = -1, a = I1(r.length - t, 0), o = Array(a); ++i < a; )
        o[i] = r[t + i];
      i = -1;
      for (var u = Array(t + 1); ++i < t; ) u[i] = r[i];
      return (u[t] = n(o)), DO(e, this, u);
    }
  );
}
var Cw = NO;
function IO(e) {
  return function () {
    return e;
  };
}
var LO = IO,
  jO = LO,
  L1 = fw,
  UO = nf,
  zO = L1
    ? function (e, t) {
        return L1(e, "toString", { configurable: !0, enumerable: !1, value: jO(t), writable: !0 });
      }
    : UO,
  WO = zO,
  qO = 800,
  HO = 16,
  BO = Date.now;
function VO(e) {
  var t = 0,
    n = 0;
  return function () {
    var r = BO(),
      i = HO - (r - n);
    if (((n = r), i > 0)) {
      if (++t >= qO) return arguments[0];
    } else t = 0;
    return e.apply(void 0, arguments);
  };
}
var QO = VO,
  YO = WO,
  GO = QO,
  KO = GO(YO),
  kw = KO,
  XO = nf,
  ZO = Cw,
  JO = kw;
function eM(e, t) {
  return JO(ZO(e, t, XO), e + "");
}
var lp = eM,
  tM = su,
  nM = ba,
  rM = tf,
  iM = On;
function aM(e, t, n) {
  if (!iM(n)) return !1;
  var r = typeof t;
  return (r == "number" ? nM(n) && rM(t, n.length) : r == "string" && t in n) ? tM(n[t], e) : !1;
}
var Ow = aM,
  oM = lp,
  uM = Ow;
function sM(e) {
  return oM(function (t, n) {
    var r = -1,
      i = n.length,
      a = i > 1 ? n[i - 1] : void 0,
      o = i > 2 ? n[2] : void 0;
    for (
      a = e.length > 3 && typeof a == "function" ? (i--, a) : void 0,
        o && uM(n[0], n[1], o) && ((a = i < 3 ? void 0 : a), (i = 1)),
        t = Object(t);
      ++r < i;

    ) {
      var u = n[r];
      u && e(t, u, r, a);
    }
    return t;
  });
}
var lM = sM,
  fM = EO,
  cM = lM,
  dM = cM(function (e, t, n) {
    fM(e, t, n);
  }),
  hM = dM;
const pM = gt(hM);
var mM = kr,
  vM = cn,
  gM = "[object Symbol]";
function yM(e) {
  return typeof e == "symbol" || (vM(e) && mM(e) == gM);
}
var rf = yM,
  bM = Mt,
  _M = rf,
  wM = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  xM = /^\w*$/;
function SM(e, t) {
  if (bM(e)) return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || _M(e)
    ? !0
    : xM.test(e) || !wM.test(e) || (t != null && e in Object(t));
}
var fp = SM,
  Mw = ep,
  $M = "Expected a function";
function cp(e, t) {
  if (typeof e != "function" || (t != null && typeof t != "function")) throw new TypeError($M);
  var n = function () {
    var r = arguments,
      i = t ? t.apply(this, r) : r[0],
      a = n.cache;
    if (a.has(i)) return a.get(i);
    var o = e.apply(this, r);
    return (n.cache = a.set(i, o) || a), o;
  };
  return (n.cache = new (cp.Cache || Mw)()), n;
}
cp.Cache = Mw;
var TM = cp,
  CM = TM,
  kM = 500;
function OM(e) {
  var t = CM(e, function (r) {
      return n.size === kM && n.clear(), r;
    }),
    n = t.cache;
  return t;
}
var MM = OM,
  PM = MM,
  EM =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  AM = /\\(\\)?/g,
  RM = PM(function (e) {
    var t = [];
    return (
      e.charCodeAt(0) === 46 && t.push(""),
      e.replace(EM, function (n, r, i, a) {
        t.push(i ? a.replace(AM, "$1") : r || n);
      }),
      t
    );
  }),
  FM = RM;
function DM(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r; ) i[n] = t(e[n], n, e);
  return i;
}
var af = DM,
  j1 = ma,
  NM = af,
  IM = Mt,
  LM = rf,
  U1 = j1 ? j1.prototype : void 0,
  z1 = U1 ? U1.toString : void 0;
function Pw(e) {
  if (typeof e == "string") return e;
  if (IM(e)) return NM(e, Pw) + "";
  if (LM(e)) return z1 ? z1.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
var jM = Pw,
  UM = jM;
function zM(e) {
  return e == null ? "" : UM(e);
}
var WM = zM,
  qM = Mt,
  HM = fp,
  BM = FM,
  VM = WM;
function QM(e, t) {
  return qM(e) ? e : HM(e, t) ? [e] : BM(VM(e));
}
var wa = QM,
  YM = rf;
function GM(e) {
  if (typeof e == "string" || YM(e)) return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
var xa = GM,
  KM = wa,
  XM = xa;
function ZM(e, t) {
  t = KM(t, e);
  for (var n = 0, r = t.length; e != null && n < r; ) e = e[XM(t[n++])];
  return n && n == r ? e : void 0;
}
var cu = ZM,
  JM = cu;
function eP(e, t, n) {
  var r = e == null ? void 0 : JM(e, t);
  return r === void 0 ? n : r;
}
var Ew = eP;
const ta = gt(Ew);
var tP = sp,
  nP = wa,
  rP = tf,
  W1 = On,
  iP = xa;
function aP(e, t, n, r) {
  if (!W1(e)) return e;
  t = nP(t, e);
  for (var i = -1, a = t.length, o = a - 1, u = e; u != null && ++i < a; ) {
    var s = iP(t[i]),
      l = n;
    if (s === "__proto__" || s === "constructor" || s === "prototype") return e;
    if (i != o) {
      var f = u[s];
      (l = r ? r(f, s, u) : void 0), l === void 0 && (l = W1(f) ? f : rP(t[i + 1]) ? [] : {});
    }
    tP(u, s, l), (u = u[s]);
  }
  return e;
}
var Aw = aP,
  oP = Aw;
function uP(e, t, n) {
  return e == null ? e : oP(e, t, n);
}
var sP = uP;
const lP = gt(sP);
function of(e, t, n) {
  (e.prototype = t.prototype = n), (n.constructor = e);
}
function dp(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Sa() {}
var ni = 0.7,
  na = 1 / ni,
  Bi = "\\s*([+-]?\\d+)\\s*",
  Ho = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  $n = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  fP = /^#([0-9a-f]{3,8})$/,
  cP = new RegExp(`^rgb\\(${Bi},${Bi},${Bi}\\)$`),
  dP = new RegExp(`^rgb\\(${$n},${$n},${$n}\\)$`),
  hP = new RegExp(`^rgba\\(${Bi},${Bi},${Bi},${Ho}\\)$`),
  pP = new RegExp(`^rgba\\(${$n},${$n},${$n},${Ho}\\)$`),
  mP = new RegExp(`^hsl\\(${Ho},${$n},${$n}\\)$`),
  vP = new RegExp(`^hsla\\(${Ho},${$n},${$n},${Ho}\\)$`),
  q1 = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
of(Sa, Bo, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: H1,
  formatHex: H1,
  formatHex8: gP,
  formatHsl: yP,
  formatRgb: B1,
  toString: B1,
});
function H1() {
  return this.rgb().formatHex();
}
function gP() {
  return this.rgb().formatHex8();
}
function yP() {
  return Fw(this).formatHsl();
}
function B1() {
  return this.rgb().formatRgb();
}
function Bo(e) {
  var t, n;
  return (
    (e = (e + "").trim().toLowerCase()),
    (t = fP.exec(e))
      ? ((n = t[1].length),
        (t = parseInt(t[1], 16)),
        n === 6
          ? V1(t)
          : n === 3
            ? new ct(
                ((t >> 8) & 15) | ((t >> 4) & 240),
                ((t >> 4) & 15) | (t & 240),
                ((t & 15) << 4) | (t & 15),
                1,
              )
            : n === 8
              ? zu((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, (t & 255) / 255)
              : n === 4
                ? zu(
                    ((t >> 12) & 15) | ((t >> 8) & 240),
                    ((t >> 8) & 15) | ((t >> 4) & 240),
                    ((t >> 4) & 15) | (t & 240),
                    (((t & 15) << 4) | (t & 15)) / 255,
                  )
                : null)
      : (t = cP.exec(e))
        ? new ct(t[1], t[2], t[3], 1)
        : (t = dP.exec(e))
          ? new ct((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, 1)
          : (t = hP.exec(e))
            ? zu(t[1], t[2], t[3], t[4])
            : (t = pP.exec(e))
              ? zu((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, t[4])
              : (t = mP.exec(e))
                ? G1(t[1], t[2] / 100, t[3] / 100, 1)
                : (t = vP.exec(e))
                  ? G1(t[1], t[2] / 100, t[3] / 100, t[4])
                  : q1.hasOwnProperty(e)
                    ? V1(q1[e])
                    : e === "transparent"
                      ? new ct(NaN, NaN, NaN, 0)
                      : null
  );
}
function V1(e) {
  return new ct((e >> 16) & 255, (e >> 8) & 255, e & 255, 1);
}
function zu(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new ct(e, t, n, r);
}
function Rw(e) {
  return (
    e instanceof Sa || (e = Bo(e)), e ? ((e = e.rgb()), new ct(e.r, e.g, e.b, e.opacity)) : new ct()
  );
}
function ra(e, t, n, r) {
  return arguments.length === 1 ? Rw(e) : new ct(e, t, n, r ?? 1);
}
function ct(e, t, n, r) {
  (this.r = +e), (this.g = +t), (this.b = +n), (this.opacity = +r);
}
of(
  ct,
  ra,
  dp(Sa, {
    brighter(e) {
      return (
        (e = e == null ? na : Math.pow(na, e)),
        new ct(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    darker(e) {
      return (
        (e = e == null ? ni : Math.pow(ni, e)),
        new ct(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    rgb() {
      return this;
    },
    clamp() {
      return new ct(Vr(this.r), Vr(this.g), Vr(this.b), el(this.opacity));
    },
    displayable() {
      return (
        -0.5 <= this.r &&
        this.r < 255.5 &&
        -0.5 <= this.g &&
        this.g < 255.5 &&
        -0.5 <= this.b &&
        this.b < 255.5 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    hex: Q1,
    formatHex: Q1,
    formatHex8: bP,
    formatRgb: Y1,
    toString: Y1,
  }),
);
function Q1() {
  return `#${Ur(this.r)}${Ur(this.g)}${Ur(this.b)}`;
}
function bP() {
  return `#${Ur(this.r)}${Ur(this.g)}${Ur(this.b)}${Ur((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Y1() {
  const e = el(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Vr(this.r)}, ${Vr(this.g)}, ${Vr(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function el(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Vr(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ur(e) {
  return (e = Vr(e)), (e < 16 ? "0" : "") + e.toString(16);
}
function G1(e, t, n, r) {
  return (
    r <= 0 ? (e = t = n = NaN) : n <= 0 || n >= 1 ? (e = t = NaN) : t <= 0 && (e = NaN),
    new an(e, t, n, r)
  );
}
function Fw(e) {
  if (e instanceof an) return new an(e.h, e.s, e.l, e.opacity);
  if ((e instanceof Sa || (e = Bo(e)), !e)) return new an();
  if (e instanceof an) return e;
  e = e.rgb();
  var t = e.r / 255,
    n = e.g / 255,
    r = e.b / 255,
    i = Math.min(t, n, r),
    a = Math.max(t, n, r),
    o = NaN,
    u = a - i,
    s = (a + i) / 2;
  return (
    u
      ? (t === a
          ? (o = (n - r) / u + (n < r) * 6)
          : n === a
            ? (o = (r - t) / u + 2)
            : (o = (t - n) / u + 4),
        (u /= s < 0.5 ? a + i : 2 - a - i),
        (o *= 60))
      : (u = s > 0 && s < 1 ? 0 : o),
    new an(o, u, s, e.opacity)
  );
}
function _P(e, t, n, r) {
  return arguments.length === 1 ? Fw(e) : new an(e, t, n, r ?? 1);
}
function an(e, t, n, r) {
  (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +r);
}
of(
  an,
  _P,
  dp(Sa, {
    brighter(e) {
      return (
        (e = e == null ? na : Math.pow(na, e)), new an(this.h, this.s, this.l * e, this.opacity)
      );
    },
    darker(e) {
      return (
        (e = e == null ? ni : Math.pow(ni, e)), new an(this.h, this.s, this.l * e, this.opacity)
      );
    },
    rgb() {
      var e = (this.h % 360) + (this.h < 0) * 360,
        t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        n = this.l,
        r = n + (n < 0.5 ? n : 1 - n) * t,
        i = 2 * n - r;
      return new ct(
        Mc(e >= 240 ? e - 240 : e + 120, i, r),
        Mc(e, i, r),
        Mc(e < 120 ? e + 240 : e - 120, i, r),
        this.opacity,
      );
    },
    clamp() {
      return new an(K1(this.h), Wu(this.s), Wu(this.l), el(this.opacity));
    },
    displayable() {
      return (
        ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
        0 <= this.l &&
        this.l <= 1 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    formatHsl() {
      const e = el(this.opacity);
      return `${e === 1 ? "hsl(" : "hsla("}${K1(this.h)}, ${Wu(this.s) * 100}%, ${Wu(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
    },
  }),
);
function K1(e) {
  return (e = (e || 0) % 360), e < 0 ? e + 360 : e;
}
function Wu(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Mc(e, t, n) {
  return (
    (e < 60 ? t + ((n - t) * e) / 60 : e < 180 ? n : e < 240 ? t + ((n - t) * (240 - e)) / 60 : t) *
    255
  );
}
const wP = Math.PI / 180,
  xP = 180 / Math.PI;
var Dw = -0.14861,
  hp = 1.78277,
  pp = -0.29227,
  uf = -0.90649,
  Vo = 1.97294,
  X1 = Vo * uf,
  Z1 = Vo * hp,
  J1 = hp * pp - uf * Dw;
function SP(e) {
  if (e instanceof Qr) return new Qr(e.h, e.s, e.l, e.opacity);
  e instanceof ct || (e = Rw(e));
  var t = e.r / 255,
    n = e.g / 255,
    r = e.b / 255,
    i = (J1 * r + X1 * t - Z1 * n) / (J1 + X1 - Z1),
    a = r - i,
    o = (Vo * (n - i) - pp * a) / uf,
    u = Math.sqrt(o * o + a * a) / (Vo * i * (1 - i)),
    s = u ? Math.atan2(o, a) * xP - 120 : NaN;
  return new Qr(s < 0 ? s + 360 : s, u, i, e.opacity);
}
function Cn(e, t, n, r) {
  return arguments.length === 1 ? SP(e) : new Qr(e, t, n, r ?? 1);
}
function Qr(e, t, n, r) {
  (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +r);
}
of(
  Qr,
  Cn,
  dp(Sa, {
    brighter(e) {
      return (
        (e = e == null ? na : Math.pow(na, e)), new Qr(this.h, this.s, this.l * e, this.opacity)
      );
    },
    darker(e) {
      return (
        (e = e == null ? ni : Math.pow(ni, e)), new Qr(this.h, this.s, this.l * e, this.opacity)
      );
    },
    rgb() {
      var e = isNaN(this.h) ? 0 : (this.h + 120) * wP,
        t = +this.l,
        n = isNaN(this.s) ? 0 : this.s * t * (1 - t),
        r = Math.cos(e),
        i = Math.sin(e);
      return new ct(
        255 * (t + n * (Dw * r + hp * i)),
        255 * (t + n * (pp * r + uf * i)),
        255 * (t + n * (Vo * r)),
        this.opacity,
      );
    },
  }),
);
function $P(e, t, n, r, i) {
  var a = e * e,
    o = a * e;
  return (
    ((1 - 3 * e + 3 * a - o) * t +
      (4 - 6 * a + 3 * o) * n +
      (1 + 3 * e + 3 * a - 3 * o) * r +
      o * i) /
    6
  );
}
function TP(e) {
  var t = e.length - 1;
  return function (n) {
    var r = n <= 0 ? (n = 0) : n >= 1 ? ((n = 1), t - 1) : Math.floor(n * t),
      i = e[r],
      a = e[r + 1],
      o = r > 0 ? e[r - 1] : 2 * i - a,
      u = r < t - 1 ? e[r + 2] : 2 * a - i;
    return $P((n - r / t) * t, o, i, a, u);
  };
}
const sf = (e) => () => e;
function Nw(e, t) {
  return function (n) {
    return e + n * t;
  };
}
function CP(e, t, n) {
  return (
    (e = Math.pow(e, n)),
    (t = Math.pow(t, n) - e),
    (n = 1 / n),
    function (r) {
      return Math.pow(e + r * t, n);
    }
  );
}
function kP(e, t) {
  var n = t - e;
  return n ? Nw(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : sf(isNaN(e) ? t : e);
}
function OP(e) {
  return (e = +e) == 1
    ? Vi
    : function (t, n) {
        return n - t ? CP(t, n, e) : sf(isNaN(t) ? n : t);
      };
}
function Vi(e, t) {
  var n = t - e;
  return n ? Nw(e, n) : sf(isNaN(e) ? t : e);
}
const eg = (function e(t) {
  var n = OP(t);
  function r(i, a) {
    var o = n((i = ra(i)).r, (a = ra(a)).r),
      u = n(i.g, a.g),
      s = n(i.b, a.b),
      l = Vi(i.opacity, a.opacity);
    return function (f) {
      return (i.r = o(f)), (i.g = u(f)), (i.b = s(f)), (i.opacity = l(f)), i + "";
    };
  }
  return (r.gamma = e), r;
})(1);
function MP(e) {
  return function (t) {
    var n = t.length,
      r = new Array(n),
      i = new Array(n),
      a = new Array(n),
      o,
      u;
    for (o = 0; o < n; ++o) (u = ra(t[o])), (r[o] = u.r || 0), (i[o] = u.g || 0), (a[o] = u.b || 0);
    return (
      (r = e(r)),
      (i = e(i)),
      (a = e(a)),
      (u.opacity = 1),
      function (s) {
        return (u.r = r(s)), (u.g = i(s)), (u.b = a(s)), u + "";
      }
    );
  };
}
var PP = MP(TP);
function EP(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0,
    r = t.slice(),
    i;
  return function (a) {
    for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
    return r;
  };
}
function AP(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function RP(e, t) {
  var n = t ? t.length : 0,
    r = e ? Math.min(n, e.length) : 0,
    i = new Array(r),
    a = new Array(n),
    o;
  for (o = 0; o < r; ++o) i[o] = mp(e[o], t[o]);
  for (; o < n; ++o) a[o] = t[o];
  return function (u) {
    for (o = 0; o < r; ++o) a[o] = i[o](u);
    return a;
  };
}
function FP(e, t) {
  var n = new Date();
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return n.setTime(e * (1 - r) + t * r), n;
    }
  );
}
function tl(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (n) {
      return e * (1 - n) + t * n;
    }
  );
}
function DP(e, t) {
  var n = {},
    r = {},
    i;
  (e === null || typeof e != "object") && (e = {}),
    (t === null || typeof t != "object") && (t = {});
  for (i in t) i in e ? (n[i] = mp(e[i], t[i])) : (r[i] = t[i]);
  return function (a) {
    for (i in n) r[i] = n[i](a);
    return r;
  };
}
var bh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Pc = new RegExp(bh.source, "g");
function NP(e) {
  return function () {
    return e;
  };
}
function IP(e) {
  return function (t) {
    return e(t) + "";
  };
}
function LP(e, t) {
  var n = (bh.lastIndex = Pc.lastIndex = 0),
    r,
    i,
    a,
    o = -1,
    u = [],
    s = [];
  for (e = e + "", t = t + ""; (r = bh.exec(e)) && (i = Pc.exec(t)); )
    (a = i.index) > n && ((a = t.slice(n, a)), u[o] ? (u[o] += a) : (u[++o] = a)),
      (r = r[0]) === (i = i[0])
        ? u[o]
          ? (u[o] += i)
          : (u[++o] = i)
        : ((u[++o] = null), s.push({ i: o, x: tl(r, i) })),
      (n = Pc.lastIndex);
  return (
    n < t.length && ((a = t.slice(n)), u[o] ? (u[o] += a) : (u[++o] = a)),
    u.length < 2
      ? s[0]
        ? IP(s[0].x)
        : NP(t)
      : ((t = s.length),
        function (l) {
          for (var f = 0, c; f < t; ++f) u[(c = s[f]).i] = c.x(l);
          return u.join("");
        })
  );
}
function mp(e, t) {
  var n = typeof t,
    r;
  return t == null || n === "boolean"
    ? sf(t)
    : (n === "number"
        ? tl
        : n === "string"
          ? (r = Bo(t))
            ? ((t = r), eg)
            : LP
          : t instanceof Bo
            ? eg
            : t instanceof Date
              ? FP
              : AP(t)
                ? EP
                : Array.isArray(t)
                  ? RP
                  : (typeof t.valueOf != "function" && typeof t.toString != "function") || isNaN(t)
                    ? DP
                    : tl)(e, t);
}
function jP(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (n) {
      return Math.round(e * (1 - n) + t * n);
    }
  );
}
function Iw(e) {
  return (function t(n) {
    n = +n;
    function r(i, a) {
      var o = e((i = Cn(i)).h, (a = Cn(a)).h),
        u = Vi(i.s, a.s),
        s = Vi(i.l, a.l),
        l = Vi(i.opacity, a.opacity);
      return function (f) {
        return (i.h = o(f)), (i.s = u(f)), (i.l = s(Math.pow(f, n))), (i.opacity = l(f)), i + "";
      };
    }
    return (r.gamma = t), r;
  })(1);
}
Iw(kP);
var vp = Iw(Vi),
  UP = kr,
  zP = Mt,
  WP = cn,
  qP = "[object String]";
function HP(e) {
  return typeof e == "string" || (!zP(e) && WP(e) && UP(e) == qP);
}
var BP = HP;
const VP = gt(BP);
function QP(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var Lw = QP;
const G = gt(Lw);
function ds(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function YP(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function gp(e) {
  let t, n, r;
  e.length !== 2
    ? ((t = ds), (n = (u, s) => ds(e(u), s)), (r = (u, s) => e(u) - s))
    : ((t = e === ds || e === YP ? e : GP), (n = e), (r = e));
  function i(u, s, l = 0, f = u.length) {
    if (l < f) {
      if (t(s, s) !== 0) return f;
      do {
        const c = (l + f) >>> 1;
        n(u[c], s) < 0 ? (l = c + 1) : (f = c);
      } while (l < f);
    }
    return l;
  }
  function a(u, s, l = 0, f = u.length) {
    if (l < f) {
      if (t(s, s) !== 0) return f;
      do {
        const c = (l + f) >>> 1;
        n(u[c], s) <= 0 ? (l = c + 1) : (f = c);
      } while (l < f);
    }
    return l;
  }
  function o(u, s, l = 0, f = u.length) {
    const c = i(u, s, l, f - 1);
    return c > l && r(u[c - 1], s) > -r(u[c], s) ? c - 1 : c;
  }
  return { left: i, center: o, right: a };
}
function GP() {
  return 0;
}
function KP(e) {
  return e === null ? NaN : +e;
}
const XP = gp(ds),
  ZP = XP.right;
gp(KP).center;
class tg extends Map {
  constructor(t, n = tE) {
    if (
      (super(),
      Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: n } }),
      t != null)
    )
      for (const [r, i] of t) this.set(r, i);
  }
  get(t) {
    return super.get(ng(this, t));
  }
  has(t) {
    return super.has(ng(this, t));
  }
  set(t, n) {
    return super.set(JP(this, t), n);
  }
  delete(t) {
    return super.delete(eE(this, t));
  }
}
function ng({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : n;
}
function JP({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function eE({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) && ((n = e.get(r)), e.delete(r)), n;
}
function tE(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
const nE = Math.sqrt(50),
  rE = Math.sqrt(10),
  iE = Math.sqrt(2);
function nl(e, t, n) {
  const r = (t - e) / Math.max(0, n),
    i = Math.floor(Math.log10(r)),
    a = r / Math.pow(10, i),
    o = a >= nE ? 10 : a >= rE ? 5 : a >= iE ? 2 : 1;
  let u, s, l;
  return (
    i < 0
      ? ((l = Math.pow(10, -i) / o),
        (u = Math.round(e * l)),
        (s = Math.round(t * l)),
        u / l < e && ++u,
        s / l > t && --s,
        (l = -l))
      : ((l = Math.pow(10, i) * o),
        (u = Math.round(e / l)),
        (s = Math.round(t / l)),
        u * l < e && ++u,
        s * l > t && --s),
    s < u && 0.5 <= n && n < 2 ? nl(e, t, n * 2) : [u, s, l]
  );
}
function _h(e, t, n) {
  if (((t = +t), (e = +e), (n = +n), !(n > 0))) return [];
  if (e === t) return [e];
  const r = t < e,
    [i, a, o] = r ? nl(t, e, n) : nl(e, t, n);
  if (!(a >= i)) return [];
  const u = a - i + 1,
    s = new Array(u);
  if (r)
    if (o < 0) for (let l = 0; l < u; ++l) s[l] = (a - l) / -o;
    else for (let l = 0; l < u; ++l) s[l] = (a - l) * o;
  else if (o < 0) for (let l = 0; l < u; ++l) s[l] = (i + l) / -o;
  else for (let l = 0; l < u; ++l) s[l] = (i + l) * o;
  return s;
}
function wh(e, t, n) {
  return (t = +t), (e = +e), (n = +n), nl(e, t, n)[2];
}
function xh(e, t, n) {
  (t = +t), (e = +e), (n = +n);
  const r = t < e,
    i = r ? wh(t, e, n) : wh(e, t, n);
  return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function aE(e, t, n) {
  (e = +e), (t = +t), (n = (i = arguments.length) < 2 ? ((t = e), (e = 0), 1) : i < 3 ? 1 : +n);
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = new Array(i); ++r < i; )
    a[r] = e + r * n;
  return a;
}
function si(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
const rg = Symbol("implicit");
function zr() {
  var e = new tg(),
    t = [],
    n = [],
    r = rg;
  function i(a) {
    let o = e.get(a);
    if (o === void 0) {
      if (r !== rg) return r;
      e.set(a, (o = t.push(a) - 1));
    }
    return n[o % n.length];
  }
  return (
    (i.domain = function (a) {
      if (!arguments.length) return t.slice();
      (t = []), (e = new tg());
      for (const o of a) e.has(o) || e.set(o, t.push(o) - 1);
      return i;
    }),
    (i.range = function (a) {
      return arguments.length ? ((n = Array.from(a)), i) : n.slice();
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((r = a), i) : r;
    }),
    (i.copy = function () {
      return zr(t, n).unknown(r);
    }),
    si.apply(i, arguments),
    i
  );
}
function yp() {
  var e = zr().unknown(void 0),
    t = e.domain,
    n = e.range,
    r = 0,
    i = 1,
    a,
    o,
    u = !1,
    s = 0,
    l = 0,
    f = 0.5;
  delete e.unknown;
  function c() {
    var d = t().length,
      p = i < r,
      g = p ? i : r,
      y = p ? r : i;
    (a = (y - g) / Math.max(1, d - s + l * 2)),
      u && (a = Math.floor(a)),
      (g += (y - g - a * (d - s)) * f),
      (o = a * (1 - s)),
      u && ((g = Math.round(g)), (o = Math.round(o)));
    var b = aE(d).map(function (h) {
      return g + a * h;
    });
    return n(p ? b.reverse() : b);
  }
  return (
    (e.domain = function (d) {
      return arguments.length ? (t(d), c()) : t();
    }),
    (e.range = function (d) {
      return arguments.length ? (([r, i] = d), (r = +r), (i = +i), c()) : [r, i];
    }),
    (e.rangeRound = function (d) {
      return ([r, i] = d), (r = +r), (i = +i), (u = !0), c();
    }),
    (e.bandwidth = function () {
      return o;
    }),
    (e.step = function () {
      return a;
    }),
    (e.round = function (d) {
      return arguments.length ? ((u = !!d), c()) : u;
    }),
    (e.padding = function (d) {
      return arguments.length ? ((s = Math.min(1, (l = +d))), c()) : s;
    }),
    (e.paddingInner = function (d) {
      return arguments.length ? ((s = Math.min(1, d)), c()) : s;
    }),
    (e.paddingOuter = function (d) {
      return arguments.length ? ((l = +d), c()) : l;
    }),
    (e.align = function (d) {
      return arguments.length ? ((f = Math.max(0, Math.min(1, d))), c()) : f;
    }),
    (e.copy = function () {
      return yp(t(), [r, i]).round(u).paddingInner(s).paddingOuter(l).align(f);
    }),
    si.apply(c(), arguments)
  );
}
function jw(e) {
  var t = e.copy;
  return (
    (e.padding = e.paddingOuter),
    delete e.paddingInner,
    delete e.paddingOuter,
    (e.copy = function () {
      return jw(t());
    }),
    e
  );
}
function oE() {
  return jw(yp.apply(null, arguments).paddingInner(1));
}
function uE(e) {
  return function () {
    return e;
  };
}
function sE(e) {
  return +e;
}
var ig = [0, 1];
function Di(e) {
  return e;
}
function Sh(e, t) {
  return (t -= e = +e)
    ? function (n) {
        return (n - e) / t;
      }
    : uE(isNaN(t) ? NaN : 0.5);
}
function lE(e, t) {
  var n;
  return (
    e > t && ((n = e), (e = t), (t = n)),
    function (r) {
      return Math.max(e, Math.min(t, r));
    }
  );
}
function fE(e, t, n) {
  var r = e[0],
    i = e[1],
    a = t[0],
    o = t[1];
  return (
    i < r ? ((r = Sh(i, r)), (a = n(o, a))) : ((r = Sh(r, i)), (a = n(a, o))),
    function (u) {
      return a(r(u));
    }
  );
}
function cE(e, t, n) {
  var r = Math.min(e.length, t.length) - 1,
    i = new Array(r),
    a = new Array(r),
    o = -1;
  for (e[r] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse())); ++o < r; )
    (i[o] = Sh(e[o], e[o + 1])), (a[o] = n(t[o], t[o + 1]));
  return function (u) {
    var s = ZP(e, u, 1, r) - 1;
    return a[s](i[s](u));
  };
}
function lf(e, t) {
  return t
    .domain(e.domain())
    .range(e.range())
    .interpolate(e.interpolate())
    .clamp(e.clamp())
    .unknown(e.unknown());
}
function bp() {
  var e = ig,
    t = ig,
    n = mp,
    r,
    i,
    a,
    o = Di,
    u,
    s,
    l;
  function f() {
    var d = Math.min(e.length, t.length);
    return o !== Di && (o = lE(e[0], e[d - 1])), (u = d > 2 ? cE : fE), (s = l = null), c;
  }
  function c(d) {
    return d == null || isNaN((d = +d)) ? a : (s || (s = u(e.map(r), t, n)))(r(o(d)));
  }
  return (
    (c.invert = function (d) {
      return o(i((l || (l = u(t, e.map(r), tl)))(d)));
    }),
    (c.domain = function (d) {
      return arguments.length ? ((e = Array.from(d, sE)), f()) : e.slice();
    }),
    (c.range = function (d) {
      return arguments.length ? ((t = Array.from(d)), f()) : t.slice();
    }),
    (c.rangeRound = function (d) {
      return (t = Array.from(d)), (n = jP), f();
    }),
    (c.clamp = function (d) {
      return arguments.length ? ((o = d ? !0 : Di), f()) : o !== Di;
    }),
    (c.interpolate = function (d) {
      return arguments.length ? ((n = d), f()) : n;
    }),
    (c.unknown = function (d) {
      return arguments.length ? ((a = d), c) : a;
    }),
    function (d, p) {
      return (r = d), (i = p), f();
    }
  );
}
function Uw() {
  return bp()(Di, Di);
}
function dE(e) {
  return Math.abs((e = Math.round(e))) >= 1e21
    ? e.toLocaleString("en").replace(/,/g, "")
    : e.toString(10);
}
function rl(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n,
    r = e.slice(0, n);
  return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
function ia(e) {
  return (e = rl(Math.abs(e))), e ? e[1] : NaN;
}
function hE(e, t) {
  return function (n, r) {
    for (
      var i = n.length, a = [], o = 0, u = e[0], s = 0;
      i > 0 &&
      u > 0 &&
      (s + u + 1 > r && (u = Math.max(1, r - s)),
      a.push(n.substring((i -= u), i + u)),
      !((s += u + 1) > r));

    )
      u = e[(o = (o + 1) % e.length)];
    return a.reverse().join(t);
  };
}
function pE(e) {
  return function (t) {
    return t.replace(/[0-9]/g, function (n) {
      return e[+n];
    });
  };
}
var mE = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Qo(e) {
  if (!(t = mE.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new _p({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
Qo.prototype = _p.prototype;
function _p(e) {
  (this.fill = e.fill === void 0 ? " " : e.fill + ""),
    (this.align = e.align === void 0 ? ">" : e.align + ""),
    (this.sign = e.sign === void 0 ? "-" : e.sign + ""),
    (this.symbol = e.symbol === void 0 ? "" : e.symbol + ""),
    (this.zero = !!e.zero),
    (this.width = e.width === void 0 ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = e.precision === void 0 ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = e.type === void 0 ? "" : e.type + "");
}
_p.prototype.toString = function () {
  return (
    this.fill +
    this.align +
    this.sign +
    this.symbol +
    (this.zero ? "0" : "") +
    (this.width === void 0 ? "" : Math.max(1, this.width | 0)) +
    (this.comma ? "," : "") +
    (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) +
    (this.trim ? "~" : "") +
    this.type
  );
};
function vE(e) {
  e: for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
    switch (e[n]) {
      case ".":
        r = i = n;
        break;
      case "0":
        r === 0 && (r = n), (i = n);
        break;
      default:
        if (!+e[n]) break e;
        r > 0 && (r = 0);
        break;
    }
  return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var zw;
function gE(e, t) {
  var n = rl(e, t);
  if (!n) return e + "";
  var r = n[0],
    i = n[1],
    a = i - (zw = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
    o = r.length;
  return a === o
    ? r
    : a > o
      ? r + new Array(a - o + 1).join("0")
      : a > 0
        ? r.slice(0, a) + "." + r.slice(a)
        : "0." + new Array(1 - a).join("0") + rl(e, Math.max(0, t + a - 1))[0];
}
function ag(e, t) {
  var n = rl(e, t);
  if (!n) return e + "";
  var r = n[0],
    i = n[1];
  return i < 0
    ? "0." + new Array(-i).join("0") + r
    : r.length > i + 1
      ? r.slice(0, i + 1) + "." + r.slice(i + 1)
      : r + new Array(i - r.length + 2).join("0");
}
const og = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: dE,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => ag(e * 100, t),
  r: ag,
  s: gE,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16),
};
function ug(e) {
  return e;
}
var sg = Array.prototype.map,
  lg = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function yE(e) {
  var t =
      e.grouping === void 0 || e.thousands === void 0
        ? ug
        : hE(sg.call(e.grouping, Number), e.thousands + ""),
    n = e.currency === void 0 ? "" : e.currency[0] + "",
    r = e.currency === void 0 ? "" : e.currency[1] + "",
    i = e.decimal === void 0 ? "." : e.decimal + "",
    a = e.numerals === void 0 ? ug : pE(sg.call(e.numerals, String)),
    o = e.percent === void 0 ? "%" : e.percent + "",
    u = e.minus === void 0 ? "−" : e.minus + "",
    s = e.nan === void 0 ? "NaN" : e.nan + "";
  function l(c) {
    c = Qo(c);
    var d = c.fill,
      p = c.align,
      g = c.sign,
      y = c.symbol,
      b = c.zero,
      h = c.width,
      m = c.comma,
      v = c.precision,
      _ = c.trim,
      S = c.type;
    S === "n" ? ((m = !0), (S = "g")) : og[S] || (v === void 0 && (v = 12), (_ = !0), (S = "g")),
      (b || (d === "0" && p === "=")) && ((b = !0), (d = "0"), (p = "="));
    var w = y === "$" ? n : y === "#" && /[boxX]/.test(S) ? "0" + S.toLowerCase() : "",
      T = y === "$" ? r : /[%p]/.test(S) ? o : "",
      k = og[S],
      j = /[defgprs%]/.test(S);
    v =
      v === void 0
        ? 6
        : /[gprs]/.test(S)
          ? Math.max(1, Math.min(21, v))
          : Math.max(0, Math.min(20, v));
    function R(E) {
      var q = w,
        I = T,
        F,
        D,
        z;
      if (S === "c") (I = k(E) + I), (E = "");
      else {
        E = +E;
        var H = E < 0 || 1 / E < 0;
        if (
          ((E = isNaN(E) ? s : k(Math.abs(E), v)),
          _ && (E = vE(E)),
          H && +E == 0 && g !== "+" && (H = !1),
          (q = (H ? (g === "(" ? g : u) : g === "-" || g === "(" ? "" : g) + q),
          (I = (S === "s" ? lg[8 + zw / 3] : "") + I + (H && g === "(" ? ")" : "")),
          j)
        ) {
          for (F = -1, D = E.length; ++F < D; )
            if (((z = E.charCodeAt(F)), 48 > z || z > 57)) {
              (I = (z === 46 ? i + E.slice(F + 1) : E.slice(F)) + I), (E = E.slice(0, F));
              break;
            }
        }
      }
      m && !b && (E = t(E, 1 / 0));
      var P = q.length + E.length + I.length,
        O = P < h ? new Array(h - P + 1).join(d) : "";
      switch ((m && b && ((E = t(O + E, O.length ? h - I.length : 1 / 0)), (O = "")), p)) {
        case "<":
          E = q + E + I + O;
          break;
        case "=":
          E = q + O + E + I;
          break;
        case "^":
          E = O.slice(0, (P = O.length >> 1)) + q + E + I + O.slice(P);
          break;
        default:
          E = O + q + E + I;
          break;
      }
      return a(E);
    }
    return (
      (R.toString = function () {
        return c + "";
      }),
      R
    );
  }
  function f(c, d) {
    var p = l(((c = Qo(c)), (c.type = "f"), c)),
      g = Math.max(-8, Math.min(8, Math.floor(ia(d) / 3))) * 3,
      y = Math.pow(10, -g),
      b = lg[8 + g / 3];
    return function (h) {
      return p(y * h) + b;
    };
  }
  return { format: l, formatPrefix: f };
}
var qu, wp, Ww;
bE({ thousands: ",", grouping: [3], currency: ["$", ""] });
function bE(e) {
  return (qu = yE(e)), (wp = qu.format), (Ww = qu.formatPrefix), qu;
}
function _E(e) {
  return Math.max(0, -ia(Math.abs(e)));
}
function wE(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(ia(t) / 3))) * 3 - ia(Math.abs(e)));
}
function xE(e, t) {
  return (e = Math.abs(e)), (t = Math.abs(t) - e), Math.max(0, ia(t) - ia(e)) + 1;
}
function SE(e, t, n, r) {
  var i = xh(e, t, n),
    a;
  switch (((r = Qo(r ?? ",f")), r.type)) {
    case "s": {
      var o = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN((a = wE(i, o))) && (r.precision = a), Ww(r, o);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null &&
        !isNaN((a = xE(i, Math.max(Math.abs(e), Math.abs(t))))) &&
        (r.precision = a - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN((a = _E(i))) && (r.precision = a - (r.type === "%") * 2);
      break;
    }
  }
  return wp(r);
}
function qw(e) {
  var t = e.domain;
  return (
    (e.ticks = function (n) {
      var r = t();
      return _h(r[0], r[r.length - 1], n ?? 10);
    }),
    (e.tickFormat = function (n, r) {
      var i = t();
      return SE(i[0], i[i.length - 1], n ?? 10, r);
    }),
    (e.nice = function (n) {
      n == null && (n = 10);
      var r = t(),
        i = 0,
        a = r.length - 1,
        o = r[i],
        u = r[a],
        s,
        l,
        f = 10;
      for (u < o && ((l = o), (o = u), (u = l), (l = i), (i = a), (a = l)); f-- > 0; ) {
        if (((l = wh(o, u, n)), l === s)) return (r[i] = o), (r[a] = u), t(r);
        if (l > 0) (o = Math.floor(o / l) * l), (u = Math.ceil(u / l) * l);
        else if (l < 0) (o = Math.ceil(o * l) / l), (u = Math.floor(u * l) / l);
        else break;
        s = l;
      }
      return e;
    }),
    e
  );
}
function Hw() {
  var e = Uw();
  return (
    (e.copy = function () {
      return lf(e, Hw());
    }),
    si.apply(e, arguments),
    qw(e)
  );
}
function Bw(e, t) {
  e = e.slice();
  var n = 0,
    r = e.length - 1,
    i = e[n],
    a = e[r],
    o;
  return (
    a < i && ((o = n), (n = r), (r = o), (o = i), (i = a), (a = o)),
    (e[n] = t.floor(i)),
    (e[r] = t.ceil(a)),
    e
  );
}
function fg(e) {
  return Math.log(e);
}
function cg(e) {
  return Math.exp(e);
}
function $E(e) {
  return -Math.log(-e);
}
function TE(e) {
  return -Math.exp(-e);
}
function CE(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function kE(e) {
  return e === 10 ? CE : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function OE(e) {
  return e === Math.E
    ? Math.log
    : (e === 10 && Math.log10) ||
        (e === 2 && Math.log2) ||
        ((e = Math.log(e)), (t) => Math.log(t) / e);
}
function dg(e) {
  return (t, n) => -e(-t, n);
}
function ME(e) {
  const t = e(fg, cg),
    n = t.domain;
  let r = 10,
    i,
    a;
  function o() {
    return (
      (i = OE(r)), (a = kE(r)), n()[0] < 0 ? ((i = dg(i)), (a = dg(a)), e($E, TE)) : e(fg, cg), t
    );
  }
  return (
    (t.base = function (u) {
      return arguments.length ? ((r = +u), o()) : r;
    }),
    (t.domain = function (u) {
      return arguments.length ? (n(u), o()) : n();
    }),
    (t.ticks = (u) => {
      const s = n();
      let l = s[0],
        f = s[s.length - 1];
      const c = f < l;
      c && ([l, f] = [f, l]);
      let d = i(l),
        p = i(f),
        g,
        y;
      const b = u == null ? 10 : +u;
      let h = [];
      if (!(r % 1) && p - d < b) {
        if (((d = Math.floor(d)), (p = Math.ceil(p)), l > 0)) {
          for (; d <= p; ++d)
            for (g = 1; g < r; ++g)
              if (((y = d < 0 ? g / a(-d) : g * a(d)), !(y < l))) {
                if (y > f) break;
                h.push(y);
              }
        } else
          for (; d <= p; ++d)
            for (g = r - 1; g >= 1; --g)
              if (((y = d > 0 ? g / a(-d) : g * a(d)), !(y < l))) {
                if (y > f) break;
                h.push(y);
              }
        h.length * 2 < b && (h = _h(l, f, b));
      } else h = _h(d, p, Math.min(p - d, b)).map(a);
      return c ? h.reverse() : h;
    }),
    (t.tickFormat = (u, s) => {
      if (
        (u == null && (u = 10),
        s == null && (s = r === 10 ? "s" : ","),
        typeof s != "function" &&
          (!(r % 1) && (s = Qo(s)).precision == null && (s.trim = !0), (s = wp(s))),
        u === 1 / 0)
      )
        return s;
      const l = Math.max(1, (r * u) / t.ticks().length);
      return (f) => {
        let c = f / a(Math.round(i(f)));
        return c * r < r - 0.5 && (c *= r), c <= l ? s(f) : "";
      };
    }),
    (t.nice = () =>
      n(Bw(n(), { floor: (u) => a(Math.floor(i(u))), ceil: (u) => a(Math.ceil(i(u))) }))),
    t
  );
}
function Vw() {
  const e = ME(bp()).domain([1, 10]);
  return (e.copy = () => lf(e, Vw()).base(e.base())), si.apply(e, arguments), e;
}
function hg(e) {
  return function (t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function pg(e) {
  return function (t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function PE(e) {
  var t = 1,
    n = e(hg(t), pg(t));
  return (
    (n.constant = function (r) {
      return arguments.length ? e(hg((t = +r)), pg(t)) : t;
    }),
    qw(n)
  );
}
function Qw() {
  var e = PE(bp());
  return (
    (e.copy = function () {
      return lf(e, Qw()).constant(e.constant());
    }),
    si.apply(e, arguments)
  );
}
const Ec = new Date(),
  Ac = new Date();
function Ye(e, t, n, r) {
  function i(a) {
    return e((a = arguments.length === 0 ? new Date() : new Date(+a))), a;
  }
  return (
    (i.floor = (a) => (e((a = new Date(+a))), a)),
    (i.ceil = (a) => (e((a = new Date(a - 1))), t(a, 1), e(a), a)),
    (i.round = (a) => {
      const o = i(a),
        u = i.ceil(a);
      return a - o < u - a ? o : u;
    }),
    (i.offset = (a, o) => (t((a = new Date(+a)), o == null ? 1 : Math.floor(o)), a)),
    (i.range = (a, o, u) => {
      const s = [];
      if (((a = i.ceil(a)), (u = u == null ? 1 : Math.floor(u)), !(a < o) || !(u > 0))) return s;
      let l;
      do s.push((l = new Date(+a))), t(a, u), e(a);
      while (l < a && a < o);
      return s;
    }),
    (i.filter = (a) =>
      Ye(
        (o) => {
          if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
        },
        (o, u) => {
          if (o >= o)
            if (u < 0) for (; ++u <= 0; ) for (; t(o, -1), !a(o); );
            else for (; --u >= 0; ) for (; t(o, 1), !a(o); );
        },
      )),
    n &&
      ((i.count = (a, o) => (Ec.setTime(+a), Ac.setTime(+o), e(Ec), e(Ac), Math.floor(n(Ec, Ac)))),
      (i.every = (a) => (
        (a = Math.floor(a)),
        !isFinite(a) || !(a > 0)
          ? null
          : a > 1
            ? i.filter(r ? (o) => r(o) % a === 0 : (o) => i.count(0, o) % a === 0)
            : i
      ))),
    i
  );
}
const il = Ye(
  () => {},
  (e, t) => {
    e.setTime(+e + t);
  },
  (e, t) => t - e,
);
il.every = (e) => (
  (e = Math.floor(e)),
  !isFinite(e) || !(e > 0)
    ? null
    : e > 1
      ? Ye(
          (t) => {
            t.setTime(Math.floor(t / e) * e);
          },
          (t, n) => {
            t.setTime(+t + n * e);
          },
          (t, n) => (n - t) / e,
        )
      : il
);
il.range;
const In = 1e3,
  Bt = In * 60,
  Ln = Bt * 60,
  Bn = Ln * 24,
  xp = Bn * 7,
  mg = Bn * 30,
  Rc = Bn * 365,
  Wr = Ye(
    (e) => {
      e.setTime(e - e.getMilliseconds());
    },
    (e, t) => {
      e.setTime(+e + t * In);
    },
    (e, t) => (t - e) / In,
    (e) => e.getUTCSeconds(),
  );
Wr.range;
const Sp = Ye(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * In);
  },
  (e, t) => {
    e.setTime(+e + t * Bt);
  },
  (e, t) => (t - e) / Bt,
  (e) => e.getMinutes(),
);
Sp.range;
const $p = Ye(
  (e) => {
    e.setUTCSeconds(0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * Bt);
  },
  (e, t) => (t - e) / Bt,
  (e) => e.getUTCMinutes(),
);
$p.range;
const Tp = Ye(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * In - e.getMinutes() * Bt);
  },
  (e, t) => {
    e.setTime(+e + t * Ln);
  },
  (e, t) => (t - e) / Ln,
  (e) => e.getHours(),
);
Tp.range;
const Cp = Ye(
  (e) => {
    e.setUTCMinutes(0, 0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * Ln);
  },
  (e, t) => (t - e) / Ln,
  (e) => e.getUTCHours(),
);
Cp.range;
const du = Ye(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Bt) / Bn,
  (e) => e.getDate() - 1,
);
du.range;
const ff = Ye(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Bn,
  (e) => e.getUTCDate() - 1,
);
ff.range;
const Yw = Ye(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Bn,
  (e) => Math.floor(e / Bn),
);
Yw.range;
function li(e) {
  return Ye(
    (t) => {
      t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0);
    },
    (t, n) => {
      t.setDate(t.getDate() + n * 7);
    },
    (t, n) => (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Bt) / xp,
  );
}
const cf = li(0),
  al = li(1),
  EE = li(2),
  AE = li(3),
  aa = li(4),
  RE = li(5),
  FE = li(6);
cf.range;
al.range;
EE.range;
AE.range;
aa.range;
RE.range;
FE.range;
function fi(e) {
  return Ye(
    (t) => {
      t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0);
    },
    (t, n) => {
      t.setUTCDate(t.getUTCDate() + n * 7);
    },
    (t, n) => (n - t) / xp,
  );
}
const df = fi(0),
  ol = fi(1),
  DE = fi(2),
  NE = fi(3),
  oa = fi(4),
  IE = fi(5),
  LE = fi(6);
df.range;
ol.range;
DE.range;
NE.range;
oa.range;
IE.range;
LE.range;
const kp = Ye(
  (e) => {
    e.setDate(1), e.setHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setMonth(e.getMonth() + t);
  },
  (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12,
  (e) => e.getMonth(),
);
kp.range;
const Op = Ye(
  (e) => {
    e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCMonth(e.getUTCMonth() + t);
  },
  (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12,
  (e) => e.getUTCMonth(),
);
Op.range;
const Vn = Ye(
  (e) => {
    e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setFullYear(e.getFullYear() + t);
  },
  (e, t) => t.getFullYear() - e.getFullYear(),
  (e) => e.getFullYear(),
);
Vn.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Ye(
        (t) => {
          t.setFullYear(Math.floor(t.getFullYear() / e) * e),
            t.setMonth(0, 1),
            t.setHours(0, 0, 0, 0);
        },
        (t, n) => {
          t.setFullYear(t.getFullYear() + n * e);
        },
      );
Vn.range;
const Qn = Ye(
  (e) => {
    e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  },
  (e, t) => t.getUTCFullYear() - e.getUTCFullYear(),
  (e) => e.getUTCFullYear(),
);
Qn.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Ye(
        (t) => {
          t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
            t.setUTCMonth(0, 1),
            t.setUTCHours(0, 0, 0, 0);
        },
        (t, n) => {
          t.setUTCFullYear(t.getUTCFullYear() + n * e);
        },
      );
Qn.range;
function Gw(e, t, n, r, i, a) {
  const o = [
    [Wr, 1, In],
    [Wr, 5, 5 * In],
    [Wr, 15, 15 * In],
    [Wr, 30, 30 * In],
    [a, 1, Bt],
    [a, 5, 5 * Bt],
    [a, 15, 15 * Bt],
    [a, 30, 30 * Bt],
    [i, 1, Ln],
    [i, 3, 3 * Ln],
    [i, 6, 6 * Ln],
    [i, 12, 12 * Ln],
    [r, 1, Bn],
    [r, 2, 2 * Bn],
    [n, 1, xp],
    [t, 1, mg],
    [t, 3, 3 * mg],
    [e, 1, Rc],
  ];
  function u(l, f, c) {
    const d = f < l;
    d && ([l, f] = [f, l]);
    const p = c && typeof c.range == "function" ? c : s(l, f, c),
      g = p ? p.range(l, +f + 1) : [];
    return d ? g.reverse() : g;
  }
  function s(l, f, c) {
    const d = Math.abs(f - l) / c,
      p = gp(([, , b]) => b).right(o, d);
    if (p === o.length) return e.every(xh(l / Rc, f / Rc, c));
    if (p === 0) return il.every(Math.max(xh(l, f, c), 1));
    const [g, y] = o[d / o[p - 1][2] < o[p][2] / d ? p - 1 : p];
    return g.every(y);
  }
  return [u, s];
}
const [jE, UE] = Gw(Qn, Op, df, Yw, Cp, $p),
  [zE, WE] = Gw(Vn, kp, cf, du, Tp, Sp);
function Fc(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Dc(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function za(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function qE(e) {
  var t = e.dateTime,
    n = e.date,
    r = e.time,
    i = e.periods,
    a = e.days,
    o = e.shortDays,
    u = e.months,
    s = e.shortMonths,
    l = Wa(i),
    f = qa(i),
    c = Wa(a),
    d = qa(a),
    p = Wa(o),
    g = qa(o),
    y = Wa(u),
    b = qa(u),
    h = Wa(s),
    m = qa(s),
    v = {
      a: H,
      A: P,
      b: O,
      B: W,
      c: null,
      d: wg,
      e: wg,
      f: dA,
      g: xA,
      G: $A,
      H: lA,
      I: fA,
      j: cA,
      L: Kw,
      m: hA,
      M: pA,
      p: K,
      q: X,
      Q: $g,
      s: Tg,
      S: mA,
      u: vA,
      U: gA,
      V: yA,
      w: bA,
      W: _A,
      x: null,
      X: null,
      y: wA,
      Y: SA,
      Z: TA,
      "%": Sg,
    },
    _ = {
      a: Oe,
      A: ve,
      b: se,
      B: oe,
      c: null,
      d: xg,
      e: xg,
      f: MA,
      g: jA,
      G: zA,
      H: CA,
      I: kA,
      j: OA,
      L: Zw,
      m: PA,
      M: EA,
      p: te,
      q: tt,
      Q: $g,
      s: Tg,
      S: AA,
      u: RA,
      U: FA,
      V: DA,
      w: NA,
      W: IA,
      x: null,
      X: null,
      y: LA,
      Y: UA,
      Z: WA,
      "%": Sg,
    },
    S = {
      a: R,
      A: E,
      b: q,
      B: I,
      c: F,
      d: bg,
      e: bg,
      f: aA,
      g: yg,
      G: gg,
      H: _g,
      I: _g,
      j: tA,
      L: iA,
      m: eA,
      M: nA,
      p: j,
      q: JE,
      Q: uA,
      s: sA,
      S: rA,
      u: YE,
      U: GE,
      V: KE,
      w: QE,
      W: XE,
      x: D,
      X: z,
      y: yg,
      Y: gg,
      Z: ZE,
      "%": oA,
    };
  (v.x = w(n, v)),
    (v.X = w(r, v)),
    (v.c = w(t, v)),
    (_.x = w(n, _)),
    (_.X = w(r, _)),
    (_.c = w(t, _));
  function w(M, N) {
    return function (V) {
      var x = [],
        re = -1,
        Y = 0,
        le = M.length,
        ce,
        je,
        Lt;
      for (V instanceof Date || (V = new Date(+V)); ++re < le; )
        M.charCodeAt(re) === 37 &&
          (x.push(M.slice(Y, re)),
          (je = vg[(ce = M.charAt(++re))]) != null
            ? (ce = M.charAt(++re))
            : (je = ce === "e" ? " " : "0"),
          (Lt = N[ce]) && (ce = Lt(V, je)),
          x.push(ce),
          (Y = re + 1));
      return x.push(M.slice(Y, re)), x.join("");
    };
  }
  function T(M, N) {
    return function (V) {
      var x = za(1900, void 0, 1),
        re = k(x, M, (V += ""), 0),
        Y,
        le;
      if (re != V.length) return null;
      if ("Q" in x) return new Date(x.Q);
      if ("s" in x) return new Date(x.s * 1e3 + ("L" in x ? x.L : 0));
      if (
        (N && !("Z" in x) && (x.Z = 0),
        "p" in x && (x.H = (x.H % 12) + x.p * 12),
        x.m === void 0 && (x.m = "q" in x ? x.q : 0),
        "V" in x)
      ) {
        if (x.V < 1 || x.V > 53) return null;
        "w" in x || (x.w = 1),
          "Z" in x
            ? ((Y = Dc(za(x.y, 0, 1))),
              (le = Y.getUTCDay()),
              (Y = le > 4 || le === 0 ? ol.ceil(Y) : ol(Y)),
              (Y = ff.offset(Y, (x.V - 1) * 7)),
              (x.y = Y.getUTCFullYear()),
              (x.m = Y.getUTCMonth()),
              (x.d = Y.getUTCDate() + ((x.w + 6) % 7)))
            : ((Y = Fc(za(x.y, 0, 1))),
              (le = Y.getDay()),
              (Y = le > 4 || le === 0 ? al.ceil(Y) : al(Y)),
              (Y = du.offset(Y, (x.V - 1) * 7)),
              (x.y = Y.getFullYear()),
              (x.m = Y.getMonth()),
              (x.d = Y.getDate() + ((x.w + 6) % 7)));
      } else
        ("W" in x || "U" in x) &&
          ("w" in x || (x.w = "u" in x ? x.u % 7 : "W" in x ? 1 : 0),
          (le = "Z" in x ? Dc(za(x.y, 0, 1)).getUTCDay() : Fc(za(x.y, 0, 1)).getDay()),
          (x.m = 0),
          (x.d =
            "W" in x
              ? ((x.w + 6) % 7) + x.W * 7 - ((le + 5) % 7)
              : x.w + x.U * 7 - ((le + 6) % 7)));
      return "Z" in x ? ((x.H += (x.Z / 100) | 0), (x.M += x.Z % 100), Dc(x)) : Fc(x);
    };
  }
  function k(M, N, V, x) {
    for (var re = 0, Y = N.length, le = V.length, ce, je; re < Y; ) {
      if (x >= le) return -1;
      if (((ce = N.charCodeAt(re++)), ce === 37)) {
        if (
          ((ce = N.charAt(re++)),
          (je = S[ce in vg ? N.charAt(re++) : ce]),
          !je || (x = je(M, V, x)) < 0)
        )
          return -1;
      } else if (ce != V.charCodeAt(x++)) return -1;
    }
    return x;
  }
  function j(M, N, V) {
    var x = l.exec(N.slice(V));
    return x ? ((M.p = f.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function R(M, N, V) {
    var x = p.exec(N.slice(V));
    return x ? ((M.w = g.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function E(M, N, V) {
    var x = c.exec(N.slice(V));
    return x ? ((M.w = d.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function q(M, N, V) {
    var x = h.exec(N.slice(V));
    return x ? ((M.m = m.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function I(M, N, V) {
    var x = y.exec(N.slice(V));
    return x ? ((M.m = b.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function F(M, N, V) {
    return k(M, t, N, V);
  }
  function D(M, N, V) {
    return k(M, n, N, V);
  }
  function z(M, N, V) {
    return k(M, r, N, V);
  }
  function H(M) {
    return o[M.getDay()];
  }
  function P(M) {
    return a[M.getDay()];
  }
  function O(M) {
    return s[M.getMonth()];
  }
  function W(M) {
    return u[M.getMonth()];
  }
  function K(M) {
    return i[+(M.getHours() >= 12)];
  }
  function X(M) {
    return 1 + ~~(M.getMonth() / 3);
  }
  function Oe(M) {
    return o[M.getUTCDay()];
  }
  function ve(M) {
    return a[M.getUTCDay()];
  }
  function se(M) {
    return s[M.getUTCMonth()];
  }
  function oe(M) {
    return u[M.getUTCMonth()];
  }
  function te(M) {
    return i[+(M.getUTCHours() >= 12)];
  }
  function tt(M) {
    return 1 + ~~(M.getUTCMonth() / 3);
  }
  return {
    format: function (M) {
      var N = w((M += ""), v);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    parse: function (M) {
      var N = T((M += ""), !1);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    utcFormat: function (M) {
      var N = w((M += ""), _);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    utcParse: function (M) {
      var N = T((M += ""), !0);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
  };
}
var vg = { "-": "", _: " ", 0: "0" },
  Je = /^\s*\d+/,
  HE = /^%/,
  BE = /[\\^$*+?|[\]().{}]/g;
function de(e, t, n) {
  var r = e < 0 ? "-" : "",
    i = (r ? -e : e) + "",
    a = i.length;
  return r + (a < n ? new Array(n - a + 1).join(t) + i : i);
}
function VE(e) {
  return e.replace(BE, "\\$&");
}
function Wa(e) {
  return new RegExp("^(?:" + e.map(VE).join("|") + ")", "i");
}
function qa(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function QE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 1));
  return r ? ((e.w = +r[0]), n + r[0].length) : -1;
}
function YE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 1));
  return r ? ((e.u = +r[0]), n + r[0].length) : -1;
}
function GE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.U = +r[0]), n + r[0].length) : -1;
}
function KE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.V = +r[0]), n + r[0].length) : -1;
}
function XE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.W = +r[0]), n + r[0].length) : -1;
}
function gg(e, t, n) {
  var r = Je.exec(t.slice(n, n + 4));
  return r ? ((e.y = +r[0]), n + r[0].length) : -1;
}
function yg(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3)), n + r[0].length) : -1;
}
function ZE(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? ((e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), n + r[0].length) : -1;
}
function JE(e, t, n) {
  var r = Je.exec(t.slice(n, n + 1));
  return r ? ((e.q = r[0] * 3 - 3), n + r[0].length) : -1;
}
function eA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.m = r[0] - 1), n + r[0].length) : -1;
}
function bg(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.d = +r[0]), n + r[0].length) : -1;
}
function tA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 3));
  return r ? ((e.m = 0), (e.d = +r[0]), n + r[0].length) : -1;
}
function _g(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.H = +r[0]), n + r[0].length) : -1;
}
function nA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.M = +r[0]), n + r[0].length) : -1;
}
function rA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 2));
  return r ? ((e.S = +r[0]), n + r[0].length) : -1;
}
function iA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 3));
  return r ? ((e.L = +r[0]), n + r[0].length) : -1;
}
function aA(e, t, n) {
  var r = Je.exec(t.slice(n, n + 6));
  return r ? ((e.L = Math.floor(r[0] / 1e3)), n + r[0].length) : -1;
}
function oA(e, t, n) {
  var r = HE.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function uA(e, t, n) {
  var r = Je.exec(t.slice(n));
  return r ? ((e.Q = +r[0]), n + r[0].length) : -1;
}
function sA(e, t, n) {
  var r = Je.exec(t.slice(n));
  return r ? ((e.s = +r[0]), n + r[0].length) : -1;
}
function wg(e, t) {
  return de(e.getDate(), t, 2);
}
function lA(e, t) {
  return de(e.getHours(), t, 2);
}
function fA(e, t) {
  return de(e.getHours() % 12 || 12, t, 2);
}
function cA(e, t) {
  return de(1 + du.count(Vn(e), e), t, 3);
}
function Kw(e, t) {
  return de(e.getMilliseconds(), t, 3);
}
function dA(e, t) {
  return Kw(e, t) + "000";
}
function hA(e, t) {
  return de(e.getMonth() + 1, t, 2);
}
function pA(e, t) {
  return de(e.getMinutes(), t, 2);
}
function mA(e, t) {
  return de(e.getSeconds(), t, 2);
}
function vA(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function gA(e, t) {
  return de(cf.count(Vn(e) - 1, e), t, 2);
}
function Xw(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? aa(e) : aa.ceil(e);
}
function yA(e, t) {
  return (e = Xw(e)), de(aa.count(Vn(e), e) + (Vn(e).getDay() === 4), t, 2);
}
function bA(e) {
  return e.getDay();
}
function _A(e, t) {
  return de(al.count(Vn(e) - 1, e), t, 2);
}
function wA(e, t) {
  return de(e.getFullYear() % 100, t, 2);
}
function xA(e, t) {
  return (e = Xw(e)), de(e.getFullYear() % 100, t, 2);
}
function SA(e, t) {
  return de(e.getFullYear() % 1e4, t, 4);
}
function $A(e, t) {
  var n = e.getDay();
  return (e = n >= 4 || n === 0 ? aa(e) : aa.ceil(e)), de(e.getFullYear() % 1e4, t, 4);
}
function TA(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : ((t *= -1), "+")) + de((t / 60) | 0, "0", 2) + de(t % 60, "0", 2);
}
function xg(e, t) {
  return de(e.getUTCDate(), t, 2);
}
function CA(e, t) {
  return de(e.getUTCHours(), t, 2);
}
function kA(e, t) {
  return de(e.getUTCHours() % 12 || 12, t, 2);
}
function OA(e, t) {
  return de(1 + ff.count(Qn(e), e), t, 3);
}
function Zw(e, t) {
  return de(e.getUTCMilliseconds(), t, 3);
}
function MA(e, t) {
  return Zw(e, t) + "000";
}
function PA(e, t) {
  return de(e.getUTCMonth() + 1, t, 2);
}
function EA(e, t) {
  return de(e.getUTCMinutes(), t, 2);
}
function AA(e, t) {
  return de(e.getUTCSeconds(), t, 2);
}
function RA(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function FA(e, t) {
  return de(df.count(Qn(e) - 1, e), t, 2);
}
function Jw(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? oa(e) : oa.ceil(e);
}
function DA(e, t) {
  return (e = Jw(e)), de(oa.count(Qn(e), e) + (Qn(e).getUTCDay() === 4), t, 2);
}
function NA(e) {
  return e.getUTCDay();
}
function IA(e, t) {
  return de(ol.count(Qn(e) - 1, e), t, 2);
}
function LA(e, t) {
  return de(e.getUTCFullYear() % 100, t, 2);
}
function jA(e, t) {
  return (e = Jw(e)), de(e.getUTCFullYear() % 100, t, 2);
}
function UA(e, t) {
  return de(e.getUTCFullYear() % 1e4, t, 4);
}
function zA(e, t) {
  var n = e.getUTCDay();
  return (e = n >= 4 || n === 0 ? oa(e) : oa.ceil(e)), de(e.getUTCFullYear() % 1e4, t, 4);
}
function WA() {
  return "+0000";
}
function Sg() {
  return "%";
}
function $g(e) {
  return +e;
}
function Tg(e) {
  return Math.floor(+e / 1e3);
}
var bi, ex, tx;
qA({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
});
function qA(e) {
  return (bi = qE(e)), (ex = bi.format), bi.parse, (tx = bi.utcFormat), bi.utcParse, bi;
}
function HA(e) {
  return new Date(e);
}
function BA(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Mp(e, t, n, r, i, a, o, u, s, l) {
  var f = Uw(),
    c = f.invert,
    d = f.domain,
    p = l(".%L"),
    g = l(":%S"),
    y = l("%I:%M"),
    b = l("%I %p"),
    h = l("%a %d"),
    m = l("%b %d"),
    v = l("%B"),
    _ = l("%Y");
  function S(w) {
    return (
      s(w) < w
        ? p
        : u(w) < w
          ? g
          : o(w) < w
            ? y
            : a(w) < w
              ? b
              : r(w) < w
                ? i(w) < w
                  ? h
                  : m
                : n(w) < w
                  ? v
                  : _
    )(w);
  }
  return (
    (f.invert = function (w) {
      return new Date(c(w));
    }),
    (f.domain = function (w) {
      return arguments.length ? d(Array.from(w, BA)) : d().map(HA);
    }),
    (f.ticks = function (w) {
      var T = d();
      return e(T[0], T[T.length - 1], w ?? 10);
    }),
    (f.tickFormat = function (w, T) {
      return T == null ? S : l(T);
    }),
    (f.nice = function (w) {
      var T = d();
      return (
        (!w || typeof w.range != "function") && (w = t(T[0], T[T.length - 1], w ?? 10)),
        w ? d(Bw(T, w)) : f
      );
    }),
    (f.copy = function () {
      return lf(f, Mp(e, t, n, r, i, a, o, u, s, l));
    }),
    f
  );
}
function VA() {
  return si.apply(
    Mp(zE, WE, Vn, kp, cf, du, Tp, Sp, Wr, ex).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]),
    arguments,
  );
}
function QA() {
  return si.apply(
    Mp(jE, UE, Qn, Op, df, ff, Cp, $p, Wr, tx).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]),
    arguments,
  );
}
function ne(e) {
  for (var t = (e.length / 6) | 0, n = new Array(t), r = 0; r < t; )
    n[r] = "#" + e.slice(r * 6, ++r * 6);
  return n;
}
const YA = ne("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"),
  GA = ne("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666"),
  KA = ne("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666"),
  XA = ne("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"),
  ZA = ne("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"),
  JA = ne("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc"),
  eR = ne("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999"),
  tR = ne("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3"),
  nx = ne("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f"),
  nR = ne("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab"),
  be = (e) => PP(e[e.length - 1]);
var hf = new Array(3)
  .concat(
    "d8b365f5f5f55ab4ac",
    "a6611adfc27d80cdc1018571",
    "a6611adfc27df5f5f580cdc1018571",
    "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
    "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
    "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
    "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
    "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
    "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30",
  )
  .map(ne);
const rR = be(hf);
var pf = new Array(3)
  .concat(
    "af8dc3f7f7f77fbf7b",
    "7b3294c2a5cfa6dba0008837",
    "7b3294c2a5cff7f7f7a6dba0008837",
    "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
    "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
    "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
    "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
    "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
    "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b",
  )
  .map(ne);
const iR = be(pf);
var mf = new Array(3)
  .concat(
    "e9a3c9f7f7f7a1d76a",
    "d01c8bf1b6dab8e1864dac26",
    "d01c8bf1b6daf7f7f7b8e1864dac26",
    "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
    "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
    "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
    "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
    "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
    "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419",
  )
  .map(ne);
const aR = be(mf);
var vf = new Array(3)
  .concat(
    "998ec3f7f7f7f1a340",
    "5e3c99b2abd2fdb863e66101",
    "5e3c99b2abd2f7f7f7fdb863e66101",
    "542788998ec3d8daebfee0b6f1a340b35806",
    "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
    "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
    "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
    "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
    "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08",
  )
  .map(ne);
const oR = be(vf);
var gf = new Array(3)
  .concat(
    "ef8a62f7f7f767a9cf",
    "ca0020f4a58292c5de0571b0",
    "ca0020f4a582f7f7f792c5de0571b0",
    "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
    "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
    "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
    "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
    "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
    "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061",
  )
  .map(ne);
const uR = be(gf);
var yf = new Array(3)
  .concat(
    "ef8a62ffffff999999",
    "ca0020f4a582bababa404040",
    "ca0020f4a582ffffffbababa404040",
    "b2182bef8a62fddbc7e0e0e09999994d4d4d",
    "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
    "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
    "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
    "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
    "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a",
  )
  .map(ne);
const sR = be(yf);
var bf = new Array(3)
  .concat(
    "fc8d59ffffbf91bfdb",
    "d7191cfdae61abd9e92c7bb6",
    "d7191cfdae61ffffbfabd9e92c7bb6",
    "d73027fc8d59fee090e0f3f891bfdb4575b4",
    "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
    "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
    "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
    "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
    "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695",
  )
  .map(ne);
const lR = be(bf);
var _f = new Array(3)
  .concat(
    "fc8d59ffffbf91cf60",
    "d7191cfdae61a6d96a1a9641",
    "d7191cfdae61ffffbfa6d96a1a9641",
    "d73027fc8d59fee08bd9ef8b91cf601a9850",
    "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
    "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
    "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
    "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
    "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837",
  )
  .map(ne);
const fR = be(_f);
var wf = new Array(3)
  .concat(
    "fc8d59ffffbf99d594",
    "d7191cfdae61abdda42b83ba",
    "d7191cfdae61ffffbfabdda42b83ba",
    "d53e4ffc8d59fee08be6f59899d5943288bd",
    "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
    "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
    "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
    "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
    "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2",
  )
  .map(ne);
const cR = be(wf);
var xf = new Array(3)
  .concat(
    "e5f5f999d8c92ca25f",
    "edf8fbb2e2e266c2a4238b45",
    "edf8fbb2e2e266c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b",
  )
  .map(ne);
const dR = be(xf);
var Sf = new Array(3)
  .concat(
    "e0ecf49ebcda8856a7",
    "edf8fbb3cde38c96c688419d",
    "edf8fbb3cde38c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b",
  )
  .map(ne);
const hR = be(Sf);
var $f = new Array(3)
  .concat(
    "e0f3dba8ddb543a2ca",
    "f0f9e8bae4bc7bccc42b8cbe",
    "f0f9e8bae4bc7bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081",
  )
  .map(ne);
const pR = be($f);
var Tf = new Array(3)
  .concat(
    "fee8c8fdbb84e34a33",
    "fef0d9fdcc8afc8d59d7301f",
    "fef0d9fdcc8afc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000",
  )
  .map(ne);
const mR = be(Tf);
var Cf = new Array(3)
  .concat(
    "ece2f0a6bddb1c9099",
    "f6eff7bdc9e167a9cf02818a",
    "f6eff7bdc9e167a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636",
  )
  .map(ne);
const vR = be(Cf);
var kf = new Array(3)
  .concat(
    "ece7f2a6bddb2b8cbe",
    "f1eef6bdc9e174a9cf0570b0",
    "f1eef6bdc9e174a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858",
  )
  .map(ne);
const gR = be(kf);
var Of = new Array(3)
  .concat(
    "e7e1efc994c7dd1c77",
    "f1eef6d7b5d8df65b0ce1256",
    "f1eef6d7b5d8df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f",
  )
  .map(ne);
const yR = be(Of);
var Mf = new Array(3)
  .concat(
    "fde0ddfa9fb5c51b8a",
    "feebe2fbb4b9f768a1ae017e",
    "feebe2fbb4b9f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a",
  )
  .map(ne);
const bR = be(Mf);
var Pf = new Array(3)
  .concat(
    "edf8b17fcdbb2c7fb8",
    "ffffcca1dab441b6c4225ea8",
    "ffffcca1dab441b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58",
  )
  .map(ne);
const _R = be(Pf);
var Ef = new Array(3)
  .concat(
    "f7fcb9addd8e31a354",
    "ffffccc2e69978c679238443",
    "ffffccc2e69978c67931a354006837",
    "ffffccd9f0a3addd8e78c67931a354006837",
    "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529",
  )
  .map(ne);
const wR = be(Ef);
var Af = new Array(3)
  .concat(
    "fff7bcfec44fd95f0e",
    "ffffd4fed98efe9929cc4c02",
    "ffffd4fed98efe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506",
  )
  .map(ne);
const xR = be(Af);
var Rf = new Array(3)
  .concat(
    "ffeda0feb24cf03b20",
    "ffffb2fecc5cfd8d3ce31a1c",
    "ffffb2fecc5cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026",
  )
  .map(ne);
const SR = be(Rf);
var Ff = new Array(3)
  .concat(
    "deebf79ecae13182bd",
    "eff3ffbdd7e76baed62171b5",
    "eff3ffbdd7e76baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b",
  )
  .map(ne);
const $R = be(Ff);
var Df = new Array(3)
  .concat(
    "e5f5e0a1d99b31a354",
    "edf8e9bae4b374c476238b45",
    "edf8e9bae4b374c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b",
  )
  .map(ne);
const TR = be(Df);
var Nf = new Array(3)
  .concat(
    "f0f0f0bdbdbd636363",
    "f7f7f7cccccc969696525252",
    "f7f7f7cccccc969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000",
  )
  .map(ne);
const CR = be(Nf);
var If = new Array(3)
  .concat(
    "efedf5bcbddc756bb1",
    "f2f0f7cbc9e29e9ac86a51a3",
    "f2f0f7cbc9e29e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d",
  )
  .map(ne);
const kR = be(If);
var Lf = new Array(3)
  .concat(
    "fee0d2fc9272de2d26",
    "fee5d9fcae91fb6a4acb181d",
    "fee5d9fcae91fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d",
  )
  .map(ne);
const OR = be(Lf);
var jf = new Array(3)
  .concat(
    "fee6cefdae6be6550d",
    "feeddefdbe85fd8d3cd94701",
    "feeddefdbe85fd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704",
  )
  .map(ne);
const MR = be(jf);
function PR(e) {
  return (
    (e = Math.max(0, Math.min(1, e))),
    "rgb(" +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            -4.54 - e * (35.34 - e * (2381.73 - e * (6402.7 - e * (7024.72 - e * 2710.57)))),
          ),
        ),
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(32.49 + e * (170.73 + e * (52.82 - e * (131.46 - e * (176.58 - e * 67.37))))),
        ),
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            81.24 + e * (442.36 - e * (2482.43 - e * (6167.24 - e * (6614.94 - e * 2475.67)))),
          ),
        ),
      ) +
      ")"
  );
}
const ER = vp(Cn(300, 0.5, 0), Cn(-240, 0.5, 1));
var AR = vp(Cn(-100, 0.75, 0.35), Cn(80, 1.5, 0.8)),
  RR = vp(Cn(260, 0.75, 0.35), Cn(80, 1.5, 0.8)),
  Hu = Cn();
function FR(e) {
  (e < 0 || e > 1) && (e -= Math.floor(e));
  var t = Math.abs(e - 0.5);
  return (Hu.h = 360 * e - 100), (Hu.s = 1.5 - 1.5 * t), (Hu.l = 0.8 - 0.9 * t), Hu + "";
}
var Bu = ra(),
  DR = Math.PI / 3,
  NR = (Math.PI * 2) / 3;
function IR(e) {
  var t;
  return (
    (e = (0.5 - e) * Math.PI),
    (Bu.r = 255 * (t = Math.sin(e)) * t),
    (Bu.g = 255 * (t = Math.sin(e + DR)) * t),
    (Bu.b = 255 * (t = Math.sin(e + NR)) * t),
    Bu + ""
  );
}
function LR(e) {
  return (
    (e = Math.max(0, Math.min(1, e))),
    "rgb(" +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            34.61 + e * (1172.33 - e * (10793.56 - e * (33300.12 - e * (38394.49 - e * 14825.05)))),
          ),
        ),
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            23.31 + e * (557.33 + e * (1225.33 - e * (3574.96 - e * (1073.77 + e * 707.56)))),
          ),
        ),
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            27.2 + e * (3211.1 - e * (15327.97 - e * (27814 - e * (22569.18 - e * 6838.66)))),
          ),
        ),
      ) +
      ")"
  );
}
function Uf(e) {
  var t = e.length;
  return function (n) {
    return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
  };
}
const jR = Uf(
  ne(
    "44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725",
  ),
);
var UR = Uf(
    ne(
      "00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf",
    ),
  ),
  zR = Uf(
    ne(
      "00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4",
    ),
  ),
  WR = Uf(
    ne(
      "0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921",
    ),
  ),
  qR = "__lodash_hash_undefined__";
function HR(e) {
  return this.__data__.set(e, qR), this;
}
var BR = HR;
function VR(e) {
  return this.__data__.has(e);
}
var QR = VR,
  YR = ep,
  GR = BR,
  KR = QR;
function ul(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.__data__ = new YR(); ++t < n; ) this.add(e[t]);
}
ul.prototype.add = ul.prototype.push = GR;
ul.prototype.has = KR;
var Pp = ul;
function XR(e, t, n, r) {
  for (var i = e.length, a = n + (r ? 1 : -1); r ? a-- : ++a < i; ) if (t(e[a], a, e)) return a;
  return -1;
}
var ZR = XR;
function JR(e) {
  return e !== e;
}
var eF = JR;
function tF(e, t, n) {
  for (var r = n - 1, i = e.length; ++r < i; ) if (e[r] === t) return r;
  return -1;
}
var nF = tF,
  rF = ZR,
  iF = eF,
  aF = nF;
function oF(e, t, n) {
  return t === t ? aF(e, t, n) : rF(e, iF, n);
}
var uF = oF,
  sF = uF;
function lF(e, t) {
  var n = e == null ? 0 : e.length;
  return !!n && sF(e, t, 0) > -1;
}
var rx = lF;
function fF(e, t, n) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; ) if (n(t, e[r])) return !0;
  return !1;
}
var ix = fF;
function cF(e, t) {
  return e.has(t);
}
var Ep = cF,
  dF = Pp,
  hF = rx,
  pF = ix,
  mF = af,
  vF = lu,
  gF = Ep,
  yF = 200;
function bF(e, t, n, r) {
  var i = -1,
    a = hF,
    o = !0,
    u = e.length,
    s = [],
    l = t.length;
  if (!u) return s;
  n && (t = mF(t, vF(n))),
    r ? ((a = pF), (o = !1)) : t.length >= yF && ((a = gF), (o = !1), (t = new dF(t)));
  e: for (; ++i < u; ) {
    var f = e[i],
      c = n == null ? f : n(f);
    if (((f = r || f !== 0 ? f : 0), o && c === c)) {
      for (var d = l; d--; ) if (t[d] === c) continue e;
      s.push(f);
    } else a(t, c, r) || s.push(f);
  }
  return s;
}
var _F = bF,
  wF = _F,
  xF = lp,
  SF = _w,
  $F = xF(function (e, t) {
    return SF(e) ? wF(e, t) : [];
  }),
  TF = $F;
const ax = gt(TF);
function Vu(e) {
  return function () {
    return e;
  };
}
const Cg = 1e-12;
function CF(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function ox(e) {
  this._context = e;
}
ox.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(e, t);
        break;
    }
  },
};
function kF(e) {
  return new ox(e);
}
function xr() {}
function sl(e, t, n) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + n) / 6,
  );
}
function zf(e) {
  this._context = e;
}
zf.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        sl(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        (this._point = 3),
          this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        sl(this, e, t);
        break;
    }
    (this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t);
  },
};
function OF(e) {
  return new zf(e);
}
function ux(e) {
  this._context = e;
}
ux.prototype = {
  areaStart: xr,
  areaEnd: xr,
  lineStart: function () {
    (this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
        NaN),
      (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
          this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2),
          this.point(this._x3, this._y3),
          this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), (this._x2 = e), (this._y2 = t);
        break;
      case 1:
        (this._point = 2), (this._x3 = e), (this._y3 = t);
        break;
      case 2:
        (this._point = 3),
          (this._x4 = e),
          (this._y4 = t),
          this._context.moveTo(
            (this._x0 + 4 * this._x1 + e) / 6,
            (this._y0 + 4 * this._y1 + t) / 6,
          );
        break;
      default:
        sl(this, e, t);
        break;
    }
    (this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t);
  },
};
function MF(e) {
  return new ux(e);
}
function sx(e) {
  this._context = e;
}
sx.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var n = (this._x0 + 4 * this._x1 + e) / 6,
          r = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
        break;
      case 3:
        this._point = 4;
      default:
        sl(this, e, t);
        break;
    }
    (this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t);
  },
};
function PF(e) {
  return new sx(e);
}
function lx(e, t) {
  (this._basis = new zf(e)), (this._beta = t);
}
lx.prototype = {
  lineStart: function () {
    (this._x = []), (this._y = []), this._basis.lineStart();
  },
  lineEnd: function () {
    var e = this._x,
      t = this._y,
      n = e.length - 1;
    if (n > 0)
      for (var r = e[0], i = t[0], a = e[n] - r, o = t[n] - i, u = -1, s; ++u <= n; )
        (s = u / n),
          this._basis.point(
            this._beta * e[u] + (1 - this._beta) * (r + s * a),
            this._beta * t[u] + (1 - this._beta) * (i + s * o),
          );
    (this._x = this._y = null), this._basis.lineEnd();
  },
  point: function (e, t) {
    this._x.push(+e), this._y.push(+t);
  },
};
const EF = (function e(t) {
  function n(r) {
    return t === 1 ? new zf(r) : new lx(r, t);
  }
  return (
    (n.beta = function (r) {
      return e(+r);
    }),
    n
  );
})(0.85);
function ll(e, t, n) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - n),
    e._x2,
    e._y2,
  );
}
function Ap(e, t) {
  (this._context = e), (this._k = (1 - t) / 6);
}
Ap.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        ll(this, this._x1, this._y1);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        (this._point = 2), (this._x1 = e), (this._y1 = t);
        break;
      case 2:
        this._point = 3;
      default:
        ll(this, e, t);
        break;
    }
    (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const AF = (function e(t) {
  function n(r) {
    return new Ap(r, t);
  }
  return (
    (n.tension = function (r) {
      return e(+r);
    }),
    n
  );
})(0);
function Rp(e, t) {
  (this._context = e), (this._k = (1 - t) / 6);
}
Rp.prototype = {
  areaStart: xr,
  areaEnd: xr,
  lineStart: function () {
    (this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._x5 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
      this._y5 =
        NaN),
      (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3),
          this.point(this._x4, this._y4),
          this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), (this._x3 = e), (this._y3 = t);
        break;
      case 1:
        (this._point = 2), this._context.moveTo((this._x4 = e), (this._y4 = t));
        break;
      case 2:
        (this._point = 3), (this._x5 = e), (this._y5 = t);
        break;
      default:
        ll(this, e, t);
        break;
    }
    (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const RF = (function e(t) {
  function n(r) {
    return new Rp(r, t);
  }
  return (
    (n.tension = function (r) {
      return e(+r);
    }),
    n
  );
})(0);
function Fp(e, t) {
  (this._context = e), (this._k = (1 - t) / 6);
}
Fp.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        (this._point = 3),
          this._line
            ? this._context.lineTo(this._x2, this._y2)
            : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        ll(this, e, t);
        break;
    }
    (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const FF = (function e(t) {
  function n(r) {
    return new Fp(r, t);
  }
  return (
    (n.tension = function (r) {
      return e(+r);
    }),
    n
  );
})(0);
function Dp(e, t, n) {
  var r = e._x1,
    i = e._y1,
    a = e._x2,
    o = e._y2;
  if (e._l01_a > Cg) {
    var u = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a,
      s = 3 * e._l01_a * (e._l01_a + e._l12_a);
    (r = (r * u - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / s),
      (i = (i * u - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / s);
  }
  if (e._l23_a > Cg) {
    var l = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a,
      f = 3 * e._l23_a * (e._l23_a + e._l12_a);
    (a = (a * l + e._x1 * e._l23_2a - t * e._l12_2a) / f),
      (o = (o * l + e._y1 * e._l23_2a - n * e._l12_2a) / f);
  }
  e._context.bezierCurveTo(r, i, a, o, e._x2, e._y2);
}
function fx(e, t) {
  (this._context = e), (this._alpha = t);
}
fx.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
      (this._l01_a =
        this._l12_a =
        this._l23_a =
        this._l01_2a =
        this._l12_2a =
        this._l23_2a =
        this._point =
          0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    if (((e = +e), (t = +t), this._point)) {
      var n = this._x2 - e,
        r = this._y2 - t;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(n * n + r * r, this._alpha)));
    }
    switch (this._point) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        Dp(this, e, t);
        break;
    }
    (this._l01_a = this._l12_a),
      (this._l12_a = this._l23_a),
      (this._l01_2a = this._l12_2a),
      (this._l12_2a = this._l23_2a),
      (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const DF = (function e(t) {
  function n(r) {
    return t ? new fx(r, t) : new Ap(r, 0);
  }
  return (
    (n.alpha = function (r) {
      return e(+r);
    }),
    n
  );
})(0.5);
function cx(e, t) {
  (this._context = e), (this._alpha = t);
}
cx.prototype = {
  areaStart: xr,
  areaEnd: xr,
  lineStart: function () {
    (this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._x5 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
      this._y5 =
        NaN),
      (this._l01_a =
        this._l12_a =
        this._l23_a =
        this._l01_2a =
        this._l12_2a =
        this._l23_2a =
        this._point =
          0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3),
          this.point(this._x4, this._y4),
          this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function (e, t) {
    if (((e = +e), (t = +t), this._point)) {
      var n = this._x2 - e,
        r = this._y2 - t;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(n * n + r * r, this._alpha)));
    }
    switch (this._point) {
      case 0:
        (this._point = 1), (this._x3 = e), (this._y3 = t);
        break;
      case 1:
        (this._point = 2), this._context.moveTo((this._x4 = e), (this._y4 = t));
        break;
      case 2:
        (this._point = 3), (this._x5 = e), (this._y5 = t);
        break;
      default:
        Dp(this, e, t);
        break;
    }
    (this._l01_a = this._l12_a),
      (this._l12_a = this._l23_a),
      (this._l01_2a = this._l12_2a),
      (this._l12_2a = this._l23_2a),
      (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const NF = (function e(t) {
  function n(r) {
    return t ? new cx(r, t) : new Rp(r, 0);
  }
  return (
    (n.alpha = function (r) {
      return e(+r);
    }),
    n
  );
})(0.5);
function dx(e, t) {
  (this._context = e), (this._alpha = t);
}
dx.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
      (this._l01_a =
        this._l12_a =
        this._l23_a =
        this._l01_2a =
        this._l12_2a =
        this._l23_2a =
        this._point =
          0);
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    if (((e = +e), (t = +t), this._point)) {
      var n = this._x2 - e,
        r = this._y2 - t;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(n * n + r * r, this._alpha)));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        (this._point = 3),
          this._line
            ? this._context.lineTo(this._x2, this._y2)
            : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        Dp(this, e, t);
        break;
    }
    (this._l01_a = this._l12_a),
      (this._l12_a = this._l23_a),
      (this._l01_2a = this._l12_2a),
      (this._l12_2a = this._l23_2a),
      (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = e),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const IF = (function e(t) {
  function n(r) {
    return t ? new dx(r, t) : new Fp(r, 0);
  }
  return (
    (n.alpha = function (r) {
      return e(+r);
    }),
    n
  );
})(0.5);
function hx(e) {
  this._context = e;
}
hx.prototype = {
  areaStart: xr,
  areaEnd: xr,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    this._point && this._context.closePath();
  },
  point: function (e, t) {
    (e = +e),
      (t = +t),
      this._point ? this._context.lineTo(e, t) : ((this._point = 1), this._context.moveTo(e, t));
  },
};
function LF(e) {
  return new hx(e);
}
function kg(e) {
  return e < 0 ? -1 : 1;
}
function Og(e, t, n) {
  var r = e._x1 - e._x0,
    i = t - e._x1,
    a = (e._y1 - e._y0) / (r || (i < 0 && -0)),
    o = (n - e._y1) / (i || (r < 0 && -0)),
    u = (a * i + o * r) / (r + i);
  return (kg(a) + kg(o)) * Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs(u)) || 0;
}
function Mg(e, t) {
  var n = e._x1 - e._x0;
  return n ? ((3 * (e._y1 - e._y0)) / n - t) / 2 : t;
}
function Nc(e, t, n) {
  var r = e._x0,
    i = e._y0,
    a = e._x1,
    o = e._y1,
    u = (a - r) / 3;
  e._context.bezierCurveTo(r + u, i + u * t, a - u, o - u * n, a, o);
}
function fl(e) {
  this._context = e;
}
fl.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Nc(this, this._t0, Mg(this, this._t0));
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (e, t) {
    var n = NaN;
    if (((e = +e), (t = +t), !(e === this._x1 && t === this._y1))) {
      switch (this._point) {
        case 0:
          (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          (this._point = 3), Nc(this, Mg(this, (n = Og(this, e, t))), n);
          break;
        default:
          Nc(this, this._t0, (n = Og(this, e, t)));
          break;
      }
      (this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t), (this._t0 = n);
    }
  },
};
function px(e) {
  this._context = new mx(e);
}
(px.prototype = Object.create(fl.prototype)).point = function (e, t) {
  fl.prototype.point.call(this, t, e);
};
function mx(e) {
  this._context = e;
}
mx.prototype = {
  moveTo: function (e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function (e, t, n, r, i, a) {
    this._context.bezierCurveTo(t, e, r, n, a, i);
  },
};
function jF(e) {
  return new fl(e);
}
function UF(e) {
  return new px(e);
}
function vx(e) {
  this._context = e;
}
vx.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x = []), (this._y = []);
  },
  lineEnd: function () {
    var e = this._x,
      t = this._y,
      n = e.length;
    if (n)
      if (
        (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2)
      )
        this._context.lineTo(e[1], t[1]);
      else
        for (var r = Pg(e), i = Pg(t), a = 0, o = 1; o < n; ++a, ++o)
          this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
    (this._line || (this._line !== 0 && n === 1)) && this._context.closePath(),
      (this._line = 1 - this._line),
      (this._x = this._y = null);
  },
  point: function (e, t) {
    this._x.push(+e), this._y.push(+t);
  },
};
function Pg(e) {
  var t,
    n = e.length - 1,
    r,
    i = new Array(n),
    a = new Array(n),
    o = new Array(n);
  for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t)
    (i[t] = 1), (a[t] = 4), (o[t] = 4 * e[t] + 2 * e[t + 1]);
  for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t)
    (r = i[t] / a[t - 1]), (a[t] -= r), (o[t] -= r * o[t - 1]);
  for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
  for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
  return [i, a];
}
function zF(e) {
  return new vx(e);
}
function Wf(e, t) {
  (this._context = e), (this._t = t);
}
Wf.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x = this._y = NaN), (this._point = 0);
  },
  lineEnd: function () {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y),
      (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var n = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(n, this._y), this._context.lineTo(n, t);
        }
        break;
      }
    }
    (this._x = e), (this._y = t);
  },
};
function WF(e) {
  return new Wf(e, 0.5);
}
function qF(e) {
  return new Wf(e, 0);
}
function HF(e) {
  return new Wf(e, 1);
}
function Eg(e, t) {
  if ((o = e.length) > 1)
    for (var n = 1, r, i, a = e[t[0]], o, u = a.length; n < o; ++n)
      for (i = a, a = e[t[n]], r = 0; r < u; ++r)
        a[r][1] += a[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
function Ag(e) {
  for (var t = e.length, n = new Array(t); --t >= 0; ) n[t] = t;
  return n;
}
function BF(e, t) {
  return e[t];
}
function VF(e) {
  const t = [];
  return (t.key = e), t;
}
function QF() {
  var e = Vu([]),
    t = Ag,
    n = Eg,
    r = BF;
  function i(a) {
    var o = Array.from(e.apply(this, arguments), VF),
      u,
      s = o.length,
      l = -1,
      f;
    for (const c of a) for (u = 0, ++l; u < s; ++u) (o[u][l] = [0, +r(c, o[u].key, l, a)]).data = c;
    for (u = 0, f = CF(t(o)); u < s; ++u) o[f[u]].index = u;
    return n(o, f), o;
  }
  return (
    (i.keys = function (a) {
      return arguments.length ? ((e = typeof a == "function" ? a : Vu(Array.from(a))), i) : e;
    }),
    (i.value = function (a) {
      return arguments.length ? ((r = typeof a == "function" ? a : Vu(+a)), i) : r;
    }),
    (i.order = function (a) {
      return arguments.length
        ? ((t = a == null ? Ag : typeof a == "function" ? a : Vu(Array.from(a))), i)
        : t;
    }),
    (i.offset = function (a) {
      return arguments.length ? ((n = a ?? Eg), i) : n;
    }),
    i
  );
}
function YF(e, t) {
  if ((s = e.length) > 0)
    for (var n, r = 0, i, a, o, u, s, l = e[t[0]].length; r < l; ++r)
      for (o = u = 0, n = 0; n < s; ++n)
        (a = (i = e[t[n]][r])[1] - i[0]) > 0
          ? ((i[0] = o), (i[1] = o += a))
          : a < 0
            ? ((i[1] = u), (i[0] = u += a))
            : ((i[0] = 0), (i[1] = a));
}
function GF(e) {
  return Math.abs((e = Math.round(e))) >= 1e21
    ? e.toLocaleString("en").replace(/,/g, "")
    : e.toString(10);
}
function cl(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n,
    r = e.slice(0, n);
  return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
function KF(e) {
  return (e = cl(Math.abs(e))), e ? e[1] : NaN;
}
function XF(e, t) {
  return function (n, r) {
    for (
      var i = n.length, a = [], o = 0, u = e[0], s = 0;
      i > 0 &&
      u > 0 &&
      (s + u + 1 > r && (u = Math.max(1, r - s)),
      a.push(n.substring((i -= u), i + u)),
      !((s += u + 1) > r));

    )
      u = e[(o = (o + 1) % e.length)];
    return a.reverse().join(t);
  };
}
function ZF(e) {
  return function (t) {
    return t.replace(/[0-9]/g, function (n) {
      return e[+n];
    });
  };
}
var JF = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function $h(e) {
  if (!(t = JF.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Np({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
$h.prototype = Np.prototype;
function Np(e) {
  (this.fill = e.fill === void 0 ? " " : e.fill + ""),
    (this.align = e.align === void 0 ? ">" : e.align + ""),
    (this.sign = e.sign === void 0 ? "-" : e.sign + ""),
    (this.symbol = e.symbol === void 0 ? "" : e.symbol + ""),
    (this.zero = !!e.zero),
    (this.width = e.width === void 0 ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = e.precision === void 0 ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = e.type === void 0 ? "" : e.type + "");
}
Np.prototype.toString = function () {
  return (
    this.fill +
    this.align +
    this.sign +
    this.symbol +
    (this.zero ? "0" : "") +
    (this.width === void 0 ? "" : Math.max(1, this.width | 0)) +
    (this.comma ? "," : "") +
    (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) +
    (this.trim ? "~" : "") +
    this.type
  );
};
function eD(e) {
  e: for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
    switch (e[n]) {
      case ".":
        r = i = n;
        break;
      case "0":
        r === 0 && (r = n), (i = n);
        break;
      default:
        if (!+e[n]) break e;
        r > 0 && (r = 0);
        break;
    }
  return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var gx;
function tD(e, t) {
  var n = cl(e, t);
  if (!n) return e + "";
  var r = n[0],
    i = n[1],
    a = i - (gx = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
    o = r.length;
  return a === o
    ? r
    : a > o
      ? r + new Array(a - o + 1).join("0")
      : a > 0
        ? r.slice(0, a) + "." + r.slice(a)
        : "0." + new Array(1 - a).join("0") + cl(e, Math.max(0, t + a - 1))[0];
}
function Rg(e, t) {
  var n = cl(e, t);
  if (!n) return e + "";
  var r = n[0],
    i = n[1];
  return i < 0
    ? "0." + new Array(-i).join("0") + r
    : r.length > i + 1
      ? r.slice(0, i + 1) + "." + r.slice(i + 1)
      : r + new Array(i - r.length + 2).join("0");
}
const Fg = {
  "%": function (e, t) {
    return (e * 100).toFixed(t);
  },
  b: function (e) {
    return Math.round(e).toString(2);
  },
  c: function (e) {
    return e + "";
  },
  d: GF,
  e: function (e, t) {
    return e.toExponential(t);
  },
  f: function (e, t) {
    return e.toFixed(t);
  },
  g: function (e, t) {
    return e.toPrecision(t);
  },
  o: function (e) {
    return Math.round(e).toString(8);
  },
  p: function (e, t) {
    return Rg(e * 100, t);
  },
  r: Rg,
  s: tD,
  X: function (e) {
    return Math.round(e).toString(16).toUpperCase();
  },
  x: function (e) {
    return Math.round(e).toString(16);
  },
};
function Dg(e) {
  return e;
}
var Ng = Array.prototype.map,
  Ig = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function nD(e) {
  var t =
      e.grouping === void 0 || e.thousands === void 0
        ? Dg
        : XF(Ng.call(e.grouping, Number), e.thousands + ""),
    n = e.currency === void 0 ? "" : e.currency[0] + "",
    r = e.currency === void 0 ? "" : e.currency[1] + "",
    i = e.decimal + "",
    a = e.numerals === void 0 ? Dg : ZF(Ng.call(e.numerals, String)),
    o = e.percent === void 0 ? "%" : e.percent + "",
    u = e.minus + "",
    s = e.nan === void 0 ? "NaN" : e.nan + "";
  function l(c) {
    c = $h(c);
    var d = c.fill,
      p = c.align,
      g = c.sign,
      y = c.symbol,
      b = c.zero,
      h = c.width,
      m = c.comma,
      v = c.precision,
      _ = c.trim,
      S = c.type;
    S === "n" ? ((m = !0), (S = "g")) : Fg[S] || (v === void 0 && (v = 12), (_ = !0), (S = "g")),
      (b || (d === "0" && p === "=")) && ((b = !0), (d = "0"), (p = "="));
    var w = y === "$" ? n : y === "#" && /[boxX]/.test(S) ? "0" + S.toLowerCase() : "",
      T = y === "$" ? r : /[%p]/.test(S) ? o : "",
      k = Fg[S],
      j = /[defgprs%]/.test(S);
    v =
      v === void 0
        ? 6
        : /[gprs]/.test(S)
          ? Math.max(1, Math.min(21, v))
          : Math.max(0, Math.min(20, v));
    function R(E) {
      var q = w,
        I = T,
        F,
        D,
        z;
      if (S === "c") (I = k(E) + I), (E = "");
      else {
        E = +E;
        var H = E < 0 || 1 / E < 0;
        if (
          ((E = isNaN(E) ? s : k(Math.abs(E), v)),
          _ && (E = eD(E)),
          H && +E == 0 && g !== "+" && (H = !1),
          (q = (H ? (g === "(" ? g : u) : g === "-" || g === "(" ? "" : g) + q),
          (I = (S === "s" ? Ig[8 + gx / 3] : "") + I + (H && g === "(" ? ")" : "")),
          j)
        ) {
          for (F = -1, D = E.length; ++F < D; )
            if (((z = E.charCodeAt(F)), 48 > z || z > 57)) {
              (I = (z === 46 ? i + E.slice(F + 1) : E.slice(F)) + I), (E = E.slice(0, F));
              break;
            }
        }
      }
      m && !b && (E = t(E, 1 / 0));
      var P = q.length + E.length + I.length,
        O = P < h ? new Array(h - P + 1).join(d) : "";
      switch ((m && b && ((E = t(O + E, O.length ? h - I.length : 1 / 0)), (O = "")), p)) {
        case "<":
          E = q + E + I + O;
          break;
        case "=":
          E = q + O + E + I;
          break;
        case "^":
          E = O.slice(0, (P = O.length >> 1)) + q + E + I + O.slice(P);
          break;
        default:
          E = O + q + E + I;
          break;
      }
      return a(E);
    }
    return (
      (R.toString = function () {
        return c + "";
      }),
      R
    );
  }
  function f(c, d) {
    var p = l(((c = $h(c)), (c.type = "f"), c)),
      g = Math.max(-8, Math.min(8, Math.floor(KF(d) / 3))) * 3,
      y = Math.pow(10, -g),
      b = Ig[8 + g / 3];
    return function (h) {
      return p(y * h) + b;
    };
  }
  return { format: l, formatPrefix: f };
}
var Qu, Ip;
rD({ decimal: ".", thousands: ",", grouping: [3], currency: ["$", ""], minus: "-" });
function rD(e) {
  return (Qu = nD(e)), (Ip = Qu.format), Qu.formatPrefix, Qu;
}
var Ic = new Date(),
  Lc = new Date();
function Gn(e, t, n, r) {
  function i(a) {
    return e((a = arguments.length === 0 ? new Date() : new Date(+a))), a;
  }
  return (
    (i.floor = function (a) {
      return e((a = new Date(+a))), a;
    }),
    (i.ceil = function (a) {
      return e((a = new Date(a - 1))), t(a, 1), e(a), a;
    }),
    (i.round = function (a) {
      var o = i(a),
        u = i.ceil(a);
      return a - o < u - a ? o : u;
    }),
    (i.offset = function (a, o) {
      return t((a = new Date(+a)), o == null ? 1 : Math.floor(o)), a;
    }),
    (i.range = function (a, o, u) {
      var s = [],
        l;
      if (((a = i.ceil(a)), (u = u == null ? 1 : Math.floor(u)), !(a < o) || !(u > 0))) return s;
      do s.push((l = new Date(+a))), t(a, u), e(a);
      while (l < a && a < o);
      return s;
    }),
    (i.filter = function (a) {
      return Gn(
        function (o) {
          if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
        },
        function (o, u) {
          if (o >= o)
            if (u < 0) for (; ++u <= 0; ) for (; t(o, -1), !a(o); );
            else for (; --u >= 0; ) for (; t(o, 1), !a(o); );
        },
      );
    }),
    n &&
      ((i.count = function (a, o) {
        return Ic.setTime(+a), Lc.setTime(+o), e(Ic), e(Lc), Math.floor(n(Ic, Lc));
      }),
      (i.every = function (a) {
        return (
          (a = Math.floor(a)),
          !isFinite(a) || !(a > 0)
            ? null
            : a > 1
              ? i.filter(
                  r
                    ? function (o) {
                        return r(o) % a === 0;
                      }
                    : function (o) {
                        return i.count(0, o) % a === 0;
                      },
                )
              : i
        );
      })),
    i
  );
}
const iD = 1e3,
  Lp = iD * 60,
  aD = Lp * 60,
  jp = aD * 24,
  yx = jp * 7;
var Up = Gn(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Lp) / jp,
  (e) => e.getDate() - 1,
);
Up.range;
function ci(e) {
  return Gn(
    function (t) {
      t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0);
    },
    function (t, n) {
      t.setDate(t.getDate() + n * 7);
    },
    function (t, n) {
      return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Lp) / yx;
    },
  );
}
var bx = ci(0),
  dl = ci(1),
  oD = ci(2),
  uD = ci(3),
  ua = ci(4),
  sD = ci(5),
  lD = ci(6);
bx.range;
dl.range;
oD.range;
uD.range;
ua.range;
sD.range;
lD.range;
var ri = Gn(
  function (e) {
    e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setFullYear(e.getFullYear() + t);
  },
  function (e, t) {
    return t.getFullYear() - e.getFullYear();
  },
  function (e) {
    return e.getFullYear();
  },
);
ri.every = function (e) {
  return !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Gn(
        function (t) {
          t.setFullYear(Math.floor(t.getFullYear() / e) * e),
            t.setMonth(0, 1),
            t.setHours(0, 0, 0, 0);
        },
        function (t, n) {
          t.setFullYear(t.getFullYear() + n * e);
        },
      );
};
ri.range;
var zp = Gn(
  function (e) {
    e.setUTCHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setUTCDate(e.getUTCDate() + t);
  },
  function (e, t) {
    return (t - e) / jp;
  },
  function (e) {
    return e.getUTCDate() - 1;
  },
);
zp.range;
function di(e) {
  return Gn(
    function (t) {
      t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0);
    },
    function (t, n) {
      t.setUTCDate(t.getUTCDate() + n * 7);
    },
    function (t, n) {
      return (n - t) / yx;
    },
  );
}
var _x = di(0),
  hl = di(1),
  fD = di(2),
  cD = di(3),
  sa = di(4),
  dD = di(5),
  hD = di(6);
_x.range;
hl.range;
fD.range;
cD.range;
sa.range;
dD.range;
hD.range;
var ii = Gn(
  function (e) {
    e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  },
  function (e, t) {
    return t.getUTCFullYear() - e.getUTCFullYear();
  },
  function (e) {
    return e.getUTCFullYear();
  },
);
ii.every = function (e) {
  return !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Gn(
        function (t) {
          t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
            t.setUTCMonth(0, 1),
            t.setUTCHours(0, 0, 0, 0);
        },
        function (t, n) {
          t.setUTCFullYear(t.getUTCFullYear() + n * e);
        },
      );
};
ii.range;
function jc(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Uc(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Ha(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function pD(e) {
  var t = e.dateTime,
    n = e.date,
    r = e.time,
    i = e.periods,
    a = e.days,
    o = e.shortDays,
    u = e.months,
    s = e.shortMonths,
    l = Ba(i),
    f = Va(i),
    c = Ba(a),
    d = Va(a),
    p = Ba(o),
    g = Va(o),
    y = Ba(u),
    b = Va(u),
    h = Ba(s),
    m = Va(s),
    v = {
      a: H,
      A: P,
      b: O,
      B: W,
      c: null,
      d: qg,
      e: qg,
      f: ID,
      g: QD,
      G: GD,
      H: FD,
      I: DD,
      j: ND,
      L: wx,
      m: LD,
      M: jD,
      p: K,
      q: X,
      Q: Vg,
      s: Qg,
      S: UD,
      u: zD,
      U: WD,
      V: qD,
      w: HD,
      W: BD,
      x: null,
      X: null,
      y: VD,
      Y: YD,
      Z: KD,
      "%": Bg,
    },
    _ = {
      a: Oe,
      A: ve,
      b: se,
      B: oe,
      c: null,
      d: Hg,
      e: Hg,
      f: eN,
      g: fN,
      G: dN,
      H: XD,
      I: ZD,
      j: JD,
      L: Sx,
      m: tN,
      M: nN,
      p: te,
      q: tt,
      Q: Vg,
      s: Qg,
      S: rN,
      u: iN,
      U: aN,
      V: oN,
      w: uN,
      W: sN,
      x: null,
      X: null,
      y: lN,
      Y: cN,
      Z: hN,
      "%": Bg,
    },
    S = {
      a: R,
      A: E,
      b: q,
      B: I,
      c: F,
      d: zg,
      e: zg,
      f: PD,
      g: Ug,
      G: jg,
      H: Wg,
      I: Wg,
      j: CD,
      L: MD,
      m: TD,
      M: kD,
      p: j,
      q: $D,
      Q: AD,
      s: RD,
      S: OD,
      u: bD,
      U: _D,
      V: wD,
      w: yD,
      W: xD,
      x: D,
      X: z,
      y: Ug,
      Y: jg,
      Z: SD,
      "%": ED,
    };
  (v.x = w(n, v)),
    (v.X = w(r, v)),
    (v.c = w(t, v)),
    (_.x = w(n, _)),
    (_.X = w(r, _)),
    (_.c = w(t, _));
  function w(M, N) {
    return function (V) {
      var x = [],
        re = -1,
        Y = 0,
        le = M.length,
        ce,
        je,
        Lt;
      for (V instanceof Date || (V = new Date(+V)); ++re < le; )
        M.charCodeAt(re) === 37 &&
          (x.push(M.slice(Y, re)),
          (je = Lg[(ce = M.charAt(++re))]) != null
            ? (ce = M.charAt(++re))
            : (je = ce === "e" ? " " : "0"),
          (Lt = N[ce]) && (ce = Lt(V, je)),
          x.push(ce),
          (Y = re + 1));
      return x.push(M.slice(Y, re)), x.join("");
    };
  }
  function T(M, N) {
    return function (V) {
      var x = Ha(1900, void 0, 1),
        re = k(x, M, (V += ""), 0),
        Y,
        le;
      if (re != V.length) return null;
      if ("Q" in x) return new Date(x.Q);
      if ("s" in x) return new Date(x.s * 1e3 + ("L" in x ? x.L : 0));
      if (
        (N && !("Z" in x) && (x.Z = 0),
        "p" in x && (x.H = (x.H % 12) + x.p * 12),
        x.m === void 0 && (x.m = "q" in x ? x.q : 0),
        "V" in x)
      ) {
        if (x.V < 1 || x.V > 53) return null;
        "w" in x || (x.w = 1),
          "Z" in x
            ? ((Y = Uc(Ha(x.y, 0, 1))),
              (le = Y.getUTCDay()),
              (Y = le > 4 || le === 0 ? hl.ceil(Y) : hl(Y)),
              (Y = zp.offset(Y, (x.V - 1) * 7)),
              (x.y = Y.getUTCFullYear()),
              (x.m = Y.getUTCMonth()),
              (x.d = Y.getUTCDate() + ((x.w + 6) % 7)))
            : ((Y = jc(Ha(x.y, 0, 1))),
              (le = Y.getDay()),
              (Y = le > 4 || le === 0 ? dl.ceil(Y) : dl(Y)),
              (Y = Up.offset(Y, (x.V - 1) * 7)),
              (x.y = Y.getFullYear()),
              (x.m = Y.getMonth()),
              (x.d = Y.getDate() + ((x.w + 6) % 7)));
      } else
        ("W" in x || "U" in x) &&
          ("w" in x || (x.w = "u" in x ? x.u % 7 : "W" in x ? 1 : 0),
          (le = "Z" in x ? Uc(Ha(x.y, 0, 1)).getUTCDay() : jc(Ha(x.y, 0, 1)).getDay()),
          (x.m = 0),
          (x.d =
            "W" in x
              ? ((x.w + 6) % 7) + x.W * 7 - ((le + 5) % 7)
              : x.w + x.U * 7 - ((le + 6) % 7)));
      return "Z" in x ? ((x.H += (x.Z / 100) | 0), (x.M += x.Z % 100), Uc(x)) : jc(x);
    };
  }
  function k(M, N, V, x) {
    for (var re = 0, Y = N.length, le = V.length, ce, je; re < Y; ) {
      if (x >= le) return -1;
      if (((ce = N.charCodeAt(re++)), ce === 37)) {
        if (
          ((ce = N.charAt(re++)),
          (je = S[ce in Lg ? N.charAt(re++) : ce]),
          !je || (x = je(M, V, x)) < 0)
        )
          return -1;
      } else if (ce != V.charCodeAt(x++)) return -1;
    }
    return x;
  }
  function j(M, N, V) {
    var x = l.exec(N.slice(V));
    return x ? ((M.p = f.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function R(M, N, V) {
    var x = p.exec(N.slice(V));
    return x ? ((M.w = g.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function E(M, N, V) {
    var x = c.exec(N.slice(V));
    return x ? ((M.w = d.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function q(M, N, V) {
    var x = h.exec(N.slice(V));
    return x ? ((M.m = m.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function I(M, N, V) {
    var x = y.exec(N.slice(V));
    return x ? ((M.m = b.get(x[0].toLowerCase())), V + x[0].length) : -1;
  }
  function F(M, N, V) {
    return k(M, t, N, V);
  }
  function D(M, N, V) {
    return k(M, n, N, V);
  }
  function z(M, N, V) {
    return k(M, r, N, V);
  }
  function H(M) {
    return o[M.getDay()];
  }
  function P(M) {
    return a[M.getDay()];
  }
  function O(M) {
    return s[M.getMonth()];
  }
  function W(M) {
    return u[M.getMonth()];
  }
  function K(M) {
    return i[+(M.getHours() >= 12)];
  }
  function X(M) {
    return 1 + ~~(M.getMonth() / 3);
  }
  function Oe(M) {
    return o[M.getUTCDay()];
  }
  function ve(M) {
    return a[M.getUTCDay()];
  }
  function se(M) {
    return s[M.getUTCMonth()];
  }
  function oe(M) {
    return u[M.getUTCMonth()];
  }
  function te(M) {
    return i[+(M.getUTCHours() >= 12)];
  }
  function tt(M) {
    return 1 + ~~(M.getUTCMonth() / 3);
  }
  return {
    format: function (M) {
      var N = w((M += ""), v);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    parse: function (M) {
      var N = T((M += ""), !1);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    utcFormat: function (M) {
      var N = w((M += ""), _);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
    utcParse: function (M) {
      var N = T((M += ""), !0);
      return (
        (N.toString = function () {
          return M;
        }),
        N
      );
    },
  };
}
var Lg = { "-": "", _: " ", 0: "0" },
  et = /^\s*\d+/,
  mD = /^%/,
  vD = /[\\^$*+?|[\]().{}]/g;
function he(e, t, n) {
  var r = e < 0 ? "-" : "",
    i = (r ? -e : e) + "",
    a = i.length;
  return r + (a < n ? new Array(n - a + 1).join(t) + i : i);
}
function gD(e) {
  return e.replace(vD, "\\$&");
}
function Ba(e) {
  return new RegExp("^(?:" + e.map(gD).join("|") + ")", "i");
}
function Va(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function yD(e, t, n) {
  var r = et.exec(t.slice(n, n + 1));
  return r ? ((e.w = +r[0]), n + r[0].length) : -1;
}
function bD(e, t, n) {
  var r = et.exec(t.slice(n, n + 1));
  return r ? ((e.u = +r[0]), n + r[0].length) : -1;
}
function _D(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.U = +r[0]), n + r[0].length) : -1;
}
function wD(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.V = +r[0]), n + r[0].length) : -1;
}
function xD(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.W = +r[0]), n + r[0].length) : -1;
}
function jg(e, t, n) {
  var r = et.exec(t.slice(n, n + 4));
  return r ? ((e.y = +r[0]), n + r[0].length) : -1;
}
function Ug(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3)), n + r[0].length) : -1;
}
function SD(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? ((e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), n + r[0].length) : -1;
}
function $D(e, t, n) {
  var r = et.exec(t.slice(n, n + 1));
  return r ? ((e.q = r[0] * 3 - 3), n + r[0].length) : -1;
}
function TD(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.m = r[0] - 1), n + r[0].length) : -1;
}
function zg(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.d = +r[0]), n + r[0].length) : -1;
}
function CD(e, t, n) {
  var r = et.exec(t.slice(n, n + 3));
  return r ? ((e.m = 0), (e.d = +r[0]), n + r[0].length) : -1;
}
function Wg(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.H = +r[0]), n + r[0].length) : -1;
}
function kD(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.M = +r[0]), n + r[0].length) : -1;
}
function OD(e, t, n) {
  var r = et.exec(t.slice(n, n + 2));
  return r ? ((e.S = +r[0]), n + r[0].length) : -1;
}
function MD(e, t, n) {
  var r = et.exec(t.slice(n, n + 3));
  return r ? ((e.L = +r[0]), n + r[0].length) : -1;
}
function PD(e, t, n) {
  var r = et.exec(t.slice(n, n + 6));
  return r ? ((e.L = Math.floor(r[0] / 1e3)), n + r[0].length) : -1;
}
function ED(e, t, n) {
  var r = mD.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function AD(e, t, n) {
  var r = et.exec(t.slice(n));
  return r ? ((e.Q = +r[0]), n + r[0].length) : -1;
}
function RD(e, t, n) {
  var r = et.exec(t.slice(n));
  return r ? ((e.s = +r[0]), n + r[0].length) : -1;
}
function qg(e, t) {
  return he(e.getDate(), t, 2);
}
function FD(e, t) {
  return he(e.getHours(), t, 2);
}
function DD(e, t) {
  return he(e.getHours() % 12 || 12, t, 2);
}
function ND(e, t) {
  return he(1 + Up.count(ri(e), e), t, 3);
}
function wx(e, t) {
  return he(e.getMilliseconds(), t, 3);
}
function ID(e, t) {
  return wx(e, t) + "000";
}
function LD(e, t) {
  return he(e.getMonth() + 1, t, 2);
}
function jD(e, t) {
  return he(e.getMinutes(), t, 2);
}
function UD(e, t) {
  return he(e.getSeconds(), t, 2);
}
function zD(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function WD(e, t) {
  return he(bx.count(ri(e) - 1, e), t, 2);
}
function xx(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? ua(e) : ua.ceil(e);
}
function qD(e, t) {
  return (e = xx(e)), he(ua.count(ri(e), e) + (ri(e).getDay() === 4), t, 2);
}
function HD(e) {
  return e.getDay();
}
function BD(e, t) {
  return he(dl.count(ri(e) - 1, e), t, 2);
}
function VD(e, t) {
  return he(e.getFullYear() % 100, t, 2);
}
function QD(e, t) {
  return (e = xx(e)), he(e.getFullYear() % 100, t, 2);
}
function YD(e, t) {
  return he(e.getFullYear() % 1e4, t, 4);
}
function GD(e, t) {
  var n = e.getDay();
  return (e = n >= 4 || n === 0 ? ua(e) : ua.ceil(e)), he(e.getFullYear() % 1e4, t, 4);
}
function KD(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : ((t *= -1), "+")) + he((t / 60) | 0, "0", 2) + he(t % 60, "0", 2);
}
function Hg(e, t) {
  return he(e.getUTCDate(), t, 2);
}
function XD(e, t) {
  return he(e.getUTCHours(), t, 2);
}
function ZD(e, t) {
  return he(e.getUTCHours() % 12 || 12, t, 2);
}
function JD(e, t) {
  return he(1 + zp.count(ii(e), e), t, 3);
}
function Sx(e, t) {
  return he(e.getUTCMilliseconds(), t, 3);
}
function eN(e, t) {
  return Sx(e, t) + "000";
}
function tN(e, t) {
  return he(e.getUTCMonth() + 1, t, 2);
}
function nN(e, t) {
  return he(e.getUTCMinutes(), t, 2);
}
function rN(e, t) {
  return he(e.getUTCSeconds(), t, 2);
}
function iN(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function aN(e, t) {
  return he(_x.count(ii(e) - 1, e), t, 2);
}
function $x(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? sa(e) : sa.ceil(e);
}
function oN(e, t) {
  return (e = $x(e)), he(sa.count(ii(e), e) + (ii(e).getUTCDay() === 4), t, 2);
}
function uN(e) {
  return e.getUTCDay();
}
function sN(e, t) {
  return he(hl.count(ii(e) - 1, e), t, 2);
}
function lN(e, t) {
  return he(e.getUTCFullYear() % 100, t, 2);
}
function fN(e, t) {
  return (e = $x(e)), he(e.getUTCFullYear() % 100, t, 2);
}
function cN(e, t) {
  return he(e.getUTCFullYear() % 1e4, t, 4);
}
function dN(e, t) {
  var n = e.getUTCDay();
  return (e = n >= 4 || n === 0 ? sa(e) : sa.ceil(e)), he(e.getUTCFullYear() % 1e4, t, 4);
}
function hN() {
  return "+0000";
}
function Bg() {
  return "%";
}
function Vg(e) {
  return +e;
}
function Qg(e) {
  return Math.floor(+e / 1e3);
}
var _i, Wp, Tx, Cx;
pN({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
});
function pN(e) {
  return (_i = pD(e)), (Wp = _i.format), (Tx = _i.parse), _i.utcFormat, (Cx = _i.utcParse), _i;
}
var mN = cu,
  vN = Aw,
  gN = wa;
function yN(e, t, n) {
  for (var r = -1, i = t.length, a = {}; ++r < i; ) {
    var o = t[r],
      u = mN(e, o);
    n(u, o) && vN(a, gN(o, e), u);
  }
  return a;
}
var bN = yN;
function _N(e, t) {
  return e != null && t in Object(e);
}
var wN = _N,
  xN = wa,
  SN = Zl,
  $N = Mt,
  TN = tf,
  CN = ap,
  kN = xa;
function ON(e, t, n) {
  t = xN(t, e);
  for (var r = -1, i = t.length, a = !1; ++r < i; ) {
    var o = kN(t[r]);
    if (!(a = e != null && n(e, o))) break;
    e = e[o];
  }
  return a || ++r != i
    ? a
    : ((i = e == null ? 0 : e.length), !!i && CN(i) && TN(o, i) && ($N(e) || SN(e)));
}
var MN = ON,
  PN = wN,
  EN = MN;
function AN(e, t) {
  return e != null && EN(e, t, PN);
}
var kx = AN,
  RN = bN,
  FN = kx;
function DN(e, t) {
  return RN(e, t, function (n, r) {
    return FN(e, r);
  });
}
var NN = DN;
function IN(e, t) {
  for (var n = -1, r = t.length, i = e.length; ++n < r; ) e[i + n] = t[n];
  return e;
}
var qp = IN,
  Yg = ma,
  LN = Zl,
  jN = Mt,
  Gg = Yg ? Yg.isConcatSpreadable : void 0;
function UN(e) {
  return jN(e) || LN(e) || !!(Gg && e && e[Gg]);
}
var zN = UN,
  WN = qp,
  qN = zN;
function Ox(e, t, n, r, i) {
  var a = -1,
    o = e.length;
  for (n || (n = qN), i || (i = []); ++a < o; ) {
    var u = e[a];
    t > 0 && n(u) ? (t > 1 ? Ox(u, t - 1, n, r, i) : WN(i, u)) : r || (i[i.length] = u);
  }
  return i;
}
var Mx = Ox,
  HN = Mx;
function BN(e) {
  var t = e == null ? 0 : e.length;
  return t ? HN(e, 1) : [];
}
var VN = BN,
  QN = VN,
  YN = Cw,
  GN = kw;
function KN(e) {
  return GN(YN(e, void 0, QN), e + "");
}
var Px = KN,
  XN = NN,
  ZN = Px;
ZN(function (e, t) {
  return e == null ? {} : XN(e, t);
});
function JN(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; ) if (t(e[n], n, e)) return !0;
  return !1;
}
var eI = JN,
  tI = Pp,
  nI = eI,
  rI = Ep,
  iI = 1,
  aI = 2;
function oI(e, t, n, r, i, a) {
  var o = n & iI,
    u = e.length,
    s = t.length;
  if (u != s && !(o && s > u)) return !1;
  var l = a.get(e),
    f = a.get(t);
  if (l && f) return l == t && f == e;
  var c = -1,
    d = !0,
    p = n & aI ? new tI() : void 0;
  for (a.set(e, t), a.set(t, e); ++c < u; ) {
    var g = e[c],
      y = t[c];
    if (r) var b = o ? r(y, g, c, t, e, a) : r(g, y, c, e, t, a);
    if (b !== void 0) {
      if (b) continue;
      d = !1;
      break;
    }
    if (p) {
      if (
        !nI(t, function (h, m) {
          if (!rI(p, m) && (g === h || i(g, h, n, r, a))) return p.push(m);
        })
      ) {
        d = !1;
        break;
      }
    } else if (!(g === y || i(g, y, n, r, a))) {
      d = !1;
      break;
    }
  }
  return a.delete(e), a.delete(t), d;
}
var Ex = oI;
function uI(e) {
  var t = -1,
    n = Array(e.size);
  return (
    e.forEach(function (r, i) {
      n[++t] = [i, r];
    }),
    n
  );
}
var sI = uI;
function lI(e) {
  var t = -1,
    n = Array(e.size);
  return (
    e.forEach(function (r) {
      n[++t] = r;
    }),
    n
  );
}
var Hp = lI,
  Kg = ma,
  Xg = pw,
  fI = su,
  cI = Ex,
  dI = sI,
  hI = Hp,
  pI = 1,
  mI = 2,
  vI = "[object Boolean]",
  gI = "[object Date]",
  yI = "[object Error]",
  bI = "[object Map]",
  _I = "[object Number]",
  wI = "[object RegExp]",
  xI = "[object Set]",
  SI = "[object String]",
  $I = "[object Symbol]",
  TI = "[object ArrayBuffer]",
  CI = "[object DataView]",
  Zg = Kg ? Kg.prototype : void 0,
  zc = Zg ? Zg.valueOf : void 0;
function kI(e, t, n, r, i, a, o) {
  switch (n) {
    case CI:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
      (e = e.buffer), (t = t.buffer);
    case TI:
      return !(e.byteLength != t.byteLength || !a(new Xg(e), new Xg(t)));
    case vI:
    case gI:
    case _I:
      return fI(+e, +t);
    case yI:
      return e.name == t.name && e.message == t.message;
    case wI:
    case SI:
      return e == t + "";
    case bI:
      var u = dI;
    case xI:
      var s = r & pI;
      if ((u || (u = hI), e.size != t.size && !s)) return !1;
      var l = o.get(e);
      if (l) return l == t;
      (r |= mI), o.set(e, t);
      var f = cI(u(e), u(t), r, i, a, o);
      return o.delete(e), f;
    case $I:
      if (zc) return zc.call(e) == zc.call(t);
  }
  return !1;
}
var OI = kI,
  MI = qp,
  PI = Mt;
function EI(e, t, n) {
  var r = t(e);
  return PI(e) ? r : MI(r, n(e));
}
var Ax = EI;
function AI(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = 0, a = []; ++n < r; ) {
    var o = e[n];
    t(o, n, e) && (a[i++] = o);
  }
  return a;
}
var Rx = AI;
function RI() {
  return [];
}
var Fx = RI,
  FI = Rx,
  DI = Fx,
  NI = Object.prototype,
  II = NI.propertyIsEnumerable,
  Jg = Object.getOwnPropertySymbols,
  LI = Jg
    ? function (e) {
        return e == null
          ? []
          : ((e = Object(e)),
            FI(Jg(e), function (t) {
              return II.call(e, t);
            }));
      }
    : DI,
  Bp = LI,
  jI = gw,
  UI = jI(Object.keys, Object),
  zI = UI,
  WI = ip,
  qI = zI,
  HI = Object.prototype,
  BI = HI.hasOwnProperty;
function VI(e) {
  if (!WI(e)) return qI(e);
  var t = [];
  for (var n in Object(e)) BI.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
var QI = VI,
  YI = $w,
  GI = QI,
  KI = ba;
function XI(e) {
  return KI(e) ? YI(e) : GI(e);
}
var hu = XI,
  ZI = Ax,
  JI = Bp,
  eL = hu;
function tL(e) {
  return ZI(e, eL, JI);
}
var Dx = tL,
  ey = Dx,
  nL = 1,
  rL = Object.prototype,
  iL = rL.hasOwnProperty;
function aL(e, t, n, r, i, a) {
  var o = n & nL,
    u = ey(e),
    s = u.length,
    l = ey(t),
    f = l.length;
  if (s != f && !o) return !1;
  for (var c = s; c--; ) {
    var d = u[c];
    if (!(o ? d in t : iL.call(t, d))) return !1;
  }
  var p = a.get(e),
    g = a.get(t);
  if (p && g) return p == t && g == e;
  var y = !0;
  a.set(e, t), a.set(t, e);
  for (var b = o; ++c < s; ) {
    d = u[c];
    var h = e[d],
      m = t[d];
    if (r) var v = o ? r(m, h, d, t, e, a) : r(h, m, d, e, t, a);
    if (!(v === void 0 ? h === m || i(h, m, n, r, a) : v)) {
      y = !1;
      break;
    }
    b || (b = d == "constructor");
  }
  if (y && !b) {
    var _ = e.constructor,
      S = t.constructor;
    _ != S &&
      "constructor" in e &&
      "constructor" in t &&
      !(typeof _ == "function" && _ instanceof _ && typeof S == "function" && S instanceof S) &&
      (y = !1);
  }
  return a.delete(e), a.delete(t), y;
}
var oL = aL,
  uL = ui,
  sL = kn,
  lL = uL(sL, "DataView"),
  fL = lL,
  cL = ui,
  dL = kn,
  hL = cL(dL, "Promise"),
  pL = hL,
  mL = ui,
  vL = kn,
  gL = mL(vL, "Set"),
  Nx = gL,
  yL = ui,
  bL = kn,
  _L = yL(bL, "WeakMap"),
  wL = _L,
  Th = fL,
  Ch = J0,
  kh = pL,
  Oh = Nx,
  Mh = wL,
  Ix = kr,
  $a = lw,
  ty = "[object Map]",
  xL = "[object Object]",
  ny = "[object Promise]",
  ry = "[object Set]",
  iy = "[object WeakMap]",
  ay = "[object DataView]",
  SL = $a(Th),
  $L = $a(Ch),
  TL = $a(kh),
  CL = $a(Oh),
  kL = $a(Mh),
  Fr = Ix;
((Th && Fr(new Th(new ArrayBuffer(1))) != ay) ||
  (Ch && Fr(new Ch()) != ty) ||
  (kh && Fr(kh.resolve()) != ny) ||
  (Oh && Fr(new Oh()) != ry) ||
  (Mh && Fr(new Mh()) != iy)) &&
  (Fr = function (e) {
    var t = Ix(e),
      n = t == xL ? e.constructor : void 0,
      r = n ? $a(n) : "";
    if (r)
      switch (r) {
        case SL:
          return ay;
        case $L:
          return ty;
        case TL:
          return ny;
        case CL:
          return ry;
        case kL:
          return iy;
      }
    return t;
  });
var qf = Fr,
  Wc = Xl,
  OL = Ex,
  ML = OI,
  PL = oL,
  oy = qf,
  uy = Mt,
  sy = Jl,
  EL = up,
  AL = 1,
  ly = "[object Arguments]",
  fy = "[object Array]",
  Yu = "[object Object]",
  RL = Object.prototype,
  cy = RL.hasOwnProperty;
function FL(e, t, n, r, i, a) {
  var o = uy(e),
    u = uy(t),
    s = o ? fy : oy(e),
    l = u ? fy : oy(t);
  (s = s == ly ? Yu : s), (l = l == ly ? Yu : l);
  var f = s == Yu,
    c = l == Yu,
    d = s == l;
  if (d && sy(e)) {
    if (!sy(t)) return !1;
    (o = !0), (f = !1);
  }
  if (d && !f)
    return a || (a = new Wc()), o || EL(e) ? OL(e, t, n, r, i, a) : ML(e, t, s, n, r, i, a);
  if (!(n & AL)) {
    var p = f && cy.call(e, "__wrapped__"),
      g = c && cy.call(t, "__wrapped__");
    if (p || g) {
      var y = p ? e.value() : e,
        b = g ? t.value() : t;
      return a || (a = new Wc()), i(y, b, n, r, a);
    }
  }
  return d ? (a || (a = new Wc()), PL(e, t, n, r, i, a)) : !1;
}
var DL = FL,
  NL = DL,
  dy = cn;
function Lx(e, t, n, r, i) {
  return e === t
    ? !0
    : e == null || t == null || (!dy(e) && !dy(t))
      ? e !== e && t !== t
      : NL(e, t, n, r, Lx, i);
}
var jx = Lx,
  IL = {
    background: "transparent",
    text: {
      fontFamily: "sans-serif",
      fontSize: 11,
      fill: "#333333",
      outlineWidth: 0,
      outlineColor: "transparent",
      outlineOpacity: 1,
    },
    axis: {
      domain: { line: { stroke: "transparent", strokeWidth: 1 } },
      ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} },
      legend: { text: { fontSize: 12 } },
    },
    grid: { line: { stroke: "#dddddd", strokeWidth: 1 } },
    legends: {
      hidden: {
        symbol: { fill: "#333333", opacity: 0.6 },
        text: { fill: "#333333", opacity: 0.6 },
      },
      text: {},
      ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } },
      title: { text: {} },
    },
    labels: { text: {} },
    markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} },
    dots: { text: {} },
    tooltip: {
      container: {
        background: "white",
        color: "inherit",
        fontSize: "inherit",
        borderRadius: "2px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
        padding: "5px 9px",
      },
      basic: { whiteSpace: "pre", display: "flex", alignItems: "center" },
      chip: { marginRight: 7 },
      table: {},
      tableCell: { padding: "3px 5px" },
      tableCellValue: { fontWeight: "bold" },
    },
    crosshair: {
      line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" },
    },
    annotations: {
      text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
      link: {
        stroke: "#000000",
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      outline: {
        fill: "none",
        stroke: "#000000",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
    },
  };
function Sr() {
  return (
    (Sr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Sr.apply(this, arguments)
  );
}
function Vp(e, t) {
  if (e == null) return {};
  var n,
    r,
    i = {},
    a = Object.keys(e);
  for (r = 0; r < a.length; r++) (n = a[r]), t.indexOf(n) >= 0 || (i[n] = e[n]);
  return i;
}
var LL = [
    "axis.ticks.text",
    "axis.legend.text",
    "legends.title.text",
    "legends.text",
    "legends.ticks.text",
    "legends.title.text",
    "labels.text",
    "dots.text",
    "markers.text",
    "annotations.text",
  ],
  jL = function (e, t) {
    return Sr({}, t, e);
  },
  UL = function (e, t) {
    var n = pM({}, e, t);
    return (
      LL.forEach(function (r) {
        lP(n, r, jL(ta(n, r), n.text));
      }),
      n
    );
  },
  Ux = A.createContext(),
  zx = function (e) {
    var t = e.children,
      n = e.animate,
      r = n === void 0 || n,
      i = e.config,
      a = i === void 0 ? "default" : i,
      o = A.useMemo(
        function () {
          var u = VP(a) ? K0[a] : a;
          return { animate: r, config: u };
        },
        [r, a],
      );
    return B.jsx(Ux.Provider, { value: o, children: t });
  },
  pl = {
    animate: C.bool,
    motionConfig: C.oneOfType([
      C.oneOf(Object.keys(K0)),
      C.shape({
        mass: C.number,
        tension: C.number,
        friction: C.number,
        clamp: C.bool,
        precision: C.number,
        velocity: C.number,
        duration: C.number,
        easing: C.func,
      }),
    ]),
  };
zx.propTypes = { children: C.node.isRequired, animate: pl.animate, config: pl.motionConfig };
var pu = function () {
    return A.useContext(Ux);
  },
  zL = {
    nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"],
    BrBG: G(hf),
    PRGn: G(pf),
    PiYG: G(mf),
    PuOr: G(vf),
    RdBu: G(gf),
    RdGy: G(yf),
    RdYlBu: G(bf),
    RdYlGn: G(_f),
    spectral: G(wf),
    blues: G(Ff),
    greens: G(Df),
    greys: G(Nf),
    oranges: G(jf),
    purples: G(If),
    reds: G(Lf),
    BuGn: G(xf),
    BuPu: G(Sf),
    GnBu: G($f),
    OrRd: G(Tf),
    PuBuGn: G(Cf),
    PuBu: G(kf),
    PuRd: G(Of),
    RdPu: G(Mf),
    YlGnBu: G(Pf),
    YlGn: G(Ef),
    YlOrBr: G(Af),
    YlOrRd: G(Rf),
  },
  WL = Object.keys(zL);
G(hf),
  G(pf),
  G(mf),
  G(vf),
  G(gf),
  G(yf),
  G(bf),
  G(_f),
  G(wf),
  G(Ff),
  G(Df),
  G(Nf),
  G(jf),
  G(If),
  G(Lf),
  G(xf),
  G(Sf),
  G($f),
  G(Tf),
  G(Cf),
  G(kf),
  G(Of),
  G(Mf),
  G(Pf),
  G(Ef),
  G(Af),
  G(Rf);
C.oneOfType([C.oneOf(WL), C.func, C.arrayOf(C.string)]);
var qL = {
    basis: OF,
    basisClosed: MF,
    basisOpen: PF,
    bundle: EF,
    cardinal: AF,
    cardinalClosed: RF,
    cardinalOpen: FF,
    catmullRom: DF,
    catmullRomClosed: NF,
    catmullRomOpen: IF,
    linear: kF,
    linearClosed: LF,
    monotoneX: jF,
    monotoneY: UF,
    natural: zF,
    step: WF,
    stepAfter: HF,
    stepBefore: qF,
  },
  Qp = Object.keys(qL);
Qp.filter(function (e) {
  return e.endsWith("Closed");
});
ax(
  Qp,
  "bundle",
  "basisClosed",
  "basisOpen",
  "cardinalClosed",
  "cardinalOpen",
  "catmullRomClosed",
  "catmullRomOpen",
  "linearClosed",
);
ax(
  Qp,
  "bundle",
  "basisClosed",
  "basisOpen",
  "cardinalClosed",
  "cardinalOpen",
  "catmullRomClosed",
  "catmullRomOpen",
  "linearClosed",
);
C.shape({ top: C.number, right: C.number, bottom: C.number, left: C.number }).isRequired;
var HL = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];
C.oneOf(HL);
zr(nx);
var BL = { top: 0, right: 0, bottom: 0, left: 0 },
  VL = function (e, t, n) {
    return (
      n === void 0 && (n = {}),
      A.useMemo(
        function () {
          var r = Sr({}, BL, n);
          return {
            margin: r,
            innerWidth: e - r.left - r.right,
            innerHeight: t - r.top - r.bottom,
            outerWidth: e,
            outerHeight: t,
          };
        },
        [e, t, n.top, n.right, n.bottom, n.left],
      )
    );
  },
  Wx = function () {
    var e = A.useRef(null),
      t = A.useState({ left: 0, top: 0, width: 0, height: 0 }),
      n = t[0],
      r = t[1],
      i = A.useState(function () {
        return typeof ResizeObserver > "u"
          ? null
          : new ResizeObserver(function (a) {
              var o = a[0];
              return r(o.contentRect);
            });
      })[0];
    return (
      A.useEffect(function () {
        return (
          e.current && i !== null && i.observe(e.current),
          function () {
            i !== null && i.disconnect();
          }
        );
      }, []),
      [e, n]
    );
  },
  QL = function (e) {
    return A.useMemo(
      function () {
        return UL(IL, e);
      },
      [e],
    );
  },
  YL = function (e) {
    return typeof e == "function"
      ? e
      : typeof e == "string"
        ? e.indexOf("time:") === 0
          ? Wp(e.slice("5"))
          : Ip(e)
        : function (t) {
            return "" + t;
          };
  },
  Yp = function (e) {
    return A.useMemo(
      function () {
        return YL(e);
      },
      [e],
    );
  },
  qx = A.createContext(),
  GL = {},
  Hx = function (e) {
    var t = e.theme,
      n = t === void 0 ? GL : t,
      r = e.children,
      i = QL(n);
    return B.jsx(qx.Provider, { value: i, children: r });
  };
Hx.propTypes = { children: C.node.isRequired, theme: C.object };
var Xt = function () {
    return A.useContext(qx);
  },
  KL = ["outlineWidth", "outlineColor", "outlineOpacity"],
  Bx = function (e) {
    return e.outlineWidth, e.outlineColor, e.outlineOpacity, Vp(e, KL);
  },
  Vx = function (e) {
    var t = e.children,
      n = e.condition,
      r = e.wrapper;
    return n ? A.cloneElement(r, {}, t) : t;
  };
Vx.propTypes = {
  children: C.node.isRequired,
  condition: C.bool.isRequired,
  wrapper: C.element.isRequired,
};
var XL = { position: "relative" },
  Qx = function (e) {
    var t = e.children,
      n = e.theme,
      r = e.renderWrapper,
      i = r === void 0 || r,
      a = e.isInteractive,
      o = a === void 0 || a,
      u = e.animate,
      s = e.motionConfig,
      l = A.useRef(null);
    return B.jsx(Hx, {
      theme: n,
      children: B.jsx(zx, {
        animate: u,
        config: s,
        children: B.jsx(G7, {
          container: l,
          children: B.jsxs(Vx, {
            condition: i,
            wrapper: B.jsx("div", { style: XL, ref: l }),
            children: [t, o && B.jsx(Y7, {})],
          }),
        }),
      }),
    });
  };
Qx.propTypes = {
  children: C.element.isRequired,
  isInteractive: C.bool,
  renderWrapper: C.bool,
  theme: C.object,
  animate: C.bool,
  motionConfig: C.oneOfType([C.string, pl.motionConfig]),
};
C.func.isRequired,
  C.bool,
  C.bool,
  C.object.isRequired,
  C.bool.isRequired,
  C.oneOfType([C.string, pl.motionConfig]);
var Yx = function (e) {
  var t = e.children,
    n = Wx(),
    r = n[0],
    i = n[1],
    a = i.width > 0 && i.height > 0;
  return B.jsx("div", {
    ref: r,
    style: { width: "100%", height: "100%" },
    children: a && t({ width: i.width, height: i.height }),
  });
};
Yx.propTypes = { children: C.func.isRequired };
var ZL = ["id", "colors"],
  Gx = function (e) {
    var t = e.id,
      n = e.colors,
      r = Vp(e, ZL);
    return B.jsx(
      "linearGradient",
      Sr({ id: t, x1: 0, x2: 0, y1: 0, y2: 1 }, r, {
        children: n.map(function (i) {
          var a = i.offset,
            o = i.color,
            u = i.opacity;
          return B.jsx(
            "stop",
            { offset: a + "%", stopColor: o, stopOpacity: u !== void 0 ? u : 1 },
            a,
          );
        }),
      }),
    );
  };
Gx.propTypes = {
  id: C.string.isRequired,
  colors: C.arrayOf(
    C.shape({ offset: C.number.isRequired, color: C.string.isRequired, opacity: C.number }),
  ).isRequired,
  gradientTransform: C.string,
};
var JL = { linearGradient: Gx },
  Qa = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: !1 },
  Ph = A.memo(function (e) {
    var t = e.id,
      n = e.background,
      r = n === void 0 ? Qa.background : n,
      i = e.color,
      a = i === void 0 ? Qa.color : i,
      o = e.size,
      u = o === void 0 ? Qa.size : o,
      s = e.padding,
      l = s === void 0 ? Qa.padding : s,
      f = e.stagger,
      c = f === void 0 ? Qa.stagger : f,
      d = u + l,
      p = u / 2,
      g = l / 2;
    return (
      c === !0 && (d = 2 * u + 2 * l),
      B.jsxs("pattern", {
        id: t,
        width: d,
        height: d,
        patternUnits: "userSpaceOnUse",
        children: [
          B.jsx("rect", { width: d, height: d, fill: r }),
          B.jsx("circle", { cx: g + p, cy: g + p, r: p, fill: a }),
          c && B.jsx("circle", { cx: 1.5 * l + u + p, cy: 1.5 * l + u + p, r: p, fill: a }),
        ],
      })
    );
  });
(Ph.displayName = "PatternDots"),
  (Ph.propTypes = {
    id: C.string.isRequired,
    color: C.string.isRequired,
    background: C.string.isRequired,
    size: C.number.isRequired,
    padding: C.number.isRequired,
    stagger: C.bool.isRequired,
  });
var Yo = function (e) {
    return (e * Math.PI) / 180;
  },
  ej = function (e) {
    return (180 * e) / Math.PI;
  },
  tj = function (e, t) {
    return { x: Math.cos(e) * t, y: Math.sin(e) * t };
  },
  nj = function (e) {
    var t = e % 360;
    return t < 0 && (t += 360), t;
  },
  rj = {
    svg: {
      align: {
        left: "start",
        center: "middle",
        right: "end",
        start: "start",
        middle: "middle",
        end: "end",
      },
      baseline: { top: "text-before-edge", center: "central", bottom: "alphabetic" },
    },
    canvas: {
      align: {
        left: "left",
        center: "center",
        right: "right",
        start: "left",
        middle: "center",
        end: "right",
      },
      baseline: { top: "top", center: "middle", bottom: "bottom" },
    },
  },
  Ya = { spacing: 5, rotation: 0, background: "#000000", color: "#ffffff", lineWidth: 2 },
  Eh = A.memo(function (e) {
    var t = e.id,
      n = e.spacing,
      r = n === void 0 ? Ya.spacing : n,
      i = e.rotation,
      a = i === void 0 ? Ya.rotation : i,
      o = e.background,
      u = o === void 0 ? Ya.background : o,
      s = e.color,
      l = s === void 0 ? Ya.color : s,
      f = e.lineWidth,
      c = f === void 0 ? Ya.lineWidth : f,
      d = Math.round(a) % 360,
      p = Math.abs(r);
    d > 180 ? (d -= 360) : d > 90 ? (d -= 180) : d < -180 ? (d += 360) : d < -90 && (d += 180);
    var g,
      y = p,
      b = p;
    return (
      d === 0
        ? (g =
            `
                M 0 0 L ` +
            y +
            ` 0
                M 0 ` +
            b +
            " L " +
            y +
            " " +
            b +
            `
            `)
        : d === 90
          ? (g =
              `
                M 0 0 L 0 ` +
              b +
              `
                M ` +
              y +
              " 0 L " +
              y +
              " " +
              b +
              `
            `)
          : ((y = Math.abs(p / Math.sin(Yo(d)))),
            (b = p / Math.sin(Yo(90 - d))),
            (g =
              d > 0
                ? `
                    M 0 ` +
                  -b +
                  " L " +
                  2 * y +
                  " " +
                  b +
                  `
                    M ` +
                  -y +
                  " " +
                  -b +
                  " L " +
                  y +
                  " " +
                  b +
                  `
                    M ` +
                  -y +
                  " 0 L " +
                  y +
                  " " +
                  2 * b +
                  `
                `
                : `
                    M ` +
                  -y +
                  " " +
                  b +
                  " L " +
                  y +
                  " " +
                  -b +
                  `
                    M ` +
                  -y +
                  " " +
                  2 * b +
                  " L " +
                  2 * y +
                  " " +
                  -b +
                  `
                    M 0 ` +
                  2 * b +
                  " L " +
                  2 * y +
                  ` 0
                `)),
      B.jsxs("pattern", {
        id: t,
        width: y,
        height: b,
        patternUnits: "userSpaceOnUse",
        children: [
          B.jsx("rect", {
            width: y,
            height: b,
            fill: u,
            stroke: "rgba(255, 0, 0, 0.1)",
            strokeWidth: 0,
          }),
          B.jsx("path", { d: g, strokeWidth: c, stroke: l, strokeLinecap: "square" }),
        ],
      })
    );
  });
(Eh.displayName = "PatternLines"),
  (Eh.propTypes = {
    id: C.string.isRequired,
    spacing: C.number.isRequired,
    rotation: C.number.isRequired,
    background: C.string.isRequired,
    color: C.string.isRequired,
    lineWidth: C.number.isRequired,
  });
var Ga = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: !1 },
  Ah = A.memo(function (e) {
    var t = e.id,
      n = e.color,
      r = n === void 0 ? Ga.color : n,
      i = e.background,
      a = i === void 0 ? Ga.background : i,
      o = e.size,
      u = o === void 0 ? Ga.size : o,
      s = e.padding,
      l = s === void 0 ? Ga.padding : s,
      f = e.stagger,
      c = f === void 0 ? Ga.stagger : f,
      d = u + l,
      p = l / 2;
    return (
      c === !0 && (d = 2 * u + 2 * l),
      B.jsxs("pattern", {
        id: t,
        width: d,
        height: d,
        patternUnits: "userSpaceOnUse",
        children: [
          B.jsx("rect", { width: d, height: d, fill: a }),
          B.jsx("rect", { x: p, y: p, width: u, height: u, fill: r }),
          c && B.jsx("rect", { x: 1.5 * l + u, y: 1.5 * l + u, width: u, height: u, fill: r }),
        ],
      })
    );
  });
(Ah.displayName = "PatternSquares"),
  (Ah.propTypes = {
    id: C.string.isRequired,
    color: C.string.isRequired,
    background: C.string.isRequired,
    size: C.number.isRequired,
    padding: C.number.isRequired,
    stagger: C.bool.isRequired,
  });
var ij = { patternDots: Ph, patternLines: Eh, patternSquares: Ah },
  aj = ["type"],
  Rh = Sr({}, JL, ij),
  Kx = function (e) {
    var t = e.defs;
    return !t || t.length < 1
      ? null
      : B.jsx("defs", {
          "aria-hidden": !0,
          children: t.map(function (n) {
            var r = n.type,
              i = Vp(n, aj);
            return Rh[r] ? A.createElement(Rh[r], Sr({ key: i.id }, i)) : null;
          }),
        });
  };
Kx.propTypes = {
  defs: C.arrayOf(C.shape({ type: C.oneOf(Object.keys(Rh)).isRequired, id: C.string.isRequired })),
};
A.memo(Kx);
C.number.isRequired,
  C.number.isRequired,
  C.shape({ top: C.number.isRequired, left: C.number.isRequired }).isRequired,
  C.array,
  C.oneOfType([C.arrayOf(C.node), C.node]).isRequired,
  C.string,
  C.bool,
  C.string,
  C.string,
  C.string;
var Xx = function (e) {
  var t = e.size,
    n = e.color,
    r = e.borderWidth,
    i = e.borderColor;
  return B.jsx("circle", {
    r: t / 2,
    fill: n,
    stroke: i,
    strokeWidth: r,
    style: { pointerEvents: "none" },
  });
};
Xx.propTypes = {
  size: C.number.isRequired,
  color: C.string.isRequired,
  borderWidth: C.number.isRequired,
  borderColor: C.string.isRequired,
};
var oj = A.memo(Xx),
  Zx = function (e) {
    var t = e.x,
      n = e.y,
      r = e.symbol,
      i = r === void 0 ? oj : r,
      a = e.size,
      o = e.datum,
      u = e.color,
      s = e.borderWidth,
      l = e.borderColor,
      f = e.label,
      c = e.labelTextAnchor,
      d = c === void 0 ? "middle" : c,
      p = e.labelYOffset,
      g = p === void 0 ? -12 : p,
      y = Xt(),
      b = pu(),
      h = b.animate,
      m = b.config,
      v = Bl({ transform: "translate(" + t + ", " + n + ")", config: m, immediate: !h });
    return B.jsxs(Qt.g, {
      transform: v.transform,
      style: { pointerEvents: "none" },
      children: [
        A.createElement(i, { size: a, color: u, datum: o, borderWidth: s, borderColor: l }),
        f && B.jsx("text", { textAnchor: d, y: g, style: Bx(y.dots.text), children: f }),
      ],
    });
  };
Zx.propTypes = {
  x: C.number.isRequired,
  y: C.number.isRequired,
  datum: C.object.isRequired,
  size: C.number.isRequired,
  color: C.string.isRequired,
  borderWidth: C.number.isRequired,
  borderColor: C.string.isRequired,
  symbol: C.oneOfType([C.func, C.object]),
  label: C.oneOfType([C.string, C.number]),
  labelTextAnchor: C.oneOf(["start", "middle", "end"]),
  labelYOffset: C.number,
};
A.memo(Zx);
var Jx = function (e) {
  var t = e.width,
    n = e.height,
    r = e.axis,
    i = e.scale,
    a = e.value,
    o = e.lineStyle,
    u = e.textStyle,
    s = e.legend,
    l = e.legendNode,
    f = e.legendPosition,
    c = f === void 0 ? "top-right" : f,
    d = e.legendOffsetX,
    p = d === void 0 ? 14 : d,
    g = e.legendOffsetY,
    y = g === void 0 ? 14 : g,
    b = e.legendOrientation,
    h = b === void 0 ? "horizontal" : b,
    m = Xt(),
    v = 0,
    _ = 0,
    S = 0,
    w = 0;
  if ((r === "y" ? ((S = i(a)), (_ = t)) : ((v = i(a)), (w = n)), s && !l)) {
    var T = (function (k) {
      var j = k.axis,
        R = k.width,
        E = k.height,
        q = k.position,
        I = k.offsetX,
        F = k.offsetY,
        D = k.orientation,
        z = 0,
        H = 0,
        P = D === "vertical" ? -90 : 0,
        O = "start";
      if (j === "x")
        switch (q) {
          case "top-left":
            (z = -I), (H = F), (O = "end");
            break;
          case "top":
            (H = -F), (O = D === "horizontal" ? "middle" : "start");
            break;
          case "top-right":
            (z = I), (H = F), (O = D === "horizontal" ? "start" : "end");
            break;
          case "right":
            (z = I), (H = E / 2), (O = D === "horizontal" ? "start" : "middle");
            break;
          case "bottom-right":
            (z = I), (H = E - F), (O = "start");
            break;
          case "bottom":
            (H = E + F), (O = D === "horizontal" ? "middle" : "end");
            break;
          case "bottom-left":
            (H = E - F), (z = -I), (O = D === "horizontal" ? "end" : "start");
            break;
          case "left":
            (z = -I), (H = E / 2), (O = D === "horizontal" ? "end" : "middle");
        }
      else
        switch (q) {
          case "top-left":
            (z = I), (H = -F), (O = "start");
            break;
          case "top":
            (z = R / 2), (H = -F), (O = D === "horizontal" ? "middle" : "start");
            break;
          case "top-right":
            (z = R - I), (H = -F), (O = D === "horizontal" ? "end" : "start");
            break;
          case "right":
            (z = R + I), (O = D === "horizontal" ? "start" : "middle");
            break;
          case "bottom-right":
            (z = R - I), (H = F), (O = "end");
            break;
          case "bottom":
            (z = R / 2), (H = F), (O = D === "horizontal" ? "middle" : "end");
            break;
          case "bottom-left":
            (z = I), (H = F), (O = D === "horizontal" ? "start" : "end");
            break;
          case "left":
            (z = -I), (O = D === "horizontal" ? "end" : "middle");
        }
      return { x: z, y: H, rotation: P, textAnchor: O };
    })({ axis: r, width: t, height: n, position: c, offsetX: p, offsetY: y, orientation: h });
    l = B.jsx("text", {
      transform: "translate(" + T.x + ", " + T.y + ") rotate(" + T.rotation + ")",
      textAnchor: T.textAnchor,
      dominantBaseline: "central",
      style: u,
      children: s,
    });
  }
  return B.jsxs("g", {
    transform: "translate(" + v + ", " + S + ")",
    children: [
      B.jsx("line", {
        x1: 0,
        x2: _,
        y1: 0,
        y2: w,
        stroke: m.markers.lineColor,
        strokeWidth: m.markers.lineStrokeWidth,
        style: o,
      }),
      l,
    ],
  });
};
Jx.propTypes = {
  width: C.number.isRequired,
  height: C.number.isRequired,
  axis: C.oneOf(["x", "y"]).isRequired,
  scale: C.func.isRequired,
  value: C.oneOfType([C.number, C.string, C.instanceOf(Date)]).isRequired,
  lineStyle: C.object,
  textStyle: C.object,
  legend: C.string,
  legendPosition: C.oneOf([
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left",
  ]),
  legendOffsetX: C.number.isRequired,
  legendOffsetY: C.number.isRequired,
  legendOrientation: C.oneOf(["horizontal", "vertical"]).isRequired,
};
var uj = A.memo(Jx),
  e3 = function (e) {
    var t = e.markers,
      n = e.width,
      r = e.height,
      i = e.xScale,
      a = e.yScale;
    return t && t.length !== 0
      ? t.map(function (o, u) {
          return B.jsx(uj, Sr({}, o, { width: n, height: r, scale: o.axis === "y" ? a : i }), u);
        })
      : null;
  };
e3.propTypes = {
  width: C.number.isRequired,
  height: C.number.isRequired,
  xScale: C.func.isRequired,
  yScale: C.func.isRequired,
  markers: C.arrayOf(
    C.shape({
      axis: C.oneOf(["x", "y"]).isRequired,
      value: C.oneOfType([C.number, C.string, C.instanceOf(Date)]).isRequired,
      lineStyle: C.object,
      textStyle: C.object,
    }),
  ),
};
A.memo(e3);
var t3 = function (e) {
    return n9(e)
      ? e
      : function (t) {
          return ta(t, e);
        };
  },
  qc = function (e) {
    return A.useMemo(
      function () {
        return t3(e);
      },
      [e],
    );
  },
  sj = function (e, t, n, r, i, a) {
    return e <= i && i <= e + n && t <= a && a <= t + r;
  },
  Hc = function (e, t) {
    var n,
      r = "touches" in t ? t.touches[0] : t,
      i = r.clientX,
      a = r.clientY,
      o = e.getBoundingClientRect(),
      u =
        (n =
          e.getBBox !== void 0
            ? e.getBBox()
            : { width: e.offsetWidth || 0, height: e.offsetHeight || 0 }).width === o.width
          ? 1
          : n.width / o.width;
    return [(i - o.left) * u, (a - o.top) * u];
  };
function lj() {}
var fj = lj,
  Bc = Nx,
  cj = fj,
  dj = Hp,
  hj = 1 / 0,
  pj =
    Bc && 1 / dj(new Bc([, -0]))[1] == hj
      ? function (e) {
          return new Bc(e);
        }
      : cj,
  mj = pj,
  vj = Pp,
  gj = rx,
  yj = ix,
  bj = Ep,
  _j = mj,
  wj = Hp,
  xj = 200;
function Sj(e, t, n) {
  var r = -1,
    i = gj,
    a = e.length,
    o = !0,
    u = [],
    s = u;
  if (n) (o = !1), (i = yj);
  else if (a >= xj) {
    var l = t ? null : _j(e);
    if (l) return wj(l);
    (o = !1), (i = bj), (s = new vj());
  } else s = t ? [] : u;
  e: for (; ++r < a; ) {
    var f = e[r],
      c = t ? t(f) : f;
    if (((f = n || f !== 0 ? f : 0), o && c === c)) {
      for (var d = s.length; d--; ) if (s[d] === c) continue e;
      t && s.push(c), u.push(f);
    } else i(s, c, n) || (s !== u && s.push(c), u.push(f));
  }
  return u;
}
var $j = Sj,
  Tj = Xl,
  Cj = jx,
  kj = 1,
  Oj = 2;
function Mj(e, t, n, r) {
  var i = n.length,
    a = i,
    o = !r;
  if (e == null) return !a;
  for (e = Object(e); i--; ) {
    var u = n[i];
    if (o && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) return !1;
  }
  for (; ++i < a; ) {
    u = n[i];
    var s = u[0],
      l = e[s],
      f = u[1];
    if (o && u[2]) {
      if (l === void 0 && !(s in e)) return !1;
    } else {
      var c = new Tj();
      if (r) var d = r(l, f, s, e, t, c);
      if (!(d === void 0 ? Cj(f, l, kj | Oj, r, c) : d)) return !1;
    }
  }
  return !0;
}
var Pj = Mj,
  Ej = On;
function Aj(e) {
  return e === e && !Ej(e);
}
var n3 = Aj,
  Rj = n3,
  Fj = hu;
function Dj(e) {
  for (var t = Fj(e), n = t.length; n--; ) {
    var r = t[n],
      i = e[r];
    t[n] = [r, i, Rj(i)];
  }
  return t;
}
var Nj = Dj;
function Ij(e, t) {
  return function (n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
var r3 = Ij,
  Lj = Pj,
  jj = Nj,
  Uj = r3;
function zj(e) {
  var t = jj(e);
  return t.length == 1 && t[0][2]
    ? Uj(t[0][0], t[0][1])
    : function (n) {
        return n === e || Lj(n, e, t);
      };
}
var Wj = zj,
  qj = jx,
  Hj = Ew,
  Bj = kx,
  Vj = fp,
  Qj = n3,
  Yj = r3,
  Gj = xa,
  Kj = 1,
  Xj = 2;
function Zj(e, t) {
  return Vj(e) && Qj(t)
    ? Yj(Gj(e), t)
    : function (n) {
        var r = Hj(n, e);
        return r === void 0 && r === t ? Bj(n, e) : qj(t, r, Kj | Xj);
      };
}
var Jj = Zj;
function eU(e) {
  return function (t) {
    return t == null ? void 0 : t[e];
  };
}
var tU = eU,
  nU = cu;
function rU(e) {
  return function (t) {
    return nU(t, e);
  };
}
var iU = rU,
  aU = tU,
  oU = iU,
  uU = fp,
  sU = xa;
function lU(e) {
  return uU(e) ? aU(sU(e)) : oU(e);
}
var fU = lU,
  cU = Wj,
  dU = Jj,
  hU = nf,
  pU = Mt,
  mU = fU;
function vU(e) {
  return typeof e == "function"
    ? e
    : e == null
      ? hU
      : typeof e == "object"
        ? pU(e)
          ? dU(e[0], e[1])
          : cU(e)
        : mU(e);
}
var Gp = vU,
  gU = Gp,
  yU = $j;
function bU(e, t) {
  return e && e.length ? yU(e, gU(t)) : [];
}
var _U = bU;
const hy = gt(_U);
var wU = dw,
  xU = hu;
function SU(e, t) {
  return e && wU(e, t, xU);
}
var $U = SU,
  TU = ba;
function CU(e, t) {
  return function (n, r) {
    if (n == null) return n;
    if (!TU(n)) return e(n, r);
    for (
      var i = n.length, a = t ? i : -1, o = Object(n);
      (t ? a-- : ++a < i) && r(o[a], a, o) !== !1;

    );
    return n;
  };
}
var kU = CU,
  OU = $U,
  MU = kU,
  PU = MU(OU),
  i3 = PU,
  EU = i3,
  AU = ba;
function RU(e, t) {
  var n = -1,
    r = AU(e) ? Array(e.length) : [];
  return (
    EU(e, function (i, a, o) {
      r[++n] = t(i, a, o);
    }),
    r
  );
}
var FU = RU;
function DU(e, t) {
  var n = e.length;
  for (e.sort(t); n--; ) e[n] = e[n].value;
  return e;
}
var NU = DU,
  py = rf;
function IU(e, t) {
  if (e !== t) {
    var n = e !== void 0,
      r = e === null,
      i = e === e,
      a = py(e),
      o = t !== void 0,
      u = t === null,
      s = t === t,
      l = py(t);
    if ((!u && !l && !a && e > t) || (a && o && s && !u && !l) || (r && o && s) || (!n && s) || !i)
      return 1;
    if ((!r && !a && !l && e < t) || (l && n && i && !r && !a) || (u && n && i) || (!o && i) || !s)
      return -1;
  }
  return 0;
}
var LU = IU,
  jU = LU;
function UU(e, t, n) {
  for (var r = -1, i = e.criteria, a = t.criteria, o = i.length, u = n.length; ++r < o; ) {
    var s = jU(i[r], a[r]);
    if (s) {
      if (r >= u) return s;
      var l = n[r];
      return s * (l == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
var zU = UU,
  Vc = af,
  WU = cu,
  qU = Gp,
  HU = FU,
  BU = NU,
  VU = lu,
  QU = zU,
  YU = nf,
  GU = Mt;
function KU(e, t, n) {
  t.length
    ? (t = Vc(t, function (a) {
        return GU(a)
          ? function (o) {
              return WU(o, a.length === 1 ? a[0] : a);
            }
          : a;
      }))
    : (t = [YU]);
  var r = -1;
  t = Vc(t, VU(qU));
  var i = HU(e, function (a, o, u) {
    var s = Vc(t, function (l) {
      return l(a);
    });
    return { criteria: s, index: ++r, value: a };
  });
  return BU(i, function (a, o) {
    return QU(a, o, n);
  });
}
var XU = KU,
  ZU = Mx,
  JU = XU,
  ez = lp,
  my = Ow;
ez(function (e, t) {
  if (e == null) return [];
  var n = t.length;
  return (
    n > 1 && my(e, t[0], t[1]) ? (t = []) : n > 2 && my(t[0], t[1], t[2]) && (t = [t[0]]),
    JU(e, ZU(t, 1), [])
  );
});
var vy = ef;
vy && vy.isDate;
var Qc = new Date(),
  Yc = new Date();
function Ze(e, t, n, r) {
  function i(a) {
    return e((a = arguments.length === 0 ? new Date() : new Date(+a))), a;
  }
  return (
    (i.floor = function (a) {
      return e((a = new Date(+a))), a;
    }),
    (i.ceil = function (a) {
      return e((a = new Date(a - 1))), t(a, 1), e(a), a;
    }),
    (i.round = function (a) {
      var o = i(a),
        u = i.ceil(a);
      return a - o < u - a ? o : u;
    }),
    (i.offset = function (a, o) {
      return t((a = new Date(+a)), o == null ? 1 : Math.floor(o)), a;
    }),
    (i.range = function (a, o, u) {
      var s = [],
        l;
      if (((a = i.ceil(a)), (u = u == null ? 1 : Math.floor(u)), !(a < o) || !(u > 0))) return s;
      do s.push((l = new Date(+a))), t(a, u), e(a);
      while (l < a && a < o);
      return s;
    }),
    (i.filter = function (a) {
      return Ze(
        function (o) {
          if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
        },
        function (o, u) {
          if (o >= o)
            if (u < 0) for (; ++u <= 0; ) for (; t(o, -1), !a(o); );
            else for (; --u >= 0; ) for (; t(o, 1), !a(o); );
        },
      );
    }),
    n &&
      ((i.count = function (a, o) {
        return Qc.setTime(+a), Yc.setTime(+o), e(Qc), e(Yc), Math.floor(n(Qc, Yc));
      }),
      (i.every = function (a) {
        return (
          (a = Math.floor(a)),
          !isFinite(a) || !(a > 0)
            ? null
            : a > 1
              ? i.filter(
                  r
                    ? function (o) {
                        return r(o) % a === 0;
                      }
                    : function (o) {
                        return i.count(0, o) % a === 0;
                      },
                )
              : i
        );
      })),
    i
  );
}
var Go = Ze(
  function () {},
  function (e, t) {
    e.setTime(+e + t);
  },
  function (e, t) {
    return t - e;
  },
);
Go.every = function (e) {
  return (
    (e = Math.floor(e)),
    !isFinite(e) || !(e > 0)
      ? null
      : e > 1
        ? Ze(
            function (t) {
              t.setTime(Math.floor(t / e) * e);
            },
            function (t, n) {
              t.setTime(+t + n * e);
            },
            function (t, n) {
              return (n - t) / e;
            },
          )
        : Go
  );
};
Go.range;
var ml = 1e3,
  la = 6e4,
  vl = 36e5,
  a3 = 6048e5,
  Fh = Ze(
    function (e) {
      e.setTime(e - e.getMilliseconds());
    },
    function (e, t) {
      e.setTime(+e + t * ml);
    },
    function (e, t) {
      return (t - e) / ml;
    },
    function (e) {
      return e.getUTCSeconds();
    },
  );
Fh.range;
var o3 = Ze(
  function (e) {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * ml);
  },
  function (e, t) {
    e.setTime(+e + t * la);
  },
  function (e, t) {
    return (t - e) / la;
  },
  function (e) {
    return e.getMinutes();
  },
);
o3.range;
var u3 = Ze(
  function (e) {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * ml - e.getMinutes() * la);
  },
  function (e, t) {
    e.setTime(+e + t * vl);
  },
  function (e, t) {
    return (t - e) / vl;
  },
  function (e) {
    return e.getHours();
  },
);
u3.range;
function hi(e) {
  return Ze(
    function (t) {
      t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0);
    },
    function (t, n) {
      t.setDate(t.getDate() + n * 7);
    },
    function (t, n) {
      return (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * la) / a3;
    },
  );
}
var Dh = hi(0),
  s3 = hi(1),
  l3 = hi(2),
  f3 = hi(3),
  c3 = hi(4),
  d3 = hi(5),
  h3 = hi(6);
Dh.range;
s3.range;
l3.range;
f3.range;
c3.range;
d3.range;
h3.range;
var p3 = Ze(
  function (e) {
    e.setDate(1), e.setHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setMonth(e.getMonth() + t);
  },
  function (e, t) {
    return t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12;
  },
  function (e) {
    return e.getMonth();
  },
);
p3.range;
var Kp = Ze(
  function (e) {
    e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setFullYear(e.getFullYear() + t);
  },
  function (e, t) {
    return t.getFullYear() - e.getFullYear();
  },
  function (e) {
    return e.getFullYear();
  },
);
Kp.every = function (e) {
  return !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Ze(
        function (t) {
          t.setFullYear(Math.floor(t.getFullYear() / e) * e),
            t.setMonth(0, 1),
            t.setHours(0, 0, 0, 0);
        },
        function (t, n) {
          t.setFullYear(t.getFullYear() + n * e);
        },
      );
};
Kp.range;
var m3 = Ze(
  function (e) {
    e.setUTCSeconds(0, 0);
  },
  function (e, t) {
    e.setTime(+e + t * la);
  },
  function (e, t) {
    return (t - e) / la;
  },
  function (e) {
    return e.getUTCMinutes();
  },
);
m3.range;
var v3 = Ze(
  function (e) {
    e.setUTCMinutes(0, 0, 0);
  },
  function (e, t) {
    e.setTime(+e + t * vl);
  },
  function (e, t) {
    return (t - e) / vl;
  },
  function (e) {
    return e.getUTCHours();
  },
);
v3.range;
function pi(e) {
  return Ze(
    function (t) {
      t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0);
    },
    function (t, n) {
      t.setUTCDate(t.getUTCDate() + n * 7);
    },
    function (t, n) {
      return (n - t) / a3;
    },
  );
}
var Nh = pi(0),
  g3 = pi(1),
  y3 = pi(2),
  b3 = pi(3),
  _3 = pi(4),
  w3 = pi(5),
  x3 = pi(6);
Nh.range;
g3.range;
y3.range;
b3.range;
_3.range;
w3.range;
x3.range;
var S3 = Ze(
  function (e) {
    e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setUTCMonth(e.getUTCMonth() + t);
  },
  function (e, t) {
    return t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12;
  },
  function (e) {
    return e.getUTCMonth();
  },
);
S3.range;
var Xp = Ze(
  function (e) {
    e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
  },
  function (e, t) {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  },
  function (e, t) {
    return t.getUTCFullYear() - e.getUTCFullYear();
  },
  function (e) {
    return e.getUTCFullYear();
  },
);
Xp.every = function (e) {
  return !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : Ze(
        function (t) {
          t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
            t.setUTCMonth(0, 1),
            t.setUTCHours(0, 0, 0, 0);
        },
        function (t, n) {
          t.setUTCFullYear(t.getUTCFullYear() + n * e);
        },
      );
};
Xp.range;
var wi = [
    function (e) {
      return e.setMilliseconds(0);
    },
    function (e) {
      return e.setSeconds(0);
    },
    function (e) {
      return e.setMinutes(0);
    },
    function (e) {
      return e.setHours(0);
    },
    function (e) {
      return e.setDate(1);
    },
    function (e) {
      return e.setMonth(0);
    },
  ],
  tz = {
    millisecond: [],
    second: wi.slice(0, 1),
    minute: wi.slice(0, 2),
    hour: wi.slice(0, 3),
    day: wi.slice(0, 4),
    month: wi.slice(0, 5),
    year: wi.slice(0, 6),
  },
  nz = function (e) {
    return function (t) {
      return (
        tz[e].forEach(function (n) {
          n(t);
        }),
        t
      );
    };
  },
  rz = function (e) {
    var t = e.format,
      n = t === void 0 ? "native" : t,
      r = e.precision,
      i = r === void 0 ? "millisecond" : r,
      a = e.useUTC,
      o = a === void 0 || a,
      u = nz(i);
    return function (s) {
      if (s === void 0) return s;
      if (n === "native" || s instanceof Date) return u(s);
      var l = o ? Cx(n) : Tx(n);
      return u(l(s));
    };
  },
  iz = function (e, t, n, r) {
    var i,
      a,
      o,
      u,
      s = e.min,
      l = s === void 0 ? 0 : s,
      f = e.max,
      c = f === void 0 ? "auto" : f,
      d = e.stacked,
      p = d !== void 0 && d,
      g = e.reverse,
      y = g !== void 0 && g,
      b = e.clamp,
      h = b !== void 0 && b,
      m = e.nice,
      v = m !== void 0 && m;
    l === "auto" ? (i = p === !0 ? ((a = t.minStacked) != null ? a : 0) : t.min) : (i = l),
      c === "auto" ? (o = p === !0 ? ((u = t.maxStacked) != null ? u : 0) : t.max) : (o = c);
    var _ = Hw()
      .rangeRound(r === "x" ? [0, n] : [n, 0])
      .domain(y ? [o, i] : [i, o])
      .clamp(h);
    return v === !0 ? _.nice() : typeof v == "number" && _.nice(v), az(_, p);
  },
  az = function (e, t) {
    t === void 0 && (t = !1);
    var n = e;
    return (n.type = "linear"), (n.stacked = t), n;
  },
  oz = function (e, t, n) {
    var r = oE().range([0, n]).domain(t.all);
    return (r.type = "point"), r;
  },
  uz = function (e, t, n, r) {
    var i = e.round,
      a = i === void 0 || i,
      o = yp()
        .range(r === "x" ? [0, n] : [n, 0])
        .domain(t.all)
        .round(a);
    return sz(o);
  },
  sz = function (e) {
    var t = e;
    return (t.type = "band"), t;
  },
  lz = function (e, t, n) {
    var r,
      i,
      a = e.format,
      o = a === void 0 ? "native" : a,
      u = e.precision,
      s = u === void 0 ? "millisecond" : u,
      l = e.min,
      f = l === void 0 ? "auto" : l,
      c = e.max,
      d = c === void 0 ? "auto" : c,
      p = e.useUTC,
      g = p === void 0 || p,
      y = e.nice,
      b = y !== void 0 && y,
      h = rz({ format: o, precision: s, useUTC: g });
    (r = f === "auto" ? h(t.min) : o !== "native" ? h(f) : f),
      (i = d === "auto" ? h(t.max) : o !== "native" ? h(d) : d);
    var m = g ? QA() : VA();
    m.range([0, n]),
      r && i && m.domain([r, i]),
      b === !0 ? m.nice() : (typeof b != "object" && typeof b != "number") || m.nice(b);
    var v = m;
    return (v.type = "time"), (v.useUTC = g), v;
  },
  fz = function (e, t, n, r) {
    var i,
      a = e.base,
      o = a === void 0 ? 10 : a,
      u = e.min,
      s = u === void 0 ? "auto" : u,
      l = e.max,
      f = l === void 0 ? "auto" : l;
    if (
      t.all.some(function (y) {
        return y === 0;
      })
    )
      throw new Error("a log scale domain must not include or cross zero");
    var c,
      d,
      p = !1;
    if (
      (t.all
        .filter(function (y) {
          return y != null;
        })
        .forEach(function (y) {
          p || (i === void 0 ? (i = Math.sign(y)) : Math.sign(y) !== i && (p = !0));
        }),
      p)
    )
      throw new Error("a log scale domain must be strictly-positive or strictly-negative");
    (c = s === "auto" ? t.min : s), (d = f === "auto" ? t.max : f);
    var g = Vw()
      .domain([c, d])
      .rangeRound(r === "x" ? [0, n] : [n, 0])
      .base(o)
      .nice();
    return (g.type = "log"), g;
  },
  cz = function (e, t, n, r) {
    var i,
      a,
      o = e.constant,
      u = o === void 0 ? 1 : o,
      s = e.min,
      l = s === void 0 ? "auto" : s,
      f = e.max,
      c = f === void 0 ? "auto" : f,
      d = e.reverse,
      p = d !== void 0 && d;
    (i = l === "auto" ? t.min : l), (a = c === "auto" ? t.max : c);
    var g = Qw()
      .constant(u)
      .rangeRound(r === "x" ? [0, n] : [n, 0])
      .nice();
    p === !0 ? g.domain([a, i]) : g.domain([i, a]);
    var y = g;
    return (y.type = "symlog"), y;
  };
function Zp(e, t, n, r) {
  switch (e.type) {
    case "linear":
      return iz(e, t, n, r);
    case "point":
      return oz(e, t, n);
    case "band":
      return uz(e, t, n, r);
    case "time":
      return lz(e, t, n);
    case "log":
      return fz(e, t, n, r);
    case "symlog":
      return cz(e, t, n, r);
    default:
      throw new Error("invalid scale spec");
  }
}
var $3 = function (e) {
    var t = e.bandwidth();
    if (t === 0) return e;
    var n = t / 2;
    return (
      e.round() && (n = Math.round(n)),
      function (r) {
        var i;
        return ((i = e(r)) != null ? i : 0) + n;
      }
    );
  },
  T3 = {
    millisecond: [Go, Go],
    second: [Fh, Fh],
    minute: [o3, m3],
    hour: [u3, v3],
    day: [
      Ze(
        function (e) {
          return e.setHours(0, 0, 0, 0);
        },
        function (e, t) {
          return e.setDate(e.getDate() + t);
        },
        function (e, t) {
          return (t.getTime() - e.getTime()) / 864e5;
        },
        function (e) {
          return Math.floor(e.getTime() / 864e5);
        },
      ),
      Ze(
        function (e) {
          return e.setUTCHours(0, 0, 0, 0);
        },
        function (e, t) {
          return e.setUTCDate(e.getUTCDate() + t);
        },
        function (e, t) {
          return (t.getTime() - e.getTime()) / 864e5;
        },
        function (e) {
          return Math.floor(e.getTime() / 864e5);
        },
      ),
    ],
    week: [Dh, Nh],
    sunday: [Dh, Nh],
    monday: [s3, g3],
    tuesday: [l3, y3],
    wednesday: [f3, b3],
    thursday: [c3, _3],
    friday: [d3, w3],
    saturday: [h3, x3],
    month: [p3, S3],
    year: [Kp, Xp],
  },
  dz = Object.keys(T3),
  hz = new RegExp("^every\\s*(\\d+)?\\s*(" + dz.join("|") + ")s?$", "i"),
  C3 = function (e, t) {
    if (Array.isArray(t)) return t;
    if (typeof t == "string" && "useUTC" in e) {
      var n = t.match(hz);
      if (n) {
        var r = n[1],
          i = n[2],
          a = T3[i][e.useUTC ? 1 : 0];
        if (i === "day") {
          var o,
            u,
            s = e.domain(),
            l = s[0],
            f = s[1],
            c = new Date(f);
          return (
            c.setDate(c.getDate() + 1),
            (o = (u = a.every(Number(r ?? 1))) == null ? void 0 : u.range(l, c)) != null ? o : []
          );
        }
        if (r === void 0) return e.ticks(a);
        var d = a.every(Number(r));
        if (d) return e.ticks(d);
      }
      throw new Error("Invalid tickValues: " + t);
    }
    if ("ticks" in e) {
      if (t === void 0) return e.ticks();
      if (typeof (p = t) == "number" && isFinite(p) && Math.floor(p) === p) return e.ticks(t);
    }
    var p;
    return e.domain();
  };
function Yt() {
  return (
    (Yt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Yt.apply(this, arguments)
  );
}
var k3 = function (e) {
    var t,
      n = e.axis,
      r = e.scale,
      i = e.ticksPosition,
      a = e.tickValues,
      o = e.tickSize,
      u = e.tickPadding,
      s = e.tickRotation,
      l = e.truncateTickAt,
      f = e.engine,
      c = f === void 0 ? "svg" : f,
      d = C3(r, a),
      p = rj[c],
      g = "bandwidth" in r ? $3(r) : r,
      y = { lineX: 0, lineY: 0 },
      b = { textX: 0, textY: 0 },
      h = typeof document == "object" && document.dir === "rtl",
      m = p.align.center,
      v = p.baseline.center;
    return (
      n === "x"
        ? ((t = function (_) {
            var S;
            return { x: (S = g(_)) != null ? S : 0, y: 0 };
          }),
          (y.lineY = o * (i === "after" ? 1 : -1)),
          (b.textY = (o + u) * (i === "after" ? 1 : -1)),
          (v = i === "after" ? p.baseline.top : p.baseline.bottom),
          s === 0
            ? (m = p.align.center)
            : (i === "after" && s < 0) || (i === "before" && s > 0)
              ? ((m = p.align[h ? "left" : "right"]), (v = p.baseline.center))
              : ((i === "after" && s > 0) || (i === "before" && s < 0)) &&
                ((m = p.align[h ? "right" : "left"]), (v = p.baseline.center)))
        : ((t = function (_) {
            var S;
            return { x: 0, y: (S = g(_)) != null ? S : 0 };
          }),
          (y.lineX = o * (i === "after" ? 1 : -1)),
          (b.textX = (o + u) * (i === "after" ? 1 : -1)),
          (m = i === "after" ? p.align.left : p.align.right)),
      {
        ticks: d.map(function (_) {
          var S =
            typeof _ == "string"
              ? (function (w) {
                  var T = String(w).length;
                  return l && l > 0 && T > l ? "" + String(w).slice(0, l).concat("...") : "" + w;
                })(_)
              : _;
          return Yt({ key: _ instanceof Date ? "" + _.valueOf() : "" + _, value: S }, t(_), y, b);
        }),
        textAlign: m,
        textBaseline: v,
      }
    );
  },
  O3 = function (e, t) {
    if (e === void 0 || typeof e == "function") return e;
    if (t.type === "time") {
      var n = Wp(e);
      return function (r) {
        return n(r instanceof Date ? r : new Date(r));
      };
    }
    return Ip(e);
  },
  Ih = function (e) {
    var t,
      n = e.width,
      r = e.height,
      i = e.scale,
      a = e.axis,
      o = e.values,
      u = ((t = o), (Array.isArray(t) ? o : void 0) || C3(i, o)),
      s = "bandwidth" in i ? $3(i) : i,
      l =
        a === "x"
          ? u.map(function (f) {
              var c, d;
              return {
                key: f instanceof Date ? "" + f.valueOf() : "" + f,
                x1: (c = s(f)) != null ? c : 0,
                x2: (d = s(f)) != null ? d : 0,
                y1: 0,
                y2: r,
              };
            })
          : u.map(function (f) {
              var c, d;
              return {
                key: f instanceof Date ? "" + f.valueOf() : "" + f,
                x1: 0,
                x2: n,
                y1: (c = s(f)) != null ? c : 0,
                y2: (d = s(f)) != null ? d : 0,
              };
            });
    return l;
  },
  pz = A.memo(function (e) {
    var t,
      n = e.value,
      r = e.format,
      i = e.lineX,
      a = e.lineY,
      o = e.onClick,
      u = e.textBaseline,
      s = e.textAnchor,
      l = e.animatedProps,
      f = Xt(),
      c = f.axis.ticks.line,
      d = f.axis.ticks.text,
      p = (t = r == null ? void 0 : r(n)) != null ? t : n,
      g = A.useMemo(
        function () {
          var y = { opacity: l.opacity };
          return o
            ? {
                style: Yt({}, y, { cursor: "pointer" }),
                onClick: function (b) {
                  return o(b, p);
                },
              }
            : { style: y };
        },
        [l.opacity, o, p],
      );
    return B.jsxs(
      Qt.g,
      Yt({ transform: l.transform }, g, {
        children: [
          B.jsx("line", { x1: 0, x2: i, y1: 0, y2: a, style: c }),
          d.outlineWidth > 0 &&
            B.jsx(Qt.text, {
              dominantBaseline: u,
              textAnchor: s,
              transform: l.textTransform,
              style: d,
              strokeWidth: 2 * d.outlineWidth,
              stroke: d.outlineColor,
              strokeLinejoin: "round",
              children: "" + p,
            }),
          B.jsx(Qt.text, {
            dominantBaseline: u,
            textAnchor: s,
            transform: l.textTransform,
            style: Bx(d),
            children: "" + p,
          }),
        ],
      }),
    );
  }),
  mz = function (e) {
    var t = e.axis,
      n = e.scale,
      r = e.x,
      i = r === void 0 ? 0 : r,
      a = e.y,
      o = a === void 0 ? 0 : a,
      u = e.length,
      s = e.ticksPosition,
      l = e.tickValues,
      f = e.tickSize,
      c = f === void 0 ? 5 : f,
      d = e.tickPadding,
      p = d === void 0 ? 5 : d,
      g = e.tickRotation,
      y = g === void 0 ? 0 : g,
      b = e.format,
      h = e.renderTick,
      m = h === void 0 ? pz : h,
      v = e.truncateTickAt,
      _ = e.legend,
      S = e.legendPosition,
      w = S === void 0 ? "end" : S,
      T = e.legendOffset,
      k = T === void 0 ? 0 : T,
      j = e.onClick,
      R = e.ariaHidden,
      E = Xt(),
      q = E.axis.legend.text,
      I = A.useMemo(
        function () {
          return O3(b, n);
        },
        [b, n],
      ),
      F = k3({
        axis: t,
        scale: n,
        ticksPosition: s,
        tickValues: l,
        tickSize: c,
        tickPadding: p,
        tickRotation: y,
        truncateTickAt: v,
      }),
      D = F.ticks,
      z = F.textAlign,
      H = F.textBaseline,
      P = null;
    if (_ !== void 0) {
      var O,
        W = 0,
        K = 0,
        X = 0;
      t === "y"
        ? ((X = -90),
          (W = k),
          w === "start"
            ? ((O = "start"), (K = u))
            : w === "middle"
              ? ((O = "middle"), (K = u / 2))
              : w === "end" && (O = "end"))
        : ((K = k),
          w === "start"
            ? (O = "start")
            : w === "middle"
              ? ((O = "middle"), (W = u / 2))
              : w === "end" && ((O = "end"), (W = u))),
        (P = B.jsxs(B.Fragment, {
          children: [
            q.outlineWidth > 0 &&
              B.jsx("text", {
                transform: "translate(" + W + ", " + K + ") rotate(" + X + ")",
                textAnchor: O,
                style: Yt({ dominantBaseline: "central" }, q),
                strokeWidth: 2 * q.outlineWidth,
                stroke: q.outlineColor,
                strokeLinejoin: "round",
                children: _,
              }),
            B.jsx("text", {
              transform: "translate(" + W + ", " + K + ") rotate(" + X + ")",
              textAnchor: O,
              style: Yt({ dominantBaseline: "central" }, q),
              children: _,
            }),
          ],
        }));
    }
    var Oe = pu(),
      ve = Oe.animate,
      se = Oe.config,
      oe = Bl({
        transform: "translate(" + i + "," + o + ")",
        lineX2: t === "x" ? u : 0,
        lineY2: t === "x" ? 0 : u,
        config: se,
        immediate: !ve,
      }),
      te = A.useCallback(
        function (N) {
          return {
            opacity: 1,
            transform: "translate(" + N.x + "," + N.y + ")",
            textTransform: "translate(" + N.textX + "," + N.textY + ") rotate(" + y + ")",
          };
        },
        [y],
      ),
      tt = A.useCallback(
        function (N) {
          return {
            opacity: 0,
            transform: "translate(" + N.x + "," + N.y + ")",
            textTransform: "translate(" + N.textX + "," + N.textY + ") rotate(" + y + ")",
          };
        },
        [y],
      ),
      M = ew(D, {
        keys: function (N) {
          return N.key;
        },
        initial: te,
        from: tt,
        enter: te,
        update: te,
        leave: { opacity: 0 },
        config: se,
        immediate: !ve,
      });
    return B.jsxs(Qt.g, {
      transform: oe.transform,
      "aria-hidden": R,
      children: [
        M(function (N, V, x, re) {
          return A.createElement(
            m,
            Yt(
              {
                tickIndex: re,
                format: I,
                rotate: y,
                textBaseline: H,
                textAnchor: z,
                truncateTickAt: v,
                animatedProps: N,
              },
              V,
              j ? { onClick: j } : {},
            ),
          );
        }),
        B.jsx(Qt.line, { style: E.axis.domain.line, x1: 0, x2: oe.lineX2, y1: 0, y2: oe.lineY2 }),
        P,
      ],
    });
  },
  vz = A.memo(mz),
  M3 = ["top", "right", "bottom", "left"];
A.memo(function (e) {
  var t = e.xScale,
    n = e.yScale,
    r = e.width,
    i = e.height,
    a = { top: e.top, right: e.right, bottom: e.bottom, left: e.left };
  return B.jsx(B.Fragment, {
    children: M3.map(function (o) {
      var u = a[o];
      if (!u) return null;
      var s = o === "top" || o === "bottom";
      return B.jsx(
        vz,
        Yt({}, u, {
          axis: s ? "x" : "y",
          x: o === "right" ? r : 0,
          y: o === "bottom" ? i : 0,
          scale: s ? t : n,
          length: s ? r : i,
          ticksPosition: o === "top" || o === "left" ? "before" : "after",
          truncateTickAt: u.truncateTickAt,
        }),
        o,
      );
    }),
  });
});
var gz = A.memo(function (e) {
    var t = e.animatedProps,
      n = Xt();
    return B.jsx(Qt.line, Yt({}, t, n.grid.line));
  }),
  gy = A.memo(function (e) {
    var t = e.lines,
      n = pu(),
      r = n.animate,
      i = n.config,
      a = ew(t, {
        keys: function (o) {
          return o.key;
        },
        initial: function (o) {
          return { opacity: 1, x1: o.x1, x2: o.x2, y1: o.y1, y2: o.y2 };
        },
        from: function (o) {
          return { opacity: 0, x1: o.x1, x2: o.x2, y1: o.y1, y2: o.y2 };
        },
        enter: function (o) {
          return { opacity: 1, x1: o.x1, x2: o.x2, y1: o.y1, y2: o.y2 };
        },
        update: function (o) {
          return { opacity: 1, x1: o.x1, x2: o.x2, y1: o.y1, y2: o.y2 };
        },
        leave: { opacity: 0 },
        config: i,
        immediate: !r,
      });
    return B.jsx("g", {
      children: a(function (o, u) {
        return A.createElement(gz, Yt({}, u, { key: u.key, animatedProps: o }));
      }),
    });
  });
A.memo(function (e) {
  var t = e.width,
    n = e.height,
    r = e.xScale,
    i = e.yScale,
    a = e.xValues,
    o = e.yValues,
    u = A.useMemo(
      function () {
        return !!r && Ih({ width: t, height: n, scale: r, axis: "x", values: a });
      },
      [r, a, t, n],
    ),
    s = A.useMemo(
      function () {
        return !!i && Ih({ width: t, height: n, scale: i, axis: "y", values: o });
      },
      [n, t, i, o],
    );
  return B.jsxs(B.Fragment, {
    children: [u && B.jsx(gy, { lines: u }), s && B.jsx(gy, { lines: s })],
  });
});
var yz = function (e, t) {
    var n,
      r = t.axis,
      i = t.scale,
      a = t.x,
      o = a === void 0 ? 0 : a,
      u = t.y,
      s = u === void 0 ? 0 : u,
      l = t.length,
      f = t.ticksPosition,
      c = t.tickValues,
      d = t.tickSize,
      p = d === void 0 ? 5 : d,
      g = t.tickPadding,
      y = g === void 0 ? 5 : g,
      b = t.tickRotation,
      h = b === void 0 ? 0 : b,
      m = t.format,
      v = t.legend,
      _ = t.legendPosition,
      S = _ === void 0 ? "end" : _,
      w = t.legendOffset,
      T = w === void 0 ? 0 : w,
      k = t.theme,
      j = k3({
        axis: r,
        scale: i,
        ticksPosition: f,
        tickValues: c,
        tickSize: p,
        tickPadding: y,
        tickRotation: h,
        engine: "canvas",
      }),
      R = j.ticks,
      E = j.textAlign,
      q = j.textBaseline;
    e.save(), e.translate(o, s), (e.textAlign = E), (e.textBaseline = q);
    var I = k.axis.ticks.text;
    (e.font = (I.fontWeight ? I.fontWeight + " " : "") + I.fontSize + "px " + I.fontFamily),
      ((n = k.axis.domain.line.strokeWidth) != null ? n : 0) > 0 &&
        ((e.lineWidth = Number(k.axis.domain.line.strokeWidth)),
        (e.lineCap = "square"),
        k.axis.domain.line.stroke && (e.strokeStyle = k.axis.domain.line.stroke),
        e.beginPath(),
        e.moveTo(0, 0),
        e.lineTo(r === "x" ? l : 0, r === "x" ? 0 : l),
        e.stroke());
    var F =
      typeof m == "function"
        ? m
        : function (O) {
            return "" + O;
          };
    if (
      (R.forEach(function (O) {
        var W;
        ((W = k.axis.ticks.line.strokeWidth) != null ? W : 0) > 0 &&
          ((e.lineWidth = Number(k.axis.ticks.line.strokeWidth)),
          (e.lineCap = "square"),
          k.axis.ticks.line.stroke && (e.strokeStyle = k.axis.ticks.line.stroke),
          e.beginPath(),
          e.moveTo(O.x, O.y),
          e.lineTo(O.x + O.lineX, O.y + O.lineY),
          e.stroke());
        var K = F(O.value);
        e.save(),
          e.translate(O.x + O.textX, O.y + O.textY),
          e.rotate(Yo(h)),
          I.outlineWidth > 0 &&
            ((e.strokeStyle = I.outlineColor),
            (e.lineWidth = 2 * I.outlineWidth),
            (e.lineJoin = "round"),
            e.strokeText("" + K, 0, 0)),
          k.axis.ticks.text.fill && (e.fillStyle = I.fill),
          e.fillText("" + K, 0, 0),
          e.restore();
      }),
      v !== void 0)
    ) {
      var D = 0,
        z = 0,
        H = 0,
        P = "center";
      r === "y"
        ? ((H = -90),
          (D = T),
          S === "start"
            ? ((P = "start"), (z = l))
            : S === "middle"
              ? ((P = "center"), (z = l / 2))
              : S === "end" && (P = "end"))
        : ((z = T),
          S === "start"
            ? (P = "start")
            : S === "middle"
              ? ((P = "center"), (D = l / 2))
              : S === "end" && ((P = "end"), (D = l))),
        e.translate(D, z),
        e.rotate(Yo(H)),
        (e.font =
          (k.axis.legend.text.fontWeight ? k.axis.legend.text.fontWeight + " " : "") +
          k.axis.legend.text.fontSize +
          "px " +
          k.axis.legend.text.fontFamily),
        k.axis.legend.text.fill && (e.fillStyle = k.axis.legend.text.fill),
        (e.textAlign = P),
        (e.textBaseline = "middle"),
        e.fillText(v, 0, 0);
    }
    e.restore();
  },
  bz = function (e, t) {
    var n = t.xScale,
      r = t.yScale,
      i = t.width,
      a = t.height,
      o = t.top,
      u = t.right,
      s = t.bottom,
      l = t.left,
      f = t.theme,
      c = { top: o, right: u, bottom: s, left: l };
    M3.forEach(function (d) {
      var p = c[d];
      if (!p) return null;
      var g = d === "top" || d === "bottom",
        y = d === "top" || d === "left" ? "before" : "after",
        b = g ? n : r,
        h = O3(p.format, b);
      yz(
        e,
        Yt({}, p, {
          axis: g ? "x" : "y",
          x: d === "right" ? i : 0,
          y: d === "bottom" ? a : 0,
          scale: b,
          format: h,
          length: g ? i : a,
          ticksPosition: y,
          theme: f,
        }),
      );
    });
  },
  yy = function (e, t) {
    var n = t.width,
      r = t.height,
      i = t.scale,
      a = t.axis,
      o = t.values;
    Ih({ width: n, height: r, scale: i, axis: a, values: o }).forEach(function (u) {
      e.beginPath(), e.moveTo(u.x1, u.y1), e.lineTo(u.x2, u.y2), e.stroke();
    });
  },
  _z = i3;
function wz(e, t) {
  var n = [];
  return (
    _z(e, function (r, i, a) {
      t(r, i, a) && n.push(r);
    }),
    n
  );
}
var xz = wz,
  Sz = Rx,
  $z = xz,
  Tz = Gp,
  Cz = Mt;
function kz(e, t) {
  var n = Cz(e) ? Sz : $z;
  return n(e, Tz(t));
}
var Oz = kz;
const Mz = gt(Oz);
var Pz = kr,
  Ez = cn,
  Az = "[object Number]";
function Rz(e) {
  return typeof e == "number" || (Ez(e) && Pz(e) == Az);
}
var Fz = Rz;
const by = gt(Fz);
function Dz(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== !1; );
  return e;
}
var Nz = Dz,
  Iz = _a,
  Lz = hu;
function jz(e, t) {
  return e && Iz(t, Lz(t), e);
}
var Uz = jz,
  zz = _a,
  Wz = fu;
function qz(e, t) {
  return e && zz(t, Wz(t), e);
}
var Hz = qz,
  Bz = _a,
  Vz = Bp;
function Qz(e, t) {
  return Bz(e, Vz(e), t);
}
var Yz = Qz,
  Gz = qp,
  Kz = rp,
  Xz = Bp,
  Zz = Fx,
  Jz = Object.getOwnPropertySymbols,
  eW = Jz
    ? function (e) {
        for (var t = []; e; ) Gz(t, Xz(e)), (e = Kz(e));
        return t;
      }
    : Zz,
  P3 = eW,
  tW = _a,
  nW = P3;
function rW(e, t) {
  return tW(e, nW(e), t);
}
var iW = rW,
  aW = Ax,
  oW = P3,
  uW = fu;
function sW(e) {
  return aW(e, uW, oW);
}
var E3 = sW,
  lW = Object.prototype,
  fW = lW.hasOwnProperty;
function cW(e) {
  var t = e.length,
    n = new e.constructor(t);
  return (
    t &&
      typeof e[0] == "string" &&
      fW.call(e, "index") &&
      ((n.index = e.index), (n.input = e.input)),
    n
  );
}
var dW = cW,
  hW = np;
function pW(e, t) {
  var n = t ? hW(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var mW = pW,
  vW = /\w*$/;
function gW(e) {
  var t = new e.constructor(e.source, vW.exec(e));
  return (t.lastIndex = e.lastIndex), t;
}
var yW = gW,
  _y = ma,
  wy = _y ? _y.prototype : void 0,
  xy = wy ? wy.valueOf : void 0;
function bW(e) {
  return xy ? Object(xy.call(e)) : {};
}
var _W = bW,
  wW = np,
  xW = mW,
  SW = yW,
  $W = _W,
  TW = mw,
  CW = "[object Boolean]",
  kW = "[object Date]",
  OW = "[object Map]",
  MW = "[object Number]",
  PW = "[object RegExp]",
  EW = "[object Set]",
  AW = "[object String]",
  RW = "[object Symbol]",
  FW = "[object ArrayBuffer]",
  DW = "[object DataView]",
  NW = "[object Float32Array]",
  IW = "[object Float64Array]",
  LW = "[object Int8Array]",
  jW = "[object Int16Array]",
  UW = "[object Int32Array]",
  zW = "[object Uint8Array]",
  WW = "[object Uint8ClampedArray]",
  qW = "[object Uint16Array]",
  HW = "[object Uint32Array]";
function BW(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case FW:
      return wW(e);
    case CW:
    case kW:
      return new r(+e);
    case DW:
      return xW(e, n);
    case NW:
    case IW:
    case LW:
    case jW:
    case UW:
    case zW:
    case WW:
    case qW:
    case HW:
      return TW(e, n);
    case OW:
      return new r();
    case MW:
    case AW:
      return new r(e);
    case PW:
      return SW(e);
    case EW:
      return new r();
    case RW:
      return $W(e);
  }
}
var VW = BW,
  QW = qf,
  YW = cn,
  GW = "[object Map]";
function KW(e) {
  return YW(e) && QW(e) == GW;
}
var XW = KW,
  ZW = XW,
  JW = lu,
  Sy = ef,
  $y = Sy && Sy.isMap,
  eq = $y ? JW($y) : ZW,
  tq = eq,
  nq = qf,
  rq = cn,
  iq = "[object Set]";
function aq(e) {
  return rq(e) && nq(e) == iq;
}
var oq = aq,
  uq = oq,
  sq = lu,
  Ty = ef,
  Cy = Ty && Ty.isSet,
  lq = Cy ? sq(Cy) : uq,
  fq = lq,
  cq = Xl,
  dq = Nz,
  hq = sp,
  pq = Uz,
  mq = Hz,
  vq = hw,
  gq = vw,
  yq = Yz,
  bq = iW,
  _q = Dx,
  wq = E3,
  xq = qf,
  Sq = dW,
  $q = VW,
  Tq = yw,
  Cq = Mt,
  kq = Jl,
  Oq = tq,
  Mq = On,
  Pq = fq,
  Eq = hu,
  Aq = fu,
  Rq = 1,
  Fq = 2,
  Dq = 4,
  A3 = "[object Arguments]",
  Nq = "[object Array]",
  Iq = "[object Boolean]",
  Lq = "[object Date]",
  jq = "[object Error]",
  R3 = "[object Function]",
  Uq = "[object GeneratorFunction]",
  zq = "[object Map]",
  Wq = "[object Number]",
  F3 = "[object Object]",
  qq = "[object RegExp]",
  Hq = "[object Set]",
  Bq = "[object String]",
  Vq = "[object Symbol]",
  Qq = "[object WeakMap]",
  Yq = "[object ArrayBuffer]",
  Gq = "[object DataView]",
  Kq = "[object Float32Array]",
  Xq = "[object Float64Array]",
  Zq = "[object Int8Array]",
  Jq = "[object Int16Array]",
  eH = "[object Int32Array]",
  tH = "[object Uint8Array]",
  nH = "[object Uint8ClampedArray]",
  rH = "[object Uint16Array]",
  iH = "[object Uint32Array]",
  we = {};
we[A3] =
  we[Nq] =
  we[Yq] =
  we[Gq] =
  we[Iq] =
  we[Lq] =
  we[Kq] =
  we[Xq] =
  we[Zq] =
  we[Jq] =
  we[eH] =
  we[zq] =
  we[Wq] =
  we[F3] =
  we[qq] =
  we[Hq] =
  we[Bq] =
  we[Vq] =
  we[tH] =
  we[nH] =
  we[rH] =
  we[iH] =
    !0;
we[jq] = we[R3] = we[Qq] = !1;
function hs(e, t, n, r, i, a) {
  var o,
    u = t & Rq,
    s = t & Fq,
    l = t & Dq;
  if ((n && (o = i ? n(e, r, i, a) : n(e)), o !== void 0)) return o;
  if (!Mq(e)) return e;
  var f = Cq(e);
  if (f) {
    if (((o = Sq(e)), !u)) return gq(e, o);
  } else {
    var c = xq(e),
      d = c == R3 || c == Uq;
    if (kq(e)) return vq(e, u);
    if (c == F3 || c == A3 || (d && !i)) {
      if (((o = s || d ? {} : Tq(e)), !u)) return s ? bq(e, mq(o, e)) : yq(e, pq(o, e));
    } else {
      if (!we[c]) return i ? e : {};
      o = $q(e, c, u);
    }
  }
  a || (a = new cq());
  var p = a.get(e);
  if (p) return p;
  a.set(e, o),
    Pq(e)
      ? e.forEach(function (b) {
          o.add(hs(b, t, n, b, e, a));
        })
      : Oq(e) &&
        e.forEach(function (b, h) {
          o.set(h, hs(b, t, n, h, e, a));
        });
  var g = l ? (s ? wq : _q) : s ? Aq : Eq,
    y = f ? void 0 : g(e);
  return (
    dq(y || e, function (b, h) {
      y && ((h = b), (b = e[h])), hq(o, h, hs(b, t, n, h, e, a));
    }),
    o
  );
}
var aH = hs;
function oH(e, t, n) {
  var r = -1,
    i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t),
    (n = n > i ? i : n),
    n < 0 && (n += i),
    (i = t > n ? 0 : (n - t) >>> 0),
    (t >>>= 0);
  for (var a = Array(i); ++r < i; ) a[r] = e[r + t];
  return a;
}
var uH = oH,
  sH = cu,
  lH = uH;
function fH(e, t) {
  return t.length < 2 ? e : sH(e, lH(t, 0, -1));
}
var cH = fH,
  dH = wa,
  hH = Lw,
  pH = cH,
  mH = xa;
function vH(e, t) {
  return (t = dH(t, e)), (e = pH(e, t)), e == null || delete e[mH(hH(t))];
}
var gH = vH,
  yH = op;
function bH(e) {
  return yH(e) ? void 0 : e;
}
var _H = bH,
  wH = af,
  xH = aH,
  SH = gH,
  $H = wa,
  TH = _a,
  CH = _H,
  kH = Px,
  OH = E3,
  MH = 1,
  PH = 2,
  EH = 4,
  AH = kH(function (e, t) {
    var n = {};
    if (e == null) return n;
    var r = !1;
    (t = wH(t, function (a) {
      return (a = $H(a, e)), r || (r = a.length > 1), a;
    })),
      TH(e, OH(e), n),
      r && (n = xH(n, MH | PH | EH, CH));
    for (var i = t.length; i--; ) SH(n, t[i]);
    return n;
  }),
  RH = AH;
const FH = gt(RH);
function Ko() {
  return (
    (Ko = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ko.apply(this, arguments)
  );
}
var ky = { noteWidth: 120, noteTextOffset: 8 },
  DH = function (e) {
    var t = typeof e;
    return t === "string" || t === "function";
  },
  gl = function (e) {
    return e.type === "circle";
  },
  Oy = function (e) {
    return e.type === "dot";
  },
  yl = function (e) {
    return e.type === "rect";
  },
  NH = function (e) {
    var t = e.data,
      n = e.annotations,
      r = e.getPosition,
      i = e.getDimensions;
    return n.reduce(function (a, o) {
      var u = o.offset || 0;
      return [].concat(
        a,
        Mz(t, o.match).map(function (s) {
          var l = r(s),
            f = i(s);
          return (
            (gl(o) || yl(o)) &&
              ((f.size = f.size + 2 * u),
              (f.width = f.width + 2 * u),
              (f.height = f.height + 2 * u)),
            Ko({}, FH(o, ["match", "offset"]), l, f, { size: o.size || f.size, datum: s })
          );
        }),
      );
    }, []);
  },
  IH = function (e, t, n, r) {
    var i = Math.atan2(r - t, n - e);
    return nj(ej(i));
  },
  LH = function (e) {
    var t,
      n,
      r = e.x,
      i = e.y,
      a = e.noteX,
      o = e.noteY,
      u = e.noteWidth,
      s = u === void 0 ? ky.noteWidth : u,
      l = e.noteTextOffset,
      f = l === void 0 ? ky.noteTextOffset : l;
    if (by(a)) t = r + a;
    else {
      if (a.abs === void 0)
        throw new Error(
          "noteX should be either a number or an object containing an 'abs' property",
        );
      t = a.abs;
    }
    if (by(o)) n = i + o;
    else {
      if (o.abs === void 0)
        throw new Error(
          "noteY should be either a number or an object containing an 'abs' property",
        );
      n = o.abs;
    }
    var c = r,
      d = i,
      p = IH(r, i, t, n);
    if (gl(e)) {
      var g = tj(Yo(p), e.size / 2);
      (c += g.x), (d += g.y);
    }
    if (yl(e)) {
      var y = Math.round((p + 90) / 45) % 8;
      y === 0 && (d -= e.height / 2),
        y === 1 && ((c += e.width / 2), (d -= e.height / 2)),
        y === 2 && (c += e.width / 2),
        y === 3 && ((c += e.width / 2), (d += e.height / 2)),
        y === 4 && (d += e.height / 2),
        y === 5 && ((c -= e.width / 2), (d += e.height / 2)),
        y === 6 && (c -= e.width / 2),
        y === 7 && ((c -= e.width / 2), (d -= e.height / 2));
    }
    var b = t,
      h = t;
    return (
      (p + 90) % 360 > 180 ? ((b -= s), (h -= s)) : (h += s),
      {
        points: [
          [c, d],
          [t, n],
          [h, n],
        ],
        text: [b, n - f],
        angle: p + 90,
      }
    );
  },
  jH = function (e) {
    var t = e.data,
      n = e.annotations,
      r = e.getPosition,
      i = e.getDimensions;
    return A.useMemo(
      function () {
        return NH({ data: t, annotations: n, getPosition: r, getDimensions: i });
      },
      [t, n, r, i],
    );
  },
  UH = function (e) {
    var t = e.annotations;
    return A.useMemo(
      function () {
        return t.map(function (n) {
          return Ko({}, n, { computed: LH(Ko({}, n)) });
        });
      },
      [t],
    );
  },
  My = function (e, t) {
    t.forEach(function (n, r) {
      var i = n[0],
        a = n[1];
      r === 0 ? e.moveTo(i, a) : e.lineTo(i, a);
    });
  },
  zH = function (e, t) {
    var n = t.annotations,
      r = t.theme;
    n.length !== 0 &&
      (e.save(),
      n.forEach(function (i) {
        if (!DH(i.note)) throw new Error("note is invalid for canvas implementation");
        r.annotations.link.outlineWidth > 0 &&
          ((e.lineCap = "square"),
          (e.strokeStyle = r.annotations.link.outlineColor),
          (e.lineWidth = r.annotations.link.strokeWidth + 2 * r.annotations.link.outlineWidth),
          e.beginPath(),
          My(e, i.computed.points),
          e.stroke(),
          (e.lineCap = "butt")),
          gl(i) &&
            r.annotations.outline.outlineWidth > 0 &&
            ((e.strokeStyle = r.annotations.outline.outlineColor),
            (e.lineWidth =
              r.annotations.outline.strokeWidth + 2 * r.annotations.outline.outlineWidth),
            e.beginPath(),
            e.arc(i.x, i.y, i.size / 2, 0, 2 * Math.PI),
            e.stroke()),
          Oy(i) &&
            r.annotations.symbol.outlineWidth > 0 &&
            ((e.strokeStyle = r.annotations.symbol.outlineColor),
            (e.lineWidth = 2 * r.annotations.symbol.outlineWidth),
            e.beginPath(),
            e.arc(i.x, i.y, i.size / 2, 0, 2 * Math.PI),
            e.stroke()),
          yl(i) &&
            r.annotations.outline.outlineWidth > 0 &&
            ((e.strokeStyle = r.annotations.outline.outlineColor),
            (e.lineWidth =
              r.annotations.outline.strokeWidth + 2 * r.annotations.outline.outlineWidth),
            e.beginPath(),
            e.rect(i.x - i.width / 2, i.y - i.height / 2, i.width, i.height),
            e.stroke()),
          (e.strokeStyle = r.annotations.link.stroke),
          (e.lineWidth = r.annotations.link.strokeWidth),
          e.beginPath(),
          My(e, i.computed.points),
          e.stroke(),
          gl(i) &&
            ((e.strokeStyle = r.annotations.outline.stroke),
            (e.lineWidth = r.annotations.outline.strokeWidth),
            e.beginPath(),
            e.arc(i.x, i.y, i.size / 2, 0, 2 * Math.PI),
            e.stroke()),
          Oy(i) &&
            ((e.fillStyle = r.annotations.symbol.fill),
            e.beginPath(),
            e.arc(i.x, i.y, i.size / 2, 0, 2 * Math.PI),
            e.fill()),
          yl(i) &&
            ((e.strokeStyle = r.annotations.outline.stroke),
            (e.lineWidth = r.annotations.outline.strokeWidth),
            e.beginPath(),
            e.rect(i.x - i.width / 2, i.y - i.height / 2, i.width, i.height),
            e.stroke()),
          typeof i.note == "function"
            ? i.note(e, { datum: i.datum, x: i.computed.text[0], y: i.computed.text[1], theme: r })
            : ((e.font = r.annotations.text.fontSize + "px " + r.annotations.text.fontFamily),
              (e.textAlign = "left"),
              (e.textBaseline = "alphabetic"),
              (e.fillStyle = r.annotations.text.fill),
              (e.strokeStyle = r.annotations.text.outlineColor),
              (e.lineWidth = 2 * r.annotations.text.outlineWidth),
              r.annotations.text.outlineWidth > 0 &&
                ((e.lineJoin = "round"),
                e.strokeText(i.note, i.computed.text[0], i.computed.text[1]),
                (e.lineJoin = "miter")),
              e.fillText(i.note, i.computed.text[0], i.computed.text[1]));
      }),
      e.restore());
  };
function bl() {
  return (
    (bl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    bl.apply(this, arguments)
  );
}
function Py(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function WH(e, t) {
  var n = (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (
    Array.isArray(e) ||
    (n = (function (i, a) {
      if (i) {
        if (typeof i == "string") return Py(i, a);
        var o = Object.prototype.toString.call(i).slice(8, -1);
        return (
          o === "Object" && i.constructor && (o = i.constructor.name),
          o === "Map" || o === "Set"
            ? Array.from(i)
            : o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)
              ? Py(i, a)
              : void 0
        );
      }
    })(e)) ||
    t
  ) {
    n && (e = n);
    var r = 0;
    return function () {
      return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var D3 = {
    nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"],
    category10: YA,
    accent: GA,
    dark2: KA,
    paired: XA,
    pastel1: ZA,
    pastel2: JA,
    set1: eR,
    set2: tR,
    set3: nx,
    tableau10: nR,
  },
  qH = Object.keys(D3),
  N3 = {
    brown_blueGreen: hf,
    purpleRed_green: pf,
    pink_yellowGreen: mf,
    purple_orange: vf,
    red_blue: gf,
    red_grey: yf,
    red_yellow_blue: bf,
    red_yellow_green: _f,
    spectral: wf,
  },
  HH = Object.keys(N3),
  BH = {
    brown_blueGreen: rR,
    purpleRed_green: iR,
    pink_yellowGreen: aR,
    purple_orange: oR,
    red_blue: uR,
    red_grey: sR,
    red_yellow_blue: lR,
    red_yellow_green: fR,
    spectral: cR,
  },
  I3 = {
    blues: Ff,
    greens: Df,
    greys: Nf,
    oranges: jf,
    purples: If,
    reds: Lf,
    blue_green: xf,
    blue_purple: Sf,
    green_blue: $f,
    orange_red: Tf,
    purple_blue_green: Cf,
    purple_blue: kf,
    purple_red: Of,
    red_purple: Mf,
    yellow_green_blue: Pf,
    yellow_green: Ef,
    yellow_orange_brown: Af,
    yellow_orange_red: Rf,
  },
  VH = Object.keys(I3),
  QH = {
    blues: $R,
    greens: TR,
    greys: CR,
    oranges: MR,
    purples: kR,
    reds: OR,
    turbo: LR,
    viridis: jR,
    inferno: zR,
    magma: UR,
    plasma: WR,
    cividis: PR,
    warm: AR,
    cool: RR,
    cubehelixDefault: ER,
    blue_green: dR,
    blue_purple: hR,
    green_blue: pR,
    orange_red: mR,
    purple_blue_green: vR,
    purple_blue: gR,
    purple_red: yR,
    red_purple: bR,
    yellow_green_blue: _R,
    yellow_green: wR,
    yellow_orange_brown: xR,
    yellow_orange_red: SR,
  },
  Gc = bl({}, D3, N3, I3),
  YH = function (e) {
    return qH.includes(e);
  },
  GH = function (e) {
    return HH.includes(e);
  },
  KH = function (e) {
    return VH.includes(e);
  },
  XH = { rainbow: FR, sinebow: IR };
bl({}, BH, QH, XH);
var ZH = function (e, t) {
    if (typeof e == "function") return e;
    if (xw(e)) {
      if (
        (function (s) {
          return s.theme !== void 0;
        })(e)
      ) {
        if (t === void 0)
          throw new Error("Unable to use color from theme as no theme was provided");
        var n = ta(t, e.theme);
        if (n === void 0)
          throw new Error("Color from theme is undefined at path: '" + e.theme + "'");
        return function () {
          return n;
        };
      }
      if (
        (function (s) {
          return s.from !== void 0;
        })(e)
      ) {
        var r = function (s) {
          return ta(s, e.from);
        };
        if (Array.isArray(e.modifiers)) {
          for (
            var i,
              a = [],
              o = function () {
                var s = i.value,
                  l = s[0],
                  f = s[1];
                if (l === "brighter")
                  a.push(function (c) {
                    return c.brighter(f);
                  });
                else if (l === "darker")
                  a.push(function (c) {
                    return c.darker(f);
                  });
                else {
                  if (l !== "opacity")
                    throw new Error(
                      "Invalid color modifier: '" +
                        l +
                        "', must be one of: 'brighter', 'darker', 'opacity'",
                    );
                  a.push(function (c) {
                    return (c.opacity = f), c;
                  });
                }
              },
              u = WH(e.modifiers);
            !(i = u()).done;

          )
            o();
          return a.length === 0
            ? r
            : function (s) {
                return a
                  .reduce(
                    function (l, f) {
                      return f(l);
                    },
                    ra(r(s)),
                  )
                  .toString();
              };
        }
        return r;
      }
      throw new Error(
        "Invalid color spec, you should either specify 'theme' or 'from' when using a config object",
      );
    }
    return function () {
      return e;
    };
  },
  Ey = function (e, t) {
    return A.useMemo(
      function () {
        return ZH(e, t);
      },
      [e, t],
    );
  };
C.oneOfType([
  C.string,
  C.func,
  C.shape({ theme: C.string.isRequired }),
  C.shape({ from: C.string.isRequired, modifiers: C.arrayOf(C.array) }),
]);
var JH = function (e, t) {
    if (typeof e == "function") return e;
    var n =
      typeof t == "function"
        ? t
        : function (c) {
            return ta(c, t);
          };
    if (Array.isArray(e)) {
      var r = zr(e),
        i = function (c) {
          return r(n(c));
        };
      return (i.scale = r), i;
    }
    if (xw(e)) {
      if (
        (function (c) {
          return c.datum !== void 0;
        })(e)
      )
        return function (c) {
          return ta(c, e.datum);
        };
      if (
        (function (c) {
          return c.scheme !== void 0;
        })(e)
      ) {
        if (YH(e.scheme)) {
          var a = zr(Gc[e.scheme]),
            o = function (c) {
              return a(n(c));
            };
          return (o.scale = a), o;
        }
        if (GH(e.scheme)) {
          if (e.size !== void 0 && (e.size < 3 || e.size > 11))
            throw new Error(
              "Invalid size '" +
                e.size +
                "' for diverging color scheme '" +
                e.scheme +
                "', must be between 3~11",
            );
          var u = zr(Gc[e.scheme][e.size || 11]),
            s = function (c) {
              return u(n(c));
            };
          return (s.scale = u), s;
        }
        if (KH(e.scheme)) {
          if (e.size !== void 0 && (e.size < 3 || e.size > 9))
            throw new Error(
              "Invalid size '" +
                e.size +
                "' for sequential color scheme '" +
                e.scheme +
                "', must be between 3~9",
            );
          var l = zr(Gc[e.scheme][e.size || 9]),
            f = function (c) {
              return l(n(c));
            };
          return (f.scale = l), f;
        }
      }
      throw new Error(
        "Invalid colors, when using an object, you should either pass a 'datum' or a 'scheme' property",
      );
    }
    return function () {
      return e;
    };
  },
  eB = function (e, t) {
    return A.useMemo(
      function () {
        return JH(e, t);
      },
      [e, t],
    );
  };
function Lh() {
  return (
    (Lh = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Lh.apply(this, arguments)
  );
}
var tB = { top: 0, right: 0, bottom: 0, left: 0 },
  nB = function (e) {
    var t,
      n = e.direction,
      r = e.itemsSpacing,
      i = e.padding,
      a = e.itemCount,
      o = e.itemWidth,
      u = e.itemHeight;
    if (typeof i != "number" && (typeof (t = i) != "object" || Array.isArray(t) || t === null))
      throw new Error("Invalid property padding, must be one of: number, object");
    var s = typeof i == "number" ? { top: i, right: i, bottom: i, left: i } : Lh({}, tB, i),
      l = s.left + s.right,
      f = s.top + s.bottom,
      c = o + l,
      d = u + f,
      p = (a - 1) * r;
    return (
      n === "row" ? (c = o * a + p + l) : n === "column" && (d = u * a + p + f),
      { width: c, height: d, padding: s }
    );
  },
  rB = function (e) {
    var t = e.anchor,
      n = e.translateX,
      r = e.translateY,
      i = e.containerWidth,
      a = e.containerHeight,
      o = e.width,
      u = e.height,
      s = n,
      l = r;
    switch (t) {
      case "top":
        s += (i - o) / 2;
        break;
      case "top-right":
        s += i - o;
        break;
      case "right":
        (s += i - o), (l += (a - u) / 2);
        break;
      case "bottom-right":
        (s += i - o), (l += a - u);
        break;
      case "bottom":
        (s += (i - o) / 2), (l += a - u);
        break;
      case "bottom-left":
        l += a - u;
        break;
      case "left":
        l += (a - u) / 2;
        break;
      case "center":
        (s += (i - o) / 2), (l += (a - u) / 2);
    }
    return { x: s, y: l };
  },
  iB = function (e) {
    var t,
      n,
      r,
      i,
      a,
      o,
      u = e.direction,
      s = e.justify,
      l = e.symbolSize,
      f = e.symbolSpacing,
      c = e.width,
      d = e.height;
    switch (u) {
      case "left-to-right":
        (t = 0),
          (n = (d - l) / 2),
          (i = d / 2),
          (o = "central"),
          s ? ((r = c), (a = "end")) : ((r = l + f), (a = "start"));
        break;
      case "right-to-left":
        (t = c - l),
          (n = (d - l) / 2),
          (i = d / 2),
          (o = "central"),
          s ? ((r = 0), (a = "start")) : ((r = c - l - f), (a = "end"));
        break;
      case "top-to-bottom":
        (t = (c - l) / 2),
          (n = 0),
          (r = c / 2),
          (a = "middle"),
          s ? ((i = d), (o = "alphabetic")) : ((i = l + f), (o = "text-before-edge"));
        break;
      case "bottom-to-top":
        (t = (c - l) / 2),
          (n = d - l),
          (r = c / 2),
          (a = "middle"),
          s ? ((i = 0), (o = "text-before-edge")) : ((i = d - l - f), (o = "alphabetic"));
    }
    return { symbolX: t, symbolY: n, labelX: r, labelY: i, labelAnchor: a, labelAlignment: o };
  },
  aB = { start: "left", middle: "center", end: "right" },
  oB = function (e, t) {
    var n = t.data,
      r = t.containerWidth,
      i = t.containerHeight,
      a = t.translateX,
      o = a === void 0 ? 0 : a,
      u = t.translateY,
      s = u === void 0 ? 0 : u,
      l = t.anchor,
      f = t.direction,
      c = t.padding,
      d = c === void 0 ? 0 : c,
      p = t.justify,
      g = p !== void 0 && p,
      y = t.itemsSpacing,
      b = y === void 0 ? 0 : y,
      h = t.itemWidth,
      m = t.itemHeight,
      v = t.itemDirection,
      _ = v === void 0 ? "left-to-right" : v,
      S = t.itemTextColor,
      w = t.symbolSize,
      T = w === void 0 ? 16 : w,
      k = t.symbolSpacing,
      j = k === void 0 ? 8 : k,
      R = t.theme,
      E = nB({
        itemCount: n.length,
        itemWidth: h,
        itemHeight: m,
        itemsSpacing: b,
        direction: f,
        padding: d,
      }),
      q = E.width,
      I = E.height,
      F = E.padding,
      D = rB({
        anchor: l,
        translateX: o,
        translateY: s,
        containerWidth: r,
        containerHeight: i,
        width: q,
        height: I,
      }),
      z = D.x,
      H = D.y,
      P = f === "row" ? h + b : 0,
      O = f === "column" ? m + b : 0;
    e.save(),
      e.translate(z, H),
      (e.font = R.legends.text.fontSize + "px " + (R.legends.text.fontFamily || "sans-serif")),
      n.forEach(function (W, K) {
        var X,
          Oe,
          ve = K * P + F.left,
          se = K * O + F.top,
          oe = iB({
            direction: _,
            justify: g,
            symbolSize: T,
            symbolSpacing: j,
            width: h,
            height: m,
          }),
          te = oe.symbolX,
          tt = oe.symbolY,
          M = oe.labelX,
          N = oe.labelY,
          V = oe.labelAnchor,
          x = oe.labelAlignment;
        (e.fillStyle = (X = W.color) != null ? X : "black"),
          e.fillRect(ve + te, se + tt, T, T),
          (e.textAlign = aB[V]),
          x === "central" && (e.textBaseline = "middle"),
          (e.fillStyle = (Oe = S ?? R.legends.text.fill) != null ? Oe : "black"),
          e.fillText(String(W.label), ve + M, se + N);
      }),
      e.restore();
  };
function Le() {
  return (
    (Le = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Le.apply(this, arguments)
  );
}
function mu(e, t) {
  if (e == null) return {};
  var n,
    r,
    i = {},
    a = Object.keys(e);
  for (r = 0; r < a.length; r++) (n = a[r]), t.indexOf(n) >= 0 || (i[n] = e[n]);
  return i;
}
var Ay,
  uB = ["data"],
  sB = function (e) {
    var t,
      n = e.bar,
      r = n.data,
      i = mu(n, uB),
      a = e.style,
      o = a.borderColor,
      u = a.color,
      s = a.height,
      l = a.labelColor,
      f = a.labelOpacity,
      c = a.labelX,
      d = a.labelY,
      p = a.transform,
      g = a.width,
      y = a.textAnchor,
      b = e.borderRadius,
      h = e.borderWidth,
      m = e.label,
      v = e.shouldRenderLabel,
      _ = e.isInteractive,
      S = e.onClick,
      w = e.onMouseEnter,
      T = e.onMouseLeave,
      k = e.tooltip,
      j = e.isFocusable,
      R = e.ariaLabel,
      E = e.ariaLabelledBy,
      q = e.ariaDescribedBy,
      I = e.ariaDisabled,
      F = e.ariaHidden,
      D = Xt(),
      z = ow(),
      H = z.showTooltipFromEvent,
      P = z.showTooltipAt,
      O = z.hideTooltip,
      W = A.useMemo(
        function () {
          return function () {
            return A.createElement(k, Le({}, i, r));
          };
        },
        [k, i, r],
      ),
      K = A.useCallback(
        function (te) {
          S == null || S(Le({ color: i.color }, r), te);
        },
        [i, r, S],
      ),
      X = A.useCallback(
        function (te) {
          return H(W(), te);
        },
        [H, W],
      ),
      Oe = A.useCallback(
        function (te) {
          w == null || w(r, te), H(W(), te);
        },
        [r, w, H, W],
      ),
      ve = A.useCallback(
        function (te) {
          T == null || T(r, te), O();
        },
        [r, O, T],
      ),
      se = A.useCallback(
        function () {
          P(W(), [i.absX + i.width / 2, i.absY]);
        },
        [P, W, i],
      ),
      oe = A.useCallback(
        function () {
          O();
        },
        [O],
      );
    return B.jsxs(Qt.g, {
      transform: p,
      children: [
        B.jsx(Qt.rect, {
          width: y1(g, function (te) {
            return Math.max(te, 0);
          }),
          height: y1(s, function (te) {
            return Math.max(te, 0);
          }),
          rx: b,
          ry: b,
          fill: (t = r.fill) != null ? t : u,
          strokeWidth: h,
          stroke: o,
          focusable: j,
          tabIndex: j ? 0 : void 0,
          "aria-label": R ? R(r) : void 0,
          "aria-labelledby": E ? E(r) : void 0,
          "aria-describedby": q ? q(r) : void 0,
          "aria-disabled": I ? I(r) : void 0,
          "aria-hidden": F ? F(r) : void 0,
          onMouseEnter: _ ? Oe : void 0,
          onMouseMove: _ ? X : void 0,
          onMouseLeave: _ ? ve : void 0,
          onClick: _ ? K : void 0,
          onFocus: _ && j ? se : void 0,
          onBlur: _ && j ? oe : void 0,
        }),
        v &&
          B.jsx(Qt.text, {
            x: c,
            y: d,
            textAnchor: y,
            dominantBaseline: "central",
            fillOpacity: f,
            style: Le({}, D.labels.text, { pointerEvents: "none", fill: l }),
            children: m,
          }),
      ],
    });
  },
  lB = ["color", "label"],
  fB = function (e) {
    var t = e.color,
      n = e.label,
      r = mu(e, lB);
    return B.jsx(z7, { id: n, value: r.formattedValue, enableChip: !0, color: t });
  },
  pe = {
    indexBy: "id",
    keys: ["value"],
    groupMode: "stacked",
    layout: "vertical",
    reverse: !1,
    minValue: "auto",
    maxValue: "auto",
    valueScale: { type: "linear" },
    indexScale: { type: "band", round: !0 },
    padding: 0.1,
    innerPadding: 0,
    axisBottom: {},
    axisLeft: {},
    enableGridX: !1,
    enableGridY: !0,
    enableLabel: !0,
    label: "formattedValue",
    labelPosition: "middle",
    labelOffset: 0,
    labelSkipWidth: 0,
    labelSkipHeight: 0,
    labelTextColor: { from: "theme", theme: "labels.text.fill" },
    colorBy: "id",
    colors: { scheme: "nivo" },
    borderRadius: 0,
    borderWidth: 0,
    borderColor: { from: "color" },
    isInteractive: !0,
    tooltip: fB,
    tooltipLabel: function (e) {
      return e.id + " - " + e.indexValue;
    },
    legends: [],
    initialHiddenIds: [],
    annotations: [],
    markers: [],
    enableTotals: !1,
    totalsOffset: 10,
  };
Le({}, pe, {
  layers: ["grid", "axes", "bars", "totals", "markers", "legends", "annotations"],
  barComponent: sB,
  defs: [],
  fill: [],
  animate: !0,
  motionConfig: "default",
  role: "img",
  isFocusable: !1,
});
var Be = Le({}, pe, {
    layers: ["grid", "axes", "bars", "totals", "legends", "annotations"],
    pixelRatio: typeof window < "u" && (Ay = window.devicePixelRatio) != null ? Ay : 1,
  }),
  L3 = function (e, t, n, r, i, a) {
    return Zp(r, { all: e.map(t), min: 0, max: 0 }, i, a).padding(n);
  },
  j3 = function (e, t) {
    return e.map(function (n) {
      return Le(
        {},
        t.reduce(function (r, i) {
          return (r[i] = null), r;
        }, {}),
        n,
      );
    });
  },
  Hf = function (e) {
    return Object.keys(e).reduce(function (t, n) {
      return e[n] && (t[n] = e[n]), t;
    }, {});
  },
  Bf = function (e) {
    return [e, Number(e)];
  };
function cB(e, t, n, r) {
  return (
    e === void 0 && (e = pe.layout),
    t === void 0 && (t = pe.reverse),
    n === void 0 && (n = pe.labelPosition),
    r === void 0 && (r = pe.labelOffset),
    function (i, a) {
      var o = r * (t ? -1 : 1);
      if (e === "horizontal") {
        var u = i / 2;
        return (
          n === "start" ? (u = t ? i : 0) : n === "end" && (u = t ? 0 : i),
          {
            labelX: u + o,
            labelY: a / 2,
            textAnchor: n === "middle" ? "middle" : t ? "end" : "start",
          }
        );
      }
      var s = a / 2;
      return (
        n === "start" ? (s = t ? 0 : a) : n === "end" && (s = t ? a : 0),
        { labelX: i / 2, labelY: s - o, textAnchor: "middle" }
      );
    }
  );
}
var dB = [
    "layout",
    "minValue",
    "maxValue",
    "reverse",
    "width",
    "height",
    "padding",
    "innerPadding",
    "valueScale",
    "indexScale",
    "hiddenIds",
  ],
  Jp = function (e, t) {
    return e > t;
  },
  U3 = function (e, t) {
    return e < t;
  },
  z3 = function (e, t) {
    return Array.from(" ".repeat(t - e), function (n, r) {
      return e + r;
    });
  },
  hB = function (e) {
    return Jp(e, 0) ? 0 : e;
  },
  pB = function (e, t, n, r) {
    var i = e.data,
      a = e.formatValue,
      o = e.getColor,
      u = e.getIndex,
      s = e.getTooltipLabel,
      l = e.innerPadding,
      f = l === void 0 ? 0 : l,
      c = e.keys,
      d = e.xScale,
      p = e.yScale,
      g = e.margin,
      y = n ? U3 : Jp,
      b = i.map(Hf),
      h = [];
    return (
      c.forEach(function (m, v) {
        return z3(0, d.domain().length).forEach(function (_) {
          var S,
            w,
            T,
            k = Bf(i[_][m]),
            j = k[0],
            R = k[1],
            E = u(i[_]),
            q = ((S = d(E)) != null ? S : 0) + t * v + f * v,
            I = y((w = R), 0) ? ((T = p(w)) != null ? T : 0) : r,
            F = (function (z, H) {
              var P;
              return y(z, 0) ? r - H : ((P = p(z)) != null ? P : 0) - r;
            })(R, I),
            D = {
              id: m,
              value: j === null ? j : R,
              formattedValue: a(R),
              hidden: !1,
              index: _,
              indexValue: E,
              data: b[_],
            };
          h.push({
            key: m + "." + D.indexValue,
            index: h.length,
            data: D,
            x: q,
            y: I,
            absX: g.left + q,
            absY: g.top + I,
            width: t,
            height: F,
            color: o(D),
            label: s(D),
          });
        });
      }),
      h
    );
  },
  mB = function (e, t, n, r) {
    var i = e.data,
      a = e.formatValue,
      o = e.getIndex,
      u = e.getColor,
      s = e.getTooltipLabel,
      l = e.keys,
      f = e.innerPadding,
      c = f === void 0 ? 0 : f,
      d = e.xScale,
      p = e.yScale,
      g = e.margin,
      y = n ? U3 : Jp,
      b = i.map(Hf),
      h = [];
    return (
      l.forEach(function (m, v) {
        return z3(0, p.domain().length).forEach(function (_) {
          var S,
            w,
            T,
            k = Bf(i[_][m]),
            j = k[0],
            R = k[1],
            E = o(i[_]),
            q = y((w = R), 0) ? r : (T = d(w)) != null ? T : 0,
            I = ((S = p(E)) != null ? S : 0) + t * v + c * v,
            F = (function (z, H) {
              var P;
              return y(z, 0) ? ((P = d(z)) != null ? P : 0) - r : r - H;
            })(R, q),
            D = {
              id: m,
              value: j === null ? j : R,
              formattedValue: a(R),
              hidden: !1,
              index: _,
              indexValue: E,
              data: b[_],
            };
          h.push({
            key: m + "." + D.indexValue,
            index: h.length,
            data: D,
            x: q,
            y: I,
            absX: g.left + q,
            absY: g.top + I,
            width: F,
            height: t,
            color: u(D),
            label: s(D),
          });
        });
      }),
      h
    );
  },
  vB = function (e) {
    var t,
      n,
      r = e.layout,
      i = e.minValue,
      a = e.maxValue,
      o = e.reverse,
      u = e.width,
      s = e.height,
      l = e.padding,
      f = l === void 0 ? 0 : l,
      c = e.innerPadding,
      d = c === void 0 ? 0 : c,
      p = e.valueScale,
      g = e.indexScale,
      y = e.hiddenIds,
      b = y === void 0 ? [] : y,
      h = mu(e, dB),
      m = h.keys.filter(function (W) {
        return !b.includes(W);
      }),
      v = j3(h.data, m),
      _ = r === "vertical" ? ["y", "x", u] : ["x", "y", s],
      S = _[0],
      w = _[1],
      T = _[2],
      k = L3(v, h.getIndex, f, g, T, w),
      j = Le({ max: a, min: i, reverse: o }, p),
      R =
        j.min === "auto"
          ? hB
          : function (W) {
              return W;
            },
      E = v
        .reduce(function (W, K) {
          return [].concat(
            W,
            m.map(function (X) {
              return K[X];
            }),
          );
        }, [])
        .filter(Boolean),
      q = R(Math.min.apply(Math, E)),
      I = ((n = Math.max.apply(Math, E)), isFinite(n) ? n : 0),
      F = Zp(j, { all: E, min: q, max: I }, S === "x" ? u : s, S),
      D = r === "vertical" ? [k, F] : [F, k],
      z = D[0],
      H = D[1],
      P = (k.bandwidth() - d * (m.length - 1)) / m.length,
      O = [
        Le({}, h, { data: v, keys: m, innerPadding: d, xScale: z, yScale: H }),
        P,
        j.reverse,
        (t = F(0)) != null ? t : 0,
      ];
    return {
      xScale: z,
      yScale: H,
      bars: P > 0 ? (r === "vertical" ? pB.apply(void 0, O) : mB.apply(void 0, O)) : [],
    };
  },
  gB = [
    "data",
    "layout",
    "minValue",
    "maxValue",
    "reverse",
    "width",
    "height",
    "padding",
    "valueScale",
    "indexScale",
    "hiddenIds",
  ],
  yB = function e(t) {
    var n;
    return t.some(Array.isArray) ? e((n = []).concat.apply(n, t)) : t;
  },
  bB = function (e, t, n) {
    var r = e.formatValue,
      i = e.getColor,
      a = e.getIndex,
      o = e.getTooltipLabel,
      u = e.innerPadding,
      s = e.stackedData,
      l = e.xScale,
      f = e.yScale,
      c = e.margin,
      d = [];
    return (
      s.forEach(function (p) {
        return l.domain().forEach(function (g, y) {
          var b,
            h,
            m = p[y],
            v = (b = l(a(m.data))) != null ? b : 0,
            _ =
              ((h = (function (R) {
                return f(R[n ? 0 : 1]);
              })(m)) != null
                ? h
                : 0) +
              0.5 * u,
            S =
              (function (R, E) {
                var q;
                return ((q = f(R[n ? 1 : 0])) != null ? q : 0) - E;
              })(m, _) - u,
            w = Bf(m.data[p.key]),
            T = w[0],
            k = w[1],
            j = {
              id: p.key,
              value: T === null ? T : k,
              formattedValue: r(k),
              hidden: !1,
              index: y,
              indexValue: g,
              data: Hf(m.data),
            };
          d.push({
            key: p.key + "." + g,
            index: d.length,
            data: j,
            x: v,
            y: _,
            absX: c.left + v,
            absY: c.top + _,
            width: t,
            height: S,
            color: i(j),
            label: o(j),
          });
        });
      }),
      d
    );
  },
  _B = function (e, t, n) {
    var r = e.formatValue,
      i = e.getColor,
      a = e.getIndex,
      o = e.getTooltipLabel,
      u = e.innerPadding,
      s = e.stackedData,
      l = e.xScale,
      f = e.yScale,
      c = e.margin,
      d = [];
    return (
      s.forEach(function (p) {
        return f.domain().forEach(function (g, y) {
          var b,
            h,
            m = p[y],
            v = (b = f(a(m.data))) != null ? b : 0,
            _ =
              ((h = (function (R) {
                return l(R[n ? 1 : 0]);
              })(m)) != null
                ? h
                : 0) +
              0.5 * u,
            S =
              (function (R, E) {
                var q;
                return ((q = l(R[n ? 0 : 1])) != null ? q : 0) - E;
              })(m, _) - u,
            w = Bf(m.data[p.key]),
            T = w[0],
            k = w[1],
            j = {
              id: p.key,
              value: T === null ? T : k,
              formattedValue: r(k),
              hidden: !1,
              index: y,
              indexValue: g,
              data: Hf(m.data),
            };
          d.push({
            key: p.key + "." + g,
            index: d.length,
            data: j,
            x: _,
            y: v,
            absX: c.left + _,
            absY: c.top + v,
            width: S,
            height: t,
            color: i(j),
            label: o(j),
          });
        });
      }),
      d
    );
  },
  wB = function (e) {
    var t,
      n = e.data,
      r = e.layout,
      i = e.minValue,
      a = e.maxValue,
      o = e.reverse,
      u = e.width,
      s = e.height,
      l = e.padding,
      f = l === void 0 ? 0 : l,
      c = e.valueScale,
      d = e.indexScale,
      p = e.hiddenIds,
      g = p === void 0 ? [] : p,
      y = mu(e, gB),
      b = y.keys.filter(function (P) {
        return !g.includes(P);
      }),
      h = QF().keys(b).offset(YF)(j3(n, b)),
      m = r === "vertical" ? ["y", "x", u] : ["x", "y", s],
      v = m[0],
      _ = m[1],
      S = m[2],
      w = L3(n, y.getIndex, f, d, S, _),
      T = Le({ max: a, min: i, reverse: o }, c),
      k =
        ((t = yB(h)),
        c.type === "log"
          ? t.filter(function (P) {
              return P !== 0;
            })
          : t),
      j = Math.min.apply(Math, k),
      R = Math.max.apply(Math, k),
      E = Zp(T, { all: k, min: j, max: R }, v === "x" ? u : s, v),
      q = r === "vertical" ? [w, E] : [E, w],
      I = q[0],
      F = q[1],
      D = y.innerPadding > 0 ? y.innerPadding : 0,
      z = w.bandwidth(),
      H = [Le({}, y, { innerPadding: D, stackedData: h, xScale: I, yScale: F }), z, T.reverse];
    return {
      xScale: I,
      yScale: F,
      bars: z > 0 ? (r === "vertical" ? bB.apply(void 0, H) : _B.apply(void 0, H)) : [],
    };
  },
  xB = function (e) {
    var t = e.bars,
      n = e.direction,
      r = e.from,
      i = e.groupMode,
      a = e.layout,
      o = e.legendLabel,
      u = e.reverse,
      s = t3(o ?? (r === "indexes" ? "indexValue" : "id"));
    return r === "indexes"
      ? (function (l, f, c) {
          var d = hy(
            l.map(function (p) {
              var g, y;
              return {
                id: (g = p.data.indexValue) != null ? g : "",
                label: c(p.data),
                hidden: p.data.hidden,
                color: (y = p.color) != null ? y : "#000",
              };
            }),
            function (p) {
              return p.id;
            },
          );
          return f === "horizontal" && d.reverse(), d;
        })(t, a, s)
      : (function (l, f, c, d, p, g) {
          var y = hy(
            l.map(function (b) {
              var h;
              return {
                id: b.data.id,
                label: g(b.data),
                hidden: b.data.hidden,
                color: (h = b.color) != null ? h : "#000",
              };
            }),
            function (b) {
              return b.id;
            },
          );
          return (
            ((f === "vertical" && d === "stacked" && c === "column" && p !== !0) ||
              (f === "horizontal" && d === "stacked" && p === !0)) &&
              y.reverse(),
            y
          );
        })(t, a, n, i, u, s);
  },
  Ry = function (e, t, n) {
    var r = e.get(t) || 0;
    e.set(t, r + n);
  },
  SB = function (e, t, n) {
    var r = e.get(t) || 0;
    e.set(t, r + (n > 0 ? n : 0));
  },
  $B = function (e, t, n) {
    var r = e.get(t) || 0;
    e.set(t, Math.max(r, Number(n)));
  },
  TB = function (e, t) {
    var n = e.get(t) || 0;
    e.set(t, n + 1);
  },
  CB = function (e) {
    var t = e.indexBy,
      n = t === void 0 ? pe.indexBy : t,
      r = e.keys,
      i = r === void 0 ? pe.keys : r,
      a = e.label,
      o = a === void 0 ? pe.label : a,
      u = e.tooltipLabel,
      s = u === void 0 ? pe.tooltipLabel : u,
      l = e.valueFormat,
      f = e.colors,
      c = f === void 0 ? pe.colors : f,
      d = e.colorBy,
      p = d === void 0 ? pe.colorBy : d,
      g = e.borderColor,
      y = g === void 0 ? pe.borderColor : g,
      b = e.labelTextColor,
      h = b === void 0 ? pe.labelTextColor : b,
      m = e.groupMode,
      v = m === void 0 ? pe.groupMode : m,
      _ = e.layout,
      S = _ === void 0 ? pe.layout : _,
      w = e.reverse,
      T = w === void 0 ? pe.reverse : w,
      k = e.data,
      j = e.minValue,
      R = j === void 0 ? pe.minValue : j,
      E = e.maxValue,
      q = E === void 0 ? pe.maxValue : E,
      I = e.margin,
      F = e.width,
      D = e.height,
      z = e.padding,
      H = z === void 0 ? pe.padding : z,
      P = e.innerPadding,
      O = P === void 0 ? pe.innerPadding : P,
      W = e.valueScale,
      K = W === void 0 ? pe.valueScale : W,
      X = e.indexScale,
      Oe = X === void 0 ? pe.indexScale : X,
      ve = e.initialHiddenIds,
      se = ve === void 0 ? pe.initialHiddenIds : ve,
      oe = e.enableLabel,
      te = oe === void 0 ? pe.enableLabel : oe,
      tt = e.labelSkipWidth,
      M = tt === void 0 ? pe.labelSkipWidth : tt,
      N = e.labelSkipHeight,
      V = N === void 0 ? pe.labelSkipHeight : N,
      x = e.legends,
      re = x === void 0 ? pe.legends : x,
      Y = e.legendLabel,
      le = e.totalsOffset,
      ce = le === void 0 ? pe.totalsOffset : le,
      je = A.useState(se ?? []),
      Lt = je[0],
      vu = je[1],
      gu = A.useCallback(function (ie) {
        vu(function (ye) {
          return ye.indexOf(ie) > -1
            ? ye.filter(function (De) {
                return De !== ie;
              })
            : [].concat(ye, [ie]);
        });
      }, []),
      dn = qc(n),
      yu = qc(o),
      Or = qc(s),
      hn = Yp(l),
      Kn = Xt(),
      Xn = eB(c, p),
      Vf = Ey(y, Kn),
      bu = Ey(h, Kn),
      Zt = (v === "grouped" ? vB : wB)({
        layout: S,
        reverse: T,
        data: k,
        getIndex: dn,
        keys: i,
        minValue: R,
        maxValue: q,
        width: F,
        height: D,
        getColor: Xn,
        padding: H,
        innerPadding: O,
        valueScale: K,
        indexScale: Oe,
        hiddenIds: Lt,
        formatValue: hn,
        getTooltipLabel: Or,
        margin: I,
      }),
      Pt = Zt.bars,
      mi = Zt.xScale,
      vi = Zt.yScale,
      _u = A.useMemo(
        function () {
          return Pt.filter(function (ie) {
            return ie.data.value !== null;
          }).map(function (ie, ye) {
            return Le({}, ie, { index: ye });
          });
        },
        [Pt],
      ),
      Qf = A.useCallback(
        function (ie) {
          var ye = ie.width,
            De = ie.height;
          return !!te && !(M > 0 && ye < M) && !(V > 0 && De < V);
        },
        [te, M, V],
      ),
      _t = A.useMemo(
        function () {
          return i.map(function (ie) {
            var ye = Pt.find(function (De) {
              return De.data.id === ie;
            });
            return Le({}, ye, {
              data: Le({ id: ie }, ye == null ? void 0 : ye.data, { hidden: Lt.includes(ie) }),
            });
          });
        },
        [Lt, i, Pt],
      ),
      jt = A.useMemo(
        function () {
          return re.map(function (ie) {
            return [
              ie,
              xB({
                bars: ie.dataFrom === "keys" ? _t : Pt,
                direction: ie.direction,
                from: ie.dataFrom,
                groupMode: v,
                layout: S,
                legendLabel: Y,
                reverse: T,
              }),
            ];
          });
        },
        [re, _t, Pt, v, S, Y, T],
      ),
      Mr = A.useMemo(
        function () {
          return (function (ie, ye, De, wt, pn, nt, ht) {
            wt === void 0 && (wt = pe.layout), pn === void 0 && (pn = pe.groupMode);
            var Pr = [];
            if (ie.length === 0) return Pr;
            var mn = new Map(),
              Zn = ie[0].width,
              Ta = ie[0].height;
            if (pn === "stacked") {
              var Ca = new Map();
              ie.forEach(function (ot) {
                var Ne = ot.data,
                  qe = Ne.indexValue,
                  Ge = Ne.value;
                Ry(mn, qe, Number(Ge)), SB(Ca, qe, Number(Ge));
              }),
                Ca.forEach(function (ot, Ne) {
                  var qe,
                    Ge,
                    vn,
                    Jn = mn.get(Ne) || 0;
                  wt === "vertical"
                    ? ((qe = ye(Ne)), (Ge = De(ot)), (vn = De(ot / 2)))
                    : ((qe = ye(ot)), (Ge = De(Ne)), (vn = ye(ot / 2))),
                    (qe += wt === "vertical" ? Zn / 2 : nt),
                    (Ge += wt === "vertical" ? -nt : Ta / 2),
                    Pr.push({
                      key: "total_" + Ne,
                      x: qe,
                      y: Ge,
                      value: Jn,
                      formattedValue: ht(Jn),
                      animationOffset: vn,
                    });
                });
            } else if (pn === "grouped") {
              var ka = new Map(),
                Oa = new Map();
              ie.forEach(function (ot) {
                var Ne = ot.data,
                  qe = Ne.indexValue,
                  Ge = Ne.value;
                Ry(mn, qe, Number(Ge)), $B(ka, qe, Number(Ge)), TB(Oa, qe);
              }),
                ka.forEach(function (ot, Ne) {
                  var qe,
                    Ge,
                    vn,
                    Jn = mn.get(Ne) || 0,
                    Er = Oa.get(Ne);
                  wt === "vertical"
                    ? ((qe = ye(Ne)), (Ge = De(ot)), (vn = De(ot / 2)))
                    : ((qe = ye(ot)), (Ge = De(Ne)), (vn = ye(ot / 2))),
                    (qe += wt === "vertical" ? (Er * Zn) / 2 : nt),
                    (Ge += wt === "vertical" ? -nt : (Er * Ta) / 2),
                    Pr.push({
                      key: "total_" + Ne,
                      x: qe,
                      y: Ge,
                      value: Jn,
                      formattedValue: ht(Jn),
                      animationOffset: vn,
                    });
                });
            }
            return Pr;
          })(Pt, mi, vi, S, v, ce, hn);
        },
        [Pt, mi, vi, S, v, ce, hn],
      );
    return {
      bars: Pt,
      barsWithValue: _u,
      xScale: mi,
      yScale: vi,
      getIndex: dn,
      getLabel: yu,
      getTooltipLabel: Or,
      formatValue: hn,
      getColor: Xn,
      getBorderColor: Vf,
      getLabelColor: bu,
      shouldRenderBarLabel: Qf,
      hiddenIds: Lt,
      toggleSerie: gu,
      legendsWithData: jt,
      barTotals: Mr,
    };
  },
  kB = ["isInteractive", "renderWrapper", "theme"],
  Kc = function (e, t, n, r) {
    return e.find(function (i) {
      return sj(i.x + t.left, i.y + t.top, i.width, i.height, n, r);
    });
  },
  OB = function (e) {
    var t = e.data,
      n = e.indexBy,
      r = e.keys,
      i = e.margin,
      a = e.width,
      o = e.height,
      u = e.groupMode,
      s = e.layout,
      l = e.reverse,
      f = e.minValue,
      c = e.maxValue,
      d = e.valueScale,
      p = e.indexScale,
      g = e.padding,
      y = e.innerPadding,
      b = e.axisTop,
      h = e.axisRight,
      m = e.axisBottom,
      v = m === void 0 ? Be.axisBottom : m,
      _ = e.axisLeft,
      S = _ === void 0 ? Be.axisLeft : _,
      w = e.enableGridX,
      T = w === void 0 ? Be.enableGridX : w,
      k = e.enableGridY,
      j = k === void 0 ? Be.enableGridY : k,
      R = e.gridXValues,
      E = e.gridYValues,
      q = e.labelPosition,
      I = q === void 0 ? Be.labelPosition : q,
      F = e.labelOffset,
      D = F === void 0 ? Be.labelOffset : F,
      z = e.layers,
      H = z === void 0 ? Be.layers : z,
      P = e.renderBar,
      O =
        P === void 0
          ? function (J, ae) {
              var Me = ae.bar,
                Ce = Me.color,
                _e = Me.height,
                Et = Me.width,
                Ue = Me.x,
                He = Me.y,
                B3 = ae.borderColor,
                im = ae.borderRadius,
                Yf = ae.borderWidth,
                V3 = ae.label,
                Q3 = ae.labelColor,
                Y3 = ae.shouldRenderLabel,
                G3 = ae.labelX,
                K3 = ae.labelY,
                am = ae.textAnchor;
              if (
                ((J.fillStyle = Ce),
                Yf > 0 && ((J.strokeStyle = B3), (J.lineWidth = Yf)),
                J.beginPath(),
                im > 0)
              ) {
                var Mn = Math.min(im, _e);
                J.moveTo(Ue + Mn, He),
                  J.lineTo(Ue + Et - Mn, He),
                  J.quadraticCurveTo(Ue + Et, He, Ue + Et, He + Mn),
                  J.lineTo(Ue + Et, He + _e - Mn),
                  J.quadraticCurveTo(Ue + Et, He + _e, Ue + Et - Mn, He + _e),
                  J.lineTo(Ue + Mn, He + _e),
                  J.quadraticCurveTo(Ue, He + _e, Ue, He + _e - Mn),
                  J.lineTo(Ue, He + Mn),
                  J.quadraticCurveTo(Ue, He, Ue + Mn, He),
                  J.closePath();
              } else J.rect(Ue, He, Et, _e);
              J.fill(),
                Yf > 0 && J.stroke(),
                Y3 &&
                  ((J.textBaseline = "middle"),
                  (J.textAlign = am === "middle" ? "center" : am),
                  (J.fillStyle = Q3),
                  J.fillText(V3, Ue + G3, He + K3));
            }
          : P,
      W = e.enableLabel,
      K = W === void 0 ? Be.enableLabel : W,
      X = e.label,
      Oe = e.labelSkipWidth,
      ve = Oe === void 0 ? Be.labelSkipWidth : Oe,
      se = e.labelSkipHeight,
      oe = se === void 0 ? Be.labelSkipHeight : se,
      te = e.labelTextColor,
      tt = e.colorBy,
      M = e.colors,
      N = e.borderRadius,
      V = N === void 0 ? Be.borderRadius : N,
      x = e.borderWidth,
      re = x === void 0 ? Be.borderWidth : x,
      Y = e.borderColor,
      le = e.annotations,
      ce = le === void 0 ? Be.annotations : le,
      je = e.legendLabel,
      Lt = e.tooltipLabel,
      vu = e.valueFormat,
      gu = e.isInteractive,
      dn = gu === void 0 ? Be.isInteractive : gu,
      yu = e.tooltip,
      Or = yu === void 0 ? Be.tooltip : yu,
      hn = e.onClick,
      Kn = e.onMouseEnter,
      Xn = e.onMouseLeave,
      Vf = e.legends,
      bu = e.pixelRatio,
      Zt = bu === void 0 ? Be.pixelRatio : bu,
      Pt = e.canvasRef,
      mi = e.enableTotals,
      vi = mi === void 0 ? Be.enableTotals : mi,
      _u = e.totalsOffset,
      Qf = _u === void 0 ? Be.totalsOffset : _u,
      _t = A.useRef(null),
      jt = Xt(),
      Mr = VL(a, o, i),
      ie = Mr.margin,
      ye = Mr.innerWidth,
      De = Mr.innerHeight,
      wt = Mr.outerWidth,
      pn = Mr.outerHeight,
      nt = CB({
        indexBy: n,
        label: X,
        tooltipLabel: Lt,
        valueFormat: vu,
        colors: M,
        colorBy: tt,
        borderColor: Y,
        labelTextColor: te,
        groupMode: u,
        layout: s,
        reverse: l,
        data: t,
        keys: r,
        minValue: f,
        maxValue: c,
        margin: ie,
        width: ye,
        height: De,
        padding: g,
        innerPadding: y,
        valueScale: d,
        indexScale: p,
        enableLabel: K,
        labelSkipWidth: ve,
        labelSkipHeight: oe,
        legends: Vf,
        legendLabel: je,
        totalsOffset: Qf,
      }),
      ht = nt.bars,
      Pr = nt.barsWithValue,
      mn = nt.xScale,
      Zn = nt.yScale,
      Ta = nt.getLabel,
      Ca = nt.getTooltipLabel,
      ka = nt.getBorderColor,
      Oa = nt.getLabelColor,
      ot = nt.shouldRenderBarLabel,
      Ne = nt.legendsWithData,
      qe = nt.barTotals,
      Ge = nt.getColor,
      vn = ow(),
      Jn = vn.showTooltipFromEvent,
      Er = vn.hideTooltip,
      em = UH({
        annotations: jH({
          data: ht,
          annotations: ce,
          getPosition: function (J) {
            return { x: J.x, y: J.y };
          },
          getDimensions: function (J) {
            var ae = J.width,
              Me = J.height;
            return { width: ae, height: Me, size: Math.max(ae, Me) };
          },
        }),
      }),
      tm = A.useMemo(
        function () {
          return {
            borderRadius: V,
            borderWidth: re,
            isInteractive: dn,
            isFocusable: !1,
            labelSkipWidth: ve,
            labelSkipHeight: oe,
            margin: ie,
            width: a,
            height: o,
            innerWidth: ye,
            innerHeight: De,
            bars: ht,
            legendData: Ne,
            enableLabel: K,
            xScale: mn,
            yScale: Zn,
            tooltip: Or,
            getTooltipLabel: Ca,
            onClick: hn,
            onMouseEnter: Kn,
            onMouseLeave: Xn,
            getColor: Ge,
          };
        },
        [V, re, dn, ve, oe, ie, a, o, ye, De, ht, Ne, K, mn, Zn, Or, Ca, hn, Kn, Xn, Ge],
      ),
      W3 = Yp(vu),
      nm = cB(s, l, I, D);
    A.useEffect(
      function () {
        var J,
          ae = (J = _t.current) == null ? void 0 : J.getContext("2d");
        _t.current &&
          ae &&
          ((_t.current.width = wt * Zt),
          (_t.current.height = pn * Zt),
          ae.scale(Zt, Zt),
          (ae.fillStyle = jt.background),
          ae.fillRect(0, 0, wt, pn),
          ae.translate(ie.left, ie.top),
          H.forEach(function (Me) {
            Me === "grid"
              ? typeof jt.grid.line.strokeWidth == "number" &&
                jt.grid.line.strokeWidth > 0 &&
                ((ae.lineWidth = jt.grid.line.strokeWidth),
                (ae.strokeStyle = jt.grid.line.stroke),
                T && yy(ae, { width: ye, height: De, scale: mn, axis: "x", values: R }),
                j && yy(ae, { width: ye, height: De, scale: Zn, axis: "y", values: E }))
              : Me === "axes"
                ? bz(ae, {
                    xScale: mn,
                    yScale: Zn,
                    width: ye,
                    height: De,
                    top: b,
                    right: h,
                    bottom: v,
                    left: S,
                    theme: jt,
                  })
                : Me === "bars"
                  ? Pr.forEach(function (Ce) {
                      O(
                        ae,
                        Le(
                          {
                            bar: Ce,
                            borderColor: ka(Ce),
                            borderRadius: V,
                            borderWidth: re,
                            label: Ta(Ce.data),
                            labelColor: Oa(Ce),
                            shouldRenderLabel: ot(Ce),
                          },
                          nm(Ce.width, Ce.height),
                        ),
                      );
                    })
                  : Me === "legends"
                    ? Ne.forEach(function (Ce) {
                        var _e = Ce[0],
                          Et = Ce[1];
                        oB(
                          ae,
                          Le({}, _e, {
                            data: Et,
                            containerWidth: ye,
                            containerHeight: De,
                            theme: jt,
                          }),
                        );
                      })
                    : Me === "annotations"
                      ? zH(ae, { annotations: em, theme: jt })
                      : Me === "totals" && vi
                        ? (function (Ce, _e, Et, Ue) {
                            Ue === void 0 && (Ue = Be.layout),
                              (Ce.fillStyle = Et.text.fill),
                              (Ce.font =
                                "bold " +
                                Et.labels.text.fontSize +
                                "px " +
                                Et.labels.text.fontFamily),
                              (Ce.textBaseline = Ue === "vertical" ? "alphabetic" : "middle"),
                              (Ce.textAlign = Ue === "vertical" ? "center" : "start"),
                              _e.forEach(function (He) {
                                Ce.fillText(He.formattedValue, He.x, He.y);
                              });
                          })(ae, qe, jt, s)
                        : typeof Me == "function" && Me(ae, tm);
          }),
          ae.save());
      },
      [
        v,
        S,
        h,
        b,
        Pr,
        V,
        re,
        em,
        T,
        j,
        ka,
        Ta,
        Oa,
        R,
        E,
        u,
        o,
        De,
        ye,
        tm,
        H,
        s,
        Ne,
        ie.left,
        ie.top,
        pn,
        wt,
        Zt,
        O,
        mn,
        Zn,
        l,
        ot,
        jt,
        a,
        qe,
        vi,
        W3,
        nm,
      ],
    );
    var rm = A.useCallback(
        function (J) {
          if (ht && _t.current) {
            var ae = Hc(_t.current, J),
              Me = ae[0],
              Ce = ae[1],
              _e = Kc(ht, ie, Me, Ce);
            _e !== void 0
              ? (Jn(
                  A.createElement(
                    Or,
                    Le({}, _e.data, {
                      color: _e.color,
                      label: _e.label,
                      value: Number(_e.data.value),
                    }),
                  ),
                  J,
                ),
                J.type === "mouseenter" && (Kn == null || Kn(_e.data, J)))
              : Er();
          }
        },
        [Er, ie, Kn, ht, Jn, Or],
      ),
      q3 = A.useCallback(
        function (J) {
          if (ht && _t.current) {
            Er();
            var ae = Hc(_t.current, J),
              Me = ae[0],
              Ce = ae[1],
              _e = Kc(ht, ie, Me, Ce);
            _e && (Xn == null || Xn(_e.data, J));
          }
        },
        [Er, ie, Xn, ht],
      ),
      H3 = A.useCallback(
        function (J) {
          if (ht && _t.current) {
            var ae = Hc(_t.current, J),
              Me = ae[0],
              Ce = ae[1],
              _e = Kc(ht, ie, Me, Ce);
            _e !== void 0 && (hn == null || hn(Le({}, _e.data, { color: _e.color }), J));
          }
        },
        [ie, hn, ht],
      );
    return B.jsx("canvas", {
      ref: function (J) {
        (_t.current = J), Pt && "current" in Pt && (Pt.current = J);
      },
      width: wt * Zt,
      height: pn * Zt,
      style: { width: wt, height: pn, cursor: dn ? "auto" : "normal" },
      onMouseEnter: dn ? rm : void 0,
      onMouseMove: dn ? rm : void 0,
      onMouseLeave: dn ? q3 : void 0,
      onClick: dn ? H3 : void 0,
    });
  },
  MB = A.forwardRef(function (e, t) {
    var n = e.isInteractive,
      r = e.renderWrapper,
      i = e.theme,
      a = mu(e, kB);
    return B.jsx(Qx, {
      isInteractive: n,
      renderWrapper: r,
      theme: i,
      animate: !1,
      children: B.jsx(OB, Le({}, a, { canvasRef: t })),
    });
  }),
  NB = A.forwardRef(function (e, t) {
    return B.jsx(Yx, {
      children: function (n) {
        var r = n.width,
          i = n.height;
        return B.jsx(MB, Le({ width: r, height: i }, e, { ref: t }));
      },
    });
  });
export {
  C as O,
  EB as Q,
  ze as R,
  Un as T,
  me as _,
  Zo as a,
  k6 as b,
  Xc as c,
  PB as d,
  K2 as e,
  RB as f,
  gt as g,
  wu as h,
  NB as i,
  B as j,
  DB as k,
  AB as l,
  A as r,
  FB as u,
};
//# sourceMappingURL=@app-libs-Cb_auZyT.js.map
