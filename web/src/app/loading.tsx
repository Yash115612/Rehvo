import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex items-center justify-center select-none overflow-hidden">
      {/* Subtle Ambient Emerald Aura behind Logo */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#0F766E]/20 via-[#2DD4BF]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Real Official REHVO Logo with Splash Animation */}
      <div className="relative animate-real-logo-splash flex items-center justify-center p-4">
        <Image
          src="/rehvo-logo.png"
          alt="REHVO"
          width={220}
          height={74}
          priority
          style={{ width: 'auto', maxHeight: '56px' }}
          className="h-11 sm:h-14 w-auto object-contain drop-shadow-sm select-none"
        />
      </div>
    </div>
  );
}
