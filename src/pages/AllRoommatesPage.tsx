import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Sparkles, 
  Plus, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import type { RoommateProfile, FlatPreference } from '../types/roommate';
import { getRoommateProfiles } from '../data/roommatesData';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { FLATZY_WHATSAPP_NUMBER } from '../config/contact';

interface AllRoommatesPageProps {
  onNavigate: (tab: string) => void;
  initialGender?: 'All' | 'Female' | 'Male';
  onOpenPostModal?: () => void;
}

const ITEMS_PER_PAGE = 7;

export const AllRoommatesPage: React.FC<AllRoommatesPageProps> = ({
  onNavigate,
  initialGender = 'All',
  onOpenPostModal
}) => {
  const [profiles] = useState<RoommateProfile[]>(() => getRoommateProfiles());

  // Filter States
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>(initialGender);
  const [intentFilter, setIntentFilter] = useState<'All' | 'Team-Up' | 'Room'>('All');
  const [bhkFilter, setBhkFilter] = useState<FlatPreference | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockProfile, setUnlockProfile] = useState<RoommateProfile | null>(null);

  // Filter logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (genderFilter !== 'All' && p.gender !== genderFilter) return false;
      if (intentFilter === 'Team-Up') {
        const isTeamUp = p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up');
        if (!isTeamUp) return false;
      }
      if (intentFilter === 'Room') {
        const isRoom = p.listingType === 'Room in Flat' || (!p.aboutMe.toLowerCase().includes('team up'));
        if (!isRoom) return false;
      }
      if (bhkFilter !== 'All' && p.lookingForBhk !== bhkFilter) return false;
      return true;
    });
  }, [profiles, genderFilter, intentFilter, bhkFilter]);

  // Pagination (Strictly max 7 cards per page)
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE));
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProfiles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProfiles, currentPage]);

  const handleGenderChange = (g: 'All' | 'Female' | 'Male') => {
    setGenderFilter(g);
    setCurrentPage(1);
  };

  const handleIntentChange = (i: 'All' | 'Team-Up' | 'Room') => {
    setIntentFilter(i);
    setCurrentPage(1);
  };

  const handleBhkChange = (b: FlatPreference | 'All') => {
    setBhkFilter(b);
    setCurrentPage(1);
  };

  const handleContactWhatsApp = (p: RoommateProfile) => {
    const text = `*I WANT THE NUMBER* 📞\n\nHi Flatzy! I'm interested in connecting with this flatmate. Here are their details:\n\n👤 *Name:* ${p.name} (${p.age} yrs, ${p.gender})\n🏠 *Looking For:* ${p.lookingForBhk} (${p.listingType === 'Team-Up' ? 'New Roommate / Team-Up' : 'Room in Flat'})\n💰 *Budget:* ₹${p.budgetPerMonth.toLocaleString('en-IN')}/month\n📍 *Preferred Location:* ${p.preferredLocations.join(', ')}\n💼 *Profession:* ${p.occupationTitle}\n📅 *Move-in Date:* ${p.moveInDate}\n\nPlease share their contact number with me!`;
    const cleanPhone = FLATZY_WHATSAPP_NUMBER || '918910376054';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleUnlockWhatsApp = (p: RoommateProfile) => {
    const text = `*I WANT THE NUMBER* 🔓\n\nHi Flatzy! I'd like to unlock this flatmate's contact details:\n\n👤 *Name:* ${p.name} (${p.age} yrs, ${p.gender})\n🏠 *Looking For:* ${p.lookingForBhk} (${p.listingType === 'Team-Up' ? 'New Roommate / Team-Up' : 'Room in Flat'})\n💰 *Budget:* ₹${p.budgetPerMonth.toLocaleString('en-IN')}/month\n📍 *Area:* ${p.preferredLocations.join(', ')}\n💼 *Profession:* ${p.occupationTitle}\n📅 *Move-in Date:* ${p.moveInDate}\n\nPlease share their contact number with me!`;
    const url = `https://wa.me/918910376054?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setUnlockProfile(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] animate-in fade-in duration-300 pb-20">
      
      {/* ── Top Navigation Bar / Breadcrumb ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('roommates')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 hover:text-amber-600 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Flatzymate</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
              Showing {filteredProfiles.length} verified listings
            </span>
            {onOpenPostModal && (
              <button
                onClick={onOpenPostModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Post Requirement</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-6">

        {/* ── TOP BANNER: Share a Flat. Save 50% Rent ── */}
        <div 
          onClick={() => onOpenPostModal && onOpenPostModal()}
          className="relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group border border-amber-200/60 bg-white"
        >
          <img
            src="/share-flat-banner.png"
            alt="Share a Flat. Save 50% Rent. Connect with verified roommates near Sector V, New Town, and Salt Lake. Post Your Requirement"
            className="w-full h-auto object-cover block group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>

        {/* ── TOP FILTERS CONTAINER ── */}
        {/* ── TOP FILTERS CONTAINER: Single Unified Row ── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2 sm:p-3.5 shadow-soft">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            
            {/* 1. Looking For (Gender) Dropdown */}
            <div className="relative flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer">
              <span className="text-base sm:text-lg select-none shrink-0">
                {genderFilter === 'Female' ? '♀️' : genderFilter === 'Male' ? '♂️' : '👥'}
              </span>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none truncate mb-1">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => handleGenderChange(e.target.value as any)}
                  className="w-full bg-transparent text-xs sm:text-sm md:text-[15px] font-black text-slate-900 cursor-pointer focus:outline-none appearance-none truncate pr-4"
                >
                  <option value="All">All Genders</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
            </div>

            {/* 2. Setup Type Dropdown */}
            <div className="relative flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer">
              <span className="text-base sm:text-lg select-none shrink-0">
                {intentFilter === 'Team-Up' ? '🤝' : intentFilter === 'Room' ? '🏠' : '✨'}
              </span>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1 truncate">
                  Setup
                </label>
                <select
                  value={intentFilter}
                  onChange={(e) => handleIntentChange(e.target.value as any)}
                  className="w-full bg-transparent text-xs sm:text-sm md:text-[15px] font-black text-slate-900 cursor-pointer focus:outline-none appearance-none truncate pr-4"
                >
                  <option value="All">All Setups</option>
                  <option value="Team-Up">New Roommate</option>
                  <option value="Room">Room in Flat</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
            </div>

            {/* 3. BHK Configuration Dropdown */}
            <div className="relative flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer">
              <span className="text-base sm:text-lg select-none shrink-0">🏢</span>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1 truncate">
                  BHK
                </label>
                <select
                  value={bhkFilter}
                  onChange={(e) => handleBhkChange(e.target.value as any)}
                  className="w-full bg-transparent text-xs sm:text-sm md:text-[15px] font-black text-slate-900 cursor-pointer focus:outline-none appearance-none truncate pr-4"
                >
                  <option value="All">All BHK</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* ── CARDS FEED (Vertical going down, longer sideways cards, max 7 per page) ── */}
        {paginatedProfiles.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-slate-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-base font-black text-slate-800">No Listings Match Filters</h3>
            <p className="text-xs text-slate-500">
              Try switching back to "All Flatmates" or resetting the setup filters.
            </p>
            <button
              onClick={() => {
                setGenderFilter('All');
                setIntentFilter('All');
                setBhkFilter('All');
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedProfiles.map((p) => {
              const isFemale = p.gender === 'Female';
              const isTeamUp = p.listingType === 'Team-Up' || p.aboutMe.toLowerCase().includes('team up');

              return (
                <div
                  key={p.id}
                  className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-200 overflow-hidden"
                >
                  {/* Landscape Card Layout: Left Info, Right Rent & Actions on Desktop / Stacked on Mobile */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left & Middle: Profile Details */}
                    <div className="flex-1 space-y-2.5">
                      
                      {/* Name, Age, Gender Pill & Setup Badge */}
                      <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {p.name.trim().split(' ')[0]}
                          </h4>
                          <span className="text-sm font-bold text-slate-400">
                            {p.age} yrs
                          </span>
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black border ${
                            isFemale
                              ? 'bg-pink-50 border-pink-200 text-pink-600'
                              : 'bg-blue-50 border-blue-200 text-blue-600'
                          }`}>
                            <img 
                              src={isFemale ? "/female-icon.png" : "/male-icon.png"} 
                              alt="" 
                              className="w-3 h-3" 
                            />
                            <span>{isFemale ? 'F' : 'M'}</span>
                          </span>
                        </div>

                        {/* Setup Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          isTeamUp
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                        }`}>
                          {isTeamUp ? '🤝 New Roommate' : '🏠 Room in Flat'}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white text-xs font-black shadow-2xs uppercase">
                          {p.lookingForBhk}
                        </span>
                      </div>

                      {/* Profession, Locations, Move-in & Diet */}
                      <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs text-slate-600 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{p.occupationTitle}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{p.preferredLocations.slice(0, 3).join(', ')}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          <span>📅 Move-in: {p.moveInDate}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <span>🥗 {p.lifestyleHabits.diet}</span>
                          <span>•</span>
                          <span>🚭 {p.lifestyleHabits.smoking}</span>
                        </div>
                      </div>

                      {/* Bio Quote (Visible 2 lines) */}
                      <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
                          "{p.aboutMe}"
                        </p>
                      </div>

                    </div>

                    {/* Right Side: Rent Callout & Action Buttons */}
                    <div className="md:w-56 shrink-0 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5 space-y-3">
                      
                      <div className="w-full flex md:flex-col items-baseline md:items-end justify-between md:justify-start">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Budget</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                            ₹{p.budgetPerMonth.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-emerald-600 font-semibold">/mo</span>
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="w-full grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleContactWhatsApp(p)}
                          className="py-2.5 px-3 rounded-xl bg-[#00A859] hover:bg-[#008f4c] active:scale-[0.98] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => setUnlockProfile(p)}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Number</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION (Strict max 7 cards per page) ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 select-none">
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ── Unlock Number Dialog ── */}
      {unlockProfile && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setUnlockProfile(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-black">
              🔓
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Contact {unlockProfile.name}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect with our team on WhatsApp to directly unlock and receive {unlockProfile.name.trim().split(' ')[0]}'s verified phone number.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Looking for:</span>
                <span className="font-bold text-slate-900">{unlockProfile.lookingForBhk}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Budget:</span>
                <span className="font-bold text-emerald-700">₹{unlockProfile.budgetPerMonth.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-bold text-slate-900">{unlockProfile.preferredLocations[0]}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setUnlockProfile(null)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnlockWhatsApp(unlockProfile)}
                className="py-2.5 px-3 rounded-xl bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Get on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
