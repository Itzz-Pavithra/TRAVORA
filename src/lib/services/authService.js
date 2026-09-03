// ===================================================
// TRAVORA — Firebase Auth Service (JavaScript)
// ===================================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '$lib/firebase/client.js';

const avatarColors = ['#173F35', '#D97745', '#66736F', '#1f5448', '#c4632e'];

export const authService = {
  /** Sign up with email, password, and name */
  async signUp(name, email, password) {
    if (!auth || !db) throw new Error('Firebase is not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    await updateProfile(fbUser, { displayName: name });

    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const userData = {
      id: fbUser.uid,
      name,
      email,
      avatarColor,
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

    await setDoc(doc(db, 'users', fbUser.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return userData;
  },

  /** Sign in with email and password */
  async signIn(email, password) {
    if (!auth || !db) throw new Error('Firebase is not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }

    const userData = {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      avatarColor: avatarColors[0],
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
    await setDoc(doc(db, 'users', fbUser.uid), userData, { merge: true });
    return userData;
  },

  /** Sign in using Demo account */
  async signInDemo() {
    const demoEmail = 'pavithra@travora.app';
    const demoPass = 'travora123';
    try {
      return await this.signIn(demoEmail, demoPass);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        return await this.signUp('Pavithra', demoEmail, demoPass);
      }
      throw err;
    }
  },

  /** Sign out */
  async signOut() {
    if (!auth) return;
    await firebaseSignOut(auth);
  },

  /** Password reset email */
  async resetPassword(email) {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  },

  /** Listen to authentication state changes */
  listenToAuth(callback) {
    if (!auth || !db) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data());
        } else {
          const newUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Traveler',
            email: fbUser.email || '',
            avatarColor: avatarColors[0],
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
          await setDoc(doc(db, 'users', fbUser.uid), newUser, { merge: true });
          callback(newUser);
        }
      } catch {
        callback(null);
      }
    });
  }
};
