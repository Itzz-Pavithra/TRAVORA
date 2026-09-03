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
import { currentUser } from '$lib/stores/index.js';

const avatarColors = ['#173F35', '#D97745', '#66736F', '#1f5448', '#c4632e'];

export const authService = {
  /** Sign up with email, password, and name */
  async signUp(name, email, password) {
    if (!auth || !db) throw new Error('Firebase Auth or Firestore is not initialized');
    
    let fbUser = null;

    // 1. Create or recover authenticated user in Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      fbUser = userCredential.user;
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          fbUser = userCredential.user;
        } catch {
          throw new Error('An account with this email already exists. Please log in.');
        }
      } else {
        throw authErr;
      }
    }

    // 2. Update display name in Auth
    try {
      await updateProfile(fbUser, { displayName: name });
    } catch {
      // Non-critical if display name update fails
    }

    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const userData = {
      id: fbUser.uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
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

    // 3. Write user profile document to Firestore users/{uid}
    try {
      await setDoc(doc(db, 'users', fbUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Error writing user profile to Firestore:', err);
      if (err.code === 'permission-denied') {
        throw new Error('Firestore permission error: Could not create user profile document (users/' + fbUser.uid + '). Please publish the updated firestore.rules in Firebase Console.');
      }
      throw err;
    }

    // 4. Update store only after Firestore write succeeds
    currentUser.set(userData);
    return userData;
  },

  /** Sign in with email and password */
  async signIn(email, password) {
    if (!auth || !db) throw new Error('Firebase Auth or Firestore is not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      if (userDoc.exists()) {
        userData = userDoc.data();
      }
    } catch (err) {
      console.warn('Error reading user profile doc on sign in:', err);
    }

    if (!userData) {
      userData = {
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
      try {
        await setDoc(doc(db, 'users', fbUser.uid), userData, { merge: true });
      } catch {
        // Ignore
      }
    }

    currentUser.set(userData);
    return userData;
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
          // If Firestore profile document does not exist yet, do not assume logged in
          callback(null);
        }
      } catch (err) {
        console.warn('listenToAuth listener check:', err);
        callback(null);
      }
    });
  }
};
