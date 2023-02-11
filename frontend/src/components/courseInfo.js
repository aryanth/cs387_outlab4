import './table.css'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';

export function CourseInfo(){
    const [data, setData] = useState([]);
    let {course_id} = useParams();

    useEffect(() => {
        async function fetchData(course_id) {
          console.log(course_id);
          
          const response = await fetch(`http://localhost:8080/course/${course_id}`);
          

          const json = await response.json();
          console.log("This is the json data for the particular course");
          console.log(json);
          /*
          if(!json){
            console.log("not logged in");
            window.location.replace("/login/");
          }
          */
          setData(json);
        }
    
        fetchData(course_id);
    }, []);

    if(data && data.course_data && data.prereq_data && data.instr_data){
      return(

        <div>
          <div class = "cd-button">
          <a class = "link" href="/home"><h3>Home</h3></a> 
          <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
          <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
          <a class = "link" href="/logout"><h3>Logout</h3></a>
          </div> 
          <h2 class="header">Course Information</h2>
          <div className="cd-table">
            
              
              {(data.course_data).map((val, key) => {
                  return (
                  <div>
                    <h2>Course Id   :  {val.course_id}</h2>
                    <h2>Title        :  {val.title}</h2>
                    <h2>Credits     :  {val.credits}</h2>
                    <h2>Dept_name  : {val.dept_name}   </h2>
                    {val.building && (<h2>Building    :  {val.building}</h2>)}
                    {val.room_number && <h2>Room Number : {val.room_number}</h2>}
                  </div>
                  )
              })}

            
          </div>
          <h2 class="header">Prerequisite courses</h2>
          {(data.prereq_data.length === 0)?<h3>None</h3>:
          <div className="cd-table">
            <table>
              <tr>
                <th>prereq_id</th>
                <th>title</th>
              </tr>
              {(data.prereq_data).map((val, key) => {
                return(
                  <tr key={key}>
                    <td><a href={"/course/" + val.prereq_id}>{val.prereq_id}</a></td>
                    <td>{val.title}</td>
                  </tr>
                )
              })}
            </table>
          </div>
          }
          <h2 class="header">Current Instructors</h2>
          {(data.prereq_data.length === 0)?<h3>None</h3>:
          <div className="cd-table">
            <table>
              <tr>
                <th>id</th>
              </tr>
              {(data.instr_data).map((val, key) => {
                return(
                  <tr key={key}>
                    <td><a href={"/instructor/" + val.id}>{val.id}</a></td>
                  </tr>
                )
              })}
            </table>
          </div>}
      </div>

      )
    }
    else{
    return (<h2>Loading..</h2>);
    }
}