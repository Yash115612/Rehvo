'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MessageSquare,
  Calendar,
  Share2,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  Send,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createEnquiry } from '@/services/enquiries';
import { scheduleVisit } from '@/services/visits';
import { getOrCreatePropertyConversation } from '@/services/chat';

interface PropertyActionButtonsProps {
  property: {
    id: string;
    owner_id?: string;
    title: string;
    price: number;
    locality: string;
    city: string;
  };
}

export const PropertyActionButtons: React.FC<PropertyActionButtonsProps> = ({ property }) => {
  const router = useRouter();
  const { user, isAuthenticated, isSaved, toggleSaveProperty } = useAuth();

  // Modal States
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Enquiry Form State
  const [enquiryMessage, setEnquiryMessage] = useState(
    `Hi, I am interested in your ${property.title} in ${property.locality}. Is it currently available for rent?`
  );
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Visit Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(defaultDate);
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);

  // Chat Loading State
  const [isStartingChat, setIsStartingChat] = useState(false);

  const saved = isSaved(property.id);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=/property/${property.id}`);
      return;
    }
    await toggleSaveProperty(property.id);
  };

  const handleOpenChat = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?next=/property/${property.id}`);
      return;
    }

    if (user.id === property.owner_id) {
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

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      router.push(`/login?next=/property/${property.id}`);
      return;
    }

    if (user.id === property.owner_id) {
      setEnquiryError('You cannot enquire on your own property.');
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

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      router.push(`/login?next=/property/${property.id}`);
      return;
    }

    if (user.id === property.owner_id) {
      setVisitError('You cannot schedule a visit for your own property.');
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator
          .share({
            title: property.title,
            text: `Zero-Brokerage Rental in ${property.locality}: ${property.title} for ₹${property.price}/mo`,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    }
  };

  return (
    <>
      {/* Primary Sticky Booking & Actions Card */}
      <div className="space-y-3">
        {/* Schedule Visit (Primary CTA) */}
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              router.push(`/login?next=/property/${property.id}`);
              return;
            }
            setVisitModalOpen(true);
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Physical Visit</span>
        </button>

        {/* Chat with Owner */}
        <button
          type="button"
          onClick={handleOpenChat}
          disabled={isStartingChat}
          className="w-full bg-stone-900 hover:bg-black text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isStartingChat ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4 text-purple-400" />
          )}
          <span>Chat with Owner</span>
        </button>

        {/* Enquire Button */}
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              router.push(`/login?next=/property/${property.id}`);
              return;
            }
            setEnquiryModalOpen(true);
          }}
          className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-stone-500" />
          <span>Send Written Enquiry</span>
        </button>

        {/* Action Row: Save & Share */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={handleSaveToggle}
            className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>{shareSuccess ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setEnquiryModalOpen(false);
                setEnquirySuccess(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Enquiry Sent Successfully!</h3>
                <p className="text-xs text-stone-600">
                  Your enquiry has been delivered directly to the property owner. You can track their response in your Enquiries inbox or open the live chat thread.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/enquiries')}
                    className="bg-stone-900 text-white text-xs font-bold px-5 py-3 rounded-xl"
                  >
                    View My Enquiries
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="bg-purple-600 text-white text-xs font-bold px-5 py-3 rounded-xl"
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                    Zero Brokerage Contact
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">Send Direct Enquiry</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    For: <strong className="text-stone-800">{property.title}</strong>
                  </p>
                </div>

                {enquiryError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {enquiryError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Your Message to Owner
                  </label>
                  <textarea
                    rows={4}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium resize-none text-stone-900"
                    placeholder="Ask about move-in date, amenities, deposit terms..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEnquiry}
                  className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmittingEnquiry ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-purple-400" />
                  )}
                  <span>Submit Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SCHEDULE VISIT MODAL */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setVisitModalOpen(false);
                setVisitSuccess(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {visitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Visit Scheduled!</h3>
                <p className="text-xs text-stone-600">
                  Your physical visit request for <strong>{visitDate} at {visitTime}</strong> has been submitted. The owner has been notified to confirm your slot.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/visits')}
                    className="bg-stone-900 text-white text-xs font-bold px-5 py-3 rounded-xl"
                  >
                    View My Visits
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitVisit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                    On-Site Property Tour
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">Schedule a Physical Visit</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Visit: <strong className="text-stone-800">{property.title}</strong>
                  </p>
                </div>

                {visitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {visitError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Notes for Host (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-stone-900 resize-none"
                    placeholder="e.g. Visiting with family, will reach by metro..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmittingVisit ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>Confirm Visit Slot</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
