import React from 'react';
import Link from 'next/link';
import { MapPin, Building2, Users, Home, Sparkles, ArrowRight } from 'lucide-react';
import { LOCALITIES_DATA, CITIES_DATA } from '@/lib/seo/localityData';

interface InternalLinksGridProps {
  currentCity?: string;
  currentLocality?: string;
}

export function InternalLinksGrid({
  currentCity = 'mumbai',
  currentLocality,
}: InternalLinksGridProps) {
  const localities = Object.values(LOCALITIES_DATA);
  const cities = Object.values(CITIES_DATA);

  return (
    <section className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-12 rounded-3xl shadow-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0E8F73]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-[#031B2A]">
              Explore Verified Properties Across India
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified direct-owner flats, shared flatmates, PGs, and commercial real estate with zero brokerage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Top Mumbai Localities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#0E8F73]" />
              <span>Popular Mumbai Localities</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              {localities.slice(0, 8).map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/mumbai/${loc.slug}`}
                    className={`transition hover:text-[#0E8F73] flex items-center justify-between py-0.5 ${
                      currentLocality === loc.slug
                        ? 'font-bold text-[#0E8F73]'
                        : 'text-slate-600'
                    }`}
                  >
                    <span>Flats in {loc.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">from ₹{(loc.avgRent1BHK / 1000).toFixed(0)}k</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Popular Searches by BHK */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" />
              <span>Rental Categories in Mumbai</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/rent/2-bhk-for-rent-in-mumbai" className="hover:text-[#0E8F73] transition block py-0.5">
                  2 BHK Flats for Rent in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/rent/1-bhk-for-rent-in-mumbai" className="hover:text-[#0E8F73] transition block py-0.5">
                  1 BHK Flats for Rent in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/rent/3-bhk-in-bandra" className="hover:text-[#0E8F73] transition block py-0.5">
                  3 BHK Luxury Apartments in Bandra
                </Link>
              </li>
              <li>
                <Link href="/flatmates" className="hover:text-[#0E8F73] transition block py-0.5">
                  Verified Flatmates & Roommates Mumbai
                </Link>
              </li>
              <li>
                <Link href="/pg" className="hover:text-[#0E8F73] transition block py-0.5">
                  Co-Living & PGs near Andheri West
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-[#0E8F73] transition block py-0.5">
                  Furnished Offices & Retail in BKC
                </Link>
              </li>
              <li>
                <Link href="/zero-brokerage" className="hover:text-[#0E8F73] transition block py-0.5">
                  Zero Brokerage Homes Mumbai
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Major Indian Metros */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Home size={14} className="text-purple-600" />
              <span>Top Cities in India</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className={`transition hover:text-[#0E8F73] flex items-center justify-between py-0.5 ${
                      currentCity === city.slug ? 'font-bold text-[#0E8F73]' : ''
                    }`}
                  >
                    <span>Rental Properties in {city.name}</span>
                    <span className="text-[10px] text-slate-400">{city.state}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: REHVO Ecosystem & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Guides & Concierge</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/blog" className="hover:text-[#0E8F73] transition block py-0.5">
                  Mumbai Real Estate & Rental Guides
                </Link>
              </li>
              <li>
                <Link href="/showreels" className="hover:text-[#0E8F73] transition block py-0.5">
                  Video Walkthroughs & ShowReels
                </Link>
              </li>
              <li>
                <Link href="/society-services" className="hover:text-[#0E8F73] transition block py-0.5">
                  Smart Gate Passes & Society Management
                </Link>
              </li>
              <li>
                <Link href="/ai-concierge" className="hover:text-[#0E8F73] transition block py-0.5">
                  AI Property Concierge Search
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-[#0E8F73] transition block py-0.5">
                  Verified Ownership Deeds Guarantee
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[#0E8F73] transition block py-0.5 font-bold text-[#0E8F73]">
                  Download REHVO iOS & Android App →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
