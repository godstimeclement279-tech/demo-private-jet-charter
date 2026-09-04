import React, { useState } from 'react';
import { Plane, Volume2, VolumeX, Menu, X, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { audioService } from '../../utils/audio';

interface NavbarProps {
  currency: 'USD' | 'NGN';
  onToggleCurrency: () => void;
  onOpenConcierge: () => void;
  onNavigateTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onToggleCurrency,
  onOpenConcierge,
  onNavigateTo
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const isUnmuted = audioService.toggleMute();
    setIsAudioMuted(!isUnmuted);
  };

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'booking', label: 'Book Flight' },
    { id: 'calendar', label: 'Availability' },
    { id: 'experience', label: 'The Experience' },
    { id: 'concierge', label: 'VIP Concierge' }
  ];

  const handleNavClick = (id: string) => {
    onNavigateTo(id);
    setMobileMenuOpen(false);
    audioService.playClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070b12]/80 backdrop-blur-xl border-b border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a2335] to-[#0c121e] border border-amber-400/40 flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-amber-300 transition-all">
            <span className="font-display font-extrabold text-[11px] tracking-wider text-amber-300">FJL</span>
            <Plane className="w-3.5 h-3.5 text-amber-400 -rotate-45 absolute -top-1 -right-1 drop-shadow" />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-wider text-white flex items-center gap-1.5">
              FLY JET LIFE
            </span>
            <p className="text-[9px] uppercase tracking-[0.25em] text-amber-400/90 font-mono">
              LIMITED
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-slate-300 hover:text-amber-300 transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls: Currency, Audio, & VIP Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio Chime / Ambient Toggle */}
          <button
            id="audio-toggle-btn"
            onClick={handleAudioToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isAudioMuted ? 'Enable VIP Cabin Ambience' : 'Mute Cabin Sound'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Currency Toggle (USD vs NGN) */}
          <button
            id="currency-toggle-btn"
            onClick={() => {
              onToggleCurrency();
              audioService.playClick();
            }}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs font-mono font-medium text-slate-200 transition-all flex items-center gap-1.5"
            title="Switch Currency Display"
          >
            <span className="text-slate-500 text-[10px]">CURRENCY:</span>
            <span className={currency === 'USD' ? 'text-amber-300 font-bold' : 'text-slate-400'}>USD</span>
            <span className="text-slate-600">/</span>
            <span className={currency === 'NGN' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>NGN</span>
          </button>

          {/* Direct Charter Hotkey */}
          <button
            id="navbar-charter-btn"
            onClick={() => handleNavClick('booking')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#070b12] text-xs font-semibold uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02]"
          >
            Charter Flight
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-currency-btn"
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-amber-300"
          >
            {currency}
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f19] border-b border-amber-500/20 px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <button
              onClick={handleAudioToggle}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
              <span>{isAudioMuted ? 'Muted' : 'Sound Active'}</span>
            </button>
            <button
              onClick={onToggleCurrency}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300"
            >
              <span>Rates: {currency}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-white/5 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavClick('booking')}
            className="w-full py-3 rounded-xl bg-amber-500 text-[#070b12] text-xs font-semibold uppercase tracking-wider text-center"
          >
            Request Instant Charter Quote
          </button>
        </div>
      )}
    </header>
  );
};
