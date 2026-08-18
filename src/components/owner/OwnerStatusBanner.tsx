import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react-native';

interface OwnerStatusBannerProps {
  pendingEnquiriesCount: number;
  pendingVisitsCount: number;
  hasDraft: boolean;
  onPressAction?: () => void;
}

export const OwnerStatusBanner: React.FC<OwnerStatusBannerProps> = ({
  pendingEnquiriesCount,
  pendingVisitsCount,
  hasDraft,
  onPressAction,
}) => {
  const totalAlerts =
    (pendingEnquiriesCount > 0 ? 1 : 0) +
    (pendingVisitsCount > 0 ? 1 : 0) +
    (hasDraft ? 1 : 0);

  if (totalAlerts === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.caughtUpCard}>
          <CheckCircle2 size={18} color="#32B768" strokeWidth={2.2} />
          <View style={{ flex: 1 }}>
            <Text style={styles.caughtUpTitle}>You're all caught up</Text>
            <Text style={styles.caughtUpSub}>
              All enquiries and visit requests have been addressed.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const items: string[] = [];
  if (pendingEnquiriesCount > 0) {
    items.push(`${pendingEnquiriesCount} new enquiry awaiting response`);
  }
  if (pendingVisitsCount > 0) {
    items.push(`${pendingVisitsCount} visit request pending confirmation`);
  }
  if (hasDraft) {
    items.push('1 listing draft pending completion');
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.alertCard}
        onPress={onPressAction}
        accessibilityRole="button"
        accessibilityLabel={`${totalAlerts} items need your attention`}
      >
        <View style={styles.alertIconWrap}>
          <AlertCircle size={20} color="#F59E0B" strokeWidth={2.2} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>
            {totalAlerts} {totalAlerts === 1 ? 'item needs' : 'items need'} your attention
          </Text>
          <Text style={styles.alertSub} numberOfLines={1}>
            {items.join(' · ')}
          </Text>
        </View>

        <ChevronRight size={16} color="#777482" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  caughtUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EAF8F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6EED5',
    padding: 14,
  },
  caughtUpTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  caughtUpSub: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
    marginTop: 1,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#92400E',
  },
  alertSub: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '500',
    marginTop: 1,
  },
});
