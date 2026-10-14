import { useCallback, useState } from "react";
import RouteNav from "./components/journey/RouteNav";
import BoardingPass from "./components/journey/BoardingPass";
import Destinations from "./components/journey/Destinations";
import Passport from "./components/journey/Passport";
import Layovers from "./components/journey/Layovers";
import Arrivals, { OffDuty } from "./components/journey/Arrivals";
import InFlight from "./components/journey/InFlight";
import SleepMode from "./components/journey/SleepMode";
import "./css/Journey.css";

const THEME_KEY = "jn-red-eye";

const initialRedEye = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved !== null) return saved === "1";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function Journey() {
  const [openProject, setOpenProject] = useState(null);
  const [redEye, setRedEye] = useState(initialRedEye);

  const toggleRedEye = useCallback(() => {
    setRedEye((on) => {
      localStorage.setItem(THEME_KEY, on ? "0" : "1");
      return !on;
    });
  }, []);

  const goTo = useCallback((track) => {
    if (track.project) {
      const ticket = document.getElementById(`ticket-${track.project}`);
      if (!ticket) return;
      // Expanding the entry mid-scroll triggers scroll anchoring, which cancels smooth scrolling.
      let done = false;
      const open = () => {
        if (done) return;
        done = true;
        window.removeEventListener("scrollend", open);
        setOpenProject(track.project);
      };
      if (Math.abs(ticket.getBoundingClientRect().top) < 120) return open();
      window.addEventListener("scrollend", open, { once: true });
      setTimeout(open, 1200);
      ticket.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    document.getElementById(track.section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className={`jn${redEye ? " is-redeye" : ""}`}>
      <RouteNav redEye={redEye} onToggleRedEye={toggleRedEye} />
      <main>
        <BoardingPass />
        <Passport />
        <Layovers />
        <Destinations openProject={openProject} onOpenProject={setOpenProject} />
        <OffDuty />
        <Arrivals />
      </main>
      <InFlight onGoTo={goTo} />
      <SleepMode />
    </div>
  );
}
