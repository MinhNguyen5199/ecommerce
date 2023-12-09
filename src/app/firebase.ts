// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'dotenv/config'
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import firebaseui from "firebaseui";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
// export const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

let app:any
if (!firebase.apps.length) {
app = firebase.initializeApp(firebaseConfig);

}
//auth = firebase.auth();
export { app}


