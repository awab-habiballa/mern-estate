// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b9cc2.firebaseapp.com",
  projectId: "mern-estate-b9cc2",
  storageBucket: "mern-estate-b9cc2.appspot.com",
  messagingSenderId: "709441364057",
  appId: "1:709441364057:web:c86d6fe70371175cbcd148",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
