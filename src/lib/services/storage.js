// ===================================================
// TRAVORA — Storage Utility (JavaScript)
// ===================================================
const PREFIX = 'travora_';

export const storage = {
  clearLegacyData() {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  },

  get(key) {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Ignore
    }
  },

  genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
};
