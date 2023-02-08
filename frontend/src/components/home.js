import './table.css'
import React,{useState,useEffect} from 'react';

async function DelCourse(course_data) {
  return fetch('http://localhost:8080/home/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course_data)
  })
    .then(function(data){
      console.log("data is " + data);
      return data;
    }
    )
}
export function Home() {

  const [data, setData] = useState([]);
  const [response_val,setResponse] = useState([]);

  const DeleteCourse = async (id,course_id,sec_id) => {
    console.log(id);
    console.log(course_id);
    console.log(sec_id);
    let course_data = {id:id,course_id:course_id,sec_id:sec_id};
    console.log(course_data);
    const data = await DelCourse({course_data});
    console.log(data);
    window.location.reload(false);
    //console.log(ID);
    //console.log(course_id);
    //console.log(sec_id);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8080/home/');
      const json = await response.json();
      console.log("This is the json data ")
      console.log(json);
      console.log(response);
      setData(json);
      setResponse(response);
    }

    fetchData();
  }, []);
  /*
    window.location.replace("/home/");
  }
  else{
    window.location.replace("/login/");
  }
  */
  if(response_val && response_val.status == "200"){
    if(data && data.stud_info && data.curr_sem_info && data.prev_sem_info){
      return (
        
        //<h1>home of user</h1>
        <div>
          <a href="/course/running">Running Courses</a>
          <a href="/home/registration">Register for courses</a>
          <a href="/logout">Logout</a>
          <h2 class="header">Student Information</h2>
          <div className="Table1">
            <table>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>dept_name</th>
                <th>tot_cred</th>
              </tr>
              {(data.stud_info).map((val, key) => {
                  return (
                  <tr key={key}>
                    <td>{val.id}</td>
                    <td>{val.name}</td>
                    <td>{val.dept_name}</td>
                    <td>{val.tot_cred}</td>
                  </tr>
                  )
              })}

            </table>
          </div>
          <h2 class="header">Current Semester</h2>
          <div className="Table2">
            <table>
              <tr>
                <th>course_id</th>
                <th>sec_id</th>
                <th>title</th>
                <th>credits</th>
                <th>grade</th>
                <th>Drop</th>
              </tr>
              {(data.curr_sem_info).map((val, key) => {
                return(
                  <tr key={key}>
                    <td>{val.course_id}</td>
                    <td>{val.sec_id}</td>
                    <td>{val.title}</td>
                    <td>{val.credits}</td>
                    <td>{val.grade}</td>
                    <td><button onClick={() => DeleteCourse(data.stud_info[0].id,val.course_id,val.sec_id)}>Drop</button></td>
                  </tr>
                )
              })}
            </table>
          </div>
          <h2 class="header">Previous Semesters</h2>
          <div className="Table3">
            <table>
              <tr>
                <th>course_id</th>
                <th>sec_id</th>
                <th>title</th>
                <th>credits</th>
                <th>grade</th>
              </tr>
              {(data.prev_sem_info).map((val, key) => {
                return(
                  <tr key={key}>
                    <td>{val.course_id}</td>
                    <td>{val.sec_id}</td>
                    <td>{val.title}</td>
                    <td>{val.credits}</td>
                    <td>{val.grade}</td>
                  </tr>
                )
              })}
            </table>
          </div>
        </div>
      
      )
    }
    else{
      return (<h1>Loading...</h1>)
    }
  }
  else if(response_val && response_val.status == "401"){
    window.location.replace("/login/");
  }
  else{
    return (<h1>Loading...</h1>)
  }
}