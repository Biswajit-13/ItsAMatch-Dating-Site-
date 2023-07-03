import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "AIzaSyDDRCGNLdkXZfq9CKHpAW4F3ZG3fjSBl1Y",
  authDomain: "socialapp2023-cb153.firebaseapp.com",
  projectId: "socialapp2023-cb153",
  storageBucket: "socialapp2023-cb153.appspot.com",
  messagingSenderId: "637263752951",
  appId: "1:637263752951:web:f54d668c6829e24e4a6df2",
  measurementId: "G-ZQ2SZFDKE8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

