export interface SearchLandingProfile {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  bhkFilter?: number;
  localityFilter?: string;
  priceRange?: string;
  faqs: { question: string; answer: string }[];
}

import { RENT_LANDING_PAGES } from './rentLandingData';

export { RENT_LANDING_PAGES };

export const SEARCH_LANDING_PAGES: Record<string, SearchLandingProfile> = {
  ...RENT_LANDING_PAGES,
  '2-bhk-for-rent-in-mumbai': {
    slug: '2-bhk-for-rent-in-mumbai',
    title: '2 BHK Flats for Rent in Mumbai',
    metaTitle: '2 BHK Flats for Rent in Mumbai | Verified Direct Owners | Zero Brokerage',
    metaDescription: 'Find verified 2 BHK apartments for rent in Mumbai with zero brokerage. Direct owner listings in Andheri West, Bandra, Powai, and Goregaon with instant visit scheduling.',
    heading: '2 BHK Apartments for Rent in Mumbai',
    subheading: 'Most preferred configuration for nuclear families and working professionals across Western and Central Mumbai.',
    bhkFilter: 2,
    priceRange: '₹45,000 - ₹85,000/mo',
    faqs: [
      {
        question: 'What is the average rent of a 2 BHK in Mumbai?',
        answer: 'Average rents for 2 BHK flats in western suburbs range between ₹45,000 to ₹75,000/month, while Bandra and Worli command ₹95,000 to ₹1,60,000/month.',
      },
      {
        question: 'Do 2 BHK rentals on REHVO have zero brokerage?',
        answer: 'Yes, all listings on REHVO are direct from verified homeowners, saving renters the traditional 1-month brokerage fee.',
      },
    ],
  },
  '1-bhk-for-rent-in-mumbai': {
    slug: '1-bhk-for-rent-in-mumbai',
    title: '1 BHK Flats for Rent in Mumbai',
    metaTitle: '1 BHK Flats for Rent in Mumbai | Verified Direct Owners | Zero Brokerage',
    metaDescription: 'Affordable and verified 1 BHK flats for rent in Mumbai. Direct owner contacts, low security deposit, and instant visit bookings in Andheri, Powai, Malad, and Thane.',
    heading: '1 BHK Flats for Rent in Mumbai',
    subheading: 'Ideal compact homes for single professionals, couples, and startup founders near Mumbai metro corridors.',
    bhkFilter: 1,
    priceRange: '₹22,000 - ₹45,000/mo',
    faqs: [
      {
        question: 'Where can I find affordable 1 BHK flats in Mumbai?',
        answer: 'Areas like Malad West, Kandivali, Powai outskirts, and Thane West offer excellent 1 BHKs between ₹20,000 and ₹35,000/month.',
      },
    ],
  },
  '3-bhk-in-bandra': {
    slug: '3-bhk-in-bandra',
    title: '3 BHK Apartments in Bandra West',
    metaTitle: '3 BHK Luxury Apartments for Rent in Bandra West, Mumbai | REHVO',
    metaDescription: 'Discover verified luxury 3 BHK apartments for rent in Bandra West, Mumbai. Sea views on Carter Road, Pali Hill serenity, and premium amenities with verified title deeds.',
    heading: 'Luxury 3 BHK Homes in Bandra West',
    subheading: 'Expansive sea-view residences and heritage-quarter penthouses in Mumbai’s most prestigious residential suburb.',
    bhkFilter: 3,
    localityFilter: 'Bandra West',
    priceRange: '₹1,50,000 - ₹3,50,000/mo',
    faqs: [
      {
        question: 'What amenities come with 3 BHK flats in Bandra West?',
        answer: 'Premium towers in Pali Hill and Carter Road feature dedicated multi-car parking, 24/7 security, high-speed elevators, and sea-view balconies.',
      },
    ],
  },
  'affordable-flats-in-powai': {
    slug: 'affordable-flats-in-powai',
    title: 'Affordable Flats for Rent in Powai',
    metaTitle: 'Affordable Flats for Rent in Powai, Mumbai | Verified Direct Owners',
    metaDescription: 'Rent budget-friendly verified 1 & 2 BHK flats in Powai near Hiranandani, IIT Bombay, and tech parks. Save 100% on brokerage fees with REHVO.',
    heading: 'Affordable Flats in Powai, Mumbai',
    subheading: 'Lakeside tech living near Hiranandani Business Park and JVLR with zero broker charges.',
    localityFilter: 'Powai',
    priceRange: '₹28,000 - ₹55,000/mo',
    faqs: [
      {
        question: 'Is Powai suitable for tech professionals and students?',
        answer: 'Yes, Powai is Mumbai’s primary startup corridor with walk-to-work convenience for offices in Kensington and Supreme Business Park.',
      },
    ],
  },
  'gated-societies-in-andheri-west': {
    slug: 'gated-societies-in-andheri-west',
    title: 'Flats in Gated Societies in Andheri West',
    metaTitle: 'Flats for Rent in Gated Societies in Andheri West | REHVO',
    metaDescription: 'Verified 1, 2, 3 BHK apartments in premier gated societies in Andheri West like Lokhandwala Complex, Green Acres, and RNA Mirage with full security and clubhouses.',
    heading: 'Gated Societies in Andheri West',
    subheading: 'Secure residential complexes with biometric access, swimming pools, children’s play areas, and 24/7 power backup.',
    localityFilter: 'Andheri West',
    priceRange: '₹42,000 - ₹1,10,000/mo',
    faqs: [
      {
        question: 'What are the top gated complexes in Andheri West?',
        answer: 'Top societies include Green Acres, Oberoi Springs, RNA Mirage, and Lokhandwala Complex enclaves.',
      },
    ],
  },
  'luxury-apartments-in-worli': {
    slug: 'luxury-apartments-in-worli',
    title: 'Sea-Facing Luxury Apartments in Worli',
    metaTitle: 'Luxury Sea-Facing Flats for Rent in Worli, South Mumbai | REHVO',
    metaDescription: 'Rent iconic luxury apartments in Worli Sea Face and South Mumbai’s Golden Mile. Full Arabian Sea views, private pools, and Bandra-Worli Sea Link access.',
    heading: 'Luxury Apartments in Worli, Mumbai',
    subheading: 'Iconic skyscrapers along the Arabian Sea with world-class clubhouse amenities and concierge services.',
    localityFilter: 'Worli',
    priceRange: '₹1,20,000 - ₹4,00,000/mo',
    faqs: [
      {
        question: 'How is connectivity from Worli to South Mumbai and BKC?',
        answer: 'Bandra-Worli Sea Link connects to BKC in 15 minutes, while Coastal Road provides instantaneous access to Marine Drive.',
      },
    ],
  },
  'flats-near-metro-station-in-mumbai': {
    slug: 'flats-near-metro-station-in-mumbai',
    title: 'Flats for Rent Near Metro Stations in Mumbai',
    metaTitle: 'Flats for Rent Near Metro Stations in Mumbai (Within 500m) | REHVO',
    metaDescription: 'Find verified 1, 2, 3 BHK flats within walking distance of Mumbai Metro Lines 1, 2A, 3 & 7. Save hours on your daily commute with zero brokerage.',
    heading: 'Flats for Rent Near Mumbai Metro Stations',
    subheading: 'Verified rental homes within 5 to 10 minutes walk from Line 1, 2A, 3, and 7 stations across Western and Central Mumbai.',
    priceRange: '₹25,000 - ₹95,000/mo',
    faqs: [
      {
        question: 'Which Mumbai localities have the best metro connectivity?',
        answer: 'Andheri West (Lines 1 & 2A interchange), Andheri East (Lines 1 & 3), Goregaon West (Line 2A), and BKC (Line 3 Aqua Line) offer premier metro access.',
      },
      {
        question: 'Are flats near metro stations more expensive?',
        answer: 'Flats within 500 meters of a metro station typically command a 5-10% rental premium due to significant fuel and commute time savings.',
      },
    ],
  },
  'pet-friendly-apartments-in-mumbai': {
    slug: 'pet-friendly-apartments-in-mumbai',
    title: 'Pet-Friendly Apartments for Rent in Mumbai',
    metaTitle: 'Pet-Friendly Apartments & Flats for Rent in Mumbai | REHVO',
    metaDescription: 'Discover verified pet-friendly societies and apartments for rent in Mumbai. Rent with dogs, cats, and pets without RWA restrictions or hidden broker fees.',
    heading: 'Pet-Friendly Apartments for Rent in Mumbai',
    subheading: 'Societies with pet-welcoming management committees, open walking gardens, and veterinary clinic access.',
    priceRange: '₹30,000 - ₹1,20,000/mo',
    faqs: [
      {
        question: 'Can housing societies in Mumbai legally ban pets?',
        answer: 'Under the Animal Welfare Board of India guidelines and Supreme Court directives, no society RWA can ban pets. REHVO pre-confirms pet friendliness directly with homeowners.',
      },
      {
        question: 'What are top pet-friendly areas in Mumbai?',
        answer: 'Bandra West (Carter Road promenade), Powai (Hiranandani walking parks), and Juhu offer pet-friendly cafes and parks.',
      },
    ],
  },
  'luxury-apartments-for-rent-in-mumbai': {
    slug: 'luxury-apartments-for-rent-in-mumbai',
    title: 'Luxury Apartments & Penthouses for Rent in Mumbai',
    metaTitle: 'Luxury Apartments, Penthouses & Sea-Facing Flats in Mumbai | REHVO',
    metaDescription: 'Browse ultra-luxury 3, 4 & 5 BHK apartments, duplexes, and penthouses in South Mumbai, Bandra, and Worli with infinity pools and concierge services.',
    heading: 'Luxury Apartments & Penthouses in Mumbai',
    subheading: 'Prestigious gated communities and sea-facing towers with private elevator lobbies, clubhouses, and verified deeds.',
    priceRange: '₹1,50,000 - ₹5,00,000/mo',
    faqs: [
      {
        question: 'What security standards do luxury rentals on REHVO meet?',
        answer: 'Every luxury property undergoes Index-II title verification, electricity bill verification, and features multi-tier biometric gate security.',
      },
    ],
  },
  'budget-flats-under-25k-in-mumbai': {
    slug: 'budget-flats-under-25k-in-mumbai',
    title: 'Budget Flats for Rent Under ₹25,000 in Mumbai',
    metaTitle: 'Budget Flats for Rent Under ₹25,000 in Mumbai | Zero Brokerage | REHVO',
    metaDescription: 'Verified affordable 1 RK, 1 BHK, and studio flats for rent under ₹25k in Mumbai and suburbs. Zero brokerage and low security deposit direct from owners.',
    heading: 'Budget Flats Under ₹25,000 in Mumbai',
    subheading: 'Clean, verified homes in Malad, Kandivali, Dahisar, Thane, and Navi Mumbai with direct transport to corporate parks.',
    priceRange: '₹14,000 - ₹25,000/mo',
    faqs: [
      {
        question: 'Where can I find flats under ₹25,000 in Mumbai?',
        answer: 'Kandivali West, Malad West, Borivali, Thane West, and Navi Mumbai offer quality 1 BHK flats and spacious 1 RKs under ₹25,000.',
      },
    ],
  },
  'gated-family-apartments-in-mumbai': {
    slug: 'gated-family-apartments-in-mumbai',
    title: 'Gated Family Apartments for Rent in Mumbai',
    metaTitle: 'Gated Societies & Family Apartments for Rent in Mumbai | REHVO',
    metaDescription: 'Safe, gated community apartments for rent in Mumbai with children’s play zones, swimming pools, 24/7 security, and power backup. 100% verified owners.',
    heading: 'Family-Friendly Gated Communities in Mumbai',
    subheading: 'Spacious 2 & 3 BHK homes in integrated townships near leading international schools and multispeciality hospitals.',
    priceRange: '₹38,000 - ₹1,40,000/mo',
    faqs: [
      {
        question: 'What makes a society family-friendly?',
        answer: 'Pedestrian-only podiums, CCTV security, kids playgrounds, preschools within the complex, and active resident associations.',
      },
    ],
  },
  'fully-furnished-flats-in-mumbai': {
    slug: 'fully-furnished-flats-in-mumbai',
    title: 'Fully Furnished Flats for Rent in Mumbai',
    metaTitle: 'Fully Furnished Flats & Apartments for Rent in Mumbai | REHVO',
    metaDescription: 'Move-in ready fully furnished 1, 2, 3 BHK flats in Mumbai with modular kitchen, AC, refrigerator, washing machine, and high-speed Wi-Fi.',
    heading: 'Fully Furnished Move-In Ready Flats in Mumbai',
    subheading: 'Pack your bags and move in immediately with zero hassle. Fully equipped modular kitchens, furniture, and electronics.',
    priceRange: '₹35,000 - ₹1,50,000/mo',
    faqs: [
      {
        question: 'What is included in a fully furnished flat on REHVO?',
        answer: 'Living room sofas, beds with mattresses, wardrobes, air conditioners, refrigerator, washing machine, television, and microwave oven.',
      },
    ],
  },
  'zero-deposit-flats-in-mumbai': {
    slug: 'zero-deposit-flats-in-mumbai',
    title: 'Zero Deposit & Low Deposit Flats in Mumbai',
    metaTitle: 'Zero Deposit & Low Security Deposit Flats in Mumbai | REHVO',
    metaDescription: 'Rent verified flats in Mumbai with Zero Deposit or just 1 month security deposit. Eliminate heavy upfront landlord deposits with REHVO verified guarantees.',
    heading: 'Zero Deposit & Low Deposit Homes in Mumbai',
    subheading: 'Say goodbye to 6-10 months upfront security deposits. Move into your dream home with low or zero security deposit programs.',
    priceRange: '₹22,000 - ₹90,000/mo',
    faqs: [
      {
        question: 'How do Zero Deposit homes work on REHVO?',
        answer: 'Through verified background checks, REHVO replaces massive cash deposits with low monthly insurance guarantees, protecting both tenant and owner.',
      },
    ],
  },
};
