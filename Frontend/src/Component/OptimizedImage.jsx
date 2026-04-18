import React, { useState, useEffect } from 'react';
import { getImageWithFallback, cacheImageLoaded, isImageCached } from '../utils/imageOptimization';

/**
 * OptimizedImage Component
 * Handles loading states, error handling, lazy loading, and responsive images
 * Supports srcSet for responsive image serving
 */
const OptimizedImage = React.memo(({
  src,
  fallback = null,
  alt = 'Product image',
  className = '',
  objectFit = 'contain',
  onLoad = () => {},
  onError = () => {},
  loading = 'lazy',
  srcSet = null,
  sizes = null,
  width = null,
  height = null,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(() => getImageWithFallback(src, fallback));
  const [isLoading, setIsLoading] = useState(!isImageCached(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(getImageWithFallback(src, fallback));
    setIsLoading(!isImageCached(src));
    setHasError(false);
  }, [src, fallback]);

  const handleLoadStart = () => {
    if (!isImageCached(imageSrc)) {
      setIsLoading(true);
    }
  };

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    cacheImageLoaded(imageSrc);
    onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if primary failed
    if (fallback && imageSrc !== fallback) {
      const fallbackUrl = getImageWithFallback(fallback);
      setImageSrc(fallbackUrl);
    } else {
      onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      
      {/* Image with responsive support */}
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : `object-${objectFit}`} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding="async"
        {...props}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm text-center p-2">
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
