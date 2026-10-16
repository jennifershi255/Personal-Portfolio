import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { formatCoords } from "../../data/travel";

const RADIUS = 2;
const INK = "#ece6da";
const ACCENT = "#ff5b3a";

const latLngToVector3 = (lat, lng, radius = RADIUS) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Samples a Fibonacci sphere against a land/water mask (black = land).
function useLandDots(count) {
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = "/earth-water.png";
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);

      const out = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (2 * (i + 0.5)) / count;
        const lat = (Math.asin(y) * 180) / Math.PI;
        const lng = ((((i * golden * 180) / Math.PI) % 360) + 360) % 360 - 180;
        const px = Math.min(width - 1, Math.floor(((lng + 180) / 360) * width));
        const py = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height));
        if (data[(py * width + px) * 4] < 128) {
          const v = latLngToVector3(lat, lng, RADIUS * 1.003);
          out.push(v.x, v.y, v.z);
        }
      }
      setPositions(new Float32Array(out));
    };
    return () => {
      cancelled = true;
    };
  }, [count]);

  return positions;
}

function LandDots({ count }) {
  const positions = useLandDots(count);
  const { size, camera, gl } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(INK) },
          uOpacity: { value: 0 },
          uScale: { value: 1 },
          uSize: { value: 0.019 },
        },
        vertexShader: /* glsl */ `
          uniform float uScale;
          uniform float uSize;
          varying float vFacing;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * normalize(position));
            vFacing = dot(n, normalize(-mv.xyz));
            gl_PointSize = uSize * uScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vFacing;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.3, d);
            float limb = smoothstep(0.0, 0.45, vFacing);
            float alpha = a * uOpacity * (0.18 + 0.82 * limb);
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, dt) => {
    const fov = (camera.fov * Math.PI) / 180;
    material.uniforms.uScale.value =
      (size.height * gl.getPixelRatio()) / (2 * Math.tan(fov / 2));
    if (positions) {
      const o = material.uniforms.uOpacity;
      o.value += (0.9 - o.value) * (1 - Math.exp(-dt * 2.5));
    }
  });

  if (!positions) return null;

  return (
    <points material={material} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}

function Graticule() {
  const geometry = useMemo(() => {
    const pts = [];
    const r = RADIUS * 1.001;
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 3) {
        pts.push(latLngToVector3(lat, lng, r), latLngToVector3(lat, lng + 3, r));
      }
    }
    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -84; lat < 84; lat += 3) {
        pts.push(latLngToVector3(lat, lng, r), latLngToVector3(lat + 3, lng, r));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={INK} transparent opacity={0.05} depthWrite={false} />
    </lineSegments>
  );
}

function Sphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uBase: { value: new THREE.Color("#0d0d10") },
          uRim: { value: new THREE.Color("#3a3832") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uBase;
          uniform vec3 uRim;
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.5);
            gl_FragColor = vec4(mix(uBase, uRim, f), 1.0);
          }
        `,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  // Blocks pointer events so pins on the far side can't be hit through the globe.
  const block = (e) => e.stopPropagation();

  return (
    <mesh material={material} onClick={block} onPointerOver={block} onPointerMove={block}>
      <sphereGeometry args={[RADIUS, 96, 64]} />
    </mesh>
  );
}

function Stars() {
  const positions = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const v = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5)
        .normalize()
        .multiplyScalar(40 + rand() * 30);
      arr.set([v.x, v.y, v.z], i * 3);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={INK}
        size={1.1}
        sizeAttenuation={false}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function Pin({ location, index, emphasized, onSelect, onHover }) {
  const { position, normal, quaternion } = useMemo(() => {
    const p = latLngToVector3(location.lat, location.lng, RADIUS * 1.006);
    const n = p.clone().normalize();
    return {
      position: p,
      normal: n,
      quaternion: new THREE.Quaternion().setFromUnitVectors(Z_AXIS, n),
    };
  }, [location.lat, location.lng]);

  const dot = useRef();
  const ring = useRef();
  const label = useRef();
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const phase = index * 0.27;

  useFrame((state, dt) => {
    const t = (state.clock.elapsedTime * 0.55 + phase) % 1;
    ring.current.scale.setScalar(1 + t * 2.6);
    ring.current.material.opacity = (1 - t) * (emphasized ? 0.9 : 0.55);

    const s = dot.current.scale.x;
    dot.current.scale.setScalar(s + ((emphasized ? 1.45 : 1) - s) * (1 - Math.exp(-dt * 12)));

    const facing = toCamera.copy(state.camera.position).sub(position).normalize().dot(normal);
    const visible = THREE.MathUtils.smoothstep(facing, 0.05, 0.3);
    if (label.current) {
      label.current.style.opacity = visible.toFixed(3);
      label.current.style.pointerEvents = visible > 0.5 ? "auto" : "none";
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.delta > 6) return;
    onSelect(location);
  };

  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={dot} renderOrder={3}>
        <circleGeometry args={[0.022, 24]} />
        <meshBasicMaterial color={ACCENT} depthWrite={false} />
      </mesh>
      <mesh ref={ring} renderOrder={2}>
        <ringGeometry args={[0.03, 0.034, 48]} />
        <meshBasicMaterial color={ACCENT} transparent depthWrite={false} />
      </mesh>
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(location.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <circleGeometry args={[0.075, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <button
          ref={label}
          type="button"
          className={`tg-pin${location.labelSide === "left" ? " is-left" : ""}${
            emphasized ? " is-on" : ""
          }`}
          onClick={() => onSelect(location)}
          onMouseEnter={() => onHover(location.id)}
          onMouseLeave={() => onHover(null)}
          tabIndex={-1}
        >
          <span className="tg-pin-line" />
          <span className="tg-pin-text">
            <span className="tg-pin-name">{location.name}</span>
            <span className="tg-pin-coords">{formatCoords(location)}</span>
          </span>
        </button>
      </Html>
    </group>
  );
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Tweens the camera around the globe so `focus` ends up centred on screen,
// and eases back out to `restDistance` once focus is cleared.
function CameraRig({ focus, distance, restDistance, controls, onArrive }) {
  const { camera } = useThree();
  const tween = useRef(null);

  useEffect(() => {
    const from = camera.position.clone().normalize();
    const fromDist = camera.position.length();
    if (!focus) {
      tween.current =
        fromDist < restDistance - 0.05
          ? { from, fromDist, toDist: restDistance, rotation: new THREE.Quaternion(), duration: 1.1, t: 0 }
          : null;
      return;
    }
    const to = latLngToVector3(focus.lat, focus.lng, 1).normalize();
    tween.current = {
      from,
      fromDist,
      toDist: distance,
      rotation: new THREE.Quaternion().setFromUnitVectors(from, to),
      duration: Math.min(1.5, 0.55 + from.angleTo(to) * 0.35),
      t: 0,
      notify: true,
    };
  }, [focus, camera, distance, restDistance]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const cancel = () => {
      if (tween.current && !tween.current.done) tween.current = null;
    };
    c.addEventListener("start", cancel);
    return () => c.removeEventListener("start", cancel);
  }, [controls]);

  const step = useMemo(() => new THREE.Quaternion(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const tw = tween.current;
    if (!tw || tw.done) return;
    tw.t = Math.min(1, tw.t + dt / tw.duration);
    const k = easeInOut(tw.t);
    step.identity().slerp(tw.rotation, k);
    dir.copy(tw.from).applyQuaternion(step);
    camera.position.copy(dir.multiplyScalar(THREE.MathUtils.lerp(tw.fromDist, tw.toDist, k)));
    camera.lookAt(0, 0, 0);
    controls.current?.update();
    if (tw.t === 1) {
      tw.done = true;
      if (tw.notify) onArrive?.(focus);
    }
  });

  return null;
}

export default function Globe({ locations, hovered, focus, paused, isMobile, onHover, onSelect, onArrive }) {
  const controls = useRef();
  const restDistance = isMobile ? 13 : 8.4;
  const focusDistance = isMobile ? 11 : 6.6;
  const initialPosition = useMemo(
    () => latLngToVector3(28, -32, restDistance).toArray(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 2]}
      camera={{ position: initialPosition, fov: 38, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={["#0a0a0b"]} />
      <Stars />
      <Sphere />
      <Graticule />
      <LandDots count={isMobile ? 22000 : 34000} />
      {locations.map((loc, i) => (
        <Pin
          key={loc.id}
          location={loc}
          index={i}
          emphasized={hovered === loc.id || focus?.id === loc.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={isMobile ? 0.55 : 0.7}
        zoomSpeed={0.6}
        minDistance={isMobile ? 6.5 : 4.2}
        maxDistance={isMobile ? 18 : 13}
        autoRotate={!focus && !hovered}
        autoRotateSpeed={0.35}
      />
      <CameraRig
        focus={focus}
        distance={focusDistance}
        restDistance={restDistance}
        controls={controls}
        onArrive={onArrive}
      />
    </Canvas>
  );
}
