import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const PublicFooter: React.FC = () => {
  const localities = Object.entries(MUMBAI_LOCALITIES);

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="border-b border-stone-800 bg-stone-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Zero Brokerage</h4>
              <p className="text-xs text-stone-400">Direct connection with verified property owners.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Verified Listings & ID Checks</h4>
              <p className="text-xs text-stone-400">Inspected properties and government ID verified flatmates.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Direct Chat & Visits</h4>
              <p className="text-xs text-stone-400">Schedule real visits and chat instantly without middlemen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                REHVO<span className="text-purple-400">.</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed mb-6 max-w-sm">
              REHVO is Mumbai&apos;s leading zero-brokerage rental and roommate discovery platform. Connecting home seekers directly with verified property owners and compatible flatmates.
            </p>
            <div className="text-xs text-stone-400 space-y-1">
              <p>📍 Mumbai, Maharashtra, India</p>
              <p>✉️ support@rehvo.com</p>
            </div>
          </div>

          {/* Col 2: Popular Localities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Western Suburbs
            </h4>
            <ul className="space-y-2 text-xs">
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
                <Link href="/mumbai/juhu" className="hover:text-white transition">
                  Juhu
                </Link>
              </li>
              <li>
                <Link href="/mumbai/khar-west" className="hover:text-white transition">
                  Khar West
                </Link>
              </li>
              <li>
                <Link href="/mumbai/goregaon-west" className="hover:text-white transition">
                  Goregaon West
                </Link>
              </li>
              <li>
                <Link href="/mumbai/malad-west" className="hover:text-white transition">
                  Malad West
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Central & South Mumbai */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              South & Central
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mumbai/powai" className="hover:text-white transition">
                  Powai
                </Link>
              </li>
              <li>
                <Link href="/mumbai/worli" className="hover:text-white transition">
                  Worli
                </Link>
              </li>
              <li>
                <Link href="/mumbai/lower-parel" className="hover:text-white transition">
                  Lower Parel
                </Link>
              </li>
              <li>
                <Link href="/mumbai/dadar-west" className="hover:text-white transition">
                  Dadar West
                </Link>
              </li>
              <li>
                <Link href="/mumbai/chembur" className="hover:text-white transition">
                  Chembur
                </Link>
              </li>
              <li>
                <Link href="/mumbai/ghatkopar-east" className="hover:text-white transition">
                  Ghatkopar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/list-property" className="text-purple-400 hover:text-white font-semibold transition">
                  List Property (Free)
                </Link>
              </li>
              <li>
                <Link href="/mumbai" className="hover:text-white transition">
                  Flats in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/flatmates/mumbai" className="hover:text-white transition">
                  Flatmates in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/pg/mumbai" className="hover:text-white transition">
                  PG in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Zero Brokerage Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Locality Tags Grid for Rich SEO Crawling */}
        <div className="mt-10 pt-8 border-t border-stone-800">
          <p className="text-xs font-semibold text-stone-400 mb-3">Popular Searches in Mumbai:</p>
          <div className="flex flex-wrap gap-2 text-[11px] text-stone-400">
            {localities.slice(0, 16).map(([slug, info]) => (
              <Link
                key={slug}
                href={`/mumbai/${slug}`}
                className="bg-stone-800/60 hover:bg-stone-700/60 hover:text-stone-200 px-2.5 py-1 rounded-md transition"
              >
                Flats for rent in {info.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400">
          <p>© {new Date().getFullYear()} REHVO Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for Zero-Brokerage Verified Living in India.</p>
        </div>
      </div>
    </footer>
  );
};
