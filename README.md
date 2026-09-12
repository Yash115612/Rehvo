<div align="center">

# REHVO
### India's Verified Rental Marketplace

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-000000.svg?style=flat-square&logo=next.dot.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth%20%2B%20RLS-3ECF8E.svg?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

</div>

---

## 🌟 Overview

**REHVO** is a modern verified rental ecosystem built for Mumbai and expanding across India. It connects prospective tenants directly with verified property owners, trusted brokers, flatmates, and institutional commercial spaces — eliminating hidden fees, fake listings, and unverified listings with transparent pricing and instant digital verification.

The platform consists of:
1. **Mobile Application** (iOS & Android) — Built with Expo SDK 54, React Native, and Expo Router.
2. **Public Web Application** — Modern, high-performance web experience built with Next.js 16 (App Router), Tailwind CSS, and Server Components.
3. **Admin & Operations Dashboard** — Next.js operational backoffice for verification workflows, listing moderation, and analytics.
4. **Backend Infrastructure** — Supabase PostgreSQL database, Row Level Security (RLS), real-time subscriptions, and Edge Functions.

---

## ✨ Key Features

- **100% Verified Listings**: Multi-point property verification with title deed validation and physical doorstep checks.
- **Transparent Pricing**: Complete breakdown of rent, deposit, and maintenance with zero hidden fees.
- **Direct Owner & Broker Communication**: End-to-end real-time chat with instant inquiry management.
- **Flatmate & Roommate Discovery**: Compatibility matching, lifestyle filters, and direct room discovery.
- **Commercial & PG Spaces**: Dedicated portals for co-living, student hostels, and corporate office leases.
- **Digital Lease & Agreement Vault**: Model Tenancy Act compliant lease drafting with digital signing.
- **AI Rental Concierge**: Context-aware neighborhood intelligence, commute estimations, and price guidance.
- **DigiLocker KYC & Gate Passes**: Instant identity verification and digital society visitor passes.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Mobile App** | React Native 0.81.5, Expo SDK 54, Expo Router v6, React Native Reanimated v4 |
| **Website** | Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons, Plus Jakarta Sans |
| **Admin Panel** | Next.js 16, Supabase SSR, Tailwind CSS, Recharts |
| **Backend & Auth** | Supabase (PostgreSQL 15), Supabase Auth, Row Level Security (RLS) |
| **Storage & Edge** | Supabase Storage (`property-images`, `profile-images`), Supabase Edge Functions |
| **Mapping & Location** | Google Maps Platform API, Expo Location, React Native Maps |

---

## 📁 Repository Structure

```
├── app/                  # Expo Router mobile screens & layouts
├── src/                  # Mobile application source code
│   ├── components/       # Native UI components (V4 Luxury Emerald design)
│   ├── services/         # Mobile business services (AI, maps, properties, chat)
│   ├── store/            # Global client state (Zustand)
│   └── types/            # Mobile TypeScript interfaces
├── web/                  # Next.js public website
│   ├── src/app/          # App router pages (Home, Search, PG, Commercial, Profile, Login)
│   ├── src/components/   # Web UI components & V10 landing sections
│   └── src/services/     # Web API & Supabase integration services
├── admin/                # Next.js Admin & Operations dashboard
├── supabase/             # Database migrations (001 to 042) & seed data
├── eas.json              # Expo Application Services configuration
└── vercel.json           # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli` (for native builds)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/rehvo.git
cd rehvo

# Install root (Mobile App) dependencies
npm install

# Install Web dependencies
cd web && npm install && cd ..

# Install Admin dependencies
cd admin && npm install && cd ..
```

### 2. Configure Environment Variables

Create `.env` in the root directory following `.env.example`:

```env
# Root (.env)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
APP_URL=rehvo://
```

Create `web/.env.local` inside the `web/` directory:

```env
# Web (web/.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Create `admin/.env.local` inside the `admin/` directory:

```env
# Admin (admin/.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💻 Development Commands

### Mobile App (Expo)

```bash
# Start Metro bundler with cache cleared
npm start

# Run on Android emulator / connected device
npm run android

# Run on iOS simulator (macOS required)
npm run ios

# Run web preview
npm run web

# TypeScript type check
npm run typecheck
```

### Web Application (Next.js)

```bash
# Start web development server on port 3001
npm run web:dev

# Typecheck web code
npm run web:typecheck

# Build web production bundle
npm run web:build
```

### Admin Control Panel

```bash
# Start admin development server on port 3000
npm run admin:dev

# Typecheck admin code
npm run admin:typecheck

# Build admin production bundle
npm run admin:build
```

---

## 🗄️ Supabase Setup

1. Create a project on [Supabase](https://supabase.com).
2. Run database migrations in sequential order from `supabase/migrations/`:
   - `001_core_schema.sql` (profiles, service cities)
   - `002_properties.sql` (property catalog)
   - `003_flatmates.sql` (flatmate profiles & discovery)
   - `009_rls_policies.sql` (Row Level Security)
   - `010_storage_buckets.sql` (property-images & profile-images storage)
3. Deploy Supabase Edge Functions:
   ```bash
   supabase functions deploy rehvo-ai
   ```

---

## 📱 EAS Build (Mobile Production)

Configure credentials with EAS CLI and build native artifacts:

```bash
# Android Preview APK
eas build --platform android --profile preview

# Android Production AAB (Google Play Store)
eas build --platform android --profile production

# iOS Production Build (Apple App Store)
eas build --platform ios --profile production
```

---

## 🌐 Deployment (Vercel)

### Web Application Deployment
The website can be deployed to Vercel by setting the root directory to `web` or linking via standard Vercel Next.js presets.

### Expo Web Deployment
For single-repository Expo Web builds, `vercel.json` is pre-configured with:
- **Build Command**: `npx expo export --platform web`
- **Output Directory**: `dist`

---

## 🔒 Security & Best Practices

- **Zero Hardcoded Secrets**: All keys, URLs, and secrets are strictly provided via runtime environment variables.
- **Edge Function Proxying**: Client applications never interact directly with third-party LLM APIs; all requests route securely through Supabase Edge Functions.
- **Row Level Security (RLS)**: Enforced across 100% of PostgreSQL tables to guarantee multi-tenant data isolation.
- **Strict Git Hygiene**: `.gitignore` prevents leaks of environment files, debug keystores, certificates, or local build artifacts.

---

## 📄 License

Proprietary — All rights reserved. © 2026 REHVO Technologies.
