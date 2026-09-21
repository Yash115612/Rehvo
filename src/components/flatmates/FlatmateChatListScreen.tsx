import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Check,
  Calendar,
  Archive,
  MoreVertical,
  X,
  Users,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { V4AuthGate } from '../v4/ui/V4AuthGate';

type ChatTab = 'all' | 'matches' | 'visits' | 'archived';

interface FlatmateChatConversationItem {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  lastActive?: string;
  compatibilityScore: number;
  locality: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isVisit?: boolean;
  isArchived?: boolean;
}

export const FlatmateChatListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { flatmates, conversations: storeConversations, isAuthenticated } = useAppStore();

  const [activeTab, setActiveTab] = useState<ChatTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map real conversations from store
  const conversations: FlatmateChatConversationItem[] = useMemo(() => {
    return (storeConversations || []).map((c) => ({
      id: c.id,
      name: c.other_user_name || 'Roommate',
      avatar: c.other_user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      isVerified: c.is_verified ?? true,
      isOnline: true,
      compatibilityScore: c.match_score || 95,
      locality: c.flatmate_locality || c.property_locality || 'Mumbai',
      lastMessage: c.last_message || 'Start chatting...',
      lastMessageTime: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      unreadCount: c.unread_count || 0,
      isVisit: false,
    }));
  }, [storeConversations]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          <View style={styles.titleWrap}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSub}>Active chats & flatmate matches</Text>
          </View>
        </View>

        <V4AuthGate
          title="Chat with owners and flatmates"
          description="Sign in to message verified owners, receive waves, and manage conversations."
          featureName="Roommate Messages"
          badgeText="DIRECT MESSAGING"
          benefits={[
            'Verified direct chat with flat owners & flatmates',
            'Receive and accept incoming waves from potential flatmates',
            'Coordinate property visit schedules and video tours',
            'Encrypted 1-on-1 private messaging',
          ]}
          fullScreen={false}
        />
      </SafeAreaView>
    );
  }

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeTab === 'matches' && c.isArchived) return false;
      if (activeTab === 'visits' && (!c.isVisit || c.isArchived)) return false;
      if (activeTab === 'archived' && !c.isArchived) return false;
      if (activeTab !== 'archived' && c.isArchived) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.locality.toLowerCase().includes(q);
      }
      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  const onlineRoommates = useMemo(() => {
    return conversations.filter((c) => c.isOnline);
  }, [conversations]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSub}>Active chats & flatmate matches</Text>
        </View>
      </View>

      {/* 2. Top Horizontal Online Avatars */}
      {onlineRoommates.length > 0 && (
        <View style={styles.onlineSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.onlineRail}
          >
            {onlineRoommates.map((item) => (
              <Pressable
                key={item.id}
                style={styles.onlineAvatarItem}
                onPress={() => router.push(`/(renter)/chat/${item.id}`)}
              >
                <View style={styles.onlineAvatarWrap}>
                  <Image source={{ uri: item.avatar }} style={styles.onlineAvatarImg} />
                  <View style={styles.onlineBadge} />
                </View>
                <Text style={styles.onlineName} numberOfLines={1}>
                  {item.name.split(' ')[0]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#059669" strokeWidth={2.4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats by name or area..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* 4. Segmented Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: 'all', label: 'All Chats' },
          { key: 'matches', label: 'Matches' },
          { key: 'visits', label: 'Site Visits' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key as ChatTab)}
            >
              <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 5. Chat List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MessageCircle size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Conversations Found</Text>
            <Text style={styles.emptySub}>
              Start a conversation with verified flatmates or accept incoming waves.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push('/(renter)/flatmate/explore')}
            >
              <Text style={styles.exploreBtnText}>Discover Flatmates</Text>
            </Pressable>
          </View>
        ) : (
          filteredConversations.map((conv) => (
            <Pressable
              key={conv.id}
              style={styles.chatCard}
              onPress={() => router.push(`/(renter)/chat/${conv.id}`)}
              accessibilityRole="button"
            >
              {/* Avatar with Online Dot */}
              <View style={styles.chatAvatarWrap}>
                <Image source={{ uri: conv.avatar }} style={styles.chatAvatar} />
                {conv.isOnline && <View style={styles.chatOnlineDot} />}
              </View>

              {/* Info Center */}
              <View style={styles.chatInfo}>
                <View style={styles.chatHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
                    <Text style={styles.chatName} numberOfLines={1}>
                      {conv.name}
                    </Text>
                    {conv.isVerified && (
                      <ShieldCheck size={14} color="#059669" strokeWidth={2.6} />
                    )}
                  </View>
                  <Text style={styles.chatTime}>{conv.lastMessageTime}</Text>
                </View>

                {/* Compatibility & Locality Pill */}
                <View style={styles.chatMetaRow}>
                  <View style={styles.matchPill}>
                    <Sparkles size={10} color="#059669" />
                    <Text style={styles.matchPillText}>{conv.compatibilityScore}% Synergy</Text>
                  </View>
                  <Text style={styles.localityText}>· {conv.locality}</Text>
                </View>

                {/* Last Message Snippet */}
                <View style={styles.lastMessageRow}>
                  <Text
                    style={[
                      styles.lastMessageText,
                      conv.unreadCount > 0 && styles.lastMessageUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                  {conv.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  onlineSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  onlineRail: {
    paddingHorizontal: 16,
    gap: 16,
  },
  onlineAvatarItem: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  onlineAvatarWrap: {
    position: 'relative',
  },
  onlineAvatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  onlineName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  searchBar: {
    height: 42,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    height: '100%',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chatAvatarWrap: {
    position: 'relative',
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  chatOnlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    gap: 3,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  chatTime: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chatMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  localityText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  lastMessageText: {
    fontSize: 12.5,
    color: '#64748B',
    flex: 1,
  },
  lastMessageUnread: {
    color: '#0F172A',
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: '#059669',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emptyWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
});
