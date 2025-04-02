// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDgY-K48-DKLyvKnxUgun_8kEvamfI4BEo",
  authDomain: "number-guess-game-2dff3.firebaseapp.com",
  databaseURL: "https://number-guess-game-2dff3-default-rtdb.firebaseio.com",
  projectId: "number-guess-game-2dff3",
  storageBucket: "number-guess-game-2dff3.firebasestorage.app",
  messagingSenderId: "208738439993",
  appId: "1:208738439993:web:c04f8aac92d3562c7ccee8",
  measurementId: "G-9GY1ZRB5LS"

};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
