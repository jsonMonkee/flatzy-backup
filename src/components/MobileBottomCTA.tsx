import React from 'react';
import { Home, Compass, Briefcase, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomCTAProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenInquiryModal: () => void;
  savedCount?: number;
  onOpenSavedDrawer?: () => void;
  onOpenRoleModal?: () => void;
  onOpenPostRoommate?: () => void;
  onExploreClick?: () => void;
}

/* Brand tokens */
const C = {
  active:      '#C9956C',
  activeDark:  '#5C3317',
  activePill:  '#F5E6D3',
  inactive:    '#A89880',
  rays:        '#FFC800',
  navBg:       '#FFFFFF',
  navBorder:   '#E2E8F0',
  pageBg:      '#F1F5F9',   /* gap ring color — matches body bg */
};


/* Reusable tab */
const Tab = ({ icon: Icon, label, isActive, onClick }: {
  icon: React.ElementType; label: string; isActive: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-2 py-0.5 active:scale-95 transition-transform duration-150 select-none"
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    <div style={{
      width: 36, height: 30, borderRadius: 10,
      background: isActive ? C.activePill : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.2s ease',
    }}>
      <Icon
        style={{ width: 20, height: 20, color: isActive ? C.activeDark : C.inactive }}
        strokeWidth={isActive ? 2.5 : 1.8}
      />
    </div>
    <span style={{ fontSize: 10, lineHeight: 1, fontWeight: isActive ? 700 : 500, color: isActive ? C.activeDark : C.inactive, marginTop: 2 }}>
      {label}
    </span>
  </button>
);

export const MobileBottomCTA: React.FC<MobileBottomCTAProps> = ({
  currentTab, onNavigate, onOpenInquiryModal,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const isHome    = currentTab === 'home';
  const isExplore = currentTab === 'explore';
  const isBroker  = currentTab === 'brokers' || currentTab === 'broker-detail';
  const isMate    = ['roommates','all-roommates','roommates-female','roommates-male'].includes(currentTab);

  return (
    <nav aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
    >
      <div style={{ position: 'relative' }}>

        {/* ── Notch arch SVG — sits on top of navbar top edge, creates concave fold ── */}
        <div style={{
          position: 'absolute', top: -1,
          left: '50%', transform: 'translateX(-50%)',
          width: 88, height: 28,
          zIndex: 10, pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 88 28" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            {/* White fill — hides the navbar top border under the arch */}
            <path
              d="M 0 28 L 0 0 Q 14 0 20 10 Q 26 24 44 24 Q 62 24 68 10 Q 74 0 88 0 L 88 28 Z"
              fill={C.navBg}
            />
            {/* Border stroke — draws the arch outline matching navbar border */}
            <path
              d="M 0 0 Q 14 0 20 10 Q 26 24 44 24 Q 62 24 68 10 Q 74 0 88 0"
              fill="none" stroke={C.navBorder} strokeWidth="1"
            />
          </svg>
        </div>

        {/* ── Main pill bar ── */}
        <div style={{
          position: 'relative',
          background: C.navBg,
          borderRadius: 32,
          border: `1px solid ${C.navBorder}`,
          boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
          display: 'flex',
          alignItems: 'stretch',
        }}>

          {/* LEFT: Home + Explore */}
          <div className="flex flex-1 items-center justify-around py-3 pl-2 pr-1">
            <Tab icon={Home} label={isBn ? 'হোম' : 'Home'} isActive={isHome}
              onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            <Tab icon={Compass} label={isBn ? 'এক্সপ্লোর' : 'Explore'} isActive={isExplore}
              onClick={() => { onNavigate('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </div>

          {/* CENTER: Flatzymate FAB */}
          <div style={{
            width: 80, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10,
            position: 'relative', zIndex: 15,
          }}>
            <button
              onClick={() => { onNavigate('roommates'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              aria-label="Flatzymate"
              className="active:scale-95 transition-transform duration-150 focus:outline-none"
              style={{
                position: 'absolute',
                top: -24,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{ position: 'relative', width: 56, height: 56 }}>
                {/* WHITE circle — with clean gap ring effect */}
                <div style={{
                  position: 'relative', zIndex: 10,
                  width: 56, height: 56, borderRadius: '50%',
                  background: '#FFFFFF',
                  /* gap ring: transparent space then border matching navbar */
                  boxShadow: `0 0 0 8px ${C.pageBg}, 0 0 0 9.5px ${C.navBorder}, 0 8px 24px rgba(15,23,42,0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'box-shadow 0.2s ease',
                  ...(isMate ? {
                    boxShadow: `0 0 0 8px ${C.pageBg}, 0 0 0 9.5px ${C.active}, 0 8px 24px rgba(201,149,108,0.35)`,
                  } : {}),
                }}>
                  <img src="/flatzymate-3d-icon.png" alt="Flatzymate"
                    style={{ width: 38, height: 38, objectFit: 'contain' }} />
                </div>
              </div>
            </button>

            {/* Label */}
            <span style={{ fontSize: 10, lineHeight: 1, fontWeight: isMate ? 700 : 500, color: isMate ? C.activeDark : C.inactive, marginTop: 4 }}>
              {isBn ? 'ফ্ল্যাটজিমেট' : 'Flatzymate'}
            </span>
          </div>

          {/* RIGHT: Brokers + Enquire */}
          <div className="flex flex-1 items-center justify-around py-3 pl-1 pr-2">
            <Tab icon={Briefcase} label={isBn ? 'ব্রোকার' : 'Brokers'} isActive={isBroker}
              onClick={() => { onNavigate('brokers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

            {/* Enquire pill */}
            <button onClick={onOpenInquiryModal} aria-label="Enquire"
              className="active:scale-95 transition-transform duration-150"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3,
                background: '#fff0f3', border: '1.5px solid #fecdd3',
                borderRadius: 9999, padding: '11px 10px',
              }}>
                <Sparkles style={{ width: 14, height: 14, color: '#F43F5E' }} strokeWidth={2.5} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#F43F5E', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {isBn ? 'ইনকোয়ারি' : 'Enquire'}
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
