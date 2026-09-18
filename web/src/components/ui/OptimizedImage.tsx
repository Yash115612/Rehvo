'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  fallbackSrc?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | '9/16';
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80';
const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDMiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = 'REHVO Verified Rental Property in Mumbai',
  fallbackSrc = FALLBACK_IMAGE,
  aspectRatio = '4/3',
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
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
      <Image
        src={typeof imgSrc === 'string' ? imgSrc : fallbackSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading}
        onError={handleError}
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_DATA_URL}
        className="w-full h-full object-cover transition-all duration-300"
        {...props}
      />
    </div>
  );
};

