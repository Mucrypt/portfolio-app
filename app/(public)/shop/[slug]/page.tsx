import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

type ShopProduct = {
  id: string
  title: string
  slug: string
  short_description: string
  description: string
  product_type: 'physical' | 'digital' | 'affiliate'
  category: string
  subcategory: string
  thumbnail_url: string
  image_urls: string[] | null
  original_price: number
  discounted_price: number | null
  currency: string
  affiliate_link: string | null
  external_product_url: string | null
  demo_url: string | null
  download_url: string | null
  file_size: string | null
  file_format: string | null
  version: string | null
  features: string[] | null
  specifications: Record<string, unknown> | null
  tech_stack: string[] | null
  compatibility: string[] | null
  requirements: string[] | null
  included_items: string[] | null
  tags: string[]
  rating: number
  reviews_count: number
  purchases_count: number
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  license_type: string | null
  usage_rights: string | null
}

function formatPrice(price: number | null, currency: string): string {
  if (!price) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(price)
}

function calculateDiscount(
  original: number,
  discounted: number | null,
): number {
  if (!discounted) return 0
  return Math.round(((original - discounted) / original) * 100)
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()

  // Fetch the product
  const { data: product } = await supabase
    .from('shop_products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!product) {
    notFound()
  }

  // Fetch related products (same category, exclude current)
  const { data: relatedProducts } = await supabase
    .from('shop_products')
    .select('*')
    .eq('category', product.category)
    .eq('is_published', true)
    .neq('id', product.id)
    .limit(3)

  const discountPercentage = calculateDiscount(
    product.original_price,
    product.discounted_price,
  )

  // Determine the primary action button (Buy/Download/View)
  const primaryActionUrl =
    product.affiliate_link ||
    product.external_product_url ||
    product.download_url ||
    product.demo_url

  const primaryActionText = product.affiliate_link
    ? product.product_type === 'affiliate'
      ? 'Buy on Amazon →'
      : 'Get This Product →'
    : product.download_url
      ? 'Download Now'
      : product.demo_url
        ? 'View Demo'
        : 'Learn More'

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <nav className='mb-8'>
          <ol className='flex items-center gap-2 text-sm'>
            <li>
              <Link
                href='/shop'
                className='text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600'
              >
                Shop
              </Link>
            </li>
            <li className='text-gray-400'>/</li>
            <li>
              <span className='text-gray-400'>{product.category}</span>
            </li>
            <li className='text-gray-400'>/</li>
            <li className='text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 font-medium'>
              {product.title}
            </li>
          </ol>
        </nav>

        <div className='grid lg:grid-cols-3 gap-12'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Product Image */}
            <div className='relative aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 mb-8 shadow-xl'>
              <Image
                src={product.thumbnail_url}
                alt={product.title}
                fill
                className='object-cover'
              />
              {/* Badges */}
              <div className='absolute top-4 left-4 flex gap-2'>
                {product.is_new && (
                  <span className='px-4 py-2 text-sm font-bold bg-green-500 text-white rounded-lg shadow-lg'>
                    NEW
                  </span>
                )}
                {product.is_bestseller && (
                  <span className='px-4 py-2 text-sm font-bold bg-yellow-500 text-white rounded-lg shadow-lg'>
                    🔥 BESTSELLER
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className='px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg shadow-lg'>
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Additional Images */}
            {product.image_urls && product.image_urls.length > 0 && (
              <div className='grid grid-cols-3 gap-4 mb-8'>
                {product.image_urls
                  .slice(0, 3)
                  .map((imageUrl: string, index: number) => (
                    <div
                      key={index}
                      className='relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-md'
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* Product Info */}
            <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-lg'>
                  {product.category}
                </span>
                <span className='px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-700 rounded-lg capitalize'>
                  {product.product_type}
                </span>
                {product.subcategory && (
                  <span className='px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg'>
                    {product.subcategory}
                  </span>
                )}
              </div>

              <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                {product.title}
              </h1>

              <p className='text-xl text-gray-600 mb-6'>
                {product.short_description}
              </p>

              {/* Rating & Stats */}
              <div className='flex flex-wrap items-center gap-6 mb-6 pb-6 border-b'>
                <div className='flex items-center gap-2'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className='font-semibold text-gray-900'>
                    {product.rating.toFixed(1)}
                  </span>
                  <span className='text-gray-600'>
                    ({product.reviews_count} reviews)
                  </span>
                </div>
                <div className='text-gray-600'>
                  <span className='font-semibold text-gray-900'>
                    {product.purchases_count}+
                  </span>{' '}
                  purchases
                </div>
                {product.version && (
                  <div className='text-gray-600'>
                    Version:{' '}
                    <span className='font-semibold text-gray-900'>
                      {product.version}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className='prose max-w-none'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                  About This {product.category}
                </h2>
                <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {product.description}
                </div>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Key Features
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className='flex items-start gap-3'>
                      <span className='shrink-0 w-6 h-6 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold'>
                        ✓
                      </span>
                      <span className='text-gray-700'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {product.tech_stack && product.tech_stack.length > 0 && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Tech Stack
                </h2>
                <div className='flex flex-wrap gap-3'>
                  {product.tech_stack.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 text-gray-700 font-medium rounded-lg'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Requirements
                </h2>
                <ul className='space-y-3'>
                  {product.requirements.map(
                    (requirement: string, index: number) => (
                      <li key={index} className='flex items-start gap-3'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span className='text-gray-700'>{requirement}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {product.included_items && product.included_items.length > 0 && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  What&apos;s Included
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                  {product.included_items.map((item: string, index: number) => (
                    <div key={index} className='flex items-start gap-3'>
                      <span className='text-purple-600 text-xl'>📦</span>
                      <span className='text-gray-700'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Specifications
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                      >
                        <span className='text-gray-600 font-medium capitalize'>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className='text-gray-900 font-semibold'>
                          {String(value)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* License & Usage */}
            {(product.license_type || product.usage_rights) && (
              <div className='bg-white rounded-2xl p-8 shadow-lg mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  License & Usage Rights
                </h2>
                {product.license_type && (
                  <div className='mb-4'>
                    <span className='text-gray-600 font-medium'>
                      License Type:{' '}
                    </span>
                    <span className='px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded'>
                      {product.license_type}
                    </span>
                  </div>
                )}
                {product.usage_rights && (
                  <p className='text-gray-700 leading-relaxed'>
                    {product.usage_rights}
                  </p>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className='bg-white rounded-2xl p-8 shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Tags</h2>
                <div className='flex flex-wrap gap-2'>
                  {product.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-100 transition-colors'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 space-y-6'>
              {/* Price Card */}
              <div className='bg-white rounded-2xl p-8 shadow-xl'>
                <div className='mb-6'>
                  {product.discounted_price ? (
                    <div>
                      <div className='text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-2'>
                        {formatPrice(
                          product.discounted_price,
                          product.currency,
                        )}
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className='text-xl text-gray-400 line-through'>
                          {formatPrice(
                            product.original_price,
                            product.currency,
                          )}
                        </span>
                        <span className='px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full'>
                          Save {discountPercentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className='text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600'>
                      {formatPrice(product.original_price, product.currency)}
                    </div>
                  )}
                </div>

                {primaryActionUrl && (
                  <a
                    href={primaryActionUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block w-full py-4 px-6 text-center rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl mb-4'
                  >
                    {primaryActionText}
                  </a>
                )}

                {product.demo_url && !product.affiliate_link && (
                  <a
                    href={product.demo_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block w-full py-3 px-6 text-center rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors'
                  >
                    View Live Demo →
                  </a>
                )}

                {/* Product Details */}
                <div className='mt-6 pt-6 border-t space-y-4'>
                  <h3 className='font-bold text-gray-900 mb-4'>
                    This {product.category} Includes:
                  </h3>
                  <div className='space-y-3'>
                    {product.file_format && (
                      <div className='flex items-center gap-3'>
                        <span className='text-blue-600'>📄</span>
                        <span className='text-gray-700 text-sm'>
                          {product.file_format} files
                        </span>
                      </div>
                    )}
                    {product.file_size && (
                      <div className='flex items-center gap-3'>
                        <span className='text-blue-600'>💾</span>
                        <span className='text-gray-700 text-sm'>
                          {product.file_size} download
                        </span>
                      </div>
                    )}
                    {product.product_type === 'digital' && (
                      <>
                        <div className='flex items-center gap-3'>
                          <span className='text-blue-600'>📥</span>
                          <span className='text-gray-700 text-sm'>
                            Instant download
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='text-blue-600'>🔄</span>
                          <span className='text-gray-700 text-sm'>
                            Free lifetime updates
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='text-blue-600'>📖</span>
                          <span className='text-gray-700 text-sm'>
                            Documentation included
                          </span>
                        </div>
                      </>
                    )}
                    <div className='flex items-center gap-3'>
                      <span className='text-blue-600'>💬</span>
                      <span className='text-gray-700 text-sm'>
                        Email support
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className='bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl'>
                <h3 className='font-bold text-xl mb-3'>Need Help?</h3>
                <p className='text-white/90 text-sm mb-4'>
                  Have questions or need custom modifications? I&apos;m here to
                  help!
                </p>
                <Link
                  href='/contact'
                  className='block w-full py-3 px-6 text-center rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform'
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className='mt-20'>
            <h2 className='text-3xl font-bold mb-8'>
              <span className='text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600'>
                You Might Also Like
              </span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {relatedProducts.map((relatedProduct: ShopProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.slug}`}
                  className='group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'
                >
                  <div className='relative aspect-video overflow-hidden bg-linear-to-br from-gray-100 to-gray-200'>
                    <Image
                      src={relatedProduct.thumbnail_url}
                      alt={relatedProduct.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                  <div className='p-5'>
                    <h3 className='font-bold text-gray-900 mb-2 line-clamp-2'>
                      {relatedProduct.title}
                    </h3>
                    <div className='flex items-center gap-2'>
                      {relatedProduct.discounted_price ? (
                        <>
                          <span className='text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600'>
                            {formatPrice(
                              relatedProduct.discounted_price,
                              relatedProduct.currency,
                            )}
                          </span>
                          <span className='text-sm text-gray-400 line-through'>
                            {formatPrice(
                              relatedProduct.original_price,
                              relatedProduct.currency,
                            )}
                          </span>
                        </>
                      ) : (
                        <span className='text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600'>
                          {formatPrice(
                            relatedProduct.original_price,
                            relatedProduct.currency,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
