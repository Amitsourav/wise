# Wise Bridge Global Partners - Website

A professional, static corporate website for **Wise Bridge Global Partners** (WiseBGP) — a global execution partner in Accounting & Financial Services. Built with vanilla HTML, CSS, and JavaScript with automated Notion-powered blog integration.

**Live Site:** [wisebgp.com](https://wisebgp.com)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [Getting Started](#getting-started)
- [Notion Blog Integration](#notion-blog-integration)
- [Design System](#design-system)
- [Responsive Breakpoints](#responsive-breakpoints)
- [JavaScript Features](#javascript-features)
- [SEO](#seo)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (Custom Properties), Vanilla JavaScript |
| Fonts | Google Fonts (Inter, Playfair Display) |
| Blog CMS | Notion API + notion-to-md |
| Automation | GitHub Actions (cron every 6 hours) |
| Images | Unsplash CDN |

**Dependencies:**
- `@notionhq/client` ^2.2.14 — Official Notion API client
- `notion-to-md` ^3.1.1 — Converts Notion blocks to Markdown

---

## Project Structure

```
wise-bridge-italian/
├── .github/
│   └── workflows/
│       └── fetch-blogs.yml        # GitHub Actions: auto-sync blogs from Notion
├── css/
│   └── style.css                  # Main stylesheet (~1,734 lines)
├── js/
│   └── main.js                    # Core JavaScript (~365 lines)
├── scripts/
│   └── fetch-blogs.js             # Notion API fetch & HTML generation (~339 lines)
├── images/
│   └── logo.jpeg                  # Brand logo
├── newsletters/                   # Auto-generated newsletter HTML pages
├── index.html                     # Homepage
├── about.html                     # About Us
├── services.html                  # Services (Audit, Tax, Accounting)
├── contact.html                   # Contact form & info
├── careers.html                   # Job listings
├── newsletters.html               # Newsletter hub
├── privacy.html                   # Privacy Policy
├── disclaimer.html                # Legal Disclaimer
├── HERO_IMAGE_REQUIREMENTS.md     # Hero image design guidelines
├── package.json                   # Node.js config & scripts
├── .env.local                     # API credentials (gitignored)
├── .env.example                   # Environment variable template
└── .gitignore
```

---

## Pages Overview

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero section, service cards, trust indicators, latest insights, contact CTA |
| About | `about.html` | Company overview, vision & mission, core values, team advantages |
| Services | `services.html` | Audit & Assurance, Tax Services, Accounting & Bookkeeping (detailed) |
| Contact | `contact.html` | Contact form, office location, meeting options |
| Careers | `careers.html` | Job listings, company benefits, recruitment info |
| Newsletters | `newsletters.html` | Blog hub with dynamic content from Notion |
| Privacy | `privacy.html` | Privacy policy (GDPR, Gramm-Leach-Bliley Act) |
| Disclaimer | `disclaimer.html` | Legal & regulatory disclaimers |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Amitsourav/wise.git
cd wise

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Notion API key and Database ID
```

### Run Locally

This is a static site. Use any HTTP server:

```bash
# Using npx
npx http-server -p 5500

# Or using Python
python3 -m http.server 5500
```

Open [http://localhost:5500](http://localhost:5500) in your browser.

### Fetch Newsletters from Notion

```bash
npm run fetch-blogs
```

This pulls published articles from your Notion database and generates individual HTML pages in the `newsletters/` directory.

---

## Notion Blog Integration

The newsletter system connects to a Notion database and auto-generates static HTML blog pages.

### How It Works

1. `scripts/fetch-blogs.js` queries the Notion database for pages where **Published = true**
2. Each page's content is converted from Notion blocks to Markdown (via `notion-to-md`), then to HTML
3. Individual newsletter HTML files are generated in `/newsletters/{slug}.html`
4. Newsletter cards are injected into `newsletters.html`

### Notion Database Properties

| Property | Type | Description |
|----------|------|-------------|
| Title / Name | Title | Article title |
| Slug | Rich Text | URL-friendly identifier |
| Description | Rich Text | Short summary for card display |
| Date | Date | Publication date |
| Author | Rich Text | Author name (default: "Wise Bridge Team") |
| Published | Checkbox | Must be `true` to appear on site |
| Cover | Files | Cover image for the article |

### Automated Sync (GitHub Actions)

The workflow at `.github/workflows/fetch-blogs.yml` runs every 6 hours:

```
Schedule: 0 */6 * * *
Trigger: Also available via manual dispatch
```

It fetches new content, generates pages, and auto-commits changes to the repo.

---

## Design System

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-color` | `#1C2331` | Deep Navy — headers, primary text |
| `--secondary-color` | `#6B7280` | Warm Grey — secondary text |
| `--accent-color` | `#1F4FD8` | Italian Blue — links, buttons, CTAs |
| `--gold-accent` | `#C9A24D` | Subtle Gold — decorative lines, accents |
| `--background` | `#FFFFFF` | Pure White — page background |
| `--surface` | `#F9FAFB` | Off-white — card backgrounds, sections |
| `--border` | `#E5E7EB` | Light border — dividers, form inputs |
| `--text-primary` | `#1C2331` | Dark text |
| `--text-secondary` | `#6B7280` | Grey text |

### Typography

- **Headings:** Inter (semibold 600)
- **Body:** Inter (regular 400, medium 500)
- **Scale:** h1: 3rem, h2: 2.35rem, h3: 1.7rem, h4: 1.3rem, body: 1rem

### Spacing Scale

```
--spacing-xs:  0.4rem
--spacing-sm:  0.6rem
--spacing-md:  1.2rem
--spacing-lg:  2rem
--spacing-xl:  3.2rem
--spacing-2xl: 4.8rem
--spacing-3xl: 6.4rem
```

### Shadows

```
--shadow-sm: 0 1px 2px rgba(28, 35, 49, 0.04)
--shadow-md: 0 2px 8px rgba(28, 35, 49, 0.08)
--shadow-lg: 0 6px 20px rgba(28, 35, 49, 0.12)
```

### Components

- **Buttons:** `btn-primary` (blue), `btn-secondary` (white), `btn-outline` (bordered)
- **Cards:** `card`, `card-border`, `card-shadow` — with hover elevation
- **Grid:** `grid-2`, `grid-3`, `grid-4` — responsive column layouts
- **Gold Line:** `.gold-line` — decorative accent divider

---

## Responsive Breakpoints

| Breakpoint | Target Device | Key Changes |
|-----------|---------------|-------------|
| `1024px` | Tablet landscape | Reduced spacing, single-column grids |
| `850px` | Tablet portrait | Compact navigation fonts |
| `680px` | Mobile | Hamburger menu, stacked layouts, full-width buttons |
| `480px` | Small mobile | Further font/spacing reduction |
| `360px` | Very small devices | Minimum viable layout |

---

## JavaScript Features

All functionality is in `js/main.js` (no frameworks):

- **Mobile Navigation** — Hamburger menu toggle with animated icon, close on outside click / ESC key
- **Services Dropdown** — Hover on desktop, tap to toggle on mobile with arrow animation
- **Active Nav Highlighting** — Detects current page and highlights the corresponding nav link
- **Smooth Scrolling** — Anchor links scroll smoothly with header offset compensation
- **Contact Form** — Client-side validation (name, email, message), success/error messages
- **Back to Top** — Floating button appears after 300px scroll
- **Phone Formatting** — Auto-formats US phone numbers as (XXX) XXX-XXXX
- **Fade-in Animations** — Intersection Observer for `.fade-in` elements
- **Keyboard Accessibility** — Focus indicators on Tab, removed on mouse click

---

## SEO

### Implemented

- Meta descriptions and keywords on every page
- `hreflang` tags for en-US, en-CA, en-GB, and x-default
- Semantic HTML structure (header, main, section, nav, footer)
- Descriptive page titles
- Alt text on images
- Favicon and Apple touch icon

### hreflang Configuration

All pages include tags for three English regions:

```html
<link rel="alternate" hreflang="en-us" href="https://wisebgp.com/{page}" />
<link rel="alternate" hreflang="en-ca" href="https://wisebgp.com/{page}" />
<link rel="alternate" hreflang="en-gb" href="https://wisebgp.com/{page}" />
<link rel="alternate" hreflang="x-default" href="https://wisebgp.com/{page}" />
```

---

## Deployment

This is a fully static site. It can be hosted on:

- **GitHub Pages** — Push to `main` branch
- **Netlify / Vercel** — Connect the repo
- **Any web server** — Upload the files directly

### Cache Busting

CSS is versioned via query parameters:
```html
<link rel="stylesheet" href="css/style.css?v=15&t=1769600000">
```

Update `v` and `t` values when deploying CSS changes.

---

## Environment Variables

Create a `.env.local` file from the template:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NOTION_API_KEY` | Your Notion integration API token |
| `NOTION_DATABASE_ID` | The Notion database ID for newsletters |

These are only needed for the `npm run fetch-blogs` script and GitHub Actions workflow. The static site itself requires no environment variables.

---

## Contact

- **Email:** connect@wisebgp.com
- **LinkedIn:** [linkedin.com/company/wisebgp](https://linkedin.com/company/wisebgp)
- **Careers:** careers@wisebridgegp.com

---

## License

All rights reserved. Wise Bridge Global Partners.
