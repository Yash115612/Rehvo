'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Shield,
  Bell,
  Trash2,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { deleteAccount } from '@/services/profile';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const [supabase] = useState(() => createClient());

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/settings');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    if (!user) return;

    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteAccount(user.id);
    setIsDeleting(false);

    if (res.success) {
      await signOut();
      router.push('/');
    } else {
      setDeleteError(res.error || 'Failed to delete account.');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
          Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your login credentials, notifications, and security settings.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Account Credentials</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-stone-500">Registered Email</label>
          <p className="text-sm font-extrabold text-stone-900 mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <span>Change Password</span>
        </h3>

        {passwordSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading || !newPassword}
            className="bg-stone-900 hover:bg-black text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200 space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-extrabold">Danger Zone</h3>
        </div>

        <p className="text-xs text-rose-600 leading-relaxed">
          Permanently delete your REHVO account and associated profile data. This will remove your saved properties, active listings, flatmate profile, and message history. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account</span>
        </button>
      </div>

      {/* DELETION CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-stone-900">Delete Account</h3>
              <p className="text-xs text-stone-500 mt-1">
                Please type <strong className="text-rose-600">DELETE</strong> below to permanently delete your account.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {deleteError}
              </div>
            )}

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase"
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="py-3 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || deleteConfirmText.toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="py-3 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
