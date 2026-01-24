import { headers } from 'next/headers'

export interface GeoLocation {
  country: string
  country_code: string
  city?: string
  region?: string
  latitude?: string
  longitude?: string
}

/**
 * Get user's geolocation from Vercel headers
 * These headers are automatically provided by Vercel Edge Network
 */
export async function getGeoLocation(): Promise<GeoLocation> {
  const headersList = await headers()

  // Vercel provides geolocation headers in production
  const country = headersList.get('x-vercel-ip-country') || 'Unknown'
  const country_code = headersList.get('x-vercel-ip-country-code') || 'XX'
  const city = headersList.get('x-vercel-ip-city') || undefined
  const region = headersList.get('x-vercel-ip-country-region') || undefined
  const latitude = headersList.get('x-vercel-ip-latitude') || undefined
  const longitude = headersList.get('x-vercel-ip-longitude') || undefined

  return {
    country,
    country_code,
    city,
    region,
    latitude,
    longitude,
  }
}

/**
 * Get user's IP address
 */
export async function getUserIP(): Promise<string> {
  const headersList = await headers()

  // Try various headers to get the real IP
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') ||
    'unknown'
  )
}

/**
 * Get user's device info from user agent
 */
export async function getDeviceInfo() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  // Simple device detection
  const isMobile = /mobile/i.test(userAgent)
  const isTablet = /tablet|ipad/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  // Browser detection
  let browser = 'Unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Edge')) browser = 'Edge'

  return {
    device: isDesktop ? 'Desktop' : isMobile ? 'Mobile' : 'Tablet',
    browser,
    userAgent,
  }
}
