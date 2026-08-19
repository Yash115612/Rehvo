import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-extrabold text-base">
                R
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                REHVO<span className="text-purple-400">.</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Mumbai&apos;s zero-brokerage rental & flatmate marketplace. Connect directly with verified homeowners, schedule physical property tours, and save 100% on middleman broker fees.
            </p>
            <div className="text-xs text-stone-400 space-y-1 pt-2">
              <p>📍 Mumbai, Maharashtra, India</p>
              <p>✉️ support@rehvo.com</p>
            </div>
          </div>

          {/* Col 2: Explore Localities (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Localities
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/mumbai/andheri-west" className="hover:text-white transition">
                  Andheri West
                </Link>
              </li>
              <li>
                <Link href="/mumbai/bandra-west" className="hover:text-white transition">
                  Bandra West
                </Link>
              </li>
              <li>
                <Link href="/mumbai/powai" className="hover:text-white transition">
                  Powai
                </Link>
              </li>
              <li>
                <Link href="/mumbai/juhu" className="hover:text-white transition">
                  Juhu
                </Link>
              </li>
              <li>
                <Link href="/mumbai/goregaon-west" className="hover:text-white transition">
                  Goregaon West
                </Link>
              </li>
              <li>
                <Link href="/localities" className="text-purple-400 hover:text-purple-300 font-bold transition">
                  All 20 Localities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Renters (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Renters
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/mumbai" className="hover:text-white transition">
                  Mumbai Rentals
                </Link>
              </li>
              <li>
                <Link href="/flatmates/mumbai" className="hover:text-white transition">
                  Find Flatmates
                </Link>
              </li>
              <li>
                <Link href="/pg/mumbai" className="hover:text-white transition">
                  PG & Co-Living
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition">
                  Saved Homes
                </Link>
              </li>
              <li>
                <Link href="/compare/andheri-west-vs-bandra-west" className="hover:text-white transition">
                  Compare Localities
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Hosts (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Hosts
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/list-property" className="hover:text-white transition">
                  List a Property (Free)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Zero Brokerage Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Host Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About REHVO
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Safety
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} REHVO Real Estate Technologies. 100% Zero-Brokerage Verified Rentals.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-stone-300 transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-stone-300 transition">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-stone-300 transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
