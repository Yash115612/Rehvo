import React from 'react';

// ============================================================================
// REHVO Official Mobile App Web-Converted Vector Illustrations
// Matches exact geometry, colors, and line weights from src/components/home/HomeIllustrations.tsx
// ============================================================================

interface IllustrationProps {
  size?: number;
  className?: string;
}

// 1. Find Flatmates Illustration (Two smiling friends: blue & orange)
export const FlatmatesIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="10" y="55" width="60" height="3" rx="1.5" fill="#E2E8F0" />
    <path d="M12 55 C12 40, 20 36, 28 36 C36 36, 44 40, 44 55 Z" fill="#2563EB" />
    <path d="M25 36 L28 42 L31 36 Z" fill="#FFFFFF" />
    <circle cx="28" cy="24" r="12" fill="#FDE68A" />
    <path d="M16 22 C18 14, 38 14, 40 22 C38 18, 32 16, 28 16 C24 16, 18 18, 16 22 Z" fill="#1E293B" />
    <rect x="16" y="21" width="24" height="3" rx="1.5" fill="#3B82F6" />
    <circle cx="24" cy="24" r="1.5" fill="#1E293B" />
    <circle cx="32" cy="24" r="1.5" fill="#1E293B" />
    <path d="M25 28 Q28 31 31 28" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    <path d="M36 55 C36 41, 44 37, 52 37 C60 37, 68 41, 68 55 Z" fill="#EA580C" />
    <path d="M49 37 L52 43 L55 37 Z" fill="#FFFFFF" />
    <circle cx="52" cy="25" r="12" fill="#FED7AA" />
    <path d="M40 22 C42 14, 62 14, 64 22 C62 18, 56 16, 52 16 C48 16, 42 18, 40 22 Z" fill="#C2410C" />
    <path d="M38 22 Q52 18 66 22 L68 25 L36 25 Z" fill="#F97316" />
    <circle cx="48" cy="25" r="1.5" fill="#1E293B" />
    <circle cx="56" cy="25" r="1.5" fill="#1E293B" />
    <path d="M49 29 Q52 32 55 29" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    <circle cx="40" cy="34" r="5" fill="#FFFFFF" />
    <circle cx="40" cy="34" r="3" fill="#F97316" />
  </svg>
);

// 2. Rental Pass Illustration (Golden VIP card with ribbon bow)
export const RentalPassIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="14" y="48" width="54" height="6" rx="3" fill="#FEF08A" opacity={0.6} />
    <g transform="rotate(-3 40 30)">
      <rect x="12" y="14" width="56" height="36" rx="6" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
      <path d="M12 20 Q40 16 68 22 L68 28 Q40 22 12 26 Z" fill="#FEF08A" opacity={0.7} />
      <rect x="18" y="24" width="9" height="7" rx="2" fill="#D97706" />
      <line x1="18" y1="27.5" x2="27" y2="27.5" stroke="#FDE68A" strokeWidth="0.8" />
      <line x1="22.5" y1="24" x2="22.5" y2="31" stroke="#FDE68A" strokeWidth="0.8" />
      <rect x="44" y="14" width="7" height="36" fill="#B45309" />
      <line x1="47.5" y1="14" x2="47.5" y2="50" stroke="#FDE68A" strokeWidth="0.8" />
      <rect x="12" y="28" width="56" height="4" fill="#B45309" />
      <circle cx="47.5" cy="30" r="4.5" fill="#92400E" />
      <circle cx="47.5" cy="30" r="2.5" fill="#FBBF24" />
    </g>
  </svg>
);

// 3. Home Services Illustration (AC Unit + Spray cleaner bottle + sparkles)
export const HomeServicesIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="12" y="52" width="56" height="2" rx="1" fill="#F1F5F9" />
    <rect x="14" y="24" width="42" height="26" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <rect x="18" y="28" width="34" height="12" rx="2" fill="#F8FAFC" />
    <line x1="18" y1="41" x2="52" y2="41" stroke="#F97316" strokeWidth="1.5" />
    <circle cx="48" cy="34" r="1.5" fill="#10B981" />
    <line x1="18" y1="45" x2="44" y2="45" stroke="#CBD5E1" strokeWidth="1" />
    <line x1="18" y1="47.5" x2="44" y2="47.5" stroke="#CBD5E1" strokeWidth="1" />
    <rect x="52" y="30" width="14" height="20" rx="3" fill="#38BDF8" />
    <rect x="54" y="36" width="10" height="8" rx="1.5" fill="#BAE6FD" />
    <rect x="56" y="24" width="6" height="6" fill="#0284C7" />
    <path d="M54 24 L64 24 L62 21 L53 21 Z" fill="#0369A1" />
    <path d="M53 22 L49 24 L52 26 Z" fill="#0369A1" />
    <path d="M26 15 L27 18 L30 19 L27 20 L26 23 L25 20 L22 19 L25 18 Z" fill="#FBBF24" />
    <circle cx="38" cy="18" r="1.5" fill="#F59E0B" />
    <circle cx="46" cy="15" r="1" fill="#38BDF8" />
  </svg>
);

// 4. Packers & Movers Illustration (Mint delivery truck with cardboard box)
export const PackersMoversIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="52" width="64" height="3" rx="1.5" fill="#E2E8F0" />
    <rect x="10" y="24" width="34" height="24" rx="4" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
    <rect x="17" y="28" width="20" height="16" rx="2" fill="#FDBA74" stroke="#EA580C" strokeWidth="1" />
    <line x1="17" y1="36" x2="37" y2="36" stroke="#C2410C" strokeWidth="1" />
    <line x1="27" y1="28" x2="27" y2="44" stroke="#C2410C" strokeWidth="1" />
    <path d="M44 28 L56 28 C60 28, 64 32, 64 36 L64 48 L44 48 Z" fill="#0F766E" />
    <path d="M48 31 L55 31 C57 31, 59 33, 59 36 L59 38 L48 38 Z" fill="#A5F3FC" />
    <rect x="62" y="42" width="2" height="3" rx="1" fill="#FEF08A" />
    <rect x="62" y="45" width="4" height="3" rx="1" fill="#042F2E" />
    <circle cx="22" cy="49" r="6" fill="#1E293B" />
    <circle cx="22" cy="49" r="2.5" fill="#94A3B8" />
    <circle cx="54" cy="49" r="6" fill="#1E293B" />
    <circle cx="54" cy="49" r="2.5" fill="#94A3B8" />
  </svg>
);

// 5. Furniture Rental Illustration (Purple modern sofa + golden floor lamp)
export const FurnitureRentalIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="10" y="52" width="60" height="2" rx="1" fill="#EDE9FE" />
    <line x1="20" y1="46" x2="16" y2="52" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="46" x2="54" y2="52" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <rect x="18" y="38" width="36" height="10" rx="4" fill="#7C3AED" stroke="#6D28D9" strokeWidth="1" />
    <rect x="20" y="26" width="32" height="15" rx="5" fill="#8B5CF6" />
    <rect x="15" y="32" width="7" height="14" rx="3.5" fill="#6D28D9" />
    <rect x="48" y="32" width="7" height="14" rx="3.5" fill="#6D28D9" />
    <rect x="24" y="33" width="8" height="8" rx="2" fill="#DDD6FE" transform="rotate(15 28 37)" />
    <line x1="64" y1="24" x2="64" y2="52" stroke="#B45309" strokeWidth="1.5" />
    <rect x="60" y="51" width="8" height="2" rx="1" fill="#78350F" />
    <polygon points="64,18 59,26 69,26" fill="#FBBF24" />
    <circle cx="64" cy="27" r="3" fill="#FEF08A" opacity={0.8} />
  </svg>
);

// 6. Find Your Next Home Illustration (Modern Blue Roof House + Green Verified Badge)
export const FindYourNextHomeIllustration: React.FC<IllustrationProps> = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="14" y="52" width="52" height="3" rx="1.5" fill="#DBEAFE" />
    <rect x="22" y="30" width="36" height="22" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
    <polygon points="40,16 16,31 64,31" fill="#2563EB" />
    <line x1="14" y1="31" x2="66" y2="31" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
    <rect x="36" y="38" width="8" height="14" rx="2" fill="#0F172A" />
    <circle cx="42" cy="45" r="0.8" fill="#FBBF24" />
    <rect x="26" y="36" width="6" height="6" rx="1" fill="#93C5FD" stroke="#60A5FA" strokeWidth="0.8" />
    <circle cx="58" cy="46" r="6" fill="#10B981" />
    <path d="M55.5 46 L57.5 48 L60.5 44" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// 7. Host and Earn Card 1 (Earn from your - Building with green ₹ coin)
export const HostEarnCard1Illustration: React.FC<IllustrationProps> = ({ size = 56, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="52" width="44" height="2" rx="1" fill="#BAE6FD" />
    <rect x="22" y="22" width="28" height="30" rx="4" fill="#0284C7" />
    <rect x="20" y="20" width="32" height="4" rx="2" fill="#0369A1" />
    <rect x="34" y="28" width="10" height="8" rx="1.5" fill="#BAE6FD" />
    <rect x="26" y="38" width="8" height="14" rx="1.5" fill="#075985" />
    <circle cx="18" cy="40" r="10" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
    <circle cx="18" cy="40" r="7.5" fill="#059669" />
    <path
      d="M15 36 H21 M15 38.5 H21 M17 36 V41 C17 42.5 19.5 42.5 20 42.5 L21 44.5 M15 41 H19"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// 8. Host and Earn Card 2 (Hassle-free verified tenants - House with shield)
export const HostEarnCard2Illustration: React.FC<IllustrationProps> = ({ size = 56, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="52" width="44" height="2" rx="1" fill="#A7F3D0" />
    <rect x="16" y="26" width="28" height="26" rx="4" fill="#0D9488" stroke="#042F2E" strokeWidth="1.5" />
    <rect x="23" y="38" width="14" height="14" rx="2" fill="#2DD4BF" />
    <line x1="30" y1="38" x2="30" y2="52" stroke="#0F766E" strokeWidth="1.2" />
    <path d="M12 28 L30 14 L48 28 Z" fill="#14B8A6" stroke="#042F2E" strokeWidth="1.5" />
    <path d="M30 18 L36 21 V26 C36 30 30 33 30 33 C30 33 24 30 24 26 V21 Z" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M28 25 L29.5 26.5 L32.5 23.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// 9. Host and Earn Card 3 (Calculate future earning - Calculator with rising trend)
export const HostEarnCard3Illustration: React.FC<IllustrationProps> = ({ size = 56, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="16" y="18" width="28" height="34" rx="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <rect x="20" y="22" width="20" height="7" rx="2" fill="#FEF3C7" />
    <line x1="23" y1="25.5" x2="37" y2="25.5" stroke="#B45309" strokeWidth="1" />
    <circle cx="23" cy="33" r="2" fill="#FFFFFF" />
    <circle cx="30" cy="33" r="2" fill="#FFFFFF" />
    <circle cx="37" cy="33" r="2" fill="#FFFFFF" />
    <circle cx="23" cy="39" r="2" fill="#FFFFFF" />
    <circle cx="30" cy="39" r="2" fill="#FFFFFF" />
    <circle cx="37" cy="39" r="2" fill="#FFFFFF" />
    <circle cx="23" cy="45" r="2" fill="#FFFFFF" />
    <circle cx="30" cy="45" r="2" fill="#FFFFFF" />
    <circle cx="37" cy="45" r="2" fill="#D97706" />
    <path d="M26 24 L34 16 L38 20 L48 10" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <polygon points="44,8 50,10 48,16" fill="#059669" />
  </svg>
);

// ============================================================================
// 4 Custom High-Resolution Architectural Vector Illustrations for the 4 Banners
// ============================================================================

// Banner 1: Discover Your Perfect Home (Layered luxury residential towers, balconies, illuminated windows, rooftop gardens & 0% brokerage badge)
export const ResidentialArchitectureIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="b1_sky_glow" x1="280" y1="0" x2="280" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B2548" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#001741" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#001741" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="b1_tower_grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="15%" stopColor="#F8FAFC" />
        <stop offset="85%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="b1_glass_reflect" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#0284C7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="b1_balcony_glow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
      </linearGradient>
      <filter id="b1_soft_shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.35" />
      </filter>
      <filter id="b1_glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Atmospheric Ambient Aura */}
    <rect width="560" height="380" rx="16" fill="url(#b1_sky_glow)" />
    <circle cx="280" cy="180" r="160" fill="#0284C7" opacity="0.08" filter="url(#b1_glow)" />
    <circle cx="440" cy="140" r="120" fill="#F97316" opacity="0.06" filter="url(#b1_glow)" />

    {/* Background City Skyline Silhouette (Distant Depth Layer) */}
    <g opacity="0.45">
      <rect x="30" y="160" width="45" height="180" rx="2" fill="#071A34" />
      <rect x="68" y="130" width="38" height="210" rx="2" fill="#05152B" />
      <rect x="98" y="180" width="50" height="160" rx="2" fill="#08203E" />
      {/* Distant building window lights */}
      <circle cx="80" cy="150" r="1.5" fill="#38BDF8" opacity="0.8" />
      <circle cx="88" cy="150" r="1.5" fill="#FEF08A" opacity="0.7" />
      <circle cx="80" cy="165" r="1.5" fill="#FEF08A" opacity="0.7" />
      <circle cx="88" cy="165" r="1.5" fill="#38BDF8" opacity="0.8" />
      <circle cx="80" cy="180" r="1.5" fill="#38BDF8" opacity="0.8" />

      <rect x="420" y="140" width="48" height="200" rx="2" fill="#071A34" />
      <rect x="460" y="115" width="42" height="225" rx="2" fill="#05152B" />
      <line x1="481" y1="115" x2="481" y2="85" stroke="#05152B" strokeWidth="2" />
      <circle cx="481" cy="85" r="2" fill="#EF4444" />
      <rect x="495" y="170" width="45" height="170" rx="2" fill="#08203E" />
    </g>

    {/* Paved Ground Base & Illuminated Streetline */}
    <rect x="15" y="338" width="530" height="8" rx="4" fill="#0E2D54" />
    <rect x="40" y="344" width="480" height="5" rx="2.5" fill="#06182E" />

    {/* Left Midground Residential Wing (Modern Terraced Block) */}
    <g filter="url(#b1_soft_shadow)">
      <rect x="70" y="110" width="130" height="230" rx="6" fill="#0F2D52" stroke="#1E3E66" strokeWidth="1" />
      <rect x="70" y="110" width="22" height="230" rx="3" fill="#091E38" />
      
      {/* Terraced Windows */}
      {[130, 165, 200, 235, 270].map((y, i) => (
        <g key={y}>
          <rect x="102" y={y} width="36" height="20" rx="3" fill="#001741" stroke="#38BDF8" strokeWidth="1" />
          <rect x="105" y={y + 3} width="14" height="14" rx="1.5" fill={i % 2 === 0 ? '#FEF08A' : '#38BDF8'} opacity={0.85} />
          <rect x="121" y={y + 3} width="14" height="14" rx="1.5" fill={i % 3 === 0 ? '#FED7AA' : '#BAE6FD'} opacity={0.7} />
          
          <rect x="146" y={y} width="44" height="20" rx="3" fill="#001741" />
          <rect x="149" y={y + 3} width="18" height="14" rx="1.5" fill="#38BDF8" opacity={0.6} />
          <rect x="169" y={y + 3} width="18" height="14" rx="1.5" fill="#FEF08A" opacity={0.75} />
        </g>
      ))}

      {/* Rooftop Pergola & Solar Panels on Left Tower */}
      <rect x="78" y="98" width="80" height="12" rx="2" fill="#0284C7" />
      <line x1="88" y1="98" x2="88" y2="110" stroke="#38BDF8" strokeWidth="2" />
      <line x1="108" y1="98" x2="108" y2="110" stroke="#38BDF8" strokeWidth="2" />
      <line x1="128" y1="98" x2="128" y2="110" stroke="#38BDF8" strokeWidth="2" />
      <line x1="148" y1="98" x2="148" y2="110" stroke="#38BDF8" strokeWidth="2" />
    </g>

    {/* Right Midground Tower (Modern Glass Facade High-Rise) */}
    <g filter="url(#b1_soft_shadow)">
      <rect x="360" y="90" width="125" height="250" rx="6" fill="#133660" stroke="#1E4473" strokeWidth="1" />
      <rect x="465" y="90" width="20" height="250" rx="3" fill="#091E38" />

      {/* Floor Bands with Cantilevered Balconies */}
      {[115, 150, 185, 220, 255, 290].map((y, i) => (
        <g key={y}>
          <rect x="375" y={y} width="80" height="22" rx="3" fill="#001741" stroke="#38BDF8" strokeWidth="0.8" />
          <rect x="380" y={y + 3} width="22" height="16" rx="2" fill={i % 2 === 0 ? '#38BDF8' : '#FDE68A'} opacity={0.8} />
          <rect x="406" y={y + 3} width="22" height="16" rx="2" fill={i % 3 === 0 ? '#FED7AA' : '#0284C7'} opacity={0.75} />
          <rect x="432" y={y + 3} width="18" height="16" rx="2" fill="#FEF08A" opacity={0.7} />
          {/* Glass Railing */}
          <rect x="370" y={y + 12} width="88" height="12" rx="2" fill="#38BDF8" opacity="0.25" stroke="#38BDF8" strokeWidth="0.8" />
        </g>
      ))}

      {/* Rooftop Penthouse Lounge */}
      <rect x="380" y="70" width="85" height="20" rx="3" fill="#0284C7" />
      <circle cx="422" cy="62" r="8" fill="#F59E0B" opacity="0.85" />
      <line x1="422" y1="70" x2="422" y2="90" stroke="#CBD5E1" strokeWidth="2" />
    </g>

    {/* Sky-Bridge Connecting Left and Right Wings */}
    <rect x="195" y="165" width="170" height="20" rx="3" fill="#001741" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
    <line x1="200" y1="175" x2="360" y2="175" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />

    {/* Centerpiece Foreground Flagship Luxury Apartment Tower */}
    <g filter="url(#b1_soft_shadow)">
      {/* Tower Base & Core */}
      <rect x="180" y="45" width="200" height="295" rx="10" fill="url(#b1_tower_grad)" />
      
      {/* Dark Architectural Accent Spine */}
      <rect x="180" y="45" width="30" height="295" rx="5" fill="#001741" />
      <rect x="350" y="45" width="30" height="295" rx="5" fill="#0B2548" />

      {/* Rooftop Penthouse Suite with Garden Terrace */}
      <rect x="200" y="24" width="160" height="24" rx="5" fill="#0284C7" />
      <rect x="215" y="14" width="130" height="12" rx="3" fill="#0369A1" />
      
      {/* Rooftop Trees / Greenery */}
      <circle cx="218" cy="22" r="8" fill="#10B981" />
      <circle cx="224" cy="18" r="6" fill="#34D399" />
      <circle cx="338" cy="22" r="8" fill="#10B981" />
      <circle cx="344" cy="18" r="6" fill="#34D399" />

      {/* 5 Distinct Luxury Residential Floors with Wide Glass Balconies */}
      {[62, 110, 158, 206, 254].map((y, idx) => (
        <g key={y}>
          {/* Recessed Living Room Window */}
          <rect x="218" y={y} width="124" height="34" rx="4" fill="#001741" />
          
          {/* Illuminated Glass Panes */}
          <rect x="222" y={y + 4} width="36" height="26" rx="2" fill="url(#b1_balcony_glow)" />
          <rect x="262" y={y + 4} width="38" height="26" rx="2" fill="url(#b1_glass_reflect)" />
          <rect x="304" y={y + 4} width="34" height="26" rx="2" fill={idx % 2 === 0 ? '#FED7AA' : '#FEF08A'} opacity={0.9} />

          {/* Interior Silhouette Details (Warm Lifestyle Touch) */}
          {idx === 0 && (
            <circle cx="238" cy={y + 12} r="4" fill="#78350F" opacity="0.7" />
          )}
          {idx === 2 && (
            <rect x="274" y={y + 16} width="14" height="12" rx="2" fill="#F8FAFC" opacity="0.8" />
          )}

          {/* Cantilevered Glass Balcony Railing */}
          <rect x="214" y={y + 20} width="132" height="18" rx="3" fill="#38BDF8" fillOpacity="0.22" stroke="#38BDF8" strokeWidth="1.2" />
          <line x1="214" y1={y + 20} x2="346" y2={y + 20} stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="247" y1={y + 20} x2="247" y2={y + 38} stroke="#0284C7" strokeWidth="1" />
          <line x1="280" y1={y + 20} x2="280" y2={y + 38} stroke="#0284C7" strokeWidth="1" />
          <line x1="313" y1={y + 20} x2="313" y2={y + 38} stroke="#0284C7" strokeWidth="1" />

          {/* Balcony Potted Plant Accent */}
          <circle cx="338" cy={y + 26} r="4" fill="#10B981" />
          <rect x="336" y={y + 28} width="4" height="6" fill="#F97316" rx="1" />
        </g>
      ))}

      {/* Grand Double-Height Lobby Entrance with Canopy */}
      <rect x="230" y="300" width="100" height="40" rx="4" fill="#001741" stroke="#FBBF24" strokeWidth="1.5" />
      <rect x="248" y="308" width="64" height="32" rx="2" fill="#FEF08A" opacity={0.95} />
      {/* Glass Revolving Door */}
      <line x1="280" y1="308" x2="280" y2="340" stroke="#001741" strokeWidth="2" />
      <circle cx="280" cy="324" r="10" fill="none" stroke="#001741" strokeWidth="1.5" />
      {/* Modern Sleek Entrance Canopy */}
      <polygon points="215,302 345,302 335,296 225,296" fill="#F97316" />
      <line x1="225" y1="296" x2="215" y2="302" stroke="#EA580C" strokeWidth="2" />
      <line x1="335" y1="296" x2="345" y2="302" stroke="#EA580C" strokeWidth="2" />
    </g>

    {/* Ground Landscaping, Palms & Bollard Warm Lights */}
    <g>
      {/* Left Palm Tree */}
      <path d="M56 340 Q62 300 70 270" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M70 270 Q45 260 38 275" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 270 Q60 248 55 258" stroke="#34D399" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 270 Q82 250 88 260" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 270 Q95 265 100 280" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Right Modern Bush & Tree */}
      <circle cx="496" cy="320" r="18" fill="#10B981" />
      <circle cx="510" cy="312" r="14" fill="#34D399" />
      <circle cx="484" cy="325" r="12" fill="#059669" />
      <rect x="494" y="328" width="5" height="12" fill="#78350F" rx="1" />

      {/* Modern Driveway Lighting Bollards (Glowing Warm Gold) */}
      <rect x="155" y="330" width="6" height="10" fill="#FDE68A" rx="1" />
      <circle cx="158" cy="328" r="6" fill="#FBBF24" opacity="0.4" filter="url(#b1_glow)" />

      <rect x="398" y="330" width="6" height="10" fill="#FDE68A" rx="1" />
      <circle cx="401" cy="328" r="6" fill="#FBBF24" opacity="0.4" filter="url(#b1_glow)" />
    </g>

    {/* Integrated Floating 3D Graphic Badge: 0% BROKERAGE DIRECT (Exact Mobile App DNA) */}
    <g transform="translate(18, 38) rotate(-5)" filter="url(#b1_soft_shadow)">
      {/* Outer Glow & Badge Shell */}
      <rect x="0" y="0" width="144" height="92" rx="16" fill="#001741" stroke="#F97316" strokeWidth="2.5" />
      
      {/* Calendar / Date Tag Top Notch */}
      <g transform="translate(14, -12)">
        <rect x="0" y="0" width="28" height="26" rx="5" fill="#FFFFFF" stroke="#F97316" strokeWidth="1.5" />
        <rect x="0" y="0" width="28" height="8" rx="3" fill="#EF4444" />
        <text x="14" y="21" fill="#001741" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          15
        </text>
      </g>

      {/* Badge Header Strip */}
      <rect x="12" y="18" width="120" height="20" rx="6" fill="#F97316" />
      <text x="72" y="32" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
        0% BROKERAGE
      </text>

      {/* Main Core Tag */}
      <text x="72" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        DIRECT DEAL
      </text>

      {/* Bottom Ribbon */}
      <rect x="12" y="66" width="120" height="16" rx="4" fill="#0284C7" />
      <text x="72" y="78" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        Verified Landlord • Save ₹50k+
      </text>
    </g>

    {/* Floating Live Verification Badge (Top Right) */}
    <g transform="translate(380, 24) rotate(4)" filter="url(#b1_soft_shadow)">
      <rect x="0" y="0" width="155" height="52" rx="12" fill="#001741" stroke="#10B981" strokeWidth="2" />
      <circle cx="18" cy="26" r="6" fill="#10B981" />
      <circle cx="18" cy="26" r="10" fill="#10B981" opacity="0.3" />
      <text x="34" y="22" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
        VERIFIED RESIDENTIAL
      </text>
      <text x="34" y="38" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">
        100% Direct Owners
      </text>
    </g>

    {/* Floating Key & Rupee Token Accents (Brand Confetti) */}
    <g transform="translate(485, 220) rotate(-15)" filter="url(#b1_soft_shadow)">
      <circle cx="16" cy="16" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6" fill="#001741" />
      <rect x="28" y="13" width="24" height="6" rx="1.5" fill="#FBBF24" />
      <rect x="42" y="19" width="5" height="7" rx="1" fill="#FBBF24" />
      <rect x="48" y="19" width="4" height="5" rx="1" fill="#FBBF24" />
    </g>
  </svg>
);

// Banner 2: PG & Co-Living Spaces (Modern loft interior, city view, study workstation, designer lounge & Zero Deposit badge)
export const PgCoLivingIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="b2_sky_glow" x1="280" y1="0" x2="280" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0369A1" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#001741" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#001741" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="b2_window_view" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0A2548" />
        <stop offset="60%" stopColor="#001741" />
        <stop offset="100%" stopColor="#1E3A5F" />
      </linearGradient>
      <linearGradient id="b2_sofa_yellow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="b2_soft_shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Ambient Loft Atmosphere */}
    <rect width="560" height="380" rx="16" fill="url(#b2_sky_glow)" />

    {/* Room Floor Base (Warm Timber Plank Floor) */}
    <rect x="20" y="315" width="520" height="40" rx="4" fill="#0F2D52" />
    <line x1="20" y1="330" x2="540" y2="330" stroke="#1E3E66" strokeWidth="1" />
    <line x1="120" y1="315" x2="110" y2="355" stroke="#1E3E66" strokeWidth="1" />
    <line x1="260" y1="315" x2="250" y2="355" stroke="#1E3E66" strokeWidth="1" />
    <line x1="400" y1="315" x2="390" y2="355" stroke="#1E3E66" strokeWidth="1" />

    {/* Industrial Loft Wall & Giant Floor-to-Ceiling Panoramic Window */}
    <g filter="url(#b2_soft_shadow)">
      {/* Wall Structure */}
      <rect x="40" y="30" width="480" height="288" rx="12" fill="#071B35" stroke="#1E3E66" strokeWidth="1.5" />

      {/* Triple Panoramic Glass Window Looking out to City Night */}
      <rect x="65" y="48" width="430" height="165" rx="8" fill="url(#b2_window_view)" stroke="#0284C7" strokeWidth="2" />
      
      {/* Window Mullions / Frames */}
      <line x1="208" y1="48" x2="208" y2="213" stroke="#001741" strokeWidth="4" />
      <line x1="352" y1="48" x2="352" y2="213" stroke="#001741" strokeWidth="4" />
      <line x1="65" y1="125" x2="495" y2="125" stroke="#001741" strokeWidth="3" />

      {/* City Skyline View Inside Windows */}
      <circle cx="140" cy="85" r="22" fill="#FEF08A" opacity="0.85" />
      <rect x="85" y="115" width="30" height="98" fill="#001741" />
      <rect x="125" y="95" width="40" height="118" fill="#06182E" />
      <rect x="175" y="130" width="28" height="83" fill="#001741" />

      <rect x="220" y="105" width="44" height="108" fill="#06182E" />
      <rect x="275" y="90" width="36" height="123" fill="#001741" />
      <rect x="320" y="120" width="26" height="93" fill="#06182E" />

      <rect x="365" y="110" width="48" height="103" fill="#001741" />
      <rect x="425" y="85" width="42" height="128" fill="#06182E" />
      <line x1="446" y1="85" x2="446" y2="65" stroke="#06182E" strokeWidth="2" />
      <circle cx="446" cy="65" r="2" fill="#EF4444" />
    </g>

    {/* Hanging Modern Brass Pendant Lamps */}
    <g>
      <line x1="120" y1="30" x2="120" y2="90" stroke="#CBD5E1" strokeWidth="1.5" />
      <polygon points="120,90 108,105 132,105" fill="#FBBF24" />
      <circle cx="120" cy="108" r="6" fill="#FEF08A" opacity="0.9" />

      <line x1="440" y1="30" x2="440" y2="90" stroke="#CBD5E1" strokeWidth="1.5" />
      <polygon points="440,90 428,105 452,105" fill="#FBBF24" />
      <circle cx="440" cy="108" r="6" fill="#FEF08A" opacity="0.9" />
    </g>

    {/* Dedicated Study Workstation (Left Side) */}
    <g filter="url(#b2_soft_shadow)">
      {/* Desk Surface & Solid Legs */}
      <rect x="65" y="235" width="165" height="14" rx="4" fill="#F8FAFC" />
      <rect x="80" y="249" width="8" height="70" fill="#CBD5E1" rx="2" />
      <rect x="210" y="249" width="8" height="70" fill="#CBD5E1" rx="2" />

      {/* Dual Curved Monitor / Laptop Setup */}
      <rect x="110" y="185" width="60" height="42" rx="4" fill="#001741" stroke="#38BDF8" strokeWidth="2" />
      <rect x="114" y="190" width="52" height="32" rx="2" fill="#38BDF8" opacity="0.85" />
      <rect x="135" y="227" width="10" height="10" fill="#64748B" />
      <rect x="125" y="234" width="30" height="3" rx="1.5" fill="#94A3B8" />

      {/* Modern Laptop on Left */}
      <polygon points="82,234 106,234 102,216 86,216" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />

      {/* Desk Lamp (Warm Golden Arc) */}
      <path d="M190 235 L190 195 Q190 180 175 180" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <polygon points="175,180 168,190 182,190" fill="#F97316" />
      <circle cx="175" cy="193" r="4" fill="#FEF08A" />

      {/* Indoor Potted Plant on Desk */}
      <rect x="196" y="222" width="12" height="14" rx="2" fill="#EA580C" />
      <circle cx="202" cy="216" r="7" fill="#10B981" />
      <circle cx="206" cy="212" r="5" fill="#34D399" />
    </g>

    {/* Modern Sectional Lounge Sofa & Coffee Table (Center / Right) */}
    <g filter="url(#b2_soft_shadow)">
      {/* Sofa Main Body */}
      <rect x="250" y="228" width="195" height="55" rx="12" fill="url(#b2_sofa_yellow)" stroke="#D97706" strokeWidth="2" />
      
      {/* Deep Sofa Cushions */}
      <rect x="255" y="232" width="58" height="48" rx="8" fill="#FDE68A" />
      <rect x="318" y="232" width="58" height="48" rx="8" fill="#FDE68A" />
      <rect x="381" y="232" width="58" height="48" rx="8" fill="#FDE68A" />

      {/* Decorative Accent Throw Pillows */}
      <rect x="262" y="215" width="28" height="24" rx="5" fill="#0284C7" transform="rotate(-8 276 227)" />
      <rect x="330" y="215" width="28" height="24" rx="5" fill="#F97316" transform="rotate(6 344 227)" />
      <rect x="395" y="215" width="28" height="24" rx="5" fill="#10B981" transform="rotate(-6 409 227)" />

      {/* Sofa Wooden Legs */}
      <line x1="262" y1="283" x2="258" y2="315" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="345" y1="283" x2="345" y2="315" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="435" y1="283" x2="439" y2="315" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />

      {/* Low Nordic Coffee Table */}
      <rect x="280" y="295" width="130" height="12" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="295" y1="307" x2="290" y2="325" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <line x1="395" y1="307" x2="400" y2="325" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      {/* Books and Mug on Coffee Table */}
      <rect x="305" y="288" width="22" height="7" rx="1.5" fill="#38BDF8" />
      <rect x="308" y="283" width="18" height="5" rx="1" fill="#F97316" />
      <rect x="345" y="285" width="10" height="10" rx="2" fill="#FDE68A" />
    </g>

    {/* Integrated Floating 3D Graphic Badge: CO-LIVING ZERO DEPOSIT (Exact Mobile App DNA) */}
    <g transform="translate(25, 45) rotate(-6)" filter="url(#b2_soft_shadow)">
      <rect x="0" y="0" width="148" height="94" rx="16" fill="#001741" stroke="#38BDF8" strokeWidth="2.5" />
      
      {/* Top Calendar / Tag Notch */}
      <g transform="translate(14, -12)">
        <rect x="0" y="0" width="28" height="26" rx="5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5" />
        <rect x="0" y="0" width="28" height="8" rx="3" fill="#0284C7" />
        <text x="14" y="21" fill="#001741" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          01
        </text>
      </g>

      {/* Badge Header Strip */}
      <rect x="12" y="18" width="124" height="20" rx="6" fill="#0284C7" />
      <text x="74" y="32" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
        CO-LIVING SPACES
      </text>

      {/* Main Core Tag */}
      <text x="74" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        ZERO DEPOSIT
      </text>

      {/* Bottom Ribbon */}
      <rect x="12" y="66" width="124" height="18" rx="4" fill="#38BDF8" />
      <text x="74" y="79" fill="#001741" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        WiFi • Daily Meals • Cleaning
      </text>
    </g>

    {/* Floating Amenities Feature Pill (Top Right) */}
    <g transform="translate(345, 24) rotate(3)" filter="url(#b2_soft_shadow)">
      <rect x="0" y="0" width="175" height="54" rx="14" fill="#001741" stroke="#FBBF24" strokeWidth="2" />
      <circle cx="20" cy="27" r="7" fill="#FBBF24" />
      <text x="20" y="31" fill="#001741" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        ★
      </text>
      <text x="36" y="23" fill="#FDE68A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
        MOVE IN TODAY
      </text>
      <text x="36" y="39" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
        Private &amp; Shared Rooms
      </text>
    </g>
  </svg>
);

// Banner 3: List Your Property for Free (Host & Earn, Luxury Building Architecture, Golden Keys, Growth Curve & Free Listing Badge)
export const HostEarnBuildingIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="b3_sky_glow" x1="280" y1="0" x2="280" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#065F46" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#001741" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#001741" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="b3_bldg_grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="b3_gold_grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="b3_soft_shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Ambient Growth Aura */}
    <rect width="560" height="380" rx="16" fill="url(#b3_sky_glow)" />

    {/* Blueprint Precision Grid Lines (Asset Management Theme) */}
    <g opacity="0.2">
      <line x1="40" y1="80" x2="520" y2="80" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="40" y1="160" x2="520" y2="160" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="40" y1="240" x2="520" y2="240" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="160" y1="40" x2="160" y2="340" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="320" y1="40" x2="320" y2="340" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="440" y1="40" x2="440" y2="340" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" />
    </g>

    {/* Ground Promenade Base */}
    <rect x="25" y="336" width="510" height="8" rx="4" fill="#0E2D54" />

    {/* Left Architectural Real Estate Tower (The Owner's Property Asset) */}
    <g filter="url(#b3_soft_shadow)">
      {/* Tower Building Body */}
      <rect x="90" y="65" width="180" height="275" rx="8" fill="url(#b3_bldg_grad)" />
      
      {/* Contrasting Dark Emerald Spine */}
      <rect x="90" y="65" width="28" height="275" rx="4" fill="#047857" />
      
      {/* Rooftop Solar Pergola */}
      <rect x="110" y="48" width="145" height="18" rx="3" fill="#001741" />
      <line x1="125" y1="48" x2="125" y2="65" stroke="#10B981" strokeWidth="2" />
      <line x1="160" y1="48" x2="160" y2="65" stroke="#10B981" strokeWidth="2" />
      <line x1="195" y1="48" x2="195" y2="65" stroke="#10B981" strokeWidth="2" />
      <line x1="230" y1="48" x2="230" y2="65" stroke="#10B981" strokeWidth="2" />

      {/* Grid of Verified Residential Windows */}
      {[85, 125, 165, 205, 245].map((y, idx) => (
        <g key={y}>
          <rect x="130" y={y} width="32" height="24" rx="3" fill="#001741" />
          <rect x="133" y={y + 3} width="26" height="18" rx="2" fill={idx % 2 === 0 ? '#38BDF8' : '#FDE68A'} opacity={0.9} />

          <rect x="174" y={y} width="32" height="24" rx="3" fill="#001741" />
          <rect x="177" y={y + 3} width="26" height="18" rx="2" fill={idx % 3 === 0 ? '#FED7AA' : '#34D399'} opacity={0.85} />

          <rect x="218" y={y} width="36" height="24" rx="3" fill="#001741" />
          <rect x="221" y={y + 3} width="30" height="18" rx="2" fill="#FEF08A" opacity={0.9} />

          {/* Exterior Balcony Sills */}
          <line x1="126" y1={y + 24} x2="258" y2={y + 24} stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* Commercial Glass Entrance on Ground Floor */}
      <rect x="145" y="295" width="80" height="45" rx="4" fill="#001741" stroke="#10B981" strokeWidth="1.5" />
      <rect x="160" y="305" width="50" height="35" rx="2" fill="#FEF08A" opacity={0.9} />
      <line x1="185" y1="305" x2="185" y2="340" stroke="#001741" strokeWidth="2" />
    </g>

    {/* Rising Financial Growth Curve & Data Points (Higher Rental Yield) */}
    <g filter="url(#b3_soft_shadow)">
      {/* Ascending Emerald Glowing Wave */}
      <path
        d="M260 290 Q340 260 380 200 T490 110"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M260 290 Q340 260 380 200 T490 110 L490 336 L260 336 Z"
        fill="#10B981"
        fillOpacity="0.08"
      />

      {/* Growth Arrowhead at Top */}
      <polygon points="490,105 505,115 488,124" fill="#10B981" />

      {/* Data Pulse Nodes along the curve */}
      <circle cx="330" cy="255" r="7" fill="#001741" stroke="#10B981" strokeWidth="3" />
      <circle cx="330" cy="255" r="3" fill="#34D399" />

      <circle cx="410" cy="170" r="8" fill="#001741" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="410" cy="170" r="4" fill="#FDE68A" />

      <circle cx="488" cy="115" r="9" fill="#001741" stroke="#34D399" strokeWidth="3" />
      <circle cx="488" cy="115" r="4" fill="#FFFFFF" />
    </g>

    {/* Stack of 3D Golden Rupee Coins (Owner Rental Income) */}
    <g transform="translate(325, 185)" filter="url(#b3_soft_shadow)">
      {/* Coin 1 */}
      <ellipse cx="50" cy="110" rx="44" ry="15" fill="#D97706" />
      <ellipse cx="50" cy="103" rx="44" ry="15" fill="url(#b3_gold_grad)" />
      
      {/* Coin 2 */}
      <ellipse cx="50" cy="90" rx="44" ry="15" fill="#D97706" />
      <ellipse cx="50" cy="83" rx="44" ry="15" fill="url(#b3_gold_grad)" />

      {/* Coin 3 */}
      <ellipse cx="50" cy="70" rx="44" ry="15" fill="#D97706" />
      <ellipse cx="50" cy="63" rx="44" ry="15" fill="url(#b3_gold_grad)" />

      {/* Coin 4 (Top active coin with Rupee glyph) */}
      <ellipse cx="50" cy="50" rx="44" ry="15" fill="#D97706" />
      <ellipse cx="50" cy="43" rx="44" ry="15" fill="url(#b3_gold_grad)" />
      <text x="50" y="50" fill="#78350F" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        ₹
      </text>
    </g>

    {/* Floating Golden Master Key in 3D Perspective */}
    <g transform="translate(450, 195) rotate(-18)" filter="url(#b3_soft_shadow)">
      <circle cx="24" cy="24" r="20" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="8" fill="#001741" />
      <rect x="42" y="19" width="46" height="10" rx="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <rect x="68" y="29" width="8" height="12" rx="2" fill="#D97706" />
      <rect x="80" y="29" width="7" height="9" rx="2" fill="#D97706" />
    </g>

    {/* Integrated Floating 3D Graphic Badge: HOST & EARN (Exact Mobile App DNA) */}
    <g transform="translate(18, 40) rotate(-5)" filter="url(#b3_soft_shadow)">
      <rect x="0" y="0" width="146" height="92" rx="16" fill="#001741" stroke="#10B981" strokeWidth="2.5" />
      
      {/* Top Tag Notch */}
      <g transform="translate(14, -12)">
        <rect x="0" y="0" width="28" height="26" rx="5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
        <rect x="0" y="0" width="28" height="8" rx="3" fill="#059669" />
        <text x="14" y="21" fill="#001741" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          FREE
        </text>
      </g>

      {/* Badge Header Strip */}
      <rect x="12" y="18" width="122" height="20" rx="6" fill="#059669" />
      <text x="73" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
        PROPERTY OWNERS
      </text>

      {/* Main Core Tag */}
      <text x="73" y="58" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        POST FREE
      </text>

      {/* Bottom Ribbon */}
      <rect x="10" y="66" width="126" height="16" rx="4" fill="#10B981" />
      <text x="73" y="78" fill="#001741" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        Zero Brokerage • Direct Tenants
      </text>
    </g>

    {/* Floating Owner Benefits Pill (Top Right) */}
    <g transform="translate(350, 22) rotate(3)" filter="url(#b3_soft_shadow)">
      <rect x="0" y="0" width="160" height="54" rx="14" fill="#001741" stroke="#10B981" strokeWidth="2" />
      <circle cx="20" cy="27" r="7" fill="#10B981" />
      <text x="20" y="31" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        ✓
      </text>
      <text x="36" y="23" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
        RENT COLLECTOR
      </text>
      <text x="36" y="39" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">
        Auto UPI Rent on 1st
      </text>
    </g>
  </svg>
);

// Banner 4: Rent With Confidence — REHVO Damage Protection (Verified Handover, Laser Room Scan, Condition Baseline Clipboard & Dual-OTP Seal)
export const DamageProtectionShieldIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="b4_sky_glow" x1="280" y1="0" x2="280" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#047857" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#001741" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#001741" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="b4_shield_grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="b4_laser_grid" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
      </linearGradient>
      <filter id="b4_soft_shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Atmospheric Security Glow */}
    <rect width="560" height="380" rx="16" fill="url(#b4_sky_glow)" />

    {/* Background Room Wireframe & Laser Inspection Scan Lines */}
    <g opacity="0.3">
      {/* Isometric 3D Room Box Wireframe */}
      <polygon points="60,80 280,30 500,80 280,130" fill="none" stroke="#34D399" strokeWidth="1.5" />
      <polygon points="60,80 60,280 280,330 280,130" fill="none" stroke="#34D399" strokeWidth="1.5" />
      <polygon points="500,80 500,280 280,330 280,130" fill="none" stroke="#34D399" strokeWidth="1.5" />
      
      {/* Horizontal Laser Scanning Grids */}
      <line x1="60" y1="180" x2="500" y2="180" stroke="url(#b4_laser_grid)" strokeWidth="2" strokeDasharray="8 6" />
      <line x1="60" y1="230" x2="500" y2="230" stroke="url(#b4_laser_grid)" strokeWidth="2" strokeDasharray="8 6" />
    </g>

    {/* Base Floor Plate */}
    <rect x="30" y="336" width="500" height="8" rx="4" fill="#0E2D54" />

    {/* Giant Emerald REHVO Security Vault Shield (Centerpiece) */}
    <g filter="url(#b4_soft_shadow)">
      {/* Outer Shield Rim */}
      <path
        d="M280 40 L400 90 V195 C400 270 280 325 280 325 C280 325 160 270 160 195 V90 Z"
        fill="#047857"
        stroke="#34D399"
        strokeWidth="3"
      />
      
      {/* Inner Shield Body */}
      <path
        d="M280 54 L384 97 V190 C384 254 280 306 280 306 C280 306 176 254 176 190 V97 Z"
        fill="url(#b4_shield_grad)"
      />

      {/* Shield Core Crest Aura */}
      <circle cx="280" cy="180" r="55" fill="#064E3B" opacity="0.6" />

      {/* Move-In Inspection Checklist Tablet Inside Shield */}
      <rect x="225" y="100" width="110" height="150" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      {/* Top Tablet Clip */}
      <rect x="255" y="92" width="50" height="16" rx="5" fill="#001741" />
      <circle cx="280" cy="100" r="3.5" fill="#FBBF24" />

      {/* Checklist Rows with Crisp Emerald Checkmarks */}
      {[130, 155, 180, 205, 230].map((y) => (
        <g key={y}>
          <circle cx="242" cy={y} r="6" fill="#10B981" />
          <path
            d={`M239.5 ${y} L241.5 ${y + 2} L245.5 ${y - 2}`}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="254" y1={y} x2="320" y2={y} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
    </g>

    {/* Digital Inspection Camera with Targeting Reticle (Right Side) */}
    <g transform="translate(375, 145) rotate(8)" filter="url(#b4_soft_shadow)">
      {/* Camera Body */}
      <rect x="0" y="14" width="85" height="58" rx="12" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
      <rect x="28" y="6" width="28" height="10" rx="3" fill="#C2410C" />
      
      {/* Camera Lens */}
      <circle cx="42" cy="42" r="20" fill="#001741" stroke="#FED7AA" strokeWidth="3" />
      <circle cx="42" cy="42" r="10" fill="#38BDF8" />
      <circle cx="42" cy="42" r="4" fill="#FFFFFF" />
      <circle cx="68" cy="26" r="3.5" fill="#FEF08A" />

      {/* Laser Targeting Beams radiating towards room */}
      <line x1="0" y1="42" x2="-45" y2="42" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="0" y1="36" x2="-40" y2="20" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="0" y1="48" x2="-40" y2="64" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" />
    </g>

    {/* Dual OTP Locked Keyhole Vault Badge (Bottom Center) */}
    <g transform="translate(195, 280)" filter="url(#b4_soft_shadow)">
      <rect x="0" y="0" width="170" height="38" rx="10" fill="#001741" stroke="#FBBF24" strokeWidth="2" />
      <circle cx="20" cy="19" r="8" fill="#FBBF24" />
      <text x="20" y="23" fill="#001741" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        🔒
      </text>
      <text x="36" y="16" fill="#FDE68A" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
        DUAL-OTP ENCRYPTED
      </text>
      <text x="36" y="29" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
        Immutable Move-In Baseline
      </text>
    </g>

    {/* Integrated Floating 3D Graphic Badge: VERIFIED HANDOVER (Exact Mobile App DNA) */}
    <g transform="translate(18, 42) rotate(-5)" filter="url(#b4_soft_shadow)">
      <rect x="0" y="0" width="152" height="94" rx="16" fill="#001741" stroke="#10B981" strokeWidth="2.5" />
      
      {/* Top Tag Notch */}
      <g transform="translate(14, -12)">
        <rect x="0" y="0" width="28" height="26" rx="5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
        <rect x="0" y="0" width="28" height="8" rx="3" fill="#059669" />
        <text x="14" y="21" fill="#001741" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          100
        </text>
      </g>

      {/* Badge Header Strip */}
      <rect x="12" y="18" width="128" height="20" rx="6" fill="#059669" />
      <text x="76" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
        DAMAGE PROTECTION
      </text>

      {/* Main Core Tag */}
      <text x="76" y="58" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        SAFE DEPOSIT
      </text>

      {/* Bottom Ribbon */}
      <rect x="12" y="66" width="128" height="18" rx="4" fill="#10B981" />
      <text x="76" y="79" fill="#001741" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        Pre-Existing Damage Shield
      </text>
    </g>

    {/* Floating Safety Guarantee Pill (Top Right) */}
    <g transform="translate(345, 20) rotate(3)" filter="url(#b4_soft_shadow)">
      <rect x="0" y="0" width="160" height="52" rx="14" fill="#001741" stroke="#38BDF8" strokeWidth="2" />
      <circle cx="20" cy="26" r="7" fill="#38BDF8" />
      <text x="20" y="30" fill="#001741" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        🛡
      </text>
      <text x="36" y="22" fill="#BAE6FD" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
        DISPUTE-FREE EXIT
      </text>
      <text x="36" y="38" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">
        Full Deposit Refund
      </text>
    </g>
  </svg>
);
