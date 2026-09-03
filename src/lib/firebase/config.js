// ===================================================
// TRAVORA — Firebase Configuration (JavaScript)
// ===================================================
import { env } from '$env/dynamic/public';

const defaultConfig = {
  apiKey: "AIzaSyArLfUWEVA0JF811JinPxLDD6PAjHFSDVg",
  authDomain: "project-75f1056b-3854-4b1c-ac1.firebaseapp.com",
  projectId: "project-75f1056b-3854-4b1c-ac1",
  storageBucket: "project-75f1056b-3854-4b1c-ac1.firebasestorage.app",
  messagingSenderId: "621832931744",
  appId: "1:621832931744:web:99fcd217d2cc489c743cc5",
  measurementId: "G-H4NDXK1KSB"
};

export const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: env.PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};
