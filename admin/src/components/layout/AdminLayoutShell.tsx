'use client';

import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-canvas text-brand-dark">
      {/* 1. Left Persistent Sidebar */}
      <AdminSidebar />

      {/* 2. Main Work Area (Header + Scrollable Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
