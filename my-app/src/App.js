import React from 'react';
import Homepage from "./Homepage/Homepage.js"
import Search from './Search/Search.js';
import UserInfo from './UserInfo/UserInfo.js';
import SignIn from './SignIn/SignIn.js';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return(
    <>
      <Router>
        <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/UserInfo" element={<UserInfo />} />
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;