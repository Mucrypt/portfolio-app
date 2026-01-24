import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

interface Service {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string
  icon: string | null
  color: string | null
  featured_image_url: string | null
  category: string
  service_type: string | null
  base_price: number | null
  price_currency: string | null
  price_unit: string | null
  pricing_tiers: Array<{
    name: string
    price: number
    features: string[]
  }> | null
  is_featured: boolean
  is_popular: boolean
  key_features: string[]
  technologies: string[]
}

export default async function ServicesPage() {
  const supabase = await createClient()

  // Fetch all active services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('is_accepting_clients', true)
    .order('display_order', { ascending: true })

  const featuredServices = services?.filter((s) => s.is_featured) || []

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white'>
        {/* Animated Background Blobs */}
        <div className='absolute inset-0 overflow-hidden opacity-20'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse delay-500'></div>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold'>
              ✨ Professional Development Services
            </div>
            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
              Turn Your Ideas Into
              <span className='block bg-linear-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent'>
                Digital Reality
              </span>
            </h1>
            <p className='text-xl sm:text-2xl mb-8 text-white/90 leading-relaxed'>
              Expert web development, mobile apps, consulting, and training
              services to bring your vision to life with cutting-edge technology
              and world-class expertise.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <a
                href='#services'
                className='px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-xl'
              >
                Explore Services
              </a>
              <Link
                href='/contact'
                className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105'
              >
                Get Free Consultation
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto'>
            {[
              { label: 'Projects Delivered', value: '150+' },
              { label: 'Happy Clients', value: '100+' },
              { label: 'Years Experience', value: '8+' },
              { label: 'Success Rate', value: '99%' },
            ].map((stat) => (
              <div key={stat.label} className='text-center'>
                <div className='text-4xl font-bold mb-2'>{stat.value}</div>
                <div className='text-white/80 text-sm'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className='py-20 bg-white' id='services'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <div className='inline-block px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-4'>
                ⭐ Most Popular
              </div>
              <h2 className='text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Featured Services
              </h2>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                Our most sought-after services trusted by startups and
                enterprises
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {featuredServices.map((service) => (
                <FeaturedServiceCard
                  key={service.id}
                  service={service as Service}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section className='py-20 bg-linear-to-b from-slate-50 to-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-4'>
              Complete Service Portfolio
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              End-to-end solutions for every stage of your digital journey
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {services?.map((service) => (
              <ServiceCard key={service.id} service={service as Service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-4'>
              Why Work With Us?
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              We deliver exceptional results through expertise, dedication, and
              innovation
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: '🚀',
                title: 'Fast Delivery',
                description:
                  'Agile methodology ensures rapid development without compromising quality',
              },
              {
                icon: '💎',
                title: 'Premium Quality',
                description:
                  'Clean, maintainable code following industry best practices and standards',
              },
              {
                icon: '🎯',
                title: 'Client-Focused',
                description:
                  'Your success is our priority. We listen, adapt, and deliver exactly what you need',
              },
              {
                icon: '🔒',
                title: 'Secure & Reliable',
                description:
                  'Enterprise-grade security and 99.9% uptime guarantee for all projects',
              },
              {
                icon: '📈',
                title: 'Scalable Solutions',
                description:
                  'Built to grow with your business from MVP to millions of users',
              },
              {
                icon: '💪',
                title: 'Ongoing Support',
                description:
                  'Comprehensive post-launch support and maintenance packages available',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className='p-8 bg-linear-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
              >
                <div className='text-5xl mb-4'>{benefit.icon}</div>
                <h3 className='text-2xl font-bold mb-3'>{benefit.title}</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl'></div>
        </div>

        <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-4xl sm:text-5xl font-bold mb-6'>
            Ready to Start Your Project?
          </h2>
          <p className='text-xl mb-8 text-white/90'>
            Let&apos;s discuss how we can help bring your vision to life
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/contact'
              className='px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-xl'
            >
              Get Started Today
            </Link>
            <Link
              href='/book-consultation'
              className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105'
            >
              Schedule Free Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Featured Service Card Component
function FeaturedServiceCard({ service }: { service: Service }) {
  const pricingTiers = service.pricing_tiers || []
  const startingPrice = pricingTiers[0]?.price || service.base_price

  return (
    <Link
      href={`/services/${service.slug}`}
      className='group block relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
    >
      {/* Background Image */}
      <div className='absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800'>
        {service.featured_image_url && (
          <Image
            src={service.featured_image_url}
            alt={service.name}
            fill
            className='object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300'
          />
        )}
      </div>

      {/* Badges */}
      <div className='absolute top-4 right-4 flex gap-2'>
        {service.is_popular && (
          <span className='px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold'>
            🔥 Popular
          </span>
        )}
        {service.is_featured && (
          <span className='px-3 py-1 bg-blue-400 text-blue-900 rounded-full text-xs font-bold'>
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className='relative p-8 text-white min-h-100 flex flex-col justify-between'>
        <div>
          <div className='text-6xl mb-4'>{service.icon}</div>
          <h3 className='text-3xl font-bold mb-2 group-hover:text-blue-300 transition-colors'>
            {service.name}
          </h3>
          <p className='text-lg text-white/90 mb-4'>{service.tagline}</p>
          <p className='text-white/80 mb-6'>{service.description}</p>

          {/* Key Features */}
          <ul className='space-y-2 mb-6'>
            {service.key_features?.slice(0, 4).map((feature, index) => (
              <li
                key={index}
                className='flex items-start text-sm text-white/90'
              >
                <span className='mr-2 text-green-400'>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & CTA */}
        <div>
          <div className='mb-4'>
            <div className='text-3xl font-bold'>
              {service.price_currency === 'USD' ? '$' : ''}
              {startingPrice?.toLocaleString()}
              <span className='text-lg font-normal text-white/70'>
                {' '}
                {service.price_unit}
              </span>
            </div>
          </div>
          <div className='flex items-center text-blue-300 font-semibold group-hover:text-blue-200'>
            View Details
            <span className='ml-2 group-hover:ml-4 transition-all'>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Regular Service Card Component
function ServiceCard({ service }: { service: Service }) {
  const pricingTiers = service.pricing_tiers || []
  const startingPrice = pricingTiers[0]?.price || service.base_price

  return (
    <Link
      href={`/services/${service.slug}`}
      className='group block bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden'
    >
      {/* Icon & Badge */}
      <div className='p-6 border-b border-slate-100'>
        <div className='flex justify-between items-start mb-4'>
          <div
            className='text-5xl p-4 rounded-xl'
            style={{ backgroundColor: `${service.color}20` }}
          >
            {service.icon}
          </div>
          {service.is_popular && (
            <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold'>
              Popular
            </span>
          )}
        </div>

        <h3 className='text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>
          {service.name}
        </h3>
        <p className='text-gray-600 text-sm mb-4'>{service.tagline}</p>

        {/* Technologies */}
        <div className='flex flex-wrap gap-1 mb-4'>
          {service.technologies?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className='px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs'
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className='p-6 bg-slate-50'>
        <div className='mb-2'>
          <span className='text-sm text-gray-600'>Starting at</span>
          <div className='text-2xl font-bold text-gray-900'>
            {service.price_currency === 'USD' ? '$' : ''}
            {startingPrice?.toLocaleString()}
            <span className='text-sm font-normal text-gray-600'>
              {' '}
              {service.price_unit}
            </span>
          </div>
        </div>
        <div className='flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700'>
          Learn More
          <span className='ml-2 group-hover:ml-3 transition-all'>→</span>
        </div>
      </div>
    </Link>
  )
}
