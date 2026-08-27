import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { GlacierNav } from "@/components/ui-glacier/GlacierNav";
import { StoryMode } from "@/components/ui-glacier/StoryMode";
import { Eyebrow, FrostedPanel } from "@/components/ui-glacier/Panel";
import {
  CoreLayerList,
  LayerToggles,
  RiverStops,
  TimeScrubber,
} from "@/components/ui-glacier/Controls";
import { TIMELINE } from "@/content/glacier";
import { useExperience } from "@/store/experience";

const Stage = lazy(() =>
  import("@/components/scene/Stage").then((m) => ({ default: m.Stage })),
);

export const Route = createFileRoute("/explore")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Explore Mode — The Last Glacier" },
      {
        name: "description",
        content:
          "Free-form exploration of the glacier valley: move the camera between locations, toggle visual layers, scrub the timeline, and read the ice archive.",
      },
      { property: "og:title", content: "Explore Mode — The Last Glacier" },
      {
        property: "og:description",
        content:
          "Orbit the valley, toggle ice, meltwater, aurora and human-scale layers, and move through time at your own pace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

const LOCATIONS = [
  { act: 0, label: "Valley overlook" },
  { act: 1, label: "Ice core station" },
  { act: 2, label: "Terminus survey" },
  { act: 3, label: "Meltwater channel" },
  { act: 5, label: "Wide horizon" },
];

function Explore() {
  const [fallback, setFallback] = useState(false);
  const act = useExperience((s) => s.act);
  const setAct = useExperience((s) => s.setAct);
  const timeIndex = useExperience((s) => s.timeIndex);
  const quality = useExperience((s) => s.quality);

  if (fallback) {
    return (
      <>
        <GlacierNav />
        <StoryMode />
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      <GlacierNav />
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <Stage onFallback={setFallback} />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_0%,transparent_45%,var(--abyss)_100%)]" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 gap-6 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-[320px_1fr_360px]">
        <aside className="space-y-6">
          <FrostedPanel>
            <Eyebrow>Locations</Eyebrow>
            <ul className="mt-4 space-y-1">
              {LOCATIONS.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => setAct(l.act)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      act === l.act
                        ? "bg-glacier/10 text-frost"
                        : "text-mist hover:text-frost"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setAct(0)}
              className="mt-4 rounded-full border border-frost/20 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-mist transition-colors hover:text-frost"
            >
              Reset view
            </button>
          </FrostedPanel>

          <FrostedPanel>
            <Eyebrow>Layers</Eyebrow>
            <div className="mt-4">
              <LayerToggles />
            </div>
          </FrostedPanel>
        </aside>

        <div className="hidden lg:block" aria-hidden />

        <aside className="space-y-6">
          <TimeScrubber />
          <CoreLayerList />
          <RiverStops />
        </aside>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-6">
        <p className="frosted rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-mist">
          {LOCATIONS.find((l) => l.act === act)?.label ?? "Valley"} ·{" "}
          {TIMELINE[timeIndex]?.year} · {quality} detail ·{" "}
          <Link to="/" className="pointer-events-auto text-glacier">
            back to journey
          </Link>
        </p>
      </div>
    </div>
  );
}
