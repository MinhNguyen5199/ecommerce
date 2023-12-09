import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';

const auth = firebase.auth();
export const ui = new firebaseui.auth.AuthUI(auth);

export const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    {
      
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        defaultCountry: 'US', // Change to your desired default country
        recaptchaParameters: {
          size: 'normal', // or 'normal' for reCAPTCHA display
        },
    }
  ],
  }
  
