import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { bagItems, passenger } from "../../data/journey";
import { Arrow } from "./Icons";

const VIEW_W = 760;
const VIEW_H = 440;

const MATERIALS = {
  organic: { label: "Organic", color: "#ff9f43" },
  inorganic: { label: "Inorganic", color: "#4fd6a0" },
  metal: { label: "Metal", color: "#5fb4ff" },
};

// The bag is drawn standing up in a 400 x 530 space, then laid on its side in the tray.
const LAY_FLAT = "translate(380 220) rotate(-90) translate(-200 -265)";
const BODY =
  "M72 170 C72 100 128 66 200 66 C272 66 328 100 328 170 L334 456 C334 480 318 494 294 494 L106 494 C82 494 66 480 66 456 Z";
const POCKET =
  "M104 322 C104 304 116 296 134 296 L266 296 C284 296 296 304 296 322 L298 472 C298 484 290 490 278 490 L122 490 C110 490 102 484 102 472 Z";
const HANDLE = "M178 80 V54 C178 36 222 36 222 54 V80";
const ZIPPER = "M86 178 C86 112 136 82 200 82 C264 82 314 112 314 178";

const TRAY = { x: 88, y: 40, w: 584, h: 360 };
const inset = (n) => ({
  x: TRAY.x + n,
  y: TRAY.y + n,
  width: TRAY.w - n * 2,
  height: TRAY.h - n * 2,
});

const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function tintToCanvas(img, w, h, [r, g, b], scale) {
  const off = document.createElement("canvas");
  off.width = Math.max(1, Math.round(w * scale));
  off.height = Math.max(1, Math.round(h * scale));
  const ctx = off.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, off.width, off.height);
  const frame = ctx.getImageData(0, 0, off.width, off.height);
  const d = frame.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = (0.18 * d[i] + 0.52 * d[i + 1] + 0.12 * d[i + 2]) / 255 + 0.88 * (d[i + 3] / 255);
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = Math.round(Math.min(1, a) * 255);
  }
  ctx.putImageData(frame, 0, 0);
  return off;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function drawFood(ctx, w, h, [r, g, b]) {
  ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
  ctx.strokeStyle = `rgb(${r},${g},${b})`;
  ctx.lineWidth = 1.7;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(w * 0.22, h * 0.14);
  ctx.quadraticCurveTo(w * 0.5, h * 0.04, w * 0.78, h * 0.14);
  ctx.lineTo(w * 0.9, h * 0.24);
  ctx.quadraticCurveTo(w * 0.98, h * 0.5, w * 0.88, h * 0.78);
  ctx.lineTo(w * 0.78, h * 0.88);
  ctx.quadraticCurveTo(w * 0.5, h * 0.97, w * 0.22, h * 0.88);
  ctx.lineTo(w * 0.12, h * 0.78);
  ctx.quadraticCurveTo(w * 0.02, h * 0.5, w * 0.1, h * 0.24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.16);
  ctx.lineTo(w * 0.28, h * 0.1);
  ctx.lineTo(w * 0.38, h * 0.16);
  ctx.lineTo(w * 0.5, h * 0.09);
  ctx.lineTo(w * 0.62, h * 0.16);
  ctx.lineTo(w * 0.72, h * 0.1);
  ctx.lineTo(w * 0.8, h * 0.16);
  ctx.moveTo(w * 0.2, h * 0.86);
  ctx.lineTo(w * 0.28, h * 0.92);
  ctx.lineTo(w * 0.38, h * 0.86);
  ctx.lineTo(w * 0.5, h * 0.93);
  ctx.lineTo(w * 0.62, h * 0.86);
  ctx.lineTo(w * 0.72, h * 0.92);
  ctx.lineTo(w * 0.8, h * 0.86);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.5, w * 0.2, h * 0.14, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
  [
    [0.38, 0.46],
    [0.52, 0.42],
    [0.6, 0.52],
    [0.44, 0.56],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(w * x, h * y, w * 0.055, h * 0.03, 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFallback(ctx, item, w, h, color) {
  if (item.id === "food") drawFood(ctx, w, h, color);
  else drawBook(ctx, w, h, color);
}

function drawBook(ctx, w, h, [r, g, b]) {
  ctx.fillStyle = `rgba(${r},${g},${b},0.28)`;
  ctx.strokeStyle = `rgb(${r},${g},${b})`;
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, 2, 2, w - 4, h - 4, 4);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(13, 3);
  ctx.lineTo(13, h - 3);
  ctx.moveTo(w - 6, 8);
  ctx.lineTo(w - 6, h - 8);
  ctx.moveTo(w - 10, 8);
  ctx.lineTo(w - 10, h - 8);
  ctx.stroke();
}

async function bakeXraySheet() {
  const scale = window.innerWidth < 768 ? 1 : 2;
  const canvas = document.createElement("canvas");
  canvas.width = VIEW_W * scale;
  canvas.height = VIEW_H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#08131d";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.strokeStyle = "rgba(143, 183, 201, 0.2)";
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, TRAY.x, TRAY.y, TRAY.w, TRAY.h, 30);
  ctx.stroke();
  roundRectPath(ctx, TRAY.x + 34, TRAY.y + 34, TRAY.w - 68, TRAY.h - 68, 14);
  ctx.stroke();

  ctx.save();
  ctx.translate(380, 220);
  ctx.rotate(-Math.PI / 2);
  ctx.translate(-200, -265);
  ctx.fillStyle = "rgba(143, 183, 201, 0.07)";
  ctx.strokeStyle = "rgba(143, 183, 201, 0.42)";
  ctx.lineWidth = 1.5;
  ctx.fill(new Path2D(BODY));
  ctx.stroke(new Path2D(BODY));
  ctx.fillStyle = "rgba(143, 183, 201, 0.05)";
  ctx.setLineDash([5, 4]);
  ctx.fill(new Path2D(POCKET));
  ctx.stroke(new Path2D(POCKET));
  ctx.setLineDash([2, 3]);
  ctx.stroke(new Path2D(ZIPPER));
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(143, 183, 201, 0.18)";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D(HANDLE));
  ctx.restore();

  const prepared = [];
  for (const item of bagItems) {
    const color = hexRgb(MATERIALS[item.material]?.color ?? MATERIALS.inorganic.color);
    if (!item.image) {
      prepared.push({ item, color, tint: null });
      continue;
    }
    const img = await loadImage(item.image);
    prepared.push({ item, color, tint: tintToCanvas(img, item.box.w, item.box.h, color, scale) });
    if (scale === 1) await new Promise((resolve) => setTimeout(resolve, 0));
  }

  for (const { item, color, tint } of prepared) {
    const { x, y, w, h } = item.box;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(((item.tilt ?? 0) * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
    if (tint) ctx.drawImage(tint, 0, 0, w, h);
    else drawFallback(ctx, item, w, h, color);
    ctx.restore();
  }

  return scale === 1 ? canvas.toDataURL("image/jpeg", 0.85) : canvas.toDataURL("image/png");
}

let xraySheet;
function loadXraySheet() {
  xraySheet ??= bakeXraySheet().catch(() => "");
  return xraySheet;
}

// Fallback drawings for items without a photo, in the coordinate space of the item's `box`.
const SHAPES = {
  book: (
    <>
      <rect x="2" y="2" width="70" height="108" rx="4" />
      <path d="M13 3 V109" className="is-line" />
      <path d="M68 8 V104 M64 8 V104" className="is-line" />
      <rect x="24" y="24" width="34" height="5" rx="1" className="is-solid" />
      <rect x="24" y="35" width="24" height="3" rx="1" className="is-solid" />
    </>
  ),
  food: (
    <>
      <path d="M15 14 Q35 4 55 14 L63 24 Q69 50 62 78 L55 88 Q35 97 15 88 L8 78 Q1 50 7 24 Z" />
      <path d="M14 16 L20 10 L27 16 L35 9 L43 16 L50 10 L56 16" className="is-line" />
      <path d="M14 86 L20 92 L27 86 L35 93 L43 86 L50 92 L56 86" className="is-line" />
      <ellipse cx="35" cy="50" rx="14" ry="14" className="is-line" />
      <ellipse cx="27" cy="46" rx="4" ry="2.4" className="is-solid" />
      <ellipse cx="38" cy="42" rx="3.6" ry="2.2" className="is-solid" />
      <ellipse cx="42" cy="54" rx="4" ry="2.4" className="is-solid" />
      <ellipse cx="31" cy="56" rx="3.4" ry="2" className="is-solid" />
    </>
  ),
};

function Belt() {
  return (
    <g className="jn-bc-belt" aria-hidden>
      <defs>
        <pattern id="jn-bc-rollers" width="22" height={VIEW_H} patternUnits="userSpaceOnUse">
          <rect x="13" y="22" width="9" height={VIEW_H - 44} className="jn-bc-roller" />
        </pattern>
      </defs>
      <rect x="0" y="22" width={VIEW_W} height={VIEW_H - 44} className="jn-bc-belt-bg" />
      <rect x="0" y="22" width={VIEW_W} height={VIEW_H - 44} fill="url(#jn-bc-rollers)" />
      <path d={`M0 22 H${VIEW_W} M0 ${VIEW_H - 22} H${VIEW_W}`} className="jn-bc-rail" />
      {[0, VIEW_W - 40].map((x) => (
        <g key={x} className="jn-bc-curtain">
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={x + i * 8} y="22" width="9" height={VIEW_H - 44} rx="2" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Tray() {
  return (
    <g className="jn-bc-tray">
      <rect {...inset(0)} transform="translate(0 8)" rx="30" className="jn-bc-tray-shadow" />
      <rect {...inset(0)} rx="30" className="jn-bc-tray-rim" />
      <rect {...inset(14)} rx="22" className="jn-bc-tray-wall" />
      <rect {...inset(34)} rx="14" className="jn-bc-tray-floor" />
      {[TRAY.x + 4, TRAY.x + TRAY.w - 12].map((x) => (
        <rect key={x} x={x} y={TRAY.y + TRAY.h / 2 - 34} width="8" height="68" rx="4" className="jn-bc-tray-slot" />
      ))}
    </g>
  );
}

function Backpack() {
  return (
    <g className="jn-bc-bag">
      <g transform={LAY_FLAT}>
        <path d={HANDLE} className="jn-bc-handle" />
        <path d={BODY} className="jn-bc-body" />
        <path d="M80 300 L76 488 M320 300 L324 488" className="jn-bc-seam" />
        <path d={ZIPPER} className="jn-bc-zip-tape" />
        <path d={ZIPPER} className="jn-bc-zip" />
        <path d="M100 124 l-10 22 M108 118 l-5 24" className="jn-bc-pull" />
        <path d={POCKET} className="jn-bc-pocket" />
        <path d="M104 334 H296" className="jn-bc-seam" />
        <path d="M114 344 H286" className="jn-bc-stitch" />
        <path d="M110 338 l-6 22 M115 338 l-2 24" className="jn-bc-pull" />
      </g>
      <g className="jn-bc-patch" transform="translate(528 143) rotate(-90 28 21)">
        <rect width="56" height="42" rx="1.5" className="jn-bc-patch-bg" />
        <rect x="3" y="3" width="50" height="36" className="jn-bc-patch-line" />
        <text x="28" y="11" className="jn-bc-patch-small">
          The finest quality
        </text>
        <text x="28" y="24" className="jn-bc-patch-name">
          {passenger.lastName}
        </text>
        <text x="28" y="30" className="jn-bc-patch-small">
          Supply co.
        </text>
        <rect x="14" y="32" width="28" height="5" className="jn-bc-patch-bar" />
        <text x="28" y="35.9" className="jn-bc-patch-bar-text">
          {passenger.flight}
        </text>
      </g>
    </g>
  );
}

// Top edge of an item's box once its tilt is applied.
function visualTop({ box, tilt = 0 }) {
  const r = (tilt * Math.PI) / 180;
  const half = (Math.abs(box.w * Math.sin(r)) + Math.abs(box.h * Math.cos(r))) / 2;
  return box.y + box.h / 2 - half;
}

function XrayHotspot({ item, live, active, dimmed, onOpen, onHover }) {
  const { x, y, w, h } = item.box;
  const color = MATERIALS[item.material]?.color ?? MATERIALS.inorganic.color;
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(item.id);
    }
  };
  return (
    <button
      type="button"
      className={`jn-bc-hot${active ? " is-on" : ""}${dimmed ? " is-dim" : ""}`}
      style={{
        "--m": color,
        left: `${(x / VIEW_W) * 100}%`,
        top: `${(y / VIEW_H) * 100}%`,
        width: `${(w / VIEW_W) * 100}%`,
        height: `${(h / VIEW_H) * 100}%`,
        transform: `rotate(${item.tilt ?? 0}deg)`,
      }}
      tabIndex={live ? 0 : -1}
      disabled={!live}
      aria-label={`${item.name}, ${MATERIALS[item.material]?.label}. Open details`}
      onClick={() => onOpen(item.id)}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(item.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={(e) => e.target.matches(":focus-visible") && onHover(item.id)}
      onBlur={() => onHover(null)}
    />
  );
}

function ItemModal({ item, onClose, onStep }) {
  const close = useRef(null);
  const index = bagItems.indexOf(item);
  const material = MATERIALS[item.material] ?? MATERIALS.inorganic;

  useEffect(() => {
    close.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return (
    <motion.div
      className="jn-bc-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="jn-bc-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="jn-bc-dialog-title"
        style={{ "--m": material.color }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="jn-bc-dialog-bar">
          <span>
            Item {String(index + 1).padStart(2, "0")} of {String(bagItems.length).padStart(2, "0")}
          </span>
          <button ref={close} type="button" className="jn-bc-dialog-x" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="jn-bc-dialog-body"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            <figure className={`jn-bc-dialog-photo${item.photo ? " is-photo" : ""}`}>
              {item.photo ? (
                <img src={item.photo} alt={item.name} style={{ objectPosition: item.photoPosition }} />
              ) : item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <svg viewBox={`-8 -8 ${item.box.w + 16} ${item.box.h + 16}`} className="jn-bc-dialog-shape" aria-hidden>
                  {SHAPES[item.id]}
                </svg>
              )}
              {item.credit && (
                <figcaption>
                  <a href={item.credit.href} target="_blank" rel="noopener noreferrer">
                    {item.credit.label}
                  </a>
                </figcaption>
              )}
            </figure>

            <div className="jn-bc-dialog-text">
              <span className="jn-label">
                {item.kind} · <b>{material.label}</b>
              </span>
              <h3 id="jn-bc-dialog-title" className="jn-bc-title">
                {item.name}
              </h3>
              <p>
                {item.body}
                {item.bodyLink && (
                  <>
                    {" "}
                    <a href={item.bodyLink.href} target="_blank" rel="noopener noreferrer">
                      {item.bodyLink.label}
                    </a>
                  </>
                )}
              </p>
              {item.link && (
                <a className="jn-btn" href={item.link.href} target="_blank" rel="noopener noreferrer">
                  {item.link.label} <Arrow size={14} direction="up-right" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="jn-bc-dialog-nav">
          <button type="button" onClick={() => onStep(-1)}>
            <Arrow size={14} direction="left" /> Prev
          </button>
          <span className="jn-bc-dots" aria-hidden>
            {bagItems.map((it) => (
              <i key={it.id} className={it.id === item.id ? "is-on" : ""} />
            ))}
          </span>
          <button type="button" onClick={() => onStep(1)}>
            Next <Arrow size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BagCheck() {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [xray, setXray] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lit, setLit] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);
  const [sheet, setSheet] = useState("");
  const opener = useRef(null);

  useEffect(() => {
    const el = document.getElementById("security");
    if (!el) return;
    let on = true;
    const start = () => {
      loadXraySheet().then((url) => {
        if (on) setSheet(url);
      });
    };
    if (!("IntersectionObserver" in window)) {
      start();
      return () => {
        on = false;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        start();
        observer.disconnect();
      },
      { rootMargin: "700px" },
    );
    observer.observe(el);
    return () => {
      on = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (xray === lit) return;
    if (reduced) {
      setScanning(false);
      setLit(xray);
      return;
    }
    const timer = window.setTimeout(() => {
      setScanning(false);
      setLit(xray);
    }, xray ? 1000 : 600);
    return () => window.clearTimeout(timer);
  }, [xray, lit, reduced]);

  const finishWipe = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    setScanning(false);
    setLit(xray);
  };

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const toggle = () => {
    if (scanning) return;
    setHovered(null);
    if (reduced) {
      setXray((on) => !on);
      setLit((on) => !on);
      return;
    }
    setScanning(true);
    setXray((on) => !on);
  };

  const openItem = (id) => {
    opener.current = document.activeElement;
    setOpen(id);
  };

  const closeItem = () => {
    setOpen(null);
    opener.current?.focus?.({ preventScroll: true });
  };

  const step = (dir) =>
    setOpen((cur) => {
      const i = bagItems.findIndex((it) => it.id === cur);
      return bagItems[(i + dir + bagItems.length) % bagItems.length].id;
    });

  const openedItem = bagItems.find((i) => i.id === open);
  const hoveredItem = lit && !scanning ? bagItems.find((i) => i.id === hovered) : null;
  const status = scanning ? "Scanning" : xray ? "Bag clear" : "Waiting";

  return (
    <section id="security" className="jn-section">
      <header className="jn-section-head">
        <p className="jn-kicker">Security · Lane 2</p>
        <h2 className="jn-h2">Bag check</h2>
        <p className="jn-section-note">Let&rsquo;s see what&rsquo;s inside.</p>
      </header>

      <div className={`jn-bc${xray ? " is-xray" : ""}${scanning ? " is-scanning" : ""}`}>
        <div className="jn-bc-scanner">
          <div className="jn-bc-bar">
            <span>X-ray · Lane 2</span>
            <span
              className={`jn-bc-status${scanning ? " is-scanning" : ""}${xray && !scanning ? " is-clear" : ""}`}
            >
              <i aria-hidden />
              {status}
            </span>
          </div>

          <div className="jn-bc-stage">
            <div className={`jn-bc-xray-layer${lit && !scanning ? " is-live" : ""}`} aria-hidden={!lit}>
              {sheet && <img className="jn-bc-sheet" src={sheet} alt="" draggable="false" />}
              {bagItems.map((it) => (
                <XrayHotspot
                  key={it.id}
                  item={it}
                  live={lit && !scanning}
                  active={open === it.id || hovered === it.id}
                  dimmed={(hovered ?? open) !== null && (hovered ?? open) !== it.id}
                  onOpen={openItem}
                  onHover={setHovered}
                />
              ))}
            </div>

            <div className="jn-bc-shutter" onTransitionEnd={finishWipe}>
              <div className="jn-bc-shutter-inner">
                <svg
                  className="jn-bc-svg"
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  role="img"
                  aria-label="Jennifer's backpack in a security tray"
                >
                  <Belt />
                  <Tray />
                  <Backpack />
                </svg>
              </div>
            </div>

            <span className="jn-bc-beam" aria-hidden>
              <i />
            </span>

            <AnimatePresence>
              {hoveredItem && (
                <motion.div
                  key={hoveredItem.id}
                  className="jn-bc-tip"
                  style={{
                    "--m": MATERIALS[hoveredItem.material]?.color,
                    left: `${((hoveredItem.box.x + hoveredItem.box.w / 2) / VIEW_W) * 100}%`,
                    top: `${(visualTop(hoveredItem) / VIEW_H) * 100}%`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  aria-hidden
                >
                  <i />
                  {hoveredItem.name}
                  <small>{MATERIALS[hoveredItem.material]?.label} · click to inspect</small>
                </motion.div>
              )}
            </AnimatePresence>

            {!xray && !scanning && (
              <button type="button" className="jn-bc-cta" onClick={toggle}>
                <span className="jn-btn is-solid">
                  See inside <Arrow size={14} />
                </span>
              </button>
            )}
          </div>

          <div className="jn-bc-foot">
            <div className="jn-bc-legend" aria-hidden={!xray}>
              {Object.entries(MATERIALS).map(([key, m]) => (
                <span key={key} style={{ "--m": m.color }}>
                  <i />
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="jn-bc-caption">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={lit ? "clear" : "intro"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {!lit
                ? `One navy backpack, ${bagItems.length} items declared. Each one says a little something about me.`
                : "Hover over anything in the bag, then click to take a closer look."}
            </motion.p>
          </AnimatePresence>

          {lit && (
            <div className="jn-bc-list" role="list">
              {bagItems.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  role="listitem"
                  className={`jn-bc-chip${hovered === it.id ? " is-on" : ""}`}
                  style={{ "--m": MATERIALS[it.material]?.color }}
                  onClick={() => openItem(it.id)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(it.id)}
                  onPointerLeave={() => setHovered(null)}
                >
                  <i aria-hidden />
                  {it.name}
                </button>
              ))}
            </div>
          )}

          {lit && (
            <button type="button" className="jn-bc-close" onClick={toggle}>
              Zip it back up
            </button>
          )}
        </div>
      </div>

      <div className="jn-bc-preload" aria-hidden>
        {bagItems.map((it) =>
          it.image ? <img key={it.id} src={it.image} alt="" /> : null,
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {openedItem && <ItemModal key="modal" item={openedItem} onClose={closeItem} onStep={step} />}
        </AnimatePresence>,
        document.querySelector(".jn") ?? document.body,
      )}
    </section>
  );
}
