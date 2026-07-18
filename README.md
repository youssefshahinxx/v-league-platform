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
├── src/
│   ├── app.css                 # Global CSS (where Tailwind directives live)
│   ├── app.html                # Base HTML template for your app
│   ├── lib/                    # Reusable code accessible via '$lib/' alias
│   │   ├── supabase.js         # Supabase client initialization (Auth + DB)
│   │   ├── components/         # Organized component ecosystem
│   │   │   ├── ui/             # Pure presentational blocks
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Badge.svelte
│   │   │   │   └── Card.svelte
│   │   │   ├── layout/         # Shell components
│   │   │   │   ├── Navbar.svelte
│   │   │   │   └── Footer.svelte
│   │   │   └── features/       # Business-logic-heavy components
│   │   │       ├── CompetitionCard.svelte
│   │   │       ├── RankingRow.svelte
│   │   │       └── AthleteGridItem.svelte
│   │   └── utils/              # Helper utilities (e.g., formatters, math engines)
│   │       └── rankingAlgo.js  # Frontend score checker or parsing rules
│   └── routes/                 # SvelteKit Routing System
│       ├── +layout.svelte      # Main App Wrapper (Loads global Navbar/Footer)
│       ├── +page.svelte        # Homepage (Hero, Mission, Highlights)
│       ├── athletes/           
│       │   ├── +page.svelte    # Directory of all public athlete cards
│       │   └── [username]/     
│       │       └── +page.svelte# Individual athlete's public profile page
│       ├── blog/               
│       │   ├── +page.svelte    # Article list/feed
│       │   └── [slug]/         
│       │       └── +page.svelte# Full blog post reader view
│       ├── competitions/       
│       │   ├── +page.svelte    # Tournament hub (Filters, search bar)
│       │   └── [id]/           
│       │       └── +page.svelte# Deep-dive event page & ticket checkout gateway
│       ├── ranking/            
│       │   ├── +page.svelte    # Scoreboard view
│       │   └── +page.js        # Fetches point ledger records from Supabase
│       ├── profile/            
│       │   └── edit/           
│       │       ├── +page.svelte   # Private dashboard to manage bio/details
│       │       └── +page.server.js# Securely posts profile updates back to Supabase
│       └── auth/               
│           ├── +page.svelte    # Dynamic login, signup, and recovery screen
│           └── logout/         
│               └── +server.js  # Dedicated API endpoint to destroy auth sessions
├── static/                     # Static media assets
│   ├── favicon.png
│   └── icons/                  # SVG sports symbols, brand logos
├── .env                        # Private environment variables (SUPABASE_KEY, etc.)
├── .env.example                # Blank boilerplate of your keys for version control
├── .gitignore                  # Blocks node_modules and .env from being leaked
├── netlify.toml                # Netlify edge hosting pipeline build configurations
├── package.json                # Project dependencies and deployment scripts
├── postcss.config.js           # CSS processing management (Needed for Tailwind)
├── svelte.config.js            # Svelte compiler rules, configured with Netlify adapter
├── tailwind.config.js          # Theme defaults, spacing rules, and content tracking
└── vite.config.js              # Vite packaging engine core options

```

---

## Production-Grade Environment Checklist

> **The `.env` Guard:** Never commit your actual `PUBLIC_SUPABASE_ANON_KEY` or database passwords to Github. Put them strictly inside your local `.env` file, and duplicate the blank layout structure into `.env.example` so you remember what keys your host environment will need later.
> **The Netlify Adapter:** SvelteKit defaults to a generic auto-adapter. To use Netlify's high-speed edge features, install `@sveltejs/adapter-netlify` and swap it into your `svelte.config.js` file right away so that previews build identically to production environments.

Now that your project directory is cleanly laid out, we are ready to inject the engine scripts into these files.

Would you like to build out the **`tailwind.config.js` and custom utility styles** next to lock down your clean, minimal layout style, or should we configure the **Supabase client client initialization (`src/lib/supabase.js`)** to handle your platform's session tracking?

Here is the exact terminal execution sequence to generate your clean SvelteKit, Tailwind, and Supabase architecture. Open your terminal, navigate to the directory where you store your projects, and run these steps in order.

---

## Workspace Scaffold Automation

1. **Initialize the SvelteKit Application:** Step 1.
Run the official Svelte initiator. Choose **Skeleton project**, select **TypeScript** or **JavaScript** based on your preference, and opt-in to any linting/formatting tools you like (Prettier/ESLint are highly recommended for production):

```bash
npm create svelte@latest v-league
cd v-league

```


2. **Install Core Infrastructure & Production Packages:** Step 2.
Install your primary engine blocks: the Supabase JavaScript ecosystem client for authentication and database interactions, and the Netlify adapter to replace SvelteKit's default auto-host target:

```bash
npm install @supabase/supabase-js
npm install -D @sveltejs/adapter-netlify

```


3. **Configure Tailwind CSS Ecosystem:** Step 3.
Install Tailwind alongside its required processing dependencies, PostCSS and Autoprefixer, then initialize the layout configuration blueprints:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```


4. **Generate the Directory Architecture:** Step 4.
Use the `mkdir -p` flag to build out your entire feature-centric folder structure in a single, clean sweep:

```bash
mkdir -p src/lib/components/ui src/lib/components/layout src/lib/components/features src/lib/utils static/icons src/routes/athletes/\[username\] src/routes/blog/\[slug\] src/routes/competitions/\[id\] src/routes/ranking src/routes/profile/edit src/routes/auth/logout

```


5. **Provision Component and Utility Layout Files:** Step 5.
Create all structural UI components, configuration mirrors, and utility files as empty modules, completely ready for you to build out:

```bash
# Create configuration baselines
touch .env .env.example netlify.toml src/app.css

# Create global infrastructure modules
touch src/lib/supabase.js src/lib/utils/rankingAlgo.js

# Create reusable UI atomic component blocks
touch src/lib/components/ui/Button.svelte src/lib/components/ui/Badge.svelte src/lib/components/ui/Card.svelte

# Create global app shell scaffolding blocks
touch src/lib/components/layout/Navbar.svelte src/lib/components/layout/Footer.svelte

# Create data-aware dashboard feature modules
touch src/lib/components/features/CompetitionCard.svelte src/lib/components/features/RankingRow.svelte src/lib/components/features/AthleteGridItem.svelte

```


6. **Provision System Route Pages:** Step 6.
Populate every route folder with its mandatory SvelteKit layout or routing engine hooks (`+page.svelte`, `+page.js`, or `+server.js`):

```bash
# Root shell layout overrides
touch src/routes/+layout.svelte src/routes/+page.svelte

# Athlete directory pages
touch src/routes/athletes/+page.svelte src/routes/athletes/\[username\]/+page.svelte

# Blog engine pages
touch src/routes/blog/+page.svelte src/routes/blog/\[slug\]/+page.svelte

# Competition listings and deep profiles
touch src/routes/competitions/+page.svelte src/routes/competitions/\[id\]/+page.svelte

# High-performance ranking scoreboard route
touch src/routes/ranking/+page.svelte src/routes/ranking/+page.js

# Secure user management views
touch src/routes/profile/edit/+page.svelte src/routes/profile/edit/+page.server.js
touch src/routes/auth/+page.svelte src/routes/auth/logout/+server.js

```


---

## Crucial Post-Setup Modifications

Before launching your local development server, you need to quickly modify two core config files to hook up Tailwind and the Netlify hosting target.

### 1. Connect Tailwind to your App Shell (`src/app.css`)

Open your freshly created `src/app.css` file and add the following directives right at the top so Tailwind can process your utility classes globally:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### 2. Update `svelte.config.js` to Use the Netlify Adapter

Open your `svelte.config.js` file. Replace the default `adapter-auto` import with your new Netlify adapter module. Your file structure should look like this:

```javascript
import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: vitePreprocess()
};

export default config;

```

---

## Start Your Engine

Now that your workspace is structurally mapped out and ready for high-grade production design, you can verify your installation:

```bash
npm run dev -- --open

```

This will run your Vite bundling compiler server locally and automatically launch your application viewport page right inside your browser window.

Now that the directory layout and build configuration pipes are firmly running, should we focus on implementing the core layout files (`+layout.svelte`, `Navbar`, and `Footer`) to lock down your clean, minimal look, or would you prefer to map out the exact database creation commands (SQL) to spin up your tables inside the Supabase console?

The most bulletproof, production-grade way to build your database in Supabase isn't clicking around the visual Table Editor—it's running a clean script directly in the **SQL Editor**. This ensures all your foreign keys, constraints, and relational links are perfectly mapped instantly.

Log into your Supabase Dashboard, select your project, click on the **SQL Editor** tab in the left sidebar (the icon looks like a terminal prompt `>_`), click **New Query**, and follow these steps.

---

## Step 1: Execute the Database Blueprint

Paste the following script into the editor window and click **Run**. This single script handles our custom point rules, establishes all six core tables, and configures the relational architecture we mapped out earlier.

```sql
-- 1. Create Custom Types & Enums for strict validation
CREATE TYPE competition_status AS ENUM ('upcoming', 'open', 'closed', 'completed');
CREATE TYPE point_reason AS ENUM ('participation', 'stability', 'improvement');

-- 2. Create the Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nationality VARCHAR(3),
    gender VARCHAR(10),
    dob DATE,
    club TEXT,
    bio TEXT,
    achievements TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create the Competitions Table
CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    status competition_status DEFAULT 'upcoming' NOT NULL,
    ticket_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create the Registrations Table (Ticket / Participation Tracker)
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    payment_status TEXT DEFAULT 'paid' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(profile_id, competition_id) -- Prevents duplicate tournament signups
);

-- 5. Create the Event Results Table
CREATE TABLE public.event_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    final_rank INTEGER NOT NULL CHECK (final_rank > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(competition_id, profile_id) -- One entry per athlete per event
);

-- 6. Create the Points Ledger Table (Append-Only Transaction Engine)
CREATE TABLE public.points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    reason point_reason NOT NULL,
    points_awarded INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Create the Blogs Table
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

```

---

## Step 2: Automate Athlete Profile Creation

Right now, when an athlete registers via your SvelteKit app, Supabase creates a user inside its private `auth.users` table, but your public `profiles` table remains blank.

To bridge this automatically without writing messy frontend sync code, we write a quick database trigger function. Run this block next in your SQL editor:

```sql
-- Create a function that handles syncing auth users to public profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, nationality, gender, dob, club)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous Athlete'),
    NEW.raw_user_meta_data->>'nationality',
    NEW.raw_user_meta_data->>'gender',
    (NEW.raw_user_meta_data->>'dob')::DATE,
    NEW.raw_user_meta_data->>'club'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up a trigger to fire this function automatically every time a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

```

---

## Step 3: Verify the Deployment Structure

Now that your scripts have executed, your database is configured. You can visually verify your architecture by running through these navigation touchpoints:

1. **Inspect the Schema Structure:** Database Schema View.
Click on the **Table Editor** icon (the grid pattern) in the far-left sidebar menu. You should see all six tables (`profiles`, `competitions`, etc.) listed clearly.


2. **Confirm Relational Integrity Constraints:** Foreign Key Verification.
Select the `registrations` table inside the Table Editor panel, and look closely at the table headers. The `profile_id` and `competition_id` columns will display a small chain link icon, confirming they are bound directly to their source records.


3. **Verify Database Event Automation:** Trigger Function Check.
Click on the **Database** icon (the cylinder symbol) in the left sidebar menu, and navigate down to the **Triggers** section. Ensure that `on_auth_user_created` is present and toggled to an active state.


---

## Pro-Grade Architectural Edge

> **Why `SECURITY DEFINER` Matters:** In our user sync function, we set the permission model to `SECURITY DEFINER`. This gives the background function administrative execution clearance to insert data directly into your tables, even when the newly registered user hasn't completed authentication yet.

Now that the database engine is running perfectly, your schema is ready to start accepting live data safely.

That is a vital catch. Without that trigger, the `handle_new_user` function is just sitting there idle, meaning when people sign up, no public profile gets created and your SvelteKit frontend won't find any athlete data.

There is a specific reason why you might not see it in the visual dashboard: Supabase's basic UI dashboard sometimes only displays triggers attached to tables in the **`public`** schema. Because this trigger listens to the **`auth.users`** table (which is an internal system schema), it frequently hides from the visual interface, even when it's active.

Let's firmly hook it up via the SQL editor to ensure it's running, and then query the database directly to verify it exists.

---

## 1. Apply the Missing Trigger Link

Go to your **SQL Editor** (`>_`), open a blank query window, and run this script to forcefully drop any partial link and attach the trigger directly to the auth engine:

```sql
-- Clean out any hidden broken links
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Bind the trigger directly to the core auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

```

---

## 2. Verify It's Real (Bypass the Dashboard UI)

Since we can't trust the visual dashboard tabs for cross-schema triggers, let's look at the actual system catalog. Run this exact block inside your SQL Editor:

```sql
SELECT tgname AS trigger_name, 
       relname AS table_name,
       instr.nspname AS table_schema
FROM pg_trigger
JOIN pg_class ON pg_class.oid = tgrelid
JOIN pg_namespace instr ON instr.oid = pg_class.relnamespace
WHERE tgname = 'on_auth_user_created';

```

If it returns a row showing `on_auth_user_created` tied to `users` in the `auth` schema, **your automation is working perfectly**, regardless of what the dashboard display shows.

---

## Important Architecture Warning

Look at your second function: `rls_auto_enable`. This background function automatically runs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` every single time a new table is built.

Because this ran successfully, **every single one of your tables is currently locked down 100% tight**. If you try to fetch your blogs or display upcoming competitions in SvelteKit right now, Supabase will return empty arrays because no access policies have been defined yet.

Should we write the **Row Level Security (RLS) policies** next so your SvelteKit frontend can actually read your data, or would you prefer to map out the **point calculation automation rules** for your ranking scoreboard?

That is an excellent security guardrail. Having a global database event trigger (`ensure_rls`) listening to `ddl_command_end` is a fantastic production-grade practice. It means you don't have to rely on human memory—every time you run a `CREATE TABLE` script, PostgreSQL automatically clamps it down.

However, because that safety net is actively running, your entire SvelteKit frontend is currently hitting a brick wall. If you try to fetch competitions or view the scoreboard, Supabase will return empty arrays because no explicit access pathways exist.

Let's write the SQL scripts to punch the exact permissions holes we need for your platform features. Open your **SQL Editor** (`>_`) and execute this master security configuration.

---

## The V League Security Blueprint (RLS Policies)

We need to balance two modes of access:

1. **Public Read-Access:** Anyone on the internet can browse the homepage, view competitions, check the leaderboard, read blogs, and click on an athlete's profile.
2. **Strict Write-Access:** Users can only change their own personal information, and points/results can never be modified by normal users.

### 1. `profiles` Table Policies

*Anyone can see an athlete's profile, but an athlete can only edit their own data.*

```sql
-- Allow anyone to search or view player profiles
CREATE POLICY "Profiles are publicly viewable" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to update only their own profile details
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

```

### 2. `competitions` Table Policies

*Anyone can browse the tournament schedule, but users can't create or tamper with events.*

```sql
-- Allow the public to view tournaments
CREATE POLICY "Competitions are publicly viewable" 
ON public.competitions FOR SELECT 
USING (true);

-- Note: INSERT, UPDATE, DELETE are left unconfigured. 
-- Only your admin dashboard or Supabase Service Role can change them.

```

### 3. `registrations` Table Policies

*Users need to see their own tickets, and authenticated players must be allowed to sign up for an event.*

```sql
-- Allow users to view their own event registrations/tickets
CREATE POLICY "Users can view their own registrations" 
ON public.registrations FOR SELECT 
USING (auth.uid() = profile_id);

-- Allow signed-in users to purchase tickets/register for themselves
CREATE POLICY "Users can register for competitions" 
ON public.registrations FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

```

### 4. `event_results` Table Policies

*The standings must be transparent so anyone can verify rankings, but users can't write their own placements.*

```sql
-- Allow public transparency for ranking verifications
CREATE POLICY "Event results are publicly viewable" 
ON public.event_results FOR SELECT 
USING (true);

```

### 5. `points_ledger` Table Policies

*Your scoreboard engine requires complete data visibility for tracking point calculations, but users have zero modify rights.*

```sql
-- Allow anyone to see how scores are totaled
CREATE POLICY "Points ledger is publicly viewable" 
ON public.points_ledger FOR SELECT 
USING (true);

```

### 6. `blogs` Table Policies

*Your news and media must be accessible to visitors, while edits remain restricted to authorized content tools.*

```sql
-- Allow everyone to read articles
CREATE POLICY "Blogs are publicly viewable" 
ON public.blogs FOR SELECT 
USING (true);

```

---

## Production Security Validation

To verify everything is working smoothly, look at your configuration layout in Supabase:

* Go to **Authentication** -> **Policies** in the sidebar.
* You will see all your public tables listed with their green RLS shields toggled to **Enabled**.
* Below each table, you will see your new custom policy rules mapped out.

Now, your SvelteKit frontend can run `supabase.from('competitions').select('*')` without getting blocked by a security error.

Now that the data layer is secure and accessible, should we build the **database calculation logic (stored procedures or hooks)** to automatically award points to the `points_ledger` when event standings are saved, or are you ready to jump into the frontend code to wire up the **Supabase Client initialization inside SvelteKit**?

*************me Yes, I would like to "build out the Authentication UI wrapper (src/routes/auth/+page.svelte) so users can actually sign up and log into your platform, and then we should wire up the data-loading code for the Global Ranking Board (src/routes/ranking/+page.svelte)"

but let me first introduce some errors i faced while last implementations.
1. +layout.js - Code: 
import { supabase } from '$lib/supabase';

export const ssr = false; // Turn off SSR momentarily for rapid MVP auth tracking

/** @type {import('./$types').LayoutLoad} */
export async function load() {
    // Safely check if a user session is active on initialization
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
        session
    };
}

Error line: {import('./$types').LayoutLoad} // The type of a function declaration must match the function's signature. | Namespace '"c:/Users/JOE/Documents/GitHub/v-league/.svelte-kit/types/src/routes/$types"' has no exported member 'LayoutLoad'.

2. +layout.svelte:
First Error line : export let data; // Cannot use `export let` in runes mode — use `$props()` instead
https://svelte.dev/e/legacy_export_invalid
Second Error line : ("data.session?.access_token" & "<Navbar session={data.session} />") // Property 'session' does not exist on type '{}'.  any

and here are two files I want you to give a quick check before we continue, and also keep in mind that I picked 