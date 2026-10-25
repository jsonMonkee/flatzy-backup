import React, { useState } from 'react';
import type { Property, TenantType, InquiryFormData } from '../types/property';
import { 
  X, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  CheckCircle2,
  ChevronDown,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

import { submitLeadToGoogleSheet } from '../services/leadService';
import { FLATZY_WHATSAPP_NUMBER } from '../config/contact';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  onSuccessExploreMore: () => void;
  defaultReelUrl?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  onSuccessExploreMore,
  defaultReelUrl = '',
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const whatsappNumber = FLATZY_WHATSAPP_NUMBER;

  const [formData, setFormData] = useState<InquiryFormData>({
    propertyId: selectedProperty?.id || '',
    propertyTitle: selectedProperty?.title || '',
    fullName: '',
    phone: '',
    email: '',
    preferredMoveInDate: 'Within 7 Days',
    tenantType: 'Bachelor',
    preferredLocation: selectedProperty?.location || 'New Town',
    message: '',
    sourceReelUrl: defaultReelUrl,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  if (!isOpen) return null;

  const buildWhatsAppText = () => {
    return selectedProperty 
      ? `🏠 *PROPERTY INQUIRY — FLATZY KOLKATA*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📍 *Property:* ${selectedProperty.title}\n` +
        `🔑 *Ref Code:* #${selectedProperty.brokerReferenceId}\n` +
        `📍 *Location:* ${selectedProperty.subLocation}, ${selectedProperty.location}\n` +
        `💰 *Rent:* ₹${selectedProperty.monthlyRent.toLocaleString('en-IN')}/month\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Name:* ${formData.fullName || 'Tenant'}\n` +
        `📱 *WhatsApp:* +91 ${formData.phone}\n` +
        `📅 *Move-in:* ${formData.preferredMoveInDate}\n` +
        `👥 *Tenant Type:* ${formData.tenantType}\n` +
        (formData.message ? `📝 *Note:* ${formData.message}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Please arrange a site visit or connect me with the broker!`
      : `🏠 *FLAT SEARCH INQUIRY — FLATZY KOLKATA*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Name:* ${formData.fullName || 'Tenant'}\n` +
        `📱 *WhatsApp:* +91 ${formData.phone}\n` +
        `📍 *Preferred Area:* ${formData.preferredLocation || 'Kolkata'}\n` +
        `📅 *Move-in Timeline:* ${formData.preferredMoveInDate}\n` +
        `👥 *Tenant Type:* ${formData.tenantType}\n` +
        (formData.message ? `📝 *Note:* ${formData.message}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Please share verified flats matching these details!`;
  };

  const handleWhatsAppDirect = () => {
    const text = buildWhatsAppText();
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save lead to Google Sheets & localStorage
    await submitLeadToGoogleSheet({
      fullName: formData.fullName,
      phone: formData.phone,
      lookingForBhk: selectedProperty?.bhkType || 'Rental Flat',
      budget: selectedProperty ? `₹${selectedProperty.monthlyRent}/mo` : 'Rental Search',
      location: selectedProperty?.location || formData.preferredLocation,
      shiftingDate: formData.preferredMoveInDate,
      tenantCategory: formData.tenantType,
      role: 'Renter',
      brokerNote: formData.message || (selectedProperty ? `Property ID: ${selectedProperty.id}` : undefined),
      source: selectedProperty ? `Property Detail (#${selectedProperty.brokerReferenceId})` : 'General Inquiry Modal'
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Auto-launch WhatsApp directly
    handleWhatsAppDirect();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#FF5722', '#0B132B', '#10B981']
      });
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal / Sheet Container: Native bottom sheet on phone, centered modal on desktop */}
      <div 
        className="relative z-10 bg-white w-full sm:max-w-md rounded-t-[26px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/80 max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle Pill */}
        <div className="sm:hidden pt-2.5 pb-1 bg-slate-50 flex justify-center cursor-pointer select-none" onClick={onClose}>
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* State 1: Submitted Success State */}
        {isSubmitted ? (
          <div className="p-5 sm:p-8 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs">
              🏠
            </div>

            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-flatzy-yellow text-flatzy-navy text-[10px] font-black uppercase tracking-wider">
                {isBn ? 'ইনকোয়ারি প্রেরিত' : 'Inquiry Dispatched'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-flatzy-navy font-poppins">
                {isBn ? 'আমরা পেয়েছি! এক ধাপ এগিয়ে।' : "You're one step closer! 🏠"}
              </h3>
              <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                {isBn
                  ? 'আমরা আপনার তথ্য যাচাইকৃত ব্রোকারের কাছে পাঠাচ্ছি। শীঘ্রই হোয়াটসঅ্যাপ বা কলে যোগাযোগ করা হবে।'
                  : "We've shared your request with the verified broker. They will ping you directly on WhatsApp/call."}
              </p>
            </div>

            {selectedProperty && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-left flex items-center gap-2.5">
                <img
                  src={selectedProperty.featuredImage}
                  alt={selectedProperty.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {selectedProperty.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {selectedProperty.subLocation} • ₹{selectedProperty.monthlyRent.toLocaleString('en-IN')}/mo
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isBn ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Instant WhatsApp Ping'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSuccessExploreMore();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                {isBn ? 'অন্যান্য ফ্ল্যাট দেখুন' : 'Explore More Flats'}
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Compact Inquiry Form */
          <>
            {/* Compact Header */}
            <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-flatzy-yellow/20 flex items-center justify-center text-flatzy-navy">
                  <Sparkles className="w-3.5 h-3.5 text-flatzy-navy" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-flatzy-navy font-poppins leading-tight">
                    {selectedProperty 
                      ? (isBn ? 'ফ্ল্যাট ইনকোয়ারি' : 'Enquire About This Flat')
                      : (isBn ? 'আমার ফ্ল্যাট খুঁজুন' : 'Find My Ideal Flat')}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{isBn ? '১০০% যাচাইকৃত • কোনো স্প্যাম নেই' : '100% Verified • Zero Spam Calls'}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Property Preview (Ultra-compact strip) */}
            {selectedProperty && (
              <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-100/80 flex items-center gap-2.5 shrink-0">
                <img
                  src={selectedProperty.featuredImage}
                  alt={selectedProperty.title}
                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-amber-200/60"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-900 truncate">
                    {selectedProperty.title}
                  </h4>
                  <p className="text-[10px] text-slate-600 truncate">
                    {selectedProperty.subLocation} • <strong className="text-flatzy-navy">₹{selectedProperty.monthlyRent.toLocaleString('en-IN')}/mo</strong>
                  </p>
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  #{selectedProperty.brokerReferenceId}
                </span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 space-y-2.5 scrollbar-thin">
              
              {/* Row 1: Full Name & WhatsApp Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isBn ? 'নাম লিখুন' : 'e.g. Joydeep Sen'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white font-medium transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'হোয়াটসঅ্যাপ নম্বর *' : 'WhatsApp Number *'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-[11px] font-bold text-slate-400 pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98300 12345"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white font-medium transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Move-in Date & Tenant Type (Compact Inline) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'কবে উঠবেন?' : 'Move-in Date'}
                  </label>
                  <select
                    value={formData.preferredMoveInDate}
                    onChange={(e) => setFormData({ ...formData, preferredMoveInDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-flatzy-yellow focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="Immediate">{isBn ? 'অবিলম্বে (৪৮ ঘণ্টার মধ্যে)' : 'Immediate (< 48h)'}</option>
                    <option value="Within 7 Days">{isBn ? '৭ দিনের মধ্যে' : 'Within 7 Days'}</option>
                    <option value="Within 15 Days">{isBn ? '১৫ দিনের মধ্যে' : 'Within 15 Days'}</option>
                    <option value="Next Month">{isBn ? 'পরের মাস' : 'Next Month'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'ভাড়াটিয়ার ধরন' : 'Tenant Type'}
                  </label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value as TenantType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-flatzy-yellow focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="Bachelor">{isBn ? 'ব্যাচেলর' : 'Bachelor'}</option>
                    <option value="Student">{isBn ? 'ছাত্র/ছাত্রী' : 'Student'}</option>
                    <option value="Couple">{isBn ? 'দম্পতি' : 'Couple'}</option>
                    <option value="Family">{isBn ? 'পরিবার' : 'Family'}</option>
                    <option value="Working Professionals">{isBn ? 'চাকরিজীবী' : 'Working Prof.'}</option>
                  </select>
                </div>
              </div>

              {/* Optional Details Accordion Toggle */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="text-[11px] font-bold text-slate-500 hover:text-flatzy-navy flex items-center gap-1 transition-colors py-0.5"
                >
                  <span>{showOptionalFields ? (isBn ? '− অতিরিক্ত তথ্য লুকান' : '− Hide optional details') : (isBn ? '+ ইমেইল বা নোট যোগ করুন (ঐচ্ছিক)' : '+ Add note or email (optional)')}</span>
                </button>

                {showOptionalFields && (
                  <div className="mt-2 space-y-2 pt-1 border-t border-slate-100 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isBn ? 'বিশেষ কোনো চাহিদা?' : 'Special Requirements / Note'}
                      </label>
                      <input
                        type="text"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={isBn ? 'যেমন: ব্যালকনি লাগবে, মেট্রোর কাছে...' : 'e.g., Near Sector V metro, pet friendly...'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fast Track WhatsApp Ping Option */}
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors flex items-center justify-between text-xs font-bold active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">
                    {isBn ? 'দ্রুত হোয়াটসঅ্যাপে ইনকোয়ারি করুন' : '⚡ Fast Track: Inquire on WhatsApp'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-extrabold">
                  {isBn ? 'তাত্ক্ষণিক' : 'Instant'}
                </span>
              </button>

              <div className="pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-flatzy-yellow to-amber-500 hover:from-amber-300 hover:via-flatzy-yellow hover:to-amber-400 text-flatzy-navy font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Sending inquiry...'}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      <span>{isBn ? 'ইনকোয়ারি পাঠান' : 'Submit Inquiry'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};
