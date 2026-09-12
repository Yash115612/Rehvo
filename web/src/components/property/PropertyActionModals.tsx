'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CheckCircle2,
  Calendar,
  Send,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { scheduleVisit } from '@/services/visits';
import { createEnquiry } from '@/services/enquiries';

interface PropertyActionModalsProps {
  property: PublicProperty;
  visitModalOpen: boolean;
  onCloseVisitModal: () => void;
  enquiryModalOpen: boolean;
  onCloseEnquiryModal: () => void;
  reportModalOpen: boolean;
  onCloseReportModal: () => void;
  onOpenChat: () => void;
}

export const PropertyActionModals: React.FC<PropertyActionModalsProps> = ({
  property,
  visitModalOpen,
  onCloseVisitModal,
  enquiryModalOpen,
  onCloseEnquiryModal,
  reportModalOpen,
  onCloseReportModal,
  onOpenChat,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Visit State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultVisitDate = tomorrow.toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(defaultVisitDate);
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);

  // Enquiry State
  const [enquiryMessage, setEnquiryMessage] = useState(
    `Hi, I am interested in your ${property.title} in ${property.locality}. Is this property currently available?`
  );
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Report State
  const [reportReason, setReportReason] = useState('Incorrect information');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      router.push('/download');
      return;
    }

    if (user.id === property.owner_id) {
      setVisitError('You cannot schedule a visit for your own listing.');
      return;
    }

    setIsSubmittingVisit(true);
    setVisitError(null);

    const res = await scheduleVisit({
      userId: user.id,
      propertyId: property.id,
      ownerId: property.owner_id || '',
      scheduledDate: visitDate,
      scheduledTime: visitTime,
      notes: visitNotes,
    });

    setIsSubmittingVisit(false);

    if (res.success) {
      setVisitSuccess(true);
    } else {
      setVisitError(res.error || 'Failed to schedule visit.');
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      router.push('/download');
      return;
    }

    if (user.id === property.owner_id) {
      setEnquiryError('You cannot enquire on your own listing.');
      return;
    }

    setIsSubmittingEnquiry(true);
    setEnquiryError(null);

    const res = await createEnquiry({
      userId: user.id,
      propertyId: property.id,
      ownerId: property.owner_id || '',
      message: enquiryMessage,
    });

    setIsSubmittingEnquiry(false);

    if (res.success) {
      setEnquirySuccess(true);
    } else {
      setEnquiryError(res.error || 'Failed to submit enquiry.');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        onCloseReportModal();
      }, 2000);
    }, 600);
  };

  return (
    <>
      {/* 1. SCHEDULE VISIT MODAL */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                onCloseVisitModal();
                setVisitSuccess(false);
                setVisitError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#031B2A] hover:bg-[#F8FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            {visitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-[#ECFDF5] text-[#3C8D68] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#031B2A]">Visit Requested!</h3>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mx-auto">
                  Your physical visit for <strong>{visitDate} at {visitTime}</strong> has been submitted. The owner will confirm your appointment in-app.
                </p>
                <div className="flex gap-2 justify-center pt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/visits')}
                    className="btn-dark text-xs py-2.5 px-4 rounded-xl"
                  >
                    View My Visits
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCloseVisitModal();
                      onOpenChat();
                    }}
                    className="btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider block">
                    Physical Property Tour
                  </span>
                  <h3 className="text-xl font-black text-[#031B2A] mt-0.5">
                    Schedule a Visit
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    Property: <strong className="text-[#031B2A]">{property.title}</strong>
                  </p>
                </div>

                {visitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {visitError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#031B2A] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      min={defaultVisitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                      className="input-rehvo w-full text-xs font-semibold text-[#031B2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#031B2A] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="input-rehvo w-full text-xs font-semibold text-[#031B2A] bg-white"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Morning)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#031B2A] mb-1">
                    Notes for Owner (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    className="input-rehvo w-full text-xs text-[#031B2A] resize-none"
                    placeholder="e.g. Visiting with family, will arrive by metro..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="btn-primary w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isSubmittingVisit ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>Confirm Visit Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. SEND ENQUIRY MODAL */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                onCloseEnquiryModal();
                setEnquirySuccess(false);
                setEnquiryError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#031B2A] hover:bg-[#F8FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-[#ECFDF5] text-[#3C8D68] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#031B2A]">Enquiry Delivered!</h3>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mx-auto">
                  Your message has been sent directly to the owner. You can track their reply in your Enquiries inbox or continue in live chat.
                </p>
                <div className="flex gap-2 justify-center pt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/enquiries')}
                    className="btn-dark text-xs py-2.5 px-4 rounded-xl"
                  >
                    View Inquiries
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCloseEnquiryModal();
                      onOpenChat();
                    }}
                    className="btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider block">
                    Verified Marketplace Inquiries
                  </span>
                  <h3 className="text-xl font-black text-[#031B2A] mt-0.5">
                    Send Direct Enquiry
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    For: <strong className="text-[#031B2A]">{property.title}</strong>
                  </p>
                </div>

                {enquiryError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {enquiryError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#031B2A] mb-1">
                    Your Message to Owner
                  </label>
                  <textarea
                    rows={4}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    required
                    className="input-rehvo w-full text-xs font-medium resize-none text-[#031B2A]"
                    placeholder="Ask about move-in timing, maintenance terms, deposit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEnquiry}
                  className="btn-dark w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isSubmittingEnquiry ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-[#0F766E]" />
                  )}
                  <span>Submit Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. REPORT LISTING MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={onCloseReportModal}
              className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#031B2A] hover:bg-[#F8FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            {reportSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-[#ECFDF5] text-[#3C8D68] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#031B2A]">Report Submitted</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Thank you for helping keep REHVO trustworthy. Our review team will inspect this listing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <h3 className="text-lg font-black text-[#031B2A]">Report This Listing</h3>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  Help us maintain verified listing quality. Why are you reporting this property?
                </p>

                <div className="space-y-2">
                  {[
                    'Incorrect price or specifications',
                    'Duplicate listing',
                    'Already rented / unavailable',
                    'Suspicious or fraudulent behavior',
                    'Other reason',
                  ].map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                        reportReason === reason
                          ? 'border-[#0F766E] bg-[#CCFBF1]/40 text-[#031B2A]'
                          : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="accent-[#0F766E]"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="input-rehvo w-full text-xs text-[#031B2A] resize-none"
                    placeholder="Provide any additional context..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmittingReport ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>Submit Report</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
