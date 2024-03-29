import React,{ Fragment,useState } from "react";
import '../login.css';
async function loginUser(credentials) {
    return fetch('http://localhost:8080/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(function(data){
        return data;
      }
      )
}

export function LoginForm(){

    const [username, SetUsername] = useState("");
    const [password, SetPassword] = useState("");

    const OnSubmitForm = async e => {
        e.preventDefault();
        const data = await loginUser({
            username,
            password
          });
        if(data.status == "200"){
          window.location.replace("/home/");
        }
        else{
          window.location.reload(false);
        }
    }
    return (
        <Fragment>
          <head>
              <link rel="stylesheet" href="./App.css" />
          </head>
          <body>
            <div class="login-form">
              <form onSubmit={OnSubmitForm}>
                  <h1 align="center">IITASC</h1>
                  <div class="content">
                  <div class="input-field">
                      <input type="text" name="username" id="username" placeholder="Enter User ID" value={username} onChange={e => SetUsername(e.target.value)}/>
                  </div>
                  <div class="input-field">
                      <input type="password" name="password" id="password" placeholder="Enter Password" value={password} onChange={e => SetPassword(e.target.value)}/>
                  </div>
                  </div>
                  <div class = "action">
                    <button type="submit" >Login</button>
                  </div>
                  
              </form>
              </div>
          </body>
        </Fragment>
    );

};

//export default loginForm;