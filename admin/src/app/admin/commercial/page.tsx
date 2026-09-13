'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Download,
  Building2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Edit,
  Pause,
  Play,
  Loader2,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { createClient } from '@/lib/supabase/client';

interface CommercialListing {
  id: string;
  title: string;
  type: string;
  locality: string;
  area_sqft: number;
  fitout_status: string;
  rent_pm: number;
  deposit_months: number;
  lock_in_years: number;
  status: 'ACTIVE' | 'LEASED' | 'PAUSED';
}

export default function AdminCommercialPage() {
  const [commercials, setCommercials] = useState<CommercialListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .or('category.eq.commercial,type.in.(office,retail,warehouse,commercial,coworking,showroom)');

        if (error) throw error;

        const mapped: CommercialListing[] = (data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          type: (p.type || 'COMMERCIAL').toUpperCase(),
          locality: `${p.locality || 'Mumbai'}${p.city ? `, ${p.city}` : ''}`,
          area_sqft: p.area || 0,
          fitout_status: p.furnishing_status || 'BARE_SHELL',
          rent_pm: Number(p.price || p.rent || 0),
          deposit_months: p.deposit_months || 3,
          lock_in_years: 1,
          status: (p.status || 'ACTIVE').toUpperCase() as any,
        }));

        setCommercials(mapped);
      } catch (err) {
        console.warn('Failed to load commercial properties:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = commercials.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.locality.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Commercial & Office Spaces
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {commercials.length} Listed Units
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grade-A corporate office leases, retail storefronts, warehouses, and co-working floors from Supabase
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(commercials, 'rehvo_commercial_listings')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-card">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search commercial listing or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All Commercial Types</option>
          <option value="OFFICE">Corporate Office</option>
          <option value="RETAIL">Retail Storefront</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="COWORKING">Co-working Floor</option>
        </select>
      </div>

      {/* 3. Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead>
              <tr>
                <th>Commercial Property</th>
                <th>Type</th>
                <th>Locality</th>
                <th>Area (sq.ft)</th>
                <th>Fitout Condition</th>
                <th>Monthly Rent</th>
                <th>Lock-in</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
                      <span>Loading real commercial listings from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Briefcase size={24} className="text-slate-400" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">No commercial listings found in database</p>
                      <p className="text-[11px] text-slate-400 max-w-sm">Properties listed as office, retail, warehouse, or commercial will appear here automatically.</p>
                      <Link
                        href="/admin/properties/create?category=commercial"
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-bold transition shadow-glow"
                      >
                        <Plus size={13} />
                        <span>Add First Commercial Property</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{c.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {c.id.slice(0, 8)}</div>
                    </td>
                    <td>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                        {c.type}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <MapPin size={12} className="text-[#10B981] shrink-0" />
                        <span>{c.locality}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {c.area_sqft.toLocaleString('en-IN')} sq.ft
                      </span>
                    </td>
                    <td>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {c.fitout_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-emerald-600 dark:text-[#10B981]">
                        {formatCurrency(c.rent_pm)}<span className="text-slate-400 font-normal">/mo</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{c.lock_in_years} Years</span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => alert(`Opening Commercial editor for ${c.title}`)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <Edit size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
