import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {LoginForm} from './components/loginForm';
import {Home} from './components/home';
import {RunningDepartment} from './components/runningDepartment';
import {RunningCourses} from './components/runningCourses';
import {CourseInfo} from './components/courseInfo';
import {InstructorInfo} from './components/instructorInfo';
import {Logout} from './components/logout';
import {Registration} from './components/registration';

function App() {
  return(
    <div>
    
    <Router>
      <Routes>
      <Route path='/login/' element={<LoginForm/>} />
      <Route path='/home/' element={<Home/>} />
      <Route path='/course/running/' element={<RunningDepartment/>}/>
      <Route path='/course/running/:dept_name/' element={<RunningCourses/>}/>
      <Route path='/course/:course_id/' element={<CourseInfo/>}/>
      <Route path='/instructor/:instructor_id/' element={<InstructorInfo/>}/>
      <Route path='/logout/' element={<Logout/>}/>
      <Route path='/home/registration/' element={<Registration/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
