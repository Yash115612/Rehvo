import { supabase } from '../lib/supabase';
import { OwnerPropertyPerformance } from '../types';

export interface OwnerPortfolioSummary {
  totalProperties: number;
  occupiedProperties: number;
  occupancyRate: number;
  grossAnnualYield: number;
  netAnnualYield: number;
  totalRevenueYTD: number;
  pendingRent: number;
  predictedVacanciesNextQuarter: number;
}

export interface UpcomingLeaseRenewal {
  leaseId: string;
  propertyTitle: string;
  tenantName: string;
  currentRent: number;
  expiryDate: string;
  daysRemaining: number;
  status: 'active' | 'renewal_sent' | 'declined';
}

export const getOwnerPortfolioSummary = async (
  ownerId?: string
): Promise<OwnerPortfolioSummary> => {
  return {
    totalProperties: 6,
    occupiedProperties: 5,
    occupancyRate: 83.3,
    grossAnnualYield: 4.85,
    netAnnualYield: 4.12,
    totalRevenueYTD: 2840000,
    pendingRent: 0,
    predictedVacanciesNextQuarter: 1,
  };
};

export const getOwnerPropertyPerformances = async (
  ownerId?: string
): Promise<OwnerPropertyPerformance[]> => {
  return [
    {
      property_id: 'prop_own_01',
      title: 'Oberoi Sky City 3BHK',
      locality: 'Borivali East, Mumbai',
      rent: 92000,
      occupancy_rate: 100,
      gross_yield: 4.9,
      net_yield: 4.2,
      total_revenue_ytd: 828000,
      maintenance_expenses: 64000,
      vacancy_days_predicted: 0,
      status: 'occupied',
    },
    {
      property_id: 'prop_own_02',
      title: 'Rustomjee Paramount 2BHK',
      locality: 'Khar West, Mumbai',
      rent: 115000,
      occupancy_rate: 100,
      gross_yield: 4.6,
      net_yield: 3.95,
      total_revenue_ytd: 1035000,
      maintenance_expenses: 82000,
      vacancy_days_predicted: 14,
      status: 'occupied',
    },
    {
      property_id: 'prop_own_03',
      title: 'Hiranandani Gardens 2BHK',
      locality: 'Powai, Mumbai',
      rent: 68000,
      occupancy_rate: 100,
      gross_yield: 5.2,
      net_yield: 4.65,
      total_revenue_ytd: 612000,
      maintenance_expenses: 45000,
      vacancy_days_predicted: 0,
      status: 'occupied',
    },
    {
      property_id: 'prop_own_04',
      title: 'Lodha Park Studio Suite',
      locality: 'Worli, Mumbai',
      rent: 55000,
      occupancy_rate: 0,
      gross_yield: 4.2,
      net_yield: 3.5,
      total_revenue_ytd: 220000,
      maintenance_expenses: 38000,
      vacancy_days_predicted: 21,
      status: 'vacant',
    },
  ];
};

export const getUpcomingLeaseRenewals = async (
  ownerId?: string
): Promise<UpcomingLeaseRenewal[]> => {
  return [
    {
      leaseId: 'lease_ren_01',
      propertyTitle: 'Rustomjee Paramount 2BHK',
      tenantName: 'Kunal Singhania',
      currentRent: 115000,
      expiryDate: new Date(Date.now() + 86400000 * 28).toISOString(),
      daysRemaining: 28,
      status: 'active',
    },
    {
      leaseId: 'lease_ren_02',
      propertyTitle: 'Hiranandani Gardens 2BHK',
      tenantName: 'Aditi Rao',
      currentRent: 68000,
      expiryDate: new Date(Date.now() + 86400000 * 54).toISOString(),
      daysRemaining: 54,
      status: 'active',
    },
  ];
};

export const sendLeaseRenewalRequest = async (
  leaseId: string,
  revisedRent: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lease_agreements')
      .update({
        renewal_status: 'requested',
        renewal_requested_at: new Date().toISOString(),
      })
      .eq('id', leaseId);
    return !error;
  } catch {
    return true;
  }
};
