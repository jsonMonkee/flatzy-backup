/**
 * Flatzy Kolkata Contact & Social Configuration
 */

// User's official Flatzy WhatsApp contact number (international format with 91 prefix)
export const FLATZY_WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || '918910376054'
).replace(/\D/g, '');

export const FLATZY_DISPLAY_PHONE = '+91 89103 76054';

export const FLATZY_PHONE_TEL = '+918910376054';

export const FLATZY_INSTAGRAM_HANDLE = 'flatzy.in';
export const FLATZY_INSTAGRAM_URL = 'https://instagram.com/flatzy.in';

export const FLATZY_EMAIL = 'flatzykolkata@gmail.com';

/**
 * Builds a valid WhatsApp click-to-chat URL with encoded text.
 */
export function getWhatsAppUrl(messageText: string = 'Hi Flatzy! I am looking for a flat in Kolkata.'): string {
  return `https://wa.me/${FLATZY_WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
}
