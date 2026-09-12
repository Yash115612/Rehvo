'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, Building2, Eye, MoreHorizontal, ShieldCheck, MapPin, Pause, Play, Loader2, Building } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getProperties, updatePropertyStatus, AdminPropertyRecord } from '@/lib/supabase/admin-service';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminPropertyRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProperties({
        search,
        category: categoryFilter,
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
  }, [search, categoryFilter, typeFilter, statusFilter]);

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
        subtitle="Manage verified residential & commercial rental inventory, occupancy, and host listings"
        badge={`${totalCount} Total Listed`}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-brand-border p-4 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by title, locality, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Categories</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>

          {/* Property Types */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Types</option>
            <optgroup label="Residential">
              <option value="FLAT">Flat / Apartment</option>
              <option value="ROOM">Private Room</option>
              <option value="PG">PG / Co-living</option>
              <option value="STUDIO">Studio</option>
            </optgroup>
            <optgroup label="Commercial">
              <option value="OFFICE">Office Space</option>
              <option value="SHOP">Retail Shop</option>
              <option value="SHOWROOM">Showroom</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="COWORKING">Co-working</option>
              <option value="COMMERCIAL_BUILDING">Building / Floor</option>
              <option value="COMMERCIAL_PLOT">Commercial Plot</option>
            </optgroup>
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
                  <th>Category</th>
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
                      <div className="text-[11px] text-brand-muted font-mono">
                        {prop.type} {prop.area ? `• ${prop.area} sq.ft` : ''} • {prop.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          prop.category === 'COMMERCIAL'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {prop.category || 'RESIDENTIAL'}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                        <MapPin size={12} className="text-brand-muted shrink-0" />
                        <span>{prop.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-brand-dark text-xs">{formatCurrency(prop.rent)}/mo</div>
                    </td>
                    <td>
                      <div className="text-xs text-brand-dark font-medium">{prop.owner_name}</div>
                      <div className="text-[10px] text-brand-muted font-mono">{prop.owner_id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <StatusBadge status={prop.status} />
                    </td>
                    <td>
                      <StatusBadge status={prop.verification_status} />
                    </td>
                    <td>
                      <div className="text-xs text-brand-muted">{formatDate(prop.created_at)}</div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(prop)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-canvas transition"
                          title={prop.status === 'ACTIVE' ? 'Pause Listing' : 'Activate Listing'}
                        >
                          {prop.status === 'ACTIVE' ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                      </div>
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
