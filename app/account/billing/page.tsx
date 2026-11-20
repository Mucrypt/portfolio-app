import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Membership & purchases', robots: { index: false, follow: false } }

const dateFmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })
const money = (amount: number | null, currency: string | null) =>
  amount != null && currency
    ? new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount / 100)
    : ''

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; error?: string }>
}) {
  const { checkout, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/account/billing')

  // RLS returns only this user's rows; the explicit filter keeps it right for the site owner too.
  const [{ data: member }, { data: subs }, { data: purchases }] = await Promise.all([
    supabase.rpc('i_am_member'),
    supabase
      .from('subscriptions')
      .select('id, plan, status, current_period_end, cancel_at_period_end')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('purchases')
      .select('id, status, amount_total, currency, created_at, products(slug, title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])
  const current = subs?.find((s) => s.status !== 'canceled') ?? null

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      <div className='mx-auto max-w-3xl px-4 py-12 sm:px-6'>
        <Link href='/account' className='text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400'>
          ← Account
        </Link>
        <h1 className='mb-8 mt-4 text-3xl font-bold text-gray-900 dark:text-white'>Membership & purchases</h1>

        {checkout === 'success' && (
          <p className='mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200'>
            Thank you! Your payment went through. Access appears here within a minute; refresh if you
            don’t see it yet.
          </p>
        )}
        {error === 'verify_email' && (
          <p className='mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200'>
            Please verify your email address first (check your inbox for the confirmation link), then try again.
          </p>
        )}
        {error === 'portal' && (
          <p className='mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200'>
            The billing page couldn’t open. Please try again in a moment.
          </p>
        )}

        <section className='mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900'>
          <h2 className='mb-3 text-lg font-bold text-gray-900 dark:text-white'>Membership</h2>
          {current ? (
            <div className='space-y-2 text-sm text-gray-700 dark:text-gray-300'>
              <p>
                {current.plan === 'yearly' ? 'Yearly' : 'Monthly'} membership ·{' '}
                {member ? 'active' : current.status.replace('_', ' ')}
              </p>
              {current.current_period_end && (
                <p>
                  {current.cancel_at_period_end ? 'Ends on ' : 'Renews on '}
                  {dateFmt.format(new Date(current.current_period_end))}
                </p>
              )}
              {current.status === 'past_due' && (
                <p className='text-amber-700 dark:text-amber-300'>
                  Your last payment didn’t go through. Update your card to keep access.
                </p>
              )}
            </div>
          ) : (
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              {member ? 'You have member access.' : 'You’re not a member. '}
              {!member && (
                <Link href='/membership' className='font-semibold text-blue-600 hover:underline dark:text-blue-400'>
                  See the membership
                </Link>
              )}
            </p>
          )}
          {(subs?.length ?? 0) > 0 && (
            <form action='/api/commerce/portal' method='post' className='mt-4'>
              <button
                type='submit'
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-200'
              >
                Manage billing, invoices or cancel
              </button>
            </form>
          )}
        </section>

        <section className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900'>
          <h2 className='mb-3 text-lg font-bold text-gray-900 dark:text-white'>Source code</h2>
          {purchases?.length ? (
            <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
              {purchases.map((p) => (
                <li key={p.id} className='flex flex-wrap items-center justify-between gap-3 py-3 text-sm'>
                  <div>
                    <p className='font-semibold text-gray-900 dark:text-white'>{p.products?.title ?? 'Product'}</p>
                    <p className='text-gray-500'>
                      {dateFmt.format(new Date(p.created_at))} · {money(p.amount_total, p.currency)}
                      {p.status === 'refunded' && ' · refunded'}
                    </p>
                  </div>
                  {p.status === 'paid' && p.products && (
                    <a
                      href={`/api/commerce/download/${p.products.slug}`}
                      className='inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700'
                    >
                      <Download className='h-4 w-4' /> Download
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-700 dark:text-gray-300'>No purchases yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
