'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  MapPin,
  Wallet,
  Home,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  Edit3,
  Loader2,
  Calendar,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getMyFlatmateProfile,
  updateFlatmateStatus,
  deleteFlatmateProfile,
} from '@/services/flatmates';
import { FlatmateProfile } from '@/lib/types';

export default function FlatmateProfileDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [profile, setProfile] = useState<FlatmateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/flatmates/profile');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getMyFlatmateProfile(user.id);
        if (res.success && res.data) {
          setProfile(res.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleToggleStatus = async () => {
    if (!user || !profile) return;
    const nextStatus = profile.status === 'published' ? 'paused' : 'published';
    setActionLoading(true);
    const res = await updateFlatmateStatus(user.id, nextStatus);
    setActionLoading(false);

    if (res.success) {
      setProfile((prev) => (prev ? { ...prev, status: nextStatus } : null));
      await refreshUserData();
    } else {
      alert(res.error || 'Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your Flatmate Profile?')) return;
    if (!user) return;

    setActionLoading(true);
    const res = await deleteFlatmateProfile(user.id);
    setActionLoading(false);

    if (res.success) {
      setProfile(null);
      await refreshUserData();
      router.push('/profile');
    } else {
      alert(res.error || 'Failed to delete profile.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900">No Flatmate Profile Found</h2>
        <p className="text-xs text-stone-600">
          Create a profile to connect with prospective roommates looking for flat sharing across Mumbai neighbourhoods.
        </p>
        <div className="pt-2">
          <Link
            href="/flatmates/create"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Flatmate Profile</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = profile.status === 'published';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with Status & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">
              Roommate Profile Management
            </span>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {profile.status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Flatmate Profile
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={actionLoading}
            onClick={handleToggleStatus}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border ${
              isPublished
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isPublished ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPublished ? 'Pause Profile' : 'Resume Profile'}</span>
          </button>

          <Link
            href={`/flatmates/${profile.id}`}
            className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition shadow-sm"
          >
            View Public Card
          </Link>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleDelete}
            className="p-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
            title="Delete profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Flatmate Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border border-stone-200 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-4xl">
              {profile.profession.charAt(0)}
            </div>
          )}

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {profile.profiles?.full_name || 'Flatmate'}
              {profile.age ? `, ${profile.age}` : ''}
            </h2>
            <p className="text-xs font-bold text-stone-500">{profile.profession}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-stone-600 font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                {profile.locality}, {profile.city}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-purple-600" />
                ₹{profile.budget_min.toLocaleString('en-IN')} - ₹{profile.budget_max.toLocaleString('en-IN')}/mo
              </span>
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-purple-600" />
                {profile.room_preference.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">About Me</span>
            <p className="text-xs text-stone-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Lifestyle Tags */}
        {profile.lifestyle_preferences && profile.lifestyle_preferences.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
              Lifestyle & Preferences
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.lifestyle_preferences.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
