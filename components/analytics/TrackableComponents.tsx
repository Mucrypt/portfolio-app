'use client';

import { useRef } from 'react';
import { useClickTracking } from '@/lib/analytics/hooks';
import * as gtag from '@/lib/analytics/gtag';

interface TrackableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  eventName?: string;
  eventCategory?: string;
  eventLabel?: string;
  children: React.ReactNode;
}

export function TrackableButton({
  eventName = 'button_click',
  eventCategory = 'engagement',
  eventLabel,
  onClick,
  children,
  ...props
}: TrackableButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the event
    gtag.event({
      action: eventName,
      category: eventCategory,
      label: eventLabel || e.currentTarget.textContent || 'button',
    });

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

interface TrackableLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName?: string;
  trackExternal?: boolean;
  children: React.ReactNode;
}

export function TrackableLink({
  eventName,
  trackExternal = true,
  onClick,
  href,
  children,
  ...props
}: TrackableLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href && trackExternal) {
      const isExternal = href.startsWith('http') || href.startsWith('//');
      if (isExternal) {
        gtag.trackExternalLink(href, e.currentTarget.textContent || '');
      }
    }

    if (eventName) {
      gtag.event({
        action: eventName,
        category: 'link_click',
        label: href || '',
      });
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

interface TrackableFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formName: string;
  onSubmitCallback?: (data: FormData) => void;
  children: React.ReactNode;
}

export function TrackableForm({
  formName,
  onSubmitCallback,
  onSubmit,
  children,
  ...props
}: TrackableFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      // Don't send sensitive data to analytics
      if (!['password', 'credit_card', 'ssn'].includes(key.toLowerCase())) {
        data[key] = typeof value === 'string' && value.length > 50 ? 'truncated' : 'filled';
      }
    });

    gtag.trackFormSubmit(formName, data);

    if (onSubmitCallback) {
      onSubmitCallback(formData);
    }

    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}

interface SocialShareButtonProps {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'email' | 'copy';
  url: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SocialShareButton({
  platform,
  url,
  title,
  children,
  className,
}: SocialShareButtonProps) {
  const handleShare = () => {
    gtag.trackSocialClick(platform, 'share');
    gtag.event({
      action: 'share',
      category: 'social',
      label: platform,
    });

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || '')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <button onClick={handleShare} className={className}>
      {children}
    </button>
  );
}

interface DownloadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fileName: string;
  fileType: string;
  downloadUrl: string;
  children: React.ReactNode;
}

export function DownloadButton({
  fileName,
  fileType,
  downloadUrl,
  onClick,
  children,
  ...props
}: DownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    gtag.trackDownload(fileName, fileType);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleDownload} {...props}>
      <a href={downloadUrl} download={fileName}>
        {children}
      </a>
    </button>
  );
}
