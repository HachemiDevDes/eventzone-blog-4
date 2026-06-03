'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CTABannerProps {
  postId?: string;
}

export default function CTABanner({ postId }: CTABannerProps) {
  const handleCTAClick = async () => {
    if (!postId) return;
    
    try {
      // Increment cta_clicks column
      // We assume there's a column 'cta_clicks' in 'posts' table
      // If RPC doesn't exist, we use a simple update
      const { error } = await supabase.rpc('increment_cta_clicks', { p_post_id: postId });
      
      if (error) {
        // Fallback to manual update if RPC is missing
        const { data: current } = await supabase
          .from('posts')
          .select('cta_clicks')
          .eq('id', postId)
          .single();
          
        await supabase
          .from('posts')
          .update({ cta_clicks: (current?.cta_clicks || 0) + 1 })
          .eq('id', postId);
      }
    } catch (err) {
      console.warn('Failed to track CTA click:', err);
    }
  };

  return (
    <div className="my-10 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
      <div className="relative">
        <p className="font-heading font-bold text-heading text-text-primary mb-2">
          Gérez votre prochain événement avec Eventzone
        </p>
        <p className="text-body text-text-secondary mb-5">
          La plateforme tout-en-un pour organiser, gérer et analyser vos événements professionnels.
        </p>
        <Link
          href="https://calendly.com/eventzone114/eventzone-demo-meeting-all-in-one-event-management"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCTAClick}
          className="btn-primary inline-flex items-center gap-2 shadow-glow hover:scale-105 transition-transform"
        >
          Demander une démo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
