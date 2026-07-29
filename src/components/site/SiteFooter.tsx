import logoAsset from "@/assets/lfs-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-glass-border px-5 py-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-2.5 uppercase tracking-[0.18em]">
          <img src={logoAsset.url} alt="Live For Studio logo" className="h-7 w-7 object-contain" />
          Live For Studio
        </p>

        <p>© {new Date().getFullYear()} — Video editing for creators</p>
      </div>
    </footer>
  );
}
