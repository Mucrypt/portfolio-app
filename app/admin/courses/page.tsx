import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { listAdminCourses } from '@/lib/catalog/admin'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Courses | Admin', robots: { index: false } }

export default async function AdminCoursesPage() {
  await requireAdmin()
  const courses = await listAdminCourses()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Courses</h1>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          Lessons arrive hidden from ytfactory / Studio. You decide what goes public. A course is listed on the site
          once at least one lesson is published.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className='rounded-lg bg-white p-8 text-center text-gray-600 shadow dark:bg-zinc-800 dark:text-gray-400'>
          No courses yet. They appear here when ytfactory sends one through the ingest API.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-lg bg-white shadow dark:bg-zinc-800'>
          <table className='min-w-full text-sm'>
            <thead className='border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-zinc-700'>
              <tr>
                <th className='px-4 py-3'>Course</th>
                <th className='px-4 py-3'>Product</th>
                <th className='px-4 py-3 text-right'>Lessons</th>
                <th className='px-4 py-3 text-right'>With video</th>
                <th className='px-4 py-3 text-right'>Published</th>
                <th className='px-4 py-3'>On the site</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-zinc-700'>
              {courses.map((c) => (
                <tr key={c.id} className='hover:bg-gray-50 dark:hover:bg-zinc-700/40'>
                  <td className='px-4 py-3'>
                    <Link
                      href={`/admin/courses/${c.slug}`}
                      className='font-semibold text-blue-700 hover:underline dark:text-blue-400'
                    >
                      {c.title}
                    </Link>
                    <div className='text-xs text-gray-500'>
                      {c.external_id} · from {c.source}
                    </div>
                  </td>
                  <td className='px-4 py-3 text-gray-700 dark:text-gray-300'>{c.product?.title ?? '—'}</td>
                  <td className='px-4 py-3 text-right tabular-nums'>{c.lessons_total}</td>
                  <td className='px-4 py-3 text-right tabular-nums'>{c.lessons_with_video}</td>
                  <td className='px-4 py-3 text-right tabular-nums'>{c.lessons_published}</td>
                  <td className='px-4 py-3'>
                    {c.lessons_published > 0 ? (
                      <a
                        href={`/courses/${c.slug}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 hover:underline dark:bg-green-900/40 dark:text-green-300'
                      >
                        Live ↗
                      </a>
                    ) : (
                      <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-zinc-700 dark:text-gray-300'>
                        Hidden
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
