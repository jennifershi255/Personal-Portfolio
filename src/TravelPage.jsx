import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { TravelGlobe } from "./components/TravelGlobe";

const TravelPage = () => {
  const navigate = useNavigate();
  const [isInteracting, setIsInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 400);

  const handleGoHome = () => {
    navigate("/");
  };

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      className="travel-page"
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
        touchAction: isMobile ? "manipulation" : "auto",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Navigation - Mobile Responsive */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "15px" : "20px",
            right: isMobile ? "15px" : "20px",
            left: isMobile ? "auto" : "auto",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleGoHome}
            style={{
              color: "#b7bbff",
              textDecoration: "none",
              fontSize: isSmallMobile ? "12px" : isMobile ? "13px" : "16px",
              fontWeight: "bold",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              padding: isSmallMobile
                ? "8px 12px"
                : isMobile
                ? "9px 15px"
                : "12px 24px",
              borderRadius: isSmallMobile ? "20px" : "25px",
              border: "2px solid #b7bbff",
              transition: "all 0.3s ease",
              cursor: "pointer",
              backdropFilter: "blur(15px)",
              minWidth: "auto",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
              maxWidth: isSmallMobile ? "80px" : "auto",
            }}
            onMouseOver={(e) => {
              if (!isMobile) {
                e.target.style.backgroundColor = "#b7bbff";
                e.target.style.color = "#02091c";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 5px 15px rgba(183, 187, 255, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                e.target.style.color = "#b7bbff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
              }
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                e.target.style.backgroundColor = "#b7bbff";
                e.target.style.color = "#02091c";
                e.target.style.transform = "scale(0.95)";
              }
            }}
            onTouchEnd={(e) => {
              if (isMobile) {
                setTimeout(() => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.color = "#b7bbff";
                  e.target.style.transform = "scale(1)";
                }, 150);
              }
            }}
          >
            {isSmallMobile ? "←" : isMobile ? "← Home" : "← Back to Home"}
          </button>
        </div>

        {/* Title overlay - Mobile Responsive */}
        <div
          style={{
            position: "absolute",
            top: isSmallMobile ? "60px" : isMobile ? "70px" : "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            textAlign: "center",
            color: "white",
            padding: isSmallMobile ? "0 20px" : isMobile ? "0 15px" : "0 20px",
            width: isSmallMobile
              ? "calc(100% - 40px)"
              : isMobile
              ? "calc(100% - 30px)"
              : "100%",
            maxWidth: isMobile ? "none" : "800px",
            opacity: isInteracting ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: isInteracting ? "none" : "auto",
          }}
        >
          <h1
            style={{
              fontSize: isSmallMobile
                ? "clamp(1.3rem, 7vw, 1.8rem)"
                : isMobile
                ? "clamp(1.5rem, 8vw, 2.2rem)"
                : "clamp(2rem, 5vw, 3rem)",
              background: "linear-gradient(45deg, #b7bbff, #9d9df7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0",
              textShadow: isMobile
                ? "1px 1px 3px rgba(0,0,0,0.7)"
                : "2px 2px 4px rgba(0,0,0,0.5)",
              lineHeight: isMobile ? "1.2" : "1",
              letterSpacing: isSmallMobile
                ? "0.3px"
                : isMobile
                ? "0.5px"
                : "normal",
            }}
          >
            {isMobile ? "jennifer's globe" : "jennifer's globe"}
          </h1>
          {isMobile && (
            <p
              style={{
                fontSize: isSmallMobile ? "0.75rem" : "0.9rem",
                margin: isSmallMobile ? "6px 0 0 0" : "8px 0 0 0",
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                fontWeight: "300",
              }}
            >
              Touch and explore ✈️
            </p>
          )}
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

      {/* Footer at bottom - Mobile Responsive */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: isMobile
            ? "rgba(0, 0, 0, 0.9)"
            : "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(15px)",
          borderTop: isMobile ? "1px solid rgba(183, 187, 255, 0.2)" : "none",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default TravelPage;
