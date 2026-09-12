import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, UserCheck, Wrench, Award } from 'lucide-react-native';
import { ServiceBookingStatus } from '../../../types';

interface V4BookingTimelineProps {
  status: ServiceBookingStatus | string;
  scheduledDate?: string;
  timeSlot?: string;
  technicianName?: string;
}

export const V4BookingTimeline: React.FC<V4BookingTimelineProps> = ({
  status,
  scheduledDate,
  timeSlot,
  technicianName,
}) => {
  const steps = [
    {
      id: 'requested',
      title: 'Booking Requested',
      desc: scheduledDate && timeSlot ? `${scheduledDate} • ${timeSlot}` : 'Slot reserved',
      icon: Clock,
    },
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      desc: 'Provider accepted your request',
      icon: CheckCircle2,
    },
    {
      id: 'assigned',
      title: 'Pro Assigned',
      desc: technicianName ? `${technicianName} is assigned` : 'Verified pro on the way',
      icon: UserCheck,
    },
    {
      id: 'in_progress',
      title: 'Service In Progress',
      desc: 'Work verified via start OTP',
      icon: Wrench,
    },
    {
      id: 'completed',
      title: 'Completed & Inspected',
      desc: '30-day rework warranty active',
      icon: Award,
    },
  ];

  const getStepStatus = (index: number) => {
    // Determine active index based on status
    let activeIndex = 0;
    if (status === 'confirmed' || status === 'accepted') activeIndex = 1;
    else if (status === 'assigned' || status === 'in_transit') activeIndex = 2;
    else if (status === 'in_progress') activeIndex = 3;
    else if (status === 'completed') activeIndex = 4;

    if (index < activeIndex) return 'done';
    if (index === activeIndex) return 'current';
    return 'upcoming';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SERVICE STATUS TRACKER</Text>
      <View style={styles.timelineList}>
        {steps.map((step, idx) => {
          const stepState = getStepStatus(idx);
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <View key={step.id} style={styles.stepRow}>
              {/* Left column: indicator & line */}
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.circle,
                    stepState === 'done' && styles.circleDone,
                    stepState === 'current' && styles.circleCurrent,
                  ]}
                >
                  <Icon
                    size={14}
                    color={
                      stepState === 'done'
                        ? '#FFFFFF'
                        : stepState === 'current'
                        ? '#0F766E'
                        : '#94A3B8'
                    }
                  />
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.connectorLine,
                      stepState === 'done' && styles.connectorLineDone,
                    ]}
                  />
                )}
              </View>

              {/* Right column: text */}
              <View style={[styles.textCol, !isLast && { paddingBottom: 20 }]}>
                <Text
                  style={[
                    styles.stepTitle,
                    stepState === 'current' && styles.stepTitleCurrent,
                    stepState === 'done' && styles.stepTitleDone,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    zIndex: 1,
  },
  circleDone: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  circleCurrent: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  connectorLineDone: {
    backgroundColor: '#0F766E',
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  stepTitleDone: {
    color: '#0F172A',
  },
  stepTitleCurrent: {
    color: '#0F766E',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
