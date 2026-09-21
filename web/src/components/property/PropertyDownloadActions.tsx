'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, MessageSquare, ShieldCheck, Smartphone, QrCode, ArrowRight } from 'lucide-react';
import { AppDownloadModal } from '@/components/public/AppDownloadModal';

interface PropertyDownloadActionsProps {
  propertyTitle: string;
  formattedPrice: string;
}

export const PropertyDownloadActions: React.FC<PropertyDownloadActionsProps> = ({
  propertyTitle,
  formattedPrice,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'rent' | 'chat'>('rent');

  const handleOpenRent = () => {
    setModalMode('rent');
    setModalOpen(true);
  };

  const handleOpenChat = () => {
    setModalMode('chat');
    setModalOpen(true);
  };

  return (
    <>
      <div className="pt-2 space-y-2.5">
        {/* Primary Action Button: Rent on REHVO App */}
        <button
          type="button"
          onClick={handleOpenRent}
          className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Rent &bull; Book Free Physical Visit</span>
        </button>

        {/* Secondary Action Button: Direct Chat with Landlord */}
        <button
          type="button"
          onClick={handleOpenChat}
          className="w-full h-12 rounded-full bg-[#CCFBF1] hover:bg-[#99F6E4] text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[#0F766E]" />
          <span>Direct Chat with Landlord (App Only)</span>
        </button>

        {/* Quick App Store Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleOpenRent}
            className="text-[11px] text-[#0F766E] hover:underline inline-flex items-center gap-1 font-bold cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Scan QR or Download REHVO App &rarr;</span>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] font-bold text-[#64748B] uppercase">Monthly Rent</div>
          <div className="text-lg font-black text-[#031B2A] tracking-tight">{formattedPrice}</div>
        </div>
        <button
          type="button"
          onClick={handleOpenRent}
          className="flex-1 max-w-[200px] h-11 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition active:scale-98 cursor-pointer"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Rent on App</span>
        </button>
      </div>

      {/* App Download Modal */}
      <AppDownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalMode === 'rent'
            ? 'Rent on the REHVO App'
            : 'Chat with Landlord on App'
        }
        subtitle={
          modalMode === 'rent'
            ? 'To schedule a physical walkthrough, verify gate passes, and rent with verified listing, open or install the REHVO mobile app.'
            : 'Talk straight with verified homeowners without middlemen or intrusive third-party calls exclusively in the REHVO app.'
        }
        propertyTitle={propertyTitle}
      />
    </>
  );
};
