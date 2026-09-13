/**
 * REHVO Local SEO Data Engine
 * Authoritative city and locality intelligence for programmatic SEO landing pages
 */

export interface LocalityProfile {
  slug: string;
  name: string;
  city: string;
  citySlug: string;
  tagline: string;
  description: string;
  avgRent1BHK: number;
  avgRent2BHK: number;
  avgRent3BHK: number;
  avgRentPG: number;
  avgRentFlatmate: number;
  rentalYield: string;
  metroLines: string[];
  topSchools: string[];
  topHospitals: string[];
  lifestyleHubs: string[];
  faqs: { question: string; answer: string }[];
  coordinates: { lat: number; lng: number };
  popularPincodes: string[];
}

export interface CityProfile {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  avgRent1BHK: number;
  avgRent2BHK: number;
  avgRent3BHK: number;
  topLocalities: string[];
  faqs: { question: string; answer: string }[];
  coordinates: { lat: number; lng: number };
}

export const CITIES_DATA: Record<string, CityProfile> = {
  mumbai: {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'India’s Financial Capital — Verified Direct Owner Rentals',
    description:
      'Explore verified rental apartments, co-living flatmates, and PGs in Mumbai without brokerage. From sea-facing luxury flats in Bandra to tech-hub apartments in Powai and Andheri West, REHVO provides 100% deed-verified listings.',
    avgRent1BHK: 38000,
    avgRent2BHK: 62000,
    avgRent3BHK: 115000,
    topLocalities: [
      'andheri-west',
      'bandra-west',
      'powai',
      'andheri-east',
      'bkc',
      'worli',
      'juhu',
      'lower-parel',
      'thane',
      'navi-mumbai',
    ],
    faqs: [
      {
        question: 'What is the average rent for a 2 BHK apartment in Mumbai?',
        answer:
          'The average monthly rent for a 2 BHK in Mumbai ranges from ₹45,000 to ₹75,000 in prime western suburbs like Andheri West and Goregaon, and ₹95,000 to ₹1,60,000+ in upscale corridors like Bandra West and Worli.',
      },
      {
        question: 'How does REHVO eliminate broker fees in Mumbai?',
        answer:
          'REHVO directly onboards verified property owners through automated Index-II title deed validation, allowing renters to chat directly with landlords and schedule physical walkthroughs without paying typical 1-month brokerage fees.',
      },
      {
        question: 'Which areas in Mumbai are best for working professionals?',
        answer:
          'Top rental hubs for professionals include Andheri West and East (near Metro Lines 1, 2A & 7), Powai (near Hiranandani tech parks), Bandra Kurla Complex (BKC), and Lower Parel.',
      },
    ],
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
  pune: {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    tagline: 'The Oxford of the East & Premier IT Rental Hub',
    description:
      'Find verified flats and student PGs in Pune across Hinjewadi, Kharadi, Viman Nagar, Kothrud, and Baner with instant owner chats and zero brokerage.',
    avgRent1BHK: 18000,
    avgRent2BHK: 28000,
    avgRent3BHK: 48000,
    topLocalities: ['hinjewadi', 'kharadi', 'viman-nagar', 'baner', 'kothrud'],
    faqs: [
      {
        question: 'What is the average rent for a 2 BHK in Pune IT hubs?',
        answer:
          'In Hinjewadi Phase 1-3 and Kharadi EON Free Zone, a gated 2 BHK averages between ₹24,000 and ₹34,000 per month.',
      },
    ],
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
  bangalore: {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    tagline: 'Silicon Valley of India — Verified Homes & Tech Co-Living',
    description:
      'Rent verified tech-enabled homes, flatmates, and luxury apartments in Bangalore across Koramangala, Indiranagar, HSR Layout, Whitefield, and Bellandur.',
    avgRent1BHK: 22000,
    avgRent2BHK: 36000,
    avgRent3BHK: 65000,
    topLocalities: ['koramangala', 'hsr-layout', 'indiranagar', 'whitefield', 'bellandur'],
    faqs: [
      {
        question: 'What is the typical security deposit in Bangalore?',
        answer:
          'Traditionally Bangalore landlords ask 5-10 months deposit, but on REHVO verified listings feature low-deposit or Zero-Deposit guarantees.',
      },
    ],
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  delhi: {
    slug: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    tagline: 'National Capital Region — Verified Apartments & Student PGs',
    description:
      'Rent verified flats in South Delhi, Gurgaon Cyber City, Noida Sector 62, and Dwarka with direct owner contact and instant visit confirmations.',
    avgRent1BHK: 20000,
    avgRent2BHK: 35000,
    avgRent3BHK: 60000,
    topLocalities: ['gurgaon-cyber-city', 'south-delhi', 'noida-sector-62', 'dwarka'],
    faqs: [
      {
        question: 'How do I rent safely in Delhi NCR without middlemen?',
        answer:
          'Use REHVO to access government electricity-bill verified owners and GPS-tracked physical visit bookings.',
      },
    ],
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  hyderabad: {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Cyberabad Tech Corridor — High-Growth Rental Living',
    description:
      'Discover verified gated community rentals and modern PGs in Gachibowli, Hitec City, Madhapur, and Kondapur with zero brokerage.',
    avgRent1BHK: 18000,
    avgRent2BHK: 30000,
    avgRent3BHK: 52000,
    topLocalities: ['gachibowli', 'hitec-city', 'madhapur', 'kondapur'],
    faqs: [
      {
        question: 'What are the top gated communities for rent in Gachibowli?',
        answer:
          'Communities near Financial District and Hitec City offer premium 2 & 3 BHKs with swimming pools and clubhouses between ₹32,000 and ₹55,000/month.',
      },
    ],
    coordinates: { lat: 17.385, lng: 78.4867 },
  },
};

export const LOCALITIES_DATA: Record<string, LocalityProfile> = {
  'andheri-west': {
    slug: 'andheri-west',
    name: 'Andheri West',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Mumbai’s Vibrant Entertainment & Commercial Rental Epicenter',
    description:
      'Andheri West is one of Mumbai’s most sought-after rental destinations. Connected by Metro Line 1 (Versova-Ghatkopar) and Metro Line 2A (Dahisar-DN Nagar), it is home to top production studios, Lokhandwala Complex, Infinity Mall, and premier residential societies.',
    avgRent1BHK: 42000,
    avgRent2BHK: 65000,
    avgRent3BHK: 110000,
    avgRentPG: 16000,
    avgRentFlatmate: 22000,
    rentalYield: '3.8%',
    metroLines: ['Metro Line 1 (Versova - Ghatkopar)', 'Metro Line 2A (DN Nagar - Dahisar)'],
    topSchools: ['St. Mary’s High School', 'Ryan International School', 'Bhavan’s College'],
    topHospitals: ['Kokilaben Dhirubhai Ambani Hospital', 'CritCare Asia Hospital'],
    lifestyleHubs: ['Lokhandwala Market', 'Infinity Mall Andheri', 'Versova Beach & Cafes'],
    faqs: [
      {
        question: 'What is the average rent in Lokhandwala Complex, Andheri West?',
        answer:
          '1 BHK flats in Lokhandwala range from ₹38,000 to ₹48,000, while 2 BHK apartments in gated societies like Green Acres or RNA Mirage range between ₹65,000 and ₹85,000 per month.',
      },
      {
        question: 'Is Andheri West safe for female renters and flatmates?',
        answer:
          'Yes, Andheri West is renowned for high safety, well-lit pedestrian corridors, 24/7 society gate security, and vibrant nightlife in Lokhandwala and Versova.',
      },
      {
        question: 'What metro stations are in Andheri West?',
        answer:
          'Key stations include Versova, DN Nagar, Azad Nagar, and Andheri West on Lines 1 and 2A, providing seamless connectivity to both Western and Eastern suburbs.',
      },
    ],
    coordinates: { lat: 19.1363, lng: 72.8277 },
    popularPincodes: ['400053', '400058', '400061'],
  },
  'bandra-west': {
    slug: 'bandra-west',
    name: 'Bandra West',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'The Queen of Suburbs — Luxury Sea-Facing Living & Heritage Vibe',
    description:
      'Bandra West offers Mumbai’s most coveted residential postal codes. Featuring Pali Hill, Carter Road, Bandstand, and Hill Road, it combines Portuguese-era heritage cottages with ultra-luxury multi-storey sea-view towers.',
    avgRent1BHK: 68000,
    avgRent2BHK: 125000,
    avgRent3BHK: 240000,
    avgRentPG: 25000,
    avgRentFlatmate: 38000,
    rentalYield: '2.9%',
    metroLines: ['Bandra Railway Station (Western & Harbour)', 'Coastal Road Connection'],
    topSchools: ['St. Stanislaus High School', 'St. Anne’s High School', 'National College'],
    topHospitals: ['Lilavati Hospital & Research Centre', 'Holy Family Hospital'],
    lifestyleHubs: ['Carter Road Promenade', 'Bandstand', 'Linking Road', 'Pali Village Cafes'],
    faqs: [
      {
        question: 'Why are rental prices higher in Bandra West?',
        answer:
          'Bandra West commands premium rents due to its central coastal location, immediate proximity to BKC financial district via Bandra-Worli Sea Link, and vibrant cultural dining scene.',
      },
      {
        question: 'Can I find flatmates in Bandra West without paying brokerage?',
        answer:
          'Yes, REHVO VibeMatch pairs verified roommates and flatmate seekers directly with leaseholders in Bandra West without broker fees.',
      },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    popularPincodes: ['400050'],
  },
  powai: {
    slug: 'powai',
    name: 'Powai',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Tech Hub & Lakeside Living — Hiranandani Master-Planned Township',
    description:
      'Powai is Mumbai’s primary technology and startup powerhouse, anchored by IIT Bombay and Hiranandani Gardens. It features neo-classical towers, wide landscaped avenues, international schools, and lakeside promenades.',
    avgRent1BHK: 36000,
    avgRent2BHK: 58000,
    avgRent3BHK: 95000,
    avgRentPG: 15000,
    avgRentFlatmate: 20000,
    rentalYield: '4.1%',
    metroLines: ['Metro Line 6 (Swami Samarth Nagar - Vikhroli underway)', 'Kanjurmarg Station (Central)'],
    topSchools: ['Hiranandani Foundation School', 'Bombay Scottish School Powai', 'IIT Bombay'],
    topHospitals: ['Dr L H Hiranandani Hospital'],
    lifestyleHubs: ['Powai Lake Promenade', 'Galleria Shopping Mall', 'Hiranandani High Street'],
    faqs: [
      {
        question: 'Why do IT and startup employees prefer renting in Powai?',
        answer:
          'Powai offers walk-to-work convenience for offices in Hiranandani Business Park, Supreme Business Park, and Kensington, alongside European-style township amenities.',
      },
    ],
    coordinates: { lat: 19.1176, lng: 72.906 },
    popularPincodes: ['400076'],
  },
  'andheri-east': {
    slug: 'andheri-east',
    name: 'Andheri East',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Corporate Powerhouse, Airport Gateway & Multi-Line Metro Hub',
    description:
      'Andheri East is one of India’s busiest commercial and logistical hubs, home to MIDC, SEEPZ, and Chhatrapati Shivaji Maharaj International Airport (T2). It offers exceptional connectivity via Western Express Highway and Metro Lines 1 & 7.',
    avgRent1BHK: 32000,
    avgRent2BHK: 52000,
    avgRent3BHK: 82000,
    avgRentPG: 14000,
    avgRentFlatmate: 18000,
    rentalYield: '4.2%',
    metroLines: ['Metro Line 1 (Ghatkopar - Versova)', 'Metro Line 7 (Andheri East - Dahisar East)'],
    topSchools: ['Divine Child High School', 'Holy Family High School', 'Tolani College'],
    topHospitals: ['SevenHills Hospital', 'Holy Spirit Hospital'],
    lifestyleHubs: ['Solitaire Corporate Park', 'Sakinaka Junction', 'Chakala High Street'],
    faqs: [
      {
        question: 'How is connectivity from Andheri East to South Mumbai and BKC?',
        answer:
          'Western Express Highway provides direct 20-minute road access to BKC, while Metro Lines 1 and 7 link directly to the suburban rail lines.',
      },
    ],
    coordinates: { lat: 19.1136, lng: 72.8697 },
    popularPincodes: ['400069', '400093', '400096'],
  },
  bkc: {
    slug: 'bkc',
    name: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'India’s Financial Power Center — Elite Corporate Living',
    description:
      'BKC is the premier Central Business District of India, hosting headquarters of global investment banks, NSE, SEBI, US Consulate, and Jio World Centre. Premium residential enclaves in BKC and adjacent Kalanagar offer unmatched corporate luxury.',
    avgRent1BHK: 55000,
    avgRent2BHK: 95000,
    avgRent3BHK: 180000,
    avgRentPG: 22000,
    avgRentFlatmate: 32000,
    rentalYield: '3.6%',
    metroLines: ['Metro Line 3 (Aqua Line Underground)', 'Bandra East Railway Station'],
    topSchools: ['Dhirubhai Ambani International School', 'American School of Bombay'],
    topHospitals: ['Asian Heart Institute', 'Guru Nanak Hospital'],
    lifestyleHubs: ['Jio World Drive', 'Maker Maxity', 'Bandra Kurla Dine Corridor'],
    faqs: [
      {
        question: 'What are the benefits of renting near BKC?',
        answer:
          'Zero commute time for finance and consulting professionals, luxury high-rise amenities, and direct access to Mumbai Metro Line 3.',
      },
    ],
    coordinates: { lat: 19.0688, lng: 72.8687 },
    popularPincodes: ['400051'],
  },
  worli: {
    slug: 'worli',
    name: 'Worli',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'South Mumbai’s Golden Mile — Skyscraper Sea-Front Living',
    description:
      'Worli represents the peak of modern Mumbai real estate with iconic luxury skyscrapers, Bandra-Worli Sea Link access, and the upcoming coastal freeway connection.',
    avgRent1BHK: 70000,
    avgRent2BHK: 130000,
    avgRent3BHK: 260000,
    avgRentPG: 28000,
    avgRentFlatmate: 42000,
    rentalYield: '2.8%',
    metroLines: ['Metro Line 3 (Aqua Line Worli Station)', 'Bandra-Worli Sea Link'],
    topSchools: ['Podar International School', 'Sacred Heart High School'],
    topHospitals: ['Wockhardt Hospitals', 'Jaslok Hospital (nearby)'],
    lifestyleHubs: ['Worli Sea Face Promenade', 'Atria Mall', 'The St. Regis Mumbai'],
    faqs: [
      {
        question: 'What amenities do luxury buildings in Worli provide?',
        answer:
          'Full clubhouse concierge, Olympic-size infinity pools overlooking the Arabian Sea, private cinema halls, and high-speed elevators with biometric access.',
      },
    ],
    coordinates: { lat: 19.0178, lng: 72.8178 },
    popularPincodes: ['400018', '400030'],
  },
  juhu: {
    slug: 'juhu',
    name: 'Juhu',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Celebrity Enclave, Juhu Beach & Serene Coastal Mansions',
    description:
      'Juhu is celebrated for its iconic beach, celebrity bungalows, gourmet dining, and relaxed coastal ambiance bordered by Santacruz and Vile Parle.',
    avgRent1BHK: 58000,
    avgRent2BHK: 95000,
    avgRent3BHK: 175000,
    avgRentPG: 22000,
    avgRentFlatmate: 32000,
    rentalYield: '3.0%',
    metroLines: ['Metro Line 2A (D.N. Nagar Station)', 'Vile Parle Railway Station'],
    topSchools: ['Maneckji Cooper Education Trust', 'Jamnabai Narsee School'],
    topHospitals: ['Nanavati Max Super Speciality Hospital', 'Arogya Nidhi Hospital'],
    lifestyleHubs: ['Juhu Beach', 'Prithvi Theatre', 'JW Marriott Juhu', 'Juhu Tara Road Boutiques'],
    faqs: [
      {
        question: 'Are there student-friendly rentals near Juhu colleges?',
        answer:
          'Yes, students attending NMIMS, Mithibai, and DJ Sanghvi find verified PGs and 1-2 BHK flats in Vile Parle West and Juhu Gulmohar Road on REHVO.',
      },
    ],
    coordinates: { lat: 19.1075, lng: 72.8263 },
    popularPincodes: ['400049'],
  },
  'lower-parel': {
    slug: 'lower-parel',
    name: 'Lower Parel',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Mill District Transformation — High Street Phoenix & Corporate Hub',
    description:
      'Lower Parel has evolved from historic cotton mills into Mumbai’s luxury retail and nightlife capital, featuring High Street Phoenix, Palladium Mall, and marquee office towers.',
    avgRent1BHK: 52000,
    avgRent2BHK: 90000,
    avgRent3BHK: 165000,
    avgRentPG: 20000,
    avgRentFlatmate: 30000,
    rentalYield: '3.4%',
    metroLines: ['Monorail Lower Parel Station', 'Western & Central Suburban Lines (Currey Road & Lower Parel)'],
    topSchools: ['Holy Cross High School', 'Shindewadi High School'],
    topHospitals: ['Global Hospitals Parel', 'KEM Hospital'],
    lifestyleHubs: ['High Street Phoenix', 'Palladium Mall', 'Kamala Mills Compound', 'Todi Mill'],
    faqs: [
      {
        question: 'What is it like living near Kamala Mills in Lower Parel?',
        answer:
          'Living in Lower Parel provides immediate access to hundreds of gourmet restaurants, rooftop cocktail lounges, craft breweries, and Grade-A office towers.',
      },
    ],
    coordinates: { lat: 18.9953, lng: 72.831 },
    popularPincodes: ['400013'],
  },
  thane: {
    slug: 'thane',
    name: 'Thane West',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'City of Lakes — Modern Integrated Townships & Value Rentals',
    description:
      'Thane West offers expansive integrated master-planned townships (Hiranandani Estate, Lodha Amara, Rustomjee Urbania) surrounded by Yeoor Hills, offering double the square footage for your rental rupee.',
    avgRent1BHK: 18000,
    avgRent2BHK: 28000,
    avgRent3BHK: 46000,
    avgRentPG: 9000,
    avgRentFlatmate: 12000,
    rentalYield: '4.4%',
    metroLines: ['Metro Line 4 (Wadala - Kasarvadavali under construction)', 'Thane Central Railway Junction'],
    topSchools: ['Smt. Sunitidevi Singhania School', 'Billabong High International School'],
    topHospitals: ['Jupiter Hospital', 'Bethany Hospital'],
    lifestyleHubs: ['Viviana Mall', 'Korum Mall', 'Upvan Lake', 'Yeoor Hills Nature Reserve'],
    faqs: [
      {
        question: 'Why choose Thane West over central Mumbai for family rentals?',
        answer:
          'Thane West provides significantly larger apartment sizes, dedicated children’s parks, cleaner air quality around Yeoor Hills, and top-tier retail at Viviana Mall at almost half Mumbai rental prices.',
      },
    ],
    coordinates: { lat: 19.2183, lng: 72.9781 },
    popularPincodes: ['400601', '400607', '400610'],
  },
  'navi-mumbai': {
    slug: 'navi-mumbai',
    name: 'Navi Mumbai',
    city: 'Mumbai',
    citySlug: 'mumbai',
    tagline: 'Planned Smart City — Vashi, Belapur & Kharghar Coastal Living',
    description:
      'Navi Mumbai is a CIDCO-planned smart city with wide grid boulevards, upcoming Navi Mumbai International Airport (NMIA), Atal Setu (MTHL) sea bridge connection, and lush open gardens in Vashi, Seawoods, and Kharghar.',
    avgRent1BHK: 16000,
    avgRent2BHK: 26000,
    avgRent3BHK: 42000,
    avgRentPG: 8500,
    avgRentFlatmate: 11000,
    rentalYield: '4.6%',
    metroLines: ['Navi Mumbai Metro Line 1 (Belapur to Pendhar)', 'Harbour Railway Line (Vashi / Seawoods)'],
    topSchools: ['Delhi Public School Nerul', 'Apeejay School Kharghar'],
    topHospitals: ['Apollo Hospitals Navi Mumbai', 'Fortis Hiranandani Hospital Vashi'],
    lifestyleHubs: ['Seawoods Grand Central Mall', 'Inorbit Mall Vashi', 'Central Park Kharghar'],
    faqs: [
      {
        question: 'How fast is the commute from Navi Mumbai to South Mumbai with Atal Setu?',
        answer:
          'With the Mumbai Trans Harbour Link (Atal Setu), travel time from Ulwe and Nhava Sheva to Sewri/Worli in South Mumbai is just 20 minutes.',
      },
    ],
    coordinates: { lat: 19.033, lng: 73.0297 },
    popularPincodes: ['400703', '400705', '400706'],
  },
  hinjewadi: {
    slug: 'hinjewadi',
    name: 'Hinjewadi',
    city: 'Pune',
    citySlug: 'pune',
    tagline: 'Pune’s Tech Epicenter — Phase 1, 2 & 3 IT Park Living',
    description:
      'Hinjewadi is Pune’s premier IT township, home to Rajiv Gandhi Infotech Park. Featuring integrated gated communities like Megapolis and Blue Ridge with walk-to-work convenience.',
    avgRent1BHK: 16000,
    avgRent2BHK: 24000,
    avgRent3BHK: 34000,
    avgRentPG: 7500,
    avgRentFlatmate: 9500,
    rentalYield: '5.2%',
    metroLines: ['Pune Metro Line 3 (Hinjewadi to Shivajinagar)'],
    topSchools: ['Mercedes-Benz International School', 'Blue Ridge Public School'],
    topHospitals: ['Ruby Hall Clinic Hinjewadi', 'Lifepoint Multispecialty Hospital'],
    lifestyleHubs: ['Grand Highstreet Mall', 'Xion Mall', 'Blue Ridge Golf Course'],
    faqs: [
      {
        question: 'What is the average rent for a 2 BHK in Hinjewadi Phase 1?',
        answer: 'Furnished 2 BHK flats in Hinjewadi Phase 1 range from ₹22,000 to ₹30,000 depending on society amenities and power backup.',
      },
    ],
    coordinates: { lat: 18.5913, lng: 73.7389 },
    popularPincodes: ['411057'],
  },
  koramangala: {
    slug: 'koramangala',
    name: 'Koramangala',
    city: 'Bangalore',
    citySlug: 'bangalore',
    tagline: 'Start-Up Capital & Gourmet Hub of Bangalore',
    description:
      'Koramangala is Bangalore’s bustling cosmopolitan epicenter, boasting tree-lined avenues, hundreds of third-wave cafes, co-working incubators, and luxury independent builder floors.',
    avgRent1BHK: 26000,
    avgRent2BHK: 42000,
    avgRent3BHK: 75000,
    avgRentPG: 11000,
    avgRentFlatmate: 16000,
    rentalYield: '4.1%',
    metroLines: ['Green / Yellow Line Interchange (Rashtreeya Vidyalaya / Silk Board nearby)'],
    topSchools: ['Bethany High School', 'St. John’s High School'],
    topHospitals: ['St. John’s Medical College Hospital', 'Apollo Spectra Hospital'],
    lifestyleHubs: ['Forum South Bangalore Mall', '100 Feet Road Cafes', 'Koramangala Club'],
    faqs: [
      {
        question: 'Why do founders and tech professionals prefer Koramangala?',
        answer: 'Unmatched networking density, walkable craft eateries, central access to Indiranagar and HSR Layout, and premium independent residences.',
      },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    popularPincodes: ['560034', '560095'],
  },
  whitefield: {
    slug: 'whitefield',
    name: 'Whitefield',
    city: 'Bangalore',
    citySlug: 'bangalore',
    tagline: 'Global IT Corridor — Metro-Connected High-Rise Living',
    description:
      'Whitefield hosts International Tech Park Bangalore (ITPB) and luxury gated townships (Prestige Shantiniketan, Godrej Air) with direct Namma Metro Purple Line connectivity to Central Bangalore.',
    avgRent1BHK: 22000,
    avgRent2BHK: 36000,
    avgRent3BHK: 58000,
    avgRentPG: 9500,
    avgRentFlatmate: 13000,
    rentalYield: '4.8%',
    metroLines: ['Namma Metro Purple Line (Whitefield Kadugodi to Challaghatta)'],
    topSchools: ['The Deens Academy', 'Vydehi School of Excellence'],
    topHospitals: ['Manipal Hospital Whitefield', 'Vydehi Hospital'],
    lifestyleHubs: ['Phoenix Marketcity', 'VR Bengaluru', 'Nexus Shantiniketan'],
    faqs: [
      {
        question: 'How has the Purple Line Metro impacted Whitefield rentals?',
        answer: 'The direct metro link to MG Road and Indiranagar has made Whitefield high-rises one of the most in-demand rental sectors in India.',
      },
    ],
    coordinates: { lat: 12.9698, lng: 77.75 },
    popularPincodes: ['560066'],
  },
  'gurgaon-cyber-city': {
    slug: 'gurgaon-cyber-city',
    name: 'Gurgaon Cyber City',
    city: 'Delhi NCR',
    citySlug: 'delhi',
    tagline: 'Fortune 500 Corporate Hub — DLF Cyber City & Golf Course Road',
    description:
      'Gurgaon Cyber City & Golf Course Road represent the peak of corporate luxury living in North India, with rapid metro access, premier condominiums, and CyberHub dining.',
    avgRent1BHK: 28000,
    avgRent2BHK: 48000,
    avgRent3BHK: 85000,
    avgRentPG: 13000,
    avgRentFlatmate: 18000,
    rentalYield: '4.2%',
    metroLines: ['Gurgaon Rapid Metro (Cyber City Loop)', 'Delhi Metro Yellow Line (Sikanderpur interchange)'],
    topSchools: ['The Shri Ram School Moulsari', 'Heritage Xperiential Learning School'],
    topHospitals: ['Fortis Memorial Research Institute', 'Medanta The Medicity'],
    lifestyleHubs: ['DLF CyberHub', 'Horizon Plaza', 'Ambience Mall Gurgaon'],
    faqs: [
      {
        question: 'What are the best luxury residential towers near DLF Cyber City?',
        answer: 'DLF Phase 2, Belvedre Towers, DLF The Crest, and luxury builder floors around Sikanderpur and Golf Course Road.',
      },
    ],
    coordinates: { lat: 28.4952, lng: 77.0895 },
    popularPincodes: ['122002', '122008'],
  },
  gachibowli: {
    slug: 'gachibowli',
    name: 'Gachibowli',
    city: 'Hyderabad',
    citySlug: 'hyderabad',
    tagline: 'Financial District & Tech Hub of Hyderabad',
    description:
      'Gachibowli is Hyderabad’s world-class tech corridor bordering Financial District, with high-rise gated communities (My Home Bhooja, Aparna Serene Park), lush greenery, and the Outer Ring Road (ORR).',
    avgRent1BHK: 19000,
    avgRent2BHK: 32000,
    avgRent3BHK: 56000,
    avgRentPG: 8500,
    avgRentFlatmate: 12500,
    rentalYield: '5.0%',
    metroLines: ['Hyderabad Metro Blue Line (Raidurg terminal nearby)', 'Upcoming Airport Express Metro'],
    topSchools: ['CHIREC International School', 'Oakridge International School'],
    topHospitals: ['Continental Hospitals Financial District', 'Care Hospitals Gachibowli'],
    lifestyleHubs: ['Inorbit Mall Cyberabad', 'Sarath City Capital Mall', 'Botanical Gardens'],
    faqs: [
      {
        question: 'What is the commute time from Gachibowli to Hyderabad Airport?',
        answer: 'Via the Outer Ring Road (ORR), Rajiv Gandhi International Airport (RGIA) Shamshabad is only 25 to 30 minutes away.',
      },
    ],
    coordinates: { lat: 17.4401, lng: 78.3489 },
    popularPincodes: ['500032', '500081'],
  },
};

