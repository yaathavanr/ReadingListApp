//iRead Server

//Cntl+C to stop server

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

let API_KEY = 'AIzaSyB6Dekgn455cPbvJJHbKSCkUILjs8tuSgY'//API Key for Google Books

var  app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000

const session = require('express-session');
app.use(express.static(__dirname + '/public')) //static server
//Cookies for recording username an dpasswords
app.use(session({
	secret: 'jabbawockeezya',
	resave: false,
	saveUninitialized: true
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index');

//some logger middleware functions
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json())

//routes
app.use(['/books', '/book/*', '/songs', '/users', '/song/*', '/viewList','/index.html'], routes.checkSession);

app.get('/login',routes.login);

app.post('/handleLogin', routes.handleLogin);
app.post('/register',routes.registerUser);
app.post('/addBook', routes.addBook);

app.get('/index.html', routes.index);
app.get('/books',routes.getBooks);
app.get('/author', routes.getAuthor);
app.get('/book/*', routes.bookDetails);
app.get('/users', routes.users);
app.get('/viewList', routes.viewList)

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('user: yaathyman password: secret')
		console.log('http://localhost:3000/index.html')
	}
})
