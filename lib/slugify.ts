import slugifyLib from 'slugify';

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  // If title contains Arabic characters, handle it specially
  if (/[\u0600-\u06FF]/.test(title)) {
    return title
      .trim()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '') // Remove non-arabic/non-latin symbols
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .toLowerCase();
  }

  return slugifyLib(title, {
    lower: true,
    strict: true,
    locale: 'fr',
    trim: true,
  });
}

/**
 * Validate a slug - only lowercase letters, numbers, and hyphens
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
