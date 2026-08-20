import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';

export const HostCTA: React.FC = () => {
  return (
    <section className="bg-white py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171522] rounded-3xl sm:rounded-[40px] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-stone-800">
          {/* Left Image Column */}
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80"
              alt="Modern exterior and living room for rent in Mumbai"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#171522]/90 hidden lg:block" />
          </div>

          {/* Right Copy Column */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider w-fit">
              For Property Owners
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Have a place to rent? <br />
              <span className="text-purple-400">List it on REHVO.</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
              Reach verified tenants looking for homes across Mumbai. Zero listing fees, direct renter inquiries, and intuitive on-site visit scheduling.
            </p>

            <div className="pt-2">
              <Link
                href="/owner/properties/new"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Property</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
