export interface Airport {
  code: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  isInternational?: boolean;
}

export interface Aircraft {
  id: string;
  name: string;
  model: string;
  tagline: string;
  category: 'Ultra-Long Range' | 'Heavy Jet' | 'Super-Midsize' | 'Midsize Jet';
  hourlyRateUSD: number;
  speedKnots: number;
  rangeNm: number;
  maxAltitudeFt: number;
  passengers: number;
  baggageCapacityCuFt: number;
  cabinHeightFt: number;
  cabinLengthFt: number;
  liveryColor: string;
  accentColor: string;
  highlights: string[];
  specs: {
    engine: string;
    avionics: string;
    wifi: string;
    bedroomOrBerth: string;
  };
  description: string;
  floorPlanLayout: string;
}

export type FlightType = 'one-way' | 'round-trip' | 'multi-leg';

export interface BookingRequest {
  flightType: FlightType;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  selectedAircraftId: string;
  cateringTier: 'Executive Standard' | 'Signature Gourmet' | 'Royal Bespoke';
  groundTransport: boolean;
  helicopterTransfer: boolean;
  securityDetail: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}

export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD
  aircraftId: string;
  status: 'available' | 'booked' | 'maintenance' | 'reserved';
  currentLocation: string; // Airport code
  nextAvailableTime?: string;
}

export interface EmptyLeg {
  id: string;
  aircraftId: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  originalPriceUSD: number;
  discountedPriceUSD: number;
  seatsRemaining: number;
}

export interface ConciergeRequest {
  clientName: string;
  organization?: string;
  email: string;
  phone: string;
  preferredAircraftType: string;
  itineraryType: string;
  dates: string;
  cateringPreferences: string[];
  groundLogistics: string[];
  specialRequests: string;
  securityEscortNeeded: boolean;
  confidentialityProtocol: boolean;
}
