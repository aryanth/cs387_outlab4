import './table.css';
// /import'../home.css';
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
      return data;
    }
    )
}
export function Home() {

  const [data, setData] = useState([]);
  const [response_val,setResponse] = useState([]);

  const DeleteCourse = async (id,course_id,sec_id) => {
    let course_data = {id:id,course_id:course_id,sec_id:sec_id};
    const data = await DelCourse({course_data});
    window.location.reload(false);
    
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8080/home/');
      const json = await response.json();
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
        <body>
            <div>
              <div class = "cd-button">
                <a class = "link" href="/home"><h3>Home</h3></a>   
                <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
                <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
                <a class = "link" href="/logout"><h3>Logout</h3></a>
              </div> 
              <div class="cd-table-container">
                <h2 class='title'>Student Information</h2>
              
                  {(data.stud_info).map((val, key) => {
                      return (
                      <div>
                        <h3>Student ID: {val.id}</h3>
                        <h3>Name: {val.name}</h3>
                        <h3>Department Name: {val.dept_name}</h3>
                        <h3>Total Credits: {val.tot_cred}</h3>
                      </div>
                      )
                  })}

              </div>
              <div class="cd-table-container">
                <h2 class="title">Current Semester</h2>
                  <div className='cd-table'>
                    <table>
                      <tr>
                        <th>Course ID</th>
                        <th>Section ID</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Grade</th>
                        <th>Deregister</th>
                      </tr>
                      {(data.curr_sem_info).map((val, key) => {
                        return(
                          <tr key={key}>
                            <td>{val.course_id}</td>
                            <td>{val.sec_id}</td>
                            <td>{val.title}</td>
                            <td>{val.credits}</td>
                            <td>{val.grade}</td>
                            <td><button onClick={() => DeleteCourse(data.stud_info[0].id,val.course_id,val.sec_id)}>Deregister</button></td>
                          </tr>
                        )
                      })}
                    </table>
                  </div>
              </div>
          
           
              
              {Object.keys(data.prev_sem_info).map(key0 => {
                return(
                  <div class="cd-table-container">
                  <h2 class="title">{key0}</h2>
                  <div className="cd-table">  
                <table>
                <tr>
                  <th>Course ID</th>
                  <th>Section ID</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Grade</th>
                </tr>
                { (data.prev_sem_info[key0]).map((val,key)=>{
                  return(
                  <tr key={Math.random()}>
                    <td>{val.course_id}</td>
                    <td>{val.sec_id}</td>
                    <td>{val.title}</td>
                    <td>{val.credits}</td>
                    <td>{val.grade}</td>
                  </tr>
                  )
                }) }
                </table>
                </div>
                </div>
                )
              })}
            
          
            </div>
        </body>
      
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