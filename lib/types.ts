export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  category: string | null;
  tags: string[];
  lang: 'fr' | 'ar' | 'en';
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  cta_type: 'none' | 'call' | 'demo';
  cta_phone: string | null;
  reading_time_minutes: number;
  views: number;
  cta_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface PostView {
  id: string;
  post_id: string;
  viewed_at: string;
  count: number;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  cover_image_alt: string;
  author_name: string;
  author_avatar_url: string;
  category: string;
  tags: string[];
  lang: 'fr' | 'ar' | 'en';
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  scheduled_at: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_image_url: string;
  cta_type: 'none' | 'call' | 'demo';
  cta_phone: string;
}
export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}
