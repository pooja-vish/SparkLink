// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2VvrPJWWjUTYR2B8ehsQT8mxmGnGhHbA",
  authDomain: "sparklink-f261c.firebaseapp.com",
  projectId: "sparklink-f261c",
  storageBucket: "sparklink-f261c.appspot.com",
  messagingSenderId: "625563137423",
  appId: "1:625563137423:web:de80f5ecde432ba1de87fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);