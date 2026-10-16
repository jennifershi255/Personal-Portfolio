import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pin, Plane } from "./Icons";
import { clamp } from "./flyTo";

// Where the plane sits on screen, as a fraction of the viewport height, while the page scrolls.
const ANCHOR = 0.6;
// Distance along the path where the plane gives way to the destination pin.
const LAND = 180;

// How far across the page each sweep of the wave reaches, as fractions of the width.
const SWEEP = [0.14, 0.82, 0.22, 0.88, 0.1, 0.76, 0.18, 0.86];

// Each point is passed along the direction from its previous to its next neighbour, with handles
// sized to the segment they sit on, so turns stay round without the curve overshooting.
function smoothPath(pts, width) {
  const fit = (x) => clamp(x, 8, width - 8);
  const tangent = (i) => {
    if (pts[i].heading) return pts[i].heading;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const n = Math.hypot(dx, dy) || 1;
    return { x: dx / n, y: dy / n };
  };
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const ta = tangent(i);
    const tb = tangent(i + 1);
    // Capping the vertical reach keeps every segment moving down the page.
    const k = Math.min(Math.hypot(b.x - a.x, b.y - a.y) * 0.38, ((b.y - a.y) * 0.6) / Math.max(ta.y, tb.y, 0.05));
    d += ` C${fit(a.x + ta.x * k)} ${a.y + ta.y * k} ${fit(b.x - tb.x * k)} ${b.y - tb.y * k} ${b.x} ${b.y}`;
  }
  return d;
}

function plan(root, fromSelector, stopoverId, landingSelector) {
  const source = document.querySelector(fromSelector);
  const stopover = document.getElementById(stopoverId);
  const landing = stopover?.querySelector(landingSelector);
  if (!source || !landing) return null;

  const offset = root.getBoundingClientRect().top + window.scrollY;
  const toDoc = (r) => ({
    left: r.left,
    right: r.right,
    top: r.top + window.scrollY - offset,
    bottom: r.bottom + window.scrollY - offset,
    height: r.height,
  });
  const width = root.clientWidth;
  // Measured from the content rather than the root, which also contains this overlay and would
  // otherwise keep the page as tall as the last measurement.
  const main = root.querySelector("main") ?? root;
  const height = toDoc(main.getBoundingClientRect()).bottom;
  const pass = toDoc(source.getBoundingClientRect());
  const card = toDoc(landing.getBoundingClientRect());
  const anchor = window.innerHeight * ANCHOR;
  const footer = root.querySelector(".jn-footer");
  const endY = Math.min(
    footer ? toDoc(footer.getBoundingClientRect()).top - 16 : height - 24,
    height - window.innerHeight + anchor - 8,
  );

  const content = Math.min(width, 1120) - 40;
  const roomy = (width - content) / 2 >= 90;

  const start = { x: Math.min(width - 11, pass.right + (roomy ? 22 : 6)), y: pass.top + pass.height * 0.5 };
  const pts = [start];

  // Swoop from the pass to beside the passport cover, then weave across the page to the end.
  if (roomy) {
    pts.push({ x: Math.min(width - 30, start.x + 50), y: (pass.bottom + card.top) / 2 });
    pts.push({ x: card.left - 70, y: card.top + Math.min(card.height * 0.3, 170) });
  } else {
    pts.push({ x: width * 0.9, y: pass.bottom + 40 });
  }

  const from = pts[pts.length - 1].y;
  const stride = roomy ? clamp(window.innerHeight * 1.05, 700, 980) : clamp(window.innerHeight * 0.85, 560, 760);
  const count = Math.max(1, Math.round((endY - from) / stride));
  for (let i = 1; i <= count; i++) {
    pts.push({ x: width * SWEEP[(i - 1 + (roomy ? 0 : 1)) % SWEEP.length], y: from + ((endY - from) * i) / count });
  }
  // Land in the open margin beside the baggage belt rather than behind a suitcase.
  if (roomy) pts[pts.length - 1].x = width - (width - content) / 4;

  return { width, height, d: smoothPath(hugLeft(root, pts, toDoc, stride, width), width), start, anchor, offset, small: !roomy };
}

// The experience timeline is text-heavy, so through it the trail meanders inside the left margin,
// swinging out to the right beside the bag check on the way in.
function hugLeft(root, pts, toDoc, stride, width) {
  const section = root.querySelector("#layovers");
  if (!section) return pts;
  const bag = root.querySelector("#security");
  const box = toDoc(section.getBoundingClientRect());
  const heading = section.querySelector("h2")?.getBoundingClientRect();
  const edge = (heading?.left ?? box.left) - 24;
  const lo = Math.max(8, edge * 0.35);
  const hi = Math.max(lo + 8, edge * 0.8);
  const top = box.top - 140;
  const bottom = box.bottom - 40;
  const clear = stride * 0.45;

  const swing = bag && toDoc(bag.getBoundingClientRect());
  const lead = swing ? [{ x: width * 0.86, y: swing.top + (swing.bottom - swing.top) * 0.35 }] : [];
  const from = swing ? lead[0].y - clear : top - clear;

  const last = pts[pts.length - 1];
  const kept = pts.filter((p, i) => i < 2 || p === last || p.y < from || p.y > bottom + clear);
  const n = Math.max(2, Math.round((bottom - top) / (stride * 0.5)));
  const inner = Array.from({ length: n + 1 }, (_, i) => ({ x: i % 2 ? hi : lo, y: top + ((bottom - top) * i) / n }));
  // Arriving already heading down turns the swing in from the right into one long, even curve.
  inner[0].heading = { x: -0.3, y: 0.954 };
  return [...kept, ...lead, ...inner].sort((a, b) => a.y - b.y);
}

export default function FlightPath({ fromSelector, stopoverId, landingSelector }) {
  const [root, setRoot] = useState(null);
  const [geo, setGeo] = useState(null);
  const path = useRef(null);
  const reveal = useRef(null);
  const plane = useRef(null);
  const arrived = useRef(null);
  const origin = useRef(null);

  useEffect(() => {
    const el = document.querySelector(".jn");
    setRoot(el);
    let timer;
    const measure = () => setGeo(plan(el, fromSelector, stopoverId, landingSelector));
    const soon = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    };
    // Wait for the pass's entrance animation and fonts before measuring.
    timer = setTimeout(measure, 1200);
    window.addEventListener("resize", soon);
    window.addEventListener("load", soon);
    const ro = new ResizeObserver(soon);
    ro.observe(el.querySelector("main") ?? el);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", soon);
      window.removeEventListener("load", soon);
      ro.disconnect();
    };
  }, [fromSelector, stopoverId, landingSelector]);

  useLayoutEffect(() => {
    if (!geo) return;
    const p = path.current;
    const len = p.getTotalLength();
    reveal.current.style.strokeDasharray = `${len} ${len}`;

    // Lookup table from depth down the page to distance along the path.
    const step = 6;
    const table = [];
    let deepest = -Infinity;
    for (let at = 0; at <= len; at += step) {
      deepest = Math.max(deepest, p.getPointAtLength(at).y);
      table.push(deepest);
    }
    const lengthAt = (y) => {
      let lo = 0;
      let hi = table.length - 1;
      if (y >= table[hi]) return len;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (table[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return lo * step;
    };

    const target = () => {
      const y = window.scrollY - geo.offset + geo.anchor;
      return y <= geo.start.y ? 0 : lengthAt(y);
    };
    const draw = (at) => {
      const pt = p.getPointAtLength(at);
      const ahead = p.getPointAtLength(Math.min(len, at + 10));
      const behind = p.getPointAtLength(Math.max(0, at - 10));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI + 90;
      const shown = clamp(at / 60, 0, 1);
      const land = clamp((at - (len - LAND)) / LAND, 0, 1);
      plane.current.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${1 - 0.35 * land})`;
      plane.current.style.opacity = shown * (1 - land);
      arrived.current.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -92%) scale(${0.45 + 0.55 * land})`;
      arrived.current.style.opacity = land;
      arrived.current.classList.toggle("is-landed", land > 0.95);
      origin.current.style.opacity = shown;
      reveal.current.style.strokeDashoffset = `${len - at}`;
    };

    // Glide toward the scroll position so flatter stretches are flown rather than jumped.
    let at = target();
    let frame = 0;
    const tick = () => {
      const goal = target();
      at += (goal - at) * 0.16;
      if (Math.abs(goal - at) < 0.5) at = goal;
      draw(at);
      frame = at === goal ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    draw(at);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geo]);

  if (!root || !geo) return null;
  const maskId = "jn-flight-mask";
  return createPortal(
    <div
      className={`jn-flight${geo.small ? " is-small" : ""}`}
      style={{ width: geo.width, height: geo.height }}
      aria-hidden
    >
      <svg width={geo.width} height={geo.height}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <path ref={reveal} d={geo.d} className="jn-flight-reveal" />
          </mask>
        </defs>
        <circle ref={origin} cx={geo.start.x} cy={geo.start.y} r="5" className="jn-flight-origin" />
        <path ref={path} d={geo.d} className="jn-flight-trail" mask={`url(#${maskId})`} />
      </svg>
      <span ref={plane} className="jn-flight-plane">
        <Plane size={geo.small ? 22 : 40} />
      </span>
      <span ref={arrived} className="jn-flight-arrived">
        <Pin size={geo.small ? 22 : 32} />
      </span>
    </div>,
    root,
  );
}
