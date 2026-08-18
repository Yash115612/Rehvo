import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Building2,
  ShieldCheck,
  MessageCircle,
  CalendarDays,
  ArrowRight,
} from 'lucide-react-native';

interface OwnerIntroStepProps {
  onContinue: () => void;
}

export const OwnerIntroStep: React.FC<OwnerIntroStepProps> = ({
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.badge}>
          <Building2 size={14} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.badgeText}>Owner & Host Setup</Text>
        </View>
        <Text style={styles.heading}>Let's get your property listed.</Text>
        <Text style={styles.subheading}>
          Set up your owner profile to connect with verified renters and manage
          enquiries directly with zero brokerage hassle.
        </Text>
      </View>

      {/* Benefits List */}
      <View style={styles.benefitsCard}>
        <View style={styles.benefitRow}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={20} color="#32B768" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.benefitTitle}>100% Verified Tenants</Text>
            <Text style={styles.benefitDesc}>
              Renters with verified phone numbers, emails, and profiles.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.benefitRow}>
          <View style={styles.iconWrap}>
            <MessageCircle size={20} color="#6C4DFF" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.benefitTitle}>Direct In-App Messaging</Text>
            <Text style={styles.benefitDesc}>
              Chat directly with interested renters without brokerage middlemen.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.benefitRow}>
          <View style={styles.iconWrap}>
            <CalendarDays size={20} color="#FF735C" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.benefitTitle}>Seamless Visit Scheduling</Text>
            <Text style={styles.benefitDesc}>
              Confirm and manage physical property visits on your schedule.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to property type"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleGroup: {
    paddingVertical: 12,
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    color: '#777482',
    lineHeight: 20,
    fontWeight: '500',
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 18,
    gap: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  benefitDesc: {
    fontSize: 12.5,
    color: '#777482',
    lineHeight: 17,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F0EA',
  },
  footer: {
    paddingVertical: 12,
  },
  continueBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
