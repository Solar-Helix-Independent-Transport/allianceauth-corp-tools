import { useEffect, useRef, useState } from "react";

const BOTTOM_MARGIN = 24;
const MIN_HEIGHT = 420;

// The map sits inside an AllianceAuth page layout whose surrounding chrome
// (nav bars, menus, page padding) isn't under this app's control, so a fixed
// vh-based height either leaves a gap or overflows depending on how tall that
// chrome happens to be on a given page. Measuring the container's actual
// distance from the top of the viewport and filling the rest is what makes
// this work regardless of the host layout.
export const useFillHeight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    const recalc = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      setHeight(Math.max(MIN_HEIGHT, window.innerHeight - top - BOTTOM_MARGIN));
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return { ref, height };
};
