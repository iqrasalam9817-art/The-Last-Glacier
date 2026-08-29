import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ACTS } from "@/content/glacier";
import { useExperience } from "@/store/experience";
import { GlacierNav } from "@/components/ui-glacier/GlacierNav";
import { ArchiveLoader } from "@/components/ui-glacier/Loader";
import { Eyebrow, FrostedPanel, Statement } from "@/components/ui-glacier/Panel";
import {
  CoreLayerList,
  FutureConsole,
  LayerToggles,
  RiverStops,
  TimeScrubber,
} from "@/components/ui-glacier/Controls";
import { StoryMode } from "@/components/ui-glacier/StoryMode";
import { AnimatedText, RevealBlock } from "@/components/ui-glacier/AnimatedText";

const Stage = lazy(() =>
  import("@/components/scene/Stage").then((m) => ({ default: m.Stage })),
);

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "The Last Glacier — An interactive climate story in 3D" },
      {
        name: "description",
        content:
          "Enter a cinematic 3D glacier valley: read the ice archive, scrub through time, follow the meltwater downstream, and test possible futures.",
      },
      { property: "og:title", content: "The Last Glacier — An interactive climate story in 3D" },
      {
        property: "og:description",
        content:
          "A digital installation about ice, memory, water and choice. Explore the valley, move through time, and take a future card with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journey,
});

function useActObserver() {
  const setAct = useExperience((s) => s.setAct);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setAct(Number((visible.target as HTMLElement).dataset["act"]));
      },
      { threshold: [0.35, 0.6], rootMargin: "-15% 0px -25% 0px" },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [setAct]);

  return refs;
}

function Act({
  index,
  refs,
  children,
  align = "left",
}: {
  index: number;
  refs: React.RefObject<(HTMLElement | null)[]>;
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  const act = ACTS[index]!;
  const place =
    align === "right"
      ? "justify-end"
      : align === "center"
        ? "justify-center"
        : "justify-start";

  return (
    <section
      id={act.id}
      data-act={index}
      ref={(el) => {
        refs.current[index] = el;
      }}
      className={`relative flex min-h-screen items-center px-6 py-28 sm:px-10 ${place}`}
    >
      <div className="w-full max-w-xl space-y-6">
        <Eyebrow>{act.eyebrow}</Eyebrow>
        <AnimatedText
          as="h2"
          text={act.title}
          className="font-display text-4xl leading-[1.05] text-frost sm:text-5xl"
        />
        <Statement>{act.statement}</Statement>
        <RevealBlock delay={120}>
          <p className="max-w-lg text-sm leading-relaxed text-mist">{act.body}</p>
        </RevealBlock>
        {children}
      </div>
    </section>
  );
}

function Journey() {
  const refs = useActObserver();
  const [fallback, setFallback] = useState(false);
  const captions = useExperience((s) => s.captions);
  const act = useExperience((s) => s.act);

  if (fallback) {
    return (
      <>
        <GlacierNav />
        <StoryMode />
      </>
    );
  }

  return (
    <div className="relative">
      <ArchiveLoader />
      <GlacierNav />

      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <Stage onFallback={setFallback} />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_35%,var(--abyss)_100%)]" />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-screen items-center px-6 py-32 sm:px-10">
          <div className="max-w-2xl">
            <p className="rise eyebrow-drift text-glow-soft text-[11px] uppercase tracking-[0.4em] text-mist">
              An interactive climate story
            </p>
            <h1 className="text-3d-stage text-3d mt-6 font-display text-6xl leading-[0.95] text-frost sm:text-8xl">
              <AnimatedText text="The Last" delay={150} depth={false} />{" "}
              <em className="not-italic">
                <AnimatedText
                  text="Glacier"
                  className="text-shimmer font-display italic"
                  delay={480}
                  depth={false}
                />
              </em>
            </h1>
            <p
              className="rise mt-7 max-w-md text-base leading-relaxed text-mist"
              style={{ animationDelay: "300ms" }}
            >
              A glacier is not just ice. It is <em className="text-frost">memory</em>,{" "}
              <em className="text-frost">water</em>, habitat, climate history, and{" "}
              <em className="text-frost">home</em>. Walk into the valley before the light
              goes.
            </p>
            <div
              className="rise mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "450ms" }}
            >
              <a
                href="#ice-core"
                className="rounded-full bg-frost px-6 py-3 text-sm font-medium text-abyss transition-transform hover:scale-[1.03]"
              >
                Enter the Ice
              </a>
              <Link
                to="/explore"
                className="rounded-full border border-frost/25 px-6 py-3 text-sm text-mist transition-colors hover:border-glacier/50 hover:text-frost"
              >
                Explore freely
              </Link>
            </div>

            <dl
              className="rise mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-frost/10 pt-6"
              style={{ animationDelay: "900ms" }}
            >
              {[
                ["Elevation", "2,940 m"],
                ["Air temp", "−11 °C"],
                ["Archive depth", "118 m"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-mist">{k}</dt>
                  <dd className="mt-1 font-display text-xl text-glacier">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div id="journey" />

        <Act index={0} refs={refs} />

        <Act index={1} refs={refs} align="left">
          <CoreLayerList />
          <a
            href="#surface"
            className="inline-block text-[12px] uppercase tracking-[0.22em] text-mist transition-colors hover:text-frost"
          >
            Return to surface →
          </a>
        </Act>

        <Act index={2} refs={refs} align="right">
          <TimeScrubber />
        </Act>

        <Act index={3} refs={refs} align="left">
          <RiverStops />
        </Act>

        <section
          id="future"
          data-act={4}
          ref={(el) => {
            refs.current[4] = el;
          }}
          className="relative min-h-screen px-6 py-28 sm:px-10"
        >
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="max-w-xl space-y-5">
              <Eyebrow>{ACTS[4]!.eyebrow}</Eyebrow>
              <AnimatedText
                as="h2"
                text={ACTS[4]!.title}
                className="font-display text-4xl leading-tight text-frost sm:text-5xl"
              />
              <RevealBlock delay={120}>
                <p className="text-sm leading-relaxed text-mist">{ACTS[4]!.body}</p>
              </RevealBlock>
            </div>
            <FutureConsole />
          </div>
        </section>

        <section
          id="reflection"
          data-act={5}
          ref={(el) => {
            refs.current[5] = el;
          }}
          className="relative flex min-h-screen items-center justify-center px-6 py-28 text-center"
        >
          <div className="max-w-2xl space-y-8">
            <Eyebrow>{ACTS[5]!.eyebrow}</Eyebrow>
            <p className="text-3d-stage text-3d font-display text-4xl leading-tight text-frost sm:text-6xl">
              <AnimatedText text="If the ice remembers everything," depth={false} />{" "}
              <em className="not-italic">
                <AnimatedText
                  text="what would you want it to remember about now?"
                  className="text-shimmer font-display italic"
                  delay={420}
                  stagger={18}
                  depth={false}
                />
              </em>
            </p>
            <RevealBlock delay={120}>
              <p className="text-sm leading-relaxed text-mist">{ACTS[5]!.body}</p>
            </RevealBlock>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/explore"
                className="rounded-full bg-frost px-6 py-3 text-sm font-medium text-abyss transition-transform hover:scale-[1.03]"
              >
                Explore the valley freely
              </Link>
              <Link
                to="/sources"
                className="rounded-full border border-frost/25 px-6 py-3 text-sm text-mist transition-colors hover:border-glacier/50 hover:text-frost"
              >
                Sources & method
              </Link>
            </div>
            <div className="pt-6">
              <LayerToggles />
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-frost/10 px-6 py-10 text-center text-xs text-mist sm:px-10">
          The Last Glacier — an illustrative work. Numbers on screen are for storytelling,
          not measurement. <Link to="/sources" className="text-glacier">Read the method</Link>.
        </footer>
      </main>

      {captions && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
          <p className="frosted rounded-full px-5 py-2 text-[12px] text-mist">
            {ACTS[act]?.statement}
          </p>
        </div>
      )}
    </div>
  );
}
