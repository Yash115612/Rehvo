import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyTrustSectionProps {
  property: Property;
}

export const PropertyTrustSection: React.FC<PropertyTrustSectionProps> = ({
  property,
}) => {
  const isVerified = property.verification_status === 'VERIFIED';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShieldCheck size={20} color="#32B768" strokeWidth={2.2} />
          <Text style={styles.cardTitle}>Why this listing is trusted</Text>
        </View>

        <View style={styles.itemRow}>
          <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
          <Text style={styles.itemText}>
            {isVerified
              ? 'Property physically verified by REHVO team'
              : 'Listing details reviewed for rental guidelines'}
          </Text>
        </View>

        <View style={styles.itemRow}>
          <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
          <Text style={styles.itemText}>
            Owner identity confirmed & verified
          </Text>
        </View>

        <View style={styles.itemRow}>
          <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
          <Text style={styles.itemText}>
            Original property photos inspected
          </Text>
        </View>

        <View style={styles.itemRow}>
          <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
          <Text style={styles.itemText}>
            Availability and rent recently confirmed
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#EAF8F0',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#C6EED5',
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
    lineHeight: 18,
  },
});
