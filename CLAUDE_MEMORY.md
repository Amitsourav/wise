# Project Memory - Wise Bridge Global Partners Website

## Project Overview
- **Type:** Static corporate website for a financial services company (Wise Bridge Global Partners)
- **Tech Stack:** Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Location:** `/Users/asourav/Desktop/Companies website/financial-services-website/wise-bridge-italian/`
- **Git Repo:** https://github.com/Amitsourav/wise (branch: main)
- **Deployment:** Vercel (auto-deploy from GitHub, account: amitsourav0407@gmail.com)
- **Domain:** https://wisebgp.com

## Project Structure
```
wise-bridge-italian/
├── css/style.css              # Main stylesheet (CSS variables, Italian corporate aesthetic)
├── js/main.js                 # Main JavaScript (form handlers, mobile menu, etc.)
├── scripts/fetch-blogs.js     # Notion API integration for blog/newsletter content
├── images/                    # Logo and assets
├── newsletters/               # Auto-generated blog pages from Notion
├── index.html                 # Homepage
├── about.html                 # About page
├── services.html              # Services (Accounting, Audit, Tax)
├── contact.html               # Contact page with form
├── careers.html               # Careers page
├── newsletters.html           # Newsletters page with subscription form
├── privacy.html               # Privacy policy
├── disclaimer.html            # Disclaimer
└── package.json               # Dependencies & scripts
```

## Design System
- **Primary Color:** Deep Navy (#1C2331)
- **Accent Color:** Italian Blue (#1F4FD8)
- **Gold Accent:** #C9A24D
- **Font:** Inter (Google Fonts)
- **Style:** Minimal, professional, Italian corporate aesthetic

## Formspree Integration (Completed 2026-02-25)
- **Endpoint:** https://formspree.io/f/mojnpwap (used for both forms)
- **Contact Form** (contact.html):
  - Fields: name, email, message, email-list (checkbox)
  - Hidden field: `_subject = "New Contact Inquiry"`
  - AJAX submission via fetch, client-side validation preserved
  - Submit button shows "SENDING..." during submission
  - Error fallback message includes direct email: connect@wisebgp.com
- **Newsletter Form** (newsletters.html):
  - Fields: email
  - Hidden field: `_subject = "New Newsletter Subscription"`
  - AJAX submission via fetch, email validation included
  - Submit button shows "Subscribing..." during submission
  - Success/error messages displayed below the form
- **Both forms tested successfully from backend (curl)**

## Key Files Modified for Formspree
1. `contact.html` — Added hidden `_subject` field
2. `newsletters.html` — Added form `id`, `name` on email input, hidden `_subject` field, `required` attribute
3. `js/main.js` — Replaced simulated contact form handler with Formspree fetch POST, added newsletter form handler and `showNewsletterMessage()` function

## Notion Integration
- Blog content fetched from Notion API via `scripts/fetch-blogs.js`
- Uses `notion-to-md` for markdown conversion
- Auto-generates newsletter pages in `/newsletters/` directory

## Contact Information
- **Email:** connect@wisebgp.com
- **Careers Email:** careers@wisebridgegp.com
- **LinkedIn:** https://www.linkedin.com/company/wisebgp
- **Office:** Workworm, Metro Station Pillar No. 539, 13B, near NHPC Chowk, Block A, DLF Industrial Area, Sector 32, Faridabad, Haryana 121003

## Recent Commits
- `9ab21c6` — Integrate Formspree for contact and newsletter form submissions
- `aa67df3` — Add comprehensive project documentation
- `c8b8e71` — Remove testimonials section, fix mobile dropdown, add hreflang tags
- `c403df8` — Fix logo image on all pages
- `c6b02e3` — Improve responsive design and update homepage hero section
- `39ed295` — Update services page and contact info across site
