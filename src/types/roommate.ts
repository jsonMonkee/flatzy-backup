export type Gender = 'Male' | 'Female' | 'Any';
export type Profession = 'Working Professional' | 'Student';
export type FlatPreference = '1 BHK' | '2 BHK' | '3 BHK' | 'Any';
export type FoodPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Doesn\'t Matter';

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  avatarId: string; // Identifier for cute SVG/illustration avatar
  profession: Profession;
  occupationTitle: string; // e.g. "Software Engineer @ Cognizant", "Student @ Techno India"
  religion?: string; // e.g. "Hindu", "Muslim", "Christian", "Jain", "Open to All"
  lookingForBhk: FlatPreference;
  listingType?: 'Team-Up' | 'Room in Flat'; // 'Team-Up' to rent new flat together OR 'Room in Flat' (room in already rented flat)
  budgetPerMonth: number; // e.g. 7500
  preferredLocations: string[]; // e.g. ["New Town", "Sector V", "Salt Lake"]
  moveInDate: string; // e.g. "Immediate", "Next Month", "Within 15 Days"
  lifestyleHabits: {
    diet: FoodPreference;
    smoking: 'Non-Smoker' | 'Smoker' | 'Social Smoker';
    drinking: 'Non-Drinker' | 'Occasional' | 'Doesn\'t Matter';
    pets: 'Pet Friendly' | 'No Pets';
    sleepSchedule: 'Early Bird' | 'Night Owl' | 'Flexible';
  };
  aboutMe: string;
  contactWhatsApp: string; // Phone number for direct WhatsApp reach-out
  createdAt: string;
  isRealTenantPost?: boolean;
  budgetRaw?: string; // Original budget text from Supabase e.g. "₹8,000 – ₹9,000" or "Under ₹12,000"
  furnishingPref?: string; // e.g. "Semi Furnished", "Furnished", "Unfurnished"
}
