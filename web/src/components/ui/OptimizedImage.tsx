'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  fallbackSrc?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | '9/16';
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = 'REHVO Verified Rental Property in Mumbai',
  fallbackSrc = FALLBACK_IMAGE,
  aspectRatio = '4/3',
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton Blur Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      <img
        src={typeof imgSrc === 'string' ? imgSrc : fallbackSrc}
        alt={alt}
        loading={loading}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
        }`}
        {...(props as any)}
      />
    </div>
  );
};
