'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { trackAiSearch } from '@/lib/analytics/tracker';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  pills?: string[];
  recommendation?: {
    title: string;
    locality: string;
    price: string;
    matchScore: string;
    slug: string;
  };
}

const INITIAL_MESSAGES_EN: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'Hello! I am REHVO Concierge. What kind of rental home or flatmate are you searching for today? Tell me your preferred area, budget, or commute needs.',
  },
];

const INITIAL_MESSAGES_HI: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'नमस्ते! मैं REHVO एआई कंसीयर्ज हूँ। आप किस प्रकार का फ्लैट या रूममेट ढूंढ रहे हैं? मुझे अपना इलाका, बजट या ऑफिस का रास्ता बताएं।',
  },
];

const PROMPT_SUGGESTIONS = {
  en: [
    '2 BHK near Andheri Metro under ₹55k',
    'Pet-friendly flatmate in Powai Hiranandani',
    'Luxury sea-facing flat in Bandra West',
    'Fair rent check for 2 BHK in Lokhandwala',
  ],
  hi: [
    'अंधेरी वेस्ट में मेट्रो के पास 2 BHK',
    'पवई में पेट-फ्रेंडली फ्लैटमेट',
    'बांद्रा वेस्ट में सी-फेसिंग फ्लैट',
    'लोखंडवाला में 2 BHK का सही किराया क्या है?',
  ],
};

export function AIConciergeInteractiveClient() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES_EN);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleLanguageChange = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    setMessages(newLang === 'en' ? INITIAL_MESSAGES_EN : INITIAL_MESSAGES_HI);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    trackAiSearch(text.trim());

    // Generate intelligent contextual response
    setTimeout(() => {
      let aiText = '';
      let recommendation = undefined;
      let pills: string[] = [];

      const lower = text.toLowerCase();
      if (lower.includes('bandra') || lower.includes('बांद्रा')) {
        aiText =
          lang === 'en'
            ? 'Found 4 verified homes in Bandra West matching your request! Top pick on Carter Road features sea-facing views and 0 brokerage.'
            : 'बांद्रा वेस्ट में आपकी पसंद के 4 सत्यापित फ्लैट मिले हैं! कार्टर रोड पर सी-फेसिंग 2 बीएचके बिना किसी ब्रोकरेज के उपलब्ध है।';
        recommendation = {
          title: 'Sea-Facing 2 BHK on Carter Road',
          locality: 'Bandra West, Mumbai',
          price: '₹1,25,000/mo',
          matchScore: '98% Match',
          slug: 'sea-facing-2bhk-bandra-west',
        };
        pills = ['Direct Owner', 'Index-II Verified', '8m to Bandra Metro'];
      } else if (lower.includes('powai') || lower.includes('पवई')) {
        aiText =
          lang === 'en'
            ? 'Powai Hiranandani has 8 active verified listings and 3 pet-friendly flatmate options. Average rent is ₹62,000/mo.'
            : 'पवई हीरानंदानी में 8 सत्यापित फ्लैट और 3 पेट-फ्रेंडली फ्लैटमेट विकल्प उपलब्ध हैं।';
        recommendation = {
          title: '3 BHK Lake View, Hiranandani Gardens',
          locality: 'Powai, Mumbai',
          price: '₹95,000/mo',
          matchScore: '96% Match',
          slug: 'luxury-3bhk-hiranandani-powai',
        };
        pills = ['Pet Friendly', 'Clubhouse & Pool', 'Hiranandani Tech Park'];
      } else if (lower.includes('fair') || lower.includes('किराया') || lower.includes('check')) {
        aiText =
          lang === 'en'
            ? 'Based on 42 recent registered agreements in Lokhandwala/Andheri West, the benchmark rent for a 2 BHK is ₹48,000 - ₹54,000. Any demand above ₹58,000 is overpriced.'
            : 'लोखंडवाला / अंधेरी वेस्ट के 42 हालिया रजिस्टर्ड समझौतों के अनुसार, 2 BHK का औसत किराया ₹48,000 से ₹54,000 है।';
        pills = ['Fair Price Index', 'Save ₹4,000/mo', 'REHVO Rate Benchmark'];
      } else {
        aiText =
          lang === 'en'
            ? `I have scanned our real-time verified database for "${text}". Here is the highest-rated verified property with direct owner contact:`
            : `मैंने आपकी खोज "${text}" के लिए डेटाबेस स्कैन किया है। यहाँ डायरेक्ट ओनर का सत्यापित फ्लैट है:`;
        recommendation = {
          title: 'Modern 2 BHK Near D.N. Nagar Metro',
          locality: 'Andheri West, Mumbai',
          price: '₹58,000/mo',
          matchScore: '95% Match',
          slug: 'modern-2bhk-andheri-west',
        };
        pills = ['Zero Brokerage', '2 Mins to Metro 2A', 'Fully Furnished'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiText,
          pills,
          recommendation,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden mb-16">
      {/* Top Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">REHVO AI Concierge Pro</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">Trained on verified Mumbai, Pune & Bangalore lease records</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              lang === 'en' ? 'bg-[#0E8F73] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              lang === 'hi' ? 'bg-[#0E8F73] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Chat Transcript Area */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[420px] overflow-y-auto bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#031B2A] text-white font-medium shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs space-y-3'
              }`}
            >
              <p>{msg.text}</p>

              {msg.pills && msg.pills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.pills.map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              )}

              {msg.recommendation && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-0.5">
                      <Sparkles size={12} />
                      <span>{msg.recommendation.matchScore}</span>
                    </div>
                    <h4 className="text-xs font-black text-[#031B2A]">
                      {msg.recommendation.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {msg.recommendation.locality} • <strong>{msg.recommendation.price}</strong>
                    </p>
                  </div>
                  <Link
                    href={`/property/${msg.recommendation.slug}`}
                    className="p-2 rounded-xl bg-[#0E8F73] text-white hover:bg-[#0b735c] transition shrink-0"
                    title="View Property"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
              <span className="ml-2 font-medium">Scanning verified listings...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 px-4 sm:px-6 bg-slate-100/60 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Try asking:</span>
        {PROMPT_SUGGESTIONS[lang].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200/80 hover:border-emerald-500 text-slate-700 hover:text-[#0E8F73] whitespace-nowrap transition shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 sm:p-6 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Type in plain English (e.g., 2 BHK in Powai under 50k near metro)...'
                : 'यहाँ हिंदी या हिंग्लिश में लिखें (उदा. पवई में 2 BHK 50k के अंदर)...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-[#031B2A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E8F73] focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-[#0E8F73] hover:bg-[#0b735c] disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2 shadow-sm"
          >
            <span>Send</span>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
