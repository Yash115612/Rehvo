import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileCheck,
  ArrowRight,
} from 'lucide-react-native';

interface OwnerVerificationStepProps {
  phone: string;
  email: string;
  onContinue: () => void;
}

export const OwnerVerificationStep: React.FC<OwnerVerificationStepProps> = ({
  phone,
  email,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.badge}>
          <ShieldCheck size={14} color="#32B768" strokeWidth={2.5} />
          <Text style={styles.badgeText}>Trust & Safety</Text>
        </View>
        <Text style={styles.heading}>Owner trust verification</Text>
        <Text style={styles.subheading}>
          Verified hosts receive 3x more inquiries and priority placement on
          the REHVO marketplace.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Phone Verification */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Phone size={20} color="#32B768" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.cardTitle}>Mobile Number</Text>
            <Text style={styles.cardVal}>{phone || '+91 98765 43210'}</Text>
          </View>
          <View style={styles.statusBadge}>
            <CheckCircle2 size={13} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.statusText}>Verified</Text>
          </View>
        </View>

        {/* 2. Email Verification */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Mail size={20} color="#6C4DFF" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.cardTitle}>Email Address</Text>
            <Text style={styles.cardVal}>
              {email || 'owner@rehvo.com'}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <CheckCircle2 size={13} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.statusText}>Verified</Text>
          </View>
        </View>

        {/* 3. Ownership / RERA / Identity */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <FileCheck size={20} color="#FF735C" strokeWidth={2.2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.cardTitle}>Government ID / RERA</Text>
            <Text style={styles.cardVal}>Fast verification during listing</Text>
          </View>
          <View style={[styles.statusBadge, styles.statusBadgePending]}>
            <Clock size={13} color="#F59E0B" strokeWidth={2.2} />
            <Text style={styles.statusTextPending}>During Listing</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why verify on REHVO?</Text>
          <Text style={styles.infoDesc}>
            Tenants trust listings with verified host badges. You can upload
            property ownership documents directly when creating your listing.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to completion"
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
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#C3EEDB',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B8246',
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
  scrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FAF9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
  },
  cardVal: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1B8246',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusTextPending: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400E',
  },
  infoCard: {
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  infoTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  infoDesc: {
    fontSize: 12.5,
    color: '#777482',
    lineHeight: 18,
    fontWeight: '500',
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
