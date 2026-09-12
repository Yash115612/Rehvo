'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Home,
  Users,
  ChevronDown,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface HeaderUnifiedCTAProps {
  className?: string;
  isMobileDrawer?: boolean;
  onNavigate?: () => void;
}

export const HeaderUnifiedCTA: React.FC<HeaderUnifiedCTAProps> = ({
  className = '',
  isMobileDrawer = false,
  onNavigate,
}) => {
  const router = useRouter();
  const { isAuthenticated, hasPublishedProperty, hasFlatmateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOptionClick = (destination: string) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(destination);
  };

  // Destination URLs
  const propertyDestination = !isAuthenticated
    ? '/download'
    : hasPublishedProperty
    ? '/owner'
    : '/owner/properties/new';

  const flatmateDestination = !isAuthenticated
    ? '/download'
    : hasFlatmateProfile
    ? '/flatmates/profile'
    : '/download';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="group text-xs font-extrabold text-white bg-[#0F766E] hover:bg-[#064E3B] px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-teal-800/20 active:scale-98"
      >
        <span>Start on REHVO</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dropdown / Popover Dialog */}
      {isOpen && (
        <>
          {/* Backdrop blur for mobile drawer / desktop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`absolute right-0 mt-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isMobileDrawer
                ? 'left-0 right-auto w-full'
                : ''
            }`}
          >
            {/* Header section inside popover */}
            <div className="flex items-center justify-between px-2 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                  Start on REHVO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Options */}
            <div className="pt-2 space-y-2">
              {/* Option 1: Residential Property */}
              <button
                type="button"
                onClick={() =>
                  handleOptionClick(
                    hasPublishedProperty
                      ? '/owner'
                      : !isAuthenticated
                      ? '/download'
                      : '/owner/properties/new?category=residential'
                  )
                }
                className="w-full text-left p-3 rounded-2xl hover:bg-[#CCFBF1]/70 border border-transparent hover:border-[#99F6E4]/80 transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-[#CCFBF1] text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition flex-shrink-0 mt-0.5 shadow-sm">
                  {hasPublishedProperty ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <Home className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-[#0F766E] transition">
                      {hasPublishedProperty ? 'Manage Your Properties' : 'List Residential Property'}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {hasPublishedProperty
                      ? 'View enquiries, visits & active listings'
                      : 'Post flats, rooms, PGs, or studios for free'}
                  </p>
                </div>
              </button>

              {/* Option 2: Commercial Space */}
              <button
                type="button"
                onClick={() =>
                  handleOptionClick(
                    !isAuthenticated
                      ? '/download'
                      : '/owner/properties/new?category=commercial'
                  )
                }
                className="w-full text-left p-3 rounded-2xl hover:bg-[#CCFBF1]/70 border border-transparent hover:border-[#99F6E4]/80 transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-[#0F766E] group-hover:text-white transition flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-[#0F766E] transition">
                      List Commercial Space
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    Offices, retail shops, showrooms & warehouses
                  </p>
                </div>
              </button>

              {/* Option 3: Flatmate Profile */}
              <button
                type="button"
                onClick={() => handleOptionClick(flatmateDestination)}
                className="w-full text-left p-3 rounded-2xl hover:bg-[#CCFBF1]/70 border border-transparent hover:border-[#99F6E4]/80 transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition flex-shrink-0 mt-0.5 shadow-sm">
                  <Users className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-[#0F766E] transition">
                      {hasFlatmateProfile ? 'My Flatmate Profile' : 'Create Flatmate Profile'}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {hasFlatmateProfile
                      ? 'Manage roommate visibility & preferences'
                      : 'Connect with verified roommates in Mumbai'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
