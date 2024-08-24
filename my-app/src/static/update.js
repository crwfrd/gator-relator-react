import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, googleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgBuW--X3blIGUGngK3QHG-0he0838jP8",
    authDomain: "fir-test-f01db.firebaseapp.com",
    projectId: "fir-test-f01db",
    storageBucket: "fir-test-f01db.appspot.com",
    messagingSenderId: "19803494665",
    appId: "1:19803494665:web:900b6b2ca6dcf6bf389bd8",
    measurementId: "G-4E9GVZRZ4D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new googleAuthProvider();

const user = auth.currentUser;

function updateUserProfile(user) {
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;
    console.log(userEmail)

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserProfile(user);
        const uid = user.uid;
        return uid;

    } else {
        alert("Create Account & Login");
        window.location.href = '/register.html';
    }
});