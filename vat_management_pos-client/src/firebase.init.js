// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAvx0DpEZDCi4xRj7FniD1inzeksvTMZBo",
//   authDomain: "hasibreactjs.firebaseapp.com",
//   projectId: "hasibreactjs",
//   storageBucket: "hasibreactjs.firebasestorage.app",
//   messagingSenderId: "736288921560",
//   appId: "1:736288921560:web:38bc5e8e40b1165d0984ad",
// };


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOdwUB83quL-T3gLWmshmM7-FUG4hONiA",
  authDomain: "reacthasib.firebaseapp.com",
  projectId: "reacthasib",
  storageBucket: "reacthasib.firebasestorage.app",
  messagingSenderId: "62525725315",
  appId: "1:62525725315:web:0752ba32eaa4ee56ffd9b6",
  measurementId: "G-3EVK9SPHLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;
