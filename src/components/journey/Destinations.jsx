import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { passenger, projects } from "../../data/journey";
import { Arrow, Flip } from "./Icons";

const pad = (n) => String(n).padStart(2, "0");

function Postcard({ project, number, flipped, onFlip }) {
  const backId = `postcard-back-${project.id}`;
  const flipFromCard = (e) => {
    if (!e.target.closest("a")) onFlip();
  };

  return (
    <motion.article
      id={`postcard-${project.id}`}
      className={`jn-pc${flipped ? " is-flipped" : ""}${number % 2 === 0 ? " is-alt" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="jn-pc-info">
        <span className="jn-label">
          Destination {pad(number)} · {project.tagline}
        </span>
        <h3 className="jn-pc-name">{project.name}</h3>
        <p className="jn-pc-result">{project.result}</p>
        <span className="jn-chips">
          {project.stack.map((s) => (
            <span key={s} className="jn-chip">
              {s}
            </span>
          ))}
        </span>
        <div className="jn-pc-actions">
          {project.links.map((l) => (
            <a
              key={l.href}
              className="jn-btn is-solid"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label} <Arrow direction="up-right" />
            </a>
          ))}
          <button
            type="button"
            className="jn-btn"
            onClick={onFlip}
            aria-pressed={flipped}
            aria-controls={backId}
          >
            {flipped ? "Turn it back" : "Read the back"} <Flip />
          </button>
        </div>
      </div>

      <div className="jn-pc-card" onClick={flipFromCard}>
        <div className="jn-pc-inner">
          <div className="jn-pc-front" aria-hidden={flipped}>
            <span className="jn-pc-tape" aria-hidden />
            <div className="jn-pc-skin">
              {project.image && <img src={project.image} alt="" loading="lazy" />}
              <div className="jn-pc-greet">
                <span>Greetings from</span>
                <strong>{project.name}</strong>
              </div>
              <span className="jn-pc-stamp is-small" aria-hidden>
                <span>No.</span>
                <b>{pad(number)}</b>
              </span>
              <span className="jn-pc-hint" aria-hidden>
                <Flip size={12} /> Flip me
              </span>
            </div>
          </div>

          <div id={backId} className="jn-pc-back" aria-hidden={!flipped}>
            <span className="jn-pc-tape" aria-hidden />
            <div className="jn-pc-skin">
              <div className="jn-pc-note">
                <span className="jn-label">The problem</span>
                <p className="jn-pc-hand">{project.origin}</p>
                <span className="jn-label">What I built</span>
                <p className="jn-pc-hand">{project.destination}</p>
                <ul className="jn-pc-log">
                  {project.log.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="jn-pc-sign">Best regards, {passenger.firstName}</p>
              </div>

              <div className="jn-pc-side">
                <div className="jn-pc-marks">
                  <span className="jn-pc-postmark" aria-hidden>
                    <span>{passenger.flight}</span>
                    <span>No. {pad(number)}</span>
                  </span>
                  <span className="jn-pc-stamp">
                    {project.image && (
                      <img src={project.image} alt="" loading="lazy" />
                    )}
                    <span>{project.tagline}</span>
                  </span>
                </div>
                <dl className="jn-pc-address">
                  {project.flightTime && (
                    <div>
                      <dt>Flight time</dt>
                      <dd>{project.flightTime}</dd>
                    </div>
                  )}
                  {project.crew && (
                    <div>
                      <dt>Crew</dt>
                      <dd>{project.crew}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Class</dt>
                    <dd>{project.stack.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Gate</dt>
                    <dd>
                      {project.links.length
                        ? project.links.map((l) => (
                            <a
                              key={l.href}
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={flipped ? 0 : -1}
                            >
                              {l.label} ↗
                            </a>
                          ))
                        : "Private codebase"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Destinations({ openProject, onOpenProject }) {
  const [flipped, setFlipped] = useState(null);

  useEffect(() => {
    if (openProject) setFlipped(openProject);
  }, [openProject]);

  return (
    <section id="destinations" className="jn-section">
      <header className="jn-section-head">
        <p className="jn-kicker">Destinations</p>
        <h2 className="jn-h2">Projects</h2>
        <p className="jn-section-note">
          Postcards from every place I&rsquo;ve built. Flip one over for the
          full story.
        </p>
      </header>
      <div className="jn-pcs">
        {projects.map((p, i) => (
          <Postcard
            key={p.id}
            project={p}
            number={i + 1}
            flipped={flipped === p.id}
            onFlip={() => {
              const next = flipped === p.id ? null : p.id;
              setFlipped(next);
              onOpenProject?.(next);
            }}
          />
        ))}
      </div>
    </section>
  );
}
