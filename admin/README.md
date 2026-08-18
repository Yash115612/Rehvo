# REHVO Web Admin Control Panel

Enterprise web-based administrative control panel for the **REHVO** real estate & co-living platform.

---

## 🏗️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Typography**: Plus Jakarta Sans
- **Database / Auth**: Shared Supabase Project

---

## 🚀 Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env.local` inside the `admin/` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or prefix it with `NEXT_PUBLIC_`.

### 2. Development Server
Run from the `admin/` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Admin Control Panel.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🔐 Admin Roles & Permissions

The Admin Panel enforces role-based access via the `admin_users` directory:

| Role | Responsibility |
| :--- | :--- |
| **Super Admin** | Unrestricted access across all operational modules, settings, and team provisioning |
| **Operations** | User and property directory management, direct enquiries, and visit coordination |
| **Verification** | Reviewing ownership deeds, utility bills, and host identity credentials |
| **Moderation** | Handling community safety reports, price discrepancies, and flagged listings |
| **Support** | Resolving customer support tickets and platform inquiries |
| **Content Manager** | Managing featured listings, city coverage, and broadcast notifications |
| **Finance** | Security deposit records and transaction tracking |

---

## 🗺️ Route Architecture

- `/login` — Dedicated Admin authentication portal
- `/admin` — Operational overview dashboard & real-time metric cards
- `/admin/users` — Registered user accounts (Renters, Hosts, Flatmates)
- `/admin/properties` — Verified listings management table
- `/admin/flatmates` — Flatmate seeker profiles
- `/admin/verification` — Proof of ownership deeds & KYC review queue
- `/admin/reports` — Safety reports & moderation triage
- `/admin/support` — Customer support tickets
- `/admin/enquiries` — Tenant inquiries stream
- `/admin/visits` — Physical property visit schedule
- `/admin/notifications` — Push/SMS broadcast dispatcher
- `/admin/locations` — Supported cities and micro-locality coverage
- `/admin/analytics` — Platform funnel and conversion metrics
- `/admin/admin-users` — Staff directory & role assignment
- `/admin/audit-logs` — Immutable action audit trail
- `/admin/settings` — Platform governance and verification policies
