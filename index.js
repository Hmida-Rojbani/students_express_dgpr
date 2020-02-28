const express = require('express');
const Joi = require('joi');
const morgan = require('morgan');
const config = require('config');
const app = express();
const port = 3000;
app.use(express.json());
console.log(app.get('env'));

console.log('App Name : ',config.get('name'));
console.log(`Using DB : ${config.get('db.host')}/user=${config.get('db.login')}&pass=${config.get('db.password')}`)

if(app.get('env')==='development') 
    app.use(morgan('dev'));
var students = [
    {id: 1, name: 'student1', age: 22},
    {id: 2, name: 'student2', age: 25},
    {id: 3, name: 'student3', age: 21}
];

app.get('/api/students', (req,res)=>{
    res.send(students);
});

const student_id_valid_schema = {
    id: Joi.number().positive().required()
}

app.get('/api/students/:id', (req, res) => {
    var res_validation = Joi.validate(req.params,student_id_valid_schema);
    if(res_validation.error)
        return res.status(400).send(res_validation.error.details[0].message);
    const student_id = req.params.id;
    const student = students.find(s => s.id === parseInt(student_id));
    if(!student) 
        return res.status(404).send(`Student with id : ${student_id} is not found`);
    res.send(student);
});

const student_valid_schema = {
    name: Joi.string().min(3).max(12).required(),
    age: Joi.number().positive().required()
}

app.post('/api/students', (req,res)=>{
    var res_validation = Joi.validate(req.body,student_valid_schema);
    if(res_validation.error)
        return res.status(400).send(res_validation.error.details[0].message);
    const student = {
        id: students[students.length-1].id+1,
        name: req.body.name,
        age: req.body.age
    };
    students.push(student);
    res.status(201).send(student);
});

app.delete('/api/students/:id', (req, res) => {
    var res_validation = Joi.validate(req.params,student_id_valid_schema);
    if(res_validation.error)
        return res.status(400).send(res_validation.error.details[0].message);
    const student_id = req.params.id;
    const student = students.find(s => s.id === parseInt(student_id));
    if(!student) 
        return res.status(404).send(`Student with id : ${student_id} is not found`);
    students = students.filter(s => s.id !== parseInt(student_id));
    res.send(student);
});

app.put('/api/students/:id', (req, res) => {
    var res_validation = Joi.validate(req.params,student_id_valid_schema);
    if(res_validation.error)
        return res.status(400).send(res_validation.error.details[0].message);
    const student_id = req.params.id;
    const student = students.find(s => s.id === parseInt(student_id));
    if(!student) 
        return res.status(404).send(`Student with id : ${student_id} is not found`);
    res_validation = Joi.validate(req.body,student_valid_schema);
        if(res_validation.error)
            return res.status(400).send(res_validation.error.details[0].message);

        student.name=  req.body.name;
        student.age = req.body.age;
    res.send(student);
        
});

app.listen(port, ()=> console.log(`Listenning on ${port}....`))