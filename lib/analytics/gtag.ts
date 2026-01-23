// Google Analytics 4 Event Tracking
// Comprehensive analytics implementation for world-class tracking

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Type definitions for GA4 events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface UserEvent {
  user_id?: string;
  user_properties?: Record<string, any>;
}

// Custom event types for portfolio app
export type PortfolioEvent =
  | 'view_project'
  | 'view_blog_post'
  | 'view_course'
  | 'view_service'
  | 'contact_form_submit'
  | 'newsletter_signup'
  | 'download_resume'
  | 'social_click'
  | 'portfolio_share'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'video_play'
  | 'file_download'
  | 'external_link_click'
  | 'scroll_depth'
  | 'time_on_page';

// Check if GA is available
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' && !!GA_MEASUREMENT_ID && !!window.gtag;
};

// Send page view to GA4
export const pageview = (url: string, title?: string) => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const event = ({ action, category, label, value }: GAEvent) => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track portfolio-specific events with enhanced data
export const trackPortfolioEvent = (
  eventName: PortfolioEvent,
  params?: Record<string, any>
) => {
  if (!isGAEnabled()) return;

  window.gtag('event', eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  });
};

// Track project views
export const trackProjectView = (projectId: string, projectName: string) => {
  trackPortfolioEvent('view_project', {
    item_id: projectId,
    item_name: projectName,
    content_type: 'project',
  });
};

// Track blog post views
export const trackBlogView = (postId: string, postTitle: string, category?: string) => {
  trackPortfolioEvent('view_blog_post', {
    item_id: postId,
    item_name: postTitle,
    content_type: 'blog',
    item_category: category,
  });
};

// Track course views
export const trackCourseView = (courseId: string, courseName: string) => {
  trackPortfolioEvent('view_course', {
    item_id: courseId,
    item_name: courseName,
    content_type: 'course',
  });
};

// Track service views
export const trackServiceView = (serviceId: string, serviceName: string) => {
  trackPortfolioEvent('view_service', {
    item_id: serviceId,
    item_name: serviceName,
    content_type: 'service',
  });
};

// Track form submissions
export const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
  trackPortfolioEvent('contact_form_submit', {
    form_name: formName,
    ...formData,
  });
};

// Track newsletter signups
export const trackNewsletterSignup = (email?: string) => {
  trackPortfolioEvent('newsletter_signup', {
    method: 'email',
  });
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackPortfolioEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string, action: string) => {
  trackPortfolioEvent('social_click', {
    social_network: platform,
    social_action: action,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  trackPortfolioEvent('external_link_click', {
    link_url: url,
    link_text: linkText,
    outbound: true,
  });
};

// Track search queries
export const trackSearch = (searchTerm: string, resultCount?: number) => {
  trackPortfolioEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

// Track video interactions
export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  trackPortfolioEvent('video_play', {
    video_title: videoTitle,
    video_id: videoId,
  });
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  trackPortfolioEvent('scroll_depth', {
    percent_scrolled: depth,
  });
};

// Track time on page
export const trackTimeOnPage = (seconds: number, pagePath: string) => {
  trackPortfolioEvent('time_on_page', {
    engagement_time: seconds,
    page_path: pagePath,
  });
};

// E-commerce tracking for shop
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
}) => {
  if (!isGAEnabled()) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity || 1,
      },
    ],
  });
};

export const trackBeginCheckout = (items: any[], totalValue: number) => {
  if (!isGAEnabled()) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: totalValue,
    items: items,
  });
};

export const trackPurchase = (
  transactionId: string,
  items: any[],
  totalValue: number,
  tax?: number,
  shipping?: number
) => {
  if (!isGAEnabled()) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: totalValue,
    tax: tax || 0,
    shipping: shipping || 0,
    items: items,
  });
};

// Track exceptions/errors
export const trackException = (description: string, fatal = false) => {
  if (!isGAEnabled()) return;

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (!isGAEnabled()) return;

  window.gtag('set', 'user_properties', properties);
};

// Set user ID for authenticated users
export const setUserId = (userId: string) => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });
};

// Track timing events
export const trackTiming = (
  name: string,
  value: number,
  category?: string,
  label?: string
) => {
  if (!isGAEnabled()) return;

  window.gtag('event', 'timing_complete', {
    name: name,
    value: value,
    event_category: category,
    event_label: label,
  });
};
