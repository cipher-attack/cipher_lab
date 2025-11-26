import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaTjkazXo3yfCacBndeE8wQ6Vy_uDmusA",
  authDomain: "cipher-ecommerce.firebaseapp.com",
  projectId: "cipher-ecommerce",
  storageBucket: "cipher-ecommerce.firebasestorage.app",
  messagingSenderId: "118227591844",
  appId: "1:118227591844:web:3d83b8f75f9051eb973c31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const twitterProvider = new TwitterAuthProvider();