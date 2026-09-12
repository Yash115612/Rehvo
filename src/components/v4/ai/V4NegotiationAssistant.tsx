import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Share,
} from 'react-native';
import {
  TrendingDown,
  Sparkles,
  Copy,
  Check,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Percent,
  ChevronRight,
} from 'lucide-react-native';
import { Property, NegotiationAIResult } from '../../../types';
import { generateNegotiation } from '../../../services/rehvoAI';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4NegotiationAssistantProps {
  property?: Property;
  initialAskingRent?: number;
  onClose?: () => void;
}

export const V4NegotiationAssistant: React.FC<V4NegotiationAssistantProps> = React.memo(
  ({ property, initialAskingRent, onClose }) => {
    const defaultAsking = property?.rent || initialAskingRent || 55000;
    const [askingRent, setAskingRent] = useState<number>(defaultAsking);
    const [desiredRent, setDesiredRent] = useState<number>(
      Math.round((defaultAsking * 0.9) / 500) * 500
    );
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'call' | 'steps'>('whatsapp');
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [copied, setCopied] = useState(false);

    const negotiationResult: NegotiationAIResult = useMemo(() => {
      return generateNegotiation(
        askingRent,
        property?.locality || 'Bandra West',
        property,
        desiredRent
      );
    }, [askingRent, desiredRent, property]);

    const handleCopy = (text: string) => {
      Share.share({ message: text });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeWrap}>
            <TrendingDown size={14} color={V4_COLORS.primary} />
            <Text style={styles.badgeText}>AI NEGOTIATION STUDIO</Text>
          </View>
          <View style={styles.confidencePill}>
            <Sparkles size={11} color="#047857" />
            <Text style={styles.confidenceText}>
              {negotiationResult.negotiationConfidencePercent}% Confidence
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Close Direct Deals at Fair Market Value</Text>
        <Text style={styles.subtitle}>
          Save thousands per month using data-backed counter-offers tailored to Mumbai landlords.
        </Text>

        {/* Rent Adjustment Grid */}
        <View style={styles.rentCard}>
          <View style={styles.rentCol}>
            <Text style={styles.rentLabel}>Asking Rent</Text>
            <Text style={styles.askingText}>₹{askingRent.toLocaleString('en-IN')}</Text>
          </View>

          <ArrowRight size={18} color="#94A3B8" />

          <View style={styles.rentCol}>
            <Text style={styles.rentLabel}>AI Recommended</Text>
            <Text style={styles.targetText}>
              ₹{negotiationResult.aiTargetRent.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Quick Offer Adjuster Chips */}
        <View style={styles.chipsRow}>
          <Text style={styles.chipsLabel}>Target Discount:</Text>
          {[5, 8, 10, 12].map((percent) => {
            const val = Math.round((askingRent * (1 - percent / 100)) / 500) * 500;
            const isSelected = desiredRent === val;
            return (
              <Pressable
                key={percent}
                style={[styles.percentChip, isSelected && styles.percentChipActive]}
                onPress={() => setDesiredRent(val)}
              >
                <Text
                  style={[styles.percentChipText, isSelected && styles.percentChipTextActive]}
                >
                  -{percent}%
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Annual Savings Banner */}
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Estimated Annual Savings:</Text>
          <Text style={styles.savingsVal}>
            ₹{negotiationResult.estimatedSavingsAnnual.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Language & Channel Tabs */}
        <View style={styles.tabsHeader}>
          <View style={styles.channelTabs}>
            <Pressable
              style={[styles.tabBtn, activeTab === 'whatsapp' && styles.tabBtnActive]}
              onPress={() => setActiveTab('whatsapp')}
            >
              <MessageSquare size={13} color={activeTab === 'whatsapp' ? '#FFFFFF' : '#64748B'} />
              <Text
                style={[styles.tabText, activeTab === 'whatsapp' && styles.tabTextActive]}
              >
                WhatsApp
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabBtn, activeTab === 'call' && styles.tabBtnActive]}
              onPress={() => setActiveTab('call')}
            >
              <PhoneCall size={13} color={activeTab === 'call' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'call' && styles.tabTextActive]}>
                Phone Script
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabBtn, activeTab === 'steps' && styles.tabBtnActive]}
              onPress={() => setActiveTab('steps')}
            >
              <Percent size={13} color={activeTab === 'steps' ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>
                Steps
              </Text>
            </Pressable>
          </View>

          {/* Lang Toggle */}
          {activeTab !== 'steps' && (
            <Pressable
              style={styles.langToggle}
              onPress={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
            >
              <Text style={styles.langToggleText}>{language === 'en' ? 'हिन्दी में' : 'In English'}</Text>
            </Pressable>
          )}
        </View>

        {/* Content Box */}
        <View style={styles.scriptBox}>
          {activeTab === 'whatsapp' && (
            <>
              <ScrollView style={styles.scriptScroll} nestedScrollEnabled>
                <Text style={styles.scriptText}>
                  {language === 'hi'
                    ? negotiationResult.whatsappMessageHindi
                    : negotiationResult.whatsappMessageEnglish}
                </Text>
              </ScrollView>

              <Pressable
                style={styles.copyBtn}
                onPress={() =>
                  handleCopy(
                    language === 'hi'
                      ? negotiationResult.whatsappMessageHindi
                      : negotiationResult.whatsappMessageEnglish
                  )
                }
              >
                {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color="#FFFFFF" />}
                <Text style={styles.copyBtnText}>{copied ? 'Copied to WhatsApp!' : 'Copy WhatsApp Message'}</Text>
              </Pressable>
            </>
          )}

          {activeTab === 'call' && (
            <>
              <ScrollView style={styles.scriptScroll} nestedScrollEnabled>
                <Text style={styles.scriptText}>
                  {language === 'hi'
                    ? negotiationResult.phoneCallScriptHindi
                    : negotiationResult.phoneCallScriptEnglish}
                </Text>
              </ScrollView>

              <Pressable
                style={styles.copyBtn}
                onPress={() =>
                  handleCopy(
                    language === 'hi'
                      ? negotiationResult.phoneCallScriptHindi
                      : negotiationResult.phoneCallScriptEnglish
                  )
                }
              >
                {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color="#FFFFFF" />}
                <Text style={styles.copyBtnText}>{copied ? 'Copied Talking Points!' : 'Copy Phone Script'}</Text>
              </Pressable>
            </>
          )}

          {activeTab === 'steps' && (
            <View style={styles.stepsList}>
              {negotiationResult.counterOfferSteps.map((step) => (
                <View key={step.step} style={styles.stepItem}>
                  <View style={styles.stepNumBadge}>
                    <Text style={styles.stepNumText}>{step.step}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepOffer}>
                      Counter Offer: ₹{step.offerRent.toLocaleString('en-IN')}/mo
                    </Text>
                    <Text style={styles.stepPointers}>{step.scriptPointers}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.xl,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  rentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rentCol: {
    alignItems: 'center',
  },
  rentLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 3,
  },
  askingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  targetText: {
    fontSize: 19,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  chipsLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  percentChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    minHeight: 44,
    justifyContent: 'center',
  },
  percentChipActive: {
    backgroundColor: V4_COLORS.primary,
  },
  percentChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  percentChipTextActive: {
    color: '#FFFFFF',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  savingsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  savingsVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  tabsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  channelTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    minHeight: 44,
  },
  tabBtnActive: {
    backgroundColor: V4_COLORS.primary,
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  langToggle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
    justifyContent: 'center',
  },
  langToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  scriptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scriptScroll: {
    maxHeight: 140,
    marginBottom: 10,
  },
  scriptText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepsList: {
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepOffer: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  stepPointers: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
});
