import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { ArrowRight, MessageCircle } from 'lucide-react-native';
import { Conversation } from '../../types';

interface OwnerRecentEnquiriesProps {
  enquiries: Conversation[];
  onViewAll: () => void;
  onSelectEnquiry: (enquiry: Conversation) => void;
}

export const OwnerRecentEnquiries: React.FC<OwnerRecentEnquiriesProps> = ({
  enquiries,
  onViewAll,
  onSelectEnquiry,
}) => {
  if (!enquiries || enquiries.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent enquiries</Text>
        <Pressable
          style={styles.viewAllBtn}
          onPress={onViewAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View all enquiries"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ArrowRight size={14} color="#6C4DFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {enquiries.slice(0, 3).map((item) => {
          const avatarUri =
            item.renter_avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

          const hasUnread = item.unread_count > 0;

          return (
            <Pressable
              key={item.id}
              style={styles.enquiryCard}
              onPress={() => onSelectEnquiry(item)}
              accessibilityRole="button"
              accessibilityLabel={`Enquiry from ${item.renter_name}`}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatar} />

              <View style={styles.infoCol}>
                <View style={styles.topRow}>
                  <Text style={styles.renterName} numberOfLines={1}>
                    {item.renter_name}
                  </Text>
                  <Text style={styles.timeText}>10 min ago</Text>
                </View>

                <Text style={styles.propTitle} numberOfLines={1}>
                  Interested in {item.property_title}
                </Text>

                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.last_message || 'Is this property still available?'}
                </Text>
              </View>

              {hasUnread ? (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
              ) : (
                <View style={styles.repliedBadge}>
                  <Text style={styles.repliedBadgeText}>Replied</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  list: {
    gap: 10,
  },
  enquiryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E5EC',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  timeText: {
    fontSize: 11,
    color: '#777482',
    fontWeight: '500',
  },
  propTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  lastMsg: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  newBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  repliedBadge: {
    backgroundColor: '#F3F0EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  repliedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
  },
});
