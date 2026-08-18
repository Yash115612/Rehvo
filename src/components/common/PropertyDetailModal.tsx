import React from 'react';
import { Property } from '../../types';
import { PropertyDetailsScreen } from '../property/PropertyDetailsScreen';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onScheduleVisit?: (prop: Property) => void;
  onContactOwner?: (prop: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onScheduleVisit,
  onContactOwner,
}) => {
  if (!isOpen) return null;

  return (
    <PropertyDetailsScreen
      property={property}
      onBack={onClose}
      isSaved={isSaved}
      onToggleSave={onToggleSave}
      onScheduleVisit={onScheduleVisit}
      onContactOwner={onContactOwner}
    />
  );
};
