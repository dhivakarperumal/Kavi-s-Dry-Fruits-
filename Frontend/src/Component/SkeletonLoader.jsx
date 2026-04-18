// SkeletonLoader.jsx - Component for product card skeleton loading
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-60 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md overflow-hidden bg-gray-200">
        <div className="w-full h-full bg-gray-300" />
      </div>

      {/* Title placeholder */}
      <div className="mt-4 h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>

      {/* Price placeholder */}
      <div className="mt-3 h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>

      {/* Divider */}
      <div className="w-[90%] h-[1px] bg-gray-300 mx-auto my-3" />

      {/* Button & Rating placeholder */}
      <div className="flex justify-between items-center gap-2">
        <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
        <div className="flex-1 h-10 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

// Show multiple skeleton loaders for loading state
export const ProductSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
    </div>
  );
};
