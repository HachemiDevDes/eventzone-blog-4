import BlogHeader from '@/components/blog/BlogHeader';
import BlogFooter from '@/components/blog/BlogFooter';

export default function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader currentLang={params.lang} />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
