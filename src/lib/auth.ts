import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signOut
} from "firebase/auth";

// 🔥 Google Login
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// 🔥 Logout
export const logout = async () => {
  await signOut(auth);
};