'use client'

import { useState } from 'react'
import Link from 'next/link'

const contactMethods = [
  {
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
    title: 'Email',
    value: 'romeo@example.com',
    href: 'mailto:romeo@example.com',
    description: 'Send me an email anytime',
  },
  {
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
        />
      </svg>
    ),
    title: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    description: 'Mon-Fri from 9am to 6pm',
  },
  {
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
        />
      </svg>
    ),
    title: 'Location',
    value: 'Italy / Remote',
    href: '#',
    description: 'Available for remote work worldwide',
  },
  {
    icon: (
      <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
        <path
          fillRule='evenodd'
          d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
          clipRule='evenodd'
        />
      </svg>
    ),
    title: 'GitHub',
    value: 'github.com/romeo',
    href: 'https://github.com',
    description: 'Check out my open-source work',
  },
]

const faqs = [
  {
    question: "What's your typical response time?",
    answer:
      'I typically respond to messages within 24 hours during business days. For urgent matters, feel free to call.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Absolutely! I work with clients worldwide and am experienced in remote collaboration across different time zones.',
  },
  {
    question: "What's your hourly rate?",
    answer:
      "My rates vary depending on project scope and complexity. Let's discuss your specific needs, and I'll provide a detailed quote.",
  },
  {
    question: 'Do you offer maintenance packages?',
    answer:
      'Yes, I offer ongoing maintenance and support packages for all projects. This includes updates, bug fixes, and feature enhancements.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        const data = await response.json()
        setErrorMessage(data.error || 'Failed to send message')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Background */}
      <div className='fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20' />
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
              <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
            </svg>
            Get in Touch
          </div>
          <h1 className='text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6'>
            Let&apos;s Work Together
          </h1>
          <p className='text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto'>
            Have a project in mind? Whether it&apos;s a new build, consultation,
            or just a chat about tech — I&apos;d love to hear from you.
          </p>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-3 gap-12 mb-20'>
          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <div className='relative'>
              <div className='absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl' />
              <div className='relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm shadow-2xl p-8 md:p-12'>
                <h2 className='text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-6'>
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2'
                      >
                        Your Name *
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all'
                        placeholder='John Doe'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2'
                      >
                        Email Address *
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all'
                        placeholder='john@example.com'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2'
                    >
                      Subject *
                    </label>
                    <input
                      type='text'
                      id='subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all'
                      placeholder='Project Inquiry'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2'
                    >
                      Message *
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className='w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none'
                      placeholder='Tell me about your project...'
                    />
                  </div>

                  {status === 'success' && (
                    <div className='p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold'>
                      ✓ Message sent successfully! I&apos;ll get back to you
                      soon.
                    </div>
                  )}

                  {status === 'error' && (
                    <div className='p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold'>
                      ✗ {errorMessage}
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={status === 'loading'}
                    className='w-full px-8 py-4 rounded-xl font-black text-lg bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className='space-y-6'>
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  method.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className='block p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-[1.02] group'
              >
                <div className='flex items-start gap-4'>
                  <div className='shrink-0 h-12 w-12 rounded-xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform'>
                    {method.icon}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-black text-zinc-900 dark:text-white mb-1'>
                      {method.title}
                    </h3>
                    <p className='text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1'>
                      {method.value}
                    </p>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                      {method.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-zinc-600 dark:text-zinc-400'>
              Quick answers to common questions
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6 max-w-5xl mx-auto'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm'
              >
                <h3 className='text-lg font-black text-zinc-900 dark:text-white mb-3'>
                  {faq.question}
                </h3>
                <p className='text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed'>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='relative'>
          <div className='absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl' />
          <div className='relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm p-12 text-center'>
            <h2 className='text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4'>
              Ready to Start Your Project?
            </h2>
            <p className='text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto'>
              From initial concept to final deployment, I&apos;ll help bring
              your vision to life with clean code and solid architecture.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                href='/projects'
                className='px-8 py-4 rounded-xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl transition-all hover:scale-105'
              >
                View My Work
              </Link>
              <Link
                href='/about'
                className='px-8 py-4 rounded-xl font-black bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:shadow-xl transition-all hover:scale-105'
              >
                Learn More About Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
