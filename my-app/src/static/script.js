
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, googleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyCgBuW--X3blIGUGngK3QHG-0he0838jP8",
    authDomain: "fir-test-f01db.firebaseapp.com",
    projectId: "fir-test-f01db",
    storageBucket: "fir-test-f01db.appspot.com",
    messagingSenderId: "19803494665",
    appId: "1:19803494665:web:900b6b2ca6dcf6bf389bd8",
    measurementId: "G-4E9GVZRZ4D" };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en'
const provider = new googleAuthProvider();

// add an ID for the google login button
const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function() {
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = "logged.html";

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

    });
})

// add as
// <script src="main.js" defer type="module"></script>

