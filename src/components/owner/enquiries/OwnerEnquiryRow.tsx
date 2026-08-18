import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Enquiry } from '../../../types';

interface OwnerEnquiryRowProps {
  enquiry: Enquiry;
  onPress: () => void;
}

export const OwnerEnquiryRow: React.FC<OwnerEnquiryRowProps> = ({
  enquiry,
  onPress,
}) => {
  const isNew = enquiry.status === 'NEW';

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'NEW':
        return { label: 'New', bg: '#F0ECFF', text: '#6C4DFF' };
      case 'VISIT_SCHEDULED':
        return { label: 'Visit Scheduled', bg: '#EAF8F0', text: '#32B768' };
      case 'APPLIED':
        return { label: 'Applied', bg: '#EAF8F0', text: '#32B768' };
      case 'CLOSED':
        return { label: 'Closed', bg: '#F3F0EA', text: '#777482' };
      case 'CONTACTED':
      default:
        return { label: 'Replied', bg: '#F3F0EA', text: '#777482' };
    }
  };

  const statusInfo = getStatusBadge(enquiry.status);
  const avatarUri =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  return (
    <Pressable
      style={[styles.row, isNew && styles.rowUnread]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Enquiry from ${enquiry.renter_name}`}
    >
      {/* Left: Avatar with optional unread dot */}
      <View style={styles.avatarWrap}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        {isNew && <View style={styles.unreadDot} />}
      </View>

      {/* Center: Details */}
      <View style={styles.detailsCol}>
        <View style={styles.topRow}>
          <Text
            style={[styles.renterName, isNew && styles.renterNameUnread]}
            numberOfLines={1}
          >
            {enquiry.renter_name}
          </Text>
          <Text style={styles.timeText}>10 min ago</Text>
        </View>

        <Text
          style={[styles.messageText, isNew && styles.messageTextUnread]}
          numberOfLines={1}
        >
          "{enquiry.message}"
        </Text>

        <Text style={styles.propText} numberOfLines={1}>
          {enquiry.property_title}
        </Text>
      </View>

      {/* Right: Status badge & chevron */}
      <View style={styles.rightCol}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusInfo.bg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusInfo.text },
            ]}
          >
            {statusInfo.label}
          </Text>
        </View>
        <ChevronRight size={16} color="#86828F" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  rowUnread: {
    backgroundColor: '#FAF9FF',
    borderColor: '#DED6FD',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E5EC',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C4DFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  detailsCol: {
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
    fontWeight: '600',
    color: '#171522',
  },
  renterNameUnread: {
    fontWeight: '800',
    color: '#171522',
  },
  timeText: {
    fontSize: 11,
    color: '#777482',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  messageTextUnread: {
    color: '#171522',
    fontWeight: '600',
  },
  propText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6C4DFF',
    marginTop: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
