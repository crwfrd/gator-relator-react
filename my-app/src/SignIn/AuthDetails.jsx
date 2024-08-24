import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase.js";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

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

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        <>
          <p className="auth-status">{`Signed in as ${authUser.email}`}</p>
          <button className="auth-button" onClick={userSignOut} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Sign Out</button>
        </>
      ) : (
        <p className="auth-status">Currently signed out</p>
      )}
    </div>
  );
};

export default AuthDetails;