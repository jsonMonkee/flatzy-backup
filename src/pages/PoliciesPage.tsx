import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Users
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/contact';

interface PoliciesPageProps {
  onNavigate: (tab: string) => void;
  onOpenInquiryModal: () => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  onNavigate,
  onOpenInquiryModal,
}) => {
  const [activeTab, setActiveTab] = useState<'brokers' | 'tenants' | 'flatzymate'>('brokers');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const brokerFaqs = [
    {
      q: 'Do I have to pay to upload property videos?',
      a: 'Zero fees. Listing and uploading walkthrough videos of your Kolkata properties on Flatzy is 100% free with zero upfront charges.'
    },
    {
      q: 'How does onboarding documentation work?',
      a: 'Once you partner with Flatzy, we email you a clear official Onboarding Documentation detailing mutual commitments, verified listing guidelines, and commission arrangements.'
    },
    {
      q: 'When is commission charged?',
      a: 'Commission is only based on the official onboarding documentation agreed upon, payable strictly when a genuine tenant lead sourced through Flatzy closes and rents the property.'
    },
    {
      q: 'How does lead routing work?',
      a: 'All prospective tenant leads go through our curated medium. Our team verifies the lead’s move-in budget and date before putting them in direct contact with you.'
    }
  ];

  const tenantFaqs = [
    {
      q: 'Does Flatzy charge tenants or home-seekers any discovery fee?',
      a: 'No discovery fee. Browsing flats, watching real camera video tours, and connecting with verified local brokers through Flatzy is completely free.'
    },
    {
      q: 'Why does Flatzy ask for exact budget and move-in date?',
      a: 'To eliminate spam and ensure serious, timely matches. We receive numerous inquiries daily, and specifying your true requirements lets us provide immediate, dedicated assistance.'
    },
    {
      q: 'Are bachelors and students welcome?',
      a: 'Yes! Every property on Flatzy is clearly tagged upfront so you know beforehand if bachelors, students, working couples, or families are accepted without moral policing.'
    },
    {
      q: 'What happens after I enquire about a flat?',
      a: 'We review your request, confirm the vacancy is live, and connect you straight to the verified broker or property manager holding the keys.'
    }
  ];

  const flatzymateFaqs = [
    {
      q: 'Are my personal photos exposed on Flatzy?',
      a: 'Never. Flatzymate uses safe, high-resolution 3D cartoon avatars instead of real photos to protect your privacy across search results.'
    },
    {
      q: 'Who gets access to my WhatsApp number?',
      a: 'Your WhatsApp number is strictly encrypted and protected. Prospective flatmates must verify their own requirement before unlocking contact.'
    },
    {
      q: 'What is the difference between Team-Up and Room in Flat?',
      a: 'Team-Up means you want to find a compatible roommate first and rent a 2 or 3 BHK together. Room in Flat means you already have a flat with an empty private room available.'
    },
    {
      q: 'How is spam prevented in Flatzymate listings?',
      a: 'All profiles have minimum budget thresholds (₹9k for 1 BHK, ₹18k for 2 BHK, etc.) and lifestyle tags (diet, smoking, religion, occupation) to eliminate low-effort or fraudulent postings.'
    }
  ];

  const currentFaqs = activeTab === 'brokers' 
    ? brokerFaqs 
    : activeTab === 'tenants' 
    ? tenantFaqs 
    : flatzymateFaqs;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Scenic Cityscape Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[650px] sm:h-[800px] bg-top bg-cover bg-no-repeat pointer-events-none opacity-30 sm:opacity-40"
        style={{ backgroundImage: "url('/city-bg.png')" }}
      />
      <div className="absolute top-0 left-0 right-0 h-[650px] sm:h-[800px] bg-gradient-to-b from-white/20 via-transparent to-[#FAF9F6] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-14 space-y-8 sm:space-y-12 animate-in fade-in duration-300">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-flatzy-yellow/25 border border-flatzy-yellow/50 text-flatzy-navy text-[11px] sm:text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-flatzy-navy" />
            <span>Fair Deal & Platform Integrity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-flatzy-navy font-poppins tracking-tight">
            Flatzy Platform Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Clear, transparent ground rules built for verified brokers and serious tenants. No hidden terms, no ghost listings, and zero spam.
          </p>
        </div>

        {/* Audience Toggle (Brokers vs Tenants vs Flatzymate) */}
        <div className="max-w-lg mx-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 grid grid-cols-3 gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => { setActiveTab('brokers'); setActiveFaq(null); }}
            className={`py-2 sm:py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'brokers'
                ? 'bg-white text-flatzy-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">For Brokers</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('tenants'); setActiveFaq(null); }}
            className={`py-2 sm:py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tenants'
                ? 'bg-white text-flatzy-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">For Tenants</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('flatzymate'); setActiveFaq(null); }}
            className={`py-2 sm:py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'flatzymate'
                ? 'bg-white text-flatzy-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">Flatzymate</span>
          </button>
        </div>

        {/* ── TAB 1: POLICIES FOR BROKERS ── */}
        {activeTab === 'brokers' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Top Highlight Banner */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md inline-block">
                Kolkata Real Estate Partners
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-poppins">
                Brokers Are Warmly Welcomed at Flatzy 🤝
              </h2>
              <p className="text-xs sm:text-sm text-amber-50 leading-relaxed max-w-2xl">
                We respect your effort in sourcing properties. Flatzy acts as your discovery multiplier: you bring verified flats and videos, and we connect you directly with qualified tech professionals and families.
              </p>
            </div>

            {/* 3 Colored Broker Policy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1: Official Onboarding Documentation (Warm Amber/Honey gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-soft border border-amber-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">📄</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-amber-100">
                    Direct Email Contract
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Official Onboarding Documentation
                  </h3>
                  <p className="text-xs text-amber-50/90 leading-relaxed">
                    Upon onboarding, we send you an official documentation contract to your email with mutual agreements, clear operating terms, and verified listing standards.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-amber-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Delivered straight to your inbox</span>
                </div>
              </div>

              {/* Card 2: 100% Free Video Uploading (Vibrant Emerald/Teal gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-soft border border-emerald-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🎬</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                    Zero Upfront Cost
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Zero Fee Video Uploading
                  </h3>
                  <p className="text-xs text-emerald-50/90 leading-relaxed">
                    There is absolutely no fee to upload your property videos or list flats on Flatzy. Video tours give your properties 5x higher engagement and credibility.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-emerald-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>₹0 listing or marketing charge</span>
                </div>
              </div>

              {/* Card 3: Commission on Successful Deal (Royal Indigo/Violet gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-soft border border-indigo-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">💰</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                    Win-Win Partnership
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Agreed Commission on Deal Close
                  </h3>
                  <p className="text-xs text-indigo-50/90 leading-relaxed">
                    If an interested lead converts and rents the flat through our medium, commission applies strictly as per the mutual onboarding documentation agreed upon.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-indigo-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Transparent & win-win model</span>
                </div>
              </div>

            </div>

            {/* Broker Action CTA */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm sm:text-base font-black text-flatzy-navy">
                  Want to Onboard as a Verified Flatzy Broker?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reach verified tenants moving into New Town, Salt Lake, and Sector V.
                </p>
              </div>
              <a
                href={getWhatsAppUrl("Hi Flatzy! I am a real estate broker in Kolkata and want to onboard.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Onboard on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

        {/* ── TAB 2: POLICIES FOR TENANTS ── */}
        {activeTab === 'tenants' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Top Highlight Banner */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md inline-block">
                For Genuine Renters
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-poppins">
                100% Transparency. Zero Time-Wasting 🛡️
              </h2>
              <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-2xl">
                We are committed to helping genuine people find flats quickly. To protect everyone's time and guarantee genuine matches, we maintain strict anti-spam policies.
              </p>
            </div>

            {/* 3 Colored Tenant Policy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1: Strict Zero Spam Policy (Rose/Pink gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white shadow-soft border border-rose-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🚫</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-rose-100">
                    Anti-Spam Shield
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Zero Spam & No Time-Waste
                  </h3>
                  <p className="text-xs text-rose-50/90 leading-relaxed">
                    We don't tolerate spam or casual inquiries. Both your time and our partners' time are valuable. Inquire only if you are genuinely looking to rent in Kolkata.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-rose-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Serious inquiries prioritized</span>
                </div>
              </div>

              {/* Card 2: Real Tenants, Dedicated Care (Warm Amber/Orange gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-soft border border-amber-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🤝</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-amber-100">
                    Fast Verification
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Real Tenants, Dedicated Care
                  </h3>
                  <p className="text-xs text-amber-50/90 leading-relaxed">
                    We receive numerous inquiries every single day. By filtering out spam, we ensure genuine tenants receive immediate attention and swift physical visits.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-amber-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Fast WhatsApp verification</span>
                </div>
              </div>

              {/* Card 3: Free Platform for Renters (Emerald/Teal gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-soft border border-emerald-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🎟️</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                    100% Free for Renters
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Zero Discovery Fee for Renters
                  </h3>
                  <p className="text-xs text-emerald-50/90 leading-relaxed">
                    Searching flats, viewing video walkthroughs, and getting connected with property contacts through Flatzy is completely free for all renters and flatmates.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-emerald-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Free & transparent search</span>
                </div>
              </div>

            </div>

            {/* Tenant Action CTA */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm sm:text-base font-black text-flatzy-navy">
                  Looking for a Flat in Kolkata?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse verified flats or send your requirements directly to our team.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenInquiryModal}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enquire For Flat</span>
              </button>
            </div>

          </div>
        )}

        {/* ── TAB 3: POLICIES FOR FLATZYMATE ── */}
        {activeTab === 'flatzymate' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Top Highlight Banner */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md inline-block">
                Privacy-First Roommate Community
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-poppins">
                Flatzymate Community Ground Rules 🤝
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-2xl">
                Flatzymate is built to help working professionals and students find compatible roommates across Kolkata safely. No creepy cold calls, zero public photo scraping, and strict anti-spam minimum budgets.
              </p>
            </div>

            {/* 3 Colored Flatzymate Policy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1: 100% Photo Privacy via 3D Avatars (Sky/Cyan/Blue gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white shadow-soft border border-sky-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🎭</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-sky-100">
                    Cartoon Identity
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    100% Privacy • No Real Photos
                  </h3>
                  <p className="text-xs text-sky-50/90 leading-relaxed">
                    You never have to post real personal photos publicly. Flatzymate provides handcrafted 3D cartoon avatars to keep your profile expressive, safe, and spam-free.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-sky-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Zero public photo scraping</span>
                </div>
              </div>

              {/* Card 2: Encrypted Direct WhatsApp Sharing (Emerald/Teal gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-soft border border-emerald-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🔒</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                    Protected Number
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Verified WhatsApp Sharing
                  </h3>
                  <p className="text-xs text-emerald-50/90 leading-relaxed">
                    Your phone number is locked safely. It is never broadcasted to bots. Prospective flatmates must submit verified criteria to connect with you.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-emerald-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Protected against cold spam</span>
                </div>
              </div>

              {/* Card 3: Minimum Budget & Lifestyle Filtering (Amber/Orange gradient) */}
              <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-soft border border-amber-400/50 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center font-black shadow-2xs border border-white/30">
                    <span className="text-xl leading-none" aria-hidden="true">🎯</span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-amber-100">
                    Quality Filtered
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-poppins leading-snug">
                    Realistic Thresholds & Lifestyle Tags
                  </h3>
                  <p className="text-xs text-amber-50/90 leading-relaxed">
                    Every profile requires realistic minimum budget limits (₹9k+ 1BHK, ₹18k+ 2BHK) along with transparent diet, smoking, and profession tags to ensure genuine roommate harmony.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black text-amber-100 border-t border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Verified realistic listings</span>
                </div>
              </div>

            </div>

            {/* Flatzymate Action CTA */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm sm:text-base font-black text-flatzy-navy">
                  Looking for a Roommate in Kolkata?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore verified roommate profiles or post your own requirement in 1 minute.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('roommates')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Explore Flatzymate</span>
              </button>
            </div>

          </div>
        )}

        {/* ── FAQ ACCORDION SECTION ── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-soft space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-flatzy-navy" />
            <h3 className="text-lg sm:text-xl font-black text-flatzy-navy font-poppins">
              Frequently Asked Questions ({activeTab === 'brokers' ? 'Brokers' : activeTab === 'tenants' ? 'Tenants' : 'Flatzymate'})
            </h3>
          </div>

          <div className="space-y-2.5">
            {currentFaqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-flatzy-navy hover:bg-slate-50/80 transition-all cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-flatzy-navy' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
