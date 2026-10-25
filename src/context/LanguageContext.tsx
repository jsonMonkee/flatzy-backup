import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.explore': 'Explore Flats',
    'nav.listFlats': 'List Flats',
    'nav.locations': 'Locations',
    'nav.reels': 'Reels',
    'nav.howItWorks': 'How It Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.findMyFlat': 'Enquire Flat',
    'nav.tagline': 'Skip the hassle.',

    // Hero
    'hero.badge': 'Kolkata’s 1st Local Rental Discovery',
    'hero.title1': 'Your one-stop solution',
    'hero.title2': 'for',
    'hero.titleHighlight': 'flat hunting.',
    'hero.subtitle': 'Tired of the chaos on 99acres or OLX? Flatzy is Kolkata’s unified platform for 100% verified flats, compatible roommates, and trusted local brokers — with zero phone spam.',
    'hero.exploreCta': 'Explore Flats',
    'hero.howItWorksCta': 'How Flatzy Works',
    'hero.popularSearches': 'Popular Searches:',
    'hero.verifiedListings': 'Verified Listings',
    'hero.noBrokersHassle': 'No Brokers Hassle',
    'hero.trustedByThousands': 'Trusted by Thousands',
    'hero.popularLocations': 'Popular Locations',
    'hero.viewAll': 'View all',
    'hero.modernLiving': 'Modern Living in Prime Locations',

    // Quick pills
    'pill.students': 'Students (Amity/Techno)',
    'pill.itPros': 'IT Professionals (Sector V)',
    'pill.newTown': 'New Town High-Rises',
    'pill.saltLake': 'Salt Lake Independent',

    // Handpicked
    'handpicked.badge': 'Handpicked Highlights',
    'handpicked.title': 'Flats worth checking out',
    'handpicked.subtitle': 'Handpicked rental options from locations people actually want to live in.',
    'handpicked.viewAll': 'View All',
    'handpicked.catalogBtn': 'Open Full Kolkata Rental Catalog',
    'handpicked.perMonth': '/month',
    'handpicked.viewFlat': 'View Flat',

    // Two Ways
    'twoways.badge': 'Choose Your Discovery Path',
    'twoways.title': 'Two ways to find your next home',
    'twoways.locTitle': 'Explore by Neighborhood',
    'twoways.locDesc': 'Detailed guides for New Town, Shapoorji, Rajarhat, Salt Lake, and Sector V. Check average rents, nearby colleges, and transit hubs.',
    'twoways.locCta': 'View Location Guides',
    'twoways.reelTitle': 'Flat Video Tours & Reels',
    'twoways.reelDesc': 'Watch verified room-by-room video walkthroughs of Kolkata rental flats before you step out to inspect.',
    'twoways.reelCta': 'Explore Video Gallery',

    // 3 Steps
    'steps.badge': 'Zero Stress Guarantee',
    'steps.title': 'Finding a flat shouldn\'t be this hard.',
    'steps.subtitle': 'Skip the broker cold calls, fake photos, and 100 open tabs.',
    'steps.s1Title': 'Find a flat',
    'steps.s1Desc': 'Browse on our website or spot it through our Instagram reels.',
    'steps.s2Title': 'Tell us what you want',
    'steps.s2Desc': 'Submit an inquiry on the listing or send us the Instagram video.',
    'steps.s3Title': 'We connect you',
    'steps.s3Desc': 'We connect your details directly with the verified broker to visit.',
    'steps.seeFaqs': 'See full comparison & Kolkata rental FAQs',

    // Banner CTA
    'cta.title': 'Find your flat. Skip the hassle.',
    'cta.subtitle': 'Tell us your budget and target location in Kolkata, and our team will match you with available flats.',
    'cta.btn': 'Find My Flat',
    'cta.browse': 'Browse Catalog',

    // Locations Page
    'locations.badge': 'Kolkata Zones',
    'locations.title': 'Where do you want to live?',
    'locations.subtitle': 'Pick your neighborhood to view verified flats and skip the broker hassle.',
    'locations.flatsAvailable': 'Available Flats',
    'locations.explore': 'Explore Flats',
    'locations.customTitle': 'Looking somewhere else?',
    'locations.customDesc': 'Searching outside New Town or Salt Lake? Drop your preferred area and budget — we\'ll check with our Kolkata broker network.',
    'locations.customCta': 'Request custom location →',

    // Reel Page
    'reels.badge': 'Flatzy Video Gallery',
    'reels.title': 'Kolkata Flat Video Walkthroughs',
    'reels.subtitle': 'Watch verified room-by-room video tours of rental flats across Kolkata. Experience the vibe before you visit.',
    'reels.openInsta': 'Instagram @flatzykolkata',
    'reels.sharingBadge': 'Why Video Tours?',
    'reels.sharingTitle': 'Tour Kolkata flats from your phone. Zero surprise visits.',
    'reels.sharingSubtitle': 'Raw camera walkthroughs reveal natural light, room scale, bathroom fixtures, and storage before you commute.',

    // About Page
    'about.badge': 'Kolkata Rental Discovery',
    'about.title': 'We\'re making Kolkata rentals a little less painful.',
    'about.quote1': '"I like this flat"',
    'about.quote2': '"I want to see it"',
    'about.btnExplore': 'Explore Kolkata Flats',

    // Contact Page
    'contact.badge': 'Direct Contact',
    'contact.title': 'Let\'s find your next flat.',
    'contact.subtitle': 'Reach out directly on WhatsApp or leave your details below.',
    'contact.whatsappBtn': 'WhatsApp Flatzy',
    'contact.instaBtn': 'DM @flatzykolkata',
    'contact.formTitle': 'Tell us what you\'re looking for',
    'contact.submitBtn': 'Talk to Flatzy',

    // How It Works Page
    'hiw.badge': 'The Process',
    'hiw.title': 'How Flatzy Works',
    'hiw.subtitle': 'From finding a flat to direct broker connection in 3 simple steps.',
    'hiw.step1Title': 'Find or Choose a Flat',
    'hiw.step1Desc': 'Browse verified flats on Flatzy, or tap Enquire to share what type of flat you are looking for in Kolkata.',
    'hiw.step2Title': 'Fill Details & Send on WhatsApp',
    'hiw.step2Desc': 'Quickly fill your requirement (BHK, budget, area & move-in date). It auto-generates your card and sends it in WhatsApp.',
    'hiw.step3Title': 'We Connect You With the Broker',
    'hiw.step3Desc': 'We review your request and connect you directly with the verified broker managing that property. No cold calls.',
    'hiw.faqTitle': 'Frequently Asked Questions',

    // Footer
    'footer.desc': 'Kolkata’s modern rental discovery platform. Whether you discover a flat through an Instagram Reel or search directly, we get you moved in without broker headaches.',
    'footer.tagline': 'Rent without the broker hassle.',
    'footer.quickLinks': 'Explore Flatzy',
    'footer.topHubs': 'Popular Kolkata Hubs',
    'footer.needHelp': 'Looking for a flat?',
    'footer.helpDesc': 'Share your target area and budget with our Kolkata team for direct matching.',
    'footer.inquireBtn': 'Request Custom Search',
    'footer.verified': '100% Verified Vacancies',
    'footer.noGatekeeping': 'Zero Moral Policing',
    'footer.instaDiscovery': 'Instagram Reel Discovery',
    'footer.directConnect': 'Direct Broker Connect',
    'footer.rights': 'All rights reserved.',
    'footer.crafted': 'Crafted in Kolkata for hassle-free renting.',

    // Explore Page
    'explore.badge': 'Live Kolkata Marketplace',
    'explore.title': 'Find your next flat',
    'explore.subtitle': 'Verified rentals in Kolkata • Connect directly with brokers',
    'explore.cantFind': "Can't find flat?",
    'explore.inquire': 'Inquire',
    'explore.searchPlaceholder': 'Search Shapoorji, PS One 10, New Town...',
    'explore.filters': 'Filters',
    'explore.sortRecommended': 'Recommended',
    'explore.sortRentLow': 'Rent: Low to High',
    'explore.sortRentHigh': 'Rent: High to Low',
    'explore.sortNewest': 'Newest',
    'explore.allFlats': 'All Flats',
    'explore.showing': 'Showing',
    'explore.rentalFlats': 'rental flats in Kolkata',
    'explore.updated': 'Updated within 24 hours',
    'explore.noFlatsTitle': 'No flats found matching these filters',
    'explore.noFlatsDesc': 'Try relaxing your budget, clearing selected amenities, or selecting another nearby location like Shapoorji or New Town.',
    'explore.resetAll': 'Reset All Filters',
    'explore.clearAll': 'Clear All',
    'explore.filterFlats': 'Filter Flats',
    'explore.applyFilters': 'Apply Filters',
    'explore.budget': 'Budget',

    // Post Flat / List Flat Page
    'post.badge': 'List a Flat',
    'post.whatsappOnboard': 'Chat on WhatsApp',
    'post.title': 'List your flat.',
    'post.titleHighlight': 'Find tenants fast.',
    'post.desc': 'Got a flat for rent? Share basic details here or on WhatsApp. We bring you genuine tenants without the headache.',
    'post.zeroFee': 'Free to list',
    'post.directWa': 'Direct on WhatsApp',
    'post.verified': 'Verified tenants',
    'post.rapidOnboard': 'Takes 1 minute',
    'post.formTitle': 'List your flat',
    'post.fullName': 'Your Name',
    'post.phone': 'WhatsApp Number',
    'post.email': 'Email (Optional)',
    'post.role': 'You are a...',
    'post.owner': 'Flat Owner',
    'post.broker': 'Broker / Agent',
    'post.agency': 'Agency / Firm (Optional)',
    'post.submitBtn': 'Send on WhatsApp',
    'post.submitting': 'Opening WhatsApp...',
    'post.successTitle': 'Opening WhatsApp...',
    'post.anotherListing': '+ List another flat',

    // Property Detail Page
    'detail.back': 'Back',
    'detail.save': 'Save',
    'detail.share': 'Share',
    'detail.perMonth': '/month',
    'detail.secDeposit': 'Security Deposit',
    'detail.months': 'Months',
    'detail.moveIn': 'Move-in',
    'detail.floor': 'Floor',
    'detail.furnishing': 'Furnishing',
    'detail.tenantPref': 'Tenant Preference',
    'detail.about': 'About This Flat',
    'detail.amenities': 'Amenities & Features',
    'detail.nearbyTransit': 'Nearby Transit & Hubs',
    'detail.connectWhatsApp': 'Connect on WhatsApp',
    'detail.scheduleVisit': 'Schedule Visit',
    'detail.inquireNow': 'Inquire Now',
    'detail.viewPictures': 'View Pictures',
    'detail.similarFlats': 'More Flats You Might Like',
    'detail.shareFlat': 'Share This Flat',
    'detail.copyLink': 'Copy Link',
    'detail.copied': 'Copied!',
    'detail.whatsapp': 'WhatsApp',
    'detail.email': 'Email',
    'detail.zeroBrokerage': 'Verified Flat',

    // Brokers Page
    'brokers.badge': 'Verified Kolkata Neighborhood Network',
    'brokers.title': 'Top Kolkata',
    'brokers.titleHighlight': 'Rental Brokers & Advisors',
    'brokers.desc': 'Skip endless cold calls and bait-and-switch listings. Connect directly with handpicked, highly-rated local specialists in Shapoorji, New Town, Kestopur, and Kolkata.',
    'brokers.viewProfile': 'View Verified Profile',
    'brokers.chatWhatsApp': 'Chat on WhatsApp',
    'brokers.territory': 'Territory',
    'brokers.experience': 'Experience',
    'brokers.availableFlats': 'Available Flats',
    'brokers.years': 'Years',
    'brokers.deals': 'deals',
    'brokers.coverageHubs': 'Coverage Hubs',
    'brokers.activeOnGround': 'Active On-Ground in Kolkata',
    'brokers.trendingBroker': '#1 Trending Broker',
    'brokers.bestRated': 'Best Rated',
    'brokers.topRated': 'Top Rated',
    'brokers.partnerTitle': 'Are you a Real Estate Broker in Kolkata?',
    'brokers.partnerDesc': "Get listed on Kolkata's fastest growing rental discovery platform. Reach pre-verified tech professionals and families with zero upfront fees.",
    'brokers.partnerCta': 'Apply to Join Flatzy Partner Network',

    // Property Card
    'card.perMonth': '/month',
    'card.viewDetails': 'View Details',
    'card.zeroBrokerage': 'Verified Flat',
    'card.salePrice': 'Sale Price',
    'card.negotiable': 'Negotiable',
    'card.rentSale': 'Rent & Sale',
    'card.forSale': 'FOR SALE',

    // Filter Panel
    'filter.title': 'Refine Results',
    'filter.results': 'flats found',
    'filter.location': 'Location',
    'filter.metroCommute': 'Metro & IT Hub Commute',
    'filter.active': 'active',
    'filter.budget': 'Monthly Budget',
    'filter.bedrooms': 'Bedrooms',
    'filter.configuration': 'Configuration',
    'filter.byCapacity': 'By capacity',
    'filter.furnishing': 'Furnishing',
    'filter.tenantPref': 'Tenant Preference',
    'filter.amenities': 'Amenities',
    'filter.reset': 'Reset',
    'filter.all': 'All',

    // Reel Discovery Extensions
    'reels.whyVideo': 'Why Video Tours?',
    'reels.tourFromPhone': 'Tour Kolkata flats from your phone.',
    'reels.zeroSurprise': 'Zero surprise visits.',
    'reels.whyDesc': 'Photos often use wide angles to hide flaws. Our video walkthroughs reveal the exact condition, daylight, room scale, and storage before you spend hours commuting.',
    'reels.realFootage': '100% Real Footage',
    'reels.realFootageDesc': 'Raw, authentic video of actual flats available right now.',
    'reels.saveTime': 'Save 10+ Hours',
    'reels.saveTimeDesc': 'Shortlist flats from home and only visit your top choices.',
    'reels.instantInquiry': 'Instant Inquiry',
    'reels.instantInquiryDesc': 'Direct connection to verified brokers with transparent rent.',
    'reels.conciergeBadge': 'Kolkata Rental Concierge',
    'reels.customTourTitle': 'Need a custom video tour?',
    'reels.customTourDesc': 'Have a specific society or building in New Town, Salt Lake, or Sector V you want us to film? Send us a message!',
    'reels.whatsappTeam': 'WhatsApp Flatzy Team',
    'reels.browseAll': 'Browse All Flats in Kolkata',

    // Broker Profile
    'brokerProfile.back': 'Back to All Brokers',
    'brokerProfile.availableNow': 'Available Now',
    'brokerProfile.specialist': 'Verified Neighborhood Specialist',
    'brokerProfile.chatWhatsApp': 'Chat on WhatsApp',
    'brokerProfile.callBroker': 'Call Broker',
    'brokerProfile.quickStats': 'Quick Stats',
    'brokerProfile.managedInventory': 'Managed Flats',
    'brokerProfile.avgClosing': 'Avg. Closing Time',
    'brokerProfile.operatingSince': 'Experience',
    'brokerProfile.verifiedBadge': 'Identity & RERA/Trade Verified',
    'brokerProfile.about': 'About the Broker',
    'brokerProfile.exclusiveFlats': 'Active & Exclusive Listings',
    'brokerProfile.unlockAll': 'Unlock All Available Flats',
    'brokerProfile.unlockDesc': 'Connect directly with this broker on WhatsApp to receive the complete, unlisted catalog of flats in their portfolio.',
  },
  bn: {
    // Navbar
    'nav.home': 'হোম',
    'nav.explore': 'ফ্ল্যাট খুঁজুন',
    'nav.listFlats': 'ফ্ল্যাট পোস্ট করুন',
    'nav.locations': 'এলাকা',
    'nav.reels': 'রিলস',
    'nav.howItWorks': 'কীভাবে কাজ করে',
    'nav.about': 'আমাদের কথা',
    'nav.contact': 'যোগাযোগ',
    'nav.findMyFlat': 'ফ্ল্যাট ইনকোয়ারি',
    'nav.tagline': 'ঝক্কি ছাড়াই খুঁজুন।',

    // Hero
    'hero.badge': 'কলকাতার ১ম রেন্টাল ডিসকভারি প্ল্যাটফর্ম',
    'hero.title1': 'আপনার পছন্দের ফ্ল্যাট এখন',
    'hero.title2': 'আপনার',
    'hero.titleHighlight': 'হাতের নাগালে।',
    'hero.subtitle': '99acres বা OLX-এর বিশৃঙ্খলা ও স্প্যাম কলে ক্লান্ত? Flatzy হলো কলকাতার যাচাই করা ফ্ল্যাট, উপযুক্ত রুমমেট এবং বিশ্বস্ত ব্রোকারদের একক প্ল্যাটফর্ম।',
    'hero.exploreCta': 'ফ্ল্যাট দেখুন',
    'hero.howItWorksCta': 'কীভাবে কাজ করে',
    'hero.popularSearches': 'জনপ্রিয় এলাকা:',
    'hero.verifiedListings': 'ভেরিফায়েড ফ্ল্যাট',
    'hero.noBrokersHassle': 'ব্রোকার ঝক্কি মুক্ত',
    'hero.trustedByThousands': 'হাজারো মানুষের ভরসা',
    'hero.popularLocations': 'জনপ্রিয় এলাকা',
    'hero.viewAll': 'সব দেখুন',
    'hero.modernLiving': 'প্রধান স্থানে আধুনিক ফ্ল্যাট',

    // Quick pills
    'pill.students': 'ছাত্র-ছাত্রী (শাপুরজি / অ্যামিটি)',
    'pill.itPros': 'আইটি প্রফেশনাল (সেক্টর ৫)',
    'pill.newTown': 'নিউ টাউন হাই-রাইজ',
    'pill.saltLake': 'সল্টলেক স্বাধীন ফ্ল্যাট',

    // Handpicked
    'handpicked.badge': 'বাছাই করা সেরা ফ্ল্যাট',
    'handpicked.title': 'পছন্দসই কিছু ভাড়ার ফ্ল্যাট',
    'handpicked.subtitle': 'যেসব এলাকায় মানুষ সবচেয়ে বেশি থাকতে পছন্দ করে, সেখানকার সেরা অপশন।',
    'handpicked.viewAll': 'সব দেখুন',
    'handpicked.catalogBtn': 'কলকাতার সব ভাড়ার ফ্ল্যাট দেখুন',
    'handpicked.perMonth': '/মাস',
    'handpicked.viewFlat': 'বিস্তারিত দেখুন',

    // Two Ways
    'twoways.badge': 'বাড়ি খোঁজার সহজ পথ',
    'twoways.title': 'ফ্ল্যাট খুঁজে পাওয়ার দুটি সহজ উপায়',
    'twoways.locTitle': 'এলাকা অনুযায়ী খুঁজুন',
    'twoways.locDesc': 'নিউ টাউন, শাপুরজি, রাজারহাট, সল্টলেক এবং সেক্টর ৫-এর সম্পূর্ণ গাইড। গড় ভাড়া, কলেজ ও যাতায়াতের সুবিধা জানুন।',
    'twoways.locCta': 'এলাকার তালিকা দেখুন',
    'twoways.reelTitle': 'ফ্ল্যাট ভিডিও ট্যুর ও রিলস',
    'twoways.reelDesc': 'বাড়ি বসেই দেখুন কলকাতার ভেরিফায়েড ফ্ল্যাটের সম্পূর্ণ রুম-বাই-রুম ভিডিও ট্যুর ও রিলস।',
    'twoways.reelCta': 'ভিডিও গ্যালারি দেখুন',

    // 3 Steps
    'steps.badge': 'জিরো স্ট্রেস গ্যারান্টি',
    'steps.title': 'ফ্ল্যাট খোঁজা এত কঠিন হওয়া উচিত নয়।',
    'steps.subtitle': 'অযথা ব্রোকারের ফোন, ভুয়া ছবি আর ডজনখানেক ওয়েবসাইটের ঝামেলা আর নয়।',
    'steps.s1Title': 'ফ্ল্যাট পছন্দ করুন',
    'steps.s1Desc': 'আমাদের ওয়েবসাইটে ব্রাউজ করুন অথবা ইনস্টাগ্রাম রিলে দেখুন।',
    'steps.s2Title': 'আপনার পছন্দ জানান',
    'steps.s2Desc': 'লিস্টিংয়ে ফর্ম পূরণ করুন অথবা রিলটি আমাদের ইনবক্সে পাঠান।',
    'steps.s3Title': 'আমরা ব্রোকারের সাথে পরিচয় করাবো',
    'steps.s3Desc': 'ফ্ল্যাটটি দেখতে যাওয়ার জন্য আমরা সরাসরি ব্রোকারের সাথে যোগাযোগ করিয়ে দেব।',
    'steps.seeFaqs': 'কলকাতার ভাড়ার নিয়ম ও সাধারণ প্রশ্নোত্তর দেখুন',

    // Banner CTA
    'cta.title': 'পছন্দের ফ্ল্যাট খুঁজুন। ঝক্কি এড়িয়ে চলুন।',
    'cta.subtitle': 'আপনার বাজেট ও পছন্দের এলাকা জানান, আমাদের টিম দ্রুত উপযুক্ত ফ্ল্যাটের ব্যবস্থা করে দেবে।',
    'cta.btn': 'আমার ফ্ল্যাট খুঁজুন',
    'cta.browse': 'সব ফ্ল্যাট দেখুন',

    // Locations Page
    'locations.badge': 'কলকাতার এলাকা',
    'locations.title': 'আপনি কোন এলাকায় থাকতে চান?',
    'locations.subtitle': 'আপনার পছন্দের এলাকা বেছে নিন এবং ব্রোকারের ঝামেলা ছাড়াই ফ্ল্যাট দেখুন।',
    'locations.flatsAvailable': 'উপলব্ধ ফ্ল্যাট',
    'locations.explore': 'ফ্ল্যাট দেখুন',
    'locations.customTitle': 'অন্য কোনো এলাকা খুঁজছেন?',
    'locations.customDesc': 'নিউ টাউন বা সল্টলেকের বাইরে খুঁজছেন? আপনার বাজেট ও এলাকা জানান, আমরা আমাদের নেটওয়ার্ক থেকে খুঁজে দেব।',
    'locations.customCta': 'পছন্দের এলাকা জানান →',

    // Reel Page
    'reels.badge': 'ফ্ল্যাট ভিডিও গ্যালারি',
    'reels.title': 'কলকাতার ফ্ল্যাট ভিডিও ওয়াকথ্রু',
    'reels.subtitle': 'বাড়ি বসেই দেখুন কলকাতার ভেরিফায়েড ফ্ল্যাটের সম্পূর্ণ রুম-বাই-রুম ভিডিও ট্যুর ও রিলস।',
    'reels.openInsta': 'ইনস্টাগ্রাম @flatzykolkata',
    'reels.sharingBadge': 'ভিডিও ট্যুরের সুবিধা',
    'reels.sharingTitle': 'ফোনেই দেখে নিন ফ্ল্যাটের প্রতিটা কোণ।',
    'reels.sharingSubtitle': 'বাস্তব ভিডিও ওয়াকথ্রু দেখে তবেই ভিজিট করুন, নষ্ট হবে না অযথা সময়।',

    // About Page
    'about.badge': 'আমাদের গল্প',
    'about.title': 'কলকাতায় ফ্ল্যাট খোঁজার কষ্ট আমরা কমাতে এসেছি।',
    'about.quote1': '"ফ্ল্যাটটা খুব ভালো লেগেছে"',
    'about.quote2': '"আমি দেখতে যেতে চাই"',
    'about.btnExplore': 'কলকাতার ফ্ল্যাট দেখুন',

    // Contact Page
    'contact.badge': 'সরাসরি যোগাযোগ',
    'contact.title': 'আসুন আপনার নতুন বাড়ি খুঁজি।',
    'contact.subtitle': 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন বা নিচে আপনার তথ্য জমা দিন।',
    'contact.whatsappBtn': 'হোয়াটসঅ্যাপে চ্যাট করুন',
    'contact.instaBtn': 'ইনস্টাগ্রামে ডিএম করুন',
    'contact.formTitle': 'আপনার কী ধরনের ফ্ল্যাট প্রয়োজন?',
    'contact.submitBtn': 'ফ্ল্যাটজির সাথে কথা বলুন',

    // How It Works Page
    'hiw.badge': 'পদ্ধতি',
    'hiw.title': 'কীভাবে কাজ করে ফ্ল্যাটজি',
    'hiw.subtitle': 'পছন্দের ফ্ল্যাট বাছাই থেকে সরাসরি ব্রোকারের সাথে যোগাযোগের ৩টি সহজ ধাপ।',
    'hiw.step1Title': 'ফ্ল্যাট বেছে নিন বা খুঁজুন',
    'hiw.step1Desc': 'ফ্ল্যাটজি-তে ভেরিফায়েড ফ্ল্যাট ব্রাউজ করুন অথবা ইনকোয়ারি বাটনে ট্যাপ করে আপনার পছন্দের কথা জানান।',
    'hiw.step2Title': 'তথ্য পূরণ করুন ও হোয়াটসঅ্যাপে পাঠান',
    'hiw.step2Desc': 'বাজেট, এলাকা ও ওঠার তারিখ পূরণ করুন। স্বয়ংক্রিয়ভাবে মেসেজ তৈরি হয়ে আপনার হোয়াটসঅ্যাপে খুলে যাবে।',
    'hiw.step3Title': 'আমরা ব্রোকারের সাথে যোগাযোগ করাবো',
    'hiw.step3Desc': 'আমরা সরাসরি সেই ফ্ল্যাটের দায়িত্বপ্রাপ্ত ভেরিফায়েড ব্রোকারের সাথে আপনার যোগাযোগ করিয়ে দেব।',
    'hiw.faqTitle': 'সাধারণ কিছু প্রশ্নোত্তর',

    // Footer
    'footer.desc': 'কলকাতার আধুনিক ভাড়ার ফ্ল্যাট খোঁজার প্ল্যাটফর্ম। ইনস্টাগ্রাম রিল হোক বা ওয়েবসাইট, ব্রোকারের ঝামেলা ছাড়া ফ্ল্যাট খুঁজে পান।',
    'footer.tagline': 'ব্রোকার ঝামেলা ছাড়া ফ্ল্যাট খুঁজুন।',
    'footer.quickLinks': 'এক্সপ্লোর করুন',
    'footer.topHubs': 'জনপ্রিয় এলাকা',
    'footer.needHelp': 'পছন্দের ফ্ল্যাট খুঁজছেন?',
    'footer.helpDesc': 'আপনার বাজেট ও পছন্দের এলাকা জানালেই আমাদের টিম সেরা অপশন খুঁজে দেবে।',
    'footer.inquireBtn': 'কাস্টম সার্চ রিকোয়েস্ট',
    'footer.verified': '১০০% ভেরিফায়েড ফ্ল্যাট',
    'footer.noGatekeeping': 'কোনও মোরাল পুলিশিং নেই',
    'footer.instaDiscovery': 'ইনস্টাগ্রাম রিল ডিসকভারি',
    'footer.directConnect': 'সরাসরি ব্রোকার কানেক্ট',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',
    'footer.crafted': 'কলকাতায় তৈরি, ভাড়াটেকে স্বস্তি দিতে।',

    // Explore Page
    'explore.badge': 'কলকাতা লাইভ মার্কেটপ্লেস',
    'explore.title': 'আপনার পরবর্তী ফ্ল্যাট খুঁজুন',
    'explore.subtitle': 'কলকাতায় ভেরিফায়েড ভাড়ার ফ্ল্যাট • সরাসরি ব্রোকারের সাথে যোগাযোগ',
    'explore.cantFind': 'ফ্ল্যাট পাচ্ছেন না?',
    'explore.inquire': 'ইনকোয়ারি',
    'explore.searchPlaceholder': 'শাপুরজি, পিএস ওয়ান ১০, নিউ টাউন খুঁজুন...',
    'explore.filters': 'ফিল্টার',
    'explore.sortRecommended': 'সুপারিশকৃত',
    'explore.sortRentLow': 'ভাড়া: কম থেকে বেশি',
    'explore.sortRentHigh': 'ভাড়া: বেশি থেকে কম',
    'explore.sortNewest': 'নতুন',
    'explore.allFlats': 'সব ফ্ল্যাট',
    'explore.showing': 'দেখাচ্ছে',
    'explore.rentalFlats': 'টি ভাড়ার ফ্ল্যাট কলকাতায়',
    'explore.updated': '২৪ ঘণ্টার মধ্যে আপডেট',
    'explore.noFlatsTitle': 'এই ফিল্টারে কোনো ফ্ল্যাট পাওয়া যায়নি',
    'explore.noFlatsDesc': 'বাজেট শিথিল করুন, অ্যামেনিটি সরান, অথবা শাপুরজি বা নিউ টাউনের মতো কাছাকাছি এলাকা নির্বাচন করুন।',
    'explore.resetAll': 'সব ফিল্টার রিসেট করুন',
    'explore.clearAll': 'সব মুছুন',
    'explore.filterFlats': 'ফ্ল্যাট ফিল্টার করুন',
    'explore.applyFilters': 'ফিল্টার প্রয়োগ করুন',
    'explore.budget': 'বাজেট',

    // Post Flat / List Flat Page
    'post.badge': 'মালিক ও ব্রোকার পার্টনার অনবোর্ডিং',
    'post.whatsappOnboard': 'হোয়াটসঅ্যাপে অনবোর্ড করুন',
    'post.title': 'আপনার ফ্ল্যাট লিস্ট করুন।',
    'post.titleHighlight': 'ভেরিফায়েড ভাড়াটের সাথে যুক্ত হন।',
    'post.desc': 'আপনি মালিক হোন বা রিয়েল এস্টেট ব্রোকার: ২ মিনিটে ফ্ল্যাট অনবোর্ড করুন, নিউ টাউন, সল্টলেক ও কলকাতায় হাজার হাজার আইটি প্রফেশনালের কাছে পৌঁছান, এবং জিরো স্প্যামে ইনকোয়ারি ম্যানেজ করুন।',
    'post.zeroFee': 'জিরো লিস্টিং ফি',
    'post.directWa': 'সরাসরি হোয়াটসঅ্যাপ ইনকোয়ারি',
    'post.verified': 'ভেরিফায়েড ও অ্যান্টি-স্প্যাম',
    'post.rapidOnboard': '১৫-৩০ মিনিটে দ্রুত অনবোর্ডিং',
    'post.formTitle': 'আপনার ফ্রি লিস্টিং শুরু করুন',
    'post.fullName': 'পুরো নাম',
    'post.phone': 'হোয়াটসঅ্যাপ নম্বর',
    'post.email': 'ইমেইল (ঐচ্ছিক)',
    'post.role': 'আমি একজন...',
    'post.owner': 'ফ্ল্যাটের মালিক',
    'post.broker': 'রিয়েল এস্টেট ব্রোকার',
    'post.agency': 'এজেন্সি / ফার্মের নাম',
    'post.submitBtn': 'হোয়াটসঅ্যাপে যোগাযোগ করে লিস্টিং শুরু করুন',
    'post.submitting': 'হোয়াটসঅ্যাপ খোলা হচ্ছে...',
    'post.successTitle': 'হোয়াটসঅ্যাপে সংযোগ হচ্ছে...',
    'post.anotherListing': '+ নতুন লিস্টিং শুরু করুন',

    // Property Detail Page
    'detail.back': 'ফিরে যান',
    'detail.save': 'সেভ',
    'detail.share': 'শেয়ার',
    'detail.perMonth': '/মাস',
    'detail.secDeposit': 'সিকিউরিটি ডিপোজিট',
    'detail.months': 'মাস',
    'detail.moveIn': 'ওঠার তারিখ',
    'detail.floor': 'তলা',
    'detail.furnishing': 'ফার্নিশিং',
    'detail.tenantPref': 'ভাড়াটের পছন্দ',
    'detail.about': 'এই ফ্ল্যাট সম্পর্কে',
    'detail.amenities': 'সুবিধা ও বৈশিষ্ট্য',
    'detail.nearbyTransit': 'কাছাকাছি যাতায়াত ও হাব',
    'detail.connectWhatsApp': 'হোয়াটসঅ্যাপে যোগাযোগ করুন',
    'detail.scheduleVisit': 'ভিজিট বুক করুন',
    'detail.inquireNow': 'এখনই ইনকোয়ারি করুন',
    'detail.viewPictures': 'ছবি দেখুন',
    'detail.similarFlats': 'আরও ফ্ল্যাট দেখুন',
    'detail.shareFlat': 'এই ফ্ল্যাট শেয়ার করুন',
    'detail.copyLink': 'লিংক কপি করুন',
    'detail.copied': 'কপি হয়েছে!',
    'detail.whatsapp': 'হোয়াটসঅ্যাপ',
    'detail.email': 'ইমেইল',
    'detail.zeroBrokerage': 'যাচাইকৃত ফ্ল্যাট',

    // Brokers Page
    'brokers.badge': 'ভেরিফায়েড কলকাতা নেটওয়ার্ক',
    'brokers.title': 'কলকাতার সেরা',
    'brokers.titleHighlight': 'ভাড়ার ব্রোকার ও উপদেষ্টা',
    'brokers.desc': 'অযথা কোল্ড কল আর ভুয়া লিস্টিং এড়িয়ে সরাসরি শাপুরজি, নিউ টাউন, কেষ্টপুর ও কলকাতার সেরা ব্রোকারের সাথে যোগাযোগ করুন।',
    'brokers.viewProfile': 'ভেরিফায়েড প্রোফাইল দেখুন',
    'brokers.chatWhatsApp': 'হোয়াটসঅ্যাপে চ্যাট করুন',
    'brokers.territory': 'এলাকা',
    'brokers.experience': 'অভিজ্ঞতা',
    'brokers.availableFlats': 'উপলব্ধ ফ্ল্যাট',
    'brokers.years': 'বছর',
    'brokers.deals': 'চুক্তি',
    'brokers.coverageHubs': 'কভারেজ এলাকা',
    'brokers.activeOnGround': 'কলকাতায় সক্রিয়',
    'brokers.trendingBroker': '#১ ট্রেন্ডিং ব্রোকার',
    'brokers.bestRated': 'সেরা রেটেড',
    'brokers.topRated': 'টপ রেটেড',
    'brokers.partnerTitle': 'আপনি কি কলকাতায় একজন রিয়েল এস্টেট ব্রোকার?',
    'brokers.partnerDesc': 'কলকাতার দ্রুত বর্ধনশীল ভাড়া খোঁজার প্ল্যাটফর্মে তালিকাভুক্ত হন। কোনো অগ্রিম ফি ছাড়াই ভেরিফায়েড টেক প্রফেশনাল ও পরিবারের কাছে পৌঁছান।',
    'brokers.partnerCta': 'ফ্ল্যাটজি পার্টনার নেটওয়ার্কে আবেদন করুন',

    // Property Card
    'card.perMonth': '/মাস',
    'card.viewDetails': 'বিস্তারিত দেখুন',
    'card.zeroBrokerage': 'যাচাইকৃত ফ্ল্যাট',
    'card.salePrice': 'বিক্রয় মূল্য',
    'card.negotiable': 'আলোচনাসাপেক্ষ',
    'card.rentSale': 'ভাড়া ও বিক্রয়',
    'card.forSale': 'বিক্রয়ের জন্য',

    // Filter Panel
    'filter.title': 'ফলাফল পরিমার্জন করুন',
    'filter.results': 'টি ফ্ল্যাট পাওয়া গেছে',
    'filter.location': 'এলাকা',
    'filter.metroCommute': 'মেট্রো ও আইটি হাব যাতায়াত',
    'filter.active': 'সক্রিয়',
    'filter.budget': 'মাসিক বাজেট',
    'filter.bedrooms': 'বেডরুম',
    'filter.configuration': 'কনফিগারেশন',
    'filter.byCapacity': 'ধারণক্ষমতা অনুসারে',
    'filter.furnishing': 'ফার্নিশিং',
    'filter.tenantPref': 'ভাড়াটের পছন্দ',
    'filter.amenities': 'সুবিধাসমূহ',
    'filter.reset': 'রিসেট',
    'filter.all': 'সব',

    // Reel Discovery Extensions
    'reels.whyVideo': 'কেন ভিডিও ট্যুর?',
    'reels.tourFromPhone': 'ফোনেই দেখুন কলকাতার ফ্ল্যাট।',
    'reels.zeroSurprise': 'কোনো অপ্রত্যাশিত ঝক্কি নেই।',
    'reels.whyDesc': 'ছবিতে অনেক সময় ওয়াইড অ্যাঙ্গেল ব্যবহার করা হয়। আমাদের ভিডিও ওয়াকথ্রু আসল অবস্থা, আলো-বাতাস ও ঘরের মাপ স্পষ্ট তুলে ধরে।',
    'reels.realFootage': '১০০% আসল ভিডিও',
    'reels.realFootageDesc': 'বর্তমানে খালি থাকা ফ্ল্যাটের নির্ভরযোগ্য বাস্তব ভিডিও।',
    'reels.saveTime': '১০+ ঘণ্টা সময় বাঁচান',
    'reels.saveTimeDesc': 'ঘরে বসেই ফ্ল্যাট শর্টলিস্ট করুন এবং কেবল পছন্দের গুলো দেখতে যান।',
    'reels.instantInquiry': 'দ্রুত ইনকোয়ারি',
    'reels.instantInquiryDesc': 'সঠিক ভাড়ায় সরাসরি ভেরিফায়েড ব্রোকারের সাথে যোগাযোগ।',
    'reels.conciergeBadge': 'কলকাতা রেন্টাল কনসিয়ার্জ',
    'reels.customTourTitle': 'নির্দিষ্ট ফ্ল্যাটের ভিডিও ট্যুর প্রয়োজন?',
    'reels.customTourDesc': 'নিউ টাউন, সল্টলেক বা সেক্টর ৫-এর বিশেষ কোনো সোসাইটি দেখতে চান? আমাদের জানান!',
    'reels.whatsappTeam': 'ফ্ল্যাটজি টিমের সাথে হোয়াটসঅ্যাপ',
    'reels.browseAll': 'কলকাতার সব ফ্ল্যাট দেখুন',

    // Broker Profile
    'brokerProfile.back': 'সব ব্রোকারের তালিকায় ফিরুন',
    'brokerProfile.availableNow': 'এখনই যোগাযোগ করা যাবে',
    'brokerProfile.specialist': 'ভেরিফায়েড লোকাল স্পেশালিস্ট',
    'brokerProfile.chatWhatsApp': 'হোয়াটসঅ্যাপে চ্যাট করুন',
    'brokerProfile.callBroker': 'ফোন করুন',
    'brokerProfile.quickStats': 'এক নজরে তথ্য',
    'brokerProfile.managedInventory': 'উপলব্ধ ফ্ল্যাট',
    'brokerProfile.avgClosing': 'গড় সময়',
    'brokerProfile.operatingSince': 'অভিজ্ঞতা',
    'brokerProfile.verifiedBadge': 'পরিচয় ও ট্রেড ভেরিফায়েড',
    'brokerProfile.about': 'ব্রোকার সম্পর্কে',
    'brokerProfile.exclusiveFlats': 'সক্রিয় ও এক্সক্লুসিভ ফ্ল্যাট',
    'brokerProfile.unlockAll': 'সব উপলব্ধ ফ্ল্যাট আনলক করুন',
    'brokerProfile.unlockDesc': 'সম্পূর্ণ ক্যাটালগ দেখতে সরাসরি ব্রোকারের সাথে হোয়াটসঅ্যাপে যুক্ত হন।',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('flatzy_lang');
      return (stored === 'bn' || stored === 'en') ? stored : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('flatzy_lang', language);
    } catch {}

    // Apply font family attribute or class if Bengali
    if (language === 'bn') {
      document.documentElement.lang = 'bn';
      document.body.classList.add('font-bengali');
    } else {
      document.documentElement.lang = 'en';
      document.body.classList.remove('font-bengali');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
