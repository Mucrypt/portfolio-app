import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

interface Service {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string
  full_description: string | null
  icon: string | null
  color: string | null
  featured_image_url: string | null
  category: string
  subcategories: string[] | null
  service_type: string | null
  base_price: number | null
  price_currency: string | null
  price_unit: string | null
  pricing_tiers: Array<{
    name: string
    price: number
    features: string[]
  }> | null
  is_price_negotiable: boolean
  estimated_duration: string
  key_features: string[]
  deliverables: string[]
  included_services: string[]
  excluded_services: string[]
  requirements: string[]
  technologies: string[]
  tools: string[]
  methodologies: string[]
  process_steps: Array<{
    step: number
    title: string
    description: string
    duration?: string
  }> | null
  consultation_required: boolean
  consultation_duration: number
  faqs: Array<{ question: string; answer: string }> | null
  meta_title: string
  meta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.meta_title || service.name,
    description: service.meta_description || service.description,
    openGraph: {
      title: service.meta_title || service.name,
      description: service.meta_description || service.description,
      images: service.featured_image_url ? [service.featured_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.meta_title || service.name,
      description: service.meta_description || service.description,
      images: service.featured_image_url ? [service.featured_image_url] : [],
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch service details
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!service) {
    notFound()
  }

  type PricingTier = {
    name: string
    price: number
    features: string[]
  }

  type ProcessStep = {
    step: number
    title: string
    description: string
    duration?: string
  }

  type FAQ = {
    question: string
    answer: string
  }

  const pricingTiers = (service.pricing_tiers as PricingTier[]) || []
  const processSteps = (service.process_steps as ProcessStep[]) || []
  const faqs = (service.faqs as FAQ[]) || []

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white'>
        {/* Background Image */}
        {service.featured_image_url && (
          <div className='absolute inset-0'>
            <Image
              src={service.featured_image_url}
              alt={service.name}
              fill
              className='object-cover opacity-20'
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-linear-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30'></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32'>
          <div className='max-w-4xl'>
            {/* Breadcrumb */}
            <div className='mb-6 flex items-center text-sm text-white/80'>
              <Link href='/' className='hover:text-white'>
                Home
              </Link>
              <span className='mx-2'>/</span>
              <Link href='/services' className='hover:text-white'>
                Services
              </Link>
              <span className='mx-2'>/</span>
              <span className='text-white'>{service.name}</span>
            </div>

            {/* Service Icon & Category */}
            <div className='flex items-center gap-4 mb-6'>
              <div
                className='text-7xl p-6 rounded-2xl backdrop-blur-sm'
                style={{ backgroundColor: `${service.color}40` }}
              >
                {service.icon}
              </div>
              <div>
                <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-2'>
                  {service.category}
                </span>
              </div>
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
              {service.name}
            </h1>
            <p className='text-2xl sm:text-3xl text-white/90 mb-8 leading-relaxed'>
              {service.tagline}
            </p>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
                <div className='text-sm text-white/70 mb-1'>Starting Price</div>
                <div className='text-2xl font-bold'>
                  $
                  {pricingTiers[0]?.price?.toLocaleString() ||
                    service.base_price?.toLocaleString() ||
                    'Contact'}
                </div>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
                <div className='text-sm text-white/70 mb-1'>Duration</div>
                <div className='text-2xl font-bold'>
                  {service.estimated_duration}
                </div>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
                <div className='text-sm text-white/70 mb-1'>Service Type</div>
                <div className='text-2xl font-bold capitalize'>
                  {service.service_type}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href='#inquiry-form'
                className='px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center'
              >
                {service.cta_primary_text || 'Get Started'}
              </a>
              {service.consultation_required && (
                <a
                  href={service.cta_secondary_url || '/book-consultation'}
                  className='px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all transform hover:scale-105 text-center'
                >
                  {service.cta_secondary_text || 'Schedule Consultation'}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2'>
              <h2 className='text-4xl font-bold mb-6'>About This Service</h2>
              <div className='prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line'>
                {service.full_description}
              </div>
            </div>

            {/* Sidebar - Quick Info */}
            <div className='space-y-6'>
              {/* Subcategories */}
              {service.subcategories && service.subcategories.length > 0 && (
                <div className='bg-slate-50 rounded-xl p-6 border border-slate-200'>
                  <h3 className='font-bold text-lg mb-4'>Specializations</h3>
                  <div className='flex flex-wrap gap-2'>
                    {service.subcategories.map((sub: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-white border border-slate-300 rounded-full text-sm'
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {service.technologies && service.technologies.length > 0 && (
                <div className='bg-slate-50 rounded-xl p-6 border border-slate-200'>
                  <h3 className='font-bold text-lg mb-4'>Technologies</h3>
                  <div className='flex flex-wrap gap-2'>
                    {service.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Info */}
              {service.consultation_required && (
                <div className='bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='text-3xl'>📞</span>
                    <h3 className='font-bold text-lg'>Free Consultation</h3>
                  </div>
                  <p className='text-gray-700 text-sm mb-4'>
                    We require a {service.consultation_duration}-minute
                    consultation to understand your needs and provide the best
                    solution.
                  </p>
                  <a
                    href='/book-consultation'
                    className='block w-full px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all'
                  >
                    Schedule Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className='py-20 bg-linear-to-b from-slate-50 to-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>What You Get</h2>
            <p className='text-xl text-gray-600'>
              Comprehensive features designed to deliver exceptional results
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {service.key_features?.map((feature: string, index: number) => (
              <div
                key={index}
                className='flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all'
              >
                <div className='shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold'>
                  ✓
                </div>
                <div className='flex-1 text-gray-700'>{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      {pricingTiers.length > 0 && (
        <section className='py-20 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4'>
                Flexible Pricing Plans
              </h2>
              <p className='text-xl text-gray-600'>
                Choose the package that fits your needs and budget
              </p>
              {service.is_price_negotiable && (
                <p className='text-sm text-blue-600 mt-2'>
                  💡 Custom pricing available - Let&apos;s discuss your specific
                  requirements
                </p>
              )}
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl border-2 p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                    index === 1
                      ? 'border-blue-500 shadow-xl scale-105'
                      : 'border-slate-200'
                  }`}
                >
                  {index === 1 && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold'>
                      Most Popular
                    </div>
                  )}

                  <div className='text-center mb-6'>
                    <h3 className='text-2xl font-bold mb-2'>{tier.name}</h3>
                    <div className='text-5xl font-bold mb-2'>
                      ${tier.price?.toLocaleString()}
                    </div>
                    <div className='text-gray-600'>{service.price_unit}</div>
                  </div>

                  <ul className='space-y-3 mb-8'>
                    {tier.features?.map((feature: string, fIndex: number) => (
                      <li
                        key={fIndex}
                        className='flex items-start text-gray-700'
                      >
                        <span className='mr-2 text-green-500 shrink-0'>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href='#inquiry-form'
                    className={`block w-full px-6 py-3 rounded-full font-bold text-center transition-all ${
                      index === 1
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Select {tier.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {processSteps.length > 0 && (
        <section className='py-20 bg-linear-to-b from-slate-50 to-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4'>How We Work</h2>
              <p className='text-xl text-gray-600'>
                Our proven process ensures successful project delivery
              </p>
            </div>

            <div className='space-y-6'>
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className='flex gap-6 items-start bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all'
                >
                  <div className='shrink-0 w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold'>
                    {step.step}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold mb-2'>{step.title}</h3>
                    <p className='text-gray-700 mb-2'>{step.description}</p>
                    <div className='text-sm text-blue-600 font-semibold'>
                      ⏱️ {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables & What's Included/Excluded */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Deliverables */}
            <div>
              <h2 className='text-3xl font-bold mb-6'>
                📦 What You&apos;ll Receive
              </h2>
              <ul className='space-y-3'>
                {service.deliverables?.map((item: string, index: number) => (
                  <li key={index} className='flex items-start text-gray-700'>
                    <span className='mr-3 text-green-500 shrink-0 text-xl'>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Included/Excluded */}
            <div className='space-y-8'>
              {/* Included */}
              {service.included_services &&
                service.included_services.length > 0 && (
                  <div>
                    <h2 className='text-3xl font-bold mb-6 text-green-600'>
                      ✅ What&apos;s Included
                    </h2>
                    <ul className='space-y-2'>
                      {service.included_services.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className='flex items-start text-gray-700 text-sm'
                          >
                            <span className='mr-2 text-green-500'>•</span>
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Excluded */}
              {service.excluded_services &&
                service.excluded_services.length > 0 && (
                  <div>
                    <h2 className='text-3xl font-bold mb-6 text-red-600'>
                      ❌ Not Included
                    </h2>
                    <ul className='space-y-2'>
                      {service.excluded_services.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className='flex items-start text-gray-700 text-sm'
                          >
                            <span className='mr-2 text-red-500'>•</span>
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      {service.requirements && service.requirements.length > 0 && (
        <section className='py-20 bg-linear-to-b from-slate-50 to-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-8'>
              <h2 className='text-3xl font-bold mb-6 flex items-center gap-3'>
                <span>📋</span>
                What We Need From You
              </h2>
              <ul className='space-y-3'>
                {service.requirements.map((req: string, index: number) => (
                  <li key={index} className='flex items-start text-gray-700'>
                    <span className='mr-3 text-blue-600 shrink-0'>→</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className='py-20 bg-white'>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4'>
                Frequently Asked Questions
              </h2>
              <p className='text-xl text-gray-600'>
                Everything you need to know about this service
              </p>
            </div>

            <div className='space-y-6'>
              {faqs.map(
                (faq: { question: string; answer: string }, index: number) => (
                  <div
                    key={index}
                    className='bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all'
                  >
                    <h3 className='text-xl font-bold mb-3 text-gray-900'>
                      {faq.question}
                    </h3>
                    <p className='text-gray-700 leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <section
        id='inquiry-form'
        className='py-20 bg-linear-to-b from-slate-50 to-white'
      >
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Ready to Get Started?</h2>
            <p className='text-xl text-gray-600'>
              Fill out the form below and we&apos;ll get back to you within 24
              hours
            </p>
          </div>

          <InquiryForm service={service as Service} />
        </div>
      </section>
    </div>
  )
}

// Inquiry Form Component
function InquiryForm({ service }: { service: Service }) {
  return (
    <form
      action={async (formData: FormData) => {
        'use server'
        const supabase = await createClient()

        const email = formData.get('email') as string | null
        if (!email) {
          throw new Error('Email is required')
        }

        const name = formData.get('name') as string | null
        if (!name) {
          throw new Error('Name is required')
        }

        const message = formData.get('message') as string | null
        if (!message) {
          throw new Error('Message is required')
        }

        const inquiry = {
          service_id: service.id,
          name: name,
          email: email,
          phone: formData.get('phone') as string | null,
          company: formData.get('company') as string | null,
          website: formData.get('website') as string | null,
          subject: `Inquiry for ${service.name}`,
          message: message,
          budget_range: formData.get('budget_range') as string | null,
          timeline: formData.get('timeline') as string | null,
          project_description: formData.get('project_description') as
            | string
            | null,
          specific_requirements: formData.get('specific_requirements')
            ? [formData.get('specific_requirements') as string]
            : null,
          preferred_start_date:
            (formData.get('preferred_start_date') as string) || null,
          urgency: (formData.get('urgency') as string) || 'medium',
          status: 'new',
          priority: 'medium',
        }

        await supabase.from('service_inquiries').insert(inquiry)
      }}
      className='bg-white rounded-2xl shadow-xl p-8 border border-slate-200'
    >
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Name */}
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Your Name *
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='John Doe'
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Email Address *
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='john@example.com'
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Phone Number
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='+1 (555) 123-4567'
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor='company'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Company Name
          </label>
          <input
            type='text'
            id='company'
            name='company'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Acme Inc.'
          />
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor='website'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Website
          </label>
          <input
            type='url'
            id='website'
            name='website'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='https://example.com'
          />
        </div>

        {/* Budget Range */}
        <div>
          <label
            htmlFor='budget_range'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Budget Range
          </label>
          <select
            id='budget_range'
            name='budget_range'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>Select budget range</option>
            <option value='< $5,000'>Less than $5,000</option>
            <option value='$5,000 - $10,000'>$5,000 - $10,000</option>
            <option value='$10,000 - $25,000'>$10,000 - $25,000</option>
            <option value='$25,000 - $50,000'>$25,000 - $50,000</option>
            <option value='$50,000+'>$50,000+</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label
            htmlFor='timeline'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Timeline
          </label>
          <select
            id='timeline'
            name='timeline'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>Select timeline</option>
            <option value='ASAP'>ASAP</option>
            <option value='1-2 months'>1-2 months</option>
            <option value='3-6 months'>3-6 months</option>
            <option value='6+ months'>6+ months</option>
            <option value='Flexible'>Flexible</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor='preferred_start_date'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Preferred Start Date
          </label>
          <input
            type='date'
            id='preferred_start_date'
            name='preferred_start_date'
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
      </div>

      {/* Project Description */}
      <div className='mt-6'>
        <label
          htmlFor='project_description'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Project Description *
        </label>
        <textarea
          id='project_description'
          name='project_description'
          required
          rows={4}
          className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Tell us about your project...'
        ></textarea>
      </div>

      {/* Specific Requirements */}
      <div className='mt-6'>
        <label
          htmlFor='specific_requirements'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Specific Requirements
        </label>
        <textarea
          id='specific_requirements'
          name='specific_requirements'
          rows={3}
          className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Any specific technical requirements or features...'
        ></textarea>
      </div>

      {/* Message */}
      <div className='mt-6'>
        <label
          htmlFor='message'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Additional Message
        </label>
        <textarea
          id='message'
          name='message'
          rows={3}
          className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder="Anything else you'd like us to know..."
        ></textarea>
      </div>

      {/* Urgency */}
      <div className='mt-6'>
        <label
          htmlFor='urgency'
          className='block text-sm font-semibold text-gray-700 mb-2'
        >
          Urgency Level
        </label>
        <div className='flex gap-4'>
          {['low', 'medium', 'high', 'urgent'].map((level) => (
            <label key={level} className='flex items-center'>
              <input
                type='radio'
                name='urgency'
                value={level}
                defaultChecked={level === 'medium'}
                className='mr-2'
              />
              <span className='capitalize'>{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className='mt-8'>
        <button
          type='submit'
          className='w-full px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105'
        >
          Submit Inquiry
        </button>
        <p className='text-center text-sm text-gray-600 mt-4'>
          We&apos;ll respond within 24 hours. All inquiries are confidential.
        </p>
      </div>
    </form>
  )
}
