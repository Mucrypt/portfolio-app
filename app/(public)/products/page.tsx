import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { listProducts } from '@/lib/catalog/queries'

export const metadata: Metadata = {
  title: 'Products | Romeo Mukulah',
  description:
    'Real apps and tools, each built from scratch in a free course. Try them live and get the full source code.',
}

const KIND_LABEL: Record<string, string> = {
  app: 'App',
  source_code: 'Source code',
  software: 'Software',
  course_bundle: 'Course bundle',
}

export default async function ProductsPage() {
  const products = await listProducts()

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <header className='mx-auto mb-14 max-w-3xl text-center'>
          <h1 className='mb-5 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl'>Products</h1>
          <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
            Real software, live and running. Each one is built from scratch in a free{' '}
            <Link href='/courses' className='font-medium text-blue-600 hover:underline dark:text-blue-400'>
              course
            </Link>
            , and its complete source code is available here.
          </p>
        </header>

        {products.length === 0 ? (
          <div className='mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700'>
            <Package className='mx-auto mb-4 h-10 w-10 text-gray-400' />
            <p className='text-gray-600 dark:text-gray-400'>The first product is being added. Check back soon.</p>
          </div>
        ) : (
          <div className='grid gap-8 md:grid-cols-2'>
            {products.map((p) => {
              const cover = p.screenshots[0]
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className='group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'
                >
                  <div className='relative aspect-video bg-gray-100 dark:bg-gray-900'>
                    {cover ? (
                      <Image
                        src={cover.src}
                        alt={cover.alt || cover.label}
                        fill
                        sizes='(min-width: 768px) 50vw, 100vw'
                        className='object-contain'
                      />
                    ) : (
                      <Package className='absolute inset-0 m-auto h-14 w-14 text-gray-400' />
                    )}
                  </div>
                  <div className='p-6'>
                    <div className='mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide'>
                      <span className='text-blue-600 dark:text-blue-400'>{KIND_LABEL[p.kind] ?? p.kind}</span>
                      {p.status === 'coming_soon' && (
                        <span className='rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'>
                          Coming soon
                        </span>
                      )}
                    </div>
                    <h2 className='mb-2 text-2xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                      {p.title}
                    </h2>
                    {p.tagline && <p className='mb-4 text-gray-600 dark:text-gray-400'>{p.tagline}</p>}
                    <span className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400'>
                      View product <ArrowRight className='h-4 w-4' />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
