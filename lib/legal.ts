/**
 * Facts the Terms and Refund pages depend on. Fill these in (with your commercialista) before
 * COMMERCE_ENABLED goes on; until `reviewed` is true both pages show a "draft" notice and are noindex.
 * Never put a personal email here: use a dedicated support address.
 */
export const LEGAL = {
  reviewed: false,
  /** Who runs the site, as registered (e.g. "Romeo Mukulah, ditta individuale"). null = not yet registered. */
  operator: null as string | null,
  /** Registered address and Partita IVA, once they exist. */
  address: null as string | null,
  vatNumber: null as string | null,
  /** Dedicated support address (not a personal inbox). null = use the contact form. */
  supportEmail: null as string | null,
  /**
   * Goodwill refund window for source code, in days, beyond the law. null = refunds only when the
   * download is broken and can't be fixed (source code can't be "returned"). Your decision.
   */
  sourceRefundDays: null as number | null,
  lastUpdated: '2026-11-20',
} as const

/** Shown at checkout: the EU consumer's consent to immediate supply of digital content. */
export const IMMEDIATE_ACCESS_NOTICE =
  'By paying you ask for immediate access to digital content and accept that the 14-day right of withdrawal ends once access starts. See romeomukulah.org/refunds.'
