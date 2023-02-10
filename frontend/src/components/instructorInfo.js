import './table.css'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';

export function InstructorInfo(){
    const [data, setData] = useState([]);
    let {instructor_id} = useParams();

    useEffect(() => {
        async function fetchData(instructor_id) {
          console.log(instructor_id);
          const response = await fetch(`http://localhost:8080/instructor/${instructor_id}`);
          const json = await response.json();
          console.log("This is the json data for the particular instructor");
          console.log(json);
          /*
          if(!json){
            console.log("not logged in");
            window.location.replace("/login/");
          }
          */
          setData(json);
        }
    
        fetchData(instructor_id);
    }, []);
    if(data && data.instr_info && data.curr_sem_data && data.prev_sem_data){
        return(
            
            <div>
                <div class = "cd-button">
                <a class = "link" href="/home"><h3>Home</h3></a>         
          <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
          <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
          <a class = "link" href="/logout"><h3>Logout</h3></a>
          </div>
                <h2 class="header">Instructor Information</h2>
                <div className="cd-table">
                    <table>
                    <tr>
                        <th>name</th>
                        <th>dept_name</th>
                    </tr>
                    {(data.instr_info).map((val, key) => {
                        return (
                        <tr key={key}>
                            <td>{val.name}</td>
                            <td>{val.dept_name}</td>
                        </tr>
                        )
                    })}

                    </table>
                </div>
                <h2 class="header">Current Semester</h2>
                <div className="cd-table">
                    <table>
                    <tr>
                        <th>course_id</th>
                        <th>title</th>
                    </tr>
                    {(data.curr_sem_data).map((val, key) => {
                        return(
                        <tr key={key}>
                            <td><a href={"/course/" + val.course_id}>{val.course_id}</a></td>
                            <td>{val.title}</td>
                        </tr>
                        )
                    })}
                    </table>
                </div>

                <h2 class="header">Previous Semesters</h2>
                <div className="cd-table">
                    {(Object.keys(data.prev_sem_data)!=0) &&
                    <table>
                    <tr>
                        <th>course_id</th>
                        <th>title</th>
                    </tr>
                    {(data.prev_sem_data).map((val, key) => {
                        return(
                        <tr key={key}>
                            <td>{val.course_id}</td>
                            <td>{val.title}</td>
                        </tr>
                        )
                    })}
                    </table>
                    }
                </div>
            </div>
        )
    }
    else{
    return (<h2>Loading...</h2>)
    }
}