'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';
import { trackLogin } from '@/lib/analytics';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  savedPropertyIds: string[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  hasPublishedProperty: boolean;
  hasFlatmateProfile: boolean;
  isSaved: (propertyId: string) => boolean;
  toggleSaveProperty: (propertyId: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [hasPublishedProperty, setHasPublishedProperty] = useState(false);
  const [hasFlatmateProfile, setHasFlatmateProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Profile, Saved Properties, Unread counts, and Capabilities
  const fetchUserData = useCallback(
    async (userId: string) => {
      try {
        const [
          profileRes,
          savedRes,
          notifRes,
          msgRes,
          propRes,
          flatmateRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('saved_properties').select('property_id').eq('user_id', userId),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).is('read_at', null),
          supabase.from('conversation_participants').select('unread_count').eq('user_id', userId),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('owner_id', userId).eq('status', 'published'),
          supabase.from('flatmate_profiles').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        ]);

        if (profileRes.data) {
          setProfile(profileRes.data as UserProfile);
        }

        if (savedRes.data) {
          setSavedPropertyIds(savedRes.data.map((item: any) => item.property_id));
        }

        if (notifRes.count !== null && notifRes.count !== undefined) {
          setUnreadNotificationsCount(notifRes.count);
        }

        if (msgRes.data) {
          const totalUnread = msgRes.data.reduce((sum: number, p: any) => sum + (p.unread_count || 0), 0);
          setUnreadMessagesCount(totalUnread);
        }

        if (propRes.count !== null && propRes.count !== undefined) {
          setHasPublishedProperty(propRes.count > 0);
        }

        if (flatmateRes.count !== null && flatmateRes.count !== undefined) {
          setHasFlatmateProfile(flatmateRes.count > 0);
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
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }; error: null }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null }, error: null }), 600)
        );
        const {
          data: { session: initialSession },
        } = await Promise.race([sessionPromise, timeoutPromise]);

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
        if (event === 'SIGNED_IN') {
          trackLogin({
            userId: newSession.user.id,
            method: newSession.user.app_metadata?.provider || 'phone',
            sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
          });
        }
        await fetchUserData(newSession.user.id);
      } else {
        setProfile(null);
        setSavedPropertyIds([]);
        setUnreadNotificationsCount(0);
        setUnreadMessagesCount(0);
        setHasPublishedProperty(false);
        setHasFlatmateProfile(false);
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

  const refreshUserData = async () => {
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
      setUnreadNotificationsCount(0);
      setUnreadMessagesCount(0);
      setHasPublishedProperty(false);
      setHasFlatmateProfile(false);
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
        unreadNotificationsCount,
        unreadMessagesCount,
        hasPublishedProperty,
        hasFlatmateProfile,
        isSaved,
        toggleSaveProperty,
        signOut,
        refreshProfile,
        refreshUserData,
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
