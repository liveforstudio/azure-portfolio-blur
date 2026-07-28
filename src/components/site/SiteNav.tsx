import { useEffect, useState } from "react";
import logoAsset from "@/assets/lfs-logo.png.asset.json";


const links = [
  { id: "home", label: "Home" },
  { id: "portfolio", label: "Portfolio" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },

  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.1, 0.5, 1] },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 py-4 lg:px-12 lg:py-7">
      <div className="flex items-center justify-between gap-4">
        <a
          href="#home"
          className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-60"
        >
          <img src={logoAsset.url} alt="Live For Studio logo" className="h-9 w-9 object-contain" />
          <span className="hidden sm:block">
            Live For
            <span className="block text-muted-foreground lg:ml-2 lg:inline">Studio</span>
          </span>
        </a>


        <nav className="glass-strong fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center rounded-full px-1.5 py-1.5 lg:top-7">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors sm:text-xs ${
                active === l.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-glass-border px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
