# AGENTS.md

This file provides guidance to any Agents working with code in this repository.

Repository intent and current state
- Intent: Personal portfolio/resume website hosted with GitHub Pages at dusrdev.github.io
- Current state: Implemented as a pure static site (index.html + /assets). No build/test tooling.

How to run locally
- Preview: python3 -m http.server 8000 and open http://localhost:8000
- No build step or package manager required.

Deploy
- Push to default branch. GitHub Pages (Settings → Pages → Source: Deploy from a branch) serves the site.
- Resume files live inside `assets/resume/` (drop in `Resume.pdf` and `Resume-He.pdf`). Update those files directly before deploy; no external hosting is involved anymore.

High-level architecture (big picture)
- index.html: Sections and wiring
  - Header: brand + nav + 3‑state theme toggle (Dark/Light/Auto with SVG icon & label) + `Resume` and `Resume-He` links that open the PDFs from `assets/resume/`
  - Hero: profile avatar, tagline, buttons (View Resume → `assets/resume/Resume.pdf`, GitHub Profile)
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
- assets/resume/: Directory that stores `Resume.pdf` (default) and `Resume-He.pdf` (alternate language). Keep a placeholder file (e.g., `.gitkeep`) if the PDFs are not committed.

External links and resources
- GitHub profile: https://github.com/dusrdev

Common maintenance tasks
- Update projects shown: edit the ordered array in assets/js/app.js
- Update resume files: drop the latest `Resume.pdf` and/or `Resume-He.pdf` into assets/resume/ (overwrite existing files); links update automatically
- Adjust theme toggle behavior or labels: assets/js/theme.js
- Tweak animations (reveal/hover): assets/js/reveal.js and CSS transitions in styles.css

Notes
- No tests or linters are configured (pure static). If Node tooling is added later, update this file with dev/build/test commands.
- Keep this document in sync when adding sections or changing file paths.
