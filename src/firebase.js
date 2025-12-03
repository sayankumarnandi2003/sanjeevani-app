import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBTLXBDH9EIuJm8O2V9gZOHMyKxxqHhlfk",
    authDomain: "sanjeevani-app-d5775.firebaseapp.com",
    projectId: "sanjeevani-app-d5775",
    storageBucket: "sanjeevani-app-d5775.firebasestorage.app",
    messagingSenderId: "1024133330486",
    appId: "1:1024133330486:web:16c6a554777994f0f30a97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
