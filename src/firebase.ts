import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigRaw from '../firebase-applet-config.json';

// Handle potential default export wrapping in some environments
const firebaseConfig = (firebaseConfigRaw as any).default || firebaseConfigRaw;

const app = initializeApp(firebaseConfig);
console.log('Firebase initialized with config:', firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
console.log('Firestore instance (db):', db);
