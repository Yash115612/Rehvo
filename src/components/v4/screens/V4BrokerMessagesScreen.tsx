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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  MessageSquare,
  ShieldCheck,
  Building2,
  Users,
  CheckCheck,
  Plus,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

interface BrokerMessageItem {
  id: string;
  name: string;
  role: 'BUYER' | 'TENANT' | 'OWNER';
  avatar: string;
  is_verified: boolean;
  property_title?: string;
  last_message: string;
  timestamp: string;
  unread_count: number;
}

const SAMPLE_BROKER_CHATS: BrokerMessageItem[] = [
  {
    id: 'bchat-1',
    name: 'Karan Malhotra',
    role: 'TENANT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    is_verified: true,
    property_title: '3 BHK Sea Breeze Towers, Bandra',
    last_message: 'Hi Rajesh, is the parking slot covered? Can we confirm visit at 4:30 PM?',
    timestamp: '10:42 AM',
    unread_count: 2,
  },
  {
    id: 'bchat-2',
    name: 'Sunita Hiranandani',
    role: 'OWNER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    is_verified: true,
    property_title: '4 BHK The Imperial Crest, Worli',
    last_message: 'We received the token advance. Please draft the registered agreement.',
    timestamp: 'Yesterday',
    unread_count: 0,
  },
  {
    id: 'bchat-3',
    name: 'Aanya Sen',
    role: 'BUYER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    is_verified: true,
    property_title: 'Pali Hill Duplex Penthouse',
    last_message: 'Looking forward to reviewing the floor plans you sent across.',
    timestamp: 'Sep 6',
    unread_count: 0,
  },
];

export const V4BrokerMessagesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, showToast } = useAppStore();

  const [filterRole, setFilterRole] = useState<'ALL' | 'CLIENT' | 'OWNER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    return SAMPLE_BROKER_CHATS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.property_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        filterRole === 'ALL' ||
        (filterRole === 'CLIENT' && (item.role === 'BUYER' || item.role === 'TENANT')) ||
        (filterRole === 'OWNER' && item.role === 'OWNER');
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, filterRole]);

  return (
    <View style={styles.root}>
      {/* SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search messages, clients, properties..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        {[
          { id: 'ALL', label: 'All Messages' },
          { id: 'CLIENT', label: 'Buyers & Tenants' },
          { id: 'OWNER', label: 'Property Owners' },
        ].map((tab) => {
          const isActive = filterRole === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setFilterRole(tab.id as any)}
            >
              <Text style={[styles.filterPillTxt, isActive && styles.filterPillTxtActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CONVERSATION LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        {filteredChats.map((chat) => {
          const isOwner = chat.role === 'OWNER';
          return (
            <Pressable
              key={chat.id}
              style={styles.chatCard}
              onPress={() => {
                showToast(`Opening chat with ${chat.name}`, 'info');
              }}
            >
              <View style={styles.avatarWrap}>
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.chatContentCol}>
                <View style={styles.chatTopRow}>
                  <View style={styles.nameBadgeRow}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    {chat.is_verified && (
                      <ShieldCheck size={13} color="#059669" strokeWidth={2.5} />
                    )}
                    <View
                      style={[
                        styles.rolePill,
                        isOwner ? styles.roleOwnerPill : styles.roleClientPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rolePillTxt,
                          isOwner ? styles.roleOwnerPillTxt : styles.roleClientPillTxt,
                        ]}
                      >
                        {chat.role}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timestampTxt}>{chat.timestamp}</Text>
                </View>

                {chat.property_title && (
                  <View style={styles.propTagRow}>
                    <Building2 size={11} color="#0F766E" />
                    <Text style={styles.propTagTxt} numberOfLines={1}>
                      {chat.property_title}
                    </Text>
                  </View>
                )}

                <View style={styles.lastMsgRow}>
                  <Text
                    style={[
                      styles.lastMsgTxt,
                      chat.unread_count > 0 && styles.lastMsgTxtBold,
                    ]}
                    numberOfLines={1}
                  >
                    {chat.last_message}
                  </Text>

                  {chat.unread_count > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeTxt}>{chat.unread_count}</Text>
                    </View>
                  ) : (
                    <CheckCheck size={15} color="#059669" />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
  },
  filterPillTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTxtActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContentCol: {
    flex: 1,
    marginLeft: 12,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  rolePill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  roleClientPill: {
    backgroundColor: '#EDE9FE',
  },
  rolePillTxt: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  roleClientPillTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#5B21B6',
  },
  roleOwnerPill: {
    backgroundColor: '#FEF3C7',
  },
  roleOwnerPillTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#92400E',
  },
  timestampTxt: {
    fontSize: 11,
    color: '#94A3B8',
  },
  propTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  propTagTxt: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '600',
  },
  lastMsgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMsgTxt: {
    flex: 1,
    fontSize: 12.5,
    color: '#64748B',
    marginRight: 8,
  },
  lastMsgTxtBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  unreadBadge: {
    backgroundColor: '#7C3AED',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
