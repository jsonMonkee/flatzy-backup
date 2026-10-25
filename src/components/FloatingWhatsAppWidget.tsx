import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { getWhatsAppUrl, FLATZY_DISPLAY_PHONE, FLATZY_PHONE_TEL } from '../config/contact';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingWhatsAppWidgetProps {
  currentTab?: string;
}

export const FloatingWhatsAppWidget: React.FC<FloatingWhatsAppWidgetProps> = ({ currentTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNumberRevealed, setIsNumberRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // Hidden representation of phone number
  const maskedNumber = '+91 89103 •••••';
  const fullNumber = FLATZY_DISPLAY_PHONE; // '+91 89103 76054'

  const handleOpenDialog = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnreadNotification(false);
    }
  };

  const handleConnectWhatsApp = () => {
    const url = getWhatsAppUrl('Hi Flatzy! I am connecting from the website.');
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCopyNumber = () => {
    // If not revealed yet, reveal it first
    if (!isNumberRevealed) {
      setIsNumberRevealed(true);
    }

    navigator.clipboard.writeText(fullNumber.replace(/\s+/g, ''));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* PROPER WHATSAPP-THEMED DIALOG BOX (GREEN & WHITE CARD) */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div 
          className="fixed z-50 animate-in fade-in zoom-in-95 duration-200 
            bottom-[5.5rem] right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24 
            w-auto sm:w-[22rem] max-w-[calc(100vw-2rem)]
            bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-emerald-100 overflow-hidden font-sans"
        >
          {/* WhatsApp Themed Green Header */}
          <div className="bg-[#075E54] text-white p-4 sm:p-5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-soft">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                {/* Active Online Pulse Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-wide text-white font-poppins">
                    Flatzy Support
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#25D366]/30 text-[9px] font-black text-emerald-200 uppercase">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 flex items-center gap-1 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block" />
                  <span>Online • Quick response</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean White Card Body (2 Distinct Options) */}
          <div className="p-5 bg-white space-y-4">
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with Flatzy team on WhatsApp for verified flat listings, visits, or onboarding enquiries.
            </p>

            {/* OPTION 1: CONNECT ON WHATSAPP */}
            <button
              onClick={handleConnectWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 group"
            >
              <WhatsAppIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Connect on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* OPTION 2: COPY NUMBER (WITH EYE REVEAL) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-0.5">
                <span>Direct Contact Number</span>
                <span className="text-[10px] text-slate-400 font-medium">Click eye to view</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 transition-colors">
                
                {/* Phone icon */}
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#075E54] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>

                {/* Number Display (Masked or Revealed) */}
                <div className="flex-1 font-mono text-xs font-bold text-slate-800 tracking-wider">
                  {isNumberRevealed ? fullNumber : maskedNumber}
                </div>

                {/* Eye Toggle Button */}
                <button
                  onClick={() => setIsNumberRevealed(!isNumberRevealed)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                  title={isNumberRevealed ? "Hide number" : "Click to view full number"}
                  aria-label="Toggle view number"
                >
                  {isNumberRevealed ? (
                    <EyeOff className="w-4 h-4 text-[#075E54]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* Copy Number Button */}
                <button
                  onClick={handleCopyNumber}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                    isCopied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  title="Copy phone number to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Trust Footer */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-[#25D366]" />
              <span>Verified Kolkata Flatzy Operations Desk</span>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ACTION BUTTON (Visible on all screens except roommates) */}
      {/* ------------------------------------------------------------- */}
      {currentTab !== 'roommates' && (
        <div 
          className="fixed z-40 
            bottom-24 right-4 sm:bottom-6 sm:right-6 
            flex items-center gap-2.5 group"
        >
        {/* Subtle Tooltip Label on Desktop */}
        <div 
          onClick={handleOpenDialog}
          className="hidden md:flex items-center gap-2 py-2 px-3.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-slate-700/80 cursor-pointer transition-all hover:bg-slate-900 opacity-95 group-hover:opacity-100"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>WhatsApp Us</span>
        </div>

        {/* WhatsApp Round Floating Button */}
        <button
          onClick={handleOpenDialog}
          aria-label="Open Flatzy WhatsApp Support"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white focus:outline-none"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white stroke-[2.5]" />
          ) : (
            <>
              <WhatsAppIcon className="w-8 h-8 text-white" />
              
              {/* Green notification indicator */}
              {hasUnreadNotification && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-flatzy-coral text-white text-[11px] font-black flex items-center justify-center border-2 border-white animate-bounce">
                  1
                </span>
              )}

              {/* Ambient Ripple Ping */}
              <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping pointer-events-none -z-10" />
            </>
          )}
        </button>
      </div>
      )}
    </>
  );
};
