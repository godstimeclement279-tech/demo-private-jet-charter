import React from 'react';
import { Plane, Calendar, Clock, MapPin, Users, Shield, CheckCircle, Download, X, Sparkles, QrCode, Award, FileText } from 'lucide-react';
import { Airport, Aircraft, BookingRequest } from '../../types/aviation';
import { audioService } from '../../utils/audio';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingRequest;
  aircraft: Aircraft;
  estimatedDuration: string;
  distanceNm: number;
  totalCostUSD: number;
  currency: 'USD' | 'NGN';
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  aircraft,
  estimatedDuration,
  distanceNm,
  totalCostUSD,
  currency
}) => {
  if (!isOpen) return null;

  const confirmationCode = `GT-VIP-${Math.floor(100000 + Math.random() * 900000)}`;

  const formatPrice = (usd: number) => {
    if (currency === 'NGN') {
      const ngn = usd * 1550;
      return `₦${ngn.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070d]/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090e18] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>FLY JET LIFE LIMITED</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            VIP FLIGHT MANIFEST & CLEARANCE
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            DISPATCH REF: <span className="text-amber-300 font-bold">{confirmationCode}</span> • NCAA AOC AUTHENTICATED
          </p>
        </div>

        {/* Boarding Pass Styled Card */}
        <div className="mt-6 bg-[#0e1422] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden space-y-6">
          {/* Subtle watermarked jet background */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
            <Plane className="w-64 h-64 text-white -rotate-12" />
          </div>

          {/* Route Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                {bookingData.origin.code}
              </span>
              <p className="text-xs text-slate-300 font-medium">{bookingData.origin.city}</p>
              <p className="text-[10px] text-slate-500">{bookingData.origin.name}</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-[11px] font-mono text-amber-300 font-medium mb-1">
                {estimatedDuration} • NON-STOP DIRECT
              </span>
              <div className="w-full flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div className="flex-1 h-px bg-dashed border-t border-amber-400/40" />
                <Plane className="w-4 h-4 text-amber-400 shrink-0 rotate-90" />
                <div className="flex-1 h-px bg-dashed border-t border-amber-400/40" />
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                {distanceNm.toLocaleString()} Nautical Miles • FL450
              </span>
            </div>

            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                {bookingData.destination.code}
              </span>
              <p className="text-xs text-slate-300 font-medium">{bookingData.destination.city}</p>
              <p className="text-[10px] text-slate-500">{bookingData.destination.name}</p>
            </div>
          </div>

          {/* Flight Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Departure</span>
              <span className="text-white font-medium block mt-0.5">{bookingData.departureDate}</span>
              <span className="text-amber-300 font-mono text-[11px]">{bookingData.departureTime} WAT</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Assigned Jet</span>
              <span className="text-white font-medium block mt-0.5">{aircraft.name}</span>
              <span className="text-slate-400 text-[11px]">{aircraft.category}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">VIP Passengers</span>
              <span className="text-white font-medium block mt-0.5">{bookingData.passengers} Guests</span>
              <span className="text-slate-400 text-[11px]">Private Cabin Suite</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Catering Service</span>
              <span className="text-amber-300 font-medium block mt-0.5">{bookingData.cateringTier}</span>
              <span className="text-slate-400 text-[11px]">Champagne & Chef Selection</span>
            </div>
          </div>

          {/* FBO Terminal & VIP Instructions */}
          <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Fly Jet Life VIP FBO Protocol (ExecuJet / Quits Aviation Wing)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Arrive at the private aviation terminal 15 minutes prior to departure. A dedicated Fly Jet Life personal flight liaison meets your motorcade directly at the security gates. Customs and baggage handling are conducted in your private VIP lounge suite.
            </p>
          </div>

          {/* Bottom Bar: Estimated Price & QR Code */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">
                Total Charter Estimate
              </span>
              <span className="text-2xl font-display font-bold text-amber-300">
                {formatPrice(totalCostUSD)}
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono">
                • Includes landing, VIP ground handling & private catering
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
              <QrCode className="w-12 h-12 text-amber-300" />
              <div className="text-[9px] font-mono text-slate-400">
                <span>GT-OPS: DISPATCH APPROVED</span>
                <br />
                <span>NCAA AOC: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Flight Manifest</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#070b12] text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
          >
            Return to Fleet Overview
          </button>
        </div>
      </div>
    </div>
  );
};
