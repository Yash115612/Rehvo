'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MessageSquare,
  Calendar,
  Send,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Flag,
  Check,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOrCreatePropertyConversation } from '@/services/chat';

interface PropertyStickyActionPanelProps {
  property: PublicProperty;
  onOpenVisitModal: () => void;
  onOpenEnquiryModal: () => void;
  onOpenReportModal: () => void;
}

export const PropertyStickyActionPanel: React.FC<PropertyStickyActionPanelProps> = ({
  property,
  onOpenVisitModal,
  onOpenEnquiryModal,
  onOpenReportModal,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isSaved, toggleSaveProperty } = useAuth();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const saved = isSaved(property.id);
  const formattedPrice = `₹${property.price.toLocaleString('en-IN')}`;
  const isOwnListing = user?.id === property.owner_id;

  const handleStartChat = async () => {
    if (!isAuthenticated || !user) {
      router.push('/download');
      return;
    }

    if (isOwnListing) {
      alert('This is your own listing.');
      return;
    }

    setIsStartingChat(true);
    const res = await getOrCreatePropertyConversation(property.id, user.id);
    setIsStartingChat(false);

    if (res.success && res.data) {
      router.push(`/chat/${res.data}`);
    } else {
      alert(res.error || 'Failed to start conversation.');
    }
  };

  const handleSave = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
      const isAlready = stored.includes(property.id);
      const nextStored = isAlready
        ? stored.filter((id: string) => id !== property.id)
        : [...stored, property.id];
      localStorage.setItem('rehvo_saved_properties', JSON.stringify(nextStored));
      window.dispatchEvent(new Event('rehvo_saved_updated'));
    } catch {}

    if (user) {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await toggleSaveProperty(property.id);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Verified Rental: ${property.title} in ${property.locality} for ₹${property.price.toLocaleString('en-IN')}/mo`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* DESKTOP STICKY SIDEBAR CARD */}
      <aside className="hidden lg:block w-full">
        <div className="sticky top-24 bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-md space-y-5">
          {/* Header Price & Trust Summary */}
          <div className="pb-4 border-b border-[#E2E8F0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                Direct Owner Price
              </span>
              <span className="bg-[#3C8D68]/15 text-[#3C8D68] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Listing
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-black text-[#031B2A] tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-xs text-[#64748B] font-semibold">/month</span>
            </div>

            {property.deposit > 0 && (
              <p className="text-xs text-[#64748B] font-medium">
                Deposit: ₹{property.deposit.toLocaleString('en-IN')} (100% Refundable)
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            {/* Schedule Physical Visit (Primary CTA) */}
            <button
              type="button"
              onClick={onOpenVisitModal}
              className="btn-primary w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Physical Visit</span>
            </button>

            {/* Chat with Owner */}
            <button
              type="button"
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="btn-dark w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition disabled:opacity-50"
            >
              {isStartingChat ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <MessageSquare className="w-4 h-4 text-[#0F766E]" />
              )}
              <span>Chat with Owner</span>
            </button>

            {/* Send Written Enquiry */}
            <button
              type="button"
              onClick={onOpenEnquiryModal}
              className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#031B2A] font-extrabold text-xs py-3 px-4 rounded-2xl border border-[#E2E8F0] transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Send className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Send Written Enquiry</span>
            </button>

            {/* Glass Save & Share row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`rehvo-glass-subtle py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  saved ? 'text-[#0F766E] border-[#0F766E]/40' : 'text-[#031B2A]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${saved ? 'fill-[#0F766E] text-[#0F766E]' : 'text-[#64748B]'}`}
                />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="rehvo-glass-subtle py-2.5 px-3 rounded-2xl border border-[#E2E8F0] text-[#031B2A] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-[#3C8D68]" />
                    <span className="text-[#3C8D68]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#64748B]" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantee Checklist */}
          <div className="text-xs text-[#64748B] space-y-2 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3C8D68] flex-shrink-0" />
              <span>Verified listing, transparent pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3C8D68] flex-shrink-0" />
              <span>Physical inspection confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3C8D68] flex-shrink-0" />
              <span>Direct owner scheduling</span>
            </div>
          </div>

          {/* Discreet Report Listing Link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="text-[11px] text-[#64748B] hover:text-[#031B2A] inline-flex items-center gap-1 transition"
            >
              <Flag className="w-3 h-3" />
              <span>Report this listing</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE FIXED BOTTOM ACTION BAR (Liquid-Glass Surface) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0] px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Price Preview & Save */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition active:scale-95 flex-shrink-0 ${
                saved
                  ? 'bg-rose-50 border-rose-200 text-[#0F766E]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#031B2A]'
              }`}
              aria-label={saved ? 'Unsave listing' : 'Save listing'}
            >
              <Heart
                className={`w-5 h-5 ${saved ? 'fill-[#0F766E] text-[#0F766E]' : 'text-[#64748B]'}`}
              />
            </button>

            <div>
              <span className="text-xs text-[#64748B] font-semibold block leading-none">
                Rent
              </span>
              <span className="text-lg font-black text-[#031B2A] tracking-tight">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="btn-dark py-3 px-3.5 rounded-2xl flex items-center justify-center font-bold text-xs"
              aria-label="Chat with owner"
            >
              {isStartingChat ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <MessageSquare className="w-4 h-4 text-[#0F766E]" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenVisitModal}
              className="btn-primary py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Visit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
