import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { contactLine } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms of sale',
  robots: LEGAL.reviewed ? undefined : { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <LegalPage title='Terms of sale'>
      <h2>Who you’re dealing with</h2>
      <p>
        romeomukulah.org is run by {LEGAL.operator ?? 'Romeo Mukulah'}
        {LEGAL.address && `, ${LEGAL.address}`}
        {LEGAL.vatNumber && ` (P.IVA ${LEGAL.vatNumber})`}. Payments are processed by Stripe, which acts as
        the seller of record (merchant of record) for purchases on this site. Stripe charges your card,
        issues the receipt and handles sales tax and VAT. Stripe’s own terms apply to the payment.
      </p>

      <h2>What you can buy</h2>
      <ul>
        <li>
          <strong>Membership</strong> (monthly or yearly): access to every members-only course and lesson on
          this site for as long as the membership is active. Free courses stay free for everyone.
        </li>
        <li>
          <strong>Source code</strong> (one-time): a download of a product’s complete source code. The
          membership does not include source code.
        </li>
      </ul>

      <h2>Your account</h2>
      <p>
        Purchases are tied to your romeomukulah.org account and its verified email address. Keep your
        login to yourself: memberships and downloads are for one person.
      </p>

      <h2>Membership billing and cancelling</h2>
      <p>
        Your membership renews automatically at the end of each period until you cancel. You can cancel at
        any time from{' '}
        <Link href='/account/billing' className='text-blue-600 underline dark:text-blue-400'>
          your account
        </Link>
        ; you keep access until the end of the period you’ve paid for. If a renewal payment fails, access
        continues for a few days while the payment is retried.
      </p>

      <h2>Source-code licence</h2>
      <p>When you buy source code you get a personal, non-transferable licence to:</p>
      <ul>
        <li>study it, run it and change it;</li>
        <li>use it, changed or not, in your own projects, including commercial ones.</li>
      </ul>
      <p>You may not:</p>
      <ul>
        <li>resell, share or publish the source code itself (or a lightly changed copy) as source code or a template;</li>
        <li>remove copyright notices from the files.</li>
      </ul>
      <p>
        Source code is provided as it is at the time of purchase. Courses and code are for learning; you’re
        responsible for how you deploy and run what you build.
      </p>

      <h2>Digital content and your right of withdrawal</h2>
      <p>
        Everything sold here is digital content supplied immediately. At checkout you ask for immediate
        access and accept that the 14-day right of withdrawal ends once access starts. Our{' '}
        <Link href='/refunds' className='text-blue-600 underline dark:text-blue-400'>
          refund policy
        </Link>{' '}
        explains when we refund anyway.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change, the new version applies to purchases and renewals made after the change. For
        a change that affects an active membership, we’ll tell you before your next renewal.
      </p>

      <h2>Contact</h2>
      <p>Questions about a purchase: {contactLine()}.</p>
    </LegalPage>
  )
}
