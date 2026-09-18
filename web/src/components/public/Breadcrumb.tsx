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
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const fullItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];
  const schema = generateBreadcrumbSchema(fullItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-0">
      <ol className="flex items-center space-x-2 text-xs font-medium text-stone-500 overflow-x-auto whitespace-nowrap">
        <li>
          <Link
            href="/"
            className="flex items-center text-stone-400 hover:text-stone-700 transition"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.url} className="flex items-center space-x-2">
              <ChevronRight className="w-3 h-3 text-stone-400 flex-shrink-0" />
              {isLast ? (
                <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-[300px]">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-stone-500 hover:text-stone-800 transition"
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
