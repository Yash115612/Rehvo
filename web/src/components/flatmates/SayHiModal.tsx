'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Smartphone,
  QrCode,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface SayHiModalProps {
  flatmate: PublicFlatmate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SayHiModal: React.FC<SayHiModalProps> = ({ flatmate, isOpen, onClose }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !flatmate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#031B2A]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-stone-200/90 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#031B2A] cursor-pointer transition"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Flatmate Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#F1F5F9] border border-stone-200 shadow-xs shrink-0">
            <RehvoImage
              src={flatmate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
              alt={flatmate.name}
              fill
              fallbackCategory="flatmate"
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF5F0] text-[#3C8D68] text-[10.5px] font-black mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Flatmate</span>
            </div>
            <h3 className="text-lg font-black text-[#031B2A] truncate">{flatmate.name}</h3>
            <p className="text-xs text-[#64748B] font-semibold truncate">{flatmate.locality}, Mumbai</p>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] p-4 rounded-2xl text-white space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on the REHVO App</span>
          </div>
          <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
            To message {flatmate.name.split(' ')[0]} directly and find shared flats without middlemen, download the REHVO mobile app.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-xl p-1.5 border border-[#CBD5E1] shadow-xs flex items-center justify-center shrink-0">
            <QrCode className="w-full h-full text-[#031B2A]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-black text-[#0F766E] uppercase tracking-wider flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              <span>Scan with phone</span>
            </div>
            <div className="text-xs font-black text-[#031B2A]">
              Instant App Store Download
            </div>
            <p className="text-[11px] text-[#64748B] leading-tight">
              Open your camera to install on iPhone or Android.
            </p>
          </div>
        </div>

        {/* Store Links */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3 rounded-xl bg-[#031B2A] hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-bold transition shadow-sm active:scale-98"
          >
            <span className="text-[11px] font-black">App Store</span>
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3 rounded-xl bg-[#031B2A] hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-bold transition shadow-sm active:scale-98"
          >
            <span className="text-[11px] font-black">Google Play</span>
          </a>
        </div>

        {/* Go to download page */}
        <Link
          href="/download"
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#064E3B] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <span>Download REHVO App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
