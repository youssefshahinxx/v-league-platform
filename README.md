# V League Platform

V League is a modern athletics and competition platform built to bring the energy of elite sport into one polished digital experience. It connects fans, athletes, and organizers through a live league presence that showcases standings, featured athletes, upcoming competitions, media coverage, and direct event registration.

This project is designed as a league-facing web experience: a branded home for performance, results, and participation.

## What this project is

At its core, this platform is a digital home for a competitive athletics league. It gives the league a public-facing presence where users can:

- browse live rankings and competition standings
- discover athletes and competition records
- explore upcoming events and event details
- register for competitions and pay through a secure merchant flow
- read blog and media content
- manage personal profiles and authenticated sessions
- access a clear, mobile-ready experience built for fans and competitors alike

The product blends editorial storytelling, sport data, commerce, and user accounts into a single experience.

## Product experience

The experience is designed around speed, performance, and spectacle. The homepage presents a high-energy hero section, standing tables, upcoming events, featured athletes, and media storytelling. The navigation and page structure are focused on creating a premium sports brand while keeping the interface fast and easy to browse.

The app is structured so that public-facing content stays accessible and fast, while authenticated flows such as profile editing, competition registration, and payment confirmation are handled through secure server-side logic.

## Core features

### Public league experience
- dynamic home page with hero, standings, featured athlete, media, and event highlights
- athlete directory with profile pages
- blog/news section with article cards and individual post pages
- competition list and detail pages with schedule, status, and event information
- media-rich competition presentation

### Competition registration
- authenticated users can register for competition events
- event selection is validated against the competition before checkout
- pricing and eligibility are pulled server-side instead of trusting client input
- payment flow is created through a Paymob integration and confirmed via webhook handling

### Authentication and profiles
- Supabase auth powers sign-in and sign-up flows
- user profiles are stored and updated through centralized helpers
- protected routes keep access controlled with shared auth checks
- users can edit profile details and media through a dedicated profile screen

### Rankings and data-driven experience
- live leaderboard-style presentation for standings
- athlete and event data are loaded from Supabase and rendered in a clean, readable format
- logic is separated into reusable query and formatting utilities to keep the frontend consistent

## Tech stack

This project is built with a modern SvelteKit stack:

- SvelteKit for routing, SSR, and app structure
- Svelte 5 for component-driven UI
- Tailwind CSS for styling and layout
- Supabase for authentication, database access, and storage
- Paymob for registration payment processing and webhooks
- Netlify adapter for deployment-friendly builds

## Project structure

```text
src/
  lib/
    auth.js                  # session helpers and auth gate logic
    profile.js               # profile save/update logic
    supabase.js              # Supabase client configuration
    supabaseData.js          # reusable query wrappers and fallback handling
    server/
      paymob.js              # Paymob API and webhook verification functions
    components/
      CompetitionEventTable.svelte
      layout/
      ui/
    sections/
      home/
      shared/
    utils/
      competitionRegistration.js
      markdown.js
      rankingAlgo.js
      ui.js
  routes/
    +layout.js
    +layout.svelte
    api/
      paymob/
        create-intention/
        webhook/
    athletes/
    auth/
    blog/
    competitions/
    contact/
    profile/
    ranking/
```

## Environment configuration

This app expects a Supabase project and Paymob configuration in your environment.

Create a `.env` file in the project root with values similar to:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

PAYMOB_SECRET_KEY=your-paymob-secret-key
PAYMOB_PUBLIC_KEY=your-paymob-public-key
PAYMOB_INTEGRATION_ID=123456,123457
PAYMOB_HMAC_SECRET=your-hmac-secret
PAYMOB_BASE_URL=https://accept.paymob.com
```

### Notes
- `PUBLIC_*` values are exposed to the browser and are intended for non-sensitive frontend usage.
- `SUPABASE_SERVICE_ROLE_KEY` and Paymob secrets are server-side variables and must never be exposed in the client.
- The Paymob integration is used for checkout creation and webhook verification, which keeps payment validation server-authenticated.

## Local development

Install dependencies:

```bash
npm install
```

Start the app locally:

```bash
npm run dev
```

Or open the browser directly:

```bash
npm run dev -- --open
```

## Production build

Run the production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

## Quality checks

The project includes Svelte validation tooling:

```bash
npm run check
```

This is useful for detecting broken components or invalid Svelte code during development.

## Expected data model

The application is designed around a Supabase-backed sports platform. Typical tables include entities such as:

- `profiles` for user identity and account data
- `competitions` for league event metadata
- `competition_events` for event-level schedules and pricing
- `registrations` for participant registrations and payment linking
- `blogs` for articles and content updates
- `athlete` or related profile data used in rankings and athlete pages

The app uses a mix of direct table queries and helper functions to keep data access centralized and consistent.

## Deployment

This project is configured to work with a SvelteKit deployment workflow, including Netlify-oriented adapter support. The app is built as a modern web product with a static-friendly frontend and server endpoints for secure payment and auth operations.

In production, you should:

- configure the environment variables in your hosting provider
- connect your Supabase project and storage buckets
- configure Paymob webhook URLs and allowed callback endpoints
- verify your auth redirect URIs and public hosting domain

## Why this project matters

This is more than a demo or template—it is a real league platform concept built for the way modern sports communities consume content and participate in competition. It brings together the digital experience of a premium sports brand with the operational realities of event registration, auth, data, and monetization.

The goal is simple: make the league feel alive, current, and premium from the first click to the moment someone registers for an event.

## License

This project is intended for internal product and platform development. Review the repository settings and legal requirements before public release or commercial distribution.

---

Built for a modern athletics league experience, shaped around performance, participation, and community.


