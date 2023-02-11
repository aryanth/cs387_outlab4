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
    let [chosen_sec_id, SetChosenSection] = useState("-");
    
    const [slot,setSlot] = useState(new Map());
    const [occupied,setOcuppied] = useState(new Set());
    const [perv_course,setPrev] = useState(new Set());
   
    
    useEffect(() => {
        
        async function fetchData() {
        const response0 = await fetch('http://localhost:8080/home/');
        const json0 = await response0.json();  
          const response = await fetch(`http://localhost:8080/home/registration`);
          const json1 = await response.json();
          const json = json1.info1;
          
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
          setData(output);
         
        }
        
        fetchData();
    }, []);
    
    const RegisterCourse = async (course_id,sec_id) => {
        let course_data = {course_id:course_id,sec_id:sec_id};
        let string1 = course_id+'/'+sec_id;
        
        if(!occupied.has(slot.get(string1)) ){
            if(sec_id!='-'){
                const data = await RegCourse({course_data});
                occupied.add(slot.get(string1));
                if(data.status==200){
                    alert("Registered")
                }
                else{
                    alert("Prereq not fullfilled");
                }
            }
            else{alert("select section");}
        }
        else{
            alert("Slot Clash with another course");
        }

      }

    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        selVal(results);
        //{forceUpdate}
    }

    const handleOnHover = (result) => {
    }
    
    const handleOnSelect = (item) => {        
    }
    
    const handleOnFocus = () => {
    }

    const handleOnClear = () => {
    }
    
    const formatResult = (item) => {
        
        return (
            <div>
                <>
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
                <div style={{ width: 1000, margin: 20 }}>
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
            </div>
            {Object.keys(selected_course)!==0 ? (
            <div className="cd-table">
                <table>
                <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Section ID</th>
                    <th>Register</th>
                </tr>
                {selected_course.map((val, key) => {
                    return (
                    <tr key={key}>
                        <td>{val.course_id}</td>
                        <td>{val.title}</td>
                        <td>
                            <select name="sec_id" id="sec_id" onChange={e => SetChosenSection(e.target.value)}>
                            <option value="-">-</option>
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