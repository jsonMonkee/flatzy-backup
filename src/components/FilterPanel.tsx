import React from 'react';
import type { FilterState, LocationName, BudgetRange, FurnishingType, TenantType } from '../types/property';
import { 
  RotateCcw, 
  SlidersHorizontal, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Home, 
  Sparkles, 
  Users, 
  User, 
  Check, 
  Train, 
  Briefcase, 
  Building2, 
  Plane, 
  GraduationCap 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
  hideHeader?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  hideHeader = false,
}) => {
  const { t } = useLanguage();
  const locationsList: LocationName[] = ['New Town', 'Shapoorji', 'Rajarhat', 'Salt Lake', 'Sector V'];
  const budgetOptions: { id: BudgetRange; label: string }[] = [
    { id: 'all', label: 'All Budgets' },
    { id: 'under10', label: 'Under ₹10K' },
    { id: '10to15', label: '₹10K – ₹15K' },
    { id: '15to20', label: '₹15K – ₹20K' },
    { id: '20to30', label: '₹20K – ₹30K' },
    { id: 'above30', label: '₹30K+' },
  ];
  const bhkOptions: { id: string; label: string; humanCount: number }[] = [
    { id: '1 RK', label: '1 RK', humanCount: 1 },
    { id: '1 BHK', label: '1 BHK', humanCount: 1 },
    { id: '2 BHK', label: '2 BHK', humanCount: 2 },
    { id: '3 BHK', label: '3 BHK', humanCount: 3 },
  ];
  const furnishingOptions: FurnishingType[] = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
  const tenantOptions: TenantType[] = ['Student', 'Bachelor', 'Working Professionals', 'Couple', 'Family'];
  const amenitiesList = [
    'Split Air Conditioners',
    'High-Speed Wi-Fi Ready',
    'Dual Lifts & Power Backup',
    '24/7 Gated Security',
    'Swimming Pool & Gymnasium',
    'Modular Kitchen',
    'Balcony with Open View',
    'Visitor Parking'
  ];

  const transitHubOptions = [
    { id: 'Green Line Metro', label: 'Green Line Metro', icon: Train, badge: 'Sector V / Salt Lake' },
    { id: 'Sector V IT Hub', label: 'Sector V Tech Park', icon: Briefcase, badge: 'DLF / Godrej' },
    { id: 'New Town IT Hub', label: 'New Town IT Hub', icon: Building2, badge: 'Ecospace / TCS' },
    { id: 'Airport & VIP Road', label: 'Airport & VIP Link', icon: Plane, badge: '10 mins to CCU' },
    { id: 'Walk to College / Tech Park', label: 'Walk to College / Tech', icon: GraduationCap, badge: 'Techno / Amity' }
  ];

  const toggleLocation = (loc: LocationName) => {
    const exists = filters.locations.includes(loc);
    const updated = exists 
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc];
    onChange({ ...filters, locations: updated });
  };

  const toggleTransitHub = (hub: string) => {
    const current = filters.transitHubs || [];
    const exists = current.includes(hub);
    const updated = exists 
      ? current.filter((h) => h !== hub) 
      : [...current, hub];
    onChange({ ...filters, transitHubs: updated });
  };

  const toggleBhk = (bhk: string) => {
    const exists = filters.bedrooms.includes(bhk);
    const updated = exists
      ? filters.bedrooms.filter((b) => b !== bhk)
      : [...filters.bedrooms, bhk];
    onChange({ ...filters, bedrooms: updated });
  };

  const toggleFurnishing = (furn: FurnishingType) => {
    const exists = filters.furnishing.includes(furn);
    const updated = exists
      ? filters.furnishing.filter((f) => f !== furn)
      : [...filters.furnishing, furn];
    onChange({ ...filters, furnishing: updated });
  };

  const toggleTenant = (tenant: TenantType) => {
    const exists = filters.tenantType.includes(tenant);
    const updated = exists
      ? filters.tenantType.filter((t) => t !== tenant)
      : [...filters.tenantType, tenant];
    onChange({ ...filters, tenantType: updated });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: updated });
  };

  return (
    <div className="space-y-5 text-slate-800">
      
      {/* Optional Top Header if not provided by parent modal */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-flatzy-yellow" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-flatzy-navy">
              {t('filter.title')} ({totalResults} {t('filter.results')})
            </h3>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-flatzy-coral transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('filter.reset')}</span>
          </button>
        </div>
      )}

      {/* 1. Location */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-flatzy-yellow" />
          <span>{t('filter.location')}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {locationsList.map((loc) => {
            const isSelected = filters.locations.includes(loc);
            return (
              <button
                key={loc}
                onClick={() => toggleLocation(loc)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-flatzy-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transit & Kolkata Metro / IT Hub Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('filter.metroCommute')}</span>
          </label>
          {(filters.transitHubs?.length || 0) > 0 && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {filters.transitHubs?.length} {t('filter.active')}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {transitHubOptions.map((hub) => {
            const isSelected = (filters.transitHubs || []).includes(hub.id);
            const Icon = hub.icon;
            return (
              <button
                key={hub.id}
                onClick={() => toggleTransitHub(hub.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-400/40'
                    : 'bg-slate-50/70 border-slate-200/70 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`p-1 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 shadow-2xs'}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className="truncate">{hub.label}</span>
                </div>
                <span className={`text-[10px] shrink-0 font-medium px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-emerald-200/70 text-emerald-900' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {hub.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Budget Range */}
      <div className="space-y-2 pt-3.5 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-flatzy-yellow" />
          <span>{t('filter.budget')}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {budgetOptions.map((b) => {
            const isSelected = filters.budgetRange === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onChange({ ...filters, budgetRange: b.id })}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center truncate ${
                  isSelected
                    ? 'bg-flatzy-navy text-white border-flatzy-navy shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bedrooms / Unit Configuration with Human Icons */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-flatzy-yellow" />
            <span>{t('filter.configuration')}</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400">{t('filter.byCapacity')}</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {bhkOptions.map((opt) => {
            const isSelected = filters.bedrooms.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleBhk(opt.id)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  isSelected
                    ? 'bg-flatzy-yellow border-flatzy-yellowDark text-flatzy-navy shadow-sm ring-1 ring-flatzy-yellow/50 scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {/* Human Icons corresponding to unit capacity */}
                <div className="flex items-center justify-center -space-x-1 h-3.5">
                  {Array.from({ length: opt.humanCount }).map((_, idx) => (
                    <User
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        isSelected 
                          ? 'text-flatzy-navy fill-flatzy-navy/40' 
                          : 'text-slate-400 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs font-black font-poppins leading-none">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Furnishing */}
      <div className="space-y-2 pt-3.5 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-flatzy-yellow" />
          <span>{t('filter.furnishing')}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {furnishingOptions.map((furn) => {
            const isSelected = filters.furnishing.includes(furn);
            return (
              <button
                key={furn}
                type="button"
                onClick={() => toggleFurnishing(furn)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-flatzy-navy text-white border-flatzy-navy shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {furn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Tenant Type */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-flatzy-yellow" />
          <span>{t('filter.tenantPref')}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {tenantOptions.map((tenant) => {
            const isSelected = filters.tenantType.includes(tenant);
            return (
              <button
                key={tenant}
                onClick={() => toggleTenant(tenant)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-flatzy-yellow text-flatzy-navy font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tenant}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Key Amenities */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-flatzy-yellow" />
          <span>{t('filter.amenities')}</span>
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {amenitiesList.map((amenity) => {
            const isSelected = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-flatzy-navy"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-3.5 h-3.5 rounded text-flatzy-navy focus:ring-flatzy-yellow accent-flatzy-navy"
                />
                <span className="truncate">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
};
