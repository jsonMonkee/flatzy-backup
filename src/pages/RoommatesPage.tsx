import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  CheckCircle2,
  Users,
  ChevronRight,
  User,
  Phone,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft
} from 'lucide-react';
import type { RoommateProfile } from '../types/roommate';
import { getRoommateProfiles } from '../data/roommatesData';
import { getRoommates } from '../services/roommateService';
import { CuteAvatarDisplay } from '../components/CuteAvatar';
import { PostRoommateModal } from '../components/PostRoommateModal';
import { RoommateOnboardingModal } from '../components/RoommateOnboardingModal';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { FLATZY_WHATSAPP_NUMBER } from '../config/contact';
import BounceCards from '../components/BounceCards';

// Carousel banner slides
const CAROUSEL_BANNERS = [
  { src: '/flat-share-banner.jpg', alt: 'Flat share karke rehna chahte ho?' },
  { src: '/share-flat-banner-save50.jpg', alt: 'Share a Flat. Save 50% Rent. Connect with verified roommates.' },
];
const CAROUSEL_INTERVAL = 3500; // 3.5 seconds

interface RoommatesPageProps {
  onNavigate: (tab: string) => void;
  isPostModalOpen?: boolean;
  onOpenPostModal?: () => void;
  onClosePostModal?: () => void;
  onOpenInquiryModal?: (property?: any, isBoardMode?: boolean) => void;
}

export const RoommatesPage: React.FC<RoommatesPageProps> = ({ 
  onNavigate,
  isPostModalOpen: externalIsPostModalOpen,
  onOpenPostModal,
  onClosePostModal,
  onOpenInquiryModal
}) => {
  const [profiles, setProfiles] = useState<RoommateProfile[]>(() => getRoommateProfiles());
  const [internalPostModalOpen, setInternalPostModalOpen] = useState(false);
  const [unlockProfile, setUnlockProfile] = useState<RoommateProfile | null>(null);
  
  // Interactive Dotted Walkthrough Tour (Only once per user)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem('flatzy_roommate_guide_seen');
    } catch {
      return false;
    }
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('flatzy_roommate_guide_seen', 'true');
    } catch {}
  };

  // Fetch from backend / Supabase
  useEffect(() => {
    let isMounted = true;
    getRoommates()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProfiles(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch remote roommates:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isPostModalOpen = externalIsPostModalOpen !== undefined ? externalIsPostModalOpen : internalPostModalOpen;
  const setIsPostModalOpen = (open: boolean) => {
    if (open) {
      onOpenPostModal ? onOpenPostModal() : setInternalPostModalOpen(true);
    } else {
      onClosePostModal ? onClosePostModal() : setInternalPostModalOpen(false);
    }
  };

  // ── Carousel State ──
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % CAROUSEL_BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + CAROUSEL_BANNERS.length) % CAROUSEL_BANNERS.length);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, CAROUSEL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide]);

  // Reset timer on manual interaction
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, CAROUSEL_INTERVAL);
  }, [nextSlide]);

  const handleDotClick = (i: number) => {
    goToSlide(i);
    resetTimer();
  };

  // Touch / Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide(); else prevSlide();
      resetTimer();
    }
    touchStartX.current = null;
  };
  
  // Quick Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [intentFilter, setIntentFilter] = useState<'All' | 'Team-Up' | 'Room'>('All');
  const [bhkFilter, setBhkFilter] = useState<'All' | '1 BHK' | '2 BHK' | '3 BHK'>('All');
  const [professionFilter, setProfessionFilter] = useState<'All' | 'Working Professional' | 'Student'>('All');
  const [religionFilter, setReligionFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [genderFilter, intentFilter, bhkFilter, professionFilter, religionFilter, searchQuery]);

  const filteredProfiles = profiles.filter(p => {
    if (genderFilter !== 'All' && p.gender !== genderFilter) return false;
    
    // Check if this profile comes from the inquiries / tenant postings database
    const isTenantPostingLead = p.isRealTenantPost === true || p.id.startsWith('lead_') || p.id.startsWith('LD-');

    if (intentFilter === 'All') {
      // ONLY actual Supabase tenant data for Tenant Postings
      if (!isTenantPostingLead) return false;
    }
    
    if (intentFilter === 'Team-Up') {
      // Strictly exclude tenant postings database entries
      if (isTenantPostingLead) return false;
      const isTeamUp = p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up');
      if (!isTeamUp) return false;
    }
    
    if (intentFilter === 'Room') {
      // Strictly exclude tenant postings database entries
      if (isTenantPostingLead) return false;
      const isRoom = p.listingType === 'Room in Flat' || (!p.aboutMe.toLowerCase().includes('team up'));
      if (!isRoom) return false;
    }
    
    if (bhkFilter !== 'All' && p.lookingForBhk !== bhkFilter) return false;
    if (professionFilter !== 'All' && p.profession !== professionFilter) return false;
    if (religionFilter !== 'All' && p.religion && p.religion !== religionFilter && p.religion !== 'Open to All') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchLoc = p.preferredLocations.some(l => l.toLowerCase().includes(q));
      const matchOcc = p.occupationTitle.toLowerCase().includes(q);
      const matchBhk = p.lookingForBhk.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchOcc && !matchBhk) return false;
    }
    return true;
  });

  const handleContactWhatsApp = (p: RoommateProfile) => {
    const text = `*I WANT THE NUMBER* 📞\n\nHi Flatzy! I'm interested in connecting with this flatmate. Here are their details:\n\n👤 *Name:* ${p.name} (${p.age} yrs, ${p.gender})\n🏠 *Looking For:* ${p.lookingForBhk} (${p.listingType === 'Team-Up' ? 'New Roommate / Team-Up' : 'Room in Flat'})\n💰 *Budget:* ₹${p.budgetPerMonth.toLocaleString('en-IN')}/month\n📍 *Preferred Location:* ${p.preferredLocations.join(', ')}\n💼 *Profession:* ${p.occupationTitle}\n📅 *Move-in Date:* ${p.moveInDate}\n\nPlease share their contact number with me!`;
    const cleanPhone = FLATZY_WHATSAPP_NUMBER || '918910376054';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGetPhoneNumber = (p: RoommateProfile) => {
    // Open clean white dialog box
    setUnlockProfile(p);
  };

  const handleUnlockWhatsApp = (p: RoommateProfile) => {
    // Direct WhatsApp text to 8910376054
    const dateFormatted = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';
    const displayBudget = p.budgetRaw || `₹${p.budgetPerMonth.toLocaleString('en-IN')}/mo`;
    const furnishText = p.furnishingPref ? `\n🛋️ *Furnishing:* ${p.furnishingPref}` : '';
    const text = `Hi Flatzy,\n\nI want number for this tenant:\n\n👤 *Name:* ${p.name}\n🏠 *Requirement:* ${p.lookingForBhk} in ${p.preferredLocations.join(', ')}\n💰 *Budget:* ${displayBudget}${furnishText}\n📅 *Move-in:* ${p.moveInDate}\n🕒 *Posted On:* ${dateFormatted}\n\nI have this flat available. Please share contact number!`;
    const url = `https://wa.me/918910376054?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setUnlockProfile(null);
  };

  const handleAddProfileSuccess = (newP: RoommateProfile) => {
    setProfiles(prev => [newP, ...prev]);
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      
      {/* ── Auto-Advancing Hero Banner Carousel (Hidden in Tenant Postings view) ── */}
      {intentFilter !== 'All' && (
        <div
          className="relative w-full overflow-hidden border-b border-amber-200/80 shadow-soft select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slide Track */}
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {CAROUSEL_BANNERS.map((banner, i) => (
              <div key={i} className="w-full shrink-0">
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-auto max-h-[420px] sm:max-h-[480px] md:max-h-[520px] lg:max-h-[560px] object-cover object-center block"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Chevron Nav Arrows (desktop / tablet) */}
          <button
            onClick={() => { prevSlide(); resetTimer(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-md flex items-center justify-center text-slate-700 hover:bg-white/90 active:scale-95 transition-all z-10 hidden sm:flex"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => { nextSlide(); resetTimer(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-md flex items-center justify-center text-slate-700 hover:bg-white/90 active:scale-95 transition-all z-10 hidden sm:flex"
            aria-label="Next banner"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {CAROUSEL_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  currentSlide === i
                    ? 'w-6 h-2.5 bg-amber-500 shadow-sm shadow-amber-400/50'
                    : 'w-2.5 h-2.5 bg-white/70 hover:bg-white border border-white/30'
                }`}
              />
            ))}
          </div>

          {/* Subtle progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10 z-10">
            <div
              className="h-full bg-amber-500/80 transition-none"
              style={{
                animation: `carouselProgress ${CAROUSEL_INTERVAL}ms linear infinite`,
              }}
            />
          </div>
          <style>{`
            @keyframes carouselProgress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Main Content Area (Restricted Width Container) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── For Tenant Section: Broker Hero Banner Above Search Bar ── */}
        {intentFilter === 'All' && (
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
            <img 
              src="/broker-tenant-banner.png" 
              alt="No need to wait for leads to come to you - Flatzy for Kolkata Brokers" 
              className="w-full h-auto object-cover block cursor-pointer"
              onClick={() => {
                const element = document.getElementById('tenant-postings-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        )}

        {/* ── Search Bar & Filter Button (Right below flat share banner) ── */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flatmates by name, company, area (e.g. Sector V, Ecospace, New Town)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Solid White Popover Box on Search Click/Focus */}
              {isSearchFocused && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 sm:right-auto sm:w-80 z-30 bg-white rounded-2xl border border-slate-200 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.14)] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base select-none mt-0.5">🙃</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        Bhai search karke kuch fayda nahi milta hai. Wo thodi mil jayegi tujhe!
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Side se scroll kar le, saare verified flatmates neeche cards mein mil jayenge.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button with Popover Box */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  showFilters
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Filters</span>
              </button>

              {/* Small Solid White Box on Filter Click */}
              {showFilters && (
                <>
                  {/* Invisible Backdrop to close on tap outside */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowFilters(false)} 
                  />
                  <div className="absolute top-[calc(100%+0.5rem)] right-0 w-72 z-40 bg-white rounded-2xl border border-slate-200 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.14)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base select-none mt-0.5">💔</span>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          Aise hi wo tumhe filter karke chhor diya tha na... 🥲
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Filters lagane ki zarurat nahi, saare flatmates direct neeche list kiye hue hain!
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* How it Works / Tour Trigger */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
              title="Tour / How it works"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xs:inline">How it Works</span>
            </button>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs shrink-0 active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post Need</span>
            </button>
          </div>
        </div>

        {/* ── 3 Square Cards in 1 Line: Setup Intent Switcher ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 select-none">
          {/* Card 1: Looking roommate */}
          <button
            type="button"
            onClick={() => setIntentFilter('Room')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 active:scale-95 cursor-pointer min-h-[96px] sm:min-h-[116px] ${
              intentFilter === 'Room'
                ? 'bg-sky-500 text-white border-sky-500 shadow-soft ring-2 ring-sky-400/30'
                : 'bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-1 sm:mb-1.5">🙋‍♂️</span>
            <span className="text-xs sm:text-sm font-black leading-tight text-center">
              Looking roommate
            </span>
            <span className={`text-[9px] sm:text-[10px] font-bold mt-1 px-1.5 sm:px-2 py-0.5 rounded-full ${
              intentFilter === 'Room'
                ? 'bg-sky-600/40 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              Has Room • Share
            </span>
          </button>

          {/* Card 2: Not looking for a new roommate */}
          <button
            type="button"
            id="tour-teamup-btn"
            onClick={() => setIntentFilter('Team-Up')}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 active:scale-95 cursor-pointer min-h-[96px] sm:min-h-[116px] ${
              intentFilter === 'Team-Up'
                ? 'bg-flatzy-yellow text-flatzy-navy border-flatzy-yellowDark/60 shadow-soft ring-2 ring-flatzy-yellow/30'
                : 'bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-1 sm:mb-1.5">🔍</span>
            <span className="text-xs sm:text-sm font-black leading-tight text-center">
              Team-up flat
            </span>
            <span className={`text-[9px] sm:text-[10px] font-bold mt-1 px-1.5 sm:px-2 py-0.5 rounded-full ${
              intentFilter === 'Team-Up'
                ? 'bg-flatzy-navy/15 text-flatzy-navy'
                : 'bg-slate-100 text-slate-500'
            }`}>
              Rent New Flat Ek Saath
            </span>
          </button>

          {/* Card 3: Tenant Postings for Brokers */}
          <button
            type="button"
            onClick={() => setIntentFilter('All')}
            className={`relative overflow-hidden flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 active:scale-95 cursor-pointer min-h-[96px] sm:min-h-[116px] group ${
              intentFilter === 'All'
                ? 'bg-red-600 text-white border-red-600 shadow-soft ring-2 ring-red-500/30'
                : 'bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            }`}
          >
            {/* Blended 3D Broker Leads Illustration on Right Side */}
            <img
              src="/broker-leads-art.png"
              alt=""
              aria-hidden="true"
              className={`absolute -right-3 -bottom-2 w-20 sm:w-24 h-auto object-contain pointer-events-none transition-all duration-300 mix-blend-luminosity sm:mix-blend-normal group-hover:scale-105 ${
                intentFilter === 'All'
                  ? 'opacity-35 brightness-125'
                  : 'opacity-25 contrast-125'
              }`}
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-black leading-tight text-center">
                Tenant Postings
              </span>
              <span className={`text-[9px] sm:text-[10px] font-bold mt-1 px-1.5 sm:px-2 py-0.5 rounded-full ${
                intentFilter === 'All'
                  ? 'bg-red-700/60 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                For Brokers
              </span>
            </div>
          </button>
        </div>



        {/* Filter Bar 2: BHK Segmented Track */}
        <div className="w-full bg-white rounded-full border border-slate-200/90 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-4 items-center divide-x divide-slate-100">
          {(['All', '1 BHK', '2 BHK', '3 BHK'] as const).map((bhk) => {
            const isSelected = bhkFilter === bhk;
            return (
              <button
                key={bhk}
                type="button"
                onClick={() => setBhkFilter(bhk)}
                className={`w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-black transition-all duration-200 select-none flex items-center justify-center gap-1.5 active:scale-98 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{bhk === 'All' ? '✨ All' : `🏠 ${bhk}`}</span>
              </button>
            );
          })}
        </div>

        {/* ── Sideways Sliding Sections: Female Flatmates & Male Flatmates ── */}
                {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-slate-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-base font-black text-slate-800">No Flatmates Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or reset the filters.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setGenderFilter("All");
                  setBhkFilter("All");
                  setProfessionFilter("All");
                  setReligionFilter("All");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : intentFilter === "All" ? (
            <div id="tenant-postings-section" className="space-y-4 text-left scroll-mt-20">
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap truncate">
                    Tenant Postings
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-black text-slate-600 border border-slate-200 shrink-0">
                    {filteredProfiles.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onOpenInquiryModal) {
                      onOpenInquiryModal(undefined, true);
                    } else {
                      setIsPostModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy text-xs sm:text-sm font-black shadow-xs hover:shadow-soft transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  <span>Post Requirement</span>
                </button>
              </div>

              {/* Compact Horizontal / Responsive Grid of Rectangle Cards (Paginated 7 per page) */}
              {(() => {
                const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE) || 1;
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {paginatedProfiles.map((p, pIdx) => {
                        // Determine Family vs Bachelor / Student tag
                        const isBachelor = p.profession === 'Student' || p.lifestyleHabits?.sleepSchedule === 'Night Owl' || p.age < 28;
                        const tenantTypeTag = isBachelor ? 'Bachelor' : 'Family / Working';

                        // Company name or institution
                        const companyName = p.occupationTitle.includes('@')
                          ? p.occupationTitle.split('@')[1].trim()
                          : p.occupationTitle || p.profession;

                        // Preferred Locations
                        const locationText = p.preferredLocations && p.preferredLocations.length > 0
                          ? p.preferredLocations.slice(0, 2).join(', ')
                          : 'Kolkata';

                        return (
                          <React.Fragment key={p.id}>
                            <div
                              id={pIdx === 0 ? "tour-female-card" : undefined}
                              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-soft transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between gap-3 group cursor-pointer"
                              onClick={() => handleGetPhoneNumber(p)}
                            >
                              {/* Top Row: Avatar + Info + Green Rent & BHK Badge */}
                              <div className="flex items-start justify-between gap-2.5 min-w-0">
                                {/* Avatar & Info */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border ${
                                      p.gender === 'Female' 
                                        ? 'bg-pink-50/80 border-pink-200/80' 
                                        : 'bg-blue-50/80 border-blue-200/80'
                                    }`}>
                                      <img
                                        src={p.gender === 'Female' ? '/female-icon.png' : '/male-icon.png'}
                                        alt={p.gender}
                                        className="w-7 h-7 object-contain"
                                      />
                                    </div>

                                  <div className="min-w-0 flex-1 space-y-1">
                                    {/* Line 1: Name & Blue Tick Verified Badge */}
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <h4 className="text-sm font-black text-slate-900 truncate">
                                        {p.name}
                                      </h4>
                                      <img
                                        src="/verified-badge.png"
                                        alt="Verified"
                                        title="Verified Tenant"
                                        className="w-4 h-4 shrink-0 inline-block drop-shadow-xs"
                                      />
                                      {p.age && p.age !== 25 && (
                                        <span className="text-xs font-bold text-slate-400 shrink-0">
                                          {p.age} yrs
                                        </span>
                                      )}
                                    </div>

                                    {/* Line 2: Gender & Bachelor Tag */}
                                    <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
                                      {/* Gender Badge with Icon */}
                                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                                        p.gender === 'Female'
                                          ? 'bg-pink-50 border-pink-200 text-pink-600'
                                          : 'bg-blue-50 border-blue-200 text-blue-600'
                                      }`}>
                                        <img
                                          src={p.gender === 'Female' ? "/female-icon.png" : "/male-icon.png"}
                                          alt=""
                                          className="w-2.5 h-2.5"
                                        />
                                        <span>{p.gender === 'Female' ? 'F' : 'M'}</span>
                                      </span>
                                      {/* Bachelor / Family Tag */}
                                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 font-extrabold text-[10px] shrink-0">
                                        {tenantTypeTag}
                                      </span>
                                      {companyName && companyName !== 'Working in Kolkata' && companyName !== 'Working Professional' && companyName !== 'Family Renter' && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 truncate max-w-[120px]">
                                          <Briefcase className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                          <span className="truncate">{companyName}</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Preferred Location */}
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 truncate">
                                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                      <span className="truncate">{locationText}</span>
                                    </div>
                                  </div>
                                </div>

                                {p.createdAt && (
                                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                                    🕒 {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                              </div>

                              {/* Long Horizontal Bar Just Below Location: Budget Range • BHK • Furnishing in ONE LINE */}
                              <div className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 border border-emerald-200/90 flex items-center justify-between gap-2 shadow-2xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-xs sm:text-sm font-black text-emerald-900 tracking-tight whitespace-nowrap">
                                    {p.budgetRaw ? p.budgetRaw : `₹${p.budgetPerMonth.toLocaleString("en-IN")}/mo`}
                                  </span>
                                  <span className="text-emerald-400 font-bold text-xs shrink-0">•</span>
                                  <span className="text-xs font-black text-emerald-800 whitespace-nowrap shrink-0">
                                    {p.lookingForBhk}
                                  </span>
                                </div>
                                <span className="text-[11px] font-black text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md shrink-0 border border-teal-200/60 whitespace-nowrap">
                                  {p.furnishingPref || 'Semi / Furnished'}
                                </span>
                              </div>

                              {/* Bottom Row: Shifting date & Red Get Number Button in SAME LINE */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 whitespace-nowrap min-w-0">
                                  {/* Shifting Date Tag */}
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 font-extrabold shadow-2xs">
                                    <span>🚚 Shift:</span>
                                    <span className="text-blue-900">{p.moveInDate || 'Immediate'}</span>
                                  </span>

                                  {/* Religion Tag (if specified) */}
                                  {p.religion && p.religion !== 'Open to All' && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 shadow-2xs">
                                      🕉️ {p.religion}
                                    </span>
                                  )}
                                </div>

                                {/* Get Number Button: Red Outline & Red Text */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGetPhoneNumber(p);
                                  }}
                                  className="px-4 py-1.5 rounded-full bg-white hover:bg-rose-50 active:scale-95 text-rose-600 font-black text-xs border-2 border-rose-500 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5 text-rose-600 stroke-[2.5] shrink-0" />
                                  <span>Get Number</span>
                                </button>
                              </div>
                            </div>

                            {/* Position 2: Insert 'Post Your Requirement' right after the 1st card */}
                            {pIdx === 0 && (
                              <div
                                onClick={() => {
                                  if (onOpenInquiryModal) {
                                    onOpenInquiryModal(undefined, true);
                                  } else {
                                    setIsPostModalOpen(true);
                                  }
                                }}
                                className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer group min-h-[110px]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-amber-100 group-hover:bg-amber-500 text-amber-600 group-hover:text-white flex items-center justify-center font-black transition-colors shrink-0">
                                    <Plus className="w-5 h-5 stroke-[2.5]" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                      Post Your Requirement
                                    </h4>
                                    <p className="text-[10px] text-slate-500">
                                      Get matched on Flatzy Board
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">
                                  Post Free
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* ── Modern Pagination Bar (7 People per Page) ── */}
                    {totalPages > 1 && (
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
                        <p className="text-xs font-bold text-slate-500">
                          Showing <span className="text-slate-800 font-black">{startIndex + 1}</span>–<span className="text-slate-800 font-black">{Math.min(startIndex + ITEMS_PER_PAGE, filteredProfiles.length)}</span> of <span className="text-slate-800 font-black">{filteredProfiles.length}</span> tenants
                        </p>
                        <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => {
                              setCurrentPage(prev => Math.max(prev - 1, 1));
                              document.getElementById('tenant-postings-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 cursor-pointer"
                          >
                            ← Prev
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => {
                                setCurrentPage(pageNum);
                                document.getElementById('tenant-postings-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-flatzy-yellow text-flatzy-navy shadow-xs ring-1 ring-flatzy-yellowDark/30'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => {
                              setCurrentPage(prev => Math.min(prev + 1, totalPages));
                              document.getElementById('tenant-postings-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 cursor-pointer"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
        ) : (
<div className="space-y-8 text-left">
            
            {/* Section 1: Female Flatmates */}
            {filteredProfiles.some(p => p.gender === 'Female') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-black">
                      <img src="/female-icon.png" alt="" className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                        Female Flatmates
                      </h3>
                      <p className="text-xs text-slate-500">
                        Verified flatshares in Kolkata
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate('roommates-female')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <span>See More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                      Slide sideways 👉
                    </span>
                  </div>
                </div>

                {/* Horizontal Scrolling Track */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-2 sm:px-2 no-scrollbar snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-2">
                  {filteredProfiles
                    .filter(p => p.gender === 'Female')
                    .slice(0, 1)
                    .map((p, pIdx) => (
                      <div
                        key={p.id}
                        id={pIdx === 0 ? 'tour-female-card' : undefined}
                        className="w-[335px] sm:w-[360px] shrink-0 snap-start bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 group/tweet"
                      >
                        {/* Twitter Card Header: Avatar + Author Info + Verified Badge + Intent Pill */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 border border-pink-200/80 flex items-center justify-center text-xl shadow-xs">
                                <CuteAvatarDisplay avatarId={p.avatarId} size="md" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-[15px] font-black text-slate-900 truncate tracking-tight">
                                    {p.name}
                                  </h4>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 shrink-0" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-500 truncate">
                                  {p.occupationTitle || `${p.profession} • Kolkata`}
                                </p>
                              </div>
                            </div>

                            {/* Intent Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                              (p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up'))
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
                                : 'bg-flatzy-navy text-white'
                            }`}>
                              {(p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up')) ? '🔍 Team-Up' : '🙋‍♂️ Has Room'}
                            </span>
                          </div>

                          {/* Tweet Post Body */}
                          <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-normal">
                            "{p.aboutMe}"
                          </p>

                          {/* Tweet Embedded Requirement Card (Location, Budget, Date, Habits) */}
                          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs font-black">
                              <div className="flex items-center gap-1.5 text-slate-900">
                                <MapPin className="w-3.5 h-3.5 text-flatzy-coral shrink-0" />
                                <span className="truncate max-w-[170px]">{p.preferredLocations.join(', ')}</span>
                              </div>
                              <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-black text-xs">
                                ₹{p.budgetPerMonth.toLocaleString('en-IN')}/mo
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
                              <span className="flex items-center gap-1">
                                <span>📅 Move-in:</span>
                                <span className="text-flatzy-navy font-black">{p.moveInDate}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-black">
                                {p.lookingForBhk}
                              </span>
                            </div>

                            {/* Habits Row: 1 line with Diet, Smoking, and Religion (Removed Pet-Friendly) */}
                            <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-600 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🥗 {p.lifestyleHabits.diet}</span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🚭 {p.lifestyleHabits.smoking}</span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🕉️ {p.religion || 'Hindu'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tweet Post Actions Bar (Connect / WhatsApp / Unlock) */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            id={pIdx === 0 ? 'tour-card-whatsapp' : undefined}
                            onClick={() => handleContactWhatsApp(p)}
                            className="flex-1 py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                            <span>Connect / Chat</span>
                          </button>

                          <button
                            onClick={() => handleGetPhoneNumber(p)}
                            className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
                            title="Get direct contact"
                          >
                            <Phone className="w-3 h-3 text-slate-600" />
                            <span>Unlock</span>
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Female Section: Add / Post Profile Card with Plus Icon */}
                  <div
                    id="tour-post-card"
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-[325px] sm:w-[345px] shrink-0 snap-start bg-gradient-to-b from-pink-50/70 via-white to-pink-50/40 rounded-2xl border-2 border-dashed border-pink-300 hover:border-pink-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center p-5 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-pink-100 group-hover:bg-pink-500 text-pink-600 group-hover:text-white flex items-center justify-center shadow-md transition-all duration-300 mb-4 group-hover:scale-110">
                      <Plus className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider mb-2">
                      Female Flatmate
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                      Need a Flatmate?
                    </h4>
                    <p className="text-xs text-slate-500 max-w-[210px] mb-5 leading-relaxed">
                      Post your requirement & find verified female roommates in Kolkata.
                    </p>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 group-hover:shadow-pink-300/50"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Post Female Requirement</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Male Flatmates */}
            {filteredProfiles.some(p => p.gender === 'Male') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">
                      <img src="/male-icon.png" alt="" className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                        Male Flatmates
                      </h3>
                      <p className="text-xs text-slate-500">
                        Verified flatshares in Kolkata
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate('roommates-male')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <span>See More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                      Slide sideways 👉
                    </span>
                  </div>
                </div>

                {/* Horizontal Scrolling Track */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-2 sm:px-2 no-scrollbar snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-2">
                  {filteredProfiles
                    .filter(p => p.gender === 'Male')
                    .slice(0, 1)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="w-[335px] sm:w-[360px] shrink-0 snap-start bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 group/tweet"
                      >
                        {/* Twitter Card Header: Avatar + Author Info + Verified Badge + Intent Pill */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200/80 flex items-center justify-center text-xl shadow-xs">
                                <CuteAvatarDisplay avatarId={p.avatarId} size="md" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-[15px] font-black text-slate-900 truncate tracking-tight">
                                    {p.name}
                                  </h4>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 shrink-0" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-500 truncate">
                                  {p.occupationTitle || `${p.profession} • Kolkata`}
                                </p>
                              </div>
                            </div>

                            {/* Intent Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                              (p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up'))
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
                                : 'bg-flatzy-navy text-white'
                            }`}>
                              {(p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up')) ? '🔍 Team-Up' : '🙋‍♂️ Has Room'}
                            </span>
                          </div>

                          {/* Tweet Post Body */}
                          <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-normal">
                            "{p.aboutMe}"
                          </p>

                          {/* Tweet Embedded Requirement Card (Location, Budget, Date, Habits) */}
                          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs font-black">
                              <div className="flex items-center gap-1.5 text-slate-900">
                                <MapPin className="w-3.5 h-3.5 text-flatzy-coral shrink-0" />
                                <span className="truncate max-w-[170px]">{p.preferredLocations.join(', ')}</span>
                              </div>
                              <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-black text-xs">
                                ₹{p.budgetPerMonth.toLocaleString('en-IN')}/mo
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
                              <span className="flex items-center gap-1">
                                <span>📅 Move-in:</span>
                                <span className="text-flatzy-navy font-black">{p.moveInDate}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-black">
                                {p.lookingForBhk}
                              </span>
                            </div>

                            {/* Habits Row: 1 line with Diet, Smoking, and Religion (Removed Pet-Friendly) */}
                            <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-600 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🥗 {p.lifestyleHabits.diet}</span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🚭 {p.lifestyleHabits.smoking}</span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">🕉️ {p.religion || 'Hindu'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tweet Post Actions Bar (Connect / WhatsApp / Unlock) */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleContactWhatsApp(p)}
                            className="flex-1 py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                            <span>Connect / Chat</span>
                          </button>

                          <button
                            onClick={() => handleGetPhoneNumber(p)}
                            className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
                            title="Get direct contact"
                          >
                            <Phone className="w-3 h-3 text-slate-600" />
                            <span>Unlock</span>
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Male Section: Add / Post Profile Card with Plus Icon */}
                  <div
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-[325px] sm:w-[345px] shrink-0 snap-start bg-gradient-to-b from-blue-50/70 via-white to-blue-50/40 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center p-5 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shadow-md transition-all duration-300 mb-4 group-hover:scale-110">
                      <Plus className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
                      Male Flatmate
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                      Need a Flatmate?
                    </h4>
                    <p className="text-xs text-slate-500 max-w-[210px] mb-5 leading-relaxed">
                      Post your requirement & find verified male roommates in Kolkata.
                    </p>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 group-hover:shadow-blue-300/50"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Post Male Requirement</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Break Section After Male Flatmates ── */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="w-full border-t border-dashed border-amber-200/80" />
          <div className="absolute px-4 bg-[#FFFDF9] text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Flatzy Flatshare</span>
          </div>
        </div>

        {/* ── The 3 Trust Cards Section (Tailored for Brokers in Tenant Postings view) ── */}
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 rounded-3xl border border-amber-200/70 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider">
              <span>{intentFilter === 'All' ? 'For Verified Brokers & Landlords' : 'Simple, Safe & Transparent'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {intentFilter === 'All'
                ? 'No Waiting for Leads — Find Verified Tenants Instantly'
                : 'Finding Flatmates Made Hassle-Free'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              {intentFilter === 'All'
                ? 'Directly browse verified tenant requirements across New Town, Sector V & Salt Lake. Connect immediately without cold calling.'
                : 'No constant Telegram scrolling searching for a roommate, no endless broker spam, no fake profiles, and complete privacy control.'}
            </p>
          </div>

          {/* BounceCards Interactive Visual for all screen sizes */}
          <div className="flex justify-center items-center py-4 overflow-hidden">
            <BounceCards
              className="mx-auto"
              images={intentFilter === 'All' ? [
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        ⚡
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Direct Access
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          No Waiting for Leads
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-emerald-50 mt-1 leading-relaxed">
                          All live tenant requirements are listed directly here with budget and move-in dates.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        📋
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Terms & Conditions
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          Terms & Conditions Apply
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-amber-50 mt-1 leading-relaxed">
                          Only verified brokers and property managers may unlock contact info. Fair deal policy applies.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        🤝
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Instant Match
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          Close Deals Fast
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-blue-50 mt-1 leading-relaxed">
                          Connect directly with genuine working professionals and families ready to rent immediately.
                        </p>
                      </div>
                    </div>
                  )
                }
              ] : [
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        🚫
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          No Spam
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          Zero Telegram Chaos
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-rose-50 mt-1 leading-relaxed">
                          No constant Telegram scrolling searching for a roommate. Verified listings only.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        🛡️
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Privacy 1st
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          100% Privacy
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-amber-50 mt-1 leading-relaxed">
                          No photos required. Your phone number is only shared when you choose to connect.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        💬
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Direct Contact
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          Direct WhatsApp
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-emerald-50 mt-1 leading-relaxed">
                          Connect straight with prospective flatmates. Transparent phone number sharing.
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  content: (
                    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between text-left bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white select-none">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-xs">
                        🤝
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wide mb-1">
                          Assisted Closing
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          Broker Help
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-blue-50 mt-1 leading-relaxed">
                          Need a whole flat together? Verified Flatzy brokers help you close verified flats fast.
                        </p>
                      </div>
                    </div>
                  )
                }
              ]}
              containerWidth={380}
              containerHeight={230}
              cardSize={185}
              spread={65}
              rotation={7}
              arc={-4}
              pushDistance={120}
              hoverScale={1.08}
              bounciness={0.65}
              animationDelay={0.2}
              animationStagger={0.08}
              borderWidth={2}
              borderColor="#ffffff"
              radius={24}
              shadow
              enableHover
            />
          </div>
        </div>

        {/* ── Below That: Save 50% Rent Graphic Banner (Hidden in Tenant Postings view) ── */}
        {intentFilter !== 'All' && (
          <div 
            onClick={() => setIsPostModalOpen(true)}
            className="relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group border border-amber-200/60 bg-white"
          >
            <img
              src="/share-flat-banner.png"
              alt="Share a Flat. Save 50% Rent. Connect with verified roommates near Sector V, New Town, and Salt Lake. Post Your Requirement"
              className="w-full h-auto object-cover block group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        )}



      {/* ── Unlock Number Dialog ── */}
      {unlockProfile && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200"
          onClick={() => setUnlockProfile(null)}
        >
          <div
            className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X */}
            <button
              onClick={() => setUnlockProfile(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Content */}
            <div className="p-5 pt-6 space-y-4 text-center bg-white">
              {/* WhatsApp Icon with Clean Circle */}
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
                <WhatsAppIcon className="w-7 h-7 fill-[#25D366]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Get This Number
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Message Flatzy on WhatsApp to unlock <span className="font-bold text-slate-800">{unlockProfile.name}</span>'s verified contact number.
                </p>
              </div>

              {/* Requirement Summary Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 text-left space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {unlockProfile.name}
                    </span>
                    <img
                      src="/verified-badge.png"
                      alt="Verified"
                      className="w-3.5 h-3.5 shrink-0"
                    />
                  </div>
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                    {unlockProfile.budgetRaw || `₹${unlockProfile.budgetPerMonth.toLocaleString('en-IN')}/mo`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>🏠 {unlockProfile.lookingForBhk}</span>
                  {unlockProfile.furnishingPref && (
                    <>
                      <span>•</span>
                      <span className="text-teal-700">{unlockProfile.furnishingPref}</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-medium truncate">
                  📍 {unlockProfile.preferredLocations.join(', ')}
                </div>
              </div>

              {/* WhatsApp Redirect Button */}
              <button
                type="button"
                onClick={() => handleUnlockWhatsApp(unlockProfile)}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                <span>Get This Number on WhatsApp</span>
              </button>

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => setUnlockProfile(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Roommate Profile Modal */}
      <PostRoommateModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={handleAddProfileSuccess}
      />

      {/* 3-Step Hinglish Onboarding Dialog for First-Time Users */}
      <RoommateOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        onStartPosting={() => setIsPostModalOpen(true)}
      />

      </div>
    </div>
  );
};
