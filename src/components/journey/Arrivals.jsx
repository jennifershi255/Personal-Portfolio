import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue } from "framer-motion";
import { contact, passenger, souvenirs } from "../../data/journey";
import { Arrow } from "./Icons";

export function OffDuty() {
  return (
    <section className="jn-section jn-offduty" aria-labelledby="offduty-title">
      <div className="jn-postcard">
        <div className="jn-postcard-text">
          <p className="jn-kicker">Off duty</p>
          <h2 id="offduty-title" className="jn-h3">The actual trips</h2>
          <p>
            Photos from Italy, New York, Spain and Montreal, pinned on a globe. Plus a couple of vlogs.
          </p>
          <Link className="jn-btn is-solid" to="/travel">
            Open the globe <Arrow />
          </Link>
        </div>
        <div className="jn-postcard-photos">
          {souvenirs.map((s, i) => (
            <a
              key={s.name}
              className="jn-postcard-photo"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ "--r": `${i ? 4 : -5}deg` }}
            >
              <img src={s.image} alt="" loading="lazy" />
              <span>{s.name} vlog ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const tags = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, code: "EML", copy: true },
  { label: "LinkedIn", value: "in/jennifershi255", href: contact.linkedin, code: "LIN" },
  { label: "GitHub", value: "jennifershi255", href: contact.github, code: "GIT" },
];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function Tag({ tag, sway }) {
  const rotate = useMotionValue(0);
  const panned = useRef(false);
  const [copied, setCopied] = useState(false);
  const external = !tag.href.startsWith("mailto");

  const swing = (to, velocity = 0) =>
    animate(rotate, to, { type: "spring", stiffness: 140, damping: 6, velocity });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tag.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = tag.href;
    }
  };

  return (
    <motion.div
      className="jn-tag"
      style={{ rotate }}
      onHoverStart={() => swing(sway)}
      onHoverEnd={() => swing(0)}
      onPanStart={() => {
        panned.current = true;
      }}
      onPan={(_, info) => rotate.set(clamp(-info.offset.x / 5, -28, 28))}
      onPanEnd={(_, info) => {
        swing(0, -info.velocity.x / 5);
        setTimeout(() => {
          panned.current = false;
        }, 0);
      }}
    >
      <span className="jn-tag-hole" aria-hidden />
      <span className="jn-tag-code">{tag.code}</span>
      <span className="jn-tag-label">{tag.label}</span>
      <span className="jn-tag-value">{tag.value}</span>
      <span className="jn-tag-actions">
        <a
          className="jn-tag-go"
          href={tag.href}
          target={external ? "_blank" : undefined}
          rel="noopener noreferrer"
          draggable={false}
          onClick={(e) => panned.current && e.preventDefault()}
        >
          Claim <Arrow direction="up-right" />
        </a>
        {tag.copy && (
          <button type="button" className="jn-tag-copy" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </span>
    </motion.div>
  );
}

export default function Arrivals() {
  return (
    <section id="arrivals" className="jn-section jn-arrivals">
      <header className="jn-section-head">
        <p className="jn-kicker">Arrivals · Belt 1</p>
        <h2 className="jn-h2">
          Welcome to {passenger.firstName}&rsquo;s city.
        </h2>
        <p className="jn-section-note">Let&rsquo;s plan the next trip together.</p>
      </header>

      <div className="jn-belt">
        <span className="jn-belt-rail" aria-hidden />
        <div className="jn-tags">
          {tags.map((t, i) => (
            <Tag key={t.label} tag={t} sway={[-3, 2.5, -2][i]} />
          ))}
        </div>
      </div>

      <footer className="jn-footer">
        <span>
          {passenger.firstName} {passenger.lastName} · Flight {passenger.flight}
        </span>
        <span>Thanks for flying with me.</span>
      </footer>
    </section>
  );
}
