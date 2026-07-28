const services = [
  {
    title: "Adaptive editing",
    body: "Every project gets the rhythm it deserves — from calm, cinematic pacing to tight, energetic cuts.",
  },

  {
    title: "Motion & effects",
    body: "Animation, overlays and visual gags that give a channel its own personality.",
  },
  {
    title: "Sound design",
    body: "Music, SFX and mixing that make a cut feel bigger than the footage.",
  },
  {
    title: "Color grading",
    body: "Correction and cinematic treatment so every scene reads clean and consistent.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative px-5 py-24 lg:px-12 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[360px] w-[520px] rounded-full bg-mid/30 blur-[150px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Services</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          A full editing package, first cut to final second.
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <article key={s.title} className="glass rounded-3xl p-7">
              <span className="text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-medium">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
