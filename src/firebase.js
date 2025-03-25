import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC1lJYE5RDzLdJRnzn5Sp-mFDHZPHB4Mg",
  authDomain: "wedding-ceremony-5fcd0.firebaseapp.com",
  projectId: "wedding-ceremony-5fcd0",
  storageBucket: "wedding-ceremony-5fcd0.firebasestorage.app",
  messagingSenderId: "757926458058",
  appId: "1:757926458058:web:c54b3b5fc02a65f56bba33",
  measurementId: "G-47QCRS362Y"
};

// 初始化 Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export { db, firebase };