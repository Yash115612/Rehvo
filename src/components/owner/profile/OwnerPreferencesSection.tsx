import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Bell, MessageCircle, CalendarDays } from 'lucide-react-native';

export const OwnerPreferencesSection: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [enquiryAlerts, setEnquiryAlerts] = useState(true);
  const [visitReminders, setVisitReminders] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences & Notifications</Text>

      <View style={styles.card}>
        {/* Push Notifications */}
        <View style={[styles.row, styles.rowBorder]}>
          <View style={styles.iconWrap}>
            <Bell size={17} color="#6C4DFF" strokeWidth={2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.rowTitle}>Push Notifications</Text>
            <Text style={styles.rowSub}>Receive updates directly on your device</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
            thumbColor={pushEnabled ? '#6C4DFF' : '#FFFFFF'}
          />
        </View>

        {/* Enquiry Alerts */}
        <View style={[styles.row, styles.rowBorder]}>
          <View style={styles.iconWrap}>
            <MessageCircle size={17} color="#6C4DFF" strokeWidth={2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.rowTitle}>Instant Enquiry Alerts</Text>
            <Text style={styles.rowSub}>Get notified when renters send a question</Text>
          </View>
          <Switch
            value={enquiryAlerts}
            onValueChange={setEnquiryAlerts}
            trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
            thumbColor={enquiryAlerts ? '#6C4DFF' : '#FFFFFF'}
          />
        </View>

        {/* Visit Reminders */}
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <CalendarDays size={17} color="#6C4DFF" strokeWidth={2} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.rowTitle}>Visit Reminders</Text>
            <Text style={styles.rowSub}>Alerts 2 hours before scheduled visits</Text>
          </View>
          <Switch
            value={visitReminders}
            onValueChange={setVisitReminders}
            trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
            thumbColor={visitReminders ? '#6C4DFF' : '#FFFFFF'}
          />
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
  rowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  rowSub: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
});
