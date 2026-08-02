# Solomon & Anne's Wedding Site

A Next.js app for Solomon & Anne's wedding:

- Guests enter their name, email, or phone number on the home page and are shown their table number, the wedding program, and links to view/upload photos.
- `/admin` (password protected) has three tools: send a reminder SMS to every guest, send a thank-you SMS (locked until a month after the wedding), and text a one-off number for testing.

## 1. Install dependencies

```bash
npm install
```

> If `npm`/`node` aren't recognized in your terminal, Node.js is installed at `C:\Program Files\nodejs` but may not be on your `PATH`. Either add that folder to your system `PATH` (search "Edit environment variables" in Windows) and restart your terminal, or reinstall from [nodejs.org](https://nodejs.org) and let it register itself.

## 2. Set up Neon (the database)

1. Create a free project at [neon.tech](https://neon.tech).
2. In the Neon dashboard's **SQL Editor**, run everything in [`schema.sql`](./schema.sql). This creates the `seating` table (guest name, email, phone, table number, message, family flag).
3. Go to your project's **Connection Details** and copy the connection string (starts with `postgresql://...`) → `DATABASE_URL`.

Neon's free tier auto-wakes on the next query after being idle — unlike some providers, it never needs a manual restart.

## 3. Set up Twilio (SMS)

1. Create an account at [twilio.com](https://www.twilio.com) and buy/activate a phone number capable of sending SMS.
2. From the Twilio Console copy your **Account SID** and **Auth Token**.
3. Note the Twilio phone number in `+1XXXXXXXXXX` format.
4. Complete **A2P 10DLC registration** (Messaging > Regulatory Compliance in the Twilio Console) — US carriers block SMS from unregistered numbers. A Sole Proprietor brand + low-volume campaign is enough for personal use and needs no business EIN.

Trial Twilio accounts can only text phone numbers you've manually verified in the console — you'll need a paid account to text your full guest list. This app only sends to US (`+1`) numbers; anything else is skipped.

## 4. Configure environment variables

Copy the example file and fill in the real values from steps 2–3:

```bash
cp .env.local.example .env.local
```

```
DATABASE_URL=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ADMIN_PASSWORD=...        # pick your own password for the /admin page
SITE_URL=http://localhost:3000   # update to your real domain after deploying
SYNC_SECRET=...           # shared secret for the Google Apps Script sync (see below)
```

`.env.local` is already git-ignored, so these secrets never get committed.

## 5. Import the guest list

`scripts/import-seating.ps1` reads a Google Forms RSVP CSV export (Timestamp, First Name, Last Name, phone number, email, RSVP answer, message) and POSTs it to this app's own `/api/admin/import-guests` endpoint, which upserts guests on their (first name, last name, phone) identity — safe to re-run whenever the guest list changes without regenerating everyone's id/welcome link. Every guest's table number starts as `'TBA'`; assign real tables later by editing that column directly in the database.

```powershell
./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv" -SiteUrl "https://solowedsanne.com" -AdminPassword "your-admin-password"

# Full replace - wipes every existing guest first, then imports only this file:
./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv" -Replace -SiteUrl "https://solowedsanne.com" -AdminPassword "your-admin-password"

# Importing a separate family list, flagged as family:
./scripts/import-seating.ps1 -CsvPath "C:\path\to\family RSVP export.csv" -IsFamily -SiteUrl "https://solowedsanne.com" -AdminPassword "your-admin-password"
```

For live auto-sync (new RSVPs added automatically without re-running anything), a Google Apps Script trigger on each response sheet can POST new submissions to `/api/sync/guests` — see `src/app/api/sync/guests/route.ts` for the expected payload shape.

## RSVP-by-text

The reminder SMS ends with "Reply YES or NO to RSVP!" — replies are handled by `/api/sms/inbound`, which you need to set as the "A message comes in" webhook on your Twilio number (Console → Phone Numbers → your number → Messaging configuration). It verifies the request came from Twilio, records `yes`/`no` on every guest sharing that phone number (couples often share one), and replies with a confirmation text. The admin page's guest counts and the "Awaiting RSVP" table update from this automatically.

## 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test the guest lookup flow, and [http://localhost:3000/admin](http://localhost:3000/admin) (browser will prompt for a username + your `ADMIN_PASSWORD`) to test the SMS tools.

## 7. Deploy

Push this repo to GitHub and deploy on [Vercel](https://vercel.com/new) — import the repo, add all the `.env.local` variables in the Vercel project's Environment Variables settings, and set `SITE_URL` to your production domain. Vercel auto-deploys on every push to `main`.

## Using the admin page

- Visit `/admin` any time after guests are imported.
- Info card shows **Total Guests** and **Total Yes RSVPs** (from text replies, not the original form).
- **Send Reminder** — write and preview a reminder text, personalized with each guest's name, sent to every non-excluded US number on file.
- **Send Thank You** — same, but locked until a month after the wedding.
- **Test** — send a one-off message to any US phone number, not tied to a guest record.
- **Awaiting RSVP** — a sortable, hideable table at the bottom listing everyone who hasn't texted back YES yet (pending or explicit no), with name and phone. Shrinks as replies come in.

Every send has a preview step and a final confirmation before anything goes out, and reports how many messages succeeded/failed/were skipped (non-US or flagged `excluded_from_texts`).

## Project structure

```
src/app/page.tsx                       Guest entry (name/email/phone lookup)
src/app/welcome/[id]/page.tsx          Table number + program + photo links
src/app/welcome/[id]/program/page.tsx  Wedding day event timeline
src/app/admin/page.tsx                 Admin SMS tools
src/app/api/table/lookup/              Guest lookup API
src/app/api/admin/                     Admin APIs (guest count, send SMS, bulk import)
src/app/api/sync/guests/               Webhook for the Google Apps Script live sync
src/app/api/sms/inbound/               Twilio webhook for guest YES/NO replies
src/lib/db.ts                          Neon client factory
src/lib/twilio.ts                      Twilio SMS sending
src/lib/phone.ts                       Phone normalization + US-number check
src/lib/wedding-details.ts             Shared wedding info used in SMS templates
src/proxy.ts                           Password-gates /admin and /api/admin/*
scripts/import-seating.ps1             Imports a guest list CSV
schema.sql                             Database schema
```
