import { Link } from "@tanstack/react-router";
import { ACTS, CORE_LAYERS, RIVER_STOPS, TIMELINE } from "@/content/glacier";
import { Eyebrow, FrostedPanel, ProvenanceTag } from "./Panel";
import { FutureConsole, TimeScrubber } from "./Controls";

/** Complete 2D narrative for devices without WebGL or visitors who prefer no 3D. */
export function StoryMode() {
  return (
    <main className="relative mx-auto max-w-3xl px-6 py-32 sm:px-10">
      <Eyebrow>2D Story Mode</Eyebrow>
      <h1 className="mt-5 font-display text-5xl leading-[0.98] text-frost sm:text-7xl">
        The Last <em className="text-glacier">Glacier</em>
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-mist">
        Your device is running the full narrative without the 3D environment. Nothing in the
        story, the timeline, the data, or the future card is missing here.
      </p>

      <div className="mt-16 space-y-16">
        {ACTS.map((act) => (
          <article key={act.id} id={act.id} className="space-y-4">
            <Eyebrow>{act.eyebrow}</Eyebrow>
            <h2 className="font-display text-3xl text-frost">{act.title}</h2>
            <p className="font-display text-xl text-glacier">{act.statement}</p>
            <p className="text-sm leading-relaxed text-mist">{act.body}</p>

            {act.id === "ice-core" && (
              <FrostedPanel className="mt-4">
                <ul className="space-y-4">
                  {CORE_LAYERS.map((l) => (
                    <li key={l.depth}>
                      <p className="font-display text-lg text-frost">
                        {l.label}{" "}
                        <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-mist">
                          {l.depth} · {l.era}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-mist">{l.detail}</p>
                    </li>
                  ))}
                </ul>
              </FrostedPanel>
            )}

            {act.id === "surface" && (
              <div className="mt-4 space-y-4">
                <TimeScrubber />
                <FrostedPanel>
                  <ul className="space-y-3">
                    {TIMELINE.map((t) => (
                      <li key={t.id} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-frost">
                          {t.label} · {t.year}
                        </span>
                        <ProvenanceTag value={t.provenance} />
                      </li>
                    ))}
                  </ul>
                </FrostedPanel>
              </div>
            )}

            {act.id === "river" && (
              <FrostedPanel className="mt-4">
                <ol className="space-y-4">
                  {RIVER_STOPS.map((s, i) => (
                    <li key={s.id}>
                      <p className="text-sm text-frost">
                        {String(i + 1).padStart(2, "0")} · {s.name} — {s.line}
                      </p>
                      <p className="mt-1 text-sm text-mist">{s.detail}</p>
                    </li>
                  ))}
                </ol>
              </FrostedPanel>
            )}

            {act.id === "future" && (
              <div className="mt-4">
                <FutureConsole />
              </div>
            )}
          </article>
        ))}
      </div>

      <p className="mt-16 text-xs text-mist">
        <Link to="/sources" className="text-glacier">
          Sources & method
        </Link>
      </p>
    </main>
  );
}
