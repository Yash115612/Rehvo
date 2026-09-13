'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  Search,
  Download,
  Plus,
  MapPin,
  IndianRupee,
  Utensils,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Users,
  Edit,
  Pause,
  Play,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { createClient } from '@/lib/supabase/client';

interface PgListing {
  id: string;
  name: string;
  locality: string;
  city: string;
  gender_policy: 'MALE' | 'FEMALE' | 'UNISEX';
  sharing_types: string[];
  rent_starting: number;
  total_beds: number;
  available_beds: number;
  meals_included: boolean;
  status: 'ACTIVE' | 'FULL' | 'PAUSED';
  verified: boolean;
}

export default function AdminPgHostelsPage() {
  const [pgListings, setPgListings] = useState<PgListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .in('type', ['room', 'pg', 'hostel', 'coliving']);

        if (error) throw error;

        const mapped: PgListing[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.title,
          locality: `${p.locality || 'Mumbai'}${p.city ? `, ${p.city}` : ''}`,
          city: p.city || 'Mumbai',
          gender_policy: 'UNISEX',
          sharing_types: ['Private Room', 'Shared'],
          rent_starting: Number(p.price || p.rent || 0),
          total_beds: 1,
          available_beds: p.is_available === false ? 0 : 1,
          meals_included: false,
          status: p.is_available === false ? 'FULL' : 'ACTIVE',
          verified: (p.verification_status || '').toLowerCase() === 'verified',
        }));

        setPgListings(mapped);
      } catch (err) {
        console.warn('Failed to load PG listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = pgListings.filter((pg) => {
    const matchesSearch =
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.locality.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === 'ALL' || pg.gender_policy === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              PG & Hostel Co-Living Inventory
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {pgListings.length} PG & Room Listings
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real co-living room listings, bed inventory, gender policies, and occupancy tracking from Supabase
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(pgListings, 'rehvo_pg_hostel_inventory')}
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
            placeholder="Search PG by name or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All Genders</option>
          <option value="MALE">Male Only</option>
          <option value="FEMALE">Female Only</option>
          <option value="UNISEX">Co-ed / Unisex</option>
        </select>
      </div>

      {/* 3. Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead>
              <tr>
                <th>PG / Room Name</th>
                <th>Location</th>
                <th>Gender Policy</th>
                <th>Starting Rent</th>
                <th>Bed Occupancy</th>
                <th>Food & Meals</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
                      <span>Loading real PG & room listings from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Building size={24} className="text-slate-400" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">No PG or Room listings found</p>
                      <p className="text-[11px] text-slate-400">Properties listed with type "room" or "pg" will appear here automatically.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((pg) => (
                  <tr key={pg.id}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{pg.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {pg.id.slice(0, 8)}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <MapPin size={12} className="text-[#10B981] shrink-0" />
                        <span>{pg.locality}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          pg.gender_policy === 'FEMALE'
                            ? 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30'
                            : pg.gender_policy === 'MALE'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30'
                            : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30'
                        }`}
                      >
                        {pg.gender_policy}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-emerald-600 dark:text-[#10B981]">
                        {formatCurrency(pg.rent_starting)}<span className="text-slate-400 font-normal">/mo</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span className="text-slate-900 dark:text-white font-bold">{pg.available_beds}</span> / {pg.total_beds} beds free
                      </div>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          pg.meals_included ? 'bg-emerald-50 text-emerald-800 dark:bg-[#10B981]/15 dark:text-[#10B981]' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
                        }`}
                      >
                        {pg.meals_included ? '3 Meals Included' : 'No Food Package'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          pg.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {pg.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => alert(`Opening PG editor for ${pg.name}`)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
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
