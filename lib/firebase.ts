// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKy0IUXuYoZOxdCUzuDmPzjh8g1KbfRRg",
  authDomain: "memestore-123.firebaseapp.com",
  projectId: "memestore-123",
  storageBucket: "memestore-123.appspot.com",
  messagingSenderId: "2461824216",
  appId: "1:2461824216:web:3e1bc9ad6ec253aadc93ad",
  measurementId: "G-E0GF4H7K3S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)