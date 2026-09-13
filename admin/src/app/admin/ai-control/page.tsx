'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  Sliders,
  Save,
  CheckCircle2,
  DollarSign,
  Zap,
  BookOpen,
  FileText,
  AlertCircle,
} from 'lucide-react';

function AdminAiControlContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'prompts';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [systemPrompt, setSystemPrompt] = useState(
    `You are the official REHVO AI Rental Concierge operating system. You assist Mumbai renters, flatmate seekers, and property hosts with verified real estate discovery, schedule physical walkthroughs, calculate rental yields, and answer queries regarding society bylaws, security deposits, and R-Cash cashback.`
  );

  const [maxTokensDaily, setMaxTokensDaily] = useState(500000);
  const [knowledgeDocs, setKnowledgeDocs] = useState([
    { id: 'kb_01', title: 'Mumbai RERA & Tenant Lease Guidelines 2026', tokens: '14.2k' },
    { id: 'kb_02', title: 'REHVO R-Cash & 1% Rent Cashback Rewards Rules', tokens: '4.8k' },
    { id: 'kb_03', title: 'Co-Living & Society Gate Pass Security Protocols', tokens: '8.1k' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Concierge Operating System
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              GPT-4 & pgvector
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure system prompts, vector knowledge base, cost quotas, and AI automated matching
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Concierge:</span>
            <button
              onClick={() => setIsAiEnabled(!isAiEnabled)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase transition cursor-pointer ${
                isAiEnabled
                  ? 'bg-[#0E8F73] text-white shadow-glow'
                  : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
              }`}
            >
              {isAiEnabled ? 'Active' : 'Standby'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engine Status</span>
          <div className="text-xl font-black text-emerald-600 dark:text-[#10B981] mt-1">Operational</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Edge SSE Streaming</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Knowledge Store</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">pgvector</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Supabase Vector DB</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Token Cap</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">500k</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Configured limit</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Indexed Documents</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{knowledgeDocs.length} Docs</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">RAG knowledge base</span>
        </div>
      </div>

      {/* 3. Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'prompts', label: 'System Prompts' },
          { id: 'knowledge', label: 'Knowledge Base (RAG)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0E8F73] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>AI System Prompt parameters deployed to edge runtime!</span>
        </div>
      )}

      {/* 4. Content */}
      {activeTab === 'prompts' ? (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 p-6 shadow-xs dark:shadow-card space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                System Persona & Master Prompt
              </label>
              <textarea
                rows={6}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#16161A] p-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-[#0E8F73]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-extrabold text-white flex items-center gap-2 shadow-glow transition cursor-pointer"
              >
                <Save size={14} />
                <span>Save Prompt Rules</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 p-6 shadow-xs dark:shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Indexed Knowledge Base Documents (pgvector)
            </h3>
            <button
              onClick={() => alert('Document Ingestion Engine')}
              className="px-3 py-1.5 rounded-xl bg-[#0E8F73] text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              Upload Markdown / PDF
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#0E8F73] dark:text-[#10B981]">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {doc.id}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{doc.tokens} vectors</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAiControlPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-neutral-500">Loading AI Control Center...</div>}>
      <AdminAiControlContent />
    </React.Suspense>
  );
}
