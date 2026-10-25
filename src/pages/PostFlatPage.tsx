import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail,
  Home, 
  Building, 
  ShieldCheck, 
  Clock,
  Check,
  Briefcase,
  Zap,
  Users,
  MessageSquare,
  FileText,
  Scale,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CommunityListing } from '../types/property';
import { saveCommunityListing } from '../services/communityListingService';
import { getWhatsAppUrl } from '../config/contact';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { useLanguage } from '../context/LanguageContext';

interface PostFlatPageProps {
  onNavigate: (tab: string) => void;
}

export const PostFlatPage: React.FC<PostFlatPageProps> = ({
  onNavigate,
}) => {
  const { t } = useLanguage();
  // Step 1: Role
  const [role, setRole] = useState<'Owner' | 'Broker'>('Owner');

  // Step 2: Contact
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refId = `FLZ-ONB-${Math.floor(100 + Math.random() * 900)}`;

    const newCommunityListing: CommunityListing = {
      id: `onboard-${Date.now()}`,
      slug: `onboard-${role.toLowerCase()}-${Date.now()}`,
      title: `Listing Request by ${role} ${fullName}`,
      location: 'New Town',
      subLocation: 'Kolkata',
      address: 'Kolkata',
      monthlyRent: 0,
      securityDeposit: 0,
      maintenanceCharges: 0,
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      superBuiltupAreaSqFt: 1000,
      floor: '3rd Floor',
      propertyType: role === 'Owner' ? 'Apartment' : 'Gated Community',
      furnishing: 'Semi Furnished',
      availableFrom: 'Immediate',
      amenities: [],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      description: `Onboarding inquiry by ${role} ${fullName} (+91 ${phone})`,
      whyYouWillLoveIt: [],
      suitableFor: ['Working Professionals', 'Family'],
      tags: ['Partner Verified', role],
      commuteHighlight: '🚇 Prime transit access in Kolkata',
      coordinates: { lat: 22.58, lng: 88.42 },
      nearbyLandmarks: [],
      brokerReferenceId: refId,
      createdDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'pending',
      submittedByRole: role,
      submitterName: fullName,
      submitterPhone: phone,
      submitterAgency: agencyName || undefined,
      rawPastedText: email ? `Email: ${email}` : undefined
    };

    saveCommunityListing(newCommunityListing);

    setSubmittedRef(refId);
    setIsSubmitting(false);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#25D366', '#128C7E', '#FFC800', '#FF5722']
      });
    } catch {}

    // Directly open WhatsApp with formatted details requested by user
    const msg = 
      `*FLATZY LISTING*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Full Name:* ${fullName}\n` +
      `• *WhatsApp Number:* +91 ${phone}\n` +
      (email ? `• *Email Address:* ${email}\n` : '') +
      `• *Role:* ${role === 'Owner' ? 'Property Owner' : 'Real Estate Broker'}\n` +
      (agencyName ? `• *Agency/Firm:* ${agencyName}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Flatzy Team! I want to start listing my flat. I will share flat photos, society name, and expected rent here.`;

    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppNotify = () => {
    const msg = 
      `*FLATZY LISTING*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Full Name:* ${fullName}\n` +
      `• *WhatsApp Number:* +91 ${phone}\n` +
      (email ? `• *Email Address:* ${email}\n` : '') +
      `• *Role:* ${role === 'Owner' ? 'Property Owner' : 'Real Estate Broker'}\n` +
      (agencyName ? `• *Agency/Firm:* ${agencyName}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Flatzy Team! I want to start listing my flat. I will share flat photos, society name, and expected rent here.`;

    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Hero Banner with Blended Generated Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF7] via-amber-50/80 to-orange-50/60 p-6 sm:p-8 lg:p-10 border border-amber-200/80 shadow-soft">
        
        {/* Blended Background Illustration on Right Side */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 md:w-1/2 lg:w-[48%] pointer-events-none overflow-hidden select-none">
          <img
            src="/list-flat-banner.jpg"
            alt="Owner and Broker Flat Listing Onboarding"
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-75 md:opacity-85 mix-blend-multiply"
          />
          {/* Multi-directional gradient feathering for seamless blend into card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF7] via-[#FFFDF7]/85 sm:via-[#FFFDF7]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF7]/80 via-transparent to-[#FFFDF7]/40" />
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-flatzy-yellow/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Bar inside banner: Status Pill + Discreet Admin Desk */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-flatzy-navy text-xs font-bold border border-amber-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('post.badge')}</span>
            </div>

            {/* Direct WhatsApp Onboard Button */}
            <button
              onClick={() => {
                const msg = `Hi Flatzy team! I want to list my flat on Flatzy Kolkata. Please onboard me via WhatsApp.`;
                window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black shadow-soft transition-all hover:scale-105 active:scale-95"
              title="Skip typing and onboard directly on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>{t('post.whatsappOnboard')}</span>
            </button>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-2.5 max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-flatzy-navy font-poppins tracking-tight leading-tight">
              {t('post.title')}{' '}
              <span className="bg-gradient-to-r from-flatzy-coral via-amber-600 to-amber-500 bg-clip-text text-transparent">
                {t('post.titleHighlight')}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg lg:max-w-xl">
              {t('post.desc')}
            </p>
          </div>

          {/* Value Props & Trust Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('post.zeroFee')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('post.directWa')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('post.verified')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-flatzy-coral" />
              <span>{t('post.rapidOnboard')}</span>
            </div>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        /* Confirmation & Onboarding Success State */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-soft space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-soft">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-flatzy-navy font-poppins">
              {t('post.successTitle')}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-800">{fullName}</strong>! Your listing details have been prepared for our Kolkata onboarding team. WhatsApp should open automatically.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2.5 text-xs max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Onboarding Role:</span>
              <span className="font-bold text-slate-800">{role === 'Owner' ? 'Property Owner' : 'Real Estate Broker'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="font-bold text-slate-800">{fullName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">WhatsApp Number:</span>
              <span className="font-black text-emerald-700">+91 {phone}</span>
            </div>
            {email && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Email Address:</span>
                <span className="font-medium text-slate-800">{email}</span>
              </div>
            )}
            {agencyName && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Agency / Firm:</span>
                <span className="font-bold text-slate-800">{agencyName}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Next Step:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                💬 Forward photos & rent in WhatsApp chat
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 max-w-md mx-auto">
            <button
              onClick={handleWhatsAppNotify}
              className="relative w-full overflow-hidden group py-4 px-6 rounded-2xl bg-gradient-to-r from-[#20bd5a] via-[#25D366] to-[#128C7E] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border-t border-white/30 flex items-center justify-center gap-3 cursor-pointer"
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              <div className="relative z-10 flex items-center justify-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shrink-0">
                  <WhatsAppIcon className="w-4.5 h-4.5 text-white drop-shadow-xs" />
                </div>
                <span className="font-extrabold tracking-tight text-white drop-shadow-xs">
                  {t('post.submitBtn')}
                </span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
              </div>
            </button>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFullName('');
                setPhone('');
                setEmail('');
                setAgencyName('');
              }}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              {t('post.anotherListing')}
            </button>
          </div>
        </div>
      ) : (
        /* The Structured 3-Step Onboarding Form + Desktop Sticky Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Main 3-Step Form (8 Columns on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleOnboardingSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-6">
          
          {/* STEP 1: ROLE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-flatzy-navy text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-base sm:text-lg font-black text-flatzy-navy font-poppins">
                Who are you? *
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div
                onClick={() => setRole('Owner')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                  role === 'Owner'
                    ? 'bg-amber-50/70 border-flatzy-yellow ring-2 ring-flatzy-yellow/30 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${role === 'Owner' ? 'bg-flatzy-yellow text-flatzy-navy' : 'bg-slate-200 text-slate-600'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-sm font-black text-flatzy-navy flex items-center gap-1.5">
                    <span>Flat Owner</span>
                    {role === 'Owner' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    It's my flat & I want tenants
                  </p>
                </div>
              </div>

              <div
                onClick={() => setRole('Broker')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                  role === 'Broker'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300/40 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${role === 'Broker' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-sm font-black text-flatzy-navy flex items-center gap-1.5">
                    <span>Broker / Agent</span>
                    {role === 'Broker' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    I represent properties in Kolkata
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: YOUR CONTACT */}
          <div className="space-y-3.5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-flatzy-navy text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-base sm:text-lg font-black text-flatzy-navy font-poppins">
                Your Details *
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sourav Mukherjee"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-flatzy-yellow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98300 12345"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-flatzy-yellow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-flatzy-yellow"
                  />
                </div>
              </div>

              {role === 'Broker' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Agency Name (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Salt Lake Estates"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-flatzy-yellow"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action: Connect in WhatsApp to start listing */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden group py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#20bd5a] via-[#25D366] to-[#128C7E] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border-t border-white/35 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <div className="relative z-10 flex items-center justify-center gap-2.5 w-full">
                {isSubmitting ? (
                  <span className="font-bold text-sm sm:text-base">
                    Opening WhatsApp...
                  </span>
                ) : (
                  <>
                    <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                    <span className="font-extrabold text-sm sm:text-base text-white">
                      Send Details on WhatsApp
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                  </>
                )}
              </div>
            </button>

            <div className="text-center text-[11px] text-slate-500 font-medium">
              Free to list • Send flat photos & expected rent in chat
            </div>
          </div>

        </form>
      </div>

      {/* Desktop Sticky Sidebar: Terms and Highlights */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-24">
        
        {/* Simple Terms & Commission Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              How it works
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Flatzy</span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-black font-poppins text-white">
              Listing Terms & Commission
            </h3>
            <p className="text-xs text-slate-400">
              Clear and straightforward rules.
            </p>
          </div>

          {/* 3 Simple Non-Technical Terms */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-emerald-400">✓</span> 1. Free to list
              </div>
              <p className="text-[11px] text-slate-300 pl-4">
                No upfront fee. Posting your flat is 100% free.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-amber-400">✓</span> 2. Pay only after deal is done
              </div>
              <p className="text-[11px] text-slate-300 pl-4">
                A commission is charged only when a tenant finalizes your flat.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-indigo-400">✓</span> 3. Same rule for Owner & Broker
              </div>
              <p className="text-[11px] text-slate-300 pl-4">
                Applies equally whether you are an owner or an agent.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const msg = `Hi Flatzy! I have a question regarding listing my flat.`;
              window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Have questions? Chat with us</span>
          </button>
        </div>

        {/* Why Flatzy */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Why list with us?
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <p className="text-slate-300">
                <strong className="text-white">Genuine tenants:</strong> IT working professionals from TCS, Cognizant, Wipro & PwC.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <p className="text-slate-300">
                <strong className="text-white">Direct WhatsApp pings:</strong> No spam calls, talk directly to interested people.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <p className="text-slate-300">
                <strong className="text-white">Fast onboarding:</strong> Send photos on WhatsApp and we handle the rest.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )}

    </div>
  );
};
