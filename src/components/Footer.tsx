import React from 'react';
import { FlatzyLogo } from './FlatzyLogo';
import {
  Instagram,
  MessageSquare,
  Mail,
  MapPin,
  ArrowUpRight,
  Heart,
  ArrowRight,
  Compass
} from 'lucide-react';
import type { LocationName } from '../types/property';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../config/contact';

interface FooterProps {
  onNavigate: (tab: string, extra?: any) => void;
  onSelectLocation: (loc: LocationName) => void;
  onOpenInquiryModal?: () => void;
}

/* A row of downward Mughal arches that replaces the flat top border. */
const ARCH_PATH = (() => {
  const d: string[] = [];
  for (let x = 0; x < 1200; x += 40) {
    d.push(
      `M${x},0 H${x + 40} V5 C${x + 40},15 ${x + 27},21 ${x + 20},23 C${x + 13},21 ${x},15 ${x},5 Z`
    );
  }
  return d.join(' ');
})();

const ArchEdge: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A24B]/70 to-transparent" />
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className="block w-full h-[20px] opacity-70"
    >
      <defs>
        <linearGradient id="flatzyGoldEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.15" />
          <stop offset="25%" stopColor="#F5D98B" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#C9A24B" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#F5D98B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d={ARCH_PATH} fill="url(#flatzyGoldEdge)" />
    </svg>
  </div>
);

/* Hand-drawn Kolkata tram — the yellow icon of the city, riding an overhead wire. */
const TramMark: React.FC = () => (
  <svg
    viewBox="0 0 150 62"
    className="footer-tram-bob block w-[97px] h-[40px] drop-shadow-[0_6px_16px_rgba(255,200,0,0.25)]"
    aria-hidden="true"
  >
    {/* trolley pole reaching the wire */}
    <line x1="93" y1="6" x2="106" y2="20" stroke="#C9A24B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="93" cy="6" r="2.6" fill="#FFC800" />

    {/* roof + body */}
    <rect x="10" y="19" width="128" height="7" rx="3.5" fill="#E8C876" />
    <rect x="14" y="24" width="120" height="28" rx="5" fill="#FFC800" />
    <rect x="14" y="47" width="120" height="5" rx="2" fill="#0B132B" opacity="0.35" />

    {/* windows */}
    <rect x="19" y="28" width="19" height="12" rx="2" fill="#0B132B" opacity="0.85" />
    <rect x="43" y="28" width="19" height="12" rx="2" fill="#0B132B" opacity="0.85" />
    <rect x="67" y="28" width="19" height="12" rx="2" fill="#0B132B" opacity="0.85" />

    {/* destination board */}
    <rect x="92" y="28" width="34" height="12" rx="2" fill="#0B132B" />
    <text
      x="109"
      y="37"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      letterSpacing="0.5"
      fill="#FFC800"
      fontFamily="Poppins, sans-serif"
    >
      GPO
    </text>

    {/* wheels */}
    <g className="footer-tram-wheel">
      <circle cx="38" cy="55" r="6" fill="#1C2541" stroke="#C9A24B" strokeWidth="1.5" />
      <path d="M38 50 V60 M33 55 H43" stroke="#C9A24B" strokeWidth="1.2" />
    </g>
    <g className="footer-tram-wheel">
      <circle cx="110" cy="55" r="6" fill="#1C2541" stroke="#C9A24B" strokeWidth="1.5" />
      <path d="M110 50 V60 M105 55 H115" stroke="#C9A24B" strokeWidth="1.2" />
    </g>
  </svg>
);

/* Low skyline silhouette: north Kolkata blocks, a domed memorial, Howrah trusses. */
const Skyline: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 200"
    preserveAspectRatio="none"
    className={`block w-full ${className}`}
    aria-hidden="true"
  >
    <g fill="#1C2541">
      <rect x="8" y="118" width="54" height="82" />
      <rect x="70" y="140" width="40" height="60" />
      <rect x="116" y="96" width="34" height="104" />
      <rect x="156" y="132" width="58" height="68" />
      <rect x="220" y="150" width="30" height="50" />
      <rect x="256" y="110" width="46" height="90" />
      <rect x="308" y="138" width="36" height="62" />
      <rect x="350" y="100" width="52" height="100" />
      <rect x="408" y="146" width="34" height="54" />
      <rect x="448" y="124" width="44" height="76" />

      <rect x="520" y="150" width="150" height="50" />
      <path d="M545 150 q0 -46 50 -52 q50 6 50 52 z" />
      <rect x="592" y="84" width="6" height="16" />
      <circle cx="595" cy="80" r="5" />
      <rect x="527" y="130" width="12" height="20" />
      <rect x="651" y="130" width="12" height="20" />

      <rect x="690" y="118" width="40" height="82" />
      <rect x="736" y="142" width="30" height="58" />

      <rect x="792" y="180" width="220" height="8" />
      <path d="M800 186 L850 112 L900 186 L878 186 L850 136 L822 186 Z" />
      <path d="M900 186 L950 112 L1000 186 L978 186 L950 136 L922 186 Z" />

      <rect x="1018" y="140" width="46" height="60" />
      <rect x="1070" y="120" width="38" height="80" />
      <rect x="1114" y="150" width="48" height="50" />
      <rect x="1168" y="132" width="32" height="68" />
    </g>
  </svg>
);

const StopDot: React.FC<{ orientation: 'row' | 'col' }> = ({ orientation }) => (
  <span
    className={
      orientation === 'row'
        ? 'relative z-10 block w-3.5 h-3.5 rounded-full bg-[#080E20] ring-1 ring-[#C9A24B]/70 shadow-[0_0_0_3px_#080E20] transition-all duration-300 group-hover:bg-flatzy-yellow group-hover:ring-flatzy-yellow group-hover:scale-125 group-hover:shadow-[0_0_0_3px_#080E20,0_0_18px_rgba(255,200,0,0.75)]'
        : 'relative z-10 block w-3 h-3 shrink-0 rounded-full bg-[#080E20] ring-1 ring-[#C9A24B]/70 transition-all duration-300 group-hover:bg-flatzy-yellow group-hover:ring-flatzy-yellow group-hover:scale-125'
    }
  />
);

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectLocation,
  onOpenInquiryModal
}) => {
  const { t } = useLanguage();

  const hubs: { name: LocationName; desc: string }[] = [
    { name: 'New Town', desc: 'AA 1, 2, 3 High-Rises' },
    { name: 'Sector V', desc: 'Tech Hub & IT Offices' },
    { name: 'Salt Lake', desc: 'Quiet Green Blocks' },
    { name: 'Shapoorji', desc: 'Student & Budget Hub' },
    { name: 'Rajarhat', desc: 'Airport Corridor' },
  ];

  const links: { tab: string; label: string }[] = [
    { tab: 'explore', label: t('nav.explore') },
    { tab: 'locations', label: t('nav.locations') },
    { tab: 'reels', label: t('nav.reels') },
    { tab: 'list-flats', label: t('nav.listFlats') },
    { tab: 'policies', label: 'Policies' },
    { tab: 'about', label: t('nav.about') },
    { tab: 'contact', label: t('nav.contact') },
  ];

  return (
    <footer className="relative bg-[#080E20] text-white pt-[104px] sm:pt-[112px] pb-28 md:pb-6 overflow-hidden">

      {/* ── Gilded arch cornice + overhead wire + the 26-number tram ───────── */}
      <ArchEdge />

      <div className="absolute top-[30px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A24B]/45 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="footer-tram absolute top-[22px] left-0 pointer-events-none" aria-hidden="true">
        <TramMark />
      </div>

      {/* ── Ambient light ─────────────────────────────────────────────────── */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[820px] h-[420px] bg-flatzy-yellow/[0.07] blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none opacity-[0.09]">
        <Skyline className="h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================== */}
        {/* 1. THE CABIN — brand, dialogue, channels */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-9">

          {/* Brand + description + live channels */}
          <div className="md:col-span-5 space-y-4 text-left">
            <FlatzyLogo variant="dark" onClick={() => onNavigate('home')} size="lg" />

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com/flatzykolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-[#C9A24B]/25 text-slate-200 text-xs font-semibold transition-all hover:border-[#C9A24B]/60 group"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>@flatzykolkata</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-[#C9A24B] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href={getWhatsAppUrl("Hi Flatzy! I am looking for a rental flat in Kolkata")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-emerald-500/25 text-slate-200 text-xs font-semibold transition-all hover:border-emerald-400/60"
              >
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                </span>
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A24B]" />
                <a href="mailto:flatzykolkata@gmail.com" className="hover:text-flatzy-yellow transition-colors">
                  flatzykolkata@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Salt Lake &amp; New Town, Kolkata 700156</span>
              </p>
            </div>
          </div>

          {/* Route map — mobile */}
          <div className="md:hidden text-left">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="rotate-45 w-1.5 h-1.5 bg-[#C9A24B]" aria-hidden="true" />
                <h4 className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#C9A24B]">
                  {t('footer.topHubs')}
                </h4>
              </div>
              <span className="text-[9px] uppercase tracking-[0.16em] text-slate-500 font-bold">
                Flatzy Express
              </span>
            </div>

            <div className="relative">
              {/* the rail, running stop to stop */}
              <div className="absolute left-[5.5px] top-[6px] bottom-[16px] w-px bg-gradient-to-b from-[#C9A24B]/60 via-[#C9A24B]/25 to-transparent" aria-hidden="true" />

              <div className="space-y-2">
                {hubs.map((hub, i) => (
                  <button
                    key={hub.name}
                    onClick={() => {
                      onSelectLocation(hub.name);
                      onNavigate('explore');
                    }}
                    className="group relative flex items-center gap-3 w-full text-left"
                  >
                    <StopDot orientation="col" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-200 truncate transition-colors group-hover:text-flatzy-yellow">
                        {hub.name}
                      </span>
                      <span className="block text-[10px] text-slate-500 leading-tight">{hub.desc}</span>
                    </span>
                    <span className="text-[8px] font-black tracking-[0.18em] text-slate-600 shrink-0 transition-colors group-hover:text-[#C9A24B]">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Route map — desktop */}
          <div className="hidden md:block md:col-span-4 lg:col-span-4 text-left">
            <div className="flex items-baseline justify-between gap-2 mb-7">
              <div className="flex items-center gap-2">
                <span className="rotate-45 w-1.5 h-1.5 bg-[#C9A24B] shadow-[0_0_8px_rgba(201,162,75,0.7)]" aria-hidden="true" />
                <h4 className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#C9A24B] whitespace-nowrap">
                  {t('footer.topHubs')}
                </h4>
              </div>
              <span className="text-[9px] uppercase tracking-[0.16em] text-slate-500 font-bold whitespace-nowrap">
                Flatzy Express
              </span>
            </div>

            <div className="relative">
              {/* twin tram rails, running stop to stop */}
              <div
                className="absolute left-[10%] right-[10%] top-[6px] h-[2px]"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(201,162,75,0.55) 0px, rgba(201,162,75,0.55) 5px, transparent 5px, transparent 11px)'
                }}
              />
              <div className="absolute left-[10%] right-[10%] top-[10px] h-px bg-[#C9A24B]/20" aria-hidden="true" />
              <span className="absolute left-[10%] top-[4px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A24B]" aria-hidden="true" />
              <span className="absolute right-[10%] top-[4px] translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A24B]/40" aria-hidden="true" />

              <div className="relative flex items-start justify-between">
                {hubs.map((hub, i) => (
                  <button
                    key={hub.name}
                    onClick={() => {
                      onSelectLocation(hub.name);
                      onNavigate('explore');
                    }}
                    className="group flex flex-col items-center flex-1 min-w-0"
                  >
                    <StopDot orientation="row" />
                    <span
                      className="w-px h-2 bg-gradient-to-b from-[#C9A24B]/45 to-transparent transition-all duration-300 group-hover:h-3 group-hover:from-flatzy-yellow/70"
                      aria-hidden="true"
                    />
                    <span className="block w-full px-1 -mt-0.5">
                      <span className="block text-[11px] font-bold text-slate-200 truncate transition-all duration-300 group-hover:text-flatzy-yellow group-hover:-translate-y-0.5">
                        {hub.name}
                      </span>
                      <span className="block text-[9px] text-slate-500 leading-snug mt-0.5 min-h-[20px]">
                        {hub.desc}
                      </span>
                    </span>
                    <span className="text-[8px] font-black tracking-[0.18em] text-slate-600 transition-colors duration-300 group-hover:text-[#C9A24B]">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Concierge */}
          <div className="md:col-span-3 text-left">
            <div className="relative rounded-3xl p-5 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-[#C9A24B]/25 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] space-y-3 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-flatzy-yellow/10 blur-2xl rounded-full pointer-events-none" />

              <div className="relative flex items-center gap-2 text-[#C9A24B]">
                <Compass className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('footer.needHelp')}
                </span>
              </div>

              <p className="relative text-xs text-slate-300 leading-relaxed">
                {t('footer.helpDesc')}
              </p>

              <button
                onClick={() => (onOpenInquiryModal ? onOpenInquiryModal() : onNavigate('contact'))}
                className="relative w-full py-2.5 px-4 rounded-2xl bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy font-extrabold text-xs tracking-wide shadow-[0_8px_24px_-8px_rgba(255,200,0,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>{t('footer.inquireBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="relative text-[10px] text-slate-400 text-center">
                ✓ 100% Free for Renters • Zero Spam
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. PLATFORM LINKS — single hairline rail */}
        {/* ================================================================== */}
        <nav
          aria-label={t('footer.quickLinks')}
          className="py-9 border-t border-white/[0.07]"
        >
          {/* Gilded eyebrow, flanked by hairlines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5">
            <span className="block w-12 sm:w-28 h-px bg-gradient-to-r from-transparent to-[#C9A24B]/60" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.32em] font-extrabold text-[#C9A24B] whitespace-nowrap">
              {t('footer.quickLinks')}
            </span>
            <span className="block w-12 sm:w-28 h-px bg-gradient-to-l from-transparent to-[#C9A24B]/60" aria-hidden="true" />
          </div>

          {/* Chip rail */}
          <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {links.map((link) => (
              <li key={link.tab}>
                <button
                  onClick={() => onNavigate(link.tab)}
                  className="group/link inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:border-flatzy-yellow hover:bg-flatzy-yellow hover:text-[#080E20] active:scale-95 transition-all duration-200"
                >
                  <span>{link.label}</span>
                  <span className="w-1 h-1 rounded-full bg-[#C9A24B]/70 group-hover:bg-[#080E20]/70 transition-colors" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ================================================================== */}
        {/* 3. THE GIANT SIGNATURE — outlined, floods with gold letter by letter */}
        {/* ================================================================== */}
        <div className="relative pt-8 sm:pt-10" aria-hidden="true">
          <div className="flex justify-center whitespace-nowrap select-none font-display font-black leading-[0.82] tracking-[0.01em] text-[clamp(3rem,21.5vw,17rem)]">
            {'FLATZY'.split('').map((ch, i) => (
              <span key={i} className="footer-letter">
                {ch}
              </span>
            ))}
          </div>

          <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-[0.42em] text-slate-500 -mt-1 sm:-mt-2 pb-2">
            Kolkata · Since Sunrise
          </p>
        </div>

        {/* ================================================================== */}
        {/* 4. COPYRIGHT & LEGAL BAR */}
        {/* ================================================================== */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 pb-6 md:pb-4 border-t border-white/[0.07] text-xs text-slate-400">
          <p className="flex items-center gap-2">
            <span>
              © 2026 <strong className="text-white font-semibold">Flatzy Kolkata</strong>. {t('footer.rights')}
            </span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-400 text-center sm:text-right">
            <span>{t('footer.crafted')}</span>
            <Heart className="w-3.5 h-3.5 text-flatzy-coral fill-flatzy-coral inline-block animate-pulse" />
          </p>
        </div>

      </div>
    </footer>
  );
};
