import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDL9oOIxaJ6XqAjvvY80N_16aHCX6AORMU",
  authDomain: "my-react-slack-clone-1376c.firebaseapp.com",
  databaseURL: "https://my-react-slack-clone-1376c.firebaseio.com",
  projectId: "my-react-slack-clone-1376c",
  storageBucket: "my-react-slack-clone-1376c.appspot.com",
  messagingSenderId: "361528575684",
  appId: "1:361528575684:web:33d12a75553f961fdcab91",
  measurementId: "G-JMTSTV6D8R"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
