'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Send,
  Loader2,
  Lock,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOrCreatePropertyConversation } from '@/services/chat';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface PropertyOwnerSectionProps {
  property: PublicProperty;
  onOpenVisitModal: () => void;
  onOpenEnquiryModal: () => void;
}

export const PropertyOwnerSection: React.FC<PropertyOwnerSectionProps> = ({
  property,
  onOpenVisitModal,
  onOpenEnquiryModal,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const ownerName = property.owner?.full_name || 'Verified Owner';
  const ownerPhoto = property.owner?.profile_photo;
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

  const initials = ownerName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
          <UserCheck className="w-4 h-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
          Listed Directly by Owner
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-[20px] bg-[#F8FAFC]/80 border border-[#E2E8F0]">
        {/* Owner Profile Identity */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#031B2A] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm border-2 border-white">
            {ownerPhoto ? (
              <RehvoImage
                src={ownerPhoto}
                alt={ownerName}
                fill
                fallbackCategory="flatmate"
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <span>{initials}</span>
            )}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#3C8D68] rounded-full border-2 border-white flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-[#031B2A]">{ownerName}</h3>
              <span className="bg-[#3C8D68]/15 text-[#3C8D68] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5">
              Direct Property Owner • Verified Marketplace
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartChat}
            disabled={isStartingChat}
            className="btn-dark text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
          >
            {isStartingChat ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-[#0F766E]" />
            )}
            <span>Chat with Owner</span>
          </button>

          <button
            type="button"
            onClick={onOpenVisitModal}
            className="btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* Trust & Privacy Verification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#031B2A] p-3 rounded-xl bg-white border border-[#E2E8F0]">
          <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
          <span>Government ID & Deed Verified</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#031B2A] p-3 rounded-xl bg-white border border-[#E2E8F0]">
          <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
          <span>100% Verified Marketplace Policy</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#031B2A] p-3 rounded-xl bg-white border border-[#E2E8F0]">
          <Lock className="w-4 h-4 text-[#4263EB] flex-shrink-0" />
          <span>Encrypted In-App Chat & Tours</span>
        </div>
      </div>
    </div>
  );
};
