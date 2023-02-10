import './table.css'
import React,{useState,useEffect, lazy} from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { string } from 'prop-types';

async function RegCourse(course_data) {

    
    return fetch('http://localhost:8080/home/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(course_data)
    })
      .then(function(data){
        console.log("back_data");
        //console.log(data.data);
        return data;
      }
      )

}


export function Registration(){

    const [data, setData] = useState([]);
    let [selected_course,selVal] = useState([]);
    let [chosen_sec_id, SetChosenSection] = useState("1");
    
    const [slot,setSlot] = useState(new Map());
    const [occupied,setOcuppied] = useState(new Set());
    const [perv_course,setPrev] = useState(new Set());
   
    
    useEffect(() => {
        
        async function fetchData() {
        const response0 = await fetch('http://localhost:8080/home/');
        const json0 = await response0.json();  
        console.log(json0)    
          const response = await fetch(`http://localhost:8080/home/registration`);
          const json1 = await response.json();
          const json = json1.info1;
          //console.log("this is json data for 1");
          
          const course_data = json1.info2;

          let slotmap = new Map();
          let slot_set = new Set();
          
          //let perq = new Set();  
       
        course_data.forEach(function(item){
            let a = item.course_id + '/'+item.sec_id;
            slotmap.set(a,item.time_slot_id);
            
        });  
        setSlot(slotmap);    
        
        
        json0.curr_sem_info.forEach(function(item){
            let a = item.course_id + '/'+item.sec_id;
            
            slot_set.add(slotmap.get(a));
        });
        console.log(slot_set);
        setOcuppied(slot_set);

        
        
        //setPrereq(perq);
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
    
    const RegisterCourse = async (course_id,sec_id) => {
        console.log("button has been pressed");
        console.log(course_id);
        console.log(sec_id);
        let course_data = {course_id:course_id,sec_id:sec_id};
        console.log("Coures data");
        console.log(course_data);
        let string1 = course_id+'/'+sec_id;
        console.log("prereqs for the course");
        
        if(!occupied.has(slot.get(string1)) ){
            const data = await RegCourse({course_data});
            occupied.add(slot.get(string1));
            console.log(data);
        }
        else{
            console.log("Slot Clash");
        }

        //window.location.reload(false);
        //console.log(ID);
        //console.log(course_id);
        //console.log(sec_id);
      }

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
        data.map((val, key) => {
            val.id = count;
            count  = count + 1;
        })
        console.log("This is the modified data");
        console.log(data);

        return (
            <div>
                <div class = "cd-button">
                <a class = "link" href="/home"><h3>Home</h3></a>     
                <a class = "link" href="/course/running"><h3>Running Courses</h3></a>
                <a class = "link" href="/home/registration"><h3>Register for courses</h3></a>
                <a class = "link" href="/logout"><h3>Logout</h3></a>
          </div> 
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
            {Object.keys(selected_course)!==0 ? (
            <div className="cd-table">
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
                <table class = "cd-table">
                <tr>
                    <th>course_id</th>
                    <th>title</th>
                    <th>sec_id</th>
                    <th>Register</th>
                </tr>
                {data.map((val, key) => {
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
            )}
            </div>
            
        )
    }
    else{
        <h2>Loading...</h2>
    }
    
}