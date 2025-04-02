// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDpOE0_1bfKhpw7NtvF0ZKWDqI3wi4MGCs',
  authDomain: 'retrieverv2dev.firebaseapp.com',
  projectId: 'retrieverv2dev',
  storageBucket: 'retrieverv2dev.appspot.com',
  messagingSenderId: '302943273332',
  appId: '1:302943273332:web:551bf26339620d5d94ac21',
  measurementId: 'G-4B0K032TLF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
