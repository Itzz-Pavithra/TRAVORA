// ===================================================
// TRAVORA — User Service
// ===================================================
import { storage } from './storage';
import type { User } from '$lib/types';

const USER_KEY = 'current_user';
const USERS_KEY = 'users';

export const userService = {
  getCurrentUser(): User | null {
    return storage.get<User>(USER_KEY);
  },

  setCurrentUser(user: User): void {
    storage.set(USER_KEY, user);
    // Also upsert in users collection
    const existing = storage.findOne<User>(USERS_KEY, u => u.id === user.id);
    if (existing) {
      storage.update<User>(USERS_KEY, user.id, user);
    } else {
      storage.create<User>(USERS_KEY, user);
    }
  },

  updateCurrentUser(updates: Partial<User>): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.setCurrentUser(updated);
    return updated;
  },

  register(name: string, email: string, password: string): User {
    const avatarColors = ['#173F35', '#D97745', '#66736F', '#1f5448', '#c4632e'];
    const user: User = {
      id: storage.genId(),
      name,
      email,
      password,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      travelPreference: null,
      currency: 'INR',
      language: 'en',
      tripsCount: 0,
      placesCount: 0,
      memoriesCount: 0,
      savedPlacesCount: 0,
      joinedAt: new Date().toISOString(),
      profileVisibility: 'public',
      memoryVisibility: 'friends'
    };
    this.setCurrentUser(user);
    return user;
  },

  login(email: string, password: string): User | null {
    const user = storage.findOne<User>(USERS_KEY, u => u.email === email && u.password === password);
    if (user) {
      storage.set(USER_KEY, user);
    }
    return user;
  },

  logout(): void {
    storage.clear(USER_KEY);
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  },

  setTravelPreference(pref: 'solo' | 'group'): void {
    this.updateCurrentUser({ travelPreference: pref });
  },

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
};
