import { useCallback, useState } from "react";
import RouteNav from "./components/journey/RouteNav";
import BoardingPass from "./components/journey/BoardingPass";
import Destinations from "./components/journey/Destinations";
import Passport from "./components/journey/Passport";
import BagCheck from "./components/journey/BagCheck";
import Layovers from "./components/journey/Layovers";
import Arrivals from "./components/journey/Arrivals";
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

  return (
    <div className={`jn${redEye ? " is-redeye" : ""}`}>
      <RouteNav redEye={redEye} onToggleRedEye={toggleRedEye} />
      <main>
        <BoardingPass />
        <Passport />
        <BagCheck />
        <Layovers />
        <Destinations openProject={openProject} onOpenProject={setOpenProject} />
        <Arrivals />
      </main>
      <InFlight />
      <SleepMode />
    </div>
  );
}
