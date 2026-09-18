'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, CheckCircle2, MessageCircle, CalendarCheck, Sparkles } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface AuthLayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  backHref = '/',
  backLabel = 'Back to REHVO',
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Outer Centered Shell */}
      <div className="w-full max-w-6xl bg-[#FFFFFF] rounded-[28px] sm:rounded-[36px] border border-[#E2E8F0] shadow-[0_20px_50px_rgba(3, 27, 42,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand Visual Panel (5 Cols on Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#031B2A] text-white p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[640px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <RehvoImage
              src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&auto=format&fit=crop&q=85"
              alt="REHVO Mumbai Real Estate"
              fill
              priority
              className="object-cover opacity-60 scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A] via-[#031B2A]/60 to-[#031B2A]/40" />
          </div>

          {/* Top Brand Logo Capsule */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xs group"
            >
              <Image
                src="/rehvo-logo-white.png"
                alt="REHVO"
                width={84}
                height={28}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Middle Editorial Value Proposition */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Verified Marketplace Marketplace</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-[1.15] text-white">
              Find a place <br />
              that feels right.
            </h2>

            <p className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed max-w-sm">
              Homes, commercial spaces, PGs and flatmates — all in one trusted marketplace with direct connections.
            </p>

            {/* Reassurance Trust Pills */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span>100% Verified Marketplace on all agreements</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Physically verified listings & carpet area</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                <MessageCircle className="w-4 h-4 text-[#4263EB] shrink-0" />
                <span>Direct real-time chat with verified owners</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                <CalendarCheck className="w-4 h-4 text-[#D69E2E] shrink-0" />
                <span>Instant visit scheduling at your convenience</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Guarantee */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/60">
            <span>© {new Date().getFullYear()} REHVO</span>
            <span>Made with ♥ in Mumbai</span>
          </div>
        </div>

        {/* Right Side: Auth Card Container (7 Cols on Desktop) */}
        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative bg-[#FFFFFF]">
          {/* Top Back Navigation Control */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#031B2A] px-3 py-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </Link>

            {/* Mobile-only logo */}
            <div className="lg:hidden">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/rehvo-logo.png"
                  alt="REHVO"
                  width={72}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Inner Form Content */}
          <div className="w-full max-w-md mx-auto my-auto">{children}</div>

          {/* Bottom Trust Line */}
          <div className="pt-6 mt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-[11px] font-bold text-[#64748B] tracking-wide">
              Verified Listing • Verified Listings • Direct Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
