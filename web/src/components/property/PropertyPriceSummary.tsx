import React from 'react';
import { IndianRupee, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyPriceSummaryProps {
  property: PublicProperty;
}

export const PropertyPriceSummary: React.FC<PropertyPriceSummaryProps> = ({ property }) => {
  const isCommercial =
    property.category === 'commercial' ||
    [
      'office',
      'shop',
      'showroom',
      'warehouse',
      'commercial_building',
      'coworking',
      'commercial_plot',
      'other_commercial',
    ].includes(property.type);

  const formattedPrice = `₹${property.price.toLocaleString('en-IN')}`;
  const formattedDeposit = property.deposit
    ? `₹${property.deposit.toLocaleString('en-IN')}`
    : 'None';
  const formattedMaintenance = property.maintenance
    ? `₹${property.maintenance.toLocaleString('en-IN')}/mo`
    : 'Included in rent';

  const pricePerSqFt =
    property.area > 0 ? Math.round(property.price / property.area) : null;

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#E2E8F0] shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
        {/* Monthly Rent */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Monthly Rent
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">/month</span>
          </div>

          {pricePerSqFt && (
            <span className="text-xs font-bold text-[#3C8D68] block">
              ≈ ₹{pricePerSqFt.toLocaleString('en-IN')}/sq.ft
            </span>
          )}
        </div>

        {/* Security Deposit */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pl-6">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Security Deposit
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-[#031B2A] tracking-tight block">
            {formattedDeposit}
          </span>
          <span className="text-[11px] font-bold text-[#0F766E] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Refundable
          </span>
        </div>

        {/* Maintenance & Commission */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pl-6">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Maintenance & Commission
          </span>
          <span className="text-base sm:text-lg font-bold text-[#031B2A] block">
            {formattedMaintenance}
          </span>
          <span className="text-[11px] font-extrabold text-[#3C8D68] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ₹Verified Listings (Zero)
          </span>
        </div>
      </div>
    </div>
  );
};
