import type { RoommateProfile } from '../types/roommate';
import { INITIAL_ROOMMATES, getRoommateProfiles, saveRoommateProfile as saveToLocalRoommates } from '../data/roommatesData';
import { SUPABASE_URL, SUPABASE_ANON_KEY, submitLeadToGoogleSheet } from './leadService';

/**
 * Maps Supabase snake_case row to frontend RoommateProfile
 */
function mapRowToRoommateProfile(row: any): RoommateProfile {
  return {
    id: row.id || `roommate-${Date.now()}`,
    name: row.name || 'Anonymous',
    age: Number(row.age) || 24,
    gender: row.gender === 'Male' ? 'Male' : 'Female',
    avatarId: row.avatar_id || 'avatar-cat-ear',
    profession: row.profession || 'Working Professional',
    occupationTitle: row.occupation_title || '',
    religion: row.religion || 'Open to All',
    lookingForBhk: row.looking_for_bhk || '1 BHK',
    listingType: row.listing_type || (row.about_me?.toLowerCase().includes('team up') ? 'Team-Up' : 'Room in Flat'),
    budgetPerMonth: Number(row.budget_per_month) || 9000,
    preferredLocations: Array.isArray(row.preferred_locations) ? row.preferred_locations : ['Kolkata'],
    moveInDate: row.move_in_date || 'Immediate',
    lifestyleHabits: typeof row.lifestyle_habits === 'object' && row.lifestyle_habits !== null
      ? row.lifestyle_habits
      : {
          diet: 'Non-Vegetarian',
          smoking: 'Non-Smoker',
          drinking: 'Occasional',
          pets: 'Pet Friendly',
          sleepSchedule: 'Flexible',
        },
    aboutMe: row.about_me || '',
    contactWhatsApp: row.contact_whatsapp || '',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Maps Supabase 'inquiries' row (real tenant leads) to frontend RoommateProfile
 */
function mapInquiryToRoommateProfile(row: any): RoommateProfile {
  // Extract budget number
  let budgetNum = 12000;
  if (row.budget) {
    const digits = row.budget.replace(/[^0-9]/g, '');
    if (digits) {
      // If range like "80009000", take first 4-5 digits
      const parsed = parseInt(digits, 10);
      budgetNum = parsed > 99999 ? parseInt(digits.substring(0, 5), 10) : parsed;
    }
  }

  // Parse BHK
  let bhk: any = '1 BHK';
  const bhkRaw = (row.bhk || row.property || '').toUpperCase();
  if (bhkRaw.includes('2')) bhk = '2 BHK';
  else if (bhkRaw.includes('3')) bhk = '3 BHK';
  else if (bhkRaw.includes('1')) bhk = '1 BHK';

  // Random friendly avatar for lead
  const avatarList = [
    'avatar-cat-ear', 'avatar-cap', 'avatar-spectacles', 'avatar-chill',
    'avatar-curly', 'avatar-ponytail', 'avatar-bun', 'avatar-bob', 'avatar-smart'
  ];
  const avatarId = avatarList[Math.abs(row.id?.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) || 0) % avatarList.length];

  // Infer tenant type
  const isFamily = (row.tenant_type || '').toLowerCase().includes('family');

  // Company or profession title (keep clean, do not mix with furnishing)
  let cleanOccupation = '';
  if (row.occupation_title) {
    cleanOccupation = row.occupation_title;
  } else if (row.company) {
    cleanOccupation = row.company;
  } else {
    cleanOccupation = isFamily ? 'Family Renter' : 'Working Professional';
  }

  // Furnishing status
  const furnishingStatus = row.furnishing?.trim() || '';

  return {
    id: row.id || `lead-${Date.now()}`,
    name: row.name || 'Tenant',
    age: 25,
    gender: (row.name?.toLowerCase().endsWith('a') || row.name?.toLowerCase().endsWith('i')) ? 'Female' : 'Male',
    avatarId,
    profession: isFamily ? 'Working Professional' : 'Working Professional',
    occupationTitle: cleanOccupation,
    religion: 'Open to All',
    lookingForBhk: bhk,
    listingType: 'Room in Flat',
    budgetPerMonth: budgetNum,
    preferredLocations: row.location ? [row.location] : ['New Town, Kolkata'],
    moveInDate: row.shifting_date || 'Immediate',
    lifestyleHabits: {
      diet: 'Vegetarian',
      smoking: 'Non-Smoker',
      drinking: 'Non-Drinker',
      pets: 'Pet Friendly',
      sleepSchedule: 'Flexible',
    },
    aboutMe: `Requirement: ${row.bhk || row.property || 'Flat'} in ${row.location || 'Kolkata'}. Budget: ${row.budget || 'Flexible'}. Move-in: ${row.shifting_date || 'Immediate'}.`,
    contactWhatsApp: row.phone || '',
    createdAt: row.created_at || new Date().toISOString(),
    isRealTenantPost: true,
    budgetRaw: row.budget?.trim() || '',
    furnishingPref: furnishingStatus,
  };
}

/**
 * Fetch all roommate profiles and real tenant postings from Supabase.
 * Gracefully falls back to local storage and seed data if Supabase table is not yet created or offline.
 */
export async function getRoommates(): Promise<RoommateProfile[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return getRoommateProfiles();
    }

    // Fetch both from roommates table (if created) and inquiries table (actual portal tenant leads)
    const [roommatesRes, inquiriesRes] = await Promise.allSettled([
      fetch(`${SUPABASE_URL}/rest/v1/roommates?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }),
      fetch(`${SUPABASE_URL}/rest/v1/inquiries?select=*&order=created_at.desc&limit=50`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }),
    ]);

    const fetchedProfiles: RoommateProfile[] = [];

    // Parse roommates table
    if (roommatesRes.status === 'fulfilled' && roommatesRes.value.ok) {
      const data = await roommatesRes.value.json();
      if (Array.isArray(data)) {
        fetchedProfiles.push(...data.map(mapRowToRoommateProfile));
      }
    }

    // Parse real tenant leads from inquiries table
    if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.ok) {
      const inquiriesData = await inquiriesRes.value.json();
      if (Array.isArray(inquiriesData) && inquiriesData.length > 0) {
        // Exclude broker-self postings or empty test leads
        const realTenantLeads = inquiriesData
          .filter(inq => inq.name && inq.name !== 'Anonymous Lead' && !(inq.tenant_type || '').includes('Broker'))
          .map(mapInquiryToRoommateProfile);
        fetchedProfiles.push(...realTenantLeads);
      }
    }

    if (fetchedProfiles.length > 0) {
      // Combine initial verified profiles, custom user additions, and fetched profiles
      const localList = getRoommateProfiles();
      const existingIds = new Set(fetchedProfiles.map(p => p.id));
      const initialToInclude = INITIAL_ROOMMATES.filter(init => !existingIds.has(init.id));
      const customLocalOnly = localList.filter(p => !existingIds.has(p.id) && !INITIAL_ROOMMATES.some(init => init.id === p.id));

      return [...fetchedProfiles, ...customLocalOnly, ...initialToInclude];
    }
  } catch (error) {
    console.warn('[RoommateService] Failed to fetch from Supabase, using local fallback:', error);
  }

  return getRoommateProfiles();
}

/**
 * Save new roommate profile to Supabase and Google Sheet, and sync with local storage.
 */
export async function saveRoommateProfile(profile: RoommateProfile): Promise<{ success: boolean; error?: string }> {
  // 1. Always save to LocalStorage immediately so user experiences zero delay
  saveToLocalRoommates(profile);

  // 2. Also submit to Google Sheets for instant admin notifications
  try {
    submitLeadToGoogleSheet({
      fullName: profile.name,
      phone: profile.contactWhatsApp,
      role: 'Renter',
      source: 'Flatmate Finder Post',
      lookingForBhk: profile.lookingForBhk,
      budget: `₹${profile.budgetPerMonth}/mo`,
      location: profile.preferredLocations.join(', '),
      shiftingDate: profile.moveInDate,
      tenantCategory: `${profile.profession} | ${profile.occupationTitle}`,
      brokerNote: `Lifestyle: Diet=${profile.lifestyleHabits.diet}, Smoke=${profile.lifestyleHabits.smoking}, Drink=${profile.lifestyleHabits.drinking}, Pets=${profile.lifestyleHabits.pets}, Sleep=${profile.lifestyleHabits.sleepSchedule} | Bio: ${profile.aboutMe}`,
    }).catch(e => console.warn('[RoommateService] Google Sheet sync warning:', e));
  } catch (e) {
    console.warn('[RoommateService] Google Sheet call error:', e);
  }

  // 3. Post to Supabase 'roommates' table
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { success: true };
  }

  try {
    const payload = {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      avatar_id: profile.avatarId,
      profession: profile.profession,
      occupation_title: profile.occupationTitle,
      religion: profile.religion,
      looking_for_bhk: profile.lookingForBhk,
      budget_per_month: profile.budgetPerMonth,
      preferred_locations: profile.preferredLocations,
      move_in_date: profile.moveInDate,
      lifestyle_habits: profile.lifestyleHabits,
      about_me: profile.aboutMe,
      contact_whatsapp: profile.contactWhatsApp,
      created_at: profile.createdAt || new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/roommates`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[RoommateService] Supabase roommates insert warning:', errText);
    }

    // 4. Also push into Supabase 'inquiries' table so the admin portal sees the Flatzy Board requirement directly
    try {
      const inquiryPayload = {
        id: `board_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: profile.name,
        phone: profile.contactWhatsApp,
        bhk: profile.lookingForBhk,
        property: profile.listingType === 'Room in Flat' ? 'Room in Flat (Flatzymate)' : 'Team-Up Flat (Flatzymate)',
        location: profile.preferredLocations.join(', '),
        furnishing: 'Any',
        budget: `₹${profile.budgetPerMonth.toLocaleString('en-IN')}/mo`,
        shifting_date: profile.moveInDate,
        tenant_type: `${profile.profession} (${profile.occupationTitle})`,
        source: 'Flatzy Board (Flatzymate)',
        status: 'new',
        created_at: new Date().toISOString()
      };

      await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(inquiryPayload),
      });
    } catch (inqErr) {
      console.warn('[RoommateService] Dual-push to inquiries warning:', inqErr);
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[RoommateService] Supabase network error:', err);
    return { success: true, error: err?.message };
  }
}
