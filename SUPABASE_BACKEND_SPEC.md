# Database Overview

This project contains a PostgreSQL database dump for a Supabase-backed athletics and competition platform. It includes the core system tables, user authentication, real-time messaging, file storage, and the business logic for managing competitions, athletes, score tracking, and rankings.

## 1. Database Type

- PostgreSQL cluster dump
- Built for Supabase environment
- Includes standard Supabase schemas and extension support
- Designed for a sports/athletics league application

## 2. Included Schemas

### 2.1 auth
Purpose: user accounts, authentication, sessions, identity data, MFA, and OAuth.

Included objects:
- users
- identities
- sessions
- refresh_tokens
- flow_state
- oauth_clients / oauth_authorizations
- mfa_factors / mfa_challenges / mfa_recovery_codes
- audit_log_entries
- custom_oauth_providers

This schema manages the users who register to the platform and their authentication lifecycle.

### 2.2 public
Purpose: the main application data for the athletics platform.

Core tables:
- profiles: athlete profiles and personal details
- competitions: competition events and information
- competition_events: individual events inside a competition
- events: event catalog such as 100m, long jump, shot put
- registrations: athlete competition registration records
- payments: payment records for events and competitions
- event_results: athlete results for each competition event
- event_attempts: multiple attempts for jump/throw events
- points_ledger: points awarded for placements and record achievements
- scoring_systems: leaderboard/scoring setup
- scoring_rules: points per rank
- scoring_bonus_rules: bonus points for record achievements
- blogs: CMS/news articles
- contact_messages: visitor inquiry or contact submissions

### 2.3 storage
Purpose: uploaded media and file assets.

Included objects:
- buckets
- objects
- multipart upload tracking tables
- bucket analytics/vector metadata tables

This database stores:
- athlete avatars
- profile certificates
- competition images and media
- event or campaign assets

### 2.4 realtime
Purpose: live update infrastructure for subscriptions and event broadcasting.

Included objects:
- subscription
- messages
- broadcast-related SQL functions
- authorization and filtering functions

This supports real-time updates for live sporting activity and app notifications.

## 3. Business Domain Summary

This database models a competitive athletics league centered around athlete performance and rankings.

### Athletes and profiles
- Each athlete is stored in profiles
- Fields include name, nationality, gender, DOB, club, bio, achievements, and social links
- Athlete avatar and certificate files are linked through storage

### Competitions and events
- competitions are master events or meet entries
- competition_events connect a competition to a specific event (e.g. 100m, long jump)
- events define the event type, measurement kind, and rules

Example event metadata:
- track or field
- time, distance, or height
- lower-is-better or higher-is-better
- attempts support
- wind support
- heat/final support

### Results and scoring
- event_results stores an athlete’s final result in a competition event
- event_attempts captures attempts when applicable
- scoring_rules assigns points by finish position
- scoring_bonus_rules gives extra points for league, competition, or national records
- points_ledger records how points were added or adjusted

### Rankings
Materialized views provide summary data for display:
- leaderboard
- mv_individual_standings
- mv_event_statistics
- competition_event_results

These views power dashboards, athlete standings, and competition rankings.

## 4. Key Features in the Database

### User management
- Auth schema with login/session support
- Identity mapping for users
- MFA and OAuth support
- Row-level security and Supabase authentication features

### Competition management
- Competitions have status, pricing, date, and media
- Events can be scheduled and assigned to specific competitions
- Events support different performance types and validation rules

### Athletic scoring model
- Points are awarded based on placement
- Bonus rules support special achievements
- Record status can be marked on event results

### Media and profile assets
- Storage buckets support profile and competition media
- Certificates and avatars can be attached to athlete profiles

### Realtime updates
- Real-time schema enables live subscriptions and notifications
- Useful for live score updates and event activity feeds

## 5. Example Data Included

The dump contains sample records for:
- athlete profiles such as Youssef Mohamed, Ali Zyad, and Youssef Shahin
- competition entries for the V Athletics league
- event results in sprint and long jump events
- scoring rules with a default V League scoring system
- blog posts and contact message submissions

## 6. Database Security and Operations

The dump includes:
- Supabase roles such as anon, authenticated, service_role, authenticator, and admin roles
- extensions including:
  - pg_stat_statements
  - pgcrypto
  - uuid-ossp
  - supabase_vault
- standard PostgreSQL security and schema setup for Supabase deployments

## 7. Simplified Schema Summary

| Schema | Purpose |
| --- | --- |
| auth | Authentication, users, sessions, MFA, OAuth |
| public | Core application data and sports logic |
| storage | File/media assets |
| realtime | Live event subscriptions and broadcasting |

| Public Table | Role |
| --- | --- |
| profiles | Athlete profiles |
| competitions | Meet or tournament records |
| competition_events | Event instances in a competition |
| events | Event definitions |
| registrations | Athlete signups |
| payments | Payment tracking |
| event_results | Athlete performance results |
| event_attempts | Multi-attempt results |
| points_ledger | Score ledger |
| scoring_systems | Ranking systems |
| scoring_rules | Points by rank |
| scoring_bonus_rules | Bonus points |
| blogs | Content/news |
| contact_messages | Contact submissions |

## 8. Overall Interpretation

This database is a complete backend for an athletics competition platform with:
- athlete registration and profiles
- competition scheduling
- event/result management
- rank tracking and scoring
- CMS/news functionality
- payments
- media storage
- auth/session handling
- real-time live event support

In short, it is not just a generic database; it is a sports-management system built specifically for a V Athletics style league platform.

## 9. Recommended Use

Use this database as the foundation for:
- athlete dashboards
- competition websites
- broadcasting or live score pages
- admin dashboards for results verification
- leaderboard pages
- media-rich event content

---

This README is a summarized specification of the included database and is intended as a concise guide.
