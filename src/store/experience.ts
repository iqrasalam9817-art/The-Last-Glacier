import { create } from "zustand";
import { LEVERS, type LayerId } from "@/content/glacier";

export type Quality = "low" | "medium" | "high";

type State = {
  act: number;
  setAct: (a: number) => void;
  timeIndex: number;
  setTimeIndex: (i: number) => void;
  coreLayer: number;
  setCoreLayer: (i: number) => void;
  riverStop: number;
  setRiverStop: (i: number) => void;
  levers: Record<string, number>;
  setLever: (id: string, v: number) => void;
  layers: Record<LayerId, boolean>;
  toggleLayer: (id: LayerId) => void;
  sound: boolean;
  toggleSound: () => void;
  captions: boolean;
  toggleCaptions: () => void;
  calm: boolean;
  toggleCalm: () => void;
  quality: Quality;
  setQuality: (q: Quality) => void;
};

export const useExperience = create<State>((set) => ({
  act: 0,
  setAct: (act) => set({ act }),
  timeIndex: 1,
  setTimeIndex: (timeIndex) => set({ timeIndex }),
  coreLayer: 0,
  setCoreLayer: (coreLayer) => set({ coreLayer }),
  riverStop: 0,
  setRiverStop: (riverStop) => set({ riverStop }),
  levers: Object.fromEntries(LEVERS.map((l) => [l.id, 40])),
  setLever: (id, v) => set((s) => ({ levers: { ...s.levers, [id]: v } })),
  layers: { ice: true, water: true, aurora: true, human: true, labels: true },
  toggleLayer: (id) => set((s) => ({ layers: { ...s.layers, [id]: !s.layers[id] } })),
  sound: false,
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  captions: true,
  toggleCaptions: () => set((s) => ({ captions: !s.captions })),
  calm: false,
  toggleCalm: () => set((s) => ({ calm: !s.calm })),
  quality: "high",
  setQuality: (quality) => set({ quality }),
}));

export function scoreFutures(levers: Record<string, number>) {
  const acc = { ice: 0, water: 0, eco: 0, community: 0 };
  let total = 0;
  for (const lever of LEVERS) {
    const v = (levers[lever.id] ?? 0) / 100;
    total += v;
    acc.ice += v * lever.weights.ice;
    acc.water += v * lever.weights.water;
    acc.eco += v * lever.weights.eco;
    acc.community += v * lever.weights.community;
  }
  const norm = (n: number, max: number) => Math.round(Math.min(1, n / max) * 100);
  const spread =
    Math.max(...LEVERS.map((l) => levers[l.id] ?? 0)) -
    Math.min(...LEVERS.map((l) => levers[l.id] ?? 0));
  return {
    ice: norm(acc.ice, 0.78),
    water: norm(acc.water, 1.02),
    eco: norm(acc.eco, 0.96),
    community: norm(acc.community, 1.04),
    uncertainty: Math.round(20 + spread * 0.5 - (total / LEVERS.length) * 12),
    ambition: Math.round((total / LEVERS.length) * 100),
  };
}
