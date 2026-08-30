// ===================================================
// TRAVORA — Memory Service (IndexedDB for media blobs)
// ===================================================
import { storage } from './storage';
import type { Memory } from '$lib/types';

const MEMORIES_KEY = 'memories';
const DB_NAME = 'travora_media';
const DB_VERSION = 1;
const STORE_NAME = 'blobs';

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

// Store blob
async function storeBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get blob
export async function getBlob(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        if (req.result?.blob) {
          resolve(URL.createObjectURL(req.result.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

// Delete blob
async function deleteBlob(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
  });
}

export const memoryService = {
  getAll(tripId?: string): Memory[] {
    const all = storage.getAll<Memory>(MEMORIES_KEY);
    if (tripId) return all.filter(m => m.tripId === tripId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async uploadMemory(
    file: File,
    tripId: string,
    userId: string,
    userName: string,
    avatarColor: string,
    meta: { date: string; location?: string; caption?: string; dayNumber?: number }
  ): Promise<Memory> {
    const key = storage.genId();
    await storeBlob(key, file);

    const memory: Memory = {
      id: storage.genId(),
      tripId,
      uploadedBy: userId,
      uploadedByName: userName,
      avatarColor,
      date: meta.date,
      location: meta.location,
      caption: meta.caption,
      dayNumber: meta.dayNumber,
      mediaType: file.type.startsWith('video') ? 'video' : 'image',
      mediaKey: key,
      likes: [],
      createdAt: new Date().toISOString()
    };

    return storage.create(MEMORIES_KEY, memory);
  },

  async delete(memory: Memory): Promise<void> {
    await deleteBlob(memory.mediaKey);
    storage.remove<Memory>(MEMORIES_KEY, memory.id);
  },

  toggleLike(memoryId: string, userId: string): Memory | null {
    const memory = storage.findOne<Memory>(MEMORIES_KEY, m => m.id === memoryId);
    if (!memory) return null;
    const likes = memory.likes.includes(userId)
      ? memory.likes.filter(id => id !== userId)
      : [...memory.likes, userId];
    return storage.update<Memory>(MEMORIES_KEY, memoryId, { likes });
  }
};
