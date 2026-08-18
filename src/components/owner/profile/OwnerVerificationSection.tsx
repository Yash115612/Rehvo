import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileBadge,
  Building2,
  ChevronRight,
} from 'lucide-react-native';
import { UserProfile } from '../../../types';

interface OwnerVerificationSectionProps {
  user: UserProfile | null;
  onCompleteVerification: () => void;
}

export const OwnerVerificationSection: React.FC<
  OwnerVerificationSectionProps
> = ({ user, onCompleteVerification }) => {
  const isIdentityVerified = user?.verification_status === 'VERIFIED';
  const isPhoneVerified = !!user?.phone;
  const isEmailVerified = !!user?.email;
  const isPropertyVerified = isIdentityVerified;

  const allVerified =
    isPhoneVerified &&
    isEmailVerified &&
    isIdentityVerified &&
    isPropertyVerified;

  const items = [
    {
      id: 'phone',
      label: 'Phone number',
      icon: Phone,
      verified: isPhoneVerified,
      status: isPhoneVerified ? 'Verified' : 'Pending',
    },
    {
      id: 'email',
      label: 'Email address',
      icon: Mail,
      verified: isEmailVerified,
      status: isEmailVerified ? 'Verified' : 'Pending',
    },
    {
      id: 'id',
      label: 'Government ID',
      icon: FileBadge,
      verified: isIdentityVerified,
      status: isIdentityVerified ? 'Verified' : 'Pending',
    },
    {
      id: 'prop',
      label: 'Property verification',
      icon: Building2,
      verified: isPropertyVerified,
      status: isPropertyVerified ? 'Verified' : 'Pending',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Verification</Text>

      <View style={styles.card}>
        <View style={styles.list}>
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;

            return (
              <View
                key={item.id}
                style={[styles.row, !isLast && styles.rowBorder]}
              >
                <View style={styles.iconWrap}>
                  <Icon size={16} color="#6C4DFF" strokeWidth={2} />
                </View>

                <Text style={styles.rowLabel}>{item.label}</Text>

                <View
                  style={[
                    styles.statusPill,
                    item.verified
                      ? styles.statusPillVerified
                      : styles.statusPillPending,
                  ]}
                >
                  {item.verified ? (
                    <CheckCircle2
                      size={12}
                      color="#32B768"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Clock size={12} color="#D97706" strokeWidth={2.2} />
                  )}
                  <Text
                    style={[
                      styles.statusText,
                      item.verified
                        ? styles.statusTextVerified
                        : styles.statusTextPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {!allVerified && (
          <Pressable
            style={styles.verifyBtn}
            onPress={onCompleteVerification}
            accessibilityRole="button"
            accessibilityLabel="Complete verification"
          >
            <ShieldCheck size={16} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.verifyBtnText}>Complete Verification</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 14,
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillVerified: {
    backgroundColor: '#EAF8F0',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusTextVerified: {
    color: '#32B768',
  },
  statusTextPending: {
    color: '#D97706',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
  },
  verifyBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
