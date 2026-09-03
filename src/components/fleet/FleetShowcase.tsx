import React, { useState } from 'react';
import { Plane, Users, Gauge, Compass, Shield, Wifi, BedDouble, ChevronRight, Sparkles, CheckCircle, RotateCw } from 'lucide-react';
import { Aircraft } from '../../types/aviation';
import { FLEET_DATA } from '../../data/nigeriaAviationData';
import { audioService } from '../../utils/audio';

interface FleetShowcaseProps {
  currency: 'USD' | 'NGN';
  selectedAircraftId: string;
  onSelectAircraft: (aircraft: Aircraft) => void;
  onBookAircraft: (aircraft: Aircraft) => void;
  onChangeLivery: (liveryColor: string, accentColor: string) => void;
}

const LIVERY_OPTIONS = [
  { name: 'Obsidian & Champagne Gold', livery: '#161922', accent: '#d4af37' },
  { name: 'Arctic Pearl & Platinum', livery: '#e8edf5', accent: '#a0aec0' },
  { name: 'Midnight Blue & Rose Gold', livery: '#0c1626', accent: '#e2a792' },
  { name: 'Presidential Green & Gold', livery: '#0d2818', accent: '#eab308' },
];

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({
  currency,
  selectedAircraftId,
  onSelectAircraft,
  onBookAircraft,
  onChangeLivery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedLiveryIdx, setSelectedLiveryIdx] = useState(0);

  const categories = ['All', 'Ultra-Long Range', 'Heavy Jet', 'Super-Midsize'];

  const filteredFleet = activeCategory === 'All'
    ? FLEET_DATA
    : FLEET_DATA.filter((ac) => ac.category === activeCategory);

  const currentAircraft = FLEET_DATA.find((ac) => ac.id === selectedAircraftId) || FLEET_DATA[0];

  const formatPrice = (usd: number) => {
    if (currency === 'NGN') {
      const ngn = usd * 1550;
      return `₦${ngn.toLocaleString()} / hr`;
    }
    return `$${usd.toLocaleString()} / hr`;
  };

  const handleSelectAircraft = (ac: Aircraft) => {
    audioService.playVIPChime();
    onSelectAircraft(ac);
  };

  const handleLiveryChange = (idx: number) => {
    setSelectedLiveryIdx(idx);
    const chosen = LIVERY_OPTIONS[idx];
    onChangeLivery(chosen.livery, chosen.accent);
    audioService.playClick();
  };

  return (
    <section id="fleet" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Plane className="w-3.5 h-3.5 text-amber-400" />
          <span>BESPOKE AVIATION FLEET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          ENGINEERED FOR THE DISCERNING
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Each aircraft in our charter collective is certified to the highest Nigerian Civil Aviation Authority (NCAA) and FAA/EASA international safety standards.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                audioService.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-[#070b12] font-semibold shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Layout: Fleet Selector & Active Aircraft Detailed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Aircraft Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredFleet.map((ac) => {
            const isSelected = ac.id === currentAircraft.id;
            return (
              <div
                key={ac.id}
                onClick={() => handleSelectAircraft(ac)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#101726]/95 border-amber-400/80 shadow-2xl shadow-amber-500/10 scale-[1.01]'
                    : 'bg-[#090e17]/70 border-white/10 hover:border-white/20 hover:bg-[#0c1320]/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                      {ac.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white mt-0.5">
                      {ac.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{ac.tagline}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300 block">
                      {formatPrice(ac.hourlyRateUSD)}
                    </span>
                    <span className="text-[10px] text-slate-500">Charter Estimate</span>
                  </div>
                </div>

                {/* Micro Specs */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{ac.passengers} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{ac.rangeNm.toLocaleString()} NM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{ac.speedKnots} Kts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Aircraft Deep Dive & 3D Livery Switcher */}
        <div className="lg:col-span-7 bg-[#0b101c]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header & Tagline */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-mono uppercase tracking-wider">
                  {currentAircraft.category}
                </span>
                <span className="text-xs text-slate-400">• Ready at ExecuJet Lagos</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                {currentAircraft.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5">
                {currentAircraft.tagline}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300 block">
                {formatPrice(currentAircraft.hourlyRateUSD)}
              </span>
              <span className="text-xs text-slate-400">Estimated Hourly Base</span>
            </div>
          </div>

          {/* 3D Livery Customizer controls */}
          <div className="bg-[#121927] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                Live 3D Livery Customizer
              </span>
              <span className="text-[11px] text-slate-400">Updates 3D canvas jet model</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LIVERY_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.name}
                  onClick={() => handleLiveryChange(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedLiveryIdx === idx
                      ? 'bg-amber-500/15 border-amber-400 text-white font-medium'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: opt.livery, boxShadow: `0 0 8px ${opt.accent}66` }}
                  />
                  <span className="text-[11px] leading-tight truncate">{opt.name.split('&')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Flight Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Range</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {currentAircraft.rangeNm.toLocaleString()} <span className="text-xs font-normal text-slate-400">NM</span>
              </span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(currentAircraft.rangeNm / 7700) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Max Speed</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {currentAircraft.speedKnots} <span className="text-xs font-normal text-slate-400">KTS</span>
              </span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(currentAircraft.speedKnots / 530) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Passengers</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {currentAircraft.passengers} <span className="text-xs font-normal text-slate-400">VIPs</span>
              </span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(currentAircraft.passengers / 16) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Service Ceiling</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {currentAircraft.maxAltitudeFt.toLocaleString()} <span className="text-xs font-normal text-slate-400">FT</span>
              </span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(currentAircraft.maxAltitudeFt / 51000) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cabin Layout & Interior Specifications */}
          <div className="space-y-3 bg-[#101726]/60 border border-white/10 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
              Cabin Architecture & Amenities
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentAircraft.description}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                Executive Floorplan Layout
              </span>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-amber-200">
                {currentAircraft.floorPlanLayout}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Wifi className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{currentAircraft.specs.wifi}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <BedDouble className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{currentAircraft.specs.bedroomOrBerth}</span>
              </div>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Performance & Luxury Highlights
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentAircraft.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              id="fleet-charter-btn"
              onClick={() => {
                audioService.playVIPChime();
                onBookAircraft(currentAircraft);
              }}
              className="w-full sm:w-auto flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <Plane className="w-4 h-4" />
              <span>Charter {currentAircraft.name}</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              Immediate aircraft dispatch confirmation within 15 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
