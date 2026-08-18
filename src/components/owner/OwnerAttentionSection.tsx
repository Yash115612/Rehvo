import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  AlertCircle,
  MessageCircle,
  Calendar,
  Pencil,
  ArrowRight,
} from 'lucide-react-native';

interface AttentionItem {
  id: string;
  type: 'enquiry' | 'visit' | 'draft';
  title: string;
  subtitle: string;
  actionText: string;
  onPress: () => void;
}

interface OwnerAttentionSectionProps {
  items: AttentionItem[];
}

export const OwnerAttentionSection: React.FC<OwnerAttentionSectionProps> = ({
  items,
}) => {
  if (!items || items.length === 0) return null;

  const getIcon = (type: AttentionItem['type']) => {
    switch (type) {
      case 'enquiry':
        return MessageCircle;
      case 'visit':
        return Calendar;
      case 'draft':
      default:
        return Pencil;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertCircle size={17} color="#F59E0B" strokeWidth={2.2} />
        <Text style={styles.sectionTitle}>Needs your attention</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}: ${item.subtitle}`}
            >
              <View style={styles.iconCircle}>
                <Icon size={16} color="#B45309" strokeWidth={2.2} />
              </View>

              <View style={styles.textCol}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>

              <View style={styles.actionPill}>
                <Text style={styles.actionText}>{item.actionText}</Text>
                <ArrowRight size={12} color="#6C4DFF" strokeWidth={2.2} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  list: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 12,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#92400E',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#B45309',
    fontWeight: '500',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  actionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
