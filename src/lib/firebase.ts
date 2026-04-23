import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// 🔐 Your config (keep as is)
const firebaseConfig = {
  apiKey: "AIzaSyDf-N0-tW_cagazm0jr6j3mWhXb2bqrTgA",
  authDomain: "minute-eaa91.firebaseapp.com",
  projectId: "minute-eaa91",
  storageBucket: "minute-eaa91.firebasestorage.app",
  messagingSenderId: "430008883222",
  appId: "1:430008883222:web:da810769d9716ab03a7d37",
  measurementId: "G-D8BVLZ6JH7"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// ✅ Auth (IMPORTANT)
export const auth = getAuth(app);

// ✅ Providers
export const googleProvider = new GoogleAuthProvider();

// ✅ Analytics (safe for SSR / Vercel)
let analytics: any = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { analytics };