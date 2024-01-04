
var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/iRead.db');
const https = require('https');
let API_KEY = 'AIzaSyB6Dekgn455cPbvJJHbKSCkUILjs8tuSgY'//API Key for Google Books

db.serialize(function(){
	  //make sure a couple of users exist in the database.
	  //user: ldnel password: secret
	  //user: frank password: secret2
    //   var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
    //   db.run(sqlString);
    //   sqlString = "INSERT OR REPLACE INTO users VALUES ('user2', 'secret2', 'guest')";
    //   db.run(sqlString);
	//   sqlString = "INSERT OR REPLACE INTO userBooks VALUES ('Divergent', 'Veronica Roth', 'Harper Collins','Damn my API is down','yaathyman')";
    //   db.run(sqlString);
	//   sqlString = "INSERT OR REPLACE INTO userBooks VALUES ('Insurgent', 'Veronica Roth', 'Harper Collins','Damn my API is down','martha')";
    //   db.run(sqlString);
    //   sqlString = "INSERT OR REPLACE INTO users VALUES ('frank', 'secret2')";
    //   db.run(sqlString);
  });

function addHeader(request, response){
        // about.html
        var title = 'COMP 2406:';
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<!DOCTYPE html>');
        response.write('<html><head><title>About</title></head>' + '<body>');
        response.write('<h1>' +  title + '</h1>');
		response.write('<hr>');
}

function addFooter(request, response){
 		response.write('<hr>');
		response.write('<h3>' +  'Carleton University' + '</h3>');
		response.write('<h3>' +  'School of Computer Science' + '</h3>');
        response.write('</body></html>');

}

//Login page
exports.login = function(request, response,next){

	response.render('login')

}

//Once a request to log in is sent, this is what handles the login
exports.handleLogin = function(request, response){
	let userName = request.body.userName;
	let password = request.body.password;
	let userRole = '';
	let authorized = false;
	db.all("SELECT userid, password, role FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
		      if(rows[i].userid == userName & rows[i].password == password){
				authorized = true;
				userRole = rows[i].role;
			  }
		}
		if(authorized == false){
 	 	  
		   response.writeHead(401, { "Content-Type":"json" })
		   console.log('No authorization found, send INVALID.');
		   response.end(JSON.stringify(authorized))
		}
        else{
			console.log("LOGIN SUCCESSFUL YAAAAAAAAAAAY")
			request.session.username = userName;
			request.session.password = password;
			request.session.role = userRole;
			response.writeHead(200, { "Content-Type":"json" })
			response.end(JSON.stringify(authorized))
			
		}
	});
}

//Once  a request to register is sent, this route handles the register for the user
exports.registerUser = function(request,response){
	let userName = request.body.userName;
	let password = request.body.password;
	let authorized = false;

	db.all("SELECT userid, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
			if(rows[i].userid == userName) 
			{
				authorized = true;
			}
		}
		if(authorized == false)
		{  
			sqlString = "INSERT INTO users VALUES (?, ?, ?)";
			db.run(sqlString, [userName, password,"guest"]);
			let userRole = "guest";
			
			request.session.username = userName;
			request.session.password = password;
			request.session.role = userRole;

			console.log("SUCCESS");
			response.writeHead(200, { "Content-Type":"json" })
			response.end(JSON.stringify(true))
		 }
		 else
		 {
			console.log("User exists");
			response.writeHead(401, { "Content-Type":"json" })
			response.end(JSON.stringify(false))
			 
		 }
	});
}

//This serves the landing page
exports.index = function (request, response){
        
	     response.render('index', { title: 'iRead', body: 'Store your to-reads'});
		 
}
//This handles the API request to Google Books, getting books by title
exports.getBooks = function(request,response){

	let title = request.query.title
	console.log(title)
	if(!title) {
		response.json({message: 'Please enter a book title'})
		return
	}

	title = title.replace(/ /g, "+");

	let options = {
		method: 'GET',
		host: 'www.googleapis.com',
		path: encodeURI(`/books/v1/volumes?q=intitle:${title}&printType=books&key=${API_KEY}`)
	}

	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
		bookData += chunk
		})
		apiResponse.on('end', function() {
			let bookInfo = JSON.parse(bookData);
			response.render('books', {title: 'Books:', bookEntries: bookInfo.items});
		})
	}).end()
}
//This handles the API request to Google Books, getting books by author
exports.getAuthor = function(request,response){

	let title = request.query.title
	console.log(title)
	if(!title) {
		response.json({message: 'Please enter an author name'})
		return
	}

	title = title.replace(/ /g, "+");

	let options = {
		method: 'GET',
		host: 'www.googleapis.com',
		path: encodeURI(`/books/v1/volumes?q=inauthor:${title}&key=${API_KEY}`)
	}

	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
		bookData += chunk
		})
		apiResponse.on('end', function() {
			let bookInfo = JSON.parse(bookData);
			console.log(bookInfo);
			response.render('books', {title: 'Authors:', bookEntries: bookInfo.items});
		})
	}).end()

}

function parseURL(request, response){
	var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery , slashHost );
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj;

}
//This handles the request to view users, verifying if they have admin access
exports.users = function(request, response){

		if(request.session.role =="admin")
		{
			db.all("SELECT userid, password FROM users", function(err, rows){
 	    		response.render('users', {title : 'Users:', userEntries: rows});
			})
		}
		else
		{
			let err = 'ERROR: Admin Privileges Required To See Users'
			console.log('ERROR: ' + JSON.stringify(err))
			response.writeHead(404)
			response.end(JSON.stringify(err))
		}

}
//This handles the request to view more details about a specific book
exports.bookDetails = function(request,response){
	
	var urlObj = parseURL(request, response);
    var bookID = urlObj.path;
	console.log(bookID);
	
	bookID = bookID.substring(bookID.lastIndexOf("/")+1, bookID.length);
	
	let options = {
		method: 'GET',
		host: 'www.googleapis.com',
		path: encodeURI(`/books/v1/volumes/${bookID}?key=${API_KEY}`)
	}

	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
		bookData += chunk
		})
		apiResponse.on('end', function() {
			let bookInfo = JSON.parse(bookData);
			console.log(bookInfo)
			response.render('bookDetails',{book: bookInfo})
		})
	}).end()

}
//This handles the request to add a book to a user's view list
exports.addBook = function(request, response){

	console.log("ENTERED");
	let userName = request.session.username;
	var parseQuery = true; 
    var slashHost = true; 
    var urlObj = url.parse(request.body.windowURL, parseQuery , slashHost );
    var bookID = urlObj.path;

	bookID = bookID.substring(bookID.lastIndexOf("/")+1, bookID.length);
	console.log(bookID);


	let options = {
		method: 'GET',
		host: 'www.googleapis.com',
		path: encodeURI(`/books/v1/volumes/${bookID}?key=${API_KEY}`)
	}

	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
		bookData += chunk
		})
		apiResponse.on('end', function() {
			let bookInfo = JSON.parse(bookData);
			let bookTitle = bookInfo.volumeInfo.title;
			console.log(bookTitle);
			if(bookTitle === undefined)
			{
				bookTitle = "No book title available"
			}

			let author = bookInfo.volumeInfo.authors[0];
			console.log(author);
			if(author === undefined)
			{
				author = "No author available"
			}

			let publisher = bookInfo.volumeInfo.publisher;
			console.log(publisher);
			if(publisher === undefined)
			{
				publisher = "No publisher available"
			}

			let descrip = bookInfo.volumeInfo.description;
			if(descrip === undefined)
			{
				descrip = "No description available"
			}
			console.log(descrip);

			sqlString = "INSERT or IGNORE INTO userBooks VALUES (?, ?, ?, ?, ?)";
			db.run(sqlString, [bookTitle, author, publisher, descrip, userName]);
			console.log("ADDED SUCCESSFULLY");
			response.writeHead(200, { "Content-Type":"json" })

		})
	}).end()


}
//Handles the request to view the reading list
exports.viewList = function(request,response){
	
	let userName = request.session.username; 
	
	db.all("SELECT bookTitle, author, publisher, descrip, userid FROM userBooks where userid = ?",[userName], function(err, rows){
		response.render('userList.hbs', {title: 'Reading List', bookList: rows});
	})

}
//Uses cookies to verify if login is done
exports.checkSession = function(request,response, next){

	if(request.session.username === undefined && request.session.password === undefined)
	{
		console.log("Unverified");
		response.redirect('login');
	}
	else
	{
		next();
	}
}