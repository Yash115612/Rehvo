'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Smartphone,
  Mail,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type VerificationState =
  | 'loading'
  | 'success'
  | 'already_verified'
  | 'expired'
  | 'invalid'
  | 'error';

// Standard RFC 5322 compliant email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates format of an email address.
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  return EMAIL_REGEX.test(clean);
}

/**
 * Normalizes email address by trimming whitespace and converting to lowercase.
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Resolves the canonical authentication redirect URL.
 * In local development, preserves localhost and port.
 * In production, strictly returns 'https://rehvo.in/auth/callback'
 * to match the whitelisted Supabase Redirect URLs configuration.
 */
function getCanonicalRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return `${origin}/auth/callback`;
    }
  }
  return 'https://rehvo.in/auth/callback';
}

/**
 * Safely verifies if active session user matches the email identity from the verification link.
 * Prevents shared-device sessions from erroneously presenting "Already Verified".
 */
function isSessionMatchingLink(sessionEmail: string | undefined | null, linkEmail: string | null): boolean {
  if (!sessionEmail || !linkEmail) return false;
  return sessionEmail.trim().toLowerCase() === linkEmail.trim().toLowerCase();
}

export default function AuthCallbackPage() {
  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend state for expired link
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasExecutedRef = useRef(false);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    let isMounted = true;

    async function handleVerification() {
      // Prevent duplicate execution from StrictMode or rapid re-renders
      if (hasExecutedRef.current) return;
      hasExecutedRef.current = true;
      try {
        const supabase = createClient();

        // 1. Check URL search parameters (?code=... or ?token_hash=... or ?error=...)
        const searchParams = new URLSearchParams(window.location.search);
        let code = searchParams.get('code');
        let tokenHash = searchParams.get('token_hash');
        let type = searchParams.get('type') || 'signup';
        let error = searchParams.get('error');
        let errorCode = searchParams.get('error_code');
        let errorDesc = searchParams.get('error_description');
        let emailParam = searchParams.get('email');

        // 2. Check URL hash fragments (#access_token=... or #error=...)
        let accessToken: string | null = null;
        let refreshToken: string | null = null;
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (!code && hashParams.get('code')) code = hashParams.get('code');
          if (!tokenHash && hashParams.get('token_hash')) tokenHash = hashParams.get('token_hash');
          if (hashParams.get('type')) type = hashParams.get('type')!;
          if (!accessToken && hashParams.get('access_token')) accessToken = hashParams.get('access_token');
          if (!refreshToken && hashParams.get('refresh_token')) refreshToken = hashParams.get('refresh_token');
          if (!error && hashParams.get('error')) error = hashParams.get('error');
          if (!errorCode && hashParams.get('error_code')) errorCode = hashParams.get('error_code');
          if (!errorDesc && hashParams.get('error_description')) errorDesc = hashParams.get('error_description');
          if (!emailParam && hashParams.get('email')) emailParam = hashParams.get('email');
        }

        // Auto-prefill email in resend box if present in URL
        if (emailParam && isValidEmail(emailParam) && isMounted) {
          setResendEmail(sanitizeEmail(emailParam));
        }

        // Helper: Ensure profile row exists in public.profiles upon successful verification
        const reconcileUserProfile = async () => {
          try {
            const { data: authData, error: userError } = await supabase.auth.getUser();
            if (userError || !authData?.user) {
              if (userError) {
                console.warn('[AuthCallback] User lookup failed during reconciliation:', userError.message);
              }
              return;
            }

            const u = authData.user;
            const { data: existingProfile, error: selectError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', u.id)
              .maybeSingle();

            if (selectError) {
              console.warn('[AuthCallback] Profile check query failed:', selectError.message);
              return;
            }

            if (!existingProfile) {
              const fullName =
                u.user_metadata?.full_name ||
                u.user_metadata?.name ||
                u.email?.split('@')[0] ||
                'REHVO Member';
              const role = (u.user_metadata?.role || 'renter').toLowerCase();
              const phone = u.user_metadata?.phone || null;
              const city = u.user_metadata?.city || 'Mumbai';

              const { error: insertError } = await supabase.from('profiles').insert({
                id: u.id,
                full_name: fullName,
                email: u.email,
                phone,
                role,
                city,
                onboarding_completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

              if (insertError) {
                // Log safe diagnostic message without exposing personal data or credentials
                console.warn(
                  '[AuthCallback] Initial profile insertion reported error:',
                  insertError.code || insertError.message || 'Insert error'
                );
              }
            }
          } catch (err: any) {
            console.warn(
              '[AuthCallback] Unexpected error during profile reconciliation:',
              err?.message || 'Reconciliation failed'
            );
          }
        };

        // 3. Handle explicit errors from Supabase
        if (error || errorCode || errorDesc) {
          const codeLower = (errorCode || '').toLowerCase();
          const descLower = (errorDesc || error || '').toLowerCase();

          // Prioritize expired state
          if (codeLower === 'otp_expired' || descLower.includes('expired')) {
            if (isMounted) {
              setState('expired');
              setErrorMessage('This verification link has expired.');
            }
            return;
          }

          // Only show already_verified if the link's email strictly matches active session
          if (emailParam && (descLower.includes('already') || codeLower.includes('already'))) {
            const { data: userCheck } = await supabase.auth.getUser();
            if (
              userCheck?.user?.email_confirmed_at &&
              isSessionMatchingLink(userCheck.user.email, emailParam)
            ) {
              if (isMounted) setState('already_verified');
              return;
            }
          }

          if (isMounted) {
            setState('error');
            setErrorMessage(errorDesc || 'The verification link is invalid or malformed.');
          }
          return;
        }

        // 4. PKCE Code Exchange Flow
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            const errLower = exchangeError.message.toLowerCase();

            if (errLower.includes('expired') || errLower.includes('otp_expired')) {
              if (isMounted) {
                setState('expired');
                setErrorMessage('This verification link has expired.');
              }
              return;
            }

            // Safe already-verified check: handles page refresh or already confirmed sessions
            const { data: userCheck } = await supabase.auth.getUser();
            if (
              userCheck?.user?.email_confirmed_at &&
              (!emailParam || isSessionMatchingLink(userCheck.user.email, emailParam))
            ) {
              if (isMounted) setState('already_verified');
              return;
            }

            if (isMounted) {
              setState('invalid');
              setErrorMessage(exchangeError.message);
            }
            return;
          }

          await reconcileUserProfile();
          if (isMounted) {
            setState('success');
          }
          return;
        }

        // 5. Token Hash OTP Verification Flow
        if (tokenHash) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (otpError) {
            const errLower = otpError.message.toLowerCase();

            if (errLower.includes('expired') || errLower.includes('otp_expired')) {
              if (isMounted) {
                setState('expired');
                setErrorMessage('This verification link has expired.');
              }
              return;
            }

            // Safe already-verified check: handles page refresh or already confirmed sessions
            const { data: userCheck } = await supabase.auth.getUser();
            if (
              userCheck?.user?.email_confirmed_at &&
              (!emailParam || isSessionMatchingLink(userCheck.user.email, emailParam))
            ) {
              if (isMounted) setState('already_verified');
              return;
            }

            if (isMounted) {
              setState('invalid');
              setErrorMessage(otpError.message);
            }
            return;
          }

          await reconcileUserProfile();
          if (isMounted) {
            setState('success');
          }
          return;
        }

        // 6. Implicit Grant Fragment Flow (#access_token=...&refresh_token=...)
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            if (emailParam) {
              const { data: userCheck } = await supabase.auth.getUser();
              if (
                userCheck?.user?.email_confirmed_at &&
                isSessionMatchingLink(userCheck.user.email, emailParam)
              ) {
                if (isMounted) setState('already_verified');
                return;
              }
            }

            if (isMounted) {
              setState('invalid');
              setErrorMessage(sessionError.message);
            }
            return;
          }

          await reconcileUserProfile();
          if (isMounted) {
            setState('success');
          }
          return;
        }

        // 7. Check if user already has an active verified session
        const { data: activeUserCheck } = await supabase.auth.getUser();
        if (activeUserCheck?.user?.email_confirmed_at && isMounted) {
          setState('already_verified');
          return;
        }

        // 8. No credentials in URL -> show invalid state
        if (isMounted) {
          setState('invalid');
          setErrorMessage('No verification credentials detected in link. Please click the link sent to your email.');
        }
      } catch (err: any) {
        if (isMounted) {
          setState('error');
          setErrorMessage(err?.message || 'An unexpected verification error occurred.');
        }
      }
    }

    handleVerification();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resendCooldown > 0 || isResending) return;

    const clean = sanitizeEmail(resendEmail);
    if (!isValidEmail(clean)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const redirectUrl = getCanonicalRedirectUrl();

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: clean,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setResendSuccess(true);
        setResendCooldown(60);
      }
    } catch {
      setErrorMessage('Failed to send verification email. Please check your network connection.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col justify-center items-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10 text-center">
        {/* REHVO Logo Branding */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-32 h-9 mb-1.5">
            <Image
              src="/rehvo-logo.png"
              alt="REHVO Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F97316]">
            Renting Made Simple!
          </span>
        </div>

        {/* ── 1. LOADING STATE ──────────────────────────────────── */}
        {state === 'loading' && (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#0B1F3A] animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-[#0B1F3A] mb-2 tracking-tight">
              Verifying your email...
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Please wait while we verify your REHVO account credentials.
            </p>
          </div>
        )}

        {/* ── 2. SUCCESS STATE ──────────────────────────────────── */}
        {state === 'success' && (
          <div className="py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <CheckCircle className="w-9 h-9" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F3A] mb-2 tracking-tight">
              Email Verified Successfully
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-xs">
              Your email address has been verified. You can now log into your REHVO account.
            </p>

            {/* Clear, transparent Mobile App guidance (No fake session handoff) */}
            <div className="w-full p-4 mb-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                <Smartphone className="w-4 h-4 text-[#F97316]" />
                <span>Using the REHVO Mobile App?</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-normal">
                Your email is confirmed. Open the REHVO app and sign in with your email and password to access your account.
              </p>
            </div>

            <div className="w-full space-y-3">
              <a
                href="rehvo://(auth)/login?verified=true"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[#071529] transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open App & Sign In</span>
              </a>

              <Link
                href="/profile"
                className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue on Web</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        )}

        {/* ── 3. ALREADY VERIFIED STATE ─────────────────────────── */}
        {state === 'already_verified' && (
          <div className="py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <CheckCircle className="w-9 h-9" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F3A] mb-2 tracking-tight">
              Email Already Verified
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-xs">
              Your email address has already been confirmed. You can sign in anytime.
            </p>

            {/* Mobile App guidance */}
            <div className="w-full p-4 mb-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                <Smartphone className="w-4 h-4 text-[#F97316]" />
                <span>Using the REHVO Mobile App?</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-normal">
                Open the REHVO app and sign in with your email and password to access your account.
              </p>
            </div>

            <div className="w-full space-y-3">
              <a
                href="rehvo://(auth)/login?verified=true"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[#071529] transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open App & Sign In</span>
              </a>

              <Link
                href="/profile"
                className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue on Web</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        )}

        {/* ── 4. EXPIRED LINK STATE ─────────────────────────────── */}
        {state === 'expired' && (
          <div className="py-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
              <Clock className="w-9 h-9" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F3A] mb-2 tracking-tight">
              Verification Link Expired
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-xs">
              This verification link has expired. Verification links are time-limited for your security.
            </p>

            {resendSuccess && (
              <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-left flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>A new verification email has been sent! Please check your inbox.</span>
              </div>
            )}

            {errorMessage && !resendSuccess && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResendSubmit} className="w-full text-left mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Enter your email address
              </label>
              <div className="relative mb-3">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <button
                type="submit"
                disabled={resendCooldown > 0 || isResending}
                className="w-full py-3 px-6 rounded-xl bg-[#0B1F3A] disabled:bg-slate-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {isResending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Verification Email'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* ── 5. ERROR / INVALID STATE ──────────────────────────── */}
        {(state === 'error' || state === 'invalid') && (
          <div className="py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5">
              <AlertCircle className="w-9 h-9" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F3A] mb-2 tracking-tight">
              Verification Failed
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xs">
              {errorMessage || 'The verification link is invalid, corrupted, or has already been used.'}
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  setState('expired');
                  setErrorMessage(null);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[#071529] transition-colors"
              >
                <span>Request New Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/"
                className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
