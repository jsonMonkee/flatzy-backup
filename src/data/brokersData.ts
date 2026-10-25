export interface BrokerReview {
  id: string;
  author: string;
  role: string; // e.g. "Software Engineer at TCS"
  rating: number;
  date: string;
  comment: string;
  flatRented: string; // e.g. "2 BHK in Action Area 1"
}

export interface Broker {
  id: string;
  name: string;
  agencyName: string;
  avatar: string;
  rating: number;
  dealsCount: number;
  yearsExperience: number;
  phone: string;
  whatsapp: string;
  primaryLocation: string;
  operatingAreas: string[];
  specialization: string[];
  about: string;
  activeListingsCount: number;
  isVerified: boolean;
  reviews: BrokerReview[];
}

export const BROKERS_DATA: Broker[] = [
  {
    id: 'broker-sagnik',
    name: 'Sagnik',
    agencyName: 'Verified Broker',
    avatar: '/sagnik-card.jpg',
    rating: 4.9,
    dealsCount: 135,
    yearsExperience: 6,
    phone: '+91 89103 76054',
    whatsapp: '918910376054',
    primaryLocation: 'Kolkata',
    operatingAreas: [
      'Shapoorji Sukhobrishti',
      'New Town (Action Area 1, 2, 3)',
      'Kestopur (VIP Road)',
      'Sector V & Salt Lake'
    ],
    specialization: [
      'Shapoorji & New Town High-Rises',
      'IT Professionals & Family Leases',
      'Direct Owner & Video Tours'
    ],
    about: 'Verified on-ground Flatzy advisor across Shapoorji, New Town, and Sector V. Direct owner connects, zero spam, and swift move-in support.',
    activeListingsCount: 18,
    isVerified: true,
    reviews: [
      {
        id: 'rev-sagnik-1',
        author: 'Sayan Deb',
        role: 'Tech Lead @ Cognizant',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Sagnik found us a pristine 2 BHK in Shapoorji Sukhobrishti near Action Area 3 in just 24 hours. No endless back-and-forth or false promises. Very clean documentation!',
        flatRented: '2 BHK, Shapoorji Sukhobrishti'
      },
      {
        id: 'rev-sagnik-2',
        author: 'Ananya Sen',
        role: 'Consultant @ PwC',
        rating: 5,
        date: '1 month ago',
        comment: 'Sagnik coordinated directly with the owner for a low security deposit in New Town AA-2. The flat was exactly as shown in the video tours. Highly recommended for corporate employees.',
        flatRented: '3 BHK High-Rise, New Town AA-2'
      },
      {
        id: 'rev-sagnik-3',
        author: 'Kunal Ray',
        role: 'Data Scientist @ EY',
        rating: 4.9,
        date: '2 months ago',
        comment: 'Very polite, prompt on WhatsApp, and knows every society across Shapoorji, New Town, and Kestopur inside-out.',
        flatRented: '2 BHK, Kestopur VIP Road'
      }
    ]
  }
];
