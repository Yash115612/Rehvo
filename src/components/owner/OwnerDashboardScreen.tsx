import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Building2, ArrowRight } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { UserProfile, Property, Conversation, Visit } from '../../types';
import { OwnerHeader } from './OwnerHeader';
import { OwnerStatusBanner } from './OwnerStatusBanner';
import { OwnerAttentionSection } from './OwnerAttentionSection';
import { OwnerOverviewStats } from './OwnerOverviewStats';
import { OwnerListPropertyCTA } from './OwnerListPropertyCTA';
import { OwnerPropertiesSection } from './OwnerPropertiesSection';
import { OwnerPerformanceSnapshot } from './OwnerPerformanceSnapshot';
import { OwnerRecentEnquiries } from './OwnerRecentEnquiries';
import { OwnerUpcomingVisits } from './OwnerUpcomingVisits';
import { OwnerEmptyState } from './OwnerEmptyState';
import { OwnerPropertyActionSheet } from './OwnerPropertyActionSheet';
import { NotificationsModal } from '../notifications/NotificationsModal';

interface OwnerDashboardScreenProps {
  user: UserProfile | null;
  onLogout?: () => void;
}

export const OwnerDashboardScreen: React.FC<OwnerDashboardScreenProps> = ({
  user,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);

  const {
    properties,
    conversations,
    visits,
    enquiries,
    unreadNotificationCount,
    updateProperty,
    deleteProperty,
    fetchMyProperties,
    fetchEnquiries,
    fetchVisits,
    fetchNotifications,
    showToast,
  } = useAppStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useEffect(() => {
    fetchMyProperties();
    fetchEnquiries();
    fetchVisits();
  }, [fetchMyProperties, fetchEnquiries, fetchVisits]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchMyProperties(), fetchEnquiries(), fetchVisits()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchMyProperties, fetchEnquiries, fetchVisits]);

  // Properties owned by current user
  const ownerProperties = useMemo(() => {
    if (!user) return [];
    return properties.filter(
      (p) => p.owner_id === user.id || (user.phone && p.owner_phone === user.phone)
    );
  }, [properties, user]);

  const hasPropertyListing = ownerProperties.length > 0;

  const activePropertiesCount = useMemo(() => {
    return ownerProperties.filter((p) => p.status !== 'PAUSED' && p.status !== 'DRAFT').length;
  }, [ownerProperties]);

  const totalViewsCount = useMemo(() => {
    return ownerProperties.reduce((acc, p) => acc + (p.views_count || 0), 0);
  }, [ownerProperties]);

  const pendingEnquiries = useMemo(() => {
    return enquiries.filter((e) => e.status === 'NEW');
  }, [enquiries]);

  const pendingVisits = useMemo(() => {
    return visits.filter((v) => v.status === 'REQUESTED');
  }, [visits]);

  // Action items for "Needs your attention"
  const attentionItems = useMemo(() => {
    const items = [];

    if (pendingEnquiries.length > 0) {
      items.push({
        id: 'att_enq',
        type: 'enquiry' as const,
        title: `${pendingEnquiries.length} new enquiry awaiting response`,
        subtitle: `Latest from ${pendingEnquiries[0]?.renter_name || 'Renter'}`,
        actionText: 'Reply',
        onPress: () => router.push('/(owner)/enquiries'),
      });
    }

    if (pendingVisits.length > 0) {
      items.push({
        id: 'att_visit',
        type: 'visit' as const,
        title: `${pendingVisits.length} visit request pending confirmation`,
        subtitle: `${pendingVisits[0]?.property_title} · ${pendingVisits[0]?.date}`,
        actionText: 'Confirm',
        onPress: () => router.push('/(owner)/visits'),
      });
    }

    return items;
  }, [pendingEnquiries, pendingVisits, router]);

  // Navigate to Listing Flow
  const handleListProperty = () => {
    router.push('/(renter)/listing/property-type');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
      >
        {/* 1. Lister Header */}
        <OwnerHeader
          user={user}
          unreadNotifications={unreadNotificationCount > 0}
          onNotificationPress={() => setNotificationsModalVisible(true)}
        />

        {/* 2. Account Status Banner */}
        <OwnerStatusBanner
          pendingEnquiriesCount={pendingEnquiries.length}
          pendingVisitsCount={pendingVisits.length}
          hasDraft={false}
          onPressAction={() => router.push('/(owner)/enquiries')}
        />

        {/* 3. Attention Section */}
        {attentionItems.length > 0 && (
          <OwnerAttentionSection items={attentionItems} />
        )}

        {/* 4. Overview KPI Stats */}
        <OwnerOverviewStats
          activeListingsCount={activePropertiesCount}
          totalViewsCount={totalViewsCount}
          enquiriesCount={pendingEnquiries.length}
          upcomingVisitsCount={pendingVisits.length}
        />

        {/* 5. List New Property CTA */}
        <OwnerListPropertyCTA onListProperty={handleListProperty} />

        {/* 6. My Properties Section */}
        {ownerProperties.length > 0 ? (
          <OwnerPropertiesSection
            properties={ownerProperties}
            onViewAll={() => router.push('/(owner)/properties')}
            onSelectProperty={(p) => router.push(`/(renter)/property/${p.id}`)}
            onOpenActions={(p) => {
              setSelectedProperty(p);
              setActionSheetVisible(true);
            }}
          />
        ) : (
          <OwnerEmptyState onListProperty={handleListProperty} />
        )}

        {/* 8. Performance Snapshot */}
        <OwnerPerformanceSnapshot />

        {/* 9. Recent Enquiries */}
        <OwnerRecentEnquiries
          enquiries={conversations.slice(0, 3)}
          onViewAll={() => router.push('/(owner)/enquiries')}
          onSelectEnquiry={(conv) => router.push(`/(owner)/chat/${conv.id}`)}
        />

        {/* 10. Upcoming Scheduled Visits */}
        <OwnerUpcomingVisits
          visits={visits.slice(0, 3)}
          onViewAll={() => router.push('/(owner)/visits')}
          onSelectVisit={() => router.push('/(owner)/visits')}
        />
      </ScrollView>

      {/* Property Action Sheet */}
      <OwnerPropertyActionSheet
        visible={actionSheetVisible}
        property={selectedProperty}
        onClose={() => setActionSheetVisible(false)}
        onView={(p) => {
          setActionSheetVisible(false);
          router.push(`/(renter)/property/${p.id}`);
        }}
        onEdit={(p) => {
          setActionSheetVisible(false);
          router.push('/(renter)/listing/property-type');
        }}
        onToggleStatus={(p) => {
          setActionSheetVisible(false);
          const nextStatus = p.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
          updateProperty(p.id, { status: nextStatus });
        }}
        onMarkRented={(p) => {
          setActionSheetVisible(false);
          updateProperty(p.id, { status: 'RENTED' });
        }}
        onDelete={(p) => {
          setActionSheetVisible(false);
          deleteProperty(p.id);
          showToast('Listing removed', 'info');
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
});
