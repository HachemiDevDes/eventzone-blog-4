export const i18n = {
  fr: {
    blog: "Blog",
    readMore: "Lire la suite",
    publishedAt: "Publié le",
    readingTime: "min de lecture",
    relatedPosts: "Articles similaires",
    categories: "Catégories",
    tags: "Tags",
    noPosts: "Aucun article trouvé.",
    search: "Rechercher...",
    backToBlog: "Retour au blog",
    demoButton: "Demander une démo",
    callButton: "Appelez-nous",
    resultsFor: "Résultats pour",
    articleNotFound: "Article non trouvé",
    featuredArticle: "À la Une",
    footerDescription: "La plateforme tout-en-un pour organiser, gérer et réussir vos événements professionnels.",
  },
  en: {
    blog: "Blog",
    readMore: "Read more",
    publishedAt: "Published on",
    readingTime: "min read",
    relatedPosts: "Related Articles",
    categories: "Categories",
    tags: "Tags",
    noPosts: "No articles found.",
    search: "Search...",
    backToBlog: "Back to blog",
    demoButton: "Book a demo",
    callButton: "Call us",
    resultsFor: "Results for",
    articleNotFound: "Article not found",
    featuredArticle: "Featured",
    footerDescription: "The all-in-one platform to organize, manage, and succeed in your professional events.",
  },
} as const;

export type Locale = keyof typeof i18n;

export function getDictionary(lang: string = 'fr') {
  return i18n[lang as Locale] || i18n.fr;
}
