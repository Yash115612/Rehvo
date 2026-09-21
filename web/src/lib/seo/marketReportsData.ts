/**
 * REHVO Rental Market Research & Intelligence Engine
 * Authoritative reports for institutional landlords, individual investors, and corporate tenants
 */

export interface MarketReport {
  slug: string;
  title: string;
  subtitle: string;
  publishDate: string;
  readTime: string;
  category: 'Market Intelligence' | 'Yield Analysis' | 'Infrastructure Impact' | 'Rental Forecast';
  summary: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    change: string;
  }[];
  contentSections: {
    heading: string;
    body: string;
    highlightBox?: string;
  }[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  relatedLocalities: string[];
  keyTakeaways: string[];
}

export const MARKET_REPORTS: Record<string, MarketReport> = {
  'mumbai-rental-yield-index-2026': {
    slug: 'mumbai-rental-yield-index-2026',
    title: 'Mumbai Rental Yield & Price Index 2026: Suburbs vs Island City',
    subtitle: 'Comprehensive study of rental returns across 15 MMR micromarkets powered by Metro Line 2A, 7 & 3 connectivity.',
    publishDate: '2026-03-01',
    readTime: '6 min read',
    category: 'Yield Analysis',
    summary:
      'Mumbai’s rental market is witnessing unprecedented yields in Western Suburbs (Andheri West, Malad) reaching 4.5% gross yield, closing the gap with Bangalore and Pune, driven by Metro operationalization and corporate back-to-office mandates.',
    author: {
      name: 'Dr. Kabir Verma',
      role: 'Head of Urban Economics & Research, REHVO',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    metrics: [
      { label: 'City Avg Gross Yield', value: '4.2%', trend: 'up', change: '+35 bps YoY' },
      { label: 'Avg 2BHK Western Suburbs', value: '₹64,500/mo', trend: 'up', change: '+12.4% YoY' },
      { label: 'Metro Proximity Premium', value: '+18.5%', trend: 'up', change: 'Within 500m' },
      { label: 'Average Days on Market', value: '11 Days', trend: 'down', change: '-4 Days YoY' },
    ],
    contentSections: [
      {
        heading: '1. The Metro Multiplier Effect',
        body:
          'The simultaneous operation of Metro Line 2A (Dahisar to Andheri West D.N. Nagar) and Metro Line 7 (Dahisar East to Gundavali) has fundamentally altered tenant commuting patterns. Rental units located within 500 meters of a metro station command an 18.5% premium over comparable inventory just 1.5 km away. Tenant preferences have pivoted decisively towards public transit connectivity over highway vehicular access.',
        highlightBox:
          'Key Finding: Over 74% of corporate professionals renting in Western Mumbai now state direct Metro access as their non-negotiable requirement.',
      },
      {
        heading: '2. High-Yield Micromarkets: Thane and Powai Lead',
        body:
          'While South Mumbai (Lower Parel, Worli) delivers ultra-luxury yields of 2.8% to 3.2%, suburban clusters like Powai and Thane West generate 4.4% to 4.7% gross rental yields. The combination of established IT parks, lakefront amenities, and international schools makes Powai the premier cashflow asset class in MMR.',
      },
      {
        heading: '3. Zero Commission & Digital Lease Revolution',
        body:
          'Historically, the friction of 1 to 2 months commission fees constrained tenant mobility. With REHVO’s direct Index-II verified owner onboarding and instant digital lease agreements, vacancy periods have shrunk from 35 days to under 12 days across verified inventory.',
      },
    ],
    tableData: {
      headers: ['Locality', 'Avg 2BHK Rent', 'Gross Yield', 'YoY Growth', 'Metro Status'],
      rows: [
        ['Andheri West', '₹68,000', '4.3%', '+14.2%', 'Active (Line 1 & 2A)'],
        ['Powai', '₹62,000', '4.6%', '+11.8%', 'Upcoming (Line 6)'],
        ['Bandra West', '₹1,25,000', '3.1%', '+9.5%', 'Active (Western Rail / Sealink)'],
        ['Lower Parel', '₹1,10,000', '3.4%', '+8.7%', 'Active (Monorail / Coastal Rd)'],
        ['Thane West', '₹28,000', '4.5%', '+13.0%', 'Active (Central Rail)'],
        ['Navi Mumbai (Vashi)', '₹26,000', '4.7%', '+15.1%', 'Active (Atal Setu / Harbour)'],
      ],
    },
    relatedLocalities: ['andheri-west', 'powai', 'bandra-west', 'lower-parel', 'thane'],
    keyTakeaways: [
      'Suburban 2 BHK properties near active Metro lines offer highest risk-adjusted yield in MMR.',
      'Furnished and semi-furnished units rent 3x faster than unfurnished properties.',
      'Digital tenant verification reduces average vacancy down to 11 days.',
    ],
  },
  'bangalore-vs-mumbai-rental-comparison': {
    slug: 'bangalore-vs-mumbai-rental-comparison',
    title: 'Bangalore vs Mumbai: 2026 Cost of Renting & Quality of Life Index',
    subtitle: 'Where do tech founders and remote professionals get the highest value per square foot?',
    publishDate: '2026-03-05',
    readTime: '7 min read',
    category: 'Market Intelligence',
    summary:
      'A granular side-by-side analysis comparing rents, security deposits, metro coverage, commute times, and living space across Mumbai and Bangalore tech corridors.',
    author: {
      name: 'Ananya Sharma',
      role: 'Principal Real Estate Analyst, REHVO',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    metrics: [
      { label: 'Deposit Multiple Mumbai', value: '2 - 3 Months', trend: 'neutral', change: 'Standard' },
      { label: 'Deposit Multiple Blr', value: '5 - 8 Months', trend: 'down', change: 'REHVO Zero-Dep option' },
      { label: 'Avg SqFt Rent Powai', value: '₹95/sqft', trend: 'up', change: '+8% YoY' },
      { label: 'Avg SqFt Rent Koramangala', value: '₹58/sqft', trend: 'up', change: '+14% YoY' },
    ],
    contentSections: [
      {
        heading: '1. Space vs Transit Tradeoff',
        body:
          'A ₹40,000/month budget in Bangalore secures an expansive 1,250 sqft 2 BHK in Whitefield or HSR Layout. In Mumbai, the same budget secures a cozy 600 sqft 1 BHK or compact 2 BHK in Andheri East or Thane. However, Mumbai offers vastly superior suburban rail and metro punctuality.',
      },
      {
        heading: '2. The Security Deposit Paradox',
        body:
          'Bangalore landlords historically demand up to 10 months security deposit, locking up substantial capital for young founders and engineers. REHVO’s partnership with institutional escrow and digital security bonds is reforming this bottleneck, matching Mumbai’s 2-to-3 month deposit baseline.',
      },
    ],
    tableData: {
      headers: ['Parameter', 'Mumbai (Suburbs)', 'Bangalore (Tech Corridors)'],
      rows: [
        ['Average 2 BHK Rent', '₹55,000 - ₹75,000', '₹35,000 - ₹50,000'],
        ['Standard Deposit', '2 to 3 months', '5 to 8 months'],
        ['Average Living Area (2BHK)', '650 - 850 sqft', '1,100 - 1,400 sqft'],
        ['Public Transit Reliance', '82% (Metro / Local Train)', '44% (Metro / BMTC Bus)'],
        ['Direct Owner Ratio on REHVO', '91% Verified', '89% Verified'],
      ],
    },
    relatedLocalities: ['powai', 'andheri-west', 'koramangala', 'whitefield'],
    keyTakeaways: [
      'Bangalore delivers 40% more internal carpet area per rupee spent.',
      'Mumbai offers significantly faster reliable transit via integrated Metro and Suburban Rail.',
      'REHVO reduces high security deposit friction in Bangalore to Mumbai market standards.',
    ],
  },
};
