// ===================================================
// TRAVORA — Generic LocalStorage Service
// All localStorage access should go through these functions
// ===================================================

const PREFIX = 'travora_';

export const storage = {
  /** Get a single item by key */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  /** Get all items from a collection (stored as an array) */
  getAll<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  },

  /** Set a single item */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch { /* quota exceeded */ }
  },

  /** Create (push) a new item into a collection array */
  create<T extends { id: string }>(collectionKey: string, item: T): T {
    const items = this.getAll<T>(collectionKey);
    items.push(item);
    this.set(collectionKey, items);
    return item;
  },

  /** Update an existing item in a collection by id */
  update<T extends { id: string }>(collectionKey: string, id: string, updates: Partial<T>): T | null {
    const items = this.getAll<T>(collectionKey);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    this.set(collectionKey, items);
    return items[idx];
  },

  /** Remove an item from a collection by id */
  remove<T extends { id: string }>(collectionKey: string, id: string): boolean {
    const items = this.getAll<T>(collectionKey);
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    this.set(collectionKey, filtered);
    return true;
  },

  /** Find one item in a collection by predicate */
  findOne<T>(collectionKey: string, predicate: (item: T) => boolean): T | null {
    return this.getAll<T>(collectionKey).find(predicate) ?? null;
  },

  /** Find many items in a collection by predicate */
  findMany<T>(collectionKey: string, predicate: (item: T) => boolean): T[] {
    return this.getAll<T>(collectionKey).filter(predicate);
  },

  /** Clear a specific collection */
  clear(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PREFIX + key);
  },

  /** Clear all Travora data */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },

  /** Generate a unique ID */
  genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
};
