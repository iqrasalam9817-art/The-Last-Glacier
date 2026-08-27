import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "@/store/experience";
import { CORE_LAYERS, TIMELINE } from "@/content/glacier";
import { makeAuroraTexture, makeCoreTexture, makeGlowTexture } from "./textures";

const GLACIER = "#8DE7F5";
const MELT = "#49C9D9";

/* ---------------------------------------------- helpers */

function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, z: number) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi);
  const b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1);
  const d = hash(xi + 1, zi + 1);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
function fbm(x: number, z: number) {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < 4; i++) {
    sum += amp * noise(x * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

/** U-shaped valley running along Z, rising toward the head (-Z). */
function terrainHeight(x: number, z: number) {
  const walls = Math.min(26, Math.pow(Math.abs(x) / 5.2, 2.2));
  const headRise = Math.max(0, (-z - 10) * 0.22);
  const ridges = fbm(x * 0.055 + 10, z * 0.045 + 4) * (6 + walls * 0.55);
  const floor = -1.2 + Math.sin(z * 0.05) * 0.6;
  return floor + walls + headRise + ridges;
}

/* ---------------------------------------------- terrain */

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 260, 150, 170);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} receiveShadow position={[0, 0, -30]}>
      <meshStandardMaterial color="#122736" roughness={0.95} metalness={0.05} flatShading />
    </mesh>
  );
}

/* ---------------------------------------------- glacier */

function terminusZ(extent: number) {
  return -70 + extent * 118;
}

function Glacier({ extent }: { extent: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 46, 150);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#bfeefb",
        emissive: new THREE.Color(GLACIER),
        emissiveIntensity: 0.22,
        roughness: 0.18,
        metalness: 0.02,
        transparent: true,
        opacity: 0.93,
        flatShading: true,
      }),
    [],
  );

  const shaped = useRef(-1);
  useFrame((state) => {
    const e = extent;
    if (Math.abs(shaped.current - e) > 0.001) {
      shaped.current = e;
      const head = -70;
      const tail = terminusZ(e);
      const len = tail - head;
      const pos = geo.attributes['position'] as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i) + 0.5; // 0..1 across
        const v = pos.getZ(i) + 0.5; // 0..1 along
        const z = head + v * len;
        const taper = 0.55 + 0.45 * Math.pow(1 - v, 0.6);
        const width = (10 + e * 9) * taper;
        const x = (u - 0.5) * 2 * width;
        const crown = Math.cos((u - 0.5) * Math.PI) * (2.4 + e * 2.2);
        const flow = Math.sin(v * 26 + u * 5) * 0.35 + fbm(x * 0.12, z * 0.09) * 1.6;
        const slope = (1 - v) * (10 + e * 6);
        const snout = v > 0.93 ? -(v - 0.93) * 55 : 0;
        pos.setXYZ(i, x, -1.5 + crown + flow + slope + snout, z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
    if (ref.current) {
      const t = state.clock.elapsedTime;
      material.emissiveIntensity = 0.2 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group position={[0, 0, -30]}>
      <mesh ref={ref} geometry={geo} material={material} castShadow receiveShadow />
      <mesh geometry={geo}>
        <meshBasicMaterial color={GLACIER} wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------- meltwater */

function riverCurve(extent: number) {
  const start = terminusZ(extent) - 30;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const z = start + t * (86 - start);
    const x = Math.sin(t * 4.2) * (2 + t * 9);
    const y = -1.4 - t * 1.2;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function River({ extent }: { extent: number }) {
  const curve = useMemo(() => riverCurve(extent), [extent]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.75, 10, false), [curve]);
  const sprite = useMemo(() => makeGlowTexture(MELT), []);
  const count = 220;
  const pointsRef = useRef<THREE.Points>(null);
  const offsets = useMemo(
    () => Float32Array.from({ length: count }, () => Math.random()),
    [],
  );
  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const attr = pts.geometry.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      offsets[i] = (offsets[i]! + delta * 0.05) % 1;
      const p = curve.getPointAt(offsets[i]!);
      attr.setXYZ(
        i,
        p.x + Math.sin(state.clock.elapsedTime * 2 + i) * 0.35,
        p.y + 0.35,
        p.z,
      );
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={MELT}
          emissive={MELT}
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          map={sprite}
          color={MELT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Basin({ extent }: { extent: number }) {
  const z = terminusZ(extent) - 30 + 14;
  const scale = 1 + (1 - extent) * 0.9;
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.35, z]} scale={[scale, scale, 1]}>
      <circleGeometry args={[15, 64]} />
      <meshStandardMaterial
        color="#0b2b3a"
        emissive={MELT}
        emissiveIntensity={0.16}
        roughness={0.07}
        metalness={0.92}
      />
    </mesh>
  );
}

/* ---------------------------------------------- atmosphere */

function Snow({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const sprite = useMemo(() => makeGlowTexture("#F3FAF8"), []);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 180;
      a[i * 3 + 1] = Math.random() * 60;
      a[i * 3 + 2] = (Math.random() - 0.5) * 200 - 20;
    }
    return a;
  }, [count]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) - delta * (1.2 + (i % 5) * 0.35);
      if (y < -2) y = 60;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(state.clock.elapsedTime * 0.4 + i) * delta * 0.7);
    }
    attr.needsUpdate = true;
    pts.rotation.y = THREE.MathUtils.lerp(pts.rotation.y, state.pointer.x * 0.06, 0.03);
    pts.position.y = THREE.MathUtils.lerp(pts.position.y, state.pointer.y * 1.6, 0.03);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.55}
        map={sprite}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Stars() {
  const sprite = useMemo(() => makeGlowTexture("#F3FAF8"), []);
  const positions = useMemo(() => {
    const n = 500;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.38;
      a[i * 3] = Math.cos(theta) * Math.sin(phi + 0.1) * r;
      a[i * 3 + 1] = Math.cos(phi) * r * 0.6 + 20;
      a[i * 3 + 2] = Math.sin(theta) * Math.sin(phi + 0.1) * r;
    }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        map={sprite}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Aurora() {
  const tex = useMemo(() => makeAuroraTexture(), []);
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g1.current) {
      g1.current.position.x = Math.sin(t * 0.05) * 14;
      (g1.current.material as THREE.MeshBasicMaterial).opacity = 0.42 + Math.sin(t * 0.3) * 0.12;
    }
    if (g2.current) {
      g2.current.position.x = Math.cos(t * 0.04) * 22;
      (g2.current.material as THREE.MeshBasicMaterial).opacity = 0.24 + Math.cos(t * 0.22) * 0.1;
    }
  });
  return (
    <group position={[0, 44, -150]}>
      <mesh ref={g1}>
        <planeGeometry args={[300, 70]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={g2} position={[0, 14, -30]} rotation-z={0.06}>
        <planeGeometry args={[340, 50]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------- ice core */

function IceCore({ visible, layer }: { visible: boolean; layer: number }) {
  const tex = useMemo(() => makeCoreTexture(layer, CORE_LAYERS.length), [layer]);
  const group = useRef<THREE.Group>(null);
  const sprite = useMemo(() => makeGlowTexture("#B9F6D3"), []);
  const motes = useMemo(() => {
    const n = 120;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.9 + Math.random() * 1.4;
      const t = Math.random() * Math.PI * 2;
      a[i * 3] = Math.cos(t) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * 15;
      a[i * 3 + 2] = Math.sin(t) * r;
    }
    return a;
  }, []);
  const moteRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      const target = visible ? 1 : 0.001;
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(group.current.scale.x, target, 0.06),
      );
      group.current.visible = group.current.scale.x > 0.01;
    }
    if (moteRef.current) moteRef.current.rotation.y -= delta * 0.35;
    void state;
  });

  const bandY = 7.5 - (layer + 0.5) * (15 / CORE_LAYERS.length);

  return (
    <group ref={group} position={[19, 8, 10]} rotation-z={0.07} scale={0.001}>
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 1.5, 15, 40, 1, false]} />
        <meshStandardMaterial map={tex} roughness={0.22} metalness={0.05} transparent opacity={0.96} />
      </mesh>
      <mesh position={[0, bandY, 0]}>
        <torusGeometry args={[1.75, 0.05, 12, 60]} />
        <meshBasicMaterial color="#B9F6D3" />
      </mesh>
      <pointLight position={[0, bandY, 3]} color="#B9F6D3" intensity={12} distance={16} />
      <points ref={moteRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[motes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          map={sprite}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ---------------------------------------------- human scale */

function Settlement({ stop }: { stop: number }) {
  const lights = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (lights.current) {
      const f = 0.75 + Math.sin(state.clock.elapsedTime * 1.7) * 0.1;
      lights.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (m?.opacity !== undefined) m.opacity = Math.min(1, f + i * 0.05);
      });
    }
  });

  const cabins = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: 8 + Math.sin(i * 2.3) * 7 + i * 0.6,
        z: 58 + Math.cos(i * 1.7) * 9,
        s: 0.8 + (i % 3) * 0.25,
      })),
    [],
  );

  return (
    <group>
      {cabins.map((c, i) => (
        <group key={i} position={[c.x, -1.2, c.z]} scale={c.s}>
          <mesh castShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[1.6, 1.4, 1.4]} />
            <meshStandardMaterial color="#0e2130" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.7, 0]} rotation-y={Math.PI / 4}>
            <coneGeometry args={[1.35, 0.9, 4]} />
            <meshStandardMaterial color="#15303f" roughness={0.85} />
          </mesh>
        </group>
      ))}
      <group ref={lights}>
        {cabins.map((c, i) => (
          <mesh key={i} position={[c.x + 0.82 * c.s, -0.55, c.z]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[0.42, 0.34]} />
            <meshBasicMaterial color="#F4C27A" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
      <pointLight
        position={[12, 2, 58]}
        color="#F4C27A"
        intensity={stop >= 4 ? 22 : 8}
        distance={40}
      />
      {/* trail markers give human scale along the river */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-4 + i * 1.6, -1.1, 20 + i * 2.6]}>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#164C59" emissive="#164C59" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------- camera */

const CAM: Record<number, { pos: [number, number, number]; look: [number, number, number] }> = {
  0: { pos: [0, 13, 78], look: [0, 10, -30] },
  1: { pos: [19, 10, 32], look: [19, 7, 10] },
  2: { pos: [2, 40, 60], look: [0, 2, -18] },
  3: { pos: [-14, 8, 46], look: [6, -1, 62] },
  4: { pos: [0, 26, 74], look: [0, 4, -6] },
  5: { pos: [0, 16, 96], look: [0, 14, -40] },
};

function Rig({ act }: { act: number }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 10, -30));
  useFrame((state, delta) => {
    const target = CAM[act] ?? CAM[0]!;
    const k = 1 - Math.exp(-1.1 * Math.min(delta, 0.05) * 3);
    const drift = new THREE.Vector3(
      state.pointer.x * 2.6,
      state.pointer.y * 1.4,
      0,
    );
    camera.position.lerp(
      new THREE.Vector3(...target.pos).add(drift),
      k,
    );
    look.current.lerp(new THREE.Vector3(...target.look), k);
    camera.lookAt(look.current);
  });
  return null;
}

/* ---------------------------------------------- world */

export function GlacierWorld() {
  const act = useExperience((s) => s.act);
  const timeIndex = useExperience((s) => s.timeIndex);
  const coreLayer = useExperience((s) => s.coreLayer);
  const riverStop = useExperience((s) => s.riverStop);
  const layers = useExperience((s) => s.layers);
  const quality = useExperience((s) => s.quality);

  const extentTarget = TIMELINE[timeIndex]?.extent ?? 0.72;
  const stepped = Math.round(extentTarget * 100) / 100;
  const snowCount = quality === "low" ? 260 : quality === "medium" ? 700 : 1400;

  return (
    <>
      <color attach="background" args={["#07131F"]} />
      <fog attach="fog" args={["#07131F", 70, 250]} />

      <ambientLight intensity={0.35} color="#8DE7F5" />
      <hemisphereLight args={["#8DE7F5", "#07131F", 0.5]} />
      <directionalLight
        position={[-60, 70, -40]}
        intensity={1.6}
        color="#dff4ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment>
        <Lightformer intensity={1.6} color="#8DE7F5" position={[0, 30, -60]} scale={[60, 30, 1]} />
        <Lightformer
          intensity={0.9}
          color="#164C59"
          position={[-40, 10, 20]}
          rotation-y={Math.PI / 2}
          scale={[60, 20, 1]}
        />
        <Lightformer
          intensity={0.7}
          color="#B9F6D3"
          position={[40, 16, -10]}
          rotation-y={-Math.PI / 2}
          scale={[40, 16, 1]}
        />
      </Environment>

      <Stars />
      {layers.aurora && <Aurora />}
      <Terrain />
      {layers.ice && <Glacier extent={stepped} />}
      {layers.water && (
        <>
          <River extent={stepped} />
          <Basin extent={stepped} />
        </>
      )}
      {layers.human && <Settlement stop={riverStop} />}
      <IceCore visible={act === 1} layer={coreLayer} />
      <Snow count={snowCount} />
      <Rig act={act} />
    </>
  );
}
