import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Building2,
  Search,
  Plus,
  Share2,
  Eye,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Filter,
  CheckCircle2,
  MapPin,
  IndianRupee,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BrokerPropertyItem {
  id: string;
  title: string;
  locality: string;
  building_name: string;
  bhk: string;
  area_sqft: number;
  rent: number;
  deposit: number;
  commission_rate: string;
  commission_amount: number;
  status: 'ACTIVE' | 'UNDER_OFFER' | 'CLOSED';
  image_url: string;
  leads_count: number;
  views_count: number;
  is_exclusive: boolean;
}

const SAMPLE_BROKER_INVENTORY: BrokerPropertyItem[] = [
  {
    id: 'bprop-1',
    title: '3 BHK Sea-Facing High Rise Penthouse',
    locality: 'Carter Road, Bandra West',
    building_name: 'Sea Breeze Towers',
    bhk: '3 BHK',
    area_sqft: 1850,
    rent: 185000,
    deposit: 550000,
    commission_rate: '1 Month Rent',
    commission_amount: 185000,
    status: 'ACTIVE',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    leads_count: 5,
    views_count: 142,
    is_exclusive: true,
  },
  {
    id: 'bprop-2',
    title: '4 BHK Luxury Waterfront Apartment',
    locality: 'Worli Sea Face, Worli',
    building_name: 'The Imperial Crest',
    bhk: '4 BHK',
    area_sqft: 2600,
    rent: 340000,
    deposit: 1000000,
    commission_rate: '1 Month Rent',
    commission_amount: 340000,
    status: 'UNDER_OFFER',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
    leads_count: 3,
    views_count: 98,
    is_exclusive: true,
  },
  {
    id: 'bprop-3',
    title: '2 BHK Modern Minimalist Apartment',
    locality: 'Central Avenue, Hiranandani Powai',
    building_name: 'Somerset Heritage',
    bhk: '2 BHK',
    area_sqft: 1100,
    rent: 95000,
    deposit: 300000,
    commission_rate: '1 Month Rent',
    commission_amount: 95000,
    status: 'ACTIVE',
    image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&auto=format&fit=crop&q=80',
    leads_count: 7,
    views_count: 210,
    is_exclusive: false,
  },
  {
    id: 'bprop-4',
    title: '3.5 BHK Duplex with Private Terrace',
    locality: 'Pali Hill, Bandra West',
    building_name: 'Hill View Residences',
    bhk: '3.5 BHK',
    area_sqft: 2200,
    rent: 240000,
    deposit: 700000,
    commission_rate: '1.5 Month Rent',
    commission_amount: 360000,
    status: 'ACTIVE',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    leads_count: 4,
    views_count: 175,
    is_exclusive: true,
  },
];

export const V4BrokerInventoryScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'UNDER_OFFER' | 'CLOSED'>('ALL');

  const filteredInventory = useMemo(() => {
    return SAMPLE_BROKER_INVENTORY.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.building_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleShare = async (item: BrokerPropertyItem) => {
    try {
      await Share.share({
        title: item.title,
        message: `Exclusive Property via REHVO Pro:\n${item.title}\n📍 ${item.locality}\nRent: ₹${item.rent.toLocaleString('en-IN')}/mo\nContact our agency for VIP private tour.`,
      });
    } catch {
      showToast('Copied property share link!', 'success');
    }
  };

  return (
    <View style={styles.root}>
      {/* SEARCH AND FILTER BAR */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search by building, area, or BHK..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <Pressable
          style={styles.addPropertyBtn}
          onPress={() => router.push('/(renter)/listing' as any)}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.addPropertyBtnTxt}>Add</Text>
        </Pressable>
      </View>

      {/* STATUS TABS */}
      <View style={styles.statusPillsRow}>
        {[
          { id: 'ALL', label: 'All (4)' },
          { id: 'ACTIVE', label: 'Active (3)' },
          { id: 'UNDER_OFFER', label: 'Under Offer (1)' },
          { id: 'CLOSED', label: 'Closed (0)' },
        ].map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.statusPill, isActive && styles.statusPillActive]}
              onPress={() => setSelectedStatus(tab.id as any)}
            >
              <Text style={[styles.statusPillTxt, isActive && styles.statusPillTxtActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* INVENTORY LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        <Text style={styles.resultCountText}>
          Showing {filteredInventory.length} managed properties in Mumbai
        </Text>

        {filteredInventory.map((item) => {
          const isUnderOffer = item.status === 'UNDER_OFFER';
          const isClosed = item.status === 'CLOSED';

          return (
            <View key={item.id} style={styles.propertyCard}>
              {/* Cover Image with Badges */}
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.image_url }} style={styles.coverImage} />

                {/* Exclusive Pill */}
                {item.is_exclusive && (
                  <View style={styles.exclusiveBadge}>
                    <Sparkles size={11} color="#065F46" />
                    <Text style={styles.exclusiveBadgeTxt}>EXCLUSIVE</Text>
                  </View>
                )}

                {/* Commission Pill */}
                <View style={styles.commissionBadge}>
                  <Text style={styles.commissionBadgeTxt}>
                    Est. Comm: ₹{(item.commission_amount / 1000).toFixed(0)}k ({item.commission_rate})
                  </Text>
                </View>

                {/* Status Pill */}
                <View
                  style={[
                    styles.statusCardPill,
                    isUnderOffer && styles.statusUnderOffer,
                    isClosed && styles.statusClosed,
                  ]}
                >
                  <Text style={styles.statusCardPillTxt}>{item.status.replace('_', ' ')}</Text>
                </View>
              </View>

              {/* Property Details */}
              <View style={styles.detailsWrap}>
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceText}>
                      ₹{item.rent.toLocaleString('en-IN')}
                      <Text style={styles.monthSuffix}> / mo</Text>
                    </Text>
                    <Text style={styles.depositText}>
                      Deposit: ₹{item.deposit.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.statsMiniRow}>
                    <View style={styles.statMini}>
                      <Eye size={12} color="#64748B" />
                      <Text style={styles.statMiniTxt}>{item.views_count}</Text>
                    </View>
                    <View style={styles.statMini}>
                      <MessageSquare size={12} color="#0F766E" />
                      <Text style={[styles.statMiniTxt, { color: '#0F766E', fontWeight: '800' }]}>
                        {item.leads_count} Leads
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.propertyTitle}>{item.title}</Text>

                <View style={styles.localityRow}>
                  <MapPin size={13} color="#64748B" />
                  <Text style={styles.localityTxt}>
                    {item.building_name}, {item.locality}
                  </Text>
                </View>

                <View style={styles.specTagsRow}>
                  <View style={styles.specTag}>
                    <Text style={styles.specTagTxt}>{item.bhk}</Text>
                  </View>
                  <View style={styles.specTag}>
                    <Text style={styles.specTagTxt}>{item.area_sqft} sq.ft</Text>
                  </View>
                  <View style={styles.specTag}>
                    <Text style={styles.specTagTxt}>Gated Society</Text>
                  </View>
                </View>

                {/* Card Action Row */}
                <View style={styles.cardActionsRow}>
                  <Pressable
                    style={styles.shareBtn}
                    onPress={() => handleShare(item)}
                  >
                    <Share2 size={14} color="#0F766E" />
                    <Text style={styles.shareBtnTxt}>Share Catalog</Text>
                  </Pressable>

                  <Pressable
                    style={styles.leadsBtn}
                    onPress={() => router.push('/(broker)/clients' as any)}
                  >
                    <Text style={styles.leadsBtnTxt}>View {item.leads_count} Enquiries →</Text>
                  </Pressable>
                </View>
              </View>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  searchBox: {
    flex: 1,
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
  addPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  addPropertyBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statusPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  statusPillActive: {
    backgroundColor: '#064E3B',
  },
  statusPillTxt: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  statusPillTxtActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  resultCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  imageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  exclusiveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exclusiveBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  commissionBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  commissionBadgeTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FCD34D',
  },
  statusCardPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusUnderOffer: {
    backgroundColor: '#D97706',
  },
  statusClosed: {
    backgroundColor: '#64748B',
  },
  statusCardPillTxt: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  detailsWrap: {
    padding: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  monthSuffix: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  depositText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statsMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statMiniTxt: {
    fontSize: 11.5,
    color: '#64748B',
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  localityTxt: {
    fontSize: 12,
    color: '#64748B',
  },
  specTagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  specTag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specTagTxt: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  shareBtnTxt: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  leadsBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 9,
    borderRadius: 10,
  },
  leadsBtnTxt: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
