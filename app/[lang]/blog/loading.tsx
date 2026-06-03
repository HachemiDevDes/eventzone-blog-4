export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-surface-hover/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Title Skeleton */}
          <div className="h-12 w-64 md:w-96 bg-border rounded-2xl mx-auto animate-pulse" />
          {/* Subtitle Skeleton */}
          <div className="h-4 w-72 md:w-[500px] bg-border rounded-xl mx-auto animate-pulse" />
          {/* Searchbar Skeleton */}
          <div className="max-w-xl mx-auto h-14 bg-surface border border-border rounded-2xl animate-pulse" />
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-32 mt-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content Grid Skeleton */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card overflow-hidden space-y-4 pb-6">
                  {/* Image Block */}
                  <div className="aspect-[16/10] bg-surface-hover animate-pulse" />
                  {/* Content Block */}
                  <div className="px-6 space-y-3">
                    <div className="h-3 w-24 bg-border rounded-md animate-pulse" />
                    <div className="h-6 w-full bg-border rounded-lg animate-pulse" />
                    <div className="h-4 w-5/6 bg-border rounded-md animate-pulse" />
                    {/* Author Block */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse" />
                      <div className="h-3 w-20 bg-border rounded-md animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 mt-20 lg:mt-0 space-y-8">
            {/* Category Card */}
            <div className="card p-6 space-y-4">
              <div className="h-5 w-28 bg-border rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-surface-hover rounded-md animate-pulse" />
                ))}
              </div>
            </div>

            {/* Tags Card */}
            <div className="card p-6 space-y-4">
              <div className="h-5 w-32 bg-border rounded-lg animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-7 w-16 bg-surface-hover rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
