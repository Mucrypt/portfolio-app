'use client';

import { useEffect } from 'react';
import * as gtag from '@/lib/analytics/gtag';

interface BlogPostTrackerProps {
  postId: string;
  postTitle: string;
  category: string;
}

export default function BlogPostTracker({ postId, postTitle, category }: BlogPostTrackerProps) {
  useEffect(() => {
    // Track blog post view
    gtag.trackBlogView(postId, postTitle, category);
  }, [postId, postTitle, category]);

  return null;
}
