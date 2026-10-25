import React, { useState } from 'react';
import type { Property } from '../types/property';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Bath, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Eye,
  Share2,
  Calendar,
  Train,
  Maximize2
} from 'lucide-react';
import { PictureViewModal } from './PictureViewModal';
import { useLanguage } from '../context/LanguageContext';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onQuickInquire?: (property: Property) => void;
  onScheduleVisit?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onQuickInquire,
  onScheduleVisit,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isPictureViewOpen, setIsPictureViewOpen] = useState(false);
  const { t } = useLanguage();

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(property.id);
  };

  return (
    <div 
      onClick={() => onSelectProperty(property)}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Property Image Container */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsPictureViewOpen(true);
        }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer group/img"
        title="Click to view full pictures"
      >
        <img
          src={property.images[imageIndex] || property.featuredImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {property.listingType === 'both' ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black tracking-wide shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-flatzy-yellow" />
                <span>Rent / Buy</span>
              </span>
            ) : property.listingType === 'sale' ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black tracking-wide shadow-xs">
                For Sale
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-flatzy-navy text-[10px] font-extrabold shadow-xs">
                {property.furnishing}
              </span>
            )}
          </div>

          {/* Heart Save Button */}
          <button
            onClick={handleHeartClick}
            aria-label={isSaved ? 'Remove from saved' : 'Save flat'}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-75 shadow-sm backdrop-blur-md ${
              isSaved 
                ? 'bg-flatzy-coral text-white' 
                : 'bg-white/85 text-slate-700 hover:text-flatzy-coral hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay: Location & Photo Count */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] font-semibold drop-shadow">
            <MapPin className="w-3 h-3 text-flatzy-yellow shrink-0" />
            <span className="truncate max-w-[150px]">{property.subLocation}</span>
          </div>

          <div className="pointer-events-auto">
            <span className="px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 transition-all">
              <Maximize2 className="w-2.5 h-2.5 text-flatzy-yellow" />
              <span>{property.images.length} photos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Body - Compact & Clean */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Price & Location Tag */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {property.listingType === 'sale' && property.salePrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-rose-600 font-poppins tracking-tight">
                    ₹{property.salePrice >= 10000000 ? `${(property.salePrice / 10000000).toFixed(2)} Cr` : `${(property.salePrice / 100000).toFixed(0)} Lacs`}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Sale</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-flatzy-navy font-poppins tracking-tight">
                    {formatCurrency(property.monthlyRent)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    /mo
                  </span>
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
              {property.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-flatzy-navy transition-colors">
            {property.title}
          </h3>

          {/* Specs Row */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 pt-1">
            <div className="flex items-center gap-1">
              <BedDouble className="w-3 h-3 text-slate-400" />
              <span>{property.bedrooms} Bed</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 text-slate-400" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-500 font-medium">{property.propertyType}</span>
          </div>

          {/* Commute Tag */}
          {property.commuteHighlight && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold truncate border border-emerald-100/80">
              <Train className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span className="truncate">{property.commuteHighlight}</span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-slate-400">
            #{property.brokerReferenceId}
          </span>

          <div className="flex items-center gap-1.5">
            {onScheduleVisit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleVisit(property);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold transition-all border border-slate-200/80"
                title="Schedule a visit"
              >
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>Visit</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty(property);
              }}
              className="inline-flex items-center gap-0.5 px-3 py-1 rounded-full bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy text-[11px] font-bold transition-all shadow-2xs group-hover:translate-x-0.5"
            >
              <span>View</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Picture View Modal */}
      <PictureViewModal
        isOpen={isPictureViewOpen}
        images={property.images}
        initialIndex={imageIndex}
        title={property.title}
        subLocation={`${property.subLocation}, ${property.location}`}
        onClose={() => setIsPictureViewOpen(false)}
      />
    </div>
  );
};
