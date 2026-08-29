import { createFileRoute, Link } from "@tanstack/react-router";
import { GlacierNav } from "@/components/ui-glacier/GlacierNav";
import { Eyebrow, FrostedPanel, ProvenanceTag } from "@/components/ui-glacier/Panel";
import { AnimatedText, RevealBlock } from "@/components/ui-glacier/AnimatedText";
import { SOURCES } from "@/content/glacier";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources & Method — The Last Glacier" },
      {
        name: "description",
        content:
          "What is observed, what is modelled, what is illustrative, and what is written for the story — plus how the future scenarios are calculated.",
      },
      { property: "og:title", content: "Sources & Method — The Last Glacier" },
      {
        property: "og:description",
        content:
          "Plain-language notes on the data, models, and storytelling behind The Last Glacier.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sources,
});

function Sources() {
  return (
    <>
      <GlacierNav />
      <main className="mx-auto max-w-3xl px-6 py-32 sm:px-10">
        <Eyebrow>Sources & method</Eyebrow>
        <AnimatedText
          as="h1"
          text="What is measured, and what is written"
          className="mt-5 block font-display text-5xl leading-tight text-frost sm:text-6xl"
        />
        <RevealBlock delay={100}>
          <p className="mt-6 text-sm leading-relaxed text-mist">
            The journey is poetic; this page is precise. Every number on screen carries one of
            four labels so you always know what you are looking at.
          </p>
        </RevealBlock>

        <div className="mt-10 flex flex-wrap gap-2">
          <ProvenanceTag value="OBSERVED" />
          <ProvenanceTag value="MODELED" />
          <ProvenanceTag value="ILLUSTRATIVE" />
          <ProvenanceTag value="FICTIONAL STORY ELEMENT" />
        </div>

        <div className="mt-12 space-y-4">
          {SOURCES.map((s) => (
            <FrostedPanel key={s.title}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-frost">{s.title}</h2>
                <ProvenanceTag value={s.provenance} />
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-mist">{s.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{s.note}</p>
            </FrostedPanel>
          ))}
        </div>

        <section className="mt-16 space-y-4">
          <h2 className="font-display text-3xl text-frost">How the future model works</h2>
          <p className="text-sm leading-relaxed text-mist">
            Five levers each carry a weight for ice stability, water reliability, ecosystem
            health, and community resilience. Moving a lever adds its weighted contribution
            to each outcome; uncertainty rises when the levers disagree with each other and
            falls as overall ambition rises. It is a teaching device for interdependence —
            not a projection of any real catchment.
          </p>
          <h2 className="pt-4 font-display text-3xl text-frost">Assets and craft</h2>
          <p className="text-sm leading-relaxed text-mist">
            Terrain, glacier geometry, meltwater, aurora, snow, and the ice core texture are
            generated procedurally in the browser with Three.js — no photographic assets and
            no stock imagery. Typography is Instrument Serif and Inter.
          </p>
        </section>

        <p className="mt-16 text-xs text-mist">
          <Link to="/" className="text-glacier">
            Return to the valley
          </Link>
        </p>
      </main>
    </>
  );
}
