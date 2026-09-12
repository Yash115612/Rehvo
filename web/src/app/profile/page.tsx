'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  CalendarCheck,
  Building2,
  Users,
  PlusCircle,
  LogOut,
  ShieldCheck,
  Edit3,
  Loader2,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ArrowRight,
  Home,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { updateProfile } from '@/services/profile';

export default function ProfileHubPage() {
  const router = useRouter();
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    savedPropertyIds,
    hasPublishedProperty,
    refreshProfile,
    signOut,
  } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/download');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || 'Mumbai');
      setLocality(profile.locality || '');
      setOccupation(profile.occupation || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#64748B]">Loading your REHVO profile...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const res = await updateProfile(
      user.id,
      {
        full_name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        locality: locality.trim(),
        occupation: occupation.trim(),
        bio: bio.trim(),
      },
      avatarFile
    );

    setIsSaving(false);
    if (!res.success) {
      setSaveError(res.error || 'Failed to update profile.');
      return;
    }

    setSaveSuccess(true);
    await refreshProfile();
    setTimeout(() => {
      setSaveSuccess(false);
      setEditModalOpen(false);
    }, 1200);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E2E8F0] shadow-card-hover relative overflow-hidden">
          {/* Ambient Background Scrim */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#CCFBF1]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Avatar circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-3xl sm:text-4xl font-black shadow-lg shadow-teal-900/15 overflow-hidden shrink-0 border-4 border-white">
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
                    <span>{profile?.verification_status === 'verified' ? 'Verified Member' : 'Member'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{user.email}</span>
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{profile.phone}</span>
                    </span>
                  )}
                  {profile?.locality && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{profile.locality}, {profile.city || 'Mumbai'}</span>
                    </span>
                  )}
                </div>

                {profile?.occupation && (
                  <div className="text-xs font-medium text-[#0F766E] flex items-center gap-1 pt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="flex-1 sm:flex-initial h-10 px-4 rounded-full bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="h-10 px-4 rounded-full bg-[#F8FAFC] hover:bg-rose-50 text-[#64748B] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-6 pt-6 border-t border-[#F1F5F9] text-xs text-[#475569] leading-relaxed">
              <p className="font-semibold text-[#031B2A] mb-1">About Me</p>
              <p>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/search"
            className="bg-white rounded-[26px] p-6 border border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#0F766E]/40 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Saved Homes</div>
              <div className="text-3xl font-black text-[#031B2A]">{savedPropertyIds.length}</div>
              <div className="text-[11px] text-[#0F766E] font-bold flex items-center gap-1 group-hover:underline">
                <span>Browse listings</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/list-property"
            className="bg-white rounded-[26px] p-6 border border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#0F766E]/40 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">List Property</div>
              <div className="text-xl font-black text-[#031B2A]">
                {hasPublishedProperty ? 'Active Listing' : 'Post Flat'}
              </div>
              <div className="text-[11px] text-[#0F766E] font-bold flex items-center gap-1 group-hover:underline">
                <span>Add new listing</span>
                <PlusCircle className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/flatmates"
            className="bg-white rounded-[26px] p-6 border border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#0F766E]/40 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Flatmates</div>
              <div className="text-xl font-black text-[#031B2A]">Find Roommates</div>
              <div className="text-[11px] text-[#0F766E] font-bold flex items-center gap-1 group-hover:underline">
                <span>Explore profiles</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Useful Quick Hub Links */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] rounded-[32px] p-8 text-white shadow-card-hover relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 rounded-full bg-white/15 text-[#CCFBF1] text-[10px] font-black uppercase tracking-wider">
              REHVO Marketplace
            </span>
            <h2 className="text-2xl font-black tracking-tight">Looking to list your property?</h2>
            <p className="text-xs text-[#CCFBF1]/90 max-w-lg font-medium">
              List your Mumbai flat, room, or commercial space in 2 minutes. Connect with verified tenants with transparent pricing.
            </p>
          </div>
          <Link
            href="/list-property"
            className="h-11 px-6 rounded-full bg-white hover:bg-[#CCFBF1] text-[#064E3B] text-xs font-black flex items-center gap-2 shadow-md transition shrink-0"
          >
            <span>List Property Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#94A3B8] hover:text-[#031B2A] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#031B2A]">Edit Your Profile</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Keep your personal and contact details updated.</p>
              </div>

              {saveError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                    Locality
                  </label>
                  <input
                    type="text"
                    value={locality}
                    placeholder="e.g. Bandra West"
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                  Occupation / Company
                </label>
                <input
                  type="text"
                  value={occupation}
                  placeholder="e.g. Software Engineer at Tech Corp"
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                  Bio / About
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell potential roommates or landlords a little about yourself..."
                  className="w-full p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#031B2A] focus:outline-none focus:border-[#0F766E] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[#64748B] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#CCFBF1] file:text-[#064E3B] hover:file:bg-[#99F6E4] cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
