import Link from 'next/link'
import { Mail } from 'lucide-react'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { createClient } from '@/lib/supabase/server'
import StatusButtons from './StatusButtons'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Messages | Admin', robots: { index: false, follow: false } }

const FILTERS = ['inbox', 'new', 'replied', 'archived', 'all'] as const
type Filter = (typeof FILTERS)[number]

const dateFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

const BADGE: Record<string, string> = {
  new: 'bg-blue-600 text-white',
  read: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  replied: 'bg-green-600 text-white',
  archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  await requireAdmin()
  const { show } = await searchParams
  const filter: Filter = FILTERS.includes(show as Filter) ? (show as Filter) : 'inbox'

  const supabase = await createClient()
  let query = supabase
    .from('contact_inquiries')
    .select('id, name, email, subject, message, status, created_at, responded_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (filter === 'inbox') query = query.in('status', ['new', 'read'])
  else if (filter !== 'all') query = query.eq('status', filter)

  const [{ data: messages, error }, { count: unread }] = await Promise.all([
    query,
    supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])
  if (error) console.error('[admin messages] list', error.message)

  return (
    <div className='mx-auto max-w-5xl p-6'>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Messages</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            From the contact form. {unread ? `${unread} new.` : 'Nothing new.'}
          </p>
        </div>
        <nav className='flex flex-wrap gap-2 text-sm'>
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={f === 'inbox' ? '/admin/messages' : `/admin/messages?show=${f}`}
              className={`rounded-full px-3 py-1 capitalize ${
                f === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {f}
            </Link>
          ))}
        </nav>
      </div>

      {error && <p className='mb-4 text-sm text-red-600'>Could not load messages.</p>}
      {!messages?.length ? (
        <p className='rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500 dark:border-gray-700'>
          No messages here.
        </p>
      ) : (
        <ul className='space-y-4'>
          {messages.map((m) => {
            const status = m.status ?? 'new'
            const replyHref = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`
            return (
              <li
                key={m.id}
                className={`rounded-xl border bg-white p-5 dark:bg-gray-900 ${
                  status === 'new' ? 'border-blue-300 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className='mb-2 flex flex-wrap items-center gap-2 text-sm'>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${BADGE[status] ?? BADGE.read}`}>
                    {status}
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>{m.name}</span>
                  <span className='text-gray-500'>&lt;{m.email}&gt;</span>
                  <span className='ml-auto text-xs text-gray-500'>
                    {m.created_at ? dateFmt.format(new Date(m.created_at)) : ''}
                  </span>
                </div>
                <h2 className='mb-2 font-semibold text-gray-900 dark:text-white'>{m.subject}</h2>
                <p className='mb-4 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                  {m.message}
                </p>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <a
                    href={replyHref}
                    className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400'
                  >
                    <Mail className='h-4 w-4' /> Reply by email
                  </a>
                  <StatusButtons id={m.id} status={status} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
