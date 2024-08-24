import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import AuthDetails from './AuthDetails';
import "./SignIn.css";

function SignIn() {
  return (
    <div id='sign-in-container'>
      <div id='sign-in-box'>
          <Login />
          <div id='divider'>or</div>
          <SignUp />
          <AuthDetails />
      </div>
    </div>
  );
}

export default SignIn;
