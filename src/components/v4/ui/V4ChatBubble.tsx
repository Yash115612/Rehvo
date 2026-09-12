import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Linking } from 'react-native';
import {
  Check,
  CheckCheck,
  Calendar,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  CircleDollarSign,
  ArrowRight,
  IndianRupee,
  Lock,
  FileText,
  Reply,
  Download,
  Play,
  Pause,
  Mic,
  Navigation,
  Star,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  PropertyMessageMeta,
  VisitMessageMeta,
  AgreementMessageMeta,
  RentReminderMeta,
  ChatReplyTo,
} from '../../../types';
import { V4PropertyShareCard } from '../chat/V4PropertyShareCard';
import { V4VisitInviteCard } from '../chat/V4VisitInviteCard';
import { V4AgreementMessageCard } from '../chat/V4AgreementMessageCard';
import { V4RentReminderCard } from '../chat/V4RentReminderCard';
import { V4PaymentRequestCard } from '../chat/V4PaymentRequestCard';
import { V4VideoBubble } from '../chat/V4VideoBubble';

export interface V4ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  isMe: boolean;
  time: string;
  createdAt?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isStarred?: boolean;
  documentUrl?: string;
  documentName?: string;
  messageType?: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  edited_at?: string;
  metadata?: {
    property?: PropertyMessageMeta;
    visit?: VisitMessageMeta;
    agreement?: AgreementMessageMeta;
    rent_reminder?: RentReminderMeta;
    [key: string]: any;
  };
  reply_to?: ChatReplyTo;
  // Legacy Card Flags for Backwards Compatibility
  isVisitCard?: boolean;
  visitDate?: string;
  visitTime?: string;
  visitStatus?: 'requested' | 'confirmed' | 'rescheduled' | 'cancelled';
  visitLocation?: string;
  isOfferCard?: boolean;
  offerRent?: string;
  offerDeposit?: string;
  offerToken?: string;
  offerStatus?: 'pending' | 'accepted' | 'rejected';
  leaseTerm?: string;
  isFlatmateCard?: boolean;
  flatmateName?: string;
  flatmateMatchScore?: number;
  flatmateBudget?: string;
  flatmateLocation?: string;
  flatmateTags?: string[];
  isSystemNotice?: boolean;
  systemNoticeType?: 'escrow' | 'agreement' | 'verified';
  reactions?: string[] | { [emoji: string]: string[] };
}

interface V4ChatBubbleProps {
  message: V4ChatMessage;
  onReactionPress?: (msg: V4ChatMessage, emoji?: string) => void;
  onLongPress?: (msg: V4ChatMessage) => void;
  onImagePress?: (url: string) => void;
  onVisitCardPress?: (msg: V4ChatMessage) => void;
  onAcceptVisit?: (msg: V4ChatMessage) => void;
  onRescheduleVisit?: (msg: V4ChatMessage) => void;
  onDeclineVisit?: (msg: V4ChatMessage) => void;
  onOfferCardPress?: (msg: V4ChatMessage) => void;
  onFlatmateCardPress?: (msg: V4ChatMessage) => void;
  onPropertyCardPress?: (msg: V4ChatMessage) => void;
  onAgreementCardPress?: (msg: V4ChatMessage) => void;
  onRentReminderPress?: (msg: V4ChatMessage) => void;
}

export const V4ChatBubble: React.FC<V4ChatBubbleProps> = ({
  message,
  onReactionPress,
  onLongPress,
  onImagePress,
  onVisitCardPress,
  onAcceptVisit,
  onRescheduleVisit,
  onDeclineVisit,
  onOfferCardPress,
  onFlatmateCardPress,
  onPropertyCardPress,
  onAgreementCardPress,
  onRentReminderPress,
}) => {
  const {
    isMe,
    text,
    time,
    status = 'read',
    imageUrl,
    videoUrl,
    isStarred,
    documentUrl,
    documentName,
    messageType,
    metadata,
    reply_to,
    isVisitCard,
    isOfferCard,
    isFlatmateCard,
    isSystemNotice,
    reactions,
  } = message;

  // 1. System Notice (Centered Escrow / Agreement / Verification pill)
  if (isSystemNotice || messageType === 'system') {
    return (
      <View style={styles.systemNoticeWrap}>
        <View style={styles.systemNoticeCard}>
          <ShieldCheck size={13} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.systemNoticeText}>{text}</Text>
        </View>
      </View>
    );
  }

  // Parse reactions list for rendering
  const reactionEntries: { emoji: string; count: number }[] = [];
  if (Array.isArray(reactions)) {
    for (const r of reactions) {
      reactionEntries.push({ emoji: r, count: 1 });
    }
  } else if (reactions && typeof reactions === 'object') {
    for (const [emoji, userList] of Object.entries(reactions)) {
      if (Array.isArray(userList) && userList.length > 0) {
        reactionEntries.push({ emoji, count: userList.length });
      }
    }
  }

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isDeleted = Boolean(message.is_deleted || message.isDeleted);
  const isEdited = Boolean(message.is_edited || message.isEdited);

  const hasCard =
    !isDeleted && (
      Boolean(metadata?.property) ||
      Boolean(metadata?.visit) ||
      Boolean(metadata?.agreement) ||
      Boolean(metadata?.rent_reminder) ||
      Boolean(metadata?.location) ||
      Boolean(metadata?.audio) ||
      messageType === 'location' ||
      messageType === 'audio' ||
      isVisitCard ||
      isOfferCard ||
      isFlatmateCard
    );

  return (
    <View style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}>
      <Pressable
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
          hasCard && styles.bubbleCardWidth,
        ]}
        onLongPress={() => onLongPress?.(message)}
      >
        {/* REPLY PREVIEW QUOTE BANNER */}
        {!isDeleted && reply_to && (
          <View style={[styles.replyQuote, isMe && styles.replyQuoteMe]}>
            <View style={styles.replyQuoteBar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.replyQuoteAuthor, isMe && styles.replyQuoteAuthorMe]}>
                {reply_to.sender_name || 'Contact'}
              </Text>
              <Text style={[styles.replyQuoteText, isMe && styles.replyQuoteTextMe]} numberOfLines={1}>
                {reply_to.text}
              </Text>
            </View>
          </View>
        )}

        {/* PHOTO ATTACHMENT */}
        {!isDeleted && imageUrl && (
          <Pressable onPress={() => onImagePress?.(imageUrl)} style={styles.imageWrap}>
            <Image source={{ uri: imageUrl }} style={styles.chatImage} resizeMode="cover" />
          </Pressable>
        )}

        {/* VIDEO ATTACHMENT */}
        {!isDeleted && (messageType === 'video' || videoUrl || metadata?.video) && (
          <V4VideoBubble
            videoUrl={videoUrl || metadata?.video?.video_url}
            duration={metadata?.video?.duration || '0:28'}
            caption={text && text !== '📹 Video Tour' ? text : undefined}
            isMe={isMe}
          />
        )}

        {/* DOCUMENT ATTACHMENT */}
        {!isDeleted && documentUrl && (
          <Pressable
            style={[styles.documentWrap, isMe && styles.documentWrapMe]}
            onPress={() => Linking.openURL(documentUrl).catch(() => {})}
          >
            <View style={styles.documentIconBox}>
              <FileText size={18} color="#0F766E" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.documentTitle, isMe && styles.documentTitleMe]} numberOfLines={1}>
                {documentName || 'Document Attachment.pdf'}
              </Text>
              <Text style={[styles.documentSub, isMe && styles.documentSubMe]}>Tap to open / download</Text>
            </View>
            <Download size={14} color={isMe ? '#99F6E4' : '#0F766E'} />
          </Pressable>
        )}

        {/* LOCATION ATTACHMENT CARD */}
        {!isDeleted && (messageType === 'location' || metadata?.location) && (
          <Pressable
            style={[styles.locationCard, isMe && styles.locationCardMe]}
            onPress={() => {
              const lat = metadata?.location?.latitude || 19.076;
              const lng = metadata?.location?.longitude || 72.8777;
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              Linking.openURL(mapUrl).catch(() => {});
            }}
          >
            <View style={styles.locationHeaderRow}>
              <View style={[styles.locationIconBox, isMe && styles.locationIconBoxMe]}>
                <MapPin size={18} color={isMe ? '#FFFFFF' : '#0F766E'} strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationTitle, isMe && styles.locationTitleMe]} numberOfLines={1}>
                  {metadata?.location?.name || text || 'Shared Society Location'}
                </Text>
                <Text style={[styles.locationSub, isMe && styles.locationSubMe]} numberOfLines={1}>
                  {metadata?.location?.address ||
                    `${(metadata?.location?.latitude || 19.076).toFixed(4)}° N, ${(metadata?.location?.longitude || 72.8777).toFixed(4)}° E`}
                </Text>
              </View>
            </View>
            <View style={[styles.locationFooterRow, isMe && styles.locationFooterRowMe]}>
              <Navigation size={12} color={isMe ? '#99F6E4' : '#0F766E'} />
              <Text style={[styles.locationFooterText, isMe && styles.locationFooterTextMe]}>
                Open in Maps & Get Directions →
              </Text>
            </View>
          </Pressable>
        )}

        {/* AUDIO / VOICE NOTE ATTACHMENT */}
        {!isDeleted && (messageType === 'audio' || metadata?.audio) && (
          <View style={[styles.audioCard, isMe && styles.audioCardMe]}>
            <Pressable
              style={[styles.audioPlayBtn, isMe && styles.audioPlayBtnMe]}
              onPress={() => setIsPlayingAudio((prev) => !prev)}
            >
              {isPlayingAudio ? (
                <Pause size={13} color={isMe ? '#0F766E' : '#FFFFFF'} fill={isMe ? '#0F766E' : '#FFFFFF'} />
              ) : (
                <Play size={13} color={isMe ? '#0F766E' : '#FFFFFF'} fill={isMe ? '#0F766E' : '#FFFFFF'} />
              )}
            </Pressable>
            <View style={styles.audioWaveformCol}>
              <View style={styles.waveformContainer}>
                {[7, 13, 20, 15, 24, 11, 18, 26, 17, 9, 22, 14, 8, 18, 23, 13, 9].map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveformBar,
                      { height: isPlayingAudio && i % 2 === 0 ? Math.min(26, h + 8) : h },
                      isMe ? styles.waveformBarMe : styles.waveformBarOther,
                      (isPlayingAudio || i < 6) && (isMe ? styles.waveformBarActiveMe : styles.waveformBarActiveOther),
                    ]}
                  />
                ))}
              </View>
              <View style={styles.audioMetaRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Mic size={10} color={isMe ? '#99F6E4' : '#0F766E'} strokeWidth={2.4} />
                  <Text style={[styles.audioDuration, isMe && styles.audioDurationMe]}>
                    {metadata?.audio?.duration || '0:14'}
                  </Text>
                </View>
                <Text style={[styles.audioBadge, isMe && styles.audioBadgeMe]}>
                  {isPlayingAudio ? 'Playing...' : 'Voice Note'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* RICH CARD 1: PROPERTY SHARE CARD */}
        {!isDeleted && metadata?.property && (
          <V4PropertyShareCard
            property={metadata.property}
            isMe={isMe}
            onPress={() => onPropertyCardPress?.(message)}
          />
        )}

        {/* RICH CARD 2: VISIT INVITATION CARD */}
        {!isDeleted && metadata?.visit && (
          <V4VisitInviteCard
            visit={metadata.visit}
            isMe={isMe}
            onAccept={() => (onAcceptVisit ? onAcceptVisit(message) : onVisitCardPress?.(message))}
            onReschedule={() => (onRescheduleVisit ? onRescheduleVisit(message) : onVisitCardPress?.(message))}
            onDecline={() => (onDeclineVisit ? onDeclineVisit(message) : onVisitCardPress?.(message))}
          />
        )}

        {/* RICH CARD 3: AGREEMENT MESSAGE CARD */}
        {!isDeleted && metadata?.agreement && (
          <V4AgreementMessageCard
            agreement={metadata.agreement}
            isMe={isMe}
            onView={() => onAgreementCardPress?.(message)}
            onDownload={() => onAgreementCardPress?.(message)}
            onSign={() => onAgreementCardPress?.(message)}
          />
        )}

        {/* RICH CARD 4: RENT REMINDER CARD */}
        {!isDeleted && metadata?.rent_reminder && (
          <V4RentReminderCard
            reminder={metadata.rent_reminder}
            isMe={isMe}
            onPayNow={() => onRentReminderPress?.(message)}
          />
        )}

        {/* RICH CARD 5: PAYMENT REQUEST CARD */}
        {!isDeleted && (metadata?.payment_request || messageType === 'payment_request') && (
          <V4PaymentRequestCard
            payment={
              metadata?.payment_request || {
                amount: metadata?.amount || 0,
                title: text || 'Security Token / Rent Payment',
                dueDate: metadata?.dueDate,
              }
            }
            isMe={isMe}
            onPayPress={() => onRentReminderPress?.(message)}
          />
        )}

        {/* LEGACY VISIT SCHEDULE CARD (Compatibility) */}
        {!isDeleted && !metadata?.visit && isVisitCard && (
          <Pressable
            style={[styles.specialCard, isMe ? styles.specialCardMe : styles.specialCardOther]}
            onPress={() => onVisitCardPress?.(message)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Calendar size={14} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isMe && styles.cardTitleMe]}>Site Visit Scheduled</Text>
                <Text style={[styles.cardSub, isMe && styles.cardSubMe]} numberOfLines={1}>
                  {message.visitLocation || 'Verified Property Visit'}
                </Text>
              </View>
              <View style={styles.statusPillConfirmed}>
                <Text style={styles.statusPillText}>Confirmed</Text>
              </View>
            </View>

            <View style={styles.visitDetailsRow}>
              <View style={styles.visitDetailChip}>
                <Clock size={11} color={isMe ? '#99F6E4' : '#0F766E'} />
                <Text style={[styles.visitDetailText, isMe && styles.visitDetailTextMe]}>
                  {message.visitDate || 'Tomorrow'}, {message.visitTime || '5:00 PM'}
                </Text>
              </View>
            </View>

            <View style={styles.cardActionBtn}>
              <Text style={styles.cardActionBtnText}>Manage Visit Details →</Text>
            </View>
          </Pressable>
        )}

        {/* LEGACY RENTAL OFFER CARD (Compatibility) */}
        {!isDeleted && isOfferCard && (
          <Pressable
            style={[styles.specialCard, isMe ? styles.specialCardMe : styles.specialCardOther]}
            onPress={() => onOfferCardPress?.(message)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
                <IndianRupee size={14} color="#D97706" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isMe && styles.cardTitleMe]}>Digital Rental Offer</Text>
                <Text style={[styles.cardSub, isMe && styles.cardSubMe]}>
                  Token: {message.offerToken || '₹10,000 (Escrow Protected)'}
                </Text>
              </View>
            </View>

            <View style={styles.offerMetricsRow}>
              <View style={styles.offerMetricCol}>
                <Text style={[styles.offerMetricLabel, isMe && styles.offerMetricLabelMe]}>Proposed Rent</Text>
                <Text style={[styles.offerMetricVal, isMe && styles.offerMetricValMe]}>
                  {message.offerRent || '₹72,000'}/mo
                </Text>
              </View>
              <View style={styles.offerMetricDivider} />
              <View style={styles.offerMetricCol}>
                <Text style={[styles.offerMetricLabel, isMe && styles.offerMetricLabelMe]}>Security Deposit</Text>
                <Text style={[styles.offerMetricVal, isMe && styles.offerMetricValMe]}>
                  {message.offerDeposit || '₹1.5 Lakh'}
                </Text>
              </View>
            </View>

            <View style={styles.cardActionBtn}>
              <Text style={styles.cardActionBtnText}>Review & Accept Lease →</Text>
            </View>
          </Pressable>
        )}

        {/* LEGACY FLATMATE MATCH CARD (Compatibility) */}
        {!isDeleted && isFlatmateCard && (
          <Pressable
            style={[styles.specialCard, isMe ? styles.specialCardMe : styles.specialCardOther]}
            onPress={() => onFlatmateCardPress?.(message)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FFE4E6' }]}>
                <Sparkles size={14} color="#E11D48" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isMe && styles.cardTitleMe]}>
                  {message.flatmateName || 'Flatmate Match'}
                </Text>
                <Text style={[styles.cardSub, isMe && styles.cardSubMe]}>
                  Budget: {message.flatmateBudget || '₹25,000/mo'}
                </Text>
              </View>
              <View style={styles.matchScorePill}>
                <Text style={styles.matchScoreText}>{message.flatmateMatchScore || 96}% Match</Text>
              </View>
            </View>

            {message.flatmateTags && message.flatmateTags.length > 0 && (
              <View style={styles.flatmateTagsRow}>
                {message.flatmateTags.slice(0, 3).map((tag, tIdx) => (
                  <View key={tIdx} style={styles.flatmateTagPill}>
                    <Text style={styles.flatmateTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        )}

        {/* MESSAGE BODY TEXT */}
        {isDeleted ? (
          <View style={styles.deletedRow}>
            <Text style={[styles.deletedMessageText, isMe ? styles.deletedMessageTextMe : styles.deletedMessageTextOther]}>
              🚫 This message was deleted
            </Text>
          </View>
        ) : text && !hasCard ? (
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {text}
          </Text>
        ) : null}

        {/* TIME & READ STATUS METRICS */}
        <View style={[styles.metaRow, isMe ? styles.metaRowMe : styles.metaRowOther]}>
          {isStarred && (
            <Star
              size={11}
              color={isMe ? '#FEF08A' : '#F59E0B'}
              fill={isMe ? '#FEF08A' : '#F59E0B'}
              style={{ marginRight: 3 }}
            />
          )}
          <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>
            {time}{isEdited && !isDeleted ? ' • edited' : ''}
          </Text>

          {isMe && (
            <View style={styles.statusBox}>
              {status === 'sending' && <Clock size={10} color="#99F6E4" />}
              {status === 'sent' && <Check size={12} color="#99F6E4" strokeWidth={2.4} />}
              {status === 'delivered' && <CheckCheck size={12} color="#99F6E4" strokeWidth={2.4} />}
              {status === 'read' && <CheckCheck size={12} color="#2DD4BF" strokeWidth={2.6} />}
            </View>
          )}
        </View>
      </Pressable>

      {/* FLOATING EMOJI REACTIONS */}
      {!isDeleted && reactionEntries.length > 0 && (
        <View style={[styles.reactionsRow, isMe ? styles.reactionsRowMe : styles.reactionsRowOther]}>
          {reactionEntries.map((r, rIdx) => (
            <Pressable
              key={rIdx}
              style={styles.reactionPill}
              onPress={() => onReactionPress?.(message, r.emoji)}
            >
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              {r.count > 1 && <Text style={styles.reactionCount}>{r.count}</Text>}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
  },
  containerMe: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderRadius: 18,
    position: 'relative',
    ...V4_SHADOWS.soft,
  },
  bubbleMe: {
    backgroundColor: '#0F766E', // Brand Teal
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF', // Crisp Clean White
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleCardWidth: {
    width: '88%',
    maxWidth: 310,
  },
  replyQuote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  replyQuoteMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  replyQuoteBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 1.5,
    marginRight: 6,
  },
  replyQuoteAuthor: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  replyQuoteAuthorMe: {
    color: '#CCFBF1',
  },
  replyQuoteText: {
    fontSize: 11,
    color: '#64748B',
  },
  replyQuoteTextMe: {
    color: '#E6FFFA',
  },
  documentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  documentWrapMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  documentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  documentTitleMe: {
    color: '#FFFFFF',
  },
  documentSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  documentSubMe: {
    color: '#CCFBF1',
  },
  locationCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  locationCardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconBoxMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  locationTitleMe: {
    color: '#FFFFFF',
  },
  locationSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  locationSubMe: {
    color: '#CCFBF1',
  },
  locationFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E6FFFA',
  },
  locationFooterRowMe: {
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  locationFooterTextMe: {
    color: '#99F6E4',
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 200,
  },
  audioCardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  audioPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayBtnMe: {
    backgroundColor: '#FFFFFF',
  },
  audioWaveformCol: {
    flex: 1,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    gap: 3,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  waveformBarMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  waveformBarOther: {
    backgroundColor: '#CBD5E1',
  },
  waveformBarActiveMe: {
    backgroundColor: '#FFFFFF',
  },
  waveformBarActiveOther: {
    backgroundColor: '#0F766E',
  },
  audioMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  audioDuration: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  audioDurationMe: {
    color: '#CCFBF1',
  },
  audioBadge: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  audioBadgeMe: {
    color: '#99F6E4',
  },
  deletedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  deletedMessageText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  deletedMessageTextMe: {
    color: '#CCFBF1',
  },
  deletedMessageTextOther: {
    color: '#94A3B8',
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  messageTextMe: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTextOther: {
    color: '#0F172A',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  metaRowMe: {
    justifyContent: 'flex-end',
  },
  metaRowOther: {
    justifyContent: 'flex-start',
  },
  timeText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  timeTextMe: {
    color: '#99F6E4',
  },
  timeTextOther: {
    color: '#94A3B8',
  },
  statusBox: {
    marginLeft: 2,
  },
  imageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    width: '100%',
    height: 170,
  },
  chatImage: {
    width: '100%',
    height: '100%',
  },
  specialCard: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
  },
  specialCardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  specialCardOther: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardTitleMe: {
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  cardSubMe: {
    color: '#CCFBF1',
  },
  statusPillConfirmed: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  visitDetailsRow: {
    marginTop: 8,
  },
  visitDetailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visitDetailText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F766E',
  },
  visitDetailTextMe: {
    color: '#99F6E4',
  },
  cardActionBtn: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  offerMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    padding: 8,
  },
  offerMetricCol: {
    flex: 1,
  },
  offerMetricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  offerMetricLabelMe: {
    color: '#CCFBF1',
  },
  offerMetricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  offerMetricValMe: {
    color: '#FFFFFF',
  },
  offerMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: 8,
  },
  matchScorePill: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchScoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
  },
  flatmateTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  flatmateTagPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flatmateTagText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  systemNoticeWrap: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 24,
  },
  systemNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  systemNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F766E',
    flexShrink: 1,
    lineHeight: 15,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: -8,
    zIndex: 10,
  },
  reactionsRowMe: {
    marginRight: 6,
  },
  reactionsRowOther: {
    marginLeft: 6,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
});
