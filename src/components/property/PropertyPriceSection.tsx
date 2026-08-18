import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, MapPin, Sparkles } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyPriceSectionProps {
  property: Property;
}

export const PropertyPriceSection: React.FC<PropertyPriceSectionProps> = ({
  property,
}) => {
  const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <View style={styles.container}>
      {/* Small Badge Row */}
      <View style={styles.badgeRow}>
        {property.verification_status === 'VERIFIED' && (
          <View style={styles.verifiedPill}>
            <ShieldCheck size={12} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        {property.brokerage === 0 && (
          <View style={styles.noBrokeragePill}>
            <Text style={styles.noBrokerageText}>No Brokerage</Text>
          </View>
        )}
        <View style={styles.availablePill}>
          <Sparkles size={11} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.availableText}>
            {property.available_from || 'Available now'}
          </Text>
        </View>
      </View>

      {/* Property Title & Location */}
      <Text style={styles.title}>{property.title}</Text>
      <View style={styles.locRow}>
        <MapPin size={14} color="#777482" strokeWidth={2} />
        <Text style={styles.locText}>
          {property.locality}, {property.city}
        </Text>
      </View>

      {/* Primary Rent Headline */}
      <View style={styles.priceCard}>
        <View style={styles.mainRentRow}>
          <Text style={styles.rentAmount}>{formatAmount(property.rent)}</Text>
          <Text style={styles.rentPeriod}> / month</Text>
        </View>

        {/* Cost Breakdown Grid */}
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownCol}>
            <Text style={styles.breakdownLabel}>Security Deposit</Text>
            <Text style={styles.breakdownVal}>
              {property.deposit > 0 ? formatAmount(property.deposit) : '1 Month Rent'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownCol}>
            <Text style={styles.breakdownLabel}>Maintenance</Text>
            <Text style={styles.breakdownVal}>
              {property.maintenance > 0
                ? `${formatAmount(property.maintenance)} / mo`
                : 'Included in rent'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownCol}>
            <Text style={styles.breakdownLabel}>Brokerage</Text>
            <Text style={[styles.breakdownVal, property.brokerage === 0 && styles.greenText]}>
              {property.brokerage === 0
                ? 'Zero Brokerage'
                : formatAmount(property.brokerage)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#32B768',
  },
  noBrokeragePill: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  noBrokerageText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#32B768',
  },
  availablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  availableText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locText: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  mainRentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rentAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.5,
  },
  rentPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  breakdownCol: {
    flex: 1,
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
    marginTop: 3,
    textAlign: 'center',
  },
  greenText: {
    color: '#32B768',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#E8E5EC',
  },
});
