require('dotenv').config()
console.log(process.env.session_secret)
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
const multer = require('multer');
var shortid = require("shortid")
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth")
var uploadfile = require("./routes/uploadfile")


var check = require("./middleware/middlewareuser")

var app = express();

var dir = './public/uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser(process.env.session_secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    console.log(`${shortid.generate() + file.fieldname}-${Date.now()}.${file.mimetype.split("/").slice(1).join(".")}`)
    cb(null, `${shortid.generate() + file.fieldname}-${Date.now()}.${file.mimetype.split("/").slice(1).join(".")}`)
  }
})

var upload = multer({ storage: storage })
///app.use(upload.array('file',1000000000000000000000000000000000000000000))
app.use(upload.single('file'))





app.use('/',indexRouter);
app.use('/users',check.check_user, usersRouter);
app.use("/auth",authRouter)
app.use("/uploadfile",uploadfile)






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
