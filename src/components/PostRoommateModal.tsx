import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Heart,
  Check,
  Smile,
  ShieldCheck,
  Edit2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CUTE_AVATARS, CuteAvatarDisplay, getAvatarById } from './CuteAvatar';
import type { RoommateProfile, Profession, FlatPreference, FoodPreference } from '../types/roommate';
import { saveRoommateProfile } from '../services/roommateService';

interface PostRoommateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProfile: RoommateProfile) => void;
}

// Minimum budget thresholds per flat type
const MIN_BUDGET_MAP: Record<FlatPreference, number> = {
  '1 BHK': 9000,
  '2 BHK': 18000,
  '3 BHK': 25000,
};

export const PostRoommateModal: React.FC<PostRoommateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState(CUTE_AVATARS[0].id);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [religion, setReligion] = useState('Open to All');
  const [profession, setProfession] = useState<Profession>('Working Professional');
  const [occupationTitle, setOccupationTitle] = useState('');
  const [listingType, setListingType] = useState<'Team-Up' | 'Room in Flat'>('Team-Up');
  const [lookingForBhk, setLookingForBhk] = useState<FlatPreference>('1 BHK');
  const [budgetPerMonth, setBudgetPerMonth] = useState<number | ''>(9000);
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Shapoorji']);
  
  // Move-in selection: 'Immediate' or 'date'
  const [moveInType, setMoveInType] = useState<'immediate' | 'date'>('immediate');
  const [selectedDate, setSelectedDate] = useState('');
  const [budgetError, setBudgetError] = useState('');

  // Lifestyle habits
  const [diet, setDiet] = useState<FoodPreference>('Non-Vegetarian');
  const [smoking, setSmoking] = useState<'Non-Smoker' | 'Smoker' | 'Social Smoker'>('Non-Smoker');
  const [drinking, setDrinking] = useState<'Non-Drinker' | 'Occasional' | 'Doesn\'t Matter'>('Occasional');
  const [pets, setPets] = useState<'Pet Friendly' | 'No Pets'>('Pet Friendly');
  const [sleepSchedule, setSleepSchedule] = useState<'Early Bird' | 'Night Owl' | 'Flexible'>('Flexible');
  const [aboutMe, setAboutMe] = useState('');
  const [contactWhatsApp, setContactWhatsApp] = useState('');

  if (!isOpen) return null;

  const minAllowedBudget = MIN_BUDGET_MAP[lookingForBhk];

  const handleBhkChange = (bhk: FlatPreference) => {
    setLookingForBhk(bhk);
    const newMin = MIN_BUDGET_MAP[bhk];
    if (typeof budgetPerMonth === 'number' && budgetPerMonth < newMin) {
      setBudgetPerMonth(newMin);
      setBudgetError('');
    }
  };

  const toggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      if (preferredLocations.length > 1) {
        setPreferredLocations(preferredLocations.filter(l => l !== loc));
      }
    } else {
      if (preferredLocations.length < 2) {
        setPreferredLocations([...preferredLocations, loc]);
      } else {
        // Replace second location if already at max 2
        setPreferredLocations([preferredLocations[0], loc]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactWhatsApp.trim()) return;

    const budgetNum = Number(budgetPerMonth) || 0;
    if (budgetNum < minAllowedBudget) {
      setBudgetError(`Minimum budget for ${lookingForBhk} is ₹${minAllowedBudget.toLocaleString('en-IN')}/mo`);
      return;
    }
    setBudgetError('');

    const formattedMoveIn = moveInType === 'immediate' 
      ? 'Immediate' 
      : (selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Immediate');

    const newProfile: RoommateProfile = {
      id: `roommate-${Date.now()}`,
      name: name.trim(),
      age: Number(age) || 24,
      gender,
      avatarId: selectedAvatarId,
      profession,
      occupationTitle: occupationTitle.trim() || (profession === 'Student' ? 'College Student' : 'Working Professional'),
      religion: religion.trim() || 'Open to All',
      lookingForBhk,
      listingType,
      budgetPerMonth: budgetNum,
      preferredLocations,
      moveInDate: formattedMoveIn,
      lifestyleHabits: {
        diet,
        smoking,
        drinking,
        pets,
        sleepSchedule,
      },
      aboutMe: aboutMe.trim() || 'Friendly, respectful flatmate in Kolkata!',
      contactWhatsApp: contactWhatsApp.trim().replace(/\D/g, ''),
      createdAt: new Date().toISOString(),
    };

    saveRoommateProfile(newProfile).catch((err) => {
      console.warn('Error saving roommate profile:', err);
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });
    } catch {}

    onSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 text-left flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Clean Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight font-poppins">
                Find Your Next Flatmate
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              100% Privacy • No real photos needed • Direct contact
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
          
          {/* 1. Single Profile Avatar with Pen Icon to open cute Dialog */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => setIsAvatarPickerOpen(true)}>
                <CuteAvatarDisplay avatarId={selectedAvatarId} size="md" showAnimation={false} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAvatarPickerOpen(true);
                  }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-90"
                  title="Change Avatar"
                  aria-label="Change Avatar"
                >
                  <Edit2 className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
              <div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>{getAvatarById(selectedAvatarId).name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    Avatar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tap the pen icon to pick your cute character
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-xs shadow-2xs hover:bg-amber-50/50 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Edit2 className="w-3 h-3 text-amber-600" />
              <span>Change</span>
            </button>
          </div>

          {/* Basic Info: Compact 2-Col Grid */}
          <div className="space-y-2.5 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              2. Basic Information
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <span className="text-[11px] font-bold text-slate-500">First Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyo, Ananya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Age</span>
                <input
                  type="number"
                  required
                  min={18}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || '')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Gender & Status: Clean Segmented Controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Gender</span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {(['Male', 'Female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        gender === g
                          ? (g === 'Female' ? 'bg-pink-500 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <img
                        src={g === 'Female' ? '/female-icon.png' : '/male-icon.png'}
                        alt={g}
                        className={`w-3 h-3 object-contain ${gender === g ? 'brightness-200' : ''}`}
                      />
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Status</span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {(['Working Professional', 'Student'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProfession(p)}
                      className={`py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all truncate text-center ${
                        profession === p
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p === 'Student' ? 'Student' : 'Working'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Workplace / College & Religion */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Company / College</span>
                <input
                  type="text"
                  placeholder="e.g. TCS Sector V"
                  value={occupationTitle}
                  onChange={(e) => setOccupationTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Religion</span>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Open to All">Open to All</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Sikh">Sikh</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flat & Budget Preferences */}
          <div className="space-y-2.5 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              3. Flat Setup & Budget
            </label>

            {/* Setup Type Segmented Switcher */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500">I am looking to:</span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-center">
                <button
                  type="button"
                  onClick={() => setListingType('Team-Up')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    listingType === 'Team-Up'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🤝 New Roommate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('Room in Flat')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    listingType === 'Room in Flat'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🏠 Room in Existing Flat</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Looking For</span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-center">
                  {(['1 BHK', '2 BHK', '3 BHK'] as const).map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => handleBhkChange(bhk)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${
                        lookingForBhk === bhk
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Max Budget (₹/mo)</span>
                  <span className="text-[10px] font-bold text-amber-700">
                    Min ₹{minAllowedBudget.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={minAllowedBudget}
                  placeholder={`Min ₹${minAllowedBudget}`}
                  value={budgetPerMonth}
                  onChange={(e) => {
                    setBudgetPerMonth(Number(e.target.value) || '');
                    setBudgetError('');
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-slate-800 focus:outline-none ${
                    budgetError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
              </div>
            </div>

            {budgetError && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{budgetError}</span>
              </div>
            )}

            {/* Move-in Date & Preferred Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Move-in Date</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMoveInType('immediate');
                      setSelectedDate('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                      moveInType === 'immediate'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Immediate
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        if (e.target.value) {
                          setMoveInType('date');
                        }
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-semibold focus:border-amber-500 focus:outline-none cursor-pointer ${
                        moveInType === 'date'
                          ? 'border-amber-500 bg-amber-50/30 text-amber-900 font-bold'
                          : 'border-slate-200 text-slate-600 bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Locations (Pick up to 2)</span>
                <div className="flex flex-wrap gap-1">
                  {['Shapoorji', 'New Town', 'Salt Lake', 'Kestopur'].map((loc) => {
                    const isSelected = preferredLocations.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => toggleLocation(loc)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {loc} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Habits & Bio */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              4. Lifestyle & Bio
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Diet</span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                  {(['Vegetarian', 'Non-Vegetarian'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDiet(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                        diet === d
                          ? (d === 'Vegetarian' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-rose-500 text-white shadow-xs')
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {d === 'Vegetarian' ? '🥗 Veg' : '🍗 Non-Veg'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Smoking</span>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="Non-Smoker">🚭 Non-Smoker</option>
                  <option value="Social Smoker">🚬 Social</option>
                  <option value="Smoker">Smoker</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">One line about you</span>
                <span className={`text-[10px] font-bold ${aboutMe.length >= 18 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {aboutMe.length}/20
                </span>
              </div>
              <input
                type="text"
                maxLength={20}
                placeholder="e.g. Chill & clean"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value.slice(0, 20))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact (Direct WhatsApp) */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-emerald-900">
                5. WhatsApp Number
              </label>
              <span className="text-[10px] font-bold text-emerald-700">
                🔒 Kept safe
              </span>
            </div>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={contactWhatsApp}
              onChange={(e) => setContactWhatsApp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs font-bold text-slate-900 bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Flatmate Profile</span>
            </button>
          </div>

        </form>

        {/* ── Cute Avatar Picker Pop-up Dialog ── */}
        {isAvatarPickerOpen && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsAvatarPickerOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl p-4 sm:p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Choose Your Avatar 🎨
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tap any character to set as your profile
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Avatars without jumping */}
              <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1 no-scrollbar">
                {CUTE_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarId(avatar.id);
                        setIsAvatarPickerOpen(false);
                      }}
                      className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all border ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-xs scale-105'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <CuteAvatarDisplay avatarId={avatar.id} size="sm" showAnimation={false} />
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                        {avatar.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(false)}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
