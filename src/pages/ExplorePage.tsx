import React, { useState, useMemo } from 'react';
import type { Property, FilterState, LocationName, BudgetRange } from '../types/property';
import { PROPERTIES_DATA } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { FilterPanel } from '../components/FilterPanel';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  MapPin, 
  RotateCcw,
  CheckCircle2,
  Train,
  ChevronDown,
  Building2,
  Home,
  ShieldCheck,
  SendHorizontal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ExplorePageProps {
  properties?: Property[];
  initialFilters?: Partial<FilterState>;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenInquiryModal: (property?: Property) => void;
  onOpenScheduleVisit?: (property: Property) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  properties,
  initialFilters = {},
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenInquiryModal,
  onOpenScheduleVisit,
}) => {
  const { t } = useLanguage();
  const baseProperties = properties && properties.length > 0 ? properties : PROPERTIES_DATA;
  const defaultFilters: FilterState = {
    searchQuery: '',
    locations: [],
    budgetRange: 'all',
    bedrooms: [],
    furnishing: [],
    tenantType: [],
    propertyTypes: [],
    amenities: [],
    transitHubs: [],
    sortBy: 'recommended',
    ...initialFilters,
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync if initialFilters changes
  React.useEffect(() => {
    if (initialFilters.locations && initialFilters.locations.length > 0) {
      setFilters(prev => ({ ...prev, locations: initialFilters.locations || [] }));
    }
    if (initialFilters.budgetRange) {
      setFilters(prev => ({ ...prev, budgetRange: initialFilters.budgetRange || 'all' }));
    }
  }, [initialFilters]);

  // Reactive filtering logic
  const filteredProperties = useMemo(() => {
    return baseProperties.filter((prop) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery = 
          prop.title.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.subLocation.toLowerCase().includes(q) ||
          prop.description.toLowerCase().includes(q) ||
          prop.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Location
      if (filters.locations.length > 0) {
        if (!filters.locations.includes(prop.location)) return false;
      }

      // Budget Range
      if (filters.budgetRange !== 'all') {
        const rent = prop.monthlyRent;
        if (filters.budgetRange === 'under10' && rent >= 10000) return false;
        if (filters.budgetRange === '10to15' && (rent < 10000 || rent > 15000)) return false;
        if (filters.budgetRange === '15to20' && (rent < 15000 || rent > 20000)) return false;
        if (filters.budgetRange === '20to30' && (rent < 20000 || rent > 30000)) return false;
        if (filters.budgetRange === 'above30' && rent <= 30000) return false;
      }

      // Bedrooms / Unit Configuration (1 RK, 1 BHK, 2 BHK, 3 BHK)
      if (filters.bedrooms.length > 0) {
        const matchesBhk = filters.bedrooms.some(b => {
          if (b === '1 RK') {
            return prop.propertyType === '1 RK' || prop.propertyType === 'Studio Flat' || prop.title.toLowerCase().includes('1 rk') || prop.title.toLowerCase().includes('studio');
          }
          if (b === '1 BHK') {
            return prop.bedrooms === 1 && prop.propertyType !== '1 RK' && !prop.title.toLowerCase().includes('1 rk');
          }
          if (b === '2 BHK') return prop.bedrooms === 2;
          if (b === '3 BHK') return prop.bedrooms >= 3;
          return false;
        });
        if (!matchesBhk) return false;
      }

      // Furnishing
      if (filters.furnishing.length > 0) {
        if (!filters.furnishing.includes(prop.furnishing)) return false;
      }

      // Tenant Type
      if (filters.tenantType.length > 0) {
        const matchesTenant = filters.tenantType.some(t => prop.suitableFor.includes(t));
        if (!matchesTenant) return false;
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(a => 
          prop.amenities.some(propA => propA.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      // Transit & IT Hubs Commute Filter
      if (filters.transitHubs && filters.transitHubs.length > 0) {
        const matchesTransit = filters.transitHubs.some(hub => 
          (prop.transitTags && prop.transitTags.includes(hub)) ||
          (prop.commuteHighlight && prop.commuteHighlight.toLowerCase().includes(hub.toLowerCase()))
        );
        if (!matchesTransit) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rent_low') return a.monthlyRent - b.monthlyRent;
      if (filters.sortBy === 'rent_high') return b.monthlyRent - a.monthlyRent;
      if (filters.sortBy === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      // recommended default
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    });
  }, [filters, baseProperties]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      locations: [],
      budgetRange: 'all',
      bedrooms: [],
      furnishing: [],
      tenantType: [],
      propertyTypes: [],
      amenities: [],
      transitHubs: [],
      sortBy: 'recommended',
    });
  };

  const activeFiltersCount = 
    (filters.locations.length > 0 ? 1 : 0) +
    (filters.budgetRange !== 'all' ? 1 : 0) +
    (filters.bedrooms.length > 0 ? 1 : 0) +
    (filters.furnishing.length > 0 ? 1 : 0) +
    (filters.tenantType.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    ((filters.transitHubs?.length || 0) > 0 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  // Quick Chips
  const quickChips = [
    { id: 'all', label: 'All Flats', isLoc: true, value: '' },
    { id: 'shapoorji', label: '📍 Shapoorji', isLoc: true, value: 'Shapoorji' },
    { id: 'newtown', label: '📍 New Town', isLoc: true, value: 'New Town' },
    { id: 'sectorv', label: '📍 Sector V', isLoc: true, value: 'Sector V' },
    { id: 'rajarhat', label: '📍 Rajarhat', isLoc: true, value: 'Rajarhat' },
    { id: '1bhk', label: '🏠 1 BHK / Studio', isBhk: true, value: '1 BHK' },
    { id: '2bhk', label: '🏡 2 BHK', isBhk: true, value: '2 BHK' },
    { id: '3bhk', label: '✨ 3 BHK', isBhk: true, value: '3 BHK' },
    { id: 'ac', label: '❄️ AC Ready', isAmenity: true, value: 'AC' },
    { id: 'metro', label: '🚇 Green Line Metro', isTransit: true, value: 'Green Line Metro' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">


      {/* Floating Modern Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl px-3.5 py-2.5 sm:py-3 border border-slate-200/80 focus-within:border-flatzy-navy focus-within:bg-white focus-within:ring-2 focus-within:ring-flatzy-navy/10 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by society, locality (e.g. Shapoorji, Unitech), or landmark..."
              className="w-full bg-transparent text-xs sm:text-sm text-flatzy-navy placeholder:text-slate-400 focus:outline-none font-medium"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Row for Filters & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
            
            {/* Filter Toggle Button (opens full Drawer) */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl border font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer ${
                activeFiltersCount > 0
                  ? 'bg-flatzy-navy text-white border-flatzy-navy'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${activeFiltersCount > 0 ? 'text-flatzy-yellow' : 'text-slate-600'}`} />
              <span>Filters</span>
              {activeFiltersCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-flatzy-yellow text-flatzy-navy text-[11px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              ) : (
                <span className="text-slate-400 font-normal hidden sm:inline">(All)</span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial flex items-center bg-white hover:bg-slate-50 rounded-2xl px-3 py-2.5 sm:py-3 border border-slate-200 shadow-xs cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent text-xs font-bold text-flatzy-navy focus:outline-none cursor-pointer pr-1 w-full"
              >
                <option value="recommended">Recommended</option>
                <option value="rent_low">Rent: Low to High</option>
                <option value="rent_high">Rent: High to Low</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>

          </div>

        </div>

        {/* Quick Filter Horizontal Chips Strip */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {quickChips.map((chip) => {
            let isSelected = false;
            if (chip.id === 'all') {
              isSelected = filters.locations.length === 0 && filters.bedrooms.length === 0 && (!filters.transitHubs || filters.transitHubs.length === 0) && filters.amenities.length === 0;
            } else if (chip.isLoc) {
              isSelected = filters.locations.includes(chip.value as any);
            } else if (chip.isBhk) {
              isSelected = filters.bedrooms.includes(chip.value);
            } else if (chip.isAmenity) {
              isSelected = filters.amenities.some(a => a.toLowerCase().includes('ac'));
            } else if (chip.isTransit) {
              isSelected = (filters.transitHubs || []).includes(chip.value);
            }

            return (
              <button
                key={chip.id}
                onClick={() => {
                  if (chip.id === 'all') {
                    handleResetFilters();
                  } else if (chip.isLoc) {
                    const current = filters.locations;
                    const exists = current.includes(chip.value as any);
                    setFilters({
                      ...filters,
                      locations: exists ? current.filter(l => l !== chip.value) : [...current, chip.value as any]
                    });
                  } else if (chip.isBhk) {
                    const current = filters.bedrooms;
                    const exists = current.includes(chip.value);
                    setFilters({
                      ...filters,
                      bedrooms: exists ? current.filter(b => b !== chip.value) : [...current, chip.value]
                    });
                  } else if (chip.isAmenity) {
                    const exists = filters.amenities.includes('AC');
                    setFilters({
                      ...filters,
                      amenities: exists ? filters.amenities.filter(a => a !== 'AC') : [...filters.amenities, 'AC']
                    });
                  } else if (chip.isTransit) {
                    const current = filters.transitHubs || [];
                    const exists = current.includes(chip.value);
                    setFilters({
                      ...filters,
                      transitHubs: exists ? current.filter(h => h !== chip.value) : [...current, chip.value]
                    });
                  }
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-flatzy-navy text-white border-flatzy-navy shadow-xs scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-1">Active Filters:</span>
            
            {filters.transitHubs?.map((hub) => (
              <span
                key={hub}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold"
              >
                <span>🚇 {hub}</span>
                <button
                  onClick={() => setFilters({ ...filters, transitHubs: filters.transitHubs?.filter(h => h !== hub) })}
                  className="hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            
            {filters.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-flatzy-yellow/20 text-flatzy-navy border border-flatzy-yellow text-xs font-bold"
              >
                <span>📍 {loc}</span>
                <button
                  onClick={() => setFilters({ ...filters, locations: filters.locations.filter(l => l !== loc) })}
                  className="hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {filters.budgetRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <span>Budget: {filters.budgetRange}</span>
                <button onClick={() => setFilters({ ...filters, budgetRange: 'all' })}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.bedrooms.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                <span>{b}</span>
                <button onClick={() => setFilters({ ...filters, bedrooms: filters.bedrooms.filter(x => x !== b) })}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-flatzy-coral hover:underline ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Header Meta */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium px-1">
        <span>
          Showing <strong className="text-flatzy-navy font-black text-sm sm:text-base">{filteredProperties.length}</strong> rental flats
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-bold text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Physical verification completed</span>
        </span>
      </div>

      {/* Full-width Responsive Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/90 shadow-soft space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 text-flatzy-yellowDark flex items-center justify-center text-4xl shadow-inner">
            🔎
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-flatzy-navy font-poppins">
              No exact flat matches your selected filters
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Don't worry! New verified flats are added daily across Kolkata. Post what you need on the Flatzy Board, and our team will match you directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenInquiryModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-flatzy-navy text-white hover:bg-slate-800 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-flatzy-yellow" />
              <span>Tenant Posting</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProperties.map((property) => (
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
      )}

      {/* Bottom Flatzy Board Tenant Banner */}
      <div className="mt-12 bg-gradient-to-r from-flatzy-yellow/20 via-flatzy-yellow/10 to-amber-50 border-2 border-dashed border-flatzy-yellowDark/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-flatzy-navy bg-flatzy-yellow/40 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-flatzy-navy" />
            <span>Flatzy Board Matchmaking</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-flatzy-navy font-poppins">
            Can't find a flat that fits your exact budget or moving date?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Drop your preferred location, budget, and move-in timeline. Our local Kolkata agents source options that match before they go public.
          </p>
        </div>

        <button
          onClick={() => onOpenInquiryModal()}
          className="shrink-0 px-6 py-3.5 rounded-full bg-flatzy-navy hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>Tenant Posting</span>
          <SendHorizontal className="w-4 h-4 text-flatzy-yellow" />
        </button>
      </div>

      {/* Slide-over Filter Drawer (Desktop & Mobile Unified) */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-flatzy-navy" />
                <h3 className="font-extrabold text-base text-flatzy-navy">
                  Filter Properties
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-flatzy-yellow text-flatzy-navy text-xs font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                totalResults={filteredProperties.length}
              />
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-3 rounded-full bg-flatzy-navy hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer text-center"
              >
                Show {filteredProperties.length} Flats
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
