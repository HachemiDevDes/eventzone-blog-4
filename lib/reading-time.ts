/**
 * Calculate reading time from HTML content
 * Average reading speed: 200 words per minute (French/English)
 * Arabic is slightly slower; we use 180 wpm for Arabic
 */
export function calculateReadingTime(htmlContent: string, lang: string = 'fr'): number {
  // Strip HTML tags to get plain text
  const text = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = lang === 'ar' ? 180 : 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number, lang: string = 'fr'): string {
  if (lang === 'ar') {
    return `${minutes} دقائق للقراءة`;
  }
  if (lang === 'en') {
    return `${minutes} min read`;
  }
  return `${minutes} min de lecture`;
}
