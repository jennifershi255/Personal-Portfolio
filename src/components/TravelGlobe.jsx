import React, { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import italy from "../assets/img/italy-vlog.png";
import newYork from "../assets/img/newYork.png";
import CircularGallery from "./CircularGallery";

// Location data for markers
const locations = [
  {
    id: "italy",
    name: "Italy",
    lat: 41.8719,
    lng: 12.5674,
    description: "Italy trip during summer of 2024!",
    videoUrl: "https://youtu.be/tR-0iuq9yCQ?si=9Ym6neh0KDWA_efh",
    image: italy,
    emoji: "🇮🇹",
    photos: [
      {
        image: "https://picsum.photos/seed/italy1/1200/800",
        text: "Colosseum at Sunset",
      },
      {
        image: "https://picsum.photos/seed/italy2/600/900",
        text: "Venice Gondolas",
      },
      {
        image: "https://picsum.photos/seed/italy3/1400/900",
        text: "Tuscany Vineyards",
      },
      {
        image: "https://picsum.photos/seed/italy4/800/600",
        text: "Roman Forum",
      },
      {
        image: "https://picsum.photos/seed/italy5/600/800",
        text: "Italian Cuisine",
      },
      {
        image: "https://picsum.photos/seed/italy6/1100/700",
        text: "Florence Architecture",
      },
    ],
  },
  {
    id: "new-york",
    name: "New York",
    lat: 40.7589,
    lng: -73.9851,
    description: "Spontaneous New York trip for a week!",
    videoUrl: "https://youtu.be/23AMHv1Rfi0?si=5nJpnSE03vHvIY52",
    image: newYork,
    emoji: "🗽",
    photos: [
      {
        image: "https://picsum.photos/seed/nyc1/1300/800",
        text: "Times Square Lights",
      },
      {
        image: "https://picsum.photos/seed/nyc2/700/1000",
        text: "Central Park Views",
      },
      {
        image: "https://picsum.photos/seed/nyc3/1200/800",
        text: "Brooklyn Bridge",
      },
      {
        image: "https://picsum.photos/seed/nyc4/600/900",
        text: "Statue of Liberty",
      },
      {
        image: "https://picsum.photos/seed/nyc5/800/600",
        text: "Broadway Theater",
      },
      {
        image: "https://picsum.photos/seed/nyc6/1500/900",
        text: "NYC Skyline",
      },
    ],
  },
  {
    id: "montreal",
    name: "Montreal",
    lat: 45.5017,
    lng: -73.5673,
    description: "Amazing Montreal adventure in the heart of Quebec!",
    image: "https://picsum.photos/seed/montreal-main/1200/800",
    emoji: "🇨🇦",
    videoUrl: "https://youtu.be/23AMHv1Rfi0?si=5nJpnSE03vHvIY52",
  },
  {
    id: "spain",
    name: "Spain",
    lat: 40.4168,
    lng: -3.7038,
    photos: [
      {
        image: "https://picsum.photos/seed/spain1/1400/900",
        text: "Barcelona Sagrada Familia",
      },
      {
        image: "https://picsum.photos/seed/spain2/600/900",
        text: "Madrid Royal Palace",
      },
      {
        image: "https://picsum.photos/seed/spain3/1300/800",
        text: "Park Güell Views",
      },
      {
        image: "https://picsum.photos/seed/spain4/700/1000",
        text: "Spanish Tapas",
      },
    ],
    // Only photos - no description, image, or videoUrl - should show gallery only
  },
];

// Convert lat/lng to 3D coordinates on sphere
const latLngToVector3 = (lat, lng, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

// Location marker component
function LocationMarker({ location, onClick, isActive, hideLabels }) {
  const pinRef = useRef();
  const position = latLngToVector3(location.lat, location.lng, 2.05);

  useFrame((state) => {
    if (pinRef.current) {
      pinRef.current.lookAt(state.camera.position);
      // Pulse animation for active marker
      if (isActive) {
        pinRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 4) * 0.15
        );
      }
    }
  });

  return (
    <group position={position}>
      <group
        ref={pinRef}
        onClick={() => onClick(location)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {/* Pin head (the circular part) */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshLambertMaterial color={isActive ? "#ff1744" : "#d32f2f"} />
        </mesh>

        {/* Pin body (the pointed part) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.04, 0.2, 8]} />
          <meshLambertMaterial color={isActive ? "#ff1744" : "#d32f2f"} />
        </mesh>

        {/* White center dot */}
        <mesh position={[0, 0.15, 0.01]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Glowing ring effect for active marker */}
        {isActive && (
          <mesh position={[0, 0.15, 0]} scale={[1.5, 1.5, 1.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff1744" transparent opacity={0.3} />
          </mesh>
        )}
      </group>

      {!hideLabels && (
        <Html distanceFactor={8}>
          <div
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
              pointerEvents: "none",
              transform: "translate(-50%, -200%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ff1744",
              whiteSpace: "nowrap",
            }}
          >
            📍 {location.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Earth Globe component
function Earth({ onLocationClick, activeLocation, hideLabels }) {
  const earthGroupRef = useRef();

  // Load Earth texture
  const earthTexture = useTexture(
    "https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg"
  );

  useFrame((state, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.05; // Slow rotation of entire group
    }
  });

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 32]} />
        <meshLambertMaterial map={earthTexture} transparent={false} />
      </mesh>

      {/* Location markers */}
      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          location={location}
          onClick={onLocationClick}
          isActive={activeLocation?.id === location.id}
          hideLabels={hideLabels}
        />
      ))}
    </group>
  );
}

// Modal component for location details
function LocationModal({ location, onClose, isMobile }) {
  const [currentTab, setCurrentTab] = useState("overview");
  const hasPhotos = location?.photos && location.photos.length > 0;
  const hasVideo = location?.videoUrl;
  const hasDescription = location?.description;
  const hasImage = location?.image;
  const hasOverviewContent = hasVideo || hasDescription || hasImage;

  // Show tabs only if there are both photos AND overview content
  const hasTabs = hasPhotos && hasOverviewContent;

  // If only photos exist (no overview content), show gallery directly
  const showOnlyGallery = hasPhotos && !hasOverviewContent;

  if (!location) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(15px)",
        padding: isMobile ? "5px" : "15px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
          padding: 0,
          borderRadius: "24px",
          width: isMobile ? "98%" : "95vw",
          height: isMobile ? "95vh" : "90vh",
          maxWidth: "1400px",
          overflow: "hidden",
          color: "white",
          position: "relative",
          border: "3px solid",
          borderImage:
            "linear-gradient(45deg, #b7bbff, #ff6b95, #45b7aa, #b7bbff) 1",
          boxShadow:
            "0 30px 80px rgba(183, 187, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "25px 30px",
            borderBottom: "1px solid rgba(183, 187, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(183, 187, 255, 0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                fontSize: "3rem",
                background: "linear-gradient(45deg, #b7bbff, #ff6b95)",
                borderRadius: "50%",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {location.emoji}
            </div>
            <div>
              <h1
                style={{
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  margin: "0",
                  background: "linear-gradient(45deg, #b7bbff, #ff6b95)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: "bold",
                }}
              >
                {location.name}
              </h1>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(45deg, #ff6b95, #b7bbff)",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "12px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 107, 149, 0.3)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1) rotate(90deg)";
              e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 149, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1) rotate(0deg)";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 149, 0.3)";
            }}
          >
            ×
          </button>
        </div>

        {/* Tab Navigation - Only show if there are tabs */}
        {hasTabs && (
          <div
            style={{
              display: "flex",
              padding: "0 30px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderBottom: "1px solid rgba(183, 187, 255, 0.1)",
            }}
          >
            {[
              { key: "overview", label: "🌟 Overview", icon: "📖" },
              { key: "photos", label: "📸 Gallery", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                style={{
                  background:
                    currentTab === tab.key
                      ? "linear-gradient(45deg, #b7bbff, #ff6b95)"
                      : "transparent",
                  border: "none",
                  color: currentTab === tab.key ? "white" : "#b7bbff",
                  padding: "15px 25px",
                  borderRadius: "12px 12px 0 0",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  marginRight: "5px",
                  position: "relative",
                  top: currentTab === tab.key ? "0" : "2px",
                }}
                onMouseOver={(e) => {
                  if (currentTab !== tab.key) {
                    e.target.style.backgroundColor = "rgba(183, 187, 255, 0.1)";
                    e.target.style.color = "white";
                  }
                }}
                onMouseOut={(e) => {
                  if (currentTab !== tab.key) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#b7bbff";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Show gallery only if location has only photos */}
          {showOnlyGallery ? (
            <div
              style={{
                height: "100%",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  color: "#b7bbff",
                  marginBottom: "20px",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                📸 Photo Gallery - {location.name}
              </h3>
              <div
                style={{
                  flex: 1,
                  borderRadius: "15px",
                  overflow: "hidden",
                  border: "1px solid rgba(183, 187, 255, 0.2)",
                }}
              >
                <CircularGallery
                  items={location.photos}
                  bend={2}
                  textColor="#b7bbff"
                  borderRadius={0.08}
                  scrollEase={0.05}
                  font="bold 20px Figtree"
                />
              </div>
            </div>
          ) : (
            <>
              {/* If no tabs, show overview content directly. If tabs exist, show based on currentTab */}
              {(!hasTabs || currentTab === "overview") &&
                hasOverviewContent && (
                  <div
                    style={{
                      padding: "40px",
                      display: "flex",
                      gap: "40px",
                      height: "100%",
                      overflow: "auto",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    {/* Main Image - only show if image exists */}
                    {hasImage && (
                      <div
                        style={{
                          flex: isMobile ? "none" : "1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "300px",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 20px 40px rgba(183, 187, 255, 0.3)",
                          }}
                        >
                          <img
                            src={location.image}
                            alt={location.name}
                            style={{
                              width: "100%",
                              height: isMobile ? "300px" : "400px",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(45deg, rgba(183, 187, 255, 0.1), rgba(255, 107, 149, 0.1))",
                              pointerEvents: "none",
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div
                      style={{
                        flex: isMobile ? "none" : "1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "25px",
                      }}
                    >
                      {/* Description - only show if description exists */}
                      {hasDescription && (
                        <p
                          style={{
                            fontSize: isMobile ? "16px" : "18px",
                            lineHeight: "1.7",
                            color: "#e0e0e0",
                            margin: 0,
                          }}
                        >
                          {location.description}
                        </p>
                      )}

                      {/* Watch Vlog Button - Only show if videoUrl exists */}
                      {hasVideo && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                            marginTop: "20px",
                          }}
                        >
                          <a
                            href={location.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background:
                                "linear-gradient(45deg, #ff6b95, #b7bbff)",
                              color: "white",
                              padding: "16px 32px",
                              borderRadius: "20px",
                              textDecoration: "none",
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "all 0.3s ease",
                              boxShadow: "0 8px 25px rgba(255, 107, 149, 0.3)",
                              textAlign: "center",
                              minWidth: "200px",
                              justifyContent: "center",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform =
                                "translateY(-3px) scale(1.05)";
                              e.target.style.boxShadow =
                                "0 15px 35px rgba(255, 107, 149, 0.5)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform =
                                "translateY(0) scale(1)";
                              e.target.style.boxShadow =
                                "0 8px 25px rgba(255, 107, 149, 0.3)";
                            }}
                          >
                            <span style={{ fontSize: "1.3rem" }}>🎥</span>
                            Watch Travel Vlog
                            <span style={{ fontSize: "1rem" }}>→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Photos tab - only show if tabs exist and current tab is photos */}
              {hasTabs && currentTab === "photos" && hasPhotos && (
                <div
                  style={{
                    height: "100%",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    style={{
                      color: "#b7bbff",
                      marginBottom: "20px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    📸 Photo Gallery - {location.name}
                  </h3>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: "15px",
                      overflow: "hidden",
                      border: "1px solid rgba(183, 187, 255, 0.2)",
                    }}
                  >
                    <CircularGallery
                      items={location.photos}
                      bend={2}
                      textColor="#b7bbff"
                      borderRadius={0.08}
                      scrollEase={0.05}
                      font="bold 20px Figtree"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Main TravelGlobe component
export const TravelGlobe = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalLocation, setModalLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsiveness
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setModalLocation(location);
  };

  const handleCloseModal = () => {
    setModalLocation(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Control Instructions - Responsive */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "160px" : "20px",
          left: isMobile ? "10px" : "20px",
          right: isMobile ? "10px" : "auto",
          color: "white",
          zIndex: 100,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: isMobile ? "12px" : "18px",
          borderRadius: "12px",
          fontSize: isMobile ? "13px" : "15px",
          backdropFilter: "blur(15px)",
          border: "2px solid rgba(183, 187, 255, 0.3)",
          boxShadow: "0 8px 25px rgba(183, 187, 255, 0.2)",
        }}
      >
        <h4
          style={{
            margin: "0 0 12px 0",
            color: "#b7bbff",
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🌍 Explore the Globe
        </h4>
        <div
          style={{
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🖱️</span>
          {isMobile ? "Touch & drag to rotate" : "Drag to rotate globe"}
        </div>
        <div
          style={{
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🔍</span>
          {isMobile ? "Pinch to zoom in/out" : "Scroll to zoom"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.2rem" }}>📍</span>
          Click pins to explore my travels
        </div>
      </div>

      {/* Three.js Canvas - Responsive */}
      <Canvas
        camera={{
          position: isMobile ? [6, 3, 6] : [5, 2, 5],
          fov: isMobile ? 70 : 60,
        }}
        style={{
          background: "linear-gradient(to bottom, #0c0c1d, #1a1a2e)",
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <pointLight position={[0, 10, 0]} intensity={0.3} color="#b7bbff" />
        <pointLight position={[5, -5, 5]} intensity={0.2} color="#9d9df7" />

        <Earth
          onLocationClick={handleLocationClick}
          activeLocation={selectedLocation}
          hideLabels={!!modalLocation}
        />

        <OrbitControls
          enablePan={false}
          minDistance={isMobile ? 4 : 3}
          maxDistance={isMobile ? 10 : 8}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={isMobile ? 0.5 : 1}
          zoomSpeed={isMobile ? 0.5 : 1}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />

        {/* Enhanced stars background */}
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial
            color="#000033"
            side={THREE.BackSide}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Additional star points */}
        {Array.from({ length: 200 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200,
            ]}
          >
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}
      </Canvas>

      {/* Location Modal */}
      <LocationModal
        location={modalLocation}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TravelGlobe;
