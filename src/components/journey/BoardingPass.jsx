import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { passenger, contact } from "../../data/journey";
import { Arrow, Plane } from "./Icons";
import FlightPath from "./FlightPath";
import { flyTo } from "./flyTo";

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ+&·";

const usePrefersReducedMotion = () =>
  useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

function Flap({ target, delay }) {
  const [char, setChar] = useState(target);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (char === target) return;
    let current = FLAP_CHARS.indexOf(char);
    const goal = FLAP_CHARS.indexOf(target);
    let steps = 0;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        current = (current + 1) % FLAP_CHARS.length;
        steps += 1;
        // Cap the spin so long cycles don't drag; jump to the goal after a few flips.
        if (steps > 7) current = goal;
        setChar(FLAP_CHARS[current]);
        setTick((t) => t + 1);
        if (current === goal) clearInterval(interval);
      }, 55);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <span className="jn-flap" data-tick={tick % 2}>
      <span key={tick}>{char === " " ? "\u00a0" : char}</span>
    </span>
  );
}

function DepartureBoard({ words }) {
  const reduced = usePrefersReducedMotion();
  const length = Math.max(...words.map((w) => w.length));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 3200);
    return () => clearInterval(id);
  }, [reduced, words.length]);

  const text = words[index].toUpperCase().padEnd(length, " ");

  return (
    <div className="jn-board" aria-label={`Roles: ${words.join(", ")}`}>
      <span className="jn-board-label" aria-hidden>
        Now boarding
      </span>
      <span className="jn-board-row" aria-hidden>
        {[...text].map((c, i) => (
          <Flap key={i} target={FLAP_CHARS.includes(c) ? c : " "} delay={i * 28} />
        ))}
      </span>
    </div>
  );
}

const GREETINGS = ["Welcome aboard.", "Bienvenue à bord."];

function Typewriter({ phrases }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(phrases[0].length);
  const [deleting, setDeleting] = useState(false);
  const phrase = phrases[index];

  useEffect(() => {
    if (reduced) return;
    let delay;
    if (!deleting && count === phrase.length) delay = 2600;
    else if (deleting && count === 0) delay = 380;
    else delay = deleting ? 38 : 85 + Math.random() * 60;

    const id = setTimeout(() => {
      if (!deleting && count === phrase.length) setDeleting(true);
      else if (deleting && count === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else setCount((c) => c + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(id);
  }, [count, deleting, phrase.length, phrases.length, reduced]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <em className="jn-type" aria-hidden>
      <span className="jn-type-sizer">{longest}</span>
      <span className="jn-type-text">
        {phrase.slice(0, count)}
        {!reduced && <i className={`jn-type-caret${deleting || count < phrase.length ? " is-busy" : ""}`} />}
      </span>
    </em>
  );
}

function Barcode({ seed = "jennifershi255" }) {
  const bars = useMemo(() => {
    const out = [];
    for (let i = 0; i < 46; i++) {
      const c = seed.charCodeAt(i % seed.length);
      out.push(1 + ((c * (i + 3)) % 3));
    }
    return out;
  }, [seed]);
  return (
    <span className="jn-barcode" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, marginRight: (i * 7) % 3 === 0 ? 3 : 2 }} />
      ))}
    </span>
  );
}

export default function BoardingPass() {
  const reduced = usePrefersReducedMotion();
  const canHover = useMemo(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches, []);
  const ref = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 16 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 16 });
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);

  const tilt = canHover && !reduced;

  const { scrollY } = useScroll();
  const tearRange = Math.max(320, window.innerHeight * 0.6);
  const tear = useTransform(scrollY, [0, tearRange], [0, 1], { clamp: true });
  const peel = useTransform(tear, [0, 0.55, 1], [0, 0.4, 1]);
  const [torn, setTorn] = useState(false);

  useLayoutEffect(() => {
    scrollY.set(window.scrollY);
  }, [scrollY]);

  useMotionValueEvent(tear, "change", (v) => setTorn(!reduced && v > 0.004));
  const stubStyle = reduced ? undefined : { "--jn-peel": peel };

  const fly = (e) => {
    if (reduced) return;
    e.preventDefault();
    flyTo("passport", () => history.replaceState(null, "", "#passport"));
  };

  const onMove = (e) => {
    if (!tilt) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section id="check-in" className="jn-section jn-checkin">
      <div className="jn-checkin-head">
        <p className="jn-kicker">Check-in · Gate open</p>
        <h1 className="jn-hello" aria-label={`Hi, I'm ${passenger.firstName}. ${GREETINGS[0]}`}>
          <span aria-hidden>Hi, I&rsquo;m {passenger.firstName}.</span> <Typewriter phrases={GREETINGS} />
        </h1>
        <p className="jn-lede">{passenger.intro}</p>
      </div>

      <div className="jn-pass-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
        <motion.article
          ref={ref}
          className={`jn-pass${torn ? " is-torn" : ""}`}
          style={tilt && !torn ? { rotateX, rotateY } : undefined}
          initial={reduced ? false : { y: 40, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.15 }}
          aria-label="Boarding pass"
        >
          {tilt && <motion.span className="jn-pass-glare" style={{ "--gx": glareX }} aria-hidden />}

          <div className="jn-pass-main">
            <header className="jn-pass-top">
              <span className="jn-pass-airline">
                <Plane size={14} /> Boarding pass
              </span>
              <span className="jn-pass-flight">Flight {passenger.flight}</span>
            </header>

            <div className="jn-field">
              <span className="jn-label">Passenger</span>
              <span className="jn-value jn-value-lg">
                {passenger.lastName.toUpperCase()} / {passenger.firstName.toUpperCase()}
              </span>
            </div>

            <div className="jn-route">
              <div className="jn-route-end">
                <span className="jn-label">From</span>
                <span className="jn-code">{passenger.from.code}</span>
                <span className="jn-city">{passenger.from.city}</span>
                <span className="jn-sub">{passenger.from.detail}</span>
              </div>
              <div className="jn-route-line" aria-hidden>
                <span className="jn-route-dash" />
                <Plane size={18} />
                <span className="jn-route-dash" />
              </div>
              <div className="jn-route-end is-to">
                <span className="jn-label">To</span>
                <span className="jn-code">{passenger.to.code}</span>
                <span className="jn-city">{passenger.to.city}</span>
                <span className="jn-sub">{passenger.to.detail}</span>
              </div>
            </div>

            <DepartureBoard words={passenger.ticker} />

            <div className="jn-pass-grid">
              <div className="jn-field">
                <span className="jn-label">Departed</span>
                <span className="jn-value">{passenger.departs}</span>
              </div>
              <div className="jn-field">
                <span className="jn-label">Arrives</span>
                <span className="jn-value">{passenger.arrives}</span>
              </div>
              <div className="jn-field">
                <span className="jn-label">Seat</span>
                <span className="jn-value">
                  {passenger.seat} <small>({passenger.seatNote})</small>
                </span>
              </div>
            </div>
            <span className="jn-tear-edge" aria-hidden />
          </div>

          <motion.div className="jn-pass-stub" style={stubStyle}>
            <span className="jn-tear-edge" aria-hidden />
            <div className="jn-stub-fields">
              <div className="jn-field">
                <span className="jn-label">Passenger</span>
                <span className="jn-value">{passenger.firstName} {passenger.lastName}</span>
              </div>
              <div className="jn-field">
                <span className="jn-label">Seat</span>
                <span className="jn-value">{passenger.seat}</span>
              </div>
              <div className="jn-field">
                <span className="jn-label">Status</span>
                <span className="jn-value jn-status">
                  <i aria-hidden /> {passenger.boarding}
                </span>
              </div>
            </div>
            <div className="jn-stub-actions">
              <div className="jn-stub-btns">
                <Link className="jn-btn" to="/travel">
                  Where I&rsquo;ve been <Arrow />
                </Link>
                <a className="jn-btn is-solid" href="#passport" onClick={fly}>
                  Where to next <Arrow direction="down" />
                </a>
              </div>
              <div className="jn-stub-links">
                <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={`mailto:${contact.email}`}>Email</a>
              </div>
            </div>
            <Barcode />
          </motion.div>
        </motion.article>
      </div>

      {!reduced && (
        <FlightPath fromSelector=".jn-pass" stopoverId="passport" landingSelector=".jn-pp-page.is-cover" />
      )}
    </section>
  );
}
