import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark';
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '', variant = 'light' }) => {
  const fullItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];
  const schema = generateBreadcrumbSchema(fullItems);
  const isDark = variant === 'dark';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className={`py-2 px-4 sm:px-0 ${className}`}>
        <ol
          className={`flex items-center space-x-2 text-xs font-medium overflow-x-auto whitespace-nowrap ${
            isDark ? 'text-white/70' : 'text-stone-500'
          }`}
        >
          <li>
            <Link
              href="/"
              className={`flex items-center transition ${
                isDark ? 'text-white/70 hover:text-white' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.url} className="flex items-center space-x-2">
                <ChevronRight
                  className={`w-3 h-3 flex-shrink-0 ${isDark ? 'text-white/40' : 'text-stone-400'}`}
                />
                {isLast ? (
                  <span
                    className={`font-semibold truncate max-w-[200px] sm:max-w-[300px] ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className={`transition ${
                      isDark ? 'text-white/75 hover:text-white' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
