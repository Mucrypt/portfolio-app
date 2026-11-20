import Link from 'next/link'
import { LEGAL } from '@/lib/legal'

export function contactLine() {
  return LEGAL.supportEmail ? (
    <a href={`mailto:${LEGAL.supportEmail}`} className='text-blue-600 underline dark:text-blue-400'>
      {LEGAL.supportEmail}
    </a>
  ) : (
    <Link href='/contact' className='text-blue-600 underline dark:text-blue-400'>
      the contact form
    </Link>
  )
}

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-950'>
      <article className='mx-auto max-w-3xl px-4 py-14 sm:px-6 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_li]:mb-1.5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6'>
        {!LEGAL.reviewed && (
          <p className='mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200'>
            Draft. This page is being finalised and isn’t in force yet. Nothing is on sale on this site yet.
          </p>
        )}
        <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>{title}</h1>
        <p className='mb-10 text-sm text-gray-500'>Last updated {LEGAL.lastUpdated}</p>
        <div className='leading-relaxed text-gray-700 dark:text-gray-300'>{children}</div>
      </article>
    </div>
  )
}
