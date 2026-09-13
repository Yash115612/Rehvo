'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  AlertTriangle,
  RotateCcw,
  X,
  Loader2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import {
  getRealKycDocuments,
  updatePropertyKycStatus,
  RealKycDocRecord,
} from '@/lib/supabase/admin-service';

export default function AdminKycPage() {
  const [documents, setDocuments] = useState<RealKycDocRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectDoc, setInspectDoc] = useState<RealKycDocRecord | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getRealKycDocuments();
        setDocuments(data);
      } catch (err) {
        console.warn('Failed to load KYC documents:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = documents.filter((d) => statusFilter === 'ALL' || d.status === statusFilter);
  const pendingCount = documents.filter((d) => d.status === 'PENDING').length;

  const handleDecision = async (id: string, decision: 'VERIFIED' | 'REJECTED') => {
    let reason: string | undefined;
    if (decision === 'REJECTED') {
      const input = window.prompt('Specify reason for document rejection:');
      if (!input || !input.trim()) return;
      reason = input.trim();
    }

    // Optimistic UI update
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: decision, rejection_reason: reason } : d))
    );
    setInspectDoc(null);

    try {
      await updatePropertyKycStatus(id, decision, reason);
    } catch (err) {
      console.warn('Failed to persist KYC decision:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              KYC & Property Deeds Verification
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
              {pendingCount} Awaiting Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review proof of ownership deeds (Index-II), electricity bills, Aadhaar, PAN, and host identity credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(documents, 'rehvo_kyc_verification_queue')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex items-center justify-between shadow-card">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All KYC Statuses</option>
          <option value="PENDING">Pending Review ({pendingCount})</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* 3. Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead>
              <tr>
                <th>Verification Target</th>
                <th>Document Type</th>
                <th>Submitted By</th>
                <th>Document Preview</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th className="text-right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
                      <span>Loading real verification items from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 size={24} className="text-emerald-500" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">No documents in this queue</p>
                      <p className="text-[11px] text-slate-400">All properties and documents are verified or match current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{doc.target_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {doc.id.slice(0, 16)}</div>
                    </td>
                    <td>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {doc.document_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{doc.submitted_by}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{doc.owner_phone}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => setInspectDoc(doc)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0E8F73] text-slate-700 hover:text-white dark:bg-white/5 dark:text-slate-200 dark:hover:bg-[#0E8F73] dark:hover:text-white text-xs font-bold transition"
                      >
                        <Eye size={12} />
                        <span>Inspect Document</span>
                      </button>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(doc.submitted_at)}</span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                          doc.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : doc.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                      {doc.rejection_reason && (
                        <p className="text-[10px] text-rose-500 mt-1 max-w-xs">{doc.rejection_reason}</p>
                      )}
                    </td>
                    <td className="text-right">
                      {doc.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDecision(doc.id, 'VERIFIED')}
                            className="px-3 py-1.5 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-bold text-white shadow-glow transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(doc.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. High-Res Document Inspection Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <h3 className="text-sm font-black text-white">{inspectDoc.target_name}</h3>
                <p className="text-xs text-slate-400">
                  Submitted by {inspectDoc.submitted_by} ({inspectDoc.owner_phone})
                </p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Image Stage */}
            <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-black/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inspectDoc.document_url}
                alt={inspectDoc.target_name}
                className="max-h-[550px] rounded-xl object-contain shadow-2xl border border-white/10"
              />
            </div>

            {/* Modal Footer Decisions */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <a
                href={inspectDoc.document_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1"
              >
                <span>Open Full Original</span>
                <ExternalLink size={12} />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecision(inspectDoc.id, 'REJECTED')}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
                >
                  Reject with Reason
                </button>
                <button
                  onClick={() => handleDecision(inspectDoc.id, 'VERIFIED')}
                  className="px-5 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-extrabold shadow-glow transition"
                >
                  Approve Title Deed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
