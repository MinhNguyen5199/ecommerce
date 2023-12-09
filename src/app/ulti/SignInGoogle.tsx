import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import { app } from "../firebase";



export const auth = getAuth(app);
export async function handleSignInWithGoogle(){
  let user;
  

  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  try {
    await signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        user = result.user;

        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
  return user;
};
