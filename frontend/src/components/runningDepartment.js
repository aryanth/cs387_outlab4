import './table.css'
import React,{useState,useEffect} from 'react';
export function RunningDepartment(){

    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {           
          const response = await fetch('http://localhost:8080/course/running/');
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
    
        fetchData();
    }, []);
    
    if(data){
        return(
            <div>
                <a href="/logout">Logout</a>
                <h2>Departments which have running courses this semester</h2>
                <div className="Table3">
                    <table>
                        <tr>
                            <th>dept_name</th>
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