import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { commerceEnabled } from '@/lib/commerce/offers'
import { displayPrice } from '@/lib/commerce/prices'
import { getViewer } from '@/lib/commerce/access'
import BuyButton from '@/components/commerce/BuyButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Membership',
  description: 'One membership unlocks every members-only course on romeomukulah.org.',
}

const INCLUDED = [
  'Every members-only course and lesson, now and as new ones are added',
  'Full transcripts, chapters and lesson resources',
  'Cancel anytime from your account',
]

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>
}) {
  const { checkout } = await searchParams
  const enabled = commerceEnabled()
  const [monthly, yearly, viewer] = enabled
    ? await Promise.all([displayPrice('member-monthly'), displayPrice('member-yearly'), getViewer()])
    : [null, null, null]

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8'>
        <header className='mb-10 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl'>Membership</h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
            Free courses stay free. The membership unlocks the members-only courses. Source code is sold
            separately, as a one-time purchase on each product page.
          </p>
        </header>

        {checkout === 'error' && (
          <p className='mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200'>
            Checkout couldn’t start. Please try again in a moment.
          </p>
        )}

        <ul className='mx-auto mb-10 max-w-xl space-y-3'>
          {INCLUDED.map((item) => (
            <li key={item} className='flex gap-3 text-gray-700 dark:text-gray-300'>
              <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-green-600' /> {item}
            </li>
          ))}
        </ul>

        {!enabled ? (
          <p className='text-center text-gray-600 dark:text-gray-400'>
            Memberships open soon. Until then, every published course is free:{' '}
            <Link href='/courses' className='font-semibold text-blue-600 hover:underline dark:text-blue-400'>
              browse the courses
            </Link>
            .
          </p>
        ) : viewer?.isMember ? (
          <div className='text-center'>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>You’re a member. Thank you.</p>
            <Link href='/account/billing' className='font-semibold text-blue-600 hover:underline dark:text-blue-400'>
              Manage your membership
            </Link>
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2'>
            {[
              { key: 'member-monthly', name: 'Monthly', price: monthly, per: 'month' },
              { key: 'member-yearly', name: 'Yearly', price: yearly, per: 'year' },
            ].map((plan) => (
              <div
                key={plan.key}
                className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'
              >
                <h2 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>{plan.name}</h2>
                {plan.price && (
                  <p className='mb-6 text-3xl font-bold text-gray-900 dark:text-white'>
                    {plan.price.label}
                    <span className='text-sm font-normal text-gray-500'> / {plan.per}</span>
                  </p>
                )}
                <BuyButton offer={plan.key} returnTo='/membership' variant={plan.key === 'member-yearly' ? 'primary' : 'secondary'}>
                  Join {plan.name.toLowerCase()}
                </BuyButton>
              </div>
            ))}
          </div>
        )}

        {enabled && (
          <p className='mt-8 text-center text-xs text-gray-500 dark:text-gray-400'>
            Secure checkout by Stripe, who handle payment and tax as the seller of record. See the{' '}
            <Link href='/terms' className='underline'>terms</Link> and{' '}
            <Link href='/refunds' className='underline'>refund policy</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
