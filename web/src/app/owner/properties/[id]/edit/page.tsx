'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getPropertyById, updateProperty } from '@/services/properties';
import { Property, FurnishingType } from '@/lib/types';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

interface EditPropertyPageProps {
  params: { id: string };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [deposit, setDeposit] = useState<number | ''>('');
  const [maintenance, setMaintenance] = useState<number | ''>(0);
  const [furnishing, setFurnishing] = useState<FurnishingType>('semi_furnished');
  const [parking, setParking] = useState('');
  const [availability, setAvailability] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

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
      router.push(`/login?next=/owner/properties/${params.id}/edit`);
      return;
    }

    async function loadData() {
      setLoading(true);
      const res = await getPropertyById(params.id);
      if (res.success && res.data) {
        setProperty(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
        setPrice(res.data.price);
        setDeposit(res.data.deposit || 0);
        setMaintenance(res.data.maintenance || 0);
        setFurnishing(res.data.furnishing);
        setParking(res.data.parking || '');
        setAvailability(res.data.availability || 'Immediate');
        setAmenities(res.data.amenities || []);
      }
      setLoading(false);
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, params.id, router]);

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !property) return;

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await updateProperty(property.id, user.id, {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      deposit: Number(deposit || 0),
      maintenance: Number(maintenance || 0),
      furnishing,
      parking,
      availability,
      amenities,
    });

    setIsSaving(false);

    if (res.success) {
      setSuccessMsg('Property listing updated successfully!');
      await refreshUserData();
      setTimeout(() => {
        router.push('/owner/properties');
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Failed to update property.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!property || property.owner_id !== user?.id) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Property Not Found</h2>
        <p className="text-xs text-stone-500">You do not have permission to edit this property.</p>
        <Link
          href="/owner/properties"
          className="inline-block bg-stone-900 text-white text-xs font-bold px-5 py-3 rounded-2xl"
        >
          Return to My Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Properties</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Edit Property Listing
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {property.locality}, {property.city} • {property.bedrooms} BHK {property.type}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Listing Headline / Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Monthly Rent (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
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
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Maintenance / Mo (₹)</label>
            <input
              type="number"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">Amenities</label>
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

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/owner/properties"
            className="px-5 py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-stone-900 hover:bg-black text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
