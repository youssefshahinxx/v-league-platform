# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.3 create --template library --types jsdoc --install npm v-league
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```

Designing a relational database schema for a production-grade application requires balancing two competing priorities: **data integrity** (preventing bugs or orphaned data) and **read performance** (making sure your global ranking board loads instantly).

Because you are using **Supabase**, we can leverage its built-in PostgreSQL capabilities. One major advantage here is linking your custom application tables directly to Supabase's managed `auth.users` table.

Before looking at the specific tables, it helps to visualize how a clean, normalized sports database splits entities (like players, events, and scores) into distinct buckets connected by unique IDs.

---

## The V League Database Schema

To support your platform's features—especially your custom ranking algorithm—we will break the database down into 6 core tables.

### 1. `profiles` (The Athletes)

This extends Supabase's native auth table. When a user signs up, a corresponding row is created here to house their athletic persona.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key**, Foreign Key linking to `auth.users` |
| `full_name` | `text` | Required |
| `nationality` | `varchar(3)` | ISO country code (e.g., "EGY", "USA") for clean filtering |
| `gender` | `varchar(10)` | Used for gender-specific ranking boards |
| `dob` | `date` | Date of Birth |
| `club` | `text` | Optional |
| `bio` | `text` | Optional |
| `achievements` | `text[]` | Array of text strings for flexible list storage |

### 2. `competitions` (The Tournament Events)

This handles your upcoming, open, closed, and completed event listings.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key** |
| `title` | `text` | Event name |
| `description` | `text` | Event details |
| `location` | `text` | Text address (or city/country) for your search feature |
| `status` | `enum` | Limited to: `upcoming`, `open`, `closed`, `completed` |
| `ticket_price` | `numeric` | For ticket sales tracking |
| `event_date` | `timestamp` | When the event takes place |

### 3. `registrations` (Ticket Purchases / Participation)

A middleman table connecting athletes to competitions. A record here proves they bought a ticket and plan to play.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key** |
| `profile_id` | `uuid` | **Foreign Key** links to `profiles.id` |
| `competition_id` | `uuid` | **Foreign Key** links to `competitions.id` |
| `payment_status` | `text` | e.g., "paid", "refunded" |
| `created_at` | `timestamp` | Useful for checking registration order |

### 4. `event_results` (Historical Placements)

Once a competition's status moves to `completed`, the administrators log the final standings here. **This table is the secret sauce for your ranking logic.**

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key** |
| `competition_id` | `uuid` | **Foreign Key** links to `competitions.id` |
| `profile_id` | `uuid` | **Foreign Key** links to `profiles.id` |
| `final_rank` | `integer` | The numerical position they finished in (1st, 2nd, 5th, etc.) |

### 5. `points_ledger` (The Scoreboard Engine)

> **Production-Grade Architecture Tip:** Do not calculate an athlete's global score on the fly by scanning their entire history every time someone visits the Ranking page. That will slow down your site significantly as your user base grows.
> Instead, use an **Append-Only Transaction Ledger**. Every time points are earned, add a row here. To get the leaderboard, you simply sum the points grouped by the user ID, which PostgreSQL handles incredibly fast.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key** |
| `profile_id` | `uuid` | **Foreign Key** links to `profiles.id` |
| `competition_id` | `uuid` | **Foreign Key** links to `competitions.id` (Source of the points) |
| `reason` | `enum` | Limited to: `participation`, `stability`, `improvement` |
| `points_awarded` | `integer` | Stored as `5` or `10` based on the rule triggered |
| `created_at` | `timestamp` | Track when the points hit their account |

### 6. `blogs` (League News)

Isolated table for editorial content, requiring no direct relationship to the sports engine.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | `uuid` | **Primary Key** |
| `title` | `text` | Blog header |
| `slug` | `text` | URL-friendly path (e.g., `v-league-2026-kickoff`) |
| `content` | `text` | Markdown format blog post |
| `published_at` | `timestamp` | Filter for public visibility |

---

## How the Database Relations Map Together

To see how data flows through your system during a typical lifecycle:

```
[auth.users] 
     │ (Managed by Supabase)
     ▼
 [profiles] ◄────────┐ (1-to-Many: An athlete has many registrations/results)
     │               │
     │               ├─── [registrations] ────► [competitions]
     │               │                                ▲
     │               ├─── [event_results] ────────────┤
     │               │                                │
     ▼               │                                ▼
[points_ledger] ◄────┘                    (Triggers point generation)

```

---

## Powering Your Point Logic with This Schema

When a tournament concludes and an admin saves the rankings into `event_results`, your backend pipeline runs a check against this schema to populate the `points_ledger`:

1. **Participation (5 Points):** Add a row to `points_ledger` for every `profile_id` present in `registrations` for that competition.
2. **Performance Improvement (10 Points):** Check the `event_results` table. Compare the athlete's `final_rank` in this competition against their `final_rank` in their previous chronological competition. If the new rank number is lower (e.g., moving from rank 5 to rank 3), create a ledger row for 10 points.
3. **Ranking Stability (5 Points):** Look at the athlete's last three entries in `event_results`. If `final_rank` is identical across all three, add a ledger row for 5 points.

With this structural layout finalized, we are completely ready to transition out of the planning phase and move into setting up your workspace environment.

Should we establish the step-by-step local development setup strategy (configuring Docker, Supabase CLI, and initialized SvelteKit), or would you prefer to map out the exact Supabase Row Level Security (RLS) policies to make sure your data is secure from day one?
Here is the comprehensive production-grade layout strategy and text-based wireframe blueprint for platform.

---

## Part 1: Component Architecture Strategy

Organize your `src/lib/` directory immediately into this structure to prevent codebase clutter as you build:

* **`src/lib/components/ui/` (Atomic Blocks):** Pure, dumb components that don't fetch data. They accept props and look professional.
* `Button.svelte` (Primary, secondary, and ghost variants)
* `Badge.svelte` (For event statuses: "Open", "Completed", or point reasons)
* `Input.svelte` / `Select.svelte` (Clean text fields and dropdowns with minimal zinc borders)
* `Card.svelte` (A uniform wrapper with subtle shadows and padding)


* **`src/lib/components/layout/` (Global Architecture):**
* `Navbar.svelte` (Logo left, text links center, Auth trigger/Profile picture right)
* `Footer.svelte` (4-column grid layout for quick links, legal, socials, contact)


* **`src/lib/components/features/` (Data-Aware Components):**
* `CompetitionCard.svelte` (Displays title, date, location tag, and status badge)
* `RankingRow.svelte` (A sleek table row that expands to show points breakdown)
* `AthleteGridItem.svelte` (Compact profile thumbnail card for the directory)



---

## Part 2: Wireframe Wire-ups & Page Layouts

### 1. Global App Shell Layout (`src/routes/+layout.svelte`)

Every view shares this clean framework wrapper.

```
+-----------------------------------------------------------------------+
|  [V LEAGUE LOGO]     Competitions   Ranking   Athletes   Blog   [LOGIN] |  <-- Navbar
+-----------------------------------------------------------------------+
|                                                                       |
|                         DYNAMIC PAGE CONTENT AREA                     |
|                                                                       |
+-----------------------------------------------------------------------+
|  V League © 2026   |  Quick Links     |  Legal       |  Contact       |  <-- Footer
|  Minimal platform  |  - Home          |  - Privacy   |  hello@v.com   |
|  for top athletes  |  - Competitions  |  - Terms     |  [Social Icons]|
+-----------------------------------------------------------------------+

```

### 2. Homepage Layout (`src/routes/+page.svelte`)

*Aesthetic: Maximum whitespace, bold black sans-serif typography, subtle slate/zinc gray dividers.*

```
+-----------------------------------------------------------------------+
| HERO SECTION                                                          |
|                                                                       |
|       [ BOLD HEADING: THE CHOSEN STAGE FOR ATHLETIC EXCELLENCE ]      |
|                 Subheading: Track, rank, and compete.                 |
|                                                                       |
|                    [View Competitions]  [Join League]                 |
+-----------------------------------------------------------------------+
| OUR MISSION                                                           |
| "To quantify athletic progression through structured data validation, |
| offering an un-gameable global point infrastructure."                 |
+-----------------------------------------------------------------------+
| SPORTS DISCIPLINES TRACKED                                            |
| [ Grid: 3 Columns ]                                                   |
| +-------------------+  +-------------------+  +-------------------+   |
| | Icon - Track      |  | Icon - Field      |  | Icon - Weight     |   |
| +-------------------+  +-------------------+  +-------------------+   |
+-----------------------------------------------------------------------+
| FEATURED UPCOMING EVENTS                                              |
| +-------------------------------------------------------------------+ |
| | Title: Summer Open 2026 | Location: Cairo | Date: Aug 12 | [Open] | |
| +-------------------------------------------------------------------+ |
| | Title: National Finals  | Location: Giza  | Date: Sep 05 | [Upcoming]|
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+

```

### 3. Competitions Hub Layout (`src/routes/competitions/+page.svelte`)

*Aesthetic: Sticky horizontal controls at the top, followed by a responsive layout array.*

```
+-----------------------------------------------------------------------+
| COMPETITIONS                                                          |
|                                                                       |
| [ Search by city/location...      ] [ All Statuses (Dropdown) ▾ ]     |
| Filter Pills: (X) All Statuses   ( ) Open to Register   ( ) Completed |
+-----------------------------------------------------------------------+
| RESULTS DIRECTORY                                                     |
| [ Grid: 2 Columns ]                                                   |
| +---------------------------------+   +---------------------------------+ |
| | [OPEN TO REGISTER]              |   | [COMPLETED]                     | |
| | Elite Sprint Invitationals 2026 |   | Regional Weight Throwdown 2026  | |
| | Location: Giza Athletics Center |   | Location: Alexandria Club       | |
| | Date: July 30, 2026             |   | Date: June 15, 2026             | |
| | [Register / Buy Ticket]         |   | [View Placements]               | |
| +---------------------------------+   +---------------------------------+ |
+-----------------------------------------------------------------------+

```

### 4. Point-Breakdown Leaderboard Layout (`src/routes/ranking/+page.svelte`)

*Aesthetic: Looks like a premium spreadsheet or SaaS telemetry dashboard. The UI transparently shows how your algorithmic points are calculated.*

```
+-----------------------------------------------------------------------+
| LEAGUE SCOREBOARD                                                     |
|                                                                       |
| Pos  Athlete Name        Nationality   Events Tracked   Total Points  |
+-----------------------------------------------------------------------+
| #1   Youssef A.          [EGY]         12 Events        145 pts     ▾ | 
|      └─► Points Breakdown (Click to expand):                          |
|          • Participation Points: 60 pts (12 events x 5)               |
|          • Performance Improvement: 70 pts (7 jumps x 10)             |
|          • Ranking Stability: 15 pts (3 instances x 5)                |
+-----------------------------------------------------------------------+
| #2   Sarah Jenkins       [USA]         10 Events        120 pts     ▸ |
+-----------------------------------------------------------------------+
| #3   Amine Bouaza        [MAR]         8 Events         95 pts      ▸ |
+-----------------------------------------------------------------------+

```

### 5. Athlete Profile View Layout (`src/routes/athletes/[username]/+page.svelte`)

*Aesthetic: Card layout layout with a clear layout separating biographical identity from tournament metadata.*

```
+-----------------------------------------------------------------------+
| ATHLETE PROFILE                                                       |
|                                                                       |
| +----------------------------------+  +-----------------------------+ |
| | PRIMARY BIOGRAPHY                |  | LEAGUE PERFORMANCE SUMMARY  | |
| | Name: Youssef A.                 |  |                             | |
| | Nationality: Egypt [EGY]         |  | Current Rank: #1 Global     | |
| | Gender: Male                     |  | Total Form points: 145      | |
| | Date of Birth: Hidden            |  | Affiliation: AutoCom Club   | |
| |                                  |  +-----------------------------+ |
| | Bio: Multi-discipline power      |  | SYSTEM ACHIEVEMENTS         | |
| | builder specializing in tracking |  | [Badge: 3x Consecutive Pos] | |
| | systematic point engines.        |  | [Badge: Most Improved 2026] | |
| +----------------------------------+  +-----------------------------+ |
+-----------------------------------------------------------------------+
| TOURNAMENT PROFILE LEDGER                                             |
| • Summer Open 2026  | Placed: 1st  | Delta: +10 Improvement, +5 Regist. |
| • Spring Trial 2026 | Placed: 1st  | Delta: +5 Stability, +5 Regist.    |
+-----------------------------------------------------------------------+

```

---

## Part 3: UX Production Standards For Speed

1. **Skeleton Screens:** When a user transitions to the `Ranking` page, don't show a blank screen while loading points. Create a visual placeholder of the rows using Tailwind's layout properties mixed with `animate-pulse` styling over light gray bars.
2. **No Layout Shifts (CLS):** Fix the heights of your event image wrappers and scoreboard list containers. When data returns from Supabase, elements should fade in gracefully without violently pushing the footer downwards.
3. **Clean State Controls:** Manage the competition filter states (Upcoming vs Closed) natively inside the URL query params (`/competitions?status=open&search=giza`). This allows users to share direct links to filtered event listings, which dramatically improves production usability.

With the wireframes mapped out, we can move directly into implementation preparation.

What step should we tackle next? We can assemble the **Supabase Row Level Security (RLS) policies** to protect access to user records, or lay out the **SvelteKit + Tailwind project folder scaffolding** file structure?

Setting up your repository cleanly from day one keeps your development fast. This structure is designed specifically for **SvelteKit** (using standard folder-based routing), optimized for **Tailwind CSS** scoping, and integrated with **Supabase** data flows, all ready to deploy to **Netlify**.

Here is your production-grade project scaffolding blueprint.

---

## The V League Project Structure

```text
v-league/
├── 
│   app.css
│   app.d.ts
│   app.html
│   
├───lib
│   │   auth.js
│   │   profile.js
│   │   supabase.js
│   │   supabaseData.js
│   │   
│   ├───components
│   │   ├───features
│   │   │       AthleteGridItem.svelte
│   │   │       CompetitionCard.svelte
│   │   │       RankingRow.svelte
│   │   │       
│   │   ├───layout
│   │   │       Footer.svelte
│   │   │       Navbar.svelte
│   │   │       
│   │   └───ui
│   │           Badge.svelte
│   │           Button.svelte
│   │           Card.svelte
│   │           
│   ├───sections
│   │   ├───home
│   │   │       HomeHero.svelte
│   │   │       PlatformStats.svelte
│   │   │       
│   │   └───shared
│   │           AuthForm.svelte
│   │           
│   └───utils
│           competitionRegistration.js
│           rankingAlgo.js
│           ui.js
│           
└───routes
    │   +layout.js
    │   +layout.svelte
    │   +page.svelte
    │   
    ├───admin
    │       +page.js
    │       +page.svelte
    │       
    ├───athletes
    │   │   +page.js
    │   │   +page.svelte
    │   │   
    │   └───[id]
    │           +page.js
    │           +page.svelte
    │           
    ├───auth
    │   │   +page.svelte
    │   │   
    │   └───logout
    │           +server.js
    │           
    ├───blog
    │   │   +page.svelte
    │   │   
    │   └───[slug]
    │           +page.svelte
    │           
    ├───competitions
    │   │   +page.js
    │   │   +page.svelte
    │   │   
    │   └───[id]
    │           +page.server.js
    │           +page.svelte
    │           
    ├───profile
    │   └───edit
    │           +page.server.js
    │           +page.svelte
    │            
    └───ranking
            +page.js
            +page.svelte
```
Okay good, I want you to rethink about the server side and client-side. as server-side is better for fast initial loads and search engine optimization (SEO), while client-side is better for rich user interactivity and app-like responsiveness. ensure that server side and client-side, are well in the app.  this because I want to make the app clean, and matching. remove an wanted or unused things example "/auth/logout fallback" as now navbar handle logout. so look at the whole app from your own side thinking and optimize and organize, if needed.

Also new things to do after: 
1. I want to continue building the landing page @src/routes/+page.svelte. I want you to continue building new sections at this page at your own, by your own thinking. 
2. I want to make a logout button in the @src/routes/profile/edit/+page.svelte beside the save profile button. 
3. Admin page is just for admins, I don't want the normal signed in user to access this page. admins will only able to add competitions. so remove the admin page entirely.  
4. this is a fix I want to do, when user first sign up. when i attempt to sign up and then after confirming email and everything done right. the bio i have written while sign up, does not saved in the db in supabase or even shown at the profile.
5. also another fix is that also an error message appears in the authform after clicking create account, saying the New row conflict with the RLC policies defined with the public.profile table. 