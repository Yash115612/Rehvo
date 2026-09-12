import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { FileText, Download, ExternalLink } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

interface V4DocumentBubbleProps {
  documentUrl?: string;
  documentName?: string;
  fileSize?: string;
  isMe: boolean;
}

const V4DocumentBubbleComponent: React.FC<V4DocumentBubbleProps> = ({
  documentUrl,
  documentName = 'Document.pdf',
  fileSize = '1.4 MB',
  isMe,
}) => {
  const handleOpenDoc = () => {
    triggerHaptic();
    if (documentUrl) {
      Linking.openURL(documentUrl).catch(() => {});
    }
  };

  const isPdf = documentName.toLowerCase().endsWith('.pdf');

  return (
    <Pressable
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
      onPress={handleOpenDoc}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Download document ${documentName}`}
    >
      <View style={[styles.iconWrap, isMe ? styles.iconWrapMe : styles.iconWrapOther]}>
        <FileText size={20} color={isMe ? '#0F766E' : '#FFFFFF'} />
        {isPdf && (
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfBadgeText}>PDF</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.filename, isMe ? styles.textLight : styles.textDark]}
          numberOfLines={1}
        >
          {documentName}
        </Text>
        <Text style={[styles.sizeText, isMe ? styles.subtextLight : styles.subtextDark]}>
          {fileSize} • Tap to view
        </Text>
      </View>

      <View style={[styles.downloadBtn, isMe ? styles.downloadBtnMe : styles.downloadBtnOther]}>
        <Download size={15} color={isMe ? '#FFFFFF' : '#0F766E'} />
      </View>
    </Pressable>
  );
};

export const V4DocumentBubble = memo(V4DocumentBubbleComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    minWidth: 230,
    maxWidth: 280,
    gap: 10,
    borderWidth: 1,
  },
  containerMe: {
    backgroundColor: '#0F766E',
    borderColor: '#0D6860',
  },
  containerOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2ECEF',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapMe: {
    backgroundColor: '#FFFFFF',
  },
  iconWrapOther: {
    backgroundColor: '#0F766E',
  },
  pdfBadge: {
    position: 'absolute',
    bottom: -3,
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  pdfBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  filename: {
    fontSize: 13,
    fontWeight: '800',
  },
  sizeText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#031B2A',
  },
  subtextLight: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  subtextDark: {
    color: '#64748B',
  },
  downloadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  downloadBtnOther: {
    backgroundColor: '#F0FDFA',
  },
});
