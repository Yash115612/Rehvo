import React from 'react';
import { Building, Layers, Zap, Car, Shield, CheckCircle2 } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyBuildingDetailsProps {
  property: PublicProperty;
}

export const PropertyBuildingDetails: React.FC<PropertyBuildingDetailsProps> = ({ property }) => {
  const hasBuildingData =
    property.total_floors !== undefined ||
    property.lift !== undefined ||
    property.power_backup !== undefined ||
    property.parking_spaces ||
    property.parking;

  if (!hasBuildingData) return null;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
          <Building className="w-4 h-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
          Building & Society Information
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        {property.total_floors && (
          <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] block">Total Floors</span>
            <span className="text-sm font-extrabold text-[#031B2A] mt-0.5 block">
              {property.total_floors} Floors
            </span>
          </div>
        )}

        <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[11px] font-bold text-[#64748B] block">Elevators / Lift</span>
          <span className="text-sm font-extrabold text-[#031B2A] mt-0.5 block">
            {property.lift !== false ? 'Available' : 'No Lift'}
          </span>
        </div>

        <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[11px] font-bold text-[#64748B] block">Power Backup</span>
          <span className="text-sm font-extrabold text-[#031B2A] mt-0.5 block">
            {property.power_backup ? '100% DG Backup' : 'Standard'}
          </span>
        </div>

        <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[11px] font-bold text-[#64748B] block">Parking</span>
          <span className="text-sm font-extrabold text-[#031B2A] mt-0.5 block">
            {property.parking_spaces || property.parking || 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
};
