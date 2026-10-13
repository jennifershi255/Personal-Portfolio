import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Globe from "./components/travel/Globe";
import LightTable from "./components/travel/LightTable";
import { locations, formatCoords } from "./data/travel";
import "./css/Travel.css";

const pad = (n) => String(n).padStart(2, "0");

function useIsMobile() {
  const query = "(max-width: 767px)";
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const TravelPage = () => {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(null);
  const [focus, setFocus] = useState(null);
  const [open, setOpen] = useState(null);

  const select = useCallback((location) => {
    setHovered(null);
    document.body.style.cursor = "";
    setFocus(location);
  }, []);

  const handleArrive = useCallback((location) => setOpen(location), []);

  const close = useCallback(() => {
    setOpen(null);
    setFocus(null);
  }, []);

  const openIndex = open ? locations.findIndex((l) => l.id === open.id) : -1;
  const nextLocation = open ? locations[(openIndex + 1) % locations.length] : null;

  const goNext = useCallback(() => {
    setOpen(null);
    setFocus(nextLocation);
  }, [nextLocation]);

  const photoTotal = locations.reduce((sum, l) => sum + l.photos.length, 0);

  return (
    <div className="tg">
      <div className="tg-canvas" aria-hidden={!!open}>
        <Globe
          locations={locations}
          hovered={hovered}
          focus={focus}
          paused={!!open}
          isMobile={isMobile}
          onHover={setHovered}
          onSelect={select}
          onArrive={handleArrive}
        />
      </div>

      <header className="tg-top">
        <Link to="/" className="tg-textbtn">
          <span aria-hidden>←</span> Home
        </Link>
        <span className="tg-meta tg-top-hint">
          {isMobile ? "drag to spin · pinch to zoom" : "drag to spin · scroll to zoom"}
        </span>
      </header>

      <div className={`tg-intro${focus ? " is-dim" : ""}`}>
        <p className="tg-meta">
          travel log &nbsp;/&nbsp; {pad(locations.length)} places, {photoTotal} photos
        </p>
        <h1 className="tg-title">
          jennifer&rsquo;s <em>globe</em>
        </h1>
      </div>

      <nav className={`tg-index${focus ? " is-dim" : ""}`} aria-label="Places">
        <ol>
          {locations.map((loc, i) => (
            <li key={loc.id}>
              <button
                type="button"
                className={hovered === loc.id ? "is-on" : ""}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(loc.id)}
                onBlur={() => setHovered(null)}
                onClick={() => select(loc)}
              >
                <span className="tg-index-num">{pad(i + 1)}</span>
                <span className="tg-index-name">{loc.name}</span>
                <span className="tg-index-meta">
                  <span>
                    {loc.photos.length > 0 && `${loc.photos.length} photos`}
                    {loc.photos.length > 0 && loc.videoUrl && " · "}
                    {loc.videoUrl && <span className="tg-index-vlog">vlog</span>}
                  </span>
                  <span className="tg-index-coords">{formatCoords(loc)}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence>
        {open && (
          <LightTable
            key={open.id}
            location={open}
            number={openIndex + 1}
            nextLocation={nextLocation}
            isMobile={isMobile}
            onClose={close}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelPage;
