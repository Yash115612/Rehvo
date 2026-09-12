import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Smartphone,
  QrCode,
  Star,
  ShieldCheck,
  Zap,
  Bell,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Apple,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Download REHVO App | iOS & Android | Mumbai Verified Marketplace',
  description:
    'Experience the complete REHVO platform on iOS and Android. Unlock instant chat with owner or broker, AI rental concierge, scheduled visit tracking, and R-Cash rewards.',
  canonicalUrl: 'https://rehvo.in/download',
});

const APP_FEATURES = [
  {
    icon: Zap,
    title: 'Instant New Listing Alerts',
    desc: 'Be the first to know when a verified rental home in your preferred building or street goes live.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Encrypted Owner Chat',
    desc: 'Talk straight with homeowners and prospective flatmates without brokers or intrusive third-party calls.',
  },
  {
    icon: ShieldCheck,
    title: 'Live Walkthrough GPS Passes',
    desc: 'Society security visitor passes auto-generated in-app so you walk into any gated community without delays.',
  },
  {
    icon: Wallet,
    title: 'R-Cash & Scratch Cards',
    desc: 'Earn instant cash rewards on every rent payment, society maintenance transaction, and flatmate referral.',
  },
];

const COMPARISON_ITEMS = [
  { feature: 'Search Verified Properties', web: true, app: true },
  { feature: 'Explore AI Rental Insights', web: true, app: true },
  { feature: 'Society & Home Services Booking', web: true, app: true },
  { feature: 'Real-time Owner Direct Chat', web: false, app: true },
  { feature: 'Instant Gate Pass & QR Security Access', web: false, app: true },
  { feature: 'R-Cash Scratch Card Rewards & Wallet', web: false, app: true },
  { feature: 'Push Notifications for Price Drops', web: false, app: true },
  { feature: 'Biometric FaceID Login & Quick Escrow', web: false, app: true },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] via-[#043428] to-[#031B2A] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Copy & Store CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFBF1]/15 text-[#CCFBF1] text-xs font-bold uppercase tracking-wider border border-[#CCFBF1]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              The Full Experience in Your Pocket
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Rent Smart. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-mint">
                Transparent Pricing.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Download the REHVO mobile app for iOS and Android. Direct owner contact, AI neighborhood concierge, automated gate passes, and rental rewards in one luxury app.
            </p>

            {/* Ratings Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-sm text-white ml-1">4.9</span>
                <span className="text-xs text-emerald-200/70">(8.4k reviews)</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="text-xs text-emerald-200/90 font-medium">
                <span className="font-bold text-white">50,000+</span> Renters in Mumbai
              </div>
            </div>

            {/* Store Buttons & QR Code */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-stone-900 hover:bg-stone-100 font-bold px-7 py-3.5 rounded-2xl text-xs transition shadow-lg"
              >
                <Apple className="w-5 h-5 text-black" />
                <div className="text-left">
                  <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider leading-none">Download on the</div>
                  <div className="text-sm font-black leading-tight">App Store</div>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-2xl text-xs transition backdrop-blur-md border border-white/20 shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a2.008 2.008 0 0 1-.22-.387C3.136 21.17 3 20.312 3 19.333V4.667c0-.979.136-1.837.39-2.466.06-.145.134-.277.219-.387zm1.414-.526L16.2 7.74 14.793 11 5.023 1.288zm0 21.424L14.793 13 16.2 16.26 5.023 22.712zM17.6 15.34l3.197-1.846c1.196-.69 1.196-1.819 0-2.509L17.6 9.14 15.86 12.24 17.6 15.34z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-emerald-200/70 font-medium uppercase tracking-wider leading-none">Get it on</div>
                  <div className="text-sm font-black leading-tight">Google Play</div>
                </div>
              </a>
            </div>

            {/* Desktop QR Box */}
            <div className="hidden sm:inline-flex items-center gap-4 bg-white/5 border border-white/15 backdrop-blur-md rounded-2xl p-4 mt-4">
              <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-stone-900" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Scan with your camera</div>
                <div className="text-[11px] text-emerald-200/70 mt-0.5">
                  Instant install on iOS or Android directly from the store
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Precision Simulated Mobile Mockups */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-[300px] sm:w-[320px] bg-stone-900 rounded-[52px] p-3 shadow-2xl ring-1 ring-white/20 border-4 border-stone-800">
              {/* Dynamic Island */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-800 ml-auto mr-2" />
              </div>

              {/* Screen Content */}
              <div className="w-full h-[620px] bg-gradient-to-b from-[#F8FAFC] to-white rounded-[44px] overflow-hidden flex flex-col pt-10 px-4 text-stone-900 relative">
                {/* Simulated App Header */}
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-black text-xs">
                      R
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Location</div>
                      <div className="text-xs font-bold text-stone-900">Bandra West, Mumbai</div>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#0F766E] flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Simulated AI Concierge Pill */}
                <div className="my-3 bg-gradient-to-r from-emerald-900 to-[#064E3B] rounded-2xl p-3 text-white shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#CCFBF1]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    REHVO AI Concierge
                  </div>
                  <div className="text-[11px] font-medium text-emerald-100 mt-1">
                    &ldquo;Find me a sea-facing 2 BHK in Bandra with verified marketplace&rdquo;
                  </div>
                </div>

                {/* Simulated Property Card */}
                <div className="bg-white rounded-2xl p-2.5 border border-stone-200 shadow-sm space-y-2">
                  <div className="relative h-28 w-full bg-stone-200 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                      alt="Luxury Apartment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#0F766E] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      VERIFIED LISTING
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ₹78,000/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Pali Hill Luxury Suite</div>
                    <div className="text-[10px] text-stone-500">2 BHK • Fully Furnished • Sea View</div>
                  </div>
                </div>

                {/* Simulated Floating Gate Pass */}
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                    <div>
                      <div className="text-[10px] font-bold text-stone-900">Visit Gate Pass #9284</div>
                      <div className="text-[9px] text-stone-500">Confirmed for Today, 5:30 PM</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">
                    Ready
                  </div>
                </div>

                {/* App Navigation Bar */}
                <div className="mt-auto -mx-4 bg-white border-t border-stone-100 py-3 px-6 flex items-center justify-between text-stone-400">
                  <div className="text-[#0F766E] flex flex-col items-center gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                    <span className="text-[9px] font-bold">Explore</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[9px]">Chat</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Wallet className="w-4 h-4" />
                    <span className="text-[9px]">Rewards</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[9px]">Passes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
            App Exclusives
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#031B2A] tracking-tight mt-3">
            Designed for Mumbai Urban Living
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2">
            Features built specifically for seamless apartment hunting, roommate harmony, and zero landlord-tenant friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {APP_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#031B2A]">{feature.title}</h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Web vs App Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <h3 className="text-2xl font-black text-[#031B2A] tracking-tight">
              Web Portal vs. Mobile App
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              While our website is optimized for quick discovery, real-time messaging and gate passes are native to the mobile app.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            <div className="grid grid-cols-12 py-3 text-xs font-bold text-[#031B2A] uppercase tracking-wider">
              <div className="col-span-8">Platform Capability</div>
              <div className="col-span-2 text-center text-[#64748B]">Website</div>
              <div className="col-span-2 text-center text-[#0F766E]">Mobile App</div>
            </div>

            {COMPARISON_ITEMS.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 py-4 items-center text-xs">
                <div className="col-span-8 font-semibold text-[#031B2A] flex items-center gap-2">
                  <span>{item.feature}</span>
                </div>
                <div className="col-span-2 text-center">
                  {item.web ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <span className="text-stone-300 font-bold">&mdash;</span>
                  )}
                </div>
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-[#0F766E] mx-auto">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <a
              href="#store-buttons"
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold px-7 py-3 rounded-full text-xs transition shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get the REHVO Mobile App</span>
            </a>
          </div>
        </div>
      </section>

      {/* Safety & Trust Note */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-stone-500 text-xs">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Requires iOS 15.0+ or Android 9.0+. 100% Free download with Verified Marketplace.</span>
        </div>
      </section>
    </div>
  );
}
