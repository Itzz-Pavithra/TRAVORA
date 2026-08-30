// ===================================================
// TRAVORA — Svelte Stores
// ===================================================
import { writable, derived, get } from 'svelte/store';
import type { User, Trip, Notification, SavedPlace } from '$lib/types';
import { userService } from '$lib/services/userService';
import { tripService } from '$lib/services/tripService';
import { storage } from '$lib/services/storage';

// --- Current User ---
function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    set,
    update,
    init() {
      if (typeof window !== 'undefined') {
        set(userService.getCurrentUser());
      }
    },
    logout() {
      userService.logout();
      set(null);
    },
    refresh() {
      set(userService.getCurrentUser());
    }
  };
}

export const currentUser = createUserStore();

// --- Trips ---
function createTripsStore() {
  const { subscribe, set, update } = writable<Trip[]>([]);

  return {
    subscribe,
    set,
    update,
    load(userId: string) {
      set(tripService.getByUser(userId));
    },
    refresh(userId: string) {
      set(tripService.getByUser(userId));
    },
    addTrip(trip: Trip) {
      update(trips => [trip, ...trips]);
    }
  };
}

export const trips = createTripsStore();

// --- Current Trip ---
export const currentTrip = writable<Trip | null>(null);

// --- Current Trip Tab ---
export const currentTripTab = writable<string>('overview');

// --- Saved Places ---
function createSavedPlacesStore() {
  const { subscribe, set, update } = writable<SavedPlace[]>([]);

  return {
    subscribe,
    set,
    update,
    load(userId: string) {
      set(storage.findMany<SavedPlace>('saved_places', sp => sp.userId === userId));
    },
    toggle(place: SavedPlace) {
      const existing = storage.findOne<SavedPlace>('saved_places', sp => sp.placeId === place.placeId && sp.userId === place.userId);
      if (existing) {
        storage.remove<SavedPlace>('saved_places', existing.id);
        update(places => places.filter(p => p.id !== existing.id));
      } else {
        const newPlace = storage.create('saved_places', { ...place, id: storage.genId() });
        update(places => [...places, newPlace]);
      }
    },
    isSaved(placeId: string, userId: string): boolean {
      return !!storage.findOne<SavedPlace>('saved_places', sp => sp.placeId === placeId && sp.userId === userId);
    }
  };
}

export const savedPlaces = createSavedPlacesStore();

// --- Notifications / Toasts ---
function createNotificationStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,
    show(message: string, type: 'success' | 'error' | 'info' = 'success') {
      const id = Math.random().toString(36).slice(2);
      update(n => [...n, { id, message, type }]);
      setTimeout(() => {
        update(n => n.filter(notif => notif.id !== id));
      }, 3500);
    },
    dismiss(id: string) {
      update(n => n.filter(notif => notif.id !== id));
    }
  };
}

export const notifications = createNotificationStore();

// --- Derived: upcoming / past trips ---
export const upcomingTrips = derived(trips, $trips =>
  $trips.filter(t => t.status === 'upcoming' || t.status === 'active')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
);

export const pastTrips = derived(trips, $trips =>
  $trips.filter(t => t.status === 'past')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
);
