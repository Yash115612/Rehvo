'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  MapPin,
  Wallet,
  Home,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Camera,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createFlatmateProfile, getMyFlatmateProfile } from '@/services/flatmates';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export default function CreateFlatmateProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'any' | 'other'>('male');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('Andheri West');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Andheri West', 'Bandra West']);
  const [budgetMin, setBudgetMin] = useState<number | ''>(15000);
  const [budgetMax, setBudgetMax] = useState<number | ''>(35000);
  const [roomPreference, setRoomPreference] = useState<'private_room' | 'shared_room' | 'any'>('private_room');
  const [moveInDate, setMoveInDate] = useState('Immediate');
  const [lifestyle, setLifestyle] = useState<string[]>(['Non-Smoker', 'Working Professional', 'Clean & Organized']);
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const LIFESTYLE_TAGS = [
    'Non-Smoker',
    'Vegetarian',
    'Early Bird',
    'Night Owl',
    'Pet Friendly',
    'Clean & Organized',
    'Working Professional',
    'Student',
    'Fitness Enthusiast',
    'Quiet Environment',
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/flatmates/create');
      return;
    }

    // Check if user already has a profile
    async function checkExisting() {
      if (user) {
        const res = await getMyFlatmateProfile(user.id);
        if (res.success && res.data) {
          router.push('/flatmates/profile');
        }
      }
    }

    if (user) {
      checkExisting();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleLifestyle = (tag: string) => {
    setLifestyle((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!profession.trim() || !locality.trim() || !budgetMax) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await createFlatmateProfile(
      user.id,
      {
        profession: profession.trim(),
        age: age ? Number(age) : undefined,
        gender,
        city: city.trim(),
        locality: locality.trim(),
        preferred_locations: preferredLocations,
        budget_min: budgetMin ? Number(budgetMin) : 0,
        budget_max: Number(budgetMax),
        room_preference: roomPreference,
        move_in_date: moveInDate,
        lifestyle_preferences: lifestyle,
        bio: bio.trim() || undefined,
      },
      photoFile
    );

    setIsSubmitting(false);

    if (res.success) {
      await refreshUserData();
      router.push('/flatmates/profile');
    } else {
      setErrorMsg(res.error || 'Failed to create Flatmate Profile.');
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
      {/* Progress Steps Header */}
      <div>
        <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
          Roommate Discovery Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Create Your Flatmate Profile
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Step {step} of 4 • {step === 1 ? 'Identity' : step === 2 ? 'Location & Budget' : step === 3 ? 'Lifestyle & Habits' : 'Bio & Photos'}
        </p>

        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-stone-900">1. Basic Identity</h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Your Profession / College *</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Software Engineer, Product Designer, MBA Student"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 25"
                  min={18}
                  max={99}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="any">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Budget */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-stone-900">2. Location & Budget</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-500 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Locality *</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {Object.values(MUMBAI_LOCALITIES).map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} ({loc.zone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Min Budget (₹)</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value ? Number(e.target.value) : '')}
                  placeholder="₹10,000"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Max Budget (₹) *</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                  placeholder="₹30,000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Room Preference</label>
                <select
                  value={roomPreference}
                  onChange={(e: any) => setRoomPreference(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="private_room">Private Room</option>
                  <option value="shared_room">Shared Room</option>
                  <option value="any">Any Room Type</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Move-in Availability</label>
                <select
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 15 Days">Within 15 Days</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Lifestyle & Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">3. Lifestyle & Habits</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select tags that best reflect your routine and roommate expectations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {LIFESTYLE_TAGS.map((tag) => {
                const isSelected = lifestyle.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleLifestyle(tag)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Bio & Photos */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">4. Bio & Profile Photo</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                A friendly photo and short bio will help prospective roommates connect with you.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">About You / Roommate Expectations</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your work schedule, cooking preferences, hobbies, or what kind of flatmate you're looking for..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Profile Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !profession.trim()) {
                  setErrorMsg('Please enter your profession or college.');
                  return;
                }
                setErrorMsg(null);
                setStep(step + 1);
              }}
              className="bg-stone-900 hover:bg-black text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition flex items-center gap-1.5 shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Publish Flatmate Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
