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
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];
  const schema = generateBreadcrumbSchema(fullItems);

  return (
    <>
      {/* Schema.org BreadcrumbList for Search Engine Indexers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-semibold text-slate-500 overflow-x-auto py-2.5 ${className}`}
      >
        <ol className="flex items-center space-x-1.5 whitespace-nowrap">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.url} className="flex items-center space-x-1.5">
                {index > 0 && <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-[#031B2A] font-bold truncate max-w-[200px] sm:max-w-xs"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#0E8F73] transition flex items-center gap-1 text-slate-600"
                  >
                    {index === 0 && <Home size={12} className="shrink-0" />}
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
