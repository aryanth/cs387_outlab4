import './table.css'
import React,{useState,useEffect} from 'react';
export function RunningDepartment(){

    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {           
          const response = await fetch('http://localhost:8080/course/running/');
          const json = await response.json();
          setData(json);
        }
    
        fetchData();
    }, []);
    
    if(data){
        return(
            <div>
                <div class = "cd-button">
                <a class = "link" href="/home"><h3>Home</h3></a> 
                    <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
                    <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
                    <a class = "link" href="/logout"><h3>Logout</h3></a>
                </div> 
                
                <div className="cd-table">
                    <table>
                        <tr>
                            <th><h2>Departments which have running courses this semester</h2></th>
                        </tr>
                        {data.map((val, key) => {
                            return(
                                <tr key={key}>
                                    <td><a href={"/course/running/" + val.dept_name}>{val.dept_name}</a></td>
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