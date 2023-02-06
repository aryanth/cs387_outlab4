const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bcrypt = require ('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = 8080;

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'lab4db',
  password: '123',
  port: 5432,
})
pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
app.use(cors());
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());

let session;
let curr_sem;
const curr_sem_text = "select semester,year from reg_dates order by start_time desc";
pool.query(curr_sem_text, (err, res) => {
  if (err) {
    console.log("Error in current semester info");
    //myReject(err.stack);
  } else {
    console.log("This is the current semester info");
    console.log(res.rows[0]);
    curr_sem = res.rows[0];
  }
});



app.post('/login/',(req,res) => {
  session=req.session;
  new Promise(function(myResolve, myReject) {
      const text = 'select hashed_password from user_password where id = \'' + req.body.username + '\';';
      console.log(text);
      pool.query(text, (err, res) => {
        if (err) {
          console.log('here');
          myReject(err.stack);
        } else { 
          console.log('worked');
          console.log(res.rows);
          console.log(res.rows[0].hashed_password);
          myResolve(res.rows[0].hashed_password);
        }
      });
  }).then(function(value) {

      const hash_from_db = value;
      console.log('checkpoint');
      return new Promise(function(resolve,reject){
        bcrypt
        .compare(req.body.password,hash_from_db)
        .then(result => {
          console.log(result); // return true
          resolve(result);
        })
      })
  }).then(function(value) {
      console.log("value returned by the check " + value)
      if(value){
          console.log("right thing has occured")
          session=req.session;
          session.userid=req.body.username;
          console.log(req.session)
          //res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
          console.log("the value is as follows " + value);
          res.redirect("/home/");
      }
      else{
          console.log("this is important")
          res.redirect('/login/');
      }
    });
});

app.get('/home/',(req,res) => {
  //res.send("what up");
  if(session && session.userid){
  new Promise(function(myResolve, myReject) {
      console.log("hi");
      const text1 = 'select student.ID,name,dept_name,tot_cred from student where student.ID = \'' + session.userid + '\';';
      console.log(text1);
      pool.query(text1, (err, res) => {
        if (err) {
          console.log('here');
          myReject(err.stack);
        } else {
          console.log('worked');
          myResolve(res.rows);
        }
      });
  }).then(function(value){
    console.log(value);
    return value;
  }).then(function(value){
    if(session && session.userid){
      const text3 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID,reg_dates.semester,reg_dates.year) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\',\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
      console.log(text3);
      return new Promise(function(resolve,reject){
        pool.query(text3, (err, res) => {
          if (err) {
            console.log('here');
            reject(err.stack);
          } else {
            console.log('worked again');
            console.log("The first json object is ")
            console.log(value);
            let final_json = {stud_details:value,current_sem:res.rows,session_details:session.userid};
            console.log("The intermediate json object is ")
            console.log(final_json);
            resolve(final_json);
          }
        })
      })
    }
    else{
      console.log("terrible session");
      let final_json = {stud_details:session.userid,current_sem:session.userid,session_details:session.userid};
      return final_json;
    }
  }).then(function(value){
      //console.log(value["stud_details"]);
      //console.log(value)
      const text4 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\') and (reg_dates.semester,reg_dates.year) != (\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
      console.log(text4);
      return new Promise(function(resolve,reject){
        pool.query(text4, (err, res) => {
          if (err) {
            console.log('here');
            reject(err.stack);
          } else {
            console.log('worked again');
            //console.log("The first json object is ")
            //console.log(value);
            console.log("this is where the error has occured");
            value.prev_sem = res.rows;
            console.log("The final json object is ")
            console.log(value);
            resolve(value);
          }
        })
      })
      //res.send(value);
  }).then(function(value){
    res.send(value);
  })
  }
  else{
    console.log("taking else");
    let final_json = {stud_details:session,current_sem:session,session_details:session,prev_sem:session};
    res.send(final_json);
  }
})

app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/login/');
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));