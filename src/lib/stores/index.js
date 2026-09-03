// ===================================================
// TRAVORA — Svelte Stores (JavaScript)
// ===================================================
import { writable, derived } from 'svelte/store';
import { authService } from '$lib/services/authService.js';
import { tripService } from '$lib/services/tripService.js';
import { savedService } from '$lib/services/savedService.js';

function createUserStore() {
  // Initial state is undefined (loading auth state)
  const { subscribe, set } = writable(undefined);
  let unsubscribeAuth = null;

  return {
    subscribe,
    set,
    init() {
      if (typeof window !== 'undefined' && !unsubscribeAuth) {
        unsubscribeAuth = authService.listenToAuth((user) => {
          set(user);
          if (user) {
            trips.load(user.id);
            savedPlaces.load(user.id);
          } else {
            trips.set([]);
            savedPlaces.set([]);
          }
        });
      }
    },
    async logout() {
      await authService.signOut();
      set(null);
      trips.set([]);
      savedPlaces.set([]);
    }
  };
}

export const currentUser = createUserStore();

function createTripsStore() {
  const { subscribe, set, update } = writable([]);
  let unsubscribeTrips = null;

  return {
    subscribe,
    set,
    update,
    load(userId) {
      if (unsubscribeTrips) unsubscribeTrips();
      unsubscribeTrips = tripService.subscribeToTrips(userId, (tripsList) => {
        set(tripsList);
      });
    },
    addTrip(trip) {
      update(tList => [trip, ...tList]);
    }
  };
}

export const trips = createTripsStore();

export const currentTrip = writable(null);
export const currentTripTab = writable('overview');

function createSavedPlacesStore() {
  const { subscribe, set, update } = writable([]);
  let unsubscribeSaved = null;

  return {
    subscribe,
    set,
    update,
    load(userId) {
      if (unsubscribeSaved) unsubscribeSaved();
      unsubscribeSaved = savedService.subscribeSaved(userId, (places) => {
        set(places);
      });
    },
    async toggle(place) {
      await savedService.toggleSaved(place);
    }
  };
}

export const savedPlaces = createSavedPlacesStore();

function createNotificationStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    show(message, type = 'success') {
      const id = Math.random().toString(36).slice(2);
      update(n => [...n, { id, message, type }]);
      setTimeout(() => {
        update(n => n.filter(notif => notif.id !== id));
      }, 3500);
    },
    dismiss(id) {
      update(n => n.filter(notif => notif.id !== id));
    }
  };
}

export const notifications = createNotificationStore();

export const upcomingTrips = derived(trips, $trips =>
  $trips.filter(t => t.status === 'upcoming' || t.status === 'active')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
);

export const pastTrips = derived(trips, $trips =>
  $trips.filter(t => t.status === 'past')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
);
