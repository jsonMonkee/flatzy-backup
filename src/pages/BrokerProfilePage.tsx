import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Building, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Home, 
  Phone,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';
import type { Broker } from '../data/brokersData';
import { BROKERS_DATA } from '../data/brokersData';
import { getWhatsAppUrl } from '../config/contact';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { PROPERTIES_DATA } from '../data/properties';
import type { Property } from '../types/property';
import { useLanguage } from '../context/LanguageContext';

interface BrokerProfilePageProps {
  broker?: Broker | null;
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export const BrokerProfilePage: React.FC<BrokerProfilePageProps> = ({
  broker: propBroker,
  onBack,
  onNavigate,
  onSelectProperty,
}) => {
  const { t } = useLanguage();
  const broker = propBroker || BROKERS_DATA[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [broker.id]);

  const handleWhatsApp = (customMsg?: string) => {
    const defaultMsg = `Hi ${broker.name}! I found your verified profile on Flatzy Kolkata (${broker.agencyName}). I am looking for a flat in Kolkata. Can you share the available 18 flats?`;
    const msg = customMsg || defaultMsg;
    window.open(getWhatsAppUrl(msg, broker.whatsapp), '_blank', 'noopener,noreferrer');
  };

  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Show 2 blurry preview flats
  const relatedProperties = PROPERTIES_DATA.length >= 2
    ? PROPERTIES_DATA.slice(0, 2)
    : [
        PROPERTIES_DATA[0],
        {
          ...PROPERTIES_DATA[0],
          id: 'prop-shapoorji-2bhk-upcoming',
          title: '2 BHK AC Furnished Flat - J Block',
          featuredImage: '/properties/shapoorji/bedroom-ac.jpg',
          floor: '4th Floor',
        }
      ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-flatzy-navy transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('brokerProfile.back')}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('brokerProfile.availableNow')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Hero Profile Banner Header */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-6 md:p-10 shadow-xl border border-slate-800">
          {/* Subtle Geometric Background Pattern & Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-flatzy-yellow/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-start gap-3.5 sm:gap-6 md:gap-8">
            
            {/* Top Identity Block on Mobile (Horizontal) / Left Avatar on Desktop */}
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 sm:gap-4 md:gap-0 shrink-0">
              {/* Broker Avatar with Shield */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-56 md:h-56 rounded-2xl md:rounded-3xl overflow-hidden ring-2 md:ring-4 ring-amber-400/40 shadow-xl bg-slate-800">
                  <img
                    src={broker.avatar}
                    alt={broker.name}
                    className="w-full h-full object-cover object-[center_15%] hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 md:-bottom-2.5 md:-right-2.5 p-0.5 md:p-2.5 rounded-full bg-emerald-500 text-white ring-2 md:ring-4 ring-slate-900 shadow-md" title="Flatzy Verified Partner">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
                </div>
              </div>

              {/* On Mobile only: Name + Badges beside avatar */}
              <div className="flex-1 min-w-0 md:hidden space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-flatzy-yellow/20 text-flatzy-yellow text-[10px] font-bold border border-flatzy-yellow/30">
                    <ShieldCheck className="w-3 h-3 text-flatzy-yellow" />
                    <span>Verified Broker</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>&lt;15 mins</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-lg font-black text-white font-poppins tracking-tight truncate">
                      {broker.name}
                    </h1>
                    <img
                      src="/verified-badge.png"
                      alt="Verified"
                      className="w-4 h-4 shrink-0 object-contain drop-shadow"
                      title="Verified Broker"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[10px] font-black shadow-xs tracking-tight shrink-0">
                    🔥 #1 Trending
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 truncate">
                  <Building className="w-3 h-3 text-flatzy-coral shrink-0" />
                  <span className="truncate">{broker.agencyName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">Kolkata</span>
                </p>
              </div>
            </div>

            {/* Profile Info Details (Desktop full identity + Mobile stats & CTA) */}
            <div className="flex-1 text-center md:text-left space-y-2.5 sm:space-y-3 md:space-y-4 min-w-0">
              
              {/* Desktop-only Badges & Name */}
              <div className="hidden md:block space-y-4">
                <div className="flex flex-wrap items-center justify-start gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-flatzy-yellow/20 text-flatzy-yellow text-xs font-bold border border-flatzy-yellow/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-flatzy-yellow" />
                    <span>Verified Partner</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-xs font-black shadow-xs">
                    <span>🔥 #1 Trending</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>&lt;15 mins</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-start gap-2.5">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-poppins tracking-tight">
                      {broker.name}
                    </h1>
                    <img
                      src="/verified-badge.png"
                      alt="Verified"
                      className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 object-contain drop-shadow"
                      title="Verified Broker"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 font-semibold flex items-center justify-start gap-2 mt-1">
                    <Building className="w-4 h-4 text-flatzy-coral shrink-0" />
                    <span>{broker.agencyName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-bold">Kolkata Division</span>
                  </p>
                </div>
              </div>

              {/* Stat Highlights Bar (Ultra Compact on Mobile, Spacious on Desktop) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 pt-0.5 md:pt-2">
                <div className="p-2 sm:p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Territory</div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-white mt-0.5">Kolkata</div>
                </div>

                <div className="p-2 sm:p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('brokers.experience')}</div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-white mt-0.5">{broker.yearsExperience}+ {t('brokers.years')}</div>
                </div>

                <div className="p-2 sm:p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{t('brokers.availableFlats')}</div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-emerald-300 mt-0.5">18 Active</div>
                </div>

                <div className="p-2 sm:p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-amber-300 uppercase tracking-wider">Rating</div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-amber-300 mt-0.5 flex items-center gap-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-300 text-amber-300" />
                    <span>{broker.rating} ({broker.dealsCount}+)</span>
                  </div>
                </div>
              </div>

              {/* Main Connect Action Button */}
              <div className="pt-1 md:pt-2 flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                <button
                  onClick={() => handleWhatsApp()}
                  className="w-full sm:w-auto px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl md:rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Connect with {broker.name} on WhatsApp</span>
                </button>
                
                <span className="text-[10px] sm:text-xs text-slate-400 flex items-center justify-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct contact • Zero platform commission</span>
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* 2-Column Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Left Column (2 Cols wide on desktop): About, Operating Areas, Specialization & Verified Inventory */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Briefcase className="w-5 h-5 text-flatzy-navy" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-poppins">
                    About {broker.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Flatzy Verified Partner • Trusted On-Ground Specialist
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {broker.about}
              </p>

              {/* Key Trust Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">100% Physical Flat Verification</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Every listed flat has been inspected in person.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Direct Owner Coordination</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">No hidden middle layers or fake listings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hubs in Kolkata */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-flatzy-yellow/20 flex items-center justify-center text-flatzy-navy">
                    <MapPin className="w-5 h-5 text-flatzy-navy" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-poppins">
                      Primary Operating Areas in Kolkata
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      On-demand visits & key handovers available across these zones
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hidden sm:inline-block">
                  Kolkata
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {broker.operatingAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-flatzy-yellow hover:bg-amber-50/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-flatzy-coral shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {area}
                      </span>
                    </div>
                    <button
                      onClick={() => handleWhatsApp(`Hi ${broker.name}, I am looking for flats in ${area}. What options do you have right now?`)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 opacity-80 group-hover:opacity-100 flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialization Badges */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-poppins">
                    Rental Specializations
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Verified property domains handled by {broker.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {broker.specialization.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-2xl bg-amber-50/80 text-amber-950 text-xs sm:text-sm font-bold border border-amber-200/90 shadow-2xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Available Flats Showcase (18 Available Flats - 2 Blurry Previews with Lock) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-poppins">
                      Available Flats (18 Active)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Managed and verified by {broker.name} across Kolkata
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="text-xs font-bold text-flatzy-navy hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Unlock All 18</span>
                </button>
              </div>

              {/* 2 Blurry Flat Cards with Centered Lock Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProperties.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setShowUnlockModal(true)}
                    className="group relative bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden hover:border-amber-300 hover:shadow-soft-lg transition-all cursor-pointer flex flex-col"
                  >
                    {/* Heavily Blurry Flat Content */}
                    <div className="select-none filter blur-md opacity-75 group-hover:blur-lg transition-all duration-300 pointer-events-none scale-102">
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                        <img
                          src={p.featuredImage || p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[10px] font-bold">
                          {p.bedrooms} BHK
                        </div>
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black">
                          ₹{(p.monthlyRent || 0).toLocaleString()}/mo
                        </div>
                      </div>
                      <div className="p-3.5 space-y-1">
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-flatzy-coral shrink-0" />
                          <span className="truncate">{p.subLocation || p.location}, Kolkata</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Centered Lock Button & Overlay */}
                    <div className="absolute inset-0 z-10 bg-slate-950/30 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-center transition-all group-hover:bg-slate-950/40">
                      <div className="w-12 h-12 rounded-2xl bg-white/95 text-slate-900 flex items-center justify-center shadow-lg border border-white/60 mb-2.5 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-amber-500" />
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUnlockModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-flatzy-yellow" />
                        <span>Click to Unlock</span>
                      </button>

                      <p className="text-[10px] text-white/95 font-semibold mt-2 drop-shadow">
                        Verified by {broker.name} • 18 Available
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Unlock Full Catalog CTA */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="text-xs text-emerald-950 font-medium">
                  Looking for the full catalog of <span className="font-bold text-emerald-900">18 Available Flats</span> in Kolkata?
                </div>
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-2xs transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Connect in WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (1 Col wide on desktop): Quick Direct Connect Card & Verified Reviews */}
          <div className="space-y-6">
            
            {/* Sticky Connect Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-5 sticky top-32">
              <div className="space-y-1 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] mx-auto flex items-center justify-center">
                  <WhatsAppIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 font-poppins pt-2">
                  Direct WhatsApp Line
                </h3>
                <p className="text-xs text-slate-500">
                  Zero advance booking fees. Get video walkthroughs and owner connect directly.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleWhatsApp()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat with {broker.name}</span>
                </button>

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant response under 15 minutes</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Flatzy Partner Pledge</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
                  <li>No spam calls or repeated badgering</li>
                  <li>Clear lease documentation support</li>
                  <li>Real flat pictures and videos guaranteed</li>
                </ul>
              </div>

              {/* Verified Tenant Feedback List */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tenant Reviews ({broker.reviews.length})
                  </h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{broker.rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {broker.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {rev.author}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {rev.role}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 italic leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="text-emerald-700 font-semibold">{rev.flatRented}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Unlock Flats WhatsApp Dialog Modal */}
      {showUnlockModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowUnlockModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Lock / WhatsApp Badge */}
            <div className="w-16 h-16 rounded-3xl bg-[#25D366]/15 text-[#25D366] mx-auto flex items-center justify-center shadow-inner">
              <WhatsAppIcon className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Verified Flatzy Inventory</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins">
                Connect in WhatsApp
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Connect directly with {broker.name} on WhatsApp to get the verified photos, video tours, and visit slots for all 18 available flats in Kolkata.
              </p>
            </div>

            {/* Big WhatsApp Connect Button (No number, no copy text) */}
            <div className="pt-1">
              <button
                onClick={() => {
                  handleWhatsApp(`Hi ${broker.name}! I would like to unlock and view the 18 available flats in Kolkata.`);
                  setShowUnlockModal(false);
                }}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Connect in WhatsApp</span>
              </button>

              <p className="text-[11px] text-slate-400 mt-3 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Flatzy Broker • Zero Hidden Fees</span>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
