export default function PostLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumbs Skeleton */}
      <div className="h-4 w-48 bg-surface-hover rounded-md mb-6 animate-pulse" />

      {/* Cover Image Skeleton */}
      <div className="relative aspect-[21/9] w-full bg-surface-hover border border-border rounded-2xl mb-8 animate-pulse" />

      {/* Header Info Skeleton */}
      <header className="max-w-3xl mx-auto mb-10 space-y-4">
        {/* Category badge */}
        <div className="h-6 w-20 bg-primary/10 rounded-md animate-pulse" />
        {/* Title */}
        <div className="h-10 w-full bg-border rounded-xl animate-pulse" />
        <div className="h-10 w-4/5 bg-border rounded-xl animate-pulse" />
        {/* Author / Date meta */}
        <div className="flex items-center gap-4 pt-2">
          <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse" />
          <div className="h-4 w-24 bg-border rounded-md animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <div className="h-4 w-28 bg-border rounded-md animate-pulse" />
        </div>
      </header>

      {/* Layout Content Skeletons */}
      <div className="max-w-3xl mx-auto space-y-6 pt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full bg-surface-hover rounded-md animate-pulse" />
            <div className="h-4 w-11/12 bg-surface-hover rounded-md animate-pulse" />
            {i % 3 === 0 && <div className="h-4 w-4/5 bg-surface-hover rounded-md animate-pulse" />}
          </div>
        ))}
      </div>
    </div>
  );
}
