import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { contactLine } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy policy',
  robots: LEGAL.reviewed ? undefined : { index: false, follow: true },
}

/**
 * Describes what the site actually does today (2026-11-20). If you add a tracker, a form that stores
 * data, or a new service provider, update this page in the same change.
 */
export default function PrivacyPage() {
  return (
    <LegalPage title='Privacy policy'>
      <h2>Who is responsible</h2>
      <p>
        The data controller for romeomukulah.org is {LEGAL.operator ?? 'Romeo Mukulah'}
        {LEGAL.address && `, ${LEGAL.address}`}
        {LEGAL.vatNumber && ` (P.IVA ${LEGAL.vatNumber})`}. For anything about your data, contact{' '}
        {contactLine()}.
      </p>

      <h2>What we collect and why</h2>
      <ul>
        <li>
          <strong>Your account:</strong> your email address and password (stored only as a hash), and, if you
          add them, your name and phone number. We need these to run your account, and they’re how purchases
          and memberships are linked to you. Legal basis: performing our contract with you.
        </li>
        <li>
          <strong>Purchases and memberships:</strong> what you bought, when, the amount, and your
          subscription status. We never see or store your card details: Stripe collects them on its own
          checkout page. Legal basis: contract, and our legal duty to keep accounting records.
        </li>
        <li>
          <strong>Messages and service requests you send us:</strong> what you write and the contact
          details you give, so we can answer. Legal basis: steps you ask for before a contract, or our
          legitimate interest in replying.
        </li>
        <li>
          <strong>Usage statistics:</strong> pages visited, device and browser type, approximate location
          (country or city) and how you arrived. Vercel Web Analytics and Speed Insights do this without
          cookies, based on our legitimate interest in a fast, useful site. Google Analytics uses cookies and
          runs only if you accept them in the cookie banner. Legal basis for Google Analytics: your consent.
        </li>
        <li>
          <strong>Error reports:</strong> when something breaks, Sentry receives technical details about the
          error, such as the page, browser and time. We use them to fix bugs. Legal basis: our legitimate
          interest in a working, secure site.
        </li>
        <li>
          <strong>Security logs:</strong> our hosting providers keep short-lived technical logs, including IP
          addresses, to run the service and stop abuse.
        </li>
      </ul>
      <p>We don’t sell your data, and we don’t use it for advertising profiles.</p>

      <h2>Who processes it for us</h2>
      <ul>
        <li><strong>Stripe:</strong> payments, as the seller of record (Stripe also acts under its own privacy policy for the payment).</li>
        <li><strong>Supabase:</strong> database, sign-in and file storage.</li>
        <li><strong>Vercel:</strong> hosting, Web Analytics and Speed Insights.</li>
        <li><strong>Google:</strong> Google Analytics, and YouTube for embedded course videos.</li>
        <li><strong>Sentry:</strong> error reporting.</li>
      </ul>
      <p>
        Some of these companies store data outside the EU, mainly in the United States. Those transfers rely
        on the EU–US Data Privacy Framework or the European Commission’s standard contractual clauses.
      </p>

      <h2>Embedded videos</h2>
      <p>
        Course videos are played with YouTube’s embedded player in privacy-enhanced mode. YouTube (Google)
        still receives your IP address when a video loads, and may store data on your device once you play
        it. Google’s privacy policy applies to that.
      </p>

      <h2>Cookies</h2>
      <p>
        We always use the cookies needed to keep you signed in and to remember your cookie choice. Google
        Analytics cookies are set only after you click “Accept” in the cookie banner; you can change your
        mind at any time with “Cookie settings” at the bottom of every page, which also deletes them.
        Course videos use YouTube’s privacy-enhanced mode (youtube-nocookie.com).
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Your account: until you delete it or ask us to.</li>
        <li>
          Purchase and membership records: for as long as Italian law requires accounting records to be kept
          (up to 10 years), even after your account is deleted.
        </li>
        <li>Messages: up to 2 years after the conversation ends.</li>
        <li>Error reports and technical logs: a few weeks to a few months, depending on the provider.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Under the GDPR you can ask to see the data we hold about you, correct it, delete it, limit how we use
        it, receive a copy in a portable format, or object to processing based on our legitimate interest.
        Where we rely on your consent, you can withdraw it at any time. To use any of these rights, contact{' '}
        {contactLine()}. We’ll answer within one month.
      </p>
      <p>
        You can also complain to the Italian data protection authority, the{' '}
        <a
          href='https://www.garanteprivacy.it'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 underline dark:text-blue-400'
        >
          Garante per la protezione dei dati personali
        </a>
        , or to the authority where you live.
      </p>

      <h2>Children</h2>
      <p>The site isn’t aimed at children under 14, and we don’t knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we’ll update the date at the top. For important changes affecting account
        holders, we’ll tell you by email. See also the{' '}
        <Link href='/terms' className='text-blue-600 underline dark:text-blue-400'>terms</Link> and{' '}
        <Link href='/refunds' className='text-blue-600 underline dark:text-blue-400'>refund policy</Link>.
      </p>
    </LegalPage>
  )
}
