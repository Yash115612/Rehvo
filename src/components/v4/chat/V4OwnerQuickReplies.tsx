import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Sparkles, Calendar, FileText, IndianRupee, Send } from 'lucide-react-native';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4OwnerQuickRepliesProps {
  propertyName?: string;
  onSelectReply: (text: string) => void;
  onSendVisitInvite?: () => void;
  onSendAgreement?: () => void;
  onSendRentReminder?: () => void;
}

export const V4OwnerQuickReplies: React.FC<V4OwnerQuickRepliesProps> = ({
  propertyName = 'the property',
  onSelectReply,
  onSendVisitInvite,
  onSendAgreement,
  onSendRentReminder,
}) => {
  const templates = [
    `Hi, thanks for your interest in ${propertyName}! When would you like to move in?`,
    'Would you like to schedule a physical tour tomorrow at 5 PM?',
    'Please upload your Aadhaar and PAN via REHVO DigiLocker for instant verified listing verification.',
    'The deposit is 2 months rent, fully escrow-protected in REHVO with zero deduction guarantee.',
    'The 11-month state-stamped digital agreement is ready for your signature.',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Sparkles size={11} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.headerLabel}>SMART OWNER REPLIES</Text>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickToolsRow}>
          {onSendVisitInvite && (
            <Pressable style={styles.toolBtn} onPress={onSendVisitInvite}>
              <Calendar size={11} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.toolBtnText}>Tour</Text>
            </Pressable>
          )}

          {onSendAgreement && (
            <Pressable style={styles.toolBtn} onPress={onSendAgreement}>
              <FileText size={11} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.toolBtnText}>Lease</Text>
            </Pressable>
          )}

          {onSendRentReminder && (
            <Pressable style={styles.toolBtn} onPress={onSendRentReminder}>
              <IndianRupee size={11} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.toolBtnText}>Rent</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Horizontal Scroll of Templates */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {templates.map((tpl, idx) => (
          <Pressable
            key={idx}
            style={styles.chip}
            onPress={() => onSelectReply(tpl)}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              {tpl}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  quickToolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  toolBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 6,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 260,
  },
  chipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
});
