export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function targetScrollFor(root, target) {
  const navH = parseFloat(getComputedStyle(root).getPropertyValue("--nav-h")) || 56;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return clamp(target.getBoundingClientRect().top + window.scrollY - navH, 0, maxScroll);
}

// Smoothly scrolls to a section; the flight trail draws itself because it follows the scroll position.
export function flyTo(targetId, onArrive) {
  const root = document.querySelector(".jn");
  const target = document.getElementById(targetId);
  if (!root || !target) {
    document.getElementById(targetId)?.scrollIntoView();
    return;
  }
  const from = window.scrollY;
  const to = targetScrollFor(root, target);
  if (Math.abs(to - from) < 2) {
    onArrive?.();
    return;
  }
  const duration = clamp(Math.abs(to - from) * 1.8, 900, 2200);
  const t0 = performance.now();
  let raf;

  const detach = () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    detach();
  };
  const onWheel = (e) => {
    // Trackpad clicks often emit a tiny wheel blip; ignore those so the fly doesn't abort.
    if (performance.now() - t0 < 280) return;
    if (Math.abs(e.deltaY) + Math.abs(e.deltaX) < 8) return;
    stop();
  };
  const frame = (now) => {
    const t = clamp((now - t0) / duration, 0, 1);
    window.scrollTo({ top: from + (to - from) * ease(t), behavior: "instant" });
    if (t < 1) raf = requestAnimationFrame(frame);
    else {
      stop();
      onArrive?.();
    }
  };
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  raf = requestAnimationFrame(frame);
}
