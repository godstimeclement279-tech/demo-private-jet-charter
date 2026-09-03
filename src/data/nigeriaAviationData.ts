import { Airport, Aircraft, EmptyLeg, AvailabilitySlot } from '../types/aviation';

export const NIGERIAN_AIRPORTS: Airport[] = [
  {
    code: 'LOS',
    icao: 'DNMM',
    name: 'Murtala Muhammed International (ExecuJet / Quits FBO)',
    city: 'Lagos',
    country: 'Nigeria',
    lat: 6.5774,
    lng: 3.3212,
    isInternational: true
  },
  {
    code: 'ABV',
    icao: 'DNAA',
    name: 'Nnamdi Azikiwe International (Presidential & VIP Wing)',
    city: 'Abuja',
    country: 'Nigeria',
    lat: 9.0068,
    lng: 7.2632,
    isInternational: true
  },
  {
    code: 'PHC',
    icao: 'DNPO',
    name: 'Port Harcourt International (VIP Terminal)',
    city: 'Port Harcourt',
    country: 'Nigeria',
    lat: 5.0155,
    lng: 6.9496,
    isInternational: true
  },
  {
    code: 'KAN',
    icao: 'DNKN',
    name: 'Mallam Aminu Kano International',
    city: 'Kano',
    country: 'Nigeria',
    lat: 12.0476,
    lng: 8.5247,
    isInternational: true
  },
  {
    code: 'ENU',
    icao: 'DNEN',
    name: 'Akanu Ibiam International',
    city: 'Enugu',
    country: 'Nigeria',
    lat: 6.4743,
    lng: 7.5620,
    isInternational: false
  },
  {
    code: 'ABB',
    icao: 'DNAS',
    name: 'Asaba International Airport',
    city: 'Asaba / Onitsha',
    country: 'Nigeria',
    lat: 6.2044,
    lng: 6.6611,
    isInternational: false
  },
  {
    code: 'IBD',
    icao: 'DNIB',
    name: 'Ibadan Airport (Alakia VIP Charter)',
    city: 'Ibadan',
    country: 'Nigeria',
    lat: 7.3625,
    lng: 3.9783,
    isInternational: false
  },
  {
    code: 'BNI',
    icao: 'DNBE',
    name: 'Benin Airport',
    city: 'Benin City',
    country: 'Nigeria',
    lat: 6.3170,
    lng: 5.5997,
    isInternational: false
  },
  {
    code: 'LHR',
    icao: 'EGLF',
    name: 'London Farnborough / Luton VIP Signature',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.2758,
    lng: -0.7763,
    isInternational: true
  },
  {
    code: 'DXB',
    icao: 'DWC',
    name: 'Dubai Al Maktoum VIP Jetex Terminal',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 24.8960,
    lng: 55.1614,
    isInternational: true
  },
  {
    code: 'ACC',
    icao: 'DGAA',
    name: 'Kotoka International (VIP Lounge)',
    city: 'Accra',
    country: 'Ghana',
    lat: 5.6052,
    lng: -0.1668,
    isInternational: true
  },
  {
    code: 'CDG',
    icao: 'LFPB',
    name: 'Paris Le Bourget Business Aviation',
    city: 'Paris',
    country: 'France',
    lat: 48.9694,
    lng: 2.4414,
    isInternational: true
  }
];

export const FLEET_DATA: Aircraft[] = [
  {
    id: 'global-7500',
    name: 'Bombardier Global 7500',
    model: 'Global 7500 Flagship',
    tagline: 'The Ultimate Non-Stop Sovereign Jet',
    category: 'Ultra-Long Range',
    hourlyRateUSD: 13500,
    speedKnots: 516,
    rangeNm: 7700,
    maxAltitudeFt: 51000,
    passengers: 16,
    baggageCapacityCuFt: 195,
    cabinHeightFt: 6.2,
    cabinLengthFt: 54.4,
    liveryColor: '#161922',
    accentColor: '#d4af37',
    highlights: [
      'Non-stop Lagos to London, New York or Dubai',
      'Dedicated Master Suite with permanent double bed & private en-suite shower',
      'Nuage ergonomic deep-recline seating and ultra-high-definition theatre zone',
      'Ka-band high speed unlimited satellite connectivity'
    ],
    specs: {
      engine: 'Twin GE Passport Turbofans (18,920 lbf each)',
      avionics: 'Bombardier Vision Flight Deck & Synthetic Vision',
      wifi: 'High-speed Ka-Band Global Satellite System',
      bedroomOrBerth: 'Private Master Stateroom with Double Bed'
    },
    description: 'The pinnacle of private aviation in West Africa. Four true living spaces, an industry-first full kitchen suite, and the smoothest ride in business aviation over high-altitude Atlantic winds.',
    floorPlanLayout: 'Forward Galley & Crew Rest • Club Suite • Conference Dining • Entertainment Zone • Private Master Suite with En-suite Shower'
  },
  {
    id: 'gulfstream-g650er',
    name: 'Gulfstream G650ER',
    model: 'G650 Extended Range',
    tagline: 'Speed, Prestige & Transcontinental Range',
    category: 'Ultra-Long Range',
    hourlyRateUSD: 12800,
    speedKnots: 530,
    rangeNm: 7500,
    maxAltitudeFt: 51000,
    passengers: 14,
    baggageCapacityCuFt: 195,
    cabinHeightFt: 6.3,
    cabinLengthFt: 46.8,
    liveryColor: '#0d131d',
    accentColor: '#e5c07b',
    highlights: [
      'Fastest civil aircraft capable of Mach 0.925',
      'Lowest cabin altitude in aviation (3,000 ft at FL450) reducing fatigue',
      '16 iconic oversized panoramic oval windows',
      'Convection and microwave oven gourmet kitchen bar'
    ],
    specs: {
      engine: 'Rolls-Royce BR725 A1-12 Engines',
      avionics: 'PlaneView II Integrated Flight Deck',
      wifi: 'Dual-Channel Jet ConneX Ka-Band Satellite',
      bedroomOrBerth: 'Aft Stateroom with Berthable Divan'
    },
    description: 'Preferred by heads of state and top multinational chairpersons in Nigeria. Effortlessly links Lagos (LOS) directly to Tokyo, Beijing, or Los Angeles with zero refuelling stops.',
    floorPlanLayout: 'Forward Galley • 4-Place Executive Club • 4-Place Conference Dining • Private Aft Stateroom & Lavatory'
  },
  {
    id: 'falcon-8x',
    name: 'Dassault Falcon 8X',
    model: 'Falcon 8X Tri-Jet',
    tagline: 'Quiet Elegance & Runway Versatility',
    category: 'Heavy Jet',
    hourlyRateUSD: 9800,
    speedKnots: 490,
    rangeNm: 6450,
    maxAltitudeFt: 51000,
    passengers: 12,
    baggageCapacityCuFt: 140,
    cabinHeightFt: 6.2,
    cabinLengthFt: 42.7,
    liveryColor: '#111726',
    accentColor: '#d69e2e',
    highlights: [
      'Tri-jet configuration providing extra safety over open ocean and Sahara',
      'Exceptional short-runway capability to land at restricted regional airfields',
      'The quietest cabin in business aviation (under 49 dBA)',
      'Digital Flight Control System derived from Rafale fighter jets'
    ],
    specs: {
      engine: 'Three Pratt & Whitney Canada PW307D',
      avionics: 'EASy III Flight Deck with FalconEye HUD',
      wifi: 'Inmarsat SwiftBroadband & High-speed 4G Air-to-Ground',
      bedroomOrBerth: 'Forward Crew Rest or Aft Bed Conversion'
    },
    description: 'A masterpiece of French aeronautical engineering. Can access short airstrips across oil & gas hubs in the Niger Delta while flying non-stop across Europe and the Middle East.',
    floorPlanLayout: 'Forward Crew Rest & Galley • Dual Club Seating • Aft Dining Salon & Executive Workstation'
  },
  {
    id: 'praetor-600',
    name: 'Embraer Praetor 600',
    model: 'Praetor 600 Super-Midsize',
    tagline: 'Disruptive Technology & Intercontinental Reach',
    category: 'Super-Midsize',
    hourlyRateUSD: 7200,
    speedKnots: 466,
    rangeNm: 4018,
    maxAltitudeFt: 45000,
    passengers: 9,
    baggageCapacityCuFt: 155,
    cabinHeightFt: 6.0,
    cabinLengthFt: 26.8,
    liveryColor: '#131b2a',
    accentColor: '#ecc94b',
    highlights: [
      'Non-stop from Lagos to London or Abuja to Paris with full fuel',
      'Full fly-by-wire with active turbulence reduction technology',
      'Best-in-class 5,800 ft cabin altitude at 45,000 ft',
      'Stowage capacity of 155 cu ft with inflight baggage compartment access'
    ],
    specs: {
      engine: 'Honeywell HTF7500E Turbofans',
      avionics: 'Collins Aerospace Pro Line Fusion',
      wifi: 'Viasat Ka-Band High Capacity High Speed',
      bedroomOrBerth: 'Berthable Club Seats into 4 Flat Beds'
    },
    description: 'The definitive super-midsize private jet. Perfect for domestic shuttle runs between Lagos, Abuja, and Port Harcourt, as well as non-stop international hops into southern Europe.',
    floorPlanLayout: 'Forward Wet Galley • 4-Place Forward Club • Aft 2-Place Club with 3-Place Berthing Divan'
  },
  {
    id: 'challenger-650',
    name: 'Bombardier Challenger 650',
    model: 'Challenger 650 Widebody',
    tagline: 'The Executive Boardroom of the Skies',
    category: 'Heavy Jet',
    hourlyRateUSD: 8500,
    speedKnots: 470,
    rangeNm: 4000,
    maxAltitudeFt: 41000,
    passengers: 12,
    baggageCapacityCuFt: 115,
    cabinHeightFt: 6.1,
    cabinLengthFt: 28.4,
    liveryColor: '#0a0e17',
    accentColor: '#dfa640',
    highlights: [
      'Widest cabin in its class offering generous shoulder space and stand-up comfort',
      'Proven dispatch reliability of 99.9% across African operations',
      'Integrated Cabin Management System with touch controls at every seat',
      'Comprehensive in-flight entertainment and crystal sound'
    ],
    specs: {
      engine: 'Twin GE CF34-3B MTO Turbofans',
      avionics: 'Rockwell Collins Pro Line 21 Advanced',
      wifi: 'Gogo / Inmarsat Global In-flight Wi-Fi',
      bedroomOrBerth: 'Four Berthable Bed Conversions'
    },
    description: 'Renowned for its spacious widebody comfort and executive boardroom ambiance. Highly demanded by corporate leadership teams shuttling across West and Central Africa.',
    floorPlanLayout: 'Forward Executive 4-Club • Aft 4-Place Conference Dining & 4-Place Divan Lounge'
  }
];

export const EMPTY_LEGS: EmptyLeg[] = [
  {
    id: 'EL-01',
    aircraftId: 'gulfstream-g650er',
    origin: NIGERIAN_AIRPORTS[1], // ABV
    destination: NIGERIAN_AIRPORTS[0], // LOS
    departureDate: 'Tomorrow, 14:30 WAT',
    departureTime: '14:30',
    originalPriceUSD: 14500,
    discountedPriceUSD: 5800,
    seatsRemaining: 12
  },
  {
    id: 'EL-02',
    aircraftId: 'global-7500',
    origin: NIGERIAN_AIRPORTS[0], // LOS
    destination: NIGERIAN_AIRPORTS[8], // LHR (London)
    departureDate: 'Friday, 18:00 WAT',
    departureTime: '18:00',
    originalPriceUSD: 78000,
    discountedPriceUSD: 36000,
    seatsRemaining: 14
  },
  {
    id: 'EL-03',
    aircraftId: 'praetor-600',
    origin: NIGERIAN_AIRPORTS[2], // PHC
    destination: NIGERIAN_AIRPORTS[0], // LOS
    departureDate: 'Saturday, 11:00 WAT',
    departureTime: '11:00',
    originalPriceUSD: 8200,
    discountedPriceUSD: 3400,
    seatsRemaining: 8
  },
  {
    id: 'EL-04',
    aircraftId: 'falcon-8x',
    origin: NIGERIAN_AIRPORTS[1], // ABV
    destination: NIGERIAN_AIRPORTS[9], // DXB (Dubai)
    departureDate: 'Sunday, 20:30 WAT',
    departureTime: '20:30',
    originalPriceUSD: 65000,
    discountedPriceUSD: 29500,
    seatsRemaining: 10
  }
];

// Helper to calculate approximate distance in Nautical Miles
export function calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Generates availability matrix for current and upcoming days
export function generateMockAvailability(aircraftList: Aircraft[]): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();

  for (let d = 0; d < 14; d++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + d);
    const dateStr = currentDate.toISOString().split('T')[0];

    aircraftList.forEach((ac, idx) => {
      // Deterministic simulation for realistic schedule
      const hash = (d * 7 + idx * 13) % 10;
      let status: 'available' | 'booked' | 'maintenance' | 'reserved' = 'available';
      let loc = 'LOS';

      if (hash === 1 || hash === 5) {
        status = 'booked';
        loc = idx % 2 === 0 ? 'ABV' : 'LHR';
      } else if (hash === 8) {
        status = 'maintenance';
        loc = 'LOS';
      } else if (hash === 3) {
        status = 'reserved';
        loc = 'DXB';
      } else {
        status = 'available';
        loc = idx === 1 ? 'ABV' : idx === 3 ? 'PHC' : 'LOS';
      }

      slots.push({
        date: dateStr,
        aircraftId: ac.id,
        status,
        currentLocation: loc,
        nextAvailableTime: status === 'booked' ? '18:00 WAT' : 'Immediate'
      });
    });
  }

  return slots;
}

export const CATERING_OPTIONS = [
  {
    id: 'executive-classic',
    name: 'Executive Classic Board',
    description: 'Cold cuts, imported cheeses, artisan pastries, tropical Nigerian fruit platters & barista espresso.',
    priceUSD: 250
  },
  {
    id: 'gourmet-nigerian',
    name: 'Heritage Nigerian Gourmet',
    description: 'Smoked Suya canapés, saffron Jollof infused with king prawns, char-grilled Asun skewers, & plantain tartlets.',
    priceUSD: 500
  },
  {
    id: 'beluga-champagne',
    name: 'Imperial Caviar & Dom Pérignon',
    description: 'Royal Oscietra Caviar service, blinis, chilled Dom Pérignon Vintage, and handcrafted French patisserie.',
    priceUSD: 1400
  }
];

export const GROUND_SERVICES = [
  {
    id: 'armored-maybach',
    name: 'Armored Mercedes-Maybach Escort',
    description: 'B6/B7 Ballistic protection with certified security drivers directly from tarmac to destination.',
    priceUSD: 850
  },
  {
    id: 'range-rover-convoy',
    name: 'Executive Range Rover VIP Convoy',
    description: 'Lead and chase security escort with armed protocol officers for seamless movement across Lagos/Abuja.',
    priceUSD: 1200
  },
  {
    id: 'helipad-transfer',
    name: 'AgustaWestland VIP Helicopter Shuttle',
    description: 'Bypass all road traffic: Direct 8-minute air transfer from Lagos airport tarmac to Ikoyi or VI Helipads.',
    priceUSD: 2200
  }
];
