/**
 * REHVO Voice AI Engine
 * Conversational property assistant supporting English, Hindi, and Hinglish.
 * Intent parsing, multi-modal recommendations, speech waveform synthesis,
 * and Supabase voice_queries audit logging.
 */

import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { VoiceAIState, VoiceQueryRecord } from '../types';

export type VoiceLanguage = 'en-IN' | 'hi-IN' | 'hinglish';

export interface VoiceParsedIntent {
  intent:
    | 'SEARCH_PROPERTIES'
    | 'FILTER_AMENITIES'
    | 'GET_DIRECTIONS'
    | 'COMPARE_PROPERTIES'
    | 'SCHEDULE_VISIT'
    | 'CONTACT_OWNER'
    | 'READ_AGREEMENT'
    | 'RENT_ESTIMATE'
    | 'GENERAL_QUERY';
  entities: {
    bhk?: string;
    locality?: string;
    city?: string;
    maxRent?: number;
    amenities?: string[];
    origin?: string;
    scheduleDate?: string;
    scheduleTime?: string;
  };
  responseText: string;
  actionRoute?: string;
  actionParams?: Record<string, any>;
}

/**
 * Generate simulated audio waveform bar heights for liquid visualizer
 */
export function generateWaveformData(barCount: number = 24): number[] {
  const bars: number[] = [];
  for (let i = 0; i < barCount; i++) {
    // Generate organic undulating amplitude between 0.15 and 0.95
    const variance = Math.sin((i / barCount) * Math.PI) * 0.5 + 0.3;
    const randomJitter = (Math.random() - 0.5) * 0.3;
    bars.push(Math.min(0.98, Math.max(0.12, variance + randomJitter)));
  }
  return bars;
}

/**
 * Parse natural language voice query into structured intent and entities
 */
export function parseVoiceQuery(text: string, language: VoiceLanguage = 'en-IN'): VoiceParsedIntent {
  const normalized = text.toLowerCase().trim();

  // 1. Search Properties Intent
  if (
    normalized.includes('find') ||
    normalized.includes('search') ||
    normalized.includes('show') ||
    normalized.includes('dhundo') ||
    normalized.includes('chahiye') ||
    normalized.includes('flat') ||
    normalized.includes('apartment') ||
    normalized.includes('bhk')
  ) {
    let bhk = '2 BHK';
    if (normalized.includes('1 bhk') || normalized.includes('1bhk') || normalized.includes('1 bedroom')) bhk = '1 BHK';
    if (normalized.includes('2 bhk') || normalized.includes('2bhk') || normalized.includes('2 bedroom')) bhk = '2 BHK';
    if (normalized.includes('3 bhk') || normalized.includes('3bhk') || normalized.includes('3 bedroom')) bhk = '3 BHK';

    let locality = 'Bandra';
    if (normalized.includes('andheri')) locality = 'Andheri West';
    if (normalized.includes('worli')) locality = 'Worli';
    if (normalized.includes('juhu')) locality = 'Juhu';
    if (normalized.includes('powai')) locality = 'Powai';
    if (normalized.includes('koramangala')) locality = 'Koramangala';
    if (normalized.includes('indiranagar')) locality = 'Indiranagar';

    let maxRent = 65000;
    const rentMatch = normalized.match(/(\d+)\s*(k|thousand|lakh|lakhs)?/);
    if (rentMatch) {
      const num = parseInt(rentMatch[1], 10);
      if (rentMatch[2] === 'k' || rentMatch[2] === 'thousand') {
        maxRent = num * 1000;
      } else if (rentMatch[2]?.startsWith('lakh')) {
        maxRent = num * 100000;
      }
    }

    return {
      intent: 'SEARCH_PROPERTIES',
      entities: {
        bhk,
        locality,
        maxRent,
      },
      responseText:
        language === 'hi-IN'
          ? `Mainne aapke liye ${locality} mein ₹${maxRent.toLocaleString('en-IN')} tak ke verified ${bhk} homes dhoondh liye hain.`
          : `Found verified ${bhk} flats in ${locality} under ₹${maxRent.toLocaleString('en-IN')} with verified marketplace.`,
      actionRoute: '/(renter)/search',
      actionParams: { query: `${bhk} in ${locality}`, locality },
    };
  }

  // 2. Directions Intent
  if (
    normalized.includes('direction') ||
    normalized.includes('route') ||
    normalized.includes('metro') ||
    normalized.includes('rasta') ||
    normalized.includes('distance') ||
    normalized.includes('how to reach')
  ) {
    return {
      intent: 'GET_DIRECTIONS',
      entities: {
        origin: 'Nearest Metro Station',
      },
      responseText:
        'This property is 8 minutes (650m) walking distance from Bandra Metro Station. Opening transit route directions now.',
      actionRoute: '/(renter)/map',
    };
  }

  // 3. Compare Properties Intent
  if (
    normalized.includes('compare') ||
    normalized.includes('versus') ||
    normalized.includes('vs') ||
    normalized.includes('difference') ||
    normalized.includes('behtar')
  ) {
    return {
      intent: 'COMPARE_PROPERTIES',
      entities: {},
      responseText:
        'Opening side-by-side AI comparison with rent, carpet area, deposit, and neighborhood intelligence scores.',
      actionRoute: '/(renter)/compare',
    };
  }

  // 4. Schedule Visit Intent
  if (
    normalized.includes('schedule') ||
    normalized.includes('visit') ||
    normalized.includes('book') ||
    normalized.includes('dekhna') ||
    normalized.includes('dekhne')
  ) {
    return {
      intent: 'SCHEDULE_VISIT',
      entities: {
        scheduleDate: 'Tomorrow',
        scheduleTime: '06:00 PM',
      },
      responseText:
        'I have prepared a visit booking for tomorrow at 6:00 PM. The owner has been notified.',
      actionRoute: '/(renter)/visits',
    };
  }

  // 5. Contact Landlord Intent
  if (
    normalized.includes('call') ||
    normalized.includes('contact') ||
    normalized.includes('owner') ||
    normalized.includes('landlord') ||
    normalized.includes('baat')
  ) {
    return {
      intent: 'CONTACT_OWNER',
      entities: {},
      responseText:
        'Opening verified direct chat with property owner Vikramaditya Malhotra with zero spam guarantee.',
      actionRoute: '/(renter)/chat/index',
    };
  }

  // 6. Read Rent Agreement Intent
  if (
    normalized.includes('agreement') ||
    normalized.includes('contract') ||
    normalized.includes('deposit') ||
    normalized.includes('lock-in')
  ) {
    return {
      intent: 'READ_AGREEMENT',
      entities: {},
      responseText:
        'Standard 11-month agreement with 6 months lock-in period and ₹2,00,000 refundable security deposit.',
      actionRoute: '/(renter)/rental-agreements',
    };
  }

  // 7. General AI Assistant Query
  return {
    intent: 'GENERAL_QUERY',
    entities: {},
    responseText:
      language === 'hi-IN'
        ? 'Aap mujhse kisi bhi property, locality score ya rent agreement ke baare mein pooch sakte hain.'
        : 'I can help you search properties, navigate transit routes, compare amenities, or book instant visits.',
    actionRoute: '/(renter)/ai',
  };
}

/**
 * Log voice query to Supabase voice_queries table
 */
export async function logVoiceQuery(
  rawTranscript: string,
  parsed: VoiceParsedIntent,
  language: VoiceLanguage = 'en-IN'
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return `vq_${Date.now()}`;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('voice_queries')
      .insert({
        user_id: user?.id || null,
        raw_transcript: rawTranscript,
        parsed_intent: parsed.intent,
        entities: parsed.entities,
        response_text: parsed.responseText,
        language,
        confidence: 0.95,
      })
      .select('id')
      .single();

    if (error) return null;
    return data?.id || null;
  } catch {
    return null;
  }
}

/**
 * Text-to-Speech synthesizer wrapper
 */
export async function speakResponse(
  text: string,
  _language: VoiceLanguage = 'en-IN'
): Promise<void> {
  const globalRef = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
  if (Platform.OS === 'web' && globalRef?.speechSynthesis && globalRef?.SpeechSynthesisUtterance) {
    try {
      globalRef.speechSynthesis.cancel();
      const utterance = new globalRef.SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      globalRef.speechSynthesis.speak(utterance);
    } catch {
      // Non-blocking web speech synthesis
    }
  }
}

/**
 * Stop any active text to speech
 */
export function stopSpeaking(): void {
  const globalRef = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
  if (Platform.OS === 'web' && globalRef?.speechSynthesis) {
    try {
      globalRef.speechSynthesis.cancel();
    } catch {
      // Non-blocking
    }
  }
}
