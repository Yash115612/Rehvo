'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, UserCheck, MapPin, MoreHorizontal, Briefcase, Pause, Play, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getFlatmates, updateFlatmateStatus, AdminFlatmateRecord } from '@/lib/supabase/admin-service';

export default function AdminFlatmatesPage() {
  const [flatmates, setFlatmates] = useState<AdminFlatmateRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadFlatmates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getFlatmates({ search, status: statusFilter });
      setFlatmates(res.data);
      setTotalCount(res.count);
    } catch (err) {
      console.warn('[Admin Flatmates] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadFlatmates();
  }, [loadFlatmates]);

  const handleToggleStatus = async (fm: AdminFlatmateRecord) => {
    const nextStatus = fm.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setActionLoading(true);
    try {
      const res = await updateFlatmateStatus(fm.id, nextStatus);
      if (res.success) {
        setFlatmates((prev) =>
          prev.map((item) => (item.id === fm.id ? { ...item, status: nextStatus as any } : item))
        );
      } else {
        alert(res.error || 'Failed to update flatmate profile status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flatmate Profiles"
        subtitle="Manage roommate discovery listings and seeker preferences"
        badge={`${totalCount} Profiles`}
      />

      <div className="bg-white rounded-xl border border-brand-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by name, locality, or occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading flatmates from Supabase...</span>
          </div>
        ) : flatmates.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No profiles found</p>
            <p>No flatmate profiles matched your active criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Profession</th>
                  <th>Target Locality</th>
                  <th>Max Budget</th>
                  <th>Preference</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flatmates.map((fm) => (
                  <tr key={fm.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{fm.name}</div>
                      <div className="text-[11px] text-brand-muted">{fm.gender} • {fm.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                        <Briefcase size={12} className="text-brand-muted" />
                        <span>{fm.occupation}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                        <MapPin size={12} className="text-brand-muted" />
                        <span>{fm.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-extrabold text-brand-dark">
                        {formatCurrency(fm.budget)}
                      </div>
                    </td>
                    <td className="text-xs text-brand-dark font-medium">{fm.room_preference}</td>
                    <td>
                      <StatusBadge status={fm.status} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(fm.created_at)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleStatus(fm)}
                        disabled={actionLoading}
                        className="p-1.5 rounded bg-brand-canvas hover:bg-brand-canvas/80 text-brand-dark border border-brand-border text-xs font-semibold inline-flex items-center gap-1"
                        title={fm.status === 'ACTIVE' ? 'Pause Profile' : 'Resume Profile'}
                      >
                        {fm.status === 'ACTIVE' ? (
                          <>
                            <Pause size={13} className="text-amber-600" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play size={13} className="text-emerald-600" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
