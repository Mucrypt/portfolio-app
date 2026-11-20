import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { contactLine } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Refund policy',
  robots: LEGAL.reviewed ? undefined : { index: false, follow: true },
}

export default function RefundsPage() {
  return (
    <LegalPage title='Refund policy'>
      <p>
        Payments on this site are processed by Stripe as the seller of record. Approved refunds go back to
        the card you paid with, through Stripe, usually within 5–10 business days.
      </p>

      <h2>Membership</h2>
      <ul>
        <li>Cancel any time from <Link href='/account/billing' className='text-blue-600 underline dark:text-blue-400'>your account</Link>. You keep access until the end of the period you’ve paid for, and you won’t be charged again.</li>
        <li>We don’t refund part of a period you’ve already started.</li>
        <li>
          If you were charged by mistake (for example, a renewal you meant to cancel and haven’t used since),
          contact us within 14 days of the charge and we’ll refund it.
        </li>
      </ul>

      <h2>Source code</h2>
      <ul>
        {LEGAL.sourceRefundDays ? (
          <li>
            You can ask for a refund within {LEGAL.sourceRefundDays} days of buying. Refunding the purchase
            ends your licence: delete your copy of the code.
          </li>
        ) : (
          <li>
            Source code can’t be returned once downloaded, so purchases are final, except as below.
          </li>
        )}
        <li>
          If the download is broken or doesn’t match the product page and we can’t fix it, we’ll refund you in
          full.
        </li>
      </ul>

      <h2>Your legal rights</h2>
      <p>
        At checkout you ask for immediate access and accept that the 14-day right of withdrawal for digital
        content ends once access starts. Nothing in this policy limits any other right you have under the
        law where you live.
      </p>

      <h2>How to ask</h2>
      <p>
        Contact us through {contactLine()} with the email address on your account and what you bought.
        A full refund removes the access it paid for.
      </p>
    </LegalPage>
  )
}
