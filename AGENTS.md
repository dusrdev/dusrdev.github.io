# AGENTS.md

This file provides guidance to WARP (warp.dev) and other Agents when working with code in this repository.

Repository intent and current state
- Intent: Personal portfolio/resume website hosted with GitHub Pages at dusrdev.github.io
- Current state: Implemented as a pure static site (index.html + /assets). No build/test tooling.

How to run locally
- Preview: python3 -m http.server 8000 and open http://localhost:8000
- No build step or package manager required.

Deploy
- Push to default branch. GitHub Pages (Settings → Pages → Source: Deploy from a branch) serves the site.
- Resume is hosted externally (MEGA S4) at a stable URL; no repo changes are needed when updating the PDF.

High-level architecture (big picture)
- index.html: Sections and wiring
  - Header: brand + nav + 3‑state theme toggle (Dark/Light/Auto with SVG icon & label)
  - Hero: profile avatar, tagline, buttons (View Resume → MEGA S4 URL, GitHub Profile)
  - About: short bio
  - Experience: compact two‑line carousel with prev/next buttons; auto‑rotates and pauses on hover/focus
  - Projects: grid filled from GitHub API in a fixed order
  - Contact: modern icon buttons (phone, email, LinkedIn, GitHub, Instagram)
  - Footer: copyright
- assets/css/styles.css
  - Theme variables and manual overrides via html[data-theme="light|dark"]
  - Light‑mode extras (accent underline on section headers, subtle hero gradient)
  - Animated hovers: project cards and hero buttons (accent‑tinted border + elevation)
  - Brand hover states for contact buttons; GitHub hover uses high‑contrast colors
- assets/js
  - app.js: Loads and renders Projects from an explicit ordered list of repos for user "dusrdev"
    - Order (as of now): Sharpify, PrettyConsole, ArrowDb, Pulse, PdfTool, PuppeteerSharpToolkit
    - Edit the ordered array in app.js to change projects
  - nuget-downloads.js: Fetches total downloads (owner:dusrdev) from NuGet search API and shows a compact count (e.g., "NuGet · 33.2K+"). Tooltip holds the precise number
  - experience.js: Two‑line experience card carousel; keyboard arrows and prev/next buttons supported
  - reveal.js: IntersectionObserver to fade/slide sections into view (.reveal)
  - theme.js: 3‑state theme toggle with SVG icons (sun/moon/yin‑yang) and animated swaps; cycles Dark ↔ Light ↔ Auto (order after Auto depends on current system theme)
- assets/images/profile.png: Hero avatar

External links and resources
- Resume: https://s3.g.s4.mega.io/re6nand6mkj32ebypw2v3cbkjg5ixnvuf7xny/resume/Resume.pdf
- GitHub profile: https://github.com/dusrdev

Common maintenance tasks
- Update projects shown: edit the ordered array in assets/js/app.js
- Update resume: replace the PDF at the MEGA S4 key; site links stay the same
- Adjust theme toggle behavior or labels: assets/js/theme.js
- Tweak animations (reveal/hover): assets/js/reveal.js and CSS transitions in styles.css

Notes
- No tests or linters are configured (pure static). If Node tooling is added later, update this file with dev/build/test commands.
- Keep this document in sync when adding sections or changing file paths.
