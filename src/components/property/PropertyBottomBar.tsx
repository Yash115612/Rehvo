import { ActivityIndicator, View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageCircle, CalendarDays } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyBottomBarProps {
  property: Property;
  onChatWithOwner: () => void;
  onScheduleVisit: () => void;
  isStartingChat?: boolean;
}

export const PropertyBottomBar: React.FC<PropertyBottomBarProps> = ({
  property,
  onChatWithOwner,
  onScheduleVisit,
  isStartingChat = false,
}) => {
  const insets = useSafeAreaInsets();

  const handleWhatsApp = () => {
    const rawPhone = property.owner_phone
      ? property.owner_phone.replace(/\D/g, '')
      : '919820145678';
    const message = `Hi ${property.owner_name}, I saw your REHVO listing for "${property.title}" in ${property.locality}, ${property.city} (Rent: ₹${property.rent.toLocaleString('en-IN')}/mo). Is it available for a visit?`;
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {});
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}
    >
      <View style={styles.actionRow}>
        {/* WhatsApp Optional Secondary Icon */}
        <Pressable
          style={styles.whatsAppIconBtn}
          onPress={handleWhatsApp}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Chat on WhatsApp"
        >
          <MessageCircle size={18} color="#32B768" strokeWidth={2.2} />
        </Pressable>

        {/* Schedule Visit Secondary CTA */}
        <Pressable
          style={styles.scheduleBtn}
          onPress={onScheduleVisit}
          accessibilityRole="button"
          accessibilityLabel="Schedule physical property visit"
        >
          <CalendarDays size={17} color="#171522" strokeWidth={2.2} />
          <Text style={styles.scheduleText}>Schedule Visit</Text>
        </Pressable>

        {/* Chat with Owner Primary In-App CTA */}
        <Pressable
          style={[styles.chatPrimaryBtn, isStartingChat && styles.chatPrimaryBtnDisabled]}
          onPress={onChatWithOwner}
          disabled={isStartingChat}
          accessibilityRole="button"
          accessibilityLabel="Chat with Property Owner on REHVO"
        >
          {isStartingChat ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.chatPrimaryText}>Chat with Owner</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 30,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  whatsAppIconBtn: {
    width: 48,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EAF8F0',
    borderWidth: 1,
    borderColor: '#C6F0D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  chatPrimaryBtn: {
    flex: 1.3,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  chatPrimaryBtnDisabled: {
    backgroundColor: '#9B87F5',
    shadowOpacity: 0.1,
  },
  chatPrimaryText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
