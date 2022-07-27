// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0ZkaEIOy4Ew_Ht5dW69V2y_eFUh1NLIc",
  authDomain: "whatsapp-clone-a6028.firebaseapp.com",
  projectId: "whatsapp-clone-a6028",
  storageBucket: "whatsapp-clone-a6028.appspot.com",
  messagingSenderId: "679064863096",
  appId: "1:679064863096:web:e908ccfe81a92a948f488d",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { database, auth, provider };
