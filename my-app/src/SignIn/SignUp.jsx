import { createUserWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth, db, storage } from "../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {ref, getBytes, uploadBytes, getDownloadURL} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [error, setError] = useState(null);

  const createBlankProfilePic = async (uid) =>{
    console.log("entered");
    const blankRef = ref(storage, 'images/blank-profile.jpg');

    try {
      const buffer = await getBytes(blankRef);
      const newImageRef = ref(storage, `images/${uid}`);

      await uploadBytes(newImageRef, buffer);
      console.log('Image copied successfully!');
    } catch (error) {
      console.error('Error copying image:', error);
    }
  }

  const mouseEnter = (e) => {
    e.target.style.opacity = ".8";
  }

  const mouseLeave = (e) => {
    e.target.style.opacity = "1";
  }

  const mouseDown = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 54, 155), rgb(54, 110, 212))";
  }

  const mouseUp = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 89, 255), rgb(110, 159, 250))";
  }

  const signInWithGoogle = () => {

    let signUpButton = document.getElementById("sign-up-google-button");
    signUpButton.classList.add('button-loading');
    let spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    signUpButton.appendChild(spinner);

    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then(async (docSnap) => {
        
        await createBlankProfilePic(user.uid);
        const photoRef = ref(storage, `images/${user.uid}`);
        const url = await getDownloadURL(photoRef);
        
        if (!docSnap.exists()) {
          setDoc(userDocRef, {
          email: user.email,
          firstName: "",
          lastName: "",
          gradMonth: null,
          major: "",
          studentOrgs: [],
          companies: [],
          photoURL: url
          });
          
          signUpButton.classList.remove('button-loading');
          signUpButton.removeChild(spinner);

          navigate("UserInfo", {state: {uid: user.uid}});
          console.log("User added to the database");
        }
        else {
          signUpButton.classList.remove('button-loading');
          signUpButton.removeChild(spinner);

          navigate("Homepage", {state: {uid: user.uid}});
        }

      })
      .catch((error) => {
        signUpButton.classList.remove('button-loading');
        signUpButton.removeChild(spinner);

        setError(error.message);
        console.log(error);
      });
    })
    .catch((error) => {
      signUpButton.classList.remove('button-loading');
      signUpButton.removeChild(spinner);

      setError(error.message);
      console.log(error);
    });

  };

  const signUp = (e) => {
    e.preventDefault();

    let signUpButton = document.getElementById("sign-up-base-button");
    signUpButton.classList.add('button-loading');
    let spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    signUpButton.appendChild(spinner);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {

        await createBlankProfilePic(cred.user.uid);
        const photoRef = ref(storage, `images/${cred.user.uid}`);
        const url = await getDownloadURL(photoRef);

        const userDocRef = doc(db, "users", cred.user.uid)
        setDoc(userDocRef, { 
          email: email, 
          firstName: "",
          lastName: "",
          gradMonth: null,
          gradYear: null,
          major: "",
          studentOrgs: [],
          companies: [],
          photoURL: url
        });

        signUpButton.classList.remove('button-loading');
        signUpButton.removeChild(spinner);

        console.log("User added to the database");
        navigate("UserInfo", {state: {uid: cred.user.uid}});
      })
      .catch((error) => {
        signUpButton.classList.remove('button-loading');
        signUpButton.removeChild(spinner);

        setError(error.message);
        console.log(error);
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={signUp}>
        <p className="sign-up-lead-p">Create an account</p>
        <p className="sign-up-sub-p">Email address</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <p className="sign-up-sub-p">Password</p>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div id="sign-up-button-container">
          <button id="sign-up-base-button" type="submit" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Sign Up</button>
          <button id="sign-up-google-button" type="button" onClick={signInWithGoogle} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Sign Up With Google</button>
        </div>
        {error && <div className="error-popup">{error.slice(10)}</div>}
      </form>
    </div>
  );
};

export default SignUp;