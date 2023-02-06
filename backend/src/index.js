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



app.post('/login/', async (req,res) => {
  session=req.session;
  const text = 'select hashed_password from user_password where id = \'' + req.body.username + '\';';
  console.log(text);
  let pass_hash = await pool.query(text);
  console.log(pass_hash.rowCount);
  if (pass_hash.rowCount != 0){
    let check = await bcrypt.compare(req.body.password,pass_hash.rows[0].hashed_password);
    console.log("the value of the check is " + check);
    if(check){
      console.log("Authentication is successful");
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session);
      //res.redirect("/home/");
      res.send("login is successful");
    }
    else{
      console.log("Authentication has failed");
      res.status(401).send("login failed");
    }
  }
  else{
    console.log("Authentication has failed");
    res.status(401).send("login failed");
  }

});

app.get('/home/', async (req,res) => {
  //res.send("what up");
  if(session && session.userid){
    const text1 = 'select student.ID,name,dept_name,tot_cred from student where student.ID = \'' + session.userid + '\';';
    console.log(text1);
    let stud_info = await pool.query(text1);
    const text3 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID,reg_dates.semester,reg_dates.year) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\',\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
    console.log(text3);
    let curr_sem_info = await pool.query(text3);
    const text4 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\') and (reg_dates.semester,reg_dates.year) != (\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
    console.log(text4);
    let prev_sem_info = await pool.query(text4);
    let final_json = {stud_info:stud_info.rows,curr_sem_info:curr_sem_info.rows,prev_sem_info:prev_sem_info.rows};
    res.send(final_json);
  }
  else{
    res.status(401).send({value:"Not logged in"});
  }
  
})

app.post('/home/', async (req,res)  =>{
  if(session && session.userid){
    console.log(req.body);
    const text5 = 'delete from takes where (id,course_id,sec_id) = (\'' + req.body.course_data.id + '\',\'' + req.body.course_data.course_id + '\',\'' + req.body.course_data.sec_id + '\');';
    console.log(text5);
    await pool.query(text5);
    console.log("Deletion is done");
    res.send("done");
  }
})

app.get('/course/running/', async (req,res) =>{
  console.log("Have reached the running courses page");
  if(session && session.userid){

    const text6 = 'select distinct dept_name from course,section where (course.course_id,section.semester,section.year) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';
    console.log(text6);
    let data_val = await pool.query(text6);
    res.send(data_val.rows);

  }

})

app.get('/course/running/:dept_name/', async(req,res) => {
  console.log("have reached the individual dept page");

  if(session && session.userid){
    const text7 = 'select distinct section.course_id from course,section where (course.course_id,section.semester,section.year,dept_name) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.dept_name + '\');';
    console.log(text7);
    let data_val = await pool.query(text7);
    console.log(req.params.dept_name);
    res.send(data_val.rows);
  }
})

app.get('/course/:course_id/', async(req,res) => {
  console.log("have reached the course info page");

  if(session && session.userid){
    const text8 = 'select course.course_id,sec_id,title,credits,building,room_number from course,section where (course.course_id,section.semester,section.year,course.course_id) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.course_id + '\');';
    console.log(text8);
    let course_data = await pool.query(text8);
    const text9 = 'select distinct prereq_id,title from prereq,course where course.course_id = prereq.prereq_id and prereq.course_id = \'' + req.params.course_id + '\';';
    console.log(text9);
    let prereq_data = await pool.query(text9);
    const text10 = 'select distinct ID from teaches where (course_id,semester,year) = (\'' +  req.params.course_id + '\',\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';
    console.log(text10);
    let instr_data = await pool.query(text10);
    let final_json = {course_data:course_data.rows,prereq_data:prereq_data.rows,instr_data:instr_data.rows};
    res.send(final_json);
  }
})

app.get('/instructor/:instructor_id/', async(req,res) => {

  console.log("have reached the instructor info page");

  if(session && session.userid){

    const text11 = 'select name,dept_name from instructor where ID = \'' + req.params.instructor_id + '\';';
    console.log(text11);
    let instr_info = await pool.query(text11);
    const text12 = 'select distinct teaches.course_id,title from teaches,course where (teaches.course_id,semester,year,ID) = (course.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.instructor_id + '\');';
    console.log(text12);
    let curr_sem_data = await pool.query(text12);
    const text13 = 'select distinct teaches.course_id,title from teaches,course where (teaches.course_id,ID) = (course.course_id,\'' + req.params.instructor_id + '\') and (semester,year) != (\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';
    console.log(text13);
    let prev_sem_data = await pool.query(text13);

    let final_json = {instr_info:instr_info.rows,curr_sem_data:curr_sem_data.rows,prev_sem_data:prev_sem_data.rows};
    res.send(final_json);

  }
})


app.get('/logout',(req,res) => {
  req.session.destroy();
  //res.redirect('/login/');
  res.send("Logout is successful");
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));