// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgBuW--X3blIGUGngK3QHG-0he0838jP8",
  authDomain: "fir-test-f01db.firebaseapp.com",
  projectId: "fir-test-f01db",
  storageBucket: "fir-test-f01db.appspot.com",
  messagingSenderId: "19803494665",
  appId: "1:19803494665:web:900b6b2ca6dcf6bf389bd8",
  measurementId: "G-4E9GVZRZ4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
// Initialize Firebase Authentication and get a reference to the service
export { auth, db, storage };  