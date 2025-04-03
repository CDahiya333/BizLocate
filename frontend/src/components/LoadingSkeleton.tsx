interface SkeletonProps {
  className?: string;
}

// Simple skeleton loader with animated shimmer effect
export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}></div>
  );
};

// Business card skeleton
export const BusinessCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side - Image placeholder */}
          <div className="relative w-full md:w-1/3 max-w-[300px] mx-auto md:mx-0">
            <div className="rounded-lg overflow-hidden aspect-square relative">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Right side - Business info placeholders */}
          <div className="w-full md:w-2/3">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-6" />
            
            {/* Button placeholders */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-24 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business detail skeleton
export const BusinessDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Image placeholder */}
            <div className="w-full lg:w-1/3">
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            {/* Right side - Business info placeholders */}
            <div className="w-full lg:w-2/3">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              
              <div className="mb-6">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Skeleton className="w-32 h-10 rounded-lg" />
                <Skeleton className="w-24 h-10 rounded-lg" />
                <Skeleton className="w-28 h-10 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8">
            <Skeleton className="h-6 w-36 mb-3" />
            <Skeleton className="w-full h-80 rounded-lg mb-3" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>

          {/* Reviews placeholder */}
          <div className="mt-8">
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-base-200 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Map skeleton
export const MapSkeleton = () => {
  return (
    <div className="w-full h-full min-h-[300px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-gray-500 dark:text-gray-300">Loading map...</p>
      </div>
    </div>
  );
}; 