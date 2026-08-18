'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CalendarCheck, MapPin, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getVisits } from '@/lib/supabase/admin-service';

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVisits()
      .then((data) => setVisits(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Property Visits"
        subtitle="Monitor physical and guided property visits booked across the platform"
        badge={`${visits.length} Bookings`}
      />

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading scheduled visits from Supabase...</span>
          </div>
        ) : visits.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No visits scheduled</p>
            <p>No property visit appointments currently booked in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Property & Location</th>
                  <th>Renter Details</th>
                  <th>Host Details</th>
                  <th>Tour Slot</th>
                  <th>Status</th>
                  <th>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{v.properties?.title || 'Property Visit'}</div>
                      <div className="text-[11px] text-brand-muted flex items-center gap-1">
                        <MapPin size={11} />
                        <span>{v.properties?.locality || 'Mumbai'}, {v.properties?.city || ''}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{v.renter?.full_name || 'Renter'}</div>
                      <div className="text-[11px] text-brand-muted">{v.renter?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{v.owner?.full_name || 'Owner'}</div>
                      <div className="text-[11px] text-brand-muted">{v.owner?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="text-xs font-extrabold text-brand-dark flex items-center gap-1">
                        <CalendarCheck size={13} className="text-brand-primary" />
                        <span>{v.scheduled_date} at {v.scheduled_time}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={(v.status || 'PENDING').toUpperCase()} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(v.created_at)}</td>
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
