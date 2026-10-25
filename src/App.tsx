import React, { useState, useEffect } from 'react';
import type { Property, LocationName, BudgetRange, FilterState } from './types/property';
import { PROPERTIES_DATA } from './data/properties';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { SavedFlatsDrawer } from './components/SavedFlatsDrawer';
import { MobileBottomCTA } from './components/MobileBottomCTA';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { ListPropertyModal } from './components/ListPropertyModal';
import { FloatingWhatsAppWidget } from './components/FloatingWhatsAppWidget';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LocationsPage } from './pages/LocationsPage';
import { ReelDiscoveryPage } from './pages/ReelDiscoveryPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PostFlatPage } from './pages/PostFlatPage';
import { BrokersPage } from './pages/BrokersPage';
import { BrokerProfilePage } from './pages/BrokerProfilePage';
import { RoommatesPage } from './pages/RoommatesPage';
import { AllRoommatesPage } from './pages/AllRoommatesPage';
import { BROKERS_DATA, type Broker } from './data/brokersData';
import { getCommunityListings } from './services/communityListingService';
import type { CommunityListing } from './types/property';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('flatzy_saved_flats');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryTargetProperty, setInquiryTargetProperty] = useState<Property | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalBoardMode, setRoleModalBoardMode] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [scheduleVisitProperty, setScheduleVisitProperty] = useState<Property | null>(null);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [isPostRoommateOpen, setIsPostRoommateOpen] = useState(false);

  // Dynamic Community Listings & Combined Marketplace Inventory
  const [communityListings, setCommunityListings] = useState<CommunityListing[]>(() => getCommunityListings());

  const refreshCommunityListings = () => {
    setCommunityListings(getCommunityListings());
  };

  const approvedCommunityListings = communityListings.filter(l => l.approvalStatus === 'approved');
  const allProperties: Property[] = [...approvedCommunityListings, ...PROPERTIES_DATA];

  // Quick filter presets for Explore page
  const [exploreFilterPreset, setExploreFilterPreset] = useState<Partial<FilterState>>({});

  // Persist saved flats to localStorage cache and sync across tabs
  useEffect(() => {
    try {
      localStorage.setItem('flatzy_saved_flats', JSON.stringify(savedPropertyIds));
    } catch {}
  }, [savedPropertyIds]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'flatzy_saved_flats' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSavedPropertyIds(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Scroll to top whenever tab or property or broker changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, selectedProperty, selectedBroker]);

  // Handle hash routing for browser navigation support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!hash || hash === 'home' || hash === 'admin') {
        setCurrentTab('home');
        setSelectedProperty(null);
        setSelectedBroker(null);
        if (hash === 'admin') {
          window.location.hash = '';
        }
      } else if (hash.startsWith('property/')) {
        const propIdOrSlug = hash.replace('property/', '');
        const found = allProperties.find(p => p.slug === propIdOrSlug || p.id === propIdOrSlug);
        setSelectedProperty(found || allProperties[0]);
        setCurrentTab('property-detail');
      } else if (hash === 'property-detail') {
        setSelectedProperty(prev => prev || allProperties[0]);
        setCurrentTab('property-detail');
      } else if (hash.startsWith('broker/') || hash.startsWith('brokers/')) {
        const brokerId = hash.replace(/^brokers?\//, '');
        const found = BROKERS_DATA.find(b => b.id === brokerId || b.name.toLowerCase() === brokerId.toLowerCase());
        setSelectedBroker(found || BROKERS_DATA[0]);
        setCurrentTab('broker-detail');
      } else if (hash === 'broker-detail') {
        setSelectedBroker(prev => prev || BROKERS_DATA[0]);
        setCurrentTab('broker-detail');
      } else if (hash === 'all-roommates' || hash === 'roommates-female' || hash === 'roommates-male') {
        setCurrentTab(hash);
        setSelectedProperty(null);
        setSelectedBroker(null);
      } else if (['explore', 'list-flats', 'roommates', 'locations', 'reels', 'how-it-works', 'about', 'contact', 'brokers', 'broker'].includes(hash)) {
        setCurrentTab(hash === 'broker' ? 'brokers' : hash);
        setSelectedProperty(null);
        setSelectedBroker(null);
      } else {
        // Fallback for any unknown hash or removed route
        setCurrentTab('home');
        setSelectedProperty(null);
        setSelectedBroker(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [communityListings]);

  const navigateTo = (tab: string, extra?: any) => {
    setCurrentTab(tab);
    if (tab !== 'property-detail') {
      setSelectedProperty(null);
    }
    if (tab !== 'broker-detail') {
      setSelectedBroker(null);
    }
    window.location.hash = tab;
  };

  const handleToggleSave = (propertyId: string) => {
    setSavedPropertyIds(prev => {
      const next = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      try {
        localStorage.setItem('flatzy_saved_flats', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleClearAllSaved = () => {
    setSavedPropertyIds([]);
    try {
      localStorage.setItem('flatzy_saved_flats', JSON.stringify([]));
    } catch {}
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentTab('property-detail');
    window.location.hash = `property/${property.slug}`;
  };

  const handleSelectBroker = (broker: Broker) => {
    setSelectedBroker(broker);
    setCurrentTab('broker-detail');
    window.location.hash = `broker/${broker.id}`;
  };

  const handleOpenInquiryModal = (property?: Property, isBoardMode = false) => {
    setInquiryTargetProperty(property || null);
    setRoleModalBoardMode(isBoardMode);
    setIsRoleModalOpen(true);
  };

  const handleOpenScheduleVisit = (property?: Property) => {
    setScheduleVisitProperty(property || selectedProperty || null);
    setIsScheduleVisitOpen(true);
  };

  const handleOpenListProperty = () => {
    setIsListPropertyOpen(true);
  };

  const handleApplyQuickFilter = (loc?: LocationName, budget?: BudgetRange) => {
    setExploreFilterPreset({
      locations: loc ? [loc] : [],
      budgetRange: budget || 'all',
    });
    navigateTo('explore');
  };

  const savedPropertiesList = allProperties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-flatzy-cream text-flatzy-navy selection:bg-flatzy-yellow selection:text-flatzy-navy font-poppins">
      
      {/* Top Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        savedCount={savedPropertiesList.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenInquiryModal={() => handleOpenInquiryModal(selectedProperty || undefined)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenListProperty={handleOpenListProperty}
        onOpenPostRoommate={() => setIsPostRoommateOpen(true)}
      />

      {/* Main View Area with bottom padding on mobile so floating bottom bar never overlaps content */}
      <main className="flex-1 pb-28 sm:pb-32 md:pb-0">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            savedPropertyIds={savedPropertyIds}
            onToggleSave={handleToggleSave}
            onSelectProperty={handleSelectProperty}
            onOpenInquiryModal={handleOpenInquiryModal}
            onApplyQuickFilter={handleApplyQuickFilter}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            properties={allProperties}
            initialFilters={exploreFilterPreset}
            savedPropertyIds={savedPropertyIds}
            onToggleSave={handleToggleSave}
            onSelectProperty={handleSelectProperty}
            onOpenInquiryModal={handleOpenInquiryModal}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentTab === 'list-flats' && (
          <PostFlatPage
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'roommates' && (
          <RoommatesPage
            onNavigate={navigateTo}
            isPostModalOpen={isPostRoommateOpen}
            onOpenPostModal={() => setIsPostRoommateOpen(true)}
            onClosePostModal={() => setIsPostRoommateOpen(false)}
            onOpenInquiryModal={(prop, isBoard) => handleOpenInquiryModal(prop, isBoard)}
          />
        )}

        {(currentTab === 'all-roommates' || currentTab === 'roommates-female' || currentTab === 'roommates-male') && (
          <AllRoommatesPage
            onNavigate={navigateTo}
            initialGender={currentTab === 'roommates-female' ? 'Female' : currentTab === 'roommates-male' ? 'Male' : 'All'}
            onOpenPostModal={() => setIsPostRoommateOpen(true)}
          />
        )}

        {currentTab === 'property-detail' && (
          <PropertyDetailPage
            property={selectedProperty || allProperties[0]}
            onBack={() => navigateTo('explore')}
            isSaved={savedPropertyIds.includes((selectedProperty || allProperties[0]).id)}
            onToggleSave={handleToggleSave}
            onOpenInquiryModal={handleOpenInquiryModal}
            onSelectProperty={handleSelectProperty}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentTab === 'locations' && (
          <LocationsPage
            onSelectLocation={(loc) => handleApplyQuickFilter(loc)}
            onOpenInquiryModal={() => handleOpenInquiryModal()}
          />
        )}

        {currentTab === 'reels' && (
          <ReelDiscoveryPage
            onSelectProperty={handleSelectProperty}
            onOpenInquiryModal={handleOpenInquiryModal}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={navigateTo}
            onOpenInquiryModal={() => handleOpenInquiryModal()}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
            onOpenInquiryModal={() => handleOpenInquiryModal()}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'brokers' && (
          <BrokersPage
            onNavigate={navigateTo}
            onSelectBroker={handleSelectBroker}
            onOpenListProperty={handleOpenListProperty}
          />
        )}

        {currentTab === 'broker-detail' && (
          <BrokerProfilePage
            broker={selectedBroker || BROKERS_DATA[0]}
            onBack={() => navigateTo('brokers')}
            onNavigate={navigateTo}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {!['home', 'explore', 'list-flats', 'roommates', 'all-roommates', 'roommates-female', 'roommates-male', 'property-detail', 'locations', 'reels', 'how-it-works', 'about', 'contact', 'brokers', 'broker-detail'].includes(currentTab) && (
          <HomePage
            onNavigate={navigateTo}
            savedPropertyIds={savedPropertyIds}
            onToggleSave={handleToggleSave}
            onSelectProperty={handleSelectProperty}
            onOpenInquiryModal={handleOpenInquiryModal}
            onApplyQuickFilter={handleApplyQuickFilter}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}
      </main>

      {/* Global Footer (On phone UI: ONLY visible on Home page. Hidden on Explore, List Flats, Brokers, etc.) */}
      <div className={currentTab === 'home' ? 'block' : 'hidden md:block'}>
        <Footer
          onNavigate={navigateTo}
          onSelectLocation={(loc) => handleApplyQuickFilter(loc)}
          onOpenInquiryModal={() => handleOpenInquiryModal()}
        />
      </div>

      {/* Unified Inquiry & Role Selection Modal (Renter/Buyer vs Broker) */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        targetProperty={inquiryTargetProperty}
        initialBoardMode={roleModalBoardMode}
        onClose={() => {
          setIsRoleModalOpen(false);
          setInquiryTargetProperty(null);
          setRoleModalBoardMode(false);
        }}
        onApplyFilters={(loc, budget) => {
          setIsRoleModalOpen(false);
          setInquiryTargetProperty(null);
          setRoleModalBoardMode(false);
          handleApplyQuickFilter(loc, budget);
        }}
        onOpenListProperty={handleOpenListProperty}
      />

      {/* Free Site Visit Slot Booking Modal */}
      <ScheduleVisitModal
        isOpen={isScheduleVisitOpen}
        onClose={() => {
          setIsScheduleVisitOpen(false);
          setScheduleVisitProperty(null);
        }}
        targetProperty={scheduleVisitProperty}
      />

      {/* 2-Minute List Your Property Landlord Flow Modal */}
      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
      />

      {/* Saved / Bookmarked Flats Drawer */}
      <SavedFlatsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSaved={handleToggleSave}
        onClearAll={handleClearAllSaved}
        onSelectProperty={handleSelectProperty}
        onOpenInquiryModal={handleOpenInquiryModal}
        onNavigate={navigateTo}
      />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomCTA
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenInquiryModal={() => handleOpenInquiryModal(selectedProperty || undefined)}
        savedCount={savedPropertiesList.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenPostRoommate={() => setIsPostRoommateOpen(true)}
      />

      {/* Floating WhatsApp Quick Connect & Dialog Widget (All screens except roommates) */}
      <FloatingWhatsAppWidget currentTab={currentTab} />

    </div>
  );
}

export default App;
