import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const IDLE_MS = 60000;
const WAKE_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];

export default function SleepMode() {
  const [asleep, setAsleep] = useState(false);

  useEffect(() => {
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (document.visibilityState === "visible") setAsleep(true);
      }, IDLE_MS);
    };
    const wake = () => {
      setAsleep(false);
      arm();
    };
    WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    arm();
    return () => {
      clearTimeout(timer);
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  return (
    <AnimatePresence>
      {asleep && (
        <motion.div
          className="jn-sleep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 1.6 }}
          aria-hidden
        >
          <div className="jn-sleep-card">
            <span className="jn-sleep-sign">
              <i />
              Cabin lights dimmed
            </span>
            <p>Resting somewhere over the Atlantic. Move anything to wake up.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
