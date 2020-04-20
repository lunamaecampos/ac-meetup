const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('request');
require('./db/mongoose');
const userRouter = require('./routers/user')


const app = express();
//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');


app.use(express.json());
app.use(userRouter);

// view engine
app.use(express.static(publicDirectoryPath));
app.set('view engine', 'html')

//default route
app.get('', (request, response)=>{
  response.render('index')
})

module.exports = app;
