'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
    ? '/login?next=/owner/properties/new'
    : hasPublishedProperty
    ? '/owner'
    : '/owner/properties/new';

  const flatmateDestination = !isAuthenticated
    ? '/login?next=/flatmates/create'
    : hasFlatmateProfile
    ? '/flatmates/profile'
    : '/flatmates/create';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="group text-xs font-bold text-white bg-stone-900 hover:bg-black px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-98"
      >
        <PlusCircle className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-90 transition-transform duration-200" />
        <span>Start on REHVO</span>
        <ChevronDown
          className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
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
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
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

            {/* Option 1: Property Listing / Management */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handleOptionClick(propertyDestination)}
                className="w-full text-left p-3 rounded-2xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200/80 transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition flex-shrink-0 mt-0.5 shadow-sm">
                  {hasPublishedProperty ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <Home className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-purple-700 transition">
                      {hasPublishedProperty ? 'Manage Your Properties' : 'List Your Property'}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {hasPublishedProperty
                      ? 'View enquiries, visits & active listings'
                      : 'Rent out your property with 100% zero brokerage'}
                  </p>
                </div>
              </button>

              {/* Option 2: Flatmate Profile / Discovery */}
              <button
                type="button"
                onClick={() => handleOptionClick(flatmateDestination)}
                className="w-full text-left p-3 rounded-2xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200/80 transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex-shrink-0 mt-0.5 shadow-sm">
                  <Users className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-purple-700 transition">
                      {hasFlatmateProfile ? 'My Flatmate Profile' : 'Create Flatmate Profile'}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
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
