/**
 * Owner Authentication and Self-Setup Service
 * FRANKBLAISE ELECTRIC FUEL PUMP PLUS — TECHNICAL ENGINEERING EDITION
 * 
 * Allows the business owner (your client) to initialize their administrative
 * account directly from their browser using their personal business email and a secret PIN.
 */

export interface OwnerProfile {
  email: string;
  pin: string;
  whatsappNumber: string;
  isSetupComplete: boolean;
  setupAt: string;
}

export interface OwnerSession {
  email: string;
  authenticatedAt: string;
}

const OWNER_PROFILE_KEY = 'frankblaise_store_owner_profile';
const OWNER_SESSION_KEY = 'frankblaise_store_owner_session';

/**
 * Get the registered owner profile (returns null if client hasn't completed first-time setup)
 */
export function getOwnerProfile(): OwnerProfile | null {
  try {
    const raw = localStorage.getItem(OWNER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && parsed.pin) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read owner profile:', err);
  }
  return null;
}

/**
 * Register owner credentials on first-time setup
 */
export function setupOwnerProfile(
  email: string,
  pin: string,
  whatsappNumber: string
): OwnerProfile {
  const profile: OwnerProfile = {
    email: email.trim().toLowerCase(),
    pin: pin.trim(),
    whatsappNumber: whatsappNumber.trim() || '+234 706 540 0645',
    isSetupComplete: true,
    setupAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(profile));
    setOwnerSession(profile.email);
  } catch (err) {
    console.error('Failed to save owner profile:', err);
  }

  return profile;
}

/**
 * Verify owner login credentials
 */
export function verifyOwnerLogin(
  email: string,
  pin: string
): { success: boolean; error?: string } {
  const profile = getOwnerProfile();
  if (!profile) {
    return {
      success: false,
      error: 'Store owner has not been initialized yet. Please complete first-time setup.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPin = pin.trim();

  if (profile.email !== cleanEmail) {
    return {
      success: false,
      error: 'Unrecognized owner email. Please check your spelling.',
    };
  }

  if (profile.pin !== cleanPin) {
    return {
      success: false,
      error: 'Incorrect security PIN. Please re-enter your access code.',
    };
  }

  setOwnerSession(profile.email);
  return { success: true };
}

/**
 * Update owner credentials from within the dashboard
 */
export function updateOwnerCredentials(
  newEmail: string,
  newPin: string,
  newWhatsapp: string
): OwnerProfile {
  const current = getOwnerProfile();
  const updated: OwnerProfile = {
    email: newEmail.trim().toLowerCase(),
    pin: newPin.trim(),
    whatsappNumber: newWhatsapp.trim() || (current?.whatsappNumber ?? '+234 706 540 0645'),
    isSetupComplete: true,
    setupAt: current?.setupAt || new Date().toISOString(),
  };

  localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(updated));
  setOwnerSession(updated.email);
  return updated;
}

/**
 * Session management (Active while browser tab is open)
 */
export function getOwnerSession(): OwnerSession | null {
  try {
    const raw = sessionStorage.getItem(OWNER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function setOwnerSession(email: string): void {
  try {
    sessionStorage.setItem(
      OWNER_SESSION_KEY,
      JSON.stringify({
        email: email.trim().toLowerCase(),
        authenticatedAt: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.error('Failed to set owner session:', err);
  }
}

export function clearOwnerSession(): void {
  sessionStorage.removeItem(OWNER_SESSION_KEY);
}

/**
 * Reset owner profile to allow re-claiming (e.g. if client requests factory reset)
 */
export function resetOwnerProfile(): void {
  localStorage.removeItem(OWNER_PROFILE_KEY);
  sessionStorage.removeItem(OWNER_SESSION_KEY);
}
