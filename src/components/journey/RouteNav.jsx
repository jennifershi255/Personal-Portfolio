import { useEffect, useRef, useState } from "react";
import { sections, passenger } from "../../data/journey";
import { Moon, Plane } from "./Icons";

export default function RouteNav({ redEye, onToggleRedEye }) {
  const bar = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
      if (!els.length) return;
      const marker = window.scrollY + window.innerHeight * 0.35;
      const tops = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
      let i = 0;
      while (i < tops.length - 1 && marker >= tops[i + 1]) i += 1;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let p;
      if (atBottom) {
        i = tops.length - 1;
        p = 1;
      } else {
        const next = tops[i + 1] ?? tops[i] + 1;
        const frac = Math.min(1, Math.max(0, (marker - tops[i]) / (next - tops[i])));
        p = Math.min(1, (i + (i < tops.length - 1 ? frac : 0)) / (tops.length - 1));
      }
      bar.current?.style.setProperty("--p", p.toFixed(4));
      setActive((prev) => (prev === i ? prev : i));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="jn-nav" aria-label="Sections">
      <a className="jn-nav-brand" href="#check-in">
        {passenger.firstName} {passenger.lastName}
        <span>{passenger.flight}</span>
      </a>
      <div className="jn-nav-route" ref={bar}>
        <span className="jn-nav-line" aria-hidden />
        <span className="jn-nav-fill" aria-hidden />
        <span className="jn-nav-plane" aria-hidden>
          <Plane size={14} />
        </span>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id} style={{ "--x": i / (sections.length - 1) }}>
              <a
                href={`#${s.id}`}
                className={i === active ? "is-on" : i < active ? "is-past" : ""}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="jn-nav-dot" aria-hidden />
                <span className="jn-nav-label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className="jn-nav-end">
        <span className="jn-nav-current" aria-hidden>
          {sections[active].label}
        </span>
        <button
          type="button"
          className={`jn-redeye${redEye ? " is-on" : ""}`}
          onClick={onToggleRedEye}
          aria-pressed={redEye}
          title={redEye ? "Switch to day flight" : "Switch to red-eye (dark mode)"}
        >
          <Moon size={13} />
          Red Eye
          <span className="jn-redeye-switch" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
