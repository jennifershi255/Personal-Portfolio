import { useLocation } from "react-router-dom"; // Import useLocation
import { Route, Routes } from "react-router-dom"; // Correct import for Route and Routes
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Notes } from "./components/Notes";
import { Connect } from "./components/Connect";
import { Footer } from "./components/Footer";
import { Travel } from "./components/Travel";
import TravelPage from "./TravelPage";
import { Analytics } from "@vercel/analytics/react";
import SplashCursor from "./SplashCursor"; // Import SplashCursor

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const location = useLocation(); // Get the current route

  // Check if the current route is Projects page
  const showSplashCursor = location.pathname !== "/projects"; // Hide SplashCursor on Projects page

  return (
    <div>
      {showSplashCursor && <SplashCursor />}{" "}
      {/* Conditionally render SplashCursor */}
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/travel" element={<TravelPage />} />
      </Routes>
      <Analytics />
    </div>
  );
}

const HomePage = () => {
  return (
    <div>
      <Banner />
      <About />
      <div className="section-padding">
        <Projects />
      </div>
      <Travel />
      <Connect />
      <Footer />
    </div>
  );
};

export default App;
