'use client';

import React, { useState } from 'react';
import {
  Video,
  Play,
  Upload,
  Search,
  Download,
  Plus,
  Eye,
  Share2,
  Bookmark,
  TrendingUp,
  Trash2,
  X,
  Clapperboard,
} from 'lucide-react';
import { ShowReelItem } from '@/types/admin';
import { exportToCSV } from '@/lib/export/csv-pdf';

export default function AdminShowReelsPage() {
  const [showreels, setShowreels] = useState<ShowReelItem[]>([]);
  const [search, setSearch] = useState('');
  const [previewVideo, setPreviewVideo] = useState<ShowReelItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // New ShowReel form fields
  const [newTitle, setNewTitle] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newCategory, setNewCategory] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'PG' | 'FLATMATES'>('RESIDENTIAL');
  const [newLocality, setNewLocality] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const filtered = showreels.filter(
    (sr) =>
      sr.title.toLowerCase().includes(search.toLowerCase()) ||
      sr.locality.toLowerCase().includes(search.toLowerCase())
  );

  const totalViews = showreels.reduce((acc, r) => acc + (r.views_count || 0), 0);
  const totalWatchTime = showreels.reduce((acc, r) => acc + (r.watch_time_mins || 0), 0);
  const totalShares = showreels.reduce((acc, r) => acc + (r.shares_count || 0), 0);
  const avgCtr = showreels.length > 0 ? (showreels.reduce((acc, r) => acc + (r.ctr_percent || 0), 0) / showreels.length).toFixed(1) : '0.0';

  const handleToggleStatus = (id: string) => {
    setShowreels((prev) =>
      prev.map((sr) =>
        sr.id === id
          ? { ...sr, status: sr.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
          : sr
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this ShowReel video permanently?')) {
      setShowreels((prev) => prev.filter((sr) => sr.id !== id));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReel: ShowReelItem = {
      id: `sr_${Date.now()}`,
      title: newTitle || 'Untitled ShowReel Video',
      src: newSrc,
      category: newCategory,
      locality: newLocality || 'Mumbai',
      city: 'Mumbai',
      caption: newCaption || 'Verified by REHVO',
      tags: ['Mumbai', 'Verified'],
      views_count: 0,
      watch_time_mins: 0,
      shares_count: 0,
      saves_count: 0,
      ctr_percent: 0,
      is_featured: false,
      is_trending: false,
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
    };
    setShowreels([newReel, ...showreels]);
    setUploadModalOpen(false);
    setNewTitle('');
    setNewSrc('');
    setNewLocality('');
    setNewCaption('');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ShowReel Video CMS & Analytics
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {showreels.length} Active ShowReels
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage high-converting autoplaying video showreels on the website landing page and mobile app
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(showreels, 'rehvo_showreels_metrics')}
            disabled={showreels.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-extrabold shadow-sm transition"
          >
            <Plus size={14} />
            <span>Upload ShowReel</span>
          </button>
        </div>
      </div>

      {/* 2. Top Analytics Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Video Views</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalViews.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 font-semibold">Real-time plays</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Watch Time</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalWatchTime.toLocaleString()} mins</div>
          <span className="text-[10px] text-slate-400 font-semibold">Total viewer duration</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lease Inquiries (CTR)</span>
          <div className="text-2xl font-black text-[#10B981] mt-1">{avgCtr}% CTR</div>
          <span className="text-[10px] text-slate-400 font-semibold">Direct click-to-book</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social Shares</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalShares.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 font-semibold">WhatsApp & Instagram</span>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search showreel by title or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 4. ShowReels Grid or Honest Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <Clapperboard size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {showreels.length === 0 ? '0 ShowReel Videos in Media Library' : 'No Videos Match Your Search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {showreels.length === 0
              ? 'Zero mock videos are displayed. Upload verified property walkthroughs or promotional reels to autoplay on the REHVO landing page.'
              : 'Try clearing your search query.'}
          </p>
          {showreels.length === 0 && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-bold shadow-sm transition"
            >
              <Plus size={14} />
              <span>Upload First ShowReel</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((sr) => (
            <div
              key={sr.id}
              className="group rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#10B981]/40 transition"
            >
              {/* Video Thumbnail Stage */}
              <div className="relative h-48 bg-black/60 overflow-hidden flex items-center justify-center">
                <video
                  src={sr.src}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0E8F73] text-white shadow-xs">
                    {sr.category}
                  </span>
                </div>

                <button
                  onClick={() => setPreviewVideo(sr)}
                  className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/20 hover:bg-[#0E8F73] backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110 shadow-glow"
                  aria-label="Preview ShowReel"
                >
                  <Play size={18} className="fill-white ml-0.5" />
                </button>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                  <span className="font-bold truncate">{sr.locality}</span>
                  <span className="text-[10px] font-mono text-slate-300">{sr.views_count.toLocaleString()} views</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2.5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">{sr.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{sr.caption}</p>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Share2 size={11} className="text-slate-400" />
                    <span>{sr.shares_count} shares</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={11} className="text-slate-400" />
                    <span>{sr.saves_count} saves</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-[#10B981]">
                    <TrendingUp size={11} />
                    <span>{sr.ctr_percent}% CTR</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/30 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(sr.id)}
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition ${
                    sr.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30 hover:bg-rose-50 hover:text-rose-700'
                      : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                  }`}
                >
                  {sr.status === 'PUBLISHED' ? 'Active on Web' : 'Draft / Paused'}
                </button>

                <button
                  onClick={() => handleDelete(sr.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
                  title="Delete ShowReel"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Live Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative text-slate-900 dark:text-white">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X size={16} />
            </button>
            <div className="relative aspect-[9/16] bg-black">
              <video
                src={previewVideo.src}
                autoPlay
                controls
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-1 bg-slate-50 dark:bg-[#121215]">
              <h4 className="text-xs font-black text-slate-900 dark:text-white">{previewVideo.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{previewVideo.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Upload ShowReel Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#10B981]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Upload New ShowReel Video</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sea-Facing 2 BHK in Worli"
                  className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Direct MP4 or CDN URL
                </label>
                <input
                  type="url"
                  required
                  value={newSrc}
                  onChange={(e) => setNewSrc(e.target.value)}
                  placeholder="https://your-bucket.supabase.co/storage/v1/object/public/reels/video.mp4"
                  className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="PG">PG / Co-Living</option>
                    <option value="FLATMATES">Flatmates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Locality
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    placeholder="Bandra West, Mumbai"
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Caption Line
                </label>
                <input
                  type="text"
                  required
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="100% Verified Listings • Direct Owner Chat"
                  className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-bold text-white shadow-sm"
                >
                  Publish ShowReel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
