import React from 'react';
import type { Property } from '../types/property';
import { 
  X, 
  Trash2, 
  Heart, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Send,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../config/contact';
import { WhatsAppIcon } from './WhatsAppIcon';

interface SavedFlatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSaved: (id: string) => void;
  onClearAll?: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenInquiryModal: (property?: Property) => void;
  onNavigate?: (tab: string) => void;
}

export const SavedFlatsDrawer: React.FC<SavedFlatsDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onClearAll,
  onSelectProperty,
  onOpenInquiryModal,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const totalMonthlyRent = savedProperties.reduce((acc, p) => acc + p.monthlyRent, 0);
  const totalDeposit = savedProperties.reduce((acc, p) => acc + (p.securityDeposit || p.monthlyRent * 2), 0);

  const handleWhatsAppSingle = (property: Property) => {
    let pricingStr = `₹${property.monthlyRent.toLocaleString('en-IN')}/month`;
    if (property.listingType === 'sale' && property.salePrice) {
      pricingStr = `Sale: ₹${property.salePrice >= 10000000 ? (property.salePrice / 10000000).toFixed(2) + ' Cr' : (property.salePrice / 100000).toFixed(0) + ' Lacs'}`;
    }
    const text = `Hi Flatzy Kolkata! I am interested in this flat saved from my shortlist:\n\n*${property.title}*\nRef ID: ${property.brokerReferenceId || property.id}\nLocation: ${property.subLocation || property.location}\nRent/Price: ${pricingStr}\n\nPlease connect me with the broker to get more options & schedule a visit!`;
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppAll = () => {
    if (savedProperties.length === 0) return;
    const summary = savedProperties
      .map((p, i) => `${i + 1}. *${p.title}* (${p.brokerReferenceId || p.id})\n   • Location: ${p.subLocation || p.location}\n   • Rent: ₹${p.monthlyRent.toLocaleString('en-IN')}/mo (${p.furnishing})`)
      .join('\n\n');
    const text = `Hi Flatzy Kolkata! I have shortlisted these ${savedProperties.length} flat(s) on Flatzy:\n\n${summary}\n\nCombined Monthly Rent: ₹${totalMonthlyRent.toLocaleString('en-IN')}/mo\n\nI want to continue connecting with the broker for these flat options and schedule visits. Please share details!`;
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppCustomInquiry = () => {
    const text = `Hi Flatzy Kolkata! I am looking for flats to rent/buy in Kolkata. Could you connect me with verified brokers to share the latest available flat options matching my requirements?`;
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-sm flex flex-col justify-end sm:justify-stretch animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Drawer Container (Native bottom sheet on mobile, slide-over drawer on tablet/desktop) */}
      <div className="relative z-10 w-full sm:max-w-md sm:ml-auto h-[92vh] sm:h-full bg-slate-50 flex flex-col rounded-t-[28px] sm:rounded-none shadow-2xl sm:border-l border-slate-200 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 overflow-hidden">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden pt-3 pb-1 bg-white flex justify-center cursor-pointer select-none" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 py-3 sm:p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-center text-rose-500 shadow-xs">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-flatzy-navy font-poppins">
                  {isBn ? 'সংরক্ষিত ফ্ল্যাট' : 'Saved Flats'}
                </h3>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-flatzy-yellow text-flatzy-navy">
                  {savedProperties.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isBn ? 'সহজে তুলনা ও এক ক্লিকে বুকিং' : 'Quick compare & 1-tap inquiries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {savedProperties.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2.5 py-1 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
              >
                {isBn ? 'সব মুছুন' : 'Clear all'}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Property List Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-thin">
          {savedProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 shadow-sm">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-rose-100 text-rose-500 stroke-[1.5]" />
              </div>
              
              <div className="space-y-1 max-w-xs">
                <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {isBn ? 'আপনার পছন্দের তালিকা খালি' : 'No Saved Flats Yet'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isBn
                    ? 'যেকোনো ফ্ল্যাটে হার্ট আইকন ট্যাপ করে সেভ করুন অথবা সরাসরি ব্রোকারের সাথে যোগাযোগ করে নতুন ফ্ল্যাট অপশন পান।'
                    : 'Tap the heart icon on any flat card to build your shortlist, or connect directly with our brokers for custom flat options!'}
                </p>
              </div>

              {/* Action Buttons: WhatsApp Connect for Flat Options + Explore */}
              <div className="pt-2 w-full max-w-xs space-y-2.5">
                <button
                  onClick={handleWhatsAppCustomInquiry}
                  className="relative w-full overflow-hidden group py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#20bd5a] via-[#25D366] to-[#128C7E] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 border-t border-white/30 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                  </div>
                  <span className="font-extrabold tracking-tight">
                    {isBn ? 'ব্রোকারের কাছে ফ্ল্যাট অপশন চান' : 'Connect with Broker for Flat Options'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('explore');
                  }}
                  className="w-full py-3 rounded-2xl bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy font-black text-xs uppercase tracking-wider shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>{isBn ? 'ফ্ল্যাট ব্রাউজ করুন' : 'Explore Kolkata Flats'}</span>
                </button>

                {/* Popular Locality Shortcuts */}
                <div className="pt-1 flex flex-wrap justify-center gap-1.5">
                  {['New Town', 'Salt Lake', 'Shapoorji', 'Sector V'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onClose();
                        if (onNavigate) onNavigate('explore');
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-flatzy-yellow hover:text-flatzy-navy transition-all"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            savedProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-xs hover:shadow-soft transition-all flex flex-col gap-2.5"
              >
                {/* Top Half: Compact Thumbnail & Property Details */}
                <div className="flex gap-3 items-start">
                  {/* Property Image with BHK Overlay */}
                  <div
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-slate-100 bg-slate-100 group"
                  >
                    <img
                      src={property.featuredImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/75 backdrop-blur-xs text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                      {property.bedrooms ? `${property.bedrooms} BHK` : '1 RK'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-sm sm:text-base font-black text-flatzy-navy font-poppins">
                        ₹{property.monthlyRent.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <button
                        onClick={() => onRemoveSaved(property.id)}
                        aria-label="Remove saved property"
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors active:scale-90"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        onSelectProperty(property);
                        onClose();
                      }}
                      className="text-xs font-bold text-slate-900 truncate cursor-pointer hover:text-flatzy-navy mt-0.5 leading-snug"
                    >
                      {property.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                      <MapPin className="w-3 h-3 text-flatzy-yellow shrink-0" />
                      <span className="truncate font-medium">{property.subLocation || property.location}</span>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {property.furnishing}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Verified Flat</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        #{property.brokerReferenceId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Half: Single-Tap Quick Action Buttons */}
                <div className="grid grid-cols-12 gap-1.5 pt-2 border-t border-slate-100">
                  {/* WhatsApp Chat with Broker */}
                  <button
                    onClick={() => handleWhatsAppSingle(property)}
                    className="col-span-6 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200/90 transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                    title="Chat with broker on WhatsApp"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Chat on WhatsApp</span>
                  </button>

                  {/* Inquire */}
                  <button
                    onClick={() => {
                      onOpenInquiryModal(property);
                      onClose();
                    }}
                    className="col-span-3 py-2 px-1.5 rounded-xl bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy font-bold text-[11px] transition-transform flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">{isBn ? 'ফর্ম' : 'Form'}</span>
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                    className="col-span-3 py-2 px-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 active:scale-95"
                    title="View details"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom Summary & Inquire Action Bar */}
        {savedProperties.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white space-y-2.5 shadow-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
            {/* Rent & Shortlist Combined Breakdown */}
            <div className="flex items-center justify-between text-xs px-1">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {isBn ? 'মোট সম্ভাব্য ভাড়া:' : 'Combined Monthly Rent:'}
                </span>
                <span className="text-base font-black text-flatzy-navy font-poppins">
                  ₹{totalMonthlyRent.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-medium block">
                  {isBn ? 'সংরক্ষিত ফ্ল্যাট:' : 'Shortlisted Flats:'}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {savedProperties.length} {savedProperties.length === 1 ? 'Flat' : 'Flats'} Selected
                </span>
              </div>
            </div>

            {/* Primary Action: Direct WhatsApp with Broker for Flat Options */}
            <button
              onClick={handleWhatsAppAll}
              className="relative w-full overflow-hidden group py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#20bd5a] via-[#25D366] to-[#128C7E] text-white shadow-[0_8px_20px_-4px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_24px_-4px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border-t border-white/30 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              <div className="relative z-10 flex items-center justify-center gap-2.5 w-full">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-white/30 transition-all shrink-0">
                  <WhatsAppIcon className="w-4 h-4 text-white drop-shadow-xs" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white drop-shadow-xs truncate">
                  {isBn 
                    ? `ব্রোকারের সাথে হোয়াটসঅ্যাপে যোগাযোগ চালিয়ে যান (${savedProperties.length})` 
                    : `Continue Connecting with Broker for Flats (${savedProperties.length})`}
                </span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </button>

            {/* Secondary Action: Online Web Form Inquiry */}
            <button
              onClick={() => {
                onClose();
                onOpenInquiryModal();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-flatzy-yellowDark" />
              <span>{isBn ? 'ওয়েবসাইট ফর্মে ইনকোয়ারি পাঠান' : 'Or Inquire via Online Form'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
