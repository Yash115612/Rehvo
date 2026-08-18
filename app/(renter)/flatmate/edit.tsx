import React from 'react';
import { FlatmateCreateFlowScreen } from '../../../src/components/flatmates/FlatmateCreateFlowScreen';
import { useAppStore } from '../../../src/store/useAppStore';

export default function EditFlatmatePage() {
  const { myFlatmateProfile } = useAppStore();
  return (
    <FlatmateCreateFlowScreen
      initialData={myFlatmateProfile}
      isEditing={true}
    />
  );
}
