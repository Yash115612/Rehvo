'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Users, Building2, Shield, Menu, X, Smartphone } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-purple-700 transition">
              R
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              REHVO<span className="text-purple-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              href="/mumbai"
              className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              Mumbai Rentals
            </Link>
            <Link
              href="/localities"
              className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Localities
            </Link>
            <Link
              href="/flatmates/mumbai"
              className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              Flatmates
            </Link>
            <Link
              href="/pg/mumbai"
              className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              PG
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              Zero Brokerage
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/list-property"
              className="text-xs font-bold text-stone-700 hover:text-purple-600 px-3 py-2 transition"
            >
              List Property (Free)
            </Link>
            <Link
              href="https://rehvo.com/app"
              target="_blank"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Get App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/mumbai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
          >
            Mumbai Rentals
          </Link>
          <Link
            href="/flatmates/mumbai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
          >
            Flatmates
          </Link>
          <Link
            href="/pg/mumbai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
          >
            PG & Co-Living
          </Link>
          <Link
            href="/list-property"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
          >
            Post Free Property Listing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
          >
            Zero Brokerage Promise
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
          >
            Support & Safety
          </Link>
          <div className="pt-2">
            <Link
              href="https://rehvo.com/app"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-sm text-sm"
            >
              <Smartphone className="w-4 h-4" />
              Download REHVO App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
