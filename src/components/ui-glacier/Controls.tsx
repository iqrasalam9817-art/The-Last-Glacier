import { useRef } from "react";
import {
  CORE_LAYERS,
  LAYERS,
  LEVERS,
  RIVER_STOPS,
  TIMELINE,
  type LayerId,
} from "@/content/glacier";
import { scoreFutures, useExperience } from "@/store/experience";
import { FrostedPanel, Meter, ProvenanceTag } from "./Panel";

/* ------------------------------------------------ timeline */

export function TimeScrubber() {
  const timeIndex = useExperience((s) => s.timeIndex);
  const setTimeIndex = useExperience((s) => s.setTimeIndex);
  const state = TIMELINE[timeIndex]!;

  return (
    <FrostedPanel>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Time scrubber</p>
          <p className="font-display text-3xl text-frost">{state.year}</p>
        </div>
        <ProvenanceTag value={state.provenance} />
      </div>

      <input
        type="range"
        min={0}
        max={TIMELINE.length - 1}
        step={1}
        value={timeIndex}
        aria-label="Move through time"
        onChange={(e) => setTimeIndex(Number(e.target.value))}
        className="mt-6 h-1 w-full cursor-pointer appearance-none rounded-full bg-frost/15 accent-glacier"
      />

      <div className="mt-3 flex justify-between">
        {TIMELINE.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTimeIndex(i)}
            className={`text-[11px] uppercase tracking-[0.14em] transition-colors ${
              i === timeIndex ? "text-glacier" : "text-mist hover:text-frost"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-mist">{state.note}</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Meter label="Ice extent" value={Math.round(state.extent * 100)} />
        <Meter
          label="Late-summer flow"
          value={Math.round(Math.min(1, state.extent * 1.15) * 100)}
          accent="meltwater"
        />
      </div>
    </FrostedPanel>
  );
}

/* ------------------------------------------------ ice core */

export function CoreLayerList() {
  const coreLayer = useExperience((s) => s.coreLayer);
  const setCoreLayer = useExperience((s) => s.setCoreLayer);

  return (
    <FrostedPanel>
      <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Read the layers</p>
      <ul className="mt-5 space-y-1">
        {CORE_LAYERS.map((l, i) => (
          <li key={l.depth}>
            <button
              onClick={() => setCoreLayer(i)}
              aria-current={i === coreLayer}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                i === coreLayer
                  ? "border-glacier/45 bg-glacier/10"
                  : "border-transparent hover:border-frost/15"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg text-frost">{l.label}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                  {l.depth} · {l.era}
                </span>
              </div>
              {i === coreLayer && (
                <p className="mt-2 text-sm leading-relaxed text-mist">{l.detail}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </FrostedPanel>
  );
}

/* ------------------------------------------------ river */

export function RiverStops() {
  const riverStop = useExperience((s) => s.riverStop);
  const setRiverStop = useExperience((s) => s.setRiverStop);
  const stop = RIVER_STOPS[riverStop]!;

  return (
    <FrostedPanel>
      <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Downstream</p>
      <ol className="mt-5 flex flex-wrap gap-2">
        {RIVER_STOPS.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => setRiverStop(i)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                i === riverStop
                  ? "border-meltwater/60 bg-meltwater/15 text-frost"
                  : "border-frost/15 text-mist hover:text-frost"
              }`}
            >
              {String(i + 1).padStart(2, "0")} · {s.name}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-6 font-display text-2xl text-frost">{stop.line}</p>
      <p className="mt-2 text-sm leading-relaxed text-mist">{stop.detail}</p>
    </FrostedPanel>
  );
}

/* ------------------------------------------------ futures */

export function FutureConsole() {
  const levers = useExperience((s) => s.levers);
  const setLever = useExperience((s) => s.setLever);
  const scores = scoreFutures(levers);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <FrostedPanel>
        <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Collective choices</p>
        <div className="mt-6 space-y-6">
          {LEVERS.map((l) => (
            <div key={l.id}>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={l.id} className="text-sm text-frost">
                  {l.label}
                </label>
                <span className="font-display text-lg text-glacier">{levers[l.id]}</span>
              </div>
              <input
                id={l.id}
                type="range"
                min={0}
                max={100}
                value={levers[l.id]}
                onChange={(e) => setLever(l.id, Number(e.target.value))}
                className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-frost/15 accent-mint"
              />
              <p className="mt-2 text-xs leading-relaxed text-mist">{l.detail}</p>
            </div>
          ))}
        </div>
      </FrostedPanel>

      <div className="space-y-6">
        <FrostedPanel>
          <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Valley response</p>
          <div className="mt-6 space-y-5">
            <Meter label="Ice stability" value={scores.ice} />
            <Meter label="Seasonal water reliability" value={scores.water} accent="meltwater" />
            <Meter label="Ecosystem health" value={scores.eco} accent="mint" />
            <Meter label="Community resilience" value={scores.community} accent="mint" />
            <Meter
              label="Long-term uncertainty"
              value={Math.max(4, scores.uncertainty)}
              accent="amber"
            />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-mist">
            Illustrative model. Uncertainty falls when ambition is high and rises when the
            levers pull against each other — no single choice carries the valley alone.
          </p>
        </FrostedPanel>
        <FutureCard />
      </div>
    </div>
  );
}

/* ------------------------------------------------ future card */

function FutureCard() {
  const levers = useExperience((s) => s.levers);
  const scores = scoreFutures(levers);
  const busy = useRef(false);

  const download = () => {
    if (busy.current) return;
    busy.current = true;
    const w = 1200;
    const h = 675;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#07131F");
    bg.addColorStop(1, "#0D2635");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(141,231,245,0.35)";
    ctx.strokeRect(48, 48, w - 96, h - 96);

    ctx.fillStyle = "#A9BDC3";
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText("THE LAST GLACIER — FUTURE CARD", 90, 120);

    ctx.fillStyle = "#F3FAF8";
    ctx.font = "58px 'Instrument Serif', Georgia, serif";
    ctx.fillText("What will remain depends on", 90, 220);
    ctx.fillText("what we choose together.", 90, 288);

    const rows: [string, number][] = [
      ["Ice stability", scores.ice],
      ["Water reliability", scores.water],
      ["Ecosystem health", scores.eco],
      ["Community resilience", scores.community],
    ];
    rows.forEach(([label, value], i) => {
      const y = 380 + i * 58;
      ctx.fillStyle = "#A9BDC3";
      ctx.font = "22px Inter, sans-serif";
      ctx.fillText(label, 90, y);
      ctx.fillStyle = "rgba(243,250,248,0.12)";
      ctx.fillRect(420, y - 16, 520, 8);
      ctx.fillStyle = "#8DE7F5";
      ctx.fillRect(420, y - 16, (520 * value) / 100, 8);
      ctx.fillStyle = "#F3FAF8";
      ctx.font = "22px Inter, sans-serif";
      ctx.fillText(String(value), 960, y);
    });

    ctx.fillStyle = "#B9F6D3";
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText(`Ambition ${scores.ambition} / 100 — illustrative scenario`, 90, h - 100);

    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "the-last-glacier-future-card.png";
    a.click();
    busy.current = false;
  };

  return (
    <FrostedPanel>
      <p className="text-[11px] uppercase tracking-[0.3em] text-mist">Your future card</p>
      <p className="mt-4 font-display text-2xl leading-snug text-frost">
        What will remain depends on <em className="text-glacier">what we choose together.</em>
      </p>
      <p className="mt-3 text-sm text-mist">
        Ambition {scores.ambition} / 100. No account, no email, no tracking — just an image.
      </p>
      <button
        onClick={download}
        className="mt-5 rounded-full bg-frost px-5 py-2.5 text-[13px] font-medium text-abyss transition-transform hover:scale-[1.03]"
      >
        Download the card
      </button>
    </FrostedPanel>
  );
}

/* ------------------------------------------------ layers */

export function LayerToggles() {
  const layers = useExperience((s) => s.layers);
  const toggleLayer = useExperience((s) => s.toggleLayer);
  return (
    <div className="flex flex-wrap gap-2">
      {LAYERS.map((l) => (
        <button
          key={l.id}
          onClick={() => toggleLayer(l.id as LayerId)}
          aria-pressed={layers[l.id as LayerId]}
          className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
            layers[l.id as LayerId]
              ? "border-glacier/50 bg-glacier/10 text-frost"
              : "border-frost/15 text-mist hover:text-frost"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
