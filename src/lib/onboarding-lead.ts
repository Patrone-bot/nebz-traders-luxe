const LEAD_STORAGE_KEY = "nebz_lead";

export type OnboardingLead = {
  fullName: string;
  phone: string;
  email: string;
};

export function readOnboardingLead(): OnboardingLead | null {
  try {
    const raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<OnboardingLead>;
    if (!parsed.fullName?.trim() || !parsed.phone?.trim() || !parsed.email?.trim()) {
      return null;
    }

    return {
      fullName: parsed.fullName.trim(),
      phone: parsed.phone.trim(),
      email: parsed.email.trim(),
    };
  } catch {
    return null;
  }
}

export function clearOnboardingLead() {
  try {
    sessionStorage.removeItem(LEAD_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
}
