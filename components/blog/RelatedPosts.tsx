import { Post } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-heading font-bold text-heading-lg text-text-primary mb-8">
        Articles similaires
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
