/**
 * Advanced Image Loading Hook
 * Handles progressive image loading with LQIP
 */

import { useState, useEffect, useRef } from 'react';

export const useImageLoad = (src, options = {}) => {
  const { 
    lowQuality = null,
    timeout = 10000,
    retries = 2
  } = options;

  const [state, setState] = useState({
    status: 'pending', // pending, loading, success, error
    src: lowQuality || src,
    error: null,
    progress: 0
  });

  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!src) {
      setState(prev => ({ ...prev, status: 'error' }));
      return;
    }

    let isMounted = true;
    let timeoutId;

    const loadImage = () => {
      const img = new Image();

      img.onload = () => {
        if (isMounted) {
          setState({
            status: 'success',
            src: src,
            error: null,
            progress: 100
          });
        }
      };

      img.onerror = () => {
        if (isMounted) {
          if (retryCountRef.current < retries) {
            retryCountRef.current++;
            // Retry after delay
            timeoutId = setTimeout(loadImage, 500);
          } else {
            setState(prev => ({
              ...prev,
              status: 'error',
              error: 'Failed to load image'
            }));
          }
        }
      };

      // Set timeout for slow connections
      timeoutId = setTimeout(() => {
        if (isMounted && state.status === 'loading') {
          if (retryCountRef.current < retries) {
            retryCountRef.current++;
            loadImage();
          } else {
            setState(prev => ({
              ...prev,
              status: 'error',
              error: 'Image loading timeout'
            }));
          }
        }
      }, timeout);

      setState(prev => ({ ...prev, status: 'loading' }));
      img.src = src;
    };

    loadImage();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [src, timeout, retries, lowQuality]);

  return state;
};

export default useImageLoad;
