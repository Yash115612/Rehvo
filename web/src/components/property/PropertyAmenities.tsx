import React from 'react';
import {
  Sparkles,
  Car,
  Layers,
  Zap,
  Dumbbell,
  Shield,
  Wifi,
  Airplay,
  Flame,
  Droplets,
  Trees,
  PhoneCall,
  Camera,
  Waves,
  BatteryCharging,
  Users,
  Check,
  Building,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyAmenitiesProps {
  property: PublicProperty;
}

// Icon dictionary for supported amenities
const AMENITY_ICONS: Record<string, React.ElementType> = {
  parking: Car,
  car_parking: Car,
  two_wheeler_parking: Car,
  lift: Layers,
  elevator: Layers,
  power_backup: Zap,
  generator_backup: Zap,
  gym: Dumbbell,
  fitness_center: Dumbbell,
  security: Shield,
  security_guard: Shield,
  wifi: Wifi,
  internet: Wifi,
  ac: Airplay,
  air_conditioner: Airplay,
  swimming_pool: Waves,
  pool: Waves,
  clubhouse: Building,
  cctv: Camera,
  gas_pipeline: Flame,
  water_supply: Droplets,
  garden: Trees,
  park: Trees,
  intercom: PhoneCall,
  ev_charging: BatteryCharging,
  community_hall: Users,
};

function formatAmenityName(slug: string): string {
  return slug
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  const amenities = property.amenities || [];

  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
          Amenities & Facilities
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {amenities.map((amenity, idx) => {
          const cleanKey = amenity.toLowerCase().trim().replace(/[\s-]+/g, '_');
          const Icon = AMENITY_ICONS[cleanKey] || Check;

          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-[18px] bg-[#F8FAFC]/70 border border-[#E2E8F0] hover:bg-white hover:border-[#0F766E]/30 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] text-[#3C8D68] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#031B2A] truncate">
                {formatAmenityName(amenity)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
