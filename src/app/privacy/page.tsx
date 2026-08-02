import Link from 'next/link';
import { WEDDING_DETAILS } from '@/lib/wedding-details';

export const metadata = { title: 'Privacy Policy & Terms - solowedsanne.com' };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
            {WEDDING_DETAILS.coupleNames}
          </p>
          <h1 className="font-serif text-3xl" style={{ color: '#2C2C2C' }}>Privacy Policy &amp; Terms of Use</h1>
          <p className="text-xs mt-2" style={{ color: '#2C2C2C', opacity: 0.6 }}>Last updated August 2026</p>
        </div>

        <div className="rounded-2xl shadow-sm border px-8 py-10 space-y-8 text-sm leading-relaxed"
          style={{ background: '#fff', borderColor: '#e8dfc8', color: '#2C2C2C' }}>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>About This Site</h2>
            <p>
              solowedsanne.com is a personal wedding website for {WEDDING_DETAILS.coupleNames}, used to help
              guests look up their table assignment, view the wedding program, and receive event updates. It is
              not a commercial service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>Information We Collect</h2>
            <p>
              When you RSVP or are added to our guest list, we collect your name, phone number, and (optionally)
              email address, along with any message you leave for the couple. This information is used only to
              manage guest logistics for the wedding - table assignments, RSVP tracking, and sending event-related
              text messages such as reminders and thank-you notes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>SMS / Text Messaging</h2>
            <p className="mb-3">
              By providing your phone number, you consent to receive text messages from us related to the wedding
              (reminders, RSVP confirmations, and thank-you messages). Message frequency varies. Message and data
              rates may apply. Reply STOP at any time to opt out, or HELP for help.
            </p>
            <p className="font-semibold">
              No mobile information will be shared with third parties/affiliates for marketing/promotional
              purposes. All other categories exclude text messaging originator opt-in data and consent; this
              information will not be shared with any third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>How You Consent</h2>
            <p>
              You opt in to receiving text messages by submitting your phone number through our RSVP form or by
              being added to the guest list by the couple, and agreeing to receive wedding-related updates by
              text as part of that process.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>Data Retention &amp; Sharing</h2>
            <p>
              Guest information is stored only for the purpose of planning and running this wedding and is not
              sold or shared with third parties for marketing purposes. Guest data will be deleted or archived
              after the wedding and associated events have concluded.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>Terms of Use</h2>
            <p>
              This site is provided as-is for the personal, non-commercial purpose of organizing a wedding. There
              is no warranty of any kind, express or implied, regarding its availability or accuracy. By using
              this site you agree not to misuse it (for example, submitting information on behalf of someone
              without their knowledge).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-2" style={{ color: '#B8860B' }}>Contact</h2>
            <p>
              Questions about this policy or your information? Please contact {WEDDING_DETAILS.coupleNames} directly.
            </p>
          </section>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs uppercase tracking-widest underline" style={{ color: '#B8860B' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
