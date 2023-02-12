import './table.css'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';

export function InstructorInfo(){
    const [data, setData] = useState([]);
    let {instructor_id} = useParams();

    useEffect(() => {
        async function fetchData(instructor_id) {
          const response = await fetch(`http://localhost:8080/instructor/${instructor_id}`);
          const json = await response.json();
          setData(json);
        }
    
        fetchData(instructor_id);
    }, []);
    if(data && data.instr_info && data.curr_sem_data && data.prev_sem_data){
        return(
            <body>
                <div>
                    <div class = "cd-button">
                        <a class = "link" href="/home"><h3>Home</h3></a>         
                        <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
                        <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
                        <a class = "link" href="/logout"><h3>Logout</h3></a>
                    </div>
                    <div class="cd-table-container">
                        <h2 class="header">Instructor Information</h2>
                            <div className="cd-table">
                                <table>
                                <tr>
                                    <th>Instructor Name</th>
                                    <th>Department Name</th>
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
                    </div>
                    <div class="cd-table-container">
                        <h2 class="header">Current Semester</h2>
                            <div className="cd-table">
                                <table>
                                <tr>
                                    <th>Course ID</th>
                                    <th>Title</th>
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
                    </div>
          
                    {Object.keys(data.prev_sem_data).map(key0 => {
                        return(
                        <div class="cd-table-container">
                        <h2 class="title">{key0}</h2>
                        <div className="cd-table">  
                        <table>
                        <tr>
                        <th>Course ID</th>
                        <th>Title</th>
                        </tr>
                        { (data.prev_sem_data[key0]).map((val,key)=>{
                        return(
                        <tr key={Math.random()}>
                            <td>{val.course_id}</td>
                            <td>{val.title}</td>
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
    return (<h2>Loading...</h2>)
    }
}