import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio.functions";

function toEmbed(
  url: string,
  options: { autoplay?: boolean; controls?: boolean; mute?: boolean } = {},
): string {
  const { autoplay = true, controls = true, mute = false } = options;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      controls: controls ? "1" : "0",
      mute: mute ? "1" : "0",
      playsinline: "1",
      rel: "0",
      showinfo: "0",
      modestbranding: "1",
      iv_load_policy: "3",
      fs: controls ? "1" : "0",
    });
    return `https://www.youtube.com/embed/${yt[1]}?${params.toString()}`;
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

export function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState<PortfolioItem | null>(null);

  const portfolioItems = useMemo(() => {
    const normalized = [...items];
    const documentaryItem = {
      id: "portfolio-featured-documentary",
      title: "Why B2 Battle Droid Voices Changed So Much",
      client: "Order 77",
      category: "Documentary",
      thumbnail_url: "",
      video_url: "https://youtu.be/hekmUh-jcik",
      sort_order: 0,
      published: true,
    };
    const opinionItem = {
      id: "portfolio-featured-opinion",
      title: "A Maldição de Ser o Mais Forte",
      client: "MCD ANIMES",
      category: "Opinion",
      thumbnail_url: "",
      video_url: "https://youtu.be/UFGtDDAzt0A",
      sort_order: 1,
      published: true,
    };

    if (normalized[0]) {
      normalized[0] = {
        ...normalized[0],
        ...documentaryItem,
      };
    } else {
      normalized.push(documentaryItem);
    }

    if (normalized[1]) {
      normalized.splice(1, 0, opinionItem);
    } else {
      normalized.push(opinionItem);
    }

    const thirdItem = {
      id: "portfolio-featured-third",
      title: "JOGUEI GARTIC PHONE COM 30 INSCRITOS E DEU NISSO",
      client: "Opepi",
      category: "Gameplay",
      thumbnail_url: "",
      video_url: "https://www.youtube.com/watch?v=n8e1LClYyfk",
      sort_order: 2,
      published: true,
    };

    const fourthItem = {
      id: "portfolio-featured-fourth",
      title: "A BeamNG Video",
      client: "yoleagg",
      category: "Documentary",
      thumbnail_url: "",
      video_url: "https://youtu.be/ZAG7YxRqFoY",
      sort_order: 3,
      published: true,
    };

    const fifthItem = {
      id: "portfolio-featured-fifth",
      title: "A Fallout Trial",
      client: "Live For Studio",
      category: "Documentary",
      thumbnail_url: "",
      video_url: "https://youtu.be/8vhxXbaiXrU",
      sort_order: 4,
      published: true,
    };

    const sixthItem = {
      id: "portfolio-featured-sixth",
      title: "Rock, Lésbicas e Introversão - Bocchi The Rock",
      client: "MCD ANIMES",
      category: "Opinion",
      thumbnail_url: "",
      video_url: "https://youtu.be/X_AUIr636RE",
      sort_order: 5,
      published: true,
    };

    const seventhItem = {
      id: "portfolio-featured-seventh",
      title: "A Brandon Trial",
      client: "Live For Studio",
      category: "Documentary",
      thumbnail_url: "",
      video_url: "https://youtu.be/gAFbNi7fcuY",
      sort_order: 6,
      published: true,
    };

    if (normalized[2]) {
      normalized[2] = {
        ...normalized[2],
        ...thirdItem,
      };
    } else {
      normalized.push(thirdItem);
    }

    if (normalized[3]) {
      normalized[3] = {
        ...normalized[3],
        ...fifthItem,
      };
    } else {
      normalized.push(fifthItem);
    }

    if (normalized[4]) {
      normalized[4] = {
        ...normalized[4],
        ...fourthItem,
      };
    } else {
      normalized.push(fourthItem);
    }

    if (normalized[5]) {
      normalized[5] = {
        ...normalized[5],
        ...sixthItem,
      };
    } else {
      normalized.push(sixthItem);
    }

    if (normalized[6]) {
      normalized[6] = {
        ...normalized[6],
        ...seventhItem,
      };
    } else {
      normalized.push(seventhItem);
    }

    return normalized;
  }, [items]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(portfolioItems.map((i) => i.category)))],
    [portfolioItems],
  );

  const filtered = filter === "All" ? portfolioItems : portfolioItems.filter((i) => i.category === filter);
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
                  {item.video_url ? (
                    <iframe
                      src={toEmbed(item.video_url, { autoplay: false, controls: false, mute: true })}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen={false}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : item.thumbnail_url ? (
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
                src={toEmbed(playing.video_url, { autoplay: false, controls: false, mute: false })}
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
