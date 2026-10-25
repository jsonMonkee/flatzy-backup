import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Home, 
  Briefcase,
  Layers,
  ChevronRight,
  Calendar,
  Users,
  Coins,
  FileText,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import type { Property, LocationName, BudgetRange } from '../types/property';
import { submitLeadToGoogleSheet } from '../services/leadService';
import { FLATZY_WHATSAPP_NUMBER, getWhatsAppUrl } from '../config/contact';

export type RoleModalView = 'selection' | 'broker' | 'buyer' | 'success';

export interface BuyerRequirementData {
  fullName: string;
  phone: string;
  companyName: string;
  lookingForBhk: string;
  budget: string;
  location: string;
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  shiftingDate: string;
  tenantCategory: 'Family' | 'Bachelor';
}

export interface BrokerRequirementData {
  fullName: string;
  phone: string;
  brokerType: 'Owner' | 'Broker';
  agencyName: string;
  operatingAreas: string[];
  propertyTypes: string[];
  notes: string;
}

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProperty?: Property | null;
  onApplyFilters?: (location?: LocationName, budget?: BudgetRange) => void;
  onOpenListProperty?: () => void;
  initialBoardMode?: boolean;
  initialView?: RoleModalView;
}

const KOLKATA_AREAS = [
  'New Town',
  'Rajarhat',
  'Salt Lake',
  'Sector V',
  'Shapoorji',
  'South Kolkata',
  'Other Kolkata Area'
];

const PROPERTY_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio / 1 RK', 'Commercial / Office'];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  targetProperty,
  onApplyFilters,
  onOpenListProperty,
  initialBoardMode = false,
  initialView,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const whatsappNumber = FLATZY_WHATSAPP_NUMBER;

  const [currentView, setCurrentView] = useState<RoleModalView>('selection');
  const [submissionType, setSubmissionType] = useState<'buyer' | 'broker'>('buyer');
  const [generatedMessageText, setGeneratedMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBoardMode, setIsBoardMode] = useState(false);

  // Buyer / Renter Form State
  const [buyerData, setBuyerData] = useState<BuyerRequirementData>({
    fullName: '',
    phone: '',
    companyName: '',
    lookingForBhk: '2 BHK',
    budget: '₹15,000 - ₹20,000',
    location: 'New Town',
    furnishingStatus: 'Semi-Furnished',
    shiftingDate: '',
    tenantCategory: 'Bachelor',
  });

  // Helper for dynamic budget ranges based on BHK selection
  const getBudgetRangesForBhk = (bhk: string): string[] => {
    if (bhk === '1 BHK') {
      return [
        '₹9,000 - ₹10,000 (Unfurnished)',
        '₹10,000 - ₹13,000',
        '₹13,000 - ₹16,000',
        '₹16,000 - ₹20,000',
      ];
    }
    if (bhk === '3 BHK') {
      return [
        '₹20,000 - ₹25,000',
        '₹25,000 - ₹30,000',
        '₹30,000 - ₹40,000',
        '₹40,000 - ₹50,000',
      ];
    }
    // Default: 2 BHK
    return [
      '₹15,000 - ₹20,000',
      '₹20,000 - ₹25,000',
      '₹25,000 - ₹30,000',
    ];
  };

  // Broker / Owner Form State
  const [brokerData, setBrokerData] = useState<BrokerRequirementData>({
    fullName: '',
    phone: '',
    brokerType: 'Broker',
    agencyName: '',
    operatingAreas: ['New Town', 'Rajarhat'],
    propertyTypes: ['2 BHK'],
    notes: '',
  });

  // Prefill property when opened with a target flat or board mode
  React.useEffect(() => {
    if (isOpen) {
      if (initialBoardMode) {
        setIsBoardMode(true);
        setCurrentView('buyer');
      } else if (initialView) {
        setIsBoardMode(false);
        setCurrentView(initialView);
      } else if (targetProperty) {
        setBuyerData(prev => ({
          ...prev,
          lookingForBhk: targetProperty.bhkType || prev.lookingForBhk,
          budget: `₹${targetProperty.monthlyRent.toLocaleString('en-IN')}/mo`,
          location: targetProperty.location || prev.location,
          furnishingStatus: (targetProperty.furnishing === 'Fully Furnished' ? 'Furnished' : targetProperty.furnishing === 'Unfurnished' ? 'Unfurnished' : 'Semi-Furnished'),
        }));
        setIsBoardMode(false);
        setCurrentView('buyer');
      } else {
        setIsBoardMode(false);
        setCurrentView('selection');
      }
    }
  }, [isOpen, targetProperty, initialBoardMode, initialView]);

  if (!isOpen) return null;

  const toggleOperatingArea = (area: string) => {
    setBrokerData(prev => {
      const exists = prev.operatingAreas.includes(area);
      const updated = exists 
        ? prev.operatingAreas.filter(a => a !== area)
        : [...prev.operatingAreas, area];
      return { ...prev, operatingAreas: updated.length > 0 ? updated : [area] };
    });
  };

  const togglePropertyType = (type: string) => {
    setBrokerData(prev => {
      const exists = prev.propertyTypes.includes(type);
      const updated = exists 
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type];
      return { ...prev, propertyTypes: updated.length > 0 ? updated : [type] };
    });
  };

  // Safe formatting without unstable variation selectors for 100% reliable rendering
  const generateBuyerText = (data: BuyerRequirementData) => {
    return (
      `*${targetProperty ? 'FLAT INQUIRY' : 'FLAT REQUIREMENT'} — FLATZY KOLKATA*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      (targetProperty
        ? `• *Selected Flat:* ${targetProperty.title} (#${targetProperty.brokerReferenceId})\n` +
          `• *Rent:* ₹${targetProperty.monthlyRent.toLocaleString('en-IN')}/month\n` +
          `• *Location:* ${targetProperty.subLocation}, ${targetProperty.location}\n`
        : '') +
      `• *Name:* ${data.fullName || 'Prospective Tenant'}\n` +
      `• *WhatsApp:* +91 ${data.phone}\n` +
      (data.companyName ? `• *Company / College:* ${data.companyName}\n` : '') +
      (!targetProperty ? `• *Looking for:* ${data.lookingForBhk}\n` : '') +
      (!targetProperty ? `• *Furnishing:* ${data.furnishingStatus}\n` : '') +
      (!targetProperty ? `• *Budget:* ${data.budget}\n` : '') +
      (!targetProperty ? `• *Preferred Area:* ${data.location}\n` : '') +
      (data.shiftingDate ? `• *Expected Shifting:* ${data.shiftingDate}\n` : '') +
      `• *Tenant Category:* ${data.tenantCategory}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      (targetProperty
        ? `Please connect me with the verified broker to schedule a visit!`
        : `Please share available verified options matching my requirements!`)
    );
  };

  const generateBrokerText = (data: BrokerRequirementData) => {
    return (
      `*PROPERTY PARTNER LISTING — FLATZY KOLKATA*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Partner Name:* ${data.fullName || 'Partner'}\n` +
      `• *WhatsApp:* +91 ${data.phone}\n` +
      `• *Role:* ${data.brokerType === 'Owner' ? 'Property Owner' : 'Real Estate Broker'}\n` +
      (data.agencyName ? `• *Agency / Building:* ${data.agencyName}\n` : '') +
      `• *Operating Areas:* ${data.operatingAreas.join(', ')}\n` +
      `• *Properties Available:* ${data.propertyTypes.join(', ')}\n` +
      (data.notes ? `• *Details / Notes:* ${data.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Looking to list properties on Flatzy Kolkata!`
    );
  };

  const openWhatsAppUrl = (text: string) => {
    const url = getWhatsAppUrl(text);
    // Directly navigate or open - works reliably across mobile in-app browsers
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const compiledText = generateBuyerText(buyerData);
    setGeneratedMessageText(compiledText);
    setSubmissionType('buyer');

    // Automatically send to Supabase and Google Sheets
    await submitLeadToGoogleSheet({
      fullName: buyerData.fullName,
      phone: buyerData.phone,
      companyName: buyerData.companyName,
      lookingForBhk: buyerData.lookingForBhk,
      budget: buyerData.budget,
      location: buyerData.location,
      furnishingStatus: buyerData.furnishingStatus,
      shiftingDate: buyerData.shiftingDate,
      tenantCategory: buyerData.tenantCategory,
      role: 'Renter',
      propertyTitle: isBoardMode ? 'Flatzy Board Requirement' : (targetProperty ? targetProperty.title : 'General Flat Requirement'),
      source: isBoardMode ? 'Flatzy Board (Tenant Requirement)' : (targetProperty ? 'Property Inquiry' : 'Welcome Modal (Renter)')
    });

    setIsSubmitting(false);
    setCurrentView('success');

    // Trigger WhatsApp
    openWhatsAppUrl(compiledText);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#FF5722', '#0B132B', '#10B981']
      });
    } catch {}
  };

  const handleBrokerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const compiledText = generateBrokerText(brokerData);
    setGeneratedMessageText(compiledText);
    setSubmissionType('broker');

    // Automatically send to Google Sheets
    await submitLeadToGoogleSheet({
      fullName: brokerData.fullName,
      phone: brokerData.phone,
      companyName: brokerData.agencyName || (brokerData.brokerType === 'Owner' ? 'Property Owner' : 'Independent Broker'),
      lookingForBhk: brokerData.propertyTypes.join(', '),
      budget: 'Listing Partner',
      location: brokerData.operatingAreas.join(', '),
      shiftingDate: 'Immediate Listing',
      tenantCategory: brokerData.brokerType === 'Owner' ? 'Owner Listing' : 'Broker Network',
      role: brokerData.brokerType === 'Owner' ? 'Owner' : 'Broker',
      brokerAreas: brokerData.operatingAreas.join(', '),
      brokerPropertyType: brokerData.propertyTypes.join(', '),
      brokerNote: brokerData.notes,
      source: 'Welcome Modal (Partner Portal)'
    });

    setIsSubmitting(false);
    setCurrentView('success');

    // Trigger WhatsApp
    openWhatsAppUrl(compiledText);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#FF5722', '#0B132B', '#10B981']
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Container */}
      <div 
        className="relative z-10 bg-white w-full sm:max-w-lg rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/80 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div 
          className="sm:hidden pt-2.5 pb-1 bg-slate-50 flex justify-center cursor-pointer select-none border-b border-slate-100" 
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Top Bar */}
        <div className="relative px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          {/* Left Action (Back button or empty spacer) */}
          <div className="w-8 flex items-center justify-start z-10">
            {currentView !== 'selection' && (
              <button
                type="button"
                onClick={() => {
                  if (currentView === 'success') {
                    onClose();
                  } else {
                    setCurrentView('selection');
                  }
                }}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Centralized Big Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-10">
            <h3 className="text-sm sm:text-base font-black text-flatzy-navy font-poppins tracking-tight truncate pointer-events-auto">
              {currentView === 'buyer' 
                ? (targetProperty 
                    ? (isBn ? 'ফ্ল্যাট ইনকোয়ারি' : 'Enquire About This Flat') 
                    : isBoardMode 
                    ? (isBn ? 'টেন্যান্ট পোস্টিং' : 'Tenant Posting')
                    : (isBn ? 'আপনার পছন্দ জানান' : 'Your Flat Requirements'))
                : currentView === 'broker'
                ? (isBn ? 'লিস্টিং পার্টনার' : 'Partner Listing Portal')
                : currentView === 'success'
                ? (isBn ? 'ইনকোয়ারি সম্পন্ন' : 'Inquiry Dispatched')
                : (isBn ? 'স্বাগতম' : 'Quick Enquiry')}
            </h3>
          </div>

          {/* Right Action (Close Button) */}
          <div className="w-8 flex items-center justify-end z-10">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VIEW 1: INITIAL SELECTION SCREEN */}
        {/* ---------------------------------------------------- */}
        {currentView === 'selection' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-flatzy-navy tracking-tight font-poppins">
                {isBn ? 'স্বাগতম! আপনি কোনটি খুঁজছেন?' : 'Welcome! How can we help?'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isBn 
                  ? 'সরাসরি তথ্য পূরণ করুন ও হোয়াটসঅ্যাপে যোগাযোগ করুন' 
                  : 'Select an option to connect instantly on WhatsApp'}
              </p>
            </div>

            {/* The Two Cards with robust SVG icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Card 1: Rent / Buy a Flat (Uses direct design image) */}
              <div 
                onClick={() => {
                  setIsBoardMode(false);
                  setCurrentView('buyer');
                }}
                role="button"
                tabIndex={0}
                aria-label="Rent / Buy a Flat - Enter details"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsBoardMode(false);
                    setCurrentView('buyer');
                  }
                }}
                className="relative overflow-hidden group rounded-2xl sm:rounded-3xl border-2 border-amber-300/90 hover:border-amber-500 bg-white shadow-xs hover:shadow-soft transition-all duration-200 cursor-pointer text-left flex flex-col justify-center"
              >
                <img
                  src="/rent-buy-banner-card.png"
                  alt="Rent / Buy a Flat - Find verified flats in New Town, Rajarhat & Salt Lake. Enter details"
                  width={500}
                  height={300}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              {/* Card 2: Tenant Posting (Uses direct design image) */}
              <div 
                onClick={() => {
                  setIsBoardMode(true);
                  setCurrentView('buyer');
                }}
                role="button"
                tabIndex={0}
                aria-label="Tenant Posting - Explore & Connect"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsBoardMode(true);
                    setCurrentView('buyer');
                  }
                }}
                className="relative overflow-hidden group rounded-2xl sm:rounded-3xl border-2 border-red-200/90 hover:border-red-500 bg-white shadow-xs hover:shadow-soft transition-all duration-200 cursor-pointer text-left flex flex-col justify-center"
              >
                <img
                  src="/tenant-posting-banner-card.png"
                  alt="Tenant Posting - Hi brokers, you don't have to wait for tenants to come to you. You can search them out and connect with them on WhatsApp through us. Explore & Connect"
                  width={500}
                  height={300}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

            </div>

            {/* Quick Landlord Listing Fast Track */}
            {onOpenListProperty && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏡</span>
                  <div>
                    <span className="font-extrabold text-emerald-950 block">Are you a Flat Owner?</span>
                    <span className="text-[11px] text-emerald-700">Post your property in 2 minutes for free</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenListProperty();
                  }}
                  className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs transition-colors"
                >
                  Post Flat (Free)
                </button>
              </div>
            )}

            {/* Bottom Skip */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-slate-400 hover:text-slate-700 underline underline-offset-4"
              >
                {isBn ? 'ওয়েবসাইট ব্রাউজ করুন →' : 'Skip & explore website directly →'}
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 2: BROKER / OWNER REGISTRATION FORM */}
        {/* ---------------------------------------------------- */}
        {currentView === 'broker' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
            <div className="text-center space-y-0.5">
              <h3 className="text-lg font-black text-flatzy-navy font-poppins flex items-center justify-center gap-1.5">
                <Briefcase className="w-4 h-4 text-flatzy-navy" />
                <span>{isBn ? 'পার্টনার ও লিস্টিং পোর্টাল' : 'Partner & Listing Portal'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'ফ্ল্যাট লিস্ট করতে তথ্য দিন' : 'Share property details to connect directly on WhatsApp'}
              </p>
            </div>

            <form onSubmit={handleBrokerSubmit} className="space-y-3">
              
              {/* Partner Type Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>I am a *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrokerData({ ...brokerData, brokerType: 'Owner' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      brokerData.brokerType === 'Owner'
                        ? 'bg-flatzy-navy text-flatzy-yellow border-flatzy-navy shadow-xs font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Property Owner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrokerData({ ...brokerData, brokerType: 'Broker' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      brokerData.brokerType === 'Broker'
                        ? 'bg-flatzy-navy text-flatzy-yellow border-flatzy-navy shadow-xs font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Real Estate Broker</span>
                  </button>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brokerData.fullName}
                    onChange={(e) => setBrokerData({ ...brokerData, fullName: e.target.value })}
                    placeholder="e.g. Amit Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>WhatsApp Number *</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={brokerData.phone}
                      onChange={(e) => setBrokerData({ ...brokerData, phone: e.target.value })}
                      placeholder="98300 12345"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Agency Name or Building Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{brokerData.brokerType === 'Owner' ? 'Apartment / Society Name' : 'Agency / Company Name'}</span>
                </label>
                <input
                  type="text"
                  value={brokerData.agencyName}
                  onChange={(e) => setBrokerData({ ...brokerData, agencyName: e.target.value })}
                  placeholder={brokerData.brokerType === 'Owner' ? 'e.g. Greenwood Elements, New Town' : 'e.g. Sharma Realty'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                />
              </div>

              {/* Operating Areas (Multi-select) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Operating Locations *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Tap to select</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {KOLKATA_AREAS.map((area) => {
                    const isSelected = brokerData.operatingAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleOperatingArea(area)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-flatzy-yellow text-flatzy-navy border-flatzy-yellowDark shadow-xs font-black'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Types Available (Multi-select) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>Flats Available to List *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Tap to select</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROPERTY_TYPES.map((type) => {
                    const isSelected = brokerData.propertyTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => togglePropertyType(type)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-flatzy-navy text-flatzy-yellow border-flatzy-navy shadow-xs font-black'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Current Vacancies */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Property Details / Current Vacancies (Optional)</span>
                </label>
                <input
                  type="text"
                  value={brokerData.notes}
                  onChange={(e) => setBrokerData({ ...brokerData, notes: e.target.value })}
                  placeholder="e.g. 2 BHK semi-furnished in Action Area 1 available immediately"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-flatzy-yellow hover:bg-flatzy-yellowDark text-flatzy-navy font-black text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering listing...' : 'Submit & Connect on WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-1.5">
                  ⚡ Auto-saves your listing & opens WhatsApp
                </p>
              </div>

            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 3: BUYER / RENTER REQUIREMENT FORM */}
        {/* ---------------------------------------------------- */}
        {currentView === 'buyer' && (
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2 scrollbar-thin">
            {!targetProperty && (
              <p className="text-[11px] text-slate-500 text-center -mt-0.5 mb-1">
                {isBn ? 'মাত্র কয়েকটি সাধারণ তথ্য দিন — সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Share your preferences to connect directly on WhatsApp'}
              </p>
            )}

            {targetProperty && (
              <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2 text-left">
                <img 
                  src={targetProperty.featuredImage} 
                  alt={targetProperty.title} 
                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-amber-200" 
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 truncate leading-snug">{targetProperty.title}</div>
                  <div className="text-[10px] text-slate-600">
                    {targetProperty.bhkType} • <span className="font-black text-flatzy-navy">₹{targetProperty.monthlyRent.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  #{targetProperty.brokerReferenceId}
                </span>
              </div>
            )}

            <form onSubmit={handleBuyerSubmit} className="space-y-2">
              
              {/* Name & Phone (Compact) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerData.fullName}
                    onChange={(e) => setBuyerData({ ...buyerData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>WhatsApp Number *</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-[11px] font-bold text-slate-400 pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={buyerData.phone}
                      onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                      placeholder="98300 12345"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Looking for (1 BHK / 2 BHK / 3 BHK) with Tactile Micro-Interactions */}
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span>Looking for BHK *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Tap to switch</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-0.5">
                  {['1 BHK', '2 BHK', '3 BHK'].map((bhk) => {
                    const isSelected = buyerData.lookingForBhk === bhk;
                    return (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => {
                          const newBudgets = getBudgetRangesForBhk(bhk);
                          setBuyerData({
                            ...buyerData,
                            lookingForBhk: bhk,
                            budget: newBudgets[0],
                          });
                        }}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none active:scale-90 active:duration-75 ${
                          isSelected
                            ? 'bg-flatzy-yellow text-flatzy-navy border-amber-400 shadow-sm font-black scale-[1.03] ring-2 ring-amber-300/60'
                            : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300 hover:scale-[1.01]'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-flatzy-navy animate-in zoom-in-50 duration-150" />
                        )}
                        <span>{bhk}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location & Furnishing (Strictly Side by Side) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>Location *</span>
                  </label>
                  <select
                    value={buyerData.location}
                    onChange={(e) => setBuyerData({ ...buyerData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors cursor-pointer truncate"
                  >
                    <option value="New Town">New Town</option>
                    <option value="Shapoorji">Shapoorji</option>
                    <option value="Sector V">Sector V</option>
                    <option value="Other areas in Kolkata">Other areas in Kolkata</option>
                  </select>
                </div>

                <div className="space-y-0.5">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 truncate">
                    <Home className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>Furnishing *</span>
                  </label>
                  <select
                    value={buyerData.furnishingStatus}
                    onChange={(e) => setBuyerData({ ...buyerData, furnishingStatus: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Budget Range (Dynamically tailored to selected BHK) */}
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-slate-500" />
                    <span>Budget Range ({buyerData.lookingForBhk}) *</span>
                  </span>
                </label>
                <select
                  value={buyerData.budget}
                  onChange={(e) => setBuyerData({ ...buyerData, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow focus:bg-white transition-colors cursor-pointer"
                >
                  {getBudgetRangesForBhk(buyerData.lookingForBhk).map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shifting Date & Family or Bachelor (Compact side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Custom Pretty Yellow Calendar Box */}
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-flatzy-navy flex items-center gap-1 font-poppins">
                      <div className="w-4 h-4 rounded-md bg-flatzy-yellow text-flatzy-navy flex items-center justify-center shadow-2xs">
                        <Calendar className="w-2.5 h-2.5 text-flatzy-navy" />
                      </div>
                      <span>Shifting Date</span>
                    </label>
                    {buyerData.shiftingDate && (
                      <button
                        type="button"
                        onClick={() => setBuyerData({ ...buyerData, shiftingDate: '' })}
                        className="text-[9px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100/80 px-1 py-0.5 rounded transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={buyerData.shiftingDate}
                    onChange={(e) => setBuyerData({ ...buyerData, shiftingDate: e.target.value })}
                    className="w-full bg-white border border-amber-300 hover:border-flatzy-yellow focus:border-flatzy-navy rounded-lg px-2 py-1 text-xs text-flatzy-navy font-bold focus:outline-none transition-all shadow-2xs cursor-pointer"
                  />

                  {/* Quick Timing Chips */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { 
                        label: 'Now', 
                        getVal: () => new Date().toISOString().split('T')[0] 
                      },
                      { 
                        label: '7 Days', 
                        getVal: () => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          return d.toISOString().split('T')[0];
                        } 
                      },
                      { 
                        label: (() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1);
                          return d.toLocaleString('en-US', { month: 'short' });
                        })(), 
                        getVal: () => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1, 1);
                          return d.toISOString().split('T')[0];
                        } 
                      },
                      { 
                        label: (() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 2);
                          return d.toLocaleString('en-US', { month: 'short' });
                        })(), 
                        getVal: () => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 2, 1);
                          return d.toISOString().split('T')[0];
                        } 
                      },
                    ].map((item) => {
                      const val = item.getVal();
                      const isSelected = buyerData.shiftingDate === val;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setBuyerData({ ...buyerData, shiftingDate: val })}
                          className={`py-0.5 rounded text-[10px] font-bold transition-all duration-150 border active:scale-90 ${
                            isSelected
                              ? 'bg-flatzy-yellow text-flatzy-navy border-amber-400 font-black shadow-2xs scale-102'
                              : 'bg-white text-slate-600 border-amber-200/70 hover:bg-amber-100/60'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Family or Bachelor Box - Sleek Segmented Switch with Tactile Spring Micro-Interactions */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>Family or Bachelor *</span>
                  </label>

                  {/* Unified Segmented Switch with Spring Bounce */}
                  <div className="p-1 rounded-xl bg-slate-100 border border-slate-200/80 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setBuyerData({ ...buyerData, tenantCategory: 'Family' })}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                        buyerData.tenantCategory === 'Family'
                          ? 'bg-white text-flatzy-navy shadow-sm ring-1 ring-slate-200/60 scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 hover:scale-[1.01]'
                      }`}
                    >
                      <Users className={`w-3.5 h-3.5 transition-all duration-200 ${
                        buyerData.tenantCategory === 'Family' ? 'text-amber-500 scale-110' : 'text-slate-400'
                      }`} />
                      <span>Family</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBuyerData({ ...buyerData, tenantCategory: 'Bachelor' })}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                        buyerData.tenantCategory === 'Bachelor'
                          ? 'bg-white text-flatzy-navy shadow-sm ring-1 ring-slate-200/60 scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 hover:scale-[1.01]'
                      }`}
                    >
                      <User className={`w-3.5 h-3.5 transition-all duration-200 ${
                        buyerData.tenantCategory === 'Bachelor' ? 'text-amber-500 scale-110' : 'text-slate-400'
                      }`} />
                      <span>Bachelor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-[#25D366] to-emerald-600 hover:from-emerald-400 hover:via-[#25D366] hover:to-emerald-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 group"
                >
                  <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-white" />
                  <span>{isSubmitting ? 'Saving requirements...' : 'Submit & Connect on WhatsApp'}</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  ⚡ Auto-saves your requirements & opens WhatsApp
                </p>
              </div>

            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 4: CLEAN SUCCESS STATE WITH ONLY "CONNECT IN WHATSAPP" */}
        {/* ---------------------------------------------------- */}
        {currentView === 'success' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-center space-y-4 my-auto scrollbar-thin">
            {/* Celebration Icon with robust SVG */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-soft">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-flatzy-navy font-poppins">
                {isBn 
                  ? 'তথ্য সফলভাবে গৃহীত!' 
                  : submissionType === 'broker' 
                    ? 'Listing Submitted Successfully!' 
                    : 'Requirements Saved!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {submissionType === 'broker'
                  ? `Thanks ${brokerData.fullName || 'partner'}! Your details have been recorded.`
                  : `Thanks ${buyerData.fullName || 'there'}! Your requirements have been recorded.`}
              </p>
            </div>

            {/* Structured Message Summary Card (NO copy button) */}
            <div className="text-left bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-flatzy-yellow" />
                <span>Generated WhatsApp Message</span>
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-slate-200 select-all max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {generatedMessageText}
              </pre>
            </div>

            {/* ONLY "Connect in WhatsApp" + simple Explore button */}
            <div className="space-y-2.5 max-w-sm mx-auto pt-1">
              <a
                href={getWhatsAppUrl(generatedMessageText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-5 h-5 fill-white/20" />
                <span>Connect in WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (submissionType === 'buyer' && onApplyFilters) {
                    const matchedLoc = (['New Town', 'Rajarhat', 'Salt Lake', 'Sector V', 'Shapoorji'].includes(buyerData.location) 
                      ? buyerData.location 
                      : undefined) as LocationName | undefined;
                    onApplyFilters(matchedLoc, undefined);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Explore Flats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoleSelectionModal;
