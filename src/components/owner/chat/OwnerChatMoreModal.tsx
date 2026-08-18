import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import {
  Building2,
  CalendarDays,
  MessageCircle,
  Phone,
  X,
  ChevronRight,
} from 'lucide-react-native';

interface OwnerChatMoreModalProps {
  visible: boolean;
  onClose: () => void;
  onViewProperty: () => void;
  onScheduleVisit: () => void;
  onWhatsApp: () => void;
  onCall: () => void;
}

export const OwnerChatMoreModal: React.FC<OwnerChatMoreModalProps> = ({
  visible,
  onClose,
  onViewProperty,
  onScheduleVisit,
  onWhatsApp,
  onCall,
}) => {
  const options = [
    {
      id: 'prop',
      title: 'View Property Details',
      subtitle: 'Open full public listing',
      icon: Building2,
      onPress: () => {
        onClose();
        onViewProperty();
      },
    },
    {
      id: 'visit',
      title: 'Schedule a Visit',
      subtitle: 'Set a date & time slot for the renter',
      icon: CalendarDays,
      onPress: () => {
        onClose();
        onScheduleVisit();
      },
    },
    {
      id: 'wa',
      title: 'Chat on WhatsApp',
      subtitle: 'Direct WhatsApp message',
      icon: MessageCircle,
      onPress: () => {
        onClose();
        onWhatsApp();
      },
    },
    {
      id: 'call',
      title: 'Call Renter',
      subtitle: 'Direct phone call',
      icon: Phone,
      onPress: () => {
        onClose();
        onCall();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Conversation Options</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={18} color="#777482" />
            </Pressable>
          </View>

          <View style={styles.list}>
            {options.map((opt, idx) => {
              const Icon = opt.icon;
              const isLast = idx === options.length - 1;

              return (
                <Pressable
                  key={opt.id}
                  style={[styles.row, !isLast && styles.rowBorder]}
                  onPress={opt.onPress}
                >
                  <View style={styles.iconWrap}>
                    <Icon size={18} color="#6C4DFF" strokeWidth={2} />
                  </View>
                  <View style={styles.textCol}>
                    <Text style={styles.optTitle}>{opt.title}</Text>
                    <Text style={styles.optSub}>{opt.subtitle}</Text>
                  </View>
                  <ChevronRight size={16} color="#86828F" />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 2,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  optTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  optSub: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
});
