import React, { useState } from 'react';
import { Shield, Sparkles, Phone, Mail, Award, CheckCircle2, FileText, ChevronRight, UserCheck, Lock } from 'lucide-react';
import { audioService } from '../../utils/audio';

export const ConciergeSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clientName: 'Senator / Chief Executive',
    organization: 'Pan-African Energy Holdings',
    email: 'executive.desk@paeh-group.com',
    phone: '+234 802 000 8899',
    preferredJet: 'Bombardier Global 7500',
    routeSchedule: 'Lagos (ExecuJet) ➔ Abuja (Presidential Wing) ➔ London Farnborough',
    securityEscort: true,
    helicopterTransfer: true,
    confidentialityNDA: true,
    cateringPreferences: ['Heritage Nigerian Gourmet', 'Rare French Vintages', 'Special Dietary Fruits'],
    specialRequests: 'Tarmac side-by-side vehicle arrival required. 4 Diplomatic passports for clearance.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playVIPChime();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    audioService.playClick();
  };

  return (
    <section id="concierge" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>BESPOKE CLIENTELE PROTOCOL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          PERSONALIZED VIP CONCIERGE
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Dedicated Flight Directors catering to heads of state, diplomatic delegations, family offices, and corporate leaders across West Africa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: VIP Concierge Highlights & Protocol */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b101c]/90 border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <h3 className="font-display font-bold text-white text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>THE GT AVIATION STANDARD</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121927] border border-white/5">
                <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Absolute Discretion & NDA Protection</strong>
                  <span className="text-slate-400">
                    Client itineraries, passenger manifests, and flight routes are strictly guarded under bilateral non-disclosure protocols.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121927] border border-white/5">
                <UserCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Dedicated Personal Flight Director</strong>
                  <span className="text-slate-400">
                    A single point of contact available 24/7 on private telephone and encrypted messaging for round-the-clock schedule changes.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121927] border border-white/5">
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">VIP Tarmac & Helipad Access</strong>
                  <span className="text-slate-400">
                    Seamless armored vehicular transfer directly to aircraft boarding stairs at ExecuJet Lagos, Abuja VIP Wing, and Port Harcourt.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Concierge Desk Hotline */}
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Direct VIP Hotline
              </span>
              <div className="text-lg font-display font-bold text-white mt-1">
                +234 (0) 1 888 GTJET / +234 803 000 7777
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Available 24 hours a day for immediate emergency medical or urgent executive charter dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Personalized Request Form or Submitted Confirmation Card */}
        <div className="lg:col-span-7 bg-[#0b101c]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-display font-bold text-white">
                  CUSTOM CHARTER DOSSIER
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete this briefing to initiate bespoke logistics, security convoys, and personalized culinary curation.
                </p>
              </div>

              {/* Client & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="concierge-client-name" className="text-xs text-slate-400 font-medium">Principal / Title</label>
                  <input
                    id="concierge-client-name"
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="concierge-organization" className="text-xs text-slate-400 font-medium">Organization / Family Office</label>
                  <input
                    id="concierge-organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="concierge-email" className="text-xs text-slate-400 font-medium">Secure Email</label>
                  <input
                    id="concierge-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="concierge-phone" className="text-xs text-slate-400 font-medium">Confidential Mobile / WhatsApp</label>
                  <input
                    id="concierge-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Itinerary and Aircraft Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="concierge-preferred-jet" className="text-xs text-slate-400 font-medium">Preferred Aircraft Model</label>
                  <select
                    id="concierge-preferred-jet"
                    value={formData.preferredJet}
                    onChange={(e) => setFormData({ ...formData, preferredJet: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Bombardier Global 7500">Bombardier Global 7500 (Master Suite)</option>
                    <option value="Gulfstream G650ER">Gulfstream G650ER (Mach 0.925)</option>
                    <option value="Dassault Falcon 8X">Dassault Falcon 8X (Tri-Jet Quiet)</option>
                    <option value="Embraer Praetor 600">Embraer Praetor 600 (Super-Midsize)</option>
                    <option value="Bombardier Challenger 650">Bombardier Challenger 650 (Widebody)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="concierge-route-schedule" className="text-xs text-slate-400 font-medium">Multi-City Route / Timeline</label>
                  <input
                    id="concierge-route-schedule"
                    type="text"
                    value={formData.routeSchedule}
                    onChange={(e) => setFormData({ ...formData, routeSchedule: e.target.value })}
                    className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Security & Logistics Checkboxes */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium block">
                  Ground Escort & Specialized Handling
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label htmlFor="concierge-security-escort" className="flex items-center gap-2 p-3 bg-[#121927] border border-white/10 rounded-xl cursor-pointer">
                    <input
                      id="concierge-security-escort"
                      type="checkbox"
                      checked={formData.securityEscort}
                      onChange={(e) => setFormData({ ...formData, securityEscort: e.target.checked })}
                      className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Armored Security Convoy</span>
                  </label>
                  <label htmlFor="concierge-helicopter-transfer" className="flex items-center gap-2 p-3 bg-[#121927] border border-white/10 rounded-xl cursor-pointer">
                    <input
                      id="concierge-helicopter-transfer"
                      type="checkbox"
                      checked={formData.helicopterTransfer}
                      onChange={(e) => setFormData({ ...formData, helicopterTransfer: e.target.checked })}
                      className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Ikoyi / VI Helipad Shuttle</span>
                  </label>
                  <label htmlFor="concierge-confidentiality-nda" className="flex items-center gap-2 p-3 bg-[#121927] border border-white/10 rounded-xl cursor-pointer">
                    <input
                      id="concierge-confidentiality-nda"
                      type="checkbox"
                      checked={formData.confidentialityNDA}
                      onChange={(e) => setFormData({ ...formData, confidentialityNDA: e.target.checked })}
                      className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Formal NDA Protocol</span>
                  </label>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label htmlFor="concierge-special-requests" className="text-xs text-slate-400 font-medium">
                  Culinary, Protocol & Inflight Requirements
                </label>
                <textarea
                  id="concierge-special-requests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full bg-[#121927] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                id="concierge-submit-btn"
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit VIP Concierge Request (Demo)</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white">
                  VIP DOSSIER TRANSMITTED
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your personalized charter dossier has been routed to the Senior Flight Director at ExecuJet Lagos.
                </p>
              </div>

              <div className="p-4 bg-[#121927] border border-white/10 rounded-2xl text-left space-y-3 max-w-lg mx-auto text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Principal:</span>
                  <span className="font-semibold text-white">{formData.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Assigned Jet:</span>
                  <span className="font-semibold text-amber-300">{formData.preferredJet}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-semibold text-slate-200">{formData.routeSchedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security & Transfers:</span>
                  <span className="font-semibold text-emerald-400">Armored Convoy & Helipad Active</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
              >
                Submit Another Request
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
