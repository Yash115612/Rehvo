import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { UserProfile } from '../../types';

interface OwnerHeaderProps {
  user: UserProfile | null;
  onNotificationPress?: () => void;
  unreadNotifications?: boolean;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  user,
  onNotificationPress,
  unreadNotifications = false,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Owner';
  const avatarUri =
    user?.avatar ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

  return (
    <View style={styles.container}>
      {/* Left: Avatar & Greeting */}
      <View style={styles.leftCol}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.textWrap}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.subText}>Owner Workspace</Text>
        </View>
      </View>

      {/* Right: Circular Notification Bell */}
      <Pressable
        style={styles.bellBtn}
        onPress={onNotificationPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Bell size={19} color="#171522" strokeWidth={2} />
        {unreadNotifications && <View style={styles.unreadDot} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F8F7F4',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8E5EC',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textWrap: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6C4DFF',
    marginTop: 1,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C4DFF',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
