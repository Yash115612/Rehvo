'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Building2,
  MapPin,
  Pause,
  Play,
  Loader2,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Star,
  Flame,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Archive,
  Phone,
  User,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getProperties, updatePropertyStatus, AdminPropertyRecord } from '@/lib/supabase/admin-service';
import { PropertyEditorModal } from '@/components/properties/PropertyEditorModal';
import { exportToCSV } from '@/lib/export/csv-pdf';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminPropertyRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingProperty, setEditingProperty] = useState<AdminPropertyRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(properties.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = async (prop: AdminPropertyRecord) => {
    const nextStatus = prop.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await updatePropertyStatus(prop.id, nextStatus as any);
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === prop.id ? { ...p, status: nextStatus as any } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkAction = (action: 'APPROVE' | 'PAUSE' | 'DELETE') => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to perform ${action} on ${selectedIds.length} properties?`)) return;

    if (action === 'DELETE') {
      setProperties((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } else if (action === 'APPROVE') {
      setProperties((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'ACTIVE' as any } : p))
      );
      setSelectedIds([]);
    } else if (action === 'PAUSE') {
      setProperties((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'PAUSED' as any } : p))
      );
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    exportToCSV(
      properties.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        type: p.type,
        location: p.location,
        rent: p.rent,
        owner: p.owner_name,
        status: p.status,
        created_at: p.created_at,
      })),
      'rehvo_properties_inventory'
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Property CRM & Listings Control
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {totalCount} Total Listed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage residential, commercial, PG & flatmate inventory, pricing, title deed verification, and bulk actions
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProperty({
                id: `prp_${Date.now()}`,
                title: 'New Mumbai Rental Property',
                category: 'RESIDENTIAL',
                type: 'FLAT',
                location: 'Bandra West, Mumbai',
                city: 'Mumbai',
                rent: 65000,
                area: 850,
                owner_id: 'usr_admin',
                owner_name: 'Antigravity Super Admin',
                status: 'ACTIVE',
                verification_status: 'VERIFIED',
                images_count: 0,
                created_at: new Date().toISOString(),
              });
              setEditorOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-extrabold shadow-glow transition"
          >
            <Plus size={14} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Multi-Parameter Search */}
      <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-card">
        <div className="relative w-full lg:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, title, locality, or owner name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Categories</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Types</option>
            <option value="FLAT">Flat / Apartment</option>
            <option value="ROOM">Private Room</option>
            <option value="PG">PG / Co-living</option>
            <option value="OFFICE">Commercial Office</option>
            <option value="SHOP">Retail Shop</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="RENTED">Rented</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* 3. Bulk Action Bar (When rows selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-5 rounded-2xl bg-[#0E8F73]/20 border border-[#10B981]/40 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#10B981]">{selectedIds.length} properties selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('APPROVE')}
              className="px-3 py-1.5 rounded-xl bg-[#0E8F73] text-white font-bold hover:bg-[#10B981] transition"
            >
              Approve / Activate
            </button>
            <button
              onClick={() => handleBulkAction('PAUSE')}
              className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
            >
              Pause
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-500/30 transition"
            >
              Archive / Delete
            </button>
          </div>
        </div>
      )}

      {/* 4. Properties Table */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-16 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 size={16} className="animate-spin text-[#10B981]" />
            <span>Loading property inventory from Supabase...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <p className="font-bold text-white mb-1">No listings found</p>
            <p>No property listings matched your current search parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th className="w-8 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === properties.length && properties.length > 0}
                      onChange={handleSelectAll}
                      className="rounded bg-black/40 border-white/10 accent-[#10B981]"
                    />
                  </th>
                  <th>Property Listing</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Monthly Rent</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Deed KYC</th>
                  <th>Listed Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => {
                  const isChecked = selectedIds.includes(prop.id);
                  return (
                    <tr key={prop.id} className={isChecked ? 'bg-[#0E8F73]/5' : ''}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(prop.id)}
                          className="rounded bg-black/40 border-white/10 accent-[#10B981]"
                        />
                      </td>
                      <td>
                        <div className="font-bold text-white max-w-xs truncate">{prop.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {prop.type} {prop.area ? `• ${prop.area} sq.ft` : ''} • {prop.id.slice(0, 8)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase tracking-wider ${
                            prop.category === 'COMMERCIAL'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {prop.category || 'RESIDENTIAL'}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs font-semibold text-white flex items-center gap-1 truncate max-w-xs">
                          <MapPin size={12} className="text-[#10B981] shrink-0" />
                          <span>{prop.location}</span>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-white text-xs">
                          {formatCurrency(prop.rent)}<span className="text-slate-500 font-normal">/mo</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs text-white font-semibold flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          <span>{prop.owner_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{prop.owner_id.slice(0, 8)}...</div>
                      </td>
                      <td>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            prop.status === 'ACTIVE'
                              ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <ShieldCheck size={11} />
                          <span>{prop.verification_status || 'VERIFIED'}</span>
                        </span>
                      </td>
                      <td>
                        <div className="text-xs text-slate-400">{formatDate(prop.created_at)}</div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProperty(prop);
                              setEditorOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                            title="Edit Listing Details"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(prop)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                            title={prop.status === 'ACTIVE' ? 'Pause Listing' : 'Activate Listing'}
                          >
                            {prop.status === 'ACTIVE' ? <Pause size={13} /> : <Play size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Editor Modal Suite */}
      <PropertyEditorModal
        property={editingProperty}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={(updated) => {
          if (!editingProperty) return;
          setProperties((prev) =>
            prev.map((p) => (p.id === editingProperty.id ? { ...p, ...updated } : p))
          );
        }}
      />
    </div>
  );
}
