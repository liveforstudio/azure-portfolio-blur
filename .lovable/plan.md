
# Live For Studio — Video Editing Portfolio

A single-page site (English) inspired by the reference structure, but with its own visual identity: layered blues, heavy glass/blur, SF Pro typography. Portfolio work is managed through Lovable Cloud so you can add and edit videos without touching code.

## Visual direction

- Palette: deep navy base (`#070d1a`), mid blue surfaces (`#123a63`), bright sky accent (`#5ec2ff`), soft ice highlights.
- Glassmorphism everywhere: translucent cards, blurred sticky nav pill, frosted section dividers, glow behind the hero headline.
- Typography: SF Pro (`-apple-system, "SF Pro Display", "SF Pro Text", "Helvetica Neue"` stack) with a neutral fallback so non-Apple devices still look close.
- Motion: restrained — reveal on scroll, subtle hover lift on cards, animated gradient glow in the hero.

## Sections (same flow as the reference)

```text
Sticky glass nav pill:  Home · Portfolio · Services · Contact
1. Hero        big headline, 3 proof chips, primary CTA
2. Portfolio   filter tabs (All / Gameplay / Talking Head / Documentary / Shorts)
               grid of video cards, "Show more" reveals the rest
3. Services    4 glass cards (retention editing, motion & effects,
               sound design, color grading)
4. Contact     closing headline + Book a Call / Send an Email / DM buttons
5. Footer      minimal, brand + year
```

## Portfolio managed in Lovable Cloud

- Enable Lovable Cloud (database + auth + server functions).
- Table `portfolio_items`: title, category, thumbnail URL, video URL (YouTube/Vimeo), sort order, published flag.
- Public visitors read only published items (fetched server-side, safe for SEO).
- Private `/admin` area behind email login: add, edit, reorder, unpublish, delete items. Only you can write.
- Seeded with a handful of demo items so the site never looks empty.

## Technical notes

- TanStack Start route `/` for the landing page, `/admin` under the authenticated layout.
- Public reads via a public server function with a narrow read-only policy; writes via authenticated server functions with row-level security.
- Design tokens (blue palette, blur radii, radius, shadows) defined as semantic tokens in `src/styles.css` — no hardcoded colors in components.
- Video cards open a glass lightbox player instead of navigating away.
- SEO: unique title/description/OG tags for the page, semantic HTML, lazy-loaded thumbnails.

## Content I'll use

Brand "Live For Studio", English copy written fresh (not copied from the reference). Contact buttons will be placeholders (booking link, email, X handle) that you can hand me later to fill in.
