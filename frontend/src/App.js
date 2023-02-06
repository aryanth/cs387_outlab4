import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {LoginForm} from './components/loginForm';
import {Home} from './components/home';

function App() {
  return(
    <Router>
      <Routes>
      <Route path='/login' element={<LoginForm/>} />
      <Route path='/home' element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
