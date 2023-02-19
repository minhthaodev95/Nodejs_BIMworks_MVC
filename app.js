const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.route');
let authController =  require('./controllers/auth.controller')
let errorController = require('./controllers/error.controller')
require('dotenv').config()

const app = express();

// Use parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(logger('dev'));
app.use(cookieParser());

// Routes
var router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Router middlewares
// For index page & admin page
app.use('/',indexRouter);
app.use('/admin',authController.authMiddleware , usersRouter);

// Error handler & Not Found
app.use(errorController.err404);
app.use(errorController.errorHandler);


module.exports = app;
