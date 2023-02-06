import './table.css'
import React,{useState,useEffect} from 'react';
export function Home() {

  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8080/home/');
      const json = await response.json();
      console.log("This is the json data ")
      console.log(json);
      if(!json.session_details){
        console.log("not logged in");
        window.location.replace("/login/");
      }
      setData(json);
    }

    fetchData();
  }, []);


  if(data && data.stud_details && data.current_sem && data.session_details){
  return (
    
    //<h1>home of user</h1>
    <div>
      <h2 class="header">Student Information</h2>
      <div className="Table1">
        <table>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>dept_name</th>
            <th>tot_cred</th>
          </tr>
          {(data.stud_details).map((val, key) => {
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
          </tr>
          {(data.current_sem).map((val, key) => {
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
          {(data.prev_sem).map((val, key) => {
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
  
  );
  }
  else{
    return (<h1>Loading...</h1>);
  }
}