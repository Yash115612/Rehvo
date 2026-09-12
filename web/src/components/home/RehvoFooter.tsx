import React from 'react';
import Link from 'next/link';
import { Globe, Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Heart } from 'lucide-react';

export const RehvoFooter: React.FC = () => {
  return (
    <footer className="bg-[#064E3B] text-white border-t border-[#0F766E]/40">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column (4 Cols on Desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-black text-base shadow-xs">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white leading-none">
                  REHVO
                </span>
                <span className="text-[8px] font-bold text-[#CCFBF1] tracking-widest uppercase mt-0.5">
                  VERIFIED LISTING
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#CCFBF1]/80 leading-relaxed max-w-sm">
              Homes, commercial spaces, stays and people brought together under one trusted marketplace.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-1 text-white">
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition"
                aria-label="Twitter / X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/rent" className="hover:text-white transition">
                  Rent Homes
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-white transition">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/pg-rooms" className="hover:text-white transition">
                  PG & Rooms
                </Link>
              </li>
              <li>
                <Link href="/flatmates" className="hover:text-white transition">
                  Flatmates
                </Link>
              </li>
              <li>
                <Link href="/localities" className="hover:text-white transition">
                  Localities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#how-it-works" className="hover:text-white transition">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get the App */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Get the App</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition shadow-2xs"
              >
                <div className="text-[8px] font-bold text-[#CCFBF1]/70 uppercase leading-none">
                  Download on the
                </div>
                <div className="text-xs font-black leading-tight mt-0.5">App Store</div>
              </a>
              <a
                href="#"
                className="block p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition shadow-2xs"
              >
                <div className="text-[8px] font-bold text-[#CCFBF1]/70 uppercase leading-none">
                  GET IT ON
                </div>
                <div className="text-xs font-black leading-tight mt-0.5">Google Play</div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Made with Love */}
        <div className="mt-12 pt-6 border-t border-[#0F766E]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#CCFBF1]/70">
          <p>© 2026 REHVO. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-[#34D399]">♥</span>
            <span>in Mumbai</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
