'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building,
  PlusCircle,
  Pause,
  Play,
  Trash2,
  Edit3,
  Loader2,
  Eye,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getMyProperties,
  updatePropertyStatus,
  deleteProperty,
} from '@/services/properties';
import { Property } from '@/lib/types';

export default function OwnerPropertiesListPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'paused'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/owner/properties');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getMyProperties(user.id);
        if (res.success && res.data) {
          setProperties(res.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleToggleStatus = async (prop: Property) => {
    if (!user) return;
    const nextStatus = prop.status === 'published' ? 'paused' : 'published';
    setActionLoadingId(prop.id);
    const res = await updatePropertyStatus(prop.id, user.id, nextStatus);
    setActionLoadingId(null);

    if (res.success) {
      setProperties((prev) =>
        prev.map((p) => (p.id === prop.id ? { ...p, status: nextStatus } : p))
      );
      await refreshUserData();
    } else {
      alert(res.error || 'Failed to update property status.');
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing?')) return;
    if (!user) return;

    setActionLoadingId(propertyId);
    const res = await deleteProperty(propertyId, user.id);
    setActionLoadingId(null);

    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      await refreshUserData();
    } else {
      alert(res.error || 'Failed to delete listing.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const filteredProperties = properties.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/owner"
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Property Listings ({properties.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl">
            {(['all', 'published', 'paused'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  filter === tab
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link
            href="/owner/properties/new"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <Building className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No {filter !== 'all' ? filter : ''} properties</h3>
          <p className="text-xs text-stone-500">
            List your Mumbai property to connect directly with verified renters with 0% brokerage.
          </p>
          <Link
            href="/owner/properties/new"
            className="inline-block bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md"
          >
            List a Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const cover =
              prop.property_images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';
            const isPublished = prop.status === 'published';

            return (
              <div
                key={prop.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-stone-100">
                    <img src={cover} alt={prop.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-stone-500">
                      ₹{prop.price.toLocaleString('en-IN')}/mo • {prop.locality}
                    </p>
                    <p className="text-xs text-stone-400">
                      {prop.bedrooms} BHK • {prop.bathrooms} Bath • {prop.area} sq.ft
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={actionLoadingId === prop.id}
                        onClick={() => handleToggleStatus(prop)}
                        className={`p-2 rounded-xl text-xs font-bold transition border ${
                          isPublished
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={isPublished ? 'Pause listing' : 'Resume listing'}
                      >
                        {isPublished ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <Link
                        href={`/owner/properties/${prop.id}/edit`}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                        title="Edit property"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        disabled={actionLoadingId === prop.id}
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      href={`/property/${prop.id}`}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <span>Public</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
