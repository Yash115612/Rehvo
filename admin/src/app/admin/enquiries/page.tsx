'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { getEnquiries } from '@/lib/supabase/admin-service';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEnquiries()
      .then((data) => setEnquiries(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Direct Tenant Enquiries"
        subtitle="Audit prospective tenant queries and host responsiveness"
        badge={`${enquiries.length} Total Enquiries`}
      />

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading enquiries from Supabase...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No enquiries found</p>
            <p>No tenant enquiry messages currently in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Renter Details</th>
                  <th>Host Details</th>
                  <th>Message Snippet</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{e.properties?.title || 'Listing Enquiry'}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{e.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{e.renter?.full_name || 'Renter'}</div>
                      <div className="text-[11px] text-brand-muted">{e.renter?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{e.owner?.full_name || 'Owner'}</div>
                      <div className="text-[11px] text-brand-muted">{e.owner?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <p className="text-xs text-brand-dark/80 max-w-sm italic">
                        "{e.message}"
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={(e.status || 'PENDING').toUpperCase()} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(e.created_at)}</td>
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
