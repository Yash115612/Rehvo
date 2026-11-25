'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { useAuth } from '@/lib/auth/AuthContext';
import { Smartphone, AlertCircle } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextUrl = searchParams.get('next') || searchParams.get('return_to') || '/profile';

  // If already authenticated on web, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextUrl);
    }
  }, [isAuthenticated, nextUrl, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: authErr } = await signInWithGoogle(nextUrl);
      if (authErr) {
        setError(authErr.message || 'Unable to connect to Google. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Google sign-in could not be initiated.');
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#031B2A] tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Join verified owners and renters across Mumbai with direct connections.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <SocialAuth
          onGoogleClick={handleGoogleSignIn}
          isLoading={loading}
          actionText="Continue with Google"
        />

        {/* Already have an account */}
        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#0F766E] hover:underline">
            Sign In →
          </Link>
        </div>

        {/* Mobile App Download Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
            <Smartphone className="w-4 h-4 text-[#F97316]" />
            <span>Prefer the mobile experience?</span>
          </div>
          <p className="text-[12px] text-slate-500 leading-normal">
            Download the REHVO mobile app for iOS and Android to explore verified rentals, schedule visits, and chat directly.
          </p>
          <Link
            href="/download"
            className="inline-flex text-xs font-bold text-[#0F766E] hover:underline pt-1"
          >
            Get REHVO Mobile App →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthLayout backHref="/" backLabel="Back to REHVO">
      <Suspense fallback={<div className="lg:col-span-7 p-10 flex items-center justify-center">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
