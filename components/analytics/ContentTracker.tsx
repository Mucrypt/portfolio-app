'use client';

import { useEffect } from 'react';
import * as gtag from '@/lib/analytics/gtag';

interface ContentTrackerProps {
  type: 'project' | 'course' | 'service' | 'shop';
  itemId: string;
  itemName: string;
  category?: string;
}

export default function ContentTracker({ type, itemId, itemName, category }: ContentTrackerProps) {
  useEffect(() => {
    switch (type) {
      case 'project':
        gtag.trackProjectView(itemId, itemName);
        break;
      case 'course':
        gtag.trackCourseView(itemId, itemName);
        break;
      case 'service':
        gtag.trackServiceView(itemId, itemName);
        break;
      case 'shop':
        gtag.event({
          action: 'view_item',
          category: 'ecommerce',
          label: itemName,
        });
        break;
    }
  }, [type, itemId, itemName, category]);

  return null;
}
