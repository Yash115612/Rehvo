import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { LogOut, Trash2 } from 'lucide-react-native';

interface OwnerAccountActionsSectionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const OwnerAccountActionsSection: React.FC<
  OwnerAccountActionsSectionProps
> = ({ onLogout, onDeleteAccount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.card}>
        {/* Logout */}
        <Pressable
          style={[styles.row, styles.rowBorder]}
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out of REHVO"
        >
          <View style={styles.iconWrap}>
            <LogOut size={16} color="#777482" strokeWidth={2} />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        {/* Delete Account */}
        <Pressable
          style={styles.row}
          onPress={onDeleteAccount}
          accessibilityRole="button"
          accessibilityLabel="Delete owner account"
        >
          <View style={[styles.iconWrap, styles.iconWrapDanger]}>
            <Trash2 size={16} color="#E5484D" strokeWidth={2} />
          </View>
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: {
    backgroundColor: '#FEEFEF',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5484D',
  },
});
