// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB,
  projectId: "number-guess-game-2dff3",
  storageBucket: "number-guess-game-2dff3.appspot.com",
  messagingSenderId: "208738439993",
  appId: "1:208738439993:web:c04f8aac92d3562c7ccee8",
  measurementId: "G-9GY1ZRB5LS"

};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
