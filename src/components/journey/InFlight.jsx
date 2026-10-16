import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { playlist, playlistCover } from "../../data/journey";
import { cabinAudio } from "./cabinAudio";
import { Close, Globe, Headphones, Next, Pause, Play, Prev, Shuffle, Speaker } from "./Icons";

const TILES = [
  "#e8452c",
  "#2f6b4f",
  "#2a4b8d",
  "#b8862b",
  "#6a3d8f",
  "#c8553d",
];
const pad = (n) => String(n).padStart(2, "0");
const clock = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
};

function Art({ src, title, color }) {
  if (src) return <img src={src} alt="" draggable="false" />;
  return (
    <span className="jn-ife-fallback" style={{ background: color }} aria-hidden>
      {(title || "?").charAt(0)}
    </span>
  );
}

function randomIndex(avoid = -1) {
  if (playlist.length <= 1) return 0;
  let i = Math.floor(Math.random() * playlist.length);
  if (i === avoid) i = (i + 1) % playlist.length;
  return i;
}

function resolveSrc(song) {
  if (song.src) return Promise.resolve(song.src);
  if (!song.deezerId) return Promise.resolve("");
  return new Promise((resolve) => {
    const cb = `jnDz${Date.now()}${Math.floor(Math.random() * 1e4)}`;
    const script = document.createElement("script");
    const done = (url) => {
      delete window[cb];
      script.remove();
      resolve(url || "");
    };
    window[cb] = (data) => done(data?.preview);
    script.src = `https://api.deezer.com/track/${song.deezerId}?output=jsonp&callback=${cb}`;
    script.onerror = () => done("");
    document.head.appendChild(script);
  });
}

function Bars({ active }) {
  return (
    <span className={`jn-bars${active ? " is-on" : ""}`} aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

export default function InFlight() {
  const audioRef = useRef(null);
  const indexRef = useRef(0);
  const mutedRef = useRef(false);
  const shuffleRef = useRef(false);
  const playGen = useRef(0);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(playlist[0]?.duration ?? 0);
  const track = playlist[index];
  const listed = playlist.length;
  const total = playlist.reduce((sum, t) => sum + (t.duration || 0), 0);

  const playIndex = useCallback(async (i, auto = true) => {
    const next = (i + playlist.length) % playlist.length;
    const song = playlist[next];
    const audio = audioRef.current;
    const gen = ++playGen.current;
    indexRef.current = next;
    setIndex(next);
    setElapsed(0);
    setDuration(song.duration || 0);
    const src = await resolveSrc(song);
    if (gen !== playGen.current) return;
    if (!src || !audio) {
      audio?.pause();
      setPlaying(false);
      cabinAudio.setPlaying(false);
      return;
    }
    audio.src = src;
    audio.muted = mutedRef.current;
    if (!auto) {
      setPlaying(false);
      cabinAudio.setPlaying(false);
      return;
    }
    try {
      await audio.play();
      if (gen !== playGen.current) return;
      setPlaying(true);
      cabinAudio.setPlaying(true);
    } catch {
      if (gen !== playGen.current) return;
      setPlaying(false);
      cabinAudio.setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onTime = () => setElapsed(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0)
        setDuration(audio.duration);
    };
    const onEnded = () => {
      const i = shuffleRef.current ? randomIndex(indexRef.current) : indexRef.current + 1;
      playIndex(i);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      cabinAudio.setPlaying(false);
    },
    [],
  );

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) {
      audio?.pause();
      setPlaying(false);
      cabinAudio.setPlaying(false);
      return;
    }
    if (audio?.src && audio.currentTime > 0.4 && !audio.ended) {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          cabinAudio.setPlaying(true);
        })
        .catch(() => setPlaying(false));
      return;
    }
    playIndex(shuffleRef.current ? randomIndex() : index);
  };

  const toggleShuffle = () => {
    const next = !shuffle;
    shuffleRef.current = next;
    setShuffle(next);
  };

  const toggleMute = () => {
    const next = !muted;
    mutedRef.current = next;
    if (audioRef.current) audioRef.current.muted = next;
    setMuted(next);
    cabinAudio.setMuted(next);
  };

  const step = (d) => {
    if (shuffleRef.current) playIndex(randomIndex(index), playing);
    else playIndex(index + d, playing);
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const length = audio?.duration || duration;
    if (!audio?.src || !length) return;
    const box = e.currentTarget.getBoundingClientRect();
    const next = ((e.clientX - box.left) / box.width) * length;
    audio.currentTime = next;
    setElapsed(next);
  };


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
        <Link className="jn-ife-fab" to="/travel" aria-label="Travel globe">
          <Globe size={24} />
        </Link>
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
            aria-label="Cabin playlist"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <header className="jn-ife-head">
              <div>
                <span className="jn-ife-kicker">In-flight entertainment</span>
                <span className="jn-ife-title">Jennifer's playlist</span>
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
                <button
                  type="button"
                  className="jn-ife-icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close player"
                >
                  <Close />
                </button>
              </div>
            </header>

            <div className="jn-ife-hero">
              <div className="jn-ife-cover" aria-hidden>
                <img src={playlistCover} alt="" draggable="false" />
              </div>
              <div className="jn-ife-hero-copy">
                <span className="jn-ife-hero-name">current favs</span>
                <span className="jn-ife-hero-by">🤍</span>
                <span className="jn-ife-hero-meta">
                  {listed} song{listed === 1 ? "" : "s"}
                  {total ? ` · ${clock(total)}` : ""}
                </span>
              </div>
              <div className="jn-ife-hero-actions">
                <button
                  type="button"
                  className={`jn-ife-shuffle${shuffle ? " is-on" : ""}`}
                  onClick={toggleShuffle}
                  aria-pressed={shuffle}
                  aria-label={shuffle ? "Turn shuffle off" : "Turn shuffle on"}
                >
                  <Shuffle size={15} />
                </button>
                <button
                  type="button"
                  className="jn-ife-play"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
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
                      {i === index && playing ? (
                        <Bars active={!muted} />
                      ) : (
                        pad(i + 1)
                      )}
                    </span>
                    <span className="jn-ife-thumb">
                      <Art
                        src={t.artwork}
                        title={t.title}
                        color={TILES[i % TILES.length]}
                      />
                    </span>
                    <span className="jn-ife-row">
                      <span>{t.title}</span>
                      <small>{t.artist}</small>
                    </span>
                    <span className="jn-ife-time">{clock(t.duration)}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="jn-ife-now">
              <span className="jn-ife-thumb">
                <Art
                  src={track.artwork}
                  title={track.title}
                  color={TILES[index % TILES.length]}
                />
              </span>
              <span className="jn-ife-row">
                <span>{track.title}</span>
                <small>{track.artist}</small>
              </span>
              <div className="jn-ife-controls">
                <button
                  type="button"
                  className="jn-ife-icon"
                  onClick={() => step(-1)}
                  aria-label="Previous track"
                >
                  <Prev />
                </button>
                <button
                  type="button"
                  className="jn-ife-play is-small"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  type="button"
                  className="jn-ife-icon"
                  onClick={() => step(1)}
                  aria-label="Next track"
                >
                  <Next />
                </button>
              </div>
              <div className="jn-ife-progress">
                <span>{clock(elapsed)}</span>
                <button
                  type="button"
                  className="jn-ife-bar"
                  onClick={seek}
                  aria-label="Seek"
                >
                  <i
                    style={{
                      transform: `scaleX(${duration ? Math.min(1, elapsed / duration) : 0})`,
                    }}
                  />
                </button>
                <span>{clock(duration)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
