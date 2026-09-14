'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  Camera,
  Video,
  Check,
  Save,
  ShieldCheck,
  Flame,
  Star,
} from 'lucide-react';
import { AdminPropertyRecord } from '@/lib/supabase/admin-service';

interface PropertyEditorModalProps {
  property: AdminPropertyRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<AdminPropertyRecord>) => void;
}

const AMENITIES_LIST = [
  'Gated Security',
  'Lift',
  'Gym & Fitness',
  'Covered Car Parking',
  'Swimming Pool',
  'Power Backup',
  'Clubhouse',
  'High-Speed Wi-Fi',
  'Modular Kitchen',
  'Pet Friendly',
];

export function PropertyEditorModal({
  property,
  isOpen,
  onClose,
  onSave,
}: PropertyEditorModalProps) {
  const [title, setTitle] = useState(property?.title || '');
  const [category, setCategory] = useState(property?.category || 'RESIDENTIAL');
  const [type, setType] = useState(property?.type || 'FLAT');
  const [location, setLocation] = useState(property?.location || '');
  const [city, setCity] = useState(property?.city || 'Mumbai');
  const [rent, setRent] = useState(property?.rent || 0);
  const [deposit, setDeposit] = useState(property?.rent ? property.rent * 2 : 0);
  const [brokerage, setBrokerage] = useState(0);
  const [area, setArea] = useState(property?.area || 850);
  const [bedrooms, setBedrooms] = useState('2 BHK');
  const [furnishing, setFurnishing] = useState('Fully Furnished');
  const [availability, setAvailability] = useState('Immediate');
  const [description, setDescription] = useState(
    'Prime verified rental home with natural lighting, sea breeze and zero brokerage verification.'
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Gated Security',
    'Lift',
    'Covered Car Parking',
    'Power Backup',
  ]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [showreelUrl, setShowreelUrl] = useState('');

  if (!isOpen || !property) return null;

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      type,
      location,
      rent,
      area,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E8F73] text-white flex items-center justify-center shadow-xs">
              <Building2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Property Listing</h3>
              <p className="text-[11px] text-slate-500 font-mono">ID: {property.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Banners */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                isFeatured
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star size={16} className={isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
                <span className="text-xs font-bold">Featured on Homepage</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase">{isFeatured ? 'Active' : 'Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBoosted(!isBoosted)}
              className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                isBoosted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame size={16} className={isBoosted ? 'fill-rose-400 text-rose-400' : ''} />
                <span className="text-xs font-bold">Search Ranking Boost (2x)</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase">{isBoosted ? 'Active' : 'Off'}</span>
            </button>
          </div>

          {/* Title & Category */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Listing Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#16161A] px-3.5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Pricing & Financials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                required
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Brokerage (₹ / Zero)
              </label>
              <input
                type="number"
                value={brokerage}
                onChange={(e) => setBrokerage(Number(e.target.value))}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Location & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Micro-Locality
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Bedrooms / Configuration
              </label>
              <input
                type="text"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Area (Carpet sq.ft)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* ShowReel Linkage */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Video size={15} className="text-[#10B981]" />
              <span>Link ShowReel Video URL (MP4 / CDN)</span>
            </div>
            <input
              type="url"
              value={showreelUrl}
              onChange={(e) => setShowreelUrl(e.target.value)}
              placeholder="/videos/apartment-tour.mp4"
              className="w-full bg-[#16161A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Amenities Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Amenities & Facilities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((am) => {
                const selected = selectedAmenities.includes(am);
                return (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenity(am)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition ${
                      selected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-[#0E8F73]/20 dark:border-[#10B981]/50 dark:text-[#10B981]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <span>{am}</span>
                    {selected && <Check size={13} className="text-[#0E8F73] dark:text-[#10B981]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Match Score preview */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-[#10B981]/10 dark:border-[#10B981]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#0E8F73] dark:text-[#10B981] font-bold">
              <Sparkles size={16} />
              <span>AI VibeMatch Compatibility Score</span>
            </div>
            <span className="text-sm font-black text-white bg-[#0E8F73] px-2.5 py-0.5 rounded-lg shadow-xs">
              98 / 100 (High Tenant Demand)
            </span>
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-extrabold text-white flex items-center gap-2 shadow-glow transition cursor-pointer"
            >
              <Save size={14} />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
