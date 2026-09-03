import React from 'react';
import { ShieldCheck, Compass, Coffee, Wifi, Sparkles, Building2, Clock, Globe } from 'lucide-react';

export const FlightExperience: React.FC = () => {
  const experiences = [
    {
      icon: Building2,
      title: 'Private FBO Terminal Access',
      tagline: 'ExecuJet Lagos & Abuja VIP Wing',
      description: 'Avoid crowded public terminals. Arrive just 15 minutes before wheels up. Dedicated customs and immigration clearance conducted in private lounge luxury.'
    },
    {
      icon: Wifi,
      title: 'Starlink & Ka-Band Connectivity',
      tagline: 'High-Speed Global Inflight Satellite',
      description: 'Stream 4K video, host board meetings on Zoom at 45,000 feet, and stay in uninterrupted voice communication across continental crossings.'
    },
    {
      icon: Coffee,
      title: 'Michelin & Nigerian Heritage Dining',
      tagline: 'Curated by Private Executive Chefs',
      description: 'From Ossetra Caviar and Dom Pérignon to authentic Nigerian delicacies like slow-smoked Suya and royal seafood Jollof, customized to your exact dietary palette.'
    },
    {
      icon: ShieldCheck,
      title: 'Argus Platinum & NCAA Certified',
      tagline: 'Zero-Compromise Aviation Safety',
      description: 'Every aircraft is flown by two type-rated captains with thousands of turbine flight hours, backed by strict biennial simulator training in Switzerland and Dallas.'
    }
  ];

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>BESPOKE AVIATION ETHOS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          THE ART OF PRIVATE FLIGHT
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          We redefine travel in Nigeria by turning flight time into effortless living, uninterrupted productivity, and supreme relaxation.
        </p>
      </div>

      {/* 4-Item Grid with luxury minimalist styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#0b101c]/80 border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  {item.tagline}
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-1">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
