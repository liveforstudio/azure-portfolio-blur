export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-24 pt-36 lg:px-12 lg:pt-52">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10%] h-[380px] w-[520px] rounded-full bg-accent/20 blur-[130px]"
      />

      <div
        aria-hidden
        className="dotted-grid pointer-events-none absolute inset-0 opacity-40"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-1/2 hidden w-[520px] -translate-y-1/2 xl:block"
      >
        <video
          src="/assets/yoleagg-open-comms-day-6.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="aspect-video w-full rounded-[28px] border border-white/10 object-cover shadow-2xl"
        />
      </div>

      <div className="relative mx-auto max-w-6xl">

        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Video editing for creators
        </p>
        <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          Cuts that keep
          <br />
          <span className="text-gradient-ice">people watching.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Live For Studio edits long-form, shorts and documentary work for creators who care
          about retention as much as they care about craft.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {["On-time delivery", "Unlimited revisions"].map((chip) => (
            <span
              key={chip}
              className="glass rounded-full px-4 py-2 text-xs tracking-wide text-muted-foreground"
            >
              {chip}
            </span>
          ))}
        </div>

        <a
          href="#portfolio"
          className="glow-ring mt-12 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          See recent work
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
