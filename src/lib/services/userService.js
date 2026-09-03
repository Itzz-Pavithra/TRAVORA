// ===================================================
// TRAVORA — User Service (JavaScript)
// ===================================================
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/client.js';

export const userService = {
  async getUserById(userId) {
    if (!db || !userId) return null;
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data() : null;
  },

  async updateUser(userId, updates) {
    if (!db || !userId) return null;
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  },

  async setTravelPreference(userId, pref) {
    await this.updateUser(userId, { travelPreference: pref });
  },

  getInitials(name) {
    if (!name) return 'TR';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
};
