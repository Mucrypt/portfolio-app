import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Lightbulb,
  PlayCircle,
  Code2,
} from 'lucide-react'
import { getProduct } from '@/lib/catalog/queries'
import { commerceEnabled, productOfferKey } from '@/lib/commerce/offers'
import { displayPrice } from '@/lib/commerce/prices'
import { getViewer } from '@/lib/commerce/access'
import BuyButton from '@/components/commerce/BuyButton'
import { embedUrl, formatDuration, isYouTubeId } from '@/lib/catalog/youtube'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const page = await getProduct(slug)
  if (!page) return { title: 'Product not found' }
  const { product } = page
  return {
    title: `${product.title}${product.tagline ? `: ${product.tagline}` : ''}`,
    description: (product.pitch || product.tagline || product.title).slice(0, 160),
    openGraph: product.screenshots[0] ? { images: [product.screenshots[0].src] } : undefined,
  }
}

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const page = await getProduct(slug)
  if (!page) notFound()

  const { product, courses } = page
  const course = courses[0] ?? null
  const showcase = isYouTubeId(product.showcase_video_ref) ? product.showcase_video_ref : null
  const offerKey = productOfferKey(product.slug)
  const sellable = commerceEnabled() && product.status === 'available' && !!offerKey
  const [price, viewer] = sellable ? await Promise.all([displayPrice(offerKey!), getViewer()]) : [null, null]
  const owned = !!viewer?.ownedProductIds.has(product.id)

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        <Link
          href='/products'
          className='mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400'
        >
          <ArrowLeft className='h-4 w-4' /> All products
        </Link>

        {/* Hero */}
        <header className='mb-12 max-w-3xl'>
          {product.platforms.length > 0 && (
            <div className='mb-4 flex flex-wrap gap-2'>
              {product.platforms.map((p) => (
                <span
                  key={p}
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                >
                  {p}
                </span>
              ))}
            </div>
          )}
          <h1 className='mb-3 text-4xl font-bold text-gray-900 dark:text-white md:text-6xl'>{product.title}</h1>
          {product.tagline && (
            <p className='mb-5 text-xl font-medium text-blue-600 dark:text-blue-400'>{product.tagline}</p>
          )}
          {product.pitch && (
            <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'>{product.pitch}</p>
          )}

          <div className='mt-8 flex flex-wrap gap-3'>
            {product.live_url && (
              <a
                href={product.live_url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700'
              >
                Try it at {hostOf(product.live_url)} <ExternalLink className='h-4 w-4' />
              </a>
            )}
            {product.download_url && (
              <a
                href={product.download_url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-200'
              >
                <Download className='h-4 w-4' /> Download the app
              </a>
            )}
            {course && (
              <Link
                href={`/courses/${course.slug}`}
                className='inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-200'
              >
                <PlayCircle className='h-4 w-4' /> Free course
              </Link>
            )}
          </div>
        </header>

        {/* Showcase video */}
        {showcase && (
          <section className='mb-16' aria-label='Product tour'>
            <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl'>
              <iframe
                src={embedUrl(showcase)}
                title={`${product.title} tour`}
                className='absolute inset-0 h-full w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
            {formatDuration(product.showcase_duration_seconds) && (
              <p className='mt-2 text-sm text-gray-500'>
                Full tour · {formatDuration(product.showcase_duration_seconds)}
              </p>
            )}
          </section>
        )}

        {/* Screenshots */}
        {product.screenshots.length > 0 && (
          <section className='mb-16' aria-labelledby='screens'>
            <h2 id='screens' className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
              Screenshots
            </h2>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {product.screenshots.map((s) => (
                <figure
                  key={s.src}
                  className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <a href={s.src} target='_blank' rel='noopener noreferrer' className='relative block aspect-[3/4] bg-gray-50 dark:bg-gray-900'>
                    <Image
                      src={s.src}
                      alt={s.alt || s.label}
                      fill
                      sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
                      className='object-contain'
                    />
                    {s.demo_data && (
                      <span className='absolute right-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-[11px] font-bold uppercase text-white shadow'>
                        Demo data
                      </span>
                    )}
                  </a>
                  <figcaption className='px-3 py-2 text-xs text-gray-600 dark:text-gray-400'>{s.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <div className='grid gap-10 lg:grid-cols-3'>
          <div className='space-y-12 lg:col-span-2'>
            {product.for_whom.length > 0 && (
              <section>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Who it&apos;s for</h2>
                <ul className='space-y-2'>
                  {product.for_whom.map((w) => (
                    <li key={w} className='flex gap-3 text-gray-700 dark:text-gray-300'>
                      <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-green-600' /> {w}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.stack.length > 0 && (
              <section>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Built with</h2>
                <div className='flex flex-wrap gap-2'>
                  {product.stack.map((t) => (
                    <span
                      key={t}
                      className='rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {product.source_code_includes.length > 0 && (
              <section>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  What the source code includes
                </h2>
                <ul className='grid gap-2 sm:grid-cols-2'>
                  {product.source_code_includes.map((item) => (
                    <li key={item} className='flex gap-3 text-gray-700 dark:text-gray-300'>
                      <Code2 className='mt-0.5 h-5 w-5 shrink-0 text-blue-600' /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className='space-y-6'>
            <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
              <h2 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>Get the source code</h2>
              {sellable && owned ? (
                <div className='space-y-3'>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>You own the source code.</p>
                  <a
                    href={`/api/commerce/download/${product.slug}`}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700'
                  >
                    <Download className='h-5 w-5' /> Download the source code
                  </a>
                </div>
              ) : sellable ? (
                <div className='space-y-3'>
                  {price && (
                    <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                      {price.label} <span className='text-sm font-normal text-gray-500'>one-time</span>
                    </p>
                  )}
                  <BuyButton offer={offerKey!} returnTo={`/products/${product.slug}`}>
                    <Code2 className='h-5 w-5' /> Buy the source code
                  </BuyButton>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Secure checkout by Stripe. See the <Link href='/refunds' className='underline'>refund policy</Link>{' '}
                    and <Link href='/terms' className='underline'>terms</Link>.
                  </p>
                </div>
              ) : (
                <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-400'>
                  The complete source code will be available here soon as a one-time purchase.
                  {course && ' Until then, the free course builds it step by step.'}
                </p>
              )}
            </section>

            {product.feature_suggestion_url && (
              <section className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
                <h2 className='mb-2 inline-flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white'>
                  <Lightbulb className='h-5 w-5 text-amber-500' /> Suggest a feature
                </h2>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Have an idea or a question? Send it in. Good ideas can become the next episode.
                </p>
                <a
                  href={product.feature_suggestion_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400'
                >
                  Send a suggestion <ExternalLink className='h-3.5 w-3.5' />
                </a>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
