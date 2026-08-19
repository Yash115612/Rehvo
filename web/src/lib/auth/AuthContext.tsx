'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
  role?: 'renter' | 'owner';
  verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
  city?: string;
  locality?: string;
  user_type?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  savedPropertyIds: string[];
  isSaved: (propertyId: string) => boolean;
  toggleSaveProperty: (propertyId: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Profile & Saved Properties
  const fetchUserData = useCallback(
    async (userId: string) => {
      try {
        const [profileRes, savedRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('saved_properties').select('property_id').eq('user_id', userId),
        ]);

        if (profileRes.data) {
          setProfile(profileRes.data as UserProfile);
        }

        if (savedRes.data) {
          setSavedPropertyIds(savedRes.data.map((item: any) => item.property_id));
        }
      } catch (err) {
        console.warn('[AuthContext] Error fetching user data:', err);
      }
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            await fetchUserData(initialSession.user.id);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session init error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchUserData(newSession.user.id);
      } else {
        setProfile(null);
        setSavedPropertyIds([]);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserData]);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const isSaved = (propertyId: string) => {
    return savedPropertyIds.includes(propertyId);
  };

  const toggleSaveProperty = async (propertyId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    const alreadySaved = savedPropertyIds.includes(propertyId);

    // Optimistic UI update
    if (alreadySaved) {
      setSavedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
    } else {
      setSavedPropertyIds((prev) => [...prev, propertyId]);
    }

    try {
      if (alreadySaved) {
        await supabase
          .from('saved_properties')
          .delete()
          .match({ user_id: user.id, property_id: propertyId });
      } else {
        await supabase
          .from('saved_properties')
          .insert({ user_id: user.id, property_id: propertyId });
      }
      return true;
    } catch (err) {
      console.error('[AuthContext] toggleSaveProperty error:', err);
      // Revert optimistic update
      if (alreadySaved) {
        setSavedPropertyIds((prev) => [...prev, propertyId]);
      } else {
        setSavedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
      }
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setSavedPropertyIds([]);
    } catch (err) {
      console.error('[AuthContext] signOut error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthenticated: !!user,
        savedPropertyIds,
        isSaved,
        toggleSaveProperty,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
