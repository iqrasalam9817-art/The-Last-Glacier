import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { GlacierWorld } from "./GlacierWorld";
import { useExperience } from "@/store/experience";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Stage({ onFallback }: { onFallback: (v: boolean) => void }) {
  const setQuality = useExperience((s) => s.setQuality);
  const calm = useExperience((s) => s.calm);
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const supported = webglAvailable();
    setOk(supported);
    onFallback(!supported);
    const cores = navigator.hardwareConcurrency ?? 4;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setQuality(mobile || cores <= 4 ? "low" : cores <= 8 ? "medium" : "high");
  }, [onFallback, setQuality]);

  if (ok === false) return null;

  return (
    <Canvas
      frameloop={calm ? "demand" : "always"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 13, 78], fov: 52, near: 0.1, far: 600 }}
    >
      <Suspense fallback={null}>
        <GlacierWorld />
      </Suspense>
    </Canvas>
  );
}
