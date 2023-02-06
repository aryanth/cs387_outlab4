import './table.css'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';

export function RunningCourses(){
    const [data, setData] = useState([]);
    let {dept_name} = useParams();

    useEffect(() => {
        async function fetchData(dept_name) {
          console.log(dept_name);
          const response = await fetch(`http://localhost:8080/course/running/${dept_name}`);
          const json = await response.json();
          console.log("This is the json data ")
          console.log(json);
          /*
          if(!json){
            console.log("not logged in");
            window.location.replace("/login/");
          }
          */
          setData(json);
        }
    
        fetchData(dept_name);
    }, []);
    if(data){

        return(
            <div>
                <a href="/logout">Logout</a>
                <h2>Running courses in the given department</h2>
                <div className="Table3">
                    <table>
                        <tr>
                            <th>course_id</th>
                        </tr>
                        {data.map((val, key) => {
                            return(
                                <tr key={key}>
                                    <td><a href={"/course/" + val.course_id}>{val.course_id}</a></td>
                                </tr>
                            )
                        })}
                    </table>
                </div>  
            </div>
        );

    }
    else{
        return (<h2>Loading...</h2>);
    }

}