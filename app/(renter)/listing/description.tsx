import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, FileText, Check } from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

const QUICK_SNIPPETS = [
  'Sunlit and well-ventilated rooms with private balcony.',
  'Walking distance from the nearest metro station.',
  'Located in a peaceful, secure gated society with 24/7 water supply.',
  'Modular kitchen with piped gas connection and high-end appliances.',
  'Ideal for working professionals and families looking for comfort.',
];

const MIN_CHARS = 40;
const MAX_CHARS = 1000;

export default function ListingDescriptionRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [description, setDescription] = useState(
    listingDraft.description ||
      'Spacious and tastefully furnished home located in a premium residential neighbourhood. Features modular kitchen, ample natural light, 24/7 security, and convenient access to transit and markets.',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const charCount = description.trim().length;

  const handleAppendSnippet = (snippet: string) => {
    if (description.includes(snippet)) return;
    const newDesc = description
      ? `${description.trim()} ${snippet}`
      : snippet;
    if (newDesc.length <= MAX_CHARS) {
      setDescription(newDesc);
      if (errorMsg) setErrorMsg('');
    }
  };

  const handleContinue = () => {
    if (charCount < MIN_CHARS) {
      setErrorMsg(
        `Please write at least ${MIN_CHARS} characters so renters know more about the property.`,
      );
      return;
    }

    updateListingDraft({ description: description.trim() });
    router.push('/(renter)/listing/availability');
  };

  const handleSaveDraft = () => {
    updateListingDraft({ description: description.trim() });
    setExitModalVisible(false);
    showToast('Listing draft saved', 'success');
    router.replace('/(renter)/home');
  };

  const handleDiscard = () => {
    resetListingDraft();
    setExitModalVisible(false);
    router.replace('/(renter)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ListingHeader
        currentStep={8}
        totalSteps={10}
        onBack={() => router.back()}
        onClose={() => setExitModalVisible(true)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 90 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headingBlock}>
            <Text style={styles.titleText}>Describe your property</Text>
            <Text style={styles.subtitle}>
              Highlight unique aspects, natural light, society rules, and neighborhood perks.
            </Text>
          </View>

          {/* Text Area */}
          <View style={styles.inputContainer}>
            <TextInput
              value={description}
              onChangeText={(t) => {
                if (t.length <= MAX_CHARS) {
                  setDescription(t);
                  if (errorMsg) setErrorMsg('');
                }
              }}
              placeholder="Tell renters what makes this place a good fit..."
              placeholderTextColor="#8C8994"
              multiline
              textAlignVertical="top"
              style={styles.textArea}
            />

            <View style={styles.charCounterRow}>
              {charCount < MIN_CHARS ? (
                <Text style={styles.minCharText}>
                  Min {MIN_CHARS} chars ({MIN_CHARS - charCount} more needed)
                </Text>
              ) : (
                <View style={styles.goodLengthWrap}>
                  <Check size={13} color="#32B768" strokeWidth={2.5} />
                  <Text style={styles.goodLengthText}>Good description length</Text>
                </View>
              )}
              <Text style={styles.charCountText}>
                {charCount} / {MAX_CHARS}
              </Text>
            </View>
          </View>

          {Boolean(errorMsg) && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          {/* Quick Snippets */}
          <View style={styles.snippetSection}>
            <View style={styles.snippetHeader}>
              <Sparkles size={15} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.snippetTitle}>Quick Description Highlights</Text>
            </View>
            <View style={styles.snippetList}>
              {QUICK_SNIPPETS.map((snippet, idx) => (
                <Pressable
                  key={idx}
                  style={styles.snippetChip}
                  onPress={() => handleAppendSnippet(snippet)}
                >
                  <Text style={styles.snippetChipText}>+ {snippet}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={styles.continueBtn}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to availability"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Exit Confirmation Modal */}
      <ListingExitModal
        visible={exitModalVisible}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onCancel={() => setExitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  headingBlock: {
    marginBottom: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 14,
  },
  textArea: {
    minHeight: 140,
    fontSize: 14.5,
    color: '#171522',
    lineHeight: 22,
    fontWeight: '500',
  },
  charCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
    marginTop: 8,
  },
  minCharText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  goodLengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goodLengthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32B768',
  },
  charCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
  },
  snippetSection: {
    gap: 10,
  },
  snippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  snippetTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171522',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  snippetList: {
    gap: 8,
  },
  snippetChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  snippetChipText: {
    fontSize: 13,
    color: '#171522',
    fontWeight: '500',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
