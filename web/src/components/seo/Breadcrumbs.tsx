import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark';
}

export function Breadcrumbs({ items, className = '', variant = 'light' }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];
  const schema = generateBreadcrumbSchema(fullItems);
  const isDark = variant === 'dark';

  return (
    <>
      {/* Schema.org BreadcrumbList for Search Engine Indexers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-semibold overflow-x-auto py-1.5 ${
          isDark ? 'text-white/70' : 'text-slate-500'
        } ${className}`}
      >
        <ol className="flex items-center space-x-1.5 whitespace-nowrap">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.url} className="flex items-center space-x-1.5">
                {index > 0 && (
                  <ChevronRight
                    size={12}
                    className={`shrink-0 ${isDark ? 'text-white/40' : 'text-slate-400'}`}
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={`font-bold truncate max-w-[200px] sm:max-w-xs ${
                      isDark ? 'text-white' : 'text-[#031B2A]'
                    }`}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className={`transition flex items-center gap-1 ${
                      isDark
                        ? 'text-white/75 hover:text-white'
                        : 'text-slate-600 hover:text-[#0E8F73]'
                    }`}
                  >
                    {index === 0 && (
                      <Home
                        size={12}
                        className={`shrink-0 ${isDark ? 'text-white/70' : 'text-slate-500'}`}
                      />
                    )}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
