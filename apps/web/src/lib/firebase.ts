// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD21k2lh1f-HnQDNbJLauDiy1mDwNWH1",
  authDomain: "aria-hr-platform.firebaseapp.com",
  projectId: "aria-hr-platform",
  storageBucket: "aria-hr-platform.appspot.com",
  messagingSenderId: "11646483214",
  appId: "1:1164648313214:web:1f-d65c831c533f7218d42f",
  measurementId: "G-3P1N2Y4VHX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);