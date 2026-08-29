import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useExperience } from "@/store/experience";

const ITEMS = [
  { label: "Journey", href: "/#journey" },
  { label: "Ice Core", href: "/#ice-core" },
  { label: "River", href: "/#river" },
  { label: "Future", href: "/#future" },
];

function Utility() {
  const { sound, toggleSound, captions, toggleCaptions, calm, toggleCalm } = useExperience();
  const btn =
    "rounded-full border border-frost/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-glacier/50 hover:text-frost";
  return (
    <div className="flex items-center gap-2">
      <button className={btn} onClick={toggleSound} aria-pressed={sound}>
        {sound ? "Sound on" : "Sound off"}
      </button>
      <button className={btn} onClick={toggleCaptions} aria-pressed={captions}>
        {captions ? "CC on" : "CC off"}
      </button>
      <button className={btn} onClick={toggleCalm} aria-pressed={calm}>
        {calm ? "Calm mode" : "Motion"}
      </button>
    </div>
  );
}

export function GlacierNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative block h-4 w-4 rotate-45 border border-glacier/70 bg-glacier/20 shadow-[0_0_18px_rgba(141,231,245,0.6)]" />
          <span className="text-3d-stage text-3d font-display text-xl tracking-wide text-frost transition-transform duration-500 group-hover:[transform:perspective(600px)_rotateX(12deg)_translateY(-1px)]">
            The Last Glacier
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {ITEMS.map((i) => (
            <a
              key={i.label}
              href={i.href}
              className="text-[13px] tracking-wide text-mist transition-colors hover:text-frost"
            >
              {i.label}
            </a>
          ))}
          <Link
            to="/explore"
            className="text-[13px] tracking-wide text-mist transition-colors hover:text-frost"
          >
            Explore
          </Link>
          <Link
            to="/sources"
            className="text-[13px] tracking-wide text-mist transition-colors hover:text-frost"
          >
            Sources
          </Link>
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Utility />
          <a
            href="#journey"
            className="rounded-full bg-frost px-5 py-2 text-[13px] font-medium text-abyss transition-transform hover:scale-[1.03]"
          >
            Enter the Ice
          </a>
        </div>

        <button
          className="rounded-full border border-frost/20 px-4 py-2 text-[12px] uppercase tracking-[0.2em] text-mist xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="frosted mx-6 rounded-2xl p-5 xl:hidden">
          <div className="flex flex-col gap-3">
            {ITEMS.map((i) => (
              <a
                key={i.label}
                href={i.href}
                onClick={() => setOpen(false)}
                className="text-sm text-mist hover:text-frost"
              >
                {i.label}
              </a>
            ))}
            <Link to="/explore" className="text-sm text-mist hover:text-frost">
              Explore
            </Link>
            <Link to="/sources" className="text-sm text-mist hover:text-frost">
              Sources
            </Link>
            <div className="pt-2">
              <Utility />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
