import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA5Rb79P9-zXsBzprCq7QsfDu4sKFYPZIg',
  authDomain: 'task-management-25abd.firebaseapp.com',
  projectId: 'task-management-25abd',
  storageBucket: 'task-management-25abd.appspot.com',
  messagingSenderId: '215362160221',
  appId: '1:215362160221:web:dbbbc5f19fb353b5c1efb4',
  measurementId: 'G-8JC98ZJLZ7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ Export auth for authentication
export default app;
