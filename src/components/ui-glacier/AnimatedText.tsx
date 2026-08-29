import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, seen };
}

/**
 * Splits text into per-character spans that flip in on a 3D axis when scrolled
 * into view. Purely presentational.
 */
export function AnimatedText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 26,
  depth = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  depth?: boolean;
}) {
  const { ref, seen } = useInView<HTMLElement>();
  const words = text.split(" ");
  let index = -1;
  const Comp = Tag as "span";

  return (
    <Comp
      ref={ref}
      className={`text-3d-stage ${depth ? "text-3d" : ""} ${className}`}
      data-revealed={seen ? "true" : "false"}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {[...word].map((ch, c) => {
            index += 1;
            return (
              <span
                key={`${ch}-${c}`}
                className="char-flip inline-block"
                style={{ animationDelay: `${delay + index * stagger}ms` }}
              >
                {ch}
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Comp>
  );
}

/** Wrapper that fades/lifts arbitrary children in 3D when scrolled into view. */
export function RevealBlock({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal-3d ${className}`}
      data-revealed={seen ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
