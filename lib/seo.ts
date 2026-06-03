import { Metadata } from 'next';
import { Post } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eventzone.pro';
const SITE_NAME = 'Eventzone';

const baseTitles: Record<string, string> = {
  fr: 'Le Blog Eventzone | Insights & Guides pour vos événements',
  en: 'The Eventzone Blog | Insights & Guides for your events',
  ar: 'مدونة إيفينت زون | أفكار وإرشادات لفعالياتك'
};

const baseDescriptions: Record<string, string> = {
  fr: 'Découvrez nos articles, guides et ressources pour organiser des événements professionnels en France et en Afrique du Nord.',
  en: 'Discover our articles, guides and resources to organize professional events in France and North Africa.',
  ar: 'اكتشف مقالاتنا وأدلتنا ومواردنا لتنظيم فعاليات مهنية في فرنسا وشمال أفريقيا.'
};

const ogLocales: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  ar: 'ar_AR'
};

export function generateBlogMetadata(lang: string = 'fr', overrides?: Partial<Metadata>): Metadata {
  const normalizedLang = ['fr', 'en', 'ar'].includes(lang) ? lang : 'fr';
  const url = `${SITE_URL}/${normalizedLang}/blog`;
  const title = baseTitles[normalizedLang];
  const description = baseDescriptions[normalizedLang];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: ogLocales[normalizedLang],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    icons: {
      icon: 'https://i.imgur.com/Ul3gM9k.png',
      shortcut: 'https://i.imgur.com/Ul3gM9k.png',
      apple: 'https://i.imgur.com/Ul3gM9k.png',
    },
    ...overrides,
  };
}

export function generateArticleMetadata(post: Post, lang?: string): Metadata {
  const currentLang = lang || post.lang || 'fr';
  const title = `${post.seo_title || post.title} | Eventzone Blog`;
  const description = post.seo_description || post.excerpt || '';
  const url = post.canonical_url || `${SITE_URL}/${currentLang}/blog/${post.slug}`;
  const image = post.og_image_url || post.cover_image_url || '';

  return {
    title,
    description,
    openGraph: {
      title: post.seo_title || post.title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: post.cover_image_alt || post.title,
            },
          ]
        : undefined,
      locale: post.lang === 'en' ? 'en_US' : 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateArticleJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_description || post.excerpt || '',
    image: post.og_image_url || post.cover_image_url || '',
    author: {
      '@type': 'Person',
      name: post.author_name || 'Eventzone',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eventzone',
      url: 'https://eventzone.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images2.imgbox.com/02/39/OksF9irW_o.png',
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/${post.lang || 'fr'}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${post.lang || 'fr'}/blog/${post.slug}`,
    },
    wordCount: post.content
      ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
      : 0,
    timeRequired: `PT${post.reading_time_minutes}M`,
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getSiteUrl() {
  return SITE_URL;
}
