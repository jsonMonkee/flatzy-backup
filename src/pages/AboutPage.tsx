import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  Compass,
  Instagram,
  ArrowRight,
  MessageSquare,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl, FLATZY_INSTAGRAM_URL, FLATZY_EMAIL } from '../config/contact';
import MaskedHeading from '../components/MaskedHeading';
import AnimatedContent from '../components/AnimatedContent';
import BounceCards from '../components/BounceCards';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
  onOpenInquiryModal: () => void;
}

/* Small royal divider ornament — gold hairlines meeting a diamond */
const Ornament: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="block w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#C9A24B]/80" />
    <span className="ornament-diamond rotate-45 w-1.5 h-1.5 bg-[#C9A24B] shadow-[0_0_8px_rgba(201,162,75,0.6)]" />
    <span className="block w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[#C9A24B]/80" />
  </div>
)

/* Eyebrow label used above each section title */
const Eyebrow: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A8842E]">
    {icon}
    {children}
  </span>
)

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenInquiryModal,
}) => {
  const { t } = useLanguage();

  const metrics = [
    { value: '100%', label: 'Video Verified', sub: 'Zero fake photos' },
    { value: '₹0', label: 'Renter Fee', sub: '100% free discovery' },
    { value: '24h', label: 'Direct Connect', sub: 'Verified keyholders' },
    { value: '5+', label: 'Prime Hubs', sub: 'Sector V to Salt Lake' }
  ];

  const storyChapters = [
    {
      num: '01',
      title: 'No Ghost Listings',
      subtitle: 'Verified by Camera',
      content: 'No misleading photos or inactive contacts. Every flat is physically inspected and recorded candidly.'
    },
    {
      num: '02',
      title: 'The Discovery Medium',
      subtitle: 'Curated Like Zomato',
      content: 'We curate vacancies and connect you directly with genuine keyholders with zero gatekeeping.'
    },
    {
      num: '03',
      title: 'Respectful Living',
      subtitle: 'Zero Moral Policing',
      content: 'Students, professionals, bachelors, or families — honest home tags with upfront transparency.'
    }
  ];

  const neighborhoods = [
    { name: 'Sector V', vibe: 'Tech Corridor', icon: '💼' },
    { name: 'New Town', vibe: 'Modern High-Rise', icon: '🏙️' },
    { name: 'Salt Lake', vibe: 'Quiet Heritage', icon: '🌳' },
    { name: 'Shapoorji', vibe: 'Student & Youth Hub', icon: '🎓' }
  ];

  const ecosystem = [
    {
      tab: 'explore',
      emoji: '🏠',
      pill: 'Flats',
      title: 'Flatzy Verified Flats',
      desc: 'Raw room video walkthroughs. Connect directly to verified property keyholders.',
      cta: 'Browse Flats'
    },
    {
      tab: 'roommates',
      emoji: '🤝',
      pill: 'Flatzymate',
      title: 'Flatzymate Roommates',
      desc: '100% privacy with cute 3D avatars. Team up to share 2–3 BHK flats and save 50%.',
      cta: 'Find Roommates'
    },
    {
      tab: 'brokers',
      emoji: '👔',
      pill: 'Brokers',
      title: 'Verified Broker Guild',
      desc: 'Upload walkthroughs with zero upfront fee. Direct connection with move-in ready tenants.',
      cta: 'Broker Network'
    }
  ];

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveChapterIndex((prev) => (prev + 1) % storyChapters.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [storyChapters.length]);

  const bounceImages = [
    { src: '/properties/avenida-courtyard/central-courtyard-patio.jpg', alt: 'Avenida Luxury Courtyard' },
    { src: '/properties/ideal-aquaview/living-balcony-view.jpg', alt: 'Ideal Aquaview Balcony' },
    { src: '/banner-ecospace-pool.jpg', alt: 'Ecospace Tech Hub Pool & Garden' },
    { src: '/properties/siddha-pines/living-room.jpg', alt: 'Siddha Pines Rajarhat' },
    { src: '/kolkata-howrah-sketch.jpg', alt: 'Heritage Kolkata City of Joy' }
  ];

  const ecosystemCards = ecosystem.map((e) => ({
    alt: e.title,
    content: (
      <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-white to-[#FBF6EA] text-left select-none">
        <div className="flex items-center justify-between">
          <span className="text-2xl" aria-hidden="true">{e.emoji}</span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A6D2B] border border-[#C9A24B]/60 px-1.5 py-0.5 rounded-sm bg-[#C9A24B]/10">
            {e.pill}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-display font-bold text-[#0B132B] leading-snug">{e.title}</h4>
          <p className="text-[11px] text-slate-500 leading-tight mt-1">{e.desc}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#8A6D2B] pt-1">
          <span>{e.cta}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    )
  }));

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-slate-800 font-poppins selection:bg-[#C9A24B]/30 selection:text-[#0B132B] overflow-hidden relative">

      {/* ── Phone: golden Kolkata riverfront backdrop (Victoria Memorial & Howrah at sunrise) ── */}
      <div
        className="md:hidden fixed inset-0 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: "url('/kolkata-riverfront-mobile-bg.webp')" }}
      />
      <div className="md:hidden fixed inset-0 pointer-events-none bg-gradient-to-b from-[#FBF8F1]/90 via-[#FBF8F1]/55 to-[#FBF8F1]/80" />

      {/* ── Desktop royal backdrop: pearl wash, faint heritage texture, soft gold light ── */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-top pointer-events-none opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: "url('/kolkata-soft-bg.jpg')" }}
      />
      <div
        className="hidden md:block absolute top-0 left-0 right-0 h-[850px] bg-top bg-cover bg-no-repeat pointer-events-none opacity-15"
        style={{ backgroundImage: "url('/city-bg.png')" }}
      />
      <div className="hidden md:block absolute top-0 left-0 right-0 h-[850px] bg-gradient-to-b from-white/40 via-transparent to-[#FBF8F1] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-[#C9A24B]/[0.10] blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute top-[900px] -right-40 w-[420px] h-[420px] bg-[#F3EAD6]/70 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute top-[1800px] -left-40 w-[420px] h-[420px] bg-[#C9A24B]/[0.07] blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16 animate-in fade-in duration-200">

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 1. ROYAL HERO — seal, crest line, masked serif headline */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          <div className="royal-breathe inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#C9A24B]/50 text-[#8A6D2B] text-[10px] font-semibold uppercase tracking-[0.3em] mt-4 sm:mt-6">
            <Crown className="w-3.5 h-3.5" />
            <span>Kolkata&rsquo;s Rental Discovery Medium</span>
          </div>

          <div className="w-full max-w-2xl mx-auto py-1">
            <MaskedHeading
              text="KOLKATA RENTALS"
              tag="h1"
              mediaType="image"
              src="/kolkata-art-banner.jpg"
              fillScale={1.3}
              parallax={32}
              reveal="rise"
              trigger="view"
              spotlight={true}
              spotlightRadius={180}
              sepia={1}
              saturation={3.2}
              brightness={0.98}
              outline={true}
              outlineColor="#8A6D2B"
              outlineWidth={1}
              weight={900}
              align="center"
              textScale={0.11}
              className="font-display select-none"
            />
            <div className="text-2xl sm:text-4xl font-display font-medium text-[#0B132B] tracking-tight mt-4">
              Royal Grace &amp; <span className="text-gold-gradient italic">True Transparency</span>
            </div>
          </div>

          <Ornament className="pt-1" />

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            Candid video tours, vetted local brokers, and verified roommate matches —
            every listing inspected before it earns its place.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="royal-shine group w-full sm:w-auto px-7 py-3 rounded-full bg-[#0B132B] hover:bg-[#1C2541] text-[#F5D98B] font-semibold text-xs uppercase tracking-[0.2em] shadow-[0_8px_24px_-8px_rgba(11,19,43,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(11,19,43,0.55)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 transition-transform duration-700 ease-out group-hover:rotate-[180deg]" />
              <span>Explore Verified Flats</span>
            </button>

            <a
              href={FLATZY_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-6 py-3 rounded-full bg-white/70 hover:bg-white text-slate-700 hover:text-[#8A6D2B] font-medium text-xs uppercase tracking-[0.2em] border border-[#C9A24B]/40 hover:border-[#C9A24B]/80 shadow-xs hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Instagram className="w-4 h-4 text-[#A8842E] transition-transform duration-300 group-hover:scale-110" />
              <span>@flatzy.in Video Tours</span>
            </a>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 2. CURATED RESIDENCES — interactive fan deck */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="relative py-2 space-y-6">
          <div className="group text-center space-y-2 max-w-xl mx-auto cursor-default">
            <Eyebrow icon={<ShieldCheck className="w-3 h-3" />}>The Private Collection</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0B132B] tracking-tight">
              Curated Kolkata Residences
            </h2>
            <span className="block mx-auto h-px w-24 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
            <p className="text-sm text-slate-500 font-normal">
              Hover or tap any card to spread verified spaces across New Town &amp; Salt Lake.
            </p>
          </div>

          <div className="w-full flex items-center justify-center overflow-visible py-2">
            <BounceCards
              images={bounceImages}
              containerWidth={500}
              containerHeight={300}
              cardSize={180}
              spread={70}
              rotation={8}
              arc={10}
              pushDistance={140}
              hoverScale={1.08}
              bounciness={0.65}
              animationDelay={0.3}
              animationStagger={0.07}
              borderWidth={3}
              borderColor="#ffffff"
              radius={10}
              shadow={true}
              enableHover={true}
              onCardClick={() => onNavigate('explore')}
              className="mx-auto select-none"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 3. ROYAL COVENANT — stats in hairline-gold plaques */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <div className="text-center">
            <Eyebrow>The Royal Covenant</Eyebrow>
          </div>
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.8}
            stagger={0.1}
            threshold={0.15}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5"
          >
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="hairline-gold royal-shine rounded-xl p-5 sm:p-6 text-center space-y-1.5 bg-white hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-12px_rgba(164,132,46,0.4)] transition-all duration-300"
                style={{ ['--panel-bg' as any]: '#FFFFFF' }}
              >
                <div className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient leading-tight">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#0B132B] tracking-wide">
                  {m.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  {m.sub}
                </div>
              </div>
            ))}
          </AnimatedContent>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 4. THE FLATZY STANDARD — editorial manifesto, single illuminated card */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <div className="group text-center space-y-3 max-w-xl mx-auto cursor-default">
            <Eyebrow icon={<Sparkles className="w-3 h-3" />}>The Flatzy Standard</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0B132B] tracking-tight">
              Honest Living in Kolkata
            </h2>
            <span className="block mx-auto h-px w-24 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
            <p className="text-sm text-slate-500 font-normal">
              Editorial principles held without exception, across every listing we publish.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Outer gold frame with corner accents */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#C9A24B] via-[#E8C876] to-[#C9A24B]/40 p-px shadow-[0_20px_50px_-20px_rgba(164,132,46,0.45)]">
              <div className="rounded-2xl bg-[#FFFDF7] px-6 py-8 sm:px-10 sm:py-10 relative overflow-hidden">
                {/* Giant ghost chapter numeral */}
                <div
                  key={`ghost-${activeChapterIndex}`}
                  className="absolute -right-2 -top-8 text-[10rem] sm:text-[13rem] leading-none font-display font-bold text-[#C9A24B]/[0.12] select-none pointer-events-none animate-in fade-in duration-700"
                  aria-hidden="true"
                >
                  {storyChapters[activeChapterIndex].num}
                </div>

                <div key={activeChapterIndex} className="relative z-10 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-700">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#A8842E]">
                      Chapter {storyChapters[activeChapterIndex].num}
                    </span>
                    <span className="block flex-1 h-px bg-gradient-to-r from-[#C9A24B]/70 to-transparent" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B132B] leading-snug">
                    {storyChapters[activeChapterIndex].title}
                  </h3>

                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8A6D2B]">
                    {storyChapters[activeChapterIndex].subtitle}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                    {storyChapters[activeChapterIndex].content}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8842E]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Standard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter navigation — dots with count */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className="text-[10px] tracking-[0.2em] text-slate-400 font-medium">
                {storyChapters[activeChapterIndex].num} / 0{storyChapters.length}
              </span>
              <div className="flex items-center gap-2.5">
                {storyChapters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeChapterIndex === idx
                        ? 'w-8 h-1.5 bg-gradient-to-r from-[#C9A24B] to-[#E8C876] shadow-[0_0_10px_rgba(201,162,75,0.45)]'
                        : 'w-1.5 h-1.5 bg-slate-300 hover:bg-[#C9A24B]/60 hover:scale-150'
                    }`}
                    aria-label={`Go to chapter ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 5. THE 3-IN-1 ECOSYSTEM — three pillars */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="relative py-2 space-y-6">
          <div className="group text-center max-w-xl mx-auto space-y-2 cursor-default">
            <Eyebrow>All In One Place</Eyebrow>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B132B]">
              The Kolkata Rental Ecosystem
            </h3>
            <span className="block mx-auto h-px w-24 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
            <p className="text-sm text-slate-500 font-normal">
              Find verified flats, connect with compatible flatmates, or list with local brokers.
            </p>
          </div>

          <div className="w-full flex items-center justify-center overflow-visible py-2">
            <BounceCards
              images={ecosystemCards}
              containerWidth={460}
              containerHeight={290}
              cardSize={200}
              spread={82}
              rotation={9}
              arc={10}
              pushDistance={150}
              hoverScale={1.08}
              bounciness={0.65}
              animationDelay={0.25}
              animationStagger={0.08}
              borderWidth={3}
              borderColor="#ffffff"
              radius={14}
              shadow={true}
              enableHover={true}
              onCardClick={(idx) => onNavigate(ecosystem[idx].tab)}
              className="mx-auto select-none"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 6. NEIGHBORHOOD GUILDS — compact corridor row */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#C9A24B]/30 pb-4">
            <div className="space-y-2">
              <Eyebrow icon={<MapPin className="w-3 h-3" />}>Prime East Kolkata Corridors</Eyebrow>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B132B]">
                Neighborhood Guilds
              </h3>
            </div>

            <button
              onClick={() => onNavigate('locations')}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A8842E] hover:text-[#8A6D2B] inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Explore Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {neighborhoods.map((n) => (
              <button
                key={n.name}
                onClick={() => onNavigate('locations')}
                className="royal-shine group text-left rounded-xl bg-white border border-[#C9A24B]/25 hover:border-[#C9A24B]/70 px-4 py-3.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(164,132,46,0.45)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-sm text-[#0B132B] group-hover:text-[#8A6D2B] transition-colors">
                    {n.name}
                  </span>
                  <span className="text-base" aria-hidden="true">{n.icon}</span>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8842E] mt-1">
                  {n.vibe}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* 7. ROYAL SANCTUARY — final concierge invitation */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFCF4] to-[#F6EFDF] border border-[#C9A24B]/50 p-8 sm:p-14 text-center shadow-[0_20px_60px_-25px_rgba(164,132,46,0.4)]">
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.07] mix-blend-multiply"
            style={{ backgroundImage: "url('/kolkata-art-banner.jpg')" }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-[#C9A24B]/15 blur-[90px] pointer-events-none" />
          {/* Inner gold hairline frame */}
          <div className="absolute inset-4 sm:inset-6 border border-[#C9A24B]/35 rounded-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C9A24B]/60 text-[#8A6D2B] text-[10px] font-semibold uppercase tracking-[0.35em] shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Private Concierge</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-display font-bold tracking-tight leading-tight text-[#0B132B]">
              Find Your Next <span className="text-gold-gradient italic">Kolkata Home</span>
            </h3>

            <Ornament />

            <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-md mx-auto">
              Tell us your preferences. We connect you with verified flats and trusted stewards within 24 hours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('explore')}
                className="royal-shine w-full sm:w-auto px-7 py-3 rounded-full bg-[#0B132B] hover:bg-[#1C2541] text-[#F5D98B] font-semibold text-xs uppercase tracking-[0.2em] shadow-[0_8px_24px_-8px_rgba(11,19,43,0.45)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
              >
                Browse Kolkata Flats
              </button>

              <a
                href={getWhatsAppUrl("Hi Flatzy! I am looking for a flat in Kolkata.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#FBF8F1] text-[#0B132B] font-medium text-xs uppercase tracking-[0.2em] border border-[#C9A24B]/50 hover:border-[#C9A24B] hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="text-[11px] text-slate-500 pt-2">
              Correspond: <a href={`mailto:${FLATZY_EMAIL}`} className="text-[#A8842E] hover:text-[#8A6D2B] underline underline-offset-4 decoration-[#C9A24B]/50">{FLATZY_EMAIL}</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
