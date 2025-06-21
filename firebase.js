// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTmRhj1_aq_TS36433kmOOK5nwsSHbOpI",
    authDomain: "sipelmasd-81a2e.firebaseapp.com",
    projectId: "sipelmasd-81a2e",
    storageBucket: "sipelmasd-81a2e.firebasestorage.app",
    messagingSenderId: "275077884977",
    appId: "1:275077884977:web:e55816ea410efa0127b910",
    measurementId: "G-ZRNB64JTWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);