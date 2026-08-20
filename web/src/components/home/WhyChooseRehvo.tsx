import React from 'react';
import { ShieldCheck, MessageSquare, CalendarCheck, Lock } from 'lucide-react';

export const WhyChooseRehvo: React.FC = () => {
  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-16 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="bg-[#FFF5F0] rounded-3xl p-6 sm:p-8 border border-orange-200/60 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Heading (3 Cols) */}
          <div className="lg:col-span-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
              Why Choose <br className="hidden sm:inline" />
              <span className="text-[#FF5533]">REHVO?</span>
            </h2>
          </div>

          {/* Right 4 Pillars (9 Cols) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#FF5533] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-stone-900">Verified & Genuine</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Everything is verified for your safety.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#FF5533] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-stone-900">Direct Conversations</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Chat directly with owners or flatmates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#FF5533] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-stone-900">Easy Scheduling</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Book site visits in just a few clicks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#FF5533] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-stone-900">Secure & Trusted</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Your data and privacy are always protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
