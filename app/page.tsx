import Link from 'next/link'
import {
  ArrowRight,
  Code2,
  Briefcase,
  BookOpen,
  ShoppingCart,
  GraduationCap,
  Mail,
  Wrench,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  // Check if current user is admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('owner_user_id', user.id)
      .single()

    isAdmin = !!profile
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white'>
      {/* Admin Access - Only visible to logged-in admins */}
      {isAdmin && (
        <Link
          href='/admin/dashboard'
          className='fixed top-4 right-4 z-50 p-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all opacity-30 hover:opacity-100'
          title='Admin Dashboard'
        >
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
            />
          </svg>
        </Link>
      )}

      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-6xl mx-auto'>
          {/* Hero Section */}
          <div className='text-center mb-20'>
            <div className='mb-6 inline-block'>
              <span className='px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium'>
                ✨ Welcome to my World
              </span>
            </div>
            <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight'>
              Romeo Mukulah
            </h1>
            <p className='text-2xl md:text-3xl text-gray-300 mb-6 font-light'>
              Full Stack Developer & Cloud Architect
            </p>
            <p className='text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed'>
              Building scalable, secure, and user-friendly applications with
              Next.js, React, and cloud technologies. Passionate about creating
              efficient solutions that make a difference.
            </p>

            {/* Primary CTA */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link
                href='/about'
                className='group px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2'
              >
                Explore My Portfolio
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Link>
              <Link
                href='/contact'
                className='px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:border-gray-600 transition-all'
              >
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Main Navigation Cards */}
          <div className='mb-20'>
            <h2 className='text-3xl font-bold text-center mb-12 text-gray-200'>
              Discover What I Offer
            </h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <Link
                href='/projects'
                className='group p-8 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/50 hover:from-blue-500/20 hover:to-blue-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-blue-500/20 rounded-lg w-fit group-hover:bg-blue-500/30 transition-colors'>
                  <Briefcase className='w-8 h-8 text-blue-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Projects</h3>
                <p className='text-gray-400 mb-4'>
                  Explore my portfolio of web applications, cloud solutions, and
                  open-source contributions.
                </p>
                <span className='text-blue-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  View Projects <ArrowRight className='w-4 h-4' />
                </span>
              </Link>

              <Link
                href='/blog'
                className='group p-8 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/50 hover:from-purple-500/20 hover:to-purple-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-purple-500/20 rounded-lg w-fit group-hover:bg-purple-500/30 transition-colors'>
                  <BookOpen className='w-8 h-8 text-purple-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Blog</h3>
                <p className='text-gray-400 mb-4'>
                  Read my latest articles on web development, cloud
                  architecture, and tech insights.
                </p>
                <span className='text-purple-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  Read Articles <ArrowRight className='w-4 h-4' />
                </span>
              </Link>

              <Link
                href='/courses'
                className='group p-8 bg-linear-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 hover:border-green-500/50 hover:from-green-500/20 hover:to-green-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-green-500/20 rounded-lg w-fit group-hover:bg-green-500/30 transition-colors'>
                  <GraduationCap className='w-8 h-8 text-green-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Courses</h3>
                <p className='text-gray-400 mb-4'>
                  Learn from my curated courses on modern web development and
                  cloud technologies.
                </p>
                <span className='text-green-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  Browse Courses <ArrowRight className='w-4 h-4' />
                </span>
              </Link>

              <Link
                href='/services'
                className='group p-8 bg-linear-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20 hover:border-orange-500/50 hover:from-orange-500/20 hover:to-orange-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-orange-500/20 rounded-lg w-fit group-hover:bg-orange-500/30 transition-colors'>
                  <Wrench className='w-8 h-8 text-orange-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Services</h3>
                <p className='text-gray-400 mb-4'>
                  Discover the professional services I offer, from consulting to
                  full-stack development.
                </p>
                <span className='text-orange-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  View Services <ArrowRight className='w-4 h-4' />
                </span>
              </Link>

              <Link
                href='/shop'
                className='group p-8 bg-linear-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/20 hover:border-pink-500/50 hover:from-pink-500/20 hover:to-pink-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-pink-500/20 rounded-lg w-fit group-hover:bg-pink-500/30 transition-colors'>
                  <ShoppingCart className='w-8 h-8 text-pink-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Shop</h3>
                <p className='text-gray-400 mb-4'>
                  Browse digital products, templates, and resources for
                  developers.
                </p>
                <span className='text-pink-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  Visit Shop <ArrowRight className='w-4 h-4' />
                </span>
              </Link>

              <Link
                href='/contact'
                className='group p-8 bg-linear-to-br from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 hover:from-cyan-500/20 hover:to-cyan-600/20 transition-all transform hover:scale-105'
              >
                <div className='mb-4 p-3 bg-cyan-500/20 rounded-lg w-fit group-hover:bg-cyan-500/30 transition-colors'>
                  <Mail className='w-8 h-8 text-cyan-400' />
                </div>
                <h3 className='text-2xl font-bold mb-3 text-white'>Contact</h3>
                <p className='text-gray-400 mb-4'>
                  Let's collaborate! Get in touch for projects, consultations,
                  or just to say hi.
                </p>
                <span className='text-cyan-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all'>
                  Contact Me <ArrowRight className='w-4 h-4' />
                </span>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className='mb-20'>
            <div className='grid md:grid-cols-4 gap-6'>
              <div className='p-6 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 text-center'>
                <div className='text-4xl font-bold text-blue-400 mb-2'>
                  100%
                </div>
                <div className='text-gray-300 font-medium'>Uptime</div>
              </div>
              <div className='p-6 bg-linear-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 text-center'>
                <div className='text-4xl font-bold text-green-400 mb-2'>0</div>
                <div className='text-gray-300 font-medium'>Errors</div>
              </div>
              <div className='p-6 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 text-center'>
                <div className='text-4xl font-bold text-purple-400 mb-2'>
                  $0
                </div>
                <div className='text-gray-300 font-medium'>Monthly Cost</div>
              </div>
              <div className='p-6 bg-linear-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/20 text-center'>
                <div className='text-4xl font-bold text-pink-400 mb-2'>
                  24/7
                </div>
                <div className='text-gray-300 font-medium'>Monitoring</div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className='mb-20'>
            <h2 className='text-3xl font-bold text-center mb-8 text-gray-200'>
              Built With Modern Tech
            </h2>
            <div className='flex flex-wrap gap-3 justify-center'>
              {[
                { name: 'Next.js 16', color: 'from-gray-400 to-gray-600' },
                { name: 'React 19', color: 'from-blue-400 to-blue-600' },
                { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
                { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' },
                { name: 'Supabase', color: 'from-green-400 to-green-600' },
                { name: 'Vercel', color: 'from-black to-gray-800' },
                { name: 'Sentry', color: 'from-purple-400 to-purple-600' },
                { name: 'PostgreSQL', color: 'from-blue-600 to-blue-800' },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`px-5 py-2.5 bg-linear-to-r ${tech.color} rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className='text-center text-gray-400 text-sm border-t border-gray-800 pt-8'>
            <p className='mb-2'>© 2026 Romeo Mukulah. All rights reserved.</p>
            <p className='flex items-center justify-center gap-2 flex-wrap'>
              <span>
                Deployed on{' '}
                <span className='text-blue-400 font-medium'>Vercel</span>
              </span>
              <span>•</span>
              <span>
                Monitored by{' '}
                <span className='text-green-400 font-medium'>UptimeRobot</span>
              </span>
              <span>•</span>
              <span>
                Secured by{' '}
                <span className='text-purple-400 font-medium'>Sentry</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
