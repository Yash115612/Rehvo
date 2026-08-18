import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../../store/useAppStore';
import { Visit, Property } from '../../../types';
import { OwnerVisitsHeader } from './OwnerVisitsHeader';
import { OwnerVisitsSummary } from './OwnerVisitsSummary';
import { OwnerDateFilterBar } from './OwnerDateFilterBar';
import { OwnerVisitsStatusTabs, VisitFilterTab } from './OwnerVisitsStatusTabs';
import { OwnerVisitCard } from './OwnerVisitCard';
import { OwnerVisitDetailsModal } from './OwnerVisitDetailsModal';
import { OwnerRescheduleModal } from './OwnerRescheduleModal';
import { OwnerCancelVisitModal } from './OwnerCancelVisitModal';
import { OwnerVisitsEmptyState } from './OwnerVisitsEmptyState';

export const OwnerVisitsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    visits,
    properties,
    updateVisitStatus,
    cancelVisit,
    confirmVisit,
    fetchVisits,
    fetchMyProperties,
    showToast,
  } = useAppStore();

  const [selectedDateId, setSelectedDateId] = useState('ALL');
  const [activeStatusTab, setActiveStatusTab] = useState<VisitFilterTab>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  React.useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchVisits(), fetchMyProperties()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchVisits, fetchMyProperties]);

  // Counts for summary and status tabs
  const counts = useMemo(() => {
    const pendingC = visits.filter((v) => v.status === 'REQUESTED' || v.status === 'RESCHEDULED').length;
    const confirmedC = visits.filter((v) => v.status === 'CONFIRMED').length;
    const completedC = visits.filter((v) => v.status === 'COMPLETED').length;
    const cancelledC = visits.filter((v) => v.status === 'CANCELLED').length;

    return {
      ALL: visits.length,
      PENDING: pendingC,
      CONFIRMED: confirmedC,
      COMPLETED: completedC,
      CANCELLED: cancelledC,
    };
  }, [visits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    let list = [...visits];

    // Status filter
    if (activeStatusTab === 'PENDING') {
      list = list.filter((v) => v.status === 'REQUESTED' || v.status === 'RESCHEDULED');
    } else if (activeStatusTab === 'CONFIRMED') {
      list = list.filter((v) => v.status === 'CONFIRMED');
    } else if (activeStatusTab === 'COMPLETED') {
      list = list.filter((v) => v.status === 'COMPLETED');
    } else if (activeStatusTab === 'CANCELLED') {
      list = list.filter((v) => v.status === 'CANCELLED');
    }

    // Date filter
    if (selectedDateId === 'TODAY') {
      list = list.filter((v) => v.date.toLowerCase().includes('today') || v.date.toLowerCase().includes('aug 14'));
    } else if (selectedDateId === 'TOMORROW') {
      list = list.filter((v) => v.date.toLowerCase().includes('tomorrow') || v.date.toLowerCase().includes('aug 15'));
    }

    return list;
  }, [visits, activeStatusTab, selectedDateId]);

  const selectedProperty = useMemo(() => {
    if (!selectedVisit) return null;
    return (
      properties.find((p) => p.id === selectedVisit.property_id) ||
      properties[0] ||
      null
    );
  }, [properties, selectedVisit]);

  const handleOpenVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setDetailsModalVisible(true);
  };

  const handleViewProperty = (prop: Property) => {
    setDetailsModalVisible(false);
    router.push(`/(renter)/property/${prop.id}`);
  };

  const handleConfirmReschedule = async (newDate: string, newTime: string, note?: string) => {
    if (!selectedVisit) return;
    await updateVisitStatus(selectedVisit.id, 'RESCHEDULED');
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedVisit) return;
    await cancelVisit(selectedVisit.id, reason);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header */}
      <OwnerVisitsHeader />

      {/* FlatList for all content */}
      <FlatList
        data={filteredVisits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 110 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerStack}>
            {/* 2. Top Summary */}
            <OwnerVisitsSummary
              totalCount={counts.ALL}
              todayCount={1}
              thisWeekCount={counts.CONFIRMED}
              pendingCount={counts.PENDING}
            />

            {/* 3. Date Filter Pills */}
            <OwnerDateFilterBar
              selectedDateId={selectedDateId}
              onSelectDate={setSelectedDateId}
            />

            {/* 4. Status Tabs */}
            <OwnerVisitsStatusTabs
              activeTab={activeStatusTab}
              onSelectTab={setActiveStatusTab}
              counts={counts}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <OwnerVisitCard
              visit={item}
              onPress={() => handleOpenVisit(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <OwnerVisitsEmptyState
            activeTab={activeStatusTab}
            onViewEnquiries={() => router.push('/(owner)/enquiries')}
          />
        }
      />

      {/* Dedicated Full-Screen Visit Details Modal */}
      <OwnerVisitDetailsModal
        visit={selectedVisit}
        property={selectedProperty}
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        onViewProperty={handleViewProperty}
        onOpenReschedule={(v) => {
          setSelectedVisit(v);
          setRescheduleModalVisible(true);
        }}
        onOpenCancel={(v) => {
          setSelectedVisit(v);
          setCancelModalVisible(true);
        }}
      />

      {/* Reschedule Modal */}
      <OwnerRescheduleModal
        visit={selectedVisit}
        visible={rescheduleModalVisible}
        onClose={() => setRescheduleModalVisible(false)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Cancel Modal */}
      <OwnerCancelVisitModal
        visit={selectedVisit}
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  listContent: {
    paddingTop: 4,
  },
  headerStack: {
    gap: 10,
    marginBottom: 12,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
});
