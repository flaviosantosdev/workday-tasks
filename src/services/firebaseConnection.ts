// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQLEr0wxjd0qfvORoW6poECwN-Vg-Q6K4",
  authDomain: "workday-1092b.firebaseapp.com",
  projectId: "workday-1092b",
  storageBucket: "workday-1092b.appspot.com",
  messagingSenderId: "621477770720",
  appId: "1:621477770720:web:8d1f11dd46665f24c02785",
  measurementId: "G-80H9YN643Y"
};

// Initialize Firebase

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase