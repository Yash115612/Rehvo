import React, { useState, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import {
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Link,
  Building2,
  MapPin,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react-native';
import { Conversation, Message } from '../../../types';
import { V4Image } from '../ui/V4Image';
import { triggerHaptic } from '../../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4ConversationMediaModalProps {
  visible: boolean;
  conversation: Conversation;
  messages: Message[];
  onClose: () => void;
}

const MEDIA_TABS = ['Photos', 'Videos', 'Documents', 'Links', 'Properties', 'Locations'] as const;
type MediaTab = typeof MEDIA_TABS[number];

const V4ConversationMediaModalComponent: React.FC<V4ConversationMediaModalProps> = ({
  visible,
  conversation,
  messages,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('Photos');

  // Filter messages by category
  const photos = useMemo(
    () => messages.filter((m) => m.message_type === 'image' && m.image_url),
    [messages]
  );
  const videos = useMemo(
    () => messages.filter((m) => m.message_type === 'video' && m.video_url),
    [messages]
  );
  const docs = useMemo(
    () => messages.filter((m) => m.message_type === 'document' && m.document_url),
    [messages]
  );
  const links = useMemo(
    () => messages.filter((m) => m.text && (m.text.includes('http://') || m.text.includes('https://'))),
    [messages]
  );
  const properties = useMemo(
    () => messages.filter((m) => m.message_type === 'property' || m.metadata?.property),
    [messages]
  );
  const locations = useMemo(
    () => messages.filter((m) => m.message_type === 'location' || m.location),
    [messages]
  );

  const getActiveList = () => {
    switch (activeTab) {
      case 'Photos':
        return photos;
      case 'Videos':
        return videos;
      case 'Documents':
        return docs;
      case 'Links':
        return links;
      case 'Properties':
        return properties;
      case 'Locations':
        return locations;
    }
  };

  const activeList = getActiveList();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Media, Docs & Links</Text>
          <Pressable
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close media gallery"
          >
            <X size={20} color="#031B2A" />
          </Pressable>
        </View>

        {/* Conversation Summary Strip */}
        <View style={styles.userSummary}>
          <Image
            source={{ uri: conversation.other_user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{conversation.other_user_name || 'Chat Member'}</Text>
            <Text style={styles.propertySubtitle}>
              {conversation.property_title || 'REHVO Residence'}
            </Text>
          </View>
        </View>

        {/* Media Tabs Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {MEDIA_TABS.map((tab) => {
            const isActive = activeTab === tab;
            let count = 0;
            if (tab === 'Photos') count = photos.length;
            if (tab === 'Videos') count = videos.length;
            if (tab === 'Documents') count = docs.length;
            if (tab === 'Links') count = links.length;
            if (tab === 'Properties') count = properties.length;
            if (tab === 'Locations') count = locations.length;

            return (
              <Pressable
                key={tab}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => {
                  triggerHaptic();
                  setActiveTab(tab);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                {count > 0 && (
                  <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Content Area */}
        <ScrollView contentContainerStyle={styles.contentScroll}>
          {activeList.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No {activeTab} Shared Yet</Text>
              <Text style={styles.emptySub}>
                Shared items in this chat will appear here automatically.
              </Text>
            </View>
          ) : activeTab === 'Photos' ? (
            <View style={styles.photosGrid}>
              {photos.map((item) => (
                <View key={item.id} style={styles.photoCell}>
                  <V4Image
                    source={{ uri: item.image_url }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          ) : activeTab === 'Documents' ? (
            <View style={styles.docsList}>
              {docs.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.docRow}
                  onPress={() => item.document_url && Linking.openURL(item.document_url)}
                >
                  <View style={styles.docIconWrap}>
                    <FileText size={18} color="#0F766E" />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {item.document_name || 'Document.pdf'}
                    </Text>
                    <Text style={styles.docMeta}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Download size={16} color="#64748B" />
                </Pressable>
              ))}
            </View>
          ) : activeTab === 'Links' ? (
            <View style={styles.linksList}>
              {links.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.linkRow}
                  onPress={() => {
                    const match = item.text?.match(/https?:\/\/[^\s]+/);
                    if (match) Linking.openURL(match[0]);
                  }}
                >
                  <Link size={16} color="#0F766E" />
                  <Text style={styles.linkText} numberOfLines={2}>
                    {item.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : activeTab === 'Locations' ? (
            <View style={styles.locationsList}>
              {locations.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.locationRow}
                  onPress={() => {
                    if (item.location) {
                      Linking.openURL(
                        `https://www.google.com/maps/search/?api=1&query=${item.location.latitude},${item.location.longitude}`
                      );
                    }
                  }}
                >
                  <MapPin size={18} color="#0F766E" />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationTitle}>
                      {item.location?.name || 'Shared Pin'}
                    </Text>
                    <Text style={styles.locationSub}>
                      {item.location?.latitude.toFixed(4)}°, {item.location?.longitude.toFixed(4)}°
                    </Text>
                  </View>
                  <ExternalLink size={14} color="#64748B" />
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

export const V4ConversationMediaModal = memo(V4ConversationMediaModalComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#031B2A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  userSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#031B2A',
  },
  propertySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  tabChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
  contentScroll: {
    padding: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#031B2A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoCell: {
    width: (SCREEN_WIDTH - 48) / 3,
    height: (SCREEN_WIDTH - 48) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2ECEF',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  docsList: {
    gap: 8,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    gap: 12,
  },
  docIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#031B2A',
  },
  docMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  linksList: {
    gap: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
  },
  locationsList: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#031B2A',
  },
  locationSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
