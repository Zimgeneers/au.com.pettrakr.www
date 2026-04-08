# au.com.pettrakr.www

Public website for [PetTrakr](https://pettrakr.com.au). CMS-driven Astro site pulling content from Directus at `admin.pettrakr.io`.

## Stack

- **Framework:** Astro (static site generation)
- **CMS:** Directus — all page content, sections, and nav are managed there
- **Styling:** Tailwind CSS
- **Language:** TypeScript throughout

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |

## Environment variables

```bash
PUBLIC_DIRECTUS_URL=https://admin.pettrakr.io
```

Create a `.env` file at the project root. The site falls back to `https://admin.pettrakr.io` if the variable is not set.

## Project structure

```
src/
  lib/
    directus.ts              # All Directus types and fetch functions
  layouts/
    Layout.astro             # Root layout — OG tags, nav, footer
  components/
    Nav.astro                # CMS-driven navigation
    sections/
      SectionRenderer.astro  # Routes section.type → correct component
      TextSection.astro
      TextImageSection.astro
      CtaSection.astro
      CardsSection.astro     # Grid of cards (2/3/4 columns)
      FaqSection.astro       # Accordion of question/answer items
      sectionHelpers.ts      # getSectionStyle() — background/theme logic
      cards/
        Card.astro           # image, heading, body, link
        QuoteCard.astro      # quote, avatar, author
        FeatureCard.astro    # icon/image, heading, body
        LogoCard.astro       # logo in white box, optional link
  pages/
    index.astro              # Home page (slug: home)
    [slug].astro             # All other CMS pages
    contact.astro            # Contact form
    book.astro               # Reservation form (token-gated per company)
```

---

## Building pages and sections in Directus

### Data model

```
Pages
 └── Sections  (ordered by sort, belong to a page)
      └── Section Items  (ordered by sort, belong to a section)
```

A **Page** holds the hero and SEO fields. Everything below the hero is built from **Sections**. Sections of type `cards` or `faq` pull their content from **Section Items**.

---

### Section types

| `type` | Renders | Uses items? |
|---|---|---|
| `text` | Heading + rich text + optional CTA | No |
| `text_image` | Text beside an image (left or right) | No |
| `cta` | Centred heading, body, and prominent button | No |
| `cards` | Responsive grid of cards (2/3/4 columns) | Yes |
| `faq` | Accordion of questions and answers | Yes |
| `pricing` | Pricing tiers *(layout pending)* | TBD |

**Common section fields:**
- `heading` — section title
- `body` — supporting text (rich text for `text`/`text_image`, plain for others)
- `ctaText` + `ctaUrl` — optional call-to-action button
- `background` — `white`, `gray`, `dark`, `black`, `pettrakr`
- `backgroundImage` + `parallax` — optional background image with parallax
- `sort` — controls order on the page

**Cards-specific:**
- `columns` — `2`, `3` (default), or `4`

---

### Section Item types (for `cards` and `faq` sections)

| `type` | Fields used | Typical use |
|---|---|---|
| `card` | image, heading, body, link | Team, partners, advisors |
| `quote` | image (avatar), quote, author | Testimonials |
| `feature` | image (icon), heading, body, link | Benefits, how-it-works steps |
| `logo` | image, heading, link | Airlines, integrations |
| `faq` | heading (question), body (answer) | FAQs — use inside a `faq` section |

Fields not relevant to the selected type are hidden automatically in Directus.

---

### Step-by-step: building a page

**1. Create the page**
`Website → Pages → New`
- `slug` — URL path (e.g. `about`, `how-it-works`). Use `home` for the home page.
- `heroHeading` — if empty, the hero is skipped entirely
- `heroSubheading`, `heroCtaText`, `heroCtaUrl`, `heroImage` — all optional
- Fill in SEO fields (`seoTitle`, `seoDescription`, `seoImage`)

**2. Add sections**
`Website → Sections → New`
- `page` — link to your page
- `type` — choose from the table above
- Fill in `heading`, `body`, `ctaText`, `ctaUrl` as needed
- Set `background` and optionally `backgroundImage`
- Set `sort` to control order (lower = higher on page)
- For `text_image`: set `imagePosition` (`left` or `right`) and upload `image`
- For `cards`: set `columns`

**3. Add items** *(cards and faq sections only)*
`Website → Section Items → New`
- `section` — link to your section
- `type` — choose the card layout
- Fill in the fields shown (irrelevant fields are hidden)
- Set `sort` to control order within the section

---

### Example — "How It Works" page

```
Page  slug=how-it-works  heroHeading="How PetTrakr Works"

Section  sort=1  type=text
  heading: "Simple. Reliable. Stress-free."
  body: intro paragraph

Section  sort=2  type=cards  columns=3
  heading: "Three Simple Steps"
  Items:
    type=feature  heading="Book"    body="..."  image=icon
    type=feature  heading="Track"   body="..."  image=icon
    type=feature  heading="Arrive"  body="..."  image=icon

Section  sort=3  type=cards  columns=3
  heading: "What Our Customers Say"
  Items:
    type=quote  quote="..."  author="Jane Smith"
    type=quote  quote="..."  author="Mark Johnson"

Section  sort=4  type=cta
  heading: "Ready to book?"
  ctaText: "Reserve a Trip"
  ctaUrl: /book
```

---

## Deployment

The site is statically generated. Any change to content in Directus or code in this repo requires a rebuild and redeploy to go live.

Directus content changes (new sections, edited text) do **not** require a Directus redeploy — only an Astro rebuild.
