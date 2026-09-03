// ===================================================
// TRAVORA — Memory Service (JavaScript)
// ===================================================
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, storage } from '$lib/firebase/client.js';

export const memoryService = {
  async getAll(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/memories`));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  },

  subscribeToMemories(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/memories`), (snapshot) => {
      const memories = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      callback(memories);
    });
  },

  async uploadMemory(
    file,
    tripId,
    userId,
    userName,
    avatarColor,
    meta
  ) {
    if (!db || !storage) throw new Error('Firebase client not initialized');

    const fileExt = file.name.split('.').pop() || 'jpg';
    const mediaKey = `trips/${tripId}/memories/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`;
    const fileRef = storageRef(storage, mediaKey);

    const uploadTask = await uploadBytesResumable(fileRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    const memRef = doc(collection(db, `trips/${tripId}/memories`));
    const memory = {
      id: memRef.id,
      tripId,
      uploadedBy: userId,
      uploadedByName: userName,
      avatarColor: avatarColor || '#173F35',
      date: meta.date,
      location: meta.location,
      caption: meta.caption,
      dayNumber: meta.dayNumber,
      mediaType: file.type.startsWith('video') ? 'video' : 'image',
      mediaKey: downloadURL,
      likes: [],
      createdAt: new Date().toISOString()
    };

    await setDoc(memRef, memory);
    return memory;
  },

  async delete(tripId, memory) {
    if (!db) return;
    try {
      if (memory.mediaKey && memory.mediaKey.startsWith('gs://')) {
        const fileRef = storageRef(storage, memory.mediaKey);
        await deleteObject(fileRef);
      }
    } catch {
      // Storage cleanup optional
    }
    await deleteDoc(doc(db, `trips/${tripId}/memories`, memory.id));
  },

  async toggleLike(tripId, memoryId, userId) {
    if (!db) return;
    const memRef = doc(db, `trips/${tripId}/memories`, memoryId);
    const snap = await getDoc(memRef);
    if (!snap.exists()) return;

    const memory = snap.data();
    const likes = memory.likes?.includes(userId)
      ? memory.likes.filter(id => id !== userId)
      : [...(memory.likes || []), userId];

    await updateDoc(memRef, { likes });
  }
};
