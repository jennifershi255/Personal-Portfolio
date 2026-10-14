import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Journey from "./Journey";
import TravelPage from "./TravelPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Journey />} />
        <Route path="/travel" element={<TravelPage />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
