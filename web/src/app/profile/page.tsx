'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  MessageSquare,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  Users,
  Settings,
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
    unreadMessagesCount,
    unreadNotificationsCount,
    hasPublishedProperty,
    hasFlatmateProfile,
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?next=/profile');
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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
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

    if (res.success) {
      await refreshProfile();
      setEditModalOpen(false);
    } else {
      setSaveError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {profile?.profile_photo ? (
            <img
              src={profile.profile_photo}
              alt={displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-200 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-stone-900 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
              {initial}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{displayName}</h1>
              {profile?.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>

            {profile?.phone && (
              <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{profile.phone}</span>
              </p>
            )}

            {profile?.occupation && (
              <p className="text-xs text-stone-600 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>{profile.occupation}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <Link
            href="/settings"
            className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Renter & Discovery Activity Hub */}
      <div>
        <h2 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-4">
          My Activity & Rental Hub
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/saved"
            className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-stone-900 block">{savedPropertyIds.length}</span>
            <span className="text-xs font-semibold text-stone-500">Saved Properties</span>
          </Link>

          <Link
            href="/enquiries"
            className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-stone-900 block">Enquiries</span>
            <span className="text-xs font-semibold text-stone-500">Sent to Owners</span>
          </Link>

          <Link
            href="/visits"
            className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-stone-900 block">Visits</span>
            <span className="text-xs font-semibold text-stone-500">Scheduled Tours</span>
          </Link>

          <Link
            href="/chat"
            className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-stone-900 block">
              {unreadMessagesCount > 0 ? `${unreadMessagesCount} Unread` : 'Inbox'}
            </span>
            <span className="text-xs font-semibold text-stone-500">Messages & Chat</span>
          </Link>
        </div>
      </div>

      {/* Host & Flatmate Command Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host / Owner Banner */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
              Host / Owner Hub
            </span>
            <LayoutDashboard className="w-5 h-5 text-stone-400" />
          </div>
          <h3 className="text-xl font-extrabold">List & Manage Properties</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Post vacant flats or rooms, review incoming tenant enquiries, schedule physical tours, and view real listing views with zero brokerage.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/owner"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Open Owner Dashboard
            </Link>
            <Link
              href="/owner/properties/new"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Property</span>
            </Link>
          </div>
        </div>

        {/* Flatmate Discovery Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">
              Roommate Community
            </span>
            <Users className="w-5 h-5 text-stone-400" />
          </div>
          <h3 className="text-xl font-extrabold text-stone-900">Flatmate Profile & Discovery</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Create your roommate profile, specify preferred Mumbai localities and budget limits, and connect with corporate professionals and students.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/flatmates/profile"
              className="bg-stone-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              {hasFlatmateProfile ? 'Manage My Flatmate Profile' : 'Create Flatmate Profile'}
            </Link>
            <Link
              href="/flatmates/mumbai"
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Browse Flatmates
            </Link>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900">Edit Profile</h3>
                <p className="text-xs text-stone-500 mt-0.5">Update your personal and contact details</p>
              </div>

              {saveError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Locality</label>
                  <input
                    type="text"
                    value={locality}
                    placeholder="e.g. Andheri West"
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Occupation / Company</label>
                <input
                  type="text"
                  value={occupation}
                  placeholder="e.g. Software Engineer, Student"
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bio / About</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Tell potential roommates or hosts a little about yourself..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
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
