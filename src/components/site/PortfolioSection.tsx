import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio.functions";

function toEmbed(url: string): string {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

export function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState<PortfolioItem | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
  const visible = expanded ? filtered : filtered.slice(0, 6);

  return (
    <section id="portfolio" className="relative px-5 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Portfolio
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Recent work.
            </h2>
          </div>

          <div className="glass flex flex-wrap gap-1 rounded-full p-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setFilter(c);
                  setExpanded(false);
                }}
                className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                  filter === c
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-sm text-muted-foreground">No work published yet.</p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlaying(item)}
                className="glass group overflow-hidden rounded-3xl text-left transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <span className="glass-strong absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-foreground">
                    {item.category}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
                  {item.client ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.client}</p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}

        {filtered.length > 6 && !expanded ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="glass rounded-full px-6 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Show more
            </button>
          </div>
        ) : null}
      </div>

      {playing ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          onClick={() => setPlaying(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-deep/80 px-4 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-4xl overflow-hidden rounded-3xl"
          >
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-sm">{playing.title}</p>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="aspect-video w-full bg-deep">
              <iframe
                src={toEmbed(playing.video_url)}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
