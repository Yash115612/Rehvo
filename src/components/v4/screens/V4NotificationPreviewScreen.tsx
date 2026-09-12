import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Sparkles,
  MessageSquare,
  CalendarCheck,
  IndianRupee,
  ShieldCheck,
  Truck,
  TrendingDown,
  Users,
  Send,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHapticFeedback } from '../../../utils/haptics';
import { notificationTriggers } from '../../../services/notificationTriggers';
import { useAppStore } from '../../../store/useAppStore';

export const V4NotificationPreviewScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<string>('property');
  const [isSending, setIsSending] = useState(false);

  const previews = [
    {
      id: 'property',
      category: 'Property Price Drop',
      title: '📉 Price Drop: Luxury 3BHK Penthouse',
      body: 'Rent reduced by ₹5,000 (10% OFF). Now ₹45,000/mo in Hiranandani Estate!',
      time: 'Just Now',
      icon: TrendingDown,
      color: '#10B981',
      bg: '#ECFDF5',
      route: '/(renter)/property/p-1',
      action: async () => {
        await notificationTriggers.notifyPriceDrop({
          recipientId: user?.id || 'guest',
          propertyTitle: 'Luxury 3BHK Penthouse',
          propertyId: 'p-1',
          oldRent: 50000,
          newRent: 45000,
        });
      },
    },
    {
      id: 'chat',
      category: 'WhatsApp Style Chat',
      title: 'Aakash Verma (Owner)',
      body: '[Prestige Green Gables] Hello! The keys are with security. You can move in tomorrow.',
      time: '2m ago',
      icon: MessageSquare,
      color: '#0F766E',
      bg: '#F0FDFA',
      route: '/(renter)/chat',
      action: async () => {
        await notificationTriggers.notifyChatMessage({
          recipientId: user?.id || 'guest',
          senderName: 'Aakash Verma',
          conversationId: 'c-1',
          messageSnippet: 'The keys are with security. You can move in tomorrow.',
          propertyTitle: 'Prestige Green Gables',
        });
      },
    },
    {
      id: 'visit',
      category: 'Property Visit Reminder',
      title: '📅 Visit Reminder: Prestige Green Gables',
      body: 'Your property visit starts in 1 hour. Gate Entry Passcode: 649 201.',
      time: '15m ago',
      icon: CalendarCheck,
      color: '#2563EB',
      bg: '#EFF6FF',
      route: '/(renter)/bookings',
      action: async () => {
        await notificationTriggers.notifyVisitReminder({
          recipientId: user?.id || 'guest',
          propertyTitle: 'Prestige Green Gables',
          timeUntilVisit: '1 hour',
          visitId: 'v-1',
          passCode: '649 201',
        });
      },
    },
    {
      id: 'wallet',
      category: 'Cashback & RentPay',
      title: '✨ +₹350 R-Cash Credited!',
      body: 'You received ₹350 cashback from On-Time Rent Payment. Spend it on utilities or groceries.',
      time: '1h ago',
      icon: IndianRupee,
      color: '#D97706',
      bg: '#FFFBEB',
      route: '/(renter)/wallet',
      action: async () => {
        await notificationTriggers.notifyCashbackCredit({
          recipientId: user?.id || 'guest',
          amount: 350,
          source: 'On-Time Rent Payment',
        });
      },
    },
    {
      id: 'society',
      category: 'Society & Delivery Gatepass',
      title: '📦 Blinkit Delivery at Gate',
      body: 'Your grocery delivery partner has arrived at Main Gate. Entry PIN: 819 042.',
      time: '3h ago',
      icon: Truck,
      color: '#0284C7',
      bg: '#F0F9FF',
      route: '/(renter)/society/delivery-pass',
      action: async () => {
        await notificationTriggers.notifyDeliveryArrived({
          recipientId: user?.id || 'guest',
          companyName: 'Blinkit',
          passCode: '819 042',
        });
      },
    },
    {
      id: 'flatmate',
      category: 'Flatmate Match & Wave',
      title: '👋 Priya Nair waved at you!',
      body: 'You have a 94% compatibility match in Indiranagar, Bengaluru. Tap to view profile.',
      time: '5h ago',
      icon: Users,
      color: '#8B5CF6',
      bg: '#F5F3FF',
      route: '/(renter)/flatmates',
      action: async () => {
        await notificationTriggers.notifyFlatmateWave({
          recipientId: user?.id || 'guest',
          senderName: 'Priya Nair',
          compatibilityScore: 94,
          profileId: 'f-1',
        });
      },
    },
  ];

  const currentPreview = previews.find((p) => p.id === activeCategory) || previews[0];

  const handleTestTrigger = async () => {
    setIsSending(true);
    triggerHapticFeedback('impactMedium');
    try {
      await currentPreview.action();
      triggerHapticFeedback('notificationSuccess');
      showToast?.(`Sent local notification for ${currentPreview.category}!`, 'success');
    } catch {
      showToast?.('Failed to trigger notification', 'error');
    }
    setIsSending(false);
  };

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
          <Text style={styles.headerTitle}>Push Notification Simulator</Text>
          <Text style={styles.headerSubtitle}>Preview real-time alerts & test dispatch</Text>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryScrollWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {previews.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.pill, activeCategory === p.id && styles.pillActive]}
              onPress={() => {
                triggerHapticFeedback('selection');
                setActiveCategory(p.id);
              }}
            >
              <Text style={[styles.pillText, activeCategory === p.id && styles.pillTextActive]}>
                {p.category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Device Lockscreen Preview Mockup */}
        <Text style={styles.sectionHeading}>LOCK SCREEN PREVIEW</Text>
        <View style={styles.lockscreenContainer}>
          <View style={styles.mockClockWrap}>
            <Text style={styles.mockClockText}>09:41</Text>
            <Text style={styles.mockDateText}>Tuesday, 9 September</Text>
          </View>

          {/* Banner */}
          <View style={styles.notificationBanner}>
            <View style={styles.bannerTop}>
              <View style={styles.appIconRow}>
                <View style={styles.appIconBox}>
                  <Text style={styles.appIconText}>R</Text>
                </View>
                <Text style={styles.appName}>REHVO</Text>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.timeAgo}>{currentPreview.time}</Text>
              </View>
            </View>

            <View style={styles.bannerContent}>
              <View style={[styles.categoryIconBox, { backgroundColor: currentPreview.bg }]}>
                <currentPreview.icon size={20} color={currentPreview.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{currentPreview.title}</Text>
                <Text style={styles.bannerBody}>{currentPreview.body}</Text>
              </View>
            </View>

            <View style={styles.bannerActions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => {
                  triggerHapticFeedback('selection');
                  router.push(currentPreview.route as any);
                }}
              >
                <Text style={styles.actionBtnText}>Open in App</Text>
                <ExternalLink size={12} color="#0F766E" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Trigger Test Push Button */}
        <Pressable
          style={[styles.triggerBtn, isSending && { opacity: 0.6 }]}
          disabled={isSending}
          onPress={handleTestTrigger}
        >
          {isSending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Send size={18} color="#FFFFFF" />
              <Text style={styles.triggerBtnText}>Send Test Push Notification</Text>
            </>
          )}
        </Pressable>

        {/* Deliverability & Channel Details Card */}
        <View style={styles.channelCard}>
          <View style={styles.channelCardHeader}>
            <ShieldCheck size={20} color="#0F766E" />
            <Text style={styles.channelCardTitle}>Notification Channel Guarantee</Text>
          </View>
          <View style={styles.channelSpecs}>
            <Text style={styles.specItem}>• Priority: High (Foreground presentation enabled)</Text>
            <Text style={styles.specItem}>• Sound: Emerald Chime with tactile haptic vibration</Text>
            <Text style={styles.specItem}>• Android Channel: {currentPreview.id}</Text>
            <Text style={styles.specItem}>• Deep Link: {currentPreview.route}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

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
  categoryScrollWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#0F766E',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  lockscreenContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 20,
    ...V4_SHADOWS.card,
  },
  mockClockWrap: {
    alignItems: 'center',
    gap: 4,
  },
  mockClockText: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  mockDateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  notificationBanner: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appIconBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  bullet: {
    fontSize: 10,
    color: '#94A3B8',
  },
  timeAgo: {
    fontSize: 11,
    color: '#64748B',
  },
  bannerContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  categoryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bannerBody: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  bannerActions: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 50,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  triggerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  channelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  channelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  channelSpecs: {
    gap: 6,
  },
  specItem: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
