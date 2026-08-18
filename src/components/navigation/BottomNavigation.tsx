import React from 'react';
import { FloatingBottomNav, RenterTab } from './FloatingBottomNav';

export type MainTab = RenterTab | 'list_property';

export interface BottomNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onOpenListProperty?: () => void;
  savedCount?: number;
}

/**
 * BottomNavigation (Legacy Adapter)
 * Delegates directly to the canonical FloatingBottomNav component.
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenListProperty,
}) => {
  const renterTab: RenterTab =
    activeTab === 'list_property' ? 'home' : (activeTab as RenterTab);

  return (
    <FloatingBottomNav
      activeTab={renterTab}
      onTabPress={(tab) => onTabChange(tab)}
      onOpenListProperty={onOpenListProperty || (() => onTabChange('list_property'))}
    />
  );
};
