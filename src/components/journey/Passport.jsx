import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { passenger, roles, specialEntries } from "../../data/journey";
import { cabinAudio } from "./cabinAudio";
import { Arrow, Plane } from "./Icons";
import { flyTo } from "./flyTo";

const tilt = (i) => [-9, 6, -4, 8, -6, 4, -11, 7][i % 8];
const pad = (n) => String(n).padStart(2, "0");
const FLIP_S = 0.85;
const STAGGER_S = 0.14;

const PAGES = [
  { id: "cover", label: "Cover" },
  { id: "identity", label: "Identity" },
  { id: "stamps", label: "Stamps" },
];

const useReducedMotion = () =>
  useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

function useIsSpread() {
  const query = "(min-width: 768px)";
  const [spread, setSpread] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setSpread(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return spread;
}

function Stamp({
  children,
  ink,
  shape,
  index,
  active,
  onLand,
  className = "",
}) {
  const reduced = useReducedMotion();
  const rotate = tilt(index);
  return (
    <motion.div
      className={`jn-stamp is-${shape} ${className}`}
      style={{ "--ink": ink }}
      initial="hidden"
      animate={active ? "landed" : "hidden"}
      variants={{
        hidden: reduced
          ? { opacity: 0.88, rotate }
          : { opacity: 0, scale: 1.9, rotate: rotate - 14 },
        landed: {
          opacity: 0.88,
          scale: 1,
          rotate,
          transition: reduced
            ? { duration: 0 }
            : {
                duration: 0.26,
                ease: [0.6, 0, 0.9, 0.4],
                delay: 0.45 + index * 0.12,
              },
        },
      }}
      onAnimationComplete={(name) => name === "landed" && !reduced && onLand()}
    >
      {children}
    </motion.div>
  );
}

function PageNo({ n }) {
  return (
    <span className="jn-pp-no" aria-hidden>
      {pad(n)}
    </span>
  );
}

function Cover() {
  return (
    <div className="jn-pp-cover">
      <span className="jn-pp-cover-kicker">Travel journal</span>
      <span className="jn-pp-cover-title">Passport</span>
      <svg className="jn-pp-crest" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="44" />
        <ellipse cx="60" cy="60" rx="18" ry="44" />
        <ellipse cx="60" cy="60" rx="34" ry="44" />
        <path d="M16 60h88M22 38h76M22 82h76" />
        <circle cx="60" cy="60" r="54" strokeDasharray="2 5" />
      </svg>
      <span className="jn-pp-cover-name">
        {passenger.firstName} {passenger.lastName}
      </span>
      <span className="jn-pp-cover-meta">Flight {passenger.flight}</span>
      <span className="jn-pp-chip" aria-hidden>
        <i />
      </span>
      <span className="jn-pp-cover-hint">
        Open passport <Arrow size={12} />
      </span>
    </div>
  );
}

function Identity() {
  return (
    <>
      <span className="jn-pp-page-title">Identity</span>
      <div className="jn-pp-id">
        <div className="jn-pp-photo">
          <img
            src={passenger.photo}
            alt={`${passenger.firstName} ${passenger.lastName}`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <dl className="jn-pp-fields">
          <dt>Surname</dt>
          <dd>{passenger.lastName}</dd>
          <dt>Given name</dt>
          <dd>{passenger.firstName}</dd>
          <dt>Program</dt>
          <dd>Computer Science &amp; Finance</dd>
          <dt>Issued by</dt>
          <dd>University of Waterloo</dd>
          <dt>Valid</dt>
          <dd>
            {passenger.departs} – {passenger.arrives}
          </dd>
          <dt>Off duty</dt>
          <dd>{passenger.hobbies}</dd>
        </dl>
      </div>
      <p className="jn-mrz" aria-hidden>
        P&lt;&lt;SHI&lt;&lt;JENNIFER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        <br />
        J286SHI&lt;&lt;CFM&lt;&lt;UWATERLOO&lt;&lt;2029&lt;&lt;&lt;&lt;
      </p>
      <PageNo n={1} />
    </>
  );
}

function Stamps({ active, onLand }) {
  return (
    <>
      <span className="jn-pp-page-title">Visas &amp; special entries</span>
      <div className="jn-stamps is-all">
        {roles.map((r, i) => (
          <Stamp
            key={r.id}
            ink={r.ink}
            shape={r.shape}
            index={i}
            active={active}
            onLand={onLand}
          >
            <span className="jn-stamp-top">Entry</span>
            <span className="jn-stamp-name">{r.company}</span>
            <span className="jn-stamp-role">{r.title}</span>
            <span className="jn-stamp-date">
              {r.start} – {r.end}
            </span>
          </Stamp>
        ))}
        {specialEntries.map((s, i) => (
          <Stamp
            key={s.label}
            ink={s.ink}
            shape={i % 2 ? "oval" : "circle"}
            index={roles.length + i}
            active={active}
            onLand={onLand}
          >
            <span className="jn-stamp-top">{s.note}</span>
            <span className="jn-stamp-name">{s.label}</span>
          </Stamp>
        ))}
      </div>
      <PageNo n={2} />
    </>
  );
}

export default function Passport() {
  const shake = useAnimationControls();
  const reduced = useReducedMotion();
  const spread = useIsSpread();
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState({ from: 0, to: 0, id: 0 });
  const [seen, setSeen] = useState(() => new Set());
  const pointer = useRef(null);
  const swipedAt = useRef(0);

  // Desktop pairs pages back-to-back on leaves; mobile turns one single-sided page at a time.
  const leaves = useMemo(() => (spread ? [[0, 1]] : [[0], [1]]), [spread]);
  const toTurned = useCallback(
    (p) => (spread ? Math.floor((p + 1) / 2) : p),
    [spread],
  );
  const turned = toTurned(page);
  const maxTurned = leaves.length;

  const visible = useMemo(() => {
    if (!spread) return [page];
    return turned === 0 ? [0] : [2 * turned - 1, 2 * turned];
  }, [spread, page, turned]);

  useEffect(() => {
    setSeen((prev) => {
      if (visible.every((p) => prev.has(p))) return prev;
      const next = new Set(prev);
      visible.forEach((p) => next.add(p));
      return next;
    });
  }, [visible]);

  const goTo = useCallback(
    (p) => {
      const target = Math.max(0, Math.min(PAGES.length - 1, p));
      setFlip((f) => ({
        from: toTurned(page),
        to: toTurned(target),
        id: f.id + 1,
      }));
      setPage(target);
    },
    [page, toTurned],
  );

  const step = useCallback(
    (d) => {
      const nextTurned = Math.max(0, Math.min(maxTurned, turned + d));
      if (nextTurned === turned) return;
      goTo(spread ? 2 * nextTurned : nextTurned);
    },
    [turned, maxTurned, spread, goTo],
  );

  const land = useCallback(() => {
    shake.start({
      x: [0, -2, 2, -1, 0],
      y: [0, 2, -1, 1, 0],
      transition: { duration: 0.22 },
    });
    cabinAudio.thunk();
  }, [shake]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const onPointerDown = (e) => {
    pointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipedAt.current = Date.now();
      step(dx < 0 ? 1 : -1);
    }
  };

  const onLeafClick = (e, isTurned) => {
    if (e.target.closest("a, button") || Date.now() - swipedAt.current < 400)
      return;
    step(isTurned ? -1 : 1);
  };

  const render = (p) => {
    switch (PAGES[p].id) {
      case "cover":
        return <Cover />;
      case "identity":
        return <Identity />;
      default:
        return <Stamps active={seen.has(p)} onLand={land} />;
    }
  };

  const forward = flip.to > flip.from;
  const lo = Math.min(flip.from, flip.to);
  const hi = Math.max(flip.from, flip.to);
  const N = leaves.length;

  const spreadLabel = visible.map((p) => PAGES[p].label).join(" · ");
  const hiddenProps = (p) =>
    visible.includes(p) ? {} : { "aria-hidden": true, inert: "" };

  return (
    <section id="passport" className="jn-section">
      <header className="jn-section-head">
        <p className="jn-kicker">Passport</p>
        <h2 className="jn-h2">About</h2>
        <p className="jn-section-note">My life in a passport.</p>
      </header>

      <div
        className={`jn-book${turned > 0 ? " is-open" : ""}${spread ? " is-spread" : ""}`}
        tabIndex={0}
        role="group"
        aria-roledescription="passport"
        aria-label={`Passport, ${spreadLabel}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <motion.div className="jn-book-stage" animate={shake}>
          <div className="jn-book-slide">
            <span className="jn-book-board" aria-hidden />
            <div className="jn-book-pages">
              <div
                className="jn-pp-page is-front is-stamps"
                {...hiddenProps(PAGES.length - 1)}
              >
                {render(PAGES.length - 1)}
              </div>
              {leaves.map(([front, back], i) => {
                const isTurned = i < turned;
                const ahead = !spread && front !== page;
                const moving = i >= lo && i < hi;
                const order = forward ? i - lo : hi - 1 - i;
                const restZ = isTurned ? i + 1 : N - i;
                const zIndex = moving
                  ? forward
                    ? [200 - i, 200 - i, 200 + i, 200 + i, restZ]
                    : [200 + i, 200 + i, 200 - i, 200 - i, restZ]
                  : restZ;
                const timing = reduced
                  ? { duration: 0 }
                  : {
                      duration: FLIP_S,
                      delay: moving ? order * STAGGER_S : 0,
                      ease: [0.55, 0.05, 0.3, 1],
                    };
                return (
                  <motion.div
                    key={`${spread}-${i}`}
                    className={`jn-leaf${isTurned ? " is-turned" : ""}${ahead ? " is-ahead" : ""}`}
                    initial={false}
                    animate={spread ? { rotateY: isTurned ? -180 : 0, zIndex } : undefined}
                    style={spread ? undefined : { zIndex: restZ }}
                    transition={
                      spread
                        ? {
                            rotateY: timing,
                            zIndex: {
                              ...timing,
                              times: [0, 0.5, 0.501, 0.999, 1],
                              ease: "linear",
                            },
                          }
                        : { duration: 0 }
                    }
                    onClick={(e) => onLeafClick(e, isTurned)}
                  >
                    <div
                      className={`jn-pp-page is-front${front === 0 ? " is-cover" : ""}`}
                      {...hiddenProps(front)}
                    >
                      {render(front)}
                    </div>
                    {back !== undefined && (
                      <div
                        className="jn-pp-page is-back"
                        {...hiddenProps(back)}
                      >
                        {render(back)}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="jn-book-controls">
        <button
          type="button"
          className="jn-book-btn"
          onClick={() => step(-1)}
          disabled={turned === 0}
        >
          <Arrow size={14} direction="left" />
          <span>Back</span>
        </button>
        <span className="jn-book-status" aria-live="polite">
          <Plane size={12} />
          {spreadLabel}
        </span>
        <button
          type="button"
          className="jn-book-btn"
          onClick={() => {
            if (turned < maxTurned) step(1);
            else if (reduced) document.getElementById("security")?.scrollIntoView();
            else flyTo("security");
          }}
        >
          <span>{turned === 0 ? "Open" : "Next"}</span>
          <Arrow size={14} />
        </button>
      </div>
    </section>
  );
}
