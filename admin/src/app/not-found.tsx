import React from 'react';
import Link from 'next/link';
import { Home, Search, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 font-extrabold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Listing or Page Not Found</h1>
        <p className="text-xs text-stone-600 mb-8 leading-relaxed">
          The property or page you are looking for may have been rented, unlisted, or moved. Explore our active zero-brokerage listings in Mumbai.
        </p>

        <div className="space-y-3">
          <Link
            href="/mumbai"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Browse Mumbai Rentals</span>
          </Link>

          <Link
            href="/"
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
