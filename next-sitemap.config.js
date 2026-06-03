/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://eventzone.pro',
  generateRobotsTxt: false, // We manage robots.txt manually
  outDir: './public',
  exclude: ['/admin/*', '/admin'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async (config) => [
    { loc: '/blog', changefreq: 'daily', priority: 1.0 },
  ],
  transform: async (config, path) => {
    // Higher priority for blog posts
    if (path.startsWith('/blog/') && !path.includes('/category/') && !path.includes('/tag/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.9 };
    }
    if (path.startsWith('/blog/category/') || path.startsWith('/blog/tag/')) {
      return { loc: path, changefreq: 'weekly', priority: 0.6 };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority };
  },
};
