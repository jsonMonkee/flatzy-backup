import React, { useState } from 'react';
import { MessageSquare, Instagram, Phone, Send, Sparkles, CheckCircle2, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

import { submitLeadToGoogleSheet } from '../services/leadService';
import { getWhatsAppUrl, FLATZY_WHATSAPP_NUMBER, FLATZY_EMAIL } from '../config/contact';

interface ContactPageProps {
  onNavigate: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bhk: '2 BHK',
    furnishing: 'Semi-Furnished',
    location: 'New Town',
    budget: '₹15,000 - ₹20,000',
    message: '',
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await submitLeadToGoogleSheet({
      fullName: formData.name,
      phone: formData.phone,
      lookingForBhk: formData.bhk,
      furnishingStatus: formData.furnishing,
      location: formData.location,
      budget: formData.budget,
      tenantCategory: 'Direct Contact Form',
      role: 'Renter',
      source: 'Contact Us Page',
      brokerNote: formData.message,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    handleWhatsApp();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#FF5722', '#0B132B', '#10B981']
      });
    } catch (err) {}
  };

  const handleWhatsApp = () => {
    const text = `🏠 *CONTACT INQUIRY — FLATZY KOLKATA*\n━━━━━━━━━━━━━━━━━━━━━━\n👤 *Name:* ${formData.name || 'Visitor'}\n📱 *Phone:* ${formData.phone || 'N/A'}\n🏢 *BHK:* ${formData.bhk}\n🛋️ *Furnishing:* ${formData.furnishing}\n📍 *Location:* ${formData.location}\n💰 *Budget:* ${formData.budget}\n${formData.message ? `📝 *Message:* ${formData.message}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━\nPlease connect me with verified flat options!`;
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Scenic Cityscape Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[600px] sm:h-[700px] bg-top bg-cover bg-no-repeat pointer-events-none opacity-35 sm:opacity-45"
        style={{ backgroundImage: "url('/city-bg.png')" }}
      />
      <div className="absolute top-0 left-0 right-0 h-[600px] sm:h-[700px] bg-gradient-to-b from-white/20 via-transparent to-[#FAF9F6] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-in fade-in duration-300">
        
        {/* Minimal Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-flatzy-yellowDark">
            {t('contact.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-flatzy-navy font-poppins">
            {t('contact.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('contact.subtitle')}
          </p>
        </div>

      {/* Quick Action Channels: WhatsApp, Instagram & Official Email */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-left transition-all group shadow-xs cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Instant Chat
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                WhatsApp
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                Fastest response
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        <a
          href="https://instagram.com/flatzykolkata"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-pink-50 hover:bg-pink-100/90 border border-pink-200 text-left transition-all group shadow-xs active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-pink-800 uppercase tracking-wider">
                DM Reels
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                @flatzykolkata
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                Send reels & tours
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-700 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </a>

        <a
          href={`mailto:${FLATZY_EMAIL}`}
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-left transition-all group shadow-xs active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Official Email
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                {FLATZY_EMAIL}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                Partners & inquiries
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform shrink-0">
            →
          </span>
        </a>
      </div>

      {/* Clean, Minimal 3-Field Requirement Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-4xl">🏠</div>
            <h3 className="text-2xl font-black text-flatzy-navy font-poppins">
              You're one step closer. 🏠
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              We received your details for <strong>{formData.location}</strong>. Our team will connect you directly with the broker.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-2.5 rounded-full bg-flatzy-yellow text-flatzy-navy font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                Browse More Flats
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left pb-2">
              <h3 className="text-lg font-black text-flatzy-navy font-poppins">
                Tell us what you're looking for
              </h3>
              <p className="text-xs text-slate-500">
                Drop your basics and we'll route you to the right broker.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Joydeep"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="98300 12345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow font-medium"
                />
              </div>
            </div>

            {/* Looking for BHK */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Looking for BHK *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['1 BHK', '2 BHK', '3 BHK'].map((bhk) => (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => {
                      const newBudgets = getBudgetRangesForBhk(bhk);
                      setFormData({
                        ...formData,
                        bhk,
                        budget: newBudgets[0],
                      });
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                      formData.bhk === bhk
                        ? 'bg-flatzy-yellow text-flatzy-navy border-flatzy-yellowDark shadow-xs font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{bhk}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Furnishing (Strictly Side by Side on all screen sizes) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow font-medium cursor-pointer truncate"
                >
                  <option value="New Town">New Town</option>
                  <option value="Shapoorji">Shapoorji</option>
                  <option value="Sector V">Sector V</option>
                  <option value="Other areas in Kolkata">Other areas in Kolkata</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Furnishing *
                </label>
                <select
                  value={formData.furnishing}
                  onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow font-medium cursor-pointer"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Dynamic Budget Selection based on BHK */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Budget Range ({formData.bhk}) *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-flatzy-yellow font-medium cursor-pointer"
              >
                {getBudgetRangesForBhk(formData.bhk).map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-[#25D366] to-emerald-600 hover:from-emerald-400 hover:via-[#25D366] hover:to-emerald-500 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-white" />
                <span>{isSubmitting ? 'Connecting...' : t('contact.submitBtn')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      </div>
    </div>
  );
};
