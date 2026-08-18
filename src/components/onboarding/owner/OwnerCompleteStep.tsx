import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Sparkles,
  PlusCircle,
  LayoutDashboard,
  CheckCircle2,
  Building2,
} from 'lucide-react-native';

interface OwnerCompleteStepProps {
  ownerName: string;
  onListProperty: () => void;
  onGoToDashboard: () => void;
}

export const OwnerCompleteStep: React.FC<OwnerCompleteStepProps> = ({
  ownerName,
  onListProperty,
  onGoToDashboard,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.badgeText}>Setup Complete</Text>
        </View>
        <Text style={styles.heading}>You're ready to list, {ownerName}.</Text>
        <Text style={styles.subheading}>
          Your owner profile is active on REHVO. You can list your first
          property right now or manage your account from the Owner Dashboard.
        </Text>
      </View>

      {/* Success Card */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Building2 size={36} color="#6C4DFF" strokeWidth={1.8} />
        </View>
        <Text style={styles.cardHeading}>Zero Commission Listings</Text>
        <Text style={styles.cardBody}>
          Connect directly with verified tenants across Mumbai. Upload photos,
          set rent & deposit, and receive instant visit requests.
        </Text>

        <View style={styles.checklist}>
          <View style={styles.checkRow}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.checkText}>Verified owner badge active</Text>
          </View>
          <View style={styles.checkRow}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.checkText}>Direct tenant messaging enabled</Text>
          </View>
          <View style={styles.checkRow}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.checkText}>Physical visit management ready</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Pressable
          style={styles.primaryBtn}
          onPress={onListProperty}
          accessibilityRole="button"
          accessibilityLabel="List a property now"
        >
          <PlusCircle size={20} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.primaryBtnText}>List a property</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={onGoToDashboard}
          accessibilityRole="button"
          accessibilityLabel="Go to Owner Dashboard"
        >
          <LayoutDashboard size={18} color="#171522" strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Go to Dashboard</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
  },
  cardBody: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
  checklist: {
    width: '100%',
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  footer: {
    paddingVertical: 12,
    gap: 10,
  },
  primaryBtn: {
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
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
});
