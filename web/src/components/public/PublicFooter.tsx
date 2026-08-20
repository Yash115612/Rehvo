import React from 'react';
import Link from 'next/link';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4 pr-0 lg:pr-6">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                R
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                REHVO<span className="text-purple-400">.</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              Mumbai&apos;s zero-brokerage rental & roommate marketplace. Connect directly with verified homeowners, schedule physical walkthroughs, and save 100% on broker commissions.
            </p>
            <div className="text-xs text-stone-400 space-y-1.5 pt-2">
              <p className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Mumbai, Maharashtra, India</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>✉️</span>
                <span>support@rehvo.com</span>
              </p>
            </div>
          </div>

          {/* EXPLORE (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/mumbai" className="hover:text-white transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/mumbai?type=flat" className="hover:text-white transition">
                  Flats
                </Link>
              </li>
              <li>
                <Link href="/rooms/mumbai" className="hover:text-white transition">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/pg/mumbai" className="hover:text-white transition">
                  PG & Co-Living
                </Link>
              </li>
              <li>
                <Link href="/flatmates/mumbai" className="hover:text-white transition">
                  Flatmates
                </Link>
              </li>
              <li>
                <Link href="/localities" className="text-purple-400 hover:text-purple-300 font-bold transition">
                  Locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* RENTERS (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Renters
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Search Homes
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition">
                  Saved
                </Link>
              </li>
              <li>
                <Link href="/enquiries" className="hover:text-white transition">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/visits" className="hover:text-white transition">
                  Visits
                </Link>
              </li>
            </ul>
          </div>

          {/* HOSTS (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Hosts
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/owner/properties/new" className="hover:text-white transition">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-white transition">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/owner/properties" className="hover:text-white transition">
                  Manage Properties
                </Link>
              </li>
              <li>
                <Link href="/owner/enquiries" className="hover:text-white transition">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/owner/visits" className="hover:text-white transition">
                  Visits
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY & LEGAL (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-stone-300 hover:text-white transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} REHVO Real Estate Technologies. 100% Zero-Brokerage Verified Rentals.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-stone-400 transition">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-stone-400 transition">
              Terms
            </Link>
            <Link href="/about" className="hover:text-stone-400 transition">
              Cookie Policy
            </Link>
            <Link href="/sitemap.xml" className="hover:text-stone-400 transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
