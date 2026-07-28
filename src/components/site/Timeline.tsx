const steps = [
  {
    code: "00:00:05:00",
    title: "Brief & footage",
    body: "We align on goal, audience and reference. You drop the raw files, I map the story.",
  },
  {
    code: "00:12:40:00",
    title: "Assembly",
    body: "Structure first: the narrative spine, pacing tailored to the project — not to a formula.",
  },
  {
    code: "00:31:15:00",
    title: "Motion, sound & color",
    body: "Graphics, sound design and grade layered in until the cut feels finished, not decorated.",
  },
  {
    code: "00:48:00:00",
    title: "Review & delivery",
    body: "Notes come back, revisions go in, masters ship in every format you need.",
  },
];

export function Timeline() {
  return (
    <section id="process" className="relative overflow-hidden px-5 py-24 lg:px-12 lg:py-32">
      <div aria-hidden className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[340px] w-[480px] rounded-full bg-accent/15 blur-[150px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Process</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The timeline, from first frame to final export.
        </h2>

        <div className="glass mt-14 rounded-3xl p-4 sm:p-6">
          {/* ruler */}
          <div className="flex items-end gap-[6px] overflow-hidden px-1 pb-5">
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className={`w-px shrink-0 bg-glass-border ${i % 5 === 0 ? "h-4" : "h-2"}`}
              />
            ))}
          </div>

          <ol className="grid gap-4 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="glass relative rounded-2xl p-5 transition-transform hover:-translate-y-1"
              >
                <span className="block font-mono text-[10px] tracking-[0.14em] text-primary">
                  {s.code}
                </span>
                <span className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Track 0{i + 1}
                </span>
                <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span
                  aria-hidden
                  className="mt-5 block h-1 rounded-full bg-primary/40"
                  style={{ width: `${40 + i * 18}%` }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
