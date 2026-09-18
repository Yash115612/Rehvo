'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Home, Building2, BedDouble, Users, MapPin, Image as ImageIcon } from 'lucide-react';

export interface RehvoImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src?: string | null;
  fallbackCategory?: 'property' | 'commercial' | 'room' | 'flatmate' | 'locality' | 'general';
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  property: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
  commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
  room: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
  flatmate: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  locality: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
};

export const RehvoImage: React.FC<RehvoImageProps> = ({
  src,
  alt,
  className = '',
  fill,
  width,
  height,
  priority,
  sizes,
  fallbackCategory = 'general',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate URL scheme
  const isValidUrl =
    typeof src === 'string' &&
    src.trim().length > 0 &&
    (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('/'));

  const activeSrc = !hasError && isValidUrl ? src : CATEGORY_FALLBACK_IMAGES[fallbackCategory] || CATEGORY_FALLBACK_IMAGES.general;

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getCategoryIcon = () => {
    switch (fallbackCategory) {
      case 'commercial':
        return Building2;
      case 'room':
        return BedDouble;
      case 'flatmate':
        return Users;
      case 'locality':
        return MapPin;
      default:
        return Home;
    }
  };

  const Icon = getCategoryIcon();

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200/80 animate-pulse z-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-stone-300/60 flex items-center justify-center">
            <Icon className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      )}

      {/* Actual Image */}
      <Image
        src={activeSrc}
        alt={alt || 'REHVO Property'}
        fill={fill}
        width={!fill ? width || 400 : undefined}
        height={!fill ? height || 300 : undefined}
        sizes={sizes || (fill ? '100vw' : undefined)}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...rest}
      />
    </div>
  );
};
