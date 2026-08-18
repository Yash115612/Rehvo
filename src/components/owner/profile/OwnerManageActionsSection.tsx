import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Building2,
  MessageCircle,
  CalendarDays,
  PlusCircle,
  ChevronRight,
  Plus,
  MessageSquare,
} from 'lucide-react-native';

interface OwnerManageActionsSectionProps {
  onNavigateProperties: () => void;
  onNavigateEnquiries: () => void;
  onNavigateMessages: () => void;
  onNavigateVisits: () => void;
  onNavigateListProperty: () => void;
}

export const OwnerManageActionsSection: React.FC<
  OwnerManageActionsSectionProps
> = ({
  onNavigateProperties,
  onNavigateEnquiries,
  onNavigateMessages,
  onNavigateVisits,
  onNavigateListProperty,
}) => {
  const actions = [
    {
      id: 'properties',
      title: 'My Properties',
      subtitle: 'Manage your listings & drafts',
      icon: Building2,
      onPress: onNavigateProperties,
    },
    {
      id: 'messages',
      title: 'Tenant Messages',
      subtitle: 'In-app chat with renters',
      icon: MessageCircle,
      onPress: onNavigateMessages,
    },
    {
      id: 'enquiries',
      title: 'Enquiries',
      subtitle: 'Respond to renter interest',
      icon: MessageSquare,
      onPress: onNavigateEnquiries,
    },
    {
      id: 'visits',
      title: 'Scheduled Visits',
      subtitle: 'Manage upcoming visits',
      icon: CalendarDays,
      onPress: onNavigateVisits,
    },
    {
      id: 'list',
      title: 'List a Property',
      subtitle: 'Add another rental listing',
      icon: PlusCircle,
      onPress: onNavigateListProperty,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Manage Your Account</Text>

      {/* Prominent List Property Banner */}
      <Pressable
        style={styles.prominentBanner}
        onPress={onNavigateListProperty}
        accessibilityRole="button"
        accessibilityLabel="List a new property"
      >
        <View style={styles.bannerIconWrap}>
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>List a New Property</Text>
          <Text style={styles.bannerSub}>
            Reach thousands of verified renters in Mumbai
          </Text>
        </View>
        <ChevronRight size={18} color="#FFFFFF" />
      </Pressable>

      {/* Action Rows */}
      <View style={styles.card}>
        <View style={styles.list}>
          {actions.map((action, idx) => {
            const Icon = action.icon;
            const isLast = idx === actions.length - 1;

            return (
              <Pressable
                key={action.id}
                style={[styles.row, !isLast && styles.rowBorder]}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <View style={styles.iconWrap}>
                  <Icon size={18} color="#6C4DFF" strokeWidth={2} />
                </View>

                <View style={styles.textCol}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSub}>{action.subtitle}</Text>
                </View>

                <ChevronRight size={16} color="#86828F" />
              </Pressable>
            );
          })}
        </View>
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
  prominentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C4DFF',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 12,
    color: '#ECE7FF',
    marginTop: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  actionSub: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
});
