import React from "react";
import { Footer } from "./components/Footer";

const TravelPage = () => {
  return (
    <div>
      <div
        className="travel"
        style={{ paddingTop: "100px", minHeight: "80vh" }}
      >
        <h1 className="section-heading">in progress...</h1>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.6",
              marginBottom: "40px",
            }}
          >
            hi
          </p>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a
              href="/"
              style={{
                color: "#b7bbff",
                textDecoration: "underline",
                fontSize: "1.1rem",
              }}
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelPage;
