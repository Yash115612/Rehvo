'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Sparkles, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════════════════
   REHVO SHOWREEL — Auto-playing infinite-scroll video reel
   Design: Matches REHVO Emerald Luxury System (v10 component standard)
   Behaviour:
     • Infinite marquee-style auto-scroll (CSS animation)
     • Each clip auto-plays + loops silently; hover reveals sound toggle
     • On hover the entire ticker pauses
     • Manual prev / next arrows + dot pagination for focused single-card view
   ══════════════════════════════════════════════════════════════════════════════ */

interface ShowreelClip {
  id: string;
  src: string;
  poster?: string;
  label: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  caption: string;
  route: string;
  accent: string;
}

const CLIPS: ShowreelClip[] = [
  {
    id: 'verified-homes',
    src: '/videos/verified-homes.mp4',
    poster: '',
    label: 'Verified Homes',
    tag: 'RESIDENTIAL',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    caption: '100% Verified Listings · Direct Owner Chat',
    route: '/search',
    accent: '#0F766E',
  },
  {
    id: 'pg-rooms',
    src: '/videos/pg-rooms.mp4',
    poster: '',
    label: 'PG & Rooms',
    tag: 'PG STAYS',
    tagColor: '#D69E2E',
    tagBg: '#FEF9C3',
    caption: 'Premium Paying-Guest Stays · Zero Brokerage',
    route: '/pg',
    accent: '#D69E2E',
  },
  {
    id: 'flatmates',
    src: '/videos/flatmates.mp4',
    poster: '',
    label: 'Find Flatmates',
    tag: 'VIBEMATCH OS',
    tagColor: '#3C8D68',
    tagBg: '#EBF5F0',
    caption: 'AI VibeMatch · Safe Co-Living · Verified Profiles',
    route: '/flatmates',
    accent: '#3C8D68',
  },
  {
    id: 'commercial',
    src: '/videos/commercial.mp4',
    poster: '',
    label: 'Commercial Spaces',
    tag: 'COMMERCIAL',
    tagColor: '#4263EB',
    tagBg: '#EEF2FF',
    caption: 'Office & Retail Rentals · Verified by REHVO',
    route: '/commercial',
    accent: '#4263EB',
  },
  {
    id: 'ai-concierge',
    src: '/videos/ai-concierge.mp4',
    poster: '',
    label: 'AI Concierge',
    tag: 'AI-POWERED',
    tagColor: '#6366F1',
    tagBg: '#EEF2FF',
    caption: 'Your 24/7 Rental Assistant · GPT-4 Powered',
    route: '/ai-concierge',
    accent: '#6366F1',
  },
  {
    id: 'society',
    src: '/videos/society.mp4',
    poster: '',
    label: 'Society Management',
    tag: 'SMART SOCIETY',
    tagColor: '#4C7A86',
    tagBg: '#EDF6F8',
    caption: 'Gate Pass · Maintenance · RWA Digital OS',
    route: '/society',
    accent: '#4C7A86',
  },
  {
    id: 'rent-pay',
    src: '/videos/rent-pay.mp4',
    poster: '',
    label: 'Pay Rent Online',
    tag: '1% R-CASH',
    tagColor: '#059669',
    tagBg: '#D1FAE5',
    caption: 'UPI · Credit · 45-Day Deferred · R-Cash Back',
    route: '/download',
    accent: '#059669',
  },
];

/* ── Single Video Card ── */
interface VideoCardProps {
  clip: ShowreelClip;
  isActive?: boolean;
  onFocus?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ clip, isActive, onFocus }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <Link
      href={clip.route}
      onClick={() => onFocus?.()}
      className="group relative flex-shrink-0 w-[220px] sm:w-[260px] h-[320px] sm:h-[380px] rounded-[22px] overflow-hidden cursor-pointer select-none"
      style={{ boxShadow: `0 8px 36px ${clip.accent}28` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        src={clip.src}
        poster={clip.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/85 via-[#031B2A]/20 to-transparent pointer-events-none" />

      {/* Top tag badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20"
          style={{ backgroundColor: clip.tagBg + 'DD', color: clip.tagColor }}
        >
          {clip.tag}
        </span>
      </div>

      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-200 ${
          hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Play indicator */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center"
            style={{ boxShadow: `0 0 24px ${clip.accent}80` }}
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h4 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight drop-shadow-md">
          {clip.label}
        </h4>
        <p className="text-[11px] text-white/70 font-medium mt-0.5 leading-snug">
          {clip.caption}
        </p>
        <div
          className={`mt-2.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all duration-300 text-[#CCFBF1] ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {isActive && (
        <div
          className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2.5px ${clip.accent}` }}
        />
      )}
    </Link>
  );
};

/* ── Infinite Ticker Track ── */
const TickerTrack: React.FC<{ onCardFocus: (idx: number) => void }> = ({ onCardFocus }) => {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />

      <div
        className="flex gap-4 sm:gap-5 w-max py-4"
        style={{
          animation: 'rehvo-showreel-ticker 40s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {CLIPS.map((clip, idx) => (
          <VideoCard key={clip.id} clip={clip} onFocus={() => onCardFocus(idx)} />
        ))}
        {CLIPS.map((clip, idx) => (
          <VideoCard key={`${clip.id}-dup`} clip={clip} onFocus={() => onCardFocus(idx)} />
        ))}
      </div>
    </div>
  );
};

/* ── Spotlight Viewer ── */
const SpotlightViewer: React.FC<{
  activeIdx: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (idx: number) => void;
}> = ({ activeIdx, onPrev, onNext, onDot }) => {
  const clip = CLIPS[activeIdx];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous reel"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#031B2A] hover:text-[#0F766E] hover:border-[#0F766E]/40 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="scale-110 origin-center">
          <VideoCard clip={clip} isActive />
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next reel"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#031B2A] hover:text-[#0F766E] hover:border-[#0F766E]/40 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {CLIPS.map((c, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onDot(idx)}
              aria-label={`Go to ${c.label}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'w-6' : 'w-2 bg-[#CBD5E1] hover:bg-slate-400'
              }`}
              style={{ backgroundColor: isActive ? clip.accent : undefined }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ── MAIN EXPORT ── */
export const ShowreelSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showSpotlight, setShowSpotlight] = useState(false);

  const handleCardFocus = useCallback((idx: number) => {
    setActiveIdx(idx);
    setShowSpotlight(true);
    setTimeout(() => setShowSpotlight(false), 8000);
  }, []);

  const handlePrev = useCallback(
    () => setActiveIdx((prev) => (prev - 1 + CLIPS.length) % CLIPS.length),
    []
  );
  const handleNext = useCallback(
    () => setActiveIdx((prev) => (prev + 1) % CLIPS.length),
    []
  );

  useEffect(() => {
    if (showSpotlight) return;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % CLIPS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [showSpotlight]);

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#0F766E] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[1.6px]">
              <Sparkles className="w-3 h-3" />
              <span>REHVO IN ACTION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight leading-tight mt-1">
              See Every Feature,{' '}
              <span className="text-[#0F766E]">Live.</span>
            </h2>
            <p className="text-sm text-[#64748B] font-medium max-w-lg">
              Watch how REHVO works — from verified listings to AI concierge, flatmate matching &amp; smart society tools.
            </p>
          </div>

          <Link
            href="/download"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#064E3B] transition shrink-0"
          >
            <span>Experience in App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Auto-scroll Ticker */}
        <TickerTrack onCardFocus={handleCardFocus} />

        {/* Spotlight viewer */}
        <div
          className={`mt-10 transition-all duration-500 ${
            showSpotlight
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          {showSpotlight && (
            <SpotlightViewer
              activeIdx={activeIdx}
              onPrev={handlePrev}
              onNext={handleNext}
              onDot={setActiveIdx}
            />
          )}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 sm:mt-12 bg-gradient-to-r from-[#031B2A] via-[#064E3B] to-[#0F766E] rounded-[22px] sm:rounded-[28px] px-6 sm:px-10 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-[300px] h-[200px] bg-[#CCFBF1]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="text-center sm:text-left z-10">
            <p className="text-xs font-black text-[#CCFBF1]/80 uppercase tracking-widest">
              See it all in action
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              Download the REHVO App — Free
            </h3>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <Link
              href="/download"
              className="h-10 sm:h-11 px-5 sm:px-7 rounded-full bg-white text-[#031B2A] text-xs font-black flex items-center gap-2 shadow-md hover:bg-[#CCFBF1] hover:text-[#0F766E] transition-all active:scale-95 cursor-pointer"
            >
              <span>Get the App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
