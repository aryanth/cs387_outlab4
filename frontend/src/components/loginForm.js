import React,{ Fragment,useState } from "react";
async function loginUser(credentials) {
    return fetch('http://localhost:8080/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(function(data){
        console.log("data is " + data);
        return data;
      }
      )
}

export function LoginForm(){

    const [username, SetUsername] = useState("");
    const [password, SetPassword] = useState("");

    const OnSubmitForm = async e => {
        console.log(username);
        console.log(password);
        console.log('hi');
        e.preventDefault();
        const data = await loginUser({
            username,
            password
          });
        console.log(data);
        console.log(data.status);
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
              <form onSubmit={OnSubmitForm}>
                  <h2>Login</h2>
                  <div class="input-field">
                      <input type="text" name="username" id="username" placeholder="Enter Username" value={username} onChange={e => SetUsername(e.target.value)}/>
                  </div>
                  <div class="input-field">
                      <input type="password" name="password" id="password" placeholder="Enter Password" value={password} onChange={e => SetPassword(e.target.value)}/>
                  </div>
                  <input type="submit" value="LogIn" />
              </form>
          </body>
        </Fragment>
    );

};

//export default loginForm;