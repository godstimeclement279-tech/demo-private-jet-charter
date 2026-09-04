import React from 'react';
import { Plane, Shield, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { audioService } from '../../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioService.playClick();
  };

  return (
    <footer className="relative bg-[#05080e] border-t border-amber-500/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 z-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
        {/* Brand Description */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a2335] to-[#0c121e] border border-amber-400/40 flex items-center justify-center">
              <span className="font-display font-bold text-[10px] text-amber-300">FJL</span>
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-wider block">
                FLY JET LIFE
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/90 font-mono block">
                LIMITED
              </span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            West Africa’s premier private jet charter and VIP aviation collective. Exceptional safety, bespoke luxury, and transcontinental non-stop access.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px]">
            <Shield className="w-3.5 h-3.5" />
            <span>NCAA LICENSED • NCAA/AOC/FJL-088</span>
          </div>
        </div>

        {/* Nigerian FBO Hubs */}
        <div className="space-y-2">
          <h4 className="text-white font-display font-semibold text-xs tracking-wider uppercase">
            Primary Nigerian FBO Bases
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>ExecuJet / Quits VIP FBO, Lagos (LOS)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>VIP Presidential Wing, Abuja (ABV)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>VIP General Aviation Terminal, Port Harcourt (PHC)</span>
            </li>
          </ul>
        </div>

        {/* Global Hubs */}
        <div className="space-y-2">
          <h4 className="text-white font-display font-semibold text-xs tracking-wider uppercase">
            International Connections
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>London Farnborough (EGLF) & Luton Signature</li>
            <li>Dubai Al Maktoum Jetex VIP Terminal (DWC)</li>
            <li>Paris Le Bourget Business Terminal (LFPB)</li>
            <li>Accra Kotoka VIP Aviation Centre (DGAA)</li>
          </ul>
        </div>

        {/* VIP Contacts & Demo notice */}
        <div className="space-y-2">
          <h4 className="text-white font-display font-semibold text-xs tracking-wider uppercase">
            VIP Flight Operations Desk
          </h4>
          <div className="space-y-1 text-[11px]">
            <p className="flex items-center gap-1.5 text-white font-medium">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              +234 (0) 1 888 FLYJET / +234 803 000 7777
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              charter@flyjetlife.com
            </p>
            <div className="pt-2">
              <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono block text-center">
                Interactive VIP Flight Showcase • Live Demo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Fly Jet Life Limited. All rights reserved.
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Back to Runway</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
