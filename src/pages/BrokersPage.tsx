import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Award, 
  MessageSquare,
  Sparkles,
  Users,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { BROKERS_DATA, type Broker } from '../data/brokersData';
import { getWhatsAppUrl } from '../config/contact';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import ProfileCard from '../components/ProfileCard';
import { useLanguage } from '../context/LanguageContext';

interface BrokersPageProps {
  onNavigate: (tab: string) => void;
  onSelectBroker?: (broker: Broker) => void;
  onOpenListProperty?: () => void;
}

export const BrokersPage: React.FC<BrokersPageProps> = ({ onNavigate, onSelectBroker, onOpenListProperty }) => {
  const { t } = useLanguage();
  const handleOpenBroker = (broker: Broker) => {
    if (onSelectBroker) {
      onSelectBroker(broker);
    } else {
      window.location.hash = `broker/${broker.id}`;
      onNavigate('broker-detail');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner - Clean Compact Studio Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF8] via-[#FFF9ED] to-[#FFF3DC] p-5 sm:p-7 md:p-8 border-2 border-amber-300/80 shadow-[0_10px_30px_-15px_rgba(245,158,11,0.15)]">
        
        {/* Blended Background Illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-8/12 md:w-7/12 lg:w-[60%] pointer-events-none overflow-hidden select-none">
          <img
            src="/kolkata-art-banner.jpg"
            alt="Kolkata Heritage and Skyline"
            className="w-full h-full object-cover object-right-bottom opacity-35 sm:opacity-75 md:opacity-90 mix-blend-multiply"
          />
          {/* Feathered gradient transitions to keep left text razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF8] via-[#FFFDF8]/80 sm:via-[#FFFDF8]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8]/80 via-transparent to-[#FFFDF8]/30" />
        </div>

        {/* Ambient Subtle Warm Glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Content Container */}
        <div className="relative z-10 max-w-lg lg:max-w-xl text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] sm:text-xs font-bold border border-amber-200/90 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tracking-tight">{t('brokers.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 font-poppins tracking-tight leading-[1.18]">
            {t('brokers.title')}{' '}
            <span className="text-[#FF5C38]">
              {t('brokers.titleHighlight')}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-md">
            {t('brokers.desc')}
          </p>

          {/* Quick Action: List Flat Button (Vibrant Emerald Green) & Onboarding Note */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
            <button
              onClick={() => onOpenListProperty?.()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 group w-fit cursor-pointer border border-emerald-500"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <span className="text-xs leading-none font-black">+</span>
              </div>
              <span className="tracking-wide">+ List a Flat (Broker / Owner)</span>
            </button>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span className="text-amber-500">⚡</span> 2-minute quick onboarding
            </span>
          </div>
        </div>
      </div>

      {/* Broker Cards Showcase with ProfileCard from React Bits */}
      <div className="max-w-6xl mx-auto w-full pt-2">
        <div className="flex flex-wrap items-center justify-center gap-8 py-4">
          {BROKERS_DATA.map((broker) => (
            <div key={broker.id} className="flex flex-col items-center group/card">
              <div className="transform transition-transform duration-300 hover:scale-[1.02]">
                <ProfileCard
                  name={broker.name}
                  title={`${broker.agencyName} • ${broker.yearsExperience} Yrs Exp`}
                  handle={broker.id.replace('broker-', '')}
                  status={broker.isVerified ? "Verified Partner" : "Broker"}
                  statusColor="#22c55e"
                  contactText="Contact"
                  avatarUrl={broker.avatar}
                  miniAvatarUrl={broker.avatar}
                  holo={0.85}
                  glare={0.55}
                  tiltStrength={14}
                  parallax={10}
                  radius={20}
                  enableTilt={true}
                  intro={true}
                  showUserInfo={true}
                  enableMobileTilt={false}
                  theme="light"
                  objectPosition="center 15%"
                  onContactClick={() => {
                    const msg = `Hi ${broker.name}! I found your profile on Flatzy (${broker.agencyName}). Can you assist with flats in ${broker.primaryLocation}?`;
                    window.open(getWhatsAppUrl(msg), '_blank');
                  }}
                />
              </div>

              {/* Action buttons under card */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => handleOpenBroker(broker)}
                  className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-soft hover:shadow-soft-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>{t('brokers.viewProfile')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const msg = `Hi ${broker.name}! I found your profile on Flatzy (${broker.agencyName}). Can you assist with flats in ${broker.primaryLocation}?`;
                    window.open(getWhatsAppUrl(msg), '_blank');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-soft hover:shadow-soft-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Partner Callout */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft text-center space-y-4 max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-flatzy-yellow/20 text-flatzy-navy mx-auto flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-flatzy-navy" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-flatzy-navy font-poppins">
            {t('brokers.partnerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Get listed on Kolkata’s fastest growing rental discovery platform. Reach pre-verified tech professionals and families with zero upfront fees.
          </p>
        </div>
        <button
          onClick={() => {
            const msg = 'Hi I want to be a part of flatzy broker';
            const url = getWhatsAppUrl(msg);
            try {
              window.open(url, '_blank', 'noopener,noreferrer');
            } catch {
              window.location.href = url;
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider shadow-soft hover:shadow-soft-lg transition-all active:scale-95"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>+ Onboard as Broker</span>
        </button>
      </div>

    </div>
  );
};
