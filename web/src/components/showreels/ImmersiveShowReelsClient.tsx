'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  MapPin,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { trackShowReelWatch } from '@/lib/analytics/tracker';

export interface ShowReelItem {
  id: string;
  slug: string;
  propertySlug?: string;
  title: string;
  locality: string;
  city: string;
  price: string;
  bhk: string;
  views: string;
  likes: number;
  duration: string;
  uploadDate: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
}

export function ImmersiveShowReelsClient({ reels }: { reels: ShowReelItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[activeIndex] || reels[0];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (reel: ShowReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/showreels#${reel.id}` : '';
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedId(reel.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSelectReel = (idx: number) => {
    setActiveIndex(idx);
    setIsPlaying(true);
    trackShowReelWatch(reels[idx].id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Vertical Player (Left 7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            onClick={handleTogglePlay}
            className="relative w-full max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 cursor-pointer group select-none"
          >
            {/* HTML5 Video */}
            <video
              ref={videoRef}
              key={currentReel.videoUrl}
              src={currentReel.videoUrl}
              poster={currentReel.thumbnailUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />

            {/* Play/Pause indicator overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                  <Play size={28} className="translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Top Bar inside player */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-black backdrop-blur-md shadow-md flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>4K Verified Tour</span>
              </span>
              <button
                onClick={handleToggleMute}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Floating Action Buttons on Right Side of Reel */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4 pointer-events-auto">
              {/* Like */}
              <button
                onClick={(e) => handleToggleLike(currentReel.id, e)}
                className="flex flex-col items-center gap-1 group/btn"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-lg ${
                    likedReels[currentReel.id]
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                >
                  <Heart
                    size={20}
                    className={likedReels[currentReel.id] ? 'fill-current' : ''}
                  />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {currentReel.likes + (likedReels[currentReel.id] ? 1 : 0)}
                </span>
              </button>

              {/* Save */}
              <button
                onClick={(e) => handleToggleSave(currentReel.id, e)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-lg ${
                    savedReels[currentReel.id]
                      ? 'bg-[#0E8F73] text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                >
                  <Bookmark
                    size={20}
                    className={savedReels[currentReel.id] ? 'fill-current' : ''}
                  />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">Save</span>
              </button>

              {/* Share */}
              <button
                onClick={(e) => handleShare(currentReel, e)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg">
                  <Share2 size={20} />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {copiedId === currentReel.id ? 'Copied!' : 'Share'}
                </span>
              </button>
            </div>

            {/* Bottom Property Overlay Details */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-14 text-white pointer-events-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <MapPin size={13} />
                <span>{currentReel.locality}, {currentReel.city}</span>
                <span className="text-white/40">•</span>
                <span className="text-white font-extrabold">{currentReel.bhk}</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-black">{currentReel.price}</span>
              </div>

              <h2 className="text-base font-black leading-tight drop-shadow mb-1 line-clamp-2">
                {currentReel.title}
              </h2>

              <p className="text-xs text-white/80 line-clamp-2 mb-4 leading-relaxed">
                {currentReel.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href="/download"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0E8F73] hover:bg-[#0b735c] text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar size={14} />
                  <span>Book Physical Visit</span>
                </Link>
                {currentReel.propertySlug && (
                  <Link
                    href={`/property/${currentReel.propertySlug}`}
                    className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Video Queue & Locality Highlights */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-lg font-black text-[#031B2A] tracking-tight">
              Featured Walkthroughs ({reels.length})
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {reels.map((reel, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isCurrent
                      ? 'bg-emerald-50/60 border-[#0E8F73] shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-black shrink-0">
                    <Image
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      fill
                      sizes="80px"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                      <div className="w-7 h-7 rounded-full bg-white/90 text-[#031B2A] flex items-center justify-center">
                        <Play size={12} className="translate-x-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#0E8F73] truncate">
                        {reel.locality}
                      </span>
                      <span className="font-black text-[#031B2A] shrink-0">{reel.price}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#031B2A] line-clamp-1 leading-snug">
                      {reel.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {reel.bhk} • {reel.views} views
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {reel.duration}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black text-[#0E8F73] flex items-center gap-1 animate-pulse">
                          ● Now Playing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
