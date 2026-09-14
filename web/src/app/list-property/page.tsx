'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Coins,
  Send,
  Loader2,
  AlertCircle,
  LogIn,
  MapPin,
  Home,
} from 'lucide-react';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { trackSubmitListing } from '@/lib/analytics';

export default function ListPropertyPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [supabase] = useState(() => createClient());

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    locality: '',
    propertyType: 'flat',
    bedrooms: '2',
    expectedRent: '',
    address: '',
    furnishing: 'semi_furnished',
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.full_name || '',
        phone: prev.phone || profile.phone || '',
        locality: prev.locality || profile.locality || '',
      }));
    }
  }, [profile]);

  // Restore cached form data if returning from login
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('rehvo_pending_listing');
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormData((prev) => ({ ...prev, ...parsed }));
        sessionStorage.removeItem('rehvo_pending_listing');
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.locality.trim() || !formData.expectedRent) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const rent = Number(formData.expectedRent);
      const bedroomsCount = formData.bedrooms;
      const typeLabel = formData.propertyType === 'commercial' ? 'Commercial Space' : 'Apartment';
      const title = `${bedroomsCount} BHK ${typeLabel} in ${formData.locality.trim()}`;
      const description = `Verified listing posted on REHVO. Contact owner: ${formData.fullName.trim()} (${formData.phone.trim()}). Located in ${formData.locality.trim()}, Mumbai.`;

      const { data, error } = await supabase
        .from('properties')
        .insert({
          owner_id: user?.id || null,
          type: formData.propertyType === 'commercial' ? 'flat' : (formData.propertyType || 'flat'),
          title,
          description,
          price: rent,
          deposit: rent * 2,
          maintenance: 0,
          brokerage: 0,
          city: 'Mumbai',
          state: 'Maharashtra',
          locality: formData.locality.trim(),
          address: formData.address.trim() || formData.locality.trim(),
          bedrooms: String(bedroomsCount),
          bathrooms: Number(bedroomsCount) > 2 ? 2 : 1,
          area: Number(bedroomsCount) * 450,
          furnishing: formData.furnishing as any,
          parking: 'Bike & Car',
          availability: 'Immediate',
          status: 'published',
          verification_status: 'unverified',
        })
        .select('id')
        .single();

      if (error) {
        console.error('[ListProperty] Supabase insert error:', error);
        setErrorMessage(error.message || 'Failed to submit property. Please try again.');
        return;
      }

      setCreatedPropertyId(data?.id || null);
      setSubmitted(true);

      trackSubmitListing({
        propertyId: data?.id,
        city: 'Mumbai',
        locality: formData.locality.trim(),
        bhk: String(bedroomsCount),
        rent: formData.expectedRent ? Number(formData.expectedRent) : undefined,
        listingType: 'rent',
        sourcePage: '/list-property',
        status: 'completed',
        propertyCategory: formData.propertyType,
      });

      await refreshUserData();
    } catch (err: any) {
      console.error('[ListProperty] Exception:', err);
      setErrorMessage('Network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'List Property', url: '/list-property' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-8 sm:my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider max-w-full truncate">
            <Building2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#0F766E] shrink-0" />
            <span className="truncate">FOR PROPERTY OWNERS &amp; LANDLORDS</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Rent your property faster. <br />
            With 100% verified marketplace.
          </h1>

          <p className="text-xs sm:text-base text-[#64748B] max-w-xl mx-auto font-medium">
            Connect directly with verified working professionals and families in Mumbai. Free physical verification, free photography, and transparent pricing.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">100% Transparent</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              No hidden broker fees or side commissions. You keep your full rental value.
            </p>
          </div>

          <div className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Verified Tenants Only</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              All tenants complete identity verification before scheduling doorstep walkthroughs.
            </p>
          </div>

          <div className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Free High-Res Photos</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Our Mumbai field agents visit your property for professional wide-angle photography.
            </p>
          </div>

          <div className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Digital Lease &amp; NOC</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Model Tenancy Act 2026 compliant rental agreements with biometric Aadhaar e-signing.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-white rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-12 border border-[#E2E8F0] shadow-card-hover mb-12 sm:mb-16 relative overflow-hidden">
          
          <div className="text-center space-y-1.5 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#031B2A]">List Your Property in 2 Minutes</h2>
            <p className="text-xs text-[#64748B]">
              Fill in basic details — your listing goes live instantly on REHVO.
            </p>
          </div>


          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#031B2A]">Property Listed Successfully!</h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Thank you, {formData.fullName || 'Landlord'}. Your property in{' '}
                  <span className="font-bold text-[#031B2A]">{formData.locality}</span> is now recorded in our database.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/profile"
                  className="h-11 px-6 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center gap-2 shadow-md transition"
                >
                  <span>View in My Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setCreatedPropertyId(null);
                    setFormData({
                      fullName: profile?.full_name || '',
                      phone: profile?.phone || '',
                      locality: '',
                      propertyType: 'flat',
                      bedrooms: '2',
                      expectedRent: '',
                      address: '',
                      furnishing: 'semi_furnished',
                    });
                  }}
                  className="h-11 px-6 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#031B2A] border border-[#E2E8F0] text-xs font-bold transition cursor-pointer"
                >
                  List Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 98200 12345"
                    className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none cursor-pointer"
                  >
                    <option value="flat">Apartment / Flat</option>
                    <option value="pg">PG / Co-Living</option>
                    <option value="commercial">Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    BHK Config
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none cursor-pointer"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Expected Rent (₹/mo) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.expectedRent}
                    onChange={(e) => setFormData({ ...formData, expectedRent: e.target.value })}
                    placeholder="e.g. 45000"
                    className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                  Locality / Neighborhood *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Bandra West, Pali Hill or Powai"
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                  Building Name &amp; Full Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Flat 402, Raheja Towers, Hill Road"
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isAuthenticated ? 'Publish Property Listing' : 'Continue & Submit Property'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#64748B] pt-2">
                By submitting, you agree to REHVO&apos;s Verified Marketplace Policy. Direct owner and verified broker listings with transparent pricing.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
