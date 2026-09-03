import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, AlertCircle, Wrench, ArrowRight, Tag, Sparkles, Filter } from 'lucide-react';
import { Aircraft, AvailabilitySlot, EmptyLeg } from '../../types/aviation';
import { FLEET_DATA, EMPTY_LEGS, generateMockAvailability } from '../../data/nigeriaAviationData';
import { audioService } from '../../utils/audio';

interface AvailabilityCalendarProps {
  currency: 'USD' | 'NGN';
  onSelectSlot: (aircraftId: string, date: string) => void;
  onClaimEmptyLeg: (emptyLeg: EmptyLeg) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  currency,
  onSelectSlot,
  onClaimEmptyLeg
}) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedAircraftFilter, setSelectedAircraftFilter] = useState<string>('All');

  // Generate 14 days of realistic live availability
  const availabilityMatrix = useMemo(() => {
    return generateMockAvailability(FLEET_DATA);
  }, []);

  // Compute 14 date headers starting from today
  const dateList = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0
      });
    }
    return list;
  }, []);

  const activeDate = dateList[selectedDateIdx]?.dateStr || dateList[0].dateStr;

  const filteredAircraft = useMemo(() => {
    return FLEET_DATA.filter((ac) => {
      if (filterCategory !== 'All' && ac.category !== filterCategory) return false;
      if (selectedAircraftFilter !== 'All' && ac.id !== selectedAircraftFilter) return false;
      return true;
    });
  }, [filterCategory, selectedAircraftFilter]);

  const formatPrice = (usd: number) => {
    if (currency === 'NGN') {
      const ngn = usd * 1550;
      return `₦${ngn.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const getStatusBadge = (status: AvailabilitySlot['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending VIP Hold
          </span>
        );
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            In Flight / Booked
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <Wrench className="w-2.5 h-2.5" />
            NCAA Inspection
          </span>
        );
    }
  };

  return (
    <section id="calendar" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>FLEET DISPATCH MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          REAL-TIME AIRCRAFT AVAILABILITY
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Monitor aircraft dispatch status, current airport positioning, and live turnaround windows across our Nigerian and international fleet.
        </p>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-[#0b101c]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
        {/* Date Selector Scroller */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              14-Day Dispatch Horizon
            </span>
            <span className="text-[11px] text-slate-400">Timezone: West Africa Time (WAT)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {dateList.map((item, idx) => (
              <button
                key={item.dateStr}
                onClick={() => {
                  setSelectedDateIdx(idx);
                  audioService.playClick();
                }}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 sm:w-20 py-3 rounded-2xl border transition-all ${
                  selectedDateIdx === idx
                    ? 'bg-amber-500 border-amber-400 text-[#070b12] font-bold shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-[#121927]/80 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-mono">{item.dayName}</span>
                <span className="text-lg sm:text-xl font-display font-extrabold my-0.5">
                  {item.dayNumber}
                </span>
                <span className="text-[10px] font-mono opacity-80">{item.monthName}</span>
                {item.isToday && (
                  <span className={`text-[8px] uppercase tracking-wider mt-1 px-1 rounded ${selectedDateIdx === idx ? 'bg-black/20 text-black' : 'text-amber-400'}`}>
                    Today
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-slate-400">Category Filter:</span>
            {['All', 'Ultra-Long Range', 'Heavy Jet', 'Super-Midsize'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterCategory === cat
                    ? 'bg-white/10 text-amber-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Selected: <span className="text-white font-medium">{activeDate}</span>
          </div>
        </div>

        {/* Aircraft Availability Grid for Selected Date */}
        <div className="space-y-3">
          {filteredAircraft.map((ac) => {
            const slot = availabilityMatrix.find(
              (s) => s.aircraftId === ac.id && s.date === activeDate
            );
            const status = slot?.status || 'available';
            const location = slot?.currentLocation || 'LOS';

            return (
              <div
                key={ac.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#121927]/90 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Aircraft Information */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-display font-bold text-amber-400 text-sm">
                      {ac.category[0]}J
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-white text-base sm:text-lg">
                        {ac.name}
                      </h4>
                      <span className="text-xs text-slate-400">({ac.category})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Capacity: <strong className="text-slate-200">{ac.passengers} VIPs</strong></span>
                      <span>•</span>
                      <span>Range: <strong className="text-slate-200">{ac.rangeNm.toLocaleString()} NM</strong></span>
                      <span>•</span>
                      <span>Base: <strong className="text-amber-300 font-mono">{location} (ExecuJet)</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <div className="mb-1">{getStatusBadge(status)}</div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {status === 'available' ? 'Immediate Tarmac Clearance' : `Turnaround: ${slot?.nextAvailableTime || 'Tomorrow'}`}
                    </span>
                  </div>

                  {status === 'available' ? (
                    <button
                      id={`book-slot-${ac.id}`}
                      onClick={() => {
                        audioService.playVIPChime();
                        onSelectSlot(ac.id, activeDate);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0"
                    >
                      <span>Charter Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectSlot(ac.id, activeDate)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all shrink-0 border border-white/10"
                    >
                      Request Waitlist
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Leg Repositioning Deals Banner */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-white text-lg">
                  EMPTY LEG REPOSITIONING OPPORTUNITIES
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Save up to 60% on pre-positioned private aircraft flights across Nigeria and international routes.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Instant Confirmation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMPTY_LEGS.map((el) => {
              const ac = FLEET_DATA.find((a) => a.id === el.aircraftId) || FLEET_DATA[0];
              const discountPercent = Math.round(
                ((el.originalPriceUSD - el.discountedPriceUSD) / el.originalPriceUSD) * 100
              );

              return (
                <div
                  key={el.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#121a2c] to-[#0c121e] border border-amber-400/30 space-y-4 hover:border-amber-400/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 tracking-wider uppercase block">
                        {el.departureDate}
                      </span>
                      <h4 className="font-display font-bold text-white text-base mt-0.5">
                        {el.origin.city} ({el.origin.code}) ➔ {el.destination.city} ({el.destination.code})
                      </h4>
                      <span className="text-xs text-slate-400">{ac.name} • Up to {el.seatsRemaining} Guests</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                      {discountPercent}% OFF
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-500 line-through block font-mono">
                        {formatPrice(el.originalPriceUSD)}
                      </span>
                      <span className="text-xl font-display font-bold text-amber-300">
                        {formatPrice(el.discountedPriceUSD)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Total Aircraft Charter</span>
                    </div>

                    <button
                      onClick={() => {
                        audioService.playVIPChime();
                        onClaimEmptyLeg(el);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                      Claim Flight
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
