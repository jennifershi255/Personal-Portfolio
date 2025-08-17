import React, { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import italy from "../assets/img/italy-vlog.png";
import newYork from "../assets/img/newYork.png";

// Location data for markers
const locations = [
  {
    id: "italy",
    name: "Italy",
    lat: 41.8719,
    lng: 12.5674,
    description:
      "Amazing trip to Italy - exploring ancient Rome, beautiful Tuscany, and delicious cuisine. From the Colosseum to the canals of Venice, this journey was absolutely magical!",
    videoUrl: "https://youtu.be/tR-0iuq9yCQ?si=9Ym6neh0KDWA_efh",
    image: italy,
    photos: ["italy-travel-1.jpg", "italy-travel-2.jpg"],
  },
  {
    id: "new-york",
    name: "New York",
    lat: 40.7589,
    lng: -73.9851,
    description:
      "Incredible NYC adventure - from Central Park to Times Square, the Brooklyn Bridge to world-class museums. The city that never sleeps delivered non-stop excitement!",
    videoUrl: "https://youtu.be/23AMHv1Rfi0?si=5nJpnSE03vHvIY52",
    image: newYork,
    photos: ["nyc-travel-1.jpg", "nyc-travel-2.jpg"],
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

// 3D Plane component
function TravelPlane({ targetLocation, onPositionChange }) {
  const planeRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(
    new THREE.Vector3(2.3, 0, 0)
  );
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(2.3, 0, 0)
  );
  const [isMoving, setIsMoving] = useState(false);
  const [keys, setKeys] = useState({});
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));

  // Keyboard event handlers
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
      setKeys((prev) => ({ ...prev, [event.code]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update target when location changes
  React.useEffect(() => {
    if (targetLocation) {
      const newTarget = latLngToVector3(
        targetLocation.lat,
        targetLocation.lng,
        2.3
      );
      setTargetPosition(newTarget);
      setIsMoving(true);
    }
  }, [targetLocation]);

  useFrame((state, delta) => {
    if (planeRef.current) {
      // Handle keyboard controls
      const speed = 0.05;
      const rotationSpeed = 0.02;
      let newVelocity = velocity.clone();
      let userControlled = false;

      // Arrow key controls
      if (keys["ArrowUp"]) {
        // Move forward in the direction the plane is facing
        const forward = new THREE.Vector3(0, 0, -speed);
        forward.applyQuaternion(planeRef.current.quaternion);
        newVelocity.add(forward);
        userControlled = true;
      }
      if (keys["ArrowDown"]) {
        // Move backward
        const backward = new THREE.Vector3(0, 0, speed);
        backward.applyQuaternion(planeRef.current.quaternion);
        newVelocity.add(backward);
        userControlled = true;
      }
      if (keys["ArrowLeft"]) {
        // Turn left
        planeRef.current.rotateY(rotationSpeed);
        userControlled = true;
      }
      if (keys["ArrowRight"]) {
        // Turn right
        planeRef.current.rotateY(-rotationSpeed);
        userControlled = true;
      }
      if (keys["KeyW"]) {
        // Climb up
        newVelocity.y += speed * 0.5;
        userControlled = true;
      }
      if (keys["KeyS"]) {
        // Descend
        newVelocity.y -= speed * 0.5;
        userControlled = true;
      }

      // Apply damping to velocity
      newVelocity.multiplyScalar(0.9);
      setVelocity(newVelocity);

      // Update position with velocity for user-controlled movement
      if (userControlled) {
        const newPosition = currentPosition.clone().add(newVelocity);

        // Keep plane at proper distance from Earth (between 2.2 and 3.0)
        const distanceFromCenter = newPosition.length();
        if (distanceFromCenter < 2.2) {
          newPosition.normalize().multiplyScalar(2.2);
        } else if (distanceFromCenter > 3.0) {
          newPosition.normalize().multiplyScalar(3.0);
        }

        setCurrentPosition(newPosition);
        planeRef.current.position.copy(newPosition);

        // Notify parent of position change for camera following
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
      }

      // Auto-pilot to target location if one is set and no user control
      if (targetLocation && !userControlled) {
        const distance = currentPosition.distanceTo(targetPosition);

        if (distance > 0.1) {
          currentPosition.lerp(targetPosition, delta * 1.0);
          planeRef.current.position.copy(currentPosition);
          setIsMoving(true);

          // Make plane look in direction of movement
          const direction = new THREE.Vector3()
            .subVectors(targetPosition, currentPosition)
            .normalize();

          if (direction.length() > 0.01) {
            const lookTarget = currentPosition.clone().add(direction);
            planeRef.current.lookAt(lookTarget);
            planeRef.current.rotateZ(
              Math.sin(state.clock.elapsedTime * 2) * 0.1
            );
          }
        } else {
          setIsMoving(false);
        }
      }

      // Default orbit when no target and no manual control
      if (!targetLocation && !userControlled) {
        const orbitRadius = 2.3;
        const orbitSpeed = 0.2;
        const x = Math.cos(state.clock.elapsedTime * orbitSpeed) * orbitRadius;
        const z = Math.sin(state.clock.elapsedTime * orbitSpeed) * orbitRadius;
        const y = Math.sin(state.clock.elapsedTime * orbitSpeed * 0.3) * 0.3;

        const orbitPosition = new THREE.Vector3(x, y, z);
        planeRef.current.position.copy(orbitPosition);
        setCurrentPosition(orbitPosition);

        // Look in the direction of movement
        const orbitDirection = new THREE.Vector3(
          -Math.sin(state.clock.elapsedTime * orbitSpeed),
          0,
          Math.cos(state.clock.elapsedTime * orbitSpeed)
        );
        planeRef.current.lookAt(orbitPosition.clone().add(orbitDirection));
        planeRef.current.rotateZ(Math.PI * 0.1);
      }

      // Subtle engine vibration
      planeRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 10) * 0.002;
    }
  });

  return (
    <group ref={planeRef} scale={[0.12, 0.12, 0.12]}>
      {/* Realistic commercial airplane */}
      <group rotation={[0, Math.PI, 0]}>
        {/* Main fuselage body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 8, 16]} />
          <meshLambertMaterial color="#f0f0f0" />
        </mesh>

        {/* Nose section */}
        <mesh position={[0, 0, 4.5]}>
          <sphereGeometry
            args={[0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]}
          />
          <meshLambertMaterial color="#e8e8e8" />
        </mesh>

        {/* Tail section */}
        <mesh position={[0, 0, -4.5]}>
          <cylinderGeometry args={[0.4, 0.8, 1, 12]} />
          <meshLambertMaterial color="#e8e8e8" />
        </mesh>

        {/* Main wings */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[12, 0.3, 2]} />
          <meshLambertMaterial color="#d0d0d0" />
        </mesh>

        {/* Wing engines */}
        <mesh position={[3, -0.8, 0.5]}>
          <cylinderGeometry args={[0.5, 0.6, 2, 12]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[-3, -0.8, 0.5]}>
          <cylinderGeometry args={[0.5, 0.6, 2, 12]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>

        {/* Horizontal stabilizer */}
        <mesh position={[0, 0.2, -4]}>
          <boxGeometry args={[4, 0.2, 0.8]} />
          <meshLambertMaterial color="#d0d0d0" />
        </mesh>

        {/* Vertical stabilizer */}
        <mesh position={[0, 1.5, -4]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.2, 3, 1.2]} />
          <meshLambertMaterial color="#d0d0d0" />
        </mesh>

        {/* Cockpit windows */}
        <mesh position={[0, 0.4, 3.5]}>
          <sphereGeometry
            args={[0.6, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5]}
          />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>

        {/* Passenger windows */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[0, 0.3, 2.5 - i * 0.8]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
            <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
          </mesh>
        ))}

        {/* Wing tips with purple accents */}
        <mesh position={[5.8, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.5]} />
          <meshLambertMaterial color="#b7bbff" />
        </mesh>
        <mesh position={[-5.8, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.5]} />
          <meshLambertMaterial color="#b7bbff" />
        </mesh>

        {/* Purple livery stripe */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.81, 0.81, 7.8, 16]} />
          <meshLambertMaterial color="#b7bbff" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Earth Globe component
function Earth({ onLocationClick, activeLocation, hideLabels }) {
  const earthRef = useRef();

  // Load Earth texture
  const earthTexture = useTexture(
    "https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg"
  );

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05; // Slow rotation
    }
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 32]} />
        <meshLambertMaterial map={earthTexture} transparent={false} />
      </mesh>

      {/* Atmosphere glow effect */}
      <mesh scale={[2.1, 2.1, 2.1]}>
        <sphereGeometry args={[2, 32, 16]} />
        <meshBasicMaterial
          color="#b7bbff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
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
        backdropFilter: "blur(10px)",
        padding: isMobile ? "10px" : "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a2e",
          padding: isMobile ? "20px" : "40px",
          borderRadius: "20px",
          width: isMobile ? "100%" : "90vw",
          height: isMobile ? "90vh" : "85vh",
          maxWidth: "1200px",
          overflow: "auto",
          color: "white",
          position: "relative",
          border: "2px solid #b7bbff",
          boxShadow: "0 25px 50px rgba(183, 187, 255, 0.4)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "30px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "25px",
            background: "none",
            border: "none",
            color: "#b7bbff",
            fontSize: "32px",
            cursor: "pointer",
            padding: "10px",
            borderRadius: "50%",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "rgba(183, 187, 255, 0.2)";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "scale(1)";
          }}
        >
          ×
        </button>

        {/* Image Section */}
        <div
          style={{
            flex: isMobile ? "none" : "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isMobile ? "300px" : "auto",
          }}
        >
          <img
            src={location.image}
            alt={location.name}
            style={{
              width: "100%",
              height: isMobile ? "300px" : "500px",
              objectFit: "cover",
              borderRadius: "15px",
              border: "2px solid #b7bbff",
              boxShadow: "0 10px 30px rgba(183, 187, 255, 0.3)",
            }}
          />
        </div>

        {/* Content Section */}
        <div
          style={{
            flex: isMobile ? "none" : "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              color: "#b7bbff",
              marginBottom: "20px",
              marginRight: "60px",
              fontSize: isMobile ? "2rem" : "3rem",
              background: "linear-gradient(45deg, #b7bbff, #9d9df7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {location.name}
          </h1>

          <p
            style={{
              fontSize: isMobile ? "16px" : "20px",
              lineHeight: "1.7",
              color: "#e0e0e0",
              marginBottom: "30px",
            }}
          >
            {location.description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <a
              href={location.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#b7bbff",
                color: "#02091c",
                padding: isMobile ? "15px 30px" : "18px 36px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                fontSize: isMobile ? "18px" : "20px",
                textAlign: "center",
                minWidth: isMobile ? "250px" : "280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#9d9df7";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 8px 25px rgba(183, 187, 255, 0.5)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#b7bbff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <span>🎥</span>
              Watch Travel Vlog
            </a>
          </div>

          {/* Additional info */}
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "rgba(183, 187, 255, 0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(183, 187, 255, 0.3)",
            }}
          >
            <h3 style={{ color: "#b7bbff", marginBottom: "10px" }}>
              ✈️ Travel Highlights
            </h3>
            <p
              style={{ fontSize: "14px", color: "#c0c0c0", lineHeight: "1.5" }}
            >
              This destination was captured in my travel vlog series. Click
              above to watch the full adventure on YouTube!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Camera controller for following plane
function CameraController({ planePosition, isFollowing }) {
  const { camera } = useThree();

  useFrame(() => {
    if (isFollowing && planePosition) {
      // Calculate camera position that follows behind and above the plane
      const offset = new THREE.Vector3(0, 1, 2); // Behind and above the plane
      const targetCameraPosition = planePosition.clone().add(offset);

      // Smooth camera movement
      camera.position.lerp(targetCameraPosition, 0.05);
      camera.lookAt(planePosition);
    }
  });

  return null;
}

// Main TravelGlobe component
export const TravelGlobe = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalLocation, setModalLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [planePosition, setPlanePosition] = useState(null);
  const [cameraFollowing, setCameraFollowing] = useState(false);

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

  const handlePlanePositionChange = (position) => {
    setPlanePosition(position);
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
          padding: isMobile ? "10px" : "15px",
          borderRadius: "10px",
          fontSize: isMobile ? "12px" : "14px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(183, 187, 255, 0.3)",
        }}
      >
        <h4
          style={{
            margin: "0 0 8px 0",
            color: "#b7bbff",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Controls:
        </h4>
        <div style={{ marginBottom: "4px" }}>
          {isMobile ? "👆 Touch to rotate globe" : "🖱️ Drag to rotate globe"}
        </div>
        <div style={{ marginBottom: "4px" }}>
          {isMobile ? "🤏 Pinch to zoom" : "🔍 Scroll to zoom"}
        </div>
        <div style={{ marginBottom: "4px" }}>
          📍 Click red pins for travel details
        </div>
        <div style={{ marginBottom: "4px" }}>
          {isMobile ? "✈️ Plane auto-flies!" : "✈️ Arrow keys + W/S to fly!"}
        </div>
        <div>🎮 Manual control overrides auto-pilot</div>
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

        <TravelPlane
          targetLocation={selectedLocation}
          onPositionChange={handlePlanePositionChange}
        />

        <CameraController
          planePosition={planePosition}
          isFollowing={cameraFollowing}
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
