import './table.css'
import React,{useState,useEffect, lazy} from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

async function RegCourse(course_data) {
    return fetch('http://localhost:8080/home/registration', {
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

export function Registration(){

    const [data, setData] = useState([]);
    let [selected_course,selVal] = useState([]);
    let [chosen_sec_id, SetChosenSection] = useState("1");
    let [mod_data,setModData] = useState([]);


    const RegisterCourse = async (course_id,sec_id) => {
        console.log("button has been pressed");
        console.log(course_id);
        console.log(sec_id);
        let course_data = {course_id:course_id,sec_id:sec_id};
        console.log(course_data);
        const data = await RegCourse({course_data});
        console.log(data);
        //window.location.reload(false);
        //console.log(ID);
        //console.log(course_id);
        //console.log(sec_id);
      }

    useEffect(() => {
        async function fetchData() {
          const response = await fetch(`http://localhost:8080/home/registration`);
          const json = await response.json();
          let output = [];
            json.forEach(function(item) {
            var existing = output.filter(function(v, i) {
                return v.course_id == item.course_id;
            });
            if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].sec_id = output[existingIndex].sec_id.concat(item.sec_id);
            } else {
                if (typeof item.sec_id == 'string')
                item.sec_id = [item.sec_id];
                output.push(item);
            }
            });
            console.log("This is the json data for the courses available for registration");
            console.log(output);
          /*
          if(!json){
            console.log("not logged in");
            window.location.replace("/login/");
          }
          */
          setData(output);
        }
    
        fetchData();
    }, []);
    
    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log("we have searched");
        console.log(string, results);
        selVal(results);
        console.log("selected course is ")
        console.log(selected_course);
        //{forceUpdate}
    }

    const handleOnHover = (result) => {
        // the item hovered
        console.log(result)
    }
    
    const handleOnSelect = (item) => {
        // the item selected
        console.log("item has been selected");
        console.log(item);
        
    }
    
    const handleOnFocus = () => {
        console.log('Focused')
    }

    const handleOnClear = () => {
        console.log('Cleared')
    }
    
    const formatResult = (item) => {
        console.log("Following is the item");
        console.log(item);
        /*
        return (
            <div className="Table1">
                <table>
                <tr>
                    <th>course_id</th>
                    <th>title</th>
                    <th>sec_id</th>
                </tr>
                {item.map((val, key) => {
                    return (
                    <tr key={key}>
                        <td>{val.course_id}</td>
                        <td>{val.title}</td>
                        <td>{val.sec_id}</td>
                    </tr>
                    )
                })}

                </table>
            </div>
        )
        */
        return (
            <div>
                <>
                {/*
                    <span style={{ display: 'block', textAlign: 'left' }}>{item.course_id}    {item.title}    {item.sec_id} <button onClick={() => RegisterCourse(item.course_id,item.sec_id)}>Register</button></span>
                */}
                <span style={{ display: 'block', textAlign: 'left' }}>id: {item.course_id}</span>
                <span style={{ display: 'block', textAlign: 'left' }}>title: {item.title}</span>
                <span style={{ display: 'block', textAlign: 'left' }}>sec_id: {item.sec_id}</span>
                </>
            </div>
            
        )
    }

    if(data){
        let count  = 0;
        {data.map((val, key) => {
            val.id = count;
            count  = count + 1;
        })}
        console.log("This is the modified data");
        console.log(data);

        return (
            <div>
            <div>
            <header>
                <div style={{ width: 600, margin: 20 }}>
                <ReactSearchAutocomplete
                    items={data}
                    fuseOptions={{ keys: ["course_id", "title"] }} // Search on both fields
                    resultStringKeyName="course_id" // String to display in the results
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    onClear={handleOnClear}
                    formatResult={formatResult}
                    showIcon={false}
                    styling={{
                    height: "34px",
                    border: "1px solid darkgreen",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    boxShadow: "none",
                    hoverBackgroundColor: "lightgreen",
                    color: "darkgreen",
                    fontSize: "12px",
                    fontFamily: "Courier",
                    iconColor: "green",
                    lineColor: "lightgreen",
                    placeholderColor: "darkgreen",
                    clearIconMargin: "3px 8px 0 0",
                    zIndex: 2,
                    }}
                />
                </div>
            </header>
            {/*
            <div className="Table1">
                    <table>
                    <tr>
                        <th>course_id</th>
                        <th>title</th>
                        <th>sec_id</th>
                    </tr>
                    {chosen_course.map((val, key) => {
                        return (
                        <tr key={key}>
                            <td>{val.course_id}</td>
                            <td>{val.title}</td>
                            <td>{val.sec_id}</td>
                        </tr>
                        )
                    })}

                    </table>
            </div>
            */}
            </div>
            {selected_course ? (
            <div className="Table1">
                <table>
                <tr>
                    <th>course_id</th>
                    <th>title</th>
                    <th>sec_id</th>
                    <th>Register</th>
                </tr>
                {selected_course.map((val, key) => {
                    return (
                    <tr key={key}>
                        <td>{val.course_id}</td>
                        <td>{val.title}</td>
                        <td>
                            <select name="sec_id" id="sec_id" onChange={e => SetChosenSection(e.target.value)}>
                            {val.sec_id.map(name => (  
                                <option>{name}</option>
                            ))}  
                            </select>
                        </td>
                        <td><button onClick={() => RegisterCourse(val.course_id,chosen_sec_id)}>Register</button></td>
                    </tr>
                    )
                })}

                </table>
            </div>
            ) : (
                <table>
                <tr>
                    <th>course_id</th>
                    <th>title</th>
                    <th>sec_id</th>
                    <th>Register</th>
                </tr>
                </table>
            )}
            </div>
            
        )
    }
    else{
        <h2>Loading...</h2>
    }
    
}