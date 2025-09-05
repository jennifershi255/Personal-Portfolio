import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App.jsx";
import { initExtensionDetection } from "./utils/extensionDetector.js";

// Initialize extension detection
initExtensionDetection();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      {" "}
      {/* Wrap your entire app in BrowserRouter here */}
      <App />
    </Router>
  </StrictMode>
);
