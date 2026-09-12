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
  AlertCircle,
  Loader2,
  Building2,
  User,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextDestination = searchParams.get('next') || '/profile';
  const oauthError = searchParams.get('error');

  const { isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [supabase] = useState(() => createClient());

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(nextDestination);
    }
  }, [isAuthenticated, authLoading, nextDestination, router]);

  useEffect(() => {
    if (oauthError) {
      setErrorMessage('Google sign-in could not be completed. Please try with your email address.');
    }
  }, [oauthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage('Please provide both email address and password.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please provide your full name.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              role: 'renter',
            },
          },
        });

        if (error) {
          setErrorMessage(error.message || 'Unable to create account. Please try again.');
          return;
        }

        if (data?.session) {
          await refreshUserData();
          router.push(nextDestination);
        } else if (data?.user) {
          setSuccessMessage('Account created! Please check your email to confirm your account, or sign in.');
          setMode('signin');
        }
      } catch (err: any) {
        console.error('[SignUp] Error:', err);
        setErrorMessage(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign in
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setErrorMessage('Invalid email or password. Please verify your credentials.');
          } else if (error.message.toLowerCase().includes('email not confirmed')) {
            setErrorMessage('Please check your email and confirm your account before logging in.');
          } else {
            setErrorMessage(error.message || 'Failed to sign in.');
          }
          return;
        }

        if (data?.user) {
          await refreshUserData();
          router.push(nextDestination);
        }
      } catch (err: any) {
        console.error('[SignIn] Error:', err);
        setErrorMessage('Unable to connect to service. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextDestination)}`,
        },
      });
      if (error) {
        setErrorMessage(error.message || 'Google sign-in failed.');
      }
    } catch (err: any) {
      console.error('[OAuth] Error:', err);
      setErrorMessage('Unable to initiate Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E2E8F0] shadow-card-hover p-6 sm:p-8 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#CCFBF1]/50 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-[#031B2A] tracking-tight">REHVO</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
            <span>Verified Rental Marketplace</span>
          </div>
          <h1 className="text-2xl font-black text-[#031B2A] tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your REHVO Account'}
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            {mode === 'signin'
              ? 'Sign in to access your saved homes, visits, and profile.'
              : 'Join Mumbai’s verified rental community in 30 seconds.'}
          </p>
        </div>

        {/* Toggle Mode Tab Pill */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#031B2A] shadow-xs'
                : 'text-[#64748B] hover:text-[#031B2A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#031B2A] shadow-xs'
                : 'text-[#64748B] hover:text-[#031B2A]'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 mb-4 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 mb-4 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Yash Vardhan"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
                  Phone (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E] focus:bg-white transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F766E] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] focus:outline-none focus:border-[#0F766E] focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to REHVO' : 'Create My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E8F0]" />
          </div>
          <span className="relative px-3 bg-white text-[11px] font-bold text-[#94A3B8] uppercase">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-11 rounded-2xl bg-white hover:bg-[#F8FAFC] text-[#031B2A] border border-[#E2E8F0] text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
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

        {/* Footer Note */}
        <p className="text-[11px] text-center text-[#64748B] mt-6">
          By continuing, you agree to REHVO’s{' '}
          <Link href="/terms" className="text-[#0F766E] font-bold hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#0F766E] font-bold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
