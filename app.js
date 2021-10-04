var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.route');
let Author = require('./models/author.model')
let Post = require('./models/post.model')
let Category = require('./models/category.model')
let ParentCategory = require('./models/parent_category.model')
let Image = require('./models/image.model')

let authController =  require('./controllers/auth.controller')

var app = express();
app.use(cookieParser())

app.use(bodyParser.urlencoded({
  extended: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/',indexRouter);
app.use('/admin',authController.authMiddleware , usersRouter);
/* GET Login . */



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
