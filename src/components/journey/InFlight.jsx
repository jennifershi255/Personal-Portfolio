import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playlist, sections } from "../../data/journey";
import { cabinAudio } from "./cabinAudio";
import { Close, Headphones, Next, Pause, Play, Prev, Speaker, Arrow } from "./Icons";

const LOOP_SECONDS = 16;
const pad = (n) => String(n).padStart(2, "0");
const clock = (s) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
const sectionLabel = (id) => sections.find((s) => s.id === id)?.label ?? "";

function Bars({ active }) {
  return (
    <span className={`jn-bars${active ? " is-on" : ""}`} aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

export default function InFlight({ onGoTo }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const track = playlist[index];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed(cabinAudio.elapsed), 250);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => cabinAudio.pause(), []);

  const playIndex = useCallback((i) => {
    setIndex(i);
    cabinAudio.play(playlist[i]);
    setPlaying(true);
    setElapsed(0);
  }, []);

  const toggle = () => {
    if (playing) {
      cabinAudio.pause();
      setPlaying(false);
    } else {
      playIndex(index);
    }
  };

  const toggleMute = () => {
    cabinAudio.setMuted(!muted);
    setMuted(!muted);
  };

  const step = (d) => {
    const i = (index + d + playlist.length) % playlist.length;
    if (playing) playIndex(i);
    else setIndex(i);
  };

  const goTo = () => {
    onGoTo(track);
    if (window.matchMedia("(max-width: 767px)").matches) setOpen(false);
  };

  const loop = (elapsed % LOOP_SECONDS) / LOOP_SECONDS;

  return (
    <>
      <div className="jn-ife-dock">
        {playing && !open && (
          <button
            type="button"
            className={`jn-ife-mute${muted ? " is-muted" : ""}`}
            onClick={toggleMute}
            aria-pressed={muted}
          >
            <Speaker size={16} muted={muted} />
            {muted ? "Muted" : "Sound on"}
          </button>
        )}
        <button
          type="button"
          className={`jn-ife-fab${open ? " is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="jn-ife-panel"
          aria-label="In-flight entertainment"
        >
          <Headphones size={24} />
          {playing && !muted && <Bars active />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="jn-ife-panel"
            className="jn-ife"
            role="dialog"
            aria-label="In-flight entertainment"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <header className="jn-ife-head">
              <div>
                <span className="jn-ife-kicker">In-flight entertainment</span>
                <span className="jn-ife-title">Flight JS 255 playlist</span>
              </div>
              <div className="jn-ife-head-actions">
                <button
                  type="button"
                  className={`jn-ife-sound${muted ? " is-muted" : ""}`}
                  onClick={toggleMute}
                  aria-pressed={muted}
                >
                  <Speaker size={16} muted={muted} />
                  {muted ? "Muted" : "Sound on"}
                </button>
                <button type="button" className="jn-ife-icon" onClick={() => setOpen(false)} aria-label="Close player">
                  <Close />
                </button>
              </div>
            </header>

            <div className="jn-ife-now">
              <div className="jn-ife-cover" style={{ "--c": track.color }} aria-hidden>
                <span>{track.code}</span>
                <i />
              </div>
              <div className="jn-ife-info">
                <span className="jn-ife-track">{track.title}</span>
                <span className="jn-ife-artist">Jennifer Shi · {sectionLabel(track.section)}</span>
                <p className="jn-ife-notes">{track.notes}</p>
                <button type="button" className="jn-ife-go" onClick={goTo}>
                  Go to {track.title} <Arrow />
                </button>
              </div>
            </div>

            <div className="jn-ife-progress">
              <span>{clock(elapsed)}</span>
              <span className="jn-ife-bar">
                <i style={{ transform: `scaleX(${playing ? loop : 0})` }} />
              </span>
              <span>loop</span>
            </div>

            <div className="jn-ife-controls">
              <button type="button" className="jn-ife-icon" onClick={() => step(-1)} aria-label="Previous track">
                <Prev />
              </button>
              <button type="button" className="jn-ife-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button type="button" className="jn-ife-icon" onClick={() => step(1)} aria-label="Next track">
                <Next />
              </button>
            </div>

            <ol className="jn-ife-list">
              {playlist.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={i === index ? "is-on" : ""}
                    onClick={() => (i === index ? toggle() : playIndex(i))}
                  >
                    <span className="jn-ife-num">
                      {i === index && playing ? <Bars active={!muted} /> : pad(i + 1)}
                    </span>
                    <span className="jn-ife-row">
                      <span>{t.title}</span>
                      <small>{sectionLabel(t.section)}</small>
                    </span>
                    <span className="jn-ife-code">{t.code}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="jn-ife-foot">Ambient loops generated in your browser. Silent until you press play.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
