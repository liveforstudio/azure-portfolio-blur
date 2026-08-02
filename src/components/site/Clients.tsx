import { useEffect, useState } from "react";
import opepi from "@/assets/opepi.jpg.asset.json";
import order77 from "@/assets/order77.jpg.asset.json";
import mcd from "@/assets/mcd-animes.jpg.asset.json";

const clients = [
  { name: "Opepi", subs: "323K subscribers", url: "https://www.youtube.com/@Opepii", img: opepi.url },
  { name: "Order 77", subs: "77.1K subscribers", url: "https://www.youtube.com/@TheOrder77", img: order77.url },
  { name: "MCD ANIMES", subs: "7.14K subscribers", url: "https://www.youtube.com/@MCD_ANIMES", img: mcd.url },
];

export function Clients() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % clients.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="clients" className="relative px-5 py-20 lg:px-12 lg:py-28">
      <div
        aria-hidden
        className="dotted-grid pointer-events-none absolute inset-0 opacity-25"
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Our Clients
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Creators we edit for.
        </h2>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {clients.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setActive(i)}
                className="group flex flex-col items-center focus:outline-none"
                aria-label={c.name}
              >
                <span
                  className={`relative block overflow-hidden rounded-full transition-all duration-700 ease-out ${
                    isActive
                      ? "glow-ring h-32 w-32 scale-100 opacity-100 sm:h-40 sm:w-40"
                      : "h-24 w-24 scale-90 opacity-50 sm:h-28 sm:w-28"
                  }`}
                >
                  <img
                    src={c.img}
                    alt={`${c.name} channel avatar`}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-[filter] duration-700 ${
                      isActive ? "blur-0" : "blur-md"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-full ring-1 transition-colors duration-700 ${
                      isActive ? "ring-primary/60" : "ring-border"
                    }`}
                  />
                </span>

                <span
                  className={`mt-5 block transition-all duration-500 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                  }`}
                >
                  <span className="block text-sm font-medium">{c.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{c.subs}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {clients.map((c, i) => (
            <span
              key={c.name}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
