import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  X,
  MessageCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import * as chatService from '../../services/chat';
import { Conversation } from '../../types';

export const OwnerChatListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, user, fetchConversations } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!user?.id) return;
    const sub = chatService.subscribeToConversations(user.id, () => {
      fetchConversations();
    });
    return () => {
      sub.unsubscribe();
    };
  }, [user?.id, fetchConversations]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchConversations();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchConversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.renter_name?.toLowerCase().includes(q) ||
          c.property_title?.toLowerCase().includes(q) ||
          c.property_locality?.toLowerCase().includes(q) ||
          c.last_message?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [conversations, searchQuery]);

  const handleOpenConversation = (conv: Conversation) => {
    router.push(`/(owner)/chat/${conv.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(owner)/dashboard');
            }
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Tenant Messages</Text>
          <Text style={styles.subtitle}>
            In-app conversations with renters
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Search size={16} color="#777482" strokeWidth={2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations by renter or property..."
            placeholderTextColor="#8C8994"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={14} color="#777482" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 16 },
        ]}
        renderItem={({ item }) => {
          const avatarUri =
            item.renter_avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

          const hasUnread = item.unread_count > 0;

          return (
            <Pressable
              style={[styles.row, hasUnread && styles.rowUnread]}
              onPress={() => handleOpenConversation(item)}
              accessibilityRole="button"
              accessibilityLabel={`Conversation with ${item.renter_name}`}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatar} />

              <View style={styles.infoCol}>
                <View style={styles.topRow}>
                  <Text
                    style={[styles.name, hasUnread && styles.nameUnread]}
                    numberOfLines={1}
                  >
                    {item.renter_name}
                  </Text>
                  <Text style={styles.timeText}>Today</Text>
                </View>

                <Text style={styles.propTitle} numberOfLines={1}>
                  {item.property_title}
                </Text>

                <Text
                  style={[
                    styles.lastMsg,
                    hasUnread && styles.lastMsgUnread,
                  ]}
                  numberOfLines={1}
                >
                  {item.last_message || 'No messages yet'}
                </Text>
              </View>

              <View style={styles.rightCol}>
                {hasUnread && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread_count}</Text>
                  </View>
                )}
                <ChevronRight size={16} color="#86828F" />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <MessageCircle size={32} color="#6C4DFF" strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySub}>
              New renter enquiries and chat messages will appear here.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push('/(owner)/enquiries')}
            >
              <Text style={styles.exploreBtnText}>View Enquiries</Text>
              <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#171522',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
  },
  rowUnread: {
    backgroundColor: '#FAF9FF',
    borderColor: '#DED6FD',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E5EC',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  nameUnread: {
    fontWeight: '800',
  },
  timeText: {
    fontSize: 11,
    color: '#777482',
    fontWeight: '500',
  },
  propTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  lastMsg: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  lastMsgUnread: {
    color: '#171522',
    fontWeight: '600',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  unreadBadge: {
    backgroundColor: '#6C4DFF',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 24,
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
  },
  emptySub: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  exploreBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
