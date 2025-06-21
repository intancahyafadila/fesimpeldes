import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Konfigurasi Firebase (hard-coded)
const firebaseConfig = {
  apiKey: "AIzaSyCTmRhj1_aq_TS36433kmOOK5nwsSHbOpI",
  authDomain: "sipelmasd-81a2e.firebaseapp.com",
  projectId: "sipelmasd-81a2e",
  storageBucket: "sipelmasd-81a2e.appspot.com",
  messagingSenderId: "275077884977",
  appId: "1:275077884977:web:e55816ea410efa0127b910",
  measurementId: "G-ZRNB64JTWW",
}

// Selalu dianggap telah dikonfigurasi
export const isFirebaseConfigured = true

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth & Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app 