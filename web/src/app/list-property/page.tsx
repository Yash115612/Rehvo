'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Coins,
  Send,
} from 'lucide-react';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    locality: '',
    propertyType: 'flat',
    bedrooms: '2',
    expectedRent: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'List Property', url: '/list-property' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#0F766E]" />
            <span>FOR PROPERTY OWNERS & LANDLORDS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Rent your property faster. <br />
            With 100% verified marketplace.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto font-medium">
            Connect directly with verified working professionals and families in Mumbai. Free physical verification, free photography, and zero commission.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">100% Verified Marketplace</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              No upfront fees, no monthly cuts, and zero tenant sourcing commission. Keep 100% of your rental returns.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Free Walkthrough Verification</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Our field team conducts physical visits to photograph your flat, inspect title documents, and issue the Verified badge.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Pre-Screened Tenants</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every applicant passes corporate employment verification, Aadhaar KYC verification, and background checks.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Digital Lease & E-Sign</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Automated rental agreement drafts with government e-stamping and biometric doorstep registration.
            </p>
          </div>
        </div>

        {/* Quick Property Intake Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 sm:p-12 border border-[#E2E8F0] shadow-card-hover mb-16">
          <div className="text-center space-y-1.5 mb-8">
            <h2 className="text-2xl font-black text-[#031B2A]">List Your Property in 2 Minutes</h2>
            <p className="text-xs text-[#64748B]">Fill in basic details — our Mumbai operations team will confirm your listing within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#031B2A]">Property Submission Received!</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Thank you, {formData.fullName || 'Landlord'}. Our Mumbai verification coordinator will call you to arrange free photography and physical walkthrough.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#0F766E] hover:underline pt-2"
              >
                Submit another listing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Your Full Name
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
                    Phone Number (WhatsApp)
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
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none"
                  >
                    <option value="flat">Apartment / Flat</option>
                    <option value="villa">Independent Villa</option>
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
                    className="w-full h-11 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                    Expected Rent (₹/mo)
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
                  Locality & Building Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Bandra West, Pali Hill or Hiranandani Powai"
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Property for Free Verification</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-[#64748B] pt-2">
                By submitting, you agree to REHVO&apos;s Verified Marketplace Policy. No brokerage fee will be charged to you or your tenant.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
