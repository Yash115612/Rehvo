import React from 'react';
import {
  House,
  Search,
  Plus,
  Heart,
  UserRound,
} from 'lucide-react-native';
import {
  FloatingCapsuleNav,
  NavSlotItem,
} from './FloatingCapsuleNav';

export type RenterTab = 'home' | 'search' | 'saved' | 'profile';

export interface FloatingBottomNavProps {
  activeTab: RenterTab;
  onTabPress: (tab: RenterTab) => void;
  onOpenListProperty: () => void;
}

const RENTER_SLOTS: NavSlotItem<RenterTab | 'add'>[] = [
  {
    id: 'home',
    icon: House,
    label: 'Home',
  },
  {
    id: 'search',
    icon: Search,
    label: 'Search',
  },
  {
    id: 'add',
    icon: Plus,
    label: 'List Property',
    isPrimaryAction: true,
  },
  {
    id: 'saved',
    icon: Heart,
    label: 'Saved',
  },
  {
    id: 'profile',
    icon: UserRound,
    label: 'Profile',
  },
];

/**
 * FloatingBottomNav — Dark Sculpted Capsule Navigation for Renters
 *
 * Slots: Home | Search | (+) List Property | Saved | Profile
 */
export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onTabPress,
  onOpenListProperty,
}) => {
  return (
    <FloatingCapsuleNav<RenterTab | 'add'>
      activeTab={activeTab}
      slots={RENTER_SLOTS}
      onTabPress={(tab) => {
        if (tab !== 'add') {
          onTabPress(tab as RenterTab);
        }
      }}
      onPrimaryAction={onOpenListProperty}
    />
  );
};
