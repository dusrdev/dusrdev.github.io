# WARP.md

This file provides guidance to AGENTS when working with code in this repository.

Repository intent and current state
- Intent: Personal portfolio/resume website hosted with GitHub Pages at dusrdev.github.io
- Current state: Empty repository (no build/test tooling yet). This document outlines recommended workflows and commands once you choose an approach.

Supported approaches (choose one)
1) Pure static site (no build step)
   - Keep HTML/CSS/JS at repo root (index.html, /assets, etc.).
   - GitHub Pages can serve directly from the default branch (Settings → Pages).

2) GitHub Pages (Jekyll)
   - Jekyll is natively supported by GitHub Pages. Site builds on push.
   - Typical structure: _config.yml, _layouts, _includes, _posts, pages in repo root.

3) Modern SSG (example: Astro)
   - Local dev and build with Node; deploy built output (dist) to GitHub Pages.
   - Typical structure: src/pages, src/components, astro.config.mjs, package.json.

Common commands by approach

A) Pure static site
- Local preview (no install):
  - python3 -m http.server 8000
- Deploy:
  - Push to default branch; enable GitHub Pages in repo Settings → Pages → Source: Deploy from a branch.

B) Jekyll on GitHub Pages
- One-time setup (Ruby tooling):
  - gem install bundler
  - bundle init
  - Add to Gemfile:
    - gem "github-pages", group: :jekyll_plugins
  - bundle install
- Local dev:
  - bundle exec jekyll serve --livereload
- Build locally (optional):
  - bundle exec jekyll build
- Deploy:
  - Push to default branch. GitHub Pages builds and serves automatically.

C) Astro (example modern SSG)
- One-time setup:
  - npm create astro@latest
  - Follow prompts (empty template is fine). This creates package.json and astro.config.*
- Local dev:
  - npm run dev
- Build:
  - npm run build
- Preview built site:
  - npm run preview
- Deploy to GitHub Pages (branch-based):
  - npm i -D gh-pages
  - In package.json scripts, add:
    - "deploy": "astro build && gh-pages -d dist"
  - Run: npm run deploy (publishes dist/ to gh-pages branch). Configure Pages to use gh-pages branch.

Testing and running a single test
- Pure static/Jekyll: No default test runner. If you add tests, document the chosen tool here.
- Astro (with Vitest):
  - Install: npm i -D vitest @vitest/ui @testing-library/dom @testing-library/jest-dom
  - Run all tests: npx vitest run
  - Watch mode (UI): npx vitest
  - Single file: npx vitest path/to/file.test.ts
  - Single test name: npx vitest -t "test name"

Linting/formatting (optional, add when you introduce Node tooling)
- Prettier:
  - npm i -D prettier
  - Check: npx prettier . --check
  - Write: npx prettier . --write
- ESLint (for Astro/JS/TS projects):
  - npm i -D eslint
  - Initialize: npx eslint --init
  - Run: npx eslint .

High-level architecture (to be updated as you build)
- Pure static:
  - Root contains entry point (index.html). Assets in /assets (css, js, images). No build artifacts.
- Jekyll:
  - Content-first. _config.yml defines site metadata; _layouts provide page skeletons; _includes are partials; Markdown/HTML pages and posts compiled to _site by GitHub.
- Astro:
  - src/pages maps routes to pages (file-based routing); components in src/components; global styles in src/styles; adapters and integrations declared in astro.config.*. Build emits static assets in dist.

CI/CD notes
- GitHub Pages → Settings → Pages controls source (default branch / gh-pages). For Jekyll, GitHub builds automatically. For Astro or other SSGs, publish dist/ to the branch configured in Pages.

Housekeeping for future updates
- Once you commit your chosen tooling (Jekyll or Astro), update this file with:
  - Exact dev/build/test commands as implemented in package.json or Gemfile.
  - Any directory conventions (content, layouts, components) specific to your implementation.
  - How to run a single test with the chosen test runner.

Current site features and notes (kept up-to-date)
- Approach: Pure static site (index.html + /assets)
- Dynamic GitHub projects: assets/js/app.js fetches selected repos via GitHub API.
- NuGet total downloads badge: assets/js/nuget-downloads.js fetches from NuGet search API (owner:dusrdev) and sums totalDownloads.
  - Primary endpoint: https://azuresearch-usnc.nuget.org/query?q=owner:dusrdev&take=100
  - Fallbacks: api-v2v3search endpoints and author:dusrdev query if needed.
  - Graceful fallback displays "30k+" if the API is unavailable.
- Local preview: python3 -m http.server 8000, then open http://localhost:8000
- To change the displayed handle/owner, edit username in assets/js/app.js and owner in assets/js/nuget-downloads.js

