const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bcrypt = require ('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = 8080;
const fs = require('fs')

let rawdata = fs.readFileSync('config.json');
let db_info = JSON.parse(rawdata);

const pool = new Pool(db_info)
pool.connect(function(err) {
  if (err) throw err;
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
let sems;
const curr_sem_text = "select semester,year from reg_dates order by start_time desc";
pool.query(curr_sem_text, (err, res) => {
  if (err) {
    //myReject(err.stack);
  } else {
    curr_sem = res.rows[0];
    sems = res.rows;
  }
});



app.post('/login/', async (req,res) => {
  session=req.session;
  const text = 'select hashed_password from user_password where id = \'' + req.body.username + '\';';
  let pass_hash = await pool.query(text);
  if (pass_hash.rowCount != 0){
    let check = await bcrypt.compare(req.body.password,pass_hash.rows[0].hashed_password);
    if(check){
      session=req.session;
      session.userid=req.body.username;
      res.send("login is successful");
    }
    else{
      res.status(401).send("login failed");
    }
  }
  else{
    res.status(401).send("login failed");
  }

});

app.get('/home/', async (req,res) => {
  //res.send("what up");
  if(session && session.userid){
    const text1 = 'select student.ID,name,dept_name,tot_cred from student where student.ID = \'' + session.userid + '\';';
    let stud_info = await pool.query(text1);
    const text3 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID,reg_dates.semester,reg_dates.year) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\',\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
    let curr_sem_info = await pool.query(text3);
    
    let prev_sem_info = {}
    for (let i = 1; i < sems.length;i++){
      const text40 = 'select course.course_id,sec_id,title,credits,grade from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\') and (reg_dates.semester,reg_dates.year) = (\''+ sems[i].semester + '\',\''+ sems[i].year + '\');';
      let query = await pool.query(text40);
      let string = sems[i].year + '/'+sems[i].semester;
      prev_sem_info[string] = query.rows;
    }
    
    

    let final_json = {stud_info:stud_info.rows,curr_sem_info:curr_sem_info.rows , prev_sem_info:prev_sem_info};
    res.send(final_json);
  }
  else{
    res.status(401).send({value:"Not logged in"});
  }
  
})

app.post('/home/', async (req,res)  =>{
  if(session && session.userid){
    const text5 = 'delete from takes where (id,course_id,sec_id) = (\'' + req.body.course_data.id + '\',\'' + req.body.course_data.course_id + '\',\'' + req.body.course_data.sec_id + '\');';
    await pool.query(text5);
    res.send("done");
  }
})

app.get('/course/running/', async (req,res) =>{
  if(session && session.userid){

    const text6 = 'select distinct dept_name from course,section where (course.course_id,section.semester,section.year) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';
    let data_val = await pool.query(text6);
    res.send(data_val.rows);

  }

})

app.get('/course/running/:dept_name/', async(req,res) => {

  if(session && session.userid){
    const text7 = 'select distinct section.course_id from course,section where (course.course_id,section.semester,section.year,dept_name) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.dept_name + '\');';
    let data_val = await pool.query(text7);
    res.send(data_val.rows);
  }
})

app.get('/course/:course_id/', async(req,res) => {

  if(session && session.userid){
    const text8 = 'select distinct course.dept_name,course.course_id,title,credits from course,section where (course.course_id,section.semester,section.year,course.course_id) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.course_id + '\');';
    
    let course_data = await pool.query(text8);
    if(course_data.rows.length == 0){
      const text23 = 'select course.course_id,title,credits,dept_name from course where course.course_id = \'' + req.params.course_id + '\';';
      course_data = await pool.query(text23);
    }

    const text9 = 'select distinct prereq_id,title from prereq,course where course.course_id = prereq.prereq_id and prereq.course_id = \'' + req.params.course_id + '\';';
    let prereq_data = await pool.query(text9);
    const text10 = 'select distinct ID from teaches where (course_id,semester,year) = (\'' +  req.params.course_id + '\',\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';
    let instr_data = await pool.query(text10);
    let final_json = {course_data:course_data.rows,prereq_data:prereq_data.rows,instr_data:instr_data.rows};
    res.send(final_json);
  }
})


app.get('/instructor/:instructor_id/', async(req,res) => {

  if(session && session.userid){

    const text11 = 'select name,dept_name from instructor where ID = \'' + req.params.instructor_id + '\';';
    let instr_info = await pool.query(text11);
    const text12 = 'select distinct teaches.course_id,title from teaches,course where (teaches.course_id,semester,year,ID) = (course.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\',\'' + req.params.instructor_id + '\') order by (teaches.course_id);';
    let curr_sem_data = await pool.query(text12);
    const text13 = 'select distinct teaches.course_id,title from teaches,course where (teaches.course_id,ID) = (course.course_id,\'' + req.params.instructor_id + '\') and (semester,year) != (\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\') order by (teaches.course_id);';
    let prev_sem_data = await pool.query(text13);

    let final_json = {instr_info:instr_info.rows,curr_sem_data:curr_sem_data.rows,prev_sem_data:prev_sem_data.rows};
    res.send(final_json);

  }
})

app.get('/home/registration/', async(req,res) => {
  if(session && session.userid){
    const text14 = 'select course.course_id,title,sec_id from section,course where (course.course_id,semester,year) = (section.course_id,\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\');';

    let running_courses = await pool.query(text14);
    const text16 = 'select course.course_id,sec_id,time_slot_id from section,course where course.course_id = section.course_id and semester = \'' + curr_sem.semester + '\' and year = \'' + curr_sem.year + '\';';
    
    let all_slots = await pool.query(text16);
    
    
    
    let dat2 = {info1 : running_courses.rows , info2 : all_slots.rows};
    
    res.send(dat2);
  }
})


app.post('/home/registration', async (req,res)  =>{
  if(session && session.userid){
    const text19 = 'select prereq_id from prereq where course_id = \'' + req.body.course_data.course_id + '\';';
    let info = await pool.query(text19);

    text20 = 'select prereq_id from prereq where course_id = \'' + req.body.course_data.course_id + '\' intersect select course.course_id from takes,course,reg_dates where (takes.course_id,takes.semester,takes.year,takes.ID) = (course.course_id,reg_dates.semester,reg_dates.year,\'' + session.userid + '\') and (reg_dates.semester,reg_dates.year) != (\''+ curr_sem.semester + '\',\''+ curr_sem.year + '\');';
    let info2 = await pool.query(text20);
    
    set1 = new Set();
    prereqs = true;
    let res_text;
    info2.rows.forEach(function(item){
      set1.add(item.prereq_id);
    });
    info.rows.forEach(function(item){
      if(!set1.has(item.prereq_id)){
        prereqs = false;
      }
    });
    if(prereqs){
      const text15 = 'insert into takes (id,course_id,sec_id,semester,year) values (\'' + session.userid + '\',\'' + req.body.course_data.course_id + '\',\'' + req.body.course_data.sec_id + '\',\'' + curr_sem.semester + '\',\'' + curr_sem.year + '\') ;';
      await pool.query(text15);
      res.status(200).send("OK")

    }
    else{
      //res_text = "Prereq not satisfied";
      res.status(404).send("prereq not statisfied");


    }

  }
})

app.get('/',(req,res) => {
  res.send('Redirect to Login page');
})


app.get('/logout',(req,res) => {
  req.session.destroy();
  //res.redirect('/login/');
  res.send("Logout is successful");
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));