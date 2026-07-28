const actions = [
  { label: "Book a call", href: "https://cal.com", note: "15 min intro" },
  { label: "Send an email", href: "mailto:hello@liveforstudio.com", note: "hello@liveforstudio.com" },
  { label: "DM on X", href: "https://x.com", note: "@liveforstudio" },
];

export function Contact() {
  return (
    <section id="contact" className="relative px-5 py-24 lg:px-12 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-primary/10 blur-[160px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Contact</p>
        <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Let&apos;s build
          <br />
          <span className="text-gradient-ice">something together.</span>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
          Tell me about the project, the audience and the deadline — I&apos;ll come back with a
          plan and a quote.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glass group rounded-3xl p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-medium">{a.label}</p>
              <p className="mt-2 break-all text-xs text-muted-foreground">{a.note}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
