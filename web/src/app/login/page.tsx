'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextDestination = searchParams.get('next') || '/';
  const oauthError = searchParams.get('error');

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(nextDestination);
    }
  }, [isAuthenticated, authLoading, nextDestination, router]);

  useEffect(() => {
    if (oauthError) {
      setErrorMessage('Google sign-in could not be completed. Please try signing in with your email.');
    }
  }, [oauthError]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please check your credentials.');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          setErrorMessage('Please check your email and confirm your account before logging in.');
        } else if (error.message.toLowerCase().includes('rate limit')) {
          setErrorMessage('Too many sign-in attempts. Please wait a few minutes and try again.');
        } else {
          setErrorMessage('Unable to sign in right now. Please verify your details or try again later.');
        }
        return;
      }

      if (data?.user) {
        router.push(nextDestination);
      }
    } catch (err: any) {
      console.error('[Login] Exception:', err);
      setErrorMessage('A network error occurred. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextDestination)}`,
        },
      });

      if (error) {
        setErrorMessage('Unable to initialize Google Sign-In. Please try with your email.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage('Google sign-in is currently unavailable.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address above, then click "Forgot password?".');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage('Unable to send password reset instructions. Please check your email.');
      } else {
        setInfoMessage('Password reset link has been sent to your email.');
      }
    } catch {
      setErrorMessage('Unable to process password reset. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand Story & Value Proposition */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-900 to-purple-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                R
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                REHVO<span className="text-purple-400">.</span>
              </span>
            </Link>

            <div className="pt-4 space-y-3">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Mumbai Rentals
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Welcome back to transparent renting.
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Connect directly with verified homeowners, save 100% on brokerage fees, and manage your property visits seamlessly.
              </p>
            </div>

            <div className="space-y-3.5 pt-4 text-xs text-stone-300 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero middleman brokerage fees</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct chat with verified hosts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Saved homes synced across web & app</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-stone-400 relative z-10">
            © {new Date().getFullYear()} REHVO Real Estate Technologies.
          </div>
        </div>

        {/* Right Side: Clean Modern Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Enter your credentials to access saved homes and enquiries.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm py-3.5 px-4 rounded-2xl border border-stone-200 shadow-sm transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-xs text-stone-400 font-medium uppercase tracking-wider">
                or with email
              </span>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-600/10 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3 pl-10 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-600/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 hover:bg-black text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              Don&apos;t have a REHVO account?{' '}
              <Link
                href={`/signup?next=${encodeURIComponent(nextDestination)}`}
                className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
