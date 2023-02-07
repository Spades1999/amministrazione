const createError = require('http-errors');
const express = require('express');
const path = require('path'); //is a core Node library for parsing file and directory paths
const cookieParser = require('cookie-parser');
const logger = require('morgan');


/* 
These modules/files contain code for handling particular 
sets of related "routes" (URL paths)
*/
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const listRouter = require('./routes/list');


/* 
we create the app object using our imported express module, 
and then use it to set up the view (template) engine. There 
are two parts to setting up the engine. First, we set the 
'views' value to specify the folder where the templates will 
be stored (in this case the subfolder /views). Then we set the 
'view engine' value to specify the template library (in this 
case "pug").
*/
const app = express();


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = "mongodb+srv://admin_1:6pxupq0TwdpIDpqo@cluster0.u64xze4.mongodb.net/?retryWrites=true&w=majority";

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}



// view engine setup
/* 
The settings tell us that we're using pug as the view engine, 
and that Express should search for templates in the /views 
subdirectory.
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/* 
The next set of functions call app.use() to add the 
middleware libraries that we imported above into the 
request handling chain
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* 
we add our (previously imported) route-handling code to 
the request handling chain. The imported code will define 
particular routes for the different parts of the site
*/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/list', listRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//handler methods for errors and HTTP 404 responses
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
