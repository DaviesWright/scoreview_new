# ScoreView Marketing Site — Rebuild

## Overview
Full rebuild of the bscscoreview.com marketing website matching the ScoReview Website Revamp Specification. Built as static HTML/CSS/JS with the Dede AI assistant on every page.

## File Structure
```
/
├── index.html              Homepage (hero, problem, 3 pillars, products, governance, dashboard preview, maturity CTA)
├── scoReviewHR.html        ScoReviewHR product page (pre-appraisal module)
├── scoReview.html          ScoReview product page (post-appraisal module)
├── how-it-works.html       Full workflow: Measure → Review → Act
├── request-demo.html       Demo request form
├── contact.html            Contact form
├── about.html              About page
├── privacy.html            Privacy policy
├── security.html           Security & AI governance
├── styles.css              Shared design system (dark theme, Inter font)
├── config.js               Centralized CTA configuration
├── dede-assistant.js       Dede AI assistant widget (on every page)
├── main.js                 Navigation, scroll effects, form handling
└── _redirects              Cloudflare Pages SPA routing
```

## Design System
- **Theme:** Dark (navy/blue background, light text)
- **Font:** Inter (Google Fonts)
- **Colors:** Primary #3b82f6 (blue), Accent #10b981 (green)
- **Components:** Cards, pillars, steps, dashboard mockup, forms, Dede chat widget

## Dede AI Assistant
- Floating chat widget on every page (bottom-right)
- Quick-prompt buttons with context-aware questions per page
- Falls back to local intelligent responses if API endpoint is unavailable
- Configurable via `config.js` → `SCOREVIEW_CONFIG.dede`

## Deployment
Deploy to Cloudflare Pages:
1. Upload all files to a Cloudflare Pages project
2. Set custom domain to bscscoreview.com
3. No build step required (static files)

## CTA Configuration
All CTAs are centralized in `config.js`. Update `SCOREVIEW_CONFIG.cta` to change button text/URLs across the entire site.
