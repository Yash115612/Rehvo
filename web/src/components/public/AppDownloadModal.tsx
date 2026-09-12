'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Smartphone,
  QrCode,
  ShieldCheck,
  MessageSquare,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

export interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  propertyTitle?: string;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  title = 'Rent on the REHVO App',
  subtitle = 'Direct owner chat, physical walkthrough passes, and verified listing leasing are exclusively available in the REHVO mobile app.',
  propertyTitle,
}) => {
  // Prevent body scroll when modal is open & listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#031B2A]/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl border border-stone-200/90 overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header Strip */}
        <div className="bg-gradient-to-r from-[#064E3B] via-[#0F766E] to-[#14B8A6] p-6 sm:p-7 text-white relative">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10.5px] font-black tracking-wider uppercase mb-2.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Verified Listing &bull; App Exclusive</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {title}
          </h2>

          {propertyTitle && (
            <p className="text-xs sm:text-sm font-bold text-emerald-100 mt-1 truncate">
              {propertyTitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* QR Code & Camera Scan Card */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* SVG QR Code Simulation */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl p-2.5 border border-[#CBD5E1] shadow-xs flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-[#031B2A]" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#0F766E] uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Scan with Phone Camera</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-[#031B2A]">
                Instant Download for iOS &amp; Android
              </h3>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Point your smartphone camera at this code to open REHVO directly in your App Store.
              </p>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Apple App Store */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-13 px-4 rounded-2xl bg-[#031B2A] hover:bg-black text-white flex items-center justify-center gap-3 transition shadow-sm active:scale-98"
            >
              <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.75 1 .08 2.05-.5 2.68-1.25z" />
              </svg>
              <div className="text-left">
                <div className="text-[9.5px] text-stone-300 uppercase tracking-wider leading-none">Download on the</div>
                <div className="text-xs sm:text-sm font-black leading-tight">App Store</div>
              </div>
            </a>

            {/* Google Play Store */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-13 px-4 rounded-2xl bg-[#031B2A] hover:bg-black text-white flex items-center justify-center gap-3 transition shadow-sm active:scale-98"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a2.008 2.008 0 0 1-.22-.387C3.136 21.17 3 20.312 3 19.333V4.667c0-.979.136-1.837.39-2.466.06-.145.134-.277.219-.387zm1.414-.526L16.2 7.74 14.793 11 5.023 1.288zm0 21.424L14.793 13 16.2 16.26 5.023 22.712zM17.6 15.34l3.197-1.846c1.196-.69 1.196-1.819 0-2.509L17.6 9.14 15.86 12.24 17.6 15.34z" />
              </svg>
              <div className="text-left">
                <div className="text-[9.5px] text-stone-300 uppercase tracking-wider leading-none">Get it on</div>
                <div className="text-xs sm:text-sm font-black leading-tight">Google Play</div>
              </div>
            </a>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#CCFBF1]/40 border border-[#CCFBF1] text-[#064E3B] font-bold">
              <MessageSquare className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>Direct Landlord Chat</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#CCFBF1]/40 border border-[#CCFBF1] text-[#064E3B] font-bold">
              <CalendarCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>Free Physical Visit Pass</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#CCFBF1]/40 border border-[#CCFBF1] text-[#064E3B] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>Verified Listing Escrow</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#CCFBF1]/40 border border-[#CCFBF1] text-[#064E3B] font-bold">
              <Zap className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>₹650 R-Cash Bonus</span>
            </div>
          </div>

          {/* Direct Download Page Link Button */}
          <Link
            href="/download"
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-[#0F766E] hover:bg-[#064E3B] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            <span>Learn More About the Mobile App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
