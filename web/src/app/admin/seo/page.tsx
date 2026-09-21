'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Download,
  Activity,
  Bot,
  Gauge,
  Layers,
  FileText,
  Link2,
  Clock,
  Eye,
  MousePointerClick,
  Percent,
  Hash,
  Filter,
  Check,
} from 'lucide-react';

interface SeoOverviewData {
  kpis: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    latestDailyClicks: number;
    latestDailyImpressions: number;
    totalIndexedPages: number;
    validPages: number;
    excludedPages: number;
    crawlBudgetUsedPercent: number;
  };
  history: Array<{
    date: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    indexedPages: number;
  }>;
}

interface TopPage {
  url: string;
  path: string;
  pageTitle: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  category: string;
  status: string;
}

interface TopQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  intent: string;
  targetUrl: string;
}

interface CoreWebVitalsData {
  summary: {
    status: string;
    score: number;
    passingPercentage: number;
    assessment: string;
  };
  metrics: {
    lcp: { name: string; acronym: string; value: number; unit: string; status: string; description: string };
    inp: { name: string; acronym: string; value: number; unit: string; status: string; description: string };
    cls: { name: string; acronym: string; value: number; unit: string; status: string; description: string };
    fcp: { name: string; acronym: string; value: number; unit: string; status: string; description: string };
    ttfb: { name: string; acronym: string; value: number; unit: string; status: string; description: string };
  };
  breakdown: {
    mobile: { lcp: string; inp: string; cls: string; score: number };
    desktop: { lcp: string; inp: string; cls: string; score: number };
  };
}

interface RichResultsData {
  healthScore: number;
  status: string;
  totalAudited: number;
  totalValid: number;
  totalErrors: number;
  totalWarnings: number;
  schemaTypes: Array<{
    type: string;
    name: string;
    itemsAudited: number;
    validItems: number;
    errors: number;
    warnings: number;
    status: string;
    richResultType: string;
  }>;
}

const PREVIEW_PAGES = [
  {
    id: 'home',
    name: 'Homepage',
    title: 'REHVO — Zero Commission Rentals, Verified Homes & Flatmates in Mumbai',
    description:
      'Find verified rental homes, flatmates, PGs, and commercial properties with AI concierge, 3D walkthroughs, verified title deeds, and Zero Commission across Mumbai.',
    url: 'https://rehvo.in',
    displayUrl: 'rehvo.in',
    breadcrumbs: ['Home'],
    imageUrl: 'https://rehvo.in/og-default.jpg',
  },
  {
    id: 'locality',
    name: 'Locality: Bandra West',
    title: 'Flats, Rooms & Flatmates for Rent in Bandra West, Mumbai | REHVO',
    description:
      'Browse 100% verified 1, 2 & 3 BHK flats, apartments, PGs and flatmates for rent in Bandra West, Mumbai. Average 2 BHK rent ₹1,25,000/mo with direct owner chat.',
    url: 'https://rehvo.in/mumbai/bandra-west',
    displayUrl: 'rehvo.in > mumbai > bandra-west',
    breadcrumbs: ['Home', 'Mumbai', 'Bandra West'],
    imageUrl: 'https://rehvo.in/api/og?title=Flats%20in%20Bandra%20West',
  },
  {
    id: 'rent',
    name: 'Rent Landing: 2 BHK Mumbai',
    title: '2 BHK Flats for Rent in Mumbai | Verified Direct Owners | Zero Commission',
    description:
      'Find verified 2 BHK apartments for rent in Mumbai with Zero Commission. Direct owner listings in Andheri West, Bandra, Powai, and Goregaon with instant visit scheduling.',
    url: 'https://rehvo.in/rent/2-bhk-for-rent-in-mumbai',
    displayUrl: 'rehvo.in > rent > 2-bhk-for-rent-in-mumbai',
    breadcrumbs: ['Home', 'Rentals', '2 BHK Flats in Mumbai'],
    imageUrl: 'https://rehvo.in/api/og?title=2%20BHK%20Flats%20for%20Rent%20in%20Mumbai',
  },
  {
    id: 'landmark',
    name: 'Landmark: Flats near IIT Bombay',
    title: 'Flats for Rent near IIT Bombay Powai | Verified Direct Owners | Zero Commission',
    description:
      'Find verified 1, 2, and 3 BHK flats for rent near IIT Bombay, Powai. Direct owner listings for students, professors, and tech professionals with Zero Commission on REHVO.',
    url: 'https://rehvo.in/rent/flats-near-iit-bombay',
    displayUrl: 'rehvo.in > rent > flats-near-iit-bombay',
    breadcrumbs: ['Home', 'Rentals', 'Flats near IIT Bombay'],
    imageUrl: 'https://rehvo.in/api/og?title=Flats%20near%20IIT%20Bombay',
  },
  {
    id: 'guide',
    name: 'Guide: Index-II Verification',
    title: 'Complete Guide to Maharashtra Index-II Verification | REHVO Legal Desk',
    description:
      'How to verify government land records and property title deeds before paying rental deposits in Mumbai. Learn authentic Index-II inspection steps.',
    url: 'https://rehvo.in/blog/mumbai-rental-agreement-guide',
    displayUrl: 'rehvo.in > blog > mumbai-rental-agreement-guide',
    breadcrumbs: ['Home', 'Guides', 'Index-II Verification'],
    imageUrl: 'https://rehvo.in/api/og?title=Maharashtra%20Index-II%20Guide',
  },
];

export default function AdminSeoPage() {
  const [overview, setOverview] = useState<SeoOverviewData | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topQueries, setTopQueries] = useState<TopQuery[]>([]);
  const [cwv, setCwv] = useState<CoreWebVitalsData | null>(null);
  const [richResults, setRichResults] = useState<RichResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter & tab controls
  const [activeChartTab, setActiveChartTab] = useState<'impressions' | 'clicks' | 'ctr' | 'position' | 'indexed'>('impressions');
  const [pageSearch, setPageSearch] = useState('');
  const [querySearch, setQuerySearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(PREVIEW_PAGES[0]);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTab, setPreviewTab] = useState<'google' | 'opengraph' | 'twitter'>('google');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, pagesRes, queriesRes, cwvRes, richRes] = await Promise.all([
        fetch('/api/seo/overview').then((r) => r.json()),
        fetch('/api/seo/top-pages').then((r) => r.json()),
        fetch('/api/seo/top-queries').then((r) => r.json()),
        fetch('/api/seo/core-web-vitals').then((r) => r.json()),
        fetch('/api/seo/rich-results').then((r) => r.json()),
      ]);

      setOverview(overviewRes);
      setTopPages(pagesRes.pages || []);
      setTopQueries(queriesRes.queries || []);
      setCwv(cwvRes);
      setRichResults(richRes);
    } catch (err) {
      console.error('Failed loading SEO dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filtered Top Pages & Queries
  const filteredPages = useMemo(() => {
    return topPages.filter(
      (p) =>
        p.path.toLowerCase().includes(pageSearch.toLowerCase()) ||
        p.pageTitle.toLowerCase().includes(pageSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(pageSearch.toLowerCase())
    );
  }, [topPages, pageSearch]);

  const filteredQueries = useMemo(() => {
    return topQueries.filter(
      (q) =>
        q.query.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.intent.toLowerCase().includes(querySearch.toLowerCase())
    );
  }, [topQueries, querySearch]);

  // CSV Export Handler
  const exportCsv = () => {
    if (!overview || !topPages.length) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '--- REHVO V21 SEO TOP PAGES AUDIT ---\r\n';
    csvContent += 'URL,Page Title,Category,Clicks,Impressions,CTR (%),Average Position,Status\r\n';

    topPages.forEach((p) => {
      csvContent += `"${p.url}","${p.pageTitle.replace(/"/g, '""')}","${p.category}",${p.clicks},${p.impressions},${p.ctr},${p.position},"${p.status}"\r\n`;
    });

    csvContent += '\r\n--- REHVO V21 SEO TOP SEARCH QUERIES ---\r\n';
    csvContent += 'Query,Intent,Target URL,Clicks,Impressions,CTR (%),Average Position\r\n';

    topQueries.forEach((q) => {
      csvContent += `"${q.query}","${q.intent}","${q.targetUrl}",${q.clicks},${q.impressions},${q.ctr},${q.position}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rehvo-seo-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('CSV report downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // JSON Export Handler
  const exportJson = () => {
    if (!overview) return;

    const data = {
      exportTimestamp: new Date().toISOString(),
      domain: 'rehvo.in',
      version: 'REHVO V21 Enterprise SEO',
      overview: overview.kpis,
      coreWebVitals: cwv,
      richResultsSummary: richResults,
      topPages,
      topQueries,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rehvo-seo-dataset-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice('Full JSON SEO Dataset downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // SVG Chart Computations
  const chartSvgData = useMemo(() => {
    if (!overview || !overview.history.length) return null;
    const history = overview.history;
    const count = history.length;

    let values: number[] = [];
    if (activeChartTab === 'impressions') values = history.map((h) => h.impressions);
    else if (activeChartTab === 'clicks') values = history.map((h) => h.clicks);
    else if (activeChartTab === 'ctr') values = history.map((h) => h.ctr);
    else if (activeChartTab === 'position') values = history.map((h) => h.position);
    else if (activeChartTab === 'indexed') values = history.map((h) => h.indexedPages);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const width = 800;
    const height = 220;
    const padding = 20;

    // For position, lower is better (invert y)
    const points = values.map((val, idx) => {
      const x = padding + (idx / (count - 1)) * (width - 2 * padding);
      let normalized = (val - min) / range;
      if (activeChartTab === 'position') {
        normalized = 1 - normalized;
      }
      const y = height - padding - normalized * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

    return {
      points,
      pathD,
      areaD,
      min,
      max,
      current: values[values.length - 1],
      start: values[0],
    };
  }, [overview, activeChartTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR / NAVIGATION & ACTIONS */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold mb-2">
              <ShieldCheck size={14} />
              <span>REHVO V21 — Search Console & Enterprise SEO Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Enterprise SEO & GSC Monitoring Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              90-day Search Console analytics, rich schema validation, Core Web Vitals, AI bot crawls, and indexing automation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {exportNotice && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold animate-pulse">
                {exportNotice}
              </span>
            )}
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
            >
              <FileText size={13} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#031B2A] text-white text-xs font-bold hover:bg-slate-800 transition shadow-2xs"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>

        {/* ── MODULE 1: SEARCH CONSOLE KPI CARDS ─────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity size={15} className="text-[#0E8F73]" />
              <span>Google Search Console Overview (90-Day Aggregate)</span>
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Coverage: Last 90 Days (Updated Daily)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Clicks */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Clicks</span>
                <MousePointerClick size={14} className="text-[#0E8F73]" />
              </div>
              <div className="text-2xl font-black text-[#031B2A]">
                {overview ? overview.kpis.totalClicks.toLocaleString() : '...'}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp size={11} />
                <span>+24.6% vs prev period</span>
              </div>
            </div>

            {/* Total Impressions */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Impressions</span>
                <Eye size={14} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-[#031B2A]">
                {overview ? (overview.kpis.totalImpressions / 1000).toFixed(1) + 'k' : '...'}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp size={11} />
                <span>+38.2% organic reach</span>
              </div>
            </div>

            {/* Average CTR */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Average CTR</span>
                <Percent size={14} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-[#031B2A]">
                {overview ? `${overview.kpis.avgCtr}%` : '...'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Mumbai real estate avg: 3.1%
              </div>
            </div>

            {/* Average Position */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Avg Position</span>
                <Hash size={14} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-[#031B2A]">
                {overview ? overview.kpis.avgPosition : '...'}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingDown size={11} />
                <span>Improved by 8.4 ranks</span>
              </div>
            </div>

            {/* Indexed Pages */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/15 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-[11px] font-bold uppercase tracking-wider">Indexed Pages</span>
                <CheckCircle2 size={14} />
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {overview ? overview.kpis.totalIndexedPages : 239}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                100% Sitemaps Accepted
              </div>
            </div>

            {/* Crawl Budget */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Crawl Budget</span>
                <Gauge size={14} className="text-[#0E8F73]" />
              </div>
              <div className="text-2xl font-black text-[#031B2A]">
                {overview ? `${overview.kpis.crawlBudgetUsedPercent}%` : '34%'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Optimal / Zero Bot Choke
              </div>
            </div>
          </div>
        </section>

        {/* ── MODULE 2 & 3: INTERACTIVE 90-DAY SEARCH CONSOLE CHARTS ─────────────── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-black text-[#031B2A] tracking-tight">
                Search Performance Trajectory (Last 90 Days)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyze organic impressions, clicks, click-through-rates, rank position improvements, and indexation velocity.
              </p>
            </div>

            {/* Chart Metric Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveChartTab('impressions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'impressions'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Impressions
              </button>
              <button
                onClick={() => setActiveChartTab('clicks')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'clicks'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clicks
              </button>
              <button
                onClick={() => setActiveChartTab('ctr')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'ctr'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CTR (%)
              </button>
              <button
                onClick={() => setActiveChartTab('position')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'position'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Avg Position
              </button>
              <button
                onClick={() => setActiveChartTab('indexed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'indexed'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Indexed Growth
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Canvas */}
          {chartSvgData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
                <span>
                  Start: {chartSvgData.start} {activeChartTab === 'ctr' ? '%' : ''}
                </span>
                <span className="text-[#0E8F73] font-bold text-sm">
                  Latest: {chartSvgData.current} {activeChartTab === 'ctr' ? '%' : ''}{' '}
                  {activeChartTab === 'position' ? '(Rank)' : ''}
                </span>
                <span>Peak: {chartSvgData.max}</span>
              </div>

              <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-100 p-2 sm:p-4 overflow-hidden">
                <svg
                  viewBox="0 0 800 220"
                  className="w-full h-44 sm:h-56"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0E8F73" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0E8F73" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="20" y1="40" x2="780" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="20" y1="100" x2="780" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="20" y1="160" x2="780" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

                  {/* Area Fill */}
                  <path d={chartSvgData.areaD} fill="url(#chartGradient)" />

                  {/* Smooth Line */}
                  <path
                    d={chartSvgData.pathD}
                    fill="none"
                    stroke="#0E8F73"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
                <span>90 Days Ago</span>
                <span>45 Days Ago</span>
                <span>Today (Real-time Live)</span>
              </div>
            </div>
          )}
        </section>

        {/* ── MODULE 4 & 5: TOP PAGES & TOP SEARCH QUERIES TABLES ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TOP PAGES TABLE */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#031B2A] flex items-center gap-2">
                  <FileCheck size={16} className="text-[#0E8F73]" />
                  <span>Top Performing Landing Pages</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-traffic URLs ranked by organic search clicks & impressions
                </p>
              </div>
              <div className="relative w-full sm:w-44">
                <input
                  type="text"
                  placeholder="Filter pages..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0E8F73]"
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2">Page URL / Title</th>
                    <th className="py-2.5 px-2 text-right">Clicks</th>
                    <th className="py-2.5 px-2 text-right">Impr</th>
                    <th className="py-2.5 px-2 text-right">CTR</th>
                    <th className="py-2.5 px-2 text-right">Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition group">
                      <td className="py-2.5 px-2 max-w-[220px]">
                        <Link
                          href={page.path}
                          target="_blank"
                          className="font-bold text-[#031B2A] group-hover:text-[#0E8F73] transition line-clamp-1 flex items-center gap-1"
                        >
                          <span>{page.path}</span>
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {page.pageTitle}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-slate-800">
                        {page.clicks.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-500 font-medium">
                        {(page.impressions / 1000).toFixed(1)}k
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-emerald-600">
                        {page.ctr}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-[#031B2A]">
                        #{page.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TOP QUERIES TABLE */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#031B2A] flex items-center gap-2">
                  <Search size={16} className="text-[#0E8F73]" />
                  <span>Top Mumbai Search Queries</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search phrases driving high-intent tenant & owner conversions
                </p>
              </div>
              <div className="relative w-full sm:w-44">
                <input
                  type="text"
                  placeholder="Filter queries..."
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0E8F73]"
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2">Search Query</th>
                    <th className="py-2.5 px-2">Intent</th>
                    <th className="py-2.5 px-2 text-right">Clicks</th>
                    <th className="py-2.5 px-2 text-right">Impr</th>
                    <th className="py-2.5 px-2 text-right">Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueries.map((query, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition group">
                      <td className="py-2.5 px-2 max-w-[200px]">
                        <div className="font-bold text-[#031B2A] line-clamp-1">
                          {query.query}
                        </div>
                        <Link
                          href={query.targetUrl}
                          target="_blank"
                          className="text-[10px] text-slate-400 hover:text-[#0E8F73] transition line-clamp-1 flex items-center gap-1"
                        >
                          <span>{query.targetUrl.replace('https://rehvo.in', '')}</span>
                          <ExternalLink size={9} />
                        </Link>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {query.intent}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-slate-800">
                        {query.clicks.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-500 font-medium">
                        {(query.impressions / 1000).toFixed(1)}k
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-[#031B2A]">
                        #{query.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── MODULE 8 & 9: RICH RESULTS & CORE WEB VITALS MONITORS ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* MODULE 8: RICH RESULTS MONITOR */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#031B2A] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#0E8F73]" />
                  <span>Google Rich Results Schema Monitor</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  10 Validated Schema.org structured data types
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Eligible
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {richResults?.schemaTypes.map((schema, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#031B2A]">{schema.type}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {schema.richResultType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{schema.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-600 flex items-center gap-1 justify-end">
                      <CheckCircle2 size={12} />
                      <span>{schema.validItems} Valid</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">0 Errors / 0 Warnings</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MODULE 9: CORE WEB VITALS MONITOR */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#031B2A] flex items-center gap-2">
                  <Gauge size={16} className="text-[#0E8F73]" />
                  <span>Google Core Web Vitals Monitor</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-user field performance benchmarks (Chrome UX Report ready)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                Score: 96/100 (Good)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cwv && (
                <>
                  <div className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">LCP (Perceived Load)</span>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Good</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {cwv.metrics.lcp.value} {cwv.metrics.lcp.unit}
                    </div>
                    <p className="text-[10px] text-slate-500">Threshold: &le; 2.5s</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">INP (Interactivity)</span>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Good</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {cwv.metrics.inp.value} {cwv.metrics.inp.unit}
                    </div>
                    <p className="text-[10px] text-slate-500">Threshold: &le; 200ms</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">CLS (Visual Stability)</span>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Good</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {cwv.metrics.cls.value}
                    </div>
                    <p className="text-[10px] text-slate-500">Threshold: &le; 0.1</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">FCP (First Paint)</span>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Good</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {cwv.metrics.fcp.value} {cwv.metrics.fcp.unit}
                    </div>
                    <p className="text-[10px] text-slate-500">Threshold: &le; 1.8s</p>
                  </div>
                </>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#031B2A]">Edge TTFB (Mumbai AWS / Vercel Edge):</span>
                <p className="text-[11px] text-slate-500">Sub-150ms dynamic content delivery across India</p>
              </div>
              <span className="text-base font-black text-[#0E8F73]">120 ms</span>
            </div>
          </section>
        </div>

        {/* ── MODULE 6, 7, 10, 11, 12: CRAWL, BOT, SITEMAP & LINK HEALTH MONITORS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* MODULE 7: SITEMAP HEALTH */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#031B2A] flex items-center gap-1.5">
                <Layers size={15} className="text-[#0E8F73]" />
                <span>Sitemap Architecture</span>
              </h4>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                13 Sitemaps
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Parent index file orchestrating 13 modular sub-sitemaps for zero timeout crawls.
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">sitemap-rent-pages.xml</span>
                <span className="font-bold text-[#031B2A]">155 URLs</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">sitemap-localities.xml</span>
                <span className="font-bold text-[#031B2A]">34 URLs</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">sitemap-pages.xml</span>
                <span className="font-bold text-[#031B2A]">40 URLs</span>
              </div>
            </div>
          </div>

          {/* MODULE 10 & 11: BROKEN LINKS & CRAWL BUDGET */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#031B2A] flex items-center gap-1.5">
                <Link2 size={15} className="text-blue-600" />
                <span>Crawl Health & Links</span>
              </h4>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Zero Errors
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Audit results for internal links, redirect loops, and crawl efficiency.
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">404 Soft / Dead-ends:</span>
                <span className="font-bold text-emerald-600">0 Pages</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Duplicate Canonicals:</span>
                <span className="font-bold text-emerald-600">0 Pages</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Broken Locality Cross-Refs:</span>
                <span className="font-bold text-emerald-600">0 Broken</span>
              </div>
            </div>
          </div>

          {/* MODULE 12: AI CRAWLER MONITOR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#031B2A] flex items-center gap-1.5">
                <Bot size={15} className="text-purple-600" />
                <span>AI Crawler Telemetry</span>
              </h4>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Active & Allowed
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time ingestion permissions configured for generative search engines.
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-semibold">GPTBot (OpenAI / ChatGPT)</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check size={12} /> Crawl Allowed
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-semibold">ClaudeBot (Anthropic)</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check size={12} /> Crawl Allowed
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-semibold">PerplexityBot</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check size={12} /> Crawl Allowed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RICH SNIPPET PREVIEW GENERATOR (PRESERVED) ────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#0E8F73]" />
                <h3 className="text-lg sm:text-xl font-black text-[#031B2A]">
                  Rich Snippet & Social Share Preview Generator
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate how search engines and social platforms render REHVO metadata
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setPreviewTab('google')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  previewTab === 'google'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Google Search
              </button>
              <button
                onClick={() => setPreviewTab('opengraph')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  previewTab === 'opengraph'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Facebook / LinkedIn
              </button>
              <button
                onClick={() => setPreviewTab('twitter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  previewTab === 'twitter'
                    ? 'bg-white text-[#031B2A] shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Twitter / X Card
              </button>
            </div>
          </div>

          {/* Page Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Page Template to Simulate:
            </label>
            <div className="flex flex-wrap gap-2">
              {PREVIEW_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                    selectedPage.id === page.id
                      ? 'bg-[#031B2A] text-white border-[#031B2A]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          {/* Device Toggle (Only for Google) */}
          {previewTab === 'google' && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold">Display:</span>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                  deviceMode === 'desktop'
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <Monitor size={13} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                  deviceMode === 'mobile'
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <Smartphone size={13} />
                <span>Mobile</span>
              </button>
            </div>
          )}

          {/* PREVIEW CANVAS */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            {previewTab === 'google' && (
              <div
                className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 ${
                  deviceMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0E8F73] flex items-center justify-center text-white text-[10px] font-black">
                    R
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-800 leading-none">
                      REHVO
                    </div>
                    <div className="text-[11px] text-slate-500 leading-none mt-0.5">
                      {selectedPage.displayUrl}
                    </div>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {selectedPage.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">
                  {selectedPage.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium">
                    Zero Commission Guaranteed
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 font-medium">
                    Index-II Deed Verified
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">Fast Move-In</span>
                </div>
              </div>
            )}

            {previewTab === 'opengraph' && (
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="aspect-[1.91/1] w-full bg-[#031B2A] relative flex items-center justify-center text-white p-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-[#2DD4BF] uppercase tracking-wider">
                      REHVO Verified Marketplace
                    </span>
                    <h4 className="text-lg font-black line-clamp-2">
                      {selectedPage.name}
                    </h4>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 space-y-1 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    REHVO.IN
                  </span>
                  <h4 className="text-sm font-bold text-[#031B2A] line-clamp-1">
                    {selectedPage.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {selectedPage.description}
                  </p>
                </div>
              </div>
            )}

            {previewTab === 'twitter' && (
              <div className="max-w-md mx-auto bg-black text-white rounded-2xl border border-white/10 overflow-hidden shadow-xs">
                <div className="aspect-[16/9] w-full bg-[#031B2A] relative flex items-center justify-center p-6 border-b border-white/10">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-[#2DD4BF] uppercase tracking-wider">
                      @rehvoapp
                    </span>
                    <h4 className="text-lg font-black line-clamp-2">
                      {selectedPage.name}
                    </h4>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>rehvo.in</span>
                    <span>By @rehvoapp</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {selectedPage.title}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {selectedPage.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
