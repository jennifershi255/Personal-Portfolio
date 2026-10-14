import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../../data/journey";
import { Arrow } from "./Icons";

const pad = (n) => String(n).padStart(2, "0");

function Ticket({ project, number, open, onToggle }) {
  return (
    <motion.article
      id={`ticket-${project.id}`}
      className={`jn-ticket${open ? " is-open" : ""}`}
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="jn-ticket-main">
        <div className="jn-ticket-top">
          <span className="jn-label">Destination {pad(number)}</span>
          <span className="jn-label">{project.tagline}</span>
        </div>
        <h3 className="jn-ticket-name">{project.name}</h3>
        <p className="jn-ticket-result">{project.result}</p>

        <div className="jn-ticket-meta">
          <div className="jn-field">
            <span className="jn-label">Class</span>
            <span className="jn-chips">
              {project.stack.map((s) => (
                <span key={s} className="jn-chip">
                  {s}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="jn-ticket-actions">
          {project.links.map((l) => (
            <a key={l.href} className="jn-btn is-solid" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <Arrow direction="up-right" />
            </a>
          ))}
          <button
            type="button"
            className="jn-btn"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`entry-${project.id}`}
          >
            {open ? "Close entry" : "Open travel entry"}
          </button>
        </div>
      </div>

      <div className="jn-ticket-stub" aria-hidden={!project.image}>
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" />
        ) : (
          <span className="jn-ticket-code">{project.name.slice(0, 3).toUpperCase()}</span>
        )}
        <span className="jn-ticket-no">No. {pad(number)}</span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`entry-${project.id}`}
            className="jn-entry"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="jn-entry-inner">
              <div className="jn-entry-route">
                <div>
                  <span className="jn-label">Origin · the problem</span>
                  <p>{project.origin}</p>
                </div>
                <Arrow size={20} />
                <div>
                  <span className="jn-label">Destination · the outcome</span>
                  <p>{project.destination}</p>
                </div>
              </div>
              <div className="jn-entry-cols">
                <div>
                  <span className="jn-label">Flight log</span>
                  <ul>
                    {project.log.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <dl className="jn-entry-facts">
                  {project.flightTime && (
                    <>
                      <dt>Flight time</dt>
                      <dd>{project.flightTime}</dd>
                    </>
                  )}
                  {project.crew && (
                    <>
                      <dt>Crew</dt>
                      <dd>{project.crew}</dd>
                    </>
                  )}
                  <dt>Class</dt>
                  <dd>{project.stack.join(", ")}</dd>
                  <dt>Gate</dt>
                  <dd>
                    {project.links.length
                      ? project.links.map((l) => (
                          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                            {l.label} ↗
                          </a>
                        ))
                      : "Private nonprofit codebase"}
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Destinations({ openProject, onOpenProject }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (openProject) setOpen(openProject);
  }, [openProject]);

  return (
    <section id="destinations" className="jn-section">
      <header className="jn-section-head">
        <p className="jn-kicker">Destinations</p>
        <h2 className="jn-h2">Projects</h2>
        <p className="jn-section-note">
          Each ticket has the result and links up front. Open an entry for the full trip.
        </p>
      </header>
      <div className="jn-tickets">
        {projects.map((p, i) => (
          <Ticket
            key={p.id}
            project={p}
            number={i + 1}
            open={open === p.id}
            onToggle={() => {
              const next = open === p.id ? null : p.id;
              setOpen(next);
              onOpenProject?.(next);
            }}
          />
        ))}
      </div>
    </section>
  );
}
