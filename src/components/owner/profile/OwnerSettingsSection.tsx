import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Pencil,
  Lock,
  ShieldCheck,
  HelpCircle,
  FileText,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react-native';
import { InfoSheetType } from '../../profile/InfoSheetModal';

interface OwnerSettingsSectionProps {
  onEditProfile: () => void;
  onOpenInfoSheet: (type: InfoSheetType) => void;
}

export const OwnerSettingsSection: React.FC<OwnerSettingsSectionProps> = ({
  onEditProfile,
  onOpenInfoSheet,
}) => {
  const items = [
    {
      id: 'edit',
      title: 'Edit Profile Information',
      subtitle: 'Name, email, phone & avatar',
      icon: Pencil,
      onPress: onEditProfile,
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      subtitle: 'Control who can view your listings',
      icon: Lock,
      onPress: () => onOpenInfoSheet('privacy'),
    },
    {
      id: 'password',
      title: 'Security & Password',
      subtitle: 'Password, two-factor & login sessions',
      icon: ShieldCheck,
      onPress: () => onOpenInfoSheet('password'),
    },
    {
      id: 'help',
      title: 'Help & Owner Support',
      subtitle: 'FAQ, contact & listing guidance',
      icon: HelpCircle,
      onPress: () => onOpenInfoSheet('help'),
    },
    {
      id: 'safety',
      title: 'Safety Center',
      subtitle: 'Lister policies & tenant screening',
      icon: LifeBuoy,
      onPress: () => onOpenInfoSheet('safety'),
    },
    {
      id: 'terms',
      title: 'Terms & Privacy Policy',
      subtitle: 'Legal terms and listing rules',
      icon: FileText,
      onPress: () => onOpenInfoSheet('terms'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Settings & Support</Text>

      <View style={styles.card}>
        <View style={styles.list}>
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;

            return (
              <Pressable
                key={item.id}
                style={[styles.row, !isLast && styles.rowBorder]}
                onPress={item.onPress}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={styles.iconWrap}>
                  <Icon size={17} color="#6C4DFF" strokeWidth={2} />
                </View>

                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSub}>{item.subtitle}</Text>
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  itemSub: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
});
