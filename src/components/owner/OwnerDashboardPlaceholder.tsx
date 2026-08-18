import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { UserProfile } from '../../types';

interface OwnerDashboardPlaceholderProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const OwnerDashboardPlaceholder: React.FC<OwnerDashboardPlaceholderProps> = ({ user, onLogout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>OWNER MODE ACTIVE</Text>
        </View>

        <Text style={styles.title}>REHVO Owner Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage your rental property listings, respond to tenant inquiries, and track visits.
        </Text>

        {user && (
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user.name?.[0] || 'O'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email || user.phone}</Text>
            </View>
          </View>
        )}

        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out / Reset Session</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FF6B4A',
    fontSize: 10,
    fontWeight: '900',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#17151F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#86828F',
    textAlign: 'center',
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  userName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#17151F',
  },
  userEmail: {
    fontSize: 11,
    color: '#86828F',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: '#17151F',
    fontSize: 13,
    fontWeight: '800',
  },
});
