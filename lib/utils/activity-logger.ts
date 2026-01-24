import { createClient } from '@/lib/supabase/server'
import {
  getGeoLocation,
  getUserIP,
  getDeviceInfo,
} from '@/lib/utils/geolocation'

interface ActivityData {
  page?: string
  action?: string
  [key: string]: any
}

/**
 * Log user activity with geolocation data
 */
export async function logUserActivity(
  activityType:
    | 'login'
    | 'page_view'
    | 'contact'
    | 'service_request'
    | 'download'
    | 'other',
  data: ActivityData = {},
) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get geolocation data
    const geo = await getGeoLocation()
    const ip = await getUserIP()
    const device = await getDeviceInfo()

    // Combine all activity data
    const activityData = {
      ...data,
      country: geo.country,
      country_code: geo.country_code,
      city: geo.city,
      region: geo.region,
      latitude: geo.latitude,
      longitude: geo.longitude,
      ip_address: ip,
      device: device.device,
      browser: device.browser,
      timestamp: new Date().toISOString(),
    }

    // Insert activity log
    const { error } = await supabase.from('user_activity_log').insert({
      user_id: user?.id || null,
      activity_type: activityType,
      activity_data: activityData,
      ip_address: ip,
    })

    if (error) {
      console.error('Error logging activity:', error)
    }
  } catch (error) {
    console.error('Error in logUserActivity:', error)
  }
}

/**
 * Log page view with geolocation
 */
export async function logPageView(page: string) {
  return logUserActivity('page_view', { page })
}
