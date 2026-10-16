import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue } from "framer-motion";
import { contact, passenger } from "../../data/journey";
import { Arrow } from "./Icons";

const tags = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, code: "EML", copy: true, shell: "#2f4a73" },
  { label: "LinkedIn", value: "in/jennifershi255", href: contact.linkedin, code: "LIN", shell: "#c8553d" },
  { label: "GitHub", value: "jennifershi255", href: contact.github, code: "GIT", shell: "#d6a03f" },
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
    <div className="jn-case">
      <motion.div
        className="jn-case-body"
        style={{ rotate, "--shell": tag.shell }}
        onHoverStart={() => swing(sway)}
        onHoverEnd={() => swing(0)}
        onPanStart={() => {
          panned.current = true;
        }}
        onPan={(_, info) => rotate.set(clamp(-info.offset.x / 9, -10, 10))}
        onPanEnd={(_, info) => {
          swing(0, -info.velocity.x / 9);
          setTimeout(() => {
            panned.current = false;
          }, 0);
        }}
      >
        <span className="jn-case-handle" aria-hidden />
        <span className="jn-case-latches" aria-hidden />
        <span className="jn-case-wheels" aria-hidden />
        <div className="jn-tag">
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
        </div>
      </motion.div>
    </div>
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
        <p className="jn-section-note">
          Let&rsquo;s plan the next trip together. Need some inspo?{" "}
          <Link className="jn-note-link" to="/travel">
            Check out where I&rsquo;ve been before
            <Arrow />
          </Link>
        </p>
      </header>

      <div className="jn-belt">
        <span className="jn-belt-rail" aria-hidden />
        <div className="jn-tags">
          {tags.map((t, i) => (
            <Tag key={t.label} tag={t} sway={[-2.5, 2, -1.5][i]} />
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
