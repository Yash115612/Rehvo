'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Download,
  Plus,
  Building2,
  Key,
  MapPin,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { supabase } from '@/lib/supabase/client';

interface SocietyItem {
  id: string;
  name: string;
  locality: string;
  units_count: number;
  rwa_president: string;
  rwa_contact: string;
  gate_pass_active: boolean;
  maintenance_collected_month: number;
  status: 'ACTIVE' | 'ONBOARDING' | 'PAUSED';
}

export default function AdminSocietyServicesPage() {
  const [societies, setSocieties] = useState<SocietyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('societies').select('*');
      if (error || !data || data.length === 0) {
        setSocieties([]);
      } else {
        const mapped: SocietyItem[] = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          locality: s.locality || 'Mumbai',
          units_count: s.units_count || 0,
          rwa_president: s.rwa_president || 'RWA Representative',
          rwa_contact: s.rwa_contact || '—',
          gate_pass_active: !!s.gate_pass_active,
          maintenance_collected_month: s.maintenance_collected_month || 0,
          status: (s.status || 'ACTIVE').toUpperCase(),
        }));
        setSocieties(mapped);
      }
    } catch (err) {
      console.warn('Failed to load societies:', err);
      setSocieties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.locality.toLowerCase().includes(search.toLowerCase()) ||
      s.rwa_president.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Smart Society Management & RWA OS
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {societies.length} Onboarded Societies
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Biometric gate passes, maintenance billing, visitor authorization, and apartment governance
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => exportToCSV(societies, 'rehvo_society_partners')}
            disabled={societies.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search society, locality, or RWA contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 3. Table or Honest Empty State */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Querying society databases from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <Building2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {societies.length === 0 ? '0 Housing Societies Onboarded in Database' : 'No Societies Match Your Search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {societies.length === 0
              ? 'Zero mock society records are displayed. When housing complexes and RWAs partner with REHVO for smart gate passes, maintenance billing, and visitor check-ins, they will appear here.'
              : 'Try clearing your search query.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Society Name</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Locality</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Apartment Units</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">RWA Representative</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Digital Gate Pass</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Monthly Collections</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {s.id}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <MapPin size={12} className="text-[#10B981] shrink-0" />
                        <span>{s.locality}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                        {s.units_count} Units
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-900 dark:text-white font-semibold">{s.rwa_president}</div>
                      <div className="text-[10px] text-slate-400">{s.rwa_contact}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          s.gate_pass_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/30'
                        }`}
                      >
                        <Key size={11} />
                        <span>{s.gate_pass_active ? 'Active QR Gate' : 'Manual Registry'}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ₹{(s.maintenance_collected_month / 100000).toFixed(1)}L
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
