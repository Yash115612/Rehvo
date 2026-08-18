'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, Building2, Eye, MoreHorizontal, ShieldCheck, MapPin, Pause, Play, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getProperties, updatePropertyStatus, AdminPropertyRecord } from '@/lib/supabase/admin-service';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminPropertyRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProperties({
        search,
        type: typeFilter,
        status: statusFilter,
        page: 1,
        limit: 50,
      });
      setProperties(res.data);
      setTotalCount(res.count);
    } catch (err) {
      console.warn('[Admin Properties] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleToggleStatus = async (prop: AdminPropertyRecord) => {
    const nextStatus = prop.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setActionLoading(true);
    try {
      const res = await updatePropertyStatus(prop.id, nextStatus as any);
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === prop.id ? { ...p, status: nextStatus as any } : p))
        );
      } else {
        alert(res.error || 'Failed to update property status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Listings"
        subtitle="Manage verified rental inventory, occupancy, and host listings"
        badge={`${totalCount} Total Listed`}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-brand-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by title, locality, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Supported Property Types ONLY: Flat, Room, PG, Studio */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Types</option>
            <option value="FLAT">Flat / Apartment</option>
            <option value="ROOM">Private Room</option>
            <option value="PG">PG / Co-living</option>
            <option value="STUDIO">Studio</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="RENTED">Rented</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading properties from Supabase...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No listings found</p>
            <p>No property listings matched your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Monthly Rent</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Listed Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id}>
                    <td>
                      <div className="font-bold text-brand-dark max-w-xs truncate">{prop.title}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{prop.type} • {prop.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                        <MapPin size={12} className="text-brand-muted" />
                        <span>{prop.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-extrabold text-brand-dark">
                        {formatCurrency(prop.rent)}
                      </div>
                      <span className="text-[10px] text-brand-muted">per month</span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{prop.owner_name}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{prop.owner_id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <StatusBadge status={prop.status} />
                    </td>
                    <td>
                      <StatusBadge status={prop.verification_status} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(prop.created_at)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleStatus(prop)}
                        disabled={actionLoading}
                        className="p-1.5 rounded bg-brand-canvas hover:bg-brand-canvas/80 text-brand-dark border border-brand-border text-xs font-semibold inline-flex items-center gap-1"
                        title={prop.status === 'ACTIVE' ? 'Pause Listing' : 'Resume Listing'}
                      >
                        {prop.status === 'ACTIVE' ? (
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
