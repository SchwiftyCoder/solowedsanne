import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help — Driver Earnings',
  description: 'How the Driver Earnings tracker works.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-slate-800 border border-slate-700 p-5">
      <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
    </section>
  );
}

export default function DriverHelpPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      <header className="border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/driver" className="text-slate-400 hover:text-white p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Help & guide</h1>
            <p className="text-xs text-slate-500">How everything works</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        <Section title="What this app does">
          <p>
            Driver Earnings tracks your daily Uber and Lyft income, subtracts your real costs, and tells you
            whether you&apos;re on pace to hit your weekly and monthly income goals. Everything is stored privately
            on this device — no account, no server.
          </p>
        </Section>

        <Section title="Logging your work">
          <p>
            <strong className="text-white">Start shift / End shift</strong> — Tap <em>Start shift</em> when you go
            online (optionally enter your odometer reading). The app remembers the shift even if you close it. When
            you&apos;re done, tap <em>End shift</em>: hours are filled in automatically from the timer, and you can add
            your end odometer (miles are computed for you), fuel cost, and any misc spend. It all lands on today&apos;s
            row in the daily log. You can run multiple shifts in one day — they add together.
          </p>
          <p>
            <strong className="text-white">Log day</strong> — Prefer entering totals at the end of the day? Tap{' '}
            <em>Log day</em> and type in what Uber and Lyft paid you (fare, tips, and surge/bonus separately if you
            want), hours driven, miles, and expenses.
          </p>
          <p>
            <strong className="text-white">Editing</strong> — In the daily log, the pencil icon opens any day for
            corrections and the trash icon deletes it.
          </p>
        </Section>

        <Section title="Pacing bars & deficit alerts">
          <p>
            The <strong className="text-white">This week</strong> and <strong className="text-white">This month</strong>{' '}
            bars compare your net income so far against your goals. The thin white tick marks where you should be{' '}
            <em>today</em> if you earned evenly every day. Status badges: green <em>Ahead of Pace</em>, amber{' '}
            <em>On Track</em>, red <em>Behind Target</em>.
          </p>
          <p>
            When you fall behind for the week, a red alert appears showing three numbers:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-white">Shortfall</strong> — dollars still needed to reach the weekly goal.</li>
            <li><strong className="text-white">Needed / day</strong> — that shortfall divided by the days left in the week.</li>
            <li>
              <strong className="text-white">Hours needed</strong> — the shortfall divided by your recent net hourly
              rate (from your last 7 logged days), so it reflects what an hour actually earns you after costs.
            </li>
          </ul>
        </Section>

        <Section title="The four stat cards">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Gross (month)</strong> — everything the platforms paid you this month:
              fares + tips + surge/bonus, before any costs.
            </li>
            <li>
              <strong className="text-white">Net (month)</strong> — what you keep:{' '}
              <span className="text-slate-400">gross − day expenses − prorated recurring overhead</span>.
            </li>
            <li>
              <strong className="text-white">True net hourly</strong> — net income ÷ hours logged. This is your real
              wage, usually lower than what the apps advertise.
            </li>
            <li>
              <strong className="text-white">$ / mile yield</strong> — gross ÷ miles driven. Higher means you&apos;re
              earning more for each mile of wear on your car.
            </li>
          </ul>
        </Section>

        <Section title="Expenses & overhead">
          <p>
            <strong className="text-white">Day expenses</strong> (gas, car wash, meals, misc) are entered per day and
            subtracted from that day&apos;s earnings.
          </p>
          <p>
            <strong className="text-white">Recurring overhead</strong> covers costs you pay regardless of driving —
            insurance, car payment, phone, or a weekly fuel budget. Each line can be entered per week or per month.
            Monthly amounts convert to weekly as <span className="text-slate-400">amount × 12 ÷ 52</span> (e.g. $270/mo
            insurance ≈ $62.31/wk), and the weekly total is spread across all 7 days when computing your net.
          </p>
          <p className="text-slate-400">
            Tip: track fuel either as a weekly budget here <em>or</em> per-day in your shift entries — not both, or
            it&apos;ll be double-counted.
          </p>
        </Section>

        <Section title="Tax mileage offset">
          <p>
            The IRS lets self-employed drivers deduct a standard rate for every business mile. The app multiplies your
            logged miles by the rate in <em>Goals &amp; settings</em> to estimate that deduction. It&apos;s{' '}
            <strong className="text-white">not income</strong> — it reduces the profit you pay taxes on. Keep your own
            mileage records; this estimate isn&apos;t tax advice.
          </p>
        </Section>

        <Section title="Statements (PDF)">
          <p>
            Tap <em>Weekly PDF</em> or <em>Monthly PDF</em> to open a formatted statement — earnings by platform,
            expense audit, tax offset, and a per-day table. Then tap <em>Print / Save PDF</em>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>On iPhone: choose <em>Print</em>, then tap the share icon on the preview and <em>Save to Files</em>.</li>
            <li>On a computer: pick <em>Save as PDF</em> as the printer destination.</li>
          </ul>
        </Section>

        <Section title="Your data & privacy">
          <p>
            All data lives in this browser&apos;s storage on this device. Nothing is uploaded anywhere. That also means:
            entries don&apos;t sync between devices, and clearing the browser&apos;s site data erases them — export a
            monthly statement now and then as a backup.
          </p>
        </Section>

        <Section title="Install on your phone">
          <p>
            Open this site in Safari on iPhone, tap the <em>Share</em> button, then <em>Add to Home Screen</em>. The
            app opens fullscreen like a native app. On Android, Chrome offers <em>Install app</em> from its menu.
          </p>
        </Section>

        <div className="text-center pt-2">
          <Link
            href="/driver"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-emerald-500 text-emerald-950 font-medium hover:bg-emerald-400"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
