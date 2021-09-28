var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multiparty = require('connect-multiparty');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.route');
let Author = require('./models/author.model')
let Post = require('./models/post.model')
let Category = require('./models/category.model')
let Image = require('./models/image.model')

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))



const MultipartyMiddleware = multiparty({uploadDir : './public/upload'})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/admin', usersRouter);
/* GET Login . */

app.post('/upload', MultipartyMiddleware, (req, res) => {
  
  var TempFile = req.files.upload;
  var TempPathfile = TempFile.path;

  var pathImageArr = TempPathfile.split('/');
    pathImageArr.shift();
    pathImageArr.unshift('');
    var path = pathImageArr.join('/');
    const image = new Image({
      urlUpload : path
    });

    image.save();
      res.status(200).json({
       uploaded: true,
        url: `${path}`
      }); // this path is the same as in 5th row (except folder, here it change, but it's no matter) 

});

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
