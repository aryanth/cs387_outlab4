import React,{useState,useEffect} from 'react';

export function Default(){
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
          const response = await fetch(`http://localhost:8080/`);
          const json = await response.json();
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