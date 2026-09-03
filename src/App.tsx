import React, { useState, useEffect, useCallback } from 'react';
import { JetScene } from './components/3d/JetScene';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { FleetShowcase } from './components/fleet/FleetShowcase';
import { BookingSection } from './components/booking/BookingSection';
import { AvailabilityCalendar } from './components/calendar/AvailabilityCalendar';
import { FlightExperience } from './components/experience/FlightExperience';
import { ConciergeSection } from './components/concierge/ConciergeSection';
import { Footer } from './components/footer/Footer';
import { Aircraft, EmptyLeg } from './types/aviation';
import { FLEET_DATA } from './data/nigeriaAviationData';
import { audioService } from './utils/audio';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  
  // Selected Aircraft & 3D Livery
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>(FLEET_DATA[0]);
  const [liveryColor, setLiveryColor] = useState('#161922');
  const [accentColor, setAccentColor] = useState('#d4af37');

  // Booking initial state when redirected from Hero, Fleet, or Calendar
  const [bookingOrigin, setBookingOrigin] = useState('LOS');
  const [bookingDest, setBookingDest] = useState('ABV');
  const [bookingPax, setBookingPax] = useState(4);

  // Monitor scroll progress smoothly
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      // Determine active section for HUD telemetry
      const sections = ['hero', 'fleet', 'booking', 'calendar', 'experience', 'concierge'];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Quick Book trigger from Hero
  const handleQuickBook = (origin: string, dest: string, pax: number) => {
    setBookingOrigin(origin);
    setBookingDest(dest);
    setBookingPax(pax);
    scrollToSection('booking');
  };

  // Fleet Selection trigger
  const handleSelectFleetAircraft = (ac: Aircraft) => {
    setSelectedAircraft(ac);
    setLiveryColor(ac.liveryColor);
    setAccentColor(ac.accentColor);
  };

  const handleBookAircraft = (ac: Aircraft) => {
    setSelectedAircraft(ac);
    setLiveryColor(ac.liveryColor);
    setAccentColor(ac.accentColor);
    scrollToSection('booking');
  };

  const handleChangeLivery = (livery: string, accent: string) => {
    setLiveryColor(livery);
    setAccentColor(accent);
  };

  // Availability calendar slot click
  const handleSelectSlot = (aircraftId: string, date: string) => {
    const found = FLEET_DATA.find((a) => a.id === aircraftId);
    if (found) {
      setSelectedAircraft(found);
      setLiveryColor(found.liveryColor);
      setAccentColor(found.accentColor);
    }
    scrollToSection('booking');
  };

  // Claim Empty Leg
  const handleClaimEmptyLeg = (emptyLeg: EmptyLeg) => {
    setBookingOrigin(emptyLeg.origin.code);
    setBookingDest(emptyLeg.destination.code);
    const found = FLEET_DATA.find((a) => a.id === emptyLeg.aircraftId);
    if (found) {
      setSelectedAircraft(found);
    }
    scrollToSection('booking');
  };

  return (
    <div className="relative min-h-screen bg-[#070b12] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3D Background Jet Canvas synced with scroll */}
      <JetScene
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        selectedAircraftLivery={liveryColor}
        accentColor={accentColor}
      />

      {/* Top Fixed Navigation */}
      <Navbar
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'USD' ? 'NGN' : 'USD'))}
        onOpenConcierge={() => scrollToSection('concierge')}
        onNavigateTo={scrollToSection}
      />

      {/* Interactive Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          onQuickBook={handleQuickBook}
          onExploreFleet={() => scrollToSection('fleet')}
          onViewAvailability={() => scrollToSection('calendar')}
        />

        <FleetShowcase
          currency={currency}
          selectedAircraftId={selectedAircraft.id}
          onSelectAircraft={handleSelectFleetAircraft}
          onBookAircraft={handleBookAircraft}
          onChangeLivery={handleChangeLivery}
        />

        <BookingSection
          currency={currency}
          preselectedAircraftId={selectedAircraft.id}
          initialOrigin={bookingOrigin}
          initialDestination={bookingDest}
          initialPassengers={bookingPax}
        />

        <AvailabilityCalendar
          currency={currency}
          onSelectSlot={handleSelectSlot}
          onClaimEmptyLeg={handleClaimEmptyLeg}
        />

        <FlightExperience />

        <ConciergeSection />
      </main>

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}
