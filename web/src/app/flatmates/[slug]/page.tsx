import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Users,
  MapPin,
  Wallet,
  Home,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  MessageCircle,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { getPublishedFlatmates, getFlatmateById } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { FlatmateProfileCard } from '@/components/flatmates/FlatmateProfileCard';
import { FlatmatesContainer } from '@/components/flatmates/FlatmatesContainer';
import { unslugify } from '@/lib/seo/slugs';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const revalidate = 60;

interface FlatmatesDynamicPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: FlatmatesDynamicPageProps): Promise<Metadata> {
  const flatmate = await getFlatmateById(params.slug);
  if (flatmate) {
    return constructSeoMetadata({
      title: `${flatmate.name} (${flatmate.profession}) - Flatmate in ${flatmate.locality}, Mumbai | REHVO`,
      description: `Connect with ${flatmate.name} looking for a ${flatmate.room_preference.replace('_', ' ')} in ${flatmate.locality}, Mumbai. Budget: ₹${flatmate.budget_max}/mo. Verified profiles on REHVO.`,
      canonicalUrl: `https://rehvo.in/flatmates/${params.slug}`,
    });
  }

  if (params.slug === 'female-flatmates-in-mumbai') {
    return constructSeoMetadata({
      title: 'Female Flatmates & Roommates in Mumbai | Verified Girls-Only Flats | REHVO',
      description:
        'Find verified female flatmates and women-friendly shared apartments in Mumbai. Connect with working professional women and students with verified profiles and zero brokerage.',
      canonicalUrl: 'https://rehvo.in/flatmates/female-flatmates-in-mumbai',
    });
  }

  const cityName = unslugify(params.slug);
  return constructSeoMetadata({
    title: `Verified Flatmates & Roommates in ${cityName} | Verified Marketplace | REHVO`,
    description: `Connect with verified working professionals and students looking for flatmates and shared apartments in ${cityName}. Verified flatmate discovery on REHVO.`,
    canonicalUrl: `https://rehvo.in/flatmates/${params.slug.toLowerCase()}`,
  });
}

export default async function FlatmatesDynamicPage({ params }: FlatmatesDynamicPageProps) {
  // 1. Check if slug matches a flatmate profile ID
  const flatmate = await getFlatmateById(params.slug);

  if (flatmate) {
    const allFlatmates = await getPublishedFlatmates('Mumbai');
    const similarFlatmates = allFlatmates
      .filter((f) => f.id !== flatmate.id)
      .slice(0, 3);

    const roomLabel =
      flatmate.room_preference === 'private_room'
        ? 'Private Room'
        : flatmate.room_preference === 'shared_room'
        ? 'Shared Room'
        : 'Any Room Type';

    const chatUrl = `/chat?to=${flatmate.user_id || flatmate.id}&name=${encodeURIComponent(flatmate.name)}&context=${encodeURIComponent('Flatmate inquiry for ' + flatmate.locality)}`;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/flatmates"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#031B2A] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Flatmates</span>
        </Link>

        {/* Master Profile Card */}
        <div className="rehvo-glass-card rounded-[32px] p-6 sm:p-10 border border-white/80 shadow-xl space-y-8">
          {/* Header Portrait & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-6 border-b border-stone-200/80">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-[24px] overflow-hidden bg-[#F1F5F9] border-2 border-white shadow-md shrink-0">
              <RehvoImage
                src={flatmate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
                alt={flatmate.name}
                fill
                priority
                fallbackCategory="flatmate"
                className="object-cover"
                sizes="144px"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#3C8D68] text-[11px] font-black">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Flatmate Profile</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
                  {flatmate.name}{flatmate.age ? `, ${flatmate.age}` : ''}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-[#3C8D68] shrink-0 hidden sm:inline-block" />
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#64748B] flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase className="w-4 h-4 text-[#64748B]" />
                <span>{flatmate.profession}</span>
              </p>

              <p className="text-xs sm:text-sm font-bold text-[#031B2A] flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <span>Looking in {flatmate.locality}, {flatmate.city}</span>
              </p>
            </div>
          </div>

          {/* Key Co-living Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/70 shadow-2xs">
              <span className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                Max Budget
              </span>
              <span className="text-sm sm:text-base font-black text-[#031B2A]">
                ₹{flatmate.budget_max.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/70 shadow-2xs">
              <span className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                Room Preference
              </span>
              <span className="text-sm sm:text-base font-black text-[#031B2A] truncate block">
                {roomLabel}
              </span>
            </div>

            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/70 shadow-2xs">
              <span className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                Move-in Date
              </span>
              <span className="text-sm sm:text-base font-black text-[#031B2A] truncate block">
                {flatmate.move_in_date || 'Immediate'}
              </span>
            </div>

            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/70 shadow-2xs">
              <span className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                Compatibility
              </span>
              <span className="text-sm sm:text-base font-black text-[#3C8D68] flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>94% Match</span>
              </span>
            </div>
          </div>

          {/* Bio / About */}
          {flatmate.bio && (
            <div className="space-y-2">
              <h3 className="text-xs font-black text-[#031B2A] uppercase tracking-wider">
                About Me
              </h3>
              <p className="text-xs sm:text-sm text-[#031B2A] font-semibold leading-relaxed bg-white/50 p-4 rounded-2xl border border-white/60">
                {flatmate.bio}
              </p>
            </div>
          )}

          {/* Lifestyle & Routine Tags */}
          {flatmate.lifestyle_preferences && flatmate.lifestyle_preferences.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Lifestyle, Habits & Routine
              </h3>
              <div className="flex flex-wrap gap-2">
                {flatmate.lifestyle_preferences.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#EBF5F0] text-[#3C8D68] text-xs font-black px-3.5 py-1.5 rounded-xl border border-[#3C8D68]/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3C8D68]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Action Bar: Save + Chat */}
          <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/download"
              className="w-full sm:flex-1 h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with {flatmate.name.split(' ')[0]} on REHVO App</span>
            </Link>

            <Link
              href="/flatmates"
              className="w-full sm:w-auto h-12 px-6 rounded-full rehvo-glass-subtle text-[#031B2A] font-black text-xs flex items-center justify-center transition hover:bg-white cursor-pointer"
            >
              <span>Explore More Flatmates</span>
            </Link>
          </div>
        </div>

        {/* Similar Flatmates Section */}
        {similarFlatmates.length > 0 && (
          <section className="space-y-4 pt-6">
            <h3 className="text-lg font-black text-[#031B2A] tracking-tight">
              Similar Flatmates Looking in Mumbai
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarFlatmates.map((item) => (
                <FlatmateProfileCard key={item.id} flatmate={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 2. Otherwise render Directory View
  const isFemaleIntent = params.slug === 'female-flatmates-in-mumbai';
  const cityName = isFemaleIntent ? 'Mumbai' : unslugify(params.slug);
  const rawFlatmates = await getPublishedFlatmates(cityName);
  const flatmates = isFemaleIntent ? rawFlatmates.filter((f) => f.gender === 'female') : rawFlatmates;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <FlatmatesContainer initialFlatmates={flatmates} />
    </div>
  );
}
