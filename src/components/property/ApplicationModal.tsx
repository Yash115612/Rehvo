import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, StyleSheet } from 'react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ApplicationModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ property, isOpen, onClose }) => {
  const { user, submitApplication } = useAppStore();
  const [moveInDate, setMoveInDate] = useState('2026-09-01');
  const [message, setMessage] = useState(
    'Hi! I am very interested in renting this property. I am a working professional with stable income.'
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!user) return;

    submitApplication({
      property_id: property.id,
      property_title: property.title,
      property_image: property.images[0]?.url || '',
      locality: property.locality,
      rent: property.rent,
      renter_id: user.id,
      renter_name: user.name,
      renter_occupation: user.occupation,
      renter_phone: user.phone,
      status: 'SUBMITTED',
      message,
      move_in_date: moveInDate,
    });

    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontSize: 16, fontWeight: '800' }}>✕</Text>
          </Pressable>

          <Text style={styles.title}>Rental Application</Text>
          <Text style={styles.subtitle}>Submit your rental profile directly to landlord.</Text>

          <View style={{ gap: 12, marginTop: 8 }}>
            <View style={{ gap: 4 }}>
              <Text style={styles.label}>Move-in Date</Text>
              <TextInput
                value={moveInDate}
                onChangeText={setMoveInDate}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
            </View>

            <View style={{ gap: 4 }}>
              <Text style={styles.label}>Message to Landlord</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
                style={[styles.input, { height: 80 }]}
              />
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                ✓ Your verified profile ({user?.occupation || 'Renter'}) will be attached.
              </Text>
            </View>

            <Pressable onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>Submit Rental Application</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 8,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#17151F',
  },
  subtitle: {
    fontSize: 12,
    color: '#86828F',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#86828F',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F7F5F0',
    borderWidth: 1,
    borderColor: '#E4E2DD',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#17151F',
  },
  noteBox: {
    backgroundColor: '#EEE9FF',
    padding: 10,
    borderRadius: 12,
  },
  noteText: {
    color: '#6C4DFF',
    fontSize: 11,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: '#17151F',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
