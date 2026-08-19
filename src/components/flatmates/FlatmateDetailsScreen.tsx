import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Share,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  MoreVertical,
  ShieldCheck,
  MapPin,
  IndianRupee,
  BedDouble,
  Calendar,
  Sparkles,
  MessageCircle,
  ShieldAlert,
  AlertTriangle,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  Check,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface FlatmateDetailsScreenProps {
  profile: FlatmateProfile;
}

export const FlatmateDetailsScreen: React.FC<FlatmateDetailsScreenProps> = ({
  profile,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    myFlatmateProfile,
    savedFlatmateIds,
    toggleSaveFlatmate,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const isSaved = savedFlatmateIds.includes(profile.id);
  const isOwnProfile = Boolean(
    (user?.id && profile.user_id && user.id === profile.user_id) ||
    (myFlatmateProfile && myFlatmateProfile.id === profile.id)
  );

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fake profile');
  const [reportComment, setReportComment] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const avatarUri =
    profile.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${profile.name} · Flatmate Profile on REHVO`,
        message: `Check out ${profile.name}'s flatmate profile on REHVO: Looking in ${
          profile.locality || 'Mumbai'
        } with budget ₹${(profile.budget_min / 1000).toFixed(0)}K–₹${(
          profile.budget_max / 1000
        ).toFixed(0)}K / mo.`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const handleStartChat = async () => {
    if (isStartingChat) return;

    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 1 button_pressed on flatmate profile:', profile.id);
    }

    if (!user?.id) {
      showToast('Please sign in to message this flatmate', 'info');
      return;
    }

    if (isOwnProfile) {
      showToast('You cannot chat with yourself.', 'info');
      return;
    }

    setIsStartingChat(true);
    try {
      const convId = await startOrGetFlatmateConversation(profile);
      if (convId) {
        if (__DEV__) {
          console.log('[REHVO FLATMATE CHAT DEBUG] STEP 9 navigation_started to route: /(renter)/chat/' + convId);
        }
        router.push(`/(renter)/chat/${convId}`);
      }
    } catch (err: any) {
      if (__DEV__) {
        console.warn('[REHVO FLATMATE CHAT DEBUG] Error in button handler:', err?.message);
      }
      showToast("Unable to start chat. Please try again.", 'error');
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleSubmitReport = () => {
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setIsReportModalOpen(false);
      setReportComment('');
      showToast(
        'Report submitted. REHVO Safety Team will review this profile.',
        'success'
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header Bar */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(renter)/flatmates');
            }
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {profile.name}
        </Text>

        <View style={styles.headerRightGroup}>
          <Pressable
            style={styles.headerBtn}
            onPress={handleShare}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share profile"
          >
            <Share2 size={18} color="#171522" strokeWidth={2} />
          </Pressable>

          <Pressable
            style={styles.headerBtn}
            onPress={() => setIsReportModalOpen(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Report profile"
          >
            <MoreVertical size={18} color="#171522" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Hero Photo & Identity Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.heroAvatar}
            resizeMode="cover"
          />

          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {profile.name}
                {profile.age ? <Text style={styles.age}>, {profile.age}</Text> : null}
              </Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.verifiedText}>Verified Renter</Text>
              </View>
            </View>

            <Text style={styles.occupation}>{profile.occupation}</Text>

            {profile.looking_for ? (
              <View style={styles.lookingForPill}>
                <Text style={styles.lookingForText}>{profile.looking_for}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* 3. Compatibility Match Box */}
        <View style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <Sparkles size={18} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.matchTitle}>Roommate Compatibility</Text>
            <View style={styles.matchScorePill}>
              <Text style={styles.matchScoreText}>
                {profile.match_score || 90}% Match
              </Text>
            </View>
          </View>

          <View style={styles.matchReasonsList}>
            {(
              profile.match_reasons || [
                `High locality match in ${profile.locality || 'Mumbai'}`,
                `Matching budget bracket (₹${(
                  profile.budget_min / 1000
                ).toFixed(0)}K–₹${(profile.budget_max / 1000).toFixed(0)}K)`,
                `Move-in compatible (${
                  profile.move_in_timing || profile.move_in_date || 'Flexible'
                })`,
                `Shared lifestyle preferences`,
              ]
            ).map((reason, idx) => (
              <View key={idx} style={styles.reasonRow}>
                <CheckCircle2 size={15} color="#32B768" strokeWidth={2.2} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Budget & Location Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Budget & Locations</Text>

          <View style={styles.metaRowBig}>
            <View style={styles.metaIconCircle}>
              <IndianRupee size={20} color="#6C4DFF" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.metaLabel}>Monthly Budget Share</Text>
              <Text style={styles.metaValue}>
                ₹{profile.budget_min.toLocaleString('en-IN')} – ₹
                {profile.budget_max.toLocaleString('en-IN')}
                <Text style={styles.metaValueSub}> / month</Text>
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRowBig}>
            <View style={styles.metaIconCircle}>
              <MapPin size={20} color="#6C4DFF" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.metaLabel}>Preferred Areas</Text>
              <Text style={styles.metaValue}>
                {profile.preferred_locations?.length
                  ? profile.preferred_locations.join(', ')
                  : profile.locality || 'Mumbai'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRowBig}>
            <View style={styles.metaIconCircle}>
              <Calendar size={20} color="#6C4DFF" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.metaLabel}>Target Move-In</Text>
              <Text style={styles.metaValue}>
                {profile.move_in_timing || profile.move_in_date || 'Flexible'}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Room & Apartment Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Housing Preferences</Text>

          <View style={styles.grid2Col}>
            <View style={styles.prefBox}>
              <BedDouble size={18} color="#6C4DFF" />
              <Text style={styles.prefBoxLabel}>Room Type</Text>
              <Text style={styles.prefBoxVal}>{profile.room_preference}</Text>
            </View>

            <View style={styles.prefBox}>
              <Home size={18} color="#6C4DFF" />
              <Text style={styles.prefBoxLabel}>Property Types</Text>
              <Text style={styles.prefBoxVal}>
                {profile.property_types?.length
                  ? profile.property_types.join(', ')
                  : '1–2 BHK'}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Lifestyle & Habits */}
        {profile.lifestyle_preferences?.length ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Lifestyle & Habits</Text>
            <View style={styles.lifestyleGrid}>
              {profile.lifestyle_preferences.map((tag, idx) => (
                <View key={idx} style={styles.lifestyleChip}>
                  <Check size={13} color="#6C4DFF" strokeWidth={2.5} />
                  <Text style={styles.lifestyleChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* 7. About / Bio */}
        {profile.bio ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About {profile.name}</Text>
            <Text style={styles.bioText}>"{profile.bio}"</Text>
          </View>
        ) : null}

        {/* 8. SafeRent Roommate Guidance */}
        <View style={styles.safetyBox}>
          <ShieldAlert size={20} color="#6C4DFF" strokeWidth={2} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.safetyTitle}>REHVO SafeRent Roommate Tip</Text>
            <Text style={styles.safetyDesc}>
              Chat in-app, meet in a public cafe before moving in, and verify the
              rental agreement terms together.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 9. Fixed Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={[styles.saveActionBtn, isSaved && styles.saveActionBtnActive]}
          onPress={() => toggleSaveFlatmate(profile.id)}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Unsave profile' : 'Save profile'}
        >
          <Heart
            size={22}
            color={isSaved ? '#FF4D4D' : '#171522'}
            fill={isSaved ? '#FF4D4D' : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>

        {isOwnProfile ? (
          <Pressable
            style={[styles.chatActionBtn, { backgroundColor: '#171522' }]}
            onPress={() => router.push('/(renter)/flatmate/edit')}
            accessibilityRole="button"
            accessibilityLabel="Edit your flatmate profile"
          >
            <Text style={styles.chatActionBtnText}>Edit Your Profile</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.chatActionBtn, isStartingChat && styles.chatActionBtnDisabled]}
            onPress={handleStartChat}
            disabled={isStartingChat}
            accessibilityRole="button"
            accessibilityLabel={`Chat with ${profile.name}`}
          >
            {isStartingChat ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MessageCircle size={19} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.chatActionBtnText}>
                  Chat with {profile.display_name || profile.name.split(' ')[0]}
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* 10. Report Profile Modal */}
      <Modal
        visible={isReportModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReportModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="#E5484D" strokeWidth={2.2} />
                <Text style={styles.modalTitle}>Report Profile</Text>
              </View>
              <Pressable
                onPress={() => setIsReportModalOpen(false)}
                hitSlop={8}
              >
                <X size={20} color="#171522" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              <Text style={styles.modalDesc}>
                Help us keep REHVO safe. Why are you reporting this profile?
              </Text>

              {['Fake profile', 'Spam / Telemarketing', 'Harassment', 'Inappropriate content', 'Other'].map(
                (reason) => {
                  const isSelected = reportReason === reason;
                  return (
                    <Pressable
                      key={reason}
                      style={[
                        styles.reportReasonPill,
                        isSelected && styles.reportReasonPillSelected,
                      ]}
                      onPress={() => setReportReason(reason)}
                    >
                      <Text
                        style={[
                          styles.reportReasonText,
                          isSelected && styles.reportReasonTextSelected,
                        ]}
                      >
                        {reason}
                      </Text>
                      {isSelected && (
                        <CheckCircle2
                          size={18}
                          color="#E5484D"
                          strokeWidth={2.2}
                        />
                      )}
                    </Pressable>
                  );
                }
              )}

              <Text style={styles.inputLabel}>Additional Details (Optional)</Text>
              <TextInput
                style={styles.modalTextInput}
                value={reportComment}
                onChangeText={setReportComment}
                placeholder="Describe any suspicious behavior..."
                placeholderTextColor="#8C8994"
                multiline
                numberOfLines={3}
              />

              <Pressable
                style={[
                  styles.submitReportBtn,
                  isSubmittingReport && { opacity: 0.6 },
                ]}
                onPress={handleSubmitReport}
                disabled={isSubmittingReport}
              >
                <ShieldAlert size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.submitReportBtnText}>
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
    backgroundColor: '#FFFFFF',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  heroAvatar: {
    width: '100%',
    height: 280,
    backgroundColor: '#E8E5EC',
  },
  heroInfo: {
    padding: 18,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
  },
  age: {
    fontSize: 20,
    fontWeight: '600',
    color: '#777482',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  occupation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777482',
  },
  lookingForPill: {
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#DED6FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  lookingForText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  matchCard: {
    backgroundColor: '#EAF8F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D2F0E0',
    padding: 16,
    gap: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    marginLeft: 6,
  },
  matchScorePill: {
    backgroundColor: '#32B768',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  matchReasonsList: {
    gap: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B8246',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 18,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  metaRowBig: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    marginTop: 2,
  },
  metaValueSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777482',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F0EA',
  },
  grid2Col: {
    flexDirection: 'row',
    gap: 10,
  },
  prefBox: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    borderRadius: 14,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  prefBoxLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
    marginTop: 2,
  },
  prefBoxVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#171522',
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lifestyleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#DED6FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  lifestyleChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  bioText: {
    fontSize: 14,
    color: '#48464B',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  safetyBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F0ECFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  safetyDesc: {
    fontSize: 12,
    color: '#5B5768',
    lineHeight: 17,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  saveActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveActionBtnActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFD6D6',
  },
  chatActionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  chatActionBtnDisabled: {
    backgroundColor: '#9B87F5',
    shadowOpacity: 0.1,
  },
  chatActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  modalDesc: {
    fontSize: 13,
    color: '#777482',
  },
  reportReasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  reportReasonPillSelected: {
    borderColor: '#E5484D',
    backgroundColor: '#FFF5F5',
  },
  reportReasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171522',
  },
  reportReasonTextSelected: {
    color: '#E5484D',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171522',
    marginTop: 4,
  },
  modalTextInput: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    padding: 12,
    fontSize: 13.5,
    color: '#171522',
    height: 70,
    textAlignVertical: 'top',
  },
  submitReportBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E5484D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitReportBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
