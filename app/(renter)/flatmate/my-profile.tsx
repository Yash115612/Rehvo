import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { MyFlatmateProfileScreen } from '../../../src/components/flatmates/MyFlatmateProfileScreen';
import { useAppStore, selectUserCapabilities } from '../../../src/store/useAppStore';

export default function MyFlatmateProfilePage() {
  const router = useRouter();
  const { user, properties, myFlatmateProfile, flatmateDraft } = useAppStore();

  const { hasFlatmateProfile } = selectUserCapabilities({
    user,
    properties,
    myFlatmateProfile,
    flatmateDraft,
  });

  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (hasFlatmateProfile) {
      isRedirectingRef.current = false;
    }
  }, [hasFlatmateProfile]);

  useEffect(() => {
    if (!hasFlatmateProfile && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace('/(renter)/flatmate/create');
    }
  }, [hasFlatmateProfile, router]);

  return <MyFlatmateProfileScreen />;
}
