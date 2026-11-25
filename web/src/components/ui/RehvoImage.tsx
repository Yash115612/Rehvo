'use client';

import React, { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import { FALLBACK_PROPERTY_IMAGE } from '@/lib/seo/types';
import { cn } from '@/lib/cn';

export interface RehvoImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallbackCategory?: 'property' | 'commercial' | 'room' | 'flatmate' | 'locality' | 'general' | string;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  property: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
  commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
  room: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
  flatmate: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  locality: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
};

export function RehvoImage({
  src,
  alt,
  fallbackSrc,
  fallbackCategory = 'general',
  className,
  ...props
}: RehvoImageProps) {
  const defaultFallback =
    fallbackSrc ||
    CATEGORY_FALLBACK_IMAGES[fallbackCategory] ||
    FALLBACK_PROPERTY_IMAGE;

  const isValidUrl =
    typeof src === 'string' &&
    src.trim().length > 0 &&
    (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('/'));

  const [imgSrc, setImgSrc] = useState<string>(
    isValidUrl ? (src as string) : defaultFallback
  );

  useEffect(() => {
    if (isValidUrl) {
      setImgSrc(src as string);
    } else {
      setImgSrc(defaultFallback);
    }
  }, [src, defaultFallback, isValidUrl]);

  const isExternal =
    typeof imgSrc === 'string' &&
    (imgSrc.startsWith('http://') || imgSrc.startsWith('https://'));

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'REHVO Property'}
      unoptimized={props.unoptimized !== undefined ? props.unoptimized : isExternal}
      className={cn('object-cover', className)}
      onError={() => {
        if (imgSrc !== defaultFallback) {
          setImgSrc(defaultFallback);
        }
      }}
    />
  );
}

export default RehvoImage;
