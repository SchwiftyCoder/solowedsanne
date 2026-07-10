# Solomon & Anne's Wedding Site

A Next.js app for Solomon & Anne's wedding:

- Guests enter their name, email, or phone number on the home page and are shown their table number and a link to the shared photo album.
- `/admin` (password protected) has two buttons to text every guest: a reminder with the wedding details, and a post-wedding thank-you.

## 1. Install dependencies

```bash
npm install
```

> If `npm`/`node` aren't recognized in your terminal, Node.js is installed at `C:\Program Files\nodejs` but may not be on your `PATH`. Either add that folder to your system `PATH` (search "Edit environment variables" in Windows) and restart your terminal, or reinstall from [nodejs.org](https://nodejs.org) and let it register itself.

## 2. Set up Supabase (the database)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open the **SQL Editor** and run everything in [`supabase-schema.sql`](./supabase-schema.sql). This creates the `seating` table (guest name, email, phone, table/seat number).
3. Go to **Settings > API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — never expose it to the browser)

## 3. Set up Twilio (SMS)

1. Create an account at [twilio.com](https://www.twilio.com) and buy/activate a phone number capable of sending SMS.
2. From the Twilio Console copy your **Account SID** and **Auth Token**.
3. Note the Twilio phone number in `+1XXXXXXXXXX` format.

Trial Twilio accounts can only text phone numbers you've manually verified in the console — you'll need a paid account to text your full guest list.

## 4. Configure environment variables

Copy the example file and fill in the real values from steps 2–3:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ADMIN_PASSWORD=...        # pick your own password for the /admin page
SITE_URL=http://localhost:3000   # update to your real domain after deploying
```

`.env.local` is already git-ignored, so these secrets never get committed.

## 5. Import the guest list

`scripts/import-seating.ps1` reads an Excel sheet named **"Ghana Wedding Guests"** with columns `First Name | Last Name | Phone Number | Email | Seat Position` (seat position formatted like `Table 1 - Seat 1`) and upserts it into the `seating` table. This matches the format of `dummy wedding guest list.xlsx` in your Downloads folder — replace that with your real 100-guest list using the same column layout, then run:

```powershell
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
./scripts/import-seating.ps1 -ExcelPath "C:\path\to\your guest list.xlsx"
```

(Requires Microsoft Excel installed, since the script drives it via COM automation.)

## 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test the guest lookup flow, and [http://localhost:3000/admin](http://localhost:3000/admin) (browser will prompt for a username + your `ADMIN_PASSWORD`) to test the SMS buttons.

## 7. Deploy

Push this repo to GitHub (e.g. under [github.com/SchwiftyCoder](https://github.com/SchwiftyCoder)) and deploy on [Vercel](https://vercel.com/new) — import the repo, add all the `.env.local` variables in the Vercel project's Environment Variables settings, and set `SITE_URL` to your production domain (e.g. `https://solowedsanne.vercel.app`). Vercel auto-deploys on every push to `main`.

## Using the admin page

- Visit `/admin` any time after guests are imported.
- **Send Wedding Reminder** — texts every guest the date, time, venue, dress code, and their personal table link. Use this in the days before the wedding.
- **Send Thank You Message** — texts every guest a thank-you note with the photo album link. Use this after the wedding.

Both buttons ask for confirmation before sending and report how many messages succeeded/failed.

## Project structure

```
src/app/page.tsx                  Guest entry (name/email/phone lookup)
src/app/welcome/[id]/page.tsx     Table number + photos link
src/app/admin/page.tsx            Admin SMS trigger page
src/app/api/table/lookup/         Guest lookup API
src/app/api/admin/                Admin APIs (guest count, send SMS)
src/lib/supabase.ts               Supabase client factory
src/lib/twilio.ts                 Twilio SMS sending
src/lib/wedding-details.ts        Shared wedding info used in SMS templates
src/proxy.ts                      Password-gates /admin and /api/admin/*
scripts/import-seating.ps1        Imports the guest list Excel file
supabase-schema.sql               Database schema
```
