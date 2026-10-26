import React, { useState, useEffect, useRef } from 'react';
import type { Property, LocationName, BudgetRange } from '../types/property';
import { PROPERTIES_DATA } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import BounceCards from '../components/BounceCards';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Instagram, 
  Flame, 
  Building, 
  Key, 
  ChevronRight, 
  ChevronLeft,
  Users, 
  Heart, 
  Video, 
  Film,
  Star,
  Play,
  Bell
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, extra?: any) => void;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenInquiryModal: (property?: Property) => void;
  onApplyQuickFilter: (loc?: LocationName, budget?: BudgetRange) => void;
  onOpenScheduleVisit?: (property: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenInquiryModal,
  onApplyQuickFilter,
  onOpenScheduleVisit,
}) => {
  const { t, language } = useLanguage();

  // Active location selection
  const [activeHeroLocation, setActiveHeroLocation] = useState<LocationName>('Shapoorji');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Curated Rotating Hero Banners matching user design
  const heroBanners = [
    {
      id: 'banner-avenida-villa',
      title: 'Rare Luxury Courtyard Villa at Tata Avenida',
      location: 'Avenida, New Town',
      image: '/properties/avenida-courtyard/central-courtyard-patio.jpg',
      propertyId: 'prop-avenida-courtyard-villa',
    },
    {
      id: 'banner-1',
      title: 'Modern Living in Prime Locations',
      location: 'New Town, Kolkata',
      image: '/hero-modern-living.jpg',
      propertyId: 'prop-ideal-aquaview-2bhk',
    },
    {
      id: 'banner-2',
      title: 'Siddha Pines — Premium Gated Complex',
      location: 'Rajarhat, Kolkata',
      image: '/properties/siddha-pines/balcony-garden-view.jpg',
      propertyId: 'prop-siddha-pines-3bhk-sale',
    },
    {
      id: 'banner-3',
      title: 'Resort-Style Living with Pool & Club',
      location: 'Action Area II, New Town',
      image: '/banner-ecospace-pool.jpg',
      propertyId: 'prop-ps-one10-3bhk',
    },
    {
      id: 'banner-4',
      title: 'Ideal Aquaview — Scenic Lakefront Living',
      location: 'Mahisbathan, Newtown',
      image: '/properties/ideal-aquaview/living-balcony-view.jpg',
      propertyId: 'prop-ideal-aquaview-2bhk',
    },
    {
      id: 'banner-5',
      title: 'Shapoorji Sukhobrishti — Smart & Walkable',
      location: 'Action Area III, New Town',
      image: '/properties/shapoorji/bedroom-ac.jpg',
      propertyId: 'prop-shapoorji-2bhk-ac',
    }
  ];

  // Automatic banner slide interval (every 3.6s)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroBanners.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [isPaused, heroBanners.length]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      if (distance > 40) {
        // Swiped Left -> Next Banner
        setCurrentSlideIndex((prev) => (prev + 1) % heroBanners.length);
      } else if (distance < -40) {
        // Swiped Right -> Prev Banner
        setCurrentSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
    setIsPaused(false);
  };

  const handlePrevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const handleNextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const handleBannerSelect = (propertyId: string) => {
    const prop = PROPERTIES_DATA.find((p) => p.id === propertyId) || PROPERTIES_DATA[0];
    onSelectProperty(prop);
  };

  // Reusable Auto-Sliding Banner Carousel Component
  const renderBannerCarousel = () => (
    <div 
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Carousel Viewport */}
      <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-soft-lg hover:shadow-xl transition-all duration-300 border border-slate-200/90 bg-slate-900 aspect-[16/9] sm:aspect-[16/10] w-full select-none cursor-pointer">
        
        {/* Horizontal Slide Track */}
        <div 
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {heroBanners.map((banner, idx) => {
            const isSaved = savedPropertyIds.includes(banner.propertyId);
            return (
              <div
                key={banner.id}
                onClick={() => handleBannerSelect(banner.propertyId)}
                className="min-w-full w-full h-full relative shrink-0 overflow-hidden"
              >
                {/* Banner Photo */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Rich bottom gradient for crisp text legibility without obscuring the photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Top-Right Sleek Translucent Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(banner.propertyId);
                  }}
                  className="absolute top-3.5 right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 active:scale-90 transition-all cursor-pointer border border-white/20"
                  title="Save flat"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>

                {/* Bottom Typography & Sleek Action Indicator (Uncluttered) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Location Tag */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-flatzy-yellow font-bold mb-1 drop-shadow-xs">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{banner.location}</span>
                    </div>
                    {/* Title */}
                    <div className="text-sm sm:text-base font-extrabold text-white font-poppins leading-snug drop-shadow-sm truncate">
                      {banner.title}
                    </div>
                  </div>

                  {/* Clean Circular Arrow Action */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/25 hover:bg-flatzy-yellow backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 text-white hover:text-flatzy-navy transition-all group-hover:scale-105">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Prev/Next Arrows (visible on desktop hover) */}
        <button
          onClick={handlePrevBanner}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNextBanner}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        {heroBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlideIndex === idx
                ? 'w-7 h-2 bg-flatzy-yellow'
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );

  // Show just the top 3 handpicked flats on the landing page for clarity
  const handpickedFlats = PROPERTIES_DATA.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#FFFDF7]">
      {/* Scenic Subtle Cityscape Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-[700px] sm:h-[850px] bg-top bg-cover bg-no-repeat pointer-events-none opacity-20"
        style={{ backgroundImage: "url('/city-bg.png')" }}
      />
      <div className="absolute top-0 left-0 right-0 h-[700px] sm:h-[850px] bg-gradient-to-b from-white/30 via-transparent to-[#FFFDF7] pointer-events-none" />

      <div className="relative z-10 space-y-12 sm:space-y-20 pb-16 animate-in fade-in duration-300">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO & PHONE UI BANNER CAROUSEL */}
        {/* ========================================================================= */}
        <section className="relative pt-4 sm:pt-10 lg:pt-14 overflow-hidden">
          
          {/* Kolkata Howrah Bridge Sketch Art Blend in Upper-Right Background */}
          <div className="absolute right-0 top-0 w-80 sm:w-[480px] lg:w-[620px] h-64 sm:h-80 lg:h-96 pointer-events-none overflow-hidden select-none z-0">
            <img
              src="/kolkata-howrah-sketch.jpg"
              alt="Kolkata Landmark Howrah Bridge Art"
              className="w-full h-full object-contain object-right-top opacity-40 sm:opacity-55 mix-blend-multiply"
            />
            {/* Feathering gradients for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF7] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF7] via-transparent to-transparent" />
          </div>

          {/* Warm ambient aura */}
          <div className="absolute top-8 right-10 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-24 left-1/4 w-80 h-80 bg-flatzy-yellow/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              
              {/* Left Column: Headlines, Trust Chips, Popular Locations, CTAs */}
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 text-left pt-3 sm:pt-5">
                
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] sm:text-xs font-bold border border-amber-200/90 shadow-2xs mt-1 sm:mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('hero.badge')}</span>
                </div>

                {/* Hero Title with curved yellow highlight stroke */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-flatzy-navy font-poppins leading-[1.12]">
                  {t('hero.title1')} <br />
                  <span>{t('hero.title2')}{' '}</span>
                  <span className="relative inline-block whitespace-nowrap">
                    <span className="relative z-10">{t('hero.titleHighlight')}</span>
                    <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2.5 sm:h-3.5 bg-flatzy-yellow rounded-full -rotate-1 -z-0" />
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg">
                  {t('hero.subtitle')}
                </p>

                {/* Popular Locations — quick area switcher */}
                <div className="pt-3.5 sm:pt-4 mt-3 sm:mt-4 border-t border-amber-200/70 space-y-2.5">
                  <div className="flex items-center justify-between gap-3 max-w-lg">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      <MapPin className="w-3 h-3 text-flatzy-yellowDark" />
                      <span>{t('hero.popularLocations')}</span>
                    </span>
                    <button
                      onClick={() => onNavigate('locations')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 bg-white/90 border border-slate-200/90 hover:border-flatzy-yellow hover:text-flatzy-navy hover:shadow-2xs transition-all group cursor-pointer"
                    >
                      <span>{t('hero.viewAll')}</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {[
                      { id: 'Shapoorji' as LocationName, label: 'Shapoorji' },
                      { id: 'New Town' as LocationName, label: 'New Town' },
                      { id: 'Sector V' as LocationName, label: 'Sector 5' },
                      { id: 'Rajarhat' as LocationName, label: 'Rajarhat' },
                    ].map((loc) => {
                      const isActive = activeHeroLocation === loc.id;
                      return (
                        <button
                          key={loc.id}
                          onClick={() => {
                            setActiveHeroLocation(loc.id);
                            onApplyQuickFilter(loc.id);
                          }}
                          aria-pressed={isActive}
                          className={`group inline-flex items-center gap-1.5 shrink-0 pl-2.5 pr-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-flatzy-yellow text-flatzy-navy font-black ring-2 ring-flatzy-yellow/30 shadow-[0_8px_20px_-8px_rgba(255,200,0,0.95)]'
                              : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:border-amber-300 hover:text-flatzy-navy hover:-translate-y-0.5 hover:shadow-2xs'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                              isActive ? 'bg-flatzy-navy' : 'bg-slate-300 group-hover:bg-flatzy-yellow'
                            }`}
                            aria-hidden="true"
                          />
                          <span>{loc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile View Banner Carousel: Rendered here on mobile right before the Action Buttons! */}
                <div className="block lg:hidden pt-2">
                  {renderBannerCarousel()}
                </div>

                {/* Action Buttons (2-column on mobile & tablet, stacked/clean on larger screens) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 pt-2 max-w-lg">
                  <button
                    onClick={() => onNavigate('explore')}
                    className="w-full py-3 sm:py-3.5 px-3 sm:px-6 rounded-2xl sm:rounded-full bg-flatzy-yellow hover:bg-flatzy-yellowDark active:scale-[0.98] text-flatzy-navy font-black text-xs sm:text-sm shadow-soft hover:shadow-yellow-glow transition-all flex items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-flatzy-navy group-hover:rotate-45 transition-transform duration-300 shrink-0" />
                    <span className="truncate">{t('hero.exploreCta')}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('how-it-works')}
                    className="w-full py-3 sm:py-3.5 px-3 sm:px-6 rounded-2xl sm:rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-black text-xs sm:text-sm border border-slate-200/90 shadow-2xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Play className="w-2 h-2 fill-white ml-0.5" />
                    </div>
                    <span className="truncate">{t('hero.howItWorksCta')}</span>
                  </button>
                </div>

              </div>

              {/* Desktop View Banner Carousel: Rendered in right column on large screens */}
              <div className="hidden lg:block lg:col-span-5 space-y-3.5">
                {renderBannerCarousel()}
              </div>

            </div>
          </div>
        </section>

      {/* ========================================================================= */}
      {/* SECTION 2: HANDPICKED FLATS (Concise, clean 3 cards) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-flatzy-yellowDark flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-flatzy-coral" />
              <span>{t('handpicked.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-flatzy-navy font-poppins mt-1">
              {t('handpicked.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('handpicked.subtitle')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-flatzy-navy font-bold text-xs transition-colors self-start sm:self-auto"
          >
            <span>{t('handpicked.viewAll')} ({PROPERTIES_DATA.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Focused Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {handpickedFlats.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={savedPropertyIds.includes(property.id)}
              onToggleSave={onToggleSave}
              onSelectProperty={onSelectProperty}
              onScheduleVisit={onOpenScheduleVisit}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('explore')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-flatzy-navy font-bold text-xs uppercase tracking-wider border border-slate-200 shadow-soft hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-flatzy-yellowDark" />
            <span>{t('handpicked.catalogBtn')} ({PROPERTIES_DATA.length})</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE 3-IN-1 ECOSYSTEM (Flats + Roommates + Brokers vs The Chaos) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDF8EE] text-slate-900 p-6 sm:p-10 md:p-12 border border-amber-200/70 shadow-xl">
          
          {/* Subtle Warm Light Ambient Highlights */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/35 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2.5 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold tracking-wide shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Flats • Roommates • Brokers</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-poppins text-slate-900 tracking-tight leading-tight">
              Tired of the chaos on{' '}
              <span className="relative inline-block text-slate-400 line-through decoration-rose-500 decoration-2">
                <span className="text-[#0089D0]">99acres</span> & <span className="text-[#FF5630]">OLX</span>
              </span>
              ?
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
              No phone spam, no fake photos. Flatzy brings Kolkata’s flats, roommates, and trusted brokers together under one calm roof.
            </p>
          </div>

          {/* 3 Streamlined Cards — interactive fan deck */}
          <div className="relative z-10 flex items-center justify-center overflow-visible mb-6">
            <BounceCards
              images={[
                {
                  alt: 'Verified Kolkata Homes',
                  content: (
                    <div className="w-full h-full p-3.5 flex flex-col justify-between bg-white text-left select-none">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg" aria-hidden="true">🏠</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[8px] font-bold uppercase tracking-wide">
                            Curated Flats
                          </span>
                        </div>
                        <h3 className="text-[13px] font-black text-slate-900 font-poppins leading-tight">
                          Verified Kolkata Homes
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Real daylight photos in New Town, Action Area 1-3 &amp; Shapoorji. Zero stock renders.
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 space-y-0.5 text-[9px]">
                        <div className="text-rose-500 line-through">Spam calls &amp; fake ads</div>
                        <div className="text-emerald-700 font-bold">✓ 100% Real</div>
                      </div>
                    </div>
                  )
                },
                {
                  alt: 'Compatible Roommates',
                  content: (
                    <div className="w-full h-full p-3.5 flex flex-col justify-between bg-gradient-to-b from-[#FFF9EA] via-[#FFF5DB] to-[#FFEFCA] text-left select-none">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg" aria-hidden="true">👥</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[8px] font-black uppercase tracking-wide">
                            Flatzymate
                          </span>
                        </div>
                        <h3 className="text-[13px] font-black text-slate-900 font-poppins leading-tight">
                          Compatible Roommates
                        </h3>
                        <p className="text-[10px] text-slate-700 leading-snug font-medium">
                          Match with verified students &amp; professionals by budget, gender, and habits.
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-amber-300/60 space-y-0.5 text-[9px]">
                        <div className="text-rose-600 line-through">OLX scams &amp; strangers</div>
                        <div className="text-emerald-800 font-bold">✓ Verified Profiles</div>
                      </div>
                    </div>
                  )
                },
                {
                  alt: 'Direct Broker Connect',
                  content: (
                    <div className="w-full h-full p-3.5 flex flex-col justify-between bg-white text-left select-none">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg" aria-hidden="true">🤝</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[8px] font-bold uppercase tracking-wide">
                            Top Brokers
                          </span>
                        </div>
                        <h3 className="text-[13px] font-black text-slate-900 font-poppins leading-tight">
                          Direct Broker Connect
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Rated local agents. WhatsApp them directly — your phone number is never shared.
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 space-y-0.5 text-[9px]">
                        <div className="text-rose-500 line-through">30 calls an hour</div>
                        <div className="text-emerald-700 font-bold">✓ Zero Spam</div>
                      </div>
                    </div>
                  )
                }
              ]}
              containerWidth={430}
              containerHeight={265}
              cardSize={195}
              spread={70}
              rotation={9}
              arc={9}
              pushDistance={135}
              hoverScale={1.07}
              bounciness={0.65}
              animationDelay={0.25}
              animationStagger={0.08}
              borderWidth={3}
              borderColor="#ffffff"
              radius={18}
              shadow={true}
              enableHover={true}
              onCardClick={(idx) => onNavigate(['explore', 'roommates', 'brokers'][idx])}
              className="mx-auto select-none"
            />
          </div>

          {/* Streamlined Comparison Table */}
          <div className="relative z-10 overflow-x-auto no-scrollbar rounded-2xl border border-amber-200/80 bg-white shadow-xs">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50/50 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 font-bold">Standard</th>
                  <th className="py-3 px-3 text-center font-semibold text-slate-500">99acres</th>
                  <th className="py-3 px-3 text-center font-semibold text-slate-500">OLX</th>
                  <th className="py-3 px-4 text-center font-black text-amber-900 bg-amber-100/50 border-l border-r border-amber-200">
                    Flatzy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {/* Row 1 */}
                <tr className="hover:bg-amber-50/20">
                  <td className="py-3 px-4 text-slate-900">
                    <div>🏠 Real Photos & Tours</div>
                  </td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Stock / Fake</span></td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Blurry</span></td>
                  <td className="py-3 px-4 text-center bg-amber-50/40 border-l border-r border-amber-200/70 text-emerald-800">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ 100% Verified</span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-amber-50/20">
                  <td className="py-3 px-4 text-slate-900">
                    <div>👥 Roommate Matching</div>
                  </td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">None</span></td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Unmoderated</span></td>
                  <td className="py-3 px-4 text-center bg-amber-50/40 border-l border-r border-amber-200/70 text-emerald-800">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Flatzymate</span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-amber-50/20">
                  <td className="py-3 px-4 text-slate-900">
                    <div>🤝 Phone Spam Protection</div>
                  </td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Sold to agents</span></td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Public number</span></td>
                  <td className="py-3 px-4 text-center bg-amber-50/40 border-l border-r border-amber-200/70 text-emerald-800">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ 0% Phone Spam</span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-amber-50/20">
                  <td className="py-3 px-4 text-slate-900">
                    <div>⚡ Live Active Inventory</div>
                  </td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Old zombies</span></td>
                  <td className="py-3 px-3 text-center text-rose-500">✕ <span className="text-[10px] text-slate-400 block font-normal">Dead ads</span></td>
                  <td className="py-3 px-4 text-center bg-amber-50/40 border-l border-r border-amber-200/70 text-emerald-800">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Live & Fresh</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Action Note */}
          <div className="relative z-10 mt-6 pt-5 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-slate-600 font-medium">
              Start exploring Kolkata's calm rental network:
            </span>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
              >
                Flats →
              </button>
              <button
                onClick={() => onNavigate('roommates')}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
              >
                Roommates →
              </button>
              <button
                onClick={() => onNavigate('brokers')}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
              >
                Brokers →
              </button>
            </div>
          </div>

        </div>
      </section>



      {/* ========================================================================= */}
      {/* SECTION 4: HOW FLATZY WORKS (Clean & Minimal 3-Step) */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/60 py-12 sm:py-16 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-flatzy-coral">
              {t('steps.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-flatzy-navy font-poppins">
              {t('steps.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('steps.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-2.5">
              <div className="text-2xl font-black text-flatzy-yellow">01</div>
              <h4 className="font-extrabold text-base text-flatzy-navy">{t('steps.s1Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('steps.s1Desc')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-2.5">
              <div className="text-2xl font-black text-flatzy-yellow">02</div>
              <h4 className="font-extrabold text-base text-flatzy-navy">{t('steps.s2Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('steps.s2Desc')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-2.5">
              <div className="text-2xl font-black text-emerald-500">03</div>
              <h4 className="font-extrabold text-base text-flatzy-navy">{t('steps.s3Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('steps.s3Desc')}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('policies')}
              className="text-xs font-bold text-flatzy-navy hover:text-flatzy-coral transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>See Platform Policies & FAQs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FINAL CLEAN CTA BANNER WITH FIND YOUR FLAT BG */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-5 sm:p-7 md:p-9 text-flatzy-navy shadow-xl border border-amber-300/80">
          {/* Custom Find Your Flat Panoramic Cityscape Background with improved blend */}
          <div 
            className="absolute inset-0 bg-cover bg-center sm:bg-bottom pointer-events-none opacity-35 mix-blend-multiply"
            style={{ backgroundImage: "url('/find-your-flat-bg.png')" }}
          />
          {/* Radiant radial aura & subtle geometric grid */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/50 via-transparent to-amber-300/30 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-2xs text-[10px] sm:text-[11px] font-black text-flatzy-navy uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Verified Direct Rentals • 0% Broker Spam</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-poppins text-flatzy-navy leading-tight tracking-tight drop-shadow-2xs">
              {t('cta.title')}
            </h3>

            <p className="text-xs sm:text-sm font-semibold max-w-md mx-auto text-flatzy-navy/90 leading-relaxed">
              {t('cta.subtitle')}
            </p>

            {/* Quick Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-bold text-flatzy-navy/85 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/45 backdrop-blur-xs">
                ✓ WhatsApp Direct Connect
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/45 backdrop-blur-xs">
                ✓ Free Video Tours
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/45 backdrop-blur-xs">
                ✓ Verified Flatmates
              </span>
            </div>

            <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => onOpenInquiryModal()}
                className="px-6 py-2.5 rounded-full bg-flatzy-navy hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('cta.btn')}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-flatzy-navy font-black text-xs shadow-md hover:shadow-lg transition-all active:scale-95 border border-white/80 cursor-pointer"
              >
                {t('cta.browse')}
              </button>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};
