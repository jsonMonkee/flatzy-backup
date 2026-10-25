import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Home, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Camera,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getWhatsAppUrl } from '../config/contact';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [bhk, setBhk] = useState<string>('2 BHK');
  const [listingFor, setListingFor] = useState<'Rent' | 'Sale' | 'Both'>('Rent');
  const [locationName, setLocationName] = useState<string>('New Town');
  const [societyName, setSocietyName] = useState<string>('');
  const [expectedPrice, setExpectedPrice] = useState<string>('');

  if (!isOpen) return null;

  const handleShareOnWhatsApp = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#25D366', '#128C7E', '#FFC800', '#FF5722']
      });
    } catch (e) {}

    let priceText = expectedPrice 
      ? `• Expected ${listingFor}: ₹${expectedPrice}\n` 
      : `• Expected ${listingFor}: Negotiable\n`;

    const msg = 
      `*NEW PROPERTY LISTING — ONBOARD VIA WHATSAPP*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *For:* ${listingFor}\n` +
      `• *Type:* ${bhk}\n` +
      `• *Location:* ${locationName}\n` +
      (societyName ? `• *Society/Complex:* ${societyName}\n` : '') +
      priceText +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Flatzy team! I want to list my flat on Flatzy Kolkata. I am forwarding flat photos and details here for onboarding.`;

    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-flatzy-navy via-slate-900 to-emerald-950 p-6 sm:p-7 text-white relative rounded-t-[2.5rem] sm:rounded-t-[3rem]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-flatzy-yellow" />
            <span>Fast Landlord & Broker Onboarding</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-poppins text-white leading-tight">
            List Your Flat on Flatzy
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Zero listing fee • Verified clients • Quick onboarding
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Highlight Card: Clean Requirements & Direct WhatsApp Onboarding */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-emerald-950 font-poppins">
                  Direct WhatsApp Onboarding
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800">
                Zero Fees
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-emerald-900 leading-snug">
              Send flat photos directly on WhatsApp. Required for onboarding:
            </p>

            {/* Concise Checklist Pills */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[11px] font-bold text-emerald-950">
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                <span>📸</span>
                <span>Passport-size photo</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                <span>🪪</span>
                <span>Aadhaar card</span>
              </div>
            </div>
          </div>

          {/* Quick Optional Details Grid */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Quick Flat Summary (Optional)
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Pre-fills WhatsApp message</span>
            </div>

            {/* Listing For Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(['Rent', 'Sale', 'Both'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setListingFor(tab)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    listingFor === tab
                      ? 'bg-flatzy-navy text-white border-flatzy-navy shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'Both' ? 'Rent & Sale' : `For ${tab}`}
                </button>
              ))}
            </div>

            {/* BHK & Location Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Configuration
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-flatzy-yellow cursor-pointer"
                >
                  <option value="1 RK / Studio">1 RK / Studio</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK">4+ BHK / Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Location / Zone
                </label>
                <select
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-flatzy-yellow cursor-pointer"
                >
                  <option value="New Town">New Town</option>
                  <option value="Shapoorji">Shapoorji</option>
                  <option value="Rajarhat">Rajarhat</option>
                  <option value="Sector V">Sector V</option>
                  <option value="Salt Lake">Salt Lake</option>
                  <option value="Kolkata (Other)">Kolkata (Other)</option>
                </select>
              </div>
            </div>

            {/* Society Name & Price Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Society / Complex
                </label>
                <input
                  type="text"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  placeholder="e.g. PS One 10 / Sukhobrishti"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-flatzy-yellow"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Expected Price
                </label>
                <input
                  type="text"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  placeholder={listingFor === 'Sale' ? 'e.g. 85 Lacs / 1.4 Cr' : 'e.g. 21,000 / 55,000'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-flatzy-yellow"
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={handleShareOnWhatsApp}
              className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-98 group cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Share Details on WhatsApp • Onboard</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-700">Zero Listing Fee</div>
              <div className="text-[9px] text-slate-400">100% Free</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50">
              <Users className="w-4 h-4 text-flatzy-navy mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-700">Verified Clients</div>
              <div className="text-[9px] text-slate-400">Corporate & Tech</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50">
              <Camera className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-700">Fast Listing</div>
              <div className="text-[9px] text-slate-400">Live in hours</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 rounded-b-[2.5rem] sm:rounded-b-[3rem]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Official Flatzy Onboarding Helpline
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
