'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { MapPin, Loader2 } from 'lucide-react';
import { getLocations } from '@/lib/supabase/admin-service';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLocations()
      .then((data) => setLocations(data))
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = locations.filter((l) => l.status === 'active' || l.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cities & Service Locations"
        subtitle="Manage supported operational cities, micro-localities, and geographic coverage"
        badge={`${activeCount} Active Cities`}
      />

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading service locations from Supabase...</span>
          </div>
        ) : locations.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No locations</p>
            <p>No operational service cities found in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Sort Order</th>
                  <th>Operations Status</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id}>
                    <td>
                      <div className="font-bold text-brand-dark flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand-primary" />
                        <span>{loc.name}</span>
                      </div>
                    </td>
                    <td className="text-xs font-semibold text-brand-dark">
                      {loc.state || 'Maharashtra'}
                    </td>
                    <td className="text-xs font-semibold text-brand-dark">
                      {loc.country || 'India'}
                    </td>
                    <td className="text-xs font-bold text-brand-muted font-mono">
                      #{loc.sort_order || 1}
                    </td>
                    <td>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          loc.status === 'active' || loc.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {loc.status === 'active' || loc.status === 'ACTIVE' ? 'Live Operations' : 'Inactive / Coming Soon'}
                      </span>
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
