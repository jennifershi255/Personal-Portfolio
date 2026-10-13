import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCoords } from "../../data/travel";

const pad = (n) => String(n).padStart(2, "0");

const seededRandom = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const hashString = (str) =>
  [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483646, 7) + 1;

function useElementSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const PAPER_SIDE = 8;
const PAPER_BOTTOM = 34;

const TABLE_MARGIN = 12;
const TAPE_OVERHANG = 12;

const heightForWidth = (width, ratio) =>
  (width - PAPER_SIDE * 2) / ratio + PAPER_SIDE + PAPER_BOTTOM;

// Shrinks a print until it fits the table with room left for tilt and tape.
function printSize(item, baseWidth, tableW, tableH) {
  let width = (item.ratio > 1 ? baseWidth * 1.3 : baseWidth) * (item.kind === "vlog" ? 1.4 : 1);
  const maxW = (tableW - TABLE_MARGIN * 2) * 0.82;
  const maxH = (tableH - TABLE_MARGIN * 2 - TAPE_OVERHANG) * 0.8;
  if (tableW && width > maxW) width = maxW;
  if (tableH && heightForWidth(width, item.ratio) > maxH) {
    width = (maxH - PAPER_SIDE - PAPER_BOTTOM) * item.ratio + PAPER_SIDE * 2;
  }
  return { width, height: heightForWidth(width, item.ratio) };
}

// Jittered grid so prints look tossed on the table without piling up.
function scatterLayout(items, sizes, w, h, seed) {
  const rand = seededRandom(seed);
  const n = items.length;
  const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
  const rows = Math.ceil(n / cols);
  const cellW = w / cols;
  const cellH = h / rows;
  const cells = [...Array(cols * rows).keys()];
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  // Keeps the centre far enough in that the rotated outline stays on the table.
  const clampCentre = (c, half, min, max) =>
    min + half > max - half ? (min + max) / 2 : Math.min(Math.max(c, min + half), max - half);

  return items.map((_, i) => {
    const { width, height } = sizes[i];
    const c = cells[i];
    const cx = ((c % cols) + 0.5 + (rand() - 0.5) * 0.7) * cellW;
    const cy = (Math.floor(c / cols) + 0.5 + (rand() - 0.5) * 0.7) * cellH;
    const rotate = (rand() - 0.5) * 18;
    const rad = (Math.abs(rotate) * Math.PI) / 180;
    const halfW = (width * Math.cos(rad) + height * Math.sin(rad)) / 2;
    const halfH = (width * Math.sin(rad) + height * Math.cos(rad)) / 2;
    const x = clampCentre(cx, halfW, TABLE_MARGIN, w - TABLE_MARGIN) - width / 2;
    const y =
      clampCentre(cy, halfH, TABLE_MARGIN + TAPE_OVERHANG, h - TABLE_MARGIN) - height / 2;
    return { x, y, rotate, scale: 1 };
  });
}

// Masonry columns; prints are scaled (origin centre) to the column width.
function sheetLayout(sizes, w, colTarget, gap) {
  const cols = Math.max(2, Math.floor((w - gap) / (colTarget + gap)));
  const colW = (w - gap * (cols + 1)) / cols;
  const heights = Array(cols).fill(gap);
  const layout = sizes.map(({ width, height }) => {
    const scale = colW / width;
    const col = heights.indexOf(Math.min(...heights));
    const left = gap + col * (colW + gap);
    const top = heights[col];
    heights[col] += height * scale + gap;
    return {
      x: left - (width * (1 - scale)) / 2,
      y: top - (height * (1 - scale)) / 2,
      rotate: 0,
      scale,
    };
  });
  return { layout, height: Math.max(...heights) };
}

function Print({ item, index, size, target, origin, z, draggable, constraints, onFront, onOpen }) {
  const down = useRef(null);
  const dragged = useRef(false);

  const handleTap = (_, info) => {
    if (dragged.current || !down.current) return;
    const dx = info.point.x - down.current.x;
    const dy = info.point.y - down.current.y;
    if (dx * dx + dy * dy > 36) return;
    onOpen(item);
  };

  return (
    <motion.div
      className={`lt-print${item.kind === "vlog" ? " is-vlog" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={item.kind === "vlog" ? "Watch the vlog on YouTube" : `Open photo: ${item.caption}`}
      style={{ width: size.width, height: size.height, zIndex: z }}
      initial={{ ...origin, opacity: 0 }}
      animate={{ ...target, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 19,
        mass: 0.9,
        delay: Math.min(index * 0.022, 0.5),
      }}
      drag={draggable}
      dragConstraints={constraints}
      dragElastic={0.08}
      dragTransition={{ power: 0.2, timeConstant: 220 }}
      whileHover={{ scale: target.scale * 1.03 }}
      whileDrag={{ scale: target.scale * 1.06, cursor: "grabbing" }}
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
        onFront(index);
      }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onTap={handleTap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      {index % 3 === 0 && <span className="lt-tape" aria-hidden />}
      <div className="lt-print-photo" style={{ aspectRatio: item.ratio }}>
        <img src={item.thumb} alt="" draggable={false} loading="lazy" decoding="async" />
        {item.kind === "vlog" && (
          <>
            <span className="lt-play" aria-hidden />
            <span className="lt-vlog-tag" aria-hidden>
              Vlog
            </span>
          </>
        )}
      </div>
      <span className="lt-print-caption">{item.caption}</span>
    </motion.div>
  );
}

function Viewer({ photos, index, onIndex, onClose }) {
  const [direction, setDirection] = useState(0);
  const strip = useRef(null);
  const photo = photos[index];

  const go = useCallback(
    (d) => {
      setDirection(d);
      onIndex((index + d + photos.length) % photos.length);
    },
    [index, photos.length, onIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    [-1, 1].forEach((d) => {
      const next = photos[(index + d + photos.length) % photos.length];
      new Image().src = next.full;
    });
    strip.current
      ?.querySelector(".is-active")
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, photos]);

  return (
    <motion.div
      className="lv"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lv-top">
        <span className="lv-count">
          {pad(index + 1)} <span>/ {pad(photos.length)}</span>
        </span>
        <button type="button" className="tg-textbtn" onClick={onClose}>
          Back to table
        </button>
      </div>

      <div className="lv-stage" onClick={onClose}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.figure
            key={photo.full}
            className="lv-frame"
            style={{ "--r": photo.ratio, backgroundImage: `url("${photo.thumb}")` }}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d * 80, opacity: 0, rotate: d * 2 }),
              center: { x: 0, opacity: 1, rotate: 0 },
              exit: (d) => ({ x: d * -80, opacity: 0, rotate: d * -2 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -500) go(1);
              else if (info.offset.x > 60 || info.velocity.x > 500) go(-1);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.full}
              alt={photo.caption}
              draggable={false}
              onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
            />
          </motion.figure>
        </AnimatePresence>
      </div>

      <p className="lv-caption">{photo.caption}</p>

      <button type="button" className="lv-nav is-prev" onClick={() => go(-1)} aria-label="Previous photo">
        <span />
      </button>
      <button type="button" className="lv-nav is-next" onClick={() => go(1)} aria-label="Next photo">
        <span />
      </button>

      <div className="lv-strip" ref={strip}>
        {photos.map((p, i) => (
          <button
            key={p.full}
            type="button"
            className={`lv-thumb${i === index ? " is-active" : ""}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              onIndex(i);
            }}
            aria-label={`Photo ${i + 1}: ${p.caption}`}
          >
            <img src={p.thumb} alt="" draggable={false} loading="lazy" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function LightTable({ location, number, nextLocation, isMobile, onClose, onNext }) {
  const tableRef = useRef(null);
  const { w, h } = useElementSize(tableRef);
  const [mode, setMode] = useState("scatter");
  const [shuffle, setShuffle] = useState(0);
  const [zOrder, setZOrder] = useState({});
  const zCounter = useRef(100);
  const [viewerIndex, setViewerIndex] = useState(null);

  const items = useMemo(() => {
    const list = location.photos.map((p, i) => ({ ...p, kind: "photo", photoIndex: i }));
    if (location.videoUrl && location.cover) {
      list.unshift({
        kind: "vlog",
        thumb: location.cover.src,
        ratio: location.cover.ratio,
        caption: "the vlog ↗",
      });
    }
    return list;
  }, [location]);

  const baseWidth = items.length <= 2 ? (isMobile ? 220 : 340) : isMobile ? 112 : 168;
  const sizes = useMemo(
    () => items.map((it) => printSize(it, baseWidth, w, h)),
    [items, baseWidth, w, h]
  );

  const { layout, innerHeight } = useMemo(() => {
    if (!w || !h) return { layout: [], innerHeight: 0 };
    if (mode === "sheet") {
      const sheet = sheetLayout(sizes, w, isMobile ? 140 : 200, isMobile ? 12 : 22);
      return { layout: sheet.layout, innerHeight: Math.max(h, sheet.height) };
    }
    return {
      layout: scatterLayout(items, sizes, w, h, hashString(location.id) + shuffle * 7919),
      innerHeight: h,
    };
  }, [mode, items, sizes, w, h, isMobile, location.id, shuffle]);

  const bringToFront = useCallback((i) => {
    zCounter.current += 1;
    setZOrder((prev) => ({ ...prev, [i]: zCounter.current }));
  }, []);

  const openItem = useCallback(
    (item) => {
      if (item.kind === "vlog") {
        window.open(location.videoUrl, "_blank", "noopener,noreferrer");
      } else {
        setViewerIndex(item.photoIndex);
      }
    },
    [location.videoUrl]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (viewerIndex !== null) setViewerIndex(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, onClose]);

  const scatter = () => {
    if (mode === "scatter") setShuffle((s) => s + 1);
    else setMode("scatter");
    tableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const photoCount = location.photos.length;
  const showModes = items.length > 3;

  return (
    <motion.section
      className="lt"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(75% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      aria-label={`${location.name} photos`}
    >
      <header className="lt-head">
        <div className="lt-heading">
          <p className="tg-meta">
            {pad(number)} &nbsp;/&nbsp; {formatCoords(location)}
          </p>
          <h2 className="lt-title">{location.name}</h2>
          {location.description && <p className="lt-desc">{location.description}</p>}
        </div>

        <div className="lt-controls">
          {location.videoUrl && (
            <a
              className="lt-vlog"
              href={location.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {location.cover && (
                <span className="lt-vlog-thumb" aria-hidden>
                  <img src={location.cover.src} alt="" draggable={false} />
                </span>
              )}
              <span className="lt-vlog-text">
                <span className="lt-vlog-title">Watch the vlog</span>
                <span className="lt-vlog-sub">YouTube ↗</span>
              </span>
            </a>
          )}
          {showModes && (
            <div className="lt-modes" role="group" aria-label="Arrange photos">
              <button
                type="button"
                className={mode === "scatter" ? "is-on" : ""}
                onClick={scatter}
                title={mode === "scatter" ? "Toss them again" : undefined}
              >
                {mode === "scatter" ? "Re-scatter" : "Scatter"}
              </button>
              <button
                type="button"
                className={mode === "sheet" ? "is-on" : ""}
                onClick={() => setMode("sheet")}
              >
                Sheet
              </button>
            </div>
          )}
          <button type="button" className="tg-textbtn lt-close" onClick={onClose}>
            Close <kbd>esc</kbd>
          </button>
        </div>
      </header>

      <div className={`lt-table${mode === "sheet" ? " is-sheet" : ""}`} ref={tableRef}>
        <div className="lt-inner" style={{ height: innerHeight || "100%" }}>
          {layout.length > 0 &&
            items.map((item, i) => (
              <Print
                key={item.thumb}
                item={item}
                index={i}
                size={sizes[i]}
                target={layout[i]}
                origin={{
                  x: w / 2 - sizes[i].width / 2,
                  y: h / 2 - sizes[i].height / 2,
                  rotate: (i % 5) * 3 - 6,
                  scale: 0.9,
                }}
                z={zOrder[i] ?? (item.kind === "vlog" ? items.length : i)}
                draggable={mode === "scatter"}
                constraints={{
                  left: 0,
                  top: 0,
                  right: Math.max(0, w - sizes[i].width),
                  bottom: Math.max(0, h - sizes[i].height),
                }}
                onFront={bringToFront}
                onOpen={openItem}
              />
            ))}
        </div>
      </div>

      <footer className="lt-foot">
        <span className="tg-meta">
          {photoCount > 0
            ? `${photoCount} photos · ${isMobile ? "tap" : "click"} one to look closer${
                mode === "scatter" ? " · drag them around" : ""
              }`
            : "no photos yet, just the vlog"}
        </span>
        {nextLocation && (
          <button type="button" className="tg-textbtn" onClick={onNext}>
            Next: {nextLocation.name} <span aria-hidden>→</span>
          </button>
        )}
      </footer>

      <AnimatePresence>
        {viewerIndex !== null && (
          <Viewer
            photos={location.photos}
            index={viewerIndex}
            onIndex={setViewerIndex}
            onClose={() => setViewerIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
