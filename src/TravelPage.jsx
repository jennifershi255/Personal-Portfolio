import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { TravelGlobe } from "./components/TravelGlobe";

const TravelPage = () => {
  const navigate = useNavigate();
  const [isInteracting, setIsInteracting] = useState(false);

  const handleGoHome = () => {
    navigate("/");
  };

  // Hide title when interacting with globe
  useEffect(() => {
    let interactionTimeout;

    const handleInteractionStart = () => {
      setIsInteracting(true);
      clearTimeout(interactionTimeout);
    };

    const handleInteractionEnd = () => {
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        setIsInteracting(false);
      }, 1500); // Show title again 1.5 seconds after interaction stops
    };

    const setupEventListeners = () => {
      // Try multiple selectors to find the canvas
      const canvas =
        document.querySelector("canvas") ||
        document.querySelector(".three-canvas") ||
        document.querySelector("div[style*='width: 100vw'] canvas");

      if (canvas) {
        // More comprehensive event listeners
        const events = [
          "mousedown",
          "wheel",
          "touchstart",
          "pointerdown",
          "gesturestart",
        ];

        const endEvents = [
          "mouseup",
          "touchend",
          "mouseleave",
          "pointerup",
          "gestureend",
        ];

        events.forEach((event) => {
          canvas.addEventListener(event, handleInteractionStart, {
            passive: false,
          });
        });

        endEvents.forEach((event) => {
          canvas.addEventListener(event, handleInteractionEnd, {
            passive: false,
          });
        });

        // Also listen on the parent container
        const parent = canvas.parentElement;
        if (parent) {
          events.forEach((event) => {
            parent.addEventListener(event, handleInteractionStart, {
              passive: false,
            });
          });
          endEvents.forEach((event) => {
            parent.addEventListener(event, handleInteractionEnd, {
              passive: false,
            });
          });
        }

        return { canvas, parent };
      }
      return null;
    };

    // Retry multiple times to catch the canvas
    let elements = null;
    let retryCount = 0;
    const maxRetries = 5;

    const trySetup = () => {
      elements = setupEventListeners();
      if (!elements && retryCount < maxRetries) {
        retryCount++;
        setTimeout(trySetup, 500 * retryCount); // Increasing delay
      }
    };

    trySetup();

    return () => {
      clearTimeout(interactionTimeout);
      if (elements) {
        const events = [
          "mousedown",
          "wheel",
          "touchstart",
          "pointerdown",
          "gesturestart",
          "mouseup",
          "touchend",
          "mouseleave",
          "pointerup",
          "gestureend",
        ];

        events.forEach((event) => {
          if (elements.canvas) {
            elements.canvas.removeEventListener(event, handleInteractionStart);
            elements.canvas.removeEventListener(event, handleInteractionEnd);
          }
          if (elements.parent) {
            elements.parent.removeEventListener(event, handleInteractionStart);
            elements.parent.removeEventListener(event, handleInteractionEnd);
          }
        });
      }
    };
  }, []);

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
            opacity: isInteracting ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: isInteracting ? "none" : "auto",
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
            jennifer's globe
          </h1>
        </div>

        {/* 3D Globe Experience */}
        <div
          onMouseDown={() => setIsInteracting(true)}
          onWheel={() => setIsInteracting(true)}
          onTouchStart={() => setIsInteracting(true)}
          onMouseUp={() => setTimeout(() => setIsInteracting(false), 1500)}
          onMouseLeave={() => setTimeout(() => setIsInteracting(false), 1500)}
          onTouchEnd={() => setTimeout(() => setIsInteracting(false), 1500)}
          style={{ width: "100%", height: "100%" }}
        >
          <TravelGlobe />
        </div>
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
