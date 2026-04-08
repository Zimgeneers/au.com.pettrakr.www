# CLAUDE.md — au.com.pettrakr.www

## Project overview
Astro-based public website for Pettrakr (`au.com.pettrakr.www`). CMS-driven, pulling content from Directus (migrating from Strapi). Companion to the portal (`io.pettrakr.portal`).

## Architecture
- **Framework**: Astro
- **Content source**: Directus CMS at `admin.pettrakr.io` (migrating from Strapi)
- **Styling**: Tailwind CSS
- **Language**: TypeScript throughout

## Component structure
```
src/
  components/
    Nav.astro                     # CMS-driven nav, target/rel logic for external links
    sections/
      SectionRenderer.astro       # Routes to correct section component by type
      TextSection.astro
      TextImageSection.astro
      CtaSection.astro
      CardsSection.astro          # Grid of cards — columns controlled by section.columns (2/3/4)
      sectionHelpers.ts           # getSectionStyle() — single source of truth for bg/theme classes
      cards/
        Card.astro                # Generic card: image, heading, body, link
        QuoteCard.astro           # Testimonial: quote, avatar, author
        FeatureCard.astro         # Feature/benefit: icon/image, heading, body
        LogoCard.astro            # Logo grid: image in white box, optional link
  layouts/
    Layout.astro                  # Root layout — OG tags, sticky footer, viewport
```

## Coding conventions
- Fetch content in `.astro` files (server-side), not client-side JS
- `SectionRenderer` → section component pattern for CMS-driven pages
- `getSectionStyle()` in `sectionHelpers.ts` for all background/theme/dark-mode class logic — do not duplicate inline
- TypeScript strict mode
- Components have a single responsibility and accept typed props

## CMS integration
- All API calls are raw HTTP (no Strapi/Directus SDK) — just base URL + Bearer token
- **Strapi response shape**: `data[].attributes.*` (deep nested)
- **Directus response shape**: flat objects — when migrating endpoints, remove all `.attributes` unwrapping
- Base URL and token are the only things that change per environment

## Known issues / watch points
- Migration from Strapi to Directus not yet complete — some endpoints may still point to Strapi
- Review any hardcoded Strapi URLs or tokens in fetch calls
- Previously committed `.env` with live credentials — ensure all tokens have been rotated

## Strapi → Directus migration checklist
- [ ] Update base URL to `admin.pettrakr.io`
- [ ] Swap Bearer tokens
- [ ] Remove `data[].attributes.*` response unwrapping in all 9 affected files
- [ ] Test all page types after migration

## Cards section — Directus schema required
The `cards` section type is implemented in Astro but requires these collections in Directus:

**`section_items`** (M2O to `sections`)
- `type` — string: `card` | `quote` | `feature` | `logo`
- `heading`, `body`, `image`, `link`, `sort` — always visible
- `quote`, `author` — conditional: visible when `type = quote`

**`sections`** — add fields:
- `columns` — integer: `2 | 3 | 4` (defaults to 3 if null)
- `items` — O2M relation to `section_items`

Use Directus field conditions to show/hide `quote`/`author` based on `type`.

The hardcoded airlines block in `index.astro` should migrate to a `cards` section with `logo` items once the schema exists.

## Session notes
<!-- Update this at the end of each session -->
- Site structure and component architecture assessed and sound
- `sectionHelpers.ts` is the strongest piece of truth for bg/theme classes
- `Layout.astro` clean — OG tags, sticky footer, viewport all correct
- Nav is CMS-driven with correct external link handling
- Strapi → Directus migration planned but not started
- Cards section type implemented in Astro — Directus schema still needed (see above)
- `Section.background` type fixed to include `black` and `pettrakr` values
