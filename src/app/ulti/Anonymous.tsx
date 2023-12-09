import { getAuth, signInAnonymously } from "firebase/auth";
import {createAdmin} from '../action'

export function Anonymous() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      createAdmin();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle errors here
    });
}