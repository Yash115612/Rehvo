import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShieldAlert, Flag, CheckCircle2 } from 'lucide-react-native';

interface PropertySafetySectionProps {
  onReportPress: () => void;
}

export const PropertySafetySection: React.FC<PropertySafetySectionProps> = ({
  onReportPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <ShieldAlert size={18} color="#FF735C" strokeWidth={2.2} />
          <Text style={styles.title}>Stay safe on REHVO</Text>
        </View>

        <View style={styles.tipsList}>
          <Text style={styles.tipText}>
            • Never transfer rent or deposit before visiting the property in person.
          </Text>
          <Text style={styles.tipText}>
            • Verify owner identity and agreement terms during physical visit.
          </Text>
          <Text style={styles.tipText}>
            • Keep conversations and bookings documented on REHVO.
          </Text>
        </View>

        <Pressable
          style={styles.reportBtn}
          onPress={onReportPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Report this listing"
        >
          <Flag size={13} color="#E5484D" strokeWidth={2.2} />
          <Text style={styles.reportBtnText}>Report this listing</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
  },
  tipsList: {
    gap: 6,
  },
  tipText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
    lineHeight: 18,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 4,
  },
  reportBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E5484D',
  },
});
