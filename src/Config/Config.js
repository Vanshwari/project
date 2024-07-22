// Import required classes from Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Z6_cNABBqCBpFhbiwsnigByJIfrhT-E",
  authDomain: "myecom-c2047.firebaseapp.com",
  projectId: "myecom-c2047",
  storageBucket: "myecom-c2047.appspot.com",
  messagingSenderId: "921863736089",
  appId: "1:921863736089:web:c3a8594dcfb45fdf589388"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
