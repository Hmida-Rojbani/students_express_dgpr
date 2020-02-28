const express = require('express');
const morgan = require('morgan');
const config = require('config');
const appStart = require('debug')('app:start');
const appDebug = require('debug')('app:debug');
const student_router = require('./routers/students');
const app = express();
const port = 3000;
app.use(express.json());
appStart(app.get('env'));

appStart('App Name : ',config.get('name'));
appDebug(`Using DB : ${config.get('db.host')}/user=${config.get('db.login')}&pass=${config.get('db.password')}`)

if(app.get('env')==='development') 
    app.use(morgan('dev'));

app.use('/api/students',student_router);

app.listen(port, ()=> appDebug(`Listenning on ${port}....`))