import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../../store/useAppStore';
import { Enquiry, Property } from '../../../types';
import { OwnerEnquiriesHeader } from './OwnerEnquiriesHeader';
import { OwnerEnquiriesSummary } from './OwnerEnquiriesSummary';
import {
  OwnerEnquiriesFilterTabs,
  EnquiryFilterTab,
} from './OwnerEnquiriesFilterTabs';
import { OwnerEnquiriesSearchBar } from './OwnerEnquiriesSearchBar';
import { OwnerEnquiryRow } from './OwnerEnquiryRow';
import { OwnerEnquiryDetailsModal } from './OwnerEnquiryDetailsModal';
import { OwnerEnquiriesEmptyState } from './OwnerEnquiriesEmptyState';
import { ScheduleVisitModal } from '../../property/ScheduleVisitModal';

export const OwnerEnquiriesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    enquiries,
    properties,
    fetchEnquiries,
    fetchMyProperties,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<EnquiryFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  React.useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchEnquiries(), fetchMyProperties()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchEnquiries, fetchMyProperties]);

  // Counts for summary and tabs
  const counts = useMemo(() => {
    const newC = enquiries.filter((e) => e.status === 'NEW').length;
    const repliedC = enquiries.filter(
      (e) => e.status === 'CONTACTED' || e.status === 'APPLIED'
    ).length;
    const visitsC = enquiries.filter((e) => e.status === 'VISIT_SCHEDULED').length;
    const closedC = enquiries.filter((e) => e.status === 'CLOSED').length;

    return {
      ALL: enquiries.length,
      NEW: newC,
      REPLIED: repliedC,
      VISIT_SCHEDULED: visitsC,
      CLOSED: closedC,
    };
  }, [enquiries]);

  // Filtered and searched enquiries
  const filteredEnquiries = useMemo(() => {
    let list = [...enquiries];

    // Status filter
    if (activeTab === 'NEW') {
      list = list.filter((e) => e.status === 'NEW');
    } else if (activeTab === 'REPLIED') {
      list = list.filter(
        (e) => e.status === 'CONTACTED' || e.status === 'APPLIED'
      );
    } else if (activeTab === 'VISIT_SCHEDULED') {
      list = list.filter((e) => e.status === 'VISIT_SCHEDULED');
    } else if (activeTab === 'CLOSED') {
      list = list.filter((e) => e.status === 'CLOSED');
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.renter_name?.toLowerCase().includes(q) ||
          e.property_title?.toLowerCase().includes(q) ||
          e.message?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [enquiries, activeTab, searchQuery]);

  const selectedProperty = useMemo(() => {
    if (!selectedEnquiry) return null;
    return (
      properties.find((p) => p.id === selectedEnquiry.property_id) ||
      properties[0] ||
      null
    );
  }, [properties, selectedEnquiry]);

  const handleOpenEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailsModalVisible(true);
  };

  const handleViewProperty = (prop: Property) => {
    setDetailsModalVisible(false);
    router.push(`/(renter)/property/${prop.id}`);
  };

  const handleScheduleVisitFromEnquiry = (enquiry: Enquiry) => {
    setScheduleModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Compact Header */}
      <OwnerEnquiriesHeader />

      {/* FlatList for smooth scrolling */}
      <FlatList
        data={filteredEnquiries}
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
            <OwnerEnquiriesSummary
              totalCount={counts.ALL}
              newCount={counts.NEW}
              repliedCount={counts.REPLIED}
              visitsCount={counts.VISIT_SCHEDULED}
            />

            {/* 3. Status Filters */}
            <OwnerEnquiriesFilterTabs
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              counts={counts}
            />

            {/* 4. Search bar */}
            <OwnerEnquiriesSearchBar
              query={searchQuery}
              onChangeQuery={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.rowWrapper}>
            <OwnerEnquiryRow
              enquiry={item}
              onPress={() => handleOpenEnquiry(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <OwnerEnquiriesEmptyState
            activeTab={activeTab}
            hasQuery={searchQuery.length > 0}
            onClearSearch={() => setSearchQuery('')}
            onViewProperties={() => router.push('/(owner)/properties')}
          />
        }
      />

      {/* Full-Screen Dedicated Enquiry Details Modal */}
      <OwnerEnquiryDetailsModal
        enquiry={selectedEnquiry}
        property={selectedProperty}
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        onViewProperty={handleViewProperty}
        onScheduleVisit={handleScheduleVisitFromEnquiry}
      />

      {/* Schedule Visit Modal */}
      {selectedProperty && (
        <ScheduleVisitModal
          property={selectedProperty}
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}
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
    gap: 12,
    marginBottom: 12,
  },
  rowWrapper: {
    paddingHorizontal: 16,
  },
});
