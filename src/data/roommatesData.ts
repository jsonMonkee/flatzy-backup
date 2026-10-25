import type { RoommateProfile } from '../types/roommate';

export const INITIAL_ROOMMATES: RoommateProfile[] = [
  {
    id: 'roommate-1',
    name: 'Ananya S.',
    age: 23,
    gender: 'Female',
    avatarId: 'avatar-cat-ear',
    profession: 'Working Professional',
    occupationTitle: 'UI/UX Designer @ Cognizant',
    religion: 'Hindu',
    lookingForBhk: '2 BHK',
    listingType: 'Room in Flat',
    budgetPerMonth: 8500,
    preferredLocations: ['Salt Lake', 'Sector V', 'New Town AA-1'],
    moveInDate: 'Immediate',
    lifestyleHabits: {
      diet: 'Vegetarian',
      smoking: 'Non-Smoker',
      drinking: 'Non-Drinker',
      pets: 'Pet Friendly',
      sleepSchedule: 'Flexible',
    },
    aboutMe: 'Have an occupied master bedroom in a fully furnished 2BHK flat. Looking for a neat female flatmate for the second private bedroom.',
    contactWhatsApp: '918777000001',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'roommate-2',
    name: 'Subham Mukherjee',
    age: 25,
    gender: 'Male',
    avatarId: 'avatar-tech-bro',
    profession: 'Working Professional',
    occupationTitle: 'Fullstack Dev @ Cognizant Ecospace',
    religion: 'Hindu',
    lookingForBhk: '3 BHK',
    listingType: 'Team-Up',
    budgetPerMonth: 9500,
    preferredLocations: ['New Town', 'Shapoorji', 'Rajarhat'],
    moveInDate: '1 Nov',
    lifestyleHabits: {
      diet: 'Vegetarian',
      smoking: 'Non-Smoker',
      drinking: 'Occasional',
      pets: 'Pet Friendly',
      sleepSchedule: 'Night Owl',
    },
    aboutMe: 'Chill software engineer, loves good food on weekends. Looking to team up with 1-2 guys for a spacious 3BHK in New Town near Ecospace.',
    contactWhatsApp: '918777000002',
    createdAt: '2026-10-19T14:30:00Z',
  },
  {
    id: 'roommate-3',
    name: 'Pooja Sharma',
    age: 24,
    gender: 'Female',
    avatarId: 'avatar-artist',
    profession: 'Working Professional',
    occupationTitle: 'Product Analyst @ TCS Gitanjali Park',
    religion: 'Hindu',
    lookingForBhk: '2 BHK',
    listingType: 'Team-Up',
    budgetPerMonth: 8000,
    preferredLocations: ['New Town Action Area II', 'Chinar Park'],
    moveInDate: '15 Nov',
    lifestyleHabits: {
      diet: 'Vegetarian',
      smoking: 'Non-Smoker',
      drinking: 'Non-Drinker',
      pets: 'Pet Friendly',
      sleepSchedule: 'Early Bird',
    },
    aboutMe: 'Looking to team up with another working girl to take a comfortable 2BHK in New Town near TCS. Non-smoker and vegetarian preferred.',
    contactWhatsApp: '918777000003',
    createdAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'roommate-4',
    name: 'Rahul Roy',
    age: 26,
    gender: 'Male',
    avatarId: 'avatar-chill-guy',
    profession: 'Working Professional',
    occupationTitle: 'Data Analyst @ Wipro',
    religion: 'Hindu',
    lookingForBhk: '2 BHK',
    listingType: 'Room in Flat',
    budgetPerMonth: 9000,
    preferredLocations: ['Salt Lake Sector V', 'Kestopur'],
    moveInDate: 'Immediate',
    lifestyleHabits: {
      diet: 'Vegetarian',
      smoking: 'Non-Smoker',
      drinking: 'Occasional',
      pets: 'Pet Friendly',
      sleepSchedule: 'Flexible',
    },
    aboutMe: 'Currently staying in a 2BHK near Sector V. Flatmate moving out end of month. Need 1 chill male roommate for the private second room.',
    contactWhatsApp: '918777000004',
    createdAt: '2026-10-21T09:30:00Z',
  }
];

const STORAGE_KEY = 'flatzy_roommate_profiles_v9';

export const getRoommateProfiles = (): RoommateProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored roommates:', err);
  }
  return INITIAL_ROOMMATES;
};

export const saveRoommateProfile = (profile: RoommateProfile): void => {
  try {
    const current = getRoommateProfiles();
    const updated = [profile, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving roommate:', err);
  }
};
