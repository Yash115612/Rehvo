'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#050505] text-[#0F172A] dark:text-white select-none transition-colors duration-200">
      {/* 1. Left Persistent & Mobile Responsive Sidebar */}
      <AdminSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Work Area (Header + Scrollable Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64">
        <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#F8FAFC] dark:bg-[#050505] transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
