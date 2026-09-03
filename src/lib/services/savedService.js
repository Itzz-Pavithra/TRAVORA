// ===================================================
// TRAVORA — Saved Places Service (JavaScript)
// ===================================================
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase/client.js';

export const savedService = {
  async getByUser(userId) {
    if (!db || !userId) return [];
    const q = query(collection(db, 'savedPlaces'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  subscribeSaved(userId, callback) {
    if (!db || !userId) { callback([]); return () => {}; }
    const q = query(collection(db, 'savedPlaces'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const places = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(places);
    });
  },

  async toggleSaved(place) {
    if (!db || !place.userId || !place.placeId) return false;
    const q = query(
      collection(db, 'savedPlaces'),
      where('userId', '==', place.userId),
      where('placeId', '==', place.placeId)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref);
      return false;
    } else {
      const ref = doc(collection(db, 'savedPlaces'));
      const newSaved = {
        id: ref.id,
        userId: place.userId,
        placeId: place.placeId,
        name: place.name,
        location: place.location,
        image: place.image,
        type: place.type,
        savedAt: new Date().toISOString()
      };
      await setDoc(ref, newSaved);
      return true;
    }
  }
};
