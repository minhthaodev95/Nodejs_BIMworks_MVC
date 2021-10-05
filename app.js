const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.route');
let authController =  require('./controllers/auth.controller')
let errorController = require('./controllers/error.controller')
require('dotenv').config()


const app = express();

app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/',indexRouter);
app.use('/admin',authController.authMiddleware , usersRouter);
// catch 404 and forward to error handler
app.use(errorController.err404);
// error handler
app.use(errorController.errorHandler);


module.exports = app;
