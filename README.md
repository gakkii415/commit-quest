# Commit Quest

A mobile-first, game-inspired GitHub contribution journal.

## Features
- A daily contribution score and goal ring
- Editable daily goals saved on the device
- Activity streak, daily record, and seven-day total
- Selectable daily bars with weekly navigation
- A 35-day achievement calendar
- Japanese UI, mobile layout, reduced-motion support

## Run

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
npm run build
```

## Data and scoring

The server reads public profile contribution counts from [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api). No GitHub token is required. Upstream results can be cached for one hour. A contribution is not equivalent to a commit or a measure of time, quality, or productivity.

The app fetches the current and previous calendar years. The best-day record and streak are limited to this available period. Date labels remain GitHub's dates; the device determines which date is today. A zero today does not break a streak that ended yesterday. Goals and selected account are stored locally, and changing the goal also recalculates the achievement calendar. Daily tiers are STARTED at 1, GREAT at 10, ON FIRE at 20, and LEGEND at 50 contributions.

## Source layout

- `app/page.tsx`: daily game interface
- `app/globals.css`: visual theme and responsive layout
- `lib/activity.ts`: dates, streaks, and daily tiers
- `app/api/contributions/route.ts`: validated, bounded upstream request

This project uses the bundled Vinext / React / Cloudflare Workers starter. The `.openai/hosting.json` file deliberately omits the private hosted Site identity. Register your own Site when independently deploying a copy. No credentials belong in this repository.
