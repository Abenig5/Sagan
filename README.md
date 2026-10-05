# Sagan Beauty — Website + Booking Admin

Bilingual (EN/DE) Next.js site for Sagan Beauty, a hair & beauty studio in
Switzerland, with online booking and a staff admin area. Built from the
design handoff in `design_handoff_sagan_beauty/` (see that folder's
`README.md` for the full visual/behavioural spec).

- **Framework**: Next.js 15 (App Router, TypeScript), React 18
- **Database**: MySQL via Prisma
- **Auth**: NextAuth (credentials provider, staff accounts only)
- **i18n**: hand-rolled `/en` and `/de` routes (default `de`)
- **Email**: Resend if `RESEND_API_KEY` is set, otherwise logged to the console

## Getting started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a MySQL connection string (the default matches the Docker database below)
   - `NEXTAUTH_SECRET` — random string (`openssl rand -base64 32`)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the first staff login, created by the seed script
   - Optionally `RESEND_API_KEY`, `EMAIL_FROM`, `SALON_NOTIFICATION_EMAIL` for real emails

3. Start MySQL in Docker (MySQL 8.4 on `localhost:3306`, data kept in the `mysql-data` volume):

   ```sh
   docker compose up -d       # stop with `docker compose down`; add `-v` to wipe the data
   ```

   Credentials are `sagan` / `sagan` (root: `root`), database `sagan_beauty`. The
   `sagan` user has global privileges so `prisma migrate dev` can create its shadow
   database — this setup is for local development only.

4. Create the database schema and seed demo data:

   ```sh
   npm run db:migrate   # creates tables (prompts for a migration name on first run)
   npm run db:seed       # default settings, one staff user, a handful of demo bookings
   ```

5. Run the dev server:

   ```sh
   npm run dev
   ```

   - Public site: http://localhost:3000 (redirects to `/de`)
   - Admin: http://localhost:3000/admin/login (sign in with the seeded admin email/password)

## Project structure

```
app/
  [locale]/            Public site (home, services, book, about, contact) — /en and /de
  admin/               Staff admin (login, bookings, availability, settings)
  api/
    availability/      Public read-only endpoint: free/booked/unavailable per slot
    auth/[...nextauth] NextAuth route
    contact/           Contact form -> email
components/
  site/                Header, Footer, ContactForm
  booking/             4-step booking wizard, Calendar, TimesPanel
  admin/                AdminChrome, BookingsView, AvailabilityView, SettingsView, LoginForm
lib/
  data/                Service catalogue (catalogue.ts) and defaults — static business data
  actions/             Server Actions (mutations): booking, admin bookings, availability, settings, lang
  i18n/                Dictionaries (en/de copy) and locale helpers
  availability.ts      Pure availability rules (regularSlots/daySlots/isFree/...)
  booking.ts           DB-backed availability + booking creation (with conflict re-check)
  settings.ts          Settings row read/write
  auth.ts              NextAuth config
  prisma.ts            Prisma client singleton
prisma/
  schema.prisma        Booking, Settings, BlockedSlot, Closure, StaffUser
  seed.ts              Seed script
public/assets/         Logo artwork copied from the design handoff
middleware.ts          Locale redirect for the public site + admin auth guard
```

## Notes on design decisions

- **Service catalogue** (`lib/data/catalogue.ts`) is static TypeScript data, not a
  database table — it mirrors the salon's fixed price lists from the design
  handoff and isn't meant to be edited through the admin UI (matches the
  prototype, which hardcodes it too).
- **Booking conflicts**: MySQL has no partial/filtered unique indexes, and a
  declined booking must free its slot for reuse — so there's no hard DB
  uniqueness constraint on `(date, time)`. Availability is re-checked inside a
  transaction at booking time (`lib/booking.ts`) and a conflict is surfaced as
  a friendly error in the wizard.
- **Availability rules** live in `lib/availability.ts` as pure functions
  (no DB access), matching the README's `regularSlots` / `daySlots` / `isFree`
  spec, so they're easy to unit test independently of Prisma.
- **Admin mutations** are Server Actions (not hand-written API routes) and
  each one re-checks the session server-side via `requireAdmin()`, since
  Server Actions are reachable directly and not just through the
  middleware-protected pages.
- **Service/catalogue types and copy** are a direct TypeScript port of the
  prototype's `SERVICES`/`CATS`/`T` objects — the design handoff explicitly
  calls that block "the source of truth for copy and rules," so it was
  translated as-is rather than re-authored.

## Still open (see design handoff `README.md` → "Open Items")

- Real address/phone/email, About-us story text, staff photos, Impressum/privacy policy, cancellation policy copy — all currently placeholders.
- Photo slots (`.photo-slot` elements) need the salon's real photos.
- Decide whether to support multiple chairs/staff or duration-based blocking (the current model assumes one chair and ignores service duration, per the handoff).
