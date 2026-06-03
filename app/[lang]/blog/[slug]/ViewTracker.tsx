'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ArticleTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // 1. Increment view count
    const trackView = async () => {
      try {
        await supabase.rpc('increment_post_views', { p_post_id: postId });
      } catch (error) {
        console.warn('Failed to track view:', error);
      }
    };

    const timeout = setTimeout(trackView, 2000);

    // 2. Global CTA Click Tracking
    // This catches clicks on CTAs inserted via the editor (Static HTML)
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicked element or its parent is a CTA
      const ctaElement = target.closest('[data-cta="true"], .cta-node-view, .btn-primary');
      
      if (ctaElement) {
        // If it's a link to eventzone or calendly or a call, track it
        const href = (ctaElement as any).href || '';
        const isInternalCTA = href.includes('calendly.com') || href.includes('eventzone') || href.startsWith('tel:');
        
        if (isInternalCTA || ctaElement.hasAttribute('data-cta')) {
          try {
            await supabase.rpc('increment_cta_clicks', { p_post_id: postId });
          } catch (err) {
            console.warn('Fallback CTA Tracking...');
            // Manual fallback
            const { data } = await supabase.from('posts').select('cta_clicks').eq('id', postId).single();
            await supabase.from('posts').update({ cta_clicks: (data?.cta_clicks || 0) + 1 }).eq('id', postId);
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [postId]);

  return null;
}
