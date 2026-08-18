import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import {
  X,
  MessageCircle,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Check,
  Lock,
  Send,
  HelpCircle,
  Eye,
  Phone,
  FileCheck,
  AlertTriangle,
} from 'lucide-react-native';

export type InfoSheetType =
  | 'help'
  | 'safety'
  | 'privacy'
  | 'terms'
  | 'password'
  | 'notifications'
  | 'about'
  | 'verification'
  | null;

interface InfoSheetModalProps {
  type: InfoSheetType;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const InfoSheetModal: React.FC<InfoSheetModalProps> = ({
  type,
  onClose,
  onToast,
}) => {
  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Support inquiry state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  // Safety report state
  const [reportType, setReportType] = useState('Suspicious pricing / advance fee');
  const [reportDetails, setReportDetails] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  // Privacy toggles
  const [showPhoneOnlyOnVisit, setShowPhoneOnlyOnVisit] = useState(true);
  const [allowPersonalizedRecs, setAllowPersonalizedRecs] = useState(true);
  const [shareProfileWithOwners, setShareProfileWithOwners] = useState(true);

  if (!type) return null;

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919876543210?text=Hi%20REHVO%20Support%2C%20I%20have%20a%20query%20about%20my%20rental'
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL(
      'mailto:support@rehvo.in?subject=REHVO%20Support%20Request'
    );
  };

  const handleUpdatePassword = () => {
    if (!currentPw) {
      onToast('Please enter your current password', 'error');
      return;
    }
    if (!newPw || newPw.length < 6) {
      onToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      onToast('New passwords do not match', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    onToast('Security password updated successfully', 'success');
    onClose();
  };

  const handleSubmitSupport = () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      onToast('Please provide both subject and message', 'error');
      return;
    }
    setIsSubmittingSupport(true);
    setTimeout(() => {
      setIsSubmittingSupport(false);
      setSupportSubject('');
      setSupportMessage('');
      onToast(
        'Support ticket created! We will reply within 2 hours.',
        'success'
      );
      onClose();
    }, 600);
  };

  const handleSubmitReport = () => {
    if (!reportDetails.trim()) {
      onToast('Please provide details for the safety report', 'error');
      return;
    }
    setIsReporting(true);
    setTimeout(() => {
      setIsReporting(false);
      setReportDetails('');
      onToast(
        'Safety report submitted to REHVO Moderation Team',
        'success'
      );
      onClose();
    }, 600);
  };

  const renderContent = () => {
    switch (type) {
      case 'help':
        return (
          <View style={styles.contentWrap}>
            <Text style={styles.sectionTitle}>How can we help you today?</Text>
            <Text style={styles.para}>
              Our concierge support team is available 7 days a week from 9 AM to
              9 PM to assist with searches, visits, and rental agreements.
            </Text>

            {/* Direct Channels */}
            <View style={styles.channelRow}>
              <Pressable
                style={[styles.supportCard, { flex: 1 }]}
                onPress={handleWhatsApp}
              >
                <View style={styles.supportIconWrap}>
                  <MessageCircle size={22} color="#25D366" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportCardTitle}>WhatsApp</Text>
                  <Text style={styles.supportCardSub}>Instant chat</Text>
                </View>
              </Pressable>

              <Pressable
                style={[styles.supportCard, { flex: 1 }]}
                onPress={handleEmailSupport}
              >
                <View style={styles.supportIconWrap}>
                  <Mail size={22} color="#6C4DFF" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportCardTitle}>Email</Text>
                  <Text style={styles.supportCardSub}>support@rehvo.in</Text>
                </View>
              </Pressable>
            </View>

            {/* In-app Support Ticket Form */}
            <View style={styles.formCard}>
              <Text style={styles.formCardTitle}>Send us a message</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  value={supportSubject}
                  onChangeText={setSupportSubject}
                  placeholder="e.g. Question about visit scheduling"
                  placeholderTextColor="#8C8994"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description / Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={supportMessage}
                  onChangeText={setSupportMessage}
                  placeholder="Describe your question or issue in detail..."
                  placeholderTextColor="#8C8994"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <Pressable
                style={[
                  styles.primaryActionBtn,
                  isSubmittingSupport && styles.btnDisabled,
                ]}
                onPress={handleSubmitSupport}
                disabled={isSubmittingSupport}
              >
                <Send size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.primaryActionBtnText}>
                  {isSubmittingSupport ? 'Submitting...' : 'Submit Support Request'}
                </Text>
              </Pressable>
            </View>
          </View>
        );

      case 'safety':
        return (
          <View style={styles.contentWrap}>
            <View style={styles.safetyHero}>
              <ShieldCheck size={26} color="#32B768" strokeWidth={2.5} />
              <Text style={styles.safetyHeroTitle}>REHVO SafeRent Standards</Text>
            </View>

            <View style={styles.safetyTip}>
              <Text style={styles.safetyTipNum}>1</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.safetyTipTitle}>Always visit before paying</Text>
                <Text style={styles.safetyTipDesc}>
                  Never transfer booking tokens or security deposits before
                  visiting the property in person.
                </Text>
              </View>
            </View>

            <View style={styles.safetyTip}>
              <Text style={styles.safetyTipNum}>2</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.safetyTipTitle}>Verified Ownership Check</Text>
                <Text style={styles.safetyTipDesc}>
                  Homes with the green 'Verified' badge have confirmed electricity
                  bills or title deed checks on REHVO.
                </Text>
              </View>
            </View>

            <View style={styles.safetyTip}>
              <Text style={styles.safetyTipNum}>3</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.safetyTipTitle}>Never share OTPs</Text>
                <Text style={styles.safetyTipDesc}>
                  REHVO representatives will never ask for your banking passwords,
                  UPI PINs, or verification codes.
                </Text>
              </View>
            </View>

            {/* Report Suspicious Activity Form */}
            <View style={styles.formCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={18} color="#E5484D" strokeWidth={2.2} />
                <Text style={styles.formCardTitle}>Report Suspicious Activity</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Issue Category</Text>
                <TextInput
                  style={styles.input}
                  value={reportType}
                  onChangeText={setReportType}
                  placeholder="e.g. Fake photos, fraudulent advance request"
                  placeholderTextColor="#8C8994"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Report Details</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={reportDetails}
                  onChangeText={setReportDetails}
                  placeholder="Provide property title, owner name, or details..."
                  placeholderTextColor="#8C8994"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Pressable
                style={[
                  styles.destructiveActionBtn,
                  isReporting && styles.btnDisabled,
                ]}
                onPress={handleSubmitReport}
                disabled={isReporting}
              >
                <ShieldAlert size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.destructiveActionBtnText}>
                  {isReporting ? 'Submitting Report...' : 'Submit Safety Report'}
                </Text>
              </Pressable>
            </View>
          </View>
        );

      case 'privacy':
        return (
          <View style={styles.contentWrap}>
            <Text style={styles.sectionTitle}>Privacy & Data Protection</Text>
            <Text style={styles.para}>
              Manage how your contact information and rental preferences are
              shared across the REHVO platform.
            </Text>

            <View style={styles.formCard}>
              {/* Toggle 1 */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Protect Phone Number</Text>
                  <Text style={styles.toggleSub}>
                    Only share phone number after a visit is confirmed
                  </Text>
                </View>
                <Switch
                  value={showPhoneOnlyOnVisit}
                  onValueChange={(v) => {
                    setShowPhoneOnlyOnVisit(v);
                    onToast(
                      v
                        ? 'Phone protected: shared only on confirmed visits'
                        : 'Phone visible to all active listers',
                      'info'
                    );
                  }}
                  trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
                  thumbColor={showPhoneOnlyOnVisit ? '#6C4DFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              {/* Toggle 2 */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Personalized Discovery</Text>
                  <Text style={styles.toggleSub}>
                    Use saved preferences to optimize recommended feed
                  </Text>
                </View>
                <Switch
                  value={allowPersonalizedRecs}
                  onValueChange={(v) => {
                    setAllowPersonalizedRecs(v);
                    onToast(
                      v
                        ? 'Personalized recommendations enabled'
                        : 'Standard discovery mode active',
                      'info'
                    );
                  }}
                  trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
                  thumbColor={allowPersonalizedRecs ? '#6C4DFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              {/* Toggle 3 */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Verified Renter Badge</Text>
                  <Text style={styles.toggleSub}>
                    Display verified status to property owners
                  </Text>
                </View>
                <Switch
                  value={shareProfileWithOwners}
                  onValueChange={(v) => {
                    setShareProfileWithOwners(v);
                    onToast(
                      v
                        ? 'Verified status visible to owners'
                        : 'Profile badge hidden',
                      'info'
                    );
                  }}
                  trackColor={{ false: '#E8E5EC', true: '#C5B7FD' }}
                  thumbColor={shareProfileWithOwners ? '#6C4DFF' : '#FFFFFF'}
                />
              </View>
            </View>

            <View style={styles.privacyNote}>
              <Lock size={15} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.privacyNoteText}>
                Your data is stored in accordance with Indian IT Act guidelines.
                We never sell your contact info to third-party telemarketers.
              </Text>
            </View>
          </View>
        );

      case 'terms':
        return (
          <View style={styles.contentWrap}>
            <Text style={styles.sectionTitle}>Terms of Service & Rules</Text>
            <Text style={styles.para}>
              REHVO is a premium rental marketplace platform connecting renters
              directly with verified property owners and co-living providers
              across Mumbai.
            </Text>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>1. Zero Brokerage Policy</Text>
              <Text style={styles.policyText}>
                No brokerage or commission fees are charged by REHVO on direct
                landlord listings. Landlords agree not to levy unlisted broker fees.
              </Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>2. Verified Listing Standards</Text>
              <Text style={styles.policyText}>
                All property listings must represent real physical units with
                authentic rent, deposit amounts, and recent photography.
              </Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>3. Tenancy Agreements</Text>
              <Text style={styles.policyText}>
                Formal rental agreements and police verification are executed
                directly between tenants and property owners following Maharashtra
                Rent Control regulations.
              </Text>
            </View>
          </View>
        );

      case 'password':
        return (
          <View style={styles.contentWrap}>
            <Text style={styles.sectionTitle}>Change Security Password</Text>
            <Text style={styles.para}>
              Choose a strong password with at least 6 characters to keep your
              REHVO account secure.
            </Text>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password *</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={currentPw}
                  onChangeText={setCurrentPw}
                  placeholder="Enter current password"
                  placeholderTextColor="#8C8994"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password *</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={newPw}
                  onChangeText={setNewPw}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#8C8994"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password *</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#8C8994"
                />
              </View>

              <Pressable
                style={styles.primaryActionBtn}
                onPress={handleUpdatePassword}
              >
                <Lock size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.primaryActionBtnText}>Update Password</Text>
              </Pressable>
            </View>
          </View>
        );

      case 'about':
        return (
          <View style={styles.contentWrap}>
            <View style={{ alignItems: 'center', marginVertical: 12, gap: 6 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#F0ECFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={28} color="#6C4DFF" strokeWidth={2.2} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#171522', letterSpacing: -0.5 }}>
                REHVO
              </Text>
              <Text style={{ fontSize: 13, color: '#777482', fontWeight: '600' }}>
                Find a place. Find your people.
              </Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>About the Platform</Text>
              <Text style={styles.policyText}>
                REHVO is a zero-brokerage rental discovery ecosystem purpose-built
                for modern renters, verified property owners, and flatmate seekers
                across Mumbai.
              </Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>Application Build</Text>
              <Text style={styles.policyText}>
                Version: 1.0.0 (Production Build){'\n'}
                Engine: Expo SDK 54 / React Native 0.76{'\n'}
                Architecture: Universal Mobile Client
              </Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>Support & Enquiries</Text>
              <Text style={styles.policyText}>
                For partnerships, enterprise listings, or support:{'\n'}
                Email: support@rehvo.com
              </Text>
            </View>
          </View>
        );

      case 'verification':
        return (
          <View style={styles.contentWrap}>
            <View style={styles.safetyHero}>
              <ShieldCheck size={26} color="#32B768" strokeWidth={2.5} />
              <Text style={styles.safetyHeroTitle}>REHVO Verification Hub</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Phone Verification</Text>
                  <Text style={styles.toggleSub}>OTP verified via SMS (+91 98765 43210)</Text>
                </View>
                <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#16A34A' }}>VERIFIED</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Email Verification</Text>
                  <Text style={styles.toggleSub}>Confirmed account email address</Text>
                </View>
                <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#16A34A' }}>VERIFIED</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Government ID / Ownership Deed</Text>
                  <Text style={styles.toggleSub}>Aadhaar, Passport, or Electricity Bill verification</Text>
                </View>
                <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#D97706' }}>UNDER REVIEW</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.primaryActionBtn}
              onPress={() => {
                onClose();
                onToast('Document upload request recorded. Our safety concierge will contact you.', 'success');
              }}
            >
              <FileCheck size={16} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.primaryActionBtnText}>Upload Additional Documents</Text>
            </Pressable>
          </View>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'help':
        return 'Help & Support';
      case 'safety':
        return 'Safety Center';
      case 'privacy':
        return 'Privacy & Settings';
      case 'terms':
        return 'Terms & Policies';
      case 'password':
        return 'Security & Password';
      case 'about':
        return 'About REHVO';
      case 'verification':
        return 'Account Verification';
      default:
        return 'Information';
    }
  };

  return (
    <Modal
      visible={Boolean(type)}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color="#171522" strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentWrap: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  para: {
    fontSize: 13.5,
    color: '#777482',
    lineHeight: 20,
  },
  channelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  supportIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  supportCardSub: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  formCard: {
    backgroundColor: '#FAF9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
  },
  formCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#171522',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  primaryActionBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  destructiveActionBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E5484D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  destructiveActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  safetyHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF8F0',
    padding: 14,
    borderRadius: 16,
  },
  safetyHeroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  safetyTip: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 14,
    padding: 12,
  },
  safetyTipNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    color: '#6C4DFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '800',
    fontSize: 12,
  },
  safetyTipTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  safetyTipDesc: {
    fontSize: 12,
    color: '#777482',
    lineHeight: 17,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextCol: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  toggleSub: {
    fontSize: 11.5,
    color: '#777482',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E5EC',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0ECFF',
    padding: 12,
    borderRadius: 14,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: '#6C4DFF',
    lineHeight: 16,
    fontWeight: '500',
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 4,
  },
  policyHeading: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  policyText: {
    fontSize: 12.5,
    color: '#777482',
    lineHeight: 17,
  },
});
