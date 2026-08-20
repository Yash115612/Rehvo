import React from 'react';
import Link from 'next/link';
import { Globe, Facebook, Youtube, Twitter } from 'lucide-react';

export const RehvoFooter: React.FC = () => {
  return (
    <footer className="bg-white text-stone-700 border-t border-stone-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column (4 Cols on Desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5533] to-[#FF7744] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 leading-none">
                  REHVO
                </span>
                <span className="text-[8px] font-bold text-[#FF5533] tracking-widest uppercase mt-0.5">
                  Rent. Live. Belong.
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              India&apos;s trusted rental marketplace for flats, rooms, PGs and flatmates.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-stone-400">
              <a href="#" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#FF5533] flex items-center justify-center transition" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#FF5533] flex items-center justify-center transition" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#FF5533] flex items-center justify-center transition" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#FF5533] flex items-center justify-center transition" aria-label="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: EXPLORE */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/mumbai" className="hover:text-[#FF5533] transition">
                  Flats
                </Link>
              </li>
              <li>
                <Link href="/rooms/mumbai" className="hover:text-[#FF5533] transition">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/pg/mumbai" className="hover:text-[#FF5533] transition">
                  PGs
                </Link>
              </li>
              <li>
                <Link href="/studios/mumbai" className="hover:text-[#FF5533] transition">
                  Studios
                </Link>
              </li>
              <li>
                <Link href="/localities" className="hover:text-[#FF5533] transition">
                  Localities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: FOR RENTERS */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider">
              FOR RENTERS
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/search" className="hover:text-[#FF5533] transition">
                  Search Homes
                </Link>
              </li>
              <li>
                <Link href="/flatmates/mumbai" className="hover:text-[#FF5533] transition">
                  Flatmates
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-[#FF5533] transition">
                  Saved
                </Link>
              </li>
              <li>
                <Link href="/enquiries" className="hover:text-[#FF5533] transition">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5533] transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: FOR HOSTS */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider">
              FOR HOSTS
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/owner/properties/new" className="hover:text-[#FF5533] transition">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-[#FF5533] transition">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link href="/owner/properties" className="hover:text-[#FF5533] transition">
                  Manage Properties
                </Link>
              </li>
              <li>
                <Link href="/owner/enquiries" className="hover:text-[#FF5533] transition">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5533] transition">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY & LEGAL */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/about" className="hover:text-[#FF5533] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5533] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5533] transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5533] transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-stone-400 hover:text-stone-700 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 text-center text-xs text-stone-400">
          <p>© {new Date().getFullYear()} REHVO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
