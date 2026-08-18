import { PropertyType, FurnishingType } from '../../../types';

export type GuidedPropertyCategory =
  | 'FLAT'
  | 'PG'
  | 'PRIVATE_ROOM'
  | 'SHARED_ROOM'
  | 'FLATMATE'
  | 'STUDIO';

export type GuidedSpaceType =
  | '1 RK'
  | '1 BHK'
  | '2 BHK'
  | '3 BHK'
  | '4+ BHK'
  | 'SINGLE_OCCUPANCY'
  | 'DOUBLE_OCCUPANCY'
  | 'TRIPLE_OCCUPANCY'
  | 'ANY_OCCUPANCY'
  | 'PRIVATE_ROOM'
  | 'SHARED_ROOM';

export type GuidedMoveInTime =
  | 'IMMEDIATE'
  | 'WITHIN_2_WEEKS'
  | 'WITHIN_1_MONTH'
  | 'IN_2_3_MONTHS'
  | 'NOT_DECIDED';

export interface GuidedSearchState {
  category: GuidedPropertyCategory;
  rentMin: number;
  rentMax: number;
  locations: string[];
  spaceType: GuidedSpaceType | 'ANY';
  furnishing: FurnishingType | 'ALL';
  preferences: string[]; // e.g. 'No Brokerage', 'Near Metro', 'Parking', 'AC', 'Wi-Fi', 'Lift', 'Power Backup', 'Balcony', 'Pet Friendly', 'Security'
  moveInTime: GuidedMoveInTime;
}

export const INITIAL_GUIDED_STATE: GuidedSearchState = {
  category: 'FLAT',
  rentMin: 15000,
  rentMax: 45000,
  locations: ['Andheri West'],
  spaceType: '2 BHK',
  furnishing: 'ALL',
  preferences: ['No Brokerage'],
  moveInTime: 'WITHIN_1_MONTH',
};
