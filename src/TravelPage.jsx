import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { TravelGlobe } from "./components/TravelGlobe";

const TravelPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Navigation */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 200,
          }}
        >
          <button
            onClick={handleGoHome}
            style={{
              color: "#b7bbff",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "12px 24px",
              borderRadius: "25px",
              border: "2px solid #b7bbff",
              transition: "all 0.3s ease",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#b7bbff";
              e.target.style.color = "#02091c";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 5px 15px rgba(183, 187, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
              e.target.style.color = "#b7bbff";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Title overlay - Responsive */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            textAlign: "center",
            color: "white",
            padding: "0 20px",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              background: "linear-gradient(45deg, #b7bbff, #9d9df7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            My Travel Adventures
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              margin: "10px 0 0 0",
              color: "#e0e0e0",
              textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
            }}
          >
            Explore the world through my lens ✈️
          </p>
        </div>

        {/* 3D Globe Experience */}
        <TravelGlobe />
      </div>

      {/* Footer at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default TravelPage;
