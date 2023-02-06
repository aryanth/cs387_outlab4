import React,{useState,useEffect} from 'react';

export function Logout(){
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
          const response = await fetch(`http://localhost:8080/logout/`);
          const json = await response.json();
          //console.log(json);
          setData(json);
        }
    
        fetchData();
    }, []);

    if(data){
        window.location.replace("/login/");
    }
    else{
        return (<h2>Loading...</h2>)
    }
}