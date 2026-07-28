import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-glass-border px-5 py-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p className="uppercase tracking-[0.18em]">Live For Studio</p>
        <p>© {new Date().getFullYear()} — Video editing for creators</p>
        <Link to="/admin" className="transition-colors hover:text-foreground">
          Studio login
        </Link>
      </div>
    </footer>
  );
}
