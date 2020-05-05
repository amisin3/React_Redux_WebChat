import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "", // Your Api key
  authDomain: "", // Your Auth Domain
  databaseUrl: "", // Your Database Url
  projectId: "", // Your project id
  storageBucket: "", // Your storage bucket
  messagingSenderId: "", // Your sender id
  appId: "", // Your app id
  measurementId: "", // Your measurement id
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
