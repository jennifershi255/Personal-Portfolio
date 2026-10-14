import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { roles } from "../../data/journey";
import { Plane } from "./Icons";

export default function Layovers() {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const planeTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="layovers" className="jn-section">
      <header className="jn-section-head">
        <p className="jn-kicker">Layovers</p>
        <h2 className="jn-h2">Experience</h2>
        <p className="jn-section-note">Each role is a stop on the route, and each stop taught me something.</p>
      </header>

      <div className="jn-route-v" ref={track}>
        <div className="jn-route-rail" aria-hidden>
          <motion.span className="jn-route-fill" style={{ scaleY: progress }} />
          <motion.span className="jn-route-plane" style={{ top: planeTop }}>
            <Plane size={18} />
          </motion.span>
        </div>

        <div className="jn-stop is-origin">
          <span className="jn-stop-dot" aria-hidden />
          <div className="jn-stop-body">
            <span className="jn-label">Departed · Sep 2024</span>
            <h3 className="jn-stop-name">University of Waterloo</h3>
            <p className="jn-stop-role">Computer Science &amp; Finance</p>
          </div>
        </div>

        {roles.map((r) => (
          <motion.div
            key={r.id}
            className={`jn-stop${r.end === "Present" ? " is-current" : ""}`}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span className="jn-stop-dot" style={{ "--ink": r.ink }} aria-hidden />
            <div className="jn-stop-body">
              <span className="jn-label">
                {r.start} – {r.end} · {r.stay}
              </span>
              <h3 className="jn-stop-name">{r.company}</h3>
              <p className="jn-stop-role">{r.title}</p>
              <p className="jn-stop-highlight">{r.highlight}</p>
              <p className="jn-stop-learned">
                <span>What I picked up</span>
                {r.learned}
              </p>
            </div>
          </motion.div>
        ))}

        <div className="jn-stop is-next">
          <span className="jn-stop-dot" aria-hidden />
          <div className="jn-stop-body">
            <span className="jn-label">Next departure</span>
            <h3 className="jn-stop-name">
              <a href="#arrivals">Your team?</a>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
