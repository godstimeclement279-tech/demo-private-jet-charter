import React, { useState, useMemo } from 'react';
import { Plane, Calendar, Clock, MapPin, Users, ArrowRightLeft, Shield, Utensils, Car, Sparkles, Check, Info } from 'lucide-react';
import { Airport, Aircraft, FlightType, BookingRequest } from '../../types/aviation';
import { NIGERIAN_AIRPORTS, FLEET_DATA, calculateDistanceNm, CATERING_OPTIONS, GROUND_SERVICES } from '../../data/nigeriaAviationData';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import { audioService } from '../../utils/audio';

interface BookingSectionProps {
  currency: 'USD' | 'NGN';
  preselectedAircraftId?: string;
  initialOrigin?: string;
  initialDestination?: string;
  initialPassengers?: number;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  currency,
  preselectedAircraftId,
  initialOrigin = 'LOS',
  initialDestination = 'ABV',
  initialPassengers = 4,
}) => {
  const [flightType, setFlightType] = useState<FlightType>('one-way');
  const [originCode, setOriginCode] = useState(initialOrigin);
  const [destCode, setDestCode] = useState(initialDestination);
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState('11:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('16:00');
  const [passengers, setPassengers] = useState(initialPassengers);
  const [selectedAircraftId, setSelectedAircraftId] = useState(preselectedAircraftId || 'global-7500');

  // Add-on options
  const [selectedCatering, setSelectedCatering] = useState<'Executive Standard' | 'Signature Gourmet' | 'Royal Bespoke'>('Signature Gourmet');
  const [armoredTransport, setArmoredTransport] = useState(false);
  const [helicopterShuttle, setHelicopterShuttle] = useState(false);
  const [securityEscort, setSecurityEscort] = useState(false);

  // VIP Client Details
  const [clientName, setClientName] = useState('Alhaji Aliko B. / Executive Office');
  const [clientEmail, setClientEmail] = useState('charter.vip@group-investments.ng');
  const [clientPhone, setClientPhone] = useState('+234 803 892 0000');
  const [specialNotes, setSpecialNotes] = useState('Diplomatic parking access required at ExecuJet Lagos.');

  // Confirmation Modal state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Resolve active airports and aircraft
  const originAirport = useMemo(() => {
    return NIGERIAN_AIRPORTS.find((a) => a.code === originCode) || NIGERIAN_AIRPORTS[0];
  }, [originCode]);

  const destAirport = useMemo(() => {
    return NIGERIAN_AIRPORTS.find((a) => a.code === destCode) || NIGERIAN_AIRPORTS[1];
  }, [destCode]);

  const activeAircraft = useMemo(() => {
    return FLEET_DATA.find((a) => a.id === selectedAircraftId) || FLEET_DATA[0];
  }, [selectedAircraftId]);

  // Compute Nautical Distance
  const distanceNm = useMemo(() => {
    return calculateDistanceNm(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng);
  }, [originAirport, destAirport]);

  // Estimated Flight Duration
  const flightDuration = useMemo(() => {
    // Air speed + 20 mins for taxi/climb/descent
    const hours = distanceNm / activeAircraft.speedKnots + 0.35;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} mins`;
    return `${h}h ${m}m`;
  }, [distanceNm, activeAircraft]);

  // Cost calculations
  const flightHours = useMemo(() => {
    const oneWayHours = Math.max(1.0, distanceNm / activeAircraft.speedKnots + 0.35);
    return flightType === 'round-trip' ? oneWayHours * 2 : oneWayHours;
  }, [distanceNm, activeAircraft, flightType]);

  const baseFlightCostUSD = useMemo(() => {
    return Math.round(flightHours * activeAircraft.hourlyRateUSD);
  }, [flightHours, activeAircraft]);

  const cateringCostUSD = useMemo(() => {
    if (selectedCatering === 'Executive Standard') return 250 * passengers;
    if (selectedCatering === 'Signature Gourmet') return 500 * passengers;
    return 1200 * passengers;
  }, [selectedCatering, passengers]);

  const logisticsCostUSD = useMemo(() => {
    let cost = 0;
    if (armoredTransport) cost += 850;
    if (helicopterShuttle) cost += 2200;
    if (securityEscort) cost += 1200;
    return cost;
  }, [armoredTransport, helicopterShuttle, securityEscort]);

  const airportFeesUSD = useMemo(() => {
    // Handling, FBO lounge, ATC fees
    return originAirport.isInternational || destAirport.isInternational ? 3500 : 1800;
  }, [originAirport, destAirport]);

  const totalCostUSD = useMemo(() => {
    return baseFlightCostUSD + cateringCostUSD + logisticsCostUSD + airportFeesUSD;
  }, [baseFlightCostUSD, cateringCostUSD, logisticsCostUSD, airportFeesUSD]);

  const formatPrice = (usd: number) => {
    if (currency === 'NGN') {
      const ngn = usd * 1550;
      return `₦${ngn.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const handleSwapAirports = () => {
    const temp = originCode;
    setOriginCode(destCode);
    setDestCode(temp);
    audioService.playClick();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playVIPChime();
    setShowConfirmation(true);
  };

  const bookingRequestData: BookingRequest = {
    flightType,
    origin: originAirport,
    destination: destAirport,
    departureDate,
    departureTime,
    returnDate: flightType === 'round-trip' ? returnDate : undefined,
    returnTime: flightType === 'round-trip' ? returnTime : undefined,
    passengers,
    selectedAircraftId,
    cateringTier: selectedCatering,
    groundTransport: armoredTransport,
    helicopterTransfer: helicopterShuttle,
    securityDetail: securityEscort,
    contactName: clientName,
    contactEmail: clientEmail,
    contactPhone: clientPhone,
    notes: specialNotes
  };

  return (
    <section id="booking" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Plane className="w-3.5 h-3.5 text-amber-400" />
          <span>BESPOKE CHARTER CONFIGURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          INTERACTIVE FLIGHT BOOKING
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Configure departure routes, select your preferred aircraft, and customize onboard executive services with transparent instant quotations.
        </p>
      </div>

      {/* Main Booking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Flight Configuration Form */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-8 bg-[#0b101c]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
          {/* 1. Flight Type Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#121927] border border-white/10 rounded-2xl w-fit">
            {(['one-way', 'round-trip', 'multi-leg'] as FlightType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setFlightType(type);
                  audioService.playClick();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                  flightType === type
                    ? 'bg-amber-500 text-[#070b12] font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* 2. Departure & Arrival Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
            {/* Origin Airport */}
            <div className="sm:col-span-5 space-y-1.5">
              <label htmlFor="booking-origin-select" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                From (Departure Hub)
              </label>
              <select
                id="booking-origin-select"
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                {NIGERIAN_AIRPORTS.map((apt) => (
                  <option key={`b-orig-${apt.code}`} value={apt.code}>
                    {apt.city} ({apt.code}) - {apt.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-6">
              <button
                id="booking-swap-hubs-btn"
                type="button"
                onClick={handleSwapAirports}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 hover:text-white transition-all hover:rotate-180"
                title="Swap departure and arrival hubs"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Airport */}
            <div className="sm:col-span-5 space-y-1.5">
              <label htmlFor="booking-dest-select" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                To (Arrival Destination)
              </label>
              <select
                id="booking-dest-select"
                value={destCode}
                onChange={(e) => setDestCode(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                {NIGERIAN_AIRPORTS.filter((a) => a.code !== originCode).map((apt) => (
                  <option key={`b-dest-${apt.code}`} value={apt.code}>
                    {apt.city} ({apt.code}) - {apt.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Dates, Times & Passenger count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Departure Date & Time */}
            <div className="space-y-1.5">
              <label htmlFor="booking-departure-date" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Departure Date
              </label>
              <input
                id="booking-departure-date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <input
                  id="booking-departure-time"
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="bg-[#121927] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 font-mono">WAT</span>
              </div>
            </div>

            {/* Return Date & Time (if Round-trip) */}
            {flightType === 'round-trip' ? (
              <div className="space-y-1.5">
                <label htmlFor="booking-return-date" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Return Date
                </label>
                <input
                  id="booking-return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="booking-return-time"
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-[#121927] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">WAT</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium block">Flight Category</span>
                <div className="p-3 bg-[#121927] border border-white/10 rounded-xl text-xs text-slate-300">
                  <span className="text-amber-300 font-semibold block">Point-to-Point Direct</span>
                  <span className="text-[11px] text-slate-400">Immediate tarmac clearance</span>
                </div>
              </div>
            )}

            {/* Passengers */}
            <div className="space-y-1.5">
              <label htmlFor="booking-passengers-input" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Passenger Manifest
              </label>
              <div className="flex items-center bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2">
                <input
                  id="booking-passengers-input"
                  type="number"
                  min={1}
                  max={activeAircraft.passengers}
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, Math.min(activeAircraft.passengers, parseInt(e.target.value) || 1)))}
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                  / max {activeAircraft.passengers}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Includes private stateroom access</p>
            </div>
          </div>

          {/* 4. Select Aircraft from Fleet */}
          <div className="space-y-3">
            <label htmlFor="booking-aircraft-select" className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-amber-400" />
                Preferred Jet Selection
              </span>
              <span className="text-[11px] text-amber-300">Synchronized with 3D Canvas</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FLEET_DATA.slice(0, 3).map((ac) => (
                <div
                  key={ac.id}
                  onClick={() => {
                    setSelectedAircraftId(ac.id);
                    audioService.playClick();
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    selectedAircraftId === ac.id
                      ? 'bg-[#141d30] border-amber-400 text-white shadow-lg'
                      : 'bg-[#101726]/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">{ac.category}</span>
                  <h4 className="text-sm font-display font-bold text-white mt-0.5">{ac.name}</h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-slate-300">{ac.passengers} Seats</span>
                    <span className="text-amber-300 font-mono font-semibold">{formatPrice(ac.hourlyRateUSD)}/hr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Inflight Catering Tier Selection */}
          <div className="space-y-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              VIP Inflight Culinary Service
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Executive Standard', desc: 'Charcuterie, tropical fruit & fine pastries' },
                { name: 'Signature Gourmet', desc: 'Smoked Suya, gourmet Nigerian Jollof & vintage wine' },
                { name: 'Royal Bespoke', desc: 'Oscietra Caviar service & Dom Pérignon champagne' }
              ].map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => {
                    setSelectedCatering(cat.name as any);
                    audioService.playClick();
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    selectedCatering === cat.name
                      ? 'bg-[#141d30] border-amber-400 text-white'
                      : 'bg-[#101726]/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{cat.name}</span>
                    {selectedCatering === cat.name && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Luxury Ground & Security Logistics Add-ons */}
          <div className="space-y-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              VIP Ground & Air Transfers (Nigeria Only)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label htmlFor="booking-armored-transport" className="flex items-start gap-3 p-3.5 bg-[#101726]/60 border border-white/10 rounded-2xl cursor-pointer hover:border-white/20">
                <input
                  id="booking-armored-transport"
                  type="checkbox"
                  checked={armoredTransport}
                  onChange={(e) => setArmoredTransport(e.target.checked)}
                  className="mt-1 rounded bg-[#121927] border-white/20 text-amber-500 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-medium text-white block">Armored Maybach</span>
                  <span className="text-[11px] text-slate-400">B6/B7 Tarmac escort (+{formatPrice(850)})</span>
                </div>
              </label>

              <label htmlFor="booking-helicopter-shuttle" className="flex items-start gap-3 p-3.5 bg-[#101726]/60 border border-white/10 rounded-2xl cursor-pointer hover:border-white/20">
                <input
                  id="booking-helicopter-shuttle"
                  type="checkbox"
                  checked={helicopterShuttle}
                  onChange={(e) => setHelicopterShuttle(e.target.checked)}
                  className="mt-1 rounded bg-[#121927] border-white/20 text-amber-500 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-medium text-white block">Helicopter Transfer</span>
                  <span className="text-[11px] text-slate-400">Direct to Ikoyi/VI Helipad (+{formatPrice(2200)})</span>
                </div>
              </label>

              <label htmlFor="booking-security-escort" className="flex items-start gap-3 p-3.5 bg-[#101726]/60 border border-white/10 rounded-2xl cursor-pointer hover:border-white/20">
                <input
                  id="booking-security-escort"
                  type="checkbox"
                  checked={securityEscort}
                  onChange={(e) => setSecurityEscort(e.target.checked)}
                  className="mt-1 rounded bg-[#121927] border-white/20 text-amber-500 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-medium text-white block">Armed Security Escort</span>
                  <span className="text-[11px] text-slate-400">Convoy & Close Protection (+{formatPrice(1200)})</span>
                </div>
              </label>
            </div>
          </div>

          {/* 7. Client Contact & Manifest preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="space-y-1.5">
              <label htmlFor="booking-client-name" className="text-xs text-slate-400 font-medium">Principal / Contact Name</label>
              <input
                id="booking-client-name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="booking-client-email" className="text-xs text-slate-400 font-medium">VIP Direct Email</label>
              <input
                id="booking-client-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="booking-client-phone" className="text-xs text-slate-400 font-medium">Direct Telephone / WhatsApp</label>
              <input
                id="booking-client-phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div>
            <button
              id="booking-submit-manifest-btn"
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#070b12] text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/20 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate VIP Charter Manifest & Boarding Pass</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Instant demo booking confirmation • No credit card or payment transaction required
            </p>
          </div>
        </form>

        {/* Right Column: Real-Time Flight Calculation Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b101c]/95 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display font-bold text-white text-lg">FLIGHT QUOTATION</h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                LIVE CALCULATION
              </span>
            </div>

            {/* Route Summary */}
            <div className="p-4 bg-[#121927] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-display font-bold text-white">{originAirport.code}</span>
                  <p className="text-xs text-slate-400">{originAirport.city}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-3">
                  <span className="text-[10px] font-mono text-amber-300">{flightDuration}</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <div className="flex-1 h-px bg-amber-400/40" />
                    <Plane className="w-3.5 h-3.5 text-amber-400 rotate-90" />
                    <div className="flex-1 h-px bg-amber-400/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-500">{distanceNm.toLocaleString()} NM</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-display font-bold text-white">{destAirport.code}</span>
                  <p className="text-xs text-slate-400">{destAirport.city}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                <span>Selected Aircraft:</span>
                <span className="text-amber-200 font-medium">{activeAircraft.name}</span>
              </div>
            </div>

            {/* Price Itemization */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Base Charter Flight Rate ({flightHours.toFixed(1)} hrs):</span>
                <span className="font-mono text-white">{formatPrice(baseFlightCostUSD)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>VIP FBO & NCAA Handling Fees:</span>
                <span className="font-mono text-white">{formatPrice(airportFeesUSD)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Inflight Catering ({passengers} pax):</span>
                <span className="font-mono text-white">{formatPrice(cateringCostUSD)}</span>
              </div>
              {logisticsCostUSD > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>Ground Logistics & Security:</span>
                  <span className="font-mono">{formatPrice(logisticsCostUSD)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                    Estimated Total Charter
                  </span>
                  <span className="text-[10px] text-slate-500">All taxes & permits included</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-bold text-amber-300">
                    {formatPrice(totalCostUSD)}
                  </span>
                </div>
              </div>
            </div>

            {/* VIP Guarantees */}
            <div className="space-y-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Non-stop point to point direct routing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ExecuJet Lagos VIP Lounge Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Starlink Inflight Wi-Fi & Satellite Calling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingData={bookingRequestData}
        aircraft={activeAircraft}
        estimatedDuration={flightDuration}
        distanceNm={distanceNm}
        totalCostUSD={totalCostUSD}
        currency={currency}
      />
    </section>
  );
};
