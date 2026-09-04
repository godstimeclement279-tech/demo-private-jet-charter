import React, { useState } from 'react';
import { Plane, ArrowRight, Shield, Clock, MapPin, ChevronDown, Sparkles, Users } from 'lucide-react';
import { NIGERIAN_AIRPORTS } from '../../data/nigeriaAviationData';
import { audioService } from '../../utils/audio';

interface HeroSectionProps {
  onQuickBook: (originCode: string, destCode: string, passengers: number) => void;
  onExploreFleet: () => void;
  onViewAvailability: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickBook,
  onExploreFleet,
  onViewAvailability
}) => {
  const [origin, setOrigin] = useState('LOS');
  const [destination, setDestination] = useState('ABV');
  const [paxCount, setPaxCount] = useState(4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playVIPChime();
    onQuickBook(origin, destination, paxCount);
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Top Tagline & Main Luxury Headline */}
      <div className="pt-8 sm:pt-16 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121927]/90 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FLY JET LIFE LIMITED</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
          SOVEREIGN FLIGHT. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
            TRANSCEND THE SKIES.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
          The pinnacle of private aviation in Nigeria. Direct point-to-point connections between Lagos, Abuja, Port Harcourt, London, and Dubai with certified NCAA flight crews, tailored culinary curation, and 24/7 presidential flight dispatch.
        </p>

        {/* Quick CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            id="hero-explore-fleet-btn"
            onClick={() => {
              audioService.playClick();
              onExploreFleet();
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-[#070b12] text-xs font-bold uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 hover:translate-y-[-1px]"
          >
            <span>Explore 3D Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-availability-btn"
            onClick={() => {
              audioService.playClick();
              onViewAvailability();
            }}
            className="px-6 py-3.5 rounded-xl bg-[#0d1422]/80 hover:bg-[#121b2c] border border-amber-500/20 hover:border-amber-400/50 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md"
          >
            Live Aircraft Availability
          </button>
        </div>
      </div>

      {/* Interactive Quick-Flight Search Bar (Floating glass container) */}
      <div className="my-10 w-full max-w-5xl bg-[#0b101c]/85 border border-amber-500/25 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-300 uppercase">
            <Plane className="w-4 h-4 text-amber-400" />
            <span>Instant Charter Estimator</span>
          </div>
          <span className="text-[11px] text-slate-400">Fixed Hourly Rates • ExecuJet FBO Terminal Access</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Origin */}
          <div className="space-y-1.5">
            <label htmlFor="hero-departure-airport" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Departure Hub
            </label>
            <select
              id="hero-departure-airport"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              {NIGERIAN_AIRPORTS.map((apt) => (
                <option key={`orig-${apt.code}`} value={apt.code}>
                  {apt.city} ({apt.code}) - {apt.country}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label htmlFor="hero-arrival-airport" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Arrival Destination
            </label>
            <select
              id="hero-arrival-airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              {NIGERIAN_AIRPORTS.filter((a) => a.code !== origin).map((apt) => (
                <option key={`dest-${apt.code}`} value={apt.code}>
                  {apt.city} ({apt.code}) - {apt.country}
                </option>
              ))}
            </select>
          </div>

          {/* Passengers */}
          <div className="space-y-1.5">
            <label htmlFor="hero-pax-count" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Passengers
            </label>
            <div className="flex items-center bg-[#121927] border border-white/10 rounded-xl px-3 py-1.5">
              <input
                id="hero-pax-count"
                type="number"
                min={1}
                max={16}
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, Math.min(16, parseInt(e.target.value) || 1)))}
                className="w-full bg-transparent text-sm text-white py-1.5 focus:outline-none"
              />
              <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">Guests</span>
            </div>
          </div>

          {/* Submit Action */}
          <div>
            <button
              id="hero-quote-submit"
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Build Flight Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Luxury Statistics Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10">
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-xl sm:text-2xl font-display font-bold text-white">100%</div>
          <p className="text-xs text-slate-400">Dispatch Reliability</p>
        </div>
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-xl sm:text-2xl font-display font-bold text-amber-300">55 Mins</div>
          <p className="text-xs text-slate-400">Lagos ➔ Abuja Flight Time</p>
        </div>
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-xl sm:text-2xl font-display font-bold text-white">&lt; 15 Mins</div>
          <p className="text-xs text-slate-400">VIP FBO Tarmac Boarding</p>
        </div>
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="text-xl sm:text-2xl font-display font-bold text-emerald-400">24 / 7</div>
          <p className="text-xs text-slate-400">Dedicated VIP Concierge</p>
        </div>
      </div>

      {/* Scroll Down Hint with sleek line */}
      <div className="pt-8 flex flex-col items-center justify-center text-slate-400 gap-2">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-300/80">Scroll to Advance Flight Path</span>
        <div className="w-px h-8 bg-gradient-to-b from-amber-400/80 to-transparent" />
      </div>
    </section>
  );
};
