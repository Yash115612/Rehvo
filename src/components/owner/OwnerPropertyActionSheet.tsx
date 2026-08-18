import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import {
  Eye,
  Pencil,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  Trash2,
  X,
} from 'lucide-react-native';
import { Property } from '../../types';

interface OwnerPropertyActionSheetProps {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onView: (prop: Property) => void;
  onEdit: (prop: Property) => void;
  onToggleStatus: (prop: Property) => void;
  onMarkRented: (prop: Property) => void;
  onDelete: (prop: Property) => void;
}

export const OwnerPropertyActionSheet: React.FC<
  OwnerPropertyActionSheetProps
> = ({
  property,
  visible,
  onClose,
  onView,
  onEdit,
  onToggleStatus,
  onMarkRented,
  onDelete,
}) => {
  if (!property) return null;

  const isPaused = property.status === 'PAUSED';
  const isRented = property.status === 'RENTED';

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
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {property.title}
              </Text>
              <Text style={styles.subText}>{property.locality}</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={18} color="#777482" />
            </Pressable>
          </View>

          <View style={styles.actionList}>
            {/* View */}
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onView(property);
              }}
            >
              <Eye size={18} color="#171522" strokeWidth={2} />
              <Text style={styles.actionLabel}>View public listing</Text>
            </Pressable>

            {/* Edit */}
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onEdit(property);
              }}
            >
              <Pencil size={18} color="#171522" strokeWidth={2} />
              <Text style={styles.actionLabel}>Edit listing details</Text>
            </Pressable>

            {/* Pause / Resume */}
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onToggleStatus(property);
              }}
            >
              {isPaused ? (
                <PlayCircle size={18} color="#32B768" strokeWidth={2} />
              ) : (
                <PauseCircle size={18} color="#F59E0B" strokeWidth={2} />
              )}
              <Text style={styles.actionLabel}>
                {isPaused ? 'Resume listing' : 'Pause listing'}
              </Text>
            </Pressable>

            {/* Mark as Rented */}
            {!isRented && (
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  onClose();
                  onMarkRented(property);
                }}
              >
                <CheckCircle size={18} color="#6C4DFF" strokeWidth={2} />
                <Text style={styles.actionLabel}>Mark as rented out</Text>
              </Pressable>
            )}

            {/* Delete */}
            <Pressable
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={() => {
                onClose();
                onDelete(property);
              }}
            >
              <Trash2 size={18} color="#E5484D" strokeWidth={2} />
              <Text style={[styles.actionLabel, { color: '#E5484D' }]}>
                Delete listing
              </Text>
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
    gap: 16,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  subText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionList: {
    gap: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F5F0',
  },
  actionLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
});
