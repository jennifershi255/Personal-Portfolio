const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const Globe = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    <path d="M7.2 5.4c1.8 2.2 2.8 4.4 2.8 6.6s-1 4.4-2.8 6.6" />
    <path d="M16.8 5.4C15 7.6 14 9.8 14 12s1 4.4 2.8 6.6" />
  </svg>
);

export const Headphones = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
    <rect x="3" y="14" width="4.5" height="7" rx="1.6" />
    <rect x="16.5" y="14" width="4.5" height="7" rx="1.6" />
  </svg>
);

export const Moon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

export const Plane = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M21.5 11.2 14 7.6V3.5a1.5 1.5 0 0 0-3 0v4.1L3.5 11.2a.8.8 0 0 0-.5.8v1.1c0 .5.5.9 1 .7l7-2.1v4.6l-2 1.5a.7.7 0 0 0-.3.6v.9c0 .4.4.7.8.6l3-.9 3 .9c.4.1.8-.2.8-.6v-.9a.7.7 0 0 0-.3-.6l-2-1.5v-4.6l7 2.1c.5.2 1-.2 1-.7V12a.8.8 0 0 0-.5-.8Z"
    />
  </svg>
);

export const Pin = ({ size = 28 }) => (
  <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 24 32" aria-hidden>
    <path
      fill="currentColor"
      d="M12 0C5.9 0 1 5 1 11.2 1 19.4 12 32 12 32s11-12.6 11-20.8C23 5 18.1 0 12 0Z"
    />
    <circle cx="12" cy="11.2" r="4.2" fill="var(--paper)" />
  </svg>
);

export const Play = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5Z" />
  </svg>
);

export const Pause = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <rect fill="currentColor" x="6" y="5" width="4" height="14" rx="1" />
    <rect fill="currentColor" x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export const Prev = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M18 6.2v11.6a.9.9 0 0 1-1.4.7L9 13a1.2 1.2 0 0 1 0-2l7.6-5.5a.9.9 0 0 1 1.4.7Z" />
    <rect fill="currentColor" x="5" y="5.5" width="2.4" height="13" rx="1" />
  </svg>
);

export const Next = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ transform: "scaleX(-1)" }}>
    <path fill="currentColor" d="M18 6.2v11.6a.9.9 0 0 1-1.4.7L9 13a1.2 1.2 0 0 1 0-2l7.6-5.5a.9.9 0 0 1 1.4.7Z" />
    <rect fill="currentColor" x="5" y="5.5" width="2.4" height="13" rx="1" />
  </svg>
);

export const Speaker = ({ size = 18, muted = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
    {muted ? (
      <path d="m16 9.5 5 5m0-5-5 5" />
    ) : (
      <>
        <path d="M15.5 9a4 4 0 0 1 0 6" />
        <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
      </>
    )}
  </svg>
);

export const Shuffle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 7h4l8 10h4" />
    <path d="m18 15 2 2-2 2" />
    <path d="M4 17h3.5L10 14" />
    <path d="M14 10 16 7h4" />
    <path d="m18 5 2 2-2 2" />
  </svg>
);

export const Close = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const Flip = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 10a8 8 0 0 1 14-4.5L20 8" />
    <path d="M20 3v5h-5" />
    <path d="M20 14a8 8 0 0 1-14 4.5L4 16" />
    <path d="M4 21v-5h5" />
  </svg>
);

export const Arrow = ({ size = 14, direction = "right" }) => {
  const rotate = { right: 0, down: 90, left: 180, up: -90, "up-right": -45 }[direction];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
};
