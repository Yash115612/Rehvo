'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building,
  MapPin,
  Maximize2,
  Wallet,
  Zap,
  Check,
  Plus,
  Trash2,
  Camera,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createProperty } from '@/services/properties';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';
import { PropertyType, FurnishingType } from '@/lib/types';

export default function CreatePropertyListingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<PropertyType>('flat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [deposit, setDeposit] = useState<number | ''>('');
  const [maintenance, setMaintenance] = useState<number | ''>(0);
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('Andheri West');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState(2);
  const [area, setArea] = useState<number | ''>(850);
  const [furnishing, setFurnishing] = useState<FurnishingType>('semi_furnished');
  const [parking, setParking] = useState('1 Covered');
  const [availability, setAvailability] = useState('Immediate');
  const [amenities, setAmenities] = useState<string[]>([
    'lift',
    'security_24x7',
    'power_backup',
    'wifi',
  ]);

  // Image Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const AMENITY_OPTIONS = [
    { id: 'lift', label: 'Elevator / Lift' },
    { id: 'security_24x7', label: '24x7 Security & Guard' },
    { id: 'power_backup', label: 'Power Backup' },
    { id: 'wifi', label: 'High-Speed Wi-Fi' },
    { id: 'air_conditioning', label: 'Air Conditioning (AC)' },
    { id: 'car_parking', label: 'Reserved Car Parking' },
    { id: 'gym', label: 'Fitness Center / Gym' },
    { id: 'swimming_pool', label: 'Swimming Pool' },
    { id: 'clubhouse', label: 'Clubhouse' },
    { id: 'gas_pipeline', label: 'Piped Gas Connection' },
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/owner/properties/new');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitListing = async () => {
    if (!user) return;
    if (!title.trim() || !address.trim() || !price) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await createProperty(
      user.id,
      {
        type,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        deposit: Number(deposit || 0),
        maintenance: Number(maintenance || 0),
        city: city.trim(),
        locality: locality.trim(),
        address: address.trim(),
        bedrooms: String(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area || 0),
        furnishing,
        parking,
        availability,
        amenities,
      },
      imageFiles,
      'published'
    );

    setIsSubmitting(false);

    if (res.success && res.data) {
      await refreshUserData();
      router.push(`/property/${res.data.id}`);
    } else {
      setErrorMsg(res.error || 'Failed to publish property listing.');
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
      {/* Wizard Header */}
      <div>
        <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
          Property Listing Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          List Your Property on REHVO
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Step {step} of 5 • {step === 1 ? 'Type & Location' : step === 2 ? 'Specs & Furnishing' : step === 3 ? 'Pricing (Zero Brokerage)' : step === 4 ? 'Amenities & Description' : 'Upload Photos & Publish'}
        </p>

        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Wizard Form Surface */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        {/* STEP 1: Type & Location */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Select Property Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'flat', label: 'Full Apartment' },
                  { id: 'room', label: 'Private Room' },
                  { id: 'pg', label: 'PG / Co-Living' },
                  { id: 'studio', label: 'Studio Flat' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as PropertyType)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition text-center ${
                      type === t.id
                        ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Listing Headline / Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious 2 BHK with Sea View in Bandra West"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

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
                <label className="block text-xs font-bold text-stone-700 mb-1">Locality *</label>
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

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Building Name & Full Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 602, Sea Green Heights, Off Link Road"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Specs & Furnishing */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-stone-900">2. Specs & Layout</h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bedrooms (BHK)</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bathrooms</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value={1}>1 Bath</option>
                  <option value={2}>2 Baths</option>
                  <option value={3}>3 Baths</option>
                  <option value={4}>4+ Baths</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Area (sq.ft)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 850"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Furnishing State</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'fully_furnished', label: 'Fully Furnished' },
                  { id: 'semi_furnished', label: 'Semi-Furnished' },
                  { id: 'unfurnished', label: 'Unfurnished' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFurnishing(f.id as FurnishingType)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition text-center ${
                      furnishing === f.id
                        ? 'bg-purple-50 border-purple-600 text-purple-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Parking</label>
                <input
                  type="text"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  placeholder="e.g. 1 Covered, Bike only, None"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 15 Days">Within 15 Days</option>
                  <option value="Next Month">Next Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">3. Monthly Rent & Terms</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Zero brokerage platform — tenants pay 100% directly to you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 45000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 100000"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Maintenance / Mo (₹)</label>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0 if included"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Description & Amenities */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">4. Amenities & Description</h3>
              <p className="text-xs text-stone-500 mt-0.5">Highlight unique features of your property.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Property Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention natural sunlight, proximity to metro station, modern fittings, society rules..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Available Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AMENITY_OPTIONS.map((item) => {
                  const isChecked = amenities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center gap-2 ${
                        isChecked
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isChecked
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Photos & Publish */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">5. Property Photos</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload real photos of your flat. Verified photos receive 3x more visit bookings.
              </p>
            </div>

            <div className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center space-y-3 bg-stone-50/50">
              <Camera className="w-10 h-10 text-purple-600 mx-auto" />
              <div>
                <label className="cursor-pointer bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-2xl inline-block shadow-sm transition">
                  <span>Select Property Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-stone-400">PNG, JPG, WEBP up to 10MB each</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls */}
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

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!title.trim() || !address.trim())) {
                  setErrorMsg('Please provide a listing title and full address.');
                  return;
                }
                if (step === 3 && !price) {
                  setErrorMsg('Please specify the monthly rent.');
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
              onClick={handleSubmitListing}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Publish Listing (Free)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
