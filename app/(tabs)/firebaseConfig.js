// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import only the services you need
import { getFirestore } from "firebase/firestore";       // Database
import { getAuth } from "firebase/auth";                 // Authentication
import { getStorage } from "firebase/storage";           // File storage
import { getDatabase } from "firebase/database";         // Realtime Database


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpV_Teo1-yvISrWbeyaGYYKLWEY3IdiL4",
  authDomain: "playground-f8692.firebaseapp.com",
  databaseURL: "https://playground-f8692-default-rtdb.firebaseio.com",
  projectId: "playground-f8692",
  storageBucket: "playground-f8692.firebasestorage.app",
  messagingSenderId: "637355649307",
  appId: "1:637355649307:web:87b17670ccf35f2d8c0bbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const realtimeDB = getDatabase(app);

export { db, auth, storage, realtimeDB };