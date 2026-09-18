import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Heart,
  TrendingUp,
  Send,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Careers at REHVO | Rebuild Real Estate in Mumbai',
  description:
    'Join REHVO in Mumbai. We are hiring engineers, product designers, and ground operations leaders to eliminate broker commissions and bring transparency to renting.',
  canonicalUrl: 'https://rehvo.in/careers',
});

const PERKS = [
  {
    icon: Zap,
    title: 'High Velocity & Impact',
    desc: 'Ship software and operational systems that directly affect thousands of renters and owners across Mumbai every day.',
  },
  {
    icon: TrendingUp,
    title: 'Top-Tier Compensation & ESOPs',
    desc: 'Competitive salary packages with meaningful equity ownership so you genuinely share in the value you create.',
  },
  {
    icon: ShieldCheck,
    title: 'Comprehensive Health & Wellness',
    desc: 'Family healthcare cover, mental health wellness stipends, and ergonomic workspace support.',
  },
  {
    icon: Heart,
    title: 'Vibrant BKC Headquarters',
    desc: 'Collaborate in our modern Mumbai office with daily catered lunches, specialty brew coffees, and hybrid flexibility.',
  },
];

const OPEN_ROLES = [
  {
    id: 'eng-sr-fullstack',
    department: 'Engineering',
    title: 'Senior Fullstack Engineer (Next.js & React Native)',
    location: 'BKC, Mumbai (Hybrid)',
    type: 'Full-time',
    experience: '3-6 Years',
    desc: 'Architect next-generation web portals, low-latency mobile features, and Supabase real-time sync systems for our verified rental engine.',
    skills: ['Next.js 14', 'React Native / Expo', 'TypeScript', 'PostgreSQL / Supabase'],
  },
  {
    id: 'eng-ai-agent',
    department: 'Engineering',
    title: 'AI / LLM Systems Engineer',
    location: 'BKC, Mumbai (Hybrid)',
    type: 'Full-time',
    experience: '2-5 Years',
    desc: 'Build REHVO AI Concierge conversational pipelines, rental contract parsing agents, and automated valuation models.',
    skills: ['Python', 'LangChain / LlamaIndex', 'OpenAI APIs', 'Vector DBs'],
  },
  {
    id: 'des-sr-product',
    department: 'Product & Design',
    title: 'Staff Product Designer (Mobile & Web)',
    location: 'BKC, Mumbai',
    type: 'Full-time',
    experience: '4+ Years',
    desc: 'Craft ultra-luxurious, tactile UI/UX interactions across mobile iOS/Android and desktop web, maintaining our Emerald Luxury design standards.',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Mobile First'],
  },
  {
    id: 'ops-lead-mumbai',
    department: 'Operations & Trust',
    title: 'City Ground Operations Lead (Mumbai)',
    location: 'Mumbai (On-ground & BKC)',
    type: 'Full-time',
    experience: '3-5 Years',
    desc: 'Lead our fleet of property verification specialists, manage owner onboarding pipelines, and guarantee 100% physical authenticity of listings.',
    skills: ['Operations Management', 'Vendor Relations', 'Quality Assurance'],
  },
  {
    id: 'growth-lead',
    department: 'Growth & Marketing',
    title: 'Growth Marketing Manager',
    location: 'BKC, Mumbai',
    type: 'Full-time',
    experience: '3-5 Years',
    desc: 'Scale tenant and flatmate acquisition across key Mumbai clusters through performance marketing, community campaigns, and SEO.',
    skills: ['Performance Marketing', 'SEO', 'Data Analytics', 'Brand Partnerships'],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto mb-6">
          <Breadcrumb items={[{ name: 'Careers', url: '/careers' }]} />
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFBF1]/15 text-[#CCFBF1] text-xs font-bold uppercase tracking-wider mb-6 border border-[#CCFBF1]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            We Are Hiring in Mumbai
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Build the Future of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-mint">
              Urban Living
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            We are ending broker harassment, opaque pricing, and wasted deposits. Join an obsessive crew of builders reimagining how Mumbai rents, lives, and thrives.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#open-roles"
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-emerald-600 text-white font-bold px-7 py-3.5 rounded-full text-sm transition shadow-lg shadow-emerald-950/40"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Open Roles ({OPEN_ROLES.length})</span>
            </a>
            <a
              href="#culture"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-sm transition backdrop-blur-sm border border-white/15"
            >
              <span>Our Culture & Perks</span>
            </a>
          </div>
        </div>
      </section>

      {/* Perks & Culture Grid */}
      <section id="culture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
            Life at REHVO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#031B2A] tracking-tight mt-3">
            Crafted for High Performers
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2">
            We treat our team the way we treat our customers: with radical transparency, high trust, and unmatched care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#031B2A]">{perk.title}</h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
              Opportunities
            </span>
            <h2 className="text-3xl font-black text-[#031B2A] tracking-tight mt-2">
              Current Openings
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Find the role that matches your superpowers and help us scale across India.
            </p>
          </div>
          <div className="text-xs text-[#64748B]">
            Showing <span className="font-bold text-[#031B2A]">{OPEN_ROLES.length} positions</span> in Mumbai
          </div>
        </div>

        <div className="space-y-4">
          {OPEN_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:border-[#0F766E]/40 hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F766E] border border-emerald-100">
                      {role.department}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                      {role.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#031B2A]">{role.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
                    {role.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>{role.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{role.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:self-center shrink-0">
                  <a
                    href={`mailto:careers@rehvo.in?subject=Application for ${encodeURIComponent(role.title)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-sm"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General Application Callout */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-[#031B2A] rounded-[28px] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Send className="w-3.5 h-3.5" />
              Spontaneous Application
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Don&apos;t see your specific role listed?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
              We are constantly seeking brilliant operators, frontend perfectionists, and community catalysts. Drop your CV and portfolio link directly to our founding team.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="mailto:careers@rehvo.in?subject=Spontaneous Application - REHVO"
                className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-sm"
              >
                <span>Email careers@rehvo.in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/about"
                className="text-xs text-emerald-200 hover:text-white font-semibold underline underline-offset-4"
              >
                Read our story & values &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
