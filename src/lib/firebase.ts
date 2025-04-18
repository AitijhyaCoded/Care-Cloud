
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATVNcwTCWhm6KEzDZ9Zf8m4EyFjvMYTwo",
  authDomain: "care-cloud-48873.firebaseapp.com",
  projectId: "care-cloud-48873",
  storageBucket: "care-cloud-48873.firebasestorage.app",
  messagingSenderId: "42127021404",
  appId: "1:42127021404:web:35fb4aff2332529bf85d99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export default app;
