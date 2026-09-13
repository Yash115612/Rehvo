'use client';

import React from 'react';
import { HardDrive, Database, Server, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';

export function ServerHealthCard() {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-[#0E8F73] dark:text-[#10B981]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Infrastructure & System Health
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#10B981]/15 text-emerald-800 dark:text-[#10B981] border border-emerald-200 dark:border-[#10B981]/30 text-[10px] font-extrabold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>99.98% Uptime</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase">Supabase DB</span>
            <Database size={13} className="text-[#0E8F73] dark:text-[#10B981]" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">Healthy</div>
          <p className="text-[10px] text-slate-500 font-mono">Mumbai (ap-south-1)</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase">Edge Latency</span>
            <Cpu size={13} className="text-[#0E8F73] dark:text-[#10B981]" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">28 ms</div>
          <p className="text-[10px] text-slate-500 font-mono">Vercel Global CDN</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase">Auth Service</span>
            <ShieldCheck size={13} className="text-[#0E8F73] dark:text-[#10B981]" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">Operational</div>
          <p className="text-[10px] text-slate-500 font-mono">JWT & OTP active</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase">Storage Bucket</span>
            <HardDrive size={13} className="text-[#0E8F73] dark:text-[#10B981]" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">62.4 GB</div>
          <p className="text-[10px] text-slate-500 font-mono">Deeds, Reels & Photos</p>
        </div>
      </div>
    </div>
  );
}
