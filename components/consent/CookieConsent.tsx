'use client'

/**
 * Cookie consent (GDPR / ePrivacy). Google Analytics is not loaded at all until the visitor
 * accepts; "Reject" is as easy as "Accept". The choice is kept for 6 months in a first-party
 * cookie, and the footer's "Cookie settings" button reopens the banner.
 *
 * Sign-in cookies are strictly necessary and don't need consent. Vercel Web Analytics and
 * Speed Insights are cookieless.
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { GoogleAnalytics } from '@next/third-parties/google'

const COOKIE = 'cookie_consent'
const MAX_AGE = 60 * 60 * 24 * 182 // ~6 months
export const OPEN_EVENT = 'open-cookie-settings'
const CHANGE_EVENT = 'cookie-consent-change'

type Choice = 'granted' | 'denied'

function readChoice(): Choice | null {
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=(granted|denied)/)
  return (match?.[1] as Choice) ?? null
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

/** 'unknown' on the server and during hydration, so nothing renders until the browser has read the cookie. */
function useChoice(): Choice | null | 'unknown' {
  return useSyncExternalStore(subscribe, readChoice, () => 'unknown' as const)
}

function saveChoice(choice: Choice) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${choice}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Remove Google Analytics cookies after consent is withdrawn. */
function clearAnalyticsCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const name of document.cookie.split(';').map((c) => c.split('=')[0].trim())) {
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      for (const d of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ''}`
      }
    }
  }
}

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const choice = useChoice()
  const [reopened, setReopened] = useState(false)
  const open = choice === null || reopened

  useEffect(() => {
    const reopen = () => setReopened(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const decide = useCallback(
    (next: Choice) => {
      const withdrew = choice === 'granted' && next === 'denied'
      saveChoice(next)
      setReopened(false)
      if (withdrew) {
        clearAnalyticsCookies()
        location.reload() // unload the already-running GA script
      }
    },
    [choice],
  )

  return (
    <>
      {gaId && choice === 'granted' && <GoogleAnalytics gaId={gaId} />}
      {open && (
        <div
          role='dialog'
          aria-live='polite'
          aria-label='Cookie preferences'
          className='fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/95'
        >
          <div className='mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center'>
            <p className='flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              We’d like to use Google Analytics cookies to see which pages and courses help people. They’re
              off unless you accept. Sign-in cookies are always on because the site needs them.{' '}
              <Link href='/privacy' className='font-medium text-blue-600 underline dark:text-blue-400'>
                Privacy policy
              </Link>
            </p>
            <div className='flex shrink-0 gap-2'>
              <button
                type='button'
                onClick={() => decide('denied')}
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-gray-500 dark:border-gray-600 dark:text-gray-100'
              >
                Reject
              </button>
              <button
                type='button'
                onClick={() => decide('granted')}
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-gray-500 dark:border-gray-600 dark:text-gray-100'
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
