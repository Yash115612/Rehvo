'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  HelpCircle,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { Breadcrumb } from '@/components/public/Breadcrumb';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'renter_support',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instantaneous, reliable lead routing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Breadcrumb items={[{ name: 'Contact REHVO', url: '/contact' }]} />
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Direct Support & Inquiries
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            We&apos;re Here to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-mint">
              Help You
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Have questions about listing your apartment, booking a visit, or partnering with REHVO? Our Mumbai operations desk responds in hours.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Interactive Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[28px] p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-[#031B2A]">
                Direct Operations Channels
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email Inquiries</h3>
                    <a
                      href="mailto:support@rehvo.in"
                      className="text-sm font-bold text-[#0F766E] hover:underline"
                    >
                      support@rehvo.in
                    </a>
                    <div className="text-xs text-stone-500 mt-0.5">Responses within 2 to 4 business hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0F766E] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">WhatsApp Concierge</h3>
                    <a
                      href="https://wa.me/919820073486"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#0F766E] hover:underline"
                    >
                      +91 98200 73486 (REHVO)
                    </a>
                    <div className="text-xs text-stone-500 mt-0.5">Daily 9:00 AM &ndash; 8:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Owner & Title Verification</h3>
                    <a
                      href="mailto:verify@rehvo.in"
                      className="text-sm font-bold text-amber-800 hover:underline"
                    >
                      verify@rehvo.in
                    </a>
                    <div className="text-xs text-stone-500 mt-0.5">Free physical inspection bookings for owners</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Headquarters</h3>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
                      REHVO Technologies Private Limited
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                      Level 8, Platina Tower, Bandra Kurla Complex (BKC),<br />
                      Bandra East, Mumbai, Maharashtra 400051, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Center Pill */}
              <div className="pt-4 border-t border-stone-100">
                <Link
                  href="/help"
                  className="w-full inline-flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50 text-stone-900 hover:text-[#0F766E] transition border border-stone-200"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#0F766E]" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Frequently Asked Questions</div>
                      <div className="text-[11px] text-stone-500">Self-serve answers on visits, passes, and verified marketplace</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Intake Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-[#E2E8F0] shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#031B2A] tracking-tight">
                Send a Message
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Fill out the form below and our operations specialist will get in touch with you.
              </p>

              {isSubmitted ? (
                <div className="my-8 py-12 px-6 bg-emerald-50 rounded-2xl text-center border border-emerald-200 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0F766E] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-[#064E3B]">Message Received</h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-stone-900">{formData.name}</span>. Your ticket has been assigned to our Mumbai concierge desk. We will reach out via <span className="font-bold">{formData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', topic: 'renter_support', message: '' });
                    }}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] underline underline-offset-4"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@domain.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition"
                      >
                        <option value="renter_support">Renter & Visit Support</option>
                        <option value="owner_verification">Owner Free Property Listing & Verification</option>
                        <option value="flatmates">Flatmate Profile Inquiries</option>
                        <option value="society_services">Society / RWA Management Solutions</option>
                        <option value="partnerships">Partnerships & Press</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share details about your property, requirements, or question..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold px-8 py-3.5 rounded-full text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
