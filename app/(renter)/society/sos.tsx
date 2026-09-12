import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldAlert,
  PhoneCall,
  Flame,
  Ambulance,
  Shield,
  Users,
  AlertOctagon,
  CheckCircle2,
  BellRing,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';

export default function SocietySosRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    leaseAgreements,
    triggerSosAlert,
    emergencyContacts,
    fetchEmergencyContacts,
    showToast,
  } = useAppStore();

  const [isTriggering, setIsTriggering] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const societyName = activeProperty?.society_name || activeProperty?.title || 'Prestige Green Gables';
  const unitNumber = activeProperty?.unit_number || 'Tower 4 - Flat 1204';

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const handleTriggerSOS = async () => {
    setIsTriggering(true);
    triggerHapticFeedback('notificationError');

    const res = await triggerSosAlert({
      location_address: `${societyName}, ${unitNumber}`,
      alert_type: 'general',
    });

    setIsTriggering(false);

    if (res.success) {
      setSosActive(true);
      triggerHapticFeedback('impactHeavy');
      showToast?.('🚨 SOS broadcast sent to Society Gate & Emergency Contacts!', 'error');
    } else {
      showToast?.('Failed to broadcast SOS', 'error');
    }
  };

  const dialNumber = (phone: string, label: string) => {
    triggerHapticFeedback('selection');
    Linking.openURL(`tel:${phone}`).catch(() => {
      showToast?.(`Unable to dial ${label} (${phone}) on this device`, 'info');
    });
  };

  const emergencyServices = [
    {
      title: 'Main Gate Security',
      subtitle: 'Trained security guard on duty 24/7',
      phone: '+919876543210',
      icon: Shield,
      bg: '#FEF2F2',
      color: '#E11D48',
    },
    {
      title: 'Facility Manager Desk',
      subtitle: 'Electrical, lift breakdown & water',
      phone: '+919876543211',
      icon: Users,
      bg: '#FFF7ED',
      color: '#EA580C',
    },
    {
      title: 'National Emergency / Police',
      subtitle: 'Dial 112 for urgent police assistance',
      phone: '112',
      icon: ShieldAlert,
      bg: '#EFF6FF',
      color: '#2563EB',
    },
    {
      title: 'Medical Ambulance',
      subtitle: 'Dial 108 for fast medical response',
      phone: '108',
      icon: Ambulance,
      bg: '#ECFDF5',
      color: '#059669',
    },
    {
      title: 'Fire Brigade',
      subtitle: 'Dial 101 in case of smoke or fire',
      phone: '101',
      icon: Flame,
      bg: '#FFF1F2',
      color: '#BE123C',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            triggerHapticFeedback('selection');
            router.back();
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Emergency SOS Hub</Text>
          <Text style={styles.headerSubtitle}>{societyName} • {unitNumber}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Alert Banner if triggered */}
        {sosActive && (
          <View style={styles.alertBanner}>
            <BellRing size={24} color="#991B1B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertBannerTitle}>EMERGENCY ALERT BROADCAST ACTIVE</Text>
              <Text style={styles.alertBannerSub}>
                Main Gate Security & Building Admin have been dispatched to {unitNumber}.
              </Text>
            </View>
            <Pressable
              style={styles.cancelAlertBtn}
              onPress={() => {
                triggerHapticFeedback('selection');
                setSosActive(false);
                showToast?.('SOS alert cancelled', 'info');
              }}
            >
              <Text style={styles.cancelAlertBtnText}>I'm Safe</Text>
            </Pressable>
          </View>
        )}

        {/* SOS Big Button Section */}
        <View style={styles.sosCard}>
          <Text style={styles.sosCardTitle}>INSTANT EMERGENCY SOS</Text>
          <Text style={styles.sosCardSubtitle}>
            Tap below to trigger high-priority alert to Gate Security & your emergency contacts
          </Text>

          <Pressable
            style={[styles.bigSosButton, isTriggering && { opacity: 0.7 }]}
            disabled={isTriggering}
            onPress={handleTriggerSOS}
          >
            {isTriggering ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <View style={styles.sosInnerContent}>
                <AlertOctagon size={48} color="#FFFFFF" />
                <Text style={styles.bigSosButtonText}>TAP FOR SOS</Text>
                <Text style={styles.bigSosButtonSub}>ALERTS ALL SECURITY</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.flatInfoBox}>
            <ShieldCheck size={16} color="#0F766E" />
            <Text style={styles.flatInfoText}>
              Broadcasts Flat Location: <Text style={{ fontWeight: '800' }}>{unitNumber}</Text>
            </Text>
          </View>
        </View>

        {/* 1-Tap Emergency Dials */}
        <Text style={styles.sectionHeader}>DIRECT 1-TAP EMERGENCY DIALS</Text>
        <View style={{ gap: 10 }}>
          {emergencyServices.map((service) => {
            const Icon = service.icon;
            return (
              <Pressable
                key={service.title}
                style={styles.serviceCard}
                onPress={() => dialNumber(service.phone, service.title)}
              >
                <View style={[styles.serviceIconBox, { backgroundColor: service.bg }]}>
                  <Icon size={24} color={service.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </View>
                <View style={styles.callCircle}>
                  <PhoneCall size={18} color="#FFFFFF" />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Configured Emergency Contacts */}
        {emergencyContacts && emergencyContacts.length > 0 && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <Text style={styles.sectionHeader}>PERSONAL EMERGENCY CONTACTS</Text>
            {emergencyContacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={styles.contactCard}
                onPress={() => dialNumber(contact.phone, contact.name)}
              >
                <View style={styles.contactIconBox}>
                  <Users size={20} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship} • {contact.phone}</Text>
                </View>
                <View style={[styles.callCircle, { backgroundColor: '#0F766E' }]}>
                  <PhoneCall size={16} color="#FFFFFF" />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    gap: 12,
  },
  alertBannerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#991B1B',
  },
  alertBannerSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
  cancelAlertBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelAlertBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  sosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    ...V4_SHADOWS.card,
  },
  sosCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E11D48',
    letterSpacing: 1,
  },
  sosCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  bigSosButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#FFE4E6',
    ...V4_SHADOWS.card,
  },
  sosInnerContent: {
    alignItems: 'center',
    gap: 4,
  },
  bigSosButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  bigSosButtonSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FECDD3',
    letterSpacing: 0.8,
  },
  flatInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 20,
  },
  flatInfoText: {
    fontSize: 12,
    color: '#0F766E',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  serviceSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  callCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  contactIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRelation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
