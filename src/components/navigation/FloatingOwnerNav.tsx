import React from 'react';
import {
  LayoutGrid,
  Building2,
  MessageCircle,
  CalendarDays,
  UserRound,
} from 'lucide-react-native';
import {
  FloatingCapsuleNav,
  NavSlotItem,
} from './FloatingCapsuleNav';

export type OwnerTab = 'dashboard' | 'properties' | 'enquiries' | 'visits' | 'profile';

export interface FloatingOwnerNavProps {
  activeTab: OwnerTab;
  onTabPress: (tab: OwnerTab) => void;
}

const OWNER_SLOTS: NavSlotItem<OwnerTab>[] = [
  {
    id: 'dashboard',
    icon: LayoutGrid,
    label: 'Dashboard',
  },
  {
    id: 'properties',
    icon: Building2,
    label: 'Properties',
  },
  {
    id: 'enquiries',
    icon: MessageCircle,
    label: 'Enquiries',
  },
  {
    id: 'visits',
    icon: CalendarDays,
    label: 'Visits',
  },
  {
    id: 'profile',
    icon: UserRound,
    label: 'Profile',
  },
];

/**
 * FloatingOwnerNav — Dark Sculpted Capsule Navigation for Owners
 *
 * Slots: Dashboard | Properties | Enquiries | Visits | Profile
 */
export const FloatingOwnerNav: React.FC<FloatingOwnerNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <FloatingCapsuleNav<OwnerTab>
      activeTab={activeTab}
      slots={OWNER_SLOTS}
      onTabPress={onTabPress}
    />
  );
};
