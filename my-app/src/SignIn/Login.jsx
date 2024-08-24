import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("Homepage", {state: {uid: userCredential.user.uid}});
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

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

  return (
    <div className="log-in-container">
      <form id='login-form' onSubmit={signIn}>
        <h1 id="login-welcome">Welcome to GatorRelator</h1>
        <p className="login-lead-p">Please enter your details to sign in</p>
        <div id='login-input-container'>
          <p className="login-sub-p">Email address</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <p className="login-sub-p">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button type="submit" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Log In</button>
        </div>
      </form>
      {error && <div className="error-popup">{"Incorrect password or email. Please try again."}</div>} 
    </div>
  );
};

export default SignIn;