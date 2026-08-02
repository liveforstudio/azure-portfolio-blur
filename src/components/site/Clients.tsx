import { useEffect, useRef, useState } from "react";
import opepi from "@/assets/opepi.jpg.asset.json";
import order77 from "@/assets/order77.jpg.asset.json";
import mcd from "@/assets/mcd-animes.jpg.asset.json";

const clients = [
  { name: "Opepi", subs: "323K subscribers", url: "https://www.youtube.com/@Opepii", img: opepi.url },
  { name: "Order 77", subs: "77.1K subscribers", url: "https://www.youtube.com/@TheOrder77", img: order77.url },
  { name: "MCD ANIMES", subs: "7.14K subscribers", url: "https://www.youtube.com/@MCD_ANIMES", img: mcd.url },
];

const TAU = Math.PI * 2;
const PERIOD = 9000; // ms for a full revolution

export function Clients() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [radius, setRadius] = useState(180);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? 600;
      setRadius(Math.max(110, Math.min(230, w * 0.3)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = ((now - start) % PERIOD) / PERIOD;
      clients.forEach((_, i) => {
        const angle = t * TAU + (i * TAU) / clients.length;
        const x = Math.sin(angle) * radius;
        const depth = (Math.cos(angle) + 1) / 2; // 1 = front, 0 = back
        const scale = 0.62 + depth * 0.48;
        const blur = (1 - depth) * 7;
        const opacity = 0.28 + depth * 0.72;
        const el = itemsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), -50%, 0) scale(${scale.toFixed(3)})`;
          el.style.filter = `blur(${blur.toFixed(2)}px)`;
          el.style.opacity = opacity.toFixed(3);
          el.style.zIndex = String(Math.round(depth * 100));
        }
        const label = labelsRef.current[i];
        if (label) {
          const focus = Math.max(0, (depth - 0.72) / 0.28);
          label.style.opacity = focus.toFixed(3);
          label.style.transform = `translate3d(0, ${((1 - focus) * 8).toFixed(2)}px, 0)`;
        }
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [radius]);

  return (
    <section id="clients" className="relative px-5 py-20 lg:px-12 lg:py-28">
      <div aria-hidden className="dotted-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Our Clients</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Creators we edit for.
        </h2>

        {/* fixed-height stage so nothing in the page shifts */}
        <div
          ref={wrapRef}
          className="relative mx-auto mt-14 h-[240px] w-full max-w-3xl overflow-hidden sm:h-[280px]"
        >
          {clients.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{ transform: "translate3d(-50%, -50%, 0)" }}
            >
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={c.name}
                className="block h-36 w-36 overflow-hidden rounded-full ring-1 ring-primary/40 sm:h-44 sm:w-44"
              >
                <img
                  src={c.img}
                  alt={`${c.name} channel avatar`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </a>
            </div>
          ))}
        </div>

        {/* labels stacked in a fixed-height box — no layout shift */}
        <div className="relative mx-auto mt-6 h-14">
          {clients.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => {
                labelsRef.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{ opacity: 0 }}
            >
              <span className="block text-sm font-medium">{c.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{c.subs}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
