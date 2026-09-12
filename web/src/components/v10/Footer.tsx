'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, MapPin, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
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
                  VERIFIED MARKETPLACE
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#CCFBF1]/80 leading-relaxed max-w-sm">
              Homes, commercial spaces, flatmates and stays brought together under one trusted marketplace. Connecting verified owners, brokers and renters.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-1 text-white">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition shadow-2xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition shadow-2xs"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0F766E] text-white flex items-center justify-center transition shadow-2xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-xs text-[#CCFBF1]/70 space-y-1.5 font-medium">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>Bandra Kurla Complex (BKC), Mumbai, Maharashtra</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>support@rehvo.in</span>
              </p>
            </div>
          </div>

          {/* Column 1: Features & Marketplace */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link href="/pg" className="hover:text-white transition">
                  PG &amp; Student Hostels
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-white transition">
                  Commercial &amp; Offices
                </Link>
              </li>
              <li>
                <Link href="/flatmates" className="hover:text-white transition">
                  Find Flatmates
                </Link>
              </li>
              <li>
                <Link href="/ai-concierge" className="hover:text-white transition">
                  AI Concierge
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Home Services
                </Link>
              </li>
              <li>
                <Link href="/society-services" className="hover:text-white transition">
                  Society Ecosystem
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-white transition">
                  List Property (Free)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Mumbai Localities */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Top Localities</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/search?locality=bandra-west" className="hover:text-white transition">
                  Bandra West
                </Link>
              </li>
              <li>
                <Link href="/search?locality=andheri-west" className="hover:text-white transition">
                  Andheri West
                </Link>
              </li>
              <li>
                <Link href="/search?locality=powai" className="hover:text-white transition">
                  Powai Hiranandani
                </Link>
              </li>
              <li>
                <Link href="/search?locality=worli" className="hover:text-white transition">
                  Worli & Lower Parel
                </Link>
              </li>
              <li>
                <Link href="/search?locality=thane" className="hover:text-white transition">
                  Thane West
                </Link>
              </li>
              <li>
                <Link href="/search?locality=juhu" className="hover:text-white transition">
                  Juhu & Vile Parle
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Careers */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About REHVO
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-white transition">
                  Download Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Legal */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Help & Legal</h4>
            <ul className="space-y-2 text-xs text-[#CCFBF1]/80 font-medium">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Rental Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-6 border-t border-[#0F766E]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#CCFBF1]/70 font-medium">
          <p>© 2026 REHVO Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <span className="text-[#34D399]">♥</span>
            <span>in Mumbai for India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
