import { signOut } from 'firebase/auth/cordova';
import { auth } from "../providers/AuthProvider";
import { deleteCookie } from '../action';
export const handleSignOut = async () => {
  try {
    await signOut(auth);
    deleteCookie();
  } catch (error) {
    console.error('Sign-out error:', error);
  }
};