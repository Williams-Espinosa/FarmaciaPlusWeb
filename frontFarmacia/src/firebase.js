import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase del usuario
const firebaseConfig = {
  apiKey: "AIzaSyD2mEfJqTV_2n9y0k8E50fCD_9JygtHI84",
  authDomain: "superfarmacia-9f959.firebaseapp.com",
  projectId: "superfarmacia-9f959",
  storageBucket: "superfarmacia-9f959.firebasestorage.app",
  messagingSenderId: "706261693244",
  appId: "1:706261693244:web:fcbeced2ecfc6b7f82e439",
  measurementId: "G-BDZE1KJKBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
